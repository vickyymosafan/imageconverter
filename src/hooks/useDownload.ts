import { useState, useCallback } from 'react';
import { ConversionResult, DownloadOptions } from '../types';
import {
  downloadConversionResult,
  downloadAsZip,
  downloadAllIndividually,
  batchDownload,
} from '../utils/downloadUtils';

export interface UseDownloadReturn {
  isDownloading: boolean;
  downloadProgress: number;
  downloadSingle: (result: ConversionResult, filename?: string) => void;
  downloadMultiple: (results: ConversionResult[], options: DownloadOptions) => Promise<void>;
  downloadAll: (results: ConversionResult[], asZip?: boolean) => Promise<void>;
}

export const useDownload = (): UseDownloadReturn => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const downloadSingle = useCallback((result: ConversionResult, filename?: string) => {
    downloadConversionResult(result, filename);
  }, []);
  
  const downloadMultiple = useCallback(async (
    results: ConversionResult[],
    options: DownloadOptions
  ) => {
    if (isDownloading || results.length === 0) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      await batchDownload(results, {
        ...options,
        onProgress: (completed, total) => {
          setDownloadProgress((completed / total) * 100);
        },
        onError: (error) => {
          console.error('Kesalahan unduh:', error);
        },
      });
    } catch (error) {
      console.error('Unduhan gagal:', error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }, [isDownloading]);
  
  const downloadAll = useCallback(async (
    results: ConversionResult[],
    asZip: boolean = true
  ) => {
    if (results.length === 0) return;
    
    const options: DownloadOptions = {
      type: asZip ? 'zip' : 'individual',
      filename: asZip ? `converted_images_${Date.now()}.zip` : undefined,
    };
    
    await downloadMultiple(results, options);
  }, [downloadMultiple]);
  
  return {
    isDownloading,
    downloadProgress,
    downloadSingle,
    downloadMultiple,
    downloadAll,
  };
};
