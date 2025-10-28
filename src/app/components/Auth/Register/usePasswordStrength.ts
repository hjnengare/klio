import { useMemo } from "react";

interface PasswordStrength {
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

export function usePasswordStrength(password: string, email: string = ""): PasswordStrength {
  return useMemo(() => {
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
      color = "text-error-500";
    } else if (usesEmailName) {
      score = Math.max(0, score - 1);
      feedback = "Don't use your email name";
      color = "text-orange-500";
    } else if (password.length === 0) {
      feedback = "";
      color = "";
    } else if (score === 1) {
      feedback = "Weak - Add more requirements";
      color = "text-error-500";
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
  }, [password, email]);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "🔐 Password must be at least 8 characters long";
  if (!/(?=.*[a-z])/.test(password)) return "🔐 Password must contain at least one lowercase letter";
  if (!/(?=.*[A-Z])/.test(password)) return "🔐 Password must contain at least one uppercase letter";
  if (!/(?=.*\d)/.test(password)) return "🔐 Password must contain at least one number";
  return null;
}
