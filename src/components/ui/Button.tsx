import React from 'react';
import { cn, focusRing, disabledState } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'border border-transparent',
    'active:scale-95',
    focusRing(),
    disabledState(disabled || loading),
    rounded ? 'rounded-full' : 'rounded-lg',
    fullWidth && 'w-full'
  );

  const variantClasses = {
    primary: cn(
      'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
      'hover:shadow-md hover:-translate-y-0.5',
      'dark:bg-primary-500 dark:hover:bg-primary-600'
    ),
    secondary: cn(
      'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-sm',
      'dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
      'hover:shadow-md hover:-translate-y-0.5'
    ),
    outline: cn(
      'border-2 border-primary-600 text-primary-600 bg-transparent',
      'hover:bg-primary-50 hover:border-primary-700',
      'dark:border-primary-400 dark:text-primary-400',
      'dark:hover:bg-primary-900/20 dark:hover:border-primary-300'
    ),
    ghost: cn(
      'text-gray-600 bg-transparent hover:bg-gray-100',
      'dark:text-gray-400 dark:hover:bg-gray-800',
      'hover:text-gray-900 dark:hover:text-gray-100'
    ),
    danger: cn(
      'bg-red-600 hover:bg-red-700 text-white shadow-sm',
      'hover:shadow-md hover:-translate-y-0.5',
      'dark:bg-red-500 dark:hover:bg-red-600'
    ),
    success: cn(
      'bg-green-600 hover:bg-green-700 text-white shadow-sm',
      'hover:shadow-md hover:-translate-y-0.5',
      'dark:bg-green-500 dark:hover:bg-green-600'
    ),
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3',
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  };

  const LoadingSpinner = () => (
    <svg
      className={cn('animate-spin', iconSizes[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          {children && <span className="ml-2">{children}</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
