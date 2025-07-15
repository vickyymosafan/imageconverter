import JSZip from 'jszip';
import {
  ConversionResult,
  DownloadOptions,
  AsyncResult,
} from '../types';
import {
  generateDownloadFilename,
  sanitizeFilename,
  createDownloadUrl,
  revokeDownloadUrl,
} from './fileUtils';

/**
 * Unduh satu file
 */
export const downloadFile = (
  blob: Blob,
  filename: string
): void => {
  const url = createDownloadUrl(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = sanitizeFilename(filename);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Bersihkan URL setelah jeda singkat
  setTimeout(() => {
    revokeDownloadUrl(url);
  }, 100);
};

/**
 * Download conversion result
 */
export const downloadConversionResult = (
  result: ConversionResult,
  customFilename?: string
): void => {
  const filename = customFilename || generateDownloadFilename(
    result.originalFile.name,
    result.outputFormat
  );
  
  downloadFile(result.convertedBlob, filename);
};

/**
 * Create ZIP file from multiple conversion results
 */
export const createZipFromResults = async (
  results: ConversionResult[],
  options: {
    includeOriginal?: boolean;
    zipFilename?: string;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<AsyncResult<Blob>> => {
  try {
    const zip = new JSZip();
    const totalFiles = results.length * (options.includeOriginal ? 2 : 1);
    let processedFiles = 0;
    
    // Add converted files to ZIP
    for (const result of results) {
      const convertedFilename = generateDownloadFilename(
        result.originalFile.name,
        result.outputFormat
      );
      
      zip.file(sanitizeFilename(convertedFilename), result.convertedBlob);
      processedFiles++;
      
      if (options.onProgress) {
        options.onProgress((processedFiles / totalFiles) * 50); // 50% untuk menambahkan file
      }
      
      // Tambahkan file asli jika diminta
      if (options.includeOriginal) {
        const originalFilename = `original_${result.originalFile.name}`;
        zip.file(sanitizeFilename(originalFilename), result.originalFile.file);
        processedFiles++;
        
        if (options.onProgress) {
          options.onProgress((processedFiles / totalFiles) * 50);
        }
      }
    }
    
    // Generate ZIP blob
    const zipBlob = await zip.generateAsync(
      {
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6,
        },
      },
      (metadata) => {
        if (options.onProgress) {
          // 50% untuk menambahkan file + 50% untuk kompresi
          const compressionProgress = 50 + (metadata.percent * 0.5);
          options.onProgress(compressionProgress);
        }
      }
    );
    
    return {
      success: true,
      data: zipBlob,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal membuat file ZIP',
    };
  }
};

/**
 * Download multiple files as ZIP
 */
export const downloadAsZip = async (
  results: ConversionResult[],
  options: {
    includeOriginal?: boolean;
    zipFilename?: string;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<AsyncResult<void>> => {
  if (results.length === 0) {
    return {
      success: false,
      error: 'Tidak ada file untuk diunduh',
    };
  }
  
  const zipResult = await createZipFromResults(results, options);
  
  if (!zipResult.success) {
    return zipResult;
  }
  
  const filename = options.zipFilename || `converted_images_${Date.now()}.zip`;
  downloadFile(zipResult.data, filename);
  
  return {
    success: true,
    data: undefined,
  };
};

/**
 * Download all results individually
 */
export const downloadAllIndividually = (
  results: ConversionResult[],
  delay: number = 100
): void => {
  results.forEach((result, index) => {
    setTimeout(() => {
      downloadConversionResult(result);
    }, index * delay);
  });
};

/**
 * Get download statistics
 */
export const getDownloadStats = (results: ConversionResult[]): {
  totalFiles: number;
  totalOriginalSize: number;
  totalConvertedSize: number;
  averageCompressionRatio: number;
  totalSavings: number;
} => {
  const totalFiles = results.length;
  const totalOriginalSize = results.reduce((sum, result) => sum + result.originalSize, 0);
  const totalConvertedSize = results.reduce((sum, result) => sum + result.convertedSize, 0);
  const averageCompressionRatio = results.reduce((sum, result) => sum + result.compressionRatio, 0) / totalFiles;
  const totalSavings = totalOriginalSize - totalConvertedSize;
  
  return {
    totalFiles,
    totalOriginalSize,
    totalConvertedSize,
    averageCompressionRatio,
    totalSavings,
  };
};

/**
 * Estimate ZIP file size
 */
export const estimateZipSize = (results: ConversionResult[], includeOriginal: boolean = false): number => {
  let totalSize = 0;
  
  for (const result of results) {
    // Converted file size
    totalSize += result.convertedSize;
    
    // Original file size if included
    if (includeOriginal) {
      totalSize += result.originalSize;
    }
  }
  
  // ZIP compression typically reduces size by 10-20% for images
  return Math.round(totalSize * 0.85);
};

/**
 * Check if browser supports downloads
 */
export const isDownloadSupported = (): boolean => {
  const link = document.createElement('a');
  return typeof link.download !== 'undefined';
};

/**
 * Create shareable link for results (for future implementation)
 */
export const createShareableLink = async (
  _results: ConversionResult[]
): Promise<AsyncResult<string>> => {
  // This would typically upload to a cloud service
  // For now, return a placeholder
  return {
    success: false,
    error: 'Sharing feature not implemented yet',
  };
};

/**
 * Batch download with progress tracking
 */
export const batchDownload = async (
  results: ConversionResult[],
  options: DownloadOptions & {
    onProgress?: (completed: number, total: number) => void;
    onError?: (error: string) => void;
  }
): Promise<void> => {
  try {
    if (options.type === 'zip') {
      await downloadAsZip(results, {
        includeOriginal: options.includeOriginal,
        zipFilename: options.filename,
        onProgress: (progress) => {
          options.onProgress?.(Math.round(progress), 100);
        },
      });
    } else {
      // Individual downloads
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        downloadConversionResult(result);
        
        options.onProgress?.(i + 1, results.length);
        
        // Small delay between downloads to prevent browser blocking
        if (i < results.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Download failed';
    options.onError?.(errorMessage);
  }
};

/**
 * Generate download report
 */
export const generateDownloadReport = (results: ConversionResult[]): string => {
  const stats = getDownloadStats(results);
  const timestamp = new Date().toLocaleString();
  
  let report = `Image Conversion Report - ${timestamp}\n`;
  report += `${'='.repeat(50)}\n\n`;
  report += `Total Files Processed: ${stats.totalFiles}\n`;
  report += `Original Total Size: ${(stats.totalOriginalSize / (1024 * 1024)).toFixed(2)} MB\n`;
  report += `Converted Total Size: ${(stats.totalConvertedSize / (1024 * 1024)).toFixed(2)} MB\n`;
  report += `Average Compression: ${stats.averageCompressionRatio.toFixed(1)}%\n`;
  report += `Total Space Saved: ${(stats.totalSavings / (1024 * 1024)).toFixed(2)} MB\n\n`;
  
  report += `File Details:\n`;
  report += `${'-'.repeat(50)}\n`;
  
  results.forEach((result, index) => {
    report += `${index + 1}. ${result.originalFile.name}\n`;
    report += `   Format: ${result.originalFile.format.toUpperCase()} → ${result.outputFormat.toUpperCase()}\n`;
    report += `   Size: ${(result.originalSize / 1024).toFixed(1)} KB → ${(result.convertedSize / 1024).toFixed(1)} KB\n`;
    report += `   Compression: ${result.compressionRatio.toFixed(1)}%\n`;
    report += `   Processing Time: ${result.processingTime.toFixed(0)}ms\n\n`;
  });
  
  return report;
};
