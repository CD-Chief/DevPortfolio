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
- **Live Stats**: Real-time Raspberry Pi system monitoring

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

The site includes a live stats modal that displays server metrics:
- CPU temperature
- System load
- RAM usage
- Uptime

**Disclaimer:** The stats currently shown are not fully real-time and only reflect values from the time of the last system boot. For now, they serve as a demonstration and may not represent the current state of the server.

## 🔗 Connect

- **Portfolio**: [chiefosei.dev](https://chiefosei.dev)
- **GitHub**: [CD-Chief](https://github.com/CD-Chief)
- **LinkedIn**: [chief-daniel](https://www.linkedin.com/in/chief-daniel)
- **Email**: chief.d.osei@gmail.com

---

**Built with ❤️ and hosted on a ~~Raspberry Pi~~ VPS**
