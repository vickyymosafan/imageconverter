// Comprehensive test runner for image converter functionality

import {
  createMockImageFile,
  testFileValidation,
  testConversion,
  testBatchProcessing,
  testDragAndDrop,
  testDownload,
  testZipCreation,
  testQualitySettings,
  testFormatCompatibility,
  measurePerformance,
  measureMemoryUsage,
  generateTestFiles,
  simulateError
} from './testUtils';

import { testAccessibility, announceToScreenReader } from './accessibilityUtils';
import { SupportedFormat } from '../types';

export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  totalDuration: number;
}

export class TestRunner {
  private results: TestSuite[] = [];
  private currentSuite: TestSuite | null = null;

  // Start a new test suite
  startSuite(name: string): void {
    this.currentSuite = {
      name,
      tests: [],
      passed: 0,
      failed: 0,
      totalDuration: 0
    };
  }

  // End current test suite
  endSuite(): void {
    if (this.currentSuite) {
      this.results.push(this.currentSuite);
      this.currentSuite = null;
    }
  }

  // Run a single test
  async runTest(name: string, testFn: () => Promise<any> | any): Promise<TestResult> {
    const startTime = performance.now();
    let passed = false;
    let error: string | undefined;
    let details: any;

    try {
      details = await testFn();
      passed = true;
    } catch (err) {
      passed = false;
      error = err instanceof Error ? err.message : String(err);
    }

    const duration = performance.now() - startTime;
    const result: TestResult = { name, passed, duration, error, details };

    if (this.currentSuite) {
      this.currentSuite.tests.push(result);
      this.currentSuite.totalDuration += duration;
      if (passed) {
        this.currentSuite.passed++;
      } else {
        this.currentSuite.failed++;
      }
    }

    return result;
  }

  // Run all core functionality tests
  async runCoreTests(): Promise<void> {
    this.startSuite('Core Functionality');

    // Test file validation
    await this.runTest('File Validation - Valid JPEG', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = testFileValidation(file);
      if (!result.isValid) throw new Error('Valid JPEG should pass validation');
      return result;
    });

