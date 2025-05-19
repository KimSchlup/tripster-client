import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Draggable from "react-draggable";
import { PoiCategory, PoiPriority, Comment } from "@/types/poi";
import { useToast } from "@/hooks/useToast";

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
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(isNew || false);
  const [editableTitle, setEditableTitle] = useState(title || "");
  const [editableDescription, setEditableDescription] = useState(
    description || ""
  );
  const [editableCategory, setEditableCategory] = useState(category || "");
  const [editablePriority, setEditablePriority] = useState(priority || "");
  const [newComment, setNewComment] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);

  const MAX_DESCRIPTION_LENGTH = 255;

  const nodeRef = useRef<HTMLDivElement>(null!);

  // Validate description length
  const validateDescription = (text: string): boolean => {
    const isValid = text.length <= MAX_DESCRIPTION_LENGTH;
    setDescriptionError(!isValid);
    if (!isValid) {
      showToast(
        `Description is too long. Maximum length is ${MAX_DESCRIPTION_LENGTH} characters.`,
        "error"
      );
    }
    return isValid;
  };

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

  // Render different layouts based on whether it's a new POI or an existing one
  if (isNew) {
    // New POI form - similar to RouteForm
    return (
      <Draggable handle=".handle" nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          style={{
            width: 465,
            height: 450,
            position: "absolute",
            top: "0",
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
              Create POI
            </h2>
          </div>

          {/* Form Content */}
          <div
            style={{
              width: 428,
              margin: "80px auto 0",
              background: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              borderRadius: 3,
              border: "1px solid #E4E4E4",
              padding: "15px",
            }}
          >
            {/* Name Field */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "5px",
                  display: "block",
                  color: "black",
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "14px",
                  borderRadius: "3px",
                  border: "1px solid #E4E4E4",
                  background: "rgba(228, 228, 228, 0.24)",
                  color: "black",
                }}
              />
            </div>

            {/* Description Field */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "5px",
                  display: "block",
                  color: "black",
                }}
              >
                Description
              </label>
              <textarea
                value={editableDescription}
                onChange={(e) => setEditableDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "14px",
                  borderRadius: "3px",
                  border: "1px solid #E4E4E4",
                  background: "rgba(228, 228, 228, 0.24)",
                  color: "black",
                  minHeight: "80px",
                  maxHeight: "200px",
                  resize: "vertical",
                  flex: "1 1 auto",
                }}
              />
            </div>

            {/* Category and Priority Selection */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div style={{ width: "48%" }}>
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    display: "block",
                    color: "black",
                  }}
                >
                  Category
                </label>
                <select
                  value={editableCategory}
                  onChange={(e) =>
                    setEditableCategory(e.target.value as PoiCategory)
                  }
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
                  {Object.values(PoiCategory).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ width: "48%" }}>
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    display: "block",
                    color: "black",
                  }}
                >
                  Priority
                </label>
                <select
                  value={editablePriority}
                  onChange={(e) =>
                    setEditablePriority(e.target.value as PoiPriority)
                  }
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
                  {Object.values(PoiPriority).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "30px",
              }}
            >
              <button
                onClick={() => {
                  if (validateDescription(editableDescription)) {
                    onSave?.({
                      title: editableTitle,
                      description: editableDescription,
                      category: editableCategory,
                      priority: editablePriority,
                    });
                  }
                }}
                style={{
                  width: "127px",
                  height: "40px",
                  background: "#007bff",
                  borderRadius: "3px",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Create
              </button>
              <button
                onClick={onClose}
                style={{
                  width: "127px",
                  height: "40px",
                  background: "black",
                  borderRadius: "3px",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "white",
                  border: "none",
                  cursor: "pointer",
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

  // Existing POI view - updated to match the new POI form design
  return (
    <Draggable handle=".handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          width: 465,
          height: "auto",
          maxHeight: 700,
          position: "absolute",
          top: "0",
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
        <div
          className="handle"
          style={{
            width: "100%",
            height: "60px",
            position: "relative",
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
          {!isEditing && (
            <>
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
            </>
          )}
          {/* Title for edit mode */}
          {isEditing && (
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
              Edit POI
            </h2>
          )}
        </div>

        {/* Main content container with flex layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "15px",
            marginTop: "30px", // Space for the header
          }}
        >
          {isEditing ? (
            // Edit mode form content - similar to POI creation form
            <div
              style={{
                width: "100%",
                background: "white",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                borderRadius: 3,
                border: "1px solid #E4E4E4",
                padding: "15px",
              }}
            >
              {/* Name Field */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    display: "block",
                    color: "black",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    borderRadius: "3px",
                    border: "1px solid #E4E4E4",
                    background: "rgba(228, 228, 228, 0.24)",
                    color: "black",
                  }}
                />
              </div>

              {/* Description Field */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    display: "block",
                    color: "black",
                  }}
                >
                  Description
                </label>
                <textarea
                  value={editableDescription}
                  onChange={(e) => setEditableDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    borderRadius: "3px",
                    border: "1px solid #E4E4E4",
                    background: "rgba(228, 228, 228, 0.24)",
                    color: "black",
                    minHeight: "80px",
                    maxHeight: "200px",
                    resize: "vertical",
                    flex: "1 1 auto",
                  }}
                />
              </div>

              {/* Category and Priority Selection */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <div style={{ width: "48%" }}>
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      marginBottom: "5px",
                      display: "block",
                      color: "black",
                    }}
                  >
                    Category
                  </label>
                  <select
                    value={editableCategory}
                    onChange={(e) =>
                      setEditableCategory(e.target.value as PoiCategory)
                    }
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
                    {Object.values(PoiCategory).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ width: "48%" }}>
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      marginBottom: "5px",
                      display: "block",
                      color: "black",
                    }}
                  >
                    Priority
                  </label>
                  <select
                    value={editablePriority}
                    onChange={(e) =>
                      setEditablePriority(e.target.value as PoiPriority)
                    }
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
                    {Object.values(PoiPriority).map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* === Description Section === */}
              <div
                style={{
                  width: "100%",
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
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "black",
                    width: "100%",
                    minHeight: "50px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    wordWrap: "break-word",
                    paddingRight: "5px",
                    flex: "1 1 auto",
                  }}
                >
                  {description}
                </div>
              </div>

              {/* === Category Section === */}
              <div
                style={{
                  width: "100%",
                  background: "white",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                  borderRadius: 3,
                  border: "1px solid #E4E4E4",
                  padding: "15px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "black",
                    }}
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
              </div>

              {/* === Comments Section === */}
              <div
                style={{
                  width: "100%",
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
                  style={{
                    height: "95px",
                    overflowY: "auto",
                    marginBottom: "7px",
                  }}
                >
                  {comments?.map((comment) => (
                    <div
                      key={comment.commentId}
                      style={{ marginBottom: "10px" }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "11px",
                          color: "#555",
                        }}
                      >
                        {comment.authorUserName || `User #${comment.authorId}`}{" "}
                        – {new Date(comment.creationDate).toLocaleDateString()}
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
            </>
          )}

          {/* === Action Buttons === */}
          {isEditing ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "28px",
                marginTop: "10px",
              }}
            >
              <button
                onClick={() => {
                  if (validateDescription(editableDescription)) {
                    onSave?.({
                      title: editableTitle,
                      description: editableDescription,
                      category: editableCategory,
                      priority: editablePriority,
                    });
                    setIsEditing(false);
                  }
                }}
                style={{
                  width: "127px",
                  height: "40px",
                  background: "#007bff", // blau
                  borderRadius: "3px",
                  fontSize: "16px",
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
                  fontSize: "16px",
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
                display: "flex",
                justifyContent: "center",
                gap: "28px",
                marginTop: "10px",
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
      </div>
    </Draggable>
  );
}
