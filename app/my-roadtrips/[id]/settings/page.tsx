"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { Roadtrip } from "@/types/roadtrip";
import type { RoadtripSettings } from "@/types/roadtripSettings";
import { BasemapType, DecisionProcess } from "@/types/roadtripSettings";
import type { GeoJSON } from 'geojson';
import Checkbox from "@/components/Checkbox";
import RoadtripMemberManagement from "@/components/RoadtripMemberManagement";
import BackToMapButton from "@/components/BackToMapButton";

export default function RoadtripSettings() {
    const params = useParams();
    const id = params.id as string;
    const [roadtrip, setRoadtrip] = useState<Roadtrip | null>(null);
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
    const [isOwner, setIsOwner] = useState<boolean>(false); // Default to false until we confirm ownership
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
                    
                    // Check if the current user is the owner of the roadtrip
                    if (roadtripData.ownerId && currentUserId) {
                        const isUserOwner = roadtripData.ownerId.toString() === currentUserId.toString();
                        console.log(`Current user (${currentUserId}) is ${isUserOwner ? '' : 'not '}the owner (${roadtripData.ownerId})`);
                        setIsOwner(isUserOwner);
                    } else {
                        console.log("Could not determine ownership: ownerId or currentUserId is missing");
                        setIsOwner(false);
                    }
                    
                    // Then fetch the settings
                    try {
                        console.log(`Fetching roadtrip settings from /roadtrips/${id}/settings`);
                        const settingsData = await apiService.get<RoadtripSettings>(`/roadtrips/${id}/settings`);
                        console.log("Successfully received roadtrip settings:", JSON.stringify(settingsData, null, 2));
                        
                        setRoadtripSettings(settingsData);
                        
                        // Set basemap type from settings or DEFAULT if not set
                        if (settingsData.basemapType) {
                            // Check if the basemapType is "STANDARD" (invalid value)
                            if (settingsData.basemapType === "STANDARD" as BasemapType) {
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
    }, [apiService, id, currentUserId]);

    // Member management is now handled by the RoadtripMemberManagement component

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
                if (basemapType === "STANDARD" as BasemapType) {
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

    // Member management functions are now handled by the RoadtripMemberManagement component

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
            // Instead of removing the member, set their invitation status to DECLINED
            console.log(`Setting invitation status to DECLINED for user ${currentUserId} in roadtrip ${id}`);
            await apiService.put<void>(`/roadtrips/${id}/members/${currentUserId}`, {
                invitationStatus: "DECLINED"
            });
            
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
                maxWidth: "1400px",
                position: "relative"
            }}>
                <BackToMapButton roadtripId={id} />
                
                {/* Add spacing div to prevent overlap with the button */}
                <div style={{ height: "50px" }}></div>
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
                                                onChange={(e) => isOwner && setRoadtripName(e.target.value)}
                                                className="form-input"
                                                required
                                                readOnly={!isOwner}
                                                style={{
                                                    ...((!isOwner) && { 
                                                        backgroundColor: "#f5f5f5",
                                                        cursor: "not-allowed"
                                                    })
                                                }}
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
                                                onChange={(e) => isOwner && setRoadtripDescription(e.target.value)}
                                                className="form-input"
                                                readOnly={!isOwner}
                                                style={{
                                                    height: "100%",
                                                    paddingTop: "10px",
                                                    paddingBottom: "10px",
                                                    resize: "none",
                                                    ...((!isOwner) && { 
                                                        backgroundColor: "#f5f5f5",
                                                        cursor: "not-allowed"
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Users Section */}
                                <RoadtripMemberManagement roadtripId={id} isOwner={isOwner} />
                                
                                {/* Basemap Type Section */}
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
                                        Basemap Type
                                    </div>
                                    
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "20px"
                                    }}>
                                        <div>
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "10px"
                                            }}>
                                                {/* Display BasemapType options from the enum with formatted labels (excluding DEFAULT) */}
                                                {Object.values(BasemapType).filter(type => type !== BasemapType.DEFAULT).map((type) => {
                                                    // Format the label to be more user-friendly
                                                    let formattedLabel: string = type;
                                                    
                                                    // Convert enum values to more readable format
                                                    switch(type) {
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
                                                            onChange={() => isOwner && setBasemapType(type)}
                                                            label={formattedLabel}
                                                            disabled={!isOwner}
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
                                                onChange={(e) => isOwner && setStartDate(e.target.value)}
                                                readOnly={!isOwner}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: 5,
                                                    fontSize: 16,
                                                    ...((!isOwner) && { 
                                                        backgroundColor: "#f5f5f5",
                                                        cursor: "not-allowed"
                                                    })
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
                                                onChange={(e) => isOwner && setEndDate(e.target.value)}
                                                readOnly={!isOwner}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: 5,
                                                    fontSize: 16,
                                                    ...((!isOwner) && { 
                                                        backgroundColor: "#f5f5f5",
                                                        cursor: "not-allowed"
                                                    })
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
                                        {/* Display DecisionProcess options from the enum with formatted labels (excluding DEFAULT) */}
                                        {Object.values(DecisionProcess).filter(process => process !== DecisionProcess.DEFAULT).map((process) => {
                                            // Format the label to be more user-friendly
                                            let formattedLabel: string = process;
                                            
                                            // Convert enum values to more readable format
                                            switch(process) {
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
                                                    onChange={() => isOwner && setDecisionProcess(process)}
                                                    label={formattedLabel}
                                                    disabled={!isOwner}
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
                                                onChange={() => isOwner && handleToggleSpotifyPlaylist()}
                                                label="Spotify Playlist"
                                                variant="external-link"
                                                disabled={!isOwner}
                                            />
                                            {hasSpotifyPlaylist && (
                                                <div style={{ marginTop: "10px", marginLeft: "26px" }}>
                                                    <input
                                                        type="text"
                                                        value={spotifyPlaylistUrl}
                                                        onChange={(e) => isOwner && handleSpotifyUrlChange(e)}
                                                        placeholder="Enter Spotify playlist URL"
                                                        readOnly={!isOwner}
                                                        style={{
                                                            width: "100%",
                                                            padding: "8px",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px",
                                                            fontSize: "14px",
                                                            ...((!isOwner) && { 
                                                                backgroundColor: "#f5f5f5",
                                                                cursor: "not-allowed"
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <Checkbox
                                            variant="add"
                                            onChange={() => isOwner && handleAddLink()}
                                            label="Add Link"
                                            style={{ marginTop: "10px" }}
                                            disabled={!isOwner}
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
                                    {isOwner && (
                                        <button 
                                            onClick={handleSave}
                                            className="form-button"
                                            style={{ width: "auto" }}
                                        >
                                            <span className="form-button-text">Update Settings</span>
                                        </button>
                                    )}
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
                        </div>
                    </div>
                )}
            </div>

            {/* Member management UI is now handled by the RoadtripMemberManagement component */}
        </>
    );
}
