import React from 'react';
import { ConversionStatus } from '../../types';
import { cn } from '../../lib/utils';
import { Progress } from './shadcn/progress';

export interface ProgressBarProps {
  progress: number;
  status: ConversionStatus;
  showPercentage?: boolean;
  showStatus?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  showPercentage = true,
  showStatus = false,
  className = '',
  size = 'md',
  animated = true,
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  

  
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'processing':
        return 'Memproses';
      case 'completed':
        return 'Selesai';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };
  
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className={cn('w-full', className)}>
      {(showPercentage || showStatus) && (
        <div className="flex justify-between items-center mb-2">
          {showStatus && (
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {getStatusText()}
            </span>
          )}
          {showPercentage && (
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}

      <Progress
        value={clampedProgress}
        className={cn(
          sizeClasses[size],
          'transition-all duration-500 ease-out',
          animated && status === 'processing' && 'animate-pulse',
          // Custom progress colors based on status
          status === 'completed' && '[&>div]:bg-green-500',
          status === 'error' && '[&>div]:bg-red-500',
          status === 'processing' && '[&>div]:bg-primary-500',
          status === 'pending' && '[&>div]:bg-gray-400'
        )}
      />
    </div>
  );
};

export default ProgressBar;
