---
title: "Electronic First"
type: "E-commerce / Backend"
featured: true
problem: "A high-volume digital marketplace bleeding revenue to chargebacks, manual dispute reconciliation, and missing analytics — with no unified bundle commerce, no fraud engine, and no real-time visibility into customer or product performance."
solution: "Five years of deep backend work: a multi-rule fraud detection engine, real-time PayPal + Checkout.com dispute sync, ClickHouse-backed analytics, an end-to-end Personalized Gift Card platform, and a versioned REST API powering web, mobile, and an AI chatbot."
live: "https://www.electronicfirst.com/"
thumbnail: "https://i.ibb.co.com/bMMPQfw5/image.png"
description: "High-volume digital gaming & eSIM marketplace processing thousands of daily orders — fraud, disputes, bundles, analytics, and APIs."
tech: ["Laravel 9", "PHP 8.2", "MySQL", "Redis", "ClickHouse", "Checkout.com", "PayPal", "RapidAPI"]
status: "Production"
position: 0
period: "Jun 2021 – May 2026"
role: "Software Engineer"
commits: 1428
highlights:
  - "Reduced fraudulent chargebacks by designing a multi-rule checkout fraud detection engine — IP/card/email velocity, BIN/ASN checks, bot fingerprinting, and auth-capture flow — auto-blocking high-risk payments before fulfilment."
  - "Eliminated manual dispute reconciliation by building real-time PayPal + Checkout.com dispute sync with webhooks, file proxying, and customer blocking — replacing a process prone to missed deadlines."
  - "Enabled data-driven decisions with ClickHouse-backed analytics: customer behavior, product unit sales, payment gateway performance, HRM costs — with date-range comparison and drill-down breakdowns."
  - "Opened a new revenue channel by engineering an end-to-end Personalized Gift Card platform — recipient management, card designer, scheduled delivery, sender/receiver dashboards — with full test suite at launch."
  - "Accelerated third-party integrations with a versioned REST API, encrypted IDs, Swagger docs, and AI chatbot endpoints (orders, refunds, tickets, products)."
  - "Increased AOV by building full bundle commerce across PayPal, Coinbase, eWallet, and card — with reviews, wishlist, and post-purchase email."
  - "Fixed conversion tracking loss with server-side GA4 add_to_cart events and event_id deduplication — eliminating skewed marketing attribution."
scope:
  - "Bootstrapped regions, brands, tags, and customer CRUD with DB transaction safety and validation."
  - "Built Kinguin supplier integration: API routes, HTTP error handling, excluded offer IDs, K4G competitor prices, stock routes, JSON logs, batch delete."
  - "Built bundle deals: category + details pages, bundle tag system + seeder + admin UI, cart integration with currency-aware pricing, encrypted IDs across all endpoints, fixed price/currency mismatch on PayPal/Coinbase/eWallet, thank-you email layout."
  - "Built Personalized Gift Card flow: recipient create/edit/delete, card designer with dynamic product data, schedule + timezone, sender/receiver dashboards, key info, download/print, product group system with sorting and slug validation, full test suite (recipient, template, cart, create-order)."
  - "Built API surface: ProductApiService (single, bundle, recommended, reviews), cart API with partial payment and eWallet currency, order/wishlist/home/deals-for-you endpoints, platform/region logo, delivery attributes, ConvertCart webhook with CheckProductPriceUpdateJob."
  - "Built system translations CRUD with multi-language category transform."
  - "Built Net Report (revenue by product/gateway/merchant fee), Products Unit Breakdown (supplier/location/customer/language/payment/currency, sortable), Product Sold Stock Update Job (5-min)."
  - "Built HRM Costs Module (salary, repeated costs, cost categories CRUD via HRM API)."
  - "Built Customer Report (3 phases: top customers, spending behavior, date-range comparison, device/platform/region breakdowns) and Customer Analytics (overview, orders by email, last-visited, UTM/browser/source)."
  - "Added DB read replica on heavy customer queries."
  - "Built fraud rules: user-agent bot detection, IP velocity + auto-block, disposable email block list, micro-transaction detection, IP/BIN checker + ASN blocking via RapidAPI, card/email velocity, payment method switching, checkout speed anomaly, auth-capture with fraud auto-capture limit, fraud score + reason logging, fraud report (CSV)."
  - "Built price-mismatch redirect to cancelled page."
  - "Built AI chatbot API (order cancel, refund eligibility, replacement) and customer refund history endpoint."
  - "Built support ticket CRUD (create/close/delete/reopen/feedback) with Swagger docs + tests, product lookup by slug/title/ID."
  - "Built Checkout.com payment cross-check, Checkout.com + PayPal chargeback webhooks, dispute report (AJAX, filters, pagination), PayPal dispute sync (modal, file proxy, customer blocking), ProcessDisputedOrdersJob with read replica + global status filter, daily dispute sync cron."
  - "Added server-side GA4 add_to_cart event with event_id deduplication."
---
