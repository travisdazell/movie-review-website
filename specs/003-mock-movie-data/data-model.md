# Data Model: Mock Movie Data

**Feature**: 003-mock-movie-data  
**Phase**: 1 (Design & Contracts)  
**Date**: 2026-01-31

---

## Overview

Mock data structure designed to match existing Firebase schema while being stored in a static JSON file. All types align with existing `lib/types.ts` interfaces to ensure zero code changes in React components.

---

## Entity Definitions

### Movie Entity

**Source**: Existing `lib/types.ts` - Movie interface

```typescript
interface Movie {
  id: string;           // Unique identifier (e.g., "mov-001")
  title: string;        // Movie title (5-50 characters)
  year: number;         // Release year (1970-2025)
  director: string;     // Director name
  actors: string[];     // Array of actor names (2-6 actors)
  image?: string;       // Poster image URL (optional)
  createdAt?: Date | Timestamp;  // When added to database (auto-generated)
}
```

**Mock Implementation**:
```json
{
  "id": "mov-001",
  "title": "The Shawshank Redemption",
  "year": 1994,
  "director": "Frank Darabont",
  "actors": ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
  "image": "https://picsum.photos/seed/mov-001/300/450"
}
```

**Field Constraints**:
- `id`: Format `mov-NNN` where NNN is zero-padded 3-digit number
- `title`: Min 3 chars, max 80 chars
- `year`: Range 1970-2025
- `director`: Non-empty string
- `actors`: Array with 1-6 elements
- `image`: Valid HTTPS URL or omitted
- `createdAt`: Not included in mock data (not displayed in UI)

---

### Review Entity

**Source**: Existing `lib/types.ts` - Review interface

```typescript
interface Review {
  id?: string;          // Unique identifier (optional for new reviews)
  movieId: string;      // Reference to Movie.id
  userId: string;       // User who wrote review (mock username)
  grade: string;        // Letter grade: A+, A, B, C, D, F
  text: string;         // Review content (50-500 characters)
  createdAt?: Date | Timestamp;  // When review was posted
}
```

**Mock Implementation**:
```json
{
  "id": "rev-001-001",
  "userId": "alice_m",
  "grade": "A+",
  "text": "An absolute masterpiece that transcends the medium. The performances are flawless and the story is deeply moving.",
  "createdAt": "2025-08-15T10:30:00Z"
}
```

**Field Constraints**:
- `id`: Format `rev-{movieNum}-{reviewNum}` (e.g., "rev-001-003")
- `movieId`: Not stored in review object, inferred from parent key in JSON
- `userId`: Mock username (3-15 characters, lowercase with underscores)
- `grade`: Enum ["A+", "A", "B", "C", "D", "F"]
- `text`: Min 30 chars, max 500 chars
- `createdAt`: ISO 8601 date string

---

## Data Relationships

### Movie-to-Reviews Relationship

**Type**: One-to-Many  
**Implementation**: Reviews grouped by movieId in JSON

```json
{
  "movies": [ /* array of Movie objects */ ],
  "reviews": {
    "mov-001": [ /* array of Review objects for movie mov-001 */ ],
    "mov-002": [ /* array of Review objects for movie mov-002 */ ],
    "mov-010": [ /* movie with no reviews - empty array or omit key */ ]
  }
}
```

**Rules**:
- Each movie can have 0-15 reviews
- Reviews array ordered by createdAt (newest first)
- Movies with 0 reviews either have empty array or missing key

---

## Complete Mock Data Schema

### JSON Structure

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
    },
    {
      "id": "mov-002",
      "title": "The Godfather",
      "year": 1972,
      "director": "Francis Ford Coppola",
      "actors": ["Marlon Brando", "Al Pacino", "James Caan"],
      "image": "https://picsum.photos/seed/mov-002/300/450"
    }
  ],
  "reviews": {
    "mov-001": [
      {
        "id": "rev-001-001",
        "userId": "alice_m",
        "grade": "A+",
        "text": "An absolute masterpiece. Robbins and Freeman deliver career-defining performances.",
        "createdAt": "2025-08-15T10:30:00Z"
      },
      {
        "id": "rev-001-002",
        "userId": "bob_r",
        "grade": "A",
        "text": "Incredible storytelling and emotional depth. A must-watch classic.",
        "createdAt": "2025-07-22T14:15:00Z"
      }
    ],
    "mov-002": [
      {
        "id": "rev-002-001",
        "userId": "charlie_w",
        "grade": "A+",
        "text": "The definitive crime drama. Brando's performance is unforgettable.",
        "createdAt": "2025-09-01T09:00:00Z"
      }
    ]
  }
}
```

---

## Data Distribution Specifications

### Movies (Total: 80)

**By Decade**:
- 1970s: 12 movies
- 1980s: 15 movies
- 1990s: 18 movies
- 2000s: 15 movies
- 2010s: 12 movies
- 2020s: 8 movies

**By Genre**:
- Action: 15 movies
- Drama: 20 movies
- Comedy: 12 movies
- Sci-Fi: 10 movies
- Horror: 8 movies
- Romance: 8 movies
- Documentary: 7 movies

**Title Length Distribution**:
- Short (3-15 chars): 15 movies (e.g., "Jaws", "Up", "Her")
- Medium (16-35 chars): 50 movies
- Long (36-80 chars): 15 movies (for UI overflow testing)

---

### Reviews (Total: 400-600)

**Distribution per Movie**:
- 0 reviews: 8 movies (empty state testing)
- 1-3 reviews: 25 movies
- 4-7 reviews: 30 movies
- 8-12 reviews: 15 movies
- 13-15 reviews: 2 movies (pagination/scrolling testing)

**Grade Distribution** (across all reviews):
- A+: 15% (~60-90 reviews)
- A: 15% (~60-90 reviews)
- B: 25% (~100-150 reviews)
- C: 20% (~80-120 reviews)
- D: 15% (~60-90 reviews)
- F: 10% (~40-60 reviews)

**Text Length Distribution**:
- Short (30-100 chars): 20% of reviews
- Medium (101-250 chars): 60% of reviews
- Long (251-500 chars): 20% of reviews

**Date Distribution**:
- Last 30 days: 30% of reviews
- 31-90 days ago: 40% of reviews
- 91-180 days ago: 30% of reviews

---

## Mock User Data

### User IDs (Mock Usernames)

Pattern: `{firstname}_{lastInitial}` (all lowercase)

**Sample Users** (15 total):
- alice_m
- bob_r
- charlie_w
- diana_k
- evan_s
- fiona_t
- greg_h
- hannah_l
- ian_p
- julia_c
- kevin_d
- laura_n
- mike_b
- nina_g
- oliver_j

**Distribution**:
- Each user writes 20-50 reviews
- Some users are "critics" (mostly A+/A grades)
- Some users are "harsh" (mostly D/F grades)
- Most users have balanced grade distribution

---

## Type Validation

### TypeScript Type Guards

```typescript
// lib/mock-data-loader.ts

