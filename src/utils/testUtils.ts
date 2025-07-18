// Test utilities for image converter functionality

import { ImageFile, SupportedFormat } from '../types';

// Mock file creation for testing
export const createMockFile = (
  name: string = 'test-image.jpg',
  type: string = 'image/jpeg',
  size: number = 1024 * 1024 // 1MB
): File => {
  const file = new File(['mock file content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Mock image file creation
export const createMockImageFile = (
  id: string = 'test-id',
  name: string = 'test-image.jpg',
  format: SupportedFormat = 'jpeg',
  size: number = 1024 * 1024,
  dimensions?: { width: number; height: number }
): ImageFile => {
  return {
    id,
    name,
    format,
    size,
    file: createMockFile(name, `image/${format}`, size),
    preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    dimensions: dimensions || { width: 800, height: 600 },
  };
};

// Test supported formats
export const testSupportedFormats = (): SupportedFormat[] => {
  return ['jpeg', 'png', 'webp', 'gif', 'bmp'];
};

// Test file validation
export const testFileValidation = (file: File): { isValid: boolean; error?: string } => {
  const supportedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp'
  ];

  if (!supportedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Format ${file.type} tidak didukung. Format yang didukung: ${supportedTypes.join(', ')}`
    };
  }

  // Test file size (max 50MB for testing)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Ukuran file terlalu besar. Maksimal ${maxSize / (1024 * 1024)}MB`
    };
  }

  return { isValid: true };
};

// Test conversion functionality
export const testConversion = async (
  imageFile: ImageFile,
  targetFormat: SupportedFormat,
  quality: number = 0.9
): Promise<{ success: boolean; error?: string; result?: Blob }> => {
  try {
    // Simulate conversion process
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create mock converted blob
    const mockBlob = new Blob(['converted image data'], { 
      type: `image/${targetFormat}` 
    });

    return {
      success: true,
      result: mockBlob
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed'
    };
  }
};

// Test batch processing
export const testBatchProcessing = async (
  files: ImageFile[],
  targetFormat: SupportedFormat,
  quality: number = 0.9
): Promise<{
  success: boolean;
  results: Array<{ file: ImageFile; success: boolean; error?: string }>;
}> => {
  const results = [];

  for (const file of files) {
    const result = await testConversion(file, targetFormat, quality);
    results.push({
      file,
      success: result.success,
      error: result.error
    });
  }

  const allSuccessful = results.every(r => r.success);

  return {
    success: allSuccessful,
    results
  };
};

// Test drag and drop functionality
export const testDragAndDrop = (files: File[]): {
  validFiles: File[];
  invalidFiles: Array<{ file: File; error: string }>;
} => {
  const validFiles: File[] = [];
  const invalidFiles: Array<{ file: File; error: string }> = [];

  files.forEach(file => {
    const validation = testFileValidation(file);
    if (validation.isValid) {
      validFiles.push(file);
    } else {
      invalidFiles.push({
        file,
        error: validation.error || 'Invalid file'
      });
    }
  });

  return { validFiles, invalidFiles };
};

// Test download functionality
export const testDownload = (blob: Blob, filename: string): boolean => {
  try {
    // Simulate download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Don't actually trigger download in test
    // link.click();
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Download test failed:', error);
    return false;
  }
};

// Test ZIP creation for batch download
export const testZipCreation = async (files: Array<{ name: string; blob: Blob }>): Promise<{
  success: boolean;
  zipBlob?: Blob;
  error?: string;
}> => {
  try {
    // Simulate ZIP creation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const mockZipBlob = new Blob(['mock zip content'], { 
      type: 'application/zip' 
    });

    return {
      success: true,
      zipBlob: mockZipBlob
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ZIP creation failed'
    };
  }
};

// Test quality settings
export const testQualitySettings = (quality: number): {
  isValid: boolean;
  normalizedQuality: number;
  error?: string;
} => {
  if (quality < 0.1 || quality > 1) {
    return {
      isValid: false,
      normalizedQuality: Math.max(0.1, Math.min(1, quality)),
      error: 'Quality must be between 0.1 and 1.0'
    };
  }

  return {
    isValid: true,
    normalizedQuality: quality
  };
};

// Test format compatibility
export const testFormatCompatibility = (
  sourceFormat: SupportedFormat,
  targetFormat: SupportedFormat
): {
  compatible: boolean;
  warning?: string;
} => {
  // Special cases for format compatibility
  if (sourceFormat === 'gif' && targetFormat !== 'gif') {
    return {
      compatible: true,
      warning: 'Converting from GIF will lose animation'
    };
  }

  if (sourceFormat === 'png' && ['jpeg', 'jpg'].includes(targetFormat)) {
    return {
      compatible: true,
      warning: 'Converting from PNG to JPEG will lose transparency'
    };
  }

  return { compatible: true };
};

// Performance testing utilities
export const measurePerformance = async <T>(
  operation: () => Promise<T>,
  label: string = 'Operation'
): Promise<{ result: T; duration: number }> => {
  const startTime = performance.now();
  const result = await operation();
  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`${label} took ${duration.toFixed(2)}ms`);

  return { result, duration };
};

// Memory usage testing
export const measureMemoryUsage = (): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }

  return {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
  };
};

// Accessibility testing helpers
export const testAccessibility = (element: HTMLElement): {
  hasAriaLabel: boolean;
  hasRole: boolean;
  isKeyboardAccessible: boolean;
  hasFocusIndicator: boolean;
} => {
  return {
    hasAriaLabel: element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby'),
    hasRole: element.hasAttribute('role'),
    isKeyboardAccessible: element.tabIndex >= 0 || element.tagName === 'BUTTON' || element.tagName === 'A',
    hasFocusIndicator: getComputedStyle(element, ':focus').outline !== 'none'
  };
};

// Error simulation for testing
export const simulateError = (type: 'network' | 'conversion' | 'memory' | 'file'): Error => {
  const errors = {
    network: new Error('Network error: Failed to upload file'),
    conversion: new Error('Conversion error: Unsupported format'),
    memory: new Error('Memory error: Not enough memory to process file'),
    file: new Error('File error: File is corrupted or invalid')
  };

  return errors[type];
};

// Test data generators
export const generateTestFiles = (count: number = 5): ImageFile[] => {
  const formats: SupportedFormat[] = ['jpeg', 'png', 'webp', 'gif', 'bmp'];
  const files: ImageFile[] = [];

  for (let i = 0; i < count; i++) {
    const format = formats[i % formats.length];
    files.push(createMockImageFile(
      `test-${i}`,
      `test-image-${i}.${format}`,
      format,
      Math.random() * 5 * 1024 * 1024, // Random size up to 5MB
      {
        width: Math.floor(Math.random() * 2000) + 500,
        height: Math.floor(Math.random() * 2000) + 500
      }
    ));
  }

  return files;
};
