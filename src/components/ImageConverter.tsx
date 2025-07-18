import React, { useState, useEffect } from 'react';
import type { ImageFile, ConversionResult, SupportedFormat } from '../types';
import { useImageConverter } from '../hooks/useImageConverter';
import { useFileUpload } from '../hooks/useFileUpload';
import { useDownload } from '../hooks/useDownload';

import { Section, Grid } from './layout/AppLayout';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import FileUpload from './FileUpload';
import FileItem from './FileItem';
import ImagePreview from './ImagePreview';
import ConversionProgress from './ConversionProgress';
import Button from './ui/Button';
import FormatSelector from './ui/FormatSelector';
import QualitySlider from './ui/QualitySlider';
import { announceToScreenReader, announceProgress, announceSuccess, announceError } from '../utils/accessibilityUtils';

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
    announceToScreenReader(`${newFiles.length} file(s) added for conversion`, 'polite');
  };

  const handleFileRemove = (id: string) => {
    fileUpload.removeFile(id);
    converter.removeFile(id);
  };

  const handleStartConversion = () => {
    if (fileUpload.files.length > 0) {
      announceToScreenReader('Starting batch conversion...', 'polite');
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
      announceSuccess('Downloading all converted files', `${converter.state.results.length} files`);
      download.downloadAll(converter.state.results, true);
    }
  };

  const handleClearAll = () => {
    fileUpload.clearFiles();
    converter.clearResults();
  };

  const canStartConversion = fileUpload.files.length > 0 && !converter.state.isProcessing;
  const hasResults = converter.state.results.length > 0;

  // Announce conversion progress
  useEffect(() => {
    if (converter.state.isProcessing && converter.state.totalCount > 0) {
      const completed = converter.state.results.length;
      const total = converter.state.totalCount;

      if (completed > 0) {
        announceProgress(completed, total, 'Image conversion');
      }
    }
  }, [converter.state.results.length, converter.state.totalCount, converter.state.isProcessing]);

  // Announce conversion completion
  useEffect(() => {
    if (!converter.state.isProcessing && hasResults && converter.state.totalCount > 0) {
      const completed = converter.state.results.length;
      const total = converter.state.totalCount;

      if (completed === total) {
        announceSuccess('Batch conversion completed', `All ${total} files converted successfully`);
      } else if (completed > 0) {
        announceSuccess('Partial conversion completed', `${completed} of ${total} files converted`);
      }
    }
  }, [converter.state.isProcessing, hasResults, converter.state.results.length, converter.state.totalCount]);

  return (
    <Section
      spacing="lg"
      title="Konverter Gambar"
      description="Konversi gambar Anda ke berbagai format dengan kualitas tinggi"
      className="focus-within:ring-2 focus-within:ring-primary-500/20 rounded-lg"
    >
      {/* File Upload */}
      <FileUpload
        onFilesAdded={handleFilesAdded}
        onError={(errors) => {
          console.error('Kesalahan unggah:', errors);
          announceError('File upload failed', 'File Upload', errors.map(e => e.error));
        }}
        disabled={converter.state.isProcessing}
      />

      {/* Error Display */}
      {fileUpload.errors.length > 0 && (
        <Card variant="outlined" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200 text-sm">
              Kesalahan Unggah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 mb-4">
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
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/30"
            >
              Tutup
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Conversion Settings */}
      {fileUpload.files.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Pengaturan Konversi</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} gap="md" className="mb-6 sm:grid-cols-2 sm:gap-lg">
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
            </Grid>

            <div className="space-y-3 sm:space-y-0">
              {/* Primary Action */}
              <Button
                onClick={handleStartConversion}
                disabled={!canStartConversion}
                loading={converter.state.isProcessing}
                className="w-full min-h-[48px]"
                size="lg"
                aria-label={converter.state.isProcessing ? 'Converting images in progress' : `Convert ${fileUpload.files.length} images to ${converter.state.options.outputFormat} format`}
              >
                {converter.state.isProcessing ? 'Mengkonversi...' : `Konversi ${fileUpload.files.length} Gambar`}
              </Button>

              {/* Secondary Actions */}
              {(hasResults || !converter.state.isProcessing) && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {hasResults && (
                    <Button
                      variant="outline"
                      onClick={handleDownloadAll}
                      disabled={download.isDownloading}
                      loading={download.isDownloading}
                      size="md"
                      className="flex-1 min-h-[44px]"
                      aria-label={`Download all ${converter.state.results.length} converted images as ZIP file`}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      }
                    >
                      <span className="hidden sm:inline">Unduh ZIP</span>
                      <span className="sm:hidden">ZIP</span>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    onClick={handleClearAll}
                    disabled={converter.state.isProcessing}
                    size="md"
                    className="flex-1 min-h-[44px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    }
                  >
                    <span className="hidden sm:inline">Hapus Semua</span>
                    <span className="sm:hidden">Hapus</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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
        <Section spacing="md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              File ({fileUpload.files.length})
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {hasResults && `${converter.state.results.length} selesai`}
            </div>
          </div>

          <Grid cols={1} gap="md" className="sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
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
          </Grid>
        </Section>
      )}

      {/* Image Preview Modal */}
      <ImagePreview
        open={!!previewImage}
        original={previewImage?.original}
        converted={previewImage?.converted}
        onClose={() => setPreviewImage(null)}
      />
    </Section>
  );
};

export default ImageConverter;
