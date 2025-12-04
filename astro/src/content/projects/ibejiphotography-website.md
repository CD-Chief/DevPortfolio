--- 
id: 2
title: "Photography Portfolio Website"
size: "L"
tech: ["Next.js", "TypeScript", "Tailwind CSS", "WP REST API"]
summary: "A professional, multilingual photography portfolio site with a headless CMS and GDPR-compliant contact features."
link: "http://ibejiphotography.com"
image: "/projects/Ibeji1.png"
showMoreButton: true
---

# Photography Portfolio Website

From initial sketches and wireframes to over 200 commits refining every detail, this project pushed me to deliver a fully functional, polished portfolio site for a solo photographer.

## Project Overview

Built with Next.js (App Router), TypeScript, and Tailwind CSS, this site features a headless WordPress CMS backend for dynamic content management, multilingual support (English, German, French), and a GDPR-compliant contact form with reCAPTCHA. I collaborated closely with the client throughout the process to gather requirements and translate their vision into detailed Figma wireframes for both desktop and mobile.

## Key Features

- **Multilingual Support**: Locale-aware routing and floating language toggle for seamless switching between English, German, and French.
- **Performance Optimizations**: Image optimization using Next.js Image component, responsive image loading, and reduced image resolutions for faster site speed.
- **Dynamic Content**: Integration with WordPress REST API and GraphQL helpers for blog and gallery content management.
- **Sophisticated UI**: Polished, animated components (carousel CTAs, scroll-aware navbar, parallax effects) enhancing user experience.
- **Robust Contact Flow**: Rate-limited, spam-protected contact form integrated with email delivery ensuring GDPR compliance.
- **Masonry Gallery Layout**: Implemented a responsive masonry-style photo gallery using a JavaScript library after extensive experimentation to meet client expectations.

## Challenges & Solutions

Getting the masonry gallery layout right took significant trial and error, requiring a JavaScript library to achieve the desired responsiveness and performance. Additionally, balancing image quality and resolution was crucial — some images were reduced in resolution to improve load times without compromising visual appeal.

## Technical Highlights

- Strong developer tooling with ESLint, reusable components, and clear project documentation.
- Locale-aware routing and UI components built with next-intl for a smooth bilingual experience.
- Production-ready server API handlers for form submissions, including rate limiting and anti-spam measures.
- Optimized CSS animations leveraging GPU acceleration for responsiveness and fluidity.

## Impact

This project demonstrated a mature blend of design and development skills, effectively translating client needs into a site that balances elegance, usability, and technical performance. It also deepened my expertise in internationalization (i18n), CMS integration, and real-world performance tuning.

## Links

- Live Site: [ibejiphotography.com](http://ibejiphotography.com)
