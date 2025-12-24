# Flashcard App

A full-stack flashcard application built with Next.js 14, featuring spaced repetition learning, quiz mode, progress tracking, and multimedia support.

## Features

### Core Functionality
- **Flashcard Management**: Create, edit, and organize flashcards with questions and answers
- **Categories**: Organize flashcards into subjects (e.g., "Spanish Verbs", "Data Structures")
- **Multimedia Support**: Add images and audio to flashcards for enhanced learning
- **Search & Filter**: Quickly find flashcards by keyword or category

### Learning Features
- **Spaced Repetition**: SM-2 algorithm schedules card reviews for optimal long-term retention
- **Study Mode**: Flip cards, rate difficulty, and track your progress
- **Quiz Mode**: Test your knowledge with generated quizzes
- **Progress Tracking**: Visual dashboards showing study statistics, streaks, and performance trends

### User Experience
- **Study Streaks**: Track consecutive days of studying
- **Performance Analytics**: Charts and graphs showing your learning progress
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Efficient navigation (Space to flip, 0-5 for ratings)

## 📚 Documentation

Comprehensive technical documentation is available in **[DOCUMENTATION.md](./DOCUMENTATION.md)**, covering:

- **System Architecture** - Tech stack, database schema, security, scalability
- **Frontend Framework** - Next.js 14 patterns, component architecture, state management
- **Sequence Diagrams** - User flows and system interactions (Mermaid)
- **Use Case Diagrams** - Feature interactions and scenarios (Mermaid)
- **Design System** - UI/UX guidelines, colors, typography, components

👉 **[View Complete Documentation](./DOCUMENTATION.md)**

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Media**: react-dropzone, Howler.js

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt
- **File Processing**: Sharp (image optimization)

### Infrastructure
- **Containerization**: Docker Compose (PostgreSQL)
- **Deployment**: Vercel (app) + Railway/Supabase (database)

---

## Software Principles & Architectural Patterns

This project follows industry-standard software engineering principles and architectural patterns to ensure maintainability, scalability, and code quality.

### Core Software Principles

#### 1. SOLID Principles

**Single Responsibility Principle (SRP)**
- Each module has one reason to change
- `lib/auth.ts` - Handles only authentication logic (JWT, password hashing)
- `lib/spacedRepetition.ts` - Contains only SM-2 algorithm logic
- `lib/prisma.ts` - Manages only database client instantiation
- API routes handle single endpoints with specific responsibilities

**Open/Closed Principle (OCP)**
- Open for extension, closed for modification
- SM-2 algorithm can be extended with new strategies without modifying core
- Component library designed for composition and extension
- Middleware can be extended with additional authentication strategies

**Liskov Substitution Principle (LSP)**
- TypeScript interfaces ensure type compatibility
- Prisma models can be substituted with mock implementations for testing
- React components accept props that can be extended without breaking existing usage

**Interface Segregation Principle (ISP)**
- Zod schemas define minimal required fields
- API responses include only necessary data (using Prisma `select`)
- Components receive only the props they need

**Dependency Inversion Principle (DIP)**
- High-level modules don't depend on low-level modules
- API routes depend on abstractions (`lib/auth.ts`) not concrete implementations
- Components depend on hooks, not direct API calls
- Database logic abstracted through Prisma ORM

#### 2. DRY (Don't Repeat Yourself)

**Utility Functions**
```typescript
// lib/auth.ts - Reusable auth functions
getCurrentUser(), hashPassword(), verifyPassword()

// lib/validators.ts - Shared validation schemas
flashcardSchema, categorySchema, reviewSchema
```

**Custom Hooks**
```typescript
// hooks/useFlashcards.ts - Reusable data fetching
export function useFlashcards(categoryId?: number) { ... }

// hooks/useReviews.ts - Study session logic
export function useReviews() { ... }
```

**Shared Components**
- `components/ui/` - Button, Card, Modal, Input (reused across app)
- Consistent styling through Tailwind utilities and design tokens

