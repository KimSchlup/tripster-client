import { useRef } from "react";
import Draggable from "react-draggable";

interface POIWindowProps {
  title: string;
  description: string;
  category: string;
  onClose: () => void;
}

export default function POIWindow(
  { title, description, category, onClose }: POIWindowProps,
) {
  const nodeRef = useRef(null);

  return (
    <Draggable handle=".handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          width: 465,
          height: 660,
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
            <img
                src = "/map-elements/close.svg"
                alt = "Close"
                style = {{
                    width: "24px",
                    height: "24px",
                    cursor: "pointer"
                }}
            />
          </button>
            <img
                src="/map-elements/garbage_bin.svg"
                alt="Delete"
                style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer"
                }}
            />
          <h2 style={{
            position: "absolute",
            top: "36px",
            left: "141px",
            width: "160px",
            textAlign: "center",
            fontSize: "20px",
            fontFamily: "Manrope",
            fontWeight: 700,
            margin: 0
          }}>
            {title}
          </h2>
        </div>

        <div style={{
          position: "absolute",
          width: 428,
          height: 177,
          top: 85,
          left: 19,
          background: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: 3,
          border: "1px solid #E4E4E4",
          padding: "15px"
        }}>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>Description</div>
          <p style={{ fontSize: "14px", fontWeight: 700 }}>{description}</p>
        </div>

        <div style={{
          position: "absolute",
          width: 428,
          height: 86,
          top: 281,
          left: 19,
          background: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: 3,
          border: "1px solid #E4E4E4",
          padding: "15px"
        }}>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>Category</div>
          <p style={{ fontSize: "14px", fontWeight: 700 }}>{category}</p>
        </div>

        <div style={{
          position: "absolute",
          width: 428,
          height: 188,
          top: 383,
          left: 19,
          background: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: 3,
          border: "1px solid #E4E4E4",
          padding: "15px"
        }}>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>Comments</div>
          <textarea style={{
            width: "100%",
            height: "120px",
            borderRadius: "5px",
            border: "1px solid #E4E4E4",
            background: "rgba(228, 228, 228, 0.24)",
            padding: "10px"
          }} />
        </div>

        <div style={{
          position: "absolute",
          top: 588,
          left: 94,
          display: "flex",
          gap: "28px"
        }}>
          <button
            style={{
              width: "127px",
              height: "40px",
              background: "white",
              borderRadius: "3px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#79A44D",
              border: "1px solid #E4E4E4",
              cursor: "pointer"
            }}
          >
            Upvote
          </button>
          <button
            style={{
              width: "127px",
              height: "40px",
              background: "white",
              borderRadius: "3px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#E6393B",
              border: "1px solid #E4E4E4",
              cursor: "pointer"
            }}
          >
            Downvote
          </button>
        </div>
      </div>
    </Draggable>
  );
}
