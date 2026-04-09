---
date: 2026-04-09T12:00:00
draft: false
title: Creating a Finder Toolbar “New File” Tool for Developers and macOS Users
description: “How to build a custom Finder toolbar button on macOS that lets you create new files with developer-friendly templates — no Terminal or editor needed.”
tags: [“macOS”, “Automator”, “Developer Tools”, “Productivity”]
---

## Introduction

If you've used macOS long enough, you've probably noticed one thing missing compared to Windows:

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
set studly to do shell script "echo " & quoted form of baseName & " | sed -E 's/[^a-zA-Z0-9]+/ /g' | awk '{for(i=1;i<=NF;i++){printf toupper(substr($i,1,1)) tolower(substr($i,2))}}'"

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
        Schema::create('" & studly & "', function (Blueprint $table) {
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
  return Response.json({ message: '" & studly & "' });
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
        set content to "import { Module } from '@nestjs/common';

@Module({})
export class " & studly & "Module {}"
        
    else if typeName is "Service" then
        set fileName to studly & ".service.ts"
        set content to "export class " & studly & "Service {}"
        
    else if typeName is "Controller" then
        set fileName to studly & ".controller.ts"
        set content to "import { Controller, Get } from '@nestjs/common';

@Controller('" & studly & "')
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

This tool is more than a script. It's a **mini scaffolding system**.

### Why it's powerful:

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

And that's where real productivity starts.