#### 3. KISS (Keep It Simple, Stupid)

- Simple, focused API routes (one endpoint = one file)
- Clear function names that describe what they do
- Flat component hierarchy (avoid deep nesting)
- Direct database queries using Prisma (no unnecessary abstraction layers)
- Straightforward state management with Zustand

#### 4. YAGNI (You Aren't Gonna Need It)

- No premature optimization
- No over-engineering of abstractions
- Features implemented only when required
- Simple JWT auth instead of complex OAuth initially
- Local file storage before cloud storage

#### 5. Separation of Concerns

**Clear Layer Separation**
```
Presentation Layer → Components (React)
Application Layer → Hooks + Stores (Business logic)
API Layer         → Next.js API Routes
Business Logic    → lib/ utilities
Data Access       → Prisma ORM
Database          → PostgreSQL
```

**File-based Organization**
- `/app` - Pages and routing
- `/components` - UI components
- `/lib` - Business logic and utilities
- `/hooks` - React hooks for data fetching
- `/store` - Client state management
- `/types` - TypeScript definitions

---

### Architectural Patterns

#### 1. **Layered Architecture (N-Tier)**

```
┌─────────────────────────────────────┐
│   Presentation Layer                │
│   (Next.js Pages + React Components)│
├─────────────────────────────────────┤
│   Application Layer                 │
│   (Custom Hooks + State Management) │
├─────────────────────────────────────┤
│   API Layer                         │
│   (Next.js API Routes)              │
├─────────────────────────────────────┤
│   Business Logic Layer              │
│   (lib/auth, lib/spacedRepetition)  │
├─────────────────────────────────────┤
│   Data Access Layer                 │
│   (Prisma ORM)                      │
├─────────────────────────────────────┤
│   Database Layer                    │
│   (PostgreSQL)                      │
└─────────────────────────────────────┘
```

**Benefits:**
- Clear separation of responsibilities
- Easy to test individual layers
- Scalable and maintainable
- Changes in one layer don't affect others

#### 2. **Repository Pattern**

Prisma ORM acts as a repository abstraction:

```typescript
// Instead of raw SQL
const flashcards = await prisma.flashcard.findMany({
  where: { userId: user.id },
  include: { category: true },
});

// Type-safe, abstracted data access
// No SQL injection vulnerabilities
// Easy to mock for testing
```

**Benefits:**
- Centralized data access logic
- Type safety with TypeScript
- Simplified testing (can mock Prisma)
- Database independence

#### 3. **MVC/API Route Pattern**

Next.js API Routes follow Model-View-Controller pattern:

```typescript
// app/api/flashcards/route.ts
export async function GET(request) {
  // Controller logic
  const user = await getCurrentUser();

  // Model access
  const flashcards = await prisma.flashcard.findMany({
    where: { userId: user.id },
  });

  // View response
  return NextResponse.json({ flashcards });
}
```

**Components:**
- **Model**: Prisma models (`prisma/schema.prisma`)
- **View**: JSON responses from API routes
- **Controller**: API route handlers

#### 4. **Service Layer Pattern**

Business logic extracted into service functions:

```typescript
// lib/spacedRepetition.ts - Service
export function calculateSM2(quality, repetitions, easeFactor, interval) {
  // Pure business logic
  // No dependencies on database or HTTP
  // Easy to test in isolation
}

// API route uses the service
import { calculateSM2 } from '@/lib/spacedRepetition';
const newSchedule = calculateSM2(quality, schedule.repetitions, ...);
```

**Benefits:**
- Reusable business logic
- Testable in isolation
- Clear separation from infrastructure concerns

#### 5. **Middleware Pattern**

Next.js middleware for cross-cutting concerns:

