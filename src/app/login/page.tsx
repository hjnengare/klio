"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

// Import shared components
import { authStyles } from "../components/Auth/Shared/authStyles";
import { AuthHeader } from "../components/Auth/Shared/AuthHeader";
import { EmailInput } from "../components/Auth/Shared/EmailInput";
import { PasswordInput } from "../components/Auth/Shared/PasswordInput";
import { SocialLoginButtons } from "../components/Auth/Shared/SocialLoginButtons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isLoading: authLoading, error: authError } = useAuth();
  const { showToast } = useToast();
  const containerRef = useRef(null);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailError = () => {
    if (!emailTouched) return "";
    if (!email) return "Email is required";
    if (!validateEmail(email)) return "Please enter a valid email address";
    return "";
  };

  const getPasswordError = () => {
    if (!passwordTouched) return "";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Mark fields as touched for validation
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      showToast("Please fill in all fields", 'sage', 3000);
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      showToast("Please enter a valid email address", 'sage', 3000);
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        showToast("Welcome back! Redirecting...", 'success', 2000);
      } else {
        const errorMsg = authError || "Invalid email or password";
        setError(errorMsg);
        showToast(errorMsg, 'sage', 4000);
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Login failed';
      setError(errorMsg);
      showToast(errorMsg, 'sage', 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: authStyles }} />
      <div ref={containerRef} className="min-h-[100dvh] bg-off-white flex flex-col relative overflow-hidden ios-inertia hide-scrollbar safe-area-full">

        <AuthHeader
          backLink="/onboarding"
          title="Welcome back"
          subtitle="Sign in to continue discovering sayso"
        />

        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative z-10 flex-1 flex flex-col justify-center py-8 sm:py-12 px-4">
          {/* Form Card */}
          <div className="relative bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-lg overflow-hidden border border-white/50 backdrop-blur-md ring-1 ring-white/20 p-6 sm:p-8 md:p-10">

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="font-urbanist text-[14px] font-600 text-red-600">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <EmailInput
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  if (!emailTouched) setEmailTouched(true);
                }}
                onBlur={() => setEmailTouched(true)}
                error={getEmailError()}
                touched={emailTouched}
                disabled={isSubmitting}
              />

              {/* Password Input */}
              <PasswordInput
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  if (!passwordTouched) setPasswordTouched(true);
                }}
                onBlur={() => setPasswordTouched(true)}
                disabled={isSubmitting}
                placeholder="Enter your password"
                showStrength={false}
                touched={passwordTouched}
              />

              {/* Forgot password link */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-white hover:text-coral transition-colors duration-300 font-medium underline decoration-white/50"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <div className="pt-2 flex justify-center">
                <div className="w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting || !email || !password}
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                    className={`group block w-full text-base font-semibold py-3 px-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 relative overflow-hidden text-center min-h-[48px] whitespace-nowrap transform hover:scale-105 active:scale-95 ${
                      isSubmitting || !email || !password
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                        : 'btn-premium text-white focus:ring-sage/30'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      )}
                      {isSubmitting ? "Signing in..." : "Sign in"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </button>
                </div>
              </div>

              {/* Social Login */}
              <SocialLoginButtons />
            </form>

            {/* Footer */}
            <div className="text-center mt-6 pt-6 border-t border-white/20">
              <div className="text-sm sm:text-base text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-white font-semibold hover:text-coral transition-colors duration-300 relative group underline decoration-white/50"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
