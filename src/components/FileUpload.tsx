import React, { useCallback, useState, useRef } from 'react';
import { processImageFiles } from '../utils/fileUtils';
import { ImageFile } from '../types';
import Button from './ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/shadcn/tooltip';
import { Badge } from './ui/shadcn/badge';
import { UploadIcon, AddIcon, QualityIcon, CheckIcon } from './ui/common/Icons';
import { LoadingSpinner } from './ui/common/LoadingStates';

export interface FileUploadProps {
  onFilesAdded: (files: ImageFile[]) => void;
  onError: (errors: { file: string; error: string }[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesAdded,
  onError,
  disabled = false,
  maxFiles = Infinity,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    if (disabled || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const fileArray = Array.from(files);
      const { validFiles, errors } = await processImageFiles(fileArray);
      
      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
      
      if (errors.length > 0) {
        onError(errors);
      }
    } catch (error) {
      onError([{
        file: 'Unknown',
        error: error instanceof Error ? error.message : 'Failed to process files',
      }]);
    } finally {
      setIsProcessing(false);
    }
  }, [disabled, isProcessing, maxFiles, onFilesAdded, onError]);
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set drag over to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);
  
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    
    // Reset input value to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);
  
  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);
  
  const supportedFormats = ['JPEG', 'PNG', 'WebP', 'GIF', 'BMP'];
  
  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          drag-area cursor-pointer animate-fade-in-up
          ${isDragOver ? 'drag-over' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isProcessing ? 'pointer-events-none' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Unggah gambar dengan mengklik atau menyeret file ke sini"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <>
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Memproses file...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mohon tunggu sementara kami memvalidasi gambar Anda
                </p>
              </div>
            </>
          ) : (
            <>
              <div className={`transition-all duration-300 ${
                isDragOver ? 'scale-110 text-primary-500' : 'text-gray-400 dark:text-gray-500'
              }`}>
                <UploadIcon size="xl" />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {isDragOver ? 'Letakkan gambar di sini' : 'Unggah gambar Anda'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Seret dan lepas file di sini, atau{' '}
                  <span className="text-primary-600 dark:text-primary-400 font-medium">
                    klik untuk memilih
                  </span>
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Format yang didukung:
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {supportedFormats.map((format) => (
                      <Tooltip key={format}>
                        <TooltipTrigger>
                          <Badge variant="outline" className="text-xs">
                            {format.toUpperCase()}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Format {format.toUpperCase()} didukung</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center space-x-1">
                        <CheckIcon size="sm" />
                        <span>Tanpa batas file</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload sebanyak mungkin file tanpa batasan</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center space-x-1">
                        <QualityIcon size="sm" />
                        <span>Kualitas HD</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Konversi dengan kualitas tinggi 90-95%</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <AddIcon className="mr-2" size="sm" />
                    Pilih File
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Klik untuk membuka file browser</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
