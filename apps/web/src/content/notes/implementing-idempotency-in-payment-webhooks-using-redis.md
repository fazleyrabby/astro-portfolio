---
title: "Implementing Idempotency in Payment Webhooks using Redis"
slug: "implementing-idempotency-in-payment-webhooks-using-redis"
description: "The Problem with Payment Webhooks When dealing with payment webhooks, ensuring that each webhook is processed exactly once is crucial. Duplicate processing..."
tags: ["Laravel","Redis","Idempotency","Webhooks"]
published_at: "2026-06-06T10:01:54.966+00:00"
updated_at: "2026-06-06T10:01:55.073428+00:00"
featured: false
cover_image: null
lang: "en"
translation_of: null
draft: false
---
## The Problem with Payment Webhooks

When dealing with payment webhooks, ensuring that each webhook is processed exactly once is crucial. Duplicate processing can lead to incorrect financial records, overcharging customers, or even security vulnerabilities. In production, this can be a nightmare to debug and resolve, especially when dealing with high-volume transactions. Therefore, implementing idempotency in payment webhooks is essential to guarantee the integrity of your system.

## Implementing Idempotency

To achieve idempotency in payment webhooks, we'll use a combination of Redis locks and idempotency keys. The idea is to generate a unique key for each webhook event and store it in Redis with a short expiration time. Before processing a webhook, we check if the key exists in Redis. If it does, we skip processing; if not, we create the key and process the webhook. This approach guarantees that each webhook is processed at most once.

### The Implementation

We'll use Laravel's built-in support for Redis and queueing system to implement idempotency. First, let's create a job that will process the webhook:
```php
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Queue;
use App\Jobs\ProcessWebhookJob;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        $idempotencyKey = $request->header('Idempotency-Key');
        $redisKey = "webhook:$idempotencyKey";

        if (Redis::exists($redisKey)) {
            return response()->json(["status" => "already processed"], 200);
        }

        Redis::setex($redisKey, 300, 'processing'); // 5 minutes expiration

        Queue::dispatch(new ProcessWebhookJob($request->all()));

        return response()->json(["status" => "received"], 202);
    }
}
```

In the `ProcessWebhookJob` class, we'll check if the Redis key still exists before processing the webhook. If it's gone (e.g., due to expiration), we'll recreate it and proceed with processing:
```php
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class ProcessWebhookJob implements ShouldQueue
{
    private $webhookData;

    public function __construct(array $webhookData)
    {
        $this->webhookData = $webhookData;
    }

    public function handle()
    {
        $idempotencyKey = $this->webhookData['idempotency_key'];
        $redisKey = "webhook:$idempotencyKey";

        if (!Redis::exists($redisKey)) {
            Redis::setex($redisKey, 300, 'processing'); // recreate key if gone
        }

        // process the webhook
        Log::info('Processing webhook with idempotency key ' . $idempotencyKey);
        // ...
    }
}
```

## Common Pitfalls

- Not using a short enough expiration time for the Redis key, leading to delayed processing of webhooks.
- Not handling the case where the Redis key is missing or has expired, resulting in duplicate processing.
- Not using a reliable queueing system, which can lead to lost or duplicated jobs.

## Key Takeaways

- Use a unique idempotency key for each webhook event to prevent duplicate processing.
- Implement a Redis-based locking mechanism to ensure that each webhook is processed at most once.
- Use a reliable queueing system to handle webhook processing and ensure that jobs are not lost or duplicated.
- Always handle the case where the Redis key is missing or has expired to prevent duplicate processing.
