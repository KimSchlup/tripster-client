"use client";

import React, { FormEvent } from "react";
import FormError from "./FormError";

export interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  error?: string | null;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  noValidate?: boolean;
}

/**
 * Form component
 * 
 * A reusable form container component that handles form submission and displays
 * global form errors. This component helps implement the DRY principle by
 * centralizing form submission logic.
 */
const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  error,
  id,
  className = "",
  style = {},
  noValidate = true,
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      id={id}
      className={`form ${className}`}
      style={{
        width: "100%",
        ...style,
      }}
      onSubmit={handleSubmit}
      noValidate={noValidate}
    >
      {error && (
        <FormError
          message={error}
          style={{ marginBottom: "20px" }}
        />
      )}
      {children}
    </form>
  );
};

export default Form;
