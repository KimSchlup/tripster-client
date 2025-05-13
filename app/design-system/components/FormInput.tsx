"use client";

import React, { useState } from "react";
import commonStyles from "../styles/commonStyles";

export interface FormInputProps {
  name: string; // Field name for error handling
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string; // Optional explicit error message
  onBlur?: () => void;
  className?: string;
  style?: React.CSSProperties;
  autoComplete?: string;
  showInlineError?: boolean; // Whether to show inline error message
}

/**
 * FormInput component
 * 
 * A reusable input component that implements the design system's form input styles
 * and handles placeholder animation, focus states, and error states.
 * 
 * Works with the useFormError hook for centralized error handling.
 */
const FormInput: React.FC<FormInputProps> = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  error,
  onBlur,
  className = "",
  style = {},
  autoComplete,
  showInlineError = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;

  // Determine the container's data attributes
  const getContainerDataAttributes = () => {
    return {
      "data-clicked": value ? "Clicked" : "Default",
      "data-state": hasError ? "Error" : "Default",
      "data-focused": isFocused ? "Focused" : "Unfocused",
      "data-field": name,
    };
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`form-input-container ${className}`} 
      style={{ ...commonStyles.forms.inputContainer, ...style }}
      {...getContainerDataAttributes()}
    >
      {!value && placeholder && (
        <div className="form-input-placeholder" style={{
          ...commonStyles.forms.inputPlaceholder,
          pointerEvents: 'none' as const
        }}>
          <div>{placeholder}</div>
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        className="form-input"
        name={name}
        id={name}
        style={{
          ...commonStyles.forms.input,
          backgroundColor: disabled ? "#f5f5f5" : undefined,
          cursor: disabled ? "not-allowed" : "text",
        }}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      {hasError && showInlineError && (
        <div 
          id={`${name}-error`}
          style={{ 
            color: 'red', 
            fontSize: '12px', 
            marginTop: '4px',
            position: 'absolute',
            bottom: '-20px',
            left: '0'
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default FormInput;
