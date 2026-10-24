---
title: "How This Site Is Built, Shipped and Monitored"
slug: "how-this-site-is-built"
excerpt: "The infrastructure behind this portfolio: a Docker image built in CI, deployed by tag to my own VPS, with live server stats from Beszel and cookieless analytics."
coverImage: "../../assets/posts/portfolio-infra.png"
publishedAt: "2026-10-24"
topic: "Self-hosting"
tech: ["Docker", "GitHub Actions", "GHCR", "Coolify", "Beszel", "Umami"]
relatedPosts: ["offloading-docker-builds"]
relatedProjects: [9]
---

# How This Site Is Built, Shipped and Monitored

This site is both my portfolio and a small production deployment that I run myself. The pages are Astro and Tailwind. The more interesting part is everything around them: how the site is built, shipped, monitored and measured. This post walks through that setup.

## Build and deploy

- **Container image:** a multi-stage Dockerfile with a pinned Node base image, a non-root runtime user, and only the production output copied into the final layer.
- **CI:** GitHub Actions builds the image on every push to `dev` and `main` and pushes it to GHCR with two tags. One is a moving branch tag, and the other is an immutable `branch-<sha>` tag that doubles as the rollback target. I wrote about why the build runs in CI and not on the server in [Offloading Docker Builds with GHCR](/blog/offloading-docker-builds).
- **Deploy by tag:** the workflow calls the Coolify API with a tag derived from the repo name and branch, so no resource IDs live in the repo. The call logs the HTTP status and response body and fails on anything but a 2xx, because a bare `curl -f` hides the body that explains what went wrong.
- **Pull request smoke test:** every PR builds the site, builds the Docker image, starts the container and checks the key routes before anything can merge.
- **Health checks:** a `/api/health` route is polled by both CI and a Docker `HEALTHCHECK`. The check is written with Node because the Alpine runtime image has no `curl`, and a check that quietly can't run is worse than no check.

## Live server stats

The panel at the top of the homepage shows the server this site runs on. The browser never talks to the monitoring system. A server-side route logs in to my [Beszel](https://beszel.dev) hub with a read-only user and returns only a whitelisted set of numbers: CPU, memory, load, network, uptime and containers.

- Results are cached for 45 seconds, and concurrent requests share a single call to the hub.
- If the hub is unreachable, the last good reading is shown and marked stale. With nothing to show, the panel hides instead of breaking.
- Container names are mapped to a short allowlist of labels, and everything else is grouped as "Other", so nothing private is exposed.
- The charts are inline SVG with no chart library, and the page respects `prefers-reduced-motion`.

## Analytics

I use self-hosted, cookieless [Umami](https://umami.is) with a handful of click events. The script is left out of development builds and restricted to the production hostname, so staging and local runs are never counted.

## Content and design

- Projects and posts are Astro content collections with typed schemas. Technology tags come from one validated list, so a misspelt tag fails the build instead of shipping.
- The project pop-ups are pre-rendered at build time, with no dynamic routes.
- The design started in Figma wireframes, and the dark theme uses one small palette defined as CSS variables.
