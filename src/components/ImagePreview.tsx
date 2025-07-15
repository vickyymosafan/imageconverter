import React, { useState } from 'react';
import { ImageFile, ConversionResult } from '../types';
import { formatFileSize } from '../utils/fileUtils';
import Button from './ui/Button';

export interface ImagePreviewProps {
  original: ImageFile;
  converted?: ConversionResult;
  showComparison?: boolean;
  onClose: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  original,
  converted,
  showComparison = true,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'original' | 'converted'>('original');
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  const renderImageInfo = (file: ImageFile | ConversionResult, title: string) => (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Format:</span>
          <span className="font-medium">
            {'outputFormat' in file ? file.outputFormat.toUpperCase() : file.format.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Ukuran:</span>
          <span className="font-medium">
            {formatFileSize('convertedSize' in file ? file.convertedSize : file.size)}
          </span>
        </div>
        {'dimensions' in file && file.dimensions && (
          <div className="flex justify-between">
            <span>Dimensi:</span>
            <span className="font-medium">
              {file.dimensions.width} × {file.dimensions.height}
            </span>
          </div>
        )}
        {'processingTime' in file && (
          <div className="flex justify-between">
            <span>Pemrosesan:</span>
            <span className="font-medium">{file.processingTime.toFixed(0)}ms</span>
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="preview-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Pratinjau Gambar - {original.name}
          </h2>
          
          <div className="flex items-center space-x-2">
            {converted && showComparison && (
              <Button
                size="sm"
                variant={isComparisonMode ? 'primary' : 'outline'}
                onClick={() => setIsComparisonMode(!isComparisonMode)}
              >
                {isComparisonMode ? 'Keluar Perbandingan' : 'Bandingkan'}
              </Button>
            )}
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Tutup pratinjau"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col lg:flex-row h-full max-h-[calc(100vh-8rem)]">
          {/* Image Display */}
          <div className="flex-1 flex flex-col">
            {/* Tabs (only show if converted image exists and not in comparison mode) */}
            {converted && !isComparisonMode && (
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('original')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'original'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Asli
                </button>
                <button
                  onClick={() => setActiveTab('converted')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'converted'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Dikonversi
                </button>
              </div>
            )}
            
            {/* Image Container */}
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
              {isComparisonMode && converted ? (
                /* Side-by-side comparison */
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  <div className="flex flex-col items-center justify-center p-4 border-r border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Original
                    </div>
                    <img
                      src={original.preview}
                      alt="Original"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Converted
                    </div>
                    <img
                      src={converted.convertedDataUrl}
                      alt="Converted"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                /* Single image view */
                <div className="flex items-center justify-center h-full p-4">
                  <img
                    src={
                      activeTab === 'converted' && converted
                        ? converted.convertedDataUrl
                        : original.preview
                    }
                    alt={activeTab === 'converted' ? 'Gambar dikonversi' : 'Gambar asli'}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Info Panel */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Original Image Info */}
              {renderImageInfo(original, 'Gambar Asli')}
              
              {/* Converted Image Info */}
              {converted && (
                <>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  {renderImageInfo(converted, 'Gambar Dikonversi')}
                  
                  {/* Conversion Stats */}
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Statistik Konversi
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Kompresi:</span>
                        <span className={`font-medium ${
                          converted.compressionRatio > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {converted.compressionRatio > 0 ? '-' : '+'}{Math.abs(converted.compressionRatio).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Perubahan Ukuran:</span>
                        <span className={`font-medium ${
                          converted.convertedSize < converted.originalSize
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatFileSize(Math.abs(converted.convertedSize - converted.originalSize))}
                          {converted.convertedSize < converted.originalSize ? ' dihemat' : ' lebih besar'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
