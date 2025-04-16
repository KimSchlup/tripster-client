"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { Roadtrip } from "@/types/roadtrip";
import type { RoadtripSettings } from "@/types/roadtripSettings";
import { BasemapType, DecisionProcess } from "@/types/roadtripSettings";
import { RoadtripMember } from "@/types/roadtripMember";
import { User } from "@/types/user";
import type { GeoJSON } from 'geojson';
import Checkbox from "@/components/Checkbox";

export default function RoadtripSettings() {
    const params = useParams();
    const id = params.id as string;
    const [roadtrip, setRoadtrip] = useState<Roadtrip | null>(null);
    const [roadtripMembers, setRoadtripMembers] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setRoadtripName] = useState("");
    const [roadtripDescription, setRoadtripDescription] = useState("");
    
    // RoadtripSettings state
    const [roadtripSettings, setRoadtripSettings] = useState<RoadtripSettings | null>(null);
    const [basemapType, setBasemapType] = useState<BasemapType>(BasemapType.DEFAULT);
    const [decisionProcess, setDecisionProcess] = useState<DecisionProcess>(DecisionProcess.MAJORITY);
    const [boundingBox, setBoundingBox] = useState<GeoJSON | undefined>(undefined);
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    const [hasSpotifyPlaylist, setHasSpotifyPlaylist] = useState(false);
    const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
    const [newMemberUsername, setNewMemberUsername] = useState("");
    const [addMemberError, setAddMemberError] = useState<string | null>(null);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState<boolean>(true); // For now, assume the user is the owner
    const apiService = useApi();
    const router = useRouter();
    const { userId: currentUserId } = useAuth();

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
                        
                        // Set basemap type from settings or DEFAULT if not set
                        if (settingsData.basemapType) {
                            // Check if the basemapType is "STANDARD" (invalid value)
                            if (settingsData.basemapType === "STANDARD" as any) {
                                console.warn(`Found invalid basemapType "STANDARD" in settings. Using DEFAULT instead.`);
                                setBasemapType(BasemapType.DEFAULT);
                            } else {
                                setBasemapType(settingsData.basemapType);
                            }
                        } else {
                            setBasemapType(BasemapType.DEFAULT);
                        }
                        
                        if (settingsData.decisionProcess) {
                            setDecisionProcess(settingsData.decisionProcess);
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
                        
                        if (settingsData.spotifyPlaylistUrl) {
                            setSpotifyPlaylistUrl(settingsData.spotifyPlaylistUrl);
                            setHasSpotifyPlaylist(true);
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
    // Close member selection when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click was outside of any member
            const memberElements = document.querySelectorAll('.roadtrip-member');
            let clickedOnMember = false;
            
            memberElements.forEach(element => {
                if (element.contains(event.target as Node)) {
                    clickedOnMember = true;
                }
            });
            
            if (!clickedOnMember && selectedMemberId) {
                setSelectedMemberId(null);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedMemberId]);

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
            // Only include fields that are expected by the API according to the REST specification
            const updatedRoadtrip = {
                ...roadtrip,
                name,
                description: roadtripDescription || undefined // Use description for backend
            };

            console.log("Updating roadtrip:", JSON.stringify(updatedRoadtrip, null, 2));
            await apiService.put<void>(`/roadtrips/${id}`, updatedRoadtrip);
            
            // Then update the settings
            if (roadtripSettings) {
                // Log the current basemapType value for debugging
                console.log(`Current basemapType value: ${basemapType}`);
                console.log(`Valid BasemapType values:`, Object.values(BasemapType));
                
                // Ensure basemapType is a valid enum value
                let validBasemapType = basemapType;
                
                // Explicitly check for "STANDARD" value which is causing the error
                if (basemapType === "STANDARD" as any) {
                    console.warn(`Found invalid basemapType "STANDARD". Replacing with DEFAULT.`);
                    validBasemapType = BasemapType.DEFAULT;
                }
                // Check if the current value is valid
                else if (!Object.values(BasemapType).includes(basemapType)) {
                    console.warn(`Invalid basemapType: ${basemapType}. Defaulting to DEFAULT.`);
                    validBasemapType = BasemapType.DEFAULT;
                }
                
                // Create the updated settings object with the validated basemapType
                const updatedSettings: RoadtripSettings = {
                    ...roadtripSettings,
                    basemapType: validBasemapType,
                    decisionProcess,
                    boundingBox,
                    startDate,
                    endDate,
                    spotifyPlaylistUrl: hasSpotifyPlaylist ? spotifyPlaylistUrl : undefined
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
            
            // Show success message briefly, then redirect
            setTimeout(() => {
                // Navigate to the roadtrip page
                router.push(`/my-roadtrips/${id}`);
            }, 1000);
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

    const handleSpotifyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpotifyPlaylistUrl(e.target.value);
    };

    const handleLeaveRoadtrip = async () => {
        if (!window.confirm("Are you sure you want to leave this roadtrip?")) {
            return;
        }

        try {
            // Remove the current user from the roadtrip
            await apiService.delete<void>(`/roadtrips/${id}/members/${currentUserId}`);
            
            // Navigate back to the roadtrips list
            router.push("/my-roadtrips");
        } catch (err) {
            console.error("Error leaving roadtrip:", err);
            setError("Failed to leave roadtrip. Please try again later.");
        }
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
                                        <div className="form-input-container" style={{ width: "100%" }} data-clicked={name ? "Clicked" : "Default"} data-state="Default">
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
                                                className="roadtrip-member"
                                                onClick={() => isOwner && setSelectedMemberId(selectedMemberId === member.id ? null : member.id)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    background: "rgba(128, 128, 128, 0.55)",
                                                    borderRadius: 10,
                                                    padding: "5px 10px",
                                                    position: "relative",
                                                    cursor: "pointer"
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
                                                {selectedMemberId === member.id && member.id !== currentUserId && (
                                                    <div style={{
                                                        position: "absolute",
                                                        top: "100%",
                                                        left: 0,
                                                        zIndex: 10,
                                                        marginTop: "5px",
                                                        background: "white",
                                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                                        borderRadius: "5px",
                                                        padding: "5px"
                                                    }}>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveUser(member.id);
                                                                setSelectedMemberId(null);
                                                            }}
                                                            style={{
                                                                background: "#E74C3C",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "3px",
                                                                padding: "5px 10px",
                                                                fontSize: "12px",
                                                                cursor: "pointer",
                                                                whiteSpace: "nowrap"
                                                            }}
                                                        >
                                                            Remove Member
                                                        </button>
                                                    </div>
                                                )}
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
                                                {/* Display all BasemapType options from the enum with formatted labels */}
                                                {Object.values(BasemapType).map((type) => {
                                                    // Format the label to be more user-friendly
                                                    let formattedLabel: string = type;
                                                    
                                                    // Convert enum values to more readable format
                                                    switch(type) {
                                                        case BasemapType.DEFAULT:
                                                            formattedLabel = "Default";
                                                            break;
                                                        case BasemapType.SATELLITE:
                                                            formattedLabel = "Satellite";
                                                            break;
                                                        case BasemapType.SATELLITE_HYBRID:
                                                            formattedLabel = "Satellite Hybrid";
                                                            break;
                                                        case BasemapType.OPEN_STREET_MAP:
                                                            formattedLabel = "OpenStreetMap";
                                                            break;
                                                    }
                                                    
                                                    return (
                                                        <Checkbox
                                                            key={type}
                                                            checked={basemapType === type}
                                                            onChange={() => setBasemapType(type)}
                                                            label={formattedLabel}
                                                        />
                                                    );
                                                })}
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
                                        {/* Display all DecisionProcess options from the enum with formatted labels */}
                                        {Object.values(DecisionProcess).map((process) => {
                                            // Format the label to be more user-friendly
                                            let formattedLabel: string = process;
                                            
                                            // Convert enum values to more readable format
                                            switch(process) {
                                                case DecisionProcess.DEFAULT:
                                                    formattedLabel = "Default";
                                                    break;
                                                case DecisionProcess.MAJORITY:
                                                    formattedLabel = "Majority Vote";
                                                    break;
                                                case DecisionProcess.OWNER_DECISION:
                                                    formattedLabel = "Decision by Owner";
                                                    break;
                                            }
                                            
                                            return (
                                                <Checkbox
                                                    key={process}
                                                    checked={decisionProcess === process}
                                                    onChange={() => setDecisionProcess(process)}
                                                    label={formattedLabel}
                                                />
                                            );
                                        })}
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
                                        <div>
                                            <Checkbox
                                                checked={hasSpotifyPlaylist}
                                                onChange={handleToggleSpotifyPlaylist}
                                                label="Spotify Playlist"
                                                variant="external-link"
                                            />
                                            {hasSpotifyPlaylist && (
                                                <div style={{ marginTop: "10px", marginLeft: "26px" }}>
                                                    <input
                                                        type="text"
                                                        value={spotifyPlaylistUrl}
                                                        onChange={handleSpotifyUrlChange}
                                                        placeholder="Enter Spotify playlist URL"
                                                        style={{
                                                            width: "100%",
                                                            padding: "8px",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px",
                                                            fontSize: "14px"
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <Checkbox
                                            variant="add"
                                            onChange={handleAddLink}
                                            label="Add Link"
                                            style={{ marginTop: "10px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Buttons */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "20px",
                                marginTop: "20px"
                            }}>
                                {/* Leave Roadtrip button for non-owners */}
                                {!isOwner && (
                                    <button 
                                        onClick={handleLeaveRoadtrip}
                                        className="form-button"
                                        style={{ background: "#E74C3C", width: "auto" }}
                                    >
                                        <span className="form-button-text">Leave Roadtrip</span>
                                    </button>
                                )}
                                
                                {/* Spacer div to push the other buttons to the right when Leave button is not shown */}
                                {isOwner && <div></div>}
                                
                                <div style={{
                                    display: "flex",
                                    gap: "20px"
                                }}>
                                    {isOwner && (
                                        <button 
                                            onClick={handleDelete}
                                            className="form-button"
                                            style={{ background: "#E74C3C", width: "auto" }}
                                        >
                                            <span className="form-button-text">Delete Roadtrip</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={handleSave}
                                        className="form-button"
                                        style={{ width: "auto" }}
                                    >
                                        <span className="form-button-text">Update Settings</span>
                                    </button>
                                </div>
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
                            
                            {/* Test button to toggle owner status - for development only */}
                            <div style={{ marginTop: "20px", textAlign: "center" }}>
                                <button 
                                    onClick={() => setIsOwner(!isOwner)}
                                    style={{
                                        padding: "5px 10px",
                                        background: "#888",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "3px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Toggle Owner Status (Current: {isOwner ? "Owner" : "Member"})
                                </button>
                            </div>
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
