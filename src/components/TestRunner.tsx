import React, { useState, useCallback } from 'react';
import { TestRunner, TestSuite, TestResult } from '../utils/testRunner';
import Button from './ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/shadcn/badge';
import { Progress } from './ui/shadcn/progress';
import { CheckIcon, ErrorIcon, InfoIcon } from './ui/common/Icons';

interface TestRunnerComponentProps {
  onClose?: () => void;
}

const TestRunnerComponent: React.FC<TestRunnerComponentProps> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestSuite[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const runTests = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    const runner = new TestRunner();

    try {
      // Mock progress updates
      const testSuites = [
        'Core Functionality',
        'UI/UX Tests', 
        'Accessibility Tests',
        'Performance Tests',
        'Error Handling'
      ];

      for (let i = 0; i < testSuites.length; i++) {
        setCurrentTest(testSuites[i]);
        setProgress(((i + 1) / testSuites.length) * 100);
        
        // Add delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      await runner.runAllTests();
      setResults(runner.getResults());
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
      setProgress(100);
    }
  }, []);

  const getTotalStats = () => {
    const totals = results.reduce(
      (acc, suite) => ({
        passed: acc.passed + suite.passed,
        failed: acc.failed + suite.failed,
        duration: acc.duration + suite.totalDuration,
      }),
      { passed: 0, failed: 0, duration: 0 }
    );

    const total = totals.passed + totals.failed;
    const successRate = total > 0 ? (totals.passed / total) * 100 : 0;

    return { ...totals, total, successRate };
  };

  const stats = getTotalStats();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <InfoIcon className="text-white" size="sm" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Test Runner
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comprehensive application testing suite
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              onClick={runTests}
              disabled={isRunning}
              loading={isRunning}
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentTest || 'Initializing tests...'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </div>
        )}

        {/* Results Summary */}
        {results.length > 0 && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Tests
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.passed}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Passed
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.failed}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Failed
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {results.length === 0 && !isRunning && (
            <div className="text-center py-12">
              <InfoIcon className="mx-auto mb-4 text-gray-400" size="xl" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Tests Run Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Click "Run All Tests" to start the comprehensive test suite
              </p>
            </div>
          )}

          {results.map((suite, index) => (
            <Card key={index} className="border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{suite.name}</span>
                    <Badge 
                      variant={suite.failed === 0 ? 'success' : 'destructive'}
                      className="ml-2"
                    >
                      {suite.failed === 0 ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </CardTitle>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-600">
                      ✅ {suite.passed}
                    </span>
                    <span className="text-red-600">
                      ❌ {suite.failed}
                    </span>
                    <span className="text-gray-500">
                      ⏱️ {suite.totalDuration.toFixed(0)}ms
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {suite.tests.map((test, testIndex) => (
                    <div 
                      key={testIndex}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        test.passed 
                          ? 'bg-green-50 dark:bg-green-900/20' 
                          : 'bg-red-50 dark:bg-red-900/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {test.passed ? (
                          <CheckIcon className="text-green-600" size="sm" />
                        ) : (
                          <ErrorIcon className="text-red-600" size="sm" />
                        )}
                        
                        <div>
                          <div className={`font-medium ${
                            test.passed 
                              ? 'text-green-800 dark:text-green-200' 
                              : 'text-red-800 dark:text-red-200'
                          }`}>
                            {test.name}
                          </div>
                          
                          {test.error && (
                            <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                              {test.error}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {test.duration.toFixed(1)}ms
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total execution time: {stats.duration.toFixed(2)}ms
              </div>
              
              <div className="flex items-center space-x-2">
                {stats.failed === 0 ? (
                  <Badge variant="success">
                    🎉 All tests passed!
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    ⚠️ {stats.failed} test(s) failed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestRunnerComponent;
