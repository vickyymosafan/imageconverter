# 🖼️ Konverter Gambar - Image Converter

Aplikasi web modern untuk mengkonversi gambar ke berbagai format dengan kualitas tinggi. Dibangun dengan React, TypeScript, dan Tailwind CSS.

## ✨ Fitur Utama

- 🔄 **Multi-format Support**: Konversi antara JPEG, PNG, WebP, GIF, dan BMP
- 🎯 **HD Quality Preservation**: Mempertahankan kualitas tinggi (90-95%)
- 📁 **Drag & Drop Interface**: Antarmuka seret dan lepas yang modern
- ⚡ **Batch Processing**: Konversi beberapa file secara bersamaan
- 👀 **Real-time Preview**: Pratinjau sebelum/sesudah dengan perbandingan
- 📊 **Progress Indicators**: Indikator progres real-time untuk setiap file
- 📦 **Download Management**: Unduh individual atau bulk dalam ZIP
- 🌙 **Dark Mode**: Mode gelap/terang dengan toggle
- 📱 **Responsive Design**: Bekerja di semua ukuran layar
- ♾️ **Unlimited Upload**: Tanpa batas jumlah file dan ukuran file

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd convert

# Install dependencies
npm install

# Start development server
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser Anda.

## 📋 Workflow Penggunaan

### 1. 📤 Upload Gambar

#### Metode Upload:
- **Drag & Drop**: Seret file gambar ke area upload
- **Click to Browse**: Klik area upload untuk memilih file
- **Multiple Selection**: Pilih beberapa file sekaligus

#### Format yang Didukung:
- JPEG/JPG
- PNG
- WebP
- GIF
- BMP

#### Batasan:
- ♾️ **Unlimited**: Tanpa batas jumlah file
- 📏 **Ukuran**: Hingga 1GB per file

### 2. ⚙️ Pengaturan Konversi

#### Format Output:
- **JPEG**: Terbaik untuk foto, ukuran file lebih kecil
- **PNG**: Terbaik untuk grafik, mendukung transparansi
- **WebP**: Format modern, kompresi sangat baik
- **GIF**: Mendukung animasi, warna terbatas
- **BMP**: Tidak terkompresi, ukuran file besar

#### Kualitas:
- **Sangat Rendah**: 10-40% (file sangat kecil)
- **Rendah**: 40-60% (file kecil)
- **Sedang**: 60-80% (seimbang)
- **Tinggi**: 80-90% (kualitas baik)
- **Sangat Baik**: 90-95% (kualitas maksimal)

### 3. 🔄 Proses Konversi

#### Langkah Konversi:
1. **Validasi**: Sistem memvalidasi format file
2. **Preview**: Gambar ditampilkan dengan informasi detail
3. **Processing**: Konversi dimulai dengan indikator progres
4. **Completion**: File hasil konversi siap diunduh

#### Monitoring:
- **Progress Bar**: Progres individual per file
- **Overall Progress**: Progres keseluruhan batch
- **Statistics**: Statistik kompresi dan ukuran file
- **Error Handling**: Pesan error jika ada masalah

### 4. 📥 Download Hasil

#### Opsi Download:
- **Individual**: Unduh satu per satu file
- **Bulk ZIP**: Unduh semua file dalam satu ZIP
- **Preview**: Lihat perbandingan sebelum/sesudah

#### Informasi File:
- Ukuran file asli vs hasil konversi
- Persentase kompresi
- Waktu pemrosesan
- Format input dan output

