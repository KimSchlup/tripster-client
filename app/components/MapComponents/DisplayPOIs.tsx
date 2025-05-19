"use client";

import dynamic from "next/dynamic";
import { PoiAcceptanceStatus, PointOfInterest } from "@/types/poi";
import { FC, useEffect, useState } from "react";
import type { Icon } from "leaflet";
import { useLayerFilter } from "./LayerFilterContext";
import { useLeaflet, createColoredMarker } from "@/utils/leafletUtils";

// Dynamically import Leaflet components to avoid SSR issues
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

export const DisplayPOIs: FC<{
  pois: PointOfInterest[];
  setSelectedPoiId: (id: number) => void;
  zoomToPoi?: (poi: PointOfInterest) => void;
}> = ({ pois, setSelectedPoiId, zoomToPoi }) => {
  const { filter } = useLayerFilter();
  const leaflet = useLeaflet();
  const [markerIcons, setMarkerIcons] = useState<Record<string, Icon | null>>(
    {}
  );

  // Create marker icons when Leaflet is loaded
  useEffect(() => {
    if (!leaflet) return;

    const icons: Record<string, Icon | null> = {};
    // Create icons for each status
    icons.pending = createColoredMarker(leaflet, "#ff9900");
    icons.accepted = createColoredMarker(leaflet, "#79A44D");
    icons.declined = createColoredMarker(leaflet, "#FF0000");
    icons.default = createColoredMarker(leaflet, "#000000");

    setMarkerIcons(icons);
  }, [leaflet]);

  // Filter POIs based on the layer filter settings
  const filteredPois = pois.filter((poi) => {
    // If filter arrays are empty, show all POIs (no filtering)
    const statusFilter =
      filter.poiFilter.status.length === 0 ||
      filter.poiFilter.status.includes(poi.status);
    const categoryFilter =
      filter.poiFilter.category.length === 0 ||
      filter.poiFilter.category.includes(poi.category);
    const priorityFilter =
      filter.poiFilter.priority.length === 0 ||
      filter.poiFilter.priority.includes(poi.priority);
    const creatorFilter =
      filter.poiFilter.creatorUserIds.length === 0 ||
      filter.poiFilter.creatorUserIds.includes(poi.creatorId);

    return statusFilter && categoryFilter && priorityFilter && creatorFilter;
  });

  // Don't render anything if Leaflet isn't loaded yet
  if (!leaflet || Object.keys(markerIcons).length === 0) {
    return null;
  }

  return (
    <>
      {filteredPois.map((poi) => {
        // Select the appropriate icon based on status
        let icon;
        if (poi.status === PoiAcceptanceStatus.PENDING) {
          icon = markerIcons.pending;
        } else if (poi.status === PoiAcceptanceStatus.ACCEPTED) {
          icon = markerIcons.accepted;
        } else if (poi.status === PoiAcceptanceStatus.DECLINED) {
          icon = markerIcons.declined;
        } else {
          icon = markerIcons.default;
        }

        // Only render the marker if we have a valid icon
        return icon ? (
          <Marker
            key={poi.poiId}
            position={[
              poi.coordinate.coordinates[1],
              poi.coordinate.coordinates[0],
            ]}
            icon={icon}
            eventHandlers={{
              click: () => {
                setSelectedPoiId(poi.poiId);
                if (zoomToPoi) zoomToPoi(poi);
              },
            }}
          />
        ) : null;
      })}
    </>
  );
};
