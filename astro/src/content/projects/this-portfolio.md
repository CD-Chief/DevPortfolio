---
id: 9
title: "This Portfolio Website"
size: "M"
tech: ["Docker", "GitHub Actions", "GHCR", "Coolify", "Traefik", "Beszel", "Umami", "Astro", "TypeScript", "Tailwind CSS"]
summary: "The site you are on, run as a real deployment: Docker image built in CI, deployed by tag to my own VPS, with live server stats from Beszel and cookieless analytics."
link: "#"
image: "../../assets/posts/portfolio-infra.png"
showMoreButton: true
year: "2025 - now"
featured: 1
---

# This Portfolio Website

The site you are on is both my portfolio and a small production deployment that I run myself. The pages are Astro and Tailwind; the part worth reading about is everything around them.

- **Build and deploy:** a Docker image built in GitHub Actions, pushed to GHCR with SHA tags, and deployed by tag to my own VPS through Coolify.
- **Monitoring:** the live stats panel at the top of the homepage reads from my Beszel hub through a read-only server-side proxy, so the browser never touches the monitoring system.
- **Analytics:** cookieless, self-hosted Umami, left out of development builds.
- **Content:** typed Astro content collections, with technology tags validated against one list so a typo fails the build.

[Read how it is built, shipped and monitored](/blog/how-this-site-is-built)
