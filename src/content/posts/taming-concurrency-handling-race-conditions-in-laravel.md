---
title: "Taming Concurrency: Handling Race Conditions in Laravel"
date: 2026-03-31T10:00:00
draft: false
---


## The Invisible Danger of Concurrent Requests

In standard web development, we construct features linearly: check if X exists, subtract Y, save X. 

But when you scale beyond a single web server, this linear thinking breaks horribly. If two different people click "Buy" at the exact same millisecond on a product with exactly `1` item remaining in inventory, PHP will process both requests parallelly. Both requests will check the database, both will see `1` item remaining, both will subtract `1`, and both will successfully save.

Your database now reads `-1` inventory, and you have sold a product you do not own.

To tame concurrency in Laravel, we have to look past the application layer and implement strict database and cache locks.

---

## 1. Pessimistic Locking (lockForUpdate)

The absolute most reliable way to prevent two PHP threads from modifying the same record simultaneously is utilizing InnoDB's row-level locks.

In Laravel, attaching `->lockForUpdate()` to a query inside a transaction tells the database: *"Do not let any other connection read or write this specific row until my transaction closes."*

```php
use Illuminate\Support\Facades\DB;

public function checkout(int $productId)
{
    // A transaction is REQUIRED for lockForUpdate to work
    DB::transaction(function () use ($productId) {
    
        // Thread B will pause exactly here and wait for Thread A to finish
        $product = Product::where('id', $productId)->lockForUpdate()->first();

        abort_if($product->stock <= 0, 400, 'Out of stock!');

        $product->decrement('stock');
        
        // Transaction closes here, automatically releasing the SQL lock
    });
}
```

If Thread B attempts to select the product while Thread A is running, Thread B is literally paused by MySQL. It waits until Thread A commits, then reads the *newly updated* stock of `0`, instantly failing the `abort_if`.

### The Deadlock Threat
While pessimistic locking works flawlessly for simple writes, it can trigger **Deadlocks** if you lock multiple rows in different orders. For example, if Thread A locks User and then Product, while Thread B locks Product and then User, they will infinitely wait for each other, crashing the database connection. 

To prevent this, always lock related database rows in alphabetical order of their table names.

## 2. Distributed Application Locking (Atomic Locks)

For operations that don't involve database writes—like preventing a background worker from hitting a rate-limited API twice, or stopping duplicate file generation—you cannot use database locks. 

Instead, you use Distributed Cache Locks via Redis.

```php
use Illuminate\Support\Facades\Cache;

public function generateMonthlyReport()
{
    // Obtain a lock for this specific month for 60 seconds
    $lockKey = 'report_generation:' . now()->format('Y-m');
    
    $lock = Cache::lock($lockKey, 60);

    // If another worker holds the lock, fail immediately without waiting
    if (! $lock->get()) {
        return; 
    }

    try {
        // ... Generate massive PDF report safely
    } finally {
        $lock->release(); // Release immediately when done
    }
}
```

Atomic locks ensure that no matter how many queue workers or web servers boot up simultaneously, only one single thread can execute the protected code block globally across your entire infrastructure.

## Conclusion

Concurrency bugs are the hardest to track down because they are completely invisible in local testing. 

By treating every critical read-write operation as if 100 people are executing it simultaneously, and proactively wielding `lockForUpdate` and `Cache::lock`, you bridge the gap between "code that works" and "code that scales reliably."
