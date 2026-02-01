# Feature Specification: Mock Movie Data for Local Development

**Feature Number**: 003  
**Feature Name**: Mock Movie Data  
**Created**: 2026-01-31  
**Status**: Draft  
**Priority**: P2 (Development tooling)

---

## Overview

### Purpose

Enable local development and testing without requiring Firebase authentication or live database connections by providing a comprehensive set of mock movie data (50-100 movies) that can be viewed by unauthenticated users.

### Business Value

- **Faster Development**: Developers can work offline without Firebase dependencies
- **Easier Onboarding**: New team members can run the app immediately without configuration
- **Better Testing**: Consistent test data for UI/UX validation and visual testing
- **Demo Ready**: Instant data for demonstrations and presentations

### Target Users

- **Primary**: Software developers working on the movie review website
- **Secondary**: QA testers validating UI/UX functionality
- **Tertiary**: Stakeholders viewing demos without authentication

---

## User Scenarios & Testing

### Scenario 1: Developer Starting Local Development

**Actor**: New developer joining the team

**Goal**: Run the application locally and see realistic movie data without any configuration

**Flow**:
1. Developer clones the repository
2. Developer runs `npm install`
3. Developer runs `npm run dev`
4. Developer navigates to `http://localhost:3000`
5. Homepage displays 50-100 movies with posters, titles, metadata
6. Developer can browse movies, view detail pages, and see mock reviews
7. All UI components render with realistic data

**Success Criteria**:
- Application displays immediately without authentication
- Movie data includes diverse genres, years (1970-2025), and ratings
- Images load consistently (no broken posters)
- Review data shows variety of grades (A+ through F) and text lengths

### Scenario 2: Testing UI Components

**Actor**: Frontend developer testing new UI features

**Goal**: Validate UI components with edge cases and various data states

**Flow**:
1. Developer works on MovieCard component changes
2. Developer views homepage with 50+ movies
3. Developer sees movies with different title lengths (short/long)
4. Developer sees movies with varying numbers of reviews (0-20)
5. Developer tests responsive layout with consistent data
6. Developer validates glassmorphism effects with real poster images

**Success Criteria**:
- Mock data includes edge cases (very long titles, many actors, no reviews)
- Poster images represent variety of aspect ratios and colors
- Data remains consistent across page refreshes
- All grade values (A+ through F) are represented

### Scenario 3: Demo Presentation

**Actor**: Product owner demonstrating the application

**Goal**: Show stakeholders the completed UI without live authentication

**Flow**:
1. Presenter opens application in browser
2. Homepage immediately shows polished movie collection
3. Presenter clicks through to movie detail pages
4. Reviews display with varied user feedback and grades
5. Presenter navigates smoothly without authentication prompts

**Success Criteria**:
- Application feels production-ready with quality mock data
- No authentication barriers for viewing content
- Data represents realistic movie catalog with popular titles
- Review content reads naturally (not placeholder text)

---

## Functional Requirements

### FR-001: Mock Data Generation [CRITICAL]

**Requirement**: System MUST provide a collection of 50-100 mock movies with complete metadata

**Details**:
- Each movie includes: title, year, director, actors array, poster image URL, unique ID
- Years range from 1970 to 2025
- Directors and actors use realistic names
- Poster images use publicly available placeholder or real movie posters
- Data stored in JSON format for easy maintenance

**Acceptance Criteria**:
- Minimum 50 movies in mock dataset
- All required fields populated for each movie
- No duplicate movie IDs
- Valid image URLs that load successfully

### FR-002: Mock Review Data [CRITICAL]

**Requirement**: System MUST generate 3-15 mock reviews per movie with varied content

**Details**:
- Reviews include: userId (mock username), grade (A+ through F), review text, creation date
- Review text varies in length (50-500 characters)
- Grades distributed across full range (not all A+ or F)
- Dates span last 6 months for realism
- Some movies have 0 reviews to test empty states

**Acceptance Criteria**:
- Each movie has 0-15 reviews
- Grade distribution: A+/A (30%), B (25%), C (20%), D (15%), F (10%)
- Review text reads naturally, not lorem ipsum
- At least 5 movies with zero reviews for edge case testing

