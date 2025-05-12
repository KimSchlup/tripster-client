// MapLayersControl.tsx
import { useEffect } from "react";
import { TileLayer } from "react-leaflet";
import { useLayerFilter } from "./LayerFilterContext";
import { DisplayPOIs } from "./DisplayPOIs";
import RouteDisplay from "./RouteDisplay";
import { PointOfInterest } from "@/types/poi";
import { Route } from "@/types/routeTypes";

interface MapLayersControlProps {
  initialBasemapType: "SATELLITE" | "OPEN_STREET_MAP" | "TOPOGRAPHY";
  pois: PointOfInterest[];
  routes: Route[];
  setSelectedPoiId: (id: number) => void;
  setSelectedRoute: (route: Route) => void;
}

export default function MapLayersControl({
  initialBasemapType,
  pois,
  routes,
  setSelectedPoiId,
  setSelectedRoute,
}: MapLayersControlProps) {
  const { filter, setFilter } = useLayerFilter();

  // Set the initial basemap type when the component mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setFilter({ basemapType: initialBasemapType });
  }, [initialBasemapType]);

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
      <DisplayPOIs pois={pois} setSelectedPoiId={setSelectedPoiId} />
      <RouteDisplay
        routes={routes}
        onRouteClick={(route) => setSelectedRoute(route)}
      />
    </>
  );
}
