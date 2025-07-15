import React from 'react';
import { SupportedFormat } from '../../types';

export interface QualitySliderProps {
  quality: number;
  onQualityChange: (quality: number) => void;
  disabled?: boolean;
  format: SupportedFormat;
  className?: string;
}

const QualitySlider: React.FC<QualitySliderProps> = ({
  quality,
  onQualityChange,
  disabled = false,
  format,
  className = '',
}) => {
  // Beberapa format tidak mendukung pengaturan kualitas
  const supportsQuality = format === 'jpeg' || format === 'webp';
  
  if (!supportsQuality) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kualitas
        </label>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Pengaturan kualitas tidak tersedia untuk format {format.toUpperCase()}
        </div>
      </div>
    );
  }
  
  const percentage = Math.round(quality * 100);
  
  const getQualityLabel = (value: number) => {
    if (value >= 0.9) return 'Sangat Baik';
    if (value >= 0.8) return 'Tinggi';
    if (value >= 0.6) return 'Sedang';
    if (value >= 0.4) return 'Rendah';
    return 'Sangat Rendah';
  };
  
  const getQualityColor = (value: number) => {
    if (value >= 0.8) return 'text-green-600 dark:text-green-400';
    if (value >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kualitas
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {percentage}%
          </span>
          <span className={`text-xs font-medium ${getQualityColor(quality)}`}>
            {getQualityLabel(quality)}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={quality}
          onChange={(e) => onQualityChange(parseFloat(e.target.value))}
          disabled={disabled}
          className={`
            w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer
            slider-thumb:appearance-none slider-thumb:w-4 slider-thumb:h-4 slider-thumb:rounded-full
            slider-thumb:bg-primary-600 slider-thumb:cursor-pointer slider-thumb:border-0
            slider-thumb:shadow-md slider-thumb:transition-all slider-thumb:duration-200
            hover:slider-thumb:bg-primary-700 focus:slider-thumb:ring-2 focus:slider-thumb:ring-primary-500
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
        
        {/* Penanda kualitas */}
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>Rendah</span>
          <span>Sedang</span>
          <span>Tinggi</span>
          <span>Maks</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Kualitas lebih tinggi menghasilkan ukuran file lebih besar tetapi kejernihan gambar lebih baik
      </div>
    </div>
  );
};

export default QualitySlider;
