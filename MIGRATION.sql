-- Supabase Migration SQL
-- Run this in your Supabase SQL Editor

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Architecting High-Performance API Observability with Structured Logging',
  'architecting-high-performance-api-observability-with-structured-logging',
  '',
  '## Introduction
As a senior backend engineer, I''ve encountered numerous production failures in distributed Laravel systems. Debugging these issues often becomes a daunting task due to the lack of visibility into the request lifecycle. To tackle this problem, I''ve implemented a high-performance API observability solution using structured logging, Correlation IDs, and context. This approach enables efficient tracing of requests across queues and seamless integration with monitoring tools like Datadog and ELK.

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
        $corrId = $record[''extra''][''corr_id''];
        $ctx = $record[''extra''][''ctx''];
        $message = sprintf(
            ''[%s] [%s] [%s] %s'',
            $corrId,
            $ctx[''user_id''],
            $ctx[''request_id''],
            $record[''message'']
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
            ''user_id'' => auth()->id(),
            ''request_id'' => $request->getId(),
            ''queue_name'' => Queue::getConnection()->getName(),
        ];
        $request->headers->set(''X-Correlation-Id'', $corrId);
        $request->headers->set(''X-Context'', json_encode($ctx));
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

$datadogHandler = new DatadogHandler(''my-api'');
$elkHandler = new ElasticsearchHandler(''my-elk-index'');

$logstage->pushHandler($datadogHandler);
$logstage->pushHandler($elkHandler);
```
## Key Takeaways
The implemented solution provides the following benefits:
* **Improved visibility**: Structured logging and Correlation IDs enable efficient tracking of requests across queues.
* **Enhanced debugging**: Contextual information and request lifecycle tracing facilitate rapid identification of production issues.
* **Unified monitoring**: Integration with Datadog and ELK provides a centralized platform for logging and monitoring.
By applying these architectural decisions and solution components, developers can create a high-performance API observability solution that streamlines debugging and monitoring in distributed Laravel systems.',
  ARRAY['Laravel','Logging','Observability']::text[],
  '',
  'draft',
  NULL
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Architecting Multi-Tenant SaaS: Database-per-Tenant vs. Single-DB Isolation',
  'architecting-multi-tenant-saas-database-per-tenant-vs-single-db-isolation',
  '',
  '## Introduction to Multi-Tenant SaaS Architecture
As a senior backend engineer, I''ve encountered numerous scaling challenges while designing multi-tenant SaaS platforms. One critical decision that can make or break the scalability of such platforms is the choice between a database-per-tenant and single-DB isolation approach. In this article, I''ll delve into the trade-offs of these strategies, explore the intricacies of handling cross-tenant migrations, and discuss reporting across isolated databases.

## Architectural Decisions: Database-per-Tenant vs. Single-DB Isolation
When it comes to multi-tenant SaaS, two primary architectural patterns emerge:
* **Database-per-tenant**: Each tenant has a dedicated database, ensuring complete isolation and data segregation.
* **Single-DB isolation**: All tenants share a single database, relying on schema or table-level isolation to separate tenant data.

### Database-per-Tenant
The database-per-tenant approach offers superior security and isolation but introduces complexity in managing multiple databases. This approach is particularly suitable for platforms with stringent data security and compliance requirements.

### Single-DB Isolation
In contrast, the single-DB isolation approach simplifies database management but may compromise on security and isolation. This method is often chosen for platforms with less stringent security requirements and a large number of small tenants.

## Solution: Hybrid Approach
After careful consideration, our team opted for a hybrid approach, combining the benefits of both strategies. We implemented a database-per-tenant model for large, security-conscious clients and a single-DB isolation approach for smaller tenants.

### Handling Cross-Tenant Migrations
To handle cross-tenant migrations, we utilized a combination of Laravel''s built-in migration tools and custom scripts. The following code snippet demonstrates how we managed cross-tenant migrations using Laravel:
```php
// tenants_migration.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTenantTables extends Migration
{
    public function up()
    {
        // Create tables for each tenant
        foreach (Tenant::all() as $tenant) {
            $tenant->createDatabase();
            // Run tenant-specific migrations
            $this->runMigrations($tenant);
        }
    }

    public function down()
    {
        // Drop tables for each tenant
        foreach (Tenant::all() as $tenant) {
            $tenant->dropDatabase();
        }
    }

    private function runMigrations(Tenant $tenant)
    {
        // Run migrations specific to the tenant
        $migrations = [
            // Migration classes for the tenant
        ];
        foreach ($migrations as $migration) {
            (new $migration)->up();
        }
    }
}
```

### Reporting Across Isolated Databases
To facilitate reporting across isolated databases, we developed a data warehousing solution using Node.js and a messaging queue (RabbitMQ). The following code snippet demonstrates how we handled report generation:
```javascript
// report_generator.js

const amqp = require(''amqplib'');
const mysql = require(''mysql'');

// Connect to RabbitMQ
amqp.connect(''amqp://localhost'', (err, conn) => {
    if (err) {
        console.error(err);
        return;
    }
    // Create a channel
    conn.createChannel((err, ch) => {
        if (err) {
            console.error(err);
            return;
        }
        // Consume report generation requests
        ch.consume(''report_queue'', (msg) => {
            if (msg !== null) {
                const reportData = msg.content.toString();
                // Generate report data from isolated databases
                const report = generateReport(reportData);
                // Send report to the requester
                ch.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(report)));
                ch.ack(msg);
            }
        });
    });
});

// Generate report data from isolated databases
function generateReport(reportData) {
    // Connect to each tenant database
    const tenantDbs = [];
    reportData.tenants.forEach((tenant) => {
        const db = mysql.createConnection({
            host: tenant.host,
            user: tenant.user,
            password: tenant.password,
            database: tenant.database,
        });
        tenantDbs.push(db);
    });
    // Retrieve report data from each database
    const report = [];
    tenantDbs.forEach((db) => {
        db.query(''SELECT * FROM reports'', (err, results) => {
            if (err) {
                console.error(err);
                return;
            }
            report.push(...results);
        });
    });
    return report;
}
```

## Key Takeaways
In conclusion, architecting a multi-tenant SaaS platform requires careful consideration of the trade-offs between database-per-tenant and single-DB isolation approaches. By adopting a hybrid approach and leveraging tools like Laravel and Node.js, we can create a scalable and secure platform that meets the diverse needs of our clients. The key takeaways from our experience are:
* **Database-per-tenant** offers superior security and isolation but introduces complexity in managing multiple databases.
* **Single-DB isolation** simplifies database management but may compromise on security and isolation.
* A **hybrid approach** can combine the benefits of both strategies, allowing for flexibility and scalability.
* **Cross-tenant migrations** require careful planning and execution, utilizing tools like Laravel''s migration framework.
* **Reporting across isolated databases** can be facilitated through data warehousing solutions and messaging queues like RabbitMQ.',
  ARRAY['Laravel','Node.js','SaaS Scaling']::text[],
  '',
  'published',
  '2026-04-19T02:13:00'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Best Free AI Models in 2026 (Tested for Coding & Real Use)',
  'best-free-ai-models-for-coding-developers-2026',
  '',
  '## Introduction

Free AI models have improved dramatically in 2026. You can now build real workflows using platforms like OpenRouter and Groq without paying for API usage.

I''ve been testing these models in actual backend workflows — coding, automation, and agent-based tasks. This list is based on real usage across production projects, not synthetic benchmarks. If you''re interested in the tools and setup I use, check out my [uses page](/uses).

---

## S Tier — Best Free AI Models (Production Ready)

These models are reliable enough to use in real projects without second-guessing the output.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
<div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
<h4 style="margin: 0 0 0.5rem;">NVIDIA Nemotron 3 Super</h4>

Strong balance of reasoning, coding, and speed. Consistent output across backend and agent workflows.

**Best for:** APIs, backend systems, daily development
</div>
<div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
<h4 style="margin: 0 0 0.5rem;">Step 3.5 Flash</h4>

Stable and predictable outputs. Handles structured and multi-step tasks without drifting.

**Best for:** pipelines, automation, structured outputs
</div>
<div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
<h4 style="margin: 0 0 0.5rem;">Qwen3 Coder 480B A35B</h4>

Excellent coding with repo-level context understanding. MoE architecture keeps inference efficient. Free via OpenRouter.

**Best for:** large projects, code generation, refactoring
</div>
</div>

> **Note on Qwen 3.6 Plus:** While Qwen 3.6 Plus is an excellent model with ~1M token context and strong reasoning, it is **not free** — it''s a paid commercial API (~$0.28/1M input tokens via Alibaba Cloud). It didn''t make this list, but it''s worth considering if you have budget for a premium reasoning model.

---

## Real Performance Comparison

Measurable differences based on official benchmarks, technical reports, and independent evaluations — not vibes.

### Performance Overview

| Model | Coding (SWE-Bench) | Long Context (RULER) | Context Window | Speed |
|-------|-------------------|---------------------|----------------|-------|
| **Nemotron 3 Super** | 60.47% | 91.75% | 1M tokens | Fast |
| **Qwen 3.5** | 66.40% | 91.33% | ~256K tokens | Slow |
| **GPT-OSS 120B** | 41.90% | 22.30% | 256K tokens | Medium |

*Note: SWE-Bench scores may vary depending on the evaluation harness and agent setup, so cross-model comparisons should be taken directionally.*

### Benchmark Reality

No single model dominates all benchmarks.

- Qwen leads in coding accuracy (SWE-Bench)
- Nemotron leads in throughput and long-context tasks
- Real-world performance depends on the workflow, not just the model

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 1.5rem 0;">
<div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
<h4 style="margin: 0 0 0.75rem;">⚡ Speed (Throughput)</h4>
<div style="margin-bottom: 0.5rem;">
<div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;"><span>Nemotron 3 Super</span><span style="opacity: 0.6;">Fastest</span></div>
<div style="background: var(--border); border-radius: 4px; height: 8px;"><div style="background: #22c55e; width: 95%; height: 100%; border-radius: 4px;"></div></div>
</div>
<div style="margin-bottom: 0.5rem;">
<div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;"><span>GPT-OSS 120B</span><span style="opacity: 0.6;">Moderate</span></div>
<div style="background: var(--border); border-radius: 4px; height: 8px;"><div style="background: #eab308; width: 60%; height: 100%; border-radius: 4px;"></div></div>
</div>
<div>
<div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;"><span>Qwen 3.5</span><span style="opacity: 0.6;">Slow</span></div>
<div style="background: var(--border); border-radius: 4px; height: 8px;"><div style="background: #ef4444; width: 25%; height: 100%; border-radius: 4px;"></div></div>
</div>
</div>
<div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
<h4 style="margin: 0 0 0.75rem;">🧠 Coding Accuracy (SWE-Bench)</h4>
<div style="margin-bottom: 0.5rem;">
<div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;"><span>Qwen 3.5</span><span style="opacity: 0.6;">66.40%</span></div>
<div style="background: var(--border); border-radius: 4px; height: 8px;"><div style="background: #22c55e; width: 66%; height: 100%; border-radius: 4px;"></div></div>
</div>
<div style="margin-bottom: 0.5rem;">
<div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;"><span>Nemotron 3 Super</span><span style="opacity: 0.6;">60.47%</span></div>
<div style="background: var(--border); border-radius: 4px; height: 8px;"><div style="background: #3b82f6; width: 60%; height: 100%; border-radius: 4px;"></div></div>
</div>
<div>
<div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;"><span>GPT-OSS 120B</span><span style="opacity: 0.6;">41.90%</span></div>
<div style="background: var(--border); border-radius: 4px; height: 8px;"><div style="background: #ef4444; width: 42%; height: 100%; border-radius: 4px;"></div></div>
</div>
</div>
<div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
<h4 style="margin: 0 0 0.75rem;">📄 Long Context (RULER)</h4>
<div style="margin-bottom: 0.5rem;">
<div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;"><span>Nemotron 3 Super</span><span style="opacity: 0.6;">91.75%</span></div>
<div style="background: var(--border); border-radius: 4px; height: 8px;"><div style="background: #22c55e; width: 92%; height: 100%; border-radius: 4px;"></div></div>
</div>
<div style="margin-bottom: 0.5rem;">
<div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;"><span>Qwen 3.5</span><span style="opacity: 0.6;">91.33%</span></div>
<div style="background: var(--border); border-radius: 4px; height: 8px;"><div style="background: #3b82f6; width: 91%; height: 100%; border-radius: 4px;"></div></div>
</div>
<div>
<div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;"><span>GPT-OSS 120B</span><span style="opacity: 0.6;">22.30%</span></div>
<div style="background: var(--border); border-radius: 4px; height: 8px;"><div style="background: #ef4444; width: 22%; height: 100%; border-radius: 4px;"></div></div>
</div>
</div>
<div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
<h4 style="margin: 0 0 0.75rem;">📐 Architecture</h4>
<div style="font-size: 0.85rem; line-height: 1.6;">

**Nemotron 3 Super** — 120B total, 12B active (MoE). Highest efficiency per active parameter.

**Qwen 3.5** — Dense 32B. Strong coding but higher compute cost and slower inference.

**GPT-OSS 120B** — Dense 120B. Resource-heavy with lower benchmark scores across the board.
</div>
</div>
</div>

<p style="font-size: 0.75rem; opacity: 0.5; margin-top: 0.5rem;">Sources: <a href="https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Super-Technical-Report.pdf">NVIDIA Technical Report</a> · <a href="https://artificialanalysis.ai/articles/nvidia-nemotron-3-super-the-new-leader-in-open-efficient-intelligence">Artificial Analysis</a> · <a href="https://www.baseten.co/blog/introducing-nemotron-3-super/">Baseten</a></p>

---

## A Tier — Strong Free AI Models for Developers

Powerful but more specialized — they excel in specific use cases rather than being all-rounders.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
<div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
<h4 style="margin: 0 0 0.5rem;">GPT-OSS 120B</h4>

Good balance of reasoning and coding. Solid instruction following. Works well as a fallback model.

**Best for:** structured tasks, reasoning
</div>
<div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
<h4 style="margin: 0 0 0.5rem;">GLM 4.5 Air</h4>

Designed for agent workflows and structured pipelines. Handles tool-use patterns reliably.

**Best for:** automation, agent pipelines
</div>
<div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
<h4 style="margin: 0 0 0.5rem;">Devstral 2</h4>

Strong coding and execution model from Mistral. Good at multi-step tasks with clear instructions.

**Best for:** coding agents, code generation
</div>
</div>

---

## B Tier — Good but Inconsistent

These models can work, but output quality varies. You''ll need to verify results more often.

| Model | Strength | Weakness |
|-------|----------|----------|
| **MiMo v2 Flash / Pro** | High capability ceiling | Inconsistent output |
| **DeepSeek V3 / R1** | Strong reasoning | Weak execution |
| **Nemotron 3 Nano** | Fast and lightweight | Limited reasoning |
| **Trinity Large Preview** | General purpose | Not coding-focused |

---

## C Tier — Limited Use

| Model | Notes |
|-------|-------|
| **Kimi K2.5** | Decent coding but needs hand-holding, struggles with ambiguity |
| **MiniMax 2.7** | Slight improvement over 2.5, still limited for complex workflows |
| **Smaller Qwen (7B–14B)** | Fast inference but weak reasoning and poor code quality |

---

## D Tier — Not Recommended

**MiniMax 2.5** — weak reasoning, poor multi-step handling, superseded by 2.7. **Very small models (<10B)** — not suitable for coding, agents, or production. They hallucinate too frequently and lack reasoning depth for anything beyond trivial tasks.

---

## Key Takeaways

- Free models are now genuinely usable for real development work
- Larger models still perform significantly better than small ones
- The main limitation is consistency, not raw capability
- A multi-model strategy outperforms relying on any single model

---

## Recommended Setup

Instead of relying on a single model, I run a multi-model strategy:

| Role | Model | Use Case |
|------|-------|----------|
| **Primary** | Nemotron 3 Super | Handles most daily tasks |
| **Coding** | Qwen3 Coder 480B A35B | Repo-level refactoring, large codebases |
| **Fallback** | GPT-OSS 120B | When the primary struggles with a task |
| **Paid upgrade** | Qwen 3.6 Plus *(not free)* | Complex planning, long-context work |

This approach gives you redundancy and lets you match the model to the task. In practice, switching models based on the job produces better results than forcing one model to do everything. If you have budget for a paid model, Qwen 3.6 Plus is an excellent addition for reasoning-heavy tasks.

---

## Conclusion

Free AI models are now production-ready. Use multiple models, test in real workflows, and choose based on task — not hype.

---

## Sources

- [NVIDIA Nemotron 3 Super Technical Report](https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Super-Technical-Report.pdf)
- [NVIDIA Nemotron Model Overview](https://research.nvidia.com/labs/nemotron/Nemotron-3-Super/)
- [Artificial Analysis Benchmark](https://artificialanalysis.ai/articles/nvidia-nemotron-3-super-the-new-leader-in-open-efficient-intelligence)
- [Baseten Performance Breakdown](https://www.baseten.co/blog/introducing-nemotron-3-super/)
- [HuggingFace Nemotron Model Card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-FP8)
- [Qwen vs DeepSeek Benchmark Comparison](https://llm-stats.com/models/compare/deepseek-v3-vs-qwen3-32b)
- [Qwen vs DeepSeek (Artificial Analysis)](https://artificialanalysis.ai/models/comparisons/qwen3-5-35b-a3b-vs-deepseek-v3-2)
- [DeepSeek vs Qwen Comparison (Galaxy)](https://blog.galaxy.ai/compare/deepseek-chat-vs-qwen3-max)
- [DeepSeek vs Qwen Benchmark (HumanEval / GSM8K)](https://spectrumailab.com/blog/deepseek-v4-vs-qwen3-max-thinking-chinese-ai-models-beating-gpt5)',
  '{}',
  'https://i.ibb.co/27vzC28C/image.webp',
  'published',
  '2026-03-31T14:00:00'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Building a Dynamic Feature Flag System in Laravel',
  'building-a-dynamic-feature-flag-system-in-laravel',
  '',
  '# Introduction
As a backend engineer working with Laravel in production, I''ve encountered my fair share of challenges. One of the most significant problems we faced was the need to enable or disable features without deployments, while managing feature rollout to specific user groups. In this post, I''ll describe how we built a dynamic feature flag system in Laravel to tackle this issue.

## Problem
In our production environment, we needed to roll out new features to a subset of users, while also allowing for quick rollback in case of issues. However, our existing implementation relied on code changes and deployments, which led to delays and added risk. Moreover, we had to consider edge cases such as retries, race conditions, and scaling.

## Solution
To address this problem, we designed a database-driven feature flag system with caching, user targeting, and percentage rollout. We also implemented fallback strategies to handle cases where the flag evaluation fails.

### Database-Driven Flags
We created a `feature_flags` table to store the state of each feature. This table has columns for the feature name, description, and enabled status.

### Caching
To improve performance, we used Laravel''s built-in caching mechanism to store the feature flag values. This allows us to reduce the number of database queries and improve response times.

### User Targeting
We implemented user targeting by adding a `user_targeting` column to the `feature_flags` table. This column stores a JSON object with user attributes, such as role or location, that determine whether a user should see the feature.

### Percentage Rollout
To enable percentage rollout, we added a `rollout_percentage` column to the `feature_flags` table. This column stores the percentage of users that should see the feature.

### Fallback Strategies
We implemented fallback strategies to handle cases where the flag evaluation fails. For example, if the database is down, we can fall back to a default value.

## Code
Here''s an example of how we implemented the feature flag system in Laravel:
```php
// FeatureFlag model
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeatureFlag extends Model
{
    protected $casts = [
        ''user_targeting'' => ''json'',
    ];

    public function isEnabled($user)
    {
        if ($this->enabled) {
            $targeting = json_decode($this->user_targeting, true);
            if ($targeting && isset($targeting[''role'']) && $targeting[''role''] === $user->role) {
                return true;
            }

            $rolloutPercentage = $this->rollout_percentage;
            if ($rolloutPercentage > 0) {
                $randomNumber = rand(1, 100);
                if ($randomNumber <= $rolloutPercentage) {
                    return true;
                }
            }
        }

        return false;
    }
}

