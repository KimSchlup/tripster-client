import { Route, RouteAcceptanceStatus, TravelMode } from "@/types/route";
import { Polyline } from "react-leaflet";

interface RouteDisplayProps {
  routes: Route[];
  onRouteClick: (route: Route) => void;
}

export default function RouteDisplay({ routes, onRouteClick }: RouteDisplayProps) {
  return (
    <>
      {routes.map((route, index) => (
        <Polyline
          key={`${route.startId}-${route.endId}-${index}`}
          positions={route.route.coordinates.map(coord => [coord[1], coord[0]])}
          color={getRouteColor(route.status, route.travelMode)}
          weight={4}
          opacity={0.7}
          eventHandlers={{
            click: () => onRouteClick(route)
          }}
        />
      ))}
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
    case TravelMode.PUBLIC_TRANSPORT:
      baseColor = "#9933cc"; // Purple
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
