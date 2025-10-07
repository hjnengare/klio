"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Lock, Eye, EyeOff, User as UserIcon, Circle, ShieldCheck, Users, Star } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { motion } from "framer-motion";
import FadeInUp from "../components/Animations/FadeInUp";
import PremiumHover from "../components/Animations/PremiumHover";
import { usePrefersReducedMotion } from "../utils/hooks/usePrefersReducedMotion";

// Mobile-first CSS with proper typography scale and safe areas
const styles = `
  /* Mobile-first typography scale - Body text ≥ 16px */
  .text-body { font-size: 1rem; line-height: 1.5; } /* 16px */
  .text-body-lg { font-size: 1.125rem; line-height: 1.5; } /* 18px */
  .text-heading-sm { font-size: 1.25rem; line-height: 1.4; } /* 20px */
  .text-heading-md { font-size: 1.5rem; line-height: 1.3; } /* 24px */
  .text-heading-lg { font-size: 1.875rem; line-height: 1.2; } /* 30px */

  /* iOS inertia scrolling and prevent double scroll */
  .ios-inertia {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    min-height: 0;
  }

  /* Hide scrollbar */
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Button press states - 44-48px targets */
  .btn-press:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .btn-target {
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
  }

  /* Premium button styling */
  .btn-premium {
    position: relative;
    background: linear-gradient(135deg, #7D9B76 0%, #6B8A64 100%);
    box-shadow:
      0 10px 40px rgba(125, 155, 118, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }

  .btn-premium:hover {
    transform: translateY(-2px);
    box-shadow:
      0 20px 60px rgba(125, 155, 118, 0.35),
      0 8px 24px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .btn-premium:active {
    transform: translateY(0);
  }

  /* Input styling - 16px+ to prevent auto-zoom */
  .input-mobile {
    font-size: 1rem !important; /* 16px minimum */
    min-height: 48px;
    touch-action: manipulation;
  }

  /* Premium card styling with gradient shadow */
  .card-premium {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(125, 155, 118, 0.1);
    box-shadow:
      0 8px 32px rgba(125, 155, 118, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.04);
    backdrop-filter: blur(10px);
  }

  /* Text truncation support */
  .text-truncate {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Full-screen pattern - respects notches */
  .full-screen {
    min-height: 100dvh;
    min-height: 100vh; /* fallback */
  }

  /* Safe area padding */
  .safe-area-full {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-top: max(1.5rem, env(safe-area-inset-top));
    padding-bottom: max(6rem, env(safe-area-inset-bottom));
  }

  /* Prevent layout jumps */
  .stable-layout {
    contain: layout style;
  }

  /* Fixed aspect ratios for images */
  .aspect-square { aspect-ratio: 1 / 1; }
  .aspect-video { aspect-ratio: 16 / 9; }
  .aspect-photo { aspect-ratio: 4 / 3; }

  /* Carousel patterns for mobile */
  @media (max-width: 768px) {
    .carousel-mobile {
      scroll-snap-type: x mandatory;
      overflow-x: auto;
      display: flex;
    }

    .carousel-item {
      scroll-snap-align: center;
      flex-shrink: 0;
    }
  }
`;

