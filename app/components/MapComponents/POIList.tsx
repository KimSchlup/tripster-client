import Draggable from "react-draggable";
import { useRef } from "react";
import { PointOfInterest } from "../../types/poi";

interface POIListProps {
    pois: PointOfInterest[];
}

export default function POIList({ pois }: POIListProps) {
    const nodeRef = useRef<HTMLDivElement>(null!);

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
            case "Accepted":
                return "#79A44D";
            case "Proposal":
                return "#FF9E44";
            case "Rejected":
                return "#E6393B";
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
                        Points of Interest
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
                            }}
                        >
                            <div style={{ fontSize: 20, fontWeight: 700, color: "black", textAlign: "center" }}>{poi.name}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "black", textAlign: "center", marginTop: "10px" }}>
                                Added by: {poi.creatorId}
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "black", textAlign: "center" }}>
                                Personal Priority:{" "}
                                <span style={{ color: getPriorityColor(poi.priority) }}>
                  {poi.priority}
                </span>
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: getStatusColor(poi.status), textAlign: "center", marginTop: "5px" }}>
                                {poi.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Draggable>
    );
}