# Large File Problem - Mitigation Strategy

## Problem Statement

We have **20+ files over 400 lines** with some reaching **700+ lines**, causing:
- Large bundle sizes (slower page loads)
- Poor code maintainability
- Difficult testing
- Slow development velocity
- Poor code reusability

## Root Causes

1. **Monolithic Components** - Everything in one file
2. **Inline Styles** - 100+ lines of CSS in JS
3. **Duplicated Logic** - Same code in multiple files
4. **No Component Library** - Rebuilding UI elements each time
5. **Complex State Management** - Business logic mixed with UI

## Solution Architecture

### 1. **Component Extraction Pattern** (What We Did for Auth Pages)

```
Before: register/page.tsx (851 lines)
After:  register/page.tsx (365 lines) + 8 shared components

Result: 57% reduction, reusable components
```

**Pattern:**
1. Extract inline styles → shared file
2. Identify repeated UI patterns → reusable components
3. Split business logic → custom hooks
4. Create component hierarchy
5. Use composition over inheritance

### 2. **Atomic Design System**

Create a hierarchy of components:

```
Atoms (Basic building blocks)
└── Button.tsx
└── Input.tsx
└── Icon.tsx
└── Text.tsx

Molecules (Simple combinations)
└── FormField.tsx (Input + Label + Error)
└── SearchBar.tsx (Input + Icon + Button)
└── Card.tsx (Container + Header + Body)

Organisms (Complex sections)
└── ProfileHeader.tsx (Avatar + Stats + Actions)
└── ReviewCard.tsx (User + Rating + Content + Actions)
└── BusinessCard.tsx (Image + Info + Actions)

Templates (Page layouts)
└── ProfileLayout.tsx
└── FeedLayout.tsx

Pages (Final composition)
└── profile/page.tsx (uses all above)
```

### 3. **Code Splitting Strategies**

#### A. Route-Based Splitting (Built-in Next.js)
```typescript
// Already works - each page is a separate chunk
import ProfilePage from './profile/page'
```

#### B. Component-Based Splitting
```typescript
// Lazy load heavy components
const ReviewForm = dynamic(() => import('./ReviewForm'), {
  loading: () => <LoadingSkeleton />
})
```

#### C. Library Splitting
```typescript
// Split heavy libraries
const Chart = dynamic(() => import('./Chart'), {
  ssr: false // Don't load on server
})
```

## Implementation Plan

### Phase 1: Foundation (Week 1) - **START HERE**

#### Step 1: Create Component Library Structure
```
src/components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Input/
│   ├── Icon/
│   └── Text/
├── molecules/
│   ├── FormField/
│   ├── SearchBar/
│   └── Card/
├── organisms/
│   ├── ProfileHeader/
│   ├── ReviewCard/
│   └── BusinessCard/
└── templates/
    ├── ProfileLayout/
    └── FeedLayout/
```

#### Step 2: Extract Common Styles
```typescript
// src/styles/shared/
├── animations.ts    // All keyframes
├── colors.ts        // Color palette
├── typography.ts    // Text styles
├── spacing.ts       // Margins, paddings
└── effects.ts       // Shadows, borders
```

#### Step 3: Create Shared Hooks
```typescript
// src/hooks/shared/
├── useFormValidation.ts
├── useInfiniteScroll.ts
├── useDebounce.ts
└── useMediaQuery.ts
```

### Phase 2: Refactor High-Impact Pages (Week 2)

#### Priority Order:
1. **Profile Page** (703 lines → ~300 lines)
   - Most visited page
   - High complexity
   - Creates reusable components for other pages

2. **Business Detail Page** (524 lines → ~250 lines)
   - Core functionality
   - High traffic
   - Similar patterns to other pages

3. **Business Review Page** (583 lines → ~280 lines)
   - Critical user action
   - Complex form
   - Reusable form components

### Phase 3: UI Component Library (Week 3)

Refactor large UI files by splitting them:

**MobileOptimized.tsx (670 lines) →**
```
components/mobile/
├── TouchTarget.tsx (100 lines)
├── SwipeGestures.tsx (150 lines)
├── PullToRefresh.tsx (120 lines)
└── InfiniteScroll.tsx (180 lines)
```

### Phase 4: Hooks & Utilities (Week 4)

Split large hooks into focused hooks:

**useStateManagement.ts (544 lines) →**
```
hooks/state/
├── useFormState.ts (120 lines)
├── useListState.ts (100 lines)
├── useToggleState.ts (80 lines)
└── useCounterState.ts (90 lines)
```

## Specific Mitigation Techniques

### Technique 1: Extract Inline Styles

**Before:**
```typescript
const styles = `
  /* 200 lines of CSS */
`

export default function Component() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {/* component JSX */}
    </>
  )
}
```

**After:**
```typescript
// styles/componentStyles.ts
export const componentStyles = `/* styles */`

// Component.tsx
import { componentStyles } from '@/styles/componentStyles'
// 200 lines saved
```

### Technique 2: Extract Repeated UI Patterns

**Before:**
```typescript
// Repeated in 10 files
<div className="flex items-center gap-2">
  <UserIcon className="w-5 h-5" />
  <span>{user.name}</span>
</div>
```

