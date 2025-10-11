// AUTH BACKEND DISABLED - Middleware commented out for now
// Uncomment when you want to enable Supabase authentication

import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Passthrough - no authentication checks
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

/* ORIGINAL AUTH MIDDLEWARE - COMMENTED OUT

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - require authentication
  const protectedRoutes = ['/home', '/profile', '/reviews', '/write-review', '/leaderboard'];
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Onboarding routes - require authentication
  const onboardingRoutes = ['/interests', '/subcategories'];
  const isOnboardingRoute = onboardingRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Auth routes - redirect to home if already logged in
  const authRoutes = ['/login', '/register', '/onboarding'];
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes
  if ((isProtectedRoute || isOnboardingRoute) && !user) {
    const redirectUrl = new URL('/onboarding', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users from auth pages
  if (isAuthRoute && user) {
    // Check if onboarding is complete
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_step')
        .eq('user_id', user.id)
        .single();

      if (profile?.onboarding_step === 'complete') {
        return NextResponse.redirect(new URL('/home', request.url));
      } else {
        // Redirect to appropriate onboarding step
        const step = profile?.onboarding_step || 'interests';
        if (!request.nextUrl.pathname.startsWith(`/${step}`)) {
          return NextResponse.redirect(new URL(`/${step}`, request.url));
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  }

  return response;
}

END ORIGINAL AUTH MIDDLEWARE */

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
