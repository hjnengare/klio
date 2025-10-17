"use client";

import { Mail, AlertCircle, CheckCircle } from "lucide-react";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function EmailInput({
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false,
  placeholder = "you@example.com"
}: EmailInputProps) {
  const hasError = touched && !!error;
  const isValid = touched && value && !error;

  return (
    <div>
      <div className="relative group">
        <div className={`absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10 ${
          hasError ? 'text-red-500' :
          isValid ? 'text-sage' :
          'text-charcoal/40 group-focus-within:text-sage'
        }`}>
          {hasError ? <AlertCircle className="w-5 h-5" /> :
            isValid ? <CheckCircle className="w-5 h-5" /> :
            <Mail className="w-5 h-5" />}
        </div>
        <input
          type="email"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full bg-cultured-1/50 border pl-12 sm:pl-14 pr-4 py-3 sm:py-4 md:py-5 font-sf text-body font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-sage/50 input-mobile ${
            hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
            isValid ? 'border-sage/40 focus:border-sage focus:ring-sage/20' :
            'border-light-gray/50 focus:ring-sage/30 focus:border-sage focus:bg-off-white'
          }`}
          disabled={disabled}
        />
      </div>

      {/* Validation feedback */}
      {hasError && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-1" role="alert">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      {isValid && (
        <p className="text-xs text-sage flex items-center gap-1 mt-1" role="status">
          <CheckCircle className="w-3 h-3" />
          Email looks good!
        </p>
      )}
    </div>
  );
}