import { Movie, Review } from './types';

interface MockDataStructure {
  movies: Movie[];
  reviews: Record<string, Review[]>;
}

function isValidMovie(data: any): data is Movie {
  return (
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.year === 'number' &&
    data.year >= 1970 && data.year <= 2025 &&
    typeof data.director === 'string' &&
    Array.isArray(data.actors) &&
    data.actors.length > 0 &&
    (!data.image || typeof data.image === 'string')
  );
}

function isValidReview(data: any): data is Review {
  const validGrades = ['A+', 'A', 'B', 'C', 'D', 'F'];
  return (
    typeof data.id === 'string' &&
    typeof data.userId === 'string' &&
    typeof data.grade === 'string' &&
    validGrades.includes(data.grade) &&
    typeof data.text === 'string' &&
    data.text.length >= 30 &&
    data.text.length <= 500
  );
}

export function validateMockData(data: any): data is MockDataStructure {
  if (!data.movies || !Array.isArray(data.movies)) return false;
  if (!data.reviews || typeof data.reviews !== 'object') return false;
  
  // Validate all movies
  for (const movie of data.movies) {
    if (!isValidMovie(movie)) return false;
  }
  
  // Validate all reviews
  for (const movieId in data.reviews) {
    if (!Array.isArray(data.reviews[movieId])) return false;
    for (const review of data.reviews[movieId]) {
      if (!isValidReview(review)) return false;
    }
  }
  
  return true;
}
```

---

## API Response Formats

### GET /api/movies

**Response Structure**:
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
  ]
}
```

**Notes**:
- Returns all movies without reviews
- Sorted by year descending (newest first) or by title alphabetically
- No pagination needed for 80 movies

---

### GET /api/movies/[id]

**Response Structure**:
```json
{
  "movie": {
    "id": "mov-001",
    "title": "The Shawshank Redemption",
    "year": 1994,
    "director": "Frank Darabont",
    "actors": ["Tim Robbins", "Morgan Freeman"],
    "image": "https://picsum.photos/seed/mov-001/300/450"
  },
  "reviews": [
    {
      "id": "rev-001-001",
      "userId": "alice_m",
      "grade": "A+",
      "text": "An absolute masterpiece...",
      "createdAt": "2025-08-15T10:30:00Z"
    }
  ]
}
```

**Notes**:
- Returns single movie with all its reviews
- Reviews sorted by createdAt descending (newest first)
- Returns 404 if movie not found

---

## Data Maintenance Guidelines

### Adding New Movies

1. Generate next sequential ID (e.g., mov-081)
2. Use picsum.photos with movie ID as seed for consistent image
3. Add to movies array
4. Optionally add reviews to reviews object

### Adding New Reviews

1. Generate ID: `rev-{movieNum}-{nextReviewNum}`
2. Choose realistic userId from mock users list
3. Select appropriate grade for movie quality
4. Write natural review text (30-500 chars)
5. Set createdAt to recent date (last 180 days)
6. Add to appropriate movie's review array

### Validation Checklist

- [ ] All movie IDs are unique
- [ ] All review IDs are unique
- [ ] All movieIds in reviews object exist in movies array
- [ ] All years are between 1970-2025
- [ ] All grades are valid (A+, A, B, C, D, F)
- [ ] Review text length between 30-500 characters
- [ ] Image URLs use HTTPS
- [ ] JSON is valid (use jsonlint or prettier)
- [ ] TypeScript validation passes

---

## Notes

- Mock data designed for offline development only
- Structure matches Firebase Firestore collections
- All dates use ISO 8601 format for consistency
- Grade distribution intentionally skewed toward higher grades (realistic for movie reviews)
- User IDs are simple mock usernames, not email addresses
- No sensitive or personal information in mock data
