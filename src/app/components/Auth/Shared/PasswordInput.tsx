"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  placeholder?: string;
  showStrength?: boolean;
  strength?: {
    score: number;
    feedback: string;
    checks: {
      length: boolean;
      uppercase: boolean;
      lowercase: boolean;
      number: boolean;
    };
  };
  touched: boolean;
}

export function PasswordInput({
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Create a strong password",
  showStrength = false,
  strength,
  touched
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isStrong = showStrength && strength && strength.score >= 3 && touched;
  const isWeak = showStrength && strength && strength.score > 0 && strength.score < 3;

  return (
    <div>
      <div className="relative group">
        <div className={`absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10 ${
          isStrong ? 'text-sage' :
          isWeak ? 'text-orange-500' :
          'text-charcoal/40 group-focus-within:text-sage'
        }`}>
          {isStrong ? <CheckCircle className="w-5 h-5" /> :
            isWeak ? <AlertCircle className="w-5 h-5" /> :
            <Lock className="w-5 h-5" />}
        </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full bg-cultured-1/50 border pl-12 sm:pl-14 pr-12 sm:pr-16 py-3 sm:py-4 md:py-5 font-urbanist text-body font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-sage/50 input-mobile ${
            isStrong ? 'border-sage/40 focus:border-sage focus:ring-sage/20' :
            isWeak ? 'border-orange-300 focus:border-orange-500 focus:ring-orange-500/20' :
            'border-light-gray/50 focus:ring-sage/30 focus:border-sage focus:bg-off-white'
          }`}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors duration-300 p-1 z-10 rounded-full"
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Password strength indicator */}
      {showStrength && value.length > 0 && strength && (
        <div className="h-5 mt-1 flex items-center gap-2">
          <div className="flex-1 flex gap-1" role="progressbar" aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={4}>
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 transition-all duration-300 ${
                  level <= strength.score
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
          {strength.feedback && (
            <span className={`text-xs font-500 ${
              strength.score >= 3 ? 'text-sage' :
              strength.score > 0 ? 'text-orange-500' :
              'text-charcoal/60'
            }`}>
              {strength.feedback}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