// FeatureFlagServiceProvider
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\FeatureFlag;

class FeatureFlagServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Cache feature flags
        $featureFlags = FeatureFlag::all();
        foreach ($featureFlags as $featureFlag) {
            cache()->put(''feature_flag_'' . $featureFlag->name, $featureFlag);
        }
    }

    public function register()
    {
        // Bind FeatureFlag instance to the container
        $this->app->bind(''feature_flag'', function ($app) {
            return new FeatureFlag();
        });
    }
}

// Usage
$featureFlag = cache()->get(''feature_flag_my_feature'');
if ($featureFlag->isEnabled(auth()->user())) {
    // Render the feature
}
```
## Conclusion
In this post, I described how we built a dynamic feature flag system in Laravel to enable or disable features without deployments, while managing feature rollout to specific user groups. By using a database-driven approach with caching, user targeting, and percentage rollout, we were able to improve our deployment process and reduce the risk of errors. I hope this example helps you implement a similar system in your own Laravel application.',
  '{}',
  '',
  'published',
  '2026-04-03T17:25:18'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'How I Built SignalStack: A Real-Time AI Intelligence Pipeline',
  'building-a-real-time-rss-intelligence-pipeline-with-nestjs-and-ai',
  'A complete engineering deep dive into building a highly concurrent RSS ingestion engine, a deterministic scoring algorithm, and a multi-tier AI fallback pipeline using NestJS.',
  '> A real-time intelligence pipeline that filters noise, scores signals, and enriches only what matters — all under strict cost and rate limits.
## The Problem: Too Much Noise, Not Enough Signal

As an engineer constantly monitoring tech news, cybersecurity disclosures, and financial markets, I was drowning in the noise-to-signal ratio of standard RSS readers. They give you everything—and therefore, nothing. A major zero-day exploit notification looks exactly the same as a generic product launch.

I needed an automated pipeline capable of doing what I was doing manually: reading hundreds of headlines, discarding the fluff, identifying critical events, summarizing them, and alerting me instantly. 

So I built **SignalStack**—a real-time intelligence engine.

In this deep dive, I''ll break down how I engineered the system using **NestJS, PostgreSQL, Redis, and a multi-tier AI architecture**. 

To ensure the architecture was truly production-safe and highly optimized, I deployed the entire Dockerized stack on a local **Proxmox VM (Ubuntu Server) strictly constrained to 4GB of RAM and a 2-core CPU**. Emulating this resource-starved environment forced me to write computationally efficient code—handling massive data ingest without memory leaks—rather than just throwing cloud compute at the problem.

---

## System Overview

SignalStack is an RSS-to-intelligence pipeline that operates on a strict "score first, enrich later" philosophy.

This single constraint defines the entire architecture — AI is never the entry point, only the final refinement layer.

The architecture is a Dockerized monorepo with a NestJS backend and Next.js frontend. Here is the high-level data flow:

```text
                        [RSS Feeds]
                              │
                              ▼
              [Feed Scheduler] (every 5 mins)
                              │
                              ▼
                [Fetch API] (10s timeout)
                              │
                              ▼
                [RSS Parser] (rss-parser)
                              │
                              ▼
                [Normalizer] (clean + trim)
                              │
                              ▼
                          [Scorer]
                    (keywords + entities
                    + source trustScore)
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                  [< 5]     [≥ 5]     [≥ 7]
                discard    store    store +
                                        │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
              Discord Alert         AI Queue          Dashboard
              (rate-limited)          (RxJS)          (SWR poll)
                                        │
                                ┌───────┴───────┐
                                ▼               ▼
                            Local LLM     External APIs
                          (llama.cpp) (Groq → OpenRouter)
```

The core design principle of SignalStack is **graceful degradation**. If the AI providers go down, or if the server exhausts its API quotas, the system doesn''t crash. It simply falls back to standard deterministic keyword scoring and keeps running.

---

## Core Architecture & Deep Dive

I chose **NestJS** for the backend because its modular architecture and dependency injection mimic the strict organizational patterns of frameworks like Laravel, but within the Node.js ecosystem. 

The backend is split into specialized modules: `FeedModule` (ingestion), `ScorerModule` (intelligence), `AIModule` (enrichment), and `AlertsModule` (Discord webhooks).

### 1. Ingestion & Feed Concurrency

Fetching dozens of RSS feeds simultaneously can easily stall the event loop or exhaust memory if not bounded. The Feed Scheduler runs every 5 minutes and uses `p-limit` alongside `Promise.allSettled`.

```typescript
// backend/src/feed/feed.service.ts
const FEED_TIMEOUT = 10_000;    // 10s per feed
const CONCURRENCY_LIMIT = 5;    // Max 5 feeds fetched at once

async fetchAllFeeds(): Promise<ScoredSignal[]> {
  const limit = pLimit(CONCURRENCY_LIMIT);
  const activeSources = await this.db.select().from(sources).where(eq(sources.isActive, true));

  // Promise.allSettled guarantees a single feed crash won''t kill the batch
  const results = await Promise.allSettled(
    activeSources.map(source => limit(() => this.fetchSingleFeed(source)))
  );
  // ...
}
```

Instead of relying on heavy third-party clients like `axios`, I used Node''s native `fetch` wrapped with an `AbortController` to enforce strict 10-second timeouts per feed.

### 2. Multi-Layer Deduplication

News outlets frequently update article timestamps or tweak URLs (e.g., adding `utm_source` tracking parameters), which causes traditional RSS readers to ingest duplicates. 

To solve this, I built a two-layer deduplication strategy:
1. **Application Layer:** Normalizes URLs (stripping tracking hashes) and generates a SHA-256 hash combination of the title and URL.
2. **Database Layer:** A `UNIQUE` constraint on the `hash` column in PostgreSQL prevents any race conditions from bypassing the application check (throwing a cleanly intercepted `23505` error).

---

## Key Engineering Decisions

### The Scoring Engine (AI is Expensive, Regex is Free)

It’s tempting to throw raw RSS feeds directly into an LLM and say, "Is this important?" But doing so against thousands of daily articles is incredibly slow, expensive, and error-prone.

Before AI is even involved, every imported article goes through my **Deterministic Scorer**. 

```typescript
// Final Score = Keyword Points + Entity Points + Source Trust Score
const text = `${raw.title} ${raw.content || ''''}`.toLowerCase();

