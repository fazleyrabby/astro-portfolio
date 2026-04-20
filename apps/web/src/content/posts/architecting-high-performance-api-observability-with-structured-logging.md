---
title: "Architecting High-Performance API Observability with Structured Logging"
date: 2026-04-09T01:54:38
draft: true
tags: ["Laravel","Logging","Observability"]
---

## Introduction
As a senior backend engineer, I've encountered numerous production failures in distributed Laravel systems. Debugging these issues often becomes a daunting task due to the lack of visibility into the request lifecycle. To tackle this problem, I've implemented a high-performance API observability solution using structured logging, Correlation IDs, and context. This approach enables efficient tracing of requests across queues and seamless integration with monitoring tools like Datadog and ELK.

## Architectural Decisions
When designing this solution, I considered the following key factors:
* **Logging framework**: I chose Monolog as the logging framework due to its flexibility, customizability, and extensive community support.
* **Correlation ID**: I implemented a Correlation ID mechanism to link related log entries and facilitate tracking of requests across multiple services.
* **Context**: I added contextual information to log entries, including user IDs, request IDs, and queue names, to provide a comprehensive understanding of the request lifecycle.
* **Queue tracing**: I developed a custom solution to trace requests across queues, ensuring that log entries are properly correlated and contextualized.

## Solution Overview
The solution consists of three primary components:
1. **Logstage/Monolog customization**: I extended the Logstage and Monolog libraries to support structured logging, Correlation IDs, and contextual information.
2. **Request lifecycle tracing**: I implemented a mechanism to track requests across queues, using the Correlation ID and contextual information to link related log entries.
3. **Datadog/ELK integration**: I integrated the logging solution with Datadog and ELK to provide a unified monitoring and logging platform.

### Logstage/Monolog Customization
To support structured logging, I created a custom Monolog formatter:
```php
use Monolog\Formatter\FormatterInterface;
use Monolog\Logger;

class StructuredLoggerFormatter implements FormatterInterface
{
    public function format(array $record): string
    {
        $corrId = $record['extra']['corr_id'];
        $ctx = $record['extra']['ctx'];
        $message = sprintf(
            '[%s] [%s] [%s] %s',
            $corrId,
            $ctx['user_id'],
            $ctx['request_id'],
            $record['message']
        );
        return $message;
    }
}
```
I then registered the custom formatter in the Logstage configuration:
```php
use Logstage\Logstage;

$logstage = new Logstage();
$logstage->setFormatter(new StructuredLoggerFormatter());
```
### Request Lifecycle Tracing
To trace requests across queues, I developed a custom middleware that injects the Correlation ID and contextual information into the request:
```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;

class RequestTracerMiddleware
{
    public function handle(Request $request, \Closure $next)
    {
        $corrId = Str::uuid()->toString();
        $ctx = [
            'user_id' => auth()->id(),
            'request_id' => $request->getId(),
            'queue_name' => Queue::getConnection()->getName(),
        ];
        $request->headers->set('X-Correlation-Id', $corrId);
        $request->headers->set('X-Context', json_encode($ctx));
        return $next($request);
    }
}
```
I then registered the middleware in the Laravel pipeline:
```php
use Illuminate\Support\Facades\Route;

Route::middleware(RequestTracerMiddleware::class);
```
### Datadog/ELK Integration
To integrate the logging solution with Datadog and ELK, I configured the Monolog handlers to forward log entries to these platforms:
```php
use Monolog\Handler\DatadogHandler;
use Monolog\Handler\ElasticsearchHandler;

$datadogHandler = new DatadogHandler('my-api');
$elkHandler = new ElasticsearchHandler('my-elk-index');

$logstage->pushHandler($datadogHandler);
$logstage->pushHandler($elkHandler);
```
## Key Takeaways
The implemented solution provides the following benefits:
* **Improved visibility**: Structured logging and Correlation IDs enable efficient tracking of requests across queues.
* **Enhanced debugging**: Contextual information and request lifecycle tracing facilitate rapid identification of production issues.
* **Unified monitoring**: Integration with Datadog and ELK provides a centralized platform for logging and monitoring.
By applying these architectural decisions and solution components, developers can create a high-performance API observability solution that streamlines debugging and monitoring in distributed Laravel systems.