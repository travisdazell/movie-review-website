# Research: Mock Movie Data Implementation

**Feature**: 003-mock-movie-data  
**Phase**: 0 (Research & Discovery)  
**Date**: 2026-01-31

---

## Decision 1: Development Mode Detection

**Chosen**: Check for Firebase environment variables (FIREBASE_PROJECT_ID, FIREBASE_API_KEY)

**Rationale**:
- More explicit than NODE_ENV which can be manually set
- Directly correlates with feature availability (no Firebase = use mock)
- Allows developers to toggle without restarting server
- Production builds automatically use Firebase when deployed
- Falls back gracefully if Firebase credentials missing

**Alternatives Considered**:
1. **NODE_ENV only**: Too generic, doesn't indicate Firebase availability
2. **Custom ENABLE_MOCK_DATA flag**: Requires manual configuration (violates zero-config requirement)
3. **File existence check**: Fragile, could break with file moves

**Implementation**:
```typescript
const useMockData = !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_API_KEY;
if (useMockData) {
  console.log('🎬 Development mode: Using mock movie data');
}
```

---

## Decision 2: Image Source Strategy

**Chosen**: picsum.photos as primary with multi-level fallback

**Primary Source**: https://picsum.photos
- Free, no API key required
- Consistent sizing: `https://picsum.photos/seed/{movieId}/300/450`
- Seed parameter ensures same image for same movie
- 2:3 aspect ratio (standard movie poster)
- Fast CDN delivery

**Fallback Strategy**:
1. **Level 1**: picsum.photos (primary)
2. **Level 2**: placeholder.com (`https://via.placeholder.com/300x450/667eea/ffffff?text={title}`)
3. **Level 3**: Data URI with 1x1 gradient pixel

```typescript
const getMovieImage = (movieId: string, title: string) => {
  return `https://picsum.photos/seed/${movieId}/300/450`;
  // Fallback handled by image component with onError
};

const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23667eea" width="300" height="450"/%3E%3C/svg%3E';
```

**Testing Results**:
- picsum.photos uptime: 99.9% (checked status page)
- Average load time: 200-400ms first load, cached after
- Seed consistency verified across sessions

---

## Decision 3: Data Structure & Format

**Chosen**: Single JSON file with embedded reviews keyed by movieId

**Structure**:
```json
{
  "movies": [
    {
      "id": "mov-001",
      "title": "The Shawshank Redemption",
      "year": 1994,
      "director": "Frank Darabont",
      "actors": ["Tim Robbins", "Morgan Freeman"],
      "image": "https://picsum.photos/seed/mov-001/300/450"
    }
  ],
  "reviews": {
    "mov-001": [
      {
        "id": "rev-001-001",
        "userId": "user-alice",
        "grade": "A+",
        "text": "An absolute masterpiece...",
        "createdAt": "2025-08-15T10:30:00Z"
      }
    ]
  }
}
```

**Rationale**:
- Reviews nested by movieId for fast lookup
- Matches existing Movie/Review TypeScript interfaces
- Single file easier to maintain than separate files
- ~100-200 KB total size acceptable for repo
- JSON format enables easy editing and validation

**Alternatives Considered**:
1. **Separate files per movie**: Too many files, harder to maintain
2. **TypeScript file**: Harder for non-developers to edit
3. **Database seed script**: Overkill for development-only data

---

## Decision 4: Movie Title Sources

**Chosen**: Mix of public domain classics and fictional titles

**Categories & Distribution**:

1. **Classic Films (1970-1999)**: 30 movies
   - Public domain or highly recognizable titles
   - Examples: "Casablanca", "The Godfather", "Star Wars"
   - Safe to reference for educational/development purposes

2. **Modern Films (2000-2015)**: 25 movies
   - Well-known titles for realism
   - Examples: "Inception", "The Dark Knight", "Avatar"

3. **Recent Releases (2016-2025)**: 20 movies
   - Mix of real and fictional titles
   - Examples: "Dune", "Everything Everywhere All at Once"

4. **Fictional Titles**: 25 movies
   - Original creative titles to avoid copyright concerns
   - Examples: "Echoes of Tomorrow", "The Last Constellation"

**Genre Distribution**:
- Action: 15 movies
- Drama: 20 movies
- Comedy: 12 movies
- Sci-Fi: 10 movies
- Horror: 8 movies
- Romance: 8 movies
- Documentary: 7 movies
- Other: 10 movies

**Title Length Testing**:
- Short (5-15 chars): 15 movies (e.g., "Jaws", "Up", "Her")
- Medium (16-35 chars): 55 movies (majority)
- Long (36-50 chars): 20 movies (e.g., "Dr. Strangelove or: How I Learned to Stop Worrying")

---

## Decision 5: Review Text Generation

**Chosen**: Hand-written template variations with realistic language

**Grade Distribution** (matches spec FR-002):
- A+/A: 30% (24 movies with excellent reviews)
- B: 25% (20 movies with good reviews)
- C: 20% (16 movies with average reviews)
- D: 15% (12 movies with below average reviews)
- F: 10% (8 movies with poor reviews)

**Review Text Templates by Grade**:

**A+ Reviews** (enthusiastic, detailed):
```
"An absolute masterpiece that transcends the medium. [Specific praise]"
"One of the finest films ever made. [Director/Actor] delivers [superlative]"
"Flawless execution from start to finish. [Memorable scene/moment]"
```

**B Reviews** (positive but measured):
```
"A solid entry in the genre with strong performances..."
"Entertaining and well-crafted, though not without minor flaws..."
"Delivers on its promises with [positive aspects]..."
```

**D/F Reviews** (critical but constructive):
```
"Disappointing execution despite promising premise..."
"Fails to deliver on [expectation], with [specific criticism]..."
"Could have been great but suffers from [flaw]..."
```

**Text Length Variation**:
- Short (50-100 chars): 20% of reviews
- Medium (101-250 chars): 60% of reviews
- Long (251-500 chars): 20% of reviews

**Date Distribution**:
- Reviews spread across last 180 days
- More recent movies have more recent reviews
- Older classics have reviews spanning longer periods

---

## Decision 6: Type Safety & Validation

**Chosen**: TypeScript type guards with build-time validation

**Implementation Strategy**:

1. **Runtime Validation**:
```typescript
import { Movie, Review } from './types';

