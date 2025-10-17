"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Lock, Eye, EyeOff, User as UserIcon, Circle, ShieldCheck, Users, Star } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { motion } from "framer-motion";
import FadeInUp from "../Animations/FadeInUp";
import PremiumHover from "../Animations/PremiumHover";
import { usePrefersReducedMotion } from "../../utils/hooks/usePrefersReducedMotion";

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
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
  const isLoading = true; 
  const { showToast } = useToast();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Validation functions
  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Hydration-safe disabled state
  const isFormDisabled = mounted ? (submitting || isLoading) : false;
  const isSubmitDisabled = mounted ? (submitting || isLoading || !consent || passwordStrength.score < 3 || !username || !email || !password || !validateUsername(username) || !validateEmail(email)) : true;

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
          onSuccess();
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
    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="font-sf text-[14px] font-600 text-red-600">{error}</p>
        </div>
      )}

      {/* Offline Message */}
      {!isOnline && !error && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="font-sf text-[14px] font-600 text-orange-600">You&apos;re offline. We&apos;ll try again when you&apos;re back online.</p>
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
          className={`w-full bg-cultured-1/50 border pl-12 sm:pl-14 pr-4 py-3 sm:py-4 md:py-5 font-sf text-body font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-sage/50 input-mobile ${
            getUsernameError() ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
            username && !getUsernameError() && usernameTouched ? 'border-sage/40 focus:border-sage focus:ring-sage/20' :
            'border-light-gray/50 focus:ring-sage/30 focus:border-sage focus:bg-off-white  '
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
          className={`w-full bg-cultured-1/50 border pl-12 sm:pl-14 pr-4 py-3 sm:py-4 md:py-5 font-sf text-body font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-sage/50 input-mobile ${
            getEmailError() ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
            email && !getEmailError() && emailTouched ? 'border-sage/40 focus:border-sage focus:ring-sage/20' :
            'border-light-gray/50 focus:ring-sage/30 focus:border-sage focus:bg-off-white  '
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
          className={`w-full bg-cultured-1/50 border pl-12 sm:pl-14 pr-12 sm:pr-16 py-3 sm:py-4 md:py-5 font-sf text-body font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-sage/50 input-mobile ${
            passwordStrength.score >= 3 && passwordTouched ? 'border-sage/40 focus:border-sage focus:ring-sage/20' :
            passwordStrength.score > 0 && passwordStrength.score < 3 ? 'border-orange-300 focus:border-orange-500 focus:ring-orange-500/20' :
            'border-light-gray/50 focus:ring-sage/30 focus:border-sage focus:bg-off-white  '
          }`}
          disabled={isFormDisabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors duration-300 p-1 z-10 rounded-full"
          disabled={isFormDisabled}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
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
            <span className={`text-xs font-500 ${
              passwordStrength.score >= 3 ? 'text-sage' :
              passwordStrength.score >= 2 ? 'text-orange-500' :
              passwordStrength.score >= 1 ? 'text-red-500' :
              'text-gray-500'
            }`}>
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
            <a href="/terms" className="underline text-sage hover:text-coral transition-colors">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline text-sage hover:text-coral transition-colors">
              Privacy Policy
            </a>
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
          Next - Pick your interests
        </p>
      </div>
    </form>
  );
}
