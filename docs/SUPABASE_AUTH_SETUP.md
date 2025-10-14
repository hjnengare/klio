# Supabase Authentication Setup Guide

## Overview
Your KLIO app is already configured with a comprehensive Supabase authentication system. This guide will help you complete the setup and test the authentication flow.

## ✅ What's Already Implemented

### 1. **Supabase Client Configuration**
- ✅ Client-side Supabase setup (`src/app/lib/supabase/client.ts`)
- ✅ Server-side Supabase setup (`src/app/lib/supabase/server.ts`)
- ✅ Database helper functions (`src/app/lib/supabase.ts`)

### 2. **Authentication Service**
- ✅ Complete AuthService class (`src/app/lib/auth.ts`)
- ✅ User registration with validation
- ✅ User login with error handling
- ✅ User logout functionality
- ✅ Current user retrieval
- ✅ Profile management

### 3. **React Context & Hooks**
- ✅ AuthContext with full state management (`src/app/contexts/AuthContext.tsx`)
- ✅ useAuth hook for components
- ✅ Automatic auth state persistence
- ✅ Real-time auth state changes

### 4. **Protected Routes**
- ✅ ProtectedRoute component (`src/app/components/ProtectedRoute/ProtectedRoute.tsx`)
- ✅ OnboardingGuard for step-by-step flow
- ✅ Public/Private route wrappers
- ✅ Automatic redirects based on auth state

### 5. **UI Components**
- ✅ Login page (`src/app/login/page.tsx`)
- ✅ Registration page (`src/app/register/page.tsx`)
- ✅ Form validation and error handling
- ✅ Loading states and user feedback

## 🔧 Setup Steps

### 1. **Environment Variables**
Create a `.env.local` file in your project root with your Supabase credentials:

```bash
# Copy the example file
cp env.example .env.local
```

Then update `.env.local` with your actual Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. **Supabase Database Setup**
Your app expects these database tables:

#### **profiles table**
```sql
CREATE TABLE profiles (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  onboarding_step TEXT DEFAULT 'interests',
  onboarding_complete BOOLEAN DEFAULT false,
  interests_count INTEGER DEFAULT 0,
  last_interests_updated TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Database Trigger for Profile Creation**
```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, onboarding_step, onboarding_complete)
  VALUES (NEW.id, 'interests', false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. **Row Level Security (RLS)**
Enable RLS on the profiles table:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

## 🧪 Testing the Authentication Flow

### 1. **Start the Development Server**
```bash
npm run dev
```

### 2. **Test Registration**
1. Navigate to `/register`
2. Fill out the registration form
3. Check that user is created in Supabase Auth
4. Verify profile is automatically created
5. Should redirect to `/interests`

### 3. **Test Login**
1. Navigate to `/login`
2. Use the credentials from registration
3. Should redirect to `/home` or onboarding step

### 4. **Test Protected Routes**
1. Try accessing `/home` without login (should redirect to login)
2. Login and verify access to protected routes
3. Test logout functionality

## 🔍 Key Features

### **Authentication Flow**
- **Registration**: Email/password → Profile creation → Onboarding
- **Login**: Email/password → Profile retrieval → Route based on onboarding status
- **Logout**: Clear session → Redirect to onboarding

### **Onboarding Integration**
- Automatic profile creation on signup
- Step-by-step onboarding flow
- Progress tracking and validation
- Seamless navigation between steps

### **Error Handling**
- User-friendly error messages
- Network error handling
- Validation errors
- Rate limiting protection

### **Security Features**
- Password strength validation
- Email format validation
- Row Level Security (RLS)
- Secure session management

## 🚀 Production Considerations

### **Environment Variables**
- Use production Supabase project for production
- Set up proper CORS settings
- Configure email templates for auth emails

### **Database Security**
- Review and test RLS policies
- Set up proper indexes for performance
- Monitor database usage

### **Performance**
- Implement proper caching strategies
- Use Supabase's built-in caching
- Monitor auth performance metrics

## 📱 Mobile Considerations

Your auth system is already optimized for mobile:
- Touch-friendly form inputs (16px+ font size)
- Proper keyboard handling
- Safe area support
- Responsive design

## 🔧 Troubleshooting

### **Common Issues**
1. **"Invalid login credentials"** - Check email/password, ensure user exists
2. **"User already registered"** - User exists, try login instead
3. **Profile not created** - Check database trigger is set up
4. **RLS errors** - Verify RLS policies are correct

### **Debug Steps**
1. Check browser console for errors
2. Verify environment variables are set
3. Test Supabase connection in dashboard
4. Check database logs for errors

## 📚 Next Steps

Once authentication is working:
1. Test the complete onboarding flow
2. Implement additional auth features (password reset, etc.)
3. Add social login providers if needed
4. Set up proper error monitoring
5. Implement user management features

Your Supabase authentication system is production-ready and follows best practices for security and user experience!
