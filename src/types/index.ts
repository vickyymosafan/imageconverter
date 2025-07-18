// Re-export common types
export * from './common';

// Format gambar yang didukung
export type SupportedFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp';

// Pemetaan tipe MIME untuk format yang didukung
export const MIME_TYPES: Record<SupportedFormat, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
};

// Pemetaan ekstensi file
export const FILE_EXTENSIONS: Record<SupportedFormat, string> = {
  jpeg: '.jpg',
  png: '.png',
  webp: '.webp',
  gif: '.gif',
  bmp: '.bmp',
};

// Ukuran file maksimum (unlimited - 1GB sebagai batas praktis)
export const MAX_FILE_SIZE = 1024 * 1024 * 1024;

// Interface file gambar
export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  format: SupportedFormat;
  preview: string; // data URL for preview
  dimensions?: {
    width: number;
    height: number;
  };
}

// Conversion options interface
export interface ConversionOptions {
  outputFormat: SupportedFormat;
  quality: number; // 0.1 to 1.0
  maintainDimensions: boolean;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
}

// Conversion result interface
export interface ConversionResult {
  id: string;
  originalFile: ImageFile;
  convertedBlob: Blob;
  convertedDataUrl: string;
  outputFormat: SupportedFormat;
  originalSize: number;
  convertedSize: number;
  compressionRatio: number;
  processingTime: number; // in milliseconds
}

// Conversion progress status (extends StatusType)
export type ConversionStatus = 'pending' | 'processing' | 'completed' | 'error';

// Conversion progress interface
export interface ConversionProgress {
  id: string;
  status: ConversionStatus;
  progress: number; // 0 to 100
  error?: string;
  startTime?: number;
  endTime?: number;
}

// Batch conversion state
export interface BatchConversionState {
  files: ImageFile[];
  results: ConversionResult[];
  progress: Record<string, ConversionProgress>;
  options: ConversionOptions;
  isProcessing: boolean;
  completedCount: number;
  totalCount: number;
}

// Download options
export interface DownloadOptions {
  type: 'individual' | 'zip';
  filename?: string;
  includeOriginal?: boolean;
}

// Error types
export interface ConversionError {
  id: string;
  message: string;
  type: 'validation' | 'processing' | 'memory' | 'format' | 'network';
  timestamp: number;
}

// Theme type
export type Theme = 'light' | 'dark' | 'system';

// App settings
export interface AppSettings {
  theme: Theme;
  defaultQuality: number;
  defaultFormat: SupportedFormat;
  autoDownload: boolean;
  showPreview: boolean;
  maxConcurrentConversions: number;
}

// File validation result
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  format?: SupportedFormat;
}

// Utility type for async operations
export type AsyncResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

// Event handlers
export interface FileUploadHandlers {
  onFilesAdded: (files: ImageFile[]) => void;
  onFileRemoved: (id: string) => void;
  onValidationError: (error: ConversionError) => void;
}

export interface ConversionHandlers {
  onConversionStart: (id: string) => void;
  onConversionProgress: (id: string, progress: number) => void;
  onConversionComplete: (result: ConversionResult) => void;
  onConversionError: (id: string, error: string) => void;
}

// Component props interfaces
export interface DragDropProps {
  onFilesAdded: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  progress: number;
  status: ConversionStatus;
  showPercentage?: boolean;
  className?: string;
}

export interface ImagePreviewProps {
  original: ImageFile;
  converted?: ConversionResult;
  showComparison?: boolean;
  onClose: () => void;
}

export interface FormatSelectorProps {
  selectedFormat: SupportedFormat;
  onFormatChange: (format: SupportedFormat) => void;
  disabled?: boolean;
}

export interface QualitySliderProps {
  quality: number;
  onQualityChange: (quality: number) => void;
  disabled?: boolean;
  format: SupportedFormat;
}
