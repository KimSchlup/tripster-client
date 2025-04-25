import { useState } from "react";
import { PointOfInterest } from "@/types/poi";
import { TravelMode, RouteCreateRequest } from "@/types/routeTypes";
import Image from "next/image";
import Draggable from "react-draggable";
import { useRef } from "react";


interface RouteFormProps {
  pois: PointOfInterest[];
  onCreateRoute: (routeData: RouteCreateRequest) => void;
  onCancel: () => void;
}

export default function RouteForm({ pois, onCreateRoute, onCancel }: RouteFormProps) {
  const [startId, setStartId] = useState<number | null>(null);
  const [endId, setEndId] = useState<number | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>(TravelMode.DRIVING_CAR);
  
  const nodeRef = useRef<HTMLDivElement>(null!);

  const handleSubmit = () => {
    if (startId !== null && endId !== null) {
      onCreateRoute({
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
          height: 450, // Adjusted height
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
            Create Route
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
              value={startId || ""}
              onChange={(e) => {
                const value = e.target.value;
                console.log("Selected start POI:", value);
                setStartId(value ? Number(value) : null);
              }}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "3px",
                border: "1px solid #E4E4E4",
                background: "rgba(228, 228, 228, 0.24)",
                color: startId ? "black" : "#666",
              }}
            >
              <option value="">Select a starting point</option>
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
              value={endId || ""}
              onChange={(e) => {
                const value = e.target.value;
                console.log("Selected end POI:", value);
                setEndId(value ? Number(value) : null);
              }}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "3px",
                border: "1px solid #E4E4E4",
                background: "rgba(228, 228, 228, 0.24)",
                color: endId ? "black" : "#666",
              }}
            >
              <option value="">Select an end point</option>
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
              disabled={startId === null || endId === null}
              style={{
                width: "127px",
                height: "40px",
                background: startId === null || endId === null ? "#cccccc" : "#007bff",
                borderRadius: "3px",
                fontSize: "16px",
                fontWeight: 700,
                color: "white",
                border: "none",
                cursor: startId === null || endId === null ? "not-allowed" : "pointer"
              }}
            >
              Create
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
