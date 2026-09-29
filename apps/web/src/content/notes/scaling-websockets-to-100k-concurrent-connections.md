---
title: "Scaling WebSockets to 100k+ Concurrent Connections"
slug: "scaling-websockets-to-100k-concurrent-connections"
description: "The Problem with Scaling WebSockets When building real time applications, WebSockets provide a powerful way to establish bidirectional communication between..."
tags: ["Laravel","WebSockets","Redis","Load Balancing","Horizontal Scaling"]
published_at: "2026-06-23T09:03:38.674+00:00"
updated_at: "2026-06-23T09:03:39.684813+00:00"
featured: false
cover_image: null
lang: "en"
translation_of: null
draft: false
---
## The Problem with Scaling WebSockets
When building real-time applications, WebSockets provide a powerful way to establish bidirectional communication between the client and server. However, as the user base grows, scaling WebSocket connections to handle 100k+ concurrent users becomes a significant challenge. If not properly addressed, this can lead to poor performance, increased latency, and even application crashes. In a production environment, it's crucial to ensure that your WebSocket infrastructure can handle a large number of concurrent connections without compromising performance.

## Scaling WebSockets
To scale WebSockets to 100k+ concurrent connections, you'll need to implement a combination of technologies and strategies. One key approach is to use Redis Pub/Sub for cross-node broadcasting, allowing you to easily broadcast messages to all connected clients across multiple nodes. Additionally, horizontal scaling of WebSocket servers will enable you to distribute the load across multiple instances, ensuring that no single point of failure exists. Memory optimization and load balancing with sticky sessions are also essential to maintaining performance and ensuring that each client is consistently connected to the same node.

### The Implementation
To implement Redis Pub/Sub for cross-node broadcasting, you can use the following code in your Laravel application:

```php
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Redis;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

class WebSocketServer extends WsServer
{
    public function __construct()
    {
        parent::__construct(new ExampleSocket());
    }
}

class ExampleSocket implements MessageComponentInterface
{
    public function onOpen(ConnectionInterface $conn)
    {
        Redis::publish('new_connection', $conn->resourceId);
    }

    public function onClose(ConnectionInterface $conn)
    {
        Redis::publish('connection_closed', $conn->resourceId);
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        Redis::publish('new_message', $msg);
    }
}
```

To establish a WebSocket connection and send a message to all connected clients, you can use the following code:

```php
use Ratchet\Client\WebSocket;

class WebSocketClient
{
    public function establishConnection()
    {
        $client = new WebSocket('ws://localhost:9000');
        $client->on('message', function ($message) use ($client) {
            echo "Received message: $message\n";
            $client->close();
        });
        $client->on('close', function ($code = null, $reason = null) {
            echo "Connection closed ({$code} - {$reason})\n";
        });
        $client->open();
    }

    public function sendMessage($message)
    {
        $client = new WebSocket('ws://localhost:9000');
        $client->on('open', function () use ($client, $message) {
            $client->send($message);
        });
        $client->open();
    }
}
```

### Horizontal Scaling
For horizontal scaling, you can use a load balancer to distribute incoming connections across multiple WebSocket servers. When using Laravel, you can utilize the built-in load balancing features to route traffic to multiple instances of your application.

```php
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class LoadBalancerController extends Controller
{
    public function handleRequest(Request $request)
    {
        // Route traffic to multiple instances of your application
        // For example, using round-robin or IP hashing
        $instance = $this->getInstance();
        return response()->json(['instance' => $instance]);
    }

    private function getInstance()
    {
        // Implement your load balancing algorithm here
        // For example, using a round-robin or IP hashing approach
        $instances = ['instance1', 'instance2', 'instance3'];
        return $instances[array_rand($instances)];
    }
}
```

### Memory Optimization
To optimize memory usage, you can implement the following strategies:

```php
use Illuminate\Support\Facades\Redis;

class MemoryOptimizer
{
    public function optimizeMemory()
    {
        // Use Redis to store frequently accessed data
        Redis::set('key', 'value');
        // Use Laravel's built-in caching features
        Cache::put('key', 'value');
        // Implement garbage collection to remove unused objects
        gc_collect_cycles();
    }
}
```

## Common Pitfalls
- Not implementing Redis Pub/Sub for cross-node broadcasting, leading to messages not being delivered to all connected clients.
- Not using load balancing with sticky sessions, resulting in clients being disconnected and reconnected to different nodes.
- Not optimizing memory usage, causing performance issues and crashes.
- Not implementing horizontal scaling, leading to a single point of failure and poor performance.

## Key Takeaways
- Use Redis Pub/Sub for cross-node broadcasting to ensure messages are delivered to all connected clients.
- Implement horizontal scaling of WebSocket servers to distribute the load and ensure high availability.
- Optimize memory usage to prevent performance issues and crashes.
- Use load balancing with sticky sessions to maintain consistent connections and prevent disconnections.
