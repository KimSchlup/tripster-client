import { Route, TravelMode } from "@/types/routeTypes";
import { PointOfInterest } from "@/types/poi";
import Draggable from "react-draggable";
import { useRef } from "react";

interface RouteListProps {
  routes: Route[];
  pois: PointOfInterest[];
  onRouteSelect: (route: Route) => void;
}

export default function RouteList({ routes, pois, onRouteSelect }: RouteListProps) {
  const nodeRef = useRef<HTMLDivElement>(null!);

  // Format travel time (convert from seconds to minutes/hours)
  const formatTravelTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.round(seconds)} sec`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)} min`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  // Format distance (convert from meters to km)
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  };

  // Get icon for travel mode
  const getTravelModeIcon = (mode: TravelMode): string => {
    switch (mode) {
      case TravelMode.DRIVING_CAR:
        return "🚗";
      case TravelMode.FOOT_WALKING:
        return "🚶";
      case TravelMode.CYCLING_REGULAR:
        return "🚲";
      default:
        return "🚗";
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "APPROVED":
        return "#79A44D";
      case "REJECTED":
        return "#E6393B";
      case "PENDING":
        return "#FFD700";
      default:
        return "black";
    }
  };

  return (
    <Draggable handle=".handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          width: 465,
          height: 635,
          position: "absolute",
          top: "100px",
          left: "100px",
          background: "rgba(255, 255, 255, 0.70)",
          boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.05)",
          borderRadius: 10,
          border: "1px solid #DDDDDD",
          backdropFilter: "blur(5px)",
          zIndex: 2000,
          overflowY: "auto",
          paddingTop: "60px",
        }}
      >
        <div className="handle" style={{ width: "100%", height: "60px", cursor: "move", position: "absolute", top: 0 }}>
          <div style={{
            textAlign: "center",
            fontSize: 20,
            fontFamily: "Manrope",
            fontWeight: 700,
            color: "black",
            marginTop: "20px",
          }}>
            Routes
          </div>
        </div>

        <div style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          padding: "0 10px 20px 10px",
        }}>
          {routes.length === 0 ? (
            <div style={{
              width: "428px",
              padding: "20px",
              textAlign: "center",
              color: "#666",
              fontSize: "16px",
              fontWeight: 500
            }}>
              No routes available. Create a route by selecting two points of interest.
            </div>
          ) : (
            routes.map((route, index) => {
              const startPoi = pois.find(poi => poi.poiId === route.startId);
              const endPoi = pois.find(poi => poi.poiId === route.endId);
              
              return (
                <div
                  key={`${route.startId}-${route.endId}-${index}`}
                  style={{
                    width: "428px",
                    background: "white",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                    borderRadius: "3px",
                    border: "1px solid #E4E4E4",
                    padding: "15px",
                    position: "relative",
                    cursor: "pointer"
                  }}
                  onClick={() => onRouteSelect(route)}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    marginBottom: "10px",
                    justifyContent: "space-between"
                  }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center",
                      fontSize: 18, 
                      fontWeight: 700, 
                      color: "black" 
                    }}>
                      <span style={{ marginRight: "10px" }}>{getTravelModeIcon(route.travelMode)}</span>
                      <span>{route.travelMode}</span>
                    </div>
                    <div style={{ 
                      fontSize: 14, 
                      fontWeight: 700, 
                      color: getStatusColor(route.status),
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: "rgba(228, 228, 228, 0.24)",
                    }}>
                      {route.status}
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "black",
                    marginBottom: "10px"
                  }}>
                    {startPoi?.name || "Unknown"} → {endPoi?.name || "Unknown"}
                  </div>
                  
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    fontSize: 14,
                    color: "#666",
                    marginTop: "10px"
                  }}>
                    <div>Distance: <strong>{formatDistance(route.distance)}</strong></div>
                    <div>Time: <strong>{formatTravelTime(route.travelTime)}</strong></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Draggable>
  );
}
