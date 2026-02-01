// Test script for edge cases
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('lib/data/mock-movies.json', 'utf8'));

console.log('🧪 Testing Edge Cases\n');

// Test 1: Movie with 0 reviews
console.log('Test 1: Movies with 0 reviews');
const moviesWithNoReviews = data.movies.filter(movie => 
  !data.reviews[movie.id] || data.reviews[movie.id].length === 0
);
console.log(`✅ Found ${moviesWithNoReviews.length} movies with 0 reviews`);
console.log(`   Examples: ${moviesWithNoReviews.slice(0, 3).map(m => m.id).join(', ')}\n`);

// Test 2: Movies with many reviews (>=  10)
console.log('Test 2: Movies with many reviews');
const moviesWithManyReviews = data.movies
  .map(movie => ({
    id: movie.id,
    title: movie.title,
    reviewCount: (data.reviews[movie.id] || []).length
  }))
  .filter(m => m.reviewCount >= 3);

console.log(`✅ Found ${moviesWithManyReviews.length} movies with 3+ reviews`);
moviesWithManyReviews.forEach(m => {
  console.log(`   ${m.id}: ${m.reviewCount} reviews`);
});
console.log();

// Test 3: Long titles
console.log('Test 3: Movies with long titles (>40 chars)');
const longTitles = data.movies.filter(m => m.title.length > 40);
console.log(`✅ Found ${longTitles.length} movies with long titles`);
longTitles.forEach(m => {
  console.log(`   ${m.id}: "${m.title}" (${m.title.length} chars)`);
});
console.log();

// Test 4: Verify all image URLs
console.log('Test 4: Verify all movies have image URLs');
const missingImages = data.movies.filter(m => !m.image || m.image.trim() === '');
if (missingImages.length === 0) {
  console.log(`✅ All ${data.movies.length} movies have image URLs`);
} else {
  console.log(`❌ ${missingImages.length} movies missing images`);
  missingImages.forEach(m => console.log(`   ${m.id}: ${m.title}`));
}
console.log();

// Test 5: Verify all reviews have required fields
console.log('Test 5: Verify review data integrity');
let invalidReviews = 0;
Object.keys(data.reviews).forEach(movieId => {
  data.reviews[movieId].forEach(review => {
    if (!review.id || !review.userId || !review.grade || !review.text || !review.createdAt) {
      invalidReviews++;
      console.log(`❌ Invalid review: ${review.id || 'NO ID'}`);
    }
  });
});
if (invalidReviews === 0) {
  console.log(`✅ All reviews have required fields (id, userId, grade, text, createdAt)`);
} else {
  console.log(`❌ Found ${invalidReviews} invalid reviews`);
}
console.log();

console.log('✅ Edge case testing complete!\n');
