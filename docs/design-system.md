# Design System

This document outlines the design system for the Flashcard App, including color schemes, typography, component patterns, and UI/UX guidelines.

## Design Principles

### 1. **Clarity**
- Clear visual hierarchy
- Obvious call-to-actions
- Intuitive navigation
- Meaningful feedback for user actions

### 2. **Consistency**
- Unified component library
- Consistent spacing and sizing
- Predictable interactions
- Standard patterns across features

### 3. **Efficiency**
- Fast loading times
- Minimal clicks to complete tasks
- Keyboard shortcuts for power users
- Smart defaults

### 4. **Accessibility**
- WCAG 2.1 AA compliance
- Sufficient color contrast
- Keyboard navigation
- Screen reader support

### 5. **Delight**
- Smooth animations
- Satisfying interactions
- Encouraging progress feedback
- Gamification elements (streaks, achievements)

## Color Palette

### Primary Colors

```css
/* Primary - Indigo (Focus, Learning) */
--primary-50:  #eef2ff;
--primary-100: #e0e7ff;
--primary-200: #c7d2fe;
--primary-300: #a5b4fc;
--primary-400: #818cf8;
--primary-500: #6366f1;  /* Main primary */
--primary-600: #4f46e5;
--primary-700: #4338ca;
--primary-800: #3730a3;
--primary-900: #312e81;

/* Secondary - Sky Blue (Success, Progress) */
--secondary-50:  #f0f9ff;
--secondary-100: #e0f2fe;
--secondary-200: #bae6fd;
--secondary-300: #7dd3fc;
--secondary-400: #38bdf8;
--secondary-500: #0ea5e9;  /* Main secondary */
--secondary-600: #0284c7;
--secondary-700: #0369a1;
--secondary-800: #075985;
--secondary-900: #0c4a6e;
```

### Semantic Colors

```css
/* Success - Green */
--success-light: #d1fae5;
--success: #10b981;
--success-dark: #065f46;

/* Warning - Amber */
--warning-light: #fef3c7;
--warning: #f59e0b;
--warning-dark: #92400e;

/* Error - Red */
--error-light: #fee2e2;
--error: #ef4444;
--error-dark: #991b1b;

/* Info - Blue */
--info-light: #dbeafe;
--info: #3b82f6;
--info-dark: #1e3a8a;
```

### Neutral Colors

```css
/* Grays */
--gray-50:  #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Black & White */
--black: #000000;
--white: #ffffff;
```

### Usage Guidelines

| Color | Usage |
|-------|-------|
| **Primary (Indigo)** | Primary buttons, links, active states, focus indicators |
| **Secondary (Sky Blue)** | Secondary buttons, info badges, progress indicators |
| **Success (Green)** | Success messages, correct answers, completed tasks |
| **Warning (Amber)** | Warnings, partially correct answers, low streaks |
| **Error (Red)** | Error messages, incorrect answers, destructive actions |
| **Gray** | Text, borders, backgrounds, disabled states |

## Typography

### Font Family

```css
/* Primary Font */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;

/* Monospace (Code) */
font-family: 'Courier New', Courier, monospace;
```

### Font Scale

```css
/* Headings */
.text-h1 { font-size: 3rem;    /* 48px */ line-height: 1.2; font-weight: 700; }
.text-h2 { font-size: 2.25rem; /* 36px */ line-height: 1.3; font-weight: 700; }
.text-h3 { font-size: 1.875rem;/* 30px */ line-height: 1.3; font-weight: 600; }
.text-h4 { font-size: 1.5rem;  /* 24px */ line-height: 1.4; font-weight: 600; }
.text-h5 { font-size: 1.25rem; /* 20px */ line-height: 1.4; font-weight: 600; }
.text-h6 { font-size: 1.125rem;/* 18px */ line-height: 1.4; font-weight: 600; }

/* Body */
.text-xl  { font-size: 1.25rem; /* 20px */ line-height: 1.5; }
.text-lg  { font-size: 1.125rem;/* 18px */ line-height: 1.5; }
.text-base{ font-size: 1rem;    /* 16px */ line-height: 1.5; }
.text-sm  { font-size: 0.875rem;/* 14px */ line-height: 1.5; }
.text-xs  { font-size: 0.75rem; /* 12px */ line-height: 1.5; }
```

### Font Weights

