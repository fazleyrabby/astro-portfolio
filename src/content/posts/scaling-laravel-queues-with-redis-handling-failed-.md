---
title: "Scaling Laravel Queues with Redis: Handling Failed Jobs in Production"
date: 2026-03-30
draft: true
---


## Introduction
As a backend engineer working with Laravel in production, I've encountered my fair share of challenges when it comes to queue scaling. One of the most critical aspects of queue management is handling failed jobs. In this post, I'll share my experience with using Redis as a queue driver and provide practical examples of how to scale your Laravel queues while handling failed jobs.

## The Problem
In our production environment, we're using Redis as our queue driver. While Redis provides excellent performance, we've noticed that failed jobs can quickly accumulate and cause issues with our queue processing. When a job fails, it's automatically retried a certain number of times before being marked as failed. However, if the failure is due to a persistent issue, such as a database connection problem, the job will continue to fail and consume system resources.

## The Solution
To address this issue, we've implemented a combination of queue configuration tweaks and custom job handling. We've increased the retry limit for certain job types, while also implementing a custom `FailedJobProvider` to handle failed jobs more efficiently.

## Code Example
Here's an example of how we've configured our queue to handle failed jobs:
```php
// config/queue.php
'redis' => [
    'driver' => 'redis',
    'connection' => 'default',
    'queue' => 'default',
    'retry_after' => 90, // 1.5 minutes
    'failed' => [
        'driver' => 'redis',
        'database' => env('REDIS_DB_FAILED', 1),
        'table' => 'failed_jobs',
        'timeout' => 86400, // 1 day
    ],
],
```
We've also created a custom `FailedJobProvider` to handle failed jobs:
```php
// app/Providers/FailedJobProvider.php
namespace App\Providers;

use Illuminate\Queue\Failed\FailedJobProvider;

class CustomFailedJobProvider extends FailedJobProvider
{
    public function log($connection, $queue, $payload, $exception)
    {
        // Custom logging logic here
        // For example, send a notification to the development team
    }
}
```
Finally, we've updated our `queue` configuration to use the custom `FailedJobProvider`:
```php
// config/queue.php
'failed' => [
    'driver' => 'custom',
    'provider' => \App\Providers\CustomFailedJobProvider::class,
],
```
## Conclusion
By implementing a custom `FailedJobProvider` and tweaking our queue configuration, we've significantly improved our ability to handle failed jobs in production. With Redis as our queue driver, we're able to efficiently process large volumes of jobs while minimizing the impact of failed jobs on our system resources. I hope this example helps you tackle similar challenges in your own Laravel applications.