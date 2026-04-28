# Benjamin's Insights Blog

A personal blog covering AI, technology, geopolitics, and economics — built with [Astro](https://astro.build) and deployed to GitHub Pages.

**Live site:** [benjaminpaulraj.github.io/insights](https://benjaminpaulraj.github.io/insights/)

---

## Blog Posts

| Post | Topic |
|------|-------|
| [How Claude's Memory Works — A Simple Guide](https://benjaminpaulraj.github.io/insights/blog/how-claude-context-works-simple-guide/) | AI context management, 11 strategies, visualized |
| [Mastering Context Management in Claude](https://benjaminpaulraj.github.io/insights/blog/mastering-claude-context-management/) | Deep-dive technical reference for Claude Code users |
| [The Petrodollar System](https://benjaminpaulraj.github.io/insights/blog/petrodollar-system/) | How oil pricing in dollars became American power |
| [Why Every Great Empire Eventually Falls](https://benjaminpaulraj.github.io/insights/blog/empire-lifespan-blog/) | Glubb's framework applied to today's great powers |

## Visual Presentations

Standalone HTML files — open directly in any browser, no server needed:

| File | Description |
|------|-------------|
| [`claude-context-visual-guide.html`](https://benjaminpaulraj.github.io/insights/claude-context-visual-guide.html) | Animated visual guide to Claude context management |
| [`claude-context-presentation.html`](https://benjaminpaulraj.github.io/insights/claude-context-presentation.html) | Slide deck — 25 slides on Claude context strategies |
| [`petrodollar-visual.html`](https://benjaminpaulraj.github.io/insights/petrodollar-visual.html) | Visual presentation of the petrodollar system |
| [`empire-blog-post.html`](https://benjaminpaulraj.github.io/insights/empire-blog-post.html) | Visual presentation on empire lifespans |

---

## Tech Stack

- **Framework:** [Astro 6](https://astro.build) — static site generator
- **Content:** Markdown (`.md`) and MDX (`.mdx`) via Astro Content Collections
- **Deployment:** GitHub Pages via GitHub Actions
- **Node:** 22.x
- **Fonts:** Atkinson Hyperlegible (self-hosted)

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server at http://localhost:4321/insights/
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
/
├── public/                        # Static files (served as-is)
│   ├── claude-context-visual-guide.html
│   ├── claude-context-presentation.html
│   ├── petrodollar-visual.html
│   └── empire-blog-post.html
├── src/
│   ├── assets/                    # Images and fonts
│   ├── components/                # Astro components (Header, Footer, etc.)
│   ├── content/
│   │   └── blog/                  # Blog posts (.md or .mdx)
│   ├── layouts/
│   │   └── BlogPost.astro         # Blog post layout template
│   └── pages/
│       ├── index.astro            # Home page
│       ├── about.astro            # About page
│       └── blog/
│           ├── index.astro        # Blog listing page
│           └── [...slug].astro    # Dynamic blog post pages
├── .claude/
│   └── settings.local.json        # Claude Code permissions
├── astro.config.mjs               # Astro configuration
└── .github/
    └── workflows/
        └── astro.yml              # GitHub Actions deploy workflow
```

---

## Adding a New Blog Post

1. Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A short description shown in the blog listing."
pubDate: "Apr 28 2026"
heroImage: "../../assets/blog-placeholder-1.jpg"
---

Your content here...
```

2. Run `npm run dev` to preview locally at `http://localhost:4321/insights/blog/your-post-title/`
3. Commit and push — GitHub Actions deploys automatically on push to `main`

**Hero images available:** `blog-placeholder-1.jpg` through `blog-placeholder-5.jpg` in `src/assets/`

---

## Deployment

Deployments are fully automated via GitHub Actions (`.github/workflows/astro.yml`):

- Triggers on every push to `main`
- Builds with `astro build`
- Deploys to GitHub Pages

No manual steps needed after `git push`.

---

## License

Personal blog — content is copyright Benjamin Paul Raj. The Astro template is MIT licensed.
