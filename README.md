# Portfolio — A Rohan

A personal portfolio built as a single-page React application, showcasing projects, skills, and experience with a focus on smooth, performant animations and a polished dark/light theme system.

## Tech Stack
- **React 18 + TypeScript** — component architecture with strict typing
- **Vite** — fast dev server and optimized production builds
- **Tailwind CSS 4** — utility-first styling with custom theme tokens
- **Framer Motion** — scroll-triggered reveals, layout animations, and gesture-based interactions

## Architecture
- **Theme system**: React Context (`ThemeContext`) drives dark/light mode across all components without prop drilling
- **Scroll-aware navbar**: single consolidated scroll listener (via `requestAnimationFrame` throttling) handles both navbar background transitions and active-section detection to avoid redundant reflows
- **Custom cursor**: spring-physics-based cursor follower using `useMotionValue` + `useSpring`
- **Animated keyboard illustration**: hand-built CSS/SVG keyboard component with a scripted key-lighting sequence, running on `setInterval` with 3D transform styling (`perspective`, `preserve-3d`)
- **Intersection-based reveals**: `useInView` powers fade-up and timeline animations, triggering once per element on scroll

## Project Structure
- `App.tsx` — all sections (Hero, About, Resume, Portfolio, Skills, Contact) composed as standalone components sharing the theme context
- Static content (`PROJECTS`, `TIMELINE`, `SKILLS_DATA`) defined as typed data arrays/objects for easy updates without touching JSX
