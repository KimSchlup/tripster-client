"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
import { Roadtrip } from "@/types/roadtrip";
import { InvitationStatus } from "@/types/roadtripMember";

// Context type
interface RoadtripInvitationContextType {
  pendingInvitations: Roadtrip[];
}

// Create context
const RoadtripInvitationContext = createContext<
  RoadtripInvitationContextType | undefined
>(undefined);

// Provider props
interface RoadtripInvitationProviderProps {
  children: ReactNode;
  pollingInterval?: number; // in milliseconds
}

export const RoadtripInvitationProvider: React.FC<
  RoadtripInvitationProviderProps
> = ({
  children,
  pollingInterval = 5000, // Default to 5 seconds
}) => {
  const [pendingInvitations, setPendingInvitations] = useState<Roadtrip[]>([]);
  const [seenInvitationIds, setSeenInvitationIds] = useState<Set<number>>(
    new Set()
  );
  const apiService = useApi();
  const { authState } = useAuth();
  const { showToast } = useToast();

  // Function to fetch roadtrips and check for new invitations
  const checkForNewInvitations = useCallback(async () => {
    // Only check if user is logged in
    if (!authState.isLoggedIn) return;

    try {
      const data = await apiService.get<Roadtrip[]>("/roadtrips");

      if (Array.isArray(data)) {
        // Filter for roadtrips with PENDING invitation status
        // Note: The API might return "Invite" status which we treat the same as PENDING
        const pendingInvites = data.filter((roadtrip) => {
          // Check for PENDING status
          if (roadtrip.invitationStatus === InvitationStatus.PENDING) {
            return true;
          }

          // Check for "Invite" status (using type assertion since it's not in the enum)
          if (
            typeof roadtrip.invitationStatus === "string" &&
            (roadtrip.invitationStatus as string).toUpperCase() === "INVITE"
          ) {
            return true;
          }

          return false;
        });

        // Update pending invitations state
        setPendingInvitations(pendingInvites);

        // Check for new invitations (not in seenInvitationIds)
        const newInvitations = pendingInvites.filter(
          (invite) =>
            invite.roadtripId && !seenInvitationIds.has(invite.roadtripId)
        );

        // Show toast for each new invitation
        newInvitations.forEach((invite) => {
          showToast(
            `You have been invited to a new Roadtrip: ${invite.name}`,
            "info"
          );
        });

        // Update seen invitation IDs
        if (newInvitations.length > 0) {
          const updatedSeenIds = new Set(seenInvitationIds);
          newInvitations.forEach((invite) => {
            if (invite.roadtripId) {
              updatedSeenIds.add(invite.roadtripId);
            }
          });
          setSeenInvitationIds(updatedSeenIds);
        }
      }
    } catch (error) {
      console.error("Error checking for roadtrip invitations:", error);
    }
  }, [authState.isLoggedIn, apiService, showToast, seenInvitationIds]);

  // Set up polling
  useEffect(() => {
    // Initial check
    checkForNewInvitations();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkForNewInvitations, pollingInterval);

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [checkForNewInvitations, pollingInterval]);

  // Context value
  const contextValue: RoadtripInvitationContextType = {
    pendingInvitations,
  };

  return (
    <RoadtripInvitationContext.Provider value={contextValue}>
      {children}
    </RoadtripInvitationContext.Provider>
  );
};

// Hook for using roadtrip invitations
export const useRoadtripInvitations = (): RoadtripInvitationContextType => {
  const context = useContext(RoadtripInvitationContext);
  if (context === undefined) {
    throw new Error(
      "useRoadtripInvitations must be used within a RoadtripInvitationProvider"
    );
  }
  return context;
};
