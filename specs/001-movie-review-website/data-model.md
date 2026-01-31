# Data Model: Movie Review Website

## Overview
The data model for the Movie Review Website is designed around three core entities: Movie, Review, and User. It uses a NoSQL database (Firebase Firestore) for flexibility and scalability. Relationships are handled via references to support independent querying while maintaining performance for common read operations.

## Entities

### Movie
Represents a film available for review.

**Fields:**
- `id` (string): Unique identifier (Firestore document ID)
- `title` (string): Movie title (required, indexed for search)
- `year` (number): Release year (required)
- `actors` (array of strings): List of main actors (optional)
- `director` (string): Director name (required)
- `image` (string): Base64-encoded image data or URL (optional, for small posters)
- `createdAt` (timestamp): Creation date
- `updatedAt` (timestamp): Last update date

**Relationships:**
- One-to-many with Review (a movie can have multiple reviews)
- Created by User (admin role)

**Constraints:**
- Title must be unique (enforced via query or application logic)
- Image size limited to 1MB for Base64 storage

### Review
Represents a user's opinion and rating of a movie.

**Fields:**
- `id` (string): Unique identifier (Firestore document ID)
- `movieId` (reference): ID of the associated Movie
- `userId` (reference): ID of the reviewing User
- `text` (string): Review content (required, max 500 characters)
- `grade` (string): Letter grade (required, enum: F, D, C, B, A, A+)
- `createdAt` (timestamp): Submission date
- `updatedAt` (timestamp): Last edit date (if allowed)

**Relationships:**
- Belongs to Movie
- Belongs to User

**Constraints:**
- One review per user per movie (enforced via composite query)
- Text length limited to short paragraph

### User
Represents a platform user, including authentication details.

**Fields:**
- `id` (string): Unique identifier (Firestore document ID or Google UID)
- `username` (string): Display name (required)
- `email` (string): Email address (required, unique)
- `role` (string): User role (enum: user, admin; default: user)
- `authMethod` (string): Authentication type (enum: local, gmail)
- `passwordHash` (string): Hashed password (only for local auth)
- `createdAt` (timestamp): Registration date
- `lastLogin` (timestamp): Last login date

**Relationships:**
- One-to-many with Review (a user can write multiple reviews)
- Can create Movies (if admin)

**Constraints:**
- Email must be unique
- Password required only for local auth

## Relationships and Cardinality
- **Movie → Review**: One-to-many (high cardinality; use references for scalability)
- **User → Review**: One-to-many
- **User → Movie**: Many-to-many (admins create movies; references only)

## Indexing Strategy
- Primary indexes on `id` (auto)
- Secondary indexes: Movie.title, Review.movieId, Review.userId, User.email
- Compound indexes: Review(movieId, createdAt) for sorting reviews by date

## Data Integrity and Validation
- Application-level validation for required fields and constraints
- Use Firestore security rules for access control (e.g., only admins can create movies)
- Denormalize read-heavy fields if needed (e.g., movie average rating in Movie document)

## Migration and Evolution
- Schema is flexible; add fields without downtime
- Version data if breaking changes occur
- Backup data regularly via Firestore exports