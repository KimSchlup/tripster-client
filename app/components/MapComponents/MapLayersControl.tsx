"use client";

// MapLayersControl.tsx
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useLayerFilter } from "./LayerFilterContext";
import { DisplayPOIs } from "./DisplayPOIs";
import RouteDisplay from "./RouteDisplay";
import { PointOfInterest } from "@/types/poi";
import { Route } from "@/types/routeTypes";
import type { GeoJSON } from "geojson";
import { useLeaflet, createBoundsFromGeoJSON } from "@/utils/leafletUtils";

// Dynamically import Leaflet components to avoid SSR issues
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Rectangle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Rectangle),
  { ssr: false }
);

interface MapLayersControlProps {
  initialBasemapType: "SATELLITE" | "OPEN_STREET_MAP" | "TOPOGRAPHY";
  pois: PointOfInterest[];
  routes: Route[];
  setSelectedPoiId: (id: number) => void;
  setSelectedRoute: (route: Route) => void;
  zoomToPoi?: (poi: PointOfInterest) => void;
  zoomToRoute?: (route: Route) => void;
  boundingBox?: GeoJSON;
}

export default function MapLayersControl({
  initialBasemapType,
  pois,
  routes,
  setSelectedPoiId,
  setSelectedRoute,
  zoomToPoi,
  zoomToRoute,
  boundingBox,
}: MapLayersControlProps) {
  const { filter, setFilter } = useLayerFilter();
  const leaflet = useLeaflet();

  // Set the initial basemap type when the component mounts
  useEffect(() => {
    setFilter({ basemapType: initialBasemapType });
  }, [initialBasemapType, setFilter]);

  // Create bounds from GeoJSON when Leaflet is loaded
  const bounds = leaflet ? createBoundsFromGeoJSON(leaflet, boundingBox) : null;

  return (
    <>
      {filter.basemapType === "SATELLITE" && (
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      )}
      {filter.basemapType === "OPEN_STREET_MAP" && (
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      )}
      {filter.basemapType === "TOPOGRAPHY" && (
        <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
      )}

      {/* Display bounding box if it exists */}
      {bounds && (
        <Rectangle
          bounds={bounds}
          pathOptions={{
            color: "blue",
            weight: 2,
            fillOpacity: 0.05,
            dashArray: "5, 5",
          }}
        />
      )}

      <DisplayPOIs
        pois={pois}
        setSelectedPoiId={setSelectedPoiId}
        zoomToPoi={zoomToPoi}
      />
      <RouteDisplay
        routes={routes}
        onRouteClick={(route) => setSelectedRoute(route)}
        zoomToRoute={zoomToRoute}
      />
    </>
  );
}