```css
.font-normal    { font-weight: 400; } /* Body text */
.font-medium    { font-weight: 500; } /* Emphasized text */
.font-semibold  { font-weight: 600; } /* Subheadings */
.font-bold      { font-weight: 700; } /* Headings, important text */
```

## Spacing System

### Scale (Tailwind-based)

```css
/* 0.25rem = 4px */
.space-1  { 0.25rem }   /* 4px */
.space-2  { 0.5rem }    /* 8px */
.space-3  { 0.75rem }   /* 12px */
.space-4  { 1rem }      /* 16px */
.space-5  { 1.25rem }   /* 20px */
.space-6  { 1.5rem }    /* 24px */
.space-8  { 2rem }      /* 32px */
.space-10 { 2.5rem }    /* 40px */
.space-12 { 3rem }      /* 48px */
.space-16 { 4rem }      /* 64px */
.space-20 { 5rem }      /* 80px */
.space-24 { 6rem }      /* 96px */
```

### Spacing Guidelines

| Element | Spacing |
|---------|---------|
| **Component Padding** | 16px (space-4) or 24px (space-6) |
| **Card Padding** | 20px (space-5) or 24px (space-6) |
| **Section Spacing** | 32px (space-8) or 48px (space-12) |
| **Form Field Gap** | 16px (space-4) |
| **Button Padding** | 12px 20px (space-3 space-5) |
| **Modal Padding** | 24px (space-6) |

## Component Library

### Buttons

#### Primary Button
```html
<button class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
  Create Flashcard
</button>
```

**States:**
- Default: `bg-indigo-600`
- Hover: `bg-indigo-700`
- Active: `bg-indigo-800`
- Disabled: `bg-gray-300 cursor-not-allowed`
- Focus: `ring-2 ring-indigo-500 ring-offset-2`

#### Secondary Button
```html
<button class="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition">
  Cancel
</button>
```

#### Ghost Button
```html
<button class="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition">
  View Details
</button>
```

#### Icon Button
```html
<button class="p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition">
  <svg class="w-5 h-5">...</svg>
</button>
```

### Cards

#### Base Card
```html
<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <!-- Card content -->
</div>
```

#### Interactive Card (Hover Effect)
```html
<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition cursor-pointer">
  <!-- Card content -->
</div>
```

#### Flashcard Component
```html
<div class="relative w-full h-64 perspective-1000">
  <div class="flip-card-inner">
    <!-- Front: Question -->
    <div class="flip-card-front bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
      <h2 class="text-2xl font-semibold text-center">Question Text</h2>
    </div>
    <!-- Back: Answer -->
    <div class="flip-card-back bg-indigo-50 rounded-lg shadow-lg p-8 flex items-center justify-center">
      <h2 class="text-2xl font-semibold text-center text-indigo-900">Answer Text</h2>
    </div>
  </div>
</div>
```

### Forms

#### Text Input
```html
<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    Question
  </label>
  <input
    type="text"
    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    placeholder="Enter your question"
  />
  <p class="text-sm text-red-600">Error message here</p>
</div>
```

#### Textarea
```html
<textarea
  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
  rows="4"
  placeholder="Enter your answer"
></textarea>
```

#### Select Dropdown
```html
<select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
  <option>Select category...</option>
  <option>Math</option>
  <option>Science</option>
</select>
```

### Badges

```html
<!-- Success Badge -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  Correct
</span>

<!-- Error Badge -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
  Incorrect
</span>

<!-- Info Badge -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
  Due Today
</span>

<!-- Neutral Badge -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
  Medium
</span>
```

### Modals

```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Modal Title</h3>
      <button class="p-1 text-gray-400 hover:text-gray-600">
        <svg class="w-5 h-5"><!-- Close icon --></svg>
      </button>
    </div>

    <!-- Body -->
    <div class="text-gray-600">
      Modal content goes here
    </div>

    <!-- Footer -->
    <div class="flex gap-3 justify-end">
      <button class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
        Cancel
      </button>
      <button class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Alerts

```html
<!-- Success Alert -->
<div class="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
  <svg class="w-5 h-5 text-green-600"><!-- Check icon --></svg>
  <div class="flex-1">
    <h4 class="font-medium text-green-900">Success!</h4>
    <p class="text-sm text-green-700">Flashcard created successfully.</p>
  </div>
</div>

