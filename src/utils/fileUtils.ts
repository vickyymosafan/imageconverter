import {
  SupportedFormat,
  ImageFile,
  FileValidationResult,
  MIME_TYPES,
} from '../types';
import { getImageDimensions } from './imageProcessor';

/**
 * Menghasilkan ID unik untuk file
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Get file format from MIME type
 */
export const getFormatFromMimeType = (mimeType: string): SupportedFormat | null => {
  const formatEntries = Object.entries(MIME_TYPES) as [SupportedFormat, string][];
  const found = formatEntries.find(([, mime]) => mime === mimeType);
  return found ? found[0] : null;
};

/**
 * Get file format from file extension
 */
export const getFormatFromExtension = (filename: string): SupportedFormat | null => {
  const extension = filename.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'jpeg';
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    case 'gif':
      return 'gif';
    case 'bmp':
      return 'bmp';
    default:
      return null;
  }
};

/**
 * Validate if file is a supported image format
 */
export const validateImageFile = (file: File): FileValidationResult => {
  // Check MIME type first
  let format = getFormatFromMimeType(file.type);

  // If MIME type is not recognized, try file extension
  if (!format) {
    format = getFormatFromExtension(file.name);
  }

  if (!format) {
    return {
      isValid: false,
      error: 'Format file tidak didukung. Silakan gunakan file JPEG, PNG, WebP, GIF, atau BMP.',
    };
  }

  return {
    isValid: true,
    format,
  };
};

/**
 * Create preview data URL from file
 */
export const createPreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Gagal membaca file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Gagal membaca file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Convert File to ImageFile with validation and preview
 */
export const processImageFile = async (file: File): Promise<ImageFile | null> => {
  const validation = validateImageFile(file);
  
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  
  try {
    const [preview, dimensions] = await Promise.all([
      createPreviewUrl(file),
      getImageDimensions(file),
    ]);
    
    const imageFile: ImageFile = {
      id: generateId(),
      file,
      name: file.name,
      size: file.size,
      format: validation.format!,
      preview,
      dimensions,
    };
    
    return imageFile;
  } catch (error) {
    throw new Error(`Gagal memproses gambar: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
  }
};

/**
 * Process multiple files
 */
export const processImageFiles = async (files: File[]): Promise<{
  validFiles: ImageFile[];
  errors: { file: string; error: string }[];
}> => {
  const validFiles: ImageFile[] = [];
  const errors: { file: string; error: string }[] = [];
  
  for (const file of files) {
    try {
      const imageFile = await processImageFile(file);
      if (imageFile) {
        validFiles.push(imageFile);
      }
    } catch (error) {
      errors.push({
        file: file.name,
        error: error instanceof Error ? error.message : 'Kesalahan tidak diketahui',
      });
    }
  }
  
  return { validFiles, errors };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension for download
 */
export const getFileExtension = (format: SupportedFormat): string => {
  switch (format) {
    case 'jpeg':
      return '.jpg';
    case 'png':
      return '.png';
    case 'webp':
      return '.webp';
    case 'gif':
      return '.gif';
    case 'bmp':
      return '.bmp';
    default:
      return '.jpg';
  }
};

/**
 * Generate download filename
 */
export const generateDownloadFilename = (
  originalName: string,
  outputFormat: SupportedFormat
): string => {
  const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, '');
  const extension = getFileExtension(outputFormat);
  return `${nameWithoutExtension}_converted${extension}`;
};

/**
 * Check if browser supports a specific image format
 */
export const isFormatSupported = (format: SupportedFormat): boolean => {
  const canvas = document.createElement('canvas');
  const mimeType = MIME_TYPES[format];
  
  // Check if canvas can export to this format
  try {
    const dataUrl = canvas.toDataURL(mimeType, 0.5);
    return dataUrl.startsWith(`data:${mimeType}`);
  } catch {
    return false;
  }
};

/**
 * Get supported formats for current browser
 */
export const getSupportedFormats = (): SupportedFormat[] => {
  const allFormats: SupportedFormat[] = ['jpeg', 'png', 'webp', 'gif', 'bmp'];
  return allFormats.filter(isFormatSupported);
};

/**
 * Sanitize filename for download
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove or replace invalid characters
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

/**
 * Create blob URL for download
 */
export const createDownloadUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

/**
 * Revoke blob URL to free memory
 */
export const revokeDownloadUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Check if file is an animated GIF
 */
export const isAnimatedGif = async (file: File): Promise<boolean> => {
  if (file.type !== 'image/gif') {
    return false;
  }
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) {
        resolve(false);
        return;
      }
      
      const bytes = new Uint8Array(buffer);
      
      // Look for multiple image descriptors in GIF
      let imageCount = 0;
      for (let i = 0; i < bytes.length - 1; i++) {
        if (bytes[i] === 0x21 && bytes[i + 1] === 0xF9) {
          imageCount++;
          if (imageCount > 1) {
            resolve(true);
            return;
          }
        }
      }
      
      resolve(false);
    };
    
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 1024)); // Read first 1KB
  });
};
