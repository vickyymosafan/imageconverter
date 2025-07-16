import React, { useState } from 'react';
import type { ImageFile, ConversionResult, SupportedFormat } from '../types';
import { useImageConverter } from '../hooks/useImageConverter';
import { useFileUpload } from '../hooks/useFileUpload';
import { useDownload } from '../hooks/useDownload';

import { Section, Grid, Flex } from './layout/AppLayout';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
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
    <Section
      spacing="lg"
      title="Konverter Gambar"
      description="Konversi gambar Anda ke berbagai format dengan kualitas tinggi"
    >
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
            <Grid cols={2} gap="lg" className="mb-6">
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

            <Flex direction="col" gap="sm" className="sm:flex-row">
              {/* Primary Action */}
              <Button
                onClick={handleStartConversion}
                disabled={!canStartConversion}
                loading={converter.state.isProcessing}
                className="flex-1"
                size="lg"
              >
                {converter.state.isProcessing ? 'Mengkonversi...' : `Konversi ${fileUpload.files.length} Gambar`}
              </Button>

              {/* Secondary Actions */}
              <Flex gap="sm" className="sm:flex-row">
                {hasResults && (
                  <Button
                    variant="outline"
                    onClick={handleDownloadAll}
                    disabled={download.isDownloading}
                    loading={download.isDownloading}
                    size="md"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                  >
                    Unduh ZIP
                  </Button>
                )}

                <Button
                  variant="ghost"
                  onClick={handleClearAll}
                  disabled={converter.state.isProcessing}
                  size="md"
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  }
                >
                  Hapus Semua
                </Button>
              </Flex>
            </Flex>
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

          <Grid cols={2} gap="md">
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
      {previewImage && (
        <ImagePreview
          original={previewImage.original}
          converted={previewImage.converted}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </Section>
  );
};

export default ImageConverter;
