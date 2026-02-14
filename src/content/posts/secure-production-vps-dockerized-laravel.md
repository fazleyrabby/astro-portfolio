---
title: "How I Set Up a Secure Production VPS for a Dockerized Laravel App"
date: 2025-01-31
description: "A guide on setting up a secure production VPS for a Dockerized Laravel app"
---

> [!tip] 💡
> This article documents how I deploy Laravel applications securely on a VPS using Docker, Cloudflare Tunnel, and SSH hardening — following real-world production practices.

**Tech stack:** Laravel · Docker · Nginx · MariaDB · Ubuntu Server · Cloudflare Tunnel

**Category:** DevOps · Backend · VPS Security

**Level:** Intermediate → Advanced

---

## Why I Built This Laravel VPS Setup

Deploying a Laravel application to a VPS is easy. Deploying it **securely and correctly** is where most setups fail.

I built this VPS configuration to follow **real-world production practices**, focusing on:

- Minimal attack surface
- Docker-first architecture
- Secure database access
- Clean, observable logging
- No exposed infrastructure ports

This is the same approach I would use for a serious personal project or a small production system.

---

## Core Design Principles

- ❌ No public MySQL / MariaDB ports
- ❌ No direct Nginx exposure
- ❌ No password-based SSH
- ✅ SSH key-only authentication
- ✅ Dockerized Laravel services
- ✅ Cloudflare Tunnel for HTTPS access
- ✅ Logs written to stdout/stderr (cloud-native)

---

## VPS Base Configuration

**Operating system:** Ubuntu Server 22.04+

**User model:** Non-root `deploy` user with sudo

**Firewall:** UFW with minimal rules

### Create deploy user

```bash
adduser deploy
usermod -aG sudo deploy

```

### Secure SSH configuration

```plain text
PermitRootLogin no
PasswordAuthentication no

```

This significantly reduces brute-force and privilege escalation risks.

---

# Using Docker for Laravel Deployment on a VPS

Docker is the foundation of the system. All services run inside containers:

- Laravel (PHP-FPM)
- Nginx
- MariaDB
- Optional observability tools

```bash
curl -fsSL <https://get.docker.com> | sudo sh
sudo usermod -aG docker deploy
```

### Why Docker?

- Consistent environments
- Easy rebuilds
- No dependency pollution on the host
- Portable across VPS providers

---

## Project Structure

```plain text
/var/www/app
├── docker-compose.yml
├── Dockerfile
├── .env
├── app/
├── public/
└── storage/

```

This layout keeps everything contained, auditable, and easy to back up or migrate.

---

## Dockerized Laravel (PHP-FPM)

Key decisions:

- PHP 8.2
- Minimal required extensions
- Non-root container user
- Logs sent to **stderr**

```plain text
LOG_CHANNEL=stderr
LOG_LEVEL=debug
```

This ensures Laravel logs are Docker-friendly and production-correct.

---

## Nginx Configuration (Private by Default)

Nginx is bound to localhost only:

```yaml
ports:
  - "127.0.0.1:80:80"
```

Benefits:

- No public web server ports
- Reduced attack surface
- Access only via Cloudflare Tunnel

---

## Secure MariaDB Setup

The database runs inside Docker and is bound to localhost only:

```yaml
ports:
  - "127.0.0.1:3306:3306"

```

Security benefits:

- Database accessible only from the VPS
- Safe for SSH tunneling
- Zero public exposure

---

## Secure Database Access with DBeaver

Administrative database access is handled through an SSH tunnel:

```bash
ssh -N -L 3307:127.0.0.1:3306 deploy@VPS_IP

```

DBeaver connects to:

- Host: `127.0.0.1`
- Port: `3307`

This allows full GUI access without exposing the database.

---

## Cloudflare Tunnel for Public Access

Instead of opening ports 80 or 443, the application is exposed using **Cloudflare Tunnel**.

```yaml
ingress:
  - hostname: app.example.com
    service: <http://localhost:80>
```

### Benefits

- No public IP exposure
- Automatic HTTPS
- Built-in DDoS protection
- Zero-trust friendly

---

## Laravel Logging Strategy

### Default (Recommended)

- Laravel logs → stderr
- Docker captures logs
- Inspect with:

```bash
docker logs laravel-app
```

### Optional Upgrade

- Grafana + Loki
- Centralized log search
- Error dashboards
- Alerting

Centralized logging is optional and can be added later if needed.

---

## Grafana Security (Optional)

If observability tools are enabled:

- User registration disabled
- Anonymous access disabled
- Routed only through Cloudflare Tunnel

This keeps internal tools private.

---

## Final Security Checklist

- ✔ No public database ports
- ✔ No public web ports
- ✔ SSH key-only access
- ✔ Root login disabled
- ✔ Docker-native logging
- ✔ Cloudflare Tunnel enabled

---

## Final Thoughts

This Laravel VPS setup prioritizes **security, simplicity, and realism**.

It avoids unnecessary complexity while still following:

- Modern DevOps practices
- Docker-native deployment patterns
- Zero-trust networking principles

It’s a setup I would confidently run in production and reuse for future projects.

---

> [!tip] 💡
> 💼 What this project demonstrates:
• Secure VPS configuration
• Docker-based Laravel deployment
• Cloudflare Tunnel usage
• Production-grade logging practices
• Real-world DevOps decision making
