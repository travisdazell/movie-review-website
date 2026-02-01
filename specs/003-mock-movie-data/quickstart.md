# Quickstart: Mock Movie Data Mode

**Feature**: 003-mock-movie-data  
**Last Updated**: 2026-01-31

---

## Overview

Mock data mode enables immediate development without Firebase configuration. The app automatically detects when Firebase credentials are unavailable and serves static movie data instead.

**Time to running app**: < 5 minutes from fresh clone

---

## Quick Start (New Developers)

### 1. Clone and Install

```bash
git clone https://github.com/travisdazell/movie-review-website.git
cd movie-review-website
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open Browser

Navigate to http://localhost:3000

**Expected Result**: App loads with 80 movies and hundreds of reviews, no Firebase required.

---

## How It Works

### Automatic Mode Detection

The app checks for Firebase environment variables:

```typescript
// lib/mock-data-loader.ts
const useFirebase = process.env.FIREBASE_PROJECT_ID && 
                     process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (useFirebase) {
  // Use Firebase Firestore
} else {
  console.log('🎬 Development mode: Using mock movie data');
  // Use lib/data/mock-movies.json
}
```

**No .env.local = Mock mode automatically activated**

---

## Switching Between Mock and Firebase

### Using Mock Data (Default)

**Requirements**: None

Simply run the app without `.env.local` file.

**Console Output**:
```
🎬 Development mode: Using mock movie data
📊 Loaded 80 movies and 487 reviews
```

---

### Using Firebase (Production Mode)

**Requirements**: 
- Firebase project created
- Firestore database initialized
- Environment variables configured

**Steps**:

1. Create `.env.local` in project root:

```env
FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

2. Restart development server:

```bash
# Stop server (Ctrl+C)
npm run dev
```

3. Verify Firebase mode in console:

```
✅ Connected to Firebase Firestore
```

---

## Mock Data Structure

### Location

```
lib/
  data/
    mock-movies.json      # 80 movies + 400-600 reviews
  mock-data-loader.ts     # Environment detection & data loading
```

### Sample Content

**Movies**: 80 total
- Classics: The Shawshank Redemption, The Godfather, Pulp Fiction
- Modern: Inception, The Dark Knight, Parasite
- Recent: Everything Everywhere All at Once, Oppenheimer
- Fictional: Original titles for testing edge cases

**Reviews**: 400-600 total
- Grade distribution: A+ (15%), A (15%), B (25%), C (20%), D (15%), F (10%)
- Authors: 15 mock users (alice_m, bob_r, charlie_w, etc.)
- Dates: Last 6 months

---

## API Routes (Mock Mode)

### GET /api/movies

**Response**:
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

---

### GET /api/movies/[id]

**Request**: `/api/movies/mov-001`

**Response**:
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

---

### GET /api/movies/[id]/reviews

**Request**: `/api/movies/mov-001/reviews`

**Response**:
```json
{
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

---

### POST /api/movies/[id]/reviews (Mock Mode)

**Request**:
```json
{
  "userId": "test_user",
  "grade": "A",
  "text": "Great movie, highly recommend!"
}
```

**Response** (Mock Success):
```json
{
  "success": true,
  "message": "Review submitted (mock mode - not persisted)",
  "review": {
    "id": "mock-review-123",
    "userId": "test_user",
    "grade": "A",
    "text": "Great movie, highly recommend!",
    "createdAt": "2026-01-31T12:00:00Z"
  }
}
```

**Note**: POST requests in mock mode return success but don't persist data. Refresh page to see original mock data.

---

## Customizing Mock Data

### Adding Movies

1. Open `lib/data/mock-movies.json`

2. Add movie to `movies` array:

```json
{
  "id": "mov-081",
  "title": "Your Custom Movie",
  "year": 2024,
  "director": "Your Name",
  "actors": ["Actor 1", "Actor 2"],
  "image": "https://picsum.photos/seed/mov-081/300/450"
}
```

3. Optionally add reviews to `reviews` object:

```json
"mov-081": [
  {
    "id": "rev-081-001",
    "userId": "alice_m",
    "grade": "A",
    "text": "Loved this custom movie!",
    "createdAt": "2026-01-31T10:00:00Z"
  }
]
```

4. Restart dev server

---

### Changing Review Grade Distribution

1. Open `lib/data/mock-movies.json`

2. Manually edit existing review grades:

```json
{
  "id": "rev-001-001",
  "grade": "A+"  // Change to "B", "C", "D", or "F"
}
```

3. Save and refresh browser (no restart needed)

---

### Using Custom Images

**Option 1**: picsum.photos (default)

```json
"image": "https://picsum.photos/seed/{unique-id}/300/450"
```

**Option 2**: Placeholder.com

```json
"image": "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Movie+Title"
```

**Option 3**: Local images

1. Add image to `public/images/`
2. Reference in JSON:

```json
"image": "/images/your-movie-poster.jpg"
```

---

## Troubleshooting

### Issue: App shows blank screen

**Cause**: Mock data JSON is malformed

**Solution**:
1. Check browser console for JSON parsing errors
2. Validate `lib/data/mock-movies.json` syntax:

```bash
npx prettier --check lib/data/mock-movies.json
```

3. Fix JSON errors and restart server

---

### Issue: Images not loading

**Cause**: picsum.photos may be blocked or slow

**Solution**: Use fallback image URLs

Edit `lib/mock-data-loader.ts`:

```typescript
const fallbackImage = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Image';

