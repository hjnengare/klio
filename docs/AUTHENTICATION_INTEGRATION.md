# Authentication Integration Guide

## Overview

This document outlines the Supabase authentication integration for the KLIO application, including rate limiting, security features, and implementation details.

## Architecture

### Components

1. **Supabase Client** (`src/app/lib/supabase/client.ts`)
   - Browser-side Supabase client initialization
   - Uses environment variables for configuration

2. **Authentication Service** (`src/app/lib/auth.ts`)
   - Core authentication logic (sign up, sign in, sign out)
   - Password validation and security checks
   - Error handling with user-friendly messages
   - Integration with rate limiting

3. **Rate Limiting** (`src/app/lib/rateLimiting.ts`)
   - Prevents brute force attacks
   - Tracks failed login/registration attempts
   - Implements account lockout after max attempts

4. **Auth Context** (`src/app/contexts/AuthContext.tsx`)
   - React context for authentication state
   - Provides auth functions to components
   - Handles auth state persistence and routing

5. **Database Migration** (`supabase/migrations/20250119_auth_rate_limiting.sql`)
   - Creates rate limiting tables
   - Sets up session tracking
   - Configures RLS policies

## Database Schema

### Tables

#### `auth_rate_limits`
Tracks authentication attempts for rate limiting:
```sql
- id: uuid (primary key)
- identifier: text (email or IP)
- attempt_type: text ('login', 'register', 'password_reset')
- attempts: int (default 1)
- last_attempt: timestamptz
- locked_until: timestamptz (nullable)
- created_at: timestamptz
```

**Indexes:**
- `auth_rate_limits_identifier_idx` on (identifier, attempt_type)
- `auth_rate_limits_locked_until_idx` on (locked_until)

#### `user_sessions`
Tracks active user sessions for security monitoring:
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key to auth.users)
- session_id: text
- ip_address: inet
- user_agent: text
- last_active: timestamptz
- created_at: timestamptz
```

**Indexes:**
- `user_sessions_user_id_idx` on (user_id)
- `user_sessions_session_id_idx` on (session_id)
- `user_sessions_last_active_idx` on (last_active DESC)

## Rate Limiting Configuration

### Settings
- **Max Attempts:** 5 failed attempts
- **Attempt Window:** 1 hour (attempts reset after this period)
- **Lockout Duration:** 15 minutes after max attempts exceeded

### How It Works

1. **Check Rate Limit:** Before each auth attempt, the system checks if the email has exceeded rate limits
2. **Track Attempts:** Each failed attempt is recorded in `auth_rate_limits` table
3. **Account Lock:** After 5 failed attempts within 1 hour, the account is locked for 15 minutes
4. **Reset on Success:** Successful authentication resets the attempt counter
5. **Auto-Cleanup:** Old rate limit records are automatically cleaned up after 24 hours

### Rate Limit Flow

```
User Attempts Login
    ↓
Check Rate Limit
    ↓
├─ Locked? → Return error with time remaining
├─ Max Attempts? → Lock account for 15 minutes
└─ Allowed → Increment counter & proceed
    ↓
Authenticate with Supabase
    ↓
├─ Success → Reset rate limit counter
└─ Failure → Keep incremented counter
```

## Authentication Flows

### Registration Flow

```typescript
// User submits registration form
const { user, error } = await AuthService.signUp({
  email: 'user@example.com',
  password: 'SecurePass123'
});

// Flow:
// 1. Validate email format
// 2. Validate password strength (8+ chars, uppercase, lowercase, number)
// 3. Check rate limiting (max 5 attempts per hour)
// 4. Create user in Supabase Auth
// 5. Profile created automatically by database trigger
// 6. Reset rate limit counter on success
// 7. Redirect to interests page
```

### Login Flow

```typescript
// User submits login form
const { user, error } = await AuthService.signIn({
  email: 'user@example.com',
  password: 'SecurePass123'
});

// Flow:
// 1. Validate email and password presence
// 2. Check rate limiting (max 5 attempts per hour)
// 3. Authenticate with Supabase
// 4. Fetch user profile
// 5. Reset rate limit counter on success
// 6. Redirect based on onboarding status
```

### Logout Flow

```typescript
// User clicks logout
await AuthService.signOut();

