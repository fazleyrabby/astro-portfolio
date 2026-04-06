---
title: "Preventing Duplicate Payments and Transactions in Laravel"
date: 2026-04-03T17:24:25
draft: false
---


## The Nightmare of Double Charges

In e-commerce, few things ruin customer trust faster than charging their credit card twice for a single click. 

As applications scale, preventing duplicate payments becomes an incredibly complex distributed systems problem. Users impatience leads to double-clicking "Checkout", networks latency triggers automated retry loops from payment gateways, and concurrent background workers frequently trip over each other. 

In this case study, I'll walk through exactly how I engineer transaction safety in Laravel to ensure that no matter how many times a payload hits the server simultaneously, a payment is only captured once. 

---

## 1. The Race Condition

Imagine an impatient user double-clicking the "Buy" button. Two HTTP requests fire simultaneously.
By the time Request B checks the database to see if an order exists, Request A is currently talking to Stripe but hasn't saved the successful charge to the database yet. Request B thinks the coast is clear and fires a second charge. The user just paid double.

To prevent this, you cannot rely entirely on checking the database. You must use **Distributed Atomic Locks**.

### The Fix: Cache Atomic Locks

Laravel provides an incredibly powerful `Cache::lock()` mechanism backed by Redis. By locking the user's specific transaction intent, we force overlapping requests into single-file lines.

```php
use Illuminate\Support\Facades\Cache;

public function checkout(Request $request) {
    $idempotencyKey = $request->header('X-Idempotency-Key');
    $lockKey = "checkout:lock:{$idempotencyKey}";

    // Acquire a lock for exactly 10 seconds.
    // If another request holds the lock, block for up to 3 seconds before failing.
    $lock = Cache::lock($lockKey, 10);

    if (! $lock->block(3)) {
        abort(429, 'A transaction is already processing.');
    }

    try {
        return $this->processPayment($request, $idempotencyKey);
    } finally {
        $lock->release(); // Always release the lock when done
    }
}
```

This absolutely guarantees that no two threads can attempt to charge the same idempotency key at the same exact millisecond.

---

## 2. The Database Failsafe

Even with Redis locks, you need an immutable source of truth at the disk layer. If Redis goes down, or if a rogue background job bypasses the controller, the database must reject the duplicate.

I enforce idempotency at the schema layer using strict `UNIQUE` constraints.

```php
Schema::create('payments', function (Blueprint $table) {
    $table->id();
    $table->string('idempotency_key', 64)->unique();
    $table->string('stripe_charge_id');
    // ...
});
```

Inside the application, the payment logic is wrapped tightly in a pessimistic database transaction utilizing `lockForUpdate()`. This locks the specific rows being read so that background webhook jobs trying to update the exact same order are forced to wait.

```php
DB::transaction(function () use ($idempotencyKey, $user) {
    // Pessimistic write lock: blocks other processes from modifying this user's balance
    $wallet = Wallet::where('user_id', $user->id)->lockForUpdate()->first();

    // The unique constraint will throw a QueryException if the key exists
    $payment = Payment::create([
        'idempotency_key' => $idempotencyKey,
        'amount' => 5000
    ]);
    
    // ... process business logic securely
});
```

## Conclusion

Payment safety relies entirely on anticipating race conditions. 

By generating unique Idempotency Keys on the frontend, gating access to the execution thread via **Redis Atomic Locks**, and enforcing state with **Pessimistic Database Transactions** and **UNIQUE keys**, your application becomes bulletproof to double-charges. Building a financial system requires assuming the worst traffic conditions, and strictly locking the pathways to success.