import { useState, useCallback } from 'react';
import { ImageFile } from '../types';
import { processImageFiles } from '../utils/fileUtils';

export interface UseFileUploadReturn {
  files: ImageFile[];
  isProcessing: boolean;
  errors: { file: string; error: string }[];
  addFiles: (newFiles: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ file: string; error: string }[]>([]);
  
  const addFiles = useCallback(async (newFiles: File[]) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setErrors([]);
    
    try {
      const { validFiles, errors: processingErrors } = await processImageFiles(newFiles);
      
      if (validFiles.length > 0) {
        setFiles(prev => {
          // Hapus duplikat berdasarkan nama file dan ukuran
          const existingFiles = new Set(
            prev.map(file => `${file.name}-${file.size}`)
          );
          
          const uniqueNewFiles = validFiles.filter(
            file => !existingFiles.has(`${file.name}-${file.size}`)
          );
          
          return [...prev, ...uniqueNewFiles];
        });
      }
      
      if (processingErrors.length > 0) {
        setErrors(processingErrors);
      }
    } catch (error) {
      setErrors([{
        file: 'Tidak diketahui',
        error: error instanceof Error ? error.message : 'Gagal memproses file',
      }]);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);
  
  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);
  
  const clearFiles = useCallback(() => {
    setFiles([]);
    setErrors([]);
  }, []);
  
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);
  
  return {
    files,
    isProcessing,
    errors,
    addFiles,
    removeFile,
    clearFiles,
    clearErrors,
  };
};
