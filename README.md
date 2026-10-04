# Portfolio Website

A modern, performance-optimized portfolio website built with Astro and self-hosted on an IONOS VPS.

🌐 **Live Site**: [chiefosei.dev](https://chiefosei.dev)

## Overview

This portfolio showcases my projects, technical skills, and development journey. Built with a focus on performance, accessibility, and clean design, the site features optimized images, lazy loading, and responsive layouts that work seamlessly across all devices.

## ✨ Features

- **Modern Stack**: Built with Astro, TypeScript, and Tailwind CSS
- **Content Collections**: Type-safe project data with schema validation
- **Optimized Images**: Automatic WebP generation and lazy loading via `astro:assets`
- **Responsive Design**: Mobile-first approach with fluid typography and layouts
- **Interactive Elements**: Project modals, filtering, and smooth animations
- **Performance-First**: Optimized LCP, CLS, and TBT scores
- **Self-Hosted**: Running on an IONOS VPS
- **Live Stats**: Real-time server CPU, RAM, and load monitoring
- **CI/CD**: Pull request smoke tests, GHCR image builds, and automatic Coolify redeploys

## 🏗️ Tech Stack

### Frontend
- **[Astro](https://astro.build)** - Static site generator with island architecture
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **Astro Content Collections** - Type-safe markdown content

### Hosting & Infrastructure
- **IONOS VPS** - Virtual private server hosting the site
- **Custom Domain** - Accessible at [chiefosei.dev](https://chiefosei.dev)

### Performance Optimizations
- Image optimization with `astro:assets`
- Lazy loading for below-the-fold content
- Priority hints for LCP images
- Content visibility for off-screen elements
- Minimal JavaScript footprint

## 📁 Project Structure

```
astro/
├── src/
│   ├── assets/          # Images and static assets
│   │   ├── logos/       # Skill/tech logos
│   │   └── projects/    # Project screenshots
│   ├── components/      # Astro components
│   │   ├── Hero.astro
│   │   ├── Projects.astro
│   │   ├── ProjectCard.astro
│   │   ├── Skills.astro
│   │   └── ...
│   ├── content/         # Content collections
│   │   ├── config.ts    # Collection schemas
│   │   └── projects/    # Project markdown files
│   ├── layouts/         # Page layouts
│   ├── pages/           # Routes
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   └── api/         # API endpoints
│   └── styles/          # Global styles
├── public/              # Static assets
└── astro.config.mjs     # Astro configuration
```

## 🎯 Key Features Explained

### Self-Hosting on an IONOS VPS

The entire site runs on an IONOS VPS, demonstrating:
- **Resource Efficiency**: Optimized for low-cost server resources
- **DevOps Skills**: Server management, monitoring, and deployment
- **Real-World Infrastructure**: Hands-on experience with production hosting

### Cloudflare Tunnel

Instead of traditional port forwarding, the site uses Cloudflare Tunnel to:
- Securely expose the Pi to the internet
- Work around restrictive network environments
- Provide DDoS protection and CDN benefits
- Enable custom domain ([chiefosei.dev](https://chiefosei.dev))

### Content Collections

Projects are managed as type-safe markdown files with frontmatter validation:

```markdown
---
id: 1
title: "Project Name"
size: "L"
tech: ["Next.js", "TypeScript"]
image: "../../assets/projects/image.png"
summary: "Project description"
---
```

### Performance Optimizations

- **Lazy Loading**: Images below the fold load on-demand
- **Priority Hints**: LCP images use `fetchpriority="high"`
- **Optimized Formats**: Automatic WebP/AVIF generation
- **Content Visibility**: Off-screen elements render only when needed

## 🛠️ Development

### Adding a New Project

1. Add project images to `src/assets/projects/`
2. Create a new markdown file in `src/content/projects/`
3. Follow the schema defined in `src/content/config.ts`
4. The project will automatically appear on the site

### Updating Skills

Edit `src/data/skills.json` to add or modify skill entries.


## 📊 Live System Stats

The site includes a live stats modal (the server icon on the homepage) that shows metrics from the server running the container:
- CPU usage
- RAM usage
- System load averages
- Uptime

The data comes from `GET /api/server-stats.json`, which runs on every request and caches results for 5 seconds. Values reflect the host kernel, so inside a container they show the host's numbers.

## 🚀 CI/CD

Two workflows live in `.github/workflows/`:

### PR Smoke Test (`pr-smoke-test.yml`)

Runs on pull requests to `main` and `dev`:
1. Installs dependencies, then builds the Astro site (fails fast before Docker)
2. Builds the Docker image from the `Dockerfile`
3. Starts the container and waits for `/api/health` to return 200
4. Checks `/`, `/projects`, `/api/health`, and `/api/server-stats.json` return 200
5. Prints container logs on failure, then removes the container

Lint and test steps are commented out until those scripts exist.

### Build and Push (`build-and-push.yml`)

Runs on pushes to `main` and `dev`, and can be started manually from the Actions tab:
1. Builds the production image and pushes it to GHCR
2. Tags each image with the branch name (`main` or `dev`, a moving tag) and with the branch plus short commit SHA (`main-<sha>`, one per commit)
3. Calls the Coolify deploy API (`POST /api/v1/deploy`) to redeploy the resource for that branch

Concurrent runs on the same branch cancel the older run.

**Required repository secrets:**

| Secret | Purpose |
|--------|---------|
| `COOLIFY_TOKEN` | Coolify API token, sent as a Bearer token |
| `COOLIFY_UUID_MAIN` | Coolify resource UUID for the `main` deployment |
| `COOLIFY_UUID_DEV` | Coolify resource UUID for the `dev` deployment |

`GITHUB_TOKEN` handles GHCR login and needs no setup. The Coolify address is set as `COOLIFY_URL` in the `env` block at the top of `build-and-push.yml`, since it isn't sensitive.

### Health Checks

`GET /api/health` returns `{"status":"ok"}` with HTTP 200 whenever the server can handle requests. The Docker `HEALTHCHECK` in the `Dockerfile` calls this route with Node (the Alpine image has no `curl`). In Coolify, use the Docker health check and turn off the separate exec-based health check so there is one source of truth.

## 🔌 Ports

| Port | Where | Purpose |
|------|-------|---------|
| `4321` | Container (`EXPOSE`, `PORT` env var) | Node server for the site and API routes |
| `4321` | Host, via `docker run -p` or `docker-compose.yml` | Local access to the container |
| `4321` | Coolify | Must match the container port, and the health check uses the same port |

Set `HOST=0.0.0.0` (already set in the `Dockerfile`) so the server accepts connections from outside the container.

## ↩️ Rollback

Rollback is manual:
1. Find the last known-good image tag in GHCR, e.g. `ghcr.io/cd-chief/dev-portfolio:main-<sha>`
2. In Coolify, point the resource at that tag, or redeploy with that tag
3. Check `/api/health` and the homepage
4. Once stable, revert the bad commit or fix forward before the next normal deploy

## 🐳 Local Docker

Run a production-style container locally:

```bash
docker compose up --build
```

Variables in a local `.env` file are passed into the container. `.env` is git-ignored and should never be committed.

## 🔗 Connect

- **Portfolio**: [chiefosei.dev](https://chiefosei.dev)
- **GitHub**: [CD-Chief](https://github.com/CD-Chief)
- **LinkedIn**: [chief-daniel](https://www.linkedin.com/in/chief-daniel)
- **Email**: chief.d.osei@gmail.com

---

**Built with ❤️ and hosted on a ~~Raspberry Pi~~ VPS**
