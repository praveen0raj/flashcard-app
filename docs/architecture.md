# Flashcard App - System Architecture

## Overview

The Flashcard App is built using a modern full-stack architecture with Next.js 14, featuring server-side rendering, API routes, and a PostgreSQL database. The application implements the SM-2 spaced repetition algorithm for optimal learning efficiency.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Components (Client)                  │ │
│  │  • Auth Pages      • Flashcard Forms                   │ │
│  │  • Study Mode      • Quiz Interface                    │ │
│  │  • Dashboard       • Statistics Charts                 │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│  ┌────────────▼───────────────────────────────────────────┐ │
│  │              State Management Layer                     │ │
│  │  • Zustand Stores (Auth, Flashcards, Study)           │ │
│  │  • TanStack Query (Server State Caching)              │ │
│  └────────────┬───────────────────────────────────────────┘ │
└───────────────┼──────────────────────────────────────────────┘
                │ HTTP/REST
                │
┌───────────────▼──────────────────────────────────────────────┐
│                    Next.js 14 Server                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes (Backend)                     │   │
│  │  /api/auth/*        - Authentication endpoints        │   │
│  │  /api/flashcards/*  - CRUD operations                │   │
│  │  /api/categories/*  - Category management            │   │
│  │  /api/reviews/*     - Study & SM-2 algorithm         │   │
│  │  /api/quizzes/*     - Quiz generation & scoring      │   │
│  │  /api/stats/*       - Analytics & progress           │   │
│  │  /api/media/*       - File upload & serving          │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│  ┌──────────────▼───────────────────────────────────────┐   │
│  │           Business Logic Layer                        │   │
│  │  • lib/auth.ts          - JWT & password hashing     │   │
│  │  • lib/spacedRepetition.ts - SM-2 algorithm          │   │
│  │  • lib/validators.ts    - Zod schemas                │   │
│  │  • lib/media.ts         - File processing            │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│  ┌──────────────▼───────────────────────────────────────┐   │
│  │              Middleware Layer                         │   │
│  │  • middleware.ts - Route protection                  │   │
│  │  • Auth verification                                 │   │
│  │  • Request logging                                   │   │
│  └──────────────┬───────────────────────────────────────┘   │
└─────────────────┼───────────────────────────────────────────┘
                  │ Prisma ORM
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              PostgreSQL Database (Port 5433)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Tables:                                               │   │
│  │  • User              - User accounts                  │   │
│  │  • Category          - Flashcard categories           │   │
│  │  • Flashcard         - Questions & answers            │   │
│  │  • ReviewSchedule    - SM-2 algorithm state          │   │
│  │  • ReviewHistory     - Study session logs             │   │
│  │  • QuizSession       - Quiz attempts                  │   │
│  │  • QuizAnswer        - Individual answers             │   │
│  │  • StudyStreak       - Consecutive study days         │   │
│  │  • DailyStat         - Aggregated metrics            │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    File System                               │
│  /public/uploads/                                            │
│  ├── images/      - User-uploaded images                     │
│  └── audio/       - User-uploaded audio files                │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (client state) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Media**: react-dropzone, Howler.js

### Backend
- **Runtime**: Next.js API Routes
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **File Processing**: Sharp (images)

### Infrastructure
- **Containerization**: Docker Compose
- **Development**: Docker PostgreSQL container
- **Production**: Vercel (app) + Railway/Supabase/Neon (database)

## Key Components

### 1. Authentication System
- JWT-based stateless authentication
- HTTP-only cookies for token storage
- Password hashing with bcrypt (10 rounds)
- Protected routes via Next.js middleware

### 2. Spaced Repetition Engine
- **Algorithm**: SM-2 (SuperMemo 2)
- **Purpose**: Optimize review intervals based on recall difficulty
- **State Tracking**: ReviewSchedule table maintains:
  - Ease Factor (1.3 to 2.5+)
  - Interval (days until next review)
  - Repetitions (consecutive correct answers)
  - Next review date

### 3. Data Flow

#### Study Session Flow
```
User Study Request
    ↓
API: GET /api/reviews/due
    ↓
Query ReviewSchedule (nextReviewDate ≤ today)
    ↓
Return flashcards with schedule data
    ↓
User reviews card + rates quality (0-5)
    ↓
API: POST /api/reviews
    ↓
Calculate new schedule (SM-2 algorithm)
    ↓
Update ReviewSchedule table
    ↓
Create ReviewHistory record
    ↓
Update DailyStat (cards reviewed, accuracy)
    ↓
Update StudyStreak (if applicable)
    ↓
Return updated schedule
```

#### Quiz Flow
```
User starts quiz
    ↓
API: POST /api/quizzes
    ↓
Select random cards from category
    ↓
Create QuizSession record
    ↓
Return quiz questions
    ↓
User answers each question
    ↓
API: POST /api/quizzes/:id/answer
    ↓
Create QuizAnswer record
    ↓
Calculate correctness
    ↓
User completes quiz
    ↓
API: POST /api/quizzes/:id/complete
    ↓
Calculate final score
    ↓
Update QuizSession (score, duration)
    ↓
Return results
```

## Security Architecture

### Authentication Flow
1. User registers → password hashed → stored in DB
2. User logs in → credentials validated → JWT generated
3. JWT stored in HTTP-only cookie (prevents XSS)
4. Subsequent requests include JWT
5. Middleware validates JWT on protected routes
6. Invalid/expired tokens → redirect to login

### Security Measures
- **Password Security**: bcrypt with 10 rounds
- **Token Security**: JWT with expiration, HTTP-only cookies
- **Input Validation**: Zod schemas on all API endpoints
- **SQL Injection Prevention**: Prisma parameterized queries
- **File Upload Security**: Type/size validation, sanitized filenames
- **Rate Limiting**: Recommended for production (not yet implemented)

## Database Schema Design

### Relationships
```
User (1) ──────► (N) Category
User (1) ──────► (N) Flashcard
User (1) ──────► (N) ReviewSchedule
User (1) ──────► (N) ReviewHistory
User (1) ──────► (N) QuizSession
User (1) ──────► (1) StudyStreak
User (1) ──────► (N) DailyStat

Category (1) ──► (N) Flashcard

Flashcard (1) ─► (1) ReviewSchedule
Flashcard (1) ─► (N) ReviewHistory
Flashcard (1) ─► (N) QuizAnswer

QuizSession (1) ► (N) QuizAnswer
```

### Indexes
- **User**: email, username (unique)
- **Category**: userId + name (composite unique)
- **Flashcard**: userId, categoryId
- **ReviewSchedule**: userId, nextReviewDate (critical for performance)
- **ReviewHistory**: userId, flashcardId
- **DailyStat**: userId + date (composite unique)

## Performance Considerations

### Database Optimization
- Indexed columns for frequent queries
- Composite indexes for common query patterns
- Connection pooling via Prisma

### Frontend Optimization
- Server Components for initial rendering
- Client Components only where interactivity needed
- TanStack Query for caching and background refetching
- Next.js automatic code splitting
- Image optimization with Next.js Image component

### Caching Strategy
- **Client-side**: TanStack Query (5-minute stale time)
- **Server-side**: Next.js automatic static optimization
- **Database**: Connection pooling, prepared statements

## Scalability Considerations

### Current Architecture (Single Instance)
- Suitable for: 1-10,000 users
- Bottlenecks: Single database instance, file storage

### Future Scaling Options

#### Database Scaling
- **Vertical**: Increase PostgreSQL resources
- **Horizontal**: Read replicas for analytics queries
- **Connection Pooling**: PgBouncer or Prisma Data Proxy

#### File Storage Scaling
- Migrate to cloud storage (S3, Cloudinary, Vercel Blob)
- CDN for media delivery
- Image/audio processing offloaded to background jobs

#### Application Scaling
- **Serverless**: Vercel Edge Functions for global distribution
- **Caching**: Redis for session data and frequently accessed data
- **Queue System**: Background jobs for heavy operations (quiz generation, stats aggregation)

## Deployment Architecture

### Development
```
Local Machine
├── Next.js Dev Server (port 3000)
├── PostgreSQL Docker Container (port 5433)
└── File System (/public/uploads)
```

### Production
```
Vercel
├── Next.js Application (serverless functions)
├── Edge Network (CDN for static assets)
└── Environment Variables

Railway/Supabase/Neon
└── PostgreSQL Database (managed service)

Vercel Blob / S3
└── Media Files (images, audio)
```

## Monitoring & Observability

### Recommended Tools
- **Error Tracking**: Sentry
- **Performance Monitoring**: Vercel Analytics
- **Database Monitoring**: Prisma Pulse (future)
- **Logging**: Vercel Logs, Prisma query logging

### Key Metrics to Track
- API response times
- Database query performance
- Authentication success/failure rates
- Study session completion rates
- User engagement (daily active users)
- Spaced repetition effectiveness (retention rates)

## Future Enhancements

### Technical Improvements
- WebSocket support for real-time features
- Service Workers for offline functionality
- Background sync for study progress
- Push notifications for due reviews

### Feature Expansions
- Collaborative decks (multi-user)
- AI-generated flashcards
- Voice recording
- Mobile app (React Native)
- Import/export (CSV, Anki format)

## Conclusion

The architecture is designed for:
- ✅ **Simplicity**: Single Next.js project, minimal complexity
- ✅ **Performance**: Optimized queries, caching, SSR
- ✅ **Scalability**: Easy to scale vertically and horizontally
- ✅ **Maintainability**: Clear separation of concerns, type-safe with TypeScript
- ✅ **Security**: Industry-standard authentication and authorization
