---
title: "New Engineering Post"
date: 2026-04-07T02:01:30
draft: true
---

---
title: "Building Zero-Downtime Data Migrations with the Expand-Contract Pattern"
tags: ["Database", "Scaling", "Migration"]
---
## Introduction
As a senior backend engineer, I've encountered numerous scenarios where deploying schema changes to high-traffic tables without locking or breaking the live app is a significant challenge. Traditional migration approaches often result in downtime, which can be detrimental to user experience and business operations. In this post, I'll share my experience with building zero-downtime data migrations using the Expand-Contract pattern, a solution that ensures seamless schema evolution without compromising application availability.

## Problem Statement
High-traffic tables are the backbone of many web applications, storing critical data that drives business logic. However, when it's time to deploy schema changes, traditional migration approaches can lead to unacceptable downtime. This can be attributed to the need to lock tables, rewrite data, or perform other resource-intensive operations that hinder the application's ability to serve users.

## Architectural Decisions
To address this challenge, I employed the Expand-Contract pattern, a three-phase migration strategy that ensures zero-downtime data migrations. The pattern consists of the following phases:

* **Expand**: Add new columns or tables to store the revised data structure, allowing the application to continue writing to the existing schema.
* **Sync**: Run a background worker to populate the new columns or tables with data from the existing schema, ensuring data consistency across both structures.
* **Contract**: Once the new schema is fully populated and verified, remove the deprecated columns or tables, and update the application to use the revised schema.

### Solution Overview
The Expand-Contract pattern provides a robust solution for zero-downtime data migrations. By decoupling the migration process from the application's runtime, we can ensure that the application remains available throughout the migration process.

### Code Snippets
The following code snippets demonstrate the implementation of the Expand-Contract pattern using Laravel and Node.js:

#### Expand Phase (Laravel)
```php
// Create a new migration to add the new column
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddNewColumn extends Migration
{
    public function up()
    {
        Schema::table('high_traffic_table', function (Blueprint $table) {
            $table->string('new_column')->nullable();
        });
    }

    public function down()
    {
        Schema::table('high_traffic_table', function (Blueprint $table) {
            $table->dropColumn('new_column');
        });
    }
}
```

#### Sync Phase (Node.js)
```javascript
// Create a background worker to populate the new column
const { Worker } = require('worker_threads');
const { database } = require('./database');

const syncWorker = new Worker('./sync-worker.js', {
  workerData: { tableName: 'high_traffic_table' },
});

syncWorker.on('message', (message) => {
  if (message.type === 'completed') {
    console.log('Sync phase completed');
  }
});

// sync-worker.js
const { parentPort, workerData } = require('worker_threads');
const { database } = require('./database');

const tableName = workerData.tableName;

database.query(`SELECT * FROM ${tableName}`, (err, results) => {
  if (err) {
    console.error(err);
    return;
  }

  results.forEach((row) => {
    // Populate the new column based on the existing data
    database.query(`UPDATE ${tableName} SET new_column = ? WHERE id = ?`, [row.old_column, row.id]);
  });

  parentPort.postMessage({ type: 'completed' });
});
```

#### Contract Phase (Laravel)
```php
// Create a new migration to remove the deprecated column
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class RemoveDeprecatedColumn extends Migration
{
    public function up()
    {
        Schema::table('high_traffic_table', function (Blueprint $table) {
            $table->dropColumn('old_column');
        });
    }

    public function down()
    {
        Schema::table('high_traffic_table', function (Blueprint $table) {
            $table->string('old_column')->nullable();
        });
    }
}
```

## Key Takeaways
The Expand-Contract pattern provides a robust solution for zero-downtime data migrations. By following this approach, you can ensure seamless schema evolution without compromising application availability. Key takeaways include:

* **Decoupling**: Decouple the migration process from the application's runtime to ensure zero-downtime.
* **Background workers**: Utilize background workers to populate new columns or tables, reducing the load on the main application thread.
* **Rollback safety**: Implement rollback safety by maintaining a deprecated column or table until the new schema is fully populated and verified.
* **Testing**: Thoroughly test the migration process to ensure data consistency and application availability.

By applying the Expand-Contract pattern, you can ensure that your high-traffic tables remain available and responsive, even during significant schema changes. This approach has been instrumental in my experience with building scalable and maintainable applications, and I hope it provides valuable insights for your own projects.