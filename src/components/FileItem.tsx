import React from 'react';
import { ImageFile, ConversionResult, ConversionProgress } from '../types';
import { formatFileSize } from '../utils/fileUtils';
import { downloadConversionResult } from '../utils/downloadUtils';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';
import { Badge } from './ui/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/shadcn/tooltip';
import { PreviewIcon, DownloadIcon, RemoveIcon } from './ui/common/Icons';

export interface FileItemProps {
  imageFile: ImageFile;
  result?: ConversionResult;
  progress?: ConversionProgress;
  onRemove: (id: string) => void;
  onPreview: (imageFile: ImageFile, result?: ConversionResult) => void;
  showRemoveButton?: boolean;
  className?: string;
}

const FileItem: React.FC<FileItemProps> = ({
  imageFile,
  result,
  progress,
  onRemove,
  onPreview,
  showRemoveButton = true,
  className = '',
}) => {
  const handleDownload = () => {
    if (result) {
      downloadConversionResult(result);
    }
  };
  
  const handlePreview = () => {
    onPreview(imageFile, result);
  };
  
  const getStatusIcon = () => {
    if (!progress) return null;
    
    switch (progress.status) {
      case 'completed':
        return (
          <div className="w-5 h-5 text-green-500">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-5 h-5 text-red-500">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'processing':
        return (
          <div className="w-5 h-5 text-primary-500 animate-spin">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
    }
  };
  
  const getCompressionInfo = () => {
    if (!result) return null;
    
    const savings = result.originalSize - result.convertedSize;
    const isSmaller = savings > 0;
    
    return (
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Asli:</span>
          <span className="text-gray-900 dark:text-gray-100">
            {formatFileSize(result.originalSize)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Dikonversi:</span>
          <span className="text-gray-900 dark:text-gray-100">
            {formatFileSize(result.convertedSize)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">
            {isSmaller ? 'Dihemat:' : 'Bertambah:'}
          </span>
          <span className={isSmaller ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {formatFileSize(Math.abs(savings))} ({Math.abs(result.compressionRatio).toFixed(1)}%)
          </span>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`file-card hover-lift animate-fade-in-up ${className}`}>
      <div className="flex items-start space-x-3">
        {/* Image Preview */}
        <div className="flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handlePreview}
                className="relative group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <img
                  src={imageFile.preview}
                  alt={imageFile.name}
                  className="w-16 h-16 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Klik untuk melihat pratinjau gambar</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {imageFile.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {imageFile.format.toUpperCase()}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {formatFileSize(imageFile.size)}
                </Badge>
                {imageFile.dimensions && (
                  <Badge variant="outline" className="text-xs">
                    {imageFile.dimensions.width} × {imageFile.dimensions.height}
                  </Badge>
                )}
                {progress && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant={
                          progress.status === 'completed' ? 'success' :
                          progress.status === 'error' ? 'destructive' :
                          progress.status === 'processing' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {progress.status === 'completed' ? 'Selesai' :
                         progress.status === 'error' ? 'Error' :
                         progress.status === 'processing' ? 'Memproses' : 'Menunggu'}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Status: {progress.status}</p>
                      {progress.error && <p>Error: {progress.error}</p>}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-2">
              {getStatusIcon()}
              {showRemoveButton && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onRemove(imageFile.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <RemoveIcon size="sm" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hapus file dari daftar</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          {progress && progress.status !== 'pending' && (
            <div className="mt-3">
              <ProgressBar
                progress={progress.progress}
                status={progress.status}
                showPercentage={progress.status === 'processing'}
                size="sm"
              />
              {progress.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {progress.error}
                </p>
              )}
            </div>
          )}
          
          {/* Conversion Info */}
          {result && (
            <div className="mt-3 space-y-2">
              {getCompressionInfo()}
              
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePreview}
                      className="flex-1"
                    >
                      <PreviewIcon className="mr-1" size="sm" />
                      Pratinjau
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lihat perbandingan gambar asli dan hasil konversi</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={handleDownload}
                      className="flex-1"
                    >
                      <DownloadIcon className="mr-1" size="sm" />
                      Unduh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unduh file hasil konversi</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileItem;
