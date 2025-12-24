# Sequence Diagrams

This document contains sequence diagrams for key user flows in the Flashcard App. Diagrams are written in Mermaid syntax and can be rendered in GitHub, VSCode (with Mermaid extension), or any Mermaid-compatible viewer.

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
    RegisterPage->>Browser: Render registration form

    User->>RegisterPage: Fill form (email, username, password)
    User->>RegisterPage: Click "Register"

    RegisterPage->>RegisterPage: Validate input (Zod)

    alt Validation fails
        RegisterPage->>User: Show validation errors
    else Validation passes
        RegisterPage->>API: POST /api/auth/register<br/>{email, username, password}

        API->>API: Validate request body (Zod)

        API->>DB: Check if email/username exists

        alt Email/username already exists
            DB-->>API: User found
            API-->>RegisterPage: 409 Conflict<br/>"User already exists"
            RegisterPage->>User: Show error message
        else User doesn't exist
            DB-->>API: No user found

            API->>Auth: hashPassword(password)
            Auth-->>API: passwordHash

            API->>DB: INSERT INTO users<br/>(email, username, passwordHash)
            DB-->>API: User created (ID, email, username)

            API->>Auth: signToken({userId, email, username})
            Auth-->>API: JWT token

            API->>API: Set HTTP-only cookie<br/>(auth-token: JWT)

            API-->>RegisterPage: 201 Created<br/>{user: {...}, token: "..."}
            RegisterPage->>Browser: Redirect to /dashboard
            Browser->>User: Show dashboard
        end
    end
```

## 2. User Login Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant LoginPage
    participant API as /api/auth/login
    participant Auth as lib/auth.ts
    participant DB as PostgreSQL

    User->>Browser: Navigate to /login
    Browser->>LoginPage: Load login page
    LoginPage->>Browser: Render login form

    User->>LoginPage: Enter email & password
    User->>LoginPage: Click "Login"

    LoginPage->>API: POST /api/auth/login<br/>{email, password}

    API->>DB: SELECT * FROM users<br/>WHERE email = ?

    alt User not found
        DB-->>API: No user found
        API-->>LoginPage: 401 Unauthorized<br/>"Invalid credentials"
        LoginPage->>User: Show error message
    else User found
        DB-->>API: User record (id, email, username, passwordHash)

        API->>Auth: verifyPassword(password, passwordHash)
        Auth-->>API: isValid: boolean

        alt Password invalid
            API-->>LoginPage: 401 Unauthorized<br/>"Invalid credentials"
            LoginPage->>User: Show error message
        else Password valid
            API->>Auth: signToken({userId, email, username})
            Auth-->>API: JWT token

            API->>API: Set HTTP-only cookie<br/>(auth-token: JWT)

            API->>DB: UPDATE users<br/>SET lastLogin = NOW()

            API-->>LoginPage: 200 OK<br/>{user: {...}}
            LoginPage->>Browser: Redirect to /dashboard
            Browser->>User: Show dashboard
        end
    end
```

## 3. Create Flashcard Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant FlashcardForm
    participant API as /api/flashcards
    participant DB as PostgreSQL
    participant Middleware

    User->>Browser: Navigate to /flashcards/new
    Browser->>Middleware: Check authentication

    alt Not authenticated
        Middleware->>Browser: Redirect to /login
    else Authenticated
        Middleware->>FlashcardForm: Load form
        FlashcardForm->>Browser: Render flashcard form

        User->>FlashcardForm: Fill form<br/>(question, answer, category, hint)
        User->>FlashcardForm: Click "Create"

        FlashcardForm->>FlashcardForm: Validate (React Hook Form + Zod)

        alt Validation fails
            FlashcardForm->>User: Show validation errors
        else Validation passes
            FlashcardForm->>API: POST /api/flashcards<br/>{question, answer, categoryId, hint}

            API->>API: Verify JWT from cookie
            API->>API: Extract userId from token

            API->>DB: INSERT INTO flashcards<br/>(userId, question, answer, ...)
            DB-->>API: Flashcard created (id, ...)

            Note over API,DB: Automatically create ReviewSchedule
            API->>DB: INSERT INTO review_schedule<br/>(userId, flashcardId, nextReviewDate=today)
            DB-->>API: ReviewSchedule created

            API-->>FlashcardForm: 201 Created<br/>{flashcard: {...}}

            FlashcardForm->>Browser: Redirect to /flashcards
            Browser->>User: Show flashcard list with new card
        end
    end
