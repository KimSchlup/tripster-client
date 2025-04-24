/**
 * Utility functions for password validation and security
 */

/**
 * Password strength levels
 */
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  message: string;
}

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns Password validation result with strength assessment and feedback message
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  // Default result
  const result: PasswordValidationResult = {
    isValid: false,
    strength: PasswordStrength.WEAK,
    message: 'Password is too weak',
  };

  // Check if password is empty
  if (!password) {
    result.message = 'Password cannot be empty';
    return result;
  }

  // Check minimum length
  if (password.length < 8) {
    result.message = 'Password must be at least 8 characters long';
    return result;
  }

  // Initialize score
  let score = 0;

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score += 1;
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Check for numbers
  if (/[0-9]/.test(password)) {
    score += 1;
  }

  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  // Check for password length bonus
  if (password.length >= 12) {
    score += 1;
  }

  // Determine strength based on score
  if (score <= 2) {
    result.strength = PasswordStrength.WEAK;
    result.message = 'Password is weak. Add uppercase, numbers, or special characters.';
    result.isValid = true; // Still valid but weak
  } else if (score <= 3) {
    result.strength = PasswordStrength.MEDIUM;
    result.message = 'Password strength is medium. Consider adding more variety.';
    result.isValid = true;
  } else {
    result.strength = PasswordStrength.STRONG;
    result.message = 'Password is strong.';
    result.isValid = true;
  }

  return result;
};

/**
 * Checks if passwords match
 * @param password - The main password
 * @param confirmPassword - The confirmation password
 * @returns Boolean indicating if passwords match
 */
export const doPasswordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};
