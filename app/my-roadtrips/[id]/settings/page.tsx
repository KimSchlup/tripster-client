// File: RoadtripSettings.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Roadtrip } from "@/types/roadtrip";
import type { RoadtripSettings } from "@/types/roadtripSettings";
import { BasemapType, DecisionProcess } from "@/types/roadtripSettings";
import type { GeoJSON } from "geojson";
import Checkbox from "@/components/Checkbox";
import RoadtripMemberManagement from "@/components/RoadtripMemberManagement";
import BackToMapButton from "@/components/BackToMapButton";
import BoundingBoxSelector from "@/components/MapComponents/BoundingBoxSelector";

export default function RoadtripSettings() {
  const params = useParams();
  const id = params.id as string;
  const [roadtrip, setRoadtrip] = useState<Roadtrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setRoadtripName] = useState("");
  const [roadtripDescription, setRoadtripDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // New state for image upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RoadtripSettings state
  const [roadtripSettings, setRoadtripSettings] =
    useState<RoadtripSettings | null>(null);
  const [basemapType, setBasemapType] = useState<BasemapType>(
    BasemapType.DEFAULT
  );
  const [decisionProcess, setDecisionProcess] = useState<DecisionProcess>(
    DecisionProcess.MAJORITY
  );
  const [boundingBox, setBoundingBox] = useState<GeoJSON | undefined>(
    undefined
  );
  const [showBoundingBoxSelector, setShowBoundingBoxSelector] = useState(false);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [hasSpotifyPlaylist, setHasSpotifyPlaylist] = useState(false);
  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const handleImageClick = () => {
    if (isOwner) fileInputRef.current?.click();
  };

  const apiService = useApi();
  const router = useRouter();
  const { authState } = useAuth();
  const { showToast } = useToast();
  const currentUserId = authState.userId;

  useEffect(() => {
    const loadRoadtripSettings = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // 1. Fetch Roadtrip Info
        const roadtripData = await apiService.get<Roadtrip>(`/roadtrips/${id}`);
        setRoadtrip(roadtripData);
        setRoadtripName(roadtripData.name);
        setRoadtripDescription(
          roadtripData.description || roadtripData.roadtripDescription || ""
        );
        setIsOwner(
          roadtripData.ownerId?.toString() === currentUserId?.toString()
        );

        // 2. Fetch Settings
        const settingsData = await apiService.get<RoadtripSettings>(
          `/roadtrips/${id}/settings`
        );
        setRoadtripSettings(settingsData);
        setBasemapType(settingsData.basemapType ?? BasemapType.DEFAULT);
        setDecisionProcess(
          settingsData.decisionProcess ?? DecisionProcess.MAJORITY
        );
        if (settingsData.boundingBox) {
          setBoundingBox(settingsData.boundingBox);
        }
        setStartDate(settingsData.startDate);
        setEndDate(settingsData.endDate);

        if (settingsData.spotifyPlaylistUrl) {
          setSpotifyPlaylistUrl(settingsData.spotifyPlaylistUrl);
          setHasSpotifyPlaylist(true);
        }

        // 3. Fetch image (if available)
        try {
          const res = await apiService.get<Response>(
            `/roadtrips/${id}/settings/images`
          );
          if (!res.ok) throw new Error("Image not found");
          const url = await res.text();
          setImageUrl(url);
        } catch (imgErr) {
          console.warn("No image or error loading image for", id, imgErr);
        }

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load roadtrip. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadRoadtripSettings();
  }, [apiService, id, currentUserId]);

  const handleAddLink = () => {
    console.log("Add link clicked");
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      // Upload the file
      await apiService.post(`/roadtrips/${id}/settings/images`, formData);

      // then fetch the signed image URL
      const res: Response = await apiService.get(
        `/roadtrips/${id}/settings/images`
      );
      const imageUrl = await res.text();
      setImageUrl(imageUrl);
    } catch (err) {
      console.error("Image upload failed:", err);

      // Check for the specific error message
      if (
        err instanceof Error &&
        err.message.includes("Maximum upload size exceeded")
      ) {
        showToast("Image too large", "error");
      } else {
        setError("Failed to upload or load image. Please try again.");
      }
    }
  };

  // Save handler
  const handleSave = async () => {
    if (!roadtrip) return;
    try {
      setSaveSuccess(false);

      // Update basic info
      const updatedRoadtrip = {
        ...roadtrip,
        name,
        description: roadtripDescription || undefined,
      };
      await apiService.put<void>(`/roadtrips/${id}`, updatedRoadtrip);

      // Update settings
      if (roadtripSettings) {
        let validBasemapType = basemapType;
        if (
          basemapType === ("STANDARD" as BasemapType) ||
          !Object.values(BasemapType).includes(basemapType)
        ) {
          validBasemapType = BasemapType.DEFAULT;
        }

        const updatedSettings: RoadtripSettings = {
          ...roadtripSettings,
          basemapType: validBasemapType,
          decisionProcess,
          boundingBox,
          startDate,
          endDate,
          spotifyPlaylistUrl: hasSpotifyPlaylist
            ? spotifyPlaylistUrl
            : undefined,
        };

        await apiService.put<void>(
          `/roadtrips/${id}/settings`,
          updatedSettings
        );
        setRoadtripSettings(updatedSettings);
      }

      setSaveSuccess(true);
      setRoadtrip(updatedRoadtrip);

      setTimeout(() => {
        router.push(`/my-roadtrips/${id}`);
      }, 1000);
    } catch (err) {
      console.error("Error updating roadtrip:", err);
      setError("Failed to save changes. Please try again later.");
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this roadtrip? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await apiService.delete<void>(`/roadtrips/${id}`);
      router.push("/my-roadtrips");
    } catch (err) {
      console.error("Error deleting roadtrip:", err);
      setError("Failed to delete roadtrip. Please try again later.");
    }
  };

  // Leave roadtrip
  const handleLeaveRoadtrip = async () => {
    if (!confirm("Are you sure you want to leave this roadtrip?")) return;
    try {
      await apiService.put<void>(`/roadtrips/${id}/members/${currentUserId}`, {
        invitationStatus: "DECLINED",
      });
      router.push("/my-roadtrips");
    } catch (err) {
      console.error("Error leaving roadtrip:", err);
      setError("Failed to leave roadtrip. Please try again later.");
    }
  };

  // Spotify toggle & url change
  const handleToggleSpotifyPlaylist = () =>
    setHasSpotifyPlaylist(!hasSpotifyPlaylist);
  const handleSpotifyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSpotifyPlaylistUrl(e.target.value);

  return (
    <>
      <Header />
      <div
        className="container"
        style={{
          padding: 16,
          margin: "16px auto 0",
          maxWidth: 1400,
          position: "relative",
        }}
      >
        <BackToMapButton roadtripId={id} />
        <div style={{ height: 50 }} />

        {loading && <p>Loading roadtrip settings...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div
            style={{
              width: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                color: "#090909",
                fontSize: 36,
                fontFamily: "Manrope",
                fontWeight: 700,
                lineHeight: "48px",
                marginBottom: "20px",
              }}
            >
              Roadtrip Settings
            </div>
            <div
              style={{
                width: "100%",
                height: 0,
                border: "1.5px solid #090909",
                marginBottom: "40px",
              }}
            ></div>

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "30px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  background: "#D9D9D9",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                    width: "100%",
                  }}
                >
                  {/* Roadtrip Infos Section */}
                  <div
                    style={{
                      flex: 3,
                      background: "white",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      borderRadius: 10,
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        color: "black",
                        fontSize: 24,
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        marginBottom: "20px",
                      }}
                    >
                      Roadtrip Infos
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <div
                        className="form-input-container"
                        style={{ width: "100%" }}
                        data-clicked={name ? "Clicked" : "Default"}
                        data-state="Default"
                      >
                        {!name && (
                          <div className="form-input-placeholder">
                            <div>Name</div>
                          </div>
                        )}
                        <input
                          type="text"
                          value={name}
                          onChange={(e) =>
                            isOwner && setRoadtripName(e.target.value)
                          }
                          className="form-input"
                          required
                          readOnly={!isOwner}
                          style={{
                            ...(!isOwner && {
                              backgroundColor: "#f5f5f5",
                              cursor: "not-allowed",
                            }),
                          }}
                        />
                      </div>

                      <div
                        className="form-input-container"
                        style={{ width: "100%", height: "75px" }}
                        data-clicked={
                          roadtripDescription ? "Clicked" : "Default"
                        }
                        data-state="Default"
                      >
                        {!roadtripDescription && (
                          <div className="form-input-placeholder">
                            <div>Description</div>
                          </div>
                        )}
                        <textarea
                          value={roadtripDescription}
                          onChange={(e) =>
                            isOwner && setRoadtripDescription(e.target.value)
                          }
                          className="form-input"
                          readOnly={!isOwner}
                          style={{
                            height: "100%",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            resize: "none",
                            ...(!isOwner && {
                              backgroundColor: "#f5f5f5",
                              cursor: "not-allowed",
                            }),
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Roadtrip Image Section */}

                  <div
                    style={{
                      background: "white",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      borderRadius: 10,
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      color: "black",
                      fontSize: 24,
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      flex: 1,
                    }}
                  >
                    Roadtrip Image
                    <div
                      onClick={handleImageClick}
                      style={{
                        marginTop: 20,
                        width: 200,
                        height: 150,
                        background: "#DDD",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 48,
                        color: "#888",
                        cursor: isOwner ? "pointer" : "not-allowed",
                        borderRadius: 8,
                        alignSelf: "center",
                        overflow: "hidden",
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Roadtrip cover"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      ) : (
                        "+"
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={!isOwner}
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                {/* Users Section */}
                <RoadtripMemberManagement roadtripId={id} isOwner={isOwner} />
                {/* Basemap Type Section */}
                <div
                  style={{
                    width: "100%",
                    background: "white",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: 10,
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      color: "black",
                      fontSize: 24,
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      marginBottom: "20px",
                    }}
                  >
                    Basemap Type
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {/* Display BasemapType options from the enum with formatted labels (excluding DEFAULT) */}
                        {Object.values(BasemapType)
                          .filter((type) => type !== BasemapType.DEFAULT)
                          .map((type) => {
                            // Format the label to be more user-friendly
                            let formattedLabel: string = type;

                            // Convert enum values to more readable format
                            switch (type) {
                              case BasemapType.SATELLITE:
                                formattedLabel = "Satellite";
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
                <div
                  style={{
                    width: "100%",
                    background: "white",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: 10,
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      color: "black",
                      fontSize: 24,
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      marginBottom: "20px",
                    }}
                  >
                    Trip Dates
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                    }}
                  >
                    <div style={{ width: "48%" }}>
                      <div
                        style={{
                          color: "black",
                          fontSize: 16,
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          marginBottom: "5px",
                        }}
                      >
                        Start Date
                      </div>
                      <input
                        type="date"
                        value={startDate || ""}
                        onChange={(e) =>
                          isOwner && setStartDate(e.target.value)
                        }
                        readOnly={!isOwner}
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: 5,
                          fontSize: 16,
                          ...(!isOwner && {
                            backgroundColor: "#f5f5f5",
                            cursor: "not-allowed",
                          }),
                        }}
                      />
                    </div>
                    <div style={{ width: "48%" }}>
                      <div
                        style={{
                          color: "black",
                          fontSize: 16,
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          marginBottom: "5px",
                        }}
                      >
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
                          ...(!isOwner && {
                            backgroundColor: "#f5f5f5",
                            cursor: "not-allowed",
                          }),
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Geographic Boundaries Section */}
                <div
                  style={{
                    width: "100%",
                    background: "white",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: 10,
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      color: "black",
                      fontSize: 24,
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      marginBottom: "20px",
                    }}
                  >
                    Geographic Boundaries
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    {boundingBox ? (
                      <p style={{ color: "black" }}>
                        Bounding box is set. POIs can only be created within
                        this area.
                      </p>
                    ) : (
                      <p style={{ color: "black" }}>
                        No boundaries set. POIs can be created anywhere on the
                        map.
                      </p>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() =>
                        isOwner && setShowBoundingBoxSelector(true)
                      }
                      className="form-button"
                      style={{
                        width: "auto",
                        backgroundColor: isOwner ? "#000000" : "#f5f5f5",
                        color: isOwner ? "white" : "#888",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: isOwner ? "pointer" : "not-allowed",
                      }}
                      disabled={!isOwner}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {boundingBox ? "Edit Boundaries" : "Set Boundaries"}
                      </span>
                    </button>

                    {boundingBox && (
                      <button
                        onClick={() => isOwner && setBoundingBox(undefined)}
                        className="form-button"
                        style={{
                          width: "auto",
                          backgroundColor: isOwner ? "#E74C3C" : "#f5f5f5",
                          color: isOwner ? "white" : "#888",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: isOwner ? "pointer" : "not-allowed",
                        }}
                        disabled={!isOwner}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          Remove Boundaries
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Voting Mechanism Section */}
                <div
                  style={{
                    width: "100%",
                    background: "white",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: 10,
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      color: "black",
                      fontSize: 24,
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      marginBottom: "20px",
                    }}
                  >
                    Voting Mechanism
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {/* Display DecisionProcess options from the enum with formatted labels (excluding DEFAULT) */}
                    {Object.values(DecisionProcess)
                      .filter((process) => process !== DecisionProcess.DEFAULT)
                      .map((process) => {
                        // Format the label to be more user-friendly
                        let formattedLabel: string = process;

                        // Convert enum values to more readable format
                        switch (process) {
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
                            onChange={() =>
                              isOwner && setDecisionProcess(process)
                            }
                            label={formattedLabel}
                            disabled={!isOwner}
                          />
                        );
                      })}
                  </div>
                </div>
                {/* External Links Section */}
                <div
                  style={{
                    width: "100%",
                    background: "white",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: 10,
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      color: "black",
                      fontSize: 24,
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      marginBottom: "20px",
                    }}
                  >
                    External Links
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <Checkbox
                        checked={hasSpotifyPlaylist}
                        onChange={() =>
                          isOwner && handleToggleSpotifyPlaylist()
                        }
                        label="Spotify Playlist"
                        variant="external-link"
                        disabled={!isOwner}
                      />
                      {hasSpotifyPlaylist && (
                        <div style={{ marginTop: "10px", marginLeft: "26px" }}>
                          <input
                            type="text"
                            value={spotifyPlaylistUrl}
                            onChange={(e) =>
                              isOwner && handleSpotifyUrlChange(e)
                            }
                            placeholder="Enter Spotify playlist URL"
                            readOnly={!isOwner}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              fontSize: "14px",
                              ...(!isOwner && {
                                backgroundColor: "#f5f5f5",
                                cursor: "not-allowed",
                              }),
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
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

                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                  }}
                >
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
                <div
                  style={{
                    marginTop: "20px",
                    padding: "10px",
                    background: "#4CAF50",
                    color: "white",
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  Settings updated successfully!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Member management UI is now handled by the RoadtripMemberManagement component */}

      {/* Bounding Box Selector Modal */}
      {showBoundingBoxSelector && (
        <BoundingBoxSelector
          initialBoundingBox={boundingBox}
          onBoundingBoxChange={(newBoundingBox) => {
            setBoundingBox(newBoundingBox);
            setShowBoundingBoxSelector(false);
          }}
          onClose={() => setShowBoundingBoxSelector(false)}
        />
      )}
    </>
  );
}