let score = 0;
// Example Entity Rule using Word Boundaries
const regex = new RegExp(`\\bAnthropic\\b`, ''i'');
if (regex.test(text)) score += 3;

score += source.trustScore; // Baseline reputation of the RSS source (1-5)
```

Only signals that score a `7` or higher are passed into the AI Queue for summarization. This single decision reduced API overhead by 92%. On average, only ~8% of incoming signals reach the AI layer.

### The Three-Tier AI Fallback Chain

When a signal is critical enough to warrant enrichment, it hits the AI Service. To guarantee reliability without accidentally burning cash, I engineered a cascading fallback pipeline:

1. **Local (Cost: $0):** A local `llama.cpp` inference server running the highly efficient `Qwen2.5-0.5B` model. It has an 8-second timeout.
2. **Groq (Primary Cloud):** If local fails or times out, it routes to Groq for ultra-low latency inference.
3. **OpenRouter (Failover):** If Groq encounters API limits (HTTP 429), it fails over to OpenRouter.

```typescript
// backend/src/ai/ai.service.ts
for (const provider of this.providers) {
  if (!provider.key) continue;

  try {
    const result = await this.executeProvider(provider, title, content);
    if (result) return result;
  } catch (error: any) {
    if (error.response?.status === 429) {
      this.setCooldown(provider.name, 60_000); // Back off for 60 seconds
    }
    continue; // Try the next provider
  }
}
```

---

## Challenges & Solutions

### Challenge 1: API Burst Rate Limiting
Because cron jobs fetch feeds in massive batches every 5 minutes, dozens of signals might hit the AI and Discord APIs at the exact same millisecond, triggering instant `429 Too Many Requests` blocks.

**Solution:** I utilized an **RxJS-based queue** to throttle background work. By zipping a generic Subject stream with an RxJS `timer`, the system strictly meters outgoing requests (e.g., 1.5 seconds between AI jobs, 2 seconds between Discord webhook executions).

```typescript
// Throttled Queue pattern
zip(this.queue$, timer(0, 1500)).pipe(
  mergeMap(([job]) => this.processJob(job), 2)
).subscribe();
```

### Challenge 2: Local AI Hallucinations
Running a half-billion parameter model (`Qwen2.5-0.5B`) within 4GB of server RAM meant the model occasionally spat out fragmented thoughts or repeated itself.

**Solution:** I tweaked the inference parameters specifically for formatting logic rather than intelligence. Setting `n_predict` tight limits and aggressive application-side output cleaning (stripping newlines, capping at 200 chars) transformed erratic local output into clean, executive summaries. 

---

## Performance & Optimization

The entire system is deployed via a highly optimized `docker-compose` footprint. The application tier connects natively to Postgres and Redis within the container network, eliminating host-dependent overhead.

- **Storage Optimization:** Feeds older than 5 days are aggressively pruned via database crons to prevent index bloat on text-heavy columns.
- **Quota Tracking Tracking:** I attached Redis `INCR` counters mapped to ISO formatted dates with 25-hour TTLs to track daily API quotas locally without relying on external dashboard lookups.

---

## Scaling Strategy (Towards 1M Users)

While SignalStack currently runs securely on a single Proxmox VPS, the architecture is deliberately decoupled for linear horizontal scaling:

1. **Message Broker Transition:** The current RxJS and memory-backed queues would be swapped for Kafka or RabbitMQ.
2. **Worker Isolation:** The `FeedModule` and `AIModule` are completely decoupled. We could deploy 10 feed intake nodes and 5 AI processing nodes independently depending on ingestion vs. enrichment lag.
3. **Caching Layer:** Redis is currently used for rate-limiting. For a massive multi-tenant scenario, we would cache identical article URL hashes so multiple users subscribed to overlapping feeds never trigger redundant AI summarizations. 

---

## Key Learnings

1. **Architecture > Model Choice:** Architecture beats model choice. A well-designed pipeline with a 0.5B model can outperform a poorly structured system using GPT-4.
2. **Cost Control Requires Engineering:** Putting AI behind a score-gated filter, rather than processing everything, is the single highest ROI optimization you can make in modern application development.
3. **Async Systems Scale Cleanly:** By ensuring that no slow external factor (AI latency, Discord API blocks) ever halts the main event loop, the frontend dashboard remains predictably fast regardless of backend strain.

---

## Conclusion

SignalStack taught me that the perceived magic of AI is largely dependent on the boring, brilliant fundamentals surrounding it: rate limiters, fallback chains, data normalization, and connection pooling. 

If you build the pipeline correctly, the intelligence is merely a highly optimized bonus.

> **View the Source:** [github.com/fazleyrabby/signal-stack](https://github.com/fazleyrabby/signal-stack)

## Why This Matters

Most AI systems fail not because of model limitations, but because of poor system design. SignalStack demonstrates that:

- Filtering > brute forcing AI
- Queues > synchronous pipelines
- Fallbacks > assumptions

This approach turns AI from a cost center into a controlled, reliable subsystem.',
  ARRAY['NestJS','Systems Design','AI','PostgreSQL','TypeScript']::text[],
  'https://i.ibb.co/fGzKnm2w/image-1.webp',
  'published',
  '2026-04-06T12:00:00'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Building a Reliable Webhook System in Laravel for Third-Party Integrations',
  'building-a-reliable-webhook-system-in-laravel-for-',
  '',
  '## The Problem with Naive Webhook Handling

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
    $signature = $request->header(''X-Stripe-Signature'');
    $secret = config(''services.stripe.webhook_secret'');
    
    $expected = hash_hmac(''sha256'', $request->getContent(), $secret);

    // Constant-time execution prevents timing attacks
    return hash_equals($expected, $signature);
}
```

## 2. Ingest First, Process Later

The golden rule of webhooks is: **Acknowledge immediately, process asynchronously.**

The controller''s only job is to validate the signature, save the raw payload to the database, and dispatch a queue worker. Webhooks should return a `202 Accepted` within 50 milliseconds.

```php
public function handle(Request $request)
{
    abort_if(! $this->validateSignature($request), 401);

    // Save the raw payload immediately
    $log = WebhookLog::create([
        ''provider''   => ''stripe'',
        ''event_id''   => $request->input(''id''),
        ''event_type'' => $request->input(''type''),
        ''payload''    => $request->all(),
    ]);

    // Dispatch a dedicated worker
    ProcessStripeWebhook::dispatch($log);

    return response()->json([''status'' => ''acknowledged''], 202);
}
```

By saving the raw payload to a `webhook_logs` table first, we gain an immutable audit trail. If our business logic contains a bug and the job fails, we haven''t lost the data. We can simply replay the queue later.

## 3. Designing for Idempotency

Because networks are inherently unreliable, third-party providers guarantee "at-least-once" delivery. This means you **will** receive the exact same webhook twice eventually. 

Your queue jobs must be **idempotent**, meaning they can run 100 times but only apply the business logic once.

```php
public function handle()
{
    // DB transaction with a pessimistic lock
    DB::transaction(function () {
        $log = WebhookLog::where(''id'', $this->webhookLog->id)
            ->lockForUpdate()
            ->first();

        // 1. Idempotency Check
        if ($log->processed_at !== null) {
            return; // Already processed
        }

        // 2. Execute Business Logic here...
        
        // 3. Mark as processed
        $log->update([''processed_at'' => now()]);
    });
}
```

## Conclusion

Building a reliable webhook system isn''t about handling success; it''s about anticipating failure.

By using constant-time signature validation, shifting the workload entirely to background queues, and implementing strict idempotency checks, you can guarantee that your Laravel application will effortlessly absorb massive webhook traffic spikes without dropping a single event.',
  '{}',
  '',
  'published',
  '2026-03-30T18:00:00'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Creating a Finder Toolbar “New File” Tool for Developers and macOS Users',
  'create-new-file-finder-toolbar-macos',
  '“How to build a custom Finder toolbar button on macOS that lets you create new files with developer-friendly templates — no Terminal or editor needed.”',
  '## Introduction

If you''ve used macOS long enough, you''ve probably noticed one thing missing compared to Windows:

> 👉 There is **no "New File" option in Finder**

For developers, this becomes frustrating very quickly. You constantly:
- Open VSCode just to create a file
- Use Terminal (`touch file.js`)
- Break your focus for small tasks

So instead of working around it...

> 👉 I built a **Finder Toolbar Dev Tool**

---

## What You Will Build

By the end of this guide, you will have:

- A **button in Finder toolbar**
- A popup to choose:
  - Stack (Laravel, Next.js, NestJS, etc.)
  - File type
- Automatic file creation
- Optional boilerplate code

---

## Who This Guide Is For

This guide works for:

### Beginners
- No AppleScript knowledge needed
- Just copy-paste + follow steps

### Developers
- Extendable system
- Multi-stack support
- Can evolve into full dev tool

---

## How It Works (Concept)

```
Toolbar Button
   ↓
AppleScript Dialogs
   ↓
User Input (Stack + Type + Name)
   ↓
File Generator Logic
   ↓
File Created in Finder
```

---

## Step 1. Open Script Editor

1.  Press `Cmd + Space`
2.  Type `Script Editor`
3.  Press Enter

------------------------------------------------------------------------

## Step 2. Create New Script

1.  Click **New Document**
2.  Clear everything

------------------------------------------------------------------------

## Step 3. Paste the Full Script

``` applescript
tell application "Finder"
    if not (exists front window) then
        display dialog "No Finder window open"
        return
    end if
    set targetFolder to (target of front window) as alias
end tell

set basePath to POSIX path of targetFolder

-- ========================
-- SELECT STACK
-- ========================
set stackChoice to choose from list {"Laravel", "Next.js", "NestJS", "SQL", "Generic"} with prompt "Select stack:"
if stackChoice is false then return
set stack to item 1 of stackChoice

-- ========================
-- SELECT TYPE
-- ========================
if stack is "Laravel" then
    set typeChoice to choose from list {"Controller", "Model", "Migration", "Blade"} with prompt "Laravel:"
else if stack is "Next.js" then
    set typeChoice to choose from list {"Page", "API Route", "Component"} with prompt "Next.js:"
else if stack is "NestJS" then
    set typeChoice to choose from list {"Module", "Service", "Controller"} with prompt "NestJS:"
else if stack is "SQL" then
    set typeChoice to choose from list {"Migration", "Table"} with prompt "SQL:"
else
    set typeChoice to choose from list {"txt", "php", "js", "md"} with prompt "Generic:"
end if

if typeChoice is false then return
set typeName to item 1 of typeChoice

-- ========================
-- FILE NAME INPUT
-- ========================
set baseName to text returned of (display dialog "Enter name:" default answer "user")

if baseName is "" then
    set baseName to "NewFile"
end if

-- safer StudlyCase conversion
set studly to do shell script "echo " & quoted form of baseName & " | sed -E ''s/[^a-zA-Z0-9]+/ /g'' | awk ''{for(i=1;i<=NF;i++){printf toupper(substr($i,1,1)) tolower(substr($i,2))}}''"

set fileName to ""
set content to ""

-- ========================
-- LARAVEL
-- ========================
if stack is "Laravel" then
    if typeName is "Controller" then
        set fileName to studly & "Controller.php"
        set content to "<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class " & studly & "Controller extends Controller
{
    //
}"
        
    else if typeName is "Model" then
        set fileName to studly & ".php"
        set content to "<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class " & studly & " extends Model
{
    protected $guarded = [];
}"
        
    else if typeName is "Migration" then
        set fileName to "create_" & studly & "_table.php"
        set content to "<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create(''" & studly & "'', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });
    }
};"
        
    else if typeName is "Blade" then
        set fileName to baseName & ".blade.php"
        set content to "<x-layout>
    <h1>" & studly & "</h1>
</x-layout>"
    end if
end if

-- ========================
-- NEXT.JS
-- ========================
if stack is "Next.js" then
    if typeName is "Page" then
        set fileName to "page.tsx"
        set content to "export default function Page() {
  return <div>" & studly & "</div>;
}"
        
    else if typeName is "API Route" then
        set fileName to "route.ts"
        set content to "export async function GET() {
  return Response.json({ message: ''" & studly & "'' });
}"
        
    else if typeName is "Component" then
        set fileName to studly & ".tsx"
        set content to "export function " & studly & "() {
  return <div>" & studly & "</div>;
}"
    end if
end if

-- ========================
-- NESTJS
-- ========================
if stack is "NestJS" then
    if typeName is "Module" then
        set fileName to studly & ".module.ts"
        set content to "import { Module } from ''@nestjs/common'';

@Module({})
export class " & studly & "Module {}"
        
    else if typeName is "Service" then
        set fileName to studly & ".service.ts"
        set content to "export class " & studly & "Service {}"
        
    else if typeName is "Controller" then
        set fileName to studly & ".controller.ts"
        set content to "import { Controller, Get } from ''@nestjs/common'';

@Controller(''" & studly & "'')
export class " & studly & "Controller {
  @Get()
  findAll() {
    return [];
  }
}"
    end if
end if

-- ========================
-- SQL
-- ========================
if stack is "SQL" then
    set fileName to studly & ".sql"
    set content to "CREATE TABLE " & studly & " (
    id INT PRIMARY KEY AUTO_INCREMENT
);"
end if

-- ========================
-- GENERIC
-- ========================
if stack is "Generic" then
    if typeName is "php" then
        set fileName to studly & ".php"
    else if typeName is "js" then
        set fileName to studly & ".js"
    else if typeName is "md" then
        set fileName to studly & ".md"
    else
        set fileName to studly & ".txt"
    end if
end if

-- fallback safety
if fileName is "" then
    set fileName to studly & ".txt"
end if

set filePath to basePath & fileName

-- ========================
-- PREVENT OVERWRITE
-- ========================
set i to 1
set originalPath to filePath

repeat while (do shell script "test -e " & quoted form of filePath & " && echo yes || echo no") is "yes"
    set filePath to originalPath & "-" & i
    set i to i + 1
end repeat

-- ========================
-- CREATE FILE SAFELY
-- ========================
try
    do shell script "touch " & quoted form of filePath
    if content is not "" then
        do shell script "printf %s " & quoted form of content & " > " & quoted form of filePath
    end if
on error errMsg
    display dialog "Error creating file: " & errMsg
    return
end try

delay 0.2

-- ========================
-- REVEAL FILE SAFELY
-- ========================
try
    do shell script "test -e " & quoted form of filePath
    tell application "Finder" to reveal POSIX file filePath
end try
```