**After:**
```typescript
// components/atoms/UserDisplay.tsx
export function UserDisplay({ user }) {
  return (
    <div className="flex items-center gap-2">
      <UserIcon className="w-5 h-5" />
      <span>{user.name}</span>
    </div>
  )
}

// Usage (saves ~10 lines per usage × 10 files = 100 lines)
<UserDisplay user={user} />
```

### Technique 3: Custom Hooks for Logic

**Before:**
```typescript
function Component() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)

  const validateEmail = (email: string) => {
    // validation logic
  }

  const handleEmailChange = (value: string) => {
    // change logic
  }

  // 50 lines of email handling logic
}
```

**After:**
```typescript
// hooks/useEmailInput.ts
export function useEmailInput() {
  // All email logic here
  return { email, emailError, handleChange, validate }
}

// Component.tsx (saves ~50 lines)
function Component() {
  const { email, emailError, handleChange } = useEmailInput()
}
```

### Technique 4: Dynamic Imports

**Before:**
```typescript
import HeavyComponent from './HeavyComponent' // Loaded immediately
```

**After:**
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false // Optional: don't render on server
})
// Only loaded when needed
```

### Technique 5: Compound Components

**Before:**
```typescript
function ReviewCard({ review, showActions, showAvatar, layout }) {
  // 200 lines handling all variations
}
```

**After:**
```typescript
// ReviewCard compound component
function ReviewCard({ children }) {
  return <div>{children}</div>
}

ReviewCard.Header = function({ user }) { /* ... */ }
ReviewCard.Content = function({ text }) { /* ... */ }
ReviewCard.Actions = function({ onLike }) { /* ... */ }

// Usage - compose what you need
<ReviewCard>
  <ReviewCard.Header user={user} />
  <ReviewCard.Content text={text} />
  <ReviewCard.Actions onLike={handleLike} />
</ReviewCard>
```

## Metrics & Monitoring

### Before (Current State)
```
Total lines: ~35,000
Largest file: 703 lines
Average page size: 450 lines
Bundle size: Unknown (need to measure)
```

### Target (After Refactoring)
```
Total lines: ~28,000 (20% reduction via reuse)
Largest file: <350 lines
Average page size: <250 lines
Bundle size: 30-40% reduction
Component reuse: 60%+
```

### Track Progress
```bash
# Count lines in pages
find src/app -name "*.tsx" -path "*/page.tsx" | xargs wc -l

# Find files over 400 lines
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | awk '$1 > 400'

# Check bundle sizes (after build)
npm run build
# Check .next/static/chunks/pages/*.js sizes
```

## Quick Start: Refactor Profile Page Now

Let's start with the **Profile Page** as it's the highest priority:

### Step 1: Analyze Structure
```bash
# Read the file
cat src/app/profile/page.tsx | wc -l  # 703 lines

# Identify sections:
# - Header (avatar, stats) → ProfileHeader.tsx
# - Activity Feed → ActivityFeed.tsx
# - Review List → ReviewList.tsx
# - Settings Menu → SettingsMenu.tsx
```

### Step 2: Extract Components
```
Create:
1. components/profile/ProfileHeader.tsx (80 lines)
2. components/profile/ProfileStats.tsx (60 lines)
3. components/profile/ActivityFeed.tsx (120 lines)
4. components/profile/ReviewList.tsx (100 lines)
5. components/profile/SettingsMenu.tsx (80 lines)
6. hooks/useProfileData.ts (60 lines)
```

### Step 3: Refactor Page
```typescript
// profile/page.tsx (now ~200 lines)
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileStats from '@/components/profile/ProfileStats'
import ActivityFeed from '@/components/profile/ActivityFeed'
import ReviewList from '@/components/profile/ReviewList'
import SettingsMenu from '@/components/profile/SettingsMenu'
import { useProfileData } from '@/hooks/useProfileData'

export default function ProfilePage() {
  const { profile, loading } = useProfileData()

  return (
    <div>
      <ProfileHeader user={profile.user} />
      <ProfileStats stats={profile.stats} />
      <ActivityFeed activities={profile.activities} />
      <ReviewList reviews={profile.reviews} />
      <SettingsMenu />
    </div>
  )
}
```

**Result:** 703 lines → ~200 lines (72% reduction)

## Tools & Automation

### 1. Bundle Analyzer
```bash
npm install -D @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // config
})
```

```bash
# Analyze bundle
ANALYZE=true npm run build
```

### 2. ESLint Rules
```javascript
// .eslintrc.js
rules: {
  'max-lines': ['warn', { max: 350 }],
  'max-lines-per-function': ['warn', { max: 50 }],
}
```

### 3. Pre-commit Hook
```bash
# .husky/pre-commit
# Warn about files over 400 lines
find src -name "*.tsx" | xargs wc -l | awk '$1 > 400 { print "⚠️  Large file:", $2, $1, "lines" }'
```

## Success Criteria

✅ No files over 400 lines
✅ Average file size under 250 lines
✅ 30%+ bundle size reduction
✅ 60%+ component reuse
✅ All pages load in <2s
✅ Lighthouse score >90

## Next Action: START NOW

Shall I proceed with:
1. **Creating the component library structure**
2. **Refactoring the Profile Page** (highest priority)
3. **Setting up bundle analyzer** (to measure impact)

Which would you like me to tackle first?
