"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useApi } from "@/hooks/useApi";
import { Roadtrip } from "@/types/roadtrip";
import type { RoadtripSettings } from "@/types/roadtripSettings";
import { BasemapType, DecisionProcess } from "@/types/roadtripSettings";
import { RoadtripMember, InvitationStatus } from "@/types/roadtripMember";
import { User } from "@/types/user";

export default function RoadtripSettings() {
    const params = useParams();
    const id = params.id as string;
    const [roadtrip, setRoadtrip] = useState<Roadtrip | null>(null);
    const [roadtripMembers, setRoadtripMembers] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setRoadtripName] = useState("");
    const [roadtripDestination, setRoadtripDestination] = useState("Switzerland");
    const [roadtripDescription, setRoadtripDescription] = useState("");
    
    // RoadtripSettings state
    const [roadtripSettings, setRoadtripSettings] = useState<RoadtripSettings | null>(null);
    const [basemapType, setBasemapType] = useState<BasemapType>(BasemapType.STANDARD);
    const [decisionProcess, setDecisionProcess] = useState<DecisionProcess>(DecisionProcess.MAJORITY);
    const [boundingBox, setBoundingBox] = useState<any | null>(null);
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    
    // UI state
    const [votingMechanism, setVotingMechanism] = useState<"majority" | "owner">("majority");
    const [hasSpotifyPlaylist, setHasSpotifyPlaylist] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
    const [newMemberUsername, setNewMemberUsername] = useState("");
    const [addMemberError, setAddMemberError] = useState<string | null>(null);
    const apiService = useApi();
    const router = useRouter();

    useEffect(() => {
        const fetchRoadtripAndSettings = async () => {
            try {
                setLoading(true);
                console.log(`Fetching roadtrip data for ID: ${id}`);
                
                // First fetch the basic roadtrip info (name, description, etc.)
                try {
                    console.log(`Fetching basic roadtrip data from /roadtrips/${id}`);
                    const roadtripData = await apiService.get<Roadtrip>(`/roadtrips/${id}`);
                    console.log("Successfully received roadtrip data:", JSON.stringify(roadtripData, null, 2));
                    
                    setRoadtrip(roadtripData);
                    setRoadtripName(roadtripData.name);
                    setRoadtripDescription(roadtripData.description || roadtripData.roadtripDescription || "");
                    
                    // Then fetch the settings
                    try {
                        console.log(`Fetching roadtrip settings from /roadtrips/${id}/settings`);
                        const settingsData = await apiService.get<RoadtripSettings>(`/roadtrips/${id}/settings`);
                        console.log("Successfully received roadtrip settings:", JSON.stringify(settingsData, null, 2));
                        
                        setRoadtripSettings(settingsData);
                        
                        // Update state with settings data
                        if (settingsData.basemapType) {
                            setBasemapType(settingsData.basemapType);
                        }
                        
                        if (settingsData.decisionProcess) {
                            setDecisionProcess(settingsData.decisionProcess);
                            // Map DecisionProcess to votingMechanism
                            setVotingMechanism(
                                settingsData.decisionProcess === DecisionProcess.MAJORITY ? "majority" : "owner"
                            );
                        }
                        
                        if (settingsData.boundingBox) {
                            setBoundingBox(settingsData.boundingBox);
                        }
                        
                        if (settingsData.startDate) {
                            setStartDate(settingsData.startDate);
                        }
                        
                        if (settingsData.endDate) {
                            setEndDate(settingsData.endDate);
                        }
                        
                    } catch (settingsErr) {
                        console.error("Error fetching roadtrip settings:", settingsErr);
                        console.error("Settings error details:", JSON.stringify(settingsErr, null, 2));
                        // Continue showing the page with just the basic roadtrip info
                    }
                    
                    setError(null);
                } catch (roadtripErr) {
                    console.error("Error fetching basic roadtrip data:", roadtripErr);
                    console.error("Roadtrip error details:", JSON.stringify(roadtripErr, null, 2));
                    setError("Failed to load roadtrip. Please try again later.");
                }
            } catch (err) {
                console.error("Error fetching data (all attempts failed):", err);
                setError("Failed to load roadtrip. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoadtripAndSettings();
        }
    }, [apiService, id]);

    // Fetch roadtrip members separately
    useEffect(() => {
        const fetchRoadtripMembers = async () => {
            if (!id) return;
            
            try {
                // GET /roadtrips/{roadtripId}/members - Returns List<User>
                const members = await apiService.get<User[]>(`/roadtrips/${id}/members`);
                console.log("Fetched roadtrip members:", members);
                
                // Convert User[] to the format expected by the UI
                const formattedMembers = members.map(user => ({
                    id: user.userId?.toString() || "unknown",
                    name: user.username || "Unknown User"
                }));
                
                setRoadtripMembers(formattedMembers);
                
                // Also update the roadtrip object with the members if it exists
                if (roadtrip) {
                    setRoadtrip({
                        ...roadtrip,
                        roadtripMembers: formattedMembers
                    });
                }
            } catch (err) {
                console.error("Error fetching roadtrip members:", err);
                // Don't set an error state here, as we still want to show the roadtrip settings
                // even if we can't fetch the members
            }
        };

        fetchRoadtripMembers();
    }, [apiService, id, roadtrip]);

    const handleSave = async () => {
        if (!roadtrip) return;

        try {
            setSaveSuccess(false);

            // First update the basic roadtrip info
            const updatedRoadtrip = {
                ...roadtrip,
                name,
                description: roadtripDescription || undefined, // Use description for backend
                roadtripDescription: roadtripDescription || undefined, // Keep for backward compatibility
                roadtripDestination
            };

            console.log("Updating roadtrip:", JSON.stringify(updatedRoadtrip, null, 2));
            await apiService.put<Roadtrip>(`/roadtrips/${id}`, updatedRoadtrip);
            
            // Then update the settings
            if (roadtripSettings) {
                // Map votingMechanism to DecisionProcess
                const updatedDecisionProcess = votingMechanism === "majority" 
                    ? DecisionProcess.MAJORITY 
                    : DecisionProcess.OWNER;
                
                const updatedSettings: RoadtripSettings = {
                    ...roadtripSettings,
                    basemapType,
                    decisionProcess: updatedDecisionProcess,
                    boundingBox,
                    startDate,
                    endDate
                };
                
                console.log("Updating roadtrip settings:", JSON.stringify(updatedSettings, null, 2));
                // Use void as the response type since we expect a 204 No Content response
                await apiService.put<void>(`/roadtrips/${id}/settings`, updatedSettings);
                
                // Update local state with the updated settings
                setRoadtripSettings(updatedSettings);
            }
            
            setSaveSuccess(true);
            
            // Update local state
            setRoadtrip(updatedRoadtrip);
            
            // Show success message briefly
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("Error updating roadtrip:", err);
            setError("Failed to save changes. Please try again later.");
        } finally {
            // Saving complete
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this roadtrip? This action cannot be undone.")) {
            return;
        }

        try {
            await apiService.delete<void>(`/roadtrips/${id}`);
            
            // Navigate back to the roadtrips list
            router.push("/my-roadtrips");
        } catch (err) {
            console.error("Error deleting roadtrip:", err);
            setError("Failed to delete roadtrip. Please try again later.");
        }
    };

    const handleRemoveUser = async (userId: string) => {
        if (!roadtrip) return;
        
        try {
            console.log(`Removing user ${userId} from roadtrip ${id}`);
            
            // Call the API to remove the user
            // DELETE /roadtrips/{roadtripId}/members/{userId}
            await apiService.delete<void>(`/roadtrips/${id}/members/${userId}`);
            
            // Update both state variables
            const updatedMembers = (roadtrip.roadtripMembers || []).filter(member => member.id !== userId);
            setRoadtripMembers(updatedMembers);
            
            // Also update the roadtrip object if it exists
            setRoadtrip({
                ...roadtrip,
                roadtripMembers: updatedMembers
            });
        } catch (err) {
            console.error("Error removing member:", err);
            setError("Failed to remove member. Please try again later.");
        }
    };

    const handleAddUser = () => {
        setShowAddMemberPopup(true);
        setNewMemberUsername("");
        setAddMemberError(null);
    };

    const handleAddMemberSubmit = async () => {
        if (!newMemberUsername.trim()) {
            setAddMemberError("Please enter a username");
            return;
        }

        try {
            setAddMemberError(null);
            
            // First, we need to find the user ID for the given username
            // This would typically be done through a user search API
            // For now, we'll simulate it with a fixed user ID
            const userId = "123"; // In a real implementation, this would come from a user search
            
            // Call the API to add the member
            // POST /roadtrips/{roadtripId}/members with userId in the body
            const requestBody = {
                userId: userId
            };
            
            // Make the API call
            const response = await apiService.post<RoadtripMember>(`/roadtrips/${id}/members`, requestBody);
            console.log("Added member:", response);
            
            // Refresh the member list
            const members = await apiService.get<User[]>(`/roadtrips/${id}/members`);
            
            // Convert User[] to the format expected by the UI
            const formattedMembers = members.map(user => ({
                id: user.userId?.toString() || "unknown",
                name: user.username || "Unknown User"
            }));
            
            // Update both state variables
            setRoadtripMembers(formattedMembers);
            
            if (roadtrip) {
                setRoadtrip({
                    ...roadtrip,
                    roadtripMembers: formattedMembers
                });
            }
            
            // Close the popup
            setShowAddMemberPopup(false);
        } catch (err) {
            console.error("Error adding member:", err);
            setAddMemberError("Failed to add member. Please try again.");
        }
    };

    const handleInviteGuest = () => {
        // In a real implementation, this would open a modal to invite a guest via email
        console.log("Invite guest clicked");
    };

    const handleAddLink = () => {
        // In a real implementation, this would open a modal to add a link
        console.log("Add link clicked");
    };

    const handleToggleSpotifyPlaylist = () => {
        setHasSpotifyPlaylist(!hasSpotifyPlaylist);
    };

    return (
        <>
            <Header />
            <div className="container" style={{ 
                padding: "16px", 
                margin: "16px auto 0", 
                maxWidth: "1400px"
            }}>
                {loading && <p>Loading roadtrip settings...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                
                {!loading && !error && (
                    <div style={{
                        width: "100%",
                        position: "relative"
                    }}>
                        <div style={{
                            color: "#090909",
                            fontSize: 36,
                            fontFamily: "Manrope",
                            fontWeight: 700,
                            lineHeight: "48px",
                            marginBottom: "20px"
                        }}>
                            Roadtrip Settings
                        </div>
                        <div style={{
                            width: "100%",
                            height: 0,
                            border: "1.5px solid #090909",
                            marginBottom: "40px"
                        }}></div>
                        
                        <div style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "30px"
                        }}>
                            <div style={{
                                padding: "20px",
                                background: "#D9D9D9",
                                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                borderRadius: 10,
                                display: "flex",
                                flexDirection: "column",
                                gap: "30px"
                            }}>
                                {/* Roadtrip Infos Section */}
                                <div style={{
                                    width: "100%",
                                    background: "white",
                                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                    borderRadius: 10,
                                    padding: "20px"
                                }}>
                                    <div style={{
                                        color: "black",
                                        fontSize: 24,
                                        fontFamily: "Manrope",
                                        fontWeight: 700,
                                        marginBottom: "20px"
                                    }}>
                                        Roadtrip Infos
                                    </div>
                                    
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "20px"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: "20px"
                                        }}>
                                            <div className="form-input-container" style={{ width: "48%" }} data-clicked={name ? "Clicked" : "Default"} data-state="Default">
                                                {!name && (
                                                    <div className="form-input-placeholder">
                                                        <div>Name</div>
                                                    </div>
                                                )}
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setRoadtripName(e.target.value)}
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div className="form-input-container" style={{ width: "48%" }} data-clicked={roadtripDestination ? "Clicked" : "Default"} data-state="Default">
                                                {!roadtripDestination && (
                                                    <div className="form-input-placeholder">
                                                        <div>Destination</div>
                                                    </div>
                                                )}
                                                <input
                                                    type="text"
                                                    value={roadtripDestination}
                                                    onChange={(e) => setRoadtripDestination(e.target.value)}
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-input-container" style={{ width: "100%", height: "75px" }} data-clicked={roadtripDescription ? "Clicked" : "Default"} data-state="Default">
                                            {!roadtripDescription && (
                                                <div className="form-input-placeholder">
                                                    <div>Description</div>
                                                </div>
                                            )}
                                            <textarea
                                                value={roadtripDescription}
                                                onChange={(e) => setRoadtripDescription(e.target.value)}
                                                className="form-input"
                                                style={{
                                                    height: "100%",
                                                    paddingTop: "10px",
                                                    paddingBottom: "10px",
                                                    resize: "none"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Users Section */}
                                <div style={{
                                    width: "100%",
                                    background: "white",
                                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                    borderRadius: 10,
                                    padding: "20px"
                                }}>
                                    <div style={{
                                        color: "black",
                                        fontSize: 24,
                                        fontFamily: "Manrope",
                                        fontWeight: 700,
                                        marginBottom: "20px"
                                    }}>
                                        Users
                                    </div>
                                    
                                    <div style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                        marginBottom: "20px"
                                    }}>
                                        {(roadtrip?.roadtripMembers || roadtripMembers).map((member) => (
                                            <div 
                                                key={member.id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    background: "rgba(128, 128, 128, 0.55)",
                                                    borderRadius: 10,
                                                    padding: "5px 10px"
                                                }}
                                            >
                                                <div style={{
                                                    color: "white",
                                                    fontSize: 16,
                                                    fontFamily: "Manrope",
                                                    fontWeight: 700,
                                                    marginRight: "10px"
                                                }}>
                                                    {member.name}
                                                </div>
                                                <div 
                                                    style={{
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "20px",
                                                        height: "20px"
                                                    }}
                                                    onClick={() => handleRemoveUser(member.id)}
                                                >
                                                    ✕
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        gap: "20px"
                                    }}>
                                        <button 
                                            onClick={handleAddUser}
                                            className="form-button"
                                            style={{ width: "auto" }}
                                        >
                                            <span className="form-button-text">Add user</span>
                                        </button>
                                        <button 
                                            onClick={handleInviteGuest}
                                            className="form-button"
                                            style={{ width: "auto" }}
                                        >
                                            <span className="form-button-text">Invite Guest</span>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Map Settings Section */}
                                <div style={{
                                    width: "100%",
                                    background: "white",
                                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                    borderRadius: 10,
                                    padding: "20px"
                                }}>
                                    <div style={{
                                        color: "black",
                                        fontSize: 24,
                                        fontFamily: "Manrope",
                                        fontWeight: 700,
                                        marginBottom: "20px"
                                    }}>
                                        Map Settings
                                    </div>
                                    
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "20px"
                                    }}>
                                        <div>
                                            <div style={{
                                                color: "black",
                                                fontSize: 18,
                                                fontFamily: "Manrope",
                                                fontWeight: 700,
                                                marginBottom: "10px"
                                            }}>
                                                Basemap Type
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "10px"
                                            }}>
                                                <div 
                                                    onClick={() => setBasemapType(BasemapType.STANDARD)}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <div style={{
                                                        width: 16,
                                                        height: 16,
                                                        background: "#2C2C2C",
                                                        borderRadius: 4,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>
                                                        {basemapType === BasemapType.STANDARD && (
                                                            <div style={{
                                                                width: 10,
                                                                height: 7,
                                                                background: "#F5F5F5"
                                                            }}></div>
                                                        )}
                                                    </div>
                                                    <div style={{
                                                        color: "black",
                                                        fontSize: 16,
                                                        fontFamily: "Manrope",
                                                        fontWeight: 700
                                                    }}>
                                                        Standard
                                                    </div>
                                                </div>
                                                <div 
                                                    onClick={() => setBasemapType(BasemapType.SATELLITE)}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <div style={{
                                                        width: 16,
                                                        height: 16,
                                                        background: "#2C2C2C",
                                                        borderRadius: 4,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>
                                                        {basemapType === BasemapType.SATELLITE && (
                                                            <div style={{
                                                                width: 10,
                                                                height: 7,
                                                                background: "#F5F5F5"
                                                            }}></div>
                                                        )}
                                                    </div>
                                                    <div style={{
                                                        color: "black",
                                                        fontSize: 16,
                                                        fontFamily: "Manrope",
                                                        fontWeight: 700
                                                    }}>
                                                        Satellite
                                                    </div>
                                                </div>
                                                <div 
                                                    onClick={() => setBasemapType(BasemapType.TERRAIN)}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <div style={{
                                                        width: 16,
                                                        height: 16,
                                                        background: "#2C2C2C",
                                                        borderRadius: 4,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>
                                                        {basemapType === BasemapType.TERRAIN && (
                                                            <div style={{
                                                                width: 10,
                                                                height: 7,
                                                                background: "#F5F5F5"
                                                            }}></div>
                                                        )}
                                                    </div>
                                                    <div style={{
                                                        color: "black",
                                                        fontSize: 16,
                                                        fontFamily: "Manrope",
                                                        fontWeight: 700
                                                    }}>
                                                        Terrain
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Trip Dates Section */}
                                <div style={{
                                    width: "100%",
                                    background: "white",
                                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                    borderRadius: 10,
                                    padding: "20px"
                                }}>
                                    <div style={{
                                        color: "black",
                                        fontSize: 24,
                                        fontFamily: "Manrope",
                                        fontWeight: 700,
                                        marginBottom: "20px"
                                    }}>
                                        Trip Dates
                                    </div>
                                    
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "20px"
                                    }}>
                                        <div style={{ width: "48%" }}>
                                            <div style={{
                                                color: "black",
                                                fontSize: 16,
                                                fontFamily: "Manrope",
                                                fontWeight: 700,
                                                marginBottom: "5px"
                                            }}>
                                                Start Date
                                            </div>
                                            <input
                                                type="date"
                                                value={startDate || ""}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: 5,
                                                    fontSize: 16
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: "48%" }}>
                                            <div style={{
                                                color: "black",
                                                fontSize: 16,
                                                fontFamily: "Manrope",
                                                fontWeight: 700,
                                                marginBottom: "5px"
                                            }}>
                                                End Date
                                            </div>
                                            <input
                                                type="date"
                                                value={endDate || ""}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: 5,
                                                    fontSize: 16
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Voting Mechanism Section */}
                                <div style={{
                                    width: "100%",
                                    background: "white",
                                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                    borderRadius: 10,
                                    padding: "20px"
                                }}>
                                    <div style={{
                                        color: "black",
                                        fontSize: 24,
                                        fontFamily: "Manrope",
                                        fontWeight: 700,
                                        marginBottom: "20px"
                                    }}>
                                        Voting Mechanism
                                    </div>
                                    
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px"
                                    }}>
                                        <div 
                                            onClick={() => setVotingMechanism("majority")}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <div style={{
                                                width: 16,
                                                height: 16,
                                                background: "#2C2C2C",
                                                borderRadius: 4,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                {votingMechanism === "majority" && (
                                                    <div style={{
                                                        width: 10,
                                                        height: 7,
                                                        background: "#F5F5F5"
                                                    }}></div>
                                                )}
                                            </div>
                                            <div style={{
                                                color: "black",
                                                fontSize: 20,
                                                fontFamily: "Manrope",
                                                fontWeight: 700
                                            }}>
                                                Majority Vote
                                            </div>
                                        </div>
                                        <div 
                                            onClick={() => setVotingMechanism("owner")}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <div style={{
                                                width: 16,
                                                height: 16,
                                                background: "#2C2C2C",
                                                borderRadius: 4,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                {votingMechanism === "owner" && (
                                                    <div style={{
                                                        width: 10,
                                                        height: 7,
                                                        background: "#F5F5F5"
                                                    }}></div>
                                                )}
                                            </div>
                                            <div style={{
                                                color: "black",
                                                fontSize: 20,
                                                fontFamily: "Manrope",
                                                fontWeight: 700
                                            }}>
                                                Decision by Owner
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* External Links Section */}
                                <div style={{
                                    width: "100%",
                                    background: "white",
                                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                    borderRadius: 10,
                                    padding: "20px"
                                }}>
                                    <div style={{
                                        color: "black",
                                        fontSize: 24,
                                        fontFamily: "Manrope",
                                        fontWeight: 700,
                                        marginBottom: "20px"
                                    }}>
                                        External Links
                                    </div>
                                    
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px"
                                    }}>
                                        <div 
                                            onClick={handleToggleSpotifyPlaylist}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <div style={{
                                                width: 16,
                                                height: 16,
                                                background: "#2C2C2C",
                                                borderRadius: 4,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                {hasSpotifyPlaylist && (
                                                    <div style={{
                                                        width: 10,
                                                        height: 7,
                                                        background: "#F5F5F5"
                                                    }}></div>
                                                )}
                                            </div>
                                            <div style={{
                                                color: "black",
                                                fontSize: 20,
                                                fontFamily: "Manrope",
                                                fontWeight: 700
                                            }}>
                                                Spotify Playlist
                                            </div>
                                        </div>
                                        <div 
                                            onClick={handleAddLink}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                cursor: "pointer",
                                                marginTop: "10px"
                                            }}
                                        >
                                            <div style={{
                                                color: "black",
                                                fontSize: 16,
                                                fontFamily: "Manrope",
                                                fontWeight: 700
                                            }}>
                                                + Add Link
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Buttons */}
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "20px",
                                marginTop: "20px"
                            }}>
                                <button 
                                    onClick={handleDelete}
                                    className="form-button"
                                    style={{ background: "#E74C3C", width: "auto" }}
                                >
                                    <span className="form-button-text">Delete Roadtrip</span>
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="form-button"
                                    style={{ width: "auto" }}
                                >
                                    <span className="form-button-text">Update Settings</span>
                                </button>
                            </div>
                            
                            {saveSuccess && (
                                <div style={{
                                    marginTop: "20px",
                                    padding: "10px",
                                    background: "#4CAF50",
                                    color: "white",
                                    borderRadius: 3,
                                    textAlign: "center"
                                }}>
                                    Settings updated successfully!
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Member Popup */}
            {showAddMemberPopup && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        width: "400px",
                        background: "white",
                        borderRadius: 10,
                        padding: "20px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)"
                    }}>
                        <div style={{
                            color: "black",
                            fontSize: 24,
                            fontFamily: "Manrope",
                            fontWeight: 700,
                            marginBottom: "20px"
                        }}>
                            Add Member
                        </div>
                        
                        <div style={{
                            marginBottom: "20px"
                        }}>
                            <div className="form-input-container" data-clicked={newMemberUsername ? "Clicked" : "Default"} data-state="Default">
                                {!newMemberUsername && (
                                    <div className="form-input-placeholder">
                                        <div>Username</div>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={newMemberUsername}
                                    onChange={(e) => setNewMemberUsername(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                            {addMemberError && (
                                <div style={{
                                    color: "red",
                                    fontSize: 14,
                                    marginTop: "5px"
                                }}>
                                    {addMemberError}
                                </div>
                            )}
                        </div>
                        
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px"
                        }}>
                            <button
                                onClick={() => setShowAddMemberPopup(false)}
                                className="form-button"
                                style={{ background: "#ccc", width: "auto" }}
                            >
                                <span className="form-button-text">Cancel</span>
                            </button>
                            <button
                                onClick={handleAddMemberSubmit}
                                className="form-button"
                                style={{ width: "auto" }}
                            >
                                <span className="form-button-text">Add</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
