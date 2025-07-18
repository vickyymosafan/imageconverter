// Accessibility utilities for better user experience

// ARIA label generators
export const generateAriaLabel = (
  action: string,
  target?: string,
  context?: string
): string => {
  let label = action;
  
  if (target) {
    label += ` ${target}`;
  }
  
  if (context) {
    label += ` - ${context}`;
  }
  
  return label;
};

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management
export const manageFocus = {
  // Save current focus
  saveFocus: (): HTMLElement | null => {
    return document.activeElement as HTMLElement;
  },

  // Restore focus to saved element
  restoreFocus: (element: HTMLElement | null): void => {
    if (element && element.focus) {
      element.focus();
    }
  },

  // Focus first focusable element in container
  focusFirst: (container: HTMLElement): boolean => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return true;
    }
    return false;
  },

  // Focus last focusable element in container
  focusLast: (container: HTMLElement): boolean => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
      return true;
    }
    return false;
  },

  // Trap focus within container
  trapFocus: (container: HTMLElement, event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }
};

// Get all focusable elements in container
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
};

// Keyboard navigation helpers
export const keyboardNavigation = {
  // Handle arrow key navigation in grid/list
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    columns?: number
  ): number => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowUp':
        if (columns && currentIndex >= columns) {
          newIndex = currentIndex - columns;
        } else if (!columns && currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
        break;

      case 'ArrowDown':
        if (columns && currentIndex < items.length - columns) {
          newIndex = currentIndex + columns;
        } else if (!columns && currentIndex < items.length - 1) {
          newIndex = currentIndex + 1;
        }
        break;

      case 'ArrowLeft':
        if (currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
        break;

      case 'ArrowRight':
        if (currentIndex < items.length - 1) {
          newIndex = currentIndex + 1;
        }
        break;

      case 'Home':
        newIndex = 0;
        break;

      case 'End':
        newIndex = items.length - 1;
        break;

      default:
        return currentIndex;
    }

    if (newIndex !== currentIndex && items[newIndex]) {
      items[newIndex].focus();
      event.preventDefault();
    }

    return newIndex;
  },

  // Handle Enter/Space activation
  handleActivation: (event: KeyboardEvent, callback: () => void): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  }
};

// Color contrast utilities
export const colorContrast = {
  // Calculate relative luminance
  getLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio
  getContrastRatio: (color1: string, color2: string): number => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 1;

    const lum1 = colorContrast.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = colorContrast.getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsWCAG: (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = colorContrast.getContrastRatio(color1, color2);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  }
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Text alternatives for images
export const generateAltText = (
  filename: string,
  format: string,
  dimensions?: { width: number; height: number },
  context?: string
): string => {
  let altText = `Gambar: ${filename}`;

  if (dimensions) {
    altText += ` (${dimensions.width}x${dimensions.height})`;
  }

  altText += ` dalam format ${format.toUpperCase()}`;

  if (context) {
    altText += ` - ${context}`;
  }

  return altText;
};

// Form validation messages
export const getValidationMessage = (
  field: string,
  error: string,
  value?: any
): string => {
  const messages: Record<string, string> = {
    required: `${field} wajib diisi`,
    invalid: `${field} tidak valid`,
    'too-large': `${field} terlalu besar`,
    'too-small': `${field} terlalu kecil`,
    'wrong-format': `${field} memiliki format yang salah`,
    'upload-failed': `Gagal mengunggah ${field}`,
    'conversion-failed': `Gagal mengkonversi ${field}`,
  };

  return messages[error] || `${field} mengalami kesalahan: ${error}`;
};

// Loading state announcements
export const announceLoadingState = (
  state: 'loading' | 'success' | 'error',
  context: string,
  details?: string
): void => {
  const messages = {
    loading: `Memuat ${context}...`,
    success: `${context} berhasil diselesaikan${details ? `: ${details}` : ''}`,
    error: `Kesalahan dalam ${context}${details ? `: ${details}` : ''}`
  };

  announceToScreenReader(messages[state], state === 'error' ? 'assertive' : 'polite');
};

// Progress announcements
export const announceProgress = (
  current: number,
  total: number,
  context: string = 'operasi'
): void => {
  const percentage = Math.round((current / total) * 100);
  const message = `Progres ${context}: ${percentage}% selesai (${current} dari ${total})`;

  // Only announce at certain intervals to avoid spam
  if (percentage % 25 === 0 || current === total) {
    announceToScreenReader(message, 'polite');
  }
};

// Error announcements
export const announceError = (
  error: string,
  context?: string,
  suggestions?: string[]
): void => {
  let message = context ? `Kesalahan dalam ${context}: ${error}` : `Kesalahan: ${error}`;

  if (suggestions && suggestions.length > 0) {
    message += `. Saran: ${suggestions.join(', ')}`;
  }

  announceToScreenReader(message, 'assertive');
};

// Success announcements
export const announceSuccess = (
  action: string,
  result?: string,
  nextSteps?: string
): void => {
  let message = `${action} berhasil diselesaikan`;

  if (result) {
    message += `. ${result}`;
  }

  if (nextSteps) {
    message += `. ${nextSteps}`;
  }

  announceToScreenReader(message, 'polite');
};

// Accessibility testing
export const testAccessibility = (element: HTMLElement): {
  score: number;
  issues: string[];
  suggestions: string[];
} => {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for ARIA labels
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
      issues.push('Tidak ada aria-label atau aria-labelledby');
      suggestions.push('Tambahkan aria-label yang deskriptif');
    }
  }

  // Check for keyboard accessibility
  if (element.onclick && element.tabIndex < 0) {
    issues.push('Elemen yang dapat diklik tidak dapat diakses dengan keyboard');
    suggestions.push('Tambahkan tabindex="0" atau gunakan elemen button');
  }

  // Check for focus indicators
  const styles = getComputedStyle(element);
  if (styles.outline === 'none' && !styles.boxShadow.includes('focus')) {
    issues.push('Tidak ada indikator fokus yang terlihat');
    suggestions.push('Tambahkan focus:ring atau focus:outline styles');
  }

  // Calculate score
  const maxScore = 100;
  const deduction = issues.length * 20;
  const score = Math.max(0, maxScore - deduction);

  return { score, issues, suggestions };
};
