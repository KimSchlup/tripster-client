import { useRef } from "react";
import Draggable from "react-draggable";

interface POIWindowProps {
    title: string;
    description: string;
    category: string;
    onClose: () => void;
}

export default function POIWindow({ title, description, category, onClose }: POIWindowProps) {
    const nodeRef = useRef(null);

    return (
        <Draggable handle=".handle" nodeRef={nodeRef}>
            <div ref={nodeRef} style={{
                position: "absolute",
                top: "100px",
                left: "100px",
                width: "300px",
                background: "#ccc",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                zIndex: 2000
            }}>
                <div className="handle" style={{
                    cursor: "move",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px"
                }}>
                    <button onClick={onClose} style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer"
                    }}>✕</button>
                    <h2 style={{ margin: "0 auto" }}>{title}</h2>
                    <button style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer"
                    }}>🗑</button>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <strong>Description</strong>
                    <p>{description}</p>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <strong>Category</strong>
                    <p>{category}</p>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <strong>Comments</strong>
                    <textarea style={{ width: "100%", height: "60px", borderRadius: "5px" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button style={{ background: "lightgreen", padding: "5px 10px", borderRadius: "5px" }}>Upvote</button>
                    <button style={{ background: "lightcoral", padding: "5px 10px", borderRadius: "5px" }}>Downvote</button>
                </div>
            </div>
        </Draggable>
    );
}