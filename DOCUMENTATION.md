# Flashcard App - Complete Documentation

**Version:** 1.0
**Last Updated:** December 24, 2025
**Framework:** Next.js 14 with App Router

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Getting Started](#getting-started)
3. [Frontend Framework](#frontend-framework)
4. [Backend API Reference](#backend-api-reference)
5. [SM-2 Spaced Repetition Algorithm](#sm-2-spaced-repetition-algorithm)
6. [Database Guide](#database-guide)
7. [Implementation Guide](#implementation-guide)
8. [Code Examples](#code-examples)
9. [Sequence Diagrams](#sequence-diagrams)
10. [Use Case Diagrams](#use-case-diagrams)
11. [Design System](#design-system)
12. [Troubleshooting](#troubleshooting)

---

# System Architecture

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

## Database Schema

### Prisma Models

**Core Tables:**
1. **User** - Authentication and user profiles
2. **Category** - Subject organization
3. **Flashcard** - Questions, answers, hints, multimedia URLs
4. **ReviewSchedule** - SM-2 algorithm state (ease factor, interval, next review date)

**Tracking Tables:**
5. **ReviewHistory** - Detailed audit log of every review session
6. **QuizSession** - Quiz metadata (score, duration, completion)
7. **QuizAnswer** - Individual quiz question results
8. **StudyStreak** - Current/longest streak tracking
9. **DailyStat** - Aggregated daily metrics for charts

### Relationships

```
User (1) ──────► (N) Category
User (1) ──────► (N) Flashcard
User (1) ──────► (N) ReviewSchedule
User (1) ──────► (1) StudyStreak

Category (1) ──► (N) Flashcard

Flashcard (1) ─► (1) ReviewSchedule
Flashcard (1) ─► (N) ReviewHistory
Flashcard (1) ─► (N) QuizAnswer

QuizSession (1) ► (N) QuizAnswer
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

---

# Getting Started

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** and npm/yarn/pnpm
- **Docker** and Docker Compose
- **Git** for version control
- **VSCode** (recommended) with extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd flashcard-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

This will install all required packages:
- **next** (15.1.5) - Next.js framework
- **react** (19.0.0) - React library
- **@prisma/client** - Database ORM client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **zod** - Schema validation
- **zustand** - State management
- **@tanstack/react-query** - Server state management
- **react-hook-form** - Form handling
- **recharts** - Charts and graphs
- **sharp** - Image optimization

### 3. Set Up Environment Variables

Create `.env.local` file in the root directory:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/flashcard_app?schema=public"

# JWT Configuration
JWT_SECRET="flashcard_app_jwt_secret_change_this_in_production_min_32_characters"
JWT_EXPIRES_IN="7d"

# File Upload Limits
MAX_IMAGE_SIZE=5242880   # 5MB in bytes
MAX_AUDIO_SIZE=10485760  # 10MB in bytes

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Security
BCRYPT_ROUNDS=10
```

**Important**: Change `JWT_SECRET` to a secure random string in production!

### 4. Start PostgreSQL Database

```bash
# Start PostgreSQL container (port 5433 to avoid conflicts)
docker-compose up -d

# Verify container is running
docker ps

# Check logs if needed
docker-compose logs postgres
```

The database will be accessible at:
- **Host**: localhost
- **Port**: 5433 (not 5432)
- **Database**: flashcard_app
- **User**: postgres
- **Password**: postgres

### 5. Set Up Database Schema

```bash
# Generate Prisma Client (TypeScript types)
npx prisma generate

# Run migrations to create tables
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/flashcard_app?schema=public" npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

This creates 9 tables:
1. User
2. Category
3. Flashcard
4. ReviewSchedule
5. ReviewHistory
6. QuizSession
7. QuizAnswer
8. StudyStreak
9. DailyStat

### 6. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at: **http://localhost:3000**

### 7. Verify Installation

Open your browser and navigate to:
- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/login (will create later)
- **Register**: http://localhost:3000/register (will create later)

## Project Structure Overview

```
flashcard-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/page.tsx       # Login page
│   │   └── register/page.tsx    # Register page
│   ├── (dashboard)/              # Protected routes
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── page.tsx             # Dashboard home
│   │   ├── flashcards/          # Flashcard management
│   │   ├── categories/          # Category management
│   │   ├── study/               # Study mode
│   │   ├── quiz/                # Quiz mode
│   │   └── stats/               # Statistics
│   ├── api/                      # Backend API Routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── flashcards/          # Flashcard CRUD
│   │   ├── categories/          # Category CRUD
│   │   ├── reviews/             # Study session endpoints
│   │   ├── quizzes/             # Quiz endpoints
│   │   ├── stats/               # Statistics endpoints
│   │   └── media/               # File upload endpoints
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── flashcard/               # Flashcard components
│   ├── study/                   # Study mode components
│   ├── quiz/                    # Quiz components
│   ├── stats/                   # Statistics components
│   └── media/                   # Media handling components
├── lib/                          # Utility libraries
│   ├── prisma.ts                # ⭐ Prisma client singleton
│   ├── auth.ts                  # ⭐ JWT & password utilities
│   ├── spacedRepetition.ts      # ⭐ SM-2 algorithm (CORE)
│   ├── validators.ts            # Zod validation schemas
│   └── utils.ts                 # Helper functions
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useFlashcards.ts         # Flashcard data fetching
│   ├── useCategories.ts         # Category data fetching
│   ├── useReviews.ts            # Review data fetching
│   └── useStats.ts              # Statistics data fetching
├── store/                        # Zustand state stores
│   ├── authStore.ts             # Authentication state
│   ├── flashcardStore.ts        # Flashcard state
│   └── studyStore.ts            # Study session state
├── types/                        # TypeScript type definitions
│   ├── flashcard.types.ts       # Flashcard types
│   ├── category.types.ts        # Category types
│   ├── review.types.ts          # Review types
│   └── index.ts                 # Exported types
├── prisma/                       # Prisma ORM
│   ├── schema.prisma            # ⭐ Database schema
│   ├── migrations/              # Auto-generated migrations
│   └── seed.ts                  # Seed data (optional)
├── public/
│   └── uploads/                 # User-uploaded media (gitignored)
│       ├── images/              # Image files
│       └── audio/               # Audio files
├── styles/
│   └── globals.css              # Global Tailwind styles
├── middleware.ts                 # ⭐ Auth middleware
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── docker-compose.yml           # PostgreSQL container
├── .env.local                   # Environment variables
├── .env.example                 # Example environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
└── README.md                    # Project documentation
```

**⭐ = Critical files you'll work with frequently**

## Development Workflow

### Making Changes

1. **Start development server**: `npm run dev`
2. **Make code changes** in your editor
3. **Hot reload** automatically refreshes browser
4. **Check console** for errors

### Database Changes

```bash
# After modifying prisma/schema.prisma
npx prisma generate          # Regenerate Prisma Client
npx prisma migrate dev       # Create and apply migration
npx prisma studio            # View data in browser
```

### Common Commands

```bash
# Development
npm run dev                  # Start dev server
npm run build               # Build for production
npm run start               # Start production server
npm run lint                # Run ESLint

# Database
npx prisma generate         # Generate Prisma Client
npx prisma migrate dev      # Create migration
npx prisma migrate reset    # Reset database (DELETES DATA!)
npx prisma studio           # Open database GUI
npx prisma db push          # Push schema without migration

# Docker
docker-compose up -d        # Start PostgreSQL
docker-compose down         # Stop PostgreSQL
docker-compose restart      # Restart PostgreSQL
docker-compose logs         # View logs
```

---

# Frontend Framework

## Next.js 14 App Router

### Project Structure

```
app/
├── (auth)/                    # Route group (no URL segment)
│   ├── login/page.tsx        # /login
│   └── register/page.tsx     # /register
│
├── (dashboard)/               # Protected routes group
│   ├── layout.tsx            # Shared dashboard layout
│   ├── page.tsx              # /dashboard
│   ├── flashcards/
│   ├── categories/
│   ├── study/
│   ├── quiz/
│   └── stats/
│
├── api/                       # API Routes (Backend)
│   ├── auth/
│   ├── flashcards/
│   ├── categories/
│   ├── reviews/
│   ├── quizzes/
│   └── stats/
│
├── layout.tsx                 # Root layout
└── page.tsx                   # Landing page (/)

components/
├── ui/                        # Reusable UI primitives
├── flashcard/                 # Flashcard-specific
├── study/                     # Study mode
├── quiz/                      # Quiz components
├── stats/                     # Statistics
├── media/                     # Media handling
└── layout/                    # Layout components

lib/                           # Utility libraries
├── prisma.ts                 # Prisma client
├── auth.ts                   # Auth utilities
├── spacedRepetition.ts       # SM-2 algorithm
└── validators.ts             # Zod schemas
```

## State Management

### Zustand (Client State)
```typescript
// store/authStore.ts
import { create } from 'zustand';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### TanStack Query (Server State)
```typescript
// hooks/useFlashcards.ts
export function useFlashcards(categoryId?: number) {
  return useQuery({
    queryKey: ['flashcards', categoryId],
    queryFn: () => fetchFlashcards(categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## Forms & Validation

### React Hook Form + Zod
```typescript
// lib/validators.ts
export const flashcardSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(1000),
  categoryId: z.number().optional(),
});

// components/flashcard/flashcard-form.tsx
const { register, handleSubmit } = useForm<FlashcardInput>({
  resolver: zodResolver(flashcardSchema),
});
```

---

# Backend API Reference

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request:**
```json
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePassword123!"
}
```

**Success Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2025-12-24T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "User already exists",
  "details": "Email or username is already registered"
}
```

**Validation Error (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "issues": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### POST /api/auth/login

Authenticate user and receive JWT token.

**Request:**
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

### GET /api/auth/me

Get current authenticated user information.

**Request:**
```http
GET /api/auth/me
Cookie: auth-token=eyJhbGciOiJIUzI1NiIs...
```

**Success Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2025-12-24T10:30:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "No valid authentication token found"
}
```

## Flashcard Endpoints

### GET /api/flashcards

List all flashcards with optional filters.

**Request:**
```http
GET /api/flashcards?categoryId=1&search=react&page=1&limit=20
Cookie: auth-token=...
```

**Query Parameters:**
- `categoryId` (optional): Filter by category ID
- `search` (optional): Search in question/answer text
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Success Response (200 OK):**
```json
{
  "flashcards": [
    {
      "id": 1,
      "question": "What is React?",
      "answer": "A JavaScript library for building user interfaces",
      "hint": "Think about UI development",
      "questionImageUrl": null,
      "answerImageUrl": "/uploads/images/react-logo.png",
      "questionAudioUrl": null,
      "answerAudioUrl": null,
      "difficulty": "easy",
      "tags": ["react", "javascript", "frontend"],
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "React Basics",
        "color": "#61DAFB"
      },
      "createdAt": "2025-12-20T15:00:00.000Z",
      "updatedAt": "2025-12-20T15:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### POST /api/flashcards

Create a new flashcard.

**Request:**
```json
POST /api/flashcards
Content-Type: application/json
Cookie: auth-token=...

{
  "question": "What is the virtual DOM?",
  "answer": "An in-memory representation of the real DOM that React uses for efficient updates",
  "hint": "It's a programming concept used by React",
  "categoryId": 1,
  "difficulty": "medium",
  "tags": ["react", "virtual-dom", "performance"]
}
```

**Success Response (201 Created):**
```json
{
  "flashcard": {
    "id": 2,
    "question": "What is the virtual DOM?",
    "answer": "An in-memory representation...",
    "hint": "It's a programming concept...",
    "categoryId": 1,
    "difficulty": "medium",
    "tags": ["react", "virtual-dom", "performance"],
    "createdAt": "2025-12-24T12:00:00.000Z",
    "reviewSchedule": {
      "id": 2,
      "easeFactor": 2.5,
      "interval": 1,
      "repetitions": 0,
      "nextReviewDate": "2025-12-25T12:00:00.000Z"
    }
  }
}
```

### GET /api/flashcards/[id]

Get a single flashcard by ID.

**Request:**
```http
GET /api/flashcards/1
Cookie: auth-token=...
```

**Success Response (200 OK):**
```json
{
  "flashcard": {
    "id": 1,
    "question": "What is React?",
    "answer": "A JavaScript library...",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "React Basics"
    },
    "reviewSchedule": {
      "easeFactor": 2.5,
      "interval": 6,
      "repetitions": 2,
      "nextReviewDate": "2025-12-30T12:00:00.000Z"
    }
  }
}
```

### PUT /api/flashcards/[id]

Update an existing flashcard.

**Request:**
```json
PUT /api/flashcards/1
Content-Type: application/json
Cookie: auth-token=...

{
  "question": "What is React? (Updated)",
  "answer": "A JavaScript library for building user interfaces (updated)",
  "difficulty": "easy"
}
```

**Success Response (200 OK):**
```json
{
  "flashcard": {
    "id": 1,
    "question": "What is React? (Updated)",
    "answer": "A JavaScript library for building user interfaces (updated)",
    "difficulty": "easy",
    "updatedAt": "2025-12-24T13:00:00.000Z"
  }
}
```

### DELETE /api/flashcards/[id]

Delete a flashcard.

**Request:**
```http
DELETE /api/flashcards/1
Cookie: auth-token=...
```

**Success Response (200 OK):**
```json
{
  "message": "Flashcard deleted successfully",
  "deletedId": 1
}
```

## Review Endpoints (Spaced Repetition)

### GET /api/reviews/due

Get flashcards due for review today.

**Request:**
```http
GET /api/reviews/due
Cookie: auth-token=...
```

**Success Response (200 OK):**
```json
{
  "dueCards": [
    {
      "id": 1,
      "question": "What is React?",
      "answer": "A JavaScript library...",
      "category": {
        "name": "React Basics",
        "color": "#61DAFB"
      },
      "reviewSchedule": {
        "easeFactor": 2.5,
        "interval": 6,
        "repetitions": 2,
        "nextReviewDate": "2025-12-24T00:00:00.000Z",
        "lastReviewedAt": "2025-12-18T10:00:00.000Z"
      }
    }
  ],
  "count": 15,
  "message": "You have 15 cards to review today"
}
```

### POST /api/reviews

Submit a review result (updates SM-2 schedule).

**Request:**
```json
POST /api/reviews
Content-Type: application/json
Cookie: auth-token=...

{
  "flashcardId": 1,
  "quality": 4,
  "responseTimeSeconds": 8
}
```

**Quality Ratings:**
- **5**: Perfect recall
- **4**: Correct after hesitation
- **3**: Correct with difficulty
- **2**: Incorrect but familiar
- **1**: Incorrect, vaguely familiar
- **0**: Complete blackout

**Success Response (200 OK):**
```json
{
  "message": "Review recorded successfully",
  "updatedSchedule": {
    "easeFactor": 2.6,
    "interval": 15,
    "repetitions": 3,
    "nextReviewDate": "2026-01-08T12:00:00.000Z"
  },
  "streakUpdated": true,
  "currentStreak": 7
}
```

### GET /api/reviews/history

Get review history with filters.

**Request:**
```http
GET /api/reviews/history?flashcardId=1&limit=50
Cookie: auth-token=...
```

**Success Response (200 OK):**
```json
{
  "history": [
    {
      "id": 123,
      "flashcardId": 1,
      "quality": 4,
      "wasCorrect": true,
      "responseTimeSeconds": 8,
      "easeFactorBefore": 2.5,
      "easeFactorAfter": 2.6,
      "intervalBefore": 6,
      "intervalAfter": 15,
      "reviewedAt": "2025-12-24T12:00:00.000Z"
    }
  ],
  "total": 45
}
```

## Quiz Endpoints

### POST /api/quizzes

Start a new quiz session.

**Request:**
```json
POST /api/quizzes
Content-Type: application/json
Cookie: auth-token=...

{
  "categoryId": 1,
  "questionCount": 10
}
```

**Success Response (201 Created):**
```json
{
  "quizSession": {
    "id": 1,
    "totalQuestions": 10,
    "categoryId": 1,
    "startedAt": "2025-12-24T13:00:00.000Z"
  },
  "questions": [
    {
      "id": 1,
      "question": "What is React?",
      "hint": "Think about UI development",
      "questionImageUrl": null
    }
  ]
}
```

### POST /api/quizzes/[id]/answer

Submit an answer for a quiz question.

**Request:**
```json
POST /api/quizzes/1/answer
Content-Type: application/json
Cookie: auth-token=...

{
  "flashcardId": 1,
  "userAnswer": "A JavaScript library for building user interfaces",
  "wasCorrect": true,
  "timeTakenSeconds": 12
}
```

**Success Response (200 OK):**
```json
{
  "message": "Answer recorded",
  "isCorrect": true,
  "correctAnswer": "A JavaScript library for building user interfaces"
}
```

### POST /api/quizzes/[id]/complete

Complete a quiz session and calculate score.

**Request:**
```json
POST /api/quizzes/1/complete
Content-Type: application/json
Cookie: auth-token=...

{
  "completedAt": "2025-12-24T13:15:00.000Z"
}
```

**Success Response (200 OK):**
```json
{
  "quizSession": {
    "id": 1,
    "totalQuestions": 10,
    "correctAnswers": 8,
    "scorePercentage": 80.0,
    "durationSeconds": 900,
    "completedAt": "2025-12-24T13:15:00.000Z"
  },
  "results": {
    "passed": true,
    "grade": "B",
    "message": "Great job! You got 8 out of 10 correct."
  }
}
```

## Statistics Endpoints

### GET /api/stats/dashboard

Get dashboard overview statistics.

**Request:**
```http
GET /api/stats/dashboard
Cookie: auth-token=...
```

**Success Response (200 OK):**
```json
{
  "stats": {
    "cardsDueToday": 15,
    "cardsReviewedToday": 8,
    "totalFlashcards": 120,
    "currentStreak": 7,
    "longestStreak": 21,
    "accuracyRate": 85.5,
    "totalReviewsAllTime": 1250,
    "studyTimeToday": 45
  }
}
```

### GET /api/stats/daily

Get daily statistics with date range.

**Request:**
```http
GET /api/stats/daily?startDate=2025-12-01&endDate=2025-12-24
Cookie: auth-token=...
```

**Success Response (200 OK):**
```json
{
  "dailyStats": [
    {
      "date": "2025-12-24",
      "cardsReviewed": 15,
      "cardsLearned": 3,
      "correctAnswers": 12,
      "totalAnswers": 15,
      "accuracyRate": 80.0,
      "studyTimeMinutes": 45
    },
    {
      "date": "2025-12-23",
      "cardsReviewed": 20,
      "cardsLearned": 5,
      "correctAnswers": 18,
      "totalAnswers": 20,
      "accuracyRate": 90.0,
      "studyTimeMinutes": 60
    }
  ]
}
```

### GET /api/stats/streaks

Get study streak information.

**Request:**
```http
GET /api/stats/streaks
Cookie: auth-token=...
```

**Success Response (200 OK):**
```json
{
  "streak": {
    "currentStreak": 7,
    "longestStreak": 21,
    "lastStudyDate": "2025-12-24",
    "isActiveToday": true,
    "daysUntilMilestone": 3,
    "nextMilestone": 10
  }
}
```

## Media Endpoints

### POST /api/media/upload

Upload an image or audio file.

**Request:**
```http
POST /api/media/upload
Content-Type: multipart/form-data
Cookie: auth-token=...

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="flashcard-image.jpg"
Content-Type: image/jpeg

[binary image data]
------WebKitFormBoundary--
```

**Success Response (201 Created):**
```json
{
  "url": "/uploads/images/1703423456789-flashcard-image.jpg",
  "filename": "1703423456789-flashcard-image.jpg",
  "size": 245678,
  "mimeType": "image/jpeg"
}
```

**Error Response (413 Payload Too Large):**
```json
{
  "error": "File too large",
  "message": "Image must be less than 5MB",
  "maxSize": 5242880
}
```

### DELETE /api/media/[filename]

Delete a media file.

**Request:**
```http
DELETE /api/media/1703423456789-flashcard-image.jpg
Cookie: auth-token=...
```

**Success Response (200 OK):**
```json
{
  "message": "File deleted successfully",
  "filename": "1703423456789-flashcard-image.jpg"
}
```

## Common Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": [...]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

# SM-2 Spaced Repetition Algorithm

## Overview

The SM-2 (SuperMemo 2) algorithm is the **core learning engine** of this flashcard app. It calculates optimal review intervals based on how well you remember each card, maximizing long-term retention while minimizing study time.

## How It Works

### The Science

Spaced repetition works on the principle of the "forgetting curve":
- Without review, we forget ~50% of new information within 24 hours
- Each successful review strengthens memory and extends the next review interval
- Reviews timed just before forgetting are most effective

### Algorithm Variables

The SM-2 algorithm tracks three key variables for each flashcard:

1. **Ease Factor (EF)**: Difficulty multiplier (1.3 to 2.5+)
   - Default: 2.5
   - Higher = easier card (longer intervals)
   - Lower = harder card (shorter intervals)

2. **Interval (I)**: Days until next review
   - Default: 1 day
   - Increases exponentially with correct answers
   - Resets to 1 day if answered incorrectly

3. **Repetitions (n)**: Consecutive correct answers
   - Default: 0
   - Increments only when quality ≥ 3
   - Resets to 0 when quality < 3

### Quality Ratings (0-5)

When you review a card, you rate your recall quality:

| Rating | Label | Meaning | Effect |
|--------|-------|---------|--------|
| **5** | Perfect | Instant recall, no hesitation | EF increases, long interval |
| **4** | Good | Correct after brief hesitation | EF increases slightly, good interval |
| **3** | Pass | Correct with difficulty | EF unchanged, moderate interval |
| **2** | Fail (familiar) | Incorrect but recognized | EF decreases, interval resets to 1 day |
| **1** | Fail (vague) | Incorrect, vaguely familiar | EF decreases more, interval resets |
| **0** | Blackout | Complete blank, no idea | EF decreases significantly, interval resets |

### Calculation Formula

```typescript
function calculateSM2(quality: number, repetitions: number, easeFactor: number, interval: number) {
  // Step 1: Update ease factor
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Clamp ease factor between 1.3 and 2.5
  newEF = Math.max(1.3, Math.min(2.5, newEF));

  let newInterval: number;
  let newRepetitions: number;

  // Step 2: Check if answer was correct (quality >= 3)
  if (quality < 3) {
    // Incorrect answer - reset
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Correct answer - increase interval
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1; // First review: 1 day
    } else if (newRepetitions === 2) {
      newInterval = 6; // Second review: 6 days
    } else {
      // Subsequent reviews: previous interval × ease factor
      newInterval = Math.round(interval * newEF);
    }
  }

  // Step 3: Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easeFactor: newEF,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  };
}
```

### Example Progression

Let's see how a card progresses with consistent quality 4 ratings:

| Review | Quality | Repetitions | Interval | Ease Factor | Next Review |
|--------|---------|-------------|----------|-------------|-------------|
| Initial | - | 0 | 1 | 2.5 | Tomorrow |
| 1st | 4 | 1 | 1 | 2.6 | +1 day |
| 2nd | 4 | 2 | 6 | 2.7 | +6 days |
| 3rd | 4 | 3 | 16 | 2.8 | +16 days |
| 4th | 4 | 4 | 45 | 2.9 | +45 days |
| 5th | 4 | 5 | 130 | 3.0 | +130 days |

**After 5 reviews, you won't see this card again for 4+ months!**

### What Happens When You Forget?

If you rate a card as 0, 1, or 2 (incorrect):

```typescript
// Example: Quality = 2 (incorrect but familiar)
// Before: repetitions = 3, interval = 16, easeFactor = 2.8

// After calculation:
newEaseFactor = 2.8 + (0.1 - (5 - 2) * (0.08 + (5 - 2) * 0.02))
              = 2.8 + (0.1 - 3 * 0.26)
              = 2.8 - 0.68
              = 2.12

// Result:
repetitions = 0       // Reset
interval = 1          // Back to 1 day
easeFactor = 2.12     // Decreased (card is harder)
nextReview = Tomorrow // Start over, but EF remembers difficulty
```

The card returns tomorrow, but the lowered ease factor means future intervals will be shorter.

## Implementation in the App

### Database Storage

Each flashcard has a corresponding `ReviewSchedule` record:

```typescript
model ReviewSchedule {
  id              Int       @id @default(autoincrement())
  easeFactor      Float     @default(2.5)
  interval        Int       @default(1)
  repetitions     Int       @default(0)
  nextReviewDate  DateTime
  lastReviewedAt  DateTime?
  flashcardId     Int       @unique
  // ...relations
}
```

### When You Create a Flashcard

```typescript
// Automatically create initial schedule
await prisma.reviewSchedule.create({
  data: {
    flashcardId: flashcard.id,
    userId: user.id,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  },
});
```

### When You Study

1. **Fetch due cards:**
```typescript
const dueCards = await prisma.flashcard.findMany({
  where: {
    userId: user.id,
    reviewSchedule: {
      nextReviewDate: {
        lte: new Date(), // Due today or earlier
      },
    },
  },
  include: {
    reviewSchedule: true,
    category: true,
  },
  orderBy: {
    reviewSchedule: {
      nextReviewDate: 'asc', // Most overdue first
    },
  },
});
```

2. **User rates recall quality (0-5)**

3. **Calculate new schedule:**
```typescript
const schedule = await prisma.reviewSchedule.findUnique({
  where: { flashcardId },
});

const newSchedule = calculateSM2(
  quality,
  schedule.repetitions,
  schedule.easeFactor,
  schedule.interval
);
```

4. **Update database:**
```typescript
await prisma.reviewSchedule.update({
  where: { flashcardId },
  data: {
    easeFactor: newSchedule.easeFactor,
    interval: newSchedule.interval,
    repetitions: newSchedule.repetitions,
    nextReviewDate: newSchedule.nextReviewDate,
    lastReviewedAt: new Date(),
  },
});

// Also record in history for analytics
await prisma.reviewHistory.create({
  data: {
    flashcardId,
    userId,
    quality,
    wasCorrect: quality >= 3,
    easeFactorBefore: schedule.easeFactor,
    easeFactorAfter: newSchedule.easeFactor,
    // ...
  },
});
```

### Tips for Using SM-2 Effectively

**Be honest with ratings:**
- Don't give yourself 5s if you hesitated
- Rating 2 (fail but familiar) is better than 3 (barely pass) if you really struggled

**Consistency matters:**
- Study daily for best results
- The algorithm works best with regular reviews

**Trust the algorithm:**
- Cards will feel too easy at first (1 day, 6 days)
- Long intervals (30+ days) are intentional and effective
- Don't manually review "early" unless necessary

---

# Sequence Diagrams

## 1. User Registration Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant RegisterPage
    participant API as /api/auth/register
    participant Auth as lib/auth.ts
    participant DB as PostgreSQL

    User->>Browser: Navigate to /register
    Browser->>RegisterPage: Load register page
    User->>RegisterPage: Fill form & submit
    RegisterPage->>API: POST {email, username, password}
    API->>DB: Check if user exists
    alt User exists
        API-->>RegisterPage: 409 Conflict
    else New user
        API->>Auth: hashPassword(password)
        API->>DB: INSERT INTO users
        API->>Auth: signToken(user)
        API->>API: Set HTTP-only cookie
        API-->>RegisterPage: 201 Created
        RegisterPage->>Browser: Redirect to /dashboard
    end
```

## 2. Study Session Flow (Spaced Repetition)

```mermaid
sequenceDiagram
    actor User
    participant StudyPage
    participant DueAPI as /api/reviews/due
    participant ReviewAPI as /api/reviews
    participant SM2 as lib/spacedRepetition.ts
    participant DB as PostgreSQL

    User->>StudyPage: Navigate to /study
    StudyPage->>DueAPI: GET /api/reviews/due
    DueAPI->>DB: SELECT flashcards WHERE nextReviewDate <= TODAY
    DB-->>DueAPI: List of due flashcards
    DueAPI-->>StudyPage: {dueCards: [...]}

    alt Has due cards
        StudyPage->>User: Show first flashcard (question)
        User->>StudyPage: Click "Show Answer"
        StudyPage->>User: Display answer + quality rating (0-5)
        User->>StudyPage: Select quality rating (e.g., 4)
        StudyPage->>ReviewAPI: POST {flashcardId, quality: 4}
        ReviewAPI->>DB: SELECT current schedule
        ReviewAPI->>SM2: calculateSM2(quality, repetitions, easeFactor, interval)
        SM2-->>ReviewAPI: New schedule
        ReviewAPI->>DB: UPDATE review_schedule
        ReviewAPI->>DB: INSERT review_history
        ReviewAPI->>DB: UPDATE daily_stats
        ReviewAPI->>DB: UPDATE study_streak
        ReviewAPI-->>StudyPage: 200 OK
        StudyPage->>User: Show next flashcard
    else No due cards
        StudyPage->>User: "No cards due today! 🎉"
    end
```

## 3. Quiz Flow

```mermaid
sequenceDiagram
    actor User
    participant QuizPage
    participant StartAPI as /api/quizzes
    participant AnswerAPI as /api/quizzes/:id/answer
    participant CompleteAPI as /api/quizzes/:id/complete
    participant DB as PostgreSQL

    User->>QuizPage: Configure quiz (category, count)
    QuizPage->>StartAPI: POST {categoryId, questionCount}
    StartAPI->>DB: SELECT random flashcards
    StartAPI->>DB: INSERT quiz_session
    StartAPI-->>QuizPage: {quizId, questions: [...]}

    loop For each question
        QuizPage->>User: Show question
        User->>QuizPage: Answer question
        QuizPage->>AnswerAPI: POST {flashcardId, userAnswer, wasCorrect}
        AnswerAPI->>DB: INSERT quiz_answer
        AnswerAPI-->>QuizPage: 200 OK
    end

    User->>QuizPage: Complete quiz
    QuizPage->>CompleteAPI: POST /api/quizzes/:id/complete
    CompleteAPI->>DB: UPDATE quiz_session (score, duration)
    CompleteAPI-->>QuizPage: {score, results}
    QuizPage->>User: Show quiz results
```

## 4. Media Upload Flow

```mermaid
sequenceDiagram
    actor User
    participant UploadComponent
    participant API as /api/media/upload
    participant Sharp as lib/media.ts
    participant FileSystem as /public/uploads

    User->>UploadComponent: Drag & drop image
    UploadComponent->>UploadComponent: Validate (type, size)
    UploadComponent->>API: POST FormData {file}
    API->>Sharp: Optimize image (resize, compress)
    API->>API: Generate unique filename
    API->>FileSystem: Save file
    API-->>UploadComponent: 200 OK {url: "/uploads/..."}
    UploadComponent->>User: Show preview
```

---

# Use Case Diagrams

## Overall System Use Cases

```mermaid
graph TB
    User((User))

    subgraph "Flashcard App System"
        UC1[Register Account]
        UC2[Login]
        UC3[Create Flashcard]
        UC4[Edit Flashcard]
        UC5[Delete Flashcard]
        UC6[Create Category]
        UC7[Study Cards]
        UC8[Rate Recall Quality]
        UC9[Take Quiz]
        UC10[View Statistics]
        UC11[Track Study Streak]
        UC12[Upload Media]
    end

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC11
    User --> UC12

    UC3 -.includes.-> UC12
    UC7 -.includes.-> UC8
    UC7 -.includes.-> UC11
```

## Use Case Details

### Authentication Use Cases

| Use Case | Actor | Precondition | Postcondition |
|----------|-------|--------------|---------------|
| Register Account | Guest | User not logged in | User account created, JWT issued, redirected to dashboard |
| Login | Guest | User has account | JWT issued, session started, redirected to dashboard |
| Logout | User | User logged in | Session ended, JWT removed, redirected to landing page |

### Flashcard Management Use Cases

| Use Case | Actor | Precondition | Postcondition |
|----------|-------|--------------|---------------|
| Create Flashcard | User | User logged in | New flashcard created, ReviewSchedule initialized |
| Edit Flashcard | User | Flashcard exists, user is owner | Flashcard updated in database |
| Delete Flashcard | User | Flashcard exists, user is owner | Flashcard and related data deleted |
| Upload Media | User | Creating/editing flashcard | Image/audio optimized, saved, URL returned |

### Study Mode Use Cases

| Use Case | Actor | Precondition | Postcondition |
|----------|-------|--------------|---------------|
| Start Study Session | User | User logged in, has flashcards | Display cards due for review |
| View Due Cards | User | ReviewSchedule exists | List of due flashcards shown |
| Flip Flashcard | User | Viewing question | Answer revealed with media |
| Rate Recall Quality | User | Viewed answer | Schedule updated via SM-2, history recorded |
| Complete Session | User | All due cards reviewed | Session summary shown, streak updated |

### Quiz Mode Use Cases

| Use Case | Actor | Precondition | Postcondition |
|----------|-------|--------------|---------------|
| Start Quiz | User | Quiz configured | QuizSession created, questions loaded |
| Answer Question | User | Quiz in progress | User submits answer |
| Complete Quiz | User | All questions answered | Final score calculated and saved |
| View Results | User | Quiz completed | Results summary displayed with breakdown |

### Statistics Use Cases

| Use Case | Actor | Precondition | Postcondition |
|----------|-------|--------------|---------------|
| View Dashboard | User | User logged in | Overview stats displayed (cards due, streak, accuracy) |
| View Study Streak | User | Has review history | Current and longest streak displayed |
| View Charts | User | Has historical data | Visual graphs of progress over time |

## Actor Definitions

| Actor | Description |
|-------|-------------|
| **Guest User** | Unauthenticated visitor, can only access public pages |
| **User** | Authenticated user, has access to all features |
| **Student** | User actively studying or taking quizzes |
| **System** | Automated processes (SM-2 algorithm, streak calculator) |

## Use Case Priorities

### High Priority (MVP)
1. ✅ User authentication
2. ✅ Create/edit/delete flashcards
3. ✅ Study mode with spaced repetition (SM-2)
4. ✅ Rate recall quality
5. ✅ View basic statistics

### Medium Priority
1. ✅ Quiz mode
2. ✅ Detailed statistics and charts
3. ✅ Study streak tracking
4. ✅ Media upload (images, audio)
5. Search and filter flashcards

### Low Priority (Future)
1. Export/import flashcards
2. Share decks with other users
3. Mobile app
4. AI-generated flashcards
5. Gamification

---

# Database Guide

## Understanding Prisma ORM

Prisma is a **type-safe** ORM that generates TypeScript types automatically from your schema.

### Benefits
- **Type Safety**: Catch database errors at compile-time
- **Auto-completion**: IntelliSense in your editor
- **Migrations**: Version control for database schema
- **Studio**: Visual database browser

## Common Prisma Queries

### Finding Records

```typescript
// Find all flashcards for a user
const flashcards = await prisma.flashcard.findMany({
  where: {
    userId: user.id,
  },
  include: {
    category: true,
    reviewSchedule: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
});

// Find one flashcard by ID
const flashcard = await prisma.flashcard.findUnique({
  where: {
    id: flashcardId,
  },
  include: {
    category: true,
    reviewSchedule: true,
  },
});

// Find first matching record
const user = await prisma.user.findFirst({
  where: {
    email: email.toLowerCase(),
  },
});

// Find with search (case-insensitive)
const results = await prisma.flashcard.findMany({
  where: {
    userId: user.id,
    OR: [
      { question: { contains: searchTerm, mode: 'insensitive' } },
      { answer: { contains: searchTerm, mode: 'insensitive' } },
    ],
  },
});

// Find with pagination
const page = 1;
const limit = 20;
const flashcards = await prisma.flashcard.findMany({
  where: { userId: user.id },
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
});

// Count total records (for pagination)
const total = await prisma.flashcard.count({
  where: { userId: user.id },
});
```

### Creating Records

```typescript
// Create user with password hash
const user = await prisma.user.create({
  data: {
    email: email.toLowerCase(),
    username,
    passwordHash: hashedPassword,
  },
  select: {
    id: true,
    email: true,
    username: true,
    createdAt: true,
  },
});

// Create flashcard with initial schedule
const flashcard = await prisma.flashcard.create({
  data: {
    question,
    answer,
    hint,
    categoryId,
    userId: user.id,
    difficulty,
    tags,
    reviewSchedule: {
      create: {
        userId: user.id,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    },
  },
  include: {
    reviewSchedule: true,
    category: true,
  },
});

// Create review history record
const history = await prisma.reviewHistory.create({
  data: {
    flashcardId,
    userId: user.id,
    quality,
    wasCorrect: quality >= 3,
    responseTimeSeconds,
    easeFactorBefore: schedule.easeFactor,
    easeFactorAfter: newSchedule.easeFactor,
    intervalBefore: schedule.interval,
    intervalAfter: newSchedule.interval,
  },
});
```

### Updating Records

```typescript
// Update flashcard
const updated = await prisma.flashcard.update({
  where: { id: flashcardId },
  data: {
    question,
    answer,
    hint,
    difficulty,
    updatedAt: new Date(),
  },
});

// Update review schedule after study session
const schedule = await prisma.reviewSchedule.update({
  where: { flashcardId },
  data: {
    easeFactor: newSchedule.easeFactor,
    interval: newSchedule.interval,
    repetitions: newSchedule.repetitions,
    nextReviewDate: newSchedule.nextReviewDate,
    lastReviewedAt: new Date(),
  },
});

// Update or create (upsert) study streak
const streak = await prisma.studyStreak.upsert({
  where: { userId: user.id },
  create: {
    userId: user.id,
    currentStreak: 1,
    longestStreak: 1,
    lastStudyDate: today,
  },
  update: {
    currentStreak: newStreakCount,
    longestStreak: Math.max(existingStreak.longestStreak, newStreakCount),
    lastStudyDate: today,
  },
});
```

### Deleting Records

```typescript
// Delete flashcard (cascade deletes schedule and history)
await prisma.flashcard.delete({
  where: { id: flashcardId },
});

// Delete many records
await prisma.reviewHistory.deleteMany({
  where: {
    userId: user.id,
    createdAt: {
      lt: new Date('2025-01-01'),
    },
  },
});
```

### Complex Queries

```typescript
// Get cards due today with category info
const dueCards = await prisma.flashcard.findMany({
  where: {
    userId: user.id,
    reviewSchedule: {
      nextReviewDate: {
        lte: new Date(),
      },
    },
  },
  include: {
    category: {
      select: {
        id: true,
        name: true,
        color: true,
      },
    },
    reviewSchedule: true,
  },
  orderBy: {
    reviewSchedule: {
      nextReviewDate: 'asc',
    },
  },
});

// Get statistics with aggregations
const stats = await prisma.reviewHistory.aggregate({
  where: {
    userId: user.id,
    reviewedAt: {
      gte: startDate,
      lte: endDate,
    },
  },
  _count: true,
  _avg: {
    quality: true,
  },
  _sum: {
    responseTimeSeconds: true,
  },
});

// Group by date
const dailyStats = await prisma.dailyStat.findMany({
  where: {
    userId: user.id,
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
  orderBy: {
    date: 'asc',
  },
});
```

### Transactions

Use transactions for operations that must succeed or fail together:

```typescript
// Submit review (multiple database updates)
const result = await prisma.$transaction(async (tx) => {
  // 1. Update review schedule
  const updatedSchedule = await tx.reviewSchedule.update({
    where: { flashcardId },
    data: {
      easeFactor: newSchedule.easeFactor,
      interval: newSchedule.interval,
      repetitions: newSchedule.repetitions,
      nextReviewDate: newSchedule.nextReviewDate,
      lastReviewedAt: new Date(),
    },
  });

  // 2. Create review history
  await tx.reviewHistory.create({
    data: {
      flashcardId,
      userId: user.id,
      quality,
      wasCorrect: quality >= 3,
      // ...
    },
  });

  // 3. Update daily stats
  const today = new Date().toISOString().split('T')[0];
  await tx.dailyStat.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: new Date(today),
      },
    },
    create: {
      userId: user.id,
      date: new Date(today),
      cardsReviewed: 1,
      correctAnswers: quality >= 3 ? 1 : 0,
      totalAnswers: 1,
    },
    update: {
      cardsReviewed: { increment: 1 },
      correctAnswers: { increment: quality >= 3 ? 1 : 0 },
      totalAnswers: { increment: 1 },
    },
  });

  // 4. Update study streak
  await updateStudyStreak(tx, user.id);

  return updatedSchedule;
});
```

## Database Relationships Explained

### One-to-Many

```
User (1) ──────► (N) Flashcard

One user can have many flashcards
Each flashcard belongs to one user
```

```typescript
// Access user's flashcards
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    flashcards: true,
  },
});

// Access flashcard's user
const flashcard = await prisma.flashcard.findUnique({
  where: { id: flashcardId },
  include: {
    user: true,
  },
});
```

### One-to-One

```
Flashcard (1) ─► (1) ReviewSchedule

Each flashcard has exactly one review schedule
Each schedule belongs to one flashcard
```

```typescript
const flashcard = await prisma.flashcard.findUnique({
  where: { id: flashcardId },
  include: {
    reviewSchedule: true,
  },
});
```

### Optional Relationship

```
Flashcard (N) ─► (1 optional) Category

Flashcards can optionally belong to a category
Categories can have many flashcards
```

```typescript
// Flashcard without category
const flashcard = await prisma.flashcard.create({
  data: {
    question: "Question",
    answer: "Answer",
    userId: user.id,
    categoryId: null, // Optional
  },
});
```

## Database Indexes

Indexes speed up queries but slow down writes. Our schema has these indexes:

```prisma
@@index([userId])              // Fast user lookups
@@index([categoryId])          // Fast category filtering
@@index([nextReviewDate])      // Fast due card queries
@@unique([userId, name])       // Prevent duplicate category names
@@unique([userId, date])       // One stat record per user per day
```

**Performance tip**: The `nextReviewDate` index is critical for study mode performance!

---

# Implementation Guide

## Phase-by-Phase Implementation

This guide walks through implementing the flashcard app step-by-step. **Follow these phases in order** for the smoothest development experience.

### Phase 1: Foundation ✅ (COMPLETED)

**What we built:**
- ✅ Next.js 14 project with TypeScript
- ✅ Tailwind CSS styling
- ✅ Docker Compose for PostgreSQL
- ✅ Prisma ORM with 9 models
- ✅ Database migrations
- ✅ Authentication utilities (JWT, bcrypt)
- ✅ Prisma client singleton
- ✅ Basic app structure

**Files created:**
- `package.json`, `next.config.js`, `tsconfig.json`
- `docker-compose.yml`
- `prisma/schema.prisma`
- `lib/prisma.ts`, `lib/auth.ts`
- `app/layout.tsx`, `app/page.tsx`

### Phase 2: Authentication (NEXT STEP)

**Goal**: Users can register, login, and access protected routes

**Files to create:**

1. **`lib/validators.ts`** - Zod schemas
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

2. **`app/api/auth/register/route.ts`** - Registration endpoint
3. **`app/api/auth/login/route.ts`** - Login endpoint
4. **`app/api/auth/me/route.ts`** - Get current user
5. **`middleware.ts`** - Protect dashboard routes
6. **`store/authStore.ts`** - Zustand auth state
7. **`app/(auth)/login/page.tsx`** - Login page UI
8. **`app/(auth)/register/page.tsx`** - Register page UI

**Testing authentication:**
```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Phase 3: Flashcard CRUD

**Goal**: Users can create, read, update, and delete flashcards

**Files to create:**

1. **`app/api/flashcards/route.ts`** - List all, create new
2. **`app/api/flashcards/[id]/route.ts`** - Get, update, delete
3. **`app/api/categories/route.ts`** - Category CRUD
4. **`app/api/categories/[id]/route.ts`** - Category detail
5. **`components/flashcard/flashcard-form.tsx`** - Form component
6. **`components/flashcard/flashcard-list.tsx`** - List component
7. **`components/flashcard/flashcard-card.tsx`** - Card component
8. **`hooks/useFlashcards.ts`** - TanStack Query hooks
9. **`app/(dashboard)/flashcards/page.tsx`** - Flashcard list page
10. **`app/(dashboard)/flashcards/new/page.tsx`** - Create page
11. **`app/(dashboard)/flashcards/[id]/page.tsx`** - Edit page

**Key features:**
- Search and filter by category
- Pagination (20 per page)
- Form validation with React Hook Form + Zod
- Optimistic updates for instant feedback

### Phase 4: Study Mode + SM-2 Algorithm ⭐ (MOST IMPORTANT)

**Goal**: Users can study cards with spaced repetition

**Files to create:**

1. **`lib/spacedRepetition.ts`** - SM-2 algorithm implementation (CORE)
```typescript
export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

export function calculateSM2(
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
): SM2Result {
  // Implementation here (see SM-2 section above)
}
```

2. **`app/api/reviews/due/route.ts`** - Get cards due today
3. **`app/api/reviews/route.ts`** - Submit review (update schedule)
4. **`app/api/reviews/history/route.ts`** - Review history
5. **`components/study/study-card.tsx`** - Flashcard with flip animation
6. **`components/study/difficulty-rating.tsx`** - Quality rating buttons (0-5)
7. **`app/(dashboard)/study/page.tsx`** - Study mode page
8. **`hooks/useReviews.ts`** - Review data fetching

**Implementation steps:**
1. Create SM-2 algorithm function
2. Build API endpoint to fetch due cards
3. Build API endpoint to submit reviews
4. Create flip card UI component
5. Add keyboard shortcuts (0-5 for ratings, Space to flip)
6. Update dashboard to show due count

**Critical**: Test SM-2 algorithm thoroughly with different quality ratings!

### Phase 5: Dashboard & Statistics

**Goal**: Users see progress metrics and charts

**Files to create:**

1. **`app/api/stats/dashboard/route.ts`** - Overview stats
2. **`app/api/stats/daily/route.ts`** - Daily statistics
3. **`app/api/stats/streaks/route.ts`** - Streak calculation
4. **`components/stats/stats-card.tsx`** - Metric card UI
5. **`components/stats/progress-chart.tsx`** - Recharts wrapper
6. **`components/stats/streak-counter.tsx`** - Streak display
7. **`app/(dashboard)/page.tsx`** - Dashboard home
8. **`app/(dashboard)/stats/page.tsx`** - Detailed stats page

**Metrics to display:**
- Cards due today
- Current study streak (🔥)
- Accuracy rate (%)
- Total flashcards
- Cards reviewed today
- Line chart: Reviews over time
- Bar chart: Accuracy by category

### Phase 6: Quiz Mode

**Goal**: Users can take timed quizzes

**Files to create:**

1. **`app/api/quizzes/route.ts`** - Start quiz
2. **`app/api/quizzes/[id]/answer/route.ts`** - Submit answer
3. **`app/api/quizzes/[id]/complete/route.ts`** - Complete quiz
4. **`app/api/quizzes/history/route.ts`** - Quiz history
5. **`components/quiz/quiz-card.tsx`** - Quiz question UI
6. **`components/quiz/quiz-results.tsx`** - Results summary
7. **`app/(dashboard)/quiz/page.tsx`** - Quiz mode page

**Quiz features:**
- Select category and number of questions
- Optional timer
- Self-graded or input-based answers
- Results summary with accuracy
- Quiz history

### Phase 7: Multimedia Support

**Goal**: Users can add images and audio to flashcards

**Files to create:**

1. **`lib/media.ts`** - Image optimization (Sharp)
2. **`app/api/media/upload/route.ts`** - File upload handler
3. **`app/api/media/[filename]/route.ts`** - Serve/delete files
4. **`components/media/image-upload.tsx`** - Image uploader (react-dropzone)
5. **`components/media/audio-upload.tsx`** - Audio uploader
6. **`components/media/audio-player.tsx`** - Audio player (Howler.js)

**Implementation:**
1. Accept FormData with file
2. Validate type (jpg, png, mp3, wav) and size (5MB images, 10MB audio)
3. Optimize images with Sharp (resize to 800px, compress)
4. Save to `/public/uploads/` with unique filename (timestamp-random)
5. Return URL for database storage

### Phase 8: Polish & Deploy

**Goal**: Production-ready app

**Tasks:**
1. Add loading states and error boundaries
2. Toast notifications (react-hot-toast)
3. Responsive design testing
4. Keyboard shortcuts
5. Performance optimization
6. Deploy to Vercel
7. Deploy database to Railway/Supabase
8. Configure production environment variables

---

# Code Examples

## Complete Feature Implementations

### Example 1: Creating a Flashcard with API Route

**API Route: `app/api/flashcards/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const flashcardSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(1000),
  hint: z.string().max(300).optional(),
  categoryId: z.number().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  tags: z.array(z.string()).default([]),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validation = flashcardSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 3. Create flashcard with initial review schedule
    const flashcard = await prisma.flashcard.create({
      data: {
        question: data.question,
        answer: data.answer,
        hint: data.hint,
        categoryId: data.categoryId,
        difficulty: data.difficulty,
        tags: data.tags,
        userId: user.userId,
        reviewSchedule: {
          create: {
            userId: user.userId,
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0,
            nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        category: true,
        reviewSchedule: true,
      },
    });

    // 4. Return created flashcard
    return NextResponse.json(
      { flashcard },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create flashcard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    // Build where clause
    const where: any = {
      userId: user.userId,
    };

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch flashcards with pagination
    const [flashcards, total] = await Promise.all([
      prisma.flashcard.findMany({
        where,
        include: {
          category: true,
          reviewSchedule: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.flashcard.count({ where }),
    ]);

    return NextResponse.json({
      flashcards,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get flashcards error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Example 2: Study Session with SM-2 Algorithm

**API Route: `app/api/reviews/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateSM2 } from '@/lib/spacedRepetition';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { flashcardId, quality, responseTimeSeconds } = await request.json();

    // Validate quality rating (0-5)
    if (quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: 'Quality must be between 0 and 5' },
        { status: 400 }
      );
    }

    // Fetch current review schedule
    const schedule = await prisma.reviewSchedule.findUnique({
      where: { flashcardId },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Review schedule not found' },
        { status: 404 }
      );
    }

    // Calculate new schedule using SM-2 algorithm
    const newSchedule = calculateSM2(
      quality,
      schedule.repetitions,
      schedule.easeFactor,
      schedule.interval
    );

    // Update database in transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update review schedule
      const updatedSchedule = await tx.reviewSchedule.update({
        where: { flashcardId },
        data: {
          easeFactor: newSchedule.easeFactor,
          interval: newSchedule.interval,
          repetitions: newSchedule.repetitions,
          nextReviewDate: newSchedule.nextReviewDate,
          lastReviewedAt: new Date(),
        },
      });

      // 2. Create review history
      await tx.reviewHistory.create({
        data: {
          flashcardId,
          userId: user.userId,
          quality,
          wasCorrect: quality >= 3,
          responseTimeSeconds,
          easeFactorBefore: schedule.easeFactor,
          easeFactorAfter: newSchedule.easeFactor,
          intervalBefore: schedule.interval,
          intervalAfter: newSchedule.interval,
        },
      });

      // 3. Update daily stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await tx.dailyStat.upsert({
        where: {
          userId_date: {
            userId: user.userId,
            date: today,
          },
        },
        create: {
          userId: user.userId,
          date: today,
          cardsReviewed: 1,
          correctAnswers: quality >= 3 ? 1 : 0,
          totalAnswers: 1,
          studyTimeMinutes: Math.ceil((responseTimeSeconds || 0) / 60),
        },
        update: {
          cardsReviewed: { increment: 1 },
          correctAnswers: { increment: quality >= 3 ? 1 : 0 },
          totalAnswers: { increment: 1 },
          studyTimeMinutes: {
            increment: Math.ceil((responseTimeSeconds || 0) / 60),
          },
        },
      });

      // 4. Update study streak
      const streak = await tx.studyStreak.findUnique({
        where: { userId: user.userId },
      });

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (!streak) {
        await tx.studyStreak.create({
          data: {
            userId: user.userId,
            currentStreak: 1,
            longestStreak: 1,
            lastStudyDate: today,
          },
        });
      } else {
        const lastStudy = new Date(streak.lastStudyDate || 0);
        lastStudy.setHours(0, 0, 0, 0);

        let newCurrentStreak = streak.currentStreak;

        if (lastStudy.getTime() === yesterday.getTime()) {
          // Studied yesterday, increment streak
          newCurrentStreak += 1;
        } else if (lastStudy.getTime() < yesterday.getTime()) {
          // Missed days, reset streak
          newCurrentStreak = 1;
        }
        // If studied today already, keep current streak

        await tx.studyStreak.update({
          where: { userId: user.userId },
          data: {
            currentStreak: newCurrentStreak,
            longestStreak: Math.max(streak.longestStreak, newCurrentStreak),
            lastStudyDate: today,
          },
        });
      }

      return updatedSchedule;
    });

    return NextResponse.json({
      message: 'Review recorded successfully',
      updatedSchedule: result,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Example 3: React Component with TanStack Query

**Component: `app/(dashboard)/flashcards/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category?: {
    id: number;
    name: string;
    color: string;
  };
  reviewSchedule: {
    nextReviewDate: string;
  };
}

export default function FlashcardsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);

  // Fetch flashcards
  const { data, isLoading, error } = useQuery({
    queryKey: ['flashcards', { search, categoryId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryId) params.set('categoryId', categoryId.toString());

      const res = await fetch(`/api/flashcards?${params}`);
      if (!res.ok) throw new Error('Failed to fetch flashcards');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/flashcards/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete flashcard');
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error loading flashcards
      </div>
    );
  }

  const flashcards: Flashcard[] = data?.flashcards || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Flashcards</h1>
        <button
          onClick={() => router.push('/flashcards/new')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Create Flashcard
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search flashcards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Flashcard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((card) => (
          <div
            key={card.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              {card.category && (
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: card.category.color + '20',
                    color: card.category.color,
                  }}
                >
                  {card.category.name}
                </span>
              )}
            </div>
            <h3 className="font-semibold mb-2 line-clamp-2">{card.question}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">{card.answer}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => router.push(`/flashcards/${card.id}`)}
                className="flex-1 px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this flashcard?')) {
                    deleteMutation.mutate(card.id);
                  }
                }}
                className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {flashcards.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No flashcards found. Create your first one!
        </div>
      )}
    </div>
  );
}
```

---

# Troubleshooting

## Common Issues and Solutions

### Database Connection Errors

**Error**: `Can't reach database server`

**Solutions:**
```bash
# Check if PostgreSQL container is running
docker ps

# If not running, start it
docker-compose up -d

# Check logs
docker-compose logs postgres

# Verify port 5433 is available
lsof -i :5433

# Restart container
docker-compose restart

# If port conflict, change in docker-compose.yml and .env.local
```

**Error**: `DATABASE_URL not found`

**Solution:**
```bash
# For Next.js dev server, use .env.local
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5433/flashcard_app?schema=public"' > .env.local

# For Prisma CLI, use .env
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5433/flashcard_app?schema=public"' > .env

# Or provide it explicitly
DATABASE_URL="..." npx prisma migrate dev
```

### Prisma Issues

**Error**: `Prisma Client not generated`

**Solution:**
```bash
# Generate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

**Error**: `Migration failed`

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or push schema without migration
npx prisma db push
```

**Error**: `Table already exists`

**Solution:**
```bash
# Option 1: Reset database
DATABASE_URL="..." npx prisma migrate reset

# Option 2: Drop tables manually
docker exec -it flashcard_db psql -U postgres -d flashcard_app
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
\q

# Then run migrations
DATABASE_URL="..." npx prisma migrate dev
```

### Next.js Build Errors

**Error**: `Module not found`

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check imports use @/ alias correctly
import prisma from '@/lib/prisma'; // Correct
import prisma from '../../../lib/prisma'; // Avoid
```

**Error**: `Type errors in build`

**Solution:**
```bash
# Run TypeScript check
npx tsc --noEmit

# Check Prisma Client is generated
npx prisma generate

# Restart TypeScript server in VSCode
# Cmd+Shift+P > TypeScript: Restart TS Server
```

### Authentication Issues

**Error**: `JWT verification failed`

**Solution:**
```bash
# Check JWT_SECRET is set in .env.local
cat .env.local | grep JWT_SECRET

# Ensure it's at least 32 characters
# Clear cookies and login again
```

**Error**: `Unauthorized on protected routes`

**Solution:**
```typescript
// Check middleware.ts is configured
export const config = {
  matcher: ['/dashboard/:path*', '/flashcards/:path*', '/study/:path*'],
};

// Verify auth token is set
console.log(await cookies().get('auth-token'));

// Check getCurrentUser() function works
const user = await getCurrentUser();
console.log(user);
```

### Performance Issues

**Problem**: Slow queries

**Solution:**
```typescript
// Add database indexes (already in schema)
@@index([userId])
@@index([nextReviewDate])

// Use select to limit returned fields
const flashcards = await prisma.flashcard.findMany({
  select: {
    id: true,
    question: true,
    answer: true,
    // Don't fetch unnecessary fields
  },
});

// Use pagination
const flashcards = await prisma.flashcard.findMany({
  take: 20,
  skip: (page - 1) * 20,
});

// Use database aggregations instead of fetching all records
const count = await prisma.flashcard.count({ where: { userId } });
```

**Problem**: Large bundle size

**Solution:**
```typescript
// Use dynamic imports for large components
const HeavyChart = dynamic(() => import('@/components/stats/heavy-chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false,
});

// Split large pages
// Good: Small, focused components
// Bad: One huge component with everything
```

### Docker Issues

**Problem**: Container won't start

**Solution:**
```bash
# Check Docker is running
docker --version

# Check for port conflicts
lsof -i :5433

# Remove old containers
docker-compose down -v
docker-compose up -d

# View logs
docker-compose logs -f postgres
```

**Problem**: Data persistence issues

**Solution:**
```bash
# Check volume is mounted
docker-compose ps -a

# Backup data before removing volumes
docker exec flashcard_db pg_dump -U postgres flashcard_app > backup.sql

# Remove volumes and recreate
docker-compose down -v
docker-compose up -d

# Restore from backup
cat backup.sql | docker exec -i flashcard_db psql -U postgres -d flashcard_app
```

### Environment Variables

**Problem**: Variables not loading

**Solution:**
```bash
# Next.js only loads .env.local in development
# For client-side, use NEXT_PUBLIC_ prefix
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Restart dev server after changing .env.local
npm run dev

# Check variables are loaded
console.log(process.env.DATABASE_URL); // Server only
console.log(process.env.NEXT_PUBLIC_APP_URL); // Server and client
```

### Common Development Tips

1. **Clear caches when things behave strangely:**
```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

2. **Use Prisma Studio to debug database:**
```bash
npx prisma studio
# Opens http://localhost:5555
```

3. **Check API routes in browser DevTools:**
```
Network tab > XHR/Fetch > Click request > Preview/Response
```

4. **Enable verbose logging:**
```typescript
// In lib/prisma.ts
log: ['query', 'info', 'warn', 'error'],
```

5. **Use React Query DevTools:**
```typescript
// In app/layout.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

---

# Design System

## Design Principles

1. **Clarity** - Clear visual hierarchy, obvious call-to-actions
2. **Consistency** - Unified component library, predictable interactions
3. **Efficiency** - Fast loading, minimal clicks, keyboard shortcuts
4. **Accessibility** - WCAG 2.1 AA compliance, keyboard navigation
5. **Delight** - Smooth animations, satisfying interactions

## Color Palette

### Primary Colors

```css
/* Primary - Indigo (Focus, Learning) */
--primary-500: #6366f1;  /* Main primary */
--primary-600: #4f46e5;
--primary-700: #4338ca;

/* Secondary - Sky Blue (Success, Progress) */
--secondary-500: #0ea5e9;  /* Main secondary */
--secondary-600: #0284c7;
```

### Semantic Colors

```css
/* Success - Green */
--success: #10b981;
--success-dark: #065f46;

/* Warning - Amber */
--warning: #f59e0b;
--warning-dark: #92400e;

/* Error - Red */
--error: #ef4444;
--error-dark: #991b1b;

/* Info - Blue */
--info: #3b82f6;
--info-dark: #1e3a8a;
```

### Neutral Colors

```css
/* Grays */
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-500: #6b7280;
--gray-700: #374151;
--gray-900: #111827;
```

## Typography

### Font Scale

```css
.text-h1 { font-size: 3rem;    /* 48px */ font-weight: 700; }
.text-h2 { font-size: 2.25rem; /* 36px */ font-weight: 700; }
.text-h3 { font-size: 1.875rem;/* 30px */ font-weight: 600; }
.text-h4 { font-size: 1.5rem;  /* 24px */ font-weight: 600; }
.text-base{ font-size: 1rem;   /* 16px */ line-height: 1.5; }
.text-sm  { font-size: 0.875rem;/* 14px */ line-height: 1.5; }
```

## Component Library

### Buttons

```html
<!-- Primary Button -->
<button class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
  Create Flashcard
</button>

<!-- Secondary Button -->
<button class="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition">
  Cancel
</button>

<!-- Ghost Button -->
<button class="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition">
  View Details
</button>
```

### Cards

```html
<!-- Base Card -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <!-- Card content -->
</div>

<!-- Interactive Card -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition cursor-pointer">
  <!-- Card content -->
</div>
```

### Forms

```html
<!-- Text Input -->
<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">Question</label>
  <input
    type="text"
    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
    placeholder="Enter your question"
  />
</div>

<!-- Textarea -->
<textarea
  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
  rows="4"
  placeholder="Enter your answer"
></textarea>
```

### Badges

```html
<!-- Success Badge -->
<span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  Correct
</span>

<!-- Error Badge -->
<span class="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
  Incorrect
</span>
```

### Modals

```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Modal Title</h3>
      <button class="p-1 text-gray-400 hover:text-gray-600">✕</button>
    </div>
    <div class="text-gray-600">Modal content</div>
    <div class="flex gap-3 justify-end">
      <button class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
      <button class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg">Confirm</button>
    </div>
  </div>
</div>
```

### Loading States

```html
<!-- Spinner -->
<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>

<!-- Progress Bar -->
<div class="w-full bg-gray-200 rounded-full h-2">
  <div class="bg-indigo-600 h-2 rounded-full" style="width: 60%"></div>
</div>
```

## Layout Patterns

### Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│ Header (Logo, Nav, User Menu)                   │
├──────────┬──────────────────────────────────────┤
│          │                                       │
│ Sidebar  │  Main Content Area                   │
│          │  ┌────────────────────────────────┐  │
│ • Home   │  │ Stats Cards                    │  │
│ • Study  │  ├────────────────────────────────┤  │
│ • Quiz   │  │ Charts                         │  │
│ • Cards  │  ├────────────────────────────────┤  │
│ • Stats  │  │ Recent Activity                │  │
│          │  └────────────────────────────────┘  │
└──────────┴───────────────────────────────────────┘
```

### Study Mode Layout

```
┌─────────────────────────────────────────────────┐
│ Progress: 5/20 cards reviewed                   │
├─────────────────────────────────────────────────┤
│                                                  │
│         ┌───────────────────────────┐           │
│         │                           │           │
│         │   Flashcard               │           │
│         │   (Flip Animation)        │           │
│         │                           │           │
│         └───────────────────────────┘           │
│                                                  │
│   [Show Answer] or Quality Rating (0-5)        │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Animations

### Flashcard Flip Animation

```css
.flip-card {
  perspective: 1000px;
}

.flip-card-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}
```

### Transitions

```css
/* Default transition */
transition: all 0.2s ease-in-out;

/* Hover lift effect */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
```

## Responsive Breakpoints

```css
/* Mobile First */
/* Default: < 640px (mobile) */
@media (min-width: 640px) { /* sm - tablets */ }
@media (min-width: 768px) { /* md - tablets */ }
@media (min-width: 1024px) { /* lg - laptops */ }
@media (min-width: 1280px) { /* xl - desktops */ }
```

## Accessibility Guidelines

### Color Contrast
- **Normal text**: 4.5:1 minimum
- **Large text (18px+)**: 3:1 minimum
- **Interactive elements**: 3:1 minimum

### Focus States
```css
.focus-visible:focus {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}
```

### Keyboard Navigation
- **Tab**: Move focus forward
- **Shift+Tab**: Move focus backward
- **Enter/Space**: Activate button
- **Escape**: Close modal
- **Arrow keys**: Navigate lists

---

## Viewing Diagrams

All diagrams in this documentation use **Mermaid** syntax.

### How to View:

1. **GitHub**: Diagrams render automatically
2. **VSCode**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Copy to [mermaid.live](https://mermaid.live)

---

**End of Documentation**