```typescript
// middleware.ts - Authentication middleware
export async function middleware(request) {
  const token = request.cookies.get('auth-token');

  if (!token) {
    return NextResponse.redirect('/login');
  }

  // Verify JWT
  const user = verifyToken(token.value);
  if (!user) {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}

// Applies to protected routes
export const config = {
  matcher: ['/dashboard/:path*', '/flashcards/:path*'],
};
```

**Use Cases:**
- Authentication/authorization
- Logging and analytics
- Request/response modification
- Error handling

#### 6. **Observer Pattern (State Management)**

Zustand implements observer pattern for state:

```typescript
// store/authStore.ts
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }), // Notify observers
  logout: () => set({ user: null }),
}));

// Component observes state
function Header() {
  const user = useAuthStore((state) => state.user); // Subscribe
  // Re-renders when user changes
}
```

**Benefits:**
- Reactive UI updates
- Decoupled state management
- Multiple components can observe same state

#### 7. **Strategy Pattern (SM-2 Algorithm)**

Spaced repetition algorithm as a strategy:

```typescript
// lib/spacedRepetition.ts
export interface SpacedRepetitionStrategy {
  calculate(quality: number, schedule: Schedule): NewSchedule;
}

// SM-2 implementation
export class SM2Strategy implements SpacedRepetitionStrategy {
  calculate(quality, schedule) {
    // SM-2 algorithm implementation
  }
}

// Can be swapped with SM-5, Anki algorithm, or custom strategies
```

**Benefits:**
- Algorithm can be swapped without changing API
- Easy to A/B test different algorithms
- Extensible for future improvements

#### 8. **Factory Pattern (Prisma Client)**

Singleton factory for database client:

```typescript
// lib/prisma.ts
const globalForPrisma = globalThis as { prisma?: PrismaClient };

// Factory function
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ['error'] });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Benefits:**
- Single database connection pool
- Prevents connection exhaustion
- Efficient resource usage

#### 9. **Dependency Injection**

Function parameters inject dependencies:

```typescript
// API route receives dependencies
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(); // Injected auth
  const data = await request.json();   // Injected request
  const result = await prisma.create({...}); // Injected DB
  return NextResponse.json(result);
}

// Easy to mock for testing
const mockUser = { id: 1 };
const mockPrisma = { create: jest.fn() };
```

#### 10. **Server-Side Rendering (SSR) Pattern**

Next.js 14 App Router with React Server Components:

```typescript
// app/(dashboard)/page.tsx - Server Component
export default async function DashboardPage() {
  // Runs on server only
  const user = await getCurrentUser();
  const stats = await prisma.dailyStat.findMany({
    where: { userId: user.id },
  });

  // Rendered on server, sent as HTML
  return <Dashboard stats={stats} />;
}
```

**Benefits:**
- Faster initial page load
- Better SEO
- Reduced client-side JavaScript
- Direct database access (no API route needed)

---

### Design Patterns in Action

#### Component Composition Pattern

```typescript
// Small, focused components composed together
<Card>
  <CardHeader>
    <CardTitle>Flashcard Statistics</CardTitle>
  </CardHeader>
  <CardContent>
    <StatsChart data={dailyStats} />
  </CardContent>
</Card>
```

#### Custom Hook Pattern

```typescript
// Encapsulate complex logic in reusable hooks
function useFlashcards(categoryId?: number) {
  return useQuery({
    queryKey: ['flashcards', categoryId],
    queryFn: () => fetchFlashcards(categoryId),
    staleTime: 5 * 60 * 1000,
  });
}

// Usage in components
const { data, isLoading } = useFlashcards(1);
```

#### Render Props Pattern (TanStack Query)

```typescript
<Query query={flashcardsQuery}>
  {({ data, isLoading }) => (
    isLoading ? <Spinner /> : <FlashcardList data={data} />
  )}
</Query>
```

#### Higher-Order Component (HOC) Pattern

```typescript
// Middleware wraps route handlers
export function withAuth(handler) {
  return async (request) => {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(request, user);
  };
}

