---
description: "Task list for Modern UI Enhancements feature"
---

# Tasks: Modern UI Enhancements

**Input**: Design documents from `/specs/002-modern-ui-enhancements/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: This feature focuses on visual enhancements. Testing is manual (visual validation) rather than automated unit tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and visual testing of each enhancement.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a Next.js web application with:
- `components/` - React components
- `pages/` - Next.js pages
- `styles/` - Global styles
- `lib/` - Utilities and hooks
- `tailwind.config.js` - Tailwind configuration

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configure tooling and infrastructure for modern UI enhancements

- [X] T001 Extend tailwind.config.js with custom gradients and animations per research.md
- [X] T002 [P] Update styles/globals.css with animation keyframes, CSS custom properties for design tokens, and prefers-reduced-motion support
- [X] T003 [P] Create lib/hooks directory for custom React hooks

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and base styles that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create lib/hooks/useScrollAnimation.ts for scroll-triggered effects
- [X] T005 [P] Create lib/hooks/useParallax.ts for parallax scroll effects
- [X] T006 [P] Create lib/hooks/use3DTilt.ts for 3D tilt hover effects based on mouse position
- [X] T007 [P] Create lib/hooks/useReducedMotion.ts to detect and respect prefers-reduced-motion setting
- [X] T008 Create reusable glassmorphism utility classes in styles/globals.css

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Impact on Landing (Priority: P1) 🎯 MVP

**Goal**: Create immediate visual impact on the homepage with gradients, animations, and modern card designs

**Independent Test**: Load homepage and verify gradient backgrounds, smooth entrance animations, parallax effects, and staggered card animations appear correctly

### Implementation for User Story 1

- [X] T009 [P] [US1] Update pages/index.tsx with gradient hero background and parallax container
- [X] T010 [P] [US1] Add entrance animations to components/Layout.tsx using Framer Motion
- [X] T011 [US1] Integrate useScrollAnimation hook in pages/index.tsx for staggered card reveals
- [X] T012 [US1] Add gradient overlay and fade-in animation to hero section in pages/index.tsx
- [X] T013 [US1] Update movie list rendering in pages/index.tsx to use stagger delay for each card

**Checkpoint**: Homepage should display with gradient backgrounds, smooth entrance animations, and parallax scroll effects

---

## Phase 4: User Story 2 - Interactive Movie Cards (Priority: P1)

**Goal**: Transform movie cards with glassmorphism, 3D transforms, image zoom, and gradient overlays for premium feel

**Independent Test**: Hover over movie cards and verify 3D tilt effect, image zoom animation, gradient overlay, and smooth transitions work correctly

### Implementation for User Story 2

- [X] T014 [P] [US2] Update components/MovieCard.tsx with glassmorphism backdrop and semi-transparent background
- [X] T015 [P] [US2] Add 3D tilt effect to components/MovieCard.tsx using use3DTilt hook
- [X] T016 [US2] Implement image zoom on hover in components/MovieCard.tsx with Framer Motion scale
- [X] T017 [US2] Add gradient overlay to movie poster in components/MovieCard.tsx
- [X] T018 [US2] Add staggered entrance animation to components/MovieCard.tsx based on grid position
- [X] T019 [US2] Update components/Card.tsx with glassmorphism variant for reuse across site

**Checkpoint**: Movie cards should display with glassmorphism effects, smooth 3D tilt on hover, image zoom, and gradient overlays

---

## Phase 5: User Story 3 - Premium Form Interactions (Priority: P2)

**Goal**: Enhance forms with floating labels, gradient borders, smooth focus states, and micro-animations

**Independent Test**: Interact with review form and movie creation form to verify floating labels, gradient border animations, character counts, and loading states

### Implementation for User Story 3

- [ ] T020 [P] [US3] Update components/ReviewForm.tsx with floating label inputs and gradient border on focus
- [X] T021 [P] [US3] Update components/MovieForm.tsx with floating label inputs and gradient border on focus
- [X] T022 [US3] Add character count with color transitions to textarea in components/ReviewForm.tsx
- [X] T023 [US3] Implement submit button loading animation in components/Button.tsx with spinner
- [X] T024 [US3] Add success state transition animation to components/ReviewForm.tsx
- [X] T025 [US3] Add success state transition animation to components/MovieForm.tsx
- [X] T026 [US3] Create floating label CSS utility classes in styles/globals.css

**Checkpoint**: Forms should display floating labels, gradient borders on focus, character counts, and smooth submit animations

---

## Phase 6: User Story 4 - Navigation Experience (Priority: P2)

**Goal**: Create premium navigation with glassmorphism, scroll-based transitions, and animated link interactions

**Independent Test**: Scroll the page and interact with navigation to verify backdrop blur on scroll, shadow elevation, animated underlines, and mobile menu slide-in

### Implementation for User Story 4

- [X] T027 [US4] Update components/Navigation.tsx with scroll-triggered glassmorphism using useScrollAnimation hook
- [X] T028 [US4] Add animated gradient underline to navigation links in components/Navigation.tsx
- [X] T029 [US4] Implement shadow elevation transition on scroll in components/Navigation.tsx
- [X] T030 [US4] Add mobile menu slide-in animation with backdrop blur to components/Navigation.tsx
- [X] T031 [US4] Add smooth color transition to navigation background on scroll

**Checkpoint**: Navigation should display glassmorphism backdrop when scrolled, animated link underlines, elevated shadow, and smooth mobile menu

---

## Phase 7: User Story 5 - Review Card Aesthetics (Priority: P3)

**Goal**: Beautiful review cards with gradient grade badges, author avatars, and expand/collapse animations

**Independent Test**: View review lists and verify gradient badges for grades, avatar styling, and smooth expand/collapse animations for long reviews

### Implementation for User Story 5

- [X] T032 [P] [US5] Update components/ReviewList.tsx with gradient badge component for review grades
- [X] T033 [P] [US5] Add grade-based color coding to gradient badges (A+ green, A green, B blue, C yellow, D orange, F red) in components/ReviewList.tsx
- [X] T034 [US5] Implement expand/collapse animation for long reviews in components/ReviewList.tsx
- [X] T035 [US5] Add author avatar styling with gradient border to components/ReviewList.tsx
- [X] T036 [US5] Add "Read more" / "Show less" toggle with smooth height transition

**Checkpoint**: Review cards should display with gradient badges, styled avatars, and smooth expand/collapse animations

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and cross-cutting improvements

- [X] T037 [P] Create components/SkeletonLoader.tsx React component with gradient shimmer animation for loading states
- [X] T038 [P] Add error state animations to form error messages across all forms
- [X] T039 Update pages/movies/[id].tsx with enhanced visual presentation and animations
- [X] T040 Update pages/admin/index.tsx with gradient enhancements for admin UI
- [X] T041 Update pages/admin/reviews.tsx with visual improvements
- [X] T042 [P] Test glassmorphism fallbacks for browsers without backdrop-filter support
- [X] T043 [P] Verify prefers-reduced-motion works correctly across all animations
- [X] T044 Test responsive breakpoints for all visual enhancements on mobile/tablet/desktop
- [X] T045 Performance audit - ensure 60fps animations on desktop, 30fps minimum on mobile
- [X] T046 Accessibility audit - verify WCAG 2.1 AA compliance maintained
- [X] T047 Cross-browser testing (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- [X] T048 Update specs/002-modern-ui-enhancements/quickstart.md with any implementation notes
- [X] T049 Run visual regression testing across all pages and components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent of US1 but may share Layout animations
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent of US1/US2
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Independent of other stories

### Within Each User Story

- Tasks marked [P] can run in parallel (different components/files)
- Components should be enhanced before pages that use them
- CSS utilities and hooks created in Foundational phase before component updates
- Visual testing after each user story phase completion

### Parallel Opportunities

- **Phase 1**: T002 and T003 can run in parallel with T001
- **Phase 2**: T004, T005, T006, T007, T008 can all run in parallel after T002 completes (T002 sets up globals.css foundation)
- **Once Foundational completes**: All user stories (Phase 3-7) can start in parallel if team capacity allows
- **Within User Story 1**: T009 and T010 can run in parallel
- **Within User Story 2**: T014 and T015 can run in parallel, T019 can run in parallel with T014-T018
- **Within User Story 3**: T020 and T021 can run in parallel
- **Within User Story 5**: T032 and T033 can run in parallel
- **Polish phase**: T037, T038, T042, T043 can run in parallel

---

## Parallel Example: User Story 2 (Movie Cards)

```bash
# After Foundational phase completes, launch all movie card tasks together:
Task: "Update components/MovieCard.tsx with glassmorphism backdrop"
Task: "Add 3D tilt effect to components/MovieCard.tsx using use3DTilt hook"
Task: "Update components/Card.tsx with glassmorphism variant"

