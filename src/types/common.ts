import React from 'react';

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// Size variants used across components
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Color variants used across components
export type ColorVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info';

// Button variants
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger' 
  | 'success';

// Layout spacing
export type SpacingVariant = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Grid columns
export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;

// Flex alignment
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

// Animation variants
export type AnimationVariant = 
  | 'fade-in' 
  | 'fade-in-up' 
  | 'scale-in' 
  | 'slide-up' 
  | 'bounce-subtle';

// Status types
export type StatusType = 'idle' | 'loading' | 'success' | 'error' | 'warning';

// Toast types
export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

// Modal props
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
}

// Form field props
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// File handling
export interface FileUploadProps extends BaseComponentProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

// Progress props
export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  showPercentage?: boolean;
  showStatus?: boolean;
  status?: StatusType;
  animated?: boolean;
}

// Badge props
export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
  size?: SizeVariant;
}

// Card props
export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: SpacingVariant;
  hover?: boolean;
}

// Loading state props
export interface LoadingStateProps {
  isLoading: boolean;
  message?: string;
  size?: SizeVariant;
}

// Empty state props
export interface EmptyStateProps extends BaseComponentProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

// Tooltip props
export interface TooltipProps extends BaseComponentProps {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

// Dropdown props
export interface DropdownProps extends BaseComponentProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect?: (value: string) => void;
}

export interface DropdownItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  separator?: boolean;
}

// Pagination props
export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
}

// Search props
export interface SearchProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
  debounceMs?: number;
}

// Filter props
export interface FilterProps extends BaseComponentProps {
  filters: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

// Sort props
export interface SortProps extends BaseComponentProps {
  options: SortOption[];
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

export interface SortOption {
  value: string;
  label: string;
  direction?: 'asc' | 'desc';
}

// Data table props
export interface DataTableProps<T> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  pagination?: PaginationProps;
  sorting?: SortProps;
  filtering?: FilterProps;
}

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error handling
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

// Utility types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
