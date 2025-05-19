"use client";

import React, { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { EmergencyContact } from "@/types/emergencyContact";
import Form from "@/design-system/components/Form";
import FormInput from "@/design-system/components/FormInput";
import FormButton from "@/design-system/components/FormButton";
import theme from "@/design-system/styles/theme";

interface EmergencyContactPopupProps {
  contact?: EmergencyContact | null;
  onClose: () => void;
  onSave: () => void;
}

export default function EmergencyContactPopup({
  contact,
  onClose,
  onSave,
}: EmergencyContactPopupProps) {
  const apiService = useApi();
  const { authState } = useAuth();
  const userId = authState.userId;

  const [firstName, setFirstName] = useState(contact?.firstName || "");
  const [lastName, setLastName] = useState(contact?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(contact?.phoneNumber || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!contact;

  const validateForm = (): boolean => {
    if (!firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !userId) return;

    try {
      setLoading(true);
      setError(null);

      const contactData = {
        firstName,
        lastName,
        phoneNumber,
      };

      if (isEditMode && contact) {
        // Update existing contact
        await apiService.put(
          `/users/${userId}/emergency-contacts/${contact.contactId}`,
          contactData
        );
      } else {
        // Create new contact
        await apiService.post(
          `/users/${userId}/emergency-contacts`,
          contactData
        );
      }

      setLoading(false);
      onSave();
    } catch (err) {
      console.error("Error saving emergency contact:", err);
      setError("Failed to save emergency contact. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: theme.zIndex.modal,
      }}
    >
      <div
        style={{
          width: "400px",
          background: theme.colors.white,
          borderRadius: theme.borders.radius.lg,
          padding: theme.spacing.lg,
          boxShadow: theme.shadows.lg,
        }}
      >
        <h2
          style={{
            color: theme.colors.black,
            fontSize: theme.typography.fontSize.xl,
            fontFamily: theme.typography.fontFamily.primary,
            fontWeight: theme.typography.fontWeight.bold,
            marginBottom: theme.spacing.md,
          }}
        >
          {isEditMode ? "Edit Emergency Contact" : "Add Emergency Contact"}
        </h2>

        <Form onSubmit={handleSubmit} error={error}>
          <div style={{ marginBottom: theme.spacing.md }}>
            <label
              style={{
                color: theme.colors.black,
                fontSize: theme.typography.fontSize.sm,
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.bold,
                marginBottom: theme.spacing.xs,
                display: "block",
              }}
            >
              First Name*
            </label>
            <FormInput
              name="firstName"
              value={firstName}
              onChange={setFirstName}
              placeholder="First Name"
              required
            />
          </div>

          <div style={{ marginBottom: theme.spacing.md }}>
            <label
              style={{
                color: theme.colors.black,
                fontSize: theme.typography.fontSize.sm,
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.bold,
                marginBottom: theme.spacing.xs,
                display: "block",
              }}
            >
              Last Name*
            </label>
            <FormInput
              name="lastName"
              value={lastName}
              onChange={setLastName}
              placeholder="Last Name"
              required
            />
          </div>

          <div style={{ marginBottom: theme.spacing.lg }}>
            <label
              style={{
                color: theme.colors.black,
                fontSize: theme.typography.fontSize.sm,
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.bold,
                marginBottom: theme.spacing.xs,
                display: "block",
              }}
            >
              Phone Number*
            </label>
            <FormInput
              name="phoneNumber"
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="Phone Number"
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: theme.spacing.md,
              marginTop: theme.spacing.lg,
            }}
          >
            <FormButton
              type="button"
              onClick={onClose}
              variant="secondary"
              fullWidth={false}
              style={{ padding: "8px 16px" }}
            >
              Cancel
            </FormButton>
            <FormButton
              type="submit"
              isLoading={loading}
              variant="primary"
              fullWidth={false}
              style={{ padding: "8px 16px" }}
            >
              {isEditMode ? "Update" : "Add"}
            </FormButton>
          </div>
        </Form>
      </div>
    </div>
  );
}
