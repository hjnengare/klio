/**
 * Validation utility functions for forms
 */

export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "🔐 Password must be at least 8 characters long";
  if (!/(?=.*[a-z])/.test(password)) return "🔐 Password must contain at least one lowercase letter";
  if (!/(?=.*[A-Z])/.test(password)) return "🔐 Password must contain at least one uppercase letter";
  if (!/(?=.*\d)/.test(password)) return "🔐 Password must contain at least one number";
  return null;
};

export interface PasswordStrength {
  score: number;
  feedback: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
  };
  color?: string;
}

export const checkPasswordStrength = (password: string, email: string = ""): PasswordStrength => {
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

export const getUsernameError = (username: string, touched: boolean): string => {
  if (!touched) return "";
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (username.length > 20) return "Username must be less than 20 characters";
  if (!validateUsername(username)) return "Username can only contain letters, numbers, and underscores";
  return "";
};

export const getEmailError = (email: string, touched: boolean): string => {
  if (!touched) return "";
  if (!email) return "Email is required";
  if (!validateEmail(email)) return "Please enter a valid email address";
  return "";
};

export const getPasswordError = (password: string, touched: boolean): string => {
  if (!touched) return "";
  if (!password) return "Password is required";
  const validationError = validatePassword(password);
  return validationError || "";
};
