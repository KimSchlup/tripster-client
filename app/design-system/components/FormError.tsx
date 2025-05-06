"use client";

import React from "react";
import commonStyles from "../styles/commonStyles";

export interface FormErrorProps {
  message: string | null;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  role?: string;
}

/**
 * FormError component
 * 
 * A reusable error message component that implements the design system's error styles
 * for consistent error display across forms.
 * 
 * Works with the useFormError hook for centralized error handling.
 * This component is typically used to display global form errors.
 */
const FormError: React.FC<FormErrorProps> = ({
  message,
  className = "",
  style = {},
  id = "form-error",
  role = "alert",
}) => {
  if (!message) return null;

  return (
    <div 
      id={id}
      role={role}
      className={`form-error ${className}`}
      style={{
        ...commonStyles.forms.errorMessage,
        ...style,
      }}
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

export default FormError;
