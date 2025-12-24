# Frontend Framework Documentation

## Overview

The Flashcard App frontend is built with **Next.js 14** using the App Router architecture, React Server Components, and TypeScript. This document covers the frontend framework decisions, patterns, and best practices.

## Next.js 14 App Router

### Why Next.js 14?

**Advantages:**
- ✅ **Server & Client Components**: Optimal rendering strategy per component
- ✅ **Built-in API Routes**: No separate backend server needed
- ✅ **File-based Routing**: Intuitive project structure
- ✅ **Automatic Code Splitting**: Better performance out of the box
- ✅ **Image Optimization**: Next.js Image component
- ✅ **TypeScript Support**: First-class TypeScript integration
- ✅ **Deployment**: Optimized for Vercel (instant deployment)

### Project Structure

```
app/
├── (auth)/                    # Route group (no URL segment)
│   ├── login/
│   │   └── page.tsx          # /login
│   └── register/
│       └── page.tsx          # /register
│
├── (dashboard)/               # Protected routes group
│   ├── layout.tsx            # Shared dashboard layout
│   ├── page.tsx              # /dashboard (home)
│   ├── flashcards/
│   │   ├── page.tsx          # /flashcards (list)
│   │   ├── new/
│   │   │   └── page.tsx      # /flashcards/new
│   │   └── [id]/
│   │       └── page.tsx      # /flashcards/:id (edit)
│   ├── categories/
│   │   └── page.tsx          # /categories
│   ├── study/
│   │   └── page.tsx          # /study
│   ├── quiz/
│   │   └── page.tsx          # /quiz
│   └── stats/
│       └── page.tsx          # /stats
│
├── api/                       # API Routes (Backend)
│   ├── auth/
│   │   ├── register/
│   │   │   └── route.ts      # POST /api/auth/register
│   │   ├── login/
│   │   │   └── route.ts      # POST /api/auth/login
│   │   └── me/
│   │       └── route.ts      # GET /api/auth/me
│   ├── flashcards/
│   │   ├── route.ts          # GET, POST /api/flashcards
│   │   └── [id]/
│   │       └── route.ts      # GET, PUT, DELETE /api/flashcards/:id
│   └── ...
│
├── layout.tsx                 # Root layout (global providers)
└── page.tsx                   # Landing page (/)
```

### Route Groups

**Purpose**: Organize routes without affecting URL structure

```typescript
// (auth) and (dashboard) are route groups
// They don't appear in the URL
(auth)/login     → /login
(dashboard)/study → /study
```

**Benefits**:
- Separate layouts for auth vs dashboard
- Clear separation of concerns
- Easy to add middleware per group

## Component Architecture

### Server vs Client Components

#### Server Components (Default)
```typescript
// app/(dashboard)/page.tsx
// No "use client" directive = Server Component

export default async function DashboardPage() {
  // Can directly query database
  const stats = await getStats();

  return <StatsDisplay stats={stats} />;
}
```

**Use Server Components for:**
- ✅ Static content
- ✅ Data fetching
- ✅ SEO-critical pages
- ✅ Reducing JavaScript bundle size

#### Client Components
```typescript
// components/flashcard/flashcard-form.tsx
"use client"; // Explicitly opt into client-side

import { useState } from 'react';

export default function FlashcardForm() {
  const [question, setQuestion] = useState('');

  return (
    <form onSubmit={handleSubmit}>
      {/* Interactive form */}
    </form>
  );
}
```

**Use Client Components for:**
- ✅ Interactivity (onClick, onChange)
- ✅ State management (useState, useReducer)
- ✅ Effects (useEffect)
- ✅ Browser APIs (localStorage, geolocation)
- ✅ Custom hooks

### Component Organization