## 🛠️ Development Workflow

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── FileUpload.tsx  # Drag & drop upload
│   ├── ImageConverter.tsx # Main converter
│   ├── ImagePreview.tsx   # Preview modal
│   └── ConversionProgress.tsx # Progress tracking
├── hooks/              # Custom React hooks
│   ├── useImageConverter.ts
│   ├── useFileUpload.ts
│   └── useDownload.ts
├── utils/              # Utility functions
│   ├── imageProcessor.ts # Image conversion logic
│   ├── fileUtils.ts     # File handling
│   └── downloadUtils.ts # Download & ZIP
├── types/              # TypeScript definitions
└── App.tsx            # Main application
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type Checking
npm run type-check   # TypeScript type checking
```

### Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting dan formatting
- **Tailwind CSS**: Utility-first CSS framework
- **React 19**: Latest React features

## 🔧 Technical Implementation

### Image Processing
- **Canvas API**: Client-side image conversion
- **Web Workers**: Heavy processing tanpa blocking UI
- **Memory Management**: Automatic cleanup untuk mencegah memory leaks
- **Progressive Loading**: Lazy loading untuk performa optimal

### Performance Optimization
- **Concurrent Processing**: Hingga 8 file diproses bersamaan
- **Hardware Detection**: Menyesuaikan dengan CPU cores
- **Batch Processing**: Efisien untuk file dalam jumlah besar
- **Compression**: Optimasi ukuran file hasil

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Canvas Support**: Required untuk image processing
- **File API**: Required untuk file handling
- **Download API**: Required untuk file download

## 🎨 UI/UX Features

### Design System
- **Tailwind CSS**: Utility-first styling
- **Dark Mode**: Automatic detection + manual toggle
- **Responsive**: Mobile-first design
- **Accessibility**: ARIA labels, keyboard navigation

### User Experience
- **Drag & Drop**: Intuitive file upload
- **Real-time Feedback**: Progress indicators
- **Error Handling**: User-friendly error messages
- **Preview System**: Before/after comparison

## 🔒 Security & Privacy

### Client-Side Processing
- **No Server Upload**: Semua pemrosesan di browser
- **Privacy First**: Gambar tidak pernah meninggalkan perangkat
- **Secure**: Tidak ada data yang dikirim ke server

### File Validation
- **Format Checking**: Validasi format file yang didukung
- **Error Handling**: Graceful error handling
- **Memory Safety**: Proper cleanup dan garbage collection

## 📊 Performance Metrics

### Optimization Features
- **Lazy Loading**: Components dimuat sesuai kebutuhan
- **Code Splitting**: Bundle optimization
- **Tree Shaking**: Unused code elimination
- **Compression**: Gzip compression untuk assets

### Monitoring
- **Conversion Time**: Tracking waktu pemrosesan
- **File Size Metrics**: Before/after comparison
- **Compression Ratio**: Efisiensi konversi
- **Error Tracking**: Monitoring kesalahan

## 📱 User Guide

### Step-by-Step Workflow

#### 1. Persiapan
```
1. Buka aplikasi di browser
2. Pastikan JavaScript diaktifkan
3. Siapkan file gambar yang akan dikonversi
```

#### 2. Upload File
```
1. Seret file ke area upload ATAU klik "Pilih File"
2. Pilih satu atau beberapa file gambar
3. Tunggu validasi format file
4. Lihat preview file yang berhasil diupload
```

#### 3. Konfigurasi
```
1. Pilih format output (JPEG, PNG, WebP, GIF, BMP)
2. Atur kualitas (untuk JPEG dan WebP)
3. Review pengaturan konversi
```

#### 4. Konversi
```
1. Klik tombol "Konversi X Gambar"
2. Monitor progres konversi real-time
3. Lihat statistik kompresi
4. Tunggu hingga semua file selesai
```

#### 5. Download
```
1. Preview hasil konversi (opsional)
2. Download individual file ATAU
3. Download semua file dalam ZIP
4. Verifikasi hasil konversi
```

## 🔧 Troubleshooting

### Common Issues

#### File Upload Gagal
- **Penyebab**: Format file tidak didukung
- **Solusi**: Gunakan format JPEG, PNG, WebP, GIF, atau BMP

#### Konversi Lambat
- **Penyebab**: File berukuran besar atau banyak file
- **Solusi**: Proses dalam batch kecil atau tunggu hingga selesai

#### Browser Crash
- **Penyebab**: Memory habis karena file terlalu besar
- **Solusi**: Refresh browser dan gunakan file lebih kecil

#### Download Tidak Berfungsi
- **Penyebab**: Browser memblokir download
- **Solusi**: Izinkan download di pengaturan browser

### Browser Requirements
- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## 🤝 Contributing

### Development Setup
```bash
# Fork dan clone repository
git clone https://github.com/your-username/image-converter.git
cd image-converter

# Install dependencies
npm install

# Start development
npm run dev

# Run tests (jika ada)
npm test

# Build untuk production
npm run build
```

### Contribution Guidelines
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **TypeScript**: Gunakan strict typing
- **ESLint**: Follow linting rules
- **Prettier**: Format code consistently
- **Comments**: Tulis komentar dalam bahasa Indonesia

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- **React Team** - Framework yang luar biasa
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety dan developer experience
- **Vite** - Fast build tool dan development server
- **JSZip** - ZIP file creation library

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. **Issues**: Buat issue di GitHub repository
2. **Documentation**: Baca dokumentasi lengkap
3. **Community**: Join diskusi di GitHub Discussions

---

**Dibuat dengan ❤️ menggunakan React, TypeScript, dan Tailwind CSS**

> **Note**: Aplikasi ini sepenuhnya berjalan di browser (client-side) dan tidak mengirim data ke server manapun. Privasi dan keamanan data Anda terjamin.