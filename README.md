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

Comprehensive documentation is available in the [`/docs`](./docs) folder:

- **[Architecture](./docs/architecture.md)** - System design, database schema, security, scalability
- **[Frontend Framework](./docs/frontend-framework.md)** - Next.js patterns, component architecture, state management
- **[Sequence Diagrams](./docs/sequence-diagrams.md)** - User flows and system interactions (Mermaid)
- **[Use Case Diagrams](./docs/use-case-diagrams.md)** - Feature interactions and scenarios (Mermaid)
- **[Design System](./docs/design-system.md)** - UI/UX guidelines, colors, typography, components

👉 [**Start here: Documentation Index**](./docs/README.md)

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
