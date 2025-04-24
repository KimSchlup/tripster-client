import { Route, RouteAcceptanceStatus, TravelMode } from "@/types/route";
import { Polyline } from "react-leaflet";

interface RouteDisplayProps {
  routes: Route[];
  onRouteClick: (route: Route) => void;
}

export default function RouteDisplay({ routes, onRouteClick }: RouteDisplayProps) {
  // Debug the route data structure
  console.log("Routes in RouteDisplay:", routes);
  
  return (
    <>
      {routes.map((route, index) => {
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
              color={getRouteColor(route.status, route.travelMode)}
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

function getRouteColor(status: RouteAcceptanceStatus, travelMode: TravelMode): string {
  // First determine base color by travel mode
  let baseColor: string;
  switch (travelMode) {
    case TravelMode.DRIVING_CAR:
      baseColor = "#3388ff"; // Blue
      break;
    case TravelMode.FOOT_WALKING:
      baseColor = "#33cc33"; // Green
      break;
    case TravelMode.CYCLING_REGULAR:
      baseColor = "#ff9900"; // Orange
      break;
    default:
      baseColor = "#3388ff"; // Default blue
  }

  // Then adjust based on status
  switch (status) {
    case RouteAcceptanceStatus.APPROVED:
      return baseColor; // Keep the original color for approved routes
    case RouteAcceptanceStatus.PENDING:
      return "#FFD700"; // Yellow for pending routes
    case RouteAcceptanceStatus.REJECTED:
      return "#FF0000"; // Red for rejected routes
    default:
      return baseColor;
  }
}