// Flow:
// 1. Sign out from Supabase
// 2. Clear local auth state
// 3. Redirect to onboarding page
```

## Password Requirements

- **Minimum Length:** 8 characters
- **Required Characters:**
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)

**Regex:** `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/`

## Error Handling

The system provides user-friendly error messages for common scenarios:

| Error Type | User Message | Error Code |
|------------|-------------|------------|
| User already exists | "This email address is already taken. Try logging in instead." | `user_exists` |
| Invalid credentials | "Invalid email or password. Please check your credentials." | `invalid_credentials` |
| Email not confirmed | "Please check your email and click the confirmation link." | `email_not_confirmed` |
| Rate limited | "Too many attempts. Please wait a moment and try again." | `rate_limit` |
| Network error | "Connection issue. Please check your internet and try again." | `network_error` |

## Security Features

### 1. **Rate Limiting**
- Prevents brute force attacks
- Protects against credential stuffing
- Email-based tracking (can be extended to include IP)

### 2. **Password Strength Validation**
- Enforces strong password requirements
- Validates on both client and server
- Provides real-time feedback to users

### 3. **Secure Session Management**
- HTTP-only cookies for session tokens
- Automatic session refresh
- Session tracking in database

### 4. **Row-Level Security (RLS)**
- Users can only access their own data
- Enforced at database level
- Prevents unauthorized access

### 5. **Email Normalization**
- All emails converted to lowercase
- Trimmed whitespace
- Consistent identifier tracking

## Environment Variables

Required environment variables in `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Usage in Components

### Register Page

```tsx
import { useAuth } from '@/app/contexts/AuthContext';

function RegisterPage() {
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await register(email, password);
    if (success) {
      // User is automatically redirected
    }
  };

  return (/* form JSX */);
}
```

### Login Page

```tsx
import { useAuth } from '@/app/contexts/AuthContext';

function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      // User is automatically redirected
    }
  };

  return (/* form JSX */);
}
```

### Protected Routes

```tsx
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

function ProtectedPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!user) return null;

  return <YourProtectedContent />;
}
```

## Migration Setup

To set up the authentication database tables:

1. **Navigate to Supabase Dashboard:**
   - Go to your project in https://app.supabase.com
   - Navigate to SQL Editor

2. **Run the Migration:**
   - Copy the contents of `supabase/migrations/20250119_auth_rate_limiting.sql`
   - Paste into SQL Editor
   - Click "Run" to execute

3. **Verify Tables:**
   ```sql
   -- Check tables were created
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('auth_rate_limits', 'user_sessions');

   -- Check RLS is enabled
   SELECT tablename, rowsecurity FROM pg_tables
   WHERE schemaname = 'public'
   AND tablename IN ('auth_rate_limits', 'user_sessions');
   ```

## Testing

### Test Rate Limiting

```typescript
// Simulate multiple failed login attempts
for (let i = 0; i < 6; i++) {
  const result = await AuthService.signIn({
    email: 'test@example.com',
    password: 'wrong-password'
  });
  console.log(`Attempt ${i + 1}:`, result.error?.message);
}
// Expected: First 5 attempts show "Invalid credentials"
// 6th attempt shows rate limit error with lockout message
```

### Test Password Validation

```typescript
const testPasswords = [
  'short',           // Too short
  'alllowercase1',   // No uppercase
  'ALLUPPERCASE1',   // No lowercase
  'NoNumbers',       // No numbers
  'ValidPass123'     // Valid
];

for (const password of testPasswords) {
  const result = await AuthService.signUp({
    email: 'test@example.com',
    password
  });
  console.log(`Password "${password}":`, result.error?.message || 'Valid');
}
```

## Troubleshooting

### Common Issues

1. **"User already registered" error on signup**
   - Check if user exists in Supabase Auth dashboard
   - Verify email is correctly formatted
   - Try logging in instead

2. **Rate limit not working**
   - Verify migration was run successfully
   - Check `auth_rate_limits` table exists
   - Ensure RLS policies are created

3. **Sessions not persisting**
   - Check browser cookies are enabled
   - Verify environment variables are correct
   - Check Supabase Auth settings

4. **Profile not created on signup**
   - Verify database trigger exists
   - Check `profiles` table structure
   - Review Supabase logs for errors

## Best Practices

1. **Always use the AuthContext** - Don't call AuthService directly from components
2. **Handle loading states** - Show loading indicators while auth operations are in progress
3. **Provide clear error messages** - Use the built-in error handling for user feedback
4. **Test edge cases** - Test rate limiting, password requirements, and error scenarios
5. **Monitor auth attempts** - Regularly review `auth_rate_limits` for suspicious activity
6. **Keep credentials secure** - Never commit `.env` files or expose API keys

## Future Enhancements

- [ ] Add IP-based rate limiting alongside email-based
- [ ] Implement session monitoring dashboard
- [ ] Add two-factor authentication (2FA)
- [ ] Email verification for new signups
- [ ] Password reset functionality with rate limiting
- [ ] OAuth integration (Google, Apple)
- [ ] Suspicious activity alerts
- [ ] CAPTCHA integration after failed attempts

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review migration file for schema details
3. Check browser console for detailed error messages
4. Review Supabase dashboard logs for backend errors
