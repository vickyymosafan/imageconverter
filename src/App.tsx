import React from 'react';
import { ThemeProvider, ThemeToggle } from './components/providers/ThemeProvider';
import { AppLayout, Header, MainContent, Flex } from './components/layout/AppLayout';
import ImageConverter from './components/ImageConverter';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';
import { Tooltip, TooltipContent, TooltipTrigger } from './components/ui/shadcn/tooltip';
import { Badge } from './components/ui/shadcn/badge';
import { Separator } from './components/ui/shadcn/separator';
import TestRunnerComponent from './components/TestRunner';

const AppHeader: React.FC = () => {
  return (
    <Header sticky className="border-b header-gradient backdrop-blur-md header-shadow">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <Flex justify="between" align="center" className="h-14 sm:h-16">
          {/* Logo and Branding */}
          <Flex align="center" gap="sm" className="sm:gap-md">
            <Tooltip>
              <TooltipTrigger>
                <div className="relative group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group-hover:rotate-3 logo-glow">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h16v12H4V4zm2 2v8h12V6H6zm2 2h8v4H8V8zm10 8v2H6v-2h12z"/>
                      <path d="M9 9h6v2H9V9z"/>
                    </svg>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse shadow-sm"></div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>ImageConverter Pro - Professional Image Conversion Tool</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent truncate">
                  <span className="hidden sm:inline">ImageConverter</span>
                  <span className="sm:hidden">ImgConv</span>
                </h1>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs font-medium">
                    Pro
                  </Badge>
                  <Badge variant="outline" className="hidden sm:inline-flex text-xs font-medium text-green-600 border-green-200 dark:text-green-400 dark:border-green-800">
                    v2.0
                  </Badge>
                </div>
              </div>
              <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
                Professional Image Conversion Suite
              </p>
            </div>
          </Flex>

          {/* Navigation and Stats */}
          <Flex align="center" gap="sm" className="sm:gap-md lg:gap-lg">
            {/* Stats Counter - Responsive visibility */}
            <div className="hidden xl:flex items-center gap-3 mr-2">
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-center stats-counter">
                    <div className="text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100">
                      1.2M+
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Files
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total files converted by all users</p>
                </TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-6 lg:h-8" />

              <Tooltip>
                <TooltipTrigger>
                  <div className="text-center stats-counter">
                    <div className="text-base lg:text-lg font-bold text-green-600 dark:text-green-400">
                      99.9%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Success
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Conversion success rate</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Feature Highlights - Better responsive breakpoints */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <Tooltip>
                <TooltipTrigger>
                  <div className="feature-badge flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs lg:text-sm font-medium text-green-700 dark:text-green-400">
                      <span className="hidden xl:inline">Unlimited</span>
                      <span className="xl:hidden">∞</span>
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Unlimited file uploads - No restrictions!</p>
                </TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-4 lg:h-6" />

              <Tooltip>
                <TooltipTrigger>
                  <div className="feature-badge flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    <svg className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs lg:text-sm font-medium text-blue-700 dark:text-blue-400">
                      <span className="hidden xl:inline">HD Quality</span>
                      <span className="xl:hidden">HD</span>
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>High Definition quality preservation (90-95%)</p>
                </TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-4 lg:h-6" />

              <Tooltip>
                <TooltipTrigger>
                  <div className="feature-badge flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                    <svg className="w-3 h-3 lg:w-4 lg:h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs lg:text-sm font-medium text-purple-700 dark:text-purple-400">
                      <span className="hidden xl:inline">Batch</span>
                      <span className="xl:hidden">⚡</span>
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Batch processing for multiple files</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Theme Toggle - Enhanced touch target */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <ThemeToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle light/dark theme</p>
              </TooltipContent>
            </Tooltip>
          </Flex>
        </Flex>
      </div>
    </Header>
  );
};

const SubHeader: React.FC<{ onShowTestRunner?: () => void }> = ({ onShowTestRunner }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 sm:h-12">
          {/* Breadcrumb - Responsive */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-sm">
            <Tooltip>
              <TooltipTrigger>
                <div className="breadcrumb-item flex items-center space-x-1.5 sm:space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer p-1 rounded min-w-[44px] min-h-[44px] justify-center sm:justify-start">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 5.414V17a1 1 0 102 0V5.414l5.293 5.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                  <span className="hidden sm:inline">Home</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to homepage</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium text-xs sm:text-sm truncate">
              <span className="hidden sm:inline">Image Converter</span>
              <span className="sm:hidden">Converter</span>
            </span>
          </div>

          {/* Quick Actions - Enhanced touch targets */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Tooltip>
              <TooltipTrigger>
                <button className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors min-w-[44px] min-h-[44px] justify-center sm:justify-start">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Help</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View help and documentation</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <button className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors min-w-[44px] min-h-[44px] justify-center sm:justify-start">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline">Settings</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Application settings</p>
              </TooltipContent>
            </Tooltip>

            {/* Test Runner Button (Development Only) */}
            {import.meta.env.DEV && (
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={() => onShowTestRunner?.()}
                    className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors min-w-[44px] min-h-[44px] justify-center sm:justify-start"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Tests</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Run application tests (Development only)</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useToast();
  const [showTestRunner, setShowTestRunner] = React.useState(false);

  return (
    <AppLayout>
      <AppHeader />
      <SubHeader onShowTestRunner={() => setShowTestRunner(true)} />

      <MainContent className="animate-fade-in">
        <ImageConverter />
      </MainContent>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Test Runner Modal (Development Only) */}
      {showTestRunner && (
        <TestRunnerComponent onClose={() => setShowTestRunner(false)} />
      )}
    </AppLayout>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
