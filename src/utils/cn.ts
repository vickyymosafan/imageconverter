import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to create variant-based class mappings
 * Useful for component variants with consistent patterns
 */
export function createVariants<T extends Record<string, string>>(variants: T) {
  return variants;
}

/**
 * Utility function to handle responsive classes
 */
export function responsive(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
) {
  return cn(
    base,
    sm && `sm:${sm}`,
    md && `md:${md}`,
    lg && `lg:${lg}`,
    xl && `xl:${xl}`
  );
}

/**
 * Utility function for focus ring styles
 */
export function focusRing(className?: string) {
  return cn(
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
    className
  );
}

/**
 * Utility function for disabled states
 */
export function disabledState(disabled: boolean, className?: string) {
  return cn(
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );
}
