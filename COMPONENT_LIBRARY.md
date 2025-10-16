# KLIO Component Library

## Overview

This document describes the component library structure following Atomic Design principles. The library provides reusable, composable components that ensure consistency across the application while reducing code duplication and bundle size.

## Architecture

The component library follows the Atomic Design methodology:

```
src/
├── components/
│   ├── atoms/           # Smallest building blocks
│   ├── molecules/       # Combinations of atoms
│   ├── organisms/       # Complex UI sections
│   └── templates/       # Page-level layouts
└── styles/
    └── shared/          # Design tokens and utilities
```

## Design Tokens

All components use centralized design tokens from `src/styles/shared/`:

- **colors.ts** - Brand colors, semantic colors, text colors
- **typography.ts** - Font families, sizes, weights, line heights
- **spacing.ts** - Spacing scale and common patterns
- **animations.ts** - Timing functions, durations, keyframes
- **effects.ts** - Shadows, borders, gradients, blur

## Atoms

### Button

Flexible button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/atoms';

// Primary button
<Button variant="primary" size="md">
  Click me
</Button>

// With icons and loading state
<Button
  variant="outline"
  leftIcon={<IconUser />}
  isLoading={isSubmitting}
  onClick={handleClick}
>
  Save Profile
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `fullWidth`: boolean
- `leftIcon`, `rightIcon`: React.ReactNode
- All standard button HTML attributes

### Input

Text input with validation states and icons.

```tsx
import { Input } from '@/components/atoms';

// Basic input
<Input
  placeholder="Enter your email"
  type="email"
/>

// With label and error
<Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  leftIcon={<IconMail />}
/>
```

**Props:**
- `variant`: 'default' | 'error' | 'success'
- `inputSize`: 'sm' | 'md' | 'lg'
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`, `rightIcon`: React.ReactNode
- `fullWidth`: boolean

### Text

Typography component with semantic variants.

```tsx
import { Text } from '@/components/atoms';

// Headings
<Text variant="h1" color="primary">
  Welcome to KLIO
</Text>

// Body text
<Text variant="body" color="secondary">
  This is a paragraph of text.
</Text>

// Custom element
<Text variant="h2" as="h1" color="sage">
  Custom heading
</Text>
```

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-lg' | 'body' | 'body-sm' | 'caption' | 'label'
- `color`: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'sage' | 'coral' | 'white' | 'error' | 'success'
- `align`: 'left' | 'center' | 'right'
- `as`: HTML element to render

### Icon

SVG icon wrapper with common icons included.

```tsx
import { Icon, IconUser, IconSearch, IconHeart } from '@/components/atoms';

// Using predefined icons
<IconUser size="md" color="sage" />
<IconSearch size="lg" />

// Custom SVG
<Icon size="md" color="coral">
  <path d="..." />
</Icon>
```

**Included Icons:**
- IconChevronRight, IconChevronLeft, IconChevronDown
- IconCheck, IconX
- IconSearch, IconUser, IconMail
- IconHeart, IconStar

**Props:**
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'current' | 'sage' | 'coral' | 'charcoal' | 'white' | 'gray'

### Avatar

User avatar with automatic fallback to initials.

```tsx
import { Avatar } from '@/components/atoms';

// With image
<Avatar
  src={user.avatar_url}
  alt={user.name}
  size="lg"
/>

// With fallback initials
<Avatar
  size="md"
  fallback={user.name}
/>
```

**Props:**
- `src`: string | null
- `alt`: string
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `fallback`: string (for generating initials)

### Badge

Small status or category indicator.

```tsx
import { Badge } from '@/components/atoms';

// Basic badge
<Badge variant="sage">Premium</Badge>

// With dot indicator
<Badge variant="success" dot>
  Active
</Badge>
```

**Props:**
- `variant`: 'sage' | 'coral' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
- `size`: 'sm' | 'md' | 'lg'
- `dot`: boolean (shows colored dot)

## Molecules

### FormField

Input with label, description, and validation.

```tsx
import { FormField } from '@/components/molecules';

<FormField
  label="Email Address"
  description="We'll never share your email"
  required
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

**Props:**
- All Input props
- `label`: string (required)
- `required`: boolean
- `description`: string

### Card

Flexible container with variants and composition.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/molecules';