```

## 4. Study Session Flow (Spaced Repetition)

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant StudyPage
    participant DueAPI as /api/reviews/due
    participant ReviewAPI as /api/reviews
    participant SM2 as lib/spacedRepetition.ts
    participant DB as PostgreSQL

    User->>Browser: Navigate to /study
    Browser->>StudyPage: Load study page

    StudyPage->>DueAPI: GET /api/reviews/due

    DueAPI->>DueAPI: Verify JWT, extract userId

    DueAPI->>DB: SELECT flashcards, review_schedule<br/>WHERE userId = ? AND nextReviewDate <= TODAY
    DB-->>DueAPI: List of due flashcards with schedule

    DueAPI-->>StudyPage: 200 OK<br/>{dueCards: [...]}

    alt No due cards
        StudyPage->>User: "No cards due today! 🎉"
    else Has due cards
        StudyPage->>User: Show first flashcard (question)

        User->>StudyPage: Click "Show Answer"
        StudyPage->>User: Display answer with quality rating (0-5)

        User->>StudyPage: Select quality rating (e.g., 4)

        StudyPage->>ReviewAPI: POST /api/reviews<br/>{flashcardId, quality: 4, responseTime}

        ReviewAPI->>ReviewAPI: Verify JWT, extract userId

        ReviewAPI->>DB: SELECT review_schedule<br/>WHERE flashcardId = ? AND userId = ?
        DB-->>ReviewAPI: Current schedule<br/>(easeFactor, interval, repetitions)

        ReviewAPI->>SM2: calculateSM2(quality, repetitions, easeFactor, interval)

        Note over SM2: SM-2 Algorithm Logic:<br/>- quality >= 3: increase interval<br/>- quality < 3: reset to day 1<br/>- adjust easeFactor based on quality

        SM2-->>ReviewAPI: New schedule<br/>(easeFactor, interval, repetitions, nextReviewDate)

        ReviewAPI->>DB: UPDATE review_schedule<br/>SET easeFactor, interval, repetitions, nextReviewDate

        ReviewAPI->>DB: INSERT INTO review_history<br/>(userId, flashcardId, quality, easeFactorBefore, easeFactorAfter, ...)

        ReviewAPI->>DB: UPDATE OR INSERT daily_stats<br/>INCREMENT cardsReviewed, correctAnswers (if quality >= 3)

        ReviewAPI->>DB: UPDATE study_streak<br/>Check last_study_date, update currentStreak

        ReviewAPI-->>StudyPage: 200 OK<br/>{updatedSchedule: {...}}

        StudyPage->>User: Show next flashcard

        Note over User,StudyPage: Repeat until all due cards reviewed
    end
```

## 5. Quiz Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant QuizPage
    participant StartAPI as /api/quizzes
    participant AnswerAPI as /api/quizzes/:id/answer
    participant CompleteAPI as /api/quizzes/:id/complete
    participant DB as PostgreSQL

    User->>Browser: Navigate to /quiz
    Browser->>QuizPage: Load quiz page
    QuizPage->>User: Show quiz settings modal

    User->>QuizPage: Select category, number of questions
    User->>QuizPage: Click "Start Quiz"

    QuizPage->>StartAPI: POST /api/quizzes<br/>{categoryId, questionCount}

    StartAPI->>StartAPI: Verify JWT, extract userId

    StartAPI->>DB: SELECT flashcards<br/>WHERE categoryId = ? AND userId = ?<br/>ORDER BY RANDOM()<br/>LIMIT questionCount
    DB-->>StartAPI: Random flashcards for quiz

    StartAPI->>DB: INSERT INTO quiz_sessions<br/>(userId, categoryId, totalQuestions, startedAt)
    DB-->>StartAPI: QuizSession created (id)

    StartAPI-->>QuizPage: 201 Created<br/>{quizId, questions: [...]}

    QuizPage->>User: Show question 1

    loop For each question
        User->>QuizPage: Answer question (or self-grade)
        User->>QuizPage: Click "Submit Answer"

        QuizPage->>AnswerAPI: POST /api/quizzes/:id/answer<br/>{flashcardId, userAnswer, wasCorrect, timeTaken}

        AnswerAPI->>AnswerAPI: Verify JWT, extract userId

        AnswerAPI->>DB: INSERT INTO quiz_answers<br/>(quizSessionId, flashcardId, userAnswer, wasCorrect, ...)

        AnswerAPI->>DB: UPDATE quiz_sessions<br/>INCREMENT correctAnswers (if wasCorrect)

        AnswerAPI-->>QuizPage: 200 OK<br/>{isCorrect: true/false}

        alt More questions
            QuizPage->>User: Show next question
        else Last question
            QuizPage->>User: Show "Complete Quiz" button
        end
    end

    User->>QuizPage: Click "Complete Quiz"

    QuizPage->>CompleteAPI: POST /api/quizzes/:id/complete

    CompleteAPI->>DB: UPDATE quiz_sessions<br/>SET completedAt = NOW(), durationSeconds, scorePercentage

    CompleteAPI->>DB: SELECT quiz results
    DB-->>CompleteAPI: Final score, answers, stats

    CompleteAPI-->>QuizPage: 200 OK<br/>{score, totalQuestions, correctAnswers, ...}

    QuizPage->>User: Show quiz results with score
