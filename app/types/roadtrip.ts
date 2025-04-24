import { InvitationStatus } from "./roadtripMember";

/**
 * Represents a roadtrip member in the UI context with display-oriented properties
 */
export interface RoadtripMemberDisplay {
  id: string;
  name: string;
  invitationStatus?: InvitationStatus;
}

export interface Roadtrip {
  id: number;                   // Primary ID from backend
  roadtripId?: number;          // Kept for backward compatibility
  ownerId?: number;             // ID of the roadtrip owner
  name: string;
  description?: string;         // From backend DTO
  roadtripDescription?: string; // Kept for backward compatibility
  roadtripMembers?: RoadtripMemberDisplay[]; // Optional as it might not be included in API response
  invitationStatus?: InvitationStatus; // Status of the current user's invitation
}
