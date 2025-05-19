"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { EmergencyContact } from "@/types/emergencyContact";
import EmergencyContactPopup from "./EmergencyContactPopup";
import FormButton from "@/design-system/components/FormButton";
import theme from "@/design-system/styles/theme";

interface EmergencyContactListProps {
  userId: string;
  onUpdate?: () => void;
  id?: string;
  readOnly?: boolean;
  hideAddButton?: boolean;
}

export default function EmergencyContactList({
  userId,
  onUpdate,
  id,
  readOnly = false,
  hideAddButton = false,
}: EmergencyContactListProps) {
  const apiService = useApi();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentContact, setCurrentContact] = useState<EmergencyContact | null>(
    null
  );

  const fetchContacts = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get<EmergencyContact[]>(
        `/users/${userId}/emergency-contacts`
      );
      setContacts(response || []);
    } catch (err) {
      console.error("Error fetching emergency contacts:", err);
      setError("Failed to load emergency contacts");
    } finally {
      setLoading(false);
    }
  }, [userId, apiService]);

  useEffect(() => {
    fetchContacts();
  }, [userId, fetchContacts]);

  const handleAddContact = useCallback(() => {
    setCurrentContact(null);
    setShowPopup(true);
  }, []);

  const handleEditContact = (contact: EmergencyContact) => {
    setCurrentContact(contact);
    setShowPopup(true);
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!userId || !contactId) return;

    if (!confirm("Are you sure you want to delete this emergency contact?")) {
      return;
    }

    try {
      await apiService.delete(
        `/users/${userId}/emergency-contacts/${contactId}`
      );
      // Refresh the contacts list
      fetchContacts();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error deleting emergency contact:", err);
      setError("Failed to delete emergency contact");
    }
  };

  const handleSaveContact = () => {
    setShowPopup(false);
    fetchContacts();
    if (onUpdate) onUpdate();
  };

  // Make handleAddContact accessible via the DOM element
  React.useEffect(() => {
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        // Define a custom property on the HTML element
        (element as HTMLElement & { onAddContact: () => void }).onAddContact =
          handleAddContact;
      }
    }
  }, [id, handleAddContact]);

  return (
    <div id={id}>
      {error && (
        <div
          style={{
            color: theme.colors.error,
            marginBottom: theme.spacing.md,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.errorLight,
            borderRadius: theme.borders.radius.sm,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading emergency contacts...</div>
      ) : (
        <>
          {!readOnly && !hideAddButton && (
            <div style={{ marginBottom: theme.spacing.md }}>
              <FormButton
                type="button"
                onClick={handleAddContact}
                style={{
                  backgroundColor: theme.colors.primary,
                  color: "white",
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  borderRadius: theme.borders.radius.md,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                Add Emergency Contact
              </FormButton>
            </div>
          )}
          {contacts.length === 0 ? (
            <div style={{ marginBottom: theme.spacing.md }}>
              No emergency contacts added yet.
            </div>
          ) : (
            <div style={{ marginBottom: theme.spacing.lg }}>
              {contacts.map((contact) => (
                <div
                  key={contact.contactId}
                  style={{
                    padding: theme.spacing.md,
                    marginBottom: theme.spacing.md,
                    border: `${theme.borders.width.thin} solid ${theme.colors.lightGrey}`,
                    borderRadius: theme.borders.radius.md,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: theme.typography.fontWeight.bold,
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div>{contact.phoneNumber}</div>
                  </div>
                  {!readOnly && (
                    <div style={{ display: "flex", gap: theme.spacing.sm }}>
                      <button
                        onClick={() => handleEditContact(contact)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: theme.colors.primary,
                          padding: theme.spacing.xs,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.contactId!)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: theme.colors.error,
                          padding: theme.spacing.xs,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showPopup && (
        <EmergencyContactPopup
          contact={currentContact}
          onClose={() => setShowPopup(false)}
          onSave={handleSaveContact}
        />
      )}
    </div>
  );
}
