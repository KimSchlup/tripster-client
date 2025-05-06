/**
 * Theme configuration for the application
 * Centralizes colors, spacing, typography, and other design tokens
 */

export const theme = {
  colors: {
    // Primary colors
    primary: '#007bff',
    primaryDark: '#0056b3',
    primaryLight: '#cce5ff',
    
    // Secondary colors
    secondary: '#6c757d',
    secondaryDark: '#5a6268',
    secondaryLight: '#e2e3e5',
    
    // Semantic colors
    success: '#4CAF50',
    successDark: '#388E3C',
    successLight: 'rgba(121, 164, 77, 0.1)',
    
    warning: '#F3A712',
    warningDark: '#E69411',
    warningLight: 'rgba(243, 167, 18, 0.1)',
    
    error: '#E6393B',
    errorDark: '#D32F2F',
    errorLight: '#ffebee',
    
    // Neutral colors
    black: '#000000',
    darkGrey: '#2C2C2C',
    grey: '#808080',
    lightGrey: '#D9D9D9',
    veryLightGrey: '#E4E4E4',
    white: '#FFFFFF',
    
    // Background colors
    background: '#f2f2f2',
    foreground: '#171717',
    cardBackground: 'white',
    inputBackground: 'rgba(128, 128, 128, 0.55)',
    inputBackgroundHover: 'rgba(128, 128, 128, 0.65)',
    inputBackgroundFocus: 'rgba(128, 128, 128, 0.75)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  typography: {
    fontFamily: {
      primary: 'Manrope, sans-serif',
      secondary: 'Arial, Helvetica, sans-serif',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '20px',
      xl: '24px',
      xxl: '36px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
    lineHeight: {
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
    },
  },
  
  borders: {
    radius: {
      sm: '3px',
      md: '5px',
      lg: '10px',
    },
    width: {
      thin: '1px',
      medium: '1.5px',
      thick: '2px',
    },
  },
  
  shadows: {
    sm: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    md: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    lg: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    input: '0 0 0 2px rgba(0, 0, 0, 0.2)',
  },
  
  transitions: {
    fast: '0.2s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  },
  
  zIndex: {
    base: 1,
    header: 1000,
    modal: 2000,
    toast: 3000,
  },
};

export type Theme = typeof theme;
export default theme;
