import { Route, TravelMode } from "@/types/route";
import { PointOfInterest } from "@/types/poi";
import Image from "next/image";
import Draggable from "react-draggable";
import { useRef } from "react";

interface RouteDetailsProps {
  route: Route;
  pois: PointOfInterest[];
  onClose: () => void;
  onDelete: () => void;
}

export default function RouteDetails({ route, pois, onClose, onDelete }: RouteDetailsProps) {
  const nodeRef = useRef<HTMLDivElement>(null!);
  
  // Get start and end POI names
  const startPoi = pois.find(poi => poi.poiId === route.startId);
  const endPoi = pois.find(poi => poi.poiId === route.endId);

  // Format travel time (convert from seconds to minutes/hours)
  const formatTravelTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.round(seconds)} seconds`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)} minutes`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  };

  // Format distance (convert from meters to km)
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} meters`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
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

  return (
    <Draggable handle=".handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          width: 465,
          height: 400,
          position: "absolute",
          top: "100px",
          left: "100px",
          background: "rgba(255, 255, 255, 0.70)",
          boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.05)",
          borderRadius: 10,
          border: "1px solid #DDDDDD",
          backdropFilter: "blur(5px)",
          zIndex: 2000,
        }}
      >
        <div className="handle" style={{ position: "absolute", width: "100%", height: "60px", top: "0px", left: "0px" }}>
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
                cursor: "pointer"
              }}
            />
          </button>
          <Image
            src="/map-elements/garbage_bin.svg"
            alt="Delete"
            width={25}
            height={25}
            onClick={onDelete}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              cursor: "pointer"
            }}
          />
          <h2 style={{
            position: "absolute",
            top: "36px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            textAlign: "center",
            fontSize: "20px",
            fontFamily: "Manrope",
            fontWeight: 700,
            margin: 0,
            background: "transparent",
            border: "none",
            color: "black"
          }}>
            Route Details
          </h2>
        </div>

        {/* Route Content */}
        <div style={{
          position: "absolute",
          width: 428,
          height: 280,
          top: 80,
          left: 19,
          background: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: 3,
          border: "1px solid #E4E4E4",
          padding: "15px"
        }}>
          {/* Route Information */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: "black", display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "10px" }}>{getTravelModeIcon(route.travelMode)}</span>
              {route.travelMode}
            </div>
            
            <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "5px", color: "black" }}>
              From: <span style={{ fontWeight: 400 }}>{startPoi?.name || "Unknown Location"}</span>
            </div>
            
            <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "15px", color: "black" }}>
              To: <span style={{ fontWeight: 400 }}>{endPoi?.name || "Unknown Location"}</span>
            </div>
          </div>

          {/* Travel Stats */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            padding: "15px",
            background: "rgba(228, 228, 228, 0.24)",
            borderRadius: "5px"
          }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#666" }}>Distance</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "black" }}>{formatDistance(route.distance)}</div>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#666" }}>Travel Time</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "black" }}>{formatTravelTime(route.travelTime)}</div>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#666" }}>Status</div>
              <div style={{ 
                fontSize: "18px", 
                fontWeight: 700, 
                color: route.status === "APPROVED" ? "#79A44D" : 
                       route.status === "REJECTED" ? "#FF0000" : "#FFD700" 
              }}>
                {route.status}
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px"
          }}>
            <button
              onClick={onDelete}
              style={{
                width: "200px",
                height: "40px",
                background: "#E6393B",
                borderRadius: "3px",
                fontSize: "16px",
                fontWeight: 700,
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Delete Route
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
