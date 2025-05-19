import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Draggable from "react-draggable";
import { PoiCategory, PoiPriority, Comment } from "@/types/poi";

interface POIWindowProps {
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  onClose: () => void;
  onSave?: (updatedPOI: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }) => void;
  onDelete?: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  isNew?: boolean;
  comments?: Comment[];
  onSendComment?: (message: string) => void;
  showVotingButtons?: boolean;
}

export default function POIWindow({
  title,
  description,
  category,
  priority,
  status,
  onClose,
  onSave,
  onDelete,
  onUpvote,
  onDownvote,
  isNew,
  comments,
  onSendComment,
  showVotingButtons,
}: POIWindowProps) {
  const [isEditing, setIsEditing] = useState(isNew || false);
  const [editableTitle, setEditableTitle] = useState(title || "");
  const [editableDescription, setEditableDescription] = useState(
    description || ""
  );
  const [editableCategory, setEditableCategory] = useState(category || "");
  const [editablePriority, setEditablePriority] = useState(priority || "");
  const [newComment, setNewComment] = useState("");

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

  console.log("Status:", status);

  console.log("POIWindow showVotingButtons:", showVotingButtons);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      {/* Overlay to capture clicks outside */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1999,
        }}
      />
      <Draggable handle=".handle" nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          style={{
            width: 465,
            height: 700,
            position: "absolute",
            top: "0px",
            left: "100px",
            background: "rgba(255, 255, 255, 0.70)",
            boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.05)",
            borderRadius: 10,
            border: "1px solid #DDDDDD",
            backdropFilter: "blur(5px)",
            zIndex: 2000,
          }}
        >
          <div
            className="handle"
            style={{
              position: "absolute",
              width: "100%",
              height: "60px",
              top: "0px",
              left: "0px",
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
            <Image
              src="/map-elements/garbage_bin.svg"
              alt="Delete"
              width={25}
              height={25}
              onClick={() => onDelete?.()}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                cursor: "pointer",
              }}
            />
            <Image
              src="/map-elements/edit.svg"
              alt="Edit"
              width={23}
              height={23}
              onClick={() => setIsEditing(true)}
              style={{
                position: "absolute",
                top: "24px",
                right: "60px",
                cursor: "pointer",
              }}
            />
            {/* === Title Section === */}
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
              <h2
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
                  background: "transparent",
                  border: "none",
                  color: "black",
                }}
              >
                {title}
              </h2>
            )}
            {/* === Status Subtitle === */}
            <p
              style={{
                position: "absolute",
                top: "72px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "14px",
                fontWeight: 700,
                color:
                  status === "ACCEPTED"
                    ? "#79A44D"
                    : status === "DECLINED"
                    ? "#FF0000"
                    : status === "PENDING"
                    ? "#FFD700"
                    : "#999999",
                margin: 0,
              }}
            >
              {status || "UNKNOWN"}
            </p>
          </div>

          {/* === Description Section === */}
          <div
            style={{
              position: "absolute",
              width: 428,
              height: 220,
              top: 105,
              left: 19,
              background: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              borderRadius: 3,
              border: "1px solid #E4E4E4",
              padding: "15px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "10px",
                color: "black",
              }}
            >
              Description
            </div>
            {isEditing ? (
              <textarea
                value={editableDescription}
                onChange={(e) => setEditableDescription(e.target.value)}
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  width: "100%",
                  height: "120px",
                  color: "black",
                  background: "rgba(228, 228, 228, 0.24)",
                  overflowY: "auto",
                  resize: "none",
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "black",
                  width: "100%",
                  height: "160px",
                  overflowY: "auto",
                  wordWrap: "break-word",
                  paddingRight: "5px",
                }}
              >
                {description}
              </div>
            )}
          </div>

          {/* === Category Section === */}
          <div
            style={{
              position: "absolute",
              width: 428,
              height: 86,
              top: 330,
              left: 19,
              background: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              borderRadius: 3,
              border: "1px solid #E4E4E4",
              padding: "15px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "10px",
                  color: "black",
                }}
              >
                Category
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "10px",
                  color: "black",
                }}
              >
                Priority
              </div>
            </div>
            {isEditing ? (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <select
                  value={editableCategory}
                  onChange={(e) =>
                    setEditableCategory(e.target.value as PoiCategory)
                  }
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    width: "48%",
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
                <select
                  value={editablePriority}
                  onChange={(e) =>
                    setEditablePriority(e.target.value as PoiPriority)
                  }
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    width: "48%",
                    color: "black",
                    background: "rgba(228, 228, 228, 0.24)",
                  }}
                >
                  {Object.values(PoiPriority).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p
                  style={{ fontSize: "14px", fontWeight: 700, color: "black" }}
                >
                  {category}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color:
                      priority === "HIGH"
                        ? "#E6393B"
                        : priority === "MEDIUM"
                        ? "#F3A712"
                        : priority === "LOW"
                        ? "#79A44D"
                        : "#999999",
                  }}
                >
                  {priority}
                </p>
              </div>
            )}
          </div>

          {/* === Comments Section === */}
          <div
            style={{
              position: "absolute",
              width: 428,
              height: 188,
              top: 426,
              left: 19,
              background: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              borderRadius: 3,
              border: "1px solid #E4E4E4",
              padding: "15px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "3px",
                color: "black",
              }}
            >
              Comments
            </div>
            <div
              style={{ height: "95px", overflowY: "auto", marginBottom: "7px" }}
            >
              {comments?.map((comment) => (
                <div key={comment.commentId} style={{ marginBottom: "10px" }}>
                  <div
                    style={{ fontWeight: 700, fontSize: "11px", color: "#555" }}
                  >
                    {comment.authorUserName || `User #${comment.authorId}`} –{" "}
                    {new Date(comment.creationDate).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: "13px", color: "#000" }}>
                    {comment.comment}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newComment.trim()) {
                    onSendComment?.(newComment.trim());
                    setNewComment("");
                  }
                }}
                placeholder="Write a comment..."
                style={{
                  flex: 1,
                  borderRadius: "5px",
                  border: "1px solid #E4E4E4",
                  background: "rgba(228, 228, 228, 0.24)",
                  padding: "8px",
                  color: "black",
                }}
              />
              <button
                onClick={() => {
                  if (newComment.trim()) {
                    onSendComment?.(newComment.trim());
                    setNewComment("");
                  }
                }}
                style={{
                  background: "#007bff",
                  color: "white",
                  fontWeight: 700,
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>

          {/* === Action Buttons === */}
          {isEditing ? (
            <div
              style={{
                position: "absolute",
                top: 630,
                left: 94,
                display: "flex",
                gap: "28px",
              }}
            >
              <button
                onClick={() => {
                  onSave?.({
                    title: editableTitle,
                    description: editableDescription,
                    category: editableCategory,
                    priority: editablePriority,
                  });
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
                  cursor: "pointer",
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
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          ) : showVotingButtons ? (
            <div
              style={{
                position: "absolute",
                top: 630,
                left: 94,
                display: "flex",
                gap: "28px",
              }}
            >
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
                  cursor: "pointer",
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
                  cursor: "pointer",
                }}
              >
                Downvote
              </button>
            </div>
          ) : null}
        </div>
      </Draggable>
    </>
  );
}
