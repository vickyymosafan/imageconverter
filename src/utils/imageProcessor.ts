import {
  SupportedFormat,
  ConversionOptions,
  ConversionResult,
  ImageFile,
  MIME_TYPES,
  AsyncResult,
} from '../types';

/**
 * Memuat gambar dari objek File
 */
export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal memuat gambar'));
    };
    
    img.src = url;
  });
};

/**
 * Get image dimensions from a File
 */
export const getImageDimensions = async (file: File): Promise<{ width: number; height: number }> => {
  const img = await loadImage(file);
  return { width: img.naturalWidth, height: img.naturalHeight };
};

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
export const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number,
  maintainAspectRatio: boolean = true
): { width: number; height: number } => {
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }
  
  if (!maintainAspectRatio) {
    return {
      width: targetWidth || originalWidth,
      height: targetHeight || originalHeight,
    };
  }
  
  const aspectRatio = originalWidth / originalHeight;
  
  if (targetWidth && targetHeight) {
    // Both dimensions specified, choose the one that maintains aspect ratio
    const widthBasedHeight = targetWidth / aspectRatio;
    const heightBasedWidth = targetHeight * aspectRatio;
    
    if (widthBasedHeight <= targetHeight) {
      return { width: targetWidth, height: widthBasedHeight };
    } else {
      return { width: heightBasedWidth, height: targetHeight };
    }
  }
  
  if (targetWidth) {
    return { width: targetWidth, height: targetWidth / aspectRatio };
  }
  
  if (targetHeight) {
    return { width: targetHeight * aspectRatio, height: targetHeight };
  }
  
  return { width: originalWidth, height: originalHeight };
};

/**
 * Convert image format using Canvas API
 */
export const convertImageFormat = async (
  imageFile: ImageFile,
  options: ConversionOptions
): Promise<AsyncResult<ConversionResult>> => {
  const startTime = performance.now();
  
  try {
    const img = await loadImage(imageFile.file);
    
    // Calculate target dimensions
    const { width, height } = calculateDimensions(
      img.naturalWidth,
      img.naturalHeight,
      options.width,
      options.height,
      options.maintainAspectRatio
    );
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return {
        success: false,
        error: 'Gagal mendapatkan konteks canvas',
      };
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Tangani transparansi untuk format yang tidak mendukungnya
    if (options.outputFormat === 'jpeg' || options.outputFormat === 'bmp') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }
    
    // Gambar gambar ke canvas
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to blob
    const mimeType = MIME_TYPES[options.outputFormat];
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mimeType, options.quality);
    });
    
    if (!blob) {
      return {
        success: false,
        error: 'Gagal mengkonversi gambar',
      };
    }
    
    // Buat data URL untuk pratinjau
    const convertedDataUrl = canvas.toDataURL(mimeType, options.quality);
    
    const endTime = performance.now();
    const processingTime = endTime - startTime;
    
    const result: ConversionResult = {
      id: imageFile.id,
      originalFile: imageFile,
      convertedBlob: blob,
      convertedDataUrl,
      outputFormat: options.outputFormat,
      originalSize: imageFile.size,
      convertedSize: blob.size,
      compressionRatio: ((imageFile.size - blob.size) / imageFile.size) * 100,
      processingTime,
    };
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui',
    };
  }
};

/**
 * Konversi batch beberapa gambar
 */
export const batchConvertImages = async (
  imageFiles: ImageFile[],
  options: ConversionOptions,
  onProgress?: (completed: number, total: number) => void
): Promise<AsyncResult<ConversionResult[]>> => {
  const results: ConversionResult[] = [];
  const errors: string[] = [];
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    const result = await convertImageFormat(imageFile, options);
    
    if (result.success) {
      results.push(result.data);
    } else {
      errors.push(`${imageFile.name}: ${result.error}`);
    }
    
    onProgress?.(i + 1, imageFiles.length);
  }
  
  if (errors.length > 0 && results.length === 0) {
    return {
      success: false,
      error: `All conversions failed: ${errors.join(', ')}`,
    };
  }
  
  if (errors.length > 0) {
    console.warn('Some conversions failed:', errors);
  }
  
  return {
    success: true,
    data: results,
  };
};

/**
 * Optimize image quality based on file size
 */
export const optimizeQuality = (
  originalSize: number,
  targetSize: number,
  currentQuality: number
): number => {
  const ratio = targetSize / originalSize;
  
  if (ratio > 1) {
    // Target size is larger, can increase quality
    return Math.min(currentQuality * 1.1, 0.95);
  } else if (ratio < 0.8) {
    // Target size is much smaller, decrease quality
    return Math.max(currentQuality * 0.9, 0.1);
  }
  
  return currentQuality;
};

/**
 * Get optimal format for image based on content
 */
export const getOptimalFormat = (
  imageFile: ImageFile,
  hasTransparency: boolean = false
): SupportedFormat => {
  // If image has transparency, prefer PNG or WebP
  if (hasTransparency) {
    return 'webp'; // WebP supports transparency and better compression
  }
  
  // For photos, JPEG or WebP are usually better
  if (imageFile.format === 'jpeg' || imageFile.format === 'bmp') {
    return 'webp'; // WebP usually provides better compression
  }
  
  // For graphics/screenshots, PNG might be better
  if (imageFile.format === 'png') {
    return 'png';
  }
  
  // Default to WebP for best compression
  return 'webp';
};

/**
 * Check if image has transparency
 */
export const hasTransparency = async (file: File): Promise<boolean> => {
  if (file.type === 'image/jpeg' || file.type === 'image/bmp') {
    return false; // These formats don't support transparency
  }
  
  try {
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return false;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Check alpha channel (every 4th value)
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) {
        return true; // Found transparent pixel
      }
    }
    
    return false;
  } catch {
    return false;
  }
};
