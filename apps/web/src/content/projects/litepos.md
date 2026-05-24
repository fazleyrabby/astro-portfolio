---
title: "LitePOS"
type: "POS / E-commerce"
featured: true
problem: "Small shop owners juggling separate POS, stock, and storefront tools — with no per-store isolation, no production deploy story, and no shared customer/cart layer between channels."
solution: "A unified Laravel POS + 3-theme e-commerce storefront on a single codebase: sales/purchases/returns, strict tenant isolation, RBAC, Dockerized deploy with rollback, and a shared cart/checkout layer across stores."
live: "https://pos.fazleyrabbi.xyz/"
thumbnail: "https://i.ibb.co.com/fYMNZjqd/Clean-Shot-2026-05-25-at-01-58-30.png"
description: "Unified POS + multi-theme e-commerce on Laravel — sales, stock, returns, storefronts, and Dockerized deploy."
tech: ["Laravel", "DaisyUI", "Tailwind", "Alpine.js", "MySQL 8", "Redis", "Docker", "Cloudflare Tunnel"]
status: "Active"
position: 4
period: "Mar 2026 – May 2026"
role: "Full-stack Engineer"
highlights:
  - "Replaced fragmented shop management with a unified POS — sales, purchases, returns, stock movement reports — giving owners a single source of truth."
  - "Cut time-to-market for new storefronts with 3 production-ready e-commerce themes (Nova/Style/Fresh — Amazon/Daraz/Chaldal inspired) sharing one cart/checkout/auth layer."
  - "Prevented cross-tenant data leaks via strict per-store isolation with route model bindings and RBAC (admin/store admin/cashier)."
  - "Simplified production deployment with Dockerized stack (PHP 8.2 FPM, Nginx, MySQL 8, Redis), Cloudflare Tunnel, and rsync deploy script with automated rollback."
scope:
  - "Redesigned sale POS workspace UI with sidebar controls."
  - "Built sales, purchases, product variants, stock movements, returns modules with reports."
  - "Three e-commerce themes (Nova/Style/Fresh) with shared cart sidebar (Alpine.js, DaisyUI, toast notifications), light/dark toggle, customer auth, profile, password reset, checkout auto-fill, order details, product image slider with zoom."
  - "PC builder module integrated with categories and products."
  - "Pivoted to single-shop MVP: removed multi-store scaffolding, SaaS billing, public registration."
  - "Added LogsActivity trait on core models, Sale/Purchase policies, try-catch-transaction pattern."
  - "Docker stack with Cloudflare Tunnel support and trust proxies; rsync deploy script with rollback."
  - "Comprehensive product seeder (5 categories), demo accounts, OrderSeeder."
---
