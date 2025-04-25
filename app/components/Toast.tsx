"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
}

/**
 * Toast notification component for displaying messages to the user
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Set up portal element
  useEffect(() => {
    let element = document.getElementById("toast-portal");
    if (!element) {
      element = document.createElement("div");
      element.id = "toast-portal";
      element.style.position = "fixed";
      element.style.top = "auto";
      element.style.bottom = "20px";
      element.style.right = "20px";
      element.style.zIndex = "9999";
      document.body.appendChild(element);
    }
    setPortalElement(element);

    // Auto-hide toast after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Allow animation to complete
      }
    }, duration);

    // Cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  // Get background color based on type
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "warning":
        return "#FF9800";
      case "info":
      default:
        return "#2196F3";
    }
  };

  // Toast styles
  const toastStyle = {
    padding: "12px 16px",
    borderRadius: "4px",
    color: "white",
    backgroundColor: getBackgroundColor(),
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    marginBottom: "10px",
    transition: "opacity 0.3s, transform 0.3s",
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : "translateX(100%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "300px",
  };

  // Close button styles
  const closeButtonStyle = {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginLeft: "10px",
  };

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Allow animation to complete
    }
  };

  if (!portalElement) return null;

  return createPortal(
    <div style={toastStyle as React.CSSProperties}>
      <div>{message}</div>
      <button onClick={handleClose} style={closeButtonStyle}>
        ×
      </button>
    </div>,
    portalElement
  );
};

export default Toast;
