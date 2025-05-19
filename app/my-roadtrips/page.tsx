"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { Roadtrip, RoadtripMemberDisplay } from "@/types/roadtrip";
import { InvitationStatus } from "@/types/roadtripMember";
import InvitationPopup from "@/components/InvitationPopup";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useToast } from "@/hooks/useToast";
import RoadtripCard from "@/components/cards/RoadtripCard";
import NewTripCard from "@/components/cards/NewTripCard";
import RoadtripCardMembers from "@/components/RoadtripCardMembers";

interface newRoadtripProps {
  name: string;
  roadtripMembers: RoadtripMemberDisplay[];
  roadtripDescription: string;
}

function RoadtripsContent() {
  const [roadtrips, setRoadtrips] = useState<Roadtrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoadtrip, setSelectedRoadtrip] = useState<Roadtrip | null>(
    null
  );
  const [showInvitationPopup, setShowInvitationPopup] = useState(false);
  const apiService = useApi();
  const router = useRouter();
  const { authState } = useAuth();
  const { showToast } = useToast();
  const userId = authState.userId;
  const [roadtripImages, setRoadtripImages] = useState<{
    [id: number]: string;
  }>({});

  // Track if we've already shown the login toast
  const [hasShownLoginToast, setHasShownLoginToast] = useState(false);

  const fetchRoadtripImage = useCallback(
    async (roadtripId: number) => {
      try {
        const res = await apiService.get<Response>(
          `/roadtrips/${roadtripId}/settings/images`
        );
        if (!res.ok) throw new Error("Image not found");
        const imageUrl = await res.text(); // ← pull the URL string from the body
        console.log("got image URL:", imageUrl);
        setRoadtripImages((prev) => ({ ...prev, [roadtripId]: imageUrl }));
      } catch (err) {
        console.warn("No image or error loading image for", roadtripId, err);
      }
    },
    [apiService]
  );

  // Function to fetch roadtrips
  const fetchRoadtrips = useCallback(async () => {
    // Check token directly from localStorage for debugging
    const token = localStorage.getItem("token");
    console.log("Token in my-roadtrips page:", token);

    // If user is not logged in, don't try to fetch roadtrips
    if (!authState.isLoggedIn || !token) {
      console.log("User not logged in or no token found");
      setError("Please login first in order to access your roadtrips.");
      setLoading(false);

      // Only show the toast once
      if (!hasShownLoginToast) {
        showToast("Please login to access your roadtrips", "warning");
        setHasShownLoginToast(true);
      }
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching roadtrips with token:", token);

      const data = await apiService.get<Roadtrip[]>("/roadtrips");
      console.log("API response:", data);

      // Process roadtrips to determine invitation status
      if (Array.isArray(data)) {
        // Process each roadtrip to determine the current user's invitation status
        const processedRoadtrips = data.map((roadtrip) => {
          if (roadtrip.roadtripId === undefined) {
            console.warn("Roadtrip without ID:", roadtrip);
          }

          // Check if the current user is the owner of the roadtrip
          const isOwner =
            roadtrip.ownerId &&
            userId &&
            roadtrip.ownerId.toString() === userId.toString();

          // If the user is the owner, always set invitation status to ACCEPTED
          if (isOwner) {
            console.log(
              `User is the owner of roadtrip ${roadtrip.roadtripId}, setting status to ACCEPTED`
            );
            return {
              ...roadtrip,
              invitationStatus: InvitationStatus.ACCEPTED,
            };
          }

          // Make sure roadtripMembers exists before trying to find a member
          const roadtripMembers = roadtrip.roadtripMembers || [];
          const currentUserMember = roadtripMembers.find(
            (member) => member.id === userId
          );

          // If the user is a member, check their invitation status
          if (currentUserMember && currentUserMember.invitationStatus) {
            console.log(
              `User is a member of roadtrip ${roadtrip.roadtripId} with status: ${currentUserMember.invitationStatus}`
            );
            return {
              ...roadtrip,
              invitationStatus: currentUserMember.invitationStatus,
            };
          }

          // If the roadtrip has an invitationStatus from the API, use that
          if (roadtrip.invitationStatus) {
            console.log(
              `Using API-provided invitation status for roadtrip ${roadtrip.roadtripId}: ${roadtrip.invitationStatus}`
            );
            return roadtrip;
          }

          // Default to ACCEPTED for existing roadtrips
          console.log(
            `No invitation status found for roadtrip ${roadtrip.roadtripId}, defaulting to ACCEPTED`
          );
          return {
            ...roadtrip,
            invitationStatus: InvitationStatus.ACCEPTED,
          };
        });

        setRoadtrips(processedRoadtrips);

        // Fetch images for each roadtrip
        processedRoadtrips.forEach((roadtrip) => {
          if (roadtrip.roadtripId !== undefined) {
            fetchRoadtripImage(roadtrip.roadtripId);
          }
        });

        setError(null);
      } else {
        console.error("Unexpected response format:", data);
        setError("Received invalid data format from server.");
        showToast("Error loading roadtrips: Invalid data format", "error");
      }
    } catch (err) {
      console.error("Error fetching roadtrips:", err);

      // Check if it's a 401 error (not authenticated)
      const error = err as { status?: number };
      if (error && error.status === 401) {
        console.log("Authentication error (401)");
        // Clear token and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setError("Your session has expired. Please login again.");
        showToast("Your session has expired. Please login again.", "error");
        // Redirect to login page
        router.push("/login");
      } else {
        setError("Failed to load roadtrips. Please try again later.");
        showToast("Failed to load roadtrips. Please try again later.", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [
    apiService,
    authState.isLoggedIn,
    router,
    userId,
    showToast,
    hasShownLoginToast,
  ]);

  useEffect(() => {
    fetchRoadtrips();
  }, [fetchRoadtrips]);

  const handleRoadtripClick = (roadtrip: Roadtrip) => {
    if (roadtrip.roadtripId === undefined) {
      console.error("Roadtrip ID is undefined");
      return;
    }

    // Check if this is a pending invitation
    if (roadtrip.invitationStatus === InvitationStatus.PENDING) {
      // Show invitation popup
      setSelectedRoadtrip(roadtrip);
      setShowInvitationPopup(true);
    } else {
      // Navigate to the roadtrip page
      router.push(`/my-roadtrips/${roadtrip.roadtripId}`);
    }
  };

  // Handle invitation status change
  const handleInvitationStatusChange = () => {
    // Refresh the roadtrips list
    fetchRoadtrips();
  };

  const handleNewRoadtripClick = async () => {
    try {
      // Create a new empty roadtrip
      const newRoadtrip: newRoadtripProps = {
        name: "New Roadtrip",
        roadtripMembers: [],
        roadtripDescription: "",
      };

      console.log("Creating new roadtrip...");

      // Post the new roadtrip to the API
      const createdRoadtrip = await apiService.post<Roadtrip>(
        "/roadtrips",
        newRoadtrip
      );
      console.log("Created roadtrip:", createdRoadtrip);

      // Show success toast
      showToast("New roadtrip created successfully!", "success");

      // Redirect to the settings page for the new roadtrip
      // Use roadtripId from backend
      const roadtripId = createdRoadtrip.roadtripId;

      if (roadtripId === undefined) {
        throw new Error("Created roadtrip has no ID");
      }

      router.push(`/my-roadtrips/${roadtripId}/settings`);
    } catch (err) {
      console.error("Error creating new roadtrip:", err);

      // Check if it's an authentication error
      const error = err as { status?: number };
      if (error && error.status === 401) {
        setError("Please login first in order to create a roadtrip.");
        showToast("Authentication required to create a roadtrip", "error");
      } else {
        setError("Failed to create new roadtrip. Please try again later.");
        showToast("Failed to create new roadtrip", "error");
      }
    }
  };

  const formatMembersList = (members?: RoadtripMemberDisplay[]) => {
    // Handle undefined or empty members array
    if (!members || members.length === 0) return "No members";
    if (members.length === 1) return members[0].name;

    const firstTwo = members
      .slice(0, 2)
      .map((m) => m.name)
      .join(", ");
    const remaining = members.length - 2;

    return remaining > 0 ? `${firstTwo} + ${remaining} more` : firstTwo;
  };

  const styles = {
    page: { padding: 32, maxWidth: 1500, margin: "0 auto" } as const,
    title: {
      fontSize: 32,
      margin: "0 0 8px 40px",
      textAlign: "left",
    } as const,
    hr: {
      border: "none",
      borderBottom: "1px solid #ccc",
      marginBottom: 32,
    } as const,
    grid: {
      display: "flex",
      flexWrap: "wrap",
      gap: 20,
      padding: 20,
    } as const,
  };

  return (
    <>
      <Header />

      {showInvitationPopup && selectedRoadtrip && (
        <InvitationPopup
          roadtrip={selectedRoadtrip}
          onClose={() => setShowInvitationPopup(false)}
          onStatusChange={handleInvitationStatusChange}
        />
      )}

      <div style={styles.page}>
        <h1 style={styles.title}>My Roadtrips</h1>
        <hr style={styles.hr} />

        {loading && <p>Loading…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div style={styles.grid}>
            {roadtrips.map((rt, i) => (
              <RoadtripCard
                key={rt.roadtripId ?? i}
                roadtrip={rt}
                imageUrl={
                  rt.roadtripId ? roadtripImages[rt.roadtripId] : undefined
                }
                onClick={() => handleRoadtripClick(rt)}
                formatMembersList={formatMembersList}
                membersComponent={
                  rt.roadtripId ? (
                    <RoadtripCardMembers roadtripId={rt.roadtripId} />
                  ) : null
                }
              />
            ))}

            <NewTripCard onClick={handleNewRoadtripClick} />
          </div>
        )}
      </div>
    </>
  );
}

// Wrap the content with ProtectedRoute
export default function MyRoadtrips() {
  return (
    <ProtectedRoute>
      <RoadtripsContent />
    </ProtectedRoute>
  );
}
