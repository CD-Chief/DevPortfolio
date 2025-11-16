---
id: 1
title: "Portfolio Website"
size: "M"
tech: ["Astro", "Tailwind CSS", "TypeScript"]
summary: "A modern, responsive portfolio website showcasing my skills and projects."
link: "#"
image: "/projects/image.png"
showMoreButton: true
---

# Portfolio Website

A fully responsive portfolio website built with modern web technologies, designed to showcase my projects and technical skills in an elegant and user-friendly way.

## Key Features

- **Responsive Design**: Works seamlessly across all devices and screen sizes
- **Performance Optimized**: Built with Astro for lightning-fast page loads
- **Content Collections**: Uses Astro's content collections for easy project management
- **Modal System**: Interactive modal popups for project details
- **Smooth Animations**: Subtle transitions and hover effects throughout

## Technical Implementation

The site leverages Astro's static site generation capabilities combined with Tailwind CSS for styling. Key technical decisions include:

### Architecture
- Static site generation for optimal performance
- Component-based architecture for maintainability
- Content collections for type-safe content management

### Styling Approach
```css
/* Custom color system */
--color-Primary1: #5caac3;
--color-Primary2: #06164f;
--color-Background1: #effafc;
--color-Background2: #daebfc;
```

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

- [ ] Add blog section with content collections
- [ ] Implement dark mode toggle
- [ ] Add contact form with email integration
- [ ] Integrate analytics

## Links

- Live Site: [View Demo](#)
- GitHub: [Source Code](#)
