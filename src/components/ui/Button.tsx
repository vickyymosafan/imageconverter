import React from 'react';
import { Button as ShadcnButton } from './shadcn/button';
import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';
import { ButtonVariant, SizeVariant } from '../../types/common';
import { LoadingSpinner } from './common/LoadingStates';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: SizeVariant;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
}

// Extended button variants that map our custom variants to shadcn/ui
const extendedButtonVariants = cva(
  "",
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        outline: "",
        ghost: "",
        danger: "bg-red-600 hover:bg-red-700 text-white shadow-xs hover:bg-red-600/90 focus-visible:ring-red-600/20 dark:focus-visible:ring-red-600/40",
        success: "bg-green-600 hover:bg-green-700 text-white shadow-xs hover:bg-green-600/90 focus-visible:ring-green-600/20 dark:focus-visible:ring-green-600/40",
      },
      size: {
        xs: "h-7 px-2 text-xs gap-1",
        sm: "",
        md: "",
        lg: "",
        xl: "h-12 px-8 text-lg gap-3",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      rounded: {
        true: "rounded-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      rounded: false,
    },
  }
)

// Map our custom variants to shadcn/ui variants
const mapVariant = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return 'default';
    case 'danger':
      return 'destructive';
    case 'success':
      return 'default'; // We'll handle success styling with custom classes
    case 'secondary':
    case 'outline':
    case 'ghost':
      return variant;
    default:
      return 'default';
  }
};

// Map our custom sizes to shadcn/ui sizes
const mapSize = (size: ButtonProps['size']) => {
  switch (size) {
    case 'xs':
      return 'sm';
    case 'sm':
      return 'sm';
    case 'md':
      return 'default';
    case 'lg':
      return 'lg';
    case 'xl':
      return 'lg';
    default:
      return 'default';
  }
};

const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

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
  const shadcnVariant = mapVariant(variant);
  const shadcnSize = mapSize(size);

  return (
    <ShadcnButton
      variant={shadcnVariant as any}
      size={shadcnSize}
      disabled={disabled || loading}
      className={cn(
        extendedButtonVariants({
          variant,
          size,
          fullWidth,
          rounded
        }),
        fullWidth && 'w-full',
        rounded && 'rounded-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size={size} />
          {children && <span className="ml-2">{children}</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={cn(iconSizes[size], 'mr-2')}>{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className={cn(iconSizes[size], 'ml-2')}>{icon}</span>
          )}
        </>
      )}
    </ShadcnButton>
  );
};

export default Button;
