import React from 'react';
import { ThemeProvider, ThemeToggle } from './components/providers/ThemeProvider';
import { AppLayout, Header, MainContent, Flex } from './components/layout/AppLayout';
import ImageConverter from './components/ImageConverter';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';

const AppHeader: React.FC = () => {
  return (
    <Header sticky>
      <Flex justify="between" align="center">
        <Flex align="center" gap="sm">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Konverter Gambar
          </h1>
        </Flex>

        <ThemeToggle />
      </Flex>
    </Header>
  );
};

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <AppLayout>
      <AppHeader />

      <MainContent>
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
