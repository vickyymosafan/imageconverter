import React from 'react';
import { SupportedFormat } from '../../types';
import { ToggleGroup, ToggleGroupItem } from './shadcn/toggle-group';
import { cn } from '../../lib/utils';

export interface FormatSelectorProps {
  selectedFormat: SupportedFormat;
  onFormatChange: (format: SupportedFormat) => void;
  disabled?: boolean;
  className?: string;
}

const formatLabels: Record<SupportedFormat, string> = {
  jpeg: 'JPEG',
  png: 'PNG',
  webp: 'WebP',
  gif: 'GIF',
  bmp: 'BMP',
};

const formatDescriptions: Record<SupportedFormat, string> = {
  jpeg: 'Terbaik untuk foto, ukuran file lebih kecil',
  png: 'Terbaik untuk grafik, mendukung transparansi',
  webp: 'Format modern, kompresi sangat baik',
  gif: 'Mendukung animasi, warna terbatas',
  bmp: 'Tidak terkompresi, ukuran file besar',
};

const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
  disabled = false,
  className = '',
}) => {
  const formats: SupportedFormat[] = ['jpeg', 'png', 'webp', 'gif', 'bmp'];
  
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Format Output
      </label>

      <ToggleGroup
        type="single"
        value={selectedFormat}
        onValueChange={(value) => value && onFormatChange(value as SupportedFormat)}
        variant="outline"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full"
        disabled={disabled}
      >
        {formats.map((format) => (
          <ToggleGroupItem
            key={format}
            value={format}
            className={cn(
              "relative p-3 h-auto flex-col gap-1 data-[state=on]:bg-primary-50 data-[state=on]:border-primary-500 dark:data-[state=on]:bg-primary-900/20",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            title={formatDescriptions[format]}
            disabled={disabled}
          >
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatLabels[format]}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                .{format === 'jpeg' ? 'jpg' : format}
              </div>
            </div>

            {selectedFormat === format && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        {formatDescriptions[selectedFormat]}
      </div>
    </div>
  );
};

export default FormatSelector;
