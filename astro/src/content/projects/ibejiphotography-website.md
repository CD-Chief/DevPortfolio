---
id: 1
title: "Photography Portfolio Website"
size: "L"
tech: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity (Headless CMS)", "Figma"]
summary: "A multilingual, client-ready photography portfolio with a headless CMS, accessibility-conscious contact flow, and a wireframe-driven design process."
link: "http://ibejiphotography.com"
image: "../../assets/projects/IbejiGallery.png"
showMoreButton: true
---

# Photography Portfolio Website

A production-ready photography portfolio site for a solo photographer, built with Next.js (App Router), TypeScript, Tailwind CSS, and a headless Sanity CMS backend.

## Collaboration & Requirements

We started with multiple requirements meetings to clarify the client’s goals, audience, and priorities (showcasing work, telling their story, and generating enquiries). For each main page: home, gallery, about, blog, and contact. I created Figma wireframes, iterated on them with the client, and only then moved into implementation so that layout, messaging, and content structure were agreed upfront.

## Design & UX

The design focuses on keeping the photography central, using generous whitespace, restrained colour, and typography that matches the client’s “elegant but approachable” brief. Each wireframe was translated into a responsive layout, with attention to how the experience scales from desktop to mobile while keeping navigation simple and predictable.

## Technical Implementation

The front end uses Next.js (App Router) with locale-aware routing and translation helpers for multilingual content. A headless Sanity CMS instance powers the blog and gallery, exposing content via its content API so the client can update text and images without touching code. The contact form is wired to a backend handler with spam protection (reCAPTCHA, honeypot, and rate limiting) and email delivery, designed to align with GDPR expectations.

## Performance & Refinements

High-resolution imagery is handled with Next.js image optimisation, remote patterns, and multiple quality presets to keep the site fast while still showcasing detailed photography. Several images were resized and compressed, and animations were kept lightweight (transform/opacity) to avoid jank while scrolling.

## What I Learned

This project strengthened experience in running a full client process end to end: gathering requirements, turning them into wireframes, validating designs, and then delivering a multilingual, CMS-backed site. It also deepened understanding of performance trade-offs when working with large image assets and of how to keep the implementation faithful to a design system across multiple page types.

## Visuals

**Wireframes overview**  
![Wireframes Overview](/projects/IbejiWireframes.png)

**Gallery / front page**  
![Front Page](/projects/IbejiFront.png)

**Contact form**  
![Contact Form](/projects/IbejiContact.png)

**About me page**  
![About Me Page](/projects/IbejiAbout.png)

## Links

- Live site: [ibejiphotography.com](http://ibejiphotography.com)
