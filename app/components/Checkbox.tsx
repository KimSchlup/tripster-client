"use client";

import React from "react";
import Image from "next/image";

export type CheckboxVariant = "standard" | "add" | "external-link";

export interface CheckboxProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  variant?: CheckboxVariant;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Checkbox({
  checked = false,
  onChange,
  label,
  variant = "standard",
  disabled = false,
  className = "",
  style = {},
}: CheckboxProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  // Base checkbox styles
  const checkboxContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const checkboxStyle: React.CSSProperties = {
    width: 16,
    height: 16,
    background: checked ? "#4CAF50" : "#2C2C2C", // Green background when checked
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.2s ease",
    border: "1px solid #F5F5F5",
  };


  const labelStyle: React.CSSProperties = {
    color: "black",
    fontSize: variant === "add" ? 16 : 20,
    fontFamily: "Manrope",
    fontWeight: 700,
  };

  // Render different content based on variant
  const renderCheckboxContent = () => {
    if (variant === "add") {
      // For "add" variant, show a plus sign
      return (
        <div style={{ color: "white", fontSize: 17, fontWeight: 700 }}>
          +
        </div>
      );
    } else if (variant === "external-link" && checked) {
      // For external-link variant when checked, show the arrow
      return (
        <Image 
          src="/Arrow 4.svg" 
          alt="External Link" 
          width={12} 
          height={12}
        />
      );
    } else if (checked) {
      // For standard variant when checked, show the checkmark
      return (
        <Image 
          src="/Check.svg" 
          alt="Checked" 
          width={16} 
          height={16}
        />
      );
    }
    // For unchecked state, show nothing
    return null;
  };

  return (
    <div
      className={className}
      style={checkboxContainerStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
    >
      <div style={checkboxStyle}>
        {renderCheckboxContent()}
      </div>
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
}