movies.forEach(movie => {
  if (!movie.image) {
    movie.image = fallbackImage;
  }
});
```

---

### Issue: Console shows Firebase errors

**Cause**: Partial environment variables configured

**Solution**: Either:
- **Option A**: Remove `.env.local` completely (use full mock mode)
- **Option B**: Complete all Firebase environment variables

Check current mode:

```bash
# Should show either all Firebase vars or none
cat .env.local
```

---

### Issue: Review submissions not persisting

**Expected Behavior**: This is intentional in mock mode

**Explanation**: POST requests in mock mode return success but don't save data. This is by design for read-only development.

**To Test Persistence**: Switch to Firebase mode (see "Using Firebase" section above)

---

### Issue: Wrong number of movies/reviews displayed

**Cause**: JSON filter or cache issue

**Solution**:
1. Clear Next.js cache:

```bash
rm -rf .next
npm run dev
```

2. Verify JSON structure in `lib/data/mock-movies.json`:

```bash
# Count movies
cat lib/data/mock-movies.json | grep '"id": "mov-' | wc -l
# Should output: 80

# Count review objects
cat lib/data/mock-movies.json | grep '"rev-' | wc -l
```

---

## Development Workflow

### Recommended Setup

1. **Start in Mock Mode**: Develop UI/UX with instant feedback
2. **Test Firebase Integration**: Switch to Firebase when testing database operations
3. **Production Builds**: Always use Firebase (mock mode disabled in production)

### Git Workflow

Mock data is committed to repository:

```bash
# Mock data is tracked in git
git add lib/data/mock-movies.json
git commit -m "Update mock data"

# Firebase credentials are NOT tracked (.env.local in .gitignore)
```

---

## Performance Characteristics

### Mock Mode

- **Initial Load**: < 100ms (static JSON file)
- **API Response**: < 5ms (in-memory data)
- **Suitable For**: UI development, screenshot demos, offline work

### Firebase Mode

- **Initial Load**: 500-2000ms (network + auth)
- **API Response**: 100-500ms (Firestore queries)
- **Suitable For**: Backend testing, production deployment

---

## Testing Scenarios

### Empty State

Movies with no reviews (ID: mov-010, mov-025, mov-033, etc.):

```
Navigate to: http://localhost:3000/movies/mov-010
Expected: "No reviews yet" message displays
```

### Pagination/Scrolling

Movies with many reviews (ID: mov-001, mov-002):

```
Navigate to: http://localhost:3000/movies/mov-001
Expected: 13-15 reviews, scroll to view all
```

### Grade Distribution

Check grade variety across multiple movies:

```
Expected: Mix of A+, A, B, C, D, F grades visible
```

---

## Next Steps

After app is running with mock data:

1. **Explore UI**: Browse movies, read reviews, test animations
2. **Customize Data**: Edit `mock-movies.json` to add personal favorites
3. **Build Features**: Develop new components without Firebase setup
4. **Switch to Firebase**: When ready for backend testing, add `.env.local`

---

## Additional Resources

- [Firebase Setup Guide](../../README.md#firebase-setup) - Configure production Firebase
- [Data Model](./data-model.md) - Complete schema documentation
- [Mock Data Schema](./contracts/mock-data-schema.json) - JSON validation schema

---

## Console Indicators

Mock mode logs helpful emoji indicators:

| Emoji | Meaning |
|-------|---------|
| 🎬 | Mock mode activated |
| 📊 | Data loaded successfully |
| ⚠️ | Warning (minor issue) |
| ❌ | Error (critical issue) |
| ✅ | Firebase mode activated |

**Example Console Output**:

```
🎬 Development mode: Using mock movie data
📊 Loaded 80 movies and 487 reviews from lib/data/mock-movies.json
```

---

## FAQs

**Q: Can I use mock mode in production?**  
A: No, production builds automatically require Firebase. Mock mode only runs in `NODE_ENV=development`.

**Q: Will mock data conflict with Firebase data?**  
A: No, mode detection is exclusive. If Firebase credentials exist, Firebase is used; otherwise mock data is used.

**Q: Can I contribute more mock movies?**  
A: Yes! Submit PRs with additions to `lib/data/mock-movies.json` following the data model schema.

**Q: How often is mock data updated?**  
A: Mock data is static and manually updated. Check git history for recent changes.

**Q: Can I export mock data to Firebase?**  
A: Not directly. Mock data structure matches Firebase schema, but you'd need to write a migration script (not included in this feature).

---

## Support

For issues with mock data mode:

1. Check console for error messages (🎬, ⚠️, ❌ indicators)
2. Verify JSON syntax with linter
3. Review troubleshooting section above
4. Check [GitHub Issues](https://github.com/travisdazell/movie-review-website/issues)