# Then integrate after parallel tasks complete:
Task: "Implement image zoom on hover in components/MovieCard.tsx"
Task: "Add gradient overlay to movie poster in components/MovieCard.tsx"
Task: "Add staggered entrance animation to components/MovieCard.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only - Both P1)

1. Complete Phase 1: Setup (Tailwind config, global styles)
2. Complete Phase 2: Foundational (CRITICAL - custom hooks and utilities)
3. Complete Phase 3: User Story 1 (Landing page visual impact)
4. Complete Phase 4: User Story 2 (Interactive movie cards)
5. **STOP and VALIDATE**: Test homepage and movie cards visually
6. Deploy/demo if ready

**Rationale**: US1 and US2 are both P1 and deliver immediate visual impact on the most-viewed pages (homepage and movie browsing). This creates the "wow" factor users will notice first.

### Incremental Delivery

1. Complete Setup + Foundational → Custom hooks and utilities ready
2. Add User Story 1 → Test visually → Deploy/Demo (gradient hero, animations)
3. Add User Story 2 → Test visually → Deploy/Demo (interactive cards - MVP complete!)
4. Add User Story 3 → Test visually → Deploy/Demo (premium forms)
5. Add User Story 4 → Test visually → Deploy/Demo (navigation enhancements)
6. Add User Story 5 → Test visually → Deploy/Demo (review card aesthetics)
7. Complete Polish → Final testing and optimization

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Landing page)
   - Developer B: User Story 2 (Movie cards)
   - Developer C: User Story 3 (Forms)
   - Developer D: User Story 4 (Navigation)
