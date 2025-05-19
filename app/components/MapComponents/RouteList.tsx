import { Route, TravelMode } from "@/types/routeTypes";
import { PointOfInterest } from "@/types/poi";
import Draggable from "react-draggable";
import { useRef, useEffect } from "react";
import Image from "next/image";

interface RouteListProps {
  routes: Route[];
  pois: PointOfInterest[];
  onRouteSelect: (route: Route) => void;
  onCreateRoute: () => void;
  onClose: () => void;
}

export default function RouteList({
  routes,
  pois,
  onRouteSelect,
  onCreateRoute,
  onClose,
}: RouteListProps) {
  const nodeRef = useRef<HTMLDivElement>(null!);

  // Add click outside functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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
    // Convert to string to handle both enum values and string representations
    const modeStr = String(mode);

    if (modeStr.includes("DRIVING_CAR") || modeStr.includes("Car Drive")) {
      return "🚗";
    } else if (
      modeStr.includes("FOOT_WALKING") ||
      modeStr.includes("Walk by foot")
    ) {
      return "🚶";
    } else if (
      modeStr.includes("CYCLING_REGULAR") ||
      modeStr.includes("Cycling")
    ) {
      return "🚲";
    } else {
      console.log("Unknown travel mode:", mode);
      return "🚗";
    }
  };

  // Get friendly name for travel mode
  const getFriendlyTravelModeName = (mode: TravelMode): string => {
    // Convert to string to handle both enum values and string representations
    const modeStr = String(mode);

    if (modeStr.includes("DRIVING_CAR")) {
      return "Car Drive";
    } else if (modeStr.includes("FOOT_WALKING")) {
      return "Walk by foot";
    } else if (modeStr.includes("CYCLING_REGULAR")) {
      return "Cycling";
    } else {
      return modeStr;
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ACCEPTED":
        return "#79A44D";
      case "DECLINED":
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
          minHeight: "200px",
          maxHeight: "685px",
          height: "auto",
          position: "absolute",
          top: "0",
          left: "100px",
          background: "rgba(255, 255, 255, 0.70)",
          boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.05)",
          borderRadius: 10,
          border: "1px solid #DDDDDD",
          backdropFilter: "blur(5px)",
          zIndex: 2000,
          overflowY: "auto",
          paddingTop: "60px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="handle"
          style={{
            width: "100%",
            height: "60px",
            cursor: "move",
            position: "absolute",
            top: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "14px",
              left: "17px",
              width: "35px",
              height: "35px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              color: "#000000",
            }}
          >
            <Image
              src="/map-elements/close.svg"
              alt="Close"
              width={24}
              height={24}
              style={{
                cursor: "pointer",
              }}
            />
          </button>
          <div
            style={{
              textAlign: "center",
              fontSize: 20,
              fontFamily: "Manrope",
              fontWeight: 700,
              color: "black",
              marginTop: "20px",
            }}
          >
            Routes
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            padding: "0 10px 20px 10px",
            flex: "1 1 auto",
          }}
        >
          {routes.length === 0 ? (
            <div
              style={{
                width: "428px",
                padding: "20px",
                textAlign: "center",
                color: "#666",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              No routes available. Create a route by selecting two points of
              interest.
            </div>
          ) : (
            routes.map((route, index) => {
              const startPoi = pois.find((poi) => poi.poiId === route.startId);
              const endPoi = pois.find((poi) => poi.poiId === route.endId);

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
                    cursor: "pointer",
                  }}
                  onClick={() => onRouteSelect(route)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "black",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>
                        {getTravelModeIcon(route.travelMode)}
                      </span>
                      <span>{getFriendlyTravelModeName(route.travelMode)}</span>
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: getStatusColor(route.status),
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: "rgba(228, 228, 228, 0.24)",
                      }}
                    >
                      {route.status}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "black",
                      marginBottom: "10px",
                    }}
                  >
                    {startPoi?.name || "Unknown"} → {endPoi?.name || "Unknown"}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      color: "#666",
                      marginTop: "10px",
                    }}
                  >
                    <div>
                      Distance:{" "}
                      <strong>{formatDistance(route.distance)}</strong>
                    </div>
                    <div>
                      Time:{" "}
                      <strong>{formatTravelTime(route.travelTime)}</strong>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div
          style={{
            position: "relative",
            marginTop: "auto",
            marginBottom: "20px",
            textAlign: "center",
            width: "100%",
            zIndex: 2001,
          }}
        >
          <button
            onClick={onCreateRoute}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: 700,
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            Create Route
          </button>
        </div>
      </div>
    </Draggable>
  );
}
