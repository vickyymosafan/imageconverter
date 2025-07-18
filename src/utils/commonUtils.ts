import { cn } from '../lib/utils';
import { SizeVariant, ColorVariant } from '../types/common';

// Common utility functions for components

// Generate consistent class names for sizes
export const getSizeClasses = (size: SizeVariant, type: 'padding' | 'text' | 'icon' | 'spacing' = 'padding') => {
  const sizeMap = {
    padding: {
      xs: 'px-2 py-1',
      sm: 'px-3 py-1.5',
      md: 'px-4 py-2',
      lg: 'px-6 py-3',
      xl: 'px-8 py-4',
    },
    text: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    icon: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
    },
    spacing: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  };

  return sizeMap[type][size];
};

// Generate consistent color classes
export const getColorClasses = (color: ColorVariant, type: 'bg' | 'text' | 'border' = 'bg') => {
  const colorMap = {
    bg: {
      primary: 'bg-primary-500 hover:bg-primary-600',
      secondary: 'bg-gray-500 hover:bg-gray-600',
      success: 'bg-green-500 hover:bg-green-600',
      warning: 'bg-yellow-500 hover:bg-yellow-600',
      danger: 'bg-red-500 hover:bg-red-600',
      info: 'bg-blue-500 hover:bg-blue-600',
    },
    text: {
      primary: 'text-primary-600 dark:text-primary-400',
      secondary: 'text-gray-600 dark:text-gray-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      danger: 'text-red-600 dark:text-red-400',
      info: 'text-blue-600 dark:text-blue-400',
    },
    border: {
      primary: 'border-primary-500',
      secondary: 'border-gray-500',
      success: 'border-green-500',
      warning: 'border-yellow-500',
      danger: 'border-red-500',
      info: 'border-blue-500',
    },
  };

  return colorMap[type][color];
};

// Common animation classes
export const getAnimationClasses = (animation: string) => {
  const animationMap = {
    'fade-in': 'animate-fade-in',
    'fade-in-up': 'animate-fade-in-up',
    'scale-in': 'animate-scale-in',
    'slide-up': 'animate-slide-up',
    'bounce-subtle': 'animate-bounce-subtle',
    'pulse': 'animate-pulse',
    'spin': 'animate-spin',
  };

  return animationMap[animation as keyof typeof animationMap] || '';
};

// Focus ring utility
export const getFocusRingClasses = (color: ColorVariant = 'primary') => {
  const focusMap = {
    primary: 'focus:ring-primary-500/20 focus:border-primary-500',
    secondary: 'focus:ring-gray-500/20 focus:border-gray-500',
    success: 'focus:ring-green-500/20 focus:border-green-500',
    warning: 'focus:ring-yellow-500/20 focus:border-yellow-500',
    danger: 'focus:ring-red-500/20 focus:border-red-500',
    info: 'focus:ring-blue-500/20 focus:border-blue-500',
  };

  return cn(
    'focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
    focusMap[color]
  );
};

// Disabled state utility
export const getDisabledClasses = (disabled: boolean) => {
  return disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
};

// Loading state utility
export const getLoadingClasses = (loading: boolean) => {
  return loading ? 'opacity-75 cursor-wait' : '';
};

// Hover effect utility
export const getHoverClasses = (type: 'lift' | 'scale' | 'glow' | 'none' = 'none') => {
  const hoverMap = {
    lift: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200',
    scale: 'hover:scale-105 transition-transform duration-200',
    glow: 'hover:shadow-lg hover:shadow-primary-500/25 transition-shadow duration-200',
    none: '',
  };

  return hoverMap[type];
};

// Responsive grid classes
export const getGridClasses = (cols: number, responsive: boolean = true) => {
  if (responsive) {
    const responsiveMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
      12: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
    };
    return responsiveMap[cols as keyof typeof responsiveMap] || 'grid-cols-1';
  }

  return `grid-cols-${cols}`;
};

// Status color utility
export const getStatusColor = (status: string) => {
  const statusMap = {
    pending: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
    processing: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    completed: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    success: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    error: 'text-red-600 bg-red-100 dark:bg-red-900/20',
    warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
    info: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
  };

  return statusMap[status as keyof typeof statusMap] || statusMap.pending;
};

// Format file size utility
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Generate unique ID
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Clamp number between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Check if value is empty
export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Deep merge objects
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T => {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {} as any, source[key] as any);
    } else {
      result[key] = source[key] as any;
    }
  }

  return result;
};

// Format date utility
export const formatDate = (date: Date | number, format: 'short' | 'long' | 'time' = 'short'): string => {
  const d = new Date(date);

  switch (format) {
    case 'short':
      return d.toLocaleDateString();
    case 'long':
      return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'time':
      return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return d.toLocaleDateString();
  }
};