### FR-003: Development Mode Detection [CRITICAL]

**Requirement**: System MUST automatically use mock data when running in local development mode

**Details**:
- Detect when `NODE_ENV !== 'production'` or Firebase credentials missing
- Bypass Firebase API calls and return mock data
- Log clear message: "Running in development mode with mock data"
- No code changes required by developer to switch modes

**Acceptance Criteria**:
- Mock data loads automatically on `npm run dev`
- Production builds still use Firebase
- Console message confirms mock data mode
- Zero configuration needed for new developers

### FR-004: API Compatibility

**Requirement**: Mock data API MUST match the same interface as Firebase API endpoints

**Details**:
- `/api/movies` returns mock movie list with same structure
- `/api/movies/[id]` returns mock movie with reviews
- Response format identical to Firebase responses
- Async behavior maintained (simulated delay optional)

**Acceptance Criteria**:
- Components work identically with mock or real data
- TypeScript types match existing Movie and Review interfaces
- No component code changes needed
- API response time < 100ms for instant feedback

### FR-005: Realistic Movie Titles

**Requirement**: Mock movies SHOULD use recognizable or realistic movie titles

**Details**:
- Include mix of classic films (1970s-1990s) and modern releases (2000-2025)
- Use real movie titles from public domain or generate realistic fictional titles
- Avoid copyrighted content concerns with proper attribution or fictional titles
- Cover multiple genres: Action, Drama, Comedy, Sci-Fi, Horror, Romance, Documentary

**Acceptance Criteria**:
- At least 30 different genres represented
- Title lengths vary from 5 to 50 characters
- Titles read professionally (not "Movie 1", "Movie 2")
- Diverse representation in content and creators

### FR-006: Image Management

**Requirement**: Mock movie posters MUST load reliably without external dependencies

**Details**:
- Use placeholder image service (picsum.photos, placeholder.com) or bundled local images
- Consistent aspect ratio (2:3 standard movie poster)
- Variety of colors and compositions for UI testing
- Images optimized for web (< 200KB each)

**Acceptance Criteria**:
- 100% image load success rate
- No broken image icons
- Images load in < 1 second on local development
- Fallback placeholder for missing images

---

## Success Criteria

### SC-001: Developer Onboarding Time

**Metric**: New developers can view fully populated application within 5 minutes of cloning repository

**Validation**:
- Clone repo: 1-2 minutes
- `npm install`: 2-3 minutes
- `npm run dev` + open browser: < 30 seconds
- Total: < 5 minutes to working app with data

### SC-002: Data Quality

**Metric**: Mock data is indistinguishable from production data in UI presentation

**Validation**:
- Side-by-side comparison shows no visual differences
- Review text reads naturally (passes basic grammar check)
- Images display professional quality
- Metadata (years, names) appears realistic

### SC-003: Zero Configuration

**Metric**: No environment variables or setup required for mock data mode

**Validation**:
- Fresh clone works without `.env.local` file
- No Firebase configuration needed
- No additional npm packages to install
- Works immediately after `npm run dev`

### SC-004: Complete Coverage

**Metric**: All existing UI components function with mock data

**Validation**:
- Homepage displays movie grid
- Movie detail pages show full information
- Review lists render with varied grades
- Admin pages display mock data (if implemented)
- No component shows loading state indefinitely

---

## Scope

### In Scope

- JSON file with 50-100 mock movies
- Mock review generation for each movie
- Development mode detection and automatic mock data loading
- API endpoint wrappers to return mock data
- Console logging for transparency
- Documentation in quickstart.md

### Out of Scope

- Mock authentication system (users remain unauthenticated)
- Admin functionality testing (focus on public viewing)
- Mock data for user profiles or settings
- Automated data generation scripts (manual JSON is sufficient)
- Image hosting or storage solutions (use external placeholders)
- Database seeding for Firebase (mock data is code-level only)

---

## Assumptions

