"use client";

import React from "react";
import commonStyles from "../styles/commonStyles";

export interface FormButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
  loadingText?: string;
  form?: string;
  id?: string;
}

/**
 * FormButton component
 * 
 * A reusable button component that implements the design system's button styles
 * and handles loading states, variants, and disabled states.
 * 
 * Works with form submission and the useFormError hook for centralized error handling.
 */
const FormButton: React.FC<FormButtonProps> = ({
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  children,
  variant = "primary",
  className = "",
  style = {},
  fullWidth = true,
  loadingText = "Loading...",
  form,
  id,
}) => {
  // Determine button background color based on variant
  const getBackgroundColor = () => {
    if (disabled || isLoading) return "#cccccc";
    
    switch (variant) {
      case "primary":
        return "#000000";
      case "secondary":
        return "#6c757d";
      case "danger":
        return "#E74C3C";
      case "success":
        return "#4CAF50";
      default:
        return "#000000";
    }
  };

  // Hover styles are handled via CSS in globals.css

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      className={`form-button ${className}`}
      style={{
        ...commonStyles.forms.button,
        backgroundColor: getBackgroundColor(),
        width: fullWidth ? "100%" : "auto",
        opacity: disabled ? 0.7 : 1,
        cursor: disabled || isLoading ? "default" : "pointer",
        ...style,
      }}
      form={form}
      id={id}
      aria-busy={isLoading}
    >
      <span className="form-button-text" style={commonStyles.forms.buttonText}>
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
};

export default FormButton;
