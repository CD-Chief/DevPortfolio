# Content Collections Setup - Projects with Modal Popups

This document explains the Astro Content Collections setup for the portfolio site, where project details are displayed in modal popups instead of separate pages.

## Architecture

### Key Design Decisions

1. **No Dynamic Routes**: All project content is pre-rendered at build time using Astro Content Collections
2. **Modal Popups Only**: Clicking "See More" opens a modal with the full markdown content, not a new page
3. **Pre-rendered Content**: All markdown is rendered server-side and embedded in the page HTML
4. **No API Calls**: No fetching or dynamic loading - everything is statically generated

## File Structure

```
src/
├── content/
│   ├── config.ts              # Schema definition for projects
│   └── projects/              # Markdown files for each project
│       ├── portfolio-website.md
│       ├── task-manager.md
│       ├── weather-dashboard.md
│       └── ecommerce-platform.md
├── components/
│   ├── ProjectCard.astro      # Individual project card
│   ├── ProjectModal.astro     # Modal popup component
│   ├── Projects.astro         # Home page projects section (shows 1-4)
│   └── AllProjects.astro      # Full projects page (shows all)
└── pages/
    ├── index.astro            # Home page
    └── projects.astro         # All projects page
```

## Content Collection Schema

**File**: `src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: number(),
    title: string(),
    size: enum(['S', 'M', 'L']),
    tech: array(string()),
    image: string().optional(),
    summary: string(),
    link: string().optional(),
    showMoreButton: boolean().default(true),
  }),
});

export const collections = {
  projects: projectsCollection,
};
```

## Markdown Project Files

**Location**: `src/content/projects/*.md`

**Example**:

```markdown
---
id: 1
title: "Portfolio Website"
size: "M"
tech: ["Astro", "Tailwind CSS", "TypeScript"]
image: "/src/assets/projects/image.png"
summary: "A modern portfolio website showcasing my projects and skills with a clean, responsive design."
link: "#"
showMoreButton: true
---

# Portfolio Website

Full markdown content here with:
- Headers
- Lists
- Code blocks
- Images
- Links

## Key Features
...
```

## How It Works

### 1. Loading Projects

In any component that needs projects:

```astro
---
import { getCollection } from 'astro:content';

const allProjects = await getCollection('projects');
const sorted = allProjects.sort((a, b) => a.data.id - b.data.id);
---
```

### 2. Displaying Project Cards

```astro
{sorted.map((project) => (
  <ProjectCard
    name={project.data.title}
    size={project.data.size}
    image={project.data.image}
    technologies={project.data.tech}
    description={project.data.summary}
    showMoreButton={project.data.showMoreButton}
    projectId={project.data.id}
  />
))}
```

### 3. Modal Component

The `ProjectModal.astro` component:

1. **Receives all projects** as props
2. **Pre-renders all markdown** content using `await project.render()`
3. **Hides all content** by default (CSS `display: none`)
4. **Shows selected project** when `openProjectModal(id, title)` is called
5. **Client-side JavaScript** handles:
   - Opening/closing modal
   - Showing correct project content
   - ESC key support
   - Click-outside-to-close
   - Body scroll lock

### 4. Opening a Modal

The "See More" button in `ProjectCard.astro`:

```astro
<button 
  type="button"
  onclick={`openProjectModal(${projectId}, '${name}')`}
  class="..."
>
  See More →
</button>
```

This calls the global `openProjectModal()` function defined in `ProjectModal.astro`.

### 5. Modal State Management

The modal pre-renders ALL project content at build time:

```astro
<div id="modalBody">
  {projects.map(async (project) => {
    const { Content } = await project.render();
    return (
      <div class="project-content hidden" data-project-id={project.data.id}>
        <Content />
      </div>
    );
  })}
</div>
```

When opened, JavaScript:
1. Hides all `.project-content` elements
2. Shows the one matching `data-project-id`
3. Displays modal overlay

## Benefits

✅ **No API endpoints needed**
✅ **No dynamic routes or [slug].astro files**
✅ **Full markdown rendering with Astro's built-in support**
✅ **Fast page loads - everything is pre-rendered**
✅ **Works without JavaScript** (content is in HTML, JS just shows/hides)
✅ **Type-safe with Zod schema validation**
✅ **Easy to add new projects** - just create a new markdown file

## Adding a New Project

1. Create `src/content/projects/my-project.md`
2. Add frontmatter with required fields
3. Write full markdown content
4. Rebuild (`npm run build` or auto-refresh in dev mode)
5. Project automatically appears in list and modal

## Customization

### Modal Styling

Edit `ProjectModal.astro` styles section:
- Prose styles for markdown elements
- Modal size/positioning
- Animation/transitions
- Colors and fonts

### Project Card Layout

Edit `ProjectCard.astro`:
- Card design
- Technology tag colors
- Size badge styling

### Filtering (All Projects Page)

The `AllProjects.astro` component includes technology filtering:
- Type in search box to filter by tech
- Searches through `tech` array in frontmatter
- Case-insensitive partial matching

## No Separate Pages

⚠️ **Important**: There are NO individual project detail pages. Everything happens in modals.

If you need traditional pages later:
1. Create `src/pages/projects/[slug].astro`
2. Use `getStaticPaths()` with `getCollection()`
3. Render `<Content />` directly on the page

But for this setup, modals handle all detail views.
