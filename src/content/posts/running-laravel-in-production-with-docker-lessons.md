---
title: "Running Laravel in Production with Docker: Lessons Learned"
date: 2026-03-30T14:00:00
draft: false
---


## The Reality of Dockerizing PHP

Running Laravel on local using Docker (via Laravel Sail or custom containers) is a beautifully smooth experience. Running it in a highly available production environment is a completely different beast. 

When engineers first transition to deploying Dockerized PHP applications, they treat the container like a VPS. This mindset leads to massive image sizes, memory leaks, and agonizingly slow deployment times.

Here are the critical architectural lessons I've learned from running Laravel Docker containers in production.

---

## 1. Multi-Stage Builds & OPcache

A production PHP container should not contain Node.js, NPM, or Composer dev dependencies. Every megabyte you push to your container registry increases scale-out time during auto-scaling procedures.

To solve this, you must use **Multi-Stage Builds**.

In this pattern, we use an initial container to install dependencies and compile frontend assets, and a final ultra-thin container that only copies the raw compiled artifacts.

Furthermore, we must hardcode `OPcache` for maximum throughput.

```dockerfile
# Stage 1: Build Dependencies
FROM composer:2.6 as vendor
WORKDIR /app
COPY composer.json composer.lock ./
# Ignore dev dependencies and optimize autoloader natively
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Stage 2: Production PHP FPM
FROM php:8.3-fpm-alpine
WORKDIR /var/www/html

# Install required PHP extensions (pdo, redis, etc.)
RUN docker-php-ext-install pdo_mysql opcache

# Copy optimized vendor from the previous stage
COPY --from=vendor /app/vendor/ /var/www/html/vendor/
COPY . .

# Force OPcache to cache everything forever, never polling for changes
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
 && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini

# Cache configuration natively for Laravel
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache
```

By explicitly turning off `opcache.validate_timestamps`, PHP will never check the disk to see if a file was updated. The code is loaded into RAM permanently until the container is destroyed, vastly reducing disk I/O.

---

## 2. Managing Background Workers (The Supervisor Dilemma)

Laravel relies heavily on queues and scheduled tasks. However, Docker’s primary philosophy is **one process per container**.

If you try to run `php-fpm` (for web traffic) and `php artisan queue:work` inside the exact same container, you violate this principle. If the queue worker crashes, the container orchestration system won't know because the web process is still technically alive.

### The Fix: Process Isolation

Instead of relying on `supervisord` to run multiple things inside one container, I deploy the exact same Docker image three times within `docker-compose` or Kubernetes, overriding the `command` constraint.

```yml
# docker-compose.prod.yml
services:
  web:
    image: my-laravel-app:latest
    command: php-fpm
    ports:
      - "9000:9000"

  worker:
    image: my-laravel-app:latest
    command: php artisan queue:work redis --sleep=3 --tries=3

  scheduler:
    image: my-laravel-app:latest
    command: crond -f -l 8
```

This ensures complete topological isolation. If your workers run out of memory processing a massive PDF job, that container dies and restarts independently, without dropping a single active web request.

---

## Conclusion

Dockerizing Laravel for production isn't just about wrapping your application in a `.yml` file. It's about optimizing PHP for read-only environments, brutally isolating background jobs, and compiling away disk I/O bottlenecks.

Once you stop treating your containers like miniature servers and start treating them as immutable, single-purpose execution environments, Laravel scales beautifully.