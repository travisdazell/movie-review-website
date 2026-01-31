# Quickstart Guide: Movie Review Website

## Overview
This guide helps developers set up and run the Movie Review Website locally. The application is built with Next.js (React framework), uses Firebase Firestore for the database, and supports Google OAuth for authentication.

## Prerequisites
- Node.js 18+ and npm
- Docker (for local database)
- Git
- Google Cloud Console account (for OAuth setup)

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd movie-review-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Firebase
- Create a Firebase project at https://console.firebase.google.com/
- Enable Firestore and Authentication (Google provider)
- Get your Firebase config and add to `.env.local`:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
  NEXTAUTH_SECRET=your-random-secret
  NEXTAUTH_URL=http://localhost:3000
  GOOGLE_CLIENT_ID=your-google-client-id
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  ```

### 4. Set Up Google OAuth
- Go to Google Cloud Console (https://console.cloud.google.com/)
- Create OAuth 2.0 credentials for web application
- Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
- Add client ID and secret to `.env.local`

### 5. Start Local Database (Optional, for full backend)
If using a local Firestore emulator:
```bash
npm install -g firebase-tools
firebase emulators:start --only firestore
```

### 6. Run the Application
```bash
npm run dev
```
- Frontend: http://localhost:3000
- API routes: Built into Next.js

### 7. Build for Production
```bash
npm run build
npm run start
```

## Project Structure
```
movie-review-website/
├── pages/                 # Next.js pages and API routes
│   ├── api/
│   │   ├── auth/          # NextAuth.js routes
│   │   ├── admin/         # Admin-only API routes
│   │   └── movies/        # Movie CRUD APIs
│   ├── index.tsx          # Home page
│   ├── movies/            # Movie detail pages
│   └── admin/             # Admin panel pages
├── components/            # Reusable React components
│   ├── MovieCard.tsx      # Movie display card
│   ├── ReviewForm.tsx     # Review submission form
│   ├── MovieForm.tsx      # Admin movie creation form
│   ├── Navigation.tsx     # Header navigation
│   ├── Layout.tsx         # App layout wrapper
│   ├── Button.tsx         # Reusable button component
│   └── ReviewList.tsx     # Review display component
├── lib/                   # Utility functions
│   ├── firebase.ts        # Firebase configuration
│   ├── db.ts              # Database operations
│   ├── auth.ts            # Authentication helpers
│   └── types.ts           # TypeScript type definitions
├── styles/                # Global styles
│   └── globals.css        # Tailwind CSS imports
├── .github/workflows/     # CI/CD workflows
│   └── deploy.yml         # Vercel deployment automation
└── public/                # Static assets
```

## Key Features
- **Browse Movies**: View responsive movie listings with posters and basic info
- **Post Reviews**: Authenticated users can add reviews with letter grades (A+ to F)
- **Admin Panel**: Admins can create movies and delete inappropriate reviews
- **Responsive Design**: Mobile-first UI with Tailwind CSS breakpoints
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Error Handling**: Comprehensive error states and loading indicators throughout the app
- **Authentication**: Google OAuth integration with NextAuth.js

## Deployment
- **Local Testing**: Use `npm run dev` for hot reloading development
- **Production**: Deploy to Vercel via GitHub Actions CI/CD pipeline
- **Database**: Firebase Firestore handles scaling automatically
- **CI/CD**: Automated builds and deployments on push to main branch (see `.github/workflows/deploy.yml`)

### Vercel Deployment Setup
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - Firebase config variables
3. Deploy automatically via GitHub Actions or manually

## Troubleshooting
- **Auth Issues**: Ensure OAuth redirect URIs match exactly, including production URLs
- **Database Errors**: Check Firebase rules allow read/write for authenticated users
- **Build Failures**: Run `npm run lint` and `npm run build` to check for TypeScript/ESLint errors
- **Animation Issues**: Ensure Framer Motion is properly installed (`npm install framer-motion`)
- **Mobile Responsiveness**: Test on various screen sizes; breakpoints use sm:, md:, lg: prefixes
- **Admin Access**: Ensure user email is in the admin list in `lib/auth.ts`

## Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Firebase Firestore
- **Authentication**: NextAuth.js with Google OAuth
- **Animations**: Framer Motion
- **Deployment**: Vercel with GitHub Actions CI/CD
- **Development**: ESLint, Prettier, npm scripts

For more details, see the [Implementation Plan](plan.md), [Data Model](data-model.md), and [Research Findings](research.md).