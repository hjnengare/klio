/**
 * INPUT COMPONENT - BLABBR DESIGN SYSTEM
 *
 * Standardized form input component with full accessibility support
 * Handles text, email, password, and other input types
 */

import React, { forwardRef, ReactNode, useState } from 'react';
import { cn } from '../utils/cn';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;

  /** Helper text */
  helperText?: string;

  /** Error message */
  error?: string;

  /** Success message */
  success?: string;

  /** Input size */
  size?: 'sm' | 'md' | 'lg';

  /** Input variant */
  variant?: 'default' | 'filled' | 'outlined';

  /** Icon before input */
  iconBefore?: ReactNode;

  /** Icon after input */
  iconAfter?: ReactNode;

  /** Toggle password visibility for password inputs */
  showPasswordToggle?: boolean;

  /** Full width input */
  fullWidth?: boolean;

  /** Additional CSS classes */
  className?: string;

  /** Container CSS classes */
  containerClassName?: string;

  /** Label CSS classes */
  labelClassName?: string;

  /** Required field indicator */
  required?: boolean;

  /** Loading state */
  loading?: boolean;
}

// =============================================================================
// STYLE VARIANTS
// =============================================================================

const inputVariants = {
  base: [
    // Base styles
    'w-full font-primary transition-all duration-normal',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'placeholder:text-charcoal-400',

    // Prevent iOS zoom on focus
    'text-base', // 16px minimum to prevent zoom

    // Ensure minimum touch target
    'min-h-[44px]',

    // Motion-safe animations
    'motion-safe:transition-all motion-safe:duration-normal',
  ],

  variants: {
    default: [
      'bg-off-white -100 border border-charcoal-200',
      'hover:border-sage-400 hover:bg-white',
      'focus:border-sage-500 focus:ring-sage-500/20 focus:bg-white',
      'invalid:border-error-500 invalid:ring-error-500/20',
    ],

    filled: [
      'bg-charcoal-50 border-0',
      'hover:bg-charcoal-100',
      'focus:bg-white focus:ring-sage-500/20',
      'invalid:bg-error-50 invalid:ring-error-500/20',
    ],

    outlined: [
      'bg-transparent border-2 border-charcoal-300',
      'hover:border-sage-400',
      'focus:border-sage-500 focus:ring-sage-500/20',
      'invalid:border-error-500 invalid:ring-error-500/20',
    ],
  },

  sizes: {
    sm: [
      'h-9 px-3 text-body-sm rounded-sm',
    ],
    md: [
      'h-11 px-4 text-body-md rounded-md',
    ],
    lg: [
      'h-12 px-5 text-body-lg rounded-lg',
    ],
  },

  states: {
    error: [
      'border-error-500 ring-error-500/20',
      'focus:border-error-500 focus:ring-error-500/20',
    ],
    success: [
      'border-success-500 ring-success-500/20',
      'focus:border-success-500 focus:ring-success-500/20',
    ],
  },

  withIconBefore: {
    sm: 'pl-9',
    md: 'pl-10',
    lg: 'pl-12',
  },

  withIconAfter: {
    sm: 'pr-9',
    md: 'pr-10',
    lg: 'pr-12',
  },
} as const;

const labelVariants = {
  base: [
    'block font-primary font-medium text-charcoal-600 mb-2',
  ],
  sizes: {
    sm: 'text-body-sm',
    md: 'text-body-md',
    lg: 'text-body-lg',
  },
} as const;

const helperVariants = {
  base: [
    'mt-1 text-body-sm flex items-center gap-1',
  ],
  states: {
    default: 'text-charcoal-500',
    error: 'text-error-600',
    success: 'text-success-600',
  },
} as const;

const iconVariants = {
  base: [
    'absolute top-1/2 transform -translate-y-1/2 pointer-events-none',
    'text-charcoal-400 transition-colors duration-normal',
  ],
  sizes: {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  },
  positions: {
    before: {
      sm: 'left-3',
      md: 'left-3',
      lg: 'left-4',
    },
    after: {
      sm: 'right-3',
      md: 'right-3',
      lg: 'right-4',
    },
  },
  states: {
    error: 'text-error-500',
    success: 'text-success-500',
    focus: 'text-sage-500',
  },
} as const;

