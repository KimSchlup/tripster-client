"use client";

import { useState, useCallback, FormEvent } from "react";
import { useFormError } from "./useFormError";

/**
 * Generic form values type
 * This is a base type that form value interfaces should extend or be compatible with
 */
export interface FormValues {
  [key: string]: unknown;
}

/**
 * Form validation function type
 */
export type FormValidator<T extends FormValues> = (values: T) => Record<string, string>;

/**
 * Form submission handler type
 */
export type FormSubmitHandler<T extends FormValues> = (values: T) => Promise<void> | void;

/**
 * Hook for managing form state and validation
 * 
 * This hook integrates with useFormError to provide a complete form handling solution.
 * It helps implement the DRY principle by centralizing form state management.
 */
export function useForm<T extends FormValues>(
  initialValues: T,
  validator?: FormValidator<T>,
  onSubmit?: FormSubmitHandler<T>
) {
  // Form values state
  const [values, setValues] = useState<T>(initialValues);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form error handling
  const {
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
  } = useFormError();

  /**
   * Update a single form field value
   */
  const setValue = useCallback((field: keyof T, value: unknown) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when value changes
    clearError(field as string);
  }, [clearError]);

  /**
   * Update multiple form field values at once
   */
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
    
    // Clear errors for updated fields
    Object.keys(newValues).forEach(field => {
      clearError(field);
    });
  }, [clearError]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    clearAllErrors();
  }, [initialValues, clearAllErrors]);

  /**
   * Validate form values
   * Returns true if form is valid, false otherwise
   */
  const validateForm = useCallback(() => {
    if (!validator) return true;
    
    const errors = validator(values);
    const hasErrors = Object.keys(errors).length > 0;
    
    if (hasErrors) {
      setErrors(errors);
      return false;
    }
    
    return true;
  }, [validator, values, setErrors]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate form
    const isValid = validateForm();
    if (!isValid || !onSubmit) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, clearAllErrors, validateForm, onSubmit, values, handleApiError]);

  return {
    values,
    setValue,
    setValues: setMultipleValues,
    resetForm,
    isSubmitting,
    fieldErrors,
    formError,
    setError,
    setFormError,
    clearError,
    clearAllErrors,
    hasError,
    getError,
    handleSubmit,
    validateForm
  };
}

export default useForm;
