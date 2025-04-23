"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useApi } from "./useApi";
import { RoadtripMemberService } from "@/services/roadtripMemberService";
import { User } from "@/types/user";
import { RoadtripMember, InvitationStatus } from "@/types/roadtripMember";

// Extended User type that includes invitation status
interface UserWithInvitationStatus extends User {
  invitationStatus?: InvitationStatus;
}

interface UseRoadtripMembersProps {
  roadtripId: string | number;
}

interface UseRoadtripMembersReturn {
  members: User[];
  loading: boolean;
  error: string | null;
  inviteMember: (username: string) => Promise<RoadtripMember | null>;
  removeMember: (userId: string | number) => Promise<boolean>;
  updateMemberStatus: (userId: string | number, status: InvitationStatus) => Promise<boolean>;
  refreshMembers: () => Promise<void>;
}

/**
 * Hook for managing roadtrip members
 */
export function useRoadtripMembers({ roadtripId }: UseRoadtripMembersProps): UseRoadtripMembersReturn {
  const apiService = useApi();
  // Wrap memberService in useMemo to prevent it from being recreated on every render
  const memberService = useMemo(() => new RoadtripMemberService(apiService), [apiService]);
  
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all members of the roadtrip
   */
  const refreshMembers = useCallback(async () => {
    if (!roadtripId) return;
    
    try {
      // Only set loading to true on initial load, not on refreshes
      if (members.length === 0) {
        setLoading(true);
      }
      setError(null);
        const fetchedMembers = await memberService.getMembers(roadtripId);
        
        // Enhance the user objects with invitation status if not already present
        // In a real implementation, this would come from the API
        const enhancedMembers = fetchedMembers.map(member => {
          const userWithStatus = member as UserWithInvitationStatus;
          // If the member already has an invitationStatus, use it
          if (userWithStatus.invitationStatus) {
            return member;
          }
          
          // Otherwise, add a simulated one for demonstration
          // In a real implementation, this would come from the API
          const randomStatus = Math.random();
          let status;
          
          if (randomStatus < 0.2) {
            status = InvitationStatus.PENDING;
          } else if (randomStatus < 0.3) {
            status = InvitationStatus.DECLINED;
          } else {
            status = InvitationStatus.ACCEPTED;
          }
          
          return {
            ...member,
            invitationStatus: status
          };
        });
        
        setMembers(enhancedMembers);
    } catch (err) {
      console.error("Error fetching roadtrip members:", err);
      setError("Failed to load roadtrip members. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [roadtripId, memberService, members.length]);

  /**
   * Invite a user to the roadtrip
   */
  const inviteMember = async (username: string): Promise<RoadtripMember | null> => {
    if (!roadtripId || !username.trim()) return null;
    
    try {
      setError(null);
      const result = await memberService.inviteMember(roadtripId, username);
      await refreshMembers(); // Refresh the member list after inviting
      return result;
    } catch (err) {
      console.error("Error inviting member:", err);
      setError("Failed to invite member. Please check the username and try again.");
      return null;
    }
  };

  /**
   * Remove a user from the roadtrip
   */
  const removeMember = async (userId: string | number): Promise<boolean> => {
    if (!roadtripId || !userId) return false;
    
    try {
      setError(null);
      await memberService.removeMember(roadtripId, userId);
      await refreshMembers(); // Refresh the member list after removing
      return true;
    } catch (err) {
      console.error("Error removing member:", err);
      setError("Failed to remove member. Please try again.");
      return false;
    }
  };

  /**
   * Update a member's invitation status
   */
  const updateMemberStatus = async (userId: string | number, status: InvitationStatus): Promise<boolean> => {
    if (!roadtripId || !userId) return false;
    
    try {
      setError(null);
      await memberService.updateMemberStatus(roadtripId, userId, status);
      await refreshMembers(); // Refresh the member list after updating
      return true;
    } catch (err) {
      console.error("Error updating member status:", err);
      setError("Failed to update member status. Please try again.");
      return false;
    }
  };

  // Fetch members when the component mounts or roadtripId changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!roadtripId) return;
      
      try {
        setLoading(true);
        setError(null);
        const fetchedMembers = await memberService.getMembers(roadtripId);
        
        // Enhance the user objects with invitation status if not already present
        // In a real implementation, this would come from the API
        const enhancedMembers = fetchedMembers.map(member => {
          const userWithStatus = member as UserWithInvitationStatus;
          // If the member already has an invitationStatus, use it
          if (userWithStatus.invitationStatus) {
            return member;
          }
          
          // Otherwise, add a simulated one for demonstration
          // In a real implementation, this would come from the API
          const randomStatus = Math.random();
          let status;
          
          if (randomStatus < 0.2) {
            status = InvitationStatus.PENDING;
          } else if (randomStatus < 0.3) {
            status = InvitationStatus.DECLINED;
          } else {
            status = InvitationStatus.ACCEPTED;
          }
          
          return {
            ...member,
            invitationStatus: status
          };
        });
        
        // Only update state if component is still mounted
        if (isMounted) {
          setMembers(enhancedMembers);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching roadtrip members:", err);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setError("Failed to load roadtrip members. Please try again.");
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [roadtripId, memberService]);

  return {
    members,
    loading,
    error,
    inviteMember,
    removeMember,
    updateMemberStatus,
    refreshMembers
  };
}
