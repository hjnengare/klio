"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../utils/hooks/usePrefersReducedMotion";

// Import Design System Components
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardContent,
  Heading,
  Text,
  Toast,
} from "../design-system";

export default function RegisterPageMigrated() {
  const prefersReduced = usePrefersReducedMotion();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { register, isLoading, error: authError } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // Offline detection
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Validation functions
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'username':
        if (!value) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        if (value.length > 20) return "Username must be less than 20 characters";
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) return "Username can only contain letters, numbers, and underscores";
        return "";

      case 'email':
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        return "";

      case 'password':
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters long";
        if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number";
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Real-time validation
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim()) &&
           Object.values(errors).every(error => !error) &&
           consent;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting || isLoading || !isFormValid()) return;

    setSubmitting(true);

    try {
      // Validate all fields
      const newErrors: Record<string, string> = {};
      Object.entries(formData).forEach(([field, value]) => {
        const error = validateField(field, value);
        if (error) newErrors[field] = error;
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        showToast("Please fix the errors in the form", 'error', 3000);
        return;
      }

      if (!isOnline) {
        showToast("You're offline. Please check your connection and try again.", 'error', 4000);
        return;
      }

      const success = await register(
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.username.trim()
      );

      if (success) {
        showToast("🎉 Welcome to blabbr! Your account has been created successfully!", 'success', 4000);
        setTimeout(() => {
          showToast("Let's personalize your experience! 🌟", 'info', 2000);
          router.replace("/interests?from=register");
        }, 1500);
      } else {
        if (authError?.includes('already registered')) {
          showToast('This email is already registered. Try logging in instead.', 'error', 4000);
        } else {
          showToast(authError || "Registration failed. Please try again.", 'error', 4000);
        }
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      showToast(errorMessage, 'error', 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col px-container-mobile sm:px-container-tablet md:px-container-desktop py-8 sm:py-12 pb-24 sm:pb-20 md:pb-16 relative overflow-hidden">

      {/* Lightweight decorative elements */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-sage/30 to-sage/80 rounded-full blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-32 right-16 w-56 h-56 bg-gradient-to-br from-coral/25 to-coral/80 rounded-full blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
        </div>
      )}

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20"
      >
        <Link
          href="/onboarding"
          className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-3 hover:bg-charcoal/5 rounded-full block"
        >
          <ion-icon name="arrow-back-outline" size="small"></ion-icon>
        </Link>
      </motion.div>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative z-10 flex-1 flex flex-col justify-center py-8 sm:py-12">

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading level={1} className="mb-4">
            Create your account
          </Heading>
          <Text size="md" color="secondary" className="max-w-lg mx-auto">
            Sign up and share your experiences!
          </Text>
        </motion.div>

        {/* Requirements Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Card variant="elevated" className="bg-sage/5 border border-sage/20 text-center">
            <CardContent className="p-4 sm:p-6">
              <Text size="sm" weight="semibold" color="sage" className="mb-2">
                Registration Requirements
              </Text>
              <Text size="xs" color="secondary">
                Username: 3-20 characters, letters, numbers, and underscores only<br/>
                Password must be at least 8 characters with uppercase, lowercase, and number
              </Text>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="elevated" className="bg-off-white/95 backdrop-blur-lg shadow-xl">
            <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12">

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Error Messages */}
                {authError && (
                  <Card variant="outlined" className="bg-error-50 border-error-200">
                    <CardContent className="p-4">
                      <Text size="sm" weight="semibold" color="error" className="text-center">
                        {authError}
                      </Text>
                    </CardContent>
                  </Card>
                )}

                {!isOnline && (
                  <Card variant="outlined" className="bg-warning-50 border-warning-200">
                    <CardContent className="p-4">
                      <Text size="sm" weight="semibold" color="warning" className="text-center">
                        You're offline. We'll try again when you're back online.
                      </Text>
                    </CardContent>
                  </Card>
                )}

                {/* Form Fields */}
                <Input
                  label="Username"
                  type="text"
                  placeholder="your_username"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  onBlur={handleBlur('username')}
                  error={touched.username ? errors.username : undefined}
                  success={touched.username && !errors.username && formData.username ? "Username looks good!" : undefined}
                  iconBefore={<ion-icon name="person-outline"></ion-icon>}
                  disabled={submitting || isLoading}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email ? errors.email : undefined}
                  success={touched.email && !errors.email && formData.email ? "Email looks good!" : undefined}
                  iconBefore={<ion-icon name="mail-outline"></ion-icon>}
                  disabled={submitting || isLoading}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password ? errors.password : undefined}
                  success={touched.password && !errors.password && formData.password ? "Strong password! 🎉" : undefined}
                  showPasswordToggle
                  disabled={submitting || isLoading}
                  required
                />

                {/* Terms consent */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 text-xs text-charcoal/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 border-gray-300 text-sage focus:ring-sage/30 focus:ring-offset-0"
                    />
                    <span className="flex-1 leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="underline text-sage hover:text-coral transition-colors">
                        Terms of Use
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="underline text-sage hover:text-coral transition-colors">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-6 sm:pt-8">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={submitting || isLoading}
                    loadingText="Creating account..."
                    disabled={!isFormValid() || submitting || isLoading}
                    premium
                    className="min-h-[44px]"
                  >
                    Create account
                  </Button>
                </div>

                {/* Progress indicators */}
                <div className="text-center space-y-2 pt-2">
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <div className={`flex items-center gap-1 ${formData.email && !errors.email ? 'text-sage' : 'text-gray-400'}`}>
                      <ion-icon name={formData.email && !errors.email ? "checkmark-circle" : "ellipse-outline"} style={{ fontSize: '14px' }}></ion-icon>
                      <span>Email</span>
                    </div>
                    <div className={`flex items-center gap-1 ${formData.password && !errors.password ? 'text-sage' : 'text-gray-400'}`}>
                      <ion-icon name={formData.password && !errors.password ? "checkmark-circle" : "ellipse-outline"} style={{ fontSize: '14px' }}></ion-icon>
                      <span>Strong Password</span>
                    </div>
                    <div className={`flex items-center gap-1 ${consent ? 'text-sage' : 'text-gray-400'}`}>
                      <ion-icon name={consent ? "checkmark-circle" : "ellipse-outline"} style={{ fontSize: '14px' }}></ion-icon>
                      <span>Terms</span>
                    </div>
                  </div>
                  <Text size="xs" color="secondary">
                    Next: pick your interests
                  </Text>
                </div>

                {/* Divider */}
                <div className="relative my-6 sm:my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-charcoal/20"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <Text size="sm" color="secondary" className="px-4 bg-off-white/90">
                      or continue with
                    </Text>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="min-h-[44px]"
                    iconBefore={
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    }
                  >
                    Google
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="min-h-[44px]"
                    iconBefore={
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    }
                  >
                    Facebook
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Login link */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Text size="sm" color="secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-sage hover:text-coral transition-colors font-medium underline">
              Sign in
            </Link>
          </Text>
        </motion.div>
      </div>
    </div>
  );
}