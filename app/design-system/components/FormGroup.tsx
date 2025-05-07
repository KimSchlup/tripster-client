"use client";

import React from "react";
import commonStyles from "../styles/commonStyles";
import FormError from "./FormError";

export interface FormGroupProps {
  children: React.ReactNode;
  label?: string;
  htmlFor?: string;
  error?: string | null;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  showError?: boolean;
}

/**
 * FormGroup component
 * 
 * A reusable component for grouping form elements with labels and error messages.
 * This component helps implement the DRY principle by providing a consistent layout
 * for form fields.
 */
const FormGroup: React.FC<FormGroupProps> = ({
  children,
  label,
  htmlFor,
  error,
  required = false,
  className = "",
  style = {},
  labelStyle = {},
  showError = true,
}) => {
  return (
    <div 
      className={`form-group ${className}`}
      style={{
        marginBottom: "20px",
        width: "100%",
        ...style,
      }}
    >
      {label && (
        <label 
          htmlFor={htmlFor}
          style={{
            ...commonStyles.typography.label,
            display: "block",
            marginBottom: "8px",
            ...labelStyle,
          }}
        >
          {label}
          {required && (
            <span style={{ color: "red", marginLeft: "4px" }}>*</span>
          )}
        </label>
      )}
      
      {children}
      
      {error && showError && (
        <FormError 
          message={error}
          id={htmlFor ? `${htmlFor}-error` : undefined}
          style={{ marginTop: "4px" }}
        />
      )}
    </div>
  );
};

export default FormGroup;