------------------------------------------------------------------------

## Step 4. Save as Application

1. Click **File → Export**
2. Choose:
   - Format: Application
   - Name: New File
3. Save in Applications

---

## Step 5. Add to Finder Toolbar

1. Open Finder
2. Right-click toolbar → Customize Toolbar
3. Drag your app into toolbar
4. Click Done

---

## Step 6. Use It

Now simply:

1. Open any folder
2. Click your toolbar button
3. Select stack
4. Select type
5. Enter name

> 👉 Your file is created instantly

------------------------------------------------------------------------

## Developer Insights

This tool is more than a script. It''s a **mini scaffolding system**.

### Why it''s powerful:

- Removes context switching
- Enforces naming conventions
- Works across multiple stacks
- Fully customizable

---

## Extend It Further

You can upgrade this into:

- Laravel `artisan make:` integration
- NestJS CLI integration
- Template-based file system
- Auto project detection

---

## Conclusion

Instead of adapting to limitations...

> 👉 You extended your OS.

You now have:
- Faster workflow
- Cleaner structure
- A tool you built yourself

And that''s where real productivity starts.',
  ARRAY['“macOS”','“Automator”','“Developer Tools”','“Productivity”']::text[],
  '',
  'published',
  '2026-04-09T12:00:00'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Designing a Scalable Notification System in Laravel',
  'designing-a-scalable-notification-system-in-laravel',
  '',
  '# Designing a Scalable Notification System in Laravel

As a backend engineer working with Laravel in production, I''ve encountered my fair share of challenges when it comes to designing a scalable notification system. One of the most significant problems we faced was handling a high volume of notifications via email, SMS, and push with high throughput and reliability.

## The Problem

In our production environment, we were experiencing frequent timeouts and failures when sending notifications. The issue was exacerbated by the fact that we were sending notifications synchronously, which was causing a significant bottleneck in our application. We needed a solution that would allow us to queue notifications, handle channel separation, implement retry handling, and manage user preferences.

## The Solution

To address these challenges, we implemented a notification system that utilized Laravel''s built-in queueing system, channel separation, and retry handling. We also implemented rate limiting to prevent overwhelming our notification providers. Additionally, we developed a user preference management system that allowed users to customize their notification settings.

### Queueing Notifications

We started by queueing notifications using Laravel''s `Illuminate\Contracts\Queue\ShouldQueue` interface. This allowed us to offload the notification sending process to a separate queue worker, freeing up our main application to handle other tasks.

### Channel Separation

We implemented channel separation by creating separate queues for each notification channel (email, SMS, push). This allowed us to prioritize notifications and handle channel-specific failures more efficiently.

### Retry Handling

We implemented retry handling using Laravel''s `Illuminate\Contracts\Queue\ShouldQueue` interface and the `--tries` option when running the queue worker. This allowed us to retry failed notifications a specified number of times before considering them failed.

### Rate Limiting

We implemented rate limiting using Laravel''s `Illuminate\Cache\RateLimiting\Limit` class. This allowed us to limit the number of notifications sent per minute, preventing us from overwhelming our notification providers.

### User Preference Management

We developed a user preference management system that allowed users to customize their notification settings. This included the ability to opt-out of specific notification channels or customize the frequency of notifications.

## Code Example

Here''s an example of how we implemented queueing notifications for our email channel:
```php
// app/Jobs/SendEmailNotification.php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendEmailNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $user;
    private $notification;

    public function __construct(User $user, Notification $notification)
    {
        $this->user = $user;
        $this->notification = $notification;
    }

    public function handle()
    {
        // Send email notification using our email service
        $this->user->sendEmailNotification($this->notification);
    }
}
```
In our notification controller, we dispatch the `SendEmailNotification` job:
```php
// app/Http/Controllers/NotificationController.php

namespace App\Http\Controllers;

use App\Jobs\SendEmailNotification;
use App\Models\Notification;
use App\Models\User;

class NotificationController extends Controller
{
    public function sendNotification(User $user, Notification $notification)
    {
        SendEmailNotification::dispatch($user, $notification);
    }
}
```
## Conclusion

In conclusion, designing a scalable notification system in Laravel requires careful consideration of queueing notifications, channel separation, retry handling, rate limiting, and user preference management. By implementing these strategies, we were able to significantly improve the reliability and throughput of our notification system. As a backend engineer, it''s essential to consider the trade-offs and edge cases that come with building a scalable notification system, and to continually monitor and optimize your system to ensure it meets the needs of your application.',
  '{}',
  '',
  'draft',
  NULL
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Designing a Scalable Search System in Laravel Applications',
  'designing-a-scalable-search-system-in-laravel-applications',
  '',
  '# Designing a Scalable Search System in Laravel Applications
## Introduction
As a backend engineer working with Laravel in production, I''ve encountered my fair share of challenges when it comes to handling full-text search, filtering, and performance issues with large datasets. In this post, I''ll dive into the problem of designing a scalable search system and share my experience with finding a solution that works.
## The Problem
When dealing with large datasets, a simple `LIKE` query or MySQL full-text search can quickly become inadequate. I recall a project where we were dealing with a database of over 10 million records, and our search functionality was taking upwards of 10 seconds to return results. The main issue was that our queries were not optimized for performance, and we were not utilizing any caching or indexing strategies.
## Solution
To tackle this problem, I decided to explore external tools that could handle full-text search more efficiently. I chose to use Elasticsearch, which is a popular search and analytics engine. Elasticsearch allows you to create indexes of your data, which can be searched using a variety of algorithms. I also implemented a caching layer using Redis to store the results of frequent searches.
In addition to using external tools, I also optimized our database queries by utilizing MySQL full-text search and indexing strategies. I created a separate table for search indexes, which allowed me to keep our main database table lean and efficient.
## Code Example
Here''s an example of how I used Laravel''s Scout package to integrate Elasticsearch with our application:
```php
// config/scout.php
''scout'' => [
    ''driver'' => env(''SCOUT_DRIVER'', ''elasticsearch''),
],

// app/Models/SearchableModel.php
use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Model;

class SearchableModel extends Model
{
    use Searchable;

    public function toSearchableArray()
    {
        return [
            ''id'' => $this->id,
            ''name'' => $this->name,
            ''description'' => $this->description,
        ];
    }
}
```
In this example, I''ve defined a `SearchableModel` that uses the `Searchable` trait provided by Laravel''s Scout package. The `toSearchableArray` method defines the data that should be indexed by Elasticsearch.
## Conclusion
Designing a scalable search system in Laravel applications requires careful consideration of performance issues and trade-offs. By utilizing external tools like Elasticsearch and caching layers like Redis, you can significantly improve the performance of your search functionality. Additionally, optimizing your database queries and indexing strategies can also have a major impact. By following these strategies, I was able to reduce our search query time from 10 seconds to under 1 second, even with a large dataset.',
  '{}',
  '',
  'published',
  '2026-04-03T17:26:25'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Distributed Locking for Multi-Server Laravel Workers: A Case Study',
  'distributed-locking-for-multi-server-laravel-workers-a-case-study',
  '',
  '## Introduction
As a senior backend engineer, I''ve encountered numerous challenges when designing distributed systems. One particularly interesting problem is preventing race conditions when multiple horizontal application servers run overlapping scheduled tasks. In this article, I''ll share my experience implementing distributed locking for multi-server Laravel workers using Redis-based AtomLock, highlighting key architectural decisions, pitfalls, and takeaways.

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
Here''s an example implementation of our distributed lock using Redis AtomLock:
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
        return $this->redis->command(''SET'', $this->lockName, ''locked'', ''EX'', $this->ttl, ''NX'');
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
        $locks = Redis::connection()->keys(''lock:*'');
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

By following these guidelines and implementing a distributed locking mechanism, you can ensure the reliability and consistency of your distributed system, even in the presence of overlapping scheduled tasks.',
  '{}',
  '',
  'draft',
  NULL
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Dynamic Fullcalender Laravel Fetch API',
  'dynamic-fullcalender-laravel-fetchapi',
  'How to implement a dynamic fullcalender with Laravel and Fetch API',
  '<img src="/images/uploads/markus-winkler-hxcifi47fgq-unsplash-2-.jpg" alt="" width="100%"/>


## This is applicable on existing or a fresh laravel project

<p>
First of all let''s add the required cdn or links to your page. as showed below. And I also added some boilerplate codes from the documentation of fullcalender.io
</p>



    <!DOCTYPE html>
    <html lang=''en''>
    <head>
        <meta charset=''utf-8'' />
            <link href=''https://cdn.jsdelivr.net/npm/fullcalendar@5.7.0/main.css'' rel=''stylesheet''/> 
        <script src=''https://cdn.jsdelivr.net/npm/fullcalendar@5.7.0/main.min.js''></script> 
        <script>

        document.addEventListener(''DOMContentLoaded'', function() {
            var calendarEl = document.getElementById(''calendar'');
            var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: ''dayGridMonth''
            });
            calendar.render();
        });

        </script>
    </head>
    <body>
        <div id=''calendar''></div>
    </body>
    </html>

<p>
This will render an empty calender
</p>

To fetch some data from database and handle the click events lets create a controller name **CalenderControler** and create the methods to handle data as well

    class CalenderController extends Controller
    {
        // To show calender index file
        public function index(){
            return view(''index'');
        }

        // To fetch title and date from database
        public function fetch(){
            $events = Event::select(''title'',''start'')->get();
            return response()->json($events);
        }

        // To create new event
        public function create(Request $request){
            $event = new Event();
            $event->title = $request->title;
            $event->start = $request->eventDate;
            $event->save();
        }

    }

Lets declare some routes as well before starting with the script 

    //show the calender
    Route::get(''/calender'', [CalenderController::class,''index'']);

    //fetch calender data
    Route::get(''/fetchCalenderEvents'', [CalenderController::class,''fetch'']);

    //create new calender data
    Route::post(''/create'', [CalenderController::class,''create'']);


Now lets modify our index page to fetch some data from database and render on the calender

    ...initialView: ''dayGridMonth'',
    eventSources: [
        {
        url: ''/fetchCalenderEvents'',
        }
    ],

After initial view option add this new property called eventSources with an option of url which has the url of your **fetch()** method inside **CalenderController** it will fetch your data and render them on the calender. 

