import type { GeoJSON } from 'geojson';

export enum BasemapType {
  DEFAULT = "DEFAULT",
  SATELLITE = "SATELLITE",
  SATELLITE_HYBRID = "SATELLITE_HYBRID",
  OPEN_STREET_MAP = "OPEN_STREET_MAP"
}

export enum DecisionProcess {
  DEFAULT = "DEFAULT",
  MAJORITY = "MAJORITY",
  OWNER_DECISION = "OWNER_DECISION"
}

export interface RoadtripSettings {
  roadtripSettingsId: number;
  roadtripId: number;
  basemapType: BasemapType;
  decisionProcess: DecisionProcess;
  boundingBox?: GeoJSON; // Optional to handle null cases
  startDate?: string; // Using string for ISO date format
  endDate?: string;
  spotifyPlaylistUrl?: string; // Optional Spotify playlist URL
}