1. **Development Environment**: Developers use `NODE_ENV=development` (Next.js default)
2. **Image Sources**: Placeholder image services (like picsum.photos) remain available
3. **Data Maintenance**: Mock data requires periodic manual updates for new fields
4. **No Persistence**: Mock data resets on server restart (no local storage needed)
5. **Testing Focus**: Primary use case is visual/UI testing, not functional backend testing
6. **TypeScript Compatibility**: Existing Movie and Review types don't change

---

## Dependencies

### Technical Dependencies

- **Next.js**: Already configured for API routes and environment detection
- **Existing Types**: lib/types.ts Movie and Review interfaces must remain compatible
- **Current API Structure**: /api/movies endpoints already defined

### External Dependencies

- **Placeholder Images**: picsum.photos or similar service for poster images
- **None**: No new npm packages required

### Feature Dependencies

- **001-movie-review-website**: Core application structure must exist
- **002-modern-ui-enhancements**: UI components benefit from diverse test data

---

## Risks & Mitigations

### Risk 1: Image Service Downtime

**Impact**: HIGH - Broken posters disrupt UI testing

**Likelihood**: MEDIUM - External services can fail

**Mitigation**:
- Use multiple placeholder services as fallbacks
- Include base64-encoded tiny placeholder in code
- Document how to use local image files if needed

### Risk 2: Mock Data Staleness

**Impact**: MEDIUM - New fields added to Movie type break mock data

**Likelihood**: MEDIUM - Schema evolves with new features

**Mitigation**:
- Document mock data location prominently in README
- Add TypeScript checks to ensure mock data matches current types
- Include test that validates mock data structure

### Risk 3: Production Data Leak

**Impact**: LOW - Mock data accidentally used in production

**Likelihood**: LOW - Environment detection should prevent this

**Mitigation**:
- Add explicit environment checks (NODE_ENV, Firebase config)
- Log warnings in console when using mock data
- Include automated test that production build uses Firebase

### Risk 4: Maintenance Burden

**Impact**: LOW - Keeping mock data updated takes developer time

**Likelihood**: MEDIUM - Every schema change requires mock data update

**Mitigation**:
- Keep mock data structure simple and minimal
- Automate validation with unit tests
- Document update process clearly

---

## Non-Functional Requirements

### Performance

- Mock data API responses: < 50ms (no network delay)
- Initial page load with mock data: < 2 seconds
- No impact on production bundle size (dev-only code)

### Maintainability

- Mock data stored in single JSON file for easy editing
- Clear documentation in code comments
- Follows existing code patterns and conventions

### Reliability

- Mock data mode never crashes or throws errors
- Graceful fallback if mock data file corrupted
- Works across all major operating systems (Windows, macOS, Linux)

### Security

- No sensitive data in mock dataset (all fictional)
- Mock data file safe to commit to public repository
- Production environment never uses mock data

---

## Open Questions

None - specification complete and ready for planning phase.

---

## Acceptance Scenarios

### AS-001: First Time Developer Experience

**Given**: New developer has cloned the repository  
**When**: Developer runs `npm install` then `npm run dev`  
**Then**: 
- Application opens at localhost:3000
- Homepage displays 50+ movies with posters
- No authentication prompts appear
- Console shows "Development mode: Using mock data"

### AS-002: Movie Detail Page

**Given**: Application running with mock data  
**When**: User clicks on any movie card  
**Then**:
- Movie detail page loads instantly
- Full movie information displays (title, year, director, actors)
- 3-15 reviews appear with varied grades
- Review text is readable and realistic

### AS-003: Production Build Safety

**Given**: Application deployed to production environment  
**When**: Production build runs (`npm run build` && `npm start`)  
**Then**:
- Mock data is NOT used
- Firebase connections are attempted
- No "mock data" console messages appear
- Environment detected correctly as production

### AS-004: Edge Case Coverage

**Given**: Developer testing UI components  
**When**: Developer browses through all movies  
**Then**:
- Some movies have 0 reviews (empty state)
- Some movies have 15+ reviews (scrolling/pagination)
- Movie titles vary from short (5 chars) to long (50 chars)
- All grades A+ through F are represented across reviews

---

## Notes

- This feature is development-focused and does not affect end users
- Mock data enables offline development and faster iteration cycles
- Quality of mock data directly impacts developer experience
- Consider expanding to mock user authentication in future feature (004)
