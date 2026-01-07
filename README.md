<div align="center">

# Allysa Repeso · 3D Portfolio

React + Three.js portfolio with a cinematic loader, calm motion design, and a focused project showcase.

</div>

## Features
- Cinematic loader with a twinkling octahedron starfield (Three.js) and smoothed progress.
- Hero section with a custom 3D scene, mobile-aware layout, and clear primary actions.
- About section with skills grid, tech stack highlights, and thoughtful motion via Framer Motion.
- Projects grid with hover reveals, live links, and tech badges.
- Contact section with ready-to-use links (email, LinkedIn, GitHub).

## Tech Stack
- React 19, Vite 7
- Three.js with @react-three/fiber and @react-three/drei
- Framer Motion for page and component choreography
- ESLint for linting

## Quick Start
Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually http://localhost:5173).

## Scripts
- `npm run dev` – Start local development server with HMR.
- `npm run build` – Create production build.
- `npm run preview` – Preview the production build locally.
- `npm run lint` – Run ESLint.

## Project Structure
```
src/
	App.jsx               # Entry layout with section reveal animations
	components/
		Loader.jsx          # Cinematic loader with starfield and progress
		CanvasContainer.jsx # Shared R3F canvas wrapper
		HeroScene.jsx       # Hero 3D scene content
		TechStack.jsx       # Tech icon grid
	sections/
		Hero.jsx
		About.jsx
		Projects.jsx
		Contact.jsx
	App.css, index.css    # Global styles
public/
	3dcards/              # Project card images
```

## Customization
- Projects: update the `projects` array in `src/sections/Projects.jsx`.
- Contact links: edit `src/sections/Contact.jsx`.
- Hero copy and buttons: edit `src/sections/Hero.jsx`.
- Loader text/behavior: edit `src/components/Loader.jsx`.

## Deployment
Build the optimized bundle and serve it from any static host:

```bash
npm run build
npm run preview  # optional local check
```

## Notes
- All styling lives in `src/App.css` and `src/index.css` (plus component-scoped classes).
- Three.js scenes use a performance-friendly DPR cap and lightweight geometries.