```

## 6. Dashboard Statistics Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Dashboard
    participant StatsAPI as /api/stats/dashboard
    participant DailyAPI as /api/stats/daily
    participant StreakAPI as /api/stats/streaks
    participant DB as PostgreSQL

    User->>Browser: Navigate to /dashboard
    Browser->>Dashboard: Load dashboard page

    par Parallel API Calls
        Dashboard->>StatsAPI: GET /api/stats/dashboard
        and
        Dashboard->>DailyAPI: GET /api/stats/daily?days=7
        and
        Dashboard->>StreakAPI: GET /api/stats/streaks
    end

    StatsAPI->>DB: SELECT COUNT(*) FROM review_schedule<br/>WHERE userId = ? AND nextReviewDate = TODAY
    DB-->>StatsAPI: cardsDueToday: 15

    StatsAPI->>DB: SELECT COUNT(*) FROM review_history<br/>WHERE userId = ? AND DATE(reviewedAt) = TODAY
    DB-->>StatsAPI: cardsStudiedToday: 10

    StatsAPI->>DB: SELECT AVG(quality) FROM review_history<br/>WHERE userId = ? AND reviewedAt >= LAST_7_DAYS
    DB-->>StatsAPI: averageAccuracy: 78%

    StatsAPI-->>Dashboard: {cardsDueToday, cardsStudiedToday, averageAccuracy}

    DailyAPI->>DB: SELECT * FROM daily_stats<br/>WHERE userId = ? AND date >= LAST_7_DAYS<br/>ORDER BY date
    DB-->>DailyAPI: Daily stats for last 7 days

    DailyAPI-->>Dashboard: {dailyStats: [...]}

    StreakAPI->>DB: SELECT * FROM study_streaks<br/>WHERE userId = ?
    DB-->>StreakAPI: {currentStreak, longestStreak, lastStudyDate}

    StreakAPI-->>Dashboard: {currentStreak: 5, longestStreak: 12}

    Dashboard->>Dashboard: Render stat cards and charts
    Dashboard->>User: Display dashboard with all metrics
```

## 7. Media Upload Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant UploadComponent as ImageUpload
    participant API as /api/media/upload
    participant Sharp as lib/media.ts
    participant FileSystem as /public/uploads
    participant DB as PostgreSQL

    User->>Browser: Navigate to flashcard form
    Browser->>UploadComponent: Render image upload component

    User->>UploadComponent: Drag & drop image or select file

    UploadComponent->>UploadComponent: Validate file<br/>(type: image/*, size <= 5MB)

    alt Invalid file
        UploadComponent->>User: Show error "Invalid file type or size"
    else Valid file
        UploadComponent->>UploadComponent: Show image preview

        User->>UploadComponent: Confirm upload

        UploadComponent->>API: POST /api/media/upload<br/>FormData: {file: image.jpg}

        API->>API: Verify JWT, extract userId

        API->>API: Validate file type and size

        API->>Sharp: Optimize image<br/>(resize to max 1200px, compress, convert to WebP)
        Sharp-->>API: Optimized image buffer

        API->>API: Generate unique filename<br/>(userId_timestamp_random.webp)

        API->>FileSystem: Write file to<br/>/public/uploads/images/userId/filename.webp
        FileSystem-->>API: File saved

        API->>API: Generate public URL<br/>(/uploads/images/userId/filename.webp)

        API-->>UploadComponent: 200 OK<br/>{url: "/uploads/images/..."}

        UploadComponent->>UploadComponent: Update form field with image URL

        Note over User,UploadComponent: When flashcard is saved, URL is stored in DB

        User->>UploadComponent: Submit flashcard form
        UploadComponent->>DB: Save flashcard with questionImageUrl
    end
```

## 8. Authentication Middleware Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Middleware as middleware.ts
    participant Auth as lib/auth.ts
    participant ProtectedPage as /dashboard
    participant LoginPage as /login

    User->>Browser: Request /dashboard
    Browser->>Middleware: Intercept request

    Middleware->>Middleware: Check if route is protected<br/>(starts with /dashboard, /study, /quiz)

    alt Public route (/, /login, /register)
        Middleware->>Browser: Allow request to proceed
    else Protected route
        Middleware->>Middleware: Get auth-token from cookies

        alt No token found
            Middleware->>Browser: Redirect to /login
            Browser->>LoginPage: Show login page
            LoginPage->>User: Please log in
        else Token found
            Middleware->>Auth: verifyToken(token)

            Auth->>Auth: JWT verification with secret

            alt Token invalid or expired
                Auth-->>Middleware: null
                Middleware->>Browser: Redirect to /login
                Browser->>LoginPage: Show login page
                LoginPage->>User: Session expired, please log in
            else Token valid
                Auth-->>Middleware: Decoded token {userId, email, username}

                Middleware->>Middleware: Add user to request context
                Middleware->>Browser: Allow request to proceed
                Browser->>ProtectedPage: Load dashboard
                ProtectedPage->>User: Show protected content
            end
        end
    end
```

## Notes

- All diagrams use **Mermaid** syntax
- To view diagrams:
  - GitHub: Renders automatically in `.md` files
  - VSCode: Install "Markdown Preview Mermaid Support" extension
  - Online: Copy to [mermaid.live](https://mermaid.live)

- Key patterns:
  - ✅ All API calls verify JWT authentication
  - ✅ Database operations extract userId from JWT
  - ✅ Validation happens both client-side (UX) and server-side (security)
  - ✅ Optimistic updates improve perceived performance
