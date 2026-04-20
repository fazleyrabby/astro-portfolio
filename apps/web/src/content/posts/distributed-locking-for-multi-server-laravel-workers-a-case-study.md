---
title: "Distributed Locking for Multi-Server Laravel Workers: A Case Study"
date: 2026-04-06T18:09:11
draft: true
---


## Introduction
As a senior backend engineer, I've encountered numerous challenges when designing distributed systems. One particularly interesting problem is preventing race conditions when multiple horizontal application servers run overlapping scheduled tasks. In this article, I'll share my experience implementing distributed locking for multi-server Laravel workers using Redis-based AtomLock, highlighting key architectural decisions, pitfalls, and takeaways.

## Problem Statement
In a distributed system, multiple servers may execute the same task simultaneously, leading to race conditions and inconsistent results. To mitigate this, we need a distributed locking mechanism that ensures only one server can execute a task at a time. Traditional locking mechanisms, such as database locks or file locks, are not suitable for distributed systems due to their limited scope and potential for deadlocks.

## Architectural Decisions
When designing a distributed locking system, several factors come into play:

* **Locking mechanism**: We chose Redis-based AtomLock due to its high performance, simplicity, and native support for expiration and automatic renewal.
* **Lock expiration**: To prevent locks from being held indefinitely, we implemented a time-to-live (TTL) mechanism, which requires careful consideration to avoid pitfalls.
* **Stale lock cleanup**: In the event of a server crash or lock expiration, we needed a mechanism to cleanup stale locks and prevent resource leaks.

## Solution
Our solution consists of the following components:

### Redis AtomLock
We utilized Redis AtomLock to implement distributed locking. AtomLock provides a simple, high-performance locking mechanism with built-in support for expiration and automatic renewal.

### Lock Implementation
Here's an example implementation of our distributed lock using Redis AtomLock:
```php
use Illuminate\Support\Facades.Redis;

class DistributedLock
{
    private $redis;
    private $lockName;
    private $ttl;

    public function __construct($lockName, $ttl = 300) // 5 minutes
    {
        $this->redis = Redis::connection();
        $this->lockName = $lockName;
        $this->ttl = $ttl;
    }

    public function acquire()
    {
        return $this->redis->command('SET', $this->lockName, 'locked', 'EX', $this->ttl, 'NX');
    }

    public function release()
    {
        return $this->redis->del($this->lockName);
    }
}
```

### Lock Expiration and Renewal
To prevent locks from being held indefinitely, we implemented a TTL mechanism. However, this introduced a new challenge: lock expiration pitfalls. If a server crashes or becomes unresponsive, the lock will expire, allowing another server to acquire the lock and potentially causing a race condition. To mitigate this, we implemented a lock renewal mechanism that periodically renews the lock, ensuring it remains valid for as long as the task is being executed:
```php
class DistributedLock
{
    // ...

    public function renew()
    {
        return $this->redis->expire($this->lockName, $this->ttl);
    }
}
```

### Stale Lock Cleanup
In the event of a server crash or lock expiration, we needed a mechanism to cleanup stale locks and prevent resource leaks. We implemented a periodic task that scans for expired locks and removes them:
```php
class StaleLockCleanup
{
    public function run()
    {
        $locks = Redis::connection()->keys('lock:*');
        foreach ($locks as $lock) {
            if (Redis::connection()->ttl($lock) < 0) {
                Redis::connection()->del($lock);
            }
        }
    }
}
```

## Key Takeaways
Implementing distributed locking for multi-server Laravel workers requires careful consideration of locking mechanisms, lock expiration, and stale lock cleanup. Our solution, utilizing Redis-based AtomLock, provides a high-performance and reliable locking mechanism. Key takeaways include:

* **Choose the right locking mechanism**: Redis AtomLock provides a simple and high-performance locking mechanism with built-in support for expiration and automatic renewal.
* **Implement lock expiration and renewal**: A TTL mechanism is crucial to preventing locks from being held indefinitely, but requires careful consideration to avoid pitfalls.
* **Handle stale lock cleanup**: A periodic task to scan for expired locks and remove them is essential to preventing resource leaks and ensuring system reliability.

By following these guidelines and implementing a distributed locking mechanism, you can ensure the reliability and consistency of your distributed system, even in the presence of overlapping scheduled tasks.