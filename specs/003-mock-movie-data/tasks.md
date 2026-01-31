# Tasks: Mock Movie Data for Local Development

**Feature**: 003-mock-movie-data  
**Input**: Design documents from `/specs/003-mock-movie-data/`  
**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [quickstart.md](quickstart.md), [contracts/mock-data-schema.json](contracts/mock-data-schema.json)

---

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, etc.) - only for user story tasks
- File paths are absolute from repository root

**Note**: This feature has **NO** test tasks - tests not requested in specification

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Prepare directory structure and initial files

- [ ] T001 Create lib/data/ directory for mock data storage
- [ ] T002 [P] Verify existing types in lib/types.ts match data model requirements (Movie, Review interfaces)

**Checkpoint**: Directory structure ready for mock data implementation

---

## Phase 2: Foundational (Mock Data Infrastructure)

**Purpose**: Core mock data system that ALL API routes depend on

**⚠️ CRITICAL**: This phase MUST complete before any API modifications can begin

- [ ] T003 Create lib/data/mock-movies.json with complete dataset (80 movies, 400-600 reviews per data-model.md)
- [ ] T004 Create lib/mock-data-loader.ts with environment detection logic and data loading functions
- [ ] T005 Add TypeScript validation functions in lib/mock-data-loader.ts (validateMockData, isValidMovie, isValidReview)
- [ ] T006 Test mock-data-loader.ts loads data correctly and validates JSON structure

**Checkpoint**: Mock data infrastructure complete - API routes can now integrate mock data conditionally

---

## Phase 3: User Story 1 - View All Movies in Development Mode (Priority: P1) 🎯 MVP

**Goal**: Developer runs `npm run dev` and sees 80 movies on homepage without Firebase configuration

**Independent Test**: 
1. Delete or rename `.env.local` if it exists
2. Run `npm run dev`
3. Navigate to http://localhost:3000
4. Verify homepage displays 80 movies with posters, titles, years, directors

### Implementation for User Story 1

- [ ] T007 [US1] Modify pages/api/movies/index.ts to detect Firebase availability using environment variables
- [ ] T008 [US1] Add mock data fallback to pages/api/movies/index.ts (return all movies from mock-data-loader)
- [ ] T009 [US1] Add console logging to pages/api/movies/index.ts ("🎬 Development mode: Using mock movie data")
- [ ] T010 [US1] Test GET /api/movies returns mock data when Firebase credentials missing
- [ ] T011 [US1] Verify homepage components display all 80 movies correctly

**Checkpoint**: Homepage displays full mock movie catalog in development mode - User Story 1 COMPLETE

---

## Phase 4: User Story 2 - View Individual Movie with Reviews (Priority: P1) 🎯 MVP

**Goal**: Developer clicks any movie and sees detail page with movie info and all its reviews

**Independent Test**:
1. With dev server running (mock mode)
2. Navigate to http://localhost:3000/movies/mov-001
3. Verify movie details display (title, year, director, actors, poster)
4. Verify reviews display below (3-15 reviews with grades A+ through F)

### Implementation for User Story 2

- [ ] T012 [US2] Modify pages/api/movies/[id].ts to detect Firebase availability
- [ ] T013 [US2] Add mock data fallback to pages/api/movies/[id].ts (return single movie + reviews from mock-data-loader)
- [ ] T014 [US2] Add 404 handling when movieId not found in mock data
- [ ] T015 [US2] Add console logging for movie detail requests
- [ ] T016 [US2] Test GET /api/movies/mov-001 returns movie with reviews array
- [ ] T017 [US2] Verify movie detail page displays correctly with mock reviews

**Checkpoint**: Movie detail pages fully functional with mock data - User Story 2 COMPLETE

---

## Phase 5: User Story 3 - View Reviews for a Movie (Priority: P2)

**Goal**: API endpoint for fetching just reviews (used by ReviewList component)

**Independent Test**:
1. With dev server running (mock mode)
2. Navigate to http://localhost:3000/movies/mov-001 and scroll to reviews section
3. Verify ReviewList component displays all reviews for that movie

### Implementation for User Story 3

- [ ] T018 [US3] Modify pages/api/movies/[id]/reviews.ts to detect Firebase availability
- [ ] T019 [US3] Add mock data fallback to pages/api/movies/[id]/reviews.ts (return reviews array for movieId)
- [ ] T020 [US3] Handle case where movie has zero reviews (empty array)
- [ ] T021 [US3] Add console logging for review fetching
- [ ] T022 [US3] Test GET /api/movies/mov-001/reviews returns reviews array
- [ ] T023 [US3] Test GET /api/movies/mov-010/reviews returns empty array (movie with no reviews)

**Checkpoint**: Review fetching API fully functional - User Story 3 COMPLETE

---

## Phase 6: User Story 4 - Submit Review in Mock Mode (Priority: P3)

**Goal**: Review submission returns mock success response (doesn't persist, but doesn't error)

**Independent Test**:
1. Navigate to movie detail page
2. Fill out review form (if authenticated in real app, or test API directly)
3. Submit review
4. Verify success message displays
5. Refresh page - verify new review NOT persisted (expected behavior in mock mode)

### Implementation for User Story 4

- [ ] T024 [US4] Modify pages/api/movies/[id]/reviews.ts POST handler to detect Firebase availability
- [ ] T025 [US4] Add mock success response for POST requests (return mock review object with generated ID)
- [ ] T026 [US4] Add console warning: "⚠️ Review submitted in mock mode - not persisted"
- [ ] T027 [US4] Validate request body matches Review interface
- [ ] T028 [US4] Test POST /api/movies/mov-001/reviews returns success response
- [ ] T029 [US4] Verify form submission doesn't error in development mode

**Checkpoint**: Review submission gracefully handled in mock mode - User Story 4 COMPLETE

---

## Phase 7: User Story 5 - Individual Review Operations (Priority: P3)

**Goal**: Review detail/update/delete endpoints return appropriate mock responses

**Independent Test**:
1. Test GET /api/reviews/rev-001-001 returns single review
2. Verify admin page (if implemented) doesn't error when fetching reviews

### Implementation for User Story 5

- [ ] T030 [US5] Modify pages/api/reviews/[id].ts GET handler to detect Firebase availability
- [ ] T031 [US5] Add mock data fallback for GET (find review by ID across all movies)
- [ ] T032 [US5] Add mock responses for PUT/DELETE (return success without mutation)
- [ ] T033 [US5] Add console logging for all review operations
- [ ] T034 [US5] Test GET /api/reviews/rev-001-001 returns correct review object
- [ ] T035 [US5] Test PUT/DELETE return mock success responses

**Checkpoint**: All review operations handled in mock mode - User Story 5 COMPLETE

---

## Phase 8: User Story 6 - Documentation and Developer Experience (Priority: P2)

**Goal**: New developers understand how to use mock mode and can troubleshoot issues

**Independent Test**:
1. Fresh clone of repository
2. Follow quickstart.md instructions
3. Verify all steps work without prior Firebase knowledge
4. Check console for helpful emoji indicators

### Implementation for User Story 6

- [ ] T036 [P] [US6] Update README.md with "Mock Data Mode" section explaining automatic detection
- [ ] T037 [P] [US6] Add "Quick Start (No Firebase Required)" section to README.md with 3-step process
- [ ] T038 [P] [US6] Add "Switching to Firebase" section to README.md
- [ ] T039 [P] [US6] Document mock data structure and customization in README.md
- [ ] T040 [US6] Verify quickstart.md instructions match actual implementation
- [ ] T041 [US6] Add troubleshooting section for common issues (blank screen, images not loading)

**Checkpoint**: Documentation complete - onboarding time < 5 minutes verified - User Story 6 COMPLETE

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and refinement across all user stories

- [ ] T042 [P] Run JSON validator on lib/data/mock-movies.json (npx prettier --check)
- [ ] T043 [P] Verify all 80 movies have valid image URLs (load test in browser)
- [ ] T044 Verify grade distribution matches spec (A+/A 30%, B 25%, C 20%, D 15%, F 10%)
- [ ] T045 Test edge cases: movie with 0 reviews, movie with 15 reviews, very long title
- [ ] T046 [P] Verify production build ignores mock data (set NODE_ENV=production and verify Firebase required)
- [ ] T047 Test all console logging shows appropriate emoji indicators (🎬, 📊, ⚠️, ❌)
- [ ] T048 Run through quickstart.md validation steps (fresh clone simulation)
- [ ] T049 Verify all acceptance criteria from spec.md are met
- [ ] T050 Code cleanup: remove any commented-out code, ensure consistent formatting

**Checkpoint**: Feature 003 complete and validated - ready for merge to develop

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← CRITICAL BLOCKER
    ↓
Phase 3-7 (User Stories) ← Can proceed in parallel if staffed
    ↓
Phase 8 (Documentation)
    ↓
Phase 9 (Polish)
```

### User Story Dependencies

- **Phase 1 & 2**: MUST complete first (no parallelization)
- **Phase 3 (US1)**: No dependencies - can start after Phase 2 ✅
- **Phase 4 (US2)**: No dependencies - can start after Phase 2 ✅
- **Phase 5 (US3)**: No dependencies - can start after Phase 2 ✅
- **Phase 6 (US4)**: Depends on US2 implementation (uses same file pages/api/movies/[id]/reviews.ts)
- **Phase 7 (US5)**: No dependencies - can start after Phase 2 ✅
- **Phase 8 (US6)**: Should wait until US1-5 complete for accurate documentation
- **Phase 9 (Polish)**: Waits for all user stories

### Within Each Phase

**Phase 2 (Foundational)**:
1. T003 must complete first (mock data file)
2. T004-T005 can run in parallel after T003
3. T006 validates T003-T005

**Phase 3 (US1)**:
- T007-T009 run sequentially (same file)
- T010-T011 run after T007-T009 (validation)

**Phase 4 (US2)**:
- T012-T015 run sequentially (same file)
- T016-T017 run after T012-T015 (validation)

**Phase 5 (US3)**:
- T018-T021 run sequentially (same file)
- T022-T023 run after T018-T021 (validation)

**Phase 6 (US4)**:
- ⚠️ Uses same file as US3 (pages/api/movies/[id]/reviews.ts)
- Must run AFTER Phase 5 complete
- T024-T027 run sequentially
- T028-T029 validation

**Phase 7 (US5)**:
- T030-T033 run sequentially (same file)
- T034-T035 run after T030-T033 (validation)

**Phase 8 (US6)**:
- T036-T039 can run in parallel (different sections of README)
- T040-T041 run after implementation complete

**Phase 9 (Polish)**:
- T042-T043 can run in parallel
- Others run sequentially for validation

### Parallel Opportunities

**Maximum Parallelization Strategy** (if multiple developers):

1. **After Phase 2 completes**, launch simultaneously:
   - Developer A: Phase 3 (US1) - pages/api/movies/index.ts
   - Developer B: Phase 4 (US2) - pages/api/movies/[id].ts
   - Developer C: Phase 7 (US5) - pages/api/reviews/[id].ts

2. **Once Developer B finishes Phase 4**:
   - Developer B: Phase 5 (US3) → Phase 6 (US4) - pages/api/movies/[id]/reviews.ts

3. **Once all implementations done**:
   - Any developer: Phase 8 (US6) - Documentation

4. **Finally**:
   - Any developer: Phase 9 (Polish) - Validation

**Solo Developer Strategy** (recommended order):
1. Phase 1 → Phase 2 (foundational setup)
2. Phase 3 (US1) - Get homepage working (MVP!)
3. Phase 4 (US2) - Movie details working
4. Phase 5 (US3) → Phase 6 (US4) - Reviews endpoint (same file, sequential)
5. Phase 7 (US5) - Review operations
6. Phase 8 (US6) - Documentation
7. Phase 9 (Polish) - Final validation

---

## Parallel Example: User Story Implementation

```bash
# After Phase 2 (Foundational) completes, three developers can work simultaneously:

# Developer A - Terminal 1
Task: T007 [US1] Modify pages/api/movies/index.ts
Task: T008 [US1] Add mock data fallback to pages/api/movies/index.ts
Task: T009 [US1] Add console logging to pages/api/movies/index.ts

# Developer B - Terminal 2
Task: T012 [US2] Modify pages/api/movies/[id].ts
Task: T013 [US2] Add mock data fallback to pages/api/movies/[id].ts
Task: T014 [US2] Add 404 handling

# Developer C - Terminal 3
Task: T030 [US5] Modify pages/api/reviews/[id].ts GET handler
Task: T031 [US5] Add mock data fallback for GET
Task: T032 [US5] Add mock responses for PUT/DELETE
```

---

## Implementation Strategy

### MVP First (Phases 1-3 Only)

**Goal**: Get homepage working with mock data ASAP

1. ✅ Phase 1: Setup (< 5 minutes)
2. ✅ Phase 2: Foundational - Create mock data and loader (2-3 hours)
3. ✅ Phase 3: User Story 1 - Modify movies index API (30 minutes)
4. **STOP and VALIDATE**: Open http://localhost:3000 and verify 80 movies display
5. **Deploy/Demo**: Show working homepage to stakeholders

**Time to MVP**: ~3-4 hours  
**Value**: New developers can immediately see populated homepage

### Incremental Delivery

1. **Foundation** (Phases 1-2): Mock data infrastructure ready
2. **Increment 1** (Phase 3): Homepage works → Test independently → Commit
3. **Increment 2** (Phase 4): Movie details work → Test independently → Commit
4. **Increment 3** (Phases 5-6): Reviews API works → Test independently → Commit
5. **Increment 4** (Phase 7): Review operations work → Test independently → Commit
6. **Increment 5** (Phase 8): Documentation complete → Onboard new developer
7. **Polish** (Phase 9): Final validation → Merge to develop

Each increment is independently valuable and testable.

### Validation Checkpoints

**After Phase 3 (US1)** - Homepage Test:
```bash
# In browser console:
fetch('/api/movies').then(r => r.json()).then(console.log)
# Expected: { movies: [...80 movies...] }