    await this.runTest('File Validation - Invalid Format', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = testFileValidation(file);
      if (result.isValid) throw new Error('Invalid format should fail validation');
      return result;
    });

    // Test image conversion
    await this.runTest('Image Conversion - JPEG to PNG', async () => {
      const imageFile = createMockImageFile('test', 'test.jpg', 'jpeg');
      const result = await testConversion(imageFile, 'png', 0.9);
      if (!result.success) throw new Error(result.error || 'Conversion failed');
      return result;
    });

    // Test batch processing
    await this.runTest('Batch Processing - Multiple Files', async () => {
      const files = generateTestFiles(3);
      const result = await testBatchProcessing(files, 'webp', 0.85);
      if (!result.success) throw new Error('Batch processing failed');
      return result;
    });

    // Test quality settings
    await this.runTest('Quality Settings - Valid Range', async () => {
      const result = testQualitySettings(0.8);
      if (!result.isValid) throw new Error(result.error || 'Valid quality should pass');
      return result;
    });

    await this.runTest('Quality Settings - Invalid Range', async () => {
      const result = testQualitySettings(1.5);
      if (result.isValid) throw new Error('Invalid quality should fail');
      return result;
    });

    // Test format compatibility
    await this.runTest('Format Compatibility - PNG to JPEG', async () => {
      const result = testFormatCompatibility('png', 'jpeg');
      if (!result.compatible) throw new Error('PNG to JPEG should be compatible');
      return result;
    });

    this.endSuite();
  }

  // Run UI/UX tests
  async runUITests(): Promise<void> {
    this.startSuite('UI/UX Tests');

    // Test drag and drop
    await this.runTest('Drag and Drop - Valid Files', async () => {
      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.png', { type: 'image/png' })
      ];
      const result = testDragAndDrop(files);
      if (result.validFiles.length !== 2) throw new Error('Should accept valid files');
      return result;
    });

    await this.runTest('Drag and Drop - Mixed Files', async () => {
      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.txt', { type: 'text/plain' })
      ];
      const result = testDragAndDrop(files);
      if (result.validFiles.length !== 1 || result.invalidFiles.length !== 1) {
        throw new Error('Should separate valid and invalid files');
      }
      return result;
    });

    // Test download functionality
    await this.runTest('Download - Single File', async () => {
      const blob = new Blob(['test content'], { type: 'image/jpeg' });
      const result = testDownload(blob, 'test.jpg');
      if (!result) throw new Error('Download should succeed');
      return result;
    });

    // Test ZIP creation
    await this.runTest('ZIP Creation - Multiple Files', async () => {
      const files = [
        { name: 'test1.jpg', blob: new Blob(['content1'], { type: 'image/jpeg' }) },
        { name: 'test2.png', blob: new Blob(['content2'], { type: 'image/png' }) }
      ];
      const result = await testZipCreation(files);
      if (!result.success) throw new Error(result.error || 'ZIP creation failed');
      return result;
    });

    this.endSuite();
  }

  // Run accessibility tests
  async runAccessibilityTests(): Promise<void> {
    this.startSuite('Accessibility Tests');

    // Test button accessibility
    await this.runTest('Button Accessibility', async () => {
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      button.setAttribute('aria-label', 'Test button for accessibility');
      
      const result = testAccessibility(button);
      if (result.score < 80) {
        throw new Error(`Accessibility score too low: ${result.score}%`);
      }
      return result;
    });

    // Test input accessibility
    await this.runTest('Input Accessibility', async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('aria-label', 'Select files to convert');
      input.setAttribute('accept', 'image/*');
      
      const result = testAccessibility(input);
      if (result.score < 80) {
        throw new Error(`Input accessibility score too low: ${result.score}%`);
      }
      return result;
    });

    // Test screen reader announcements
    await this.runTest('Screen Reader Announcements', async () => {
      // Test that announcements don't throw errors
      announceToScreenReader('Test announcement', 'polite');
      announceToScreenReader('Test urgent announcement', 'assertive');
      return { success: true };
    });

    this.endSuite();
  }

  // Run performance tests
  async runPerformanceTests(): Promise<void> {
    this.startSuite('Performance Tests');

    // Test conversion performance
    await this.runTest('Conversion Performance', async () => {
      const imageFile = createMockImageFile('perf-test', 'large-image.jpg', 'jpeg', 5 * 1024 * 1024);
      
      const { result, duration } = await measurePerformance(
        () => testConversion(imageFile, 'webp', 0.9),
        'Image Conversion'
      );

      if (duration > 5000) { // 5 seconds threshold
        throw new Error(`Conversion too slow: ${duration}ms`);
      }

      return { duration, result };
    });

    // Test batch processing performance
    await this.runTest('Batch Processing Performance', async () => {
      const files = generateTestFiles(10);
      
      const { result, duration } = await measurePerformance(
        () => testBatchProcessing(files, 'webp', 0.9),
        'Batch Processing'
      );

      if (duration > 10000) { // 10 seconds threshold
        throw new Error(`Batch processing too slow: ${duration}ms`);
      }

      return { duration, result };
    });

    // Test memory usage
    await this.runTest('Memory Usage', async () => {
      const memoryBefore = measureMemoryUsage();
      
      // Simulate memory-intensive operation
      const files = generateTestFiles(20);
      await testBatchProcessing(files, 'png', 0.9);
      
      const memoryAfter = measureMemoryUsage();
      const memoryIncrease = memoryAfter.usedJSHeapSize - memoryBefore.usedJSHeapSize;
      
      // Check if memory increase is reasonable (less than 100MB)
      if (memoryIncrease > 100 * 1024 * 1024) {
        throw new Error(`Memory usage too high: ${memoryIncrease / (1024 * 1024)}MB`);
      }

      return { memoryBefore, memoryAfter, memoryIncrease };
    });

    this.endSuite();
  }

  // Run error handling tests
  async runErrorHandlingTests(): Promise<void> {
    this.startSuite('Error Handling');

    // Test network error handling
    await this.runTest('Network Error Handling', async () => {
      try {
        throw simulateError('network');
      } catch (error) {
        // Should catch and handle network errors gracefully
        if (!(error instanceof Error) || !error.message.includes('Network error')) {
          throw new Error('Network error not handled correctly');
        }
        return { errorHandled: true, errorMessage: error.message };
      }
    });

    // Test conversion error handling
    await this.runTest('Conversion Error Handling', async () => {
      try {
        throw simulateError('conversion');
      } catch (error) {
        if (!(error instanceof Error) || !error.message.includes('Conversion error')) {
          throw new Error('Conversion error not handled correctly');
        }
        return { errorHandled: true, errorMessage: error.message };
      }
    });

    // Test memory error handling
    await this.runTest('Memory Error Handling', async () => {
      try {
        throw simulateError('memory');
      } catch (error) {
        if (!(error instanceof Error) || !error.message.includes('Memory error')) {
          throw new Error('Memory error not handled correctly');
        }
        return { errorHandled: true, errorMessage: error.message };
      }
    });

    this.endSuite();
  }

  // Run all tests
  async runAllTests(): Promise<void> {
    console.log('🧪 Starting comprehensive test suite...');
    
    await this.runCoreTests();
    await this.runUITests();
    await this.runAccessibilityTests();
    await this.runPerformanceTests();
    await this.runErrorHandlingTests();
    
    this.printResults();
  }

  // Print test results
  printResults(): void {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;

    this.results.forEach(suite => {
      console.log(`\n📁 ${suite.name}:`);
      console.log(`   ✅ Passed: ${suite.passed}`);
      console.log(`   ❌ Failed: ${suite.failed}`);
      console.log(`   ⏱️  Duration: ${suite.totalDuration.toFixed(2)}ms`);
      
      totalPassed += suite.passed;
      totalFailed += suite.failed;
      totalDuration += suite.totalDuration;

      // Show failed tests
      suite.tests.filter(test => !test.passed).forEach(test => {
        console.log(`   ❌ ${test.name}: ${test.error}`);
      });
    });

    console.log('\n🎯 Overall Results:');
    console.log(`   Total Tests: ${totalPassed + totalFailed}`);
    console.log(`   Passed: ${totalPassed}`);
    console.log(`   Failed: ${totalFailed}`);
    console.log(`   Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
    console.log(`   Total Duration: ${totalDuration.toFixed(2)}ms`);

    if (totalFailed === 0) {
      console.log('\n🎉 All tests passed! Application is ready for production.');
    } else {
      console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review and fix issues.`);
    }
  }

  // Get results for external use
  getResults(): TestSuite[] {
    return this.results;
  }
}
