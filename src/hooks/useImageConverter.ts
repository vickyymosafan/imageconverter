import { useState, useCallback, useRef } from 'react';
import {
  ImageFile,
  ConversionOptions,
  ConversionResult,
  ConversionProgress,
  BatchConversionState,
} from '../types';
import { convertImageFormat } from '../utils/imageProcessor';

export interface UseImageConverterReturn {
  state: BatchConversionState;
  convertSingle: (imageFile: ImageFile, options: ConversionOptions) => Promise<void>;
  convertBatch: (imageFiles: ImageFile[], options: ConversionOptions) => Promise<void>;
  cancelConversion: () => void;
  clearResults: () => void;
  removeFile: (id: string) => void;
  updateOptions: (options: Partial<ConversionOptions>) => void;
}

const defaultOptions: ConversionOptions = {
  outputFormat: 'webp',
  quality: 0.9,
  maintainDimensions: true,
  maintainAspectRatio: true,
};

export const useImageConverter = (): UseImageConverterReturn => {
  const [state, setState] = useState<BatchConversionState>({
    files: [],
    results: [],
    progress: {},
    options: defaultOptions,
    isProcessing: false,
    completedCount: 0,
    totalCount: 0,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const updateProgress = useCallback((id: string, progress: Partial<ConversionProgress>) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [id]: {
          ...prev.progress[id],
          ...progress,
        },
      },
    }));
  }, []);
  
  const addResult = useCallback((result: ConversionResult) => {
    setState(prev => ({
      ...prev,
      results: [...prev.results, result],
      completedCount: prev.completedCount + 1,
    }));
  }, []);
  
  const convertSingle = useCallback(async (
    imageFile: ImageFile,
    options: ConversionOptions
  ) => {
    // Initialize progress
    updateProgress(imageFile.id, {
      id: imageFile.id,
      status: 'processing',
      progress: 0,
      startTime: Date.now(),
    });
    
    try {
      // Simulasi pembaruan progres
      const progressInterval = setInterval(() => {
        updateProgress(imageFile.id, {
          progress: Math.min(90, (Date.now() - Date.now()) / 100),
        });
      }, 100);
      
      const result = await convertImageFormat(imageFile, options);
      
      clearInterval(progressInterval);
      
      if (result.success) {
        updateProgress(imageFile.id, {
          status: 'completed',
          progress: 100,
          endTime: Date.now(),
        });
        
        addResult(result.data);
      } else {
        updateProgress(imageFile.id, {
          status: 'error',
          progress: 0,
          error: result.error,
          endTime: Date.now(),
        });
      }
    } catch (error) {
      updateProgress(imageFile.id, {
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        endTime: Date.now(),
      });
    }
  }, [updateProgress, addResult]);
  
  const convertBatch = useCallback(async (
    imageFiles: ImageFile[],
    options: ConversionOptions
  ) => {
    if (state.isProcessing) {
      return;
    }
    
    // Buat abort controller untuk pembatalan
    abortControllerRef.current = new AbortController();
    
    setState(prev => ({
      ...prev,
      files: imageFiles,
      results: [],
      progress: {},
      options,
      isProcessing: true,
      completedCount: 0,
      totalCount: imageFiles.length,
    }));
    
    // Inisialisasi progres untuk semua file
    const initialProgress: Record<string, ConversionProgress> = {};
    imageFiles.forEach(file => {
      initialProgress[file.id] = {
        id: file.id,
        status: 'pending',
        progress: 0,
      };
    });
    
    setState(prev => ({
      ...prev,
      progress: initialProgress,
    }));
    
    try {
      // Proses file dengan konkurensi yang lebih tinggi
      const maxConcurrent = Math.min(navigator.hardwareConcurrency || 4, 8);
      const chunks: ImageFile[][] = [];
      
      for (let i = 0; i < imageFiles.length; i += maxConcurrent) {
        chunks.push(imageFiles.slice(i, i + maxConcurrent));
      }
      
      for (const chunk of chunks) {
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }
        
        await Promise.all(
          chunk.map(file => convertSingle(file, options))
        );
      }
    } catch (error) {
      console.error('Kesalahan konversi batch:', error);
    } finally {
      setState(prev => ({
        ...prev,
        isProcessing: false,
      }));
      
      abortControllerRef.current = null;
    }
  }, [state.isProcessing, convertSingle]);
  
  const cancelConversion = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setState(prev => ({
      ...prev,
      isProcessing: false,
    }));
  }, []);
  
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      files: [],
      results: [],
      progress: {},
      completedCount: 0,
      totalCount: 0,
    }));
  }, []);
  
  const removeFile = useCallback((id: string) => {
    setState(prev => {
      const newProgress = { ...prev.progress };
      delete newProgress[id];
      
      return {
        ...prev,
        files: prev.files.filter(file => file.id !== id),
        results: prev.results.filter(result => result.id !== id),
        progress: newProgress,
        totalCount: Math.max(0, prev.totalCount - 1),
        completedCount: prev.results.filter(result => result.id !== id).length,
      };
    });
  }, []);
  
  const updateOptions = useCallback((newOptions: Partial<ConversionOptions>) => {
    setState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        ...newOptions,
      },
    }));
  }, []);
  
  return {
    state,
    convertSingle,
    convertBatch,
    cancelConversion,
    clearResults,
    removeFile,
    updateOptions,
  };
};
