export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED"
}

export interface RoadtripMember {
  userId: number;
  roadtripId: number;
  invitationStatus: InvitationStatus;
}
