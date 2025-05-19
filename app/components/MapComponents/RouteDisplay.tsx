"use client";

import { Route } from "@/types/routeTypes";
import dynamic from "next/dynamic";
import { useLayerFilter } from "./LayerFilterContext";
import { getRouteColor } from "@/utils/leafletUtils";

// Dynamically import Leaflet components to avoid SSR issues
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface RouteDisplayProps {
  routes: Route[];
  onRouteClick: (route: Route) => void;
  zoomToRoute?: (route: Route) => void;
}

export default function RouteDisplay({
  routes,
  onRouteClick,
  zoomToRoute,
}: RouteDisplayProps) {
  // Debug the route data structure
  console.log("Routes in RouteDisplay:", routes);

  const { filter } = useLayerFilter();

  // Don't render routes if showRoutes is false or if no route status is selected
  if (!filter.showRoutes || filter.routeFilter.status.length === 0) {
    return null;
  }

  return (
    <>
      {routes
        .filter((route) => filter.routeFilter.status.includes(route.status))
        .map((route, index) => {
          try {
            // Parse the route data if it's a string (from backend DTO)
            let routeData;
            if (typeof route.route === "string") {
              try {
                routeData = JSON.parse(route.route);
                console.log(`Parsed route data for index ${index}:`, routeData);
              } catch (parseError) {
                console.error(
                  `Error parsing route string at index ${index}:`,
                  parseError
                );
                return null; // Skip rendering this route
              }
            } else {
              routeData = route.route;
            }

            // Check if we have valid coordinates
            if (
              !routeData ||
              !routeData.coordinates ||
              !Array.isArray(routeData.coordinates)
            ) {
              console.warn(
                `Route at index ${index} has invalid coordinates:`,
                routeData
              );
              return null; // Skip rendering this route
            }

            return (
              <Polyline
                key={`${route.startId}-${route.endId}-${index}`}
                positions={routeData.coordinates.map(
                  (coord: [number, number]) => [coord[1], coord[0]]
                )}
                color={getRouteColor(route.status)}
                weight={4}
                opacity={0.7}
                eventHandlers={{
                  click: () => {
                    onRouteClick(route);
                    if (zoomToRoute) zoomToRoute(route);
                  },
                }}
              />
            );
          } catch (error) {
            console.error(`Error rendering route at index ${index}:`, error);
            console.error("Problematic route:", route);
            return null; // Skip rendering this route on error
          }
        })}
    </>
  );
}

// Function removed to avoid duplication