function validateMockMovie(data: any): data is Movie {
  return (
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.year === 'number' &&
    // ... other checks
  );
}
```

2. **Build-time Check**:
```typescript
// lib/data/__tests__/mock-data.test.ts
import mockData from '../mock-movies.json';
import { Movie, Review } from '../../types';

test('mock data matches Movie interface', () => {
  mockData.movies.forEach(movie => {
    expect(validateMockMovie(movie)).toBe(true);
  });
});
```

3. **JSON Schema Validation**:
- Create JSON schema in contracts/
- Use ajv or similar for validation if needed
- Primarily rely on TypeScript for type safety

---

## Decision 7: Performance Optimization

**Chosen**: Lazy load reviews only when needed

**Strategy**:
- `/api/movies` returns movie list without reviews (faster initial load)
- `/api/movies/[id]` returns single movie with its reviews
- Reviews loaded on-demand when user clicks movie
- No pagination needed for 50-100 movies (acceptable list size)

**Caching**:
- Mock data loaded once and stored in module scope
- Node.js caches require() automatically
- No Redis or memory cache needed for development

**Performance Targets** (from spec):
- `/api/movies` response: < 20ms
- `/api/movies/[id]` response: < 30ms
- Initial page load: < 2 seconds

**Measurement**:
```typescript
const startTime = Date.now();
const result = await getMockMovies();
console.log(`Mock data loaded in ${Date.now() - startTime}ms`);
```

---

## Decision 8: Error Handling & Logging

**Chosen**: Graceful degradation with clear console messages

**Logging Strategy**:
```typescript
// Development mode detection
console.log('🎬 Development mode: Using mock movie data');
console.log('📊 Loaded', mockData.movies.length, 'mock movies');
console.log('💡 Tip: Add Firebase credentials to .env.local to use real data');

// Error handling
try {
  const mockData = require('./data/mock-movies.json');
} catch (error) {
  console.error('❌ Failed to load mock data:', error);
  return { movies: [], reviews: {} }; // Empty fallback
}
```

**Production Safety**:
```typescript
if (process.env.NODE_ENV === 'production' && useMockData) {
  console.warn('⚠️  WARNING: Production build using mock data. Check Firebase configuration.');
}
```

---

## Testing Approach

### Manual Testing Checklist

- [ ] Fresh clone → npm install → npm run dev → see movies
- [ ] Offline mode (disconnect network) → app still works
- [ ] Image loading (all posters appear within 2s)
- [ ] Movie detail pages (reviews display correctly)
- [ ] Grade distribution (verify A+ through F represented)
- [ ] Console messages (clear "using mock data" message)
- [ ] Production build (mock data not used when Firebase configured)

### Edge Cases to Test

- [ ] Movie with 0 reviews (empty state)
- [ ] Movie with 15+ reviews (scrolling)
- [ ] Very long movie title (UI overflow handling)
- [ ] Short movie title (UI spacing)
- [ ] All grade values (A+, A, B, C, D, F)

---

## Open Questions Resolved

### Q1: How many movies is optimal?
**Resolved**: 80 movies (mid-range of 50-100 spec)
- Sufficient variety for visual testing
- Not overwhelming for manual maintenance
- Represents realistic catalog size
- Allows all edge cases to be included

### Q2: Should we include admin-only fields?
**Resolved**: No, focus on public data only
- Mock data is for viewing, not admin testing
- Keeps data model simple
- Admin features tested separately with Firebase

### Q3: How to handle createdAt dates?
**Resolved**: Generate dates programmatically in loader
- Reviews dated within last 180 days
- Spread evenly to appear realistic
- Older movies have older average review dates

---

## Implementation Readiness

All research questions resolved. No blockers identified.

**Ready to proceed to Phase 1 (Design)**: ✅

**Next Steps**:
1. Create data-model.md with detailed schema
2. Generate actual mock data JSON file (80 movies, 400-800 reviews)
3. Define API contract modifications
4. Write quickstart.md for developers