// =============================================================================
// ICONS
// =============================================================================

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464 M9.878 9.878l-3-3m7.071 7.071l2.122 2.122m-2.122-2.122l3 3M15.121 14.121L17.536 16.536" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LoadingIcon = ({ className }: { className?: string }) => (
  <div
    className={cn('animate-spin border-2 border-current border-t-transparent rounded-full', className)}
    aria-hidden="true"
  />
);

// =============================================================================
// INPUT COMPONENT
// =============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      size = 'md',
      variant = 'default',
      iconBefore,
      iconAfter,
      showPasswordToggle = false,
      fullWidth = true,
      className,
      containerClassName,
      labelClassName,
      required = false,
      loading = false,
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Determine input type
    const inputType = showPasswordToggle && type === 'password'
      ? (showPassword ? 'text' : 'password')
      : type;

    // Determine state
    const state = error ? 'error' : success ? 'success' : 'default';

    // Determine if we have icon adjustments needed
    const hasIconBefore = !!(iconBefore || loading);
    const hasIconAfter = !!(iconAfter || (showPasswordToggle && type === 'password'));

    // Build input classes
    const inputClasses = cn(
      inputVariants.base,
      inputVariants.variants[variant],
      inputVariants.sizes[size],
      state !== 'default' && inputVariants.states[state],
      hasIconBefore && inputVariants.withIconBefore[size],
      hasIconAfter && inputVariants.withIconAfter[size],
      !fullWidth && 'w-auto',
      className
    );

    // Build label classes
    const labelClasses = cn(
      labelVariants.base,
      labelVariants.sizes[size],
      labelClassName
    );

    // Build helper text classes
    const helperClasses = cn(
      helperVariants.base,
      helperVariants.states[state]
    );

    // Build icon classes
    const iconClasses = cn(
      iconVariants.base,
      iconVariants.sizes[size],
      state === 'error' && iconVariants.states.error,
      state === 'success' && iconVariants.states.success,
      isFocused && state === 'default' && iconVariants.states.focus
    );

    const iconBeforeClasses = cn(
      iconClasses,
      iconVariants.positions.before[size]
    );

    const iconAfterClasses = cn(
      iconClasses,
      iconVariants.positions.after[size]
    );

    return (
      <div className={cn('w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && (
              <span className="text-error-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Icon Before / Loading */}
          {hasIconBefore && (
            <div className={iconBeforeClasses}>
              {loading ? (
                <LoadingIcon className={iconVariants.sizes[size]} />
              ) : (
                iconBefore
              )}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={inputClasses}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : success
                ? `${inputId}-success`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            disabled={loading || props.disabled}
            required={required}
            {...props}
          />

          {/* Icon After / Password Toggle */}
          {hasIconAfter && (
            <div className={iconAfterClasses}>
              {showPasswordToggle && type === 'password' ? (
                <button
                  type="button"
                  className="pointer-events-auto hover:text-sage-600 focus:text-sage-600 transition-colors duration-normal focus:outline-none p-1 -m-1 rounded"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOffIcon className={iconVariants.sizes[size]} />
                  ) : (
                    <EyeIcon className={iconVariants.sizes[size]} />
                  )}
                </button>
              ) : (
                iconAfter
              )}
            </div>
          )}

          {/* State Icons (auto-added for validation) */}
          {state === 'error' && !hasIconAfter && (
            <div className={iconAfterClasses}>
              <ExclamationCircleIcon className={iconVariants.sizes[size]} />
            </div>
          )}

          {state === 'success' && !hasIconAfter && (
            <div className={iconAfterClasses}>
              <CheckCircleIcon className={iconVariants.sizes[size]} />
            </div>
          )}
        </div>

        {/* Helper Text / Error / Success */}
        {(helperText || error || success) && (
          <div
            id={
              error
                ? `${inputId}-error`
                : success
                ? `${inputId}-success`
                : `${inputId}-helper`
            }
            className={helperClasses}
            role={error ? 'alert' : undefined}
          >
            {state === 'error' && (
              <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
            )}
            {state === 'success' && (
              <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{error || success || helperText}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// =============================================================================
// EXPORTS
// =============================================================================

export default Input;
export type { InputProps };