// Simple card
<Card variant="default" padding="md">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Composed card
<Card variant="premium" hoverable>
  <CardHeader>
    <Text variant="h4">Profile Settings</Text>
  </CardHeader>
  <CardBody>
    <p>Card body content</p>
  </CardBody>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>

// Clickable card
<Card clickable onClick={() => navigate('/details')}>
  <Text variant="h5">Click me</Text>
</Card>
```

**Props:**
- `variant`: 'default' | 'glass' | 'premium' | 'bordered'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `hoverable`: boolean
- `clickable`: boolean
- `onClick`: () => void

### SearchBar

Search input with clear functionality.

```tsx
import { SearchBar } from '@/components/molecules';

// Controlled
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={(query) => performSearch(query)}
  placeholder="Search businesses..."
/>

// Uncontrolled
<SearchBar
  onSearch={(query) => performSearch(query)}
  onClear={() => resetSearch()}
/>
```

**Props:**
- `value`: string (controlled)
- `onChange`: (value: string) => void
- `onSearch`: (value: string) => void (called on Enter)
- `onClear`: () => void
- `placeholder`: string

### UserCard

Display user information with avatar and optional badge.

```tsx
import { UserCard } from '@/components/molecules';

<UserCard
  avatarUrl={user.avatar_url}
  name={user.name}
  username={user.username}
  bio={user.bio}
  badge={{
    label: 'Premium',
    variant: 'sage'
  }}
  onClick={() => navigate(`/profile/${user.id}`)}
/>
```

**Props:**
- `avatarUrl`: string | null
- `name`: string
- `username`: string
- `bio`: string
- `badge`: { label: string, variant?: BadgeVariant }
- `avatarSize`: AvatarSize
- `onClick`: () => void

## Usage Guidelines

### Import Patterns

```tsx
// Import from atoms/molecules index
import { Button, Input, Text } from '@/components/atoms';
import { Card, FormField } from '@/components/molecules';

// Import design tokens
import { colors } from '@/styles/shared/colors';
import { typography } from '@/styles/shared/typography';
```

### Styling

**DO:**
- Use Tailwind utility classes for layout and spacing
- Use component props for variants and sizes
- Extend with `className` prop when needed

```tsx
<Button variant="primary" size="lg" className="mt-4">
  Submit
</Button>
```

**DON'T:**
- Override component internal styles
- Create duplicate variants

### Composition

Build complex UIs by composing smaller components:

```tsx
<Card variant="premium" padding="lg">
  <div className="flex items-center gap-4 mb-6">
    <Avatar src={user.avatar_url} size="xl" />
    <div>
      <Text variant="h3">{user.name}</Text>
      <Text variant="body" color="secondary">@{user.username}</Text>
    </div>
  </div>

  <FormField
    label="Bio"
    value={bio}
    onChange={(e) => setBio(e.target.value)}
  />

  <div className="flex gap-3 mt-6">
    <Button variant="primary" fullWidth>Save</Button>
    <Button variant="outline">Cancel</Button>
  </div>
</Card>
```

## Mobile-First Design

All components are mobile-first:
- Minimum input size: 48px (prevents iOS zoom)
- Responsive text sizes with breakpoints
- Touch-friendly spacing and targets
- Safe area support for notches

## Accessibility

Components include:
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus states and outlines
- Screen reader friendly text

## Performance

Benefits of using this component library:
- **Code splitting**: Import only what you need
- **Bundle size reduction**: Shared components reduce duplication
- **Consistent styling**: Less CSS bloat
- **Tree shaking**: Unused components are excluded from builds

## Migration Guide

To migrate existing pages to use the component library:

1. **Identify reusable patterns** in your page
2. **Replace with atoms** where possible (buttons, inputs, text)
3. **Compose molecules** for common patterns (forms, cards)
4. **Extract organisms** for complex sections
5. **Measure impact** with bundle analyzer

Example migration:

```tsx
// Before (inline styles)
<button className="px-6 py-3 bg-sage text-white rounded-full font-semibold hover:bg-sage-dark">
  Click me
</button>

// After (component library)
<Button variant="primary">Click me</Button>
```

## Next Steps

1. Create **organism** components for complex sections
2. Build **templates** for common page layouts
3. Refactor high-impact pages (Profile, Business pages)
4. Set up Storybook for component documentation
5. Add unit tests for critical components

## Support

For questions or suggestions about the component library, refer to:
- This documentation
- Component TypeScript definitions
- Example implementations in `/src/app/components/Auth/`
