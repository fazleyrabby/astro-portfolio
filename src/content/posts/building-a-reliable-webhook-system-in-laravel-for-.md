---
title: "Building a Reliable Webhook System in Laravel for Third-Party Integrations"
date: 2026-03-30T18:00:00
draft: false
---


## The Problem with Naive Webhook Handling

When integrating with third-party services like Stripe, GitHub, or Twilio, your application relies on webhooks to receive real-time events. However, most developers build webhooks the same way they build standard REST endpoints: receiving the data, running the business logic, and returning a `200 OK`.

In production, this approach is a ticking time bomb.

If your database locks up, or if your business logic takes 15 seconds to execute, the third-party service will assume the webhook failed. It will retry. Now you have duplicate processing, race conditions, and potentially duplicate payments.

Here is the exact architecture I use to process millions of webhooks in Laravel safely.

---

## 1. Defeating Timing Attacks

When a webhook hits your server, your first job is to prove it actually came from the third-party provider securely calculating an HMAC signature.

A massive mistake developers make when comparing HMAC signatures is using standard equality operators (`==` or `===`). This leaves your server vulnerable to **timing attacks**, where an attacker can guess the signature character-by-character based on how many nanoseconds the CPU takes to return `false`.

In Laravel, always use `hash_equals()` for constant-time string comparison.

```php
private function validateSignature(Request $request): bool
{
    $signature = $request->header('X-Stripe-Signature');
    $secret = config('services.stripe.webhook_secret');
    
    $expected = hash_hmac('sha256', $request->getContent(), $secret);

    // Constant-time execution prevents timing attacks
    return hash_equals($expected, $signature);
}
```

## 2. Ingest First, Process Later

The golden rule of webhooks is: **Acknowledge immediately, process asynchronously.**

The controller's only job is to validate the signature, save the raw payload to the database, and dispatch a queue worker. Webhooks should return a `202 Accepted` within 50 milliseconds.

```php
public function handle(Request $request)
{
    abort_if(! $this->validateSignature($request), 401);

    // Save the raw payload immediately
    $log = WebhookLog::create([
        'provider'   => 'stripe',
        'event_id'   => $request->input('id'),
        'event_type' => $request->input('type'),
        'payload'    => $request->all(),
    ]);

    // Dispatch a dedicated worker
    ProcessStripeWebhook::dispatch($log);

    return response()->json(['status' => 'acknowledged'], 202);
}
```

By saving the raw payload to a `webhook_logs` table first, we gain an immutable audit trail. If our business logic contains a bug and the job fails, we haven't lost the data. We can simply replay the queue later.

## 3. Designing for Idempotency

Because networks are inherently unreliable, third-party providers guarantee "at-least-once" delivery. This means you **will** receive the exact same webhook twice eventually. 

Your queue jobs must be **idempotent**, meaning they can run 100 times but only apply the business logic once.

```php
public function handle()
{
    // DB transaction with a pessimistic lock
    DB::transaction(function () {
        $log = WebhookLog::where('id', $this->webhookLog->id)
            ->lockForUpdate()
            ->first();

        // 1. Idempotency Check
        if ($log->processed_at !== null) {
            return; // Already processed
        }

        // 2. Execute Business Logic here...
        
        // 3. Mark as processed
        $log->update(['processed_at' => now()]);
    });
}
```

## Conclusion

Building a reliable webhook system isn't about handling success; it's about anticipating failure.

By using constant-time signature validation, shifting the workload entirely to background queues, and implementing strict idempotency checks, you can guarantee that your Laravel application will effortlessly absorb massive webhook traffic spikes without dropping a single event.