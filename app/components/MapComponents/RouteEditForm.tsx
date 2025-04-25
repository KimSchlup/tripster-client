import { useState } from "react";
import { PointOfInterest } from "@/types/poi";
import { TravelMode, RouteCreateRequest, Route } from "@/types/routeTypes";
import Image from "next/image";
import Draggable from "react-draggable";
import { useRef, useEffect } from "react";

interface RouteEditFormProps {
  route: Route;
  pois: PointOfInterest[];
  onUpdateRoute: (routeId: number, routeData: RouteCreateRequest) => void;
  onCancel: () => void;
}

export default function RouteEditForm({ route, pois, onUpdateRoute, onCancel }: RouteEditFormProps) {
  const [startId, setStartId] = useState<number>(route.startId);
  const [endId, setEndId] = useState<number>(route.endId);
  const [travelMode, setTravelMode] = useState<TravelMode>(route.travelMode);
  
  const nodeRef = useRef<HTMLDivElement>(null!);

  // Update state if route prop changes
  useEffect(() => {
    setStartId(route.startId);
    setEndId(route.endId);
    setTravelMode(route.travelMode);
  }, [route]);

  const handleSubmit = () => {
    if (route.routeId) {
      onUpdateRoute(route.routeId, {
        startId,
        endId,
        travelMode
      });
    }
  };

  return (
    <Draggable handle=".handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          width: 465,
          height: 450,
          position: "absolute",
          top: "100px",
          left: "100px",
          background: "rgba(255, 255, 255, 0.70)",
          boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.05)",
          borderRadius: 10,
          border: "1px solid #DDDDDD",
          backdropFilter: "blur(5px)",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="handle" style={{ position: "absolute", width: "100%", height: "60px", top: "0px", left: "0px" }}>
          <button
            onClick={onCancel}
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
            Edit Route
          </h2>
        </div>

        {/* Form Content */}
        <div style={{
          width: 428,
          margin: "80px auto 0",
          background: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: 3,
          border: "1px solid #E4E4E4",
          padding: "15px"
        }}>
          {/* Start POI Selection */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "16px", fontWeight: 700, marginBottom: "5px", display: "block", color: "black" }}>
              Start Point
            </label>
            <select
              value={startId}
              onChange={(e) => {
                const value = e.target.value;
                console.log("Selected start POI:", value);
                setStartId(Number(value));
              }}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "3px",
                border: "1px solid #E4E4E4",
                background: "rgba(228, 228, 228, 0.24)",
                color: "black",
              }}
            >
              {pois.map((poi) => (
                <option key={poi.poiId} value={poi.poiId}>
                  {poi.name}
                </option>
              ))}
            </select>
          </div>

          {/* End POI Selection */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "16px", fontWeight: 700, marginBottom: "5px", display: "block", color: "black" }}>
              End Point
            </label>
            <select
              value={endId}
              onChange={(e) => {
                const value = e.target.value;
                console.log("Selected end POI:", value);
                setEndId(Number(value));
              }}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "3px",
                border: "1px solid #E4E4E4",
                background: "rgba(228, 228, 228, 0.24)",
                color: "black",
              }}
            >
              {pois.map((poi) => (
                <option key={poi.poiId} value={poi.poiId}>
                  {poi.name}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Mode Selection */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "16px", fontWeight: 700, marginBottom: "5px", display: "block", color: "black" }}>
              Travel Mode
            </label>
            <select
              value={travelMode}
              onChange={(e) => {
                console.log("Selected travel mode:", e.target.value);
                setTravelMode(e.target.value as TravelMode);
              }}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "3px",
                border: "1px solid #E4E4E4",
                background: "rgba(228, 228, 228, 0.24)",
                color: "black",
              }}
            >
              {Object.values(TravelMode).map((mode) => {
                // Get emoji for travel mode
                let emoji = "🚗"; // Default
                if (mode === TravelMode.DRIVING_CAR) emoji = "🚗";
                else if (mode === TravelMode.CYCLING_REGULAR) emoji = "🚲";
                else if (mode === TravelMode.FOOT_WALKING) emoji = "🚶";
                
                return (
                  <option key={mode} value={mode}>
                    {emoji} {mode}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "30px"
          }}>
            <button
              onClick={handleSubmit}
              style={{
                width: "127px",
                height: "40px",
                background: "#007bff",
                borderRadius: "3px",
                fontSize: "16px",
                fontWeight: 700,
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Update
            </button>
            <button
              onClick={onCancel}
              style={{
                width: "127px",
                height: "40px",
                background: "black",
                borderRadius: "3px",
                fontSize: "16px",
                fontWeight: 700,
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