// Usage
export const GET = withAuth(async (request, user) => {
  // User is authenticated
});
```

---

### Best Practices Implemented

#### Type Safety

✅ **TypeScript throughout**
- Compile-time type checking
- IntelliSense autocomplete
- Refactoring safety

✅ **Prisma type generation**
- Database schema → TypeScript types
- No manual type definitions for models

✅ **Zod validation**
- Runtime type validation
- Type inference from schemas

#### Security

✅ **Input validation** (Zod schemas on all API endpoints)
✅ **SQL injection prevention** (Prisma parameterized queries)
✅ **XSS prevention** (HTTP-only cookies, React auto-escaping)
✅ **CSRF protection** (SameSite cookies)
✅ **Password hashing** (bcrypt with 10 rounds)
✅ **JWT expiration** (7-day tokens)

#### Performance

✅ **Database indexing** (userId, categoryId, nextReviewDate)
✅ **Pagination** (limit 20-100 records per page)
✅ **Caching** (TanStack Query 5-minute stale time)
✅ **Code splitting** (Next.js automatic chunking)
✅ **Image optimization** (Sharp processing, Next.js Image component)
✅ **Server components** (reduce client JavaScript)

#### Testing Strategy

✅ **Unit tests** for pure functions (SM-2 algorithm)
✅ **Integration tests** for API routes
✅ **Component tests** with React Testing Library
✅ **E2E tests** with Playwright (optional)

#### Error Handling

✅ **Consistent error responses**
```typescript
return NextResponse.json(
  { error: 'Resource not found' },
  { status: 404 }
);
```

✅ **Error boundaries** for React components
✅ **Try-catch blocks** in API routes
✅ **Prisma error handling** for database operations

#### Code Organization

✅ **Feature-based folders** (flashcard/, study/, quiz/)
✅ **Colocation** (components near their usage)
✅ **Barrel exports** (index.ts for clean imports)
✅ **Naming conventions** (PascalCase for components, camelCase for functions)

---

### Architecture Decision Records (ADRs)

#### Why Next.js API Routes instead of separate Express server?

**Decision**: Use Next.js API Routes for backend

**Rationale**:
- Single deployment (no separate frontend/backend repos)
- Better TypeScript integration (shared types)
- Automatic API route optimization
- Edge runtime support for performance
- Simpler development workflow

**Trade-offs**:
- Vendor lock-in to Next.js
- Less control over HTTP server configuration
- Not ideal for microservices architecture

#### Why Prisma instead of raw SQL or other ORMs?

**Decision**: Use Prisma ORM

**Rationale**:
- Type-safe database access
- Auto-generated TypeScript types
- Excellent developer experience (Prisma Studio)
- Database migrations with version control
- Active development and community

**Trade-offs**:
- Slight performance overhead vs raw SQL
- Learning curve for complex queries
- Migration dependencies

#### Why JWT instead of session-based auth?

**Decision**: Use JWT with HTTP-only cookies

**Rationale**:
- Stateless authentication (no session storage)
- Scales horizontally (no session synchronization)
- Works well with serverless (Vercel)
- Can decode user info without database query

**Trade-offs**:
- Cannot invalidate tokens before expiry
- Slightly larger request size
- Requires careful token rotation strategy

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Docker and Docker Compose
- PostgreSQL client (optional, for manual DB access)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flashcard-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flashcard_app?schema=public"

   # Authentication (generate a secure random string)
   JWT_SECRET="your_super_secret_jwt_key_minimum_32_characters"
   JWT_EXPIRES_IN="7d"

   # File Upload Limits
   MAX_IMAGE_SIZE=5242880  # 5MB
   MAX_AUDIO_SIZE=10485760  # 10MB

   # App Config
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Security
   BCRYPT_ROUNDS=10
   ```

4. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

5. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations to create tables
   npx prisma migrate dev --name init

   # (Optional) Seed the database with sample data
   npx prisma db seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
