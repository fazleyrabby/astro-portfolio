This is my current developer setup — the tools, hardware, and workflow I use for building Laravel applications, REST APIs, and backend systems.

---

## Core Stack

My work is primarily focused on backend systems and SaaS applications:

- Laravel + PHP
- MySQL
- Docker
- REST APIs
- Linux / VPS environments

---

## Editor

I keep my editor setup minimal and fast for backend-heavy workflows.

- **Visual Studio Code** – My primary editor for daily development  
- **Antigravity** – AI-assisted coding  
- **PhpStorm** – Used for large Laravel codebases and deep debugging  

- Theme: Monochrome (GitHub Edition)

- Fonts:
  - Menlo (current)
  - JetBrains Mono

---

## Tools

These are the tools I use daily for development, debugging, and collaboration.

- **Herd, Docker** – Local development environments (Docker keeps everything consistent with production)  
  → If you're working with Laravel, Docker is worth learning early.

- **Chrome (primary), Zen Browser (experimental)** – Browsing and testing  

- **ClickUp** – Project and task management  

- **Discord** – Dev team communication  
- **Slack** – Office communication  

- **Postman** – API testing and debugging  

- **Sequel Ace, DBeaver** – Database management  

- **CleanShot X** – Screenshots and quick recordings  

- **Apple Notes** – Quick notes and lightweight documentation  

---

## Terminal

My terminal setup is focused on speed and simplicity.

- **iTerm2** – Stable and reliable terminal  
- **Warp** – Modern terminal with better UX (used occasionally)  
- **Zsh + Oh My Zsh (`bira` theme)** – Shell environment  

---

## Setup

### Primary (macOS)

My main development machine for all backend work.

- **Apple MacBook Pro M1 14"** – 16GB RAM, 512GB SSD  
- **LG 32UN650** – 32" 4K Monitor  
- **Rapoo Optical Mouse** – Mouse  
- **Rapoo E9050L** – Wireless Keyboard  
- **Orico USB-C Hub** – (ORICO-TC4U-U3)  
- **Transcend 1TB Portable SSD** – (TS1TESD370C)  
- **Adata A680 1TB Portable HDD** – (AHD680-1TU31-CBK)  
- **OnePlus Bullets Z2** – Wireless Neckband  
- **Orico Laptop Stand**

---

### Secondary (Light Gaming / Testing)

Used for testing environments and occasional gaming.

- **ViewSonic VX2276-shd** – 22" IPS Monitor  
- **AMD Ryzen 5 8600G** – RDNA3 760M iGPU  
- **G.SKILL S5 32GB DDR5** – 5200MHz RAM  
- **256GB NVMe SSD**  
- **512GB SATA SSD**

---

### Homelab & Infrastructure

I run a dedicated self-hosted homelab environment for staging production backend services, automated CI/CD runners, background queues, and telemetry:

- **Hardware Node**: Dedicated Linux Server (Ubuntu 24.04 LTS, 7.5GB RAM & 232GB NVMe SSD)  
- **Container Orchestration**: 41+ active Docker containers managed with Docker Compose & Traefik Reverse Proxy  
- **Networking & Ingress**: Tailscale Mesh VPN for internal node communication + Cloudflare Tunnels (`cloudflared`) for secure zero-trust external endpoints  
- **Database Consolidation**: Single shared production MySQL instance (`mysql-shared` on port 3307) powering multiple SaaS apps (saving ~1.1GB RAM & 10GB disk)  
- **CI/CD Ephemeral Runner Engine**: Custom Node.js webhook-based launcher receiving GitHub webhooks and spawning on-demand `--ephemeral` Actions runners (replacing 6 idle runners and saving ~715MB RAM)  
- **App Runtimes & Caching**: FrankenPHP & Swoole application servers, Redis (queues & caching), and ClickHouse (OLAP event analytics)  
- **Services & Tools**: Mailpit (SMTP debugging sandbox), Portainer CE, Nextcloud, Jellyfin media server  
- **Monitoring & Observability**: Prometheus, Grafana, Loki & Node Exporter monitoring stack  
- **Local AI Agents**: `llama-server` (Qwen LLM) & Hermes AI agent  

---

### Virtualization

I use virtualization heavily for testing and running isolated environments.

- **VMware Fusion Pro** (macOS)  
- **VMware Workstation** (Secondary setup)  
- **Ubuntu Server** – Homelab and containerized workloads  

---

## Workflow Philosophy

I prefer simple, fast, and production-aligned tools.

Most of my setup is optimized for:
- Backend development (Laravel, APIs)
- Consistent environments (Docker)
- Real-world testing (VMs, homelab)

I avoid overcomplicated setups — if something slows me down, I replace it.

---

## Currently Exploring

- Dockerized Laravel workflows  
- API performance optimization  
- Homelab setups with Proxmox & K3s  

---

> Note: I primarily use macOS and experiment on Linux and Windows.