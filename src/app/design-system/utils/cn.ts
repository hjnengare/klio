/**
 * CLASS NAME UTILITY - BLABBR DESIGN SYSTEM
 *
 * Utility for combining CSS class names with conditional logic
 * Based on the popular 'clsx' approach but tailored for our design system
 */

import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind CSS class merging
 *
 * This utility combines multiple class name sources and intelligently
 * merges Tailwind CSS classes, removing duplicates and conflicts.
 *
 * @param inputs - Class name inputs (strings, objects, arrays, etc.)
 * @returns Merged class name string
 *
 * @example
 * ```tsx
 * cn('text-red-500', 'text-blue-500') // 'text-blue-500' (blue wins)
 * cn('p-4', 'p-2') // 'p-2' (p-2 wins)
 * cn('bg-red-500', isActive && 'bg-blue-500') // conditional classes
 * cn(['text-sm', 'font-bold'], { 'text-red-500': hasError }) // mixed inputs
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Variant utility for creating component style variants
 *
 * Helps create consistent component styling patterns with better TypeScript support
 *
 * @param base - Base classes that are always applied
 * @param variants - Object containing variant definitions
 * @param defaultVariants - Default variant values
 *
 * @example
 * ```tsx
 * const button = cva(
 *   "inline-flex items-center justify-center rounded-md text-sm font-medium",
 *   {
 *     variants: {
 *       variant: {
 *         default: "bg-primary text-primary-foreground hover:bg-primary/90",
 *         destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
 *       },
 *       size: {
 *         default: "h-10 px-4 py-2",
 *         sm: "h-9 rounded-md px-3",
 *         lg: "h-11 rounded-md px-8",
 *       },
 *     },
 *     defaultVariants: {
 *       variant: "default",
 *       size: "default",
 *     },
 *   }
 * )
 * ```
 */
export type VariantProps<T extends (...args: any) => any> = Parameters<T>[0];

// Re-export clsx for direct use when needed
export { clsx };

// Re-export twMerge for direct use when needed
export { twMerge };

export default cn;