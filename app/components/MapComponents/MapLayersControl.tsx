// MapLayersControl.tsx
import { useEffect } from "react";
import { TileLayer, Rectangle } from "react-leaflet";
import { useLayerFilter } from "./LayerFilterContext";
import { DisplayPOIs } from "./DisplayPOIs";
import RouteDisplay from "./RouteDisplay";
import { PointOfInterest } from "@/types/poi";
import { Route } from "@/types/routeTypes";
import { LatLngBounds } from "leaflet";
import type { GeoJSON } from "geojson";

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

  // Set the initial basemap type when the component mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setFilter({ basemapType: initialBasemapType });
  }, [initialBasemapType]);

  // Convert GeoJSON bounding box to Leaflet bounds if provided
  const getBoundsFromGeoJSON = (): LatLngBounds | null => {
    if (!boundingBox || boundingBox.type !== "Polygon") return null;

    try {
      const coordinates = boundingBox.coordinates[0];

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

      return new LatLngBounds([minLat, minLng], [maxLat, maxLng]);
    } catch (error) {
      console.error("Error converting GeoJSON to bounds:", error);
      return null;
    }
  };

  const bounds = getBoundsFromGeoJSON();

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

      <DisplayPOIs pois={pois} setSelectedPoiId={setSelectedPoiId} zoomToPoi={zoomToPoi} />
      <RouteDisplay
        routes={routes}
        onRouteClick={(route) => setSelectedRoute(route)}
        zoomToRoute={zoomToRoute}
      />
    </>
  );
}
