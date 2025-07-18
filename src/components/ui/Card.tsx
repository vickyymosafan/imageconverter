import React from 'react';
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
  CardDescription as ShadcnCardDescription,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter
} from './shadcn/card';
import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  children: React.ReactNode;
}

// Extended card variants for custom styling
const cardVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-md hover:shadow-lg",
        outlined: "bg-transparent border-2",
        glass: "glass-effect backdrop-blur-sm",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      hover: {
        true: "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      hover: false,
    },
  }
)

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  ...props
}) => {
  return (
    <ShadcnCard
      className={cn(
        cardVariants({ variant, padding, hover }),
        // Override shadcn/ui default padding when we have custom padding
        padding !== 'md' && 'py-0',
        className
      )}
      {...props}
    >
      {children}
    </ShadcnCard>
  );
};

export default Card;

// Card sub-components using shadcn/ui as base with backward compatibility
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <ShadcnCardHeader
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  >
    {children}
  </ShadcnCardHeader>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <ShadcnCardTitle
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100',
      className
    )}
    {...props}
  >
    {children}
  </ShadcnCardTitle>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <ShadcnCardDescription
    className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
    {...props}
  >
    {children}
  </ShadcnCardDescription>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <ShadcnCardContent className={cn('pt-0', className)} {...props}>
    {children}
  </ShadcnCardContent>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <ShadcnCardFooter
    className={cn('flex items-center pt-4', className)}
    {...props}
  >
    {children}
  </ShadcnCardFooter>
);
