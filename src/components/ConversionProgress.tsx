import React from 'react';
import { ConversionProgress as ConversionProgressType, ConversionResult } from '../types';
import { formatFileSize } from '../utils/fileUtils';
import ProgressBar from './ui/ProgressBar';

export interface ConversionProgressProps {
  progress: Record<string, ConversionProgressType>;
  results: ConversionResult[];
  totalFiles: number;
  isProcessing: boolean;
  onCancel?: () => void;
  className?: string;
}

const ConversionProgress: React.FC<ConversionProgressProps> = ({
  progress,
  results,
  totalFiles,
  isProcessing,
  onCancel,
  className = '',
}) => {
  const completedCount = results.length;
  const errorCount = Object.values(progress).filter(p => p.status === 'error').length;
  const processingCount = Object.values(progress).filter(p => p.status === 'processing').length;
  const pendingCount = Object.values(progress).filter(p => p.status === 'pending').length;
  
  const overallProgress = totalFiles > 0 ? (completedCount / totalFiles) * 100 : 0;
  
  const getOverallStatus = (): ConversionProgressType['status'] => {
    if (errorCount > 0 && completedCount === 0) return 'error';
    if (completedCount === totalFiles) return 'completed';
    if (processingCount > 0) return 'processing';
    return 'pending';
  };
  
  const getTotalStats = () => {
    const totalOriginalSize = results.reduce((sum, result) => sum + result.originalSize, 0);
    const totalConvertedSize = results.reduce((sum, result) => sum + result.convertedSize, 0);
    const totalSavings = totalOriginalSize - totalConvertedSize;
    const averageCompressionRatio = results.length > 0 
      ? results.reduce((sum, result) => sum + result.compressionRatio, 0) / results.length 
      : 0;
    
    return {
      totalOriginalSize,
      totalConvertedSize,
      totalSavings,
      averageCompressionRatio,
    };
  };
  
  const stats = getTotalStats();
  
  if (totalFiles === 0) {
    return null;
  }
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Progres Konversi
        </h3>
        
        {isProcessing && onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
          >
            Batal
          </button>
        )}
      </div>
      
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progres Keseluruhan
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedCount} dari {totalFiles} selesai
          </span>
        </div>
        
        <ProgressBar
          progress={overallProgress}
          status={getOverallStatus()}
          showPercentage={true}
          size="lg"
          animated={isProcessing}
        />
      </div>
      
      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {completedCount}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Selesai</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {processingCount}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Memproses</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {pendingCount}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Menunggu</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {errorCount}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Errors</div>
        </div>
      </div>
      
      {/* Statistics (only show if there are completed conversions) */}
      {completedCount > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Statistik Konversi
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Ukuran Asli:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatFileSize(stats.totalOriginalSize)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Ukuran Dikonversi:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatFileSize(stats.totalConvertedSize)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {stats.totalSavings >= 0 ? 'Ruang Dihemat:' : 'Ukuran Bertambah:'}
                </span>
                <span className={`font-medium ${
                  stats.totalSavings >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatFileSize(Math.abs(stats.totalSavings))}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Rata-rata Kompresi:</span>
                <span className={`font-medium ${
                  stats.averageCompressionRatio >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stats.averageCompressionRatio >= 0 ? '-' : '+'}{Math.abs(stats.averageCompressionRatio).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Summary */}
      {errorCount > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
            Kesalahan Konversi ({errorCount})
          </h4>
          
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {Object.entries(progress)
              .filter(([, p]) => p.status === 'error')
              .map(([id, p]) => (
                <div key={id} className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {p.error || 'Terjadi kesalahan yang tidak diketahui'}
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* Processing Animation */}
      {isProcessing && (
        <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <span>Mengkonversi gambar...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionProgress;