flashcard-app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API Routes (backend)
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── flashcard/           # Flashcard-related components
│   ├── study/               # Study mode components
│   ├── quiz/                # Quiz mode components
│   ├── stats/               # Statistics and charts
│   └── media/               # Image/audio upload components
├── lib/                     # Utility libraries
│   ├── prisma.ts            # Prisma client
│   ├── auth.ts              # Authentication utilities
│   ├── spacedRepetition.ts  # SM-2 algorithm
│   └── validators.ts        # Zod validation schemas
├── hooks/                   # Custom React hooks
├── store/                   # Zustand state stores
├── types/                   # TypeScript type definitions
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration files
├── public/                  # Static assets
│   └── uploads/             # Uploaded media (gitignored)
├── styles/                  # Global styles
├── middleware.ts            # Next.js middleware (auth)
├── docker-compose.yml       # PostgreSQL setup
└── next.config.js           # Next.js configuration
```

## Database Schema

The application uses 9 PostgreSQL tables:

- **User**: User accounts and authentication
- **Category**: Flashcard organization (subjects)
- **Flashcard**: Questions, answers, and multimedia
- **ReviewSchedule**: SM-2 algorithm state (ease factor, interval, next review)
- **ReviewHistory**: Audit log of all review sessions
- **QuizSession**: Quiz metadata (score, duration)
- **QuizAnswer**: Individual quiz question results
- **StudyStreak**: Current and longest study streaks
- **DailyStat**: Aggregated daily metrics for analytics

## Key Features Explained

### Spaced Repetition (SM-2 Algorithm)

The app uses the SM-2 (SuperMemo 2) algorithm to optimize learning:

- **Quality Ratings (0-5)**:
  - 5: Perfect recall
  - 4: Correct after hesitation
  - 3: Correct with difficulty
  - 2: Incorrect but familiar
  - 1: Incorrect, vaguely familiar
  - 0: Complete blackout

- **Scheduling Logic**:
  - Cards answered correctly (quality ≥ 3) get longer intervals
  - Cards answered incorrectly (quality < 3) reset to 1 day
  - Ease factor adjusts based on performance (1.3 to 2.5+)
  - Typical intervals: 1 day → 6 days → 2 weeks → 1 month → etc.

### Study Mode

- View cards due for review (scheduled by SM-2)
- Flip cards to reveal answers
- Rate your recall quality (0-5)
- Track session progress
- Keyboard shortcuts for efficiency

### Quiz Mode

- Generate quizzes from specific categories
- Self-graded or input-based answers
- See detailed results and accuracy
- Review quiz history

### Progress Tracking

- **Dashboard**: Key metrics at a glance (streak, due cards, accuracy)
- **Charts**: Visual trends over time (Recharts)
- **Streaks**: Track consecutive days of studying
- **Statistics**: Per-category performance breakdown

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format

# Database commands
npx prisma studio          # Open Prisma Studio (DB GUI)
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Create and apply migrations
npx prisma db push         # Push schema without migrations
npx prisma db seed         # Seed database
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client after schema changes
npx prisma generate
```

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma`
2. **API Routes**: Add routes in `app/api/`
3. **Components**: Create components in `components/`
4. **Pages**: Add pages in `app/(dashboard)/`
5. **Types**: Define types in `types/`

## API Routes

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Flashcards
- `GET /api/flashcards` - List flashcards (with filters)
- `POST /api/flashcards` - Create flashcard
- `GET /api/flashcards/[id]` - Get single flashcard
- `PUT /api/flashcards/[id]` - Update flashcard
- `DELETE /api/flashcards/[id]` - Delete flashcard

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Study/Review
- `GET /api/reviews/due` - Get cards due for review
- `POST /api/reviews` - Submit review (updates SM-2 schedule)
- `GET /api/reviews/history` - Review history

### Quizzes
- `POST /api/quizzes` - Start quiz
- `POST /api/quizzes/[id]/answer` - Submit answer
- `POST /api/quizzes/[id]/complete` - Complete quiz
- `GET /api/quizzes/history` - Quiz history

### Statistics
- `GET /api/stats/dashboard` - Dashboard stats
- `GET /api/stats/daily` - Daily statistics
- `GET /api/stats/streaks` - Streak information

### Media
- `POST /api/media/upload` - Upload image/audio
- `GET /api/media/[filename]` - Serve media file
- `DELETE /api/media/[filename]` - Delete media file

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL` (from Railway/Supabase)
   - `JWT_SECRET`
   - `MAX_IMAGE_SIZE`
   - `MAX_AUDIO_SIZE`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)

