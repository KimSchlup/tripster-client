import type { GeoJSON } from 'geojson';

export enum BasemapType {
  STANDARD = "STANDARD",
  SATELLITE = "SATELLITE",
  TERRAIN = "TERRAIN"
}

export enum DecisionProcess {
  MAJORITY = "MAJORITY",
  OWNER = "OWNER"
}

export interface RoadtripSettings {
  roadtripSettingsId: number;
  roadtripId: number;
  basemapType: BasemapType;
  decisionProcess: DecisionProcess;
  boundingBox?: GeoJSON; // Optional to handle null cases
  startDate?: string; // Using string for ISO date format
  endDate?: string;
}