Now Lets handle the click event on each date:
After **eventSources** add **select** function as a property of fullcalender  

        ...select: function(startDate) {
        let eventDate = startDate.startStr
        // Take event data from a prompt alert
        let title = prompt(''Add new event!'')
        if(title === null || title == ''''){
            // Stop the function if value is null
            return;
        }
        fetch(''/create'', {
            method: ''post'',
            body: JSON.stringify({title, eventDate}),
            headers: {
            ''Content-Type'' : ''application/json'',
            ''X-CSRF-TOKEN'' : csrfToken
            },
        })
        .then(e => {
                // refresh and render
                calendar.refetchEvents();
            })
        }

**Click on any day to assign an event to the corresponding date**

Full script: [https://codepen.io/fazley_rabby/pen/WNXYPrr](https://codepen.io/fazley_rabby/pen/WNXYPrr)
   
For video tutorial check this out: 
[![IMAGE_ALT](https://img.youtube.com/vi/p5LOeVsGLSA/0.jpg)](https://www.youtube.com/watch?v=p5LOeVsGLSA&t)

Click here to check the Fullcalender documentation [Fullcalender.io](https://fullcalendar.io/docs/initialize-globals)',
  '{}',
  '',
  'published',
  '2024-05-10'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Handling Large File Uploads in Laravel with Chunked Uploads',
  'handling-large-file-uploads-in-laravel-with-chunked-uploads',
  '',
  '## The Memory Exhaustion Nightmare

When your web application requires users to upload massive files (e.g., raw 4K video footage or gigabyte-sized CSVs), attempting to handle it via a standard `<input type="file">` form submission is a terrible idea.

If a user uploads a 5GB file, PHP attempts to load that massive payload into temporary storage, parse it, and hand it to Laravel. Inevitably, your server hits `upload_max_filesize` or `memory_limit` limits, returning a fatal `502 Bad Gateway` to the user.

Worse, if their internet drops at 99%, they have to restart the 5GB upload from scratch.

To solve this at a senior architectural level, you must implement **Chunked Streaming**.

---

## 1. The Strategy: Client-Side Chunking

Instead of throwing a single 5GB request at the server, we use modern JavaScript (or libraries like Resumable.js / Uppy) to slice the file into 5MB chunks.

The frontend loops through these chunks and sends them sequentially via AJAX. This bypasses server payload limits and allows the upload to pause and resume if the user loses connection.

However, the real engineering challenge happens on the backend: How do you stitch 1,000 separate chunks back into a 5GB file without loading it all into memory?

## 2. The Danger of Array Stitching

A common, dangerous mistake developers make when implementing chunked uploads is storing all the chunks temporarily, loading them into an array, and combining them using a string method. 

```php
// ❌ Fatal Error: Exhausted Memory (Cannot allocate 5GB RAM)
$fileData = '''';
for ($i = 0; $i < $totalChunks; $i++) {
    $fileData .= Storage::disk(''local'')->get("chunk_{$i}");
}
Storage::put(''final.mp4'', $fileData);
```

If you do this, PHP will literally try to hold 5GB of data inside active RAM, immediately crashing your FPM worker.

## 3. The 10x Solution: Stream Appending

To assemble a massive file safely, you must use **PHP Streams**. We open the final destination file in "Append Mode", and slowly stream each individual chunk into it. 

PHP''s memory footprint stays nearly at 0 MB, because the data flows directly from the chunk on disk into the final file without ever sitting in a variable.

```php
public function assembleChunks(Request $request)
{
    $identifier = $request->input(''upload_id'');
    $totalChunks = $request->input(''total_chunks'');
    
    // Create the final destination path
    $finalFilePath = storage_path("app/uploads/final_{$identifier}.mp4");
    
    // Open the final file in Append mode (''a'')
    $finalFile = fopen($finalFilePath, ''a'');

    for ($i = 1; $i <= $totalChunks; $i++) {
        $chunkPath = storage_path("app/tmp/{$identifier}_chunk_{$i}");
        
        // Open the raw chunk in Read mode
        $chunkFile = fopen($chunkPath, ''r'');
        
        // Stream the chunk directly into the final file buffer
        stream_copy_to_stream($chunkFile, $finalFile);
        
        fclose($chunkFile);
        
        // Delete the chunk from disk to reclaim space
        unlink($chunkPath);
    }

    fclose($finalFile);

    return response()->json([''status'' => ''Assembly complete!'']);
}
```

By utilizing `stream_copy_to_stream()`, PHP reads and writes in tiny buffers natively via C. You can use this exact approach to compile a 50GB file on a $5/month VPS with 512MB of RAM, and the server won''t even blink.

## Conclusion

When building applications that process colossal amounts of data, you cannot treat data like variables. You must treat them like pipes. 

By splitting files on the frontend, and expertly stitching them using raw PHP streams on the backend, you effectively make file size limitations totally irrelevant.',
  '{}',
  '',
  'published',
  '2026-04-04T16:03:31'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Hardening Laravel Webhook Consumers Against Distributed Denial of Service',
  'hardening-laravel-webhook-consumers-against-distributed-denial-of-service',
  '',
  '## Introduction
As a seasoned backend engineer, I''ve encountered numerous challenges in designing scalable and secure webhook consumers. One of the most significant concerns is protecting against Distributed Denial of Service (DDoS) attacks, which can overwhelm database connections and bring down entire systems. In this article, I''ll share my approach to hardening Laravel webhook consumers against DDoS attacks, focusing on rapid signature verification, queue-first processing, idempotent handlers, and dynamic rate limiting.

## Problem Statement
Processing massive spikes in payment or event webhooks can be a daunting task. A single misconfigured or malicious webhook can flood your system with requests, exhausting database connections and causing downtime. Traditional security measures, such as IP blocking or rate limiting, can be ineffective against sophisticated DDoS attacks. A more robust approach is required to ensure the integrity and availability of your webhook consumer.

## Architectural Decisions
To mitigate DDoS attacks, I employ a multi-faceted strategy:

* **Rapid signature verification**: Validate webhook signatures as early as possible in the request lifecycle to prevent malicious requests from entering the system.
* **Queue-first processing**: Offload webhook processing to a message queue, allowing for asynchronous handling and preventing database connection exhaustion.
* **Idempotent handlers**: Design handlers to be idempotent, ensuring that processing a webhook multiple times has the same effect as processing it once.
* **Dynamic rate limiting**: Implement adaptive rate limiting to adjust to changing traffic patterns and prevent legitimate webhooks from being blocked.

## Solution
In Laravel, I utilize the `laravel/webhook-server` package to handle webhook signature verification and queue-first processing. For dynamic rate limiting, I leverage the `laravel/rate-limiter` package.

### Rapid Signature Verification
I use the `WebhookServer` middleware to verify signatures:
```php
// app/Http/Middleware/WebhookSignatureVerification.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\WebhookServer\WebhookServer;

class WebhookSignatureVerification
{
    public function handle(Request $request, Closure $next)
    {
        $webhookServer = new WebhookServer();
        if (!$webhookServer->verifySignature($request)) {
            abort(401, ''Invalid webhook signature'');
        }
        return $next($request);
    }
}
```

### Queue-First Processing
I dispatch webhook processing to a message queue using Laravel''s built-in `Queue` facade:
```php
// app/Http/Controllers/WebhookController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;
use App\Jobs\ProcessWebhook;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        Queue::dispatch(new ProcessWebhook($request->all()));
        return response()->json([''message'' => ''Webhook received''], 202);
    }
}
```

### Idempotent Handlers
I design the `ProcessWebhook` job to be idempotent:
```php
// app/Jobs/ProcessWebhook.php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $webhookData;

    public function __construct(array $webhookData)
    {
        $this->webhookData = $webhookData;
    }

    public function handle()
    {
        // Idempotent processing logic
        // ...
    }
}
```

### Dynamic Rate Limiting
I implement dynamic rate limiting using the `laravel/rate-limiter` package:
```php
// app/Http/Middleware/RateLimiting.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades RATElimiter;

class RateLimiting
{
    public function handle(Request $request, Closure $next)
    {
        $limit = RateLimiter::for($request->ip(), 100)->byMinutes(1);
        if ($limit->exceeded()) {
            abort(429, ''Too many requests'');
        }
        return $next($request);
    }
}
```

## Key Takeaways
To harden your Laravel webhook consumer against DDoS attacks:

* Implement rapid signature verification to prevent malicious requests from entering the system.
* Use queue-first processing to offload webhook handling and prevent database connection exhaustion.
* Design idempotent handlers to ensure that processing a webhook multiple times has the same effect as processing it once.
* Implement dynamic rate limiting to adapt to changing traffic patterns and prevent legitimate webhooks from being blocked.

By following these strategies, you can significantly improve the security and scalability of your Laravel webhook consumer, ensuring that it can withstand even the most aggressive DDoS attacks.',
  ARRAY['Laravel','Webhooks','DDoS Protection']::text[],
  '',
  'draft',
  NULL
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Preventing Duplicate Payments and Transactions in Laravel',
  'preventing-duplicate-payments-and-transactions-in-laravel',
  '',
  '## The Nightmare of Double Charges

In e-commerce, few things ruin customer trust faster than charging their credit card twice for a single click. 

As applications scale, preventing duplicate payments becomes an incredibly complex distributed systems problem. Users impatience leads to double-clicking "Checkout", networks latency triggers automated retry loops from payment gateways, and concurrent background workers frequently trip over each other. 

In this case study, I''ll walk through exactly how I engineer transaction safety in Laravel to ensure that no matter how many times a payload hits the server simultaneously, a payment is only captured once. 

---

## 1. The Race Condition

Imagine an impatient user double-clicking the "Buy" button. Two HTTP requests fire simultaneously.
By the time Request B checks the database to see if an order exists, Request A is currently talking to Stripe but hasn''t saved the successful charge to the database yet. Request B thinks the coast is clear and fires a second charge. The user just paid double.

To prevent this, you cannot rely entirely on checking the database. You must use **Distributed Atomic Locks**.

### The Fix: Cache Atomic Locks

Laravel provides an incredibly powerful `Cache::lock()` mechanism backed by Redis. By locking the user''s specific transaction intent, we force overlapping requests into single-file lines.

```php
use Illuminate\Support\Facades\Cache;

