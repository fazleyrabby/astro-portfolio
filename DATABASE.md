# Supabase Database Setup

Run the following SQL in your Supabase SQL Editor to set up the `posts` table and its associated functionality.

## 1. Extension Setup
```sql
create extension if not exists "pgcrypto";
```

## 2. Create `posts` Table
```sql
create table posts (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text unique not null,
  description text,

  content text, -- markdown body

  tags text[] default '{}',
  featured boolean default false,

  cover_image text,

  status text check (status in ('draft','published')) default 'draft',

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  published_at timestamp with time zone
);
```

## 3. Performance Indexes
```sql
create index idx_posts_slug on posts(slug);
create index idx_posts_status on posts(status);
create index idx_posts_published_at on posts(published_at desc);
```

## 4. Auto-update `updated_at` Column
```sql
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_posts_updated_at
before update on posts
for each row
execute function update_updated_at_column();
```

## 5. Row Level Security (RLS)
```sql
alter table posts enable row level security;

-- Public can read published posts
create policy "Public can read published posts"
on posts
for select
using (status = 'published');

-- Admin full access (assumes authenticated user)
create policy "Admin full access"
on posts
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
```

## 6. Storage Bucket
Create a new public bucket named `blog-images` in the Supabase Storage dashboard.
