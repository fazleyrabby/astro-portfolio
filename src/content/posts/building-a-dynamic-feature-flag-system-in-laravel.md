---
title: "Building a Dynamic Feature Flag System in Laravel"
date: 2026-04-03T17:25:18
draft: true
---


# Introduction
As a backend engineer working with Laravel in production, I've encountered my fair share of challenges. One of the most significant problems we faced was the need to enable or disable features without deployments, while managing feature rollout to specific user groups. In this post, I'll describe how we built a dynamic feature flag system in Laravel to tackle this issue.

## Problem
In our production environment, we needed to roll out new features to a subset of users, while also allowing for quick rollback in case of issues. However, our existing implementation relied on code changes and deployments, which led to delays and added risk. Moreover, we had to consider edge cases such as retries, race conditions, and scaling.

## Solution
To address this problem, we designed a database-driven feature flag system with caching, user targeting, and percentage rollout. We also implemented fallback strategies to handle cases where the flag evaluation fails.

### Database-Driven Flags
We created a `feature_flags` table to store the state of each feature. This table has columns for the feature name, description, and enabled status.

### Caching
To improve performance, we used Laravel's built-in caching mechanism to store the feature flag values. This allows us to reduce the number of database queries and improve response times.

### User Targeting
We implemented user targeting by adding a `user_targeting` column to the `feature_flags` table. This column stores a JSON object with user attributes, such as role or location, that determine whether a user should see the feature.

### Percentage Rollout
To enable percentage rollout, we added a `rollout_percentage` column to the `feature_flags` table. This column stores the percentage of users that should see the feature.

### Fallback Strategies
We implemented fallback strategies to handle cases where the flag evaluation fails. For example, if the database is down, we can fall back to a default value.

## Code
Here's an example of how we implemented the feature flag system in Laravel:
```php
// FeatureFlag model
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeatureFlag extends Model
{
    protected $casts = [
        'user_targeting' => 'json',
    ];

    public function isEnabled($user)
    {
        if ($this->enabled) {
            $targeting = json_decode($this->user_targeting, true);
            if ($targeting && isset($targeting['role']) && $targeting['role'] === $user->role) {
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
            cache()->put('feature_flag_' . $featureFlag->name, $featureFlag);
        }
    }

    public function register()
    {
        // Bind FeatureFlag instance to the container
        $this->app->bind('feature_flag', function ($app) {
            return new FeatureFlag();
        });
    }
}

// Usage
$featureFlag = cache()->get('feature_flag_my_feature');
if ($featureFlag->isEnabled(auth()->user())) {
    // Render the feature
}
```
## Conclusion
In this post, I described how we built a dynamic feature flag system in Laravel to enable or disable features without deployments, while managing feature rollout to specific user groups. By using a database-driven approach with caching, user targeting, and percentage rollout, we were able to improve our deployment process and reduce the risk of errors. I hope this example helps you implement a similar system in your own Laravel application.