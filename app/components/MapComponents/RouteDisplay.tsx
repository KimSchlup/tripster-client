import { Route, RouteAcceptanceStatus } from "@/types/routeTypes";
import { Polyline } from "react-leaflet";
import { useLayerFilter } from "./LayerFilterContext";

interface RouteDisplayProps {
  routes: Route[];
  onRouteClick: (route: Route) => void;
}

export default function RouteDisplay({ routes, onRouteClick }: RouteDisplayProps) {
  // Debug the route data structure
  console.log("Routes in RouteDisplay:", routes);
  
  const { filter } = useLayerFilter();
  
  // Don't render routes if showRoutes is false or if no route status is selected
  if (!filter.showRoutes || filter.routeFilter.status.length === 0) {
    return null;
  }
  
  return (
    <>
      {routes.filter(route => filter.routeFilter.status.includes(route.status)).map((route, index) => {
        try {
          // Parse the route data if it's a string (from backend DTO)
          let routeData;
          if (typeof route.route === 'string') {
            try {
              routeData = JSON.parse(route.route);
              console.log(`Parsed route data for index ${index}:`, routeData);
            } catch (parseError) {
              console.error(`Error parsing route string at index ${index}:`, parseError);
              return null; // Skip rendering this route
            }
          } else {
            routeData = route.route;
          }
          
          // Check if we have valid coordinates
          if (!routeData || !routeData.coordinates || !Array.isArray(routeData.coordinates)) {
            console.warn(`Route at index ${index} has invalid coordinates:`, routeData);
            return null; // Skip rendering this route
          }
          
          return (
            <Polyline
              key={`${route.startId}-${route.endId}-${index}`}
              positions={routeData.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])}
              color={getRouteColor(route.status)}
              weight={4}
              opacity={0.7}
              eventHandlers={{
                click: () => onRouteClick(route)
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

function getRouteColor(status: RouteAcceptanceStatus): string {
console.log("Route status:", status);
  // adjust based on status
  switch (status) {
    case RouteAcceptanceStatus.ACCEPTED:
      return "#33cc33"; // Keep the original color for approved routes
    case RouteAcceptanceStatus.PENDING:
      return "#ff9900"; // Yellow for pending routes "#ff9900"  "#FFD700"
    case RouteAcceptanceStatus.DECLINED:
      return "#FF0000"; // Red for rejected routes
    default:
      return "#3388ff";
  }
}
