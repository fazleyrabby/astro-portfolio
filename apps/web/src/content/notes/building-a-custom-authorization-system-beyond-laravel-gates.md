---
title: "Building a Custom Authorization System Beyond Laravel Gates"
slug: "building-a-custom-authorization-system-beyond-laravel-gates"
description: "The Problem with Laravel Gates Laravel Gates are a fantastic way to manage authorization in your application, but they can become cumbersome and inflexible..."
tags: ["Laravel","Authorization","Security","RBAC","ABAC"]
published_at: "2026-07-21T15:52:28.712+00:00"
updated_at: "2026-07-21T15:52:28.792001+00:00"
featured: false
cover_image: null
lang: "en"
translation_of: null
draft: false
---
## The Problem with Laravel Gates

Laravel Gates are a fantastic way to manage authorization in your application, but they can become cumbersome and inflexible when dealing with complex permission systems. In production, you often need to handle dynamic permissions, row-level security, and multi-tenant permission isolation, which can be difficult to achieve with Gates alone. This is where building a custom authorization system comes in – to provide a more scalable and maintainable solution.

## Building a Custom Authorization System

When it comes to authorization, there are two main approaches: Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC). RBAC is a more traditional approach, where users are assigned roles, and roles are assigned permissions. ABAC, on the other hand, is a more fine-grained approach, where access is granted based on a set of attributes, such as user properties, resource properties, and environmental conditions. For our custom authorization system, we will use a combination of both RBAC and ABAC.

Our architecture will consist of the following components:

*   A `Permission` model to store all available permissions
*   A `Role` model to store all available roles
*   A `User` model to store all users
*   A `Policy` model to store the mapping between roles and permissions
*   A `PolicyCache` to cache the policies for better performance

### The Implementation

We will start by defining our models:

```php
// app/Models/Permission.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];
}

// app/Models/Role.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];
}

// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email'];

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}

// app/Models/Policy.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    use HasFactory;

    protected $fillable = ['role_id', 'permission_id'];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function permission()
    {
        return $this->belongsTo(Permission::class);
    }
}
```

Next, we will create a `PolicyCache` to cache the policies:

```php
// app/Services/PolicyCache.php

namespace App\Services;

use Illuminate\Cache\Repository;
use App\Models\Policy;

class PolicyCache
{
    private $cache;

    public function __construct(Repository $cache)
    {
        $this->cache = $cache;
    }

    public function get($roleId)
    {
        return $this->cache->rememberForever("policies.$roleId", function () use ($roleId) {
            return Policy::where('role_id', $roleId)->get();
        });
    }
}
```

Finally, we will create a `AuthorizationService` to handle the authorization logic:

```php
// app/Services/AuthorizationService.php

namespace App\Services;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Services\PolicyCache;

class AuthorizationService
{
    private $policyCache;

    public function __construct(PolicyCache $policyCache)
    {
        $this->policyCache = $policyCache;
    }

    public function hasPermission(User $user, Permission $permission)
    {
        $roles = $user->roles;

        foreach ($roles as $role) {
            $policies = $this->policyCache->get($role->id);

            foreach ($policies as $policy) {
                if ($policy->permission_id == $permission->id) {
                    return true;
                }
            }
        }

        return false;
    }
}
```

## Common Pitfalls

-   **Not caching policies**: Not caching policies can lead to poor performance, as the database will be queried every time a permission is checked.
-   **Not handling row-level security**: Not handling row-level security can lead to unauthorized access to sensitive data.

## Key Takeaways

-   **Use a combination of RBAC and ABAC**: Use a combination of RBAC and ABAC to provide a more fine-grained and flexible authorization system.
-   **Cache policies**: Cache policies to improve performance and reduce database queries.
-   **Handle row-level security**: Handle row-level security to ensure that users can only access authorized data.
-   **Implement multi-tenant permission isolation**: Implement multi-tenant permission isolation to ensure that each tenant's permissions are isolated from other tenants.
