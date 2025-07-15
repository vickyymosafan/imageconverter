import React, { useState } from 'react';
import type { ImageFile, ConversionResult, SupportedFormat } from '../types';
import { useImageConverter } from '../hooks/useImageConverter';
import { useFileUpload } from '../hooks/useFileUpload';
import { useDownload } from '../hooks/useDownload';

import FileUpload from './FileUpload';
import FileItem from './FileItem';
import ImagePreview from './ImagePreview';
import ConversionProgress from './ConversionProgress';
import Button from './ui/Button';
import FormatSelector from './ui/FormatSelector';
import QualitySlider from './ui/QualitySlider';

const ImageConverter: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<{
    original: ImageFile;
    converted?: ConversionResult;
  } | null>(null);
  
  const fileUpload = useFileUpload();
  const converter = useImageConverter();
  const download = useDownload();
  
  const handleFilesAdded = (newFiles: ImageFile[]) => {
    fileUpload.addFiles(newFiles.map(f => f.file));
  };
  
  const handleFileRemove = (id: string) => {
    fileUpload.removeFile(id);
    converter.removeFile(id);
  };
  
  const handleStartConversion = () => {
    if (fileUpload.files.length > 0) {
      converter.convertBatch(fileUpload.files, converter.state.options);
    }
  };
  
  const handlePreview = (imageFile: ImageFile, result?: ConversionResult) => {
    setPreviewImage({ original: imageFile, converted: result });
  };
  
  const handleFormatChange = (format: SupportedFormat) => {
    converter.updateOptions({ outputFormat: format });
  };
  
  const handleQualityChange = (quality: number) => {
    converter.updateOptions({ quality });
  };
  
  const handleDownloadAll = () => {
    if (converter.state.results.length > 0) {
      download.downloadAll(converter.state.results, true);
    }
  };
  
  const handleClearAll = () => {
    fileUpload.clearFiles();
    converter.clearResults();
  };
  
  const canStartConversion = fileUpload.files.length > 0 && !converter.state.isProcessing;
  const hasResults = converter.state.results.length > 0;
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Konverter Gambar
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Konversi gambar Anda ke berbagai format dengan kualitas tinggi
        </p>
      </div>
      
      {/* File Upload */}
      <FileUpload
        onFilesAdded={handleFilesAdded}
        onError={(errors) => {
          console.error('Kesalahan unggah:', errors);
        }}
        disabled={converter.state.isProcessing}
      />
      
      {/* Error Display */}
      {fileUpload.errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Kesalahan Unggah
          </h3>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {fileUpload.errors.map((error, index) => (
              <li key={index}>
                <strong>{error.file}:</strong> {error.error}
              </li>
            ))}
          </ul>
          <Button
            size="sm"
            variant="outline"
            onClick={fileUpload.clearErrors}
            className="mt-2"
          >
            Tutup
          </Button>
        </div>
      )}
      
      {/* Conversion Settings */}
      {fileUpload.files.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Pengaturan Konversi
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormatSelector
              selectedFormat={converter.state.options.outputFormat}
              onFormatChange={handleFormatChange}
              disabled={converter.state.isProcessing}
            />
            
            <QualitySlider
              quality={converter.state.options.quality}
              onQualityChange={handleQualityChange}
              disabled={converter.state.isProcessing}
              format={converter.state.options.outputFormat}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              onClick={handleStartConversion}
              disabled={!canStartConversion}
              loading={converter.state.isProcessing}
              className="flex-1 sm:flex-auto"
              fullWidth
            >
              {converter.state.isProcessing ? 'Mengkonversi...' : `Konversi ${fileUpload.files.length} Gambar`}
            </Button>

            {hasResults && (
              <Button
                variant="outline"
                onClick={handleDownloadAll}
                disabled={download.isDownloading}
                loading={download.isDownloading}
                className="sm:flex-none"
                fullWidth
              >
                Unduh ZIP
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={handleClearAll}
              disabled={converter.state.isProcessing}
              className="sm:flex-none"
              fullWidth
            >
              Hapus Semua
            </Button>
          </div>
        </div>
      )}
      
      {/* Conversion Progress */}
      {(converter.state.isProcessing || hasResults) && (
        <ConversionProgress
          progress={converter.state.progress}
          results={converter.state.results}
          totalFiles={converter.state.totalCount}
          isProcessing={converter.state.isProcessing}
          onCancel={converter.cancelConversion}
        />
      )}
      
      {/* File List */}
      {fileUpload.files.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            File ({fileUpload.files.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fileUpload.files.map((file) => {
              const result = converter.state.results.find(r => r.id === file.id);
              const progress = converter.state.progress[file.id];
              
              return (
                <FileItem
                  key={file.id}
                  imageFile={file}
                  result={result}
                  progress={progress}
                  onRemove={handleFileRemove}
                  onPreview={handlePreview}
                  showRemoveButton={!converter.state.isProcessing}
                />
              );
            })}
          </div>
        </div>
      )}
      
      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreview
          original={previewImage.original}
          converted={previewImage.converted}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
};

export default ImageConverter;
