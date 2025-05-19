// app/profile/page.tsx
"use client";

import "@ant-design/v5-patch-for-react-19";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { Switch, Input, Button } from "antd";
import Image from "next/image";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import EmergencyContactList from "@/components/EmergencyContactList";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid #ddd",
      padding: "8px 0",
    }}
  >
    <span>
      <strong>{label}</strong>
    </span>
    <span>{value}</span>
  </div>
);

const ProfileContent: React.FC = () => {
  const apiService = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedNotifications, setEditedNotifications] = useState(false);
  const [editedEmergencyFirstName, setEditedEmergencyFirstName] = useState("");
  const [editedEmergencyLastName, setEditedEmergencyLastName] = useState("");
  const [editedEmergencyPhone, setEditedEmergencyPhone] = useState("");

  const { authState } = useAuth();
  const userId = authState.userId;

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        console.log("Fetching user with ID:", userId);
        const response = await apiService.get<User>("/users/" + userId);
        setUser(response);
        setEditedUsername(response.username || "");
        setEditedFirstName(response.firstName || "");
        setEditedLastName(response.lastName || "");
        setEditedEmail(response.mail || "");
        setEditedPhone(response.phoneNumber || "");
        setEditedNotifications(response.recieveNotifications || false);
        setEditedEmergencyFirstName(response.emergencyContact?.firstName || "");
        setEditedEmergencyLastName(response.emergencyContact?.lastName || "");
        setEditedEmergencyPhone(response.emergencyContact?.phoneNumber || "");
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [apiService, userId]);

  const handleSave = async () => {
    if (isEditing && user) {
      const updatedFields: Partial<{
        username: string;
        firstName: string;
        lastName: string;
        mail: string;
        phoneNumber: string;
        receiveNotifications: boolean;
        emergencyContact: Partial<{
          firstName: string;
          lastName: string;
          phoneNumber: string;
        }>;
      }> = {};

      // Only add fields that have changed
      if (editedUsername !== user.username)
        updatedFields.username = editedUsername;
      if (editedFirstName !== user.firstName)
        updatedFields.firstName = editedFirstName;
      if (editedLastName !== user.lastName)
        updatedFields.lastName = editedLastName;
      if (editedEmail !== user.mail) updatedFields.mail = editedEmail;
      if (editedPhone !== user.phoneNumber)
        updatedFields.phoneNumber = editedPhone;
      if (editedNotifications !== user.recieveNotifications)
        updatedFields.receiveNotifications = editedNotifications;

      // Emergency contact fields
      if (
        editedEmergencyFirstName !== user.emergencyContact?.firstName ||
        editedEmergencyLastName !== user.emergencyContact?.lastName ||
        editedEmergencyPhone !== user.emergencyContact?.phoneNumber
      ) {
        updatedFields.emergencyContact = {
          ...(editedEmergencyFirstName !== user.emergencyContact?.firstName && {
            firstName: editedEmergencyFirstName,
          }),
          ...(editedEmergencyLastName !== user.emergencyContact?.lastName && {
            lastName: editedEmergencyLastName,
          }),
          ...(editedEmergencyPhone !== user.emergencyContact?.phoneNumber && {
            phoneNumber: editedEmergencyPhone,
          }),
        };
      }

      // If there are any fields to update, send them
      if (Object.keys(updatedFields).length > 0) {
        await apiService.put("/users/" + user.userId, updatedFields);
        globalThis.location.reload();
      } else {
        console.log("No changes detected.");
      }
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: "32px", maxWidth: "1500px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "8px",
            textAlign: "left",
            marginLeft: "40px",
          }}
        >
          My Profile
        </h1>
        <hr
          style={{
            border: "none",
            borderBottom: "1px solid #ccc",
            width: "100%",
            marginBottom: "32px",
          }}
        />

        {user && (
          <div
            style={{ display: "flex", gap: "100px", alignItems: "flex-start" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "80px",
                minWidth: "300px",
              }}
            >
              <Image
                src="/default_user.png"
                alt="Logo"
                width={200}
                height={200}
              />
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                maxWidth: "600px",
              }}
            >
              <InfoRow
                label="Username"
                value={
                  isEditing ? (
                    <Input
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                    />
                  ) : (
                    user.username
                  )
                }
              />
              <InfoRow
                label="First Name"
                value={
                  isEditing ? (
                    <Input
                      value={editedFirstName}
                      onChange={(e) => setEditedFirstName(e.target.value)}
                    />
                  ) : (
                    user.firstName
                  )
                }
              />
              <InfoRow
                label="Last Name"
                value={
                  isEditing ? (
                    <Input
                      value={editedLastName}
                      onChange={(e) => setEditedLastName(e.target.value)}
                    />
                  ) : (
                    user.lastName
                  )
                }
              />
              <InfoRow
                label="Email"
                value={
                  isEditing ? (
                    <Input
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                    />
                  ) : (
                    user.mail
                  )
                }
              />
              <InfoRow
                label="Phone"
                value={
                  isEditing ? (
                    <Input
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                    />
                  ) : (
                    user.phoneNumber
                  )
                }
              />
              <InfoRow
                label="Password"
                value={
                  isEditing ? (
                    <Input.Password value={"********"} disabled />
                  ) : (
                    "••••••••••••••"
                  )
                }
              />

              <div style={{ marginBottom: "0px", marginTop: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <h3 style={{ fontSize: "18px", margin: 0 }}>
                    Emergency Contacts
                  </h3>
                  <Button
                    size="small"
                    onClick={() => {
                      const contactList = document.getElementById(
                        "emergency-contact-list"
                      );
                      if (contactList) {
                        const typedContactList = contactList as HTMLElement & {
                          onAddContact?: () => void;
                        };
                        if (typedContactList.onAddContact) {
                          typedContactList.onAddContact();
                        }
                      }
                    }}
                    style={{
                      backgroundColor: "#22426b",
                      color: "white",
                      fontSize: "14px",
                      padding: "0 12px",
                      height: "28px",
                    }}
                  >
                    Add
                  </Button>
                </div>
                {userId && (
                  <EmergencyContactList
                    id="emergency-contact-list"
                    userId={userId}
                    hideAddButton={true}
                    onUpdate={() => {
                      // Refresh user data when emergency contacts are updated
                      if (userId) {
                        apiService
                          .get<User>("/users/" + userId)
                          .then((response) => {
                            setUser(response);
                          });
                      }
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Notifications</span>
                <Switch
                  checked={editedNotifications}
                  disabled={!isEditing}
                  onChange={(checked) => setEditedNotifications(checked)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "24px",
                }}
              >
                <Button
                  onClick={() => {
                    if (isEditing) {
                      handleSave();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  type="primary"
                  style={{ backgroundColor: "#22426b" }}
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
                <Button
                  //danger
                  onClick={async () => {
                    if (
                      confirm(
                        "Are you sure you want to permanently delete your account?"
                      )
                    ) {
                      await apiService.delete("/users/" + user.userId);
                      // Optional: clear localStorage and redirect to home or login page
                      globalThis.location.href = "/";
                    }
                  }}
                  type="primary"
                  style={{ backgroundColor: "#b30000" }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const ProfilePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
};

export default ProfilePage;