public function checkout(Request $request) {
    $idempotencyKey = $request->header(''X-Idempotency-Key'');
    $lockKey = "checkout:lock:{$idempotencyKey}";

    // Acquire a lock for exactly 10 seconds.
    // If another request holds the lock, block for up to 3 seconds before failing.
    $lock = Cache::lock($lockKey, 10);

    if (! $lock->block(3)) {
        abort(429, ''A transaction is already processing.'');
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
Schema::create(''payments'', function (Blueprint $table) {
    $table->id();
    $table->string(''idempotency_key'', 64)->unique();
    $table->string(''stripe_charge_id'');
    // ...
});
```

Inside the application, the payment logic is wrapped tightly in a pessimistic database transaction utilizing `lockForUpdate()`. This locks the specific rows being read so that background webhook jobs trying to update the exact same order are forced to wait.

```php
DB::transaction(function () use ($idempotencyKey, $user) {
    // Pessimistic write lock: blocks other processes from modifying this user''s balance
    $wallet = Wallet::where(''user_id'', $user->id)->lockForUpdate()->first();

    // The unique constraint will throw a QueryException if the key exists
    $payment = Payment::create([
        ''idempotency_key'' => $idempotencyKey,
        ''amount'' => 5000
    ]);
    
    // ... process business logic securely
});
```

## Conclusion

Payment safety relies entirely on anticipating race conditions. 

By generating unique Idempotency Keys on the frontend, gating access to the execution thread via **Redis Atomic Locks**, and enforcing state with **Pessimistic Database Transactions** and **UNIQUE keys**, your application becomes bulletproof to double-charges. Building a financial system requires assuming the worst traffic conditions, and strictly locking the pathways to success.',
  '{}',
  '',
  'published',
  '2026-04-03T17:24:25'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Routine Management System',
  'routine-management-system',
  'A deep dive into the Routine Management System project',
  '### Project Overview

This project was created using Laravel 7 and mysql on my last semester as my final year project. The database design was completely done my me as my first laravel project I tried my best to make it as optimize as possible. Most of the complicated DB queries created with raw query as I was not much familiar with eloquent relationships at the beginning but recently I have worked with a team and improved my coding structure as well as eloquent relationship knowledge. This project was appreciated by my university faculty as it''s almost a new concept of migrating a manual routine system to an automated one. As I can say this was not completed entriely because I was working alone in this project but I can surely say that I have gained alot of real world experience.

<cite>(I am working on this project currently to modify unoptimized codes and Integrating AdminLTE 3)</cite>

### The scope for works include the followings:

<ul>
<li>System study of the manual system practiced for class routine management.</li>
<li>Design and Development a dynamic web application for faculty.</li>
<li>Implementation of Class Routine Management System.</li>
<li>Maintenance of the Class Routine Management System.</li>
</ul>

<br>

<h2 class="text-center">Some Screenshots</h2>

### Teachers

<img src="https://user-images.githubusercontent.com/26044286/118698795-a3263d80-b832-11eb-91b3-6989a31ff063.png" alt="" width="100%"/>

### Teacher Update

<img src="https://user-images.githubusercontent.com/26044286/118699254-221b7600-b833-11eb-9c52-86239f863a9f.png" alt="" width="100%"/>

### Batch Wise Student

<img src="https://user-images.githubusercontent.com/26044286/118699326-36f80980-b833-11eb-826f-03087c64ba15.png" alt="" width="100%"/>

### Time Slot

<img src="https://user-images.githubusercontent.com/26044286/118699334-38c1cd00-b833-11eb-8eaf-edc33e0beede.png" alt="" width="100%"/>

### Courses

<img src="https://user-images.githubusercontent.com/26044286/118699339-39f2fa00-b833-11eb-97ff-dd1f9fcb8525.png" alt="" width="100%"/>

### Time Wise Class Slots

<img src="https://user-images.githubusercontent.com/26044286/118699347-3cedea80-b833-11eb-8a85-75f27a195c7b.png" alt="" width="100%"/>

### Teacher / Batch wise routine list

<img src="https://user-images.githubusercontent.com/26044286/118699383-47a87f80-b833-11eb-9270-c2b77e254115.png" alt="" width="100%"/>

### Batch Routine PDF

<img src="https://user-images.githubusercontent.com/26044286/118699387-49724300-b833-11eb-94f7-067a2237686f.png" alt="" width="100%"/>

### Batch Routine View

<img src="https://user-images.githubusercontent.com/26044286/118699390-4a0ad980-b833-11eb-9b9f-762c836437f9.png" alt="" width="100%"/>

### Teacher Routine PDF

<img src="https://user-images.githubusercontent.com/26044286/118699394-4b3c0680-b833-11eb-8645-e28171811535.png" alt="" width="100%"/>

### Teacher Routine View

<img src="https://user-images.githubusercontent.com/26044286/118699396-4bd49d00-b833-11eb-8412-41064e4362f4.png" alt="" width="100%"/>

### Main Routine Sheet

<img src="https://user-images.githubusercontent.com/26044286/118699397-4c6d3380-b833-11eb-80cb-79d7ec49edf4.png" alt="" width="100%"/>

### Day WIse Time Slot with Class Slot Count

<img src="https://user-images.githubusercontent.com/26044286/118699400-4d05ca00-b833-11eb-8c7f-e0023804417e.png" alt="" width="100%"/>

### Modules:

| **SL** | **Module Title**                            | **Description**                                                                                                                                                                                                                                                                                                                                 |
| ------ | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | Batch                                       | <ol><li>Create Batch with Department, Batch No. and Shift</li><li>Edit / Delete Batch </li></ol>                                                                                                                                                                                                                                                |
| 2      | Departments                                 | <ol><li> Create Departments (example: CSE, MBA etc.) </li><li>  Edit / Delete Departments </li> </ol>                                                                                                                                                                                                                                           |
| 3      | Courses                                     | <ol><li>Create Courses with Course Code, Credit and Course type (example: Data Communication-CSE435-3-Theory etc.) </li> <li>Edit / Delete Courses</li> <ol>                                                                                                                                                                                    |
| 4      | Rooms                                       | <ol> <li>Create Rooms with Building, Room no, Capacity (example: A-101-Theory, B-203-Lab etc.)</li> <li>Edit / Delete Rooms</li> </ol>                                                                                                                                                                                                          |
| 5      | Sections                                    | <ol><li>Create different sections and their sub sections including their type (example: A-Theory, A1-Lab)</li> <li>Edit / Delete Sections</li> </ol>                                                                                                                                                                                            |
| 6      | Sessions &amp; Yearly Sessions              | <ol><li>Create Sessions (example: Fall, Summer, Spring) </li><li>Edit / Delete Sessions3. Generate Yearly Sessions every year which includes sessions (example: Fall-2020, Summer-2020, Spring-2020)</li><li>Activate or Deactivate yearly sessions</li></ol>                                                                                   |
| 7      | Teacher Ranks                               | <ol><li> Create Teacher Ranks (example: Lecturer, Sr. Lecturer)</li><li>Edit / Delete Teacher Ranks</li></ol>                                                                                                                                                                                                                                   |
| 8      | Teacher Management                          | <ol><li> Add New Teacher with their corresponding information which includes role, rank and photo etc. </li><li>Edit / Delete Teacher Data</li><li>Assign teachers off day</li><li>Assigning teachers in routine committee</li><li>Inviting Teachers with expire time of accessing the main sheet</li><li>Revoke access of main sheet</li></ol> |
| 9      | Teacher Workloads                           | <ol><li>Assign courses to teachers including the yearly session</li><li>Edit / Delete Workload Data </li> </ol>                                                                                                                                                                                                                                 |
| 10     | Student Management Batch &amp; Section Wise | <ol><li>Assign number of students in a batch including the yearly session and shifts</li><li>Assign number of students theory and lab wise </li><li>Edit / Delete Assigned Data </li> </ol>                                                                                                                                                     |
| 11     | Time Slot Management                        | <ol><li>Create Time Slots by Start time and end time</li><li>Edit / Delete time slots</li></ol>                                                                                                                                                                                                                                                 |
| 12     | Course Offers                               | <ol><li>Assign Courses to Batch with sessions</li><li>Edit / Delete Course offers data</li></ol>                                                                                                                                                                                                                                                |
| 13     | Day wise time &amp; Class slot management   | <ol><li>Assign Time Slots to Days</li><li>Assign Class Slots to Day and time slot</li><li>Edit Information of day</li></ol>                                                                                                                                                                                                                     |
| 14     | Assign Data in Main Sheet                   | <ol><li>Assign data (Teacher, Course, Room) in main sheet</li><li>Edit Assigned Data</li></ol>                                                                                                                                                                                                                                                  |
| 15     | Routine View &amp; Download                 | <ol><li>List view for batch and teachers</li><li>Search Teacher and batch view</li><li>Download as PDF</li></ol>                                                                                                                                                                                                                                |

### Installation

After cloning this repo create an .env file and copy everything from .env.example<br>

<pre> cp .env.example .env </pre>

It will create a copy of .env.example as .env <br><br>
Now open the .env file you just created and give a database name on DB_DATABASE as you want<br>
Suppose the database name is routine<br>
The database configuration will look like this<br>

<pre>DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=routine
DB_USERNAME=root
DB_PASSWORD=</pre>

After that create a database named as "routine" which I used as an example above <br><br>
Now install all composer packages <br>

<pre> composer install </pre>

Now generate an APP_KEY <br>

<pre> php artisan key:generate </pre>

Then run migration as well as db:seed command to get some pre-existing data to get started with the project<br>

<pre> php artisan migrate:fresh --seed </pre>

Now you can serve the project or run with xampp anyway you prefer<br><br>
To serve with artisan <br>

<pre> php artisan serve </pre>

Now you can run the project with localserver accessing this url below:

<pre> http://127.0.0.1:8000 </pre> 

**Admin** Credentaials:

<table>
<tbody>
<tr>
<td>Username</td>
<td>superadmin</td>
</tr>
<tr>
<td>Password</td>
<td>123456</td>
</tr>
</tbody>
</table>

**Teacher/User** Credentaials:

<table>
<tbody>
<tr>
<td>Username</td>
<td>maqsudur_rahman</td>
</tr>
<tr>
<td>Password</td>
<td>123456</td>
</tr>
</tbody>
</table>',
  '{}',
  '',
  'published',
  '2024-04-20'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Running Laravel in Production with Docker: Lessons Learned',
  'running-laravel-in-production-with-docker-lessons',
  '',
  '## The Reality of Dockerizing PHP

Running Laravel on local using Docker (via Laravel Sail or custom containers) is a beautifully smooth experience. Running it in a highly available production environment is a completely different beast. 

When engineers first transition to deploying Dockerized PHP applications, they treat the container like a VPS. This mindset leads to massive image sizes, memory leaks, and agonizingly slow deployment times.

Here are the critical architectural lessons I''ve learned from running Laravel Docker containers in production.

---

## 1. Multi-Stage Builds & OPcache

A production PHP container should not contain Node.js, NPM, or Composer dev dependencies. Every megabyte you push to your container registry increases scale-out time during auto-scaling procedures.

To solve this, you must use **Multi-Stage Builds**.

In this pattern, we use an initial container to install dependencies and compile frontend assets, and a final ultra-thin container that only copies the raw compiled artifacts.

Furthermore, we must hardcode `OPcache` for maximum throughput.

```dockerfile
# Stage 1: Build Dependencies
FROM composer:2.6 as vendor
WORKDIR /app
COPY composer.json composer.lock ./
# Ignore dev dependencies and optimize autoloader natively
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Stage 2: Production PHP FPM
FROM php:8.3-fpm-alpine
WORKDIR /var/www/html

# Install required PHP extensions (pdo, redis, etc.)
RUN docker-php-ext-install pdo_mysql opcache

# Copy optimized vendor from the previous stage
COPY --from=vendor /app/vendor/ /var/www/html/vendor/
COPY . .

# Force OPcache to cache everything forever, never polling for changes
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
 && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini

# Cache configuration natively for Laravel
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache
```

By explicitly turning off `opcache.validate_timestamps`, PHP will never check the disk to see if a file was updated. The code is loaded into RAM permanently until the container is destroyed, vastly reducing disk I/O.

---

## 2. Managing Background Workers (The Supervisor Dilemma)

Laravel relies heavily on queues and scheduled tasks. However, Docker’s primary philosophy is **one process per container**.

If you try to run `php-fpm` (for web traffic) and `php artisan queue:work` inside the exact same container, you violate this principle. If the queue worker crashes, the container orchestration system won''t know because the web process is still technically alive.

### The Fix: Process Isolation

Instead of relying on `supervisord` to run multiple things inside one container, I deploy the exact same Docker image three times within `docker-compose` or Kubernetes, overriding the `command` constraint.

```yml
# docker-compose.prod.yml
services:
  web:
    image: my-laravel-app:latest
    command: php-fpm
    ports:
      - "9000:9000"

  worker:
    image: my-laravel-app:latest
    command: php artisan queue:work redis --sleep=3 --tries=3

  scheduler:
    image: my-laravel-app:latest
    command: crond -f -l 8
```

This ensures complete topological isolation. If your workers run out of memory processing a massive PDF job, that container dies and restarts independently, without dropping a single active web request.

---

## Conclusion

Dockerizing Laravel for production isn''t just about wrapping your application in a `.yml` file. It''s about optimizing PHP for read-only environments, brutally isolating background jobs, and compiling away disk I/O bottlenecks.

Once you stop treating your containers like miniature servers and start treating them as immutable, single-purpose execution environments, Laravel scales beautifully.',
  '{}',
  '',
  'published',
  '2026-03-30T14:00:00'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'How I Set Up a Secure Production VPS for a Dockerized Laravel App',
  'secure-production-vps-dockerized-laravel',
  'A guide on setting up a secure production VPS for a Dockerized Laravel app',
  '> [!tip] 💡
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
• Real-world DevOps decision making',
  '{}',
  '',
  'published',
  '2025-01-31'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Solving the Read-After-Write Consistency Problem in Laravel with Replicas',
  'solving-the-read-after-write-consistency-problem-in-laravel-with-replicas',
  '',
  '# Solving the Read-After-Write Consistency Problem in Laravel with Replicas

## Introduction
As a senior backend engineer, I''ve encountered my fair share of challenges when scaling Laravel applications to meet growing traffic demands. One common issue is ensuring read-after-write consistency when using database replicas to offload reads. In this post, I''ll share my experience solving this problem in a production environment, highlighting the trade-offs and solutions that worked for our team.

## The Problem: Read-After-Write Consistency
When using database replicas to scale reads, there''s a risk of stale data being returned to the user, causing UI glitches and inconsistent behavior. This occurs when a write operation is performed on the primary database, but the replica hasn''t yet been updated. To mitigate this, we need to ensure that reads are routed to the primary database or a replica that''s guaranteed to have the latest data.

## Architectural Decisions
Our application uses a combination of sticky sessions and manual connection switching to achieve read-after-write consistency. Here are the key decisions we made:
* **Sticky sessions**: We use a load balancer to direct incoming requests to a specific web server, ensuring that subsequent requests from the same client are routed to the same server. This allows us to maintain a consistent connection to the primary database or a designated replica.
* **Manual connection switching**: We use Laravel''s built-in database connection features to manually switch between the primary database and replicas based on the type of request. For example, we use the primary database for write operations and a replica for read-only operations.

## The Solution
To implement manual connection switching, we created a custom database connection resolver that determines which connection to use based on the request type. Here''s an example code snippet:
```php
// app/Database/ConnectionResolver.php

namespace App\Database;

use Illuminate\Database\Connectors\ConnectionFactory;
use Illuminate\DatabasegetConnection;

class ConnectionResolver
{
    public function resolveConnection($request)
    {
        if ($request->isMethod(''POST'') || $request->isMethod(''PUT'') || $request->isMethod(''DELETE'')) {
            // Use primary database for write operations
            return ''primary'';
        } else {
            // Use replica for read-only operations
            return ''replica'';
        }
    }
}
```
We then registered the connection resolver in our Laravel application:
```php
// config/database.php

''connections'' => [
    ''primary'' => [
        ''driver'' => ''mysql'',
        ''host'' => env(''DB_HOST_PRIMARY''),
        ''port'' => env(''DB_PORT''),
        ''database'' => env(''DB_DATABASE''),
        ''username'' => env(''DB_USERNAME''),
        ''password'' => env(''DB_PASSWORD''),
    ],
    ''replica'' => [
        ''driver'' => ''mysql'',
        ''host'' => env(''DB_HOST_REPLICA''),
        ''port'' => env(''DB_PORT''),
        ''database'' => env(''DB_DATABASE''),
        ''username'' => env(''DB_USERNAME''),
        ''password'' => env(''DB_PASSWORD''),
    ],
],

''resolver'' => [
    ''class'' => \App\Database\ConnectionResolver::class,
],
```
## Trade-Offs and Eventually Consistent Reads
While our solution ensures read-after-write consistency, it comes with trade-offs. Using sticky sessions and manual connection switching can increase complexity and may lead to hotspots in our infrastructure. Additionally, we''ve had to accept eventually consistent reads, where data may be stale for a short period after a write operation. However, this trade-off is acceptable for our use case, as the benefits of scaled reads and improved performance outweigh the occasional stale data.

## Key Takeaways
To summarize, our solution to the read-after-write consistency problem in Laravel with replicas involves:
* Using sticky sessions to maintain a consistent connection to the primary database or a designated replica
* Implementing manual connection switching to route write operations to the primary database and read-only operations to a replica
* Accepting eventually consistent reads and the associated trade-offs

By applying these strategies, we''ve been able to scale our Laravel application to meet growing traffic demands while ensuring a consistent user experience. As with any solution, it''s essential to carefully evaluate the trade-offs and adjust the approach as needed to suit your specific use case.',
  '{}',
  '',
  'draft',
  NULL
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Some of my favorite fonts',
  'some-of-my-favorite-fonts',
  'A list of free fonts for developers and designers',
  '<style>
.fonts a{font-size:1.1rem;text-align:center}.fonts a img{border:3px solid transparent}.fonts a:hover img{border:3px dashed}html.dark .fonts a:hover img{border:2px dashed;outline:transparent solid 1px}html.dark .fonts a img{border:2px solid transparent;outline:solid 1px}
</style>

### List of free fonts 

<p>
These are some of my personal favorite fonts that I have collected over the years. You can use them on your websites. Most importantly all of them are free to use. I am providing the source links as well. For the developers and coders out there I have added a list of monospace fonts as well. *Click on the images to view the sources and download the font from there.
</p>

#### Sans Serif Fonts

<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 fonts">
    <a href="https://fonts.google.com/specimen/Inter" target="_blank">Inter<img class="preview m-0 card-gradient" src="/images/uploads/Inter.png"></p></a>
    <a href="https://vercel.com/font/sans" target="_blank">Geist Sans<img class="preview m-0" src="/images/uploads/Geist Sans.png"></p></a>
    <a href="https://fonts.google.com/specimen/Sen" target="_blank">Sen<img class="preview m-0" src="/images/uploads/Sen.png"></p></a>
    <a href="https://fonts.google.com/specimen/Jost" target="_blank">Jost<img class="preview m-0" src="/images/uploads/Jost.png"></p></a>
    <a href="https://fonts.google.com/specimen/Lexend" target="_blank">Lexend<img class="preview m-0" src="/images/uploads/Lexend.png"></p></a>
    <a href="https://fonts.google.com/specimen/Figtree" target="_blank">Figtree<img class="preview m-0" src="/images/uploads/Figtree.png"></p></a>
    <a href="https://fonts.google.com/specimen/Albert Sans" target="_blank">Albert Sans<img class="preview m-0" src="/images/uploads/Albert Sans.png"></p></a>
    <a href="https://fonts.google.com/specimen/Overpass" target="_blank">Overpass<img class="preview m-0" src="/images/uploads/Overpass.png"></p></a>
    <a href="https://fonts.google.com/specimen/Outfit" target="_blank">Outfit<img class="preview m-0" src="/images/uploads/Outfit.png"></p></a>
    <a href="https://fonts.google.com/specimen/Fira Sans" target="_blank">Fira Sans<img class="preview m-0" src="/images/uploads/Fira Sans.png"></p></a>
    <a href="https://fonts.google.com/specimen/IBM Plex Sans" target="_blank">IBM Plex Sans<img class="preview m-0" src="/images/uploads/IBM Plex Sans.png"></p></a>
    <a href="https://fonts.google.com/specimen/Hanken Grotesk" target="_blank">Hanken Grotesk<img class="preview m-0" src="/images/uploads/Hanken Grotesk.png"></p></a>
    <a href="https://fonts.google.com/specimen/Plus Jakarta Sans" target="_blank">Plus Jakarta Sans<img class="preview m-0" src="/images/uploads/Plus Jakarta Sans.png"></p></a>
    <a href="https://fonts.google.com/specimen/Be Vietnam Pro" target="_blank">Be Vietnam Pro<img class="preview m-0" src="/images/uploads/Be Vietnam Pro.png"></p></a>
    <a href="https://fonts.google.com/specimen/Rethink Sans" target="_blank">Rethink Sans<img class="preview m-0" src="/images/uploads/Rethink Sans.png"></p></a>
    <a href="https://fonts.google.com/specimen/Inclusive Sans" target="_blank">Inclusive Sans<img class="preview m-0" src="/images/uploads/Inclusive Sans.png"></p></a>
    <a href="https://fonts.google.com/specimen/Instrument Sans" target="_blank">Instrument Sans<img class="preview m-0" src="/images/uploads/Instrument Sans.png"></p></a>
    <a href="https://fonts.google.com/specimen/Commissioner" target="_blank">Commissioner<img class="preview m-0" src="/images/uploads/Commissioner.png"></p></a>
    <a href="https://fonts.google.com/specimen/Work Sans" target="_blank">Work Sans<img class="preview m-0" src="/images/uploads/Work Sans.png"></p></a>
    <a href="https://fonts.google.com/specimen/Space Grotesk" target="_blank">Space Grotesk<img class="preview m-0" src="/images/uploads/Space Grotesk.png"></p></a>
</div>


### Mono Space Fonts
<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 fonts">
    <a href="https://vercel.com/font/mono" target="_blank">Geist Mono<img class="preview m-0" src="/images/uploads/Geist Mono.png"></p></a>
    <a href="https://fonts.google.com/specimen/Fira Code" target="_blank">Fira Code<img class="preview m-0" src="/images/uploads/Fira Code.png"></p></a>
    <a href="https://fonts.google.com/specimen/Jetbrains Mono" target="_blank">Jetbrains Mono<img class="preview m-0" src="/images/uploads/Jetbrains Mono.png"></p></a>
    <a href="https://github.com/source-foundry/Hack/releases/" target="_blank">Hack<img class="preview m-0" src="/images/uploads/Hack.png"></p></a>
    <a href="https://fonts.google.com/specimen/IBM Plex Mono" target="_blank">IBM Plex Mono<img class="preview m-0" src="/images/uploads/IBM Plex Mono.png"></p></a>
    <a href="https://fonts.google.com/specimen/Ubuntu Mono" target="_blank">Ubuntu Mono<img class="preview m-0" src="/images/uploads/Ubuntu Mono.png"></p></a>
    <a href="https://fonts.google.com/specimen/Overpass Mono" target="_blank">Overpass Mono<img class="preview m-0" src="/images/uploads/Overpass Mono.png"></p></a>
    <a href="https://fonts.google.com/specimen/Fragment Mono" target="_blank">Fragment Mono<img class="preview m-0" src="/images/uploads/Fragment Mono.png"></p></a>
    <a href="https://fonts.google.com/specimen/Inconsolata" target="_blank">Inconsolata<img class="preview m-0" src="/images/uploads/Inconsolata.png"></p></a>
    <a href="https://monaspace.githubnext.com/" target="_blank">Monaspace Neon<img class="preview m-0" src="/images/uploads/Monaspace Neon.png"></p></a>
    <a href="https://github.com/subframe7536/maple-font/releases" target="_blank">Maple Mono<img class="preview m-0" src="/images/uploads/Maple Mono.png"></p></a>
    <a href="https://input.djr.com/download/" target="_blank">Input<img class="preview m-0" src="/images/uploads/Input.png"></p></a>
</div>',
  '{}',
  '',
  'published',
  '2024-03-15'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'System stats on terminal (debian - ubuntu)',
  'system-stats-terminal',
  'How to view system stats on terminal for Debian and Ubuntu',
  'This document explains how to install prerequisites, create the script, fix permissions, and run it safely on a **Proxmox host**, including with:

```javascript
watch -n 1 stats.sh
```

## **1️⃣ Prerequisites**

Proxmox is Debian-based. Ensure the required tools are installed.

**Update system**

```javascript
apt update
```

**Install required packages**

```javascript
sudo apt install -y procps lm-sensors coreutils iproute2
```

**2️⃣ Create script directory**

```javascript
mkdir -p /usr/local/bin/battery
```

**3️⃣ Create the script file**

```javascript
nano /usr/local/bin/battery/stats.sh
```

**
4️⃣ Paste the FULL script**

```javascript
#!/bin/bash
set -u

############################
# BATTERY STATUS
############################

echo "🔋 Battery status"
echo "------------------"

BAT_TOTAL_ENERGY=0
BAT_TOTAL_RATE=0
BAT_TIME_LEFT="N/A"
BAT_ON_BATTERY=0

for bat in /sys/class/power_supply/BAT*; do
  if [ -f "$bat/capacity" ]; then
    BAT_NAME=$(basename "$bat")
    BAT_CAPACITY=$(cat "$bat/capacity")
    BAT_STATUS=$(cat "$bat/status")
    BAT_ENERGY_NOW=$(cat "$bat/energy_now" 2>/dev/null || echo 0)
    BAT_POWER_NOW=$(cat "$bat/power_now" 2>/dev/null || echo 0)

    BAT_TOTAL_ENERGY=$((BAT_TOTAL_ENERGY + BAT_ENERGY_NOW))
    BAT_TOTAL_RATE=$((BAT_TOTAL_RATE + BAT_POWER_NOW))

    echo "$BAT_NAME → $BAT_CAPACITY% ($BAT_STATUS)"

    if [ "$BAT_STATUS" = "Discharging" ]; then
      BAT_ON_BATTERY=1
    fi
  fi
done

BAT_POWER_W=$(awk "BEGIN {printf \"%.2f\", $BAT_TOTAL_RATE/1000000}")

if [ "$BAT_ON_BATTERY" -eq 1 ] && [ "$BAT_TOTAL_RATE" -gt 0 ]; then
  BAT_HOURS=$(awk "BEGIN {printf \"%.4f\", $BAT_TOTAL_ENERGY/$BAT_TOTAL_RATE}")
  BAT_TIME_LEFT=$(awk "BEGIN {
    h=int($BAT_HOURS);
    m=int(($BAT_HOURS-h)*60);
    printf \"%02d:%02d\", h, m
  }")
fi

echo
echo "⚡ Power draw: ${BAT_POWER_W} W"

if [ "$BAT_ON_BATTERY" -eq 1 ]; then
  echo "⏱ Estimated time left: ${BAT_TIME_LEFT}"
else
  echo "🔌 On AC power"
fi

############################
# SYSTEM STATUS
############################

echo
echo "🖥 System status"
echo "------------------"

# CPU usage
CPU_IDLE_PCT=$(top -bn1 | awk -F'','' ''/Cpu\(s\)/ {print $4}'' | awk ''{print $1}'')
CPU_USAGE_PCT=$(awk "BEGIN {printf \"%.1f\", 100 - $CPU_IDLE_PCT}")
echo "🔥 CPU usage: ${CPU_USAGE_PCT}%"

# CPU temperature
CPU_TEMP=$(sensors 2>/dev/null | awk ''/Package id 0:/ {print $4}'' | head -n1)
[ -z "$CPU_TEMP" ] && CPU_TEMP="N/A"
echo "🌡 CPU temp: $CPU_TEMP"

# RAM usage (watch-safe)
RAM_TOTAL_MB=$(awk ''/MemTotal/ {printf "%.0f", $2/1024}'' /proc/meminfo)
RAM_AVAIL_MB=$(awk ''/MemAvailable/ {printf "%.0f", $2/1024}'' /proc/meminfo)
RAM_USED_MB=$((RAM_TOTAL_MB - RAM_AVAIL_MB))
RAM_USED_PCT=$(awk "BEGIN {printf \"%.2f\", ($RAM_USED_MB/$RAM_TOTAL_MB)*100}")

echo "🧠 RAM: ${RAM_USED_MB}MB / ${RAM_TOTAL_MB}MB (${RAM_USED_PCT}%)"

# Disk usage (root filesystem)
DISK_ROOT_USAGE=$(df -h / | awk ''NR==2 {print $3 " / " $2 " (" $5 ")"}'')
echo "💾 Disk: $DISK_ROOT_USAGE"

# Network speed (1-second sample)
NET_IFACE=$(ip route | awk ''/default/ {print $5; exit}'')

NET_RX_1=$(cat /sys/class/net/$NET_IFACE/statistics/rx_bytes)
NET_TX_1=$(cat /sys/class/net/$NET_IFACE/statistics/tx_bytes)
sleep 1
NET_RX_2=$(cat /sys/class/net/$NET_IFACE/statistics/rx_bytes)
NET_TX_2=$(cat /sys/class/net/$NET_IFACE/statistics/tx_bytes)

NET_RX_KB_S=$(awk "BEGIN {printf \"%.1f\", ($NET_RX_2-$NET_RX_1)/1024}")
NET_TX_KB_S=$(awk "BEGIN {printf \"%.1f\", ($NET_TX_2-$NET_TX_1)/1024}")

echo "🌐 Network ($NET_IFACE): ↓ ${NET_RX_KB_S} KB/s ↑ ${NET_TX_KB_S} KB/s"
```

**
Save and exit nano**


```javascript
Ctrl + O → Enter
Ctrl + X
```

**
5️⃣ Make the script executable**


```javascript
chmod +x /usr/local/bin/battery/stats.sh
```

**
6️⃣ Run the script**


```javascript
/usr/local/bin/battery/stats.sh
```

## **7️⃣ Run from anywhere (optional)**

If /usr/local/bin is in PATH (default on Proxmox):

```javascript
stats.sh
```

To remove .sh extension:

```javascript
mv /usr/local/bin/battery/stats.sh /usr/local/bin/stats
chmod +x /usr/local/bin/stats
```

Run:

```javascript
stats
```

**
8️⃣ Use with watch (real-time monitoring)**

```javascript
watch -n 1 stats
```

**
9️⃣ Example output**

```javascript
🔋 Battery status
BAT0 → 86% (Discharging)

⚡ Power draw: 12.10 W
⏱ Estimated time left: 03:28

🖥 System status
🔥 CPU usage: 5.3%
🌡 CPU temp: +48.0°C
🧠 RAM: 6123MB / 7684MB (79.74%)
💾 Disk: 18G / 94G (21%)
🌐 Network (eno1): ↓ 41.8 KB/s ↑ 3.2 KB/s
```',
  '{}',
  '',
  'published',
  '2024-02-10'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Taming Concurrency: Handling Race Conditions in Laravel',
  'taming-concurrency-handling-race-conditions-in-laravel',
  '',
  '## The Invisible Danger of Concurrent Requests

In standard web development, we construct features linearly: check if X exists, subtract Y, save X. 

But when you scale beyond a single web server, this linear thinking breaks horribly. If two different people click "Buy" at the exact same millisecond on a product with exactly `1` item remaining in inventory, PHP will process both requests parallelly. Both requests will check the database, both will see `1` item remaining, both will subtract `1`, and both will successfully save.

Your database now reads `-1` inventory, and you have sold a product you do not own.

To tame concurrency in Laravel, we have to look past the application layer and implement strict database and cache locks.

---

## 1. Pessimistic Locking (lockForUpdate)

The absolute most reliable way to prevent two PHP threads from modifying the same record simultaneously is utilizing InnoDB''s row-level locks.

In Laravel, attaching `->lockForUpdate()` to a query inside a transaction tells the database: *"Do not let any other connection read or write this specific row until my transaction closes."*

```php
use Illuminate\Support\Facades\DB;

public function checkout(int $productId)
{
    // A transaction is REQUIRED for lockForUpdate to work
    DB::transaction(function () use ($productId) {
    
        // Thread B will pause exactly here and wait for Thread A to finish
        $product = Product::where(''id'', $productId)->lockForUpdate()->first();

        abort_if($product->stock <= 0, 400, ''Out of stock!'');

        $product->decrement(''stock'');
        
        // Transaction closes here, automatically releasing the SQL lock
    });
}
```

If Thread B attempts to select the product while Thread A is running, Thread B is literally paused by MySQL. It waits until Thread A commits, then reads the *newly updated* stock of `0`, instantly failing the `abort_if`.

### The Deadlock Threat
While pessimistic locking works flawlessly for simple writes, it can trigger **Deadlocks** if you lock multiple rows in different orders. For example, if Thread A locks User and then Product, while Thread B locks Product and then User, they will infinitely wait for each other, crashing the database connection. 

To prevent this, always lock related database rows in alphabetical order of their table names.

## 2. Distributed Application Locking (Atomic Locks)

For operations that don''t involve database writes—like preventing a background worker from hitting a rate-limited API twice, or stopping duplicate file generation—you cannot use database locks. 

Instead, you use Distributed Cache Locks via Redis.

```php
use Illuminate\Support\Facades\Cache;

public function generateMonthlyReport()
{
    // Obtain a lock for this specific month for 60 seconds
    $lockKey = ''report_generation:'' . now()->format(''Y-m'');
    
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

By treating every critical read-write operation as if 100 people are executing it simultaneously, and proactively wielding `lockForUpdate` and `Cache::lock`, you bridge the gap between "code that works" and "code that scales reliably."',
  '{}',
  '',
  'published',
  '2026-03-31T10:00:00'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Tracking Website Visitors with a Telegram Bot (Astro)',
  'telegram-visitor-tracker-astro',
  'How to implement a telegram bot with js in Astro',
  'A simple way to get notified whenever someone visits your website is by
sending a message to **Telegram**.\
This guide shows how to add a **Telegram visitor tracker** to an Astro
site.

------------------------------------------------------------------------

## 1. Create a Telegram Bot

1.  Open Telegram and search for **@BotFather**
2.  Run:

```
    /start
    /newbot
```
3.  Give your bot a name and username.

BotFather will return a **bot token** like:

    123456789:AAxxxxxxxxxxxxxxxxxxxxx

Save this token.

------------------------------------------------------------------------

## 2. Get Your Chat ID

1.  Open your bot and send it any message.
2.  Open this URL in your browser:

```
    https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
```
Example:

    https://api.telegram.org/bot123456:ABCDEF/getUpdates

You will see something like:

``` json
"chat": {
  "id": 123456789
}
```

That number is your **chat_id**.

------------------------------------------------------------------------

## 3. Add Environment Variables

Create a `.env` file in your project root:

    TELEGRAM_TOKEN=your_bot_token
    TELEGRAM_CHAT_ID=your_chat_id

Restart your dev server after adding this.

------------------------------------------------------------------------

## 4. Create an API Endpoint

Create the file:

    src/pages/api/track.ts

Example implementation:

``` ts
export const prerender = false;

export async function POST({ request, clientAddress }) {

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    clientAddress ||
    "Unknown";

  const userAgent = request.headers.get("user-agent") || "Unknown";

  const body = await request.json().catch(() => ({}));

  const message = `
🚨 NEW VISITOR

IP: ${ip}

Device
Platform: ${body.platform ?? "Unknown"}
Language: ${body.language ?? "Unknown"}

User-Agent:
${userAgent}
`;

  const token = import.meta.env.TELEGRAM_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });

  return new Response(JSON.stringify({ ok: true }));
}
```

------------------------------------------------------------------------

## 5. Trigger the Tracker from the Frontend

Add this script to your layout or footer.

``` html
<script>
if (!sessionStorage.getItem("tracked")) {
  fetch("/api/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      platform: navigator.platform,
      language: navigator.language
    })
  }).catch(()=>{});

  sessionStorage.setItem("tracked", "1");
}
</script>
```

This ensures the request only runs **once per visitor session**.

------------------------------------------------------------------------

## 6. Example Telegram Message

    🚨 NEW VISITOR

    IP: 103.xx.xx.xx

    Device
    Platform: MacIntel
    Language: en-US

    User-Agent
    Mozilla/5.0 (Macintosh; Intel Mac OS X)

------------------------------------------------------------------------

## Notes

-   Works well for **personal sites and portfolios**
-   Prevents multiple requests using `sessionStorage`
-   Can be extended with location APIs and device detection',
  '{}',
  '',
  'published',
  '2026-03-14'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Why most Laravel APIs break at scale and how I fix them in production',
  'why-most-laravel-apis-break-at-scale-and-how-i-fix',
  '',
  '## The Silent Killers of Laravel APIs

As a backend engineer, I''ve watched plenty of well-architected Laravel APIs crash and burn the moment they hit real traffic. In development, everything is fast. Ten records in a database respond in milliseconds. But what happens when that table hits 10 million rows, and you have 5,000 concurrent users?

When a Laravel API breaks at scale, it almost never happens at the framework level. It happens at the data extraction layer.

Here are the two primary reasons Laravel APIs fail at scale, and the exact production fixes I use to keep them alive.

---

## 1. The N+1 Query Death Spiral

The most common killer of any Object-Relational Mapper (ORM) is the N+1 query problem. In Laravel, it''s incredibly easy to accidentally trigger hundreds of queries when serializing a single API response.

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

When retrieving data from massive tables, developers instinctively reach for Laravel''s standard `$query->paginate(50)`. 

Under the hood, this uses an `OFFSET`. When a user requests page 10,000, the database still has to scan and discard the first 499,950 records. This violently spikes CPU usage and RAM, locking up the database connection pool.

Furthermore, standard pagination runs a `SELECT COUNT(*)` query to calculate the total number of pages. On a massive InnoDB table, a raw count is notoriously slow.

### The Fix: Cursor Pagination

For high-volume APIs (like infinite scrolling feeds or mass data exports), I completely abandon offset pagination and switch to **Cursor Pagination**.

Cursor pagination uses a `WHERE` clause based on the last seen ID or timestamp, rather than an `OFFSET`.

```php
// ❌ Dangerous at scale: Scans 500k rows before returning 50.
$transactions = Transaction::latest()->paginate(50);

// ✅ Production ready: Jumps instantly via Primary Key Index.
$transactions = Transaction::orderByDesc(''id'')->cursorPaginate(50);
```

Because cursor pagination relies strictly on the database index, retrieving the 1,000,000th page is exactly as fast as retrieving the 1st page.

---

## Conclusion

Frameworks don''t crash at scale; bad queries do. 

By strictly disabling lazy loading, utilizing `cursorPaginate` for heavy tables, and avoiding generic "cache everything" band-aids, your Laravel APIs will consume a fraction of the memory and scale horizontally without breaking a sweat.',
  '{}',
  '',
  'published',
  '2026-03-30T10:00:00'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  'Zero-Downtime Database Migrations for Large Datasets in Laravel',
  'zero-downtime-database-migrations-for-large-datasets-in-laravel',
  '',
  '## Introduction
As a seasoned backend engineer, I''ve encountered numerous challenges when dealing with large-scale database migrations. One of the most significant hurdles is handling `ALTER TABLE` operations on tables with millions of rows without incurring table locking or performance degradation. In this article, I''ll delve into the technical details of achieving zero-downtime database migrations in Laravel, focusing on the trade-offs and edge cases.

## Problem Statement
When working with massive datasets, traditional migration approaches can lead to unacceptable downtime and performance issues. The primary concern is that `ALTER TABLE` statements can take an excessively long time to execute, causing table locks that prevent other operations from accessing the data. This can have far-reaching consequences, including delayed transactions, failed requests, and a poor user experience.

## Architectural Decisions
To overcome these challenges, I explored three primary strategies:

* **pt-online-schema-change**: A tool from Percona that allows for online schema changes without locking the table.
* **Blue-Green Migration Pattern**: A deployment strategy that involves creating a duplicate environment (green) and gradually switching traffic from the original environment (blue) to the new one.
* **Laravel''s Native Schema Tools**: Leveraging Laravel''s built-in migration features to minimize downtime.

After careful consideration, I opted for a hybrid approach that combines the strengths of each strategy.

## Solution
The solution involves a multi-step process:

1. **Prepare the new schema**: Create a new table with the updated schema using Laravel''s migration tools.
2. **Migrate data**: Use `pt-online-schema-change` to migrate data from the original table to the new table.
3. **Switch to the new table**: Implement a blue-green deployment pattern to switch traffic from the original table to the new table.

### Prepare the new schema
```php
// Create a new table with the updated schema
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateNewTable extends Migration
{
    public function up()
    {
        Schema::create(''new_table'', function (Blueprint $table) {
            $table->id();
            $table->string(''column1'');
            $table->string(''column2'');
            // Add new columns or modify existing ones
        });
    }

    public function down()
    {
        Schema::dropIfExists(''new_table'');
    }
}
```

### Migrate data
```bash
# Use pt-online-schema-change to migrate data from the original table to the new table
pt-online-schema-change --host=localhost --port=3306 --user=root --password=password \
  --database=database --table=original_table --new-table=new_table \
  --alter="ADD COLUMN new_column INT"
```

### Switch to the new table
```php
// Implement a blue-green deployment pattern to switch traffic from the original table to the new table
use Illuminate\Support\Facades\DB;

class SwitchToNewTable
{
    public function handle()
    {
        // Switch the database connection to the new table
        DB::connection(''new_database'')->table(''new_table'')->get();
    }
}
```

## Key Takeaways
To achieve zero-downtime database migrations in Laravel, consider the following:

* **Use a combination of tools**: Leverage `pt-online-schema-change`, blue-green migration patterns, and Laravel''s native schema tools to minimize downtime.
* **Prepare for edge cases**: Anticipate potential issues, such as data inconsistencies or connection timeouts, and develop strategies to mitigate them.
* **Monitor and test**: Closely monitor the migration process and thoroughly test the new schema to ensure a seamless transition.

By adopting this hybrid approach and considering the trade-offs and edge cases, you can successfully perform zero-downtime database migrations in Laravel, even with large datasets.',
  ARRAY['Laravel','Database','Scaling']::text[],
  '',
  'published',
  '2026-04-17T02:08:48'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

--------------------------------------------------

