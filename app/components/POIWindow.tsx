import { useRef, useState } from "react";
import Image from "next/image";
import Draggable from "react-draggable";
import { PoiCategory } from "@/types/poi";

interface POIWindowProps {
  title: string;
  description: string;
  category: string;
  onClose: () => void;
  onSave?: (updatedPOI: { title: string; description: string; category: string }) => void;
  onDelete?: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  isNew?: boolean;
}

export default function POIWindow(
  { title, description, category, onClose, onSave, onDelete, onUpvote, onDownvote, isNew }: POIWindowProps,
) {
  const [isEditing, setIsEditing] = useState(isNew || false);
  const [editableTitle, setEditableTitle] = useState(title || "");
  const [editableDescription, setEditableDescription] = useState(description || "");
  const [editableCategory, setEditableCategory] = useState(category || "");

  const nodeRef = useRef<HTMLDivElement>(null!);
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
            width={24}
            height={24}
            onClick={() => onDelete?.()}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              cursor: "pointer"
            }}
          />
            <Image
                src="/map-elements/edit.svg"
                alt="Edit"
                width={24}
                height={24}
                onClick={() => setIsEditing(true)}
                style={{
                    position: "absolute",
                    top: "24px",
                    right: "60px",
                    cursor: "pointer",
                }}
            />
          {isEditing ? (
            <input
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
              style={{
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
                background: "rgba(228, 228, 228, 0.24)",
                border: "1px solid black",
                color: "black",
              }}
            />
          ) : (
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
              {title}
            </h2>
          )}
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
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: "black" }}>Description</div>
          {isEditing ? (
            <textarea
              value={editableDescription}
              onChange={(e) => setEditableDescription(e.target.value)}
              style={{
                fontSize: "14px",
                fontWeight: 700,
                width: "100%",
                height: "80px",
                color: "black",
                background: "rgba(228, 228, 228, 0.24)",
                overflowY: "auto",
                resize: "none"
              }}
            />
          ) : (
            <div style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "black",
              width: "100%",
              height: "110px",
              overflowY: "auto",
              wordWrap: "break-word",
              paddingRight: "5px"
            }}>
              {description}
            </div>
          )}
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
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: "black" }}>Category</div>
          {isEditing ? (
            <select
              value={editableCategory}
              onChange={(e) => setEditableCategory(e.target.value as PoiCategory)}
              style={{
                fontSize: "14px",
                fontWeight: 700,
                width: "100%",
                color: "black",
                background: "rgba(228, 228, 228, 0.24)",
              }}
            >
              {Object.values(PoiCategory).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          ) : (
            <p style={{ fontSize: "14px", fontWeight: 700, color: "black" }}>{category}</p>
          )}
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
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: "black" }}>Comments</div>
          <textarea style={{
            width: "100%",
            height: "120px",
            borderRadius: "5px",
            border: "1px solid #E4E4E4",
            background: "rgba(228, 228, 228, 0.24)",
            padding: "10px",
            color: "black",
            overflowY: "auto",
            resize: "none"
          }} />
        </div>

        {isEditing ? (
          <div style={{
            position: "absolute",
            top: 588,
            left: 94,
            display: "flex",
            gap: "28px"
          }}>
            <button
              onClick={() => {
                onSave?.({ title: editableTitle, description: editableDescription, category: editableCategory });
                setIsEditing(false);
              }}
              style={{
                width: "127px",
                height: "40px",
                background: "#007bff", // blau
                borderRadius: "3px",
                fontSize: "20px",
                fontWeight: 700,
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                width: "127px",
                height: "40px",
                background: "black",
                borderRadius: "3px",
                fontSize: "20px",
                fontWeight: 700,
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <div style={{
            position: "absolute",
            top: 588,
            left: 94,
            display: "flex",
            gap: "28px"
          }}>
            <button
              onClick={() => onUpvote?.()}
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
              onClick={() => onDownvote?.()}
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
        )}
      </div>
    </Draggable>
  );
}
