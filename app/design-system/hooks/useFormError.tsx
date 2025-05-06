"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/useToast";

/**
 * Hook for managing form errors with toast notifications
 * 
 * This hook centralizes form error handling and displays errors via the toast system
 * instead of inline error messages, implementing the DRY principle.
 */
export const useFormError = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormErrorState] = useState<string | null>(null);
  const { showToast } = useToast();

  /**
   * Set a single error for a field and show toast
   * @param field - The field name
   * @param message - The error message
   * @param showToastNotification - Whether to show a toast notification (default: true)
   */
  const setError = useCallback((field: string, message: string, showToastNotification = true) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: message
    }));
    
    if (showToastNotification) {
      showToast(message, "error");
    }
  }, [showToast]);

  /**
   * Set multiple errors at once
   * @param errors - Object with field names as keys and error messages as values
   * @param showToastNotification - Whether to show a toast notification (default: true)
   */
  const setErrors = useCallback((errors: Record<string, string>, showToastNotification = true) => {
    setFieldErrors(prev => ({
      ...prev,
      ...errors
    }));
    
    if (showToastNotification && Object.values(errors).length > 0) {
      // Show first error in toast
      showToast(Object.values(errors)[0], "error");
    }
  }, [showToast]);

  /**
   * Set a global form error
   * @param message - The error message
   * @param showToastNotification - Whether to show a toast notification (default: true)
   */
  const setFormError = useCallback((message: string, showToastNotification = true) => {
    setFormErrorState(message);
    
    if (showToastNotification) {
      showToast(message, "error");
    }
  }, [showToast]);

  /**
   * Clear a specific field error
   * @param field - The field name to clear
   */
  const clearError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Clear all errors (field errors and form error)
   */
  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setFormErrorState(null);
  }, []);

  /**
   * Check if a field has an error
   * @param field - The field name to check
   */
  const hasError = useCallback((field: string) => {
    return !!fieldErrors[field];
  }, [fieldErrors]);

  /**
   * Get the error message for a field
   * @param field - The field name
   */
  const getError = useCallback((field: string) => {
    return fieldErrors[field] || null;
  }, [fieldErrors]);

  /**
   * Handle API errors with standardized approach
   * @param error - The error object
   * @param defaultMessage - Default message to show if error can't be parsed
   */
  const handleApiError = useCallback((
    error: unknown, 
    defaultMessage = "An unexpected error occurred"
  ) => {
    let errorMessage = defaultMessage;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific error types
      if (error.message.includes("401") || error.message.includes("unauthorized")) {
        errorMessage = "Your session has expired. Please log in again.";
        // Note: Redirection to login should be handled by the component
      }
    }
    
    setFormError(errorMessage);
    return errorMessage;
  }, [setFormError]);

  return {
    fieldErrors,
    formError,
    setError,
    setErrors,
    setFormError,
    clearError,
    clearAllErrors,
    hasError,
    getError,
    handleApiError
  };
};

export default useFormError;