```
components/
├── ui/                        # Reusable UI primitives
│   ├── button.tsx            # <Button> component
│   ├── card.tsx              # <Card> component
│   ├── modal.tsx             # <Modal> component
│   ├── input.tsx             # <Input> component
│   └── loading-spinner.tsx   # <LoadingSpinner>
│
├── flashcard/                 # Flashcard-specific components
│   ├── flashcard-form.tsx    # Create/edit form
│   ├── flashcard-list.tsx    # List view
│   ├── flashcard-item.tsx    # Single card display
│   └── flashcard-flip.tsx    # Flip animation
│
├── study/                     # Study mode components
│   ├── study-card.tsx        # Card with flip animation
│   ├── study-controls.tsx    # Next/previous buttons
│   └── difficulty-rating.tsx # Quality rating (0-5)
│
├── quiz/                      # Quiz components
│   ├── quiz-card.tsx         # Question display
│   ├── quiz-results.tsx      # Results summary
│   └── quiz-settings.tsx     # Quiz configuration
│
├── stats/                     # Statistics components
│   ├── progress-chart.tsx    # Recharts wrapper
│   ├── streak-counter.tsx    # Streak display
│   └── stats-card.tsx        # Metric card
│
├── media/                     # Media handling
│   ├── image-upload.tsx      # Image upload + preview
│   ├── audio-upload.tsx      # Audio upload
│   └── audio-player.tsx      # Howler.js player
│
└── layout/                    # Layout components
    ├── header.tsx            # Top navigation
    ├── sidebar.tsx           # Side navigation
    └── footer.tsx            # Footer
```

## State Management

### 1. Zustand (Client State)

**Purpose**: Local UI state that doesn't need server synchronization

```typescript
// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

**Usage:**
```typescript
import { useAuthStore } from '@/store/authStore';

function Header() {
  const { user, logout } = useAuthStore();

  return (
    <div>
      <span>Welcome, {user?.username}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Use Zustand for:**
- ✅ Authentication state
- ✅ UI state (modals, drawers, theme)
- ✅ Study session state (current card index)
- ✅ Quiz state (current question, timer)

### 2. TanStack Query (Server State)

**Purpose**: Server data fetching, caching, and synchronization

```typescript
// hooks/useFlashcards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useFlashcards(categoryId?: number) {
  return useQuery({
    queryKey: ['flashcards', categoryId],
    queryFn: () => fetchFlashcards(categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFlashcard,
    onSuccess: () => {
      // Invalidate and refetch flashcards
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
}
```

**Usage:**
```typescript
function FlashcardList() {
  const { data: flashcards, isLoading } = useFlashcards();
  const createMutation = useCreateFlashcard();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {flashcards.map(card => <FlashcardItem key={card.id} {...card} />)}
    </div>
  );
}
```

**Use TanStack Query for:**
- ✅ Fetching flashcards, categories, reviews
- ✅ Automatic caching and background refetching
- ✅ Optimistic updates
- ✅ Loading and error states

### State Management Decision Matrix

| State Type | Tool | Example |
|------------|------|---------|
| Server data (CRUD) | TanStack Query | Flashcards, categories, quiz results |
| Authentication | Zustand | Current user, login status |
| UI state | Zustand | Modal open/close, theme |
| Form state | React Hook Form | Input values, validation |
| Ephemeral state | useState | Hover, focus, temporary flags |

## Styling with Tailwind CSS

### Why Tailwind?

- ✅ **Utility-first**: Rapid prototyping
- ✅ **No CSS files**: Styles colocated with components
- ✅ **Purging**: Unused styles removed in production
- ✅ **Responsive**: Mobile-first breakpoints
- ✅ **Customizable**: Easy to extend via config

### Configuration

```typescript
// tailwind.config.ts
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',   // Indigo
        secondary: '#0ea5e9', // Sky blue
      },
    },
  },
  plugins: [],
};
```

### Component Styling Pattern

```typescript
// components/ui/button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "font-semibold rounded-lg transition";

  const variantStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Forms & Validation

### React Hook Form + Zod

**Why this combination?**
- ✅ **Performance**: Minimal re-renders
- ✅ **Type Safety**: Zod schemas inferred to TypeScript
- ✅ **Validation**: Unified schema for frontend + backend
- ✅ **DX**: Great developer experience

### Example: Flashcard Form

```typescript
// lib/validators.ts
import { z } from 'zod';

export const flashcardSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500),
  answer: z.string().min(1, 'Answer is required').max(1000),
  hint: z.string().max(200).optional(),
  categoryId: z.number().int().positive().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  tags: z.array(z.string()).default([]),
});