4. **Deploy**
   - Vercel automatically deploys on every push to main

### Database (Railway/Supabase/Neon)

#### Option 1: Railway
1. Create account at [railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Copy DATABASE_URL to Vercel environment variables
4. Run migrations: `npx prisma migrate deploy`

#### Option 2: Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project with PostgreSQL
3. Copy connection string to DATABASE_URL
4. Run migrations: `npx prisma migrate deploy`

#### Option 3: Neon
1. Create account at [neon.tech](https://neon.tech)
2. Create new database
3. Copy connection string
4. Run migrations

## Environment Variables

### Development (.env.local)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flashcard_app"
JWT_SECRET="development_secret_change_in_production"
JWT_EXPIRES_IN="7d"
MAX_IMAGE_SIZE=5242880
MAX_AUDIO_SIZE=10485760
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BCRYPT_ROUNDS=10
```

### Production
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="super_secure_random_string_min_32_chars"
JWT_EXPIRES_IN="7d"
MAX_IMAGE_SIZE=5242880
MAX_AUDIO_SIZE=10485760
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
BCRYPT_ROUNDS=10
```

## Security Considerations

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for stateless authentication
- HTTP-only cookies (prevents XSS)
- Input validation with Zod
- File upload validation (type, size)
- SQL injection prevention (Prisma parameterized queries)
- Rate limiting (recommended for production)
- CORS configuration
- Environment variables for secrets

## Performance Optimizations

- **Database**: Indexed queries on user_id, next_review_date
- **Images**: Optimized with Sharp, Next.js Image component
- **Code Splitting**: Automatic with Next.js App Router
- **Caching**: TanStack Query for client-side caching
- **Server Components**: Reduce client-side JavaScript
- **Pagination**: Implemented for large lists

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# Restart PostgreSQL
docker-compose restart

# View PostgreSQL logs
docker-compose logs postgres

# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

### Prisma Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Push schema without migration
npx prisma db push

# View database in Prisma Studio
npx prisma studio
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Phase 1: Foundation ✅
- [x] Next.js setup
- [x] PostgreSQL + Prisma
- [x] Authentication (JWT)
- [x] Basic layout

### Phase 2: Core Features (In Progress)
- [ ] Flashcard CRUD
- [ ] Category management
- [ ] Search and filters

### Phase 3: Spaced Repetition
- [ ] SM-2 algorithm implementation
- [ ] Study mode with card flipping
- [ ] Review scheduling
- [ ] Streak tracking

### Phase 4: Quiz Mode
- [ ] Quiz generation
- [ ] Quiz taking interface
- [ ] Results and history

### Phase 5: Analytics
- [ ] Dashboard with statistics
- [ ] Charts and visualizations
- [ ] Progress tracking

### Phase 6: Multimedia
- [ ] Image upload
- [ ] Audio upload
- [ ] Media playback

### Phase 7: Polish
- [ ] Responsive design
- [ ] Keyboard shortcuts
- [ ] Performance optimization
- [ ] Production deployment

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- **SM-2 Algorithm**: Based on SuperMemo 2 by Piotr Wozniak
- **Next.js**: React framework by Vercel
- **Prisma**: Modern database toolkit
- **Recharts**: Composable charting library

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 14, Prisma, and PostgreSQL
