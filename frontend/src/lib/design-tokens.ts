export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  secondary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    300: '#86efac',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    300: '#fca5a5',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

export const spacing = {
  0: '0',
  px: '1px',
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

export const typography = {
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',  // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem',   // 8px
  xl: '0.75rem',  // 12px
  '2xl': '1rem',     // 16px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
} as const;

export const componentTokens = {
  button: {
    base: [
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-md',
      'transition-colors duration-150',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'hover:cursor-pointer',
    ].join(' '),
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-transparent text-black border border-black',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    },
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    loading: 'opacity-75 cursor-wait',
  },

  input: {
    wrapper: 'flex flex-col gap-1',
    label: 'text-sm font-medium text-gray-700',
    base: [
      'block w-full rounded-md border px-3 py-2',
      'text-gray-900 placeholder-gray-400',
      'text-sm transition-colors duration-150',
      'focus:outline-none focus:ring-2',
      'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
    ].join(' '),
    states: {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
    },
    helperText: {
      error: 'text-xs text-red-600',
      success: 'text-xs text-green-600',
    },
  },

  modal: {
    overlay: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4',
    container: 'bg-white rounded-lg shadow-xl relative flex flex-col max-h-[90vh] w-full',
    sizes: {
      small: 'max-w-sm',
      medium: 'max-w-lg',
      large: 'max-w-2xl',
    },
    header: 'flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0',
    body: 'flex-1 overflow-y-auto px-6 py-4',
    footer: 'px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0',
    closeBtn: 'p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors',
  },

  card: {
    base: 'bg-white overflow-hidden',
    borders: {
      none: '',
      default: 'border border-gray-200 rounded-lg shadow-sm',
      accent: 'border border-gray-200 border-l-4 border-l-blue-600 rounded-lg shadow-sm',
    },
    header: 'px-6 py-4 border-b border-gray-200 font-semibold text-gray-800',
    body: 'px-6 py-4 text-gray-700',
    footer: 'px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600',
    image: 'w-full object-cover',
  },
} as const;
