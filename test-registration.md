# Email Verification Test Plan

## Test Steps

### 1. Register a new user
- Navigate to http://localhost:3001/register
- Fill in:
  - Username: testuser123
  - Email: test+verification@example.com
  - Password: TestPass123!
- Check "I agree to terms"
- Click "Create account"

### Expected Flow:
1. **Registration succeeds**
   - Console: "AuthContext: Registration successful"
   - Toast: "Account created! Check your email to confirm your account."

2. **Redirect to verify-email**
   - URL changes to `/verify-email`
   - Page shows: "Check Your Email"
   - Email address displayed: test+verification@example.com
   - Console: "AuthContext: Registration complete, redirecting to verify-email"

3. **Middleware allows access**
   - Console: "Middleware: Checking route { pathname: '/verify-email', user_exists: false }"
   - No redirect loop

4. **Page functionality**
   - "Open Gmail" button works
   - "Resend Verification Email" button works
   - "I've Verified My Email" button works

### 2. Click verification link in email
- Check email for verification link
- Click link (should include `?type=signup&code=...`)

### Expected Flow:
1. **Callback route processes**
   - URL: `/auth/callback?type=signup&code=...`
   - Console: Callback route logs
   - Code exchanged for session

2. **Redirect to verify-email with success flag**
   - URL: `/verify-email?verified=1`
   - Toast: "🎉 You're verified!"
   - Auto-redirect to `/interests` after 2s

3. **Access interests page**
   - URL: `/interests`
   - User now has verified session
   - Can access protected routes

### 3. Test resend verification
- Before verifying, click "Resend Verification Email"
- Check new email arrives
- Link should work same as original

## Potential Issues to Check

1. **AuthContext user state after registration**
   - Does AuthContext maintain user even without session?
   - Is there a race condition between setUser() and router.push()?

2. **Middleware blocking**
   - Does middleware allow unauthenticated access to /verify-email?
   - Does it create redirect loops?

3. **Supabase session**
   - Is session only created after email verification?
   - Does getUser() return user before verification?

4. **Email links**
   - Do they include `?type=signup`?
   - Do they point to correct callback URL?