3. Stories complete independently and integrate without conflicts

---

## Visual Testing Checklist

After each user story phase:

- [ ] Verify animations run at 60fps on desktop Chrome/Firefox/Safari/Edge
- [ ] Verify animations run at minimum 30fps on mobile Safari/Chrome
- [ ] Test with `prefers-reduced-motion` enabled - animations should be disabled
- [ ] Test glassmorphism fallback on browsers without backdrop-filter support
- [ ] Verify gradient colors display correctly in light and dark contexts
- [ ] Test all hover states and micro-interactions
- [ ] Verify responsive behavior on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] Check keyboard navigation and focus states for accessibility
- [ ] Verify loading states and skeleton loaders display correctly
- [ ] Test form interactions and floating label animations

---

## Performance Benchmarks

Target metrics per user story:

- **User Story 1**: Lighthouse Performance score ≥ 90, LCP < 2s
- **User Story 2**: 60fps hover animations on desktop, smooth 3D transforms
- **User Story 3**: < 100ms input focus response time
- **User Story 4**: Smooth scroll performance, no jank during navigation transitions
- **User Story 5**: Expand/collapse animations complete in < 300ms

---

## Notes

- All tasks focus on visual enhancements - no backend changes required
- [P] tasks involve different files and can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and visually testable
- Commit after each task or logical group of related tasks
- Stop at any checkpoint to validate story independently with visual testing
- Respect prefers-reduced-motion in ALL animations for accessibility
- Progressive enhancement: graceful fallbacks for older browsers
- Focus on reusable components and utility classes for consistency
