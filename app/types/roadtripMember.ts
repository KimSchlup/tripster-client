export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED"
}

/**
 * Represents a roadtrip member in the backend data model
 * Used for API operations and data management
 */
export interface RoadtripMember {
  userId: number;
  roadtripId: number;
  username: string;
  invitationStatus: InvitationStatus;
}
