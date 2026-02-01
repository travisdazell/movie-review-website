const fs = require('fs');

try {
  const rawData = fs.readFileSync('lib/data/mock-movies.json', 'utf8');
  const data = JSON.parse(rawData);
  
  console.log('✅ JSON is valid\n');
  
  // Count movies
  const movieCount = data.movies.length;
  console.log(`📊 Total movies: ${movieCount}`);
  
  // Count reviews and grade distribution
  let totalReviews = 0;
  const gradeCount = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
  
  Object.keys(data.reviews).forEach(movieId => {
    const reviews = data.reviews[movieId];
    totalReviews += reviews.length;
    reviews.forEach(review => {
      if (gradeCount[review.grade] !== undefined) {
        gradeCount[review.grade]++;
      }
    });
  });
  
  console.log(`📊 Total reviews: ${totalReviews}\n`);
  
  // Display grade distribution
  console.log('Grade Distribution:');
  Object.keys(gradeCount).forEach(grade => {
    const count = gradeCount[grade];
    const percentage = ((count / totalReviews) * 100).toFixed(1);
    console.log(`  ${grade}: ${count} (${percentage}%)`);
  });
  
  console.log('\nTarget Distribution:');
  console.log('  A+/A combined: 30%');
  console.log('  B: 25%');
  console.log('  C: 20%');
  console.log('  D: 15%');
  console.log('  F: 10%');
  
  const aPlusA = ((gradeCount['A+'] + gradeCount['A']) / totalReviews * 100).toFixed(1);
  console.log(`\n✅ A+/A actual: ${aPlusA}%`);
  
  // Check for movies with 0 reviews
  console.log('\nMovies with 0 reviews:');
  const moviesWithNoReviews = data.movies.filter(movie => 
    !data.reviews[movie.id] || data.reviews[movie.id].length === 0
  );
  console.log(`  Found: ${moviesWithNoReviews.length} movies`);
  if (moviesWithNoReviews.length > 0) {
    moviesWithNoReviews.slice(0, 5).forEach(movie => {
      console.log(`    - ${movie.id}: ${movie.title}`);
    });
  }
  
  // Check for movies with many reviews
  console.log('\nMovies with most reviews:');
  const moviesWithReviews = data.movies
    .map(movie => ({
      id: movie.id,
      title: movie.title,
      reviewCount: (data.reviews[movie.id] || []).length
    }))
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);
  
  moviesWithReviews.forEach(movie => {
    console.log(`    - ${movie.id}: ${movie.title} (${movie.reviewCount} reviews)`);
  });
  
  console.log('\n✅ Validation complete!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
