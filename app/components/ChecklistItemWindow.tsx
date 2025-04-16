import { useRef, useState } from "react";
import Image from "next/image";
import Draggable from "react-draggable";
import { ChecklistItemCategory, ChecklistItemPriority } from "@/types/checklistItem";

interface ChecklistItemWindowProps {
  name: string;
  isCompleted: boolean;
  assignedUser: string | null;
  category: string;
  priority: string;
  onClose: () => void;
  onSave?: (updatedItem: { 
    name: string; 
    isCompleted: boolean; 
    assignedUser: string | null; 
    category: string; 
    priority: string 
  }) => void;
  onDelete?: () => void;
  isNew?: boolean;
}

export default function ChecklistItemWindow({
  name,
  isCompleted,
  assignedUser,
  category,
  priority,
  onClose,
  onSave,
  onDelete,
  isNew
}: ChecklistItemWindowProps) {
  const [isEditing, setIsEditing] = useState(isNew || false);
  const [editableName, setEditableName] = useState(name || "");
  const [editableIsCompleted, setEditableIsCompleted] = useState(isCompleted || false);
  const [editableAssignedUser, setEditableAssignedUser] = useState(assignedUser || "");
  const [editableCategory, setEditableCategory] = useState(category || "");
  const [editablePriority, setEditablePriority] = useState(priority || "");

  const nodeRef = useRef<HTMLDivElement>(null!);

  return (
    <Draggable handle=".handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          width: 465,
          height: 550,
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
            {isNew ? "New Checklist Item" : "Edit Checklist Item"}
          </h2>
        </div>

        {/* === Form Content === */}
        <div style={{
          position: "absolute",
          width: 428,
          top: 105,
          left: 19,
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {/* Name Field */}
          <div style={{
            background: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            borderRadius: 3,
            border: "1px solid #E4E4E4",
            padding: "15px"
          }}>
            <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: "black" }}>Name</div>
            <input
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
              disabled={!isEditing}
              style={{
                fontSize: "14px",
                fontWeight: 700,
                width: "100%",
                color: "black",
                background: isEditing ? "rgba(228, 228, 228, 0.24)" : "white",
                border: isEditing ? "1px solid #ccc" : "none",
                padding: "8px",
                borderRadius: "4px"
              }}
            />
          </div>

          {/* Category and Priority */}
          <div style={{
            background: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            borderRadius: 3,
            border: "1px solid #E4E4E4",
            padding: "15px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: "black" }}>Category</div>
              <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: "black" }}>Priority</div>
            </div>
            {isEditing ? (
              <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                <select
                  value={editableCategory}
                  onChange={(e) => setEditableCategory(e.target.value)}
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    width: "48%",
                    color: "black",
                    background: "rgba(228, 228, 228, 0.24)",
                    padding: "8px",
                    borderRadius: "4px"
                  }}
                >
                  {Object.values(ChecklistItemCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  value={editablePriority}
                  onChange={(e) => setEditablePriority(e.target.value)}
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    width: "48%",
                    color: "black",
                    background: "rgba(228, 228, 228, 0.24)",
                    padding: "8px",
                    borderRadius: "4px"
                  }}
                >
                  {Object.values(ChecklistItemPriority).map((pri) => (
                    <option key={pri} value={pri}>
                      {pri}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "black" }}>{category}</p>
                <p style={{ 
                  fontSize: "14px", 
                  fontWeight: 700, 
                  color:
                    priority === "HIGH" ? "#E6393B" :
                    priority === "MEDIUM" ? "#F3A712" :
                    priority === "LOW" ? "#79A44D" :
                    "#999999" 
                }}>
                  {priority}
                </p>
              </div>
            )}
          </div>

          {/* Assigned User */}
          <div style={{
            background: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            borderRadius: 3,
            border: "1px solid #E4E4E4",
            padding: "15px"
          }}>
            <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: "black" }}>Assigned User</div>
            <input
              value={editableAssignedUser || ""}
              onChange={(e) => setEditableAssignedUser(e.target.value)}
              disabled={!isEditing}
              placeholder={isEditing ? "Enter username or leave blank" : "Unassigned"}
              style={{
                fontSize: "14px",
                fontWeight: 700,
                width: "100%",
                color: "black",
                background: isEditing ? "rgba(228, 228, 228, 0.24)" : "white",
                border: isEditing ? "1px solid #ccc" : "none",
                padding: "8px",
                borderRadius: "4px"
              }}
            />
          </div>

          {/* Completion Status */}
          <div style={{
            background: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            borderRadius: 3,
            border: "1px solid #E4E4E4",
            padding: "15px"
          }}>
            <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: "black" }}>Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={editableIsCompleted}
                onChange={(e) => isEditing && setEditableIsCompleted(e.target.checked)}
                disabled={!isEditing}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: isEditing ? "pointer" : "default"
                }}
              />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "black" }}>
                {editableIsCompleted ? "Completed" : "Not Completed"}
              </span>
            </div>
          </div>
        </div>

        {/* === Action Buttons === */}
        {isEditing ? (
          <div style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "28px"
          }}>
            <button
              onClick={() => {
                onSave?.({ 
                  name: editableName, 
                  isCompleted: editableIsCompleted, 
                  assignedUser: editableAssignedUser || null, 
                  category: editableCategory, 
                  priority: editablePriority 
                });
                setIsEditing(false);
              }}
              style={{
                width: "127px",
                height: "40px",
                background: "#007bff", // blue
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
              onClick={() => {
                if (isNew) {
                  onClose();
                } else {
                  setIsEditing(false);
                }
              }}
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
              {isNew ? "Cancel" : "Close"}
            </button>
          </div>
        ) : (
          <div style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "28px"
          }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                width: "127px",
                height: "40px",
                background: "#007bff", // blue
                borderRadius: "3px",
                fontSize: "20px",
                fontWeight: 700,
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Edit
            </button>
            <button
              onClick={onClose}
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
        )}
      </div>
    </Draggable>
  );
}
