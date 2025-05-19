"use client";

import { useEffect, useState } from 'react';
import type { GeoJSON } from 'geojson';

/**
 * A utility to safely import Leaflet only on the client side
 * This avoids the "window is not defined" error during server-side rendering
 */
export function useLeaflet() {
  const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    // Only import Leaflet on the client side
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        setLeaflet(L);
      });
    }
  }, []);

  return leaflet;
}

/**
 * A utility to create a Leaflet icon with the given color
 * This should be used at the component level, not inside render functions
 */
export function createColoredMarker(L: typeof import('leaflet'), color: string) {
  if (!L) return null;
  
  const svgString = `
<svg width="35" height="65" viewBox="-5 -5 45 65" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="white" flood-opacity="0.4"/>
    </filter>
  </defs>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.01639 21.8641L17.125 34.5L27.2337 21.8641C29.1862 19.4235 30.25 16.3909 30.25 13.2652V12.625C30.25 5.37626 24.3737 -0.5 17.125 -0.5C9.87626 -0.5 4 5.37626 4 12.625V13.2652C4 16.3909 5.06378 19.4235 7.01639 21.8641ZM17.125 17C19.5412 17 21.5 15.0412 21.5 12.625C21.5 10.2088 19.5412 8.25 17.125 8.25C14.7088 8.25 12.75 10.2088 12.75 12.625C12.75 15.0412 14.7088 17 17.125 17Z" stroke="white" stroke-width="1.2" filter="url(#glow)" fill="${color}" shape-rendering="geometricPrecision"/>
</svg>
`;
  const svgUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

  return new L.Icon({
    iconUrl: svgUrl,
    iconSize: [52, 52],
    iconAnchor: [32, 32],
  });
}

/**
 * A utility to get the color for a route based on its status
 */
export function getRouteColor(status: string): string {
  switch (status) {
    case 'ACCEPTED':
      return "#33cc33"; // Green for approved routes
    case 'PENDING':
      return "#ff9900"; // Yellow for pending routes
    case 'DECLINED':
      return "#FF0000"; // Red for rejected routes
    default:
      return "#3388ff"; // Default blue
  }
}

/**
 * A utility to create a Leaflet LatLngBounds from a GeoJSON polygon
 */
export function createBoundsFromGeoJSON(
  L: typeof import('leaflet'), 
  geoJson?: GeoJSON
): import('leaflet').LatLngBounds | null {
  if (!L || !geoJson) {
    return null;
  }

  try {
    // Check if it's a Polygon and access coordinates
    if (geoJson.type !== "Polygon") {
      return null;
    }
    
    // Type assertion to access coordinates
    const polygonGeoJson = geoJson as { type: "Polygon"; coordinates: number[][][] };
    const coordinates = polygonGeoJson.coordinates[0];

    // Find min/max coordinates to create bounds
    let minLat = 90,
      maxLat = -90,
      minLng = 180,
      maxLng = -180;

    for (const [lng, lat] of coordinates) {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    }

    return new L.LatLngBounds([minLat, minLng], [maxLat, maxLng]);
  } catch (error) {
    console.error("Error converting GeoJSON to bounds:", error);
    return null;
  }
}