--- 
id: 3
title: "This Portfolio Website"
size: "M"
tech: ["Astro", "Tailwind CSS", "TypeScript"]
summary: "A modern, responsive portfolio website showcasing my skills and projects."
link: "#"
image: "../../assets/projects/ThisSite.png"
showMoreButton: true
---

# Portfolio Website

A fully responsive portfolio website built with modern web technologies, designed to showcase my projects and technical skills in an elegant and user-friendly way.

## Why Astro?

I chose Astro because it is lightweight and produces highly optimized static HTML with minimal JavaScript. This makes it ideal for running on resource-constrained devices like my Raspberry Pi, ensuring fast load times and low resource use. Astro’s island architecture allows me to sprinkle interactivity only where needed without bloating the site.

## Cloudflare Tunnel Setup

To expose my website securely while hosting it on a Raspberry Pi behind restrictive accommodation WiFi (without port forwarding), I used a Cloudflare Tunnel. This provides a robust and secure public URL for my portfolio without the hassle of complex network configuration.

## Portfolio Research Insights

When designing the site, I researched what visitors typically want from a portfolio page. The main takeaways were: visitors expect quick access to the most impressive and relevant projects upfront, concise project descriptions showcasing technical contributions, clear technology stacks, real-world outcomes, and easy navigation to additional work for breadth. This guided the site's content hierarchy and project presentation.

## Key Features

- **Responsive Design**: Works seamlessly across all devices and screen sizes
- **Performance Optimized**: Built with Astro for lightning-fast page loads
- **Content Collections**: Uses Astro's content collections for easy project management
- **Modal System**: Interactive modal popups for project details
- **Smooth Animations**: Subtle transitions and hover effects throughout

## Technical Implementation

The site leverages Astro's static site generation combined with Tailwind CSS for styling.

### Architecture

- Static site generation for optimal performance
- Component-based architecture for maintainability
- Content collections for type-safe content management

### Styling Approach

Before settling on the final design, I created multiple wireframes and prototypes in Figma to explore layout, color schemes, and user experience options. This iterative process informed the clean visual structure and consistent branding seen on the site.

/* Custom color system */
--color-Primary1: #5caac3;
--color-Primary2: #06164f;
--color-Background1: #effafc;
--color-Background2: #daebfc;

### Performance

- Minimal JavaScript footprint
- Optimized image loading
- CSS-only animations where possible

## Challenges & Solutions

One interesting challenge was implementing the modal system without using dynamic routes. The solution involved:

1. Pre-loading all project content using `getCollection()`
2. Rendering modal content client-side using Astro's `<Content />` component
3. Managing modal state with vanilla JavaScript

## Future Enhancements

- Add blog section with content collections
- Implement dark mode toggle
- Add contact/feedback form with email integration
- Integrate analytics

## Links

- GitHub: <a href="https://github.com/CD-Chief/DevPortfolio" target="_blank" rel="noopener noreferrer">GitHub: Source Code</a>