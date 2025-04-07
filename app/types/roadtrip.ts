export interface RoadtripMember {
  id: string;
  name: string;
}

export interface Roadtrip {
  roadtripId: number;
  name: string;
  roadtripDescription?: string;
  roadtripMembers: RoadtripMember[];
}
