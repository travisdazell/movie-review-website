# movie-review-website Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-31

## Active Technologies
- JavaScript/Node.js 18+ + Next.js (React framework), Framer Motion (animations), Firebase SDK (database/auth), NextAuth.js (OAuth) (001-movie-review-website)
- TypeScript 5.x with Next.js 14.2.35 + React 18, Tailwind CSS 3.x (with JIT mode), Framer Motion 10.0.0 (002-modern-ui-enhancements)
- Firebase Firestore (NoSQL database with Base64 image support) (001-movie-review-website)

## Project Structure

```text
movie-review-website/
├── components/           # React components (enhance with modern UI)
├── pages/               # Next.js pages and API routes
├── styles/              # Global CSS and Tailwind config
├── lib/                 # Utility functions and custom hooks
│   └── hooks/           # Custom React hooks for animations
├── tailwind.config.js   # Tailwind CSS configuration with custom utilities
└── specs/               # Feature specifications and plans
```

## Commands

```bash
# Development
npm.cmd run dev

# Build
npm.cmd run build

# Linting
npm.cmd run lint

# Type checking (if needed)
npx tsc --noEmit
```

## Code Style

TypeScript/React: Follow Next.js and React best practices
- Use functional components with hooks
- Prefer TypeScript for type safety
- Use Tailwind CSS utility classes for styling
- Implement animations with Framer Motion for React components
- Use CSS transforms and opacity for performance
- Respect `prefers-reduced-motion` for accessibility

CSS/Tailwind:
- Extend Tailwind config for custom gradients and animations
- Use utility classes first, custom CSS as needed
- Implement glassmorphism with backdrop-filter
- Provide fallbacks for older browsers using @supports
- Follow 8px spacing scale for consistency

## Recent Changes
- 001-movie-review-website: Initial Next.js movie review website with Firebase and NextAuth
- 002-modern-ui-enhancements: Added modern visual enhancements (glassmorphism, 3D transforms, gradients, animations)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
