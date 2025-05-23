import Draggable from "react-draggable";
import { useRef, useEffect } from "react";
import { PointOfInterest } from "../../types/poi";
import Image from "next/image";

interface POIListProps {
  pois: PointOfInterest[];
  onClose: () => void;
  onPoiSelect?: (poi: PointOfInterest) => void;
}

export default function POIList({ pois, onClose, onPoiSelect }: POIListProps) {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#E6393B";
      case "Medium":
        return "#449BFF";
      case "Low":
        return "#AAAAAA";
      default:
        return "black";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "#79A44D";
      case "PENDING":
        return "#ff9900";
      case "DECLINED":
        return "#FF0000";
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
          maxHeight: "635px",
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
            Points of Interest
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
          {pois.map((poi) => (
            <div
              key={poi.poiId}
              style={{
                width: "428px",
                height: "121px",
                background: "white",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                borderRadius: "3px",
                border: "1px solid #E4E4E4",
                padding: "10px",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => onPoiSelect && onPoiSelect(poi)}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "black",
                  textAlign: "center",
                }}
              >
                {poi.name}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "black",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                Added by: {poi.creatorUserName || `User #${poi.creatorId}`}{" "}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "black",
                  textAlign: "center",
                }}
              >
                Personal Priority:{" "}
                <span style={{ color: getPriorityColor(poi.priority) }}>
                  {poi.priority}
                </span>
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: getStatusColor(poi.status),
                  textAlign: "right",
                  marginTop: "5px",
                }}
              >
                {poi.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
}