<!-- Error Alert -->
<div class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
  <svg class="w-5 h-5 text-red-600"><!-- X icon --></svg>
  <div class="flex-1">
    <h4 class="font-medium text-red-900">Error</h4>
    <p class="text-sm text-red-700">Something went wrong. Please try again.</p>
  </div>
</div>
```

### Loading States

```html
<!-- Spinner -->
<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>

<!-- Skeleton Loader -->
<div class="animate-pulse space-y-4">
  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
  <div class="h-4 bg-gray-200 rounded w-full"></div>
  <div class="h-4 bg-gray-200 rounded w-5/6"></div>
</div>

<!-- Progress Bar -->
<div class="w-full bg-gray-200 rounded-full h-2">
  <div class="bg-indigo-600 h-2 rounded-full transition-all" style="width: 60%"></div>
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
│          │                                       │
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
│   ← Previous    Skip    Next →                 │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Quiz Mode Layout

```
┌─────────────────────────────────────────────────┐
│ Quiz: Category Name │ Time: 05:32 │ Q: 3/10    │
├─────────────────────────────────────────────────┤
│                                                  │
│  Question 3:                                    │
│  What is the capital of France?                │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Your Answer:                              │  │
│  │ [                                    ]   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  or                                             │
│                                                  │
│  [ ] Paris                                      │
│  [ ] London                                     │
│  [ ] Berlin                                     │
│  [ ] Madrid                                     │
│                                                  │
│  [Submit Answer]                                │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Animations

### Transitions

```css
/* Default transition */
transition: all 0.2s ease-in-out;

/* Hover effects */
.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Flashcard Flip Animation

```css
.flip-card {
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}
```

## Icons

### Icon Library
Use **Heroicons** (MIT licensed, designed for Tailwind)
- Outline version for navigation, actions
- Solid version for emphasis, filled states

### Common Icons
- **Study**: 📚 Book icon
- **Quiz**: 📝 Document icon
- **Stats**: 📊 Chart icon
- **Flashcard**: 🃏 Card icon
- **Streak**: 🔥 Fire icon
- **Success**: ✓ Check icon
- **Error**: ✗ X icon
- **Info**: ℹ️ Info icon
- **Warning**: ⚠️ Warning icon

## Responsive Breakpoints

```css
/* Mobile First */
/* Default: < 640px (mobile) */

/* Small tablets */
@media (min-width: 640px) { /* sm */ }

/* Tablets */
@media (min-width: 768px) { /* md */ }

/* Small laptops */
@media (min-width: 1024px) { /* lg */ }

/* Desktops */
@media (min-width: 1280px) { /* xl */ }

/* Large desktops */
@media (min-width: 1536px) { /* 2xl */ }
```

## Accessibility Guidelines

### Color Contrast
- **Normal text**: 4.5:1 minimum
- **Large text (18px+)**: 3:1 minimum
- **Interactive elements**: 3:1 minimum

### Focus States
```css
/* Always visible focus indicator */
.focus-visible:focus {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}
```

### ARIA Labels
```html
<button aria-label="Close modal">
  <svg><!-- X icon --></svg>
</button>

<div role="alert" aria-live="polite">
  Flashcard saved successfully!
</div>
```

### Keyboard Navigation
- **Tab**: Move focus forward
- **Shift+Tab**: Move focus backward
- **Enter/Space**: Activate button/link
- **Escape**: Close modal/menu
- **Arrow keys**: Navigate lists

## Dark Mode (Future Enhancement)

```css
/* Light mode (default) */
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1f2937;
    --text-primary: #f9fafb;
  }
}
```

## Design Checklist

### Component Design
- [ ] Matches design system colors
- [ ] Uses spacing scale consistently
- [ ] Has hover, focus, active, disabled states
- [ ] Includes loading state
- [ ] Includes error state
- [ ] Responsive on all breakpoints
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Sufficient color contrast

### Page Design
- [ ] Clear visual hierarchy
- [ ] Consistent navigation
- [ ] Breadcrumbs (if needed)
- [ ] Loading indicators for async operations
- [ ] Empty states handled
- [ ] Error boundaries in place
- [ ] Mobile-optimized layout

## Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Heroicons**: https://heroicons.com
- **Color Palette Tool**: https://coolors.co
- **Contrast Checker**: https://webaim.org/resources/contrastchecker
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref
