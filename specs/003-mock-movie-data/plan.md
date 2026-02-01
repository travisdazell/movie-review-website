# Implementation Plan: Mock Movie Data for Local Development

**Branch**: `003-mock-movie-data` | **Date**: 2026-01-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-mock-movie-data/spec.md`

## Summary

Enable local development without Firebase by providing 50-100 mock movies with reviews that automatically load in development mode. Mock data matches Firebase API structure for zero code changes. Developers can clone, install, and immediately see populated UI within 5 minutes.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14.2.35  
**Primary Dependencies**: None (uses existing Next.js API routes, no new packages)  
**Storage**: Static JSON file in `/lib/data/mock-movies.json` (committed to repo)  
**Testing**: Manual visual testing, TypeScript type validation  
**Target Platform**: Local development (Node.js 18+), any OS  
**Project Type**: Web application (Next.js with API routes)  
**Performance Goals**: < 50ms API response time, instant page load with mock data  
**Constraints**: Zero configuration, works offline, production builds must ignore mock data  
**Scale/Scope**: 50-100 movies, 3-15 reviews per movie, ~500-1500 total review records

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ PASS - No constitution violations (constitution template not customized for this project)

**Pre-Research Validation** (Phase 0):
- No new external dependencies required
- Uses existing project structure and patterns
- Simple static data file with conditional API logic
- No architectural changes needed

**Post-Design Validation** (Phase 1):
- ✅ Data model aligns with existing TypeScript types (Movie, Review interfaces)
- ✅ Mock data JSON schema validated and documented
- ✅ API contracts maintain backward compatibility with Firebase
- ✅ Zero breaking changes to existing components
- ✅ Environment detection logic is transparent (console logging)
- ✅ Graceful degradation: Firebase mode unaffected by mock data code
- ✅ Developer experience improved: < 5 minute onboarding time
- ✅ All Phase 1 deliverables complete: data-model.md, quickstart.md, contracts/mock-data-schema.json

## Project Structure

### Documentation (this feature)

```text
specs/003-mock-movie-data/
├── plan.md              # This file
├── research.md          # Phase 0: Mock data patterns and image sources
├── data-model.md        # Phase 1: Movie and Review data structure
├── quickstart.md        # Phase 1: How to use mock data mode
├── contracts/           # Phase 1: Mock data JSON schema
│   └── mock-data-schema.json
└── tasks.md             # Phase 2: Task breakdown (created by /speckit.tasks)
```

### Source Code (repository root)

```text
lib/
├── data/
│   └── mock-movies.json        # NEW: Static mock dataset (50-100 movies with reviews)
├── hooks/                      # Existing
├── types.ts                    # Existing (Movie, Review interfaces)
└── mock-data-loader.ts         # NEW: Development mode detection and mock data API

pages/
├── api/
│   ├── movies/
│   │   ├── index.ts           # MODIFIED: Add mock data fallback
│   │   ├── [id].ts            # MODIFIED: Add mock data fallback
│   │   └── [id]/
│   │       └── reviews.ts     # MODIFIED: Add mock data fallback
│   └── reviews/
│       └── [id].ts            # MODIFIED: Add mock data fallback
├── index.tsx                   # Existing (no changes needed)
└── movies/
    └── [id].tsx               # Existing (no changes needed)

README.md                       # MODIFIED: Add mock data mode documentation
```

**Structure Decision**: Minimal changes to existing Next.js structure. Single mock data JSON file in `/lib/data/` with helper module for loading. API routes conditionally return mock data when Firebase unavailable.

## Complexity Tracking

> No constitutional violations - this section intentionally left blank

---

## Phase 0: Research & Discovery

**Objective**: Validate mock data approach and identify best practices

### Research Tasks

1. **Mock Data Patterns**
   - How Next.js detects development vs production mode
   - Best practices for static JSON in Next.js projects
   - Environment variable patterns for feature flags

2. **Placeholder Image Services**
   - Evaluate picsum.photos reliability and API
   - Identify 2-3 fallback image services
   - Test loading times and availability
   - Document base64 fallback strategy

3. **Data Generation Strategy**
   - Realistic movie title sources (public domain films, fictional titles)
   - Review text templates that read naturally
   - Grade distribution patterns for testing

4. **Type Safety**
   - Ensure mock data matches existing Movie/Review TypeScript interfaces
   - Validation approach for JSON structure
   - Build-time type checking strategies

### Research Deliverable: `research.md`

Document findings in structured format:

```markdown
# Research: Mock Movie Data Implementation

## Decision 1: Development Mode Detection
**Chosen**: Check for Firebase environment variables (FIREBASE_PROJECT_ID)
**Rationale**: [reasoning]
**Alternatives Considered**: NODE_ENV, custom flag, etc.

## Decision 2: Image Source
**Chosen**: [selected service]
**Fallback Strategy**: [backup plan]
**Rationale**: [reasoning]

