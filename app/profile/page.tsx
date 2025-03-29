// app/profile/page.tsx
"use client";

import "@ant-design/v5-patch-for-react-19";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Switch, Input, Button } from "antd";
import Image from "next/image";

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #ddd",
        padding: "8px 0"
    }}>
        <span><strong>{label}</strong></span>
        <span>{value}</span>
    </div>
);

const ProfilePage: React.FC = () => {
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

    const { value: id } = useLocalStorage<string>("id", "");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("Fetching user with ID:", id);
                const response = await apiService.get<User>("/users/" + id);
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
    }, [apiService]);

    return (
        <div style={{ padding: "32px", maxWidth: "1500px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "32px", marginBottom: "8px", textAlign: "left" , marginLeft: "40px"}}>My Profile</h1>
            <hr style={{ border: "none", borderBottom: "1px solid #ccc", width: "100%", marginBottom: "32px" }} />

            {user && (
                <div style={{ display: "flex", gap: "100px", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "80px", minWidth: "300px" }}>
                        <Image src="/default_user.png" alt="Logo" width={200} height={200} />

                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                        <InfoRow label="Username" value={isEditing ? <Input value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} /> : user.username} />
                        <InfoRow label="First Name" value={isEditing ? <Input value={editedFirstName} onChange={(e) => setEditedFirstName(e.target.value)} /> : user.firstName} />
                        <InfoRow label="Last Name" value={isEditing ? <Input value={editedLastName} onChange={(e) => setEditedLastName(e.target.value)} /> : user.lastName} />
                        <InfoRow label="Email" value={isEditing ? <Input value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} /> : user.mail} />
                        <InfoRow label="Phone" value={isEditing ? <Input value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} /> : user.phoneNumber} />
                        <InfoRow label="Password" value={isEditing ? <Input.Password value={"********"} disabled /> : "••••••••••••••"} />

                        <InfoRow
                            label="Emergency Contact"
                            value={
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                                        <span>First Name:</span> {isEditing ? <Input size="small" value={editedEmergencyFirstName} onChange={(e) => setEditedEmergencyFirstName(e.target.value)} /> : user.emergencyContact?.firstName || "-"}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                                        <span>Last Name:</span> {isEditing ? <Input size="small" value={editedEmergencyLastName} onChange={(e) => setEditedEmergencyLastName(e.target.value)} /> : user.emergencyContact?.lastName || "-"}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                                        <span>Phone:</span> {isEditing ? <Input size="small" value={editedEmergencyPhone} onChange={(e) => setEditedEmergencyPhone(e.target.value)} /> : user.emergencyContact?.phoneNumber || "-"}
                                    </div>
                                </div>
                            }
                        />

                        <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span>Notifications</span>
                            <Switch checked={editedNotifications} disabled={!isEditing} onChange={(checked) => setEditedNotifications(checked)} />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                            <Button  onClick={async () => {
                                if (isEditing) {
                                    await apiService.put("/users/" + user.id, {
                                        username: editedUsername,
                                        firstName: editedFirstName,
                                        lastName: editedLastName,
                                        email: editedEmail,
                                        phoneNumber: editedPhone,
                                        recieveNotifications: editedNotifications,
                                        emergencyContact: {
                                            firstName: editedEmergencyFirstName,
                                            lastName: editedEmergencyLastName,
                                            phoneNumber: editedEmergencyPhone,
                                        }
                                    });
                                    window.location.reload();
                                } else {
                                    setIsEditing(true);
                                }
                            }} type="primary" style={{ backgroundColor : "#22426b"}}>
                                {isEditing ? "Save" : "Edit"}
                            </Button>
                            <Button
                                //danger
                                onClick={async () => {
                                    if (confirm("Are you sure you want to permanently delete your account?")) {
                                        await apiService.delete("/users/" + user.id);
                                        // Optional: clear localStorage and redirect to home or login page
                                        window.location.href = "/";
                                    }
                                }}
                                type="primary" style={{ backgroundColor : "#b30000"}}>
                                Delete
                            </Button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
