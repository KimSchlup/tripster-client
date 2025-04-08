export interface RoadtripMember {
  id: string;
  name: string;
}

export interface Roadtrip {
  id: number;                   // Primary ID from backend
  roadtripId?: number;          // Kept for backward compatibility
  name: string;
  description?: string;         // From backend DTO
  roadtripDescription?: string; // Kept for backward compatibility
  roadtripMembers: RoadtripMember[];
}