export default function RegisterPage() {
  const prefersReduced = usePrefersReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [consent, setConsent] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false
    }
  });

  const [mounted, setMounted] = useState(false);

  const { register, isLoading: authLoading, error: authError } = useAuth();
  const isLoading = false; // Disabled for UI/UX design
  const { showToast } = useToast();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration-safe disabled state
  const isFormDisabled = mounted ? (submitting || isLoading) : false;
  const isSubmitDisabled = mounted ? (submitting || isLoading || !consent || passwordStrength.score < 3 || !username || !email || !password || !validateUsername(username) || !validateEmail(email)) : true;
  const router = useRouter();

  const containerRef = useRef(null);

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

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "🔐 Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password)) return "🔐 Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "🔐 Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "🔐 Password must contain at least one number";
    return null;
  };

  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /(?=.*[A-Z])/.test(password),
      lowercase: /(?=.*[a-z])/.test(password),
      number: /(?=.*\d)/.test(password)
    };

    // Additional security checks
    const emailName = email.split('@')[0].toLowerCase();
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
    const hasCommonWord = commonPasswords.some(common => password.toLowerCase().includes(common));
    const usesEmailName = emailName.length > 2 && password.toLowerCase().includes(emailName);

    let score = Object.values(checks).filter(Boolean).length;
    let feedback = "";
    let color = "";

    // Penalize common patterns
    if (hasCommonWord) {
      score = Math.max(0, score - 1);
      feedback = "Avoid common passwords";
      color = "text-red-500";
    } else if (usesEmailName) {
      score = Math.max(0, score - 1);
      feedback = "Don't use your email name";
      color = "text-orange-500";
    } else if (password.length === 0) {
      feedback = "";
      color = "";
    } else if (score === 1) {
      feedback = "Weak - Add more requirements";
      color = "text-red-500";
    } else if (score === 2) {
      feedback = "Fair - Getting better";
      color = "text-orange-500";
    } else if (score === 3) {
      feedback = "Good - Almost there";
      color = "text-yellow-500";
    } else if (score === 4) {
      feedback = "Strong - Perfect! 🎉";
      color = "text-sage";
    }

    return { score, feedback, checks, color };
  };

  const getUsernameError = () => {
    if (!usernameTouched) return "";
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    if (!validateUsername(username)) return "Username can only contain letters, numbers, and underscores";
    return "";
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
    const validation = validatePassword(password);
    return validation;
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (!usernameTouched) setUsernameTouched(true);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError("");
    if (!emailTouched) setEmailTouched(true);

    if (value.length > 0 && !validateEmail(value)) {
      setEmailError("📧 Please enter a valid email address");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!passwordTouched) setPasswordTouched(true);
    const strength = checkPasswordStrength(value);
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (submitting || isLoading) return;

    setError("");
    setSubmitting(true);

    try {
      // Enhanced validation
      if (!username?.trim() || !email?.trim() || !password?.trim()) {
        setError("Please fill in all fields");
        showToast("Please fill in all fields", 'sage', 3000);
        setSubmitting(false);
        return;
      }

      if (!validateUsername(username.trim())) {
        setError("Please enter a valid username");
        showToast("Please enter a valid username", 'sage', 3000);
        setSubmitting(false);
        return;
      }

      if (!validateEmail(email.trim())) {
        setError("Please enter a valid email address");
        showToast("Please enter a valid email address", 'sage', 3000);
        setSubmitting(false);
        return;
      }

      // Check consent
      if (!consent) {
        setError("Please accept the Terms and Privacy Policy");
        showToast("Please accept the Terms and Privacy Policy", 'sage', 3000);
        setSubmitting(false);
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        showToast(passwordError, 'sage', 4000);
        setSubmitting(false);
        return;
      }

      // Check password strength
      const strength = checkPasswordStrength(password);
      if (strength.score < 3) {
        setError("Please create a stronger password");
        showToast("Please create a stronger password", 'sage', 3000);
        setSubmitting(false);
        return;
      }

      // Check offline status
      if (!isOnline) {
        setError("You're offline. Please check your connection and try again.");
        showToast("You're offline. Please check your connection and try again.", 'sage', 4000);
        setSubmitting(false);
        return;
      }

      // Attempt registration
      const success = await register(email.trim().toLowerCase(), password);

      if (success) {
        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");
        setPasswordStrength({
          score: 0,
          feedback: "",
          checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false
          }
        });

        // Show success toast with celebration
        showToast("🎉 Welcome to KLIO! Your account has been created successfully!", 'success', 4000);

        // Navigate to interests page after short delay
        setTimeout(() => {
          showToast("Let's personalize your experience! 🌟", 'info', 2000);
          router.replace("/interests?from=register");
        }, 1500);
      } else {
        // Handle registration failure
        if (authError) {
          if (authError.includes('fetch') || authError.includes('network')) {
            setError('Connection error. Please check your internet connection and try again.');
            showToast('Connection error. Please check your internet connection and try again.', 'sage', 4000);
          } else if (authError.includes('already registered') || authError.includes('already exists')) {
            setError('This email is already registered. Try logging in instead.');
            showToast('This email is already registered. Try logging in instead.', 'sage', 4000);
          } else {
            setError(authError);
            showToast(authError, 'sage', 4000);
          }
        } else {
          setError("Registration failed. Please try again.");
          showToast("Registration failed. Please try again.", 'sage', 4000);
        }
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'sage', 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div ref={containerRef} data-reduced={prefersReduced} className="min-h-[100dvh] bg-off-white  flex flex-col relative overflow-hidden ios-inertia hide-scrollbar safe-area-full">
      {/* Back button with entrance animation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20"
      >
        <Link href="/onboarding" className="text-charcoal hover:text-charcoal/80 transition-colors duration-300 p-2 hover:bg-white/50 rounded-lg block backdrop-blur-sm">
          <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
        </Link>
      </motion.div>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative z-10 flex-1 flex flex-col justify-center py-8 sm:py-12">
        {/* Header with premium styling and animations */}
        <div className="text-center mb-4">
          <FadeInUp delay={0.4} duration={1} distance={60}>
            <div className="inline-block relative mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-2 text-center leading-snug px-2 tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                Create your account
              </h2>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.7} duration={0.8} distance={30}>
            <p className="text-sm md:text-base font-normal text-charcoal/70 mb-4 leading-relaxed px-2 max-w-lg mx-auto" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
              Sign up today - share honest reviews, climb leaderboards, and rate any business!
            </p>
          </FadeInUp>
        </div>


        {/* Form Card */}
        <div className="bg-off-white  rounded-3xl p-5 sm:p-7 md:p-9 mb-4 relative overflow-hidden border border-white/30 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="font-urbanist text-[14px] font-600 text-red-600">{error}</p>
              </div>
            )}

            {/* Offline Message */}
            {!isOnline && !error && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                <p className="font-urbanist text-[14px] font-600 text-orange-600">You&apos;re offline. We&apos;ll try again when you&apos;re back online.</p>
              </div>
            )}

            {/* Username with icon */}
            <div className="relative group">
              <div className={`absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10 ${
                getUsernameError() ? 'text-red-500' :
                username && !getUsernameError() && usernameTouched ? 'text-sage' :
                'text-charcoal/40 group-focus-within:text-sage'
              }`}>
                {getUsernameError() ? <AlertCircle className="w-5 h-5" /> :
                  username && !getUsernameError() && usernameTouched ? <CheckCircle className="w-5 h-5" /> :
                  <UserIcon className="w-5 h-5" />}
              </div>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                onBlur={() => setUsernameTouched(true)}
                className={`w-full bg-cultured-1/50 border pl-12 sm:pl-14 pr-4 py-3 sm:py-4 md:py-5 font-urbanist text-body font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-sage/50 input-mobile ${
                  getUsernameError() ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
                  username && !getUsernameError() && usernameTouched ? 'border-sage/40 focus:border-sage focus:ring-sage/20' :
                  'border-light-gray/50 focus:ring-sage/30 focus:border-sage focus:bg-white'
                }`}
                disabled={isFormDisabled}
              />
            </div>

            {/* Username validation feedback */}
            {getUsernameError() && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1" role="alert">
                <AlertCircle className="w-3 h-3" />
                {getUsernameError()}
              </p>
            )}
            {username && !getUsernameError() && usernameTouched && (
              <p className="text-xs text-sage flex items-center gap-1 mt-1" role="status">
                <CheckCircle className="w-3 h-3" />
                Username looks good!
              </p>
            )}

            {/* Email with icon */}
            <div className="relative group">
              <div className={`absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10 ${
                getEmailError() ? 'text-red-500' :
                email && !getEmailError() && emailTouched ? 'text-sage' :
                'text-charcoal/40 group-focus-within:text-sage'
              }`}>
                {getEmailError() ? <AlertCircle className="w-5 h-5" /> :
                  email && !getEmailError() && emailTouched ? <CheckCircle className="w-5 h-5" /> :
                  <Mail className="w-5 h-5" />}
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={`w-full bg-cultured-1/50 border pl-12 sm:pl-14 pr-4 py-3 sm:py-4 md:py-5 font-urbanist text-body font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-sage/50 input-mobile ${
                  getEmailError() ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
                  email && !getEmailError() && emailTouched ? 'border-sage/40 focus:border-sage focus:ring-sage/20' :
                  'border-light-gray/50 focus:ring-sage/30 focus:border-sage focus:bg-white'
                }`}
                disabled={isFormDisabled}
              />
            </div>

            {/* Email validation feedback */}
            {getEmailError() && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1" role="alert">
                <AlertCircle className="w-3 h-3" />
                {getEmailError()}
              </p>
            )}
            {email && !getEmailError() && emailTouched && (
              <p className="text-xs text-sage flex items-center gap-1 mt-1" role="status">
                <CheckCircle className="w-3 h-3" />
                Email looks good!
              </p>
            )}

            {/* Password with enhanced styling */}
            <div className="relative group">
              <div className={`absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10 ${
                passwordStrength.score >= 3 && passwordTouched ? 'text-sage' :
                passwordStrength.score > 0 && passwordStrength.score < 3 ? 'text-orange-500' :
                'text-charcoal/40 group-focus-within:text-sage'
              }`}>
                {passwordStrength.score >= 3 && passwordTouched ? <CheckCircle className="w-5 h-5" /> :
                  passwordStrength.score > 0 && passwordStrength.score < 3 ? <AlertCircle className="w-5 h-5" /> :
                  <Lock className="w-5 h-5" />}
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                className={`w-full bg-cultured-1/50 border pl-12 sm:pl-14 pr-12 sm:pr-16 py-3 sm:py-4 md:py-5 font-urbanist text-body font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-sage/50 input-mobile ${
                  passwordStrength.score >= 3 && passwordTouched ? 'border-sage/40 focus:border-sage focus:ring-sage/20' :
                  passwordStrength.score > 0 && passwordStrength.score < 3 ? 'border-orange-300 focus:border-orange-500 focus:ring-orange-500/20' :
                  'border-light-gray/50 focus:ring-sage/30 focus:border-sage focus:bg-white'
                }`}
                disabled={isFormDisabled}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors duration-300 p-1 z-10 rounded-full"
                disabled={isFormDisabled}
              >
                <ion-icon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size="small"
                ></ion-icon>
              </button>
            </div>

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="h-5 mt-1 flex items-center gap-2">
                <div className="flex-1 flex gap-1" role="progressbar" aria-valuenow={passwordStrength.score} aria-valuemin={0} aria-valuemax={4}>
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 transition-all duration-300 ${
                        level <= passwordStrength.score
                          ? level === 1
                            ? 'bg-red-400'
                            : level === 2
                            ? 'bg-orange-400'
                            : level === 3
                            ? 'bg-yellow-400'
                            : 'bg-sage'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength.feedback && (
                  <span className={`text-xs font-500 ${passwordStrength.color}`}>
                    {passwordStrength.feedback}
                  </span>
                )}
              </div>
            )}

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

            {/* Sign Up Button with premium effects */}
            <div className="pt-4 flex justify-center">
              <div className="w-full">
                <PremiumHover scale={1.02} shadowIntensity="strong">
                  <motion.button
                    type="submit"
                    disabled={isSubmitDisabled}
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                    className={`group block w-full text-base font-semibold py-3 px-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 relative overflow-hidden text-center min-h-[48px] whitespace-nowrap ${
                      isSubmitDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                        : 'btn-premium text-white focus:ring-sage/30'
                    }`}
                    whileTap={{ scale: isFormDisabled ? 1 : 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isFormDisabled && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      )}
                      {isFormDisabled ? "Creating account..." : "Create account"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </PremiumHover>
              </div>
            </div>

            {/* Registration progress indicator */}
            <div className="text-center space-y-2 pt-4">
              <div className="flex items-center justify-center gap-3 text-xs">
                <div className={`flex items-center gap-1 min-w-0 ${username && !getUsernameError() ? 'text-sage' : 'text-gray-400'}`}>
                  {username && !getUsernameError() ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  <span className="text-truncate">Username</span>
                </div>
                <div className={`flex items-center gap-1 min-w-0 ${email && !getEmailError() ? 'text-sage' : 'text-gray-400'}`}>
                  {email && !getEmailError() ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  <span className="text-truncate">Email</span>
                </div>
                <div className={`flex items-center gap-1 min-w-0 ${passwordStrength.score >= 3 ? 'text-sage' : 'text-gray-400'}`}>
                  {passwordStrength.score >= 3 ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  <span className="text-truncate">Password</span>
                </div>
                <div className={`flex items-center gap-1 min-w-0 ${consent ? 'text-sage' : 'text-gray-400'}`}>
                  {consent ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  <span className="text-truncate">Terms</span>
                </div>
              </div>
              <p className="text-xs text-charcoal/60">
                Next: pick your interests
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-light-gray/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-off-white  text-charcoal/60 font-medium" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <button
                type="button"
                className="flex items-center justify-center bg-white border border-light-gray/50 rounded-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-sm font-medium text-charcoal hover:border-sage/50 hover:bg-sage/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 group btn-target btn-press"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="group-hover:text-sage transition-colors duration-300">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center bg-white border border-light-gray/50 rounded-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-sm font-medium text-charcoal hover:border-sage/50 hover:bg-sage/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 group btn-target btn-press"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="group-hover:text-sage transition-colors duration-300">Apple</span>
              </button>
            </div>
          </form>

          {/* Enhanced footer */}
          <div className="text-center mt-4 pt-4 border-t border-light-gray/30">
            <div className="font-urbanist text-sm sm:text-base font-400 text-charcoal/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-coral font-600 hover:text-coral/80 transition-colors duration-300 relative group"
              >
                <span>Log in</span>
                <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-coral/30 group-hover:bg-coral/60 transition-colors duration-300 rounded-full"></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Premium Trust Indicators with spring animations */}
        <div className="flex justify-center items-start gap-3 md:gap-5 text-charcoal/60 text-center pt-4">
          <FadeInUp delay={1.5} duration={0.6} distance={20}>
            <PremiumHover scale={1.1} duration={0.3}>
              <div className="flex flex-col items-center gap-1 w-14 md:w-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.7, type: "spring", stiffness: 300 }}
                  className="w-7 h-7 md:w-8 md:h-8 bg-sage/10 rounded-full flex items-center justify-center"
                >
                  <ShieldCheck className="w-4 h-4 text-sage" />
                </motion.div>
                <span className="text-[9px] md:text-[10px] font-medium tracking-tight leading-tight min-w-0 text-truncate" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Secure</span>
              </div>
            </PremiumHover>
          </FadeInUp>

          <FadeInUp delay={1.7} duration={0.6} distance={20}>
            <PremiumHover scale={1.1} duration={0.3}>
              <div className="flex flex-col items-center gap-1 w-14 md:w-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.9, type: "spring", stiffness: 300 }}
                  className="w-7 h-7 md:w-8 md:h-8 bg-coral/10 rounded-full flex items-center justify-center"
                >
                  <Users className="w-4 h-4 text-coral" />
                </motion.div>
                <span className="text-[9px] md:text-[10px] font-medium tracking-tight leading-tight min-w-0 text-truncate" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Community</span>
              </div>
            </PremiumHover>
          </FadeInUp>

          <FadeInUp delay={1.9} duration={0.6} distance={20}>
            <PremiumHover scale={1.1} duration={0.3}>
              <div className="flex flex-col items-center gap-1 w-14 md:w-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 2.1, type: "spring", stiffness: 300 }}
                  className="w-7 h-7 md:w-8 md:h-8 bg-charcoal/10 rounded-full flex items-center justify-center"
                >
                  <Star className="w-4 h-4 text-charcoal" />
                </motion.div>
                <span className="text-[9px] md:text-[10px] font-medium tracking-tight leading-tight min-w-0 text-truncate" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Quality</span>
              </div>
            </PremiumHover>
          </FadeInUp>
        </div>
      </div>
      </div>
    </>
  );
}