## Decision 3: Data Structure
**Chosen**: [JSON format]
**Rationale**: [reasoning]
```

---

## Phase 1: Design & Contracts

**Objective**: Define data model and API contracts

### Design Tasks

1. **Data Model Definition**
   - Extend existing Movie/Review interfaces if needed
   - Define mock data JSON schema
   - Document field requirements and constraints

2. **API Contract**
   - `/api/movies` response structure with mock data
   - `/api/movies/[id]` response structure with reviews
   - Error handling for missing mock data

3. **Development Setup**
   - Mock data loading strategy
   - Environment detection logic
   - Logging and debugging approach

### Deliverable 1: `data-model.md`

```markdown
# Data Model: Mock Movie Data

## Movie Entity
```typescript
interface MockMovie {
  id: string;
  title: string;
  year: number;
  director: string;
  actors: string[];
  image: string; // URL to placeholder image
}
```

## Review Entity
[Define structure]

## Relationships
[Document how movies link to reviews in JSON]
```

### Deliverable 2: `contracts/mock-data-schema.json`

JSON schema defining mock data file structure:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "movies": {
      "type": "array",
      "items": { ... }
    },
    "reviews": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        ...
      }
    }
  }
}
```

### Deliverable 3: `quickstart.md`

```markdown
# Quickstart: Mock Movie Data

## For Developers

### Running with Mock Data (Default)
```bash
npm install
npm run dev  # Mock data loads automatically
```

### Switching to Firebase
```bash
# Add Firebase credentials to .env.local
FIREBASE_PROJECT_ID=your-project
# Restart server - Firebase mode detected
```

## How It Works
[Explain detection logic, data location, customization]

## Troubleshooting
[Common issues and solutions]
```

---

## Phase 2: Implementation (Handled by /speckit.tasks)

**Note**: Task breakdown will be created by running `/speckit.tasks` command after this planning phase completes.

**Expected Implementation Scope**:

1. Create mock data JSON file (50-100 movies, 200-1000 reviews)
2. Create mock data loader module
3. Modify API routes to check for Firebase config and fallback to mock data
4. Add logging for transparency
5. Update README with mock data documentation
6. Test visual UI with mock data
7. Verify production builds ignore mock data

---

## Validation & Testing Strategy

### Pre-Implementation Validation

- [ ] Constitution check passed (✅ Complete - no violations)
- [ ] All NEEDS CLARIFICATION resolved in research.md
- [ ] Data model matches existing TypeScript types
- [ ] API contracts preserve current component compatibility

### Implementation Testing

1. **Development Mode**
   - Fresh clone test: `git clone` → `npm install` → `npm run dev` → verify UI
   - Offline test: Disconnect network, verify app works
   - Performance: Measure page load time < 2s

2. **Production Safety**
   - Build test: `npm run build` → verify no mock data bundled
   - Environment test: Set production env vars → verify Firebase attempted
   - Console test: Ensure no "mock data" messages in production

3. **Data Quality**
   - Visual test: Compare UI with mock vs Firebase data side-by-side
   - Type test: Run TypeScript compiler to validate mock data structure
   - Coverage test: Verify all grades A+ through F represented

### Success Criteria Validation

- [ ] SC-001: New developer onboarding < 5 minutes (timed test)
- [ ] SC-002: Mock data indistinguishable from production (visual comparison)
- [ ] SC-003: Zero configuration (fresh clone test without .env)
- [ ] SC-004: All components function (component smoke test)

---

## Dependencies & Prerequisites

### Required Before Starting

- Feature 001 (movie-review-website): Core application ✅
- Feature 002 (modern-ui-enhancements): UI components ✅
- Existing `/pages/api/movies` endpoints ✅
- TypeScript types for Movie/Review ✅

### No New Dependencies

This feature requires zero new npm packages.

---

## Risk Mitigation

### Risk 1: Image Service Downtime
**Mitigation Implemented in Phase 1**:
- Document 3 image services (primary + 2 fallbacks)
- Include base64-encoded 1x1 pixel fallback in code
- Test all services during research phase

### Risk 2: Mock Data Staleness
**Mitigation**:
- TypeScript validation catches schema mismatches
- Document mock data location in README (line 10)
- Add comment in types.ts referencing mock data file

### Risk 3: Production Leak
**Mitigation**:
- Explicit Firebase config check (not just NODE_ENV)
- Integration test verifies production build behavior
- Console warnings in development mode only

---

## Timeline & Phases

**Phase 0 (Research)**: 1-2 hours
- Evaluate image services
- Research Next.js environment detection
- Document decisions

**Phase 1 (Design)**: 2-3 hours
- Create data model
- Define JSON schema
- Write quickstart guide

**Phase 2 (Implementation)**: 4-6 hours
- Generate 50-100 movies JSON
- Create loader module
- Modify 4 API routes
- Test end-to-end

**Total Estimate**: 7-11 hours (1-2 days)

---

## Post-Implementation

### Agent Context Update

After implementation completes:

```powershell
.\.specify\scripts\powershell\update-agent-context.ps1 -AgentType copilot
```

Adds to `.github/agents/copilot-instructions.md`:
- Mock data mode usage
- How to customize mock data
- Development mode detection logic

### Documentation Updates

- Update main README.md with "Local Development" section
- Add mock data note to quickstart.md
- Document in package.json scripts if needed

---

## Notes

- This feature is development-only and has no user-facing impact
- Mock data file will be ~100-200 KB (acceptable for repo)
- Future enhancement: Consider mock authentication (Feature 004)
- Image URLs should use HTTPS for consistency with production

