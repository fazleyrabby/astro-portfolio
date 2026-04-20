---
title: "Why most Laravel APIs break at scale and how I fix them in production"
date: 2026-03-30T10:00:00
draft: false
---


## The Silent Killers of Laravel APIs

As a backend engineer, I've watched plenty of well-architected Laravel APIs crash and burn the moment they hit real traffic. In development, everything is fast. Ten records in a database respond in milliseconds. But what happens when that table hits 10 million rows, and you have 5,000 concurrent users?

When a Laravel API breaks at scale, it almost never happens at the framework level. It happens at the data extraction layer.

Here are the two primary reasons Laravel APIs fail at scale, and the exact production fixes I use to keep them alive.

---

## 1. The N+1 Query Death Spiral

The most common killer of any Object-Relational Mapper (ORM) is the N+1 query problem. In Laravel, it's incredibly easy to accidentally trigger hundreds of queries when serializing a single API response.

If you return a collection of `Orders` and each order needs to append the `User` data using an accessor or an API resource without eager loading, Laravel will query the `users` table for *every single order*.

### The Fix: Strict Evaluation & Query Tracing

In production, you cannot rely on "remembering" to use `->with()`. You need to force the framework to fail loudly during development.

Since Laravel 8+, I completely disable lazy loading in local and testing environments. If an engineer forgets to eager load a relation, the application throws a fatal exception.

```php
// AppServiceProvider.php
use Illuminate\Database\Eloquent\Model;

public function boot()
{
    // Throws a strict exception if lazy loading is attempted
    Model::preventLazyLoading(! app()->isProduction());
    
    // Warns if a query takes longer than 500ms
    DB::handleExceedingCumulativeQueryDuration();
}
```

By enforcing this at the provider level, N+1 queries mathematically cannot make it to production.

---

## 2. Offset Pagination Memory Leaks

When retrieving data from massive tables, developers instinctively reach for Laravel's standard `$query->paginate(50)`. 

Under the hood, this uses an `OFFSET`. When a user requests page 10,000, the database still has to scan and discard the first 499,950 records. This violently spikes CPU usage and RAM, locking up the database connection pool.

Furthermore, standard pagination runs a `SELECT COUNT(*)` query to calculate the total number of pages. On a massive InnoDB table, a raw count is notoriously slow.

### The Fix: Cursor Pagination

For high-volume APIs (like infinite scrolling feeds or mass data exports), I completely abandon offset pagination and switch to **Cursor Pagination**.

Cursor pagination uses a `WHERE` clause based on the last seen ID or timestamp, rather than an `OFFSET`.

```php
// ❌ Dangerous at scale: Scans 500k rows before returning 50.
$transactions = Transaction::latest()->paginate(50);

// ✅ Production ready: Jumps instantly via Primary Key Index.
$transactions = Transaction::orderByDesc('id')->cursorPaginate(50);
```

Because cursor pagination relies strictly on the database index, retrieving the 1,000,000th page is exactly as fast as retrieving the 1st page.

---

## Conclusion

Frameworks don't crash at scale; bad queries do. 

By strictly disabling lazy loading, utilizing `cursorPaginate` for heavy tables, and avoiding generic "cache everything" band-aids, your Laravel APIs will consume a fraction of the memory and scale horizontally without breaking a sweat.