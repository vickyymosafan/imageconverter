import React from 'react';
import { ConversionStatus } from '../../types';

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
  
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-gray-300 dark:bg-gray-600';
      case 'processing':
        return 'bg-gradient-to-r from-primary-500 to-primary-600';
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
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
    <div className={`w-full ${className}`}>
      {(showPercentage || showStatus) && (
        <div className="flex justify-between items-center mb-1">
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
      
      <div className={`progress-bar ${sizeClasses[size]}`}>
        <div
          className={`progress-fill ${getStatusColor()} ${
            animated && status === 'processing' ? 'animate-pulse' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${getStatusText()} - ${Math.round(clampedProgress)}%`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