export type FlashcardInput = z.infer<typeof flashcardSchema>;
```

```typescript
// components/flashcard/flashcard-form.tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { flashcardSchema, FlashcardInput } from '@/lib/validators';

export function FlashcardForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FlashcardInput>({
    resolver: zodResolver(flashcardSchema),
  });

  const onSubmit = async (data: FlashcardInput) => {
    await createFlashcard(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Question</label>
        <input {...register('question')} />
        {errors.question && <span>{errors.question.message}</span>}
      </div>

      <div>
        <label>Answer</label>
        <textarea {...register('answer')} />
        {errors.answer && <span>{errors.answer.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Flashcard'}
      </button>
    </form>
  );
}
```

## Data Visualization

### Recharts

**Why Recharts?**
- ✅ **React-first**: Built for React
- ✅ **Composable**: Build complex charts from simple components
- ✅ **Responsive**: Adapts to container size
- ✅ **Customizable**: Full control over styling

### Example: Progress Chart

```typescript
// components/stats/progress-chart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  data: Array<{ date: string; cardsReviewed: number }>;
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="cardsReviewed"
          stroke="#4f46e5"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

## Media Handling

### Image Upload (react-dropzone)

```typescript
// components/media/image-upload.tsx
"use client";

import { useDropzone } from 'react-dropzone';

export function ImageUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <p>Drag & drop an image, or click to select</p>
      )}
    </div>
  );
}
```

### Audio Playback (Howler.js)

```typescript
// components/media/audio-player.tsx
"use client";

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

export function AudioPlayer({ url }: { url: string }) {
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({ src: [url] });
    return () => soundRef.current?.unload();
  }, [url]);

  const play = () => soundRef.current?.play();
  const pause = () => soundRef.current?.pause();

  return (
    <div>
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </div>
  );
}
```

## Performance Optimization

### Code Splitting

```typescript
// app/(dashboard)/stats/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy chart component
const ProgressChart = dynamic(() => import('@/components/stats/progress-chart'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable SSR for this component
});

export default function StatsPage() {
  return (
    <div>
      <h1>Statistics</h1>
      <ProgressChart data={data} />
    </div>
  );
}
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/flashcard-image.jpg"
  alt="Flashcard"
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

## Error Handling

### Error Boundaries

```typescript
// app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Loading States

```typescript
// app/(dashboard)/loading.tsx
export default function Loading() {
  return <LoadingSpinner />;
}
```

## Best Practices

### 1. Component Composition
✅ **Do**: Break down into small, reusable components
❌ **Don't**: Create monolithic components

### 2. Type Safety
✅ **Do**: Define proper TypeScript interfaces
❌ **Don't**: Use `any` type

### 3. Server Components First
✅ **Do**: Use Server Components by default
❌ **Don't**: Add "use client" unnecessarily

### 4. Proper Data Fetching
✅ **Do**: Use TanStack Query for client-side fetching
❌ **Don't**: Fetch in useEffect without caching

### 5. Accessibility
✅ **Do**: Add ARIA labels, keyboard navigation
❌ **Don't**: Ignore accessibility

## Testing Strategy

### Unit Tests (Jest + React Testing Library)
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Integration Tests
- Test API routes with Supertest
- Test form submissions end-to-end

### E2E Tests (Playwright - Future)
- Test critical user flows (study session, quiz)

## Conclusion

The frontend architecture prioritizes:
- ✅ **Performance**: Server Components, code splitting, caching
- ✅ **Developer Experience**: TypeScript, clear patterns, great tooling
- ✅ **Maintainability**: Component organization, separation of concerns
- ✅ **Scalability**: Easy to add new features, clear data flow
