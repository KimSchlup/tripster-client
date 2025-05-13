/**
 * Common styles that can be reused across components
 * These styles help implement the DRY principle by centralizing styling patterns
 */

import theme from './theme';

export const commonStyles = {
  // Layout styles
  containers: {
    page: {
      width: '100%',
      minHeight: '100vh',
      position: 'relative' as const,
      background: theme.colors.white,
      overflow: 'hidden',
    },
    content: {
      padding: theme.spacing.md,
      margin: `${theme.spacing.md} auto 0`,
      maxWidth: '1400px',
      position: 'relative' as const,
    },
    section: {
      width: '100%',
      background: theme.colors.white,
      boxShadow: theme.shadows.md,
      borderRadius: theme.borders.radius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    card: {
      background: theme.colors.white,
      boxShadow: theme.shadows.md,
      borderRadius: theme.borders.radius.lg,
      padding: theme.spacing.lg,
    },
    form: {
      width: '100%',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: theme.spacing.md,
    },
  },

  // Typography styles
  typography: {
    pageTitle: {
      color: theme.colors.foreground,
      fontSize: theme.typography.fontSize.xxl,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.bold,
      lineHeight: theme.typography.lineHeight.xl,
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      color: theme.colors.black,
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.lg,
    },
    label: {
      color: theme.colors.black,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.xs,
      display: 'block',
    },
    text: {
      color: theme.colors.black,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.regular,
    },
    smallText: {
      color: theme.colors.black,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.regular,
    },
  },

  // Form styles
  forms: {
    input: {
      width: '100%',
      height: '50px',
      background: theme.colors.inputBackground,
      borderRadius: theme.borders.radius.sm,
      border: 'none',
      outline: 'none',
      color: theme.colors.black,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.bold,
      padding: `0 ${theme.spacing.md}`,
      transition: `background-color ${theme.transitions.medium}`,
    },
    inputContainer: {
      width: '100%',
      height: '50px',
      position: 'relative' as const,
      background: theme.colors.inputBackground,
      borderRadius: theme.borders.radius.sm,
      marginBottom: '13px',
      overflow: 'hidden',
      transition: `background-color ${theme.transitions.medium}`,
    },
    inputPlaceholder: {
      left: theme.spacing.md,
      top: '15px',
      position: 'absolute' as const,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: theme.spacing.md,
      color: theme.colors.black,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.bold,
      pointerEvents: 'none',
      transition: `opacity ${theme.transitions.fast}`,
    },
    button: {
      height: '50px',
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      background: theme.colors.black,
      borderRadius: theme.borders.radius.sm,
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.md,
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      marginBottom: '13px',
      transition: `background-color ${theme.transitions.medium}`,
    },
    buttonText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.bold,
    },
    errorMessage: {
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.errorLight,
      color: theme.colors.error,
      borderRadius: theme.borders.radius.sm,
      fontSize: theme.typography.fontSize.sm,
    },
  },

  // Utility styles
  utils: {
    flexRow: {
      display: 'flex',
      alignItems: 'center',
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    flexEnd: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    divider: {
      width: '100%',
      height: 0,
      border: `${theme.borders.width.medium} solid ${theme.colors.black}`,
      marginBottom: theme.spacing.xl,
    },
  },
};

export default commonStyles;