# Visual check:
# - Homepage displays 80 movie cards
# - All posters load (picsum.photos)
# - Console shows: "🎬 Development mode: Using mock movie data"
```

**After Phase 4 (US2)** - Movie Detail Test:
```bash
fetch('/api/movies/mov-001').then(r => r.json()).then(console.log)
# Expected: { movie: {...}, reviews: [...reviews...] }

# Visual check:
# - Movie detail page displays all metadata
# - Reviews section shows 3-15 reviews with grades
```

**After Phases 5-6 (US3-US4)** - Reviews API Test:
```bash
fetch('/api/movies/mov-001/reviews').then(r => r.json()).then(console.log)
# Expected: { reviews: [...reviews...] }

# Test empty state:
fetch('/api/movies/mov-010/reviews').then(r => r.json()).then(console.log)
# Expected: { reviews: [] }
```

**After Phase 9 (Polish)** - Full Validation:
1. Fresh clone in new directory
2. `npm install` && `npm run dev`
3. Time from clone to working app (target: < 5 minutes)
4. Visual inspection of all pages
5. Check console for emoji indicators
6. Verify quickstart.md steps match actual experience

---

## Task Completion Tracking

**Total Tasks**: 50  
**Estimated Time**: 7-11 hours (solo developer)

**Breakdown by Phase**:
- Phase 1 (Setup): 2 tasks - 5 minutes
- Phase 2 (Foundational): 4 tasks - 2-3 hours ⚠️ Critical path
- Phase 3 (US1): 5 tasks - 30-45 minutes
- Phase 4 (US2): 6 tasks - 45-60 minutes
- Phase 5 (US3): 6 tasks - 30-45 minutes
- Phase 6 (US4): 6 tasks - 45 minutes
- Phase 7 (US5): 6 tasks - 45 minutes
- Phase 8 (US6): 6 tasks - 1 hour
- Phase 9 (Polish): 9 tasks - 1-2 hours

**Critical Path**: Phase 2 (mock data creation) takes longest - all other phases blocked until complete

**Quick Wins** (can show progress early):
- After T003: Mock JSON exists → can inspect data structure
- After T006: Mock loader works → can test in Node.js
- After T011: Homepage works → visual demo ready (MVP!)

---

## Notes

- **No [P] markers within phases** for tasks that modify the same file (sequential execution required)
- **[P] markers** only for tasks that modify different files or independent validation steps
- **[Story] labels** (US1-US6) map to user scenarios from spec.md for traceability
- Each phase has a **checkpoint** - stop and validate before continuing
- **No test tasks** - testing is manual/visual per specification (no TDD requested)
- Commit frequently - ideally after each checkpoint or logical task group
- All tasks include **exact file paths** from repository root

---

## Success Metrics (from spec.md)

**SC-001: Developer Onboarding Time**
- Target: < 5 minutes from clone to working app
- Validate: Fresh clone → npm install → npm run dev → browser
- Checkpoint: Phase 9, Task T048

**SC-002: Data Quality**
- Target: Mock data indistinguishable from production in UI
- Validate: Side-by-side comparison with Firebase mode
- Checkpoint: Phase 9, Task T044

**SC-003: Zero Configuration**
- Target: No .env.local required
- Validate: Works immediately after npm install
- Checkpoint: Phase 3, Task T010

**SC-004: Complete Coverage**
- Target: All UI components function with mock data
- Validate: Homepage, movie detail, reviews all render
- Checkpoint: Phase 9, Task T045

---

## Additional Resources

- [Implementation Plan](plan.md) - Technical approach and timeline
- [Data Model](data-model.md) - Movie/Review schema with 80 movies specification
- [Quickstart Guide](quickstart.md) - Developer instructions for using mock mode
- [JSON Schema](contracts/mock-data-schema.json) - Validation schema for mock-movies.json
- [Research Decisions](research.md) - Technical decisions documented (8 decisions)
