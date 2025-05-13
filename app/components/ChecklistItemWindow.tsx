import { useRef, useState } from "react";
import Image from "next/image";
import Draggable from "react-draggable";
import { ChecklistItemCategory, ChecklistItemPriority } from "@/types/checklistItem";
import Checkbox from "@/components/Checkbox";
import {
  Form,
  FormInput,
  FormButton,
  useForm
} from "@/design-system";

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

/**
 * Form values type for checklist item
 */
interface ChecklistItemFormValues {
  name: string;
  isCompleted: boolean;
  assignedUser: string;
  category: string;
  priority: string;
  [key: string]: unknown;
}

/**
 * Checklist item form validation function
 */
const validateChecklistItemForm = (values: ChecklistItemFormValues) => {
  const errors: Record<string, string> = {};
  
  if (!values.name.trim()) {
    errors.name = "Name cannot be empty";
  }
  
  return errors;
};

/**
 * ChecklistItemWindow component
 * 
 * A modal window for creating and editing checklist items.
 * Uses the design system components for form handling.
 */
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
  const nodeRef = useRef<HTMLDivElement>(null!);
  
  // Initialize form with useForm hook
  const {
    values,
    setValue,
    fieldErrors,
    formError,
    handleSubmit
  } = useForm<ChecklistItemFormValues>(
    { 
      name: name || "",
      isCompleted: isCompleted || false,
      assignedUser: assignedUser || "",
      category: category || ChecklistItemCategory.ITEM,
      priority: priority || ChecklistItemPriority.MEDIUM
    },
    validateChecklistItemForm,
    (values) => {
      onSave?.({ 
        name: values.name, 
        isCompleted: values.isCompleted, 
        assignedUser: values.assignedUser || null, 
        category: values.category, 
        priority: values.priority 
      });
      setIsEditing(false);
    }
  );

  // Get color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case ChecklistItemPriority.HIGH:
        return "#E6393B"; // Red
      case ChecklistItemPriority.MEDIUM:
        return "#F3A712"; // Orange
      case ChecklistItemPriority.LOW:
        return "#79A44D"; // Green
      default:
        return "#999999"; // Gray
    }
  };

  return (
    <Draggable handle=".handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          width: 465,
          height: 650, // Increased height to accommodate all content
          position: "absolute",
          top: "100px",
          left: "100px",
          background: "rgba(255, 255, 255, 0.70)",
          boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.05)",
          borderRadius: 10,
          border: "1px solid #DDDDDD",
          backdropFilter: "blur(5px)",
          zIndex: 2000,
          overflow: "hidden", // Prevent window from scrolling
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
          {!isNew && (
            <>
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
              {!isEditing && (
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
              )}
            </>
          )}
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
          bottom: 100, // Leave space for the action buttons
          overflowY: "auto", // Make only the form content scrollable
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingRight: "10px", // Add some padding for the scrollbar
          paddingBottom: "20px" // Add padding at the bottom for better spacing
        }}>
          <Form 
            onSubmit={handleSubmit} 
            error={formError}
            style={{ width: "100%" }}
          >
            {/* Name Field */}
            <div style={{
              background: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              borderRadius: 3,
              border: "1px solid #E4E4E4",
              padding: "15px"
            }}>
              <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: "black" }}>Name</div>
              {isEditing ? (
                <FormInput
                  name="name"
                  value={values.name}
                  onChange={(value) => setValue("name", value)}
                  disabled={!isEditing}
                  error={fieldErrors.name}
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    width: "100%",
                    color: "black",
                    background: "rgba(228, 228, 228, 0.24)",
                  }}
                />
              ) : (
                <div style={{ 
                  fontSize: "14px", 
                  fontWeight: 700, 
                  color: "black",
                  padding: "8px 0"
                }}>
                  {values.name}
                </div>
              )}
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
                    value={values.category}
                    onChange={(e) => setValue("category", e.target.value)}
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
                        {cat === "TASK" ? "TASK" : "ITEM"}
                      </option>
                    ))}
                  </select>
                  <select
                    value={values.priority}
                    onChange={(e) => setValue("priority", e.target.value)}
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
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "black" }}>{values.category}</p>
                  <p style={{ 
                    fontSize: "14px", 
                    fontWeight: 700, 
                    color: getPriorityColor(values.priority)
                  }}>
                    {values.priority}
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
              {isEditing ? (
                <FormInput
                  name="assignedUser"
                  value={values.assignedUser}
                  onChange={(value) => setValue("assignedUser", value)}
                  disabled={!isEditing}
                  placeholder="Enter username or leave blank"
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    width: "100%",
                    color: "black",
                    background: "rgba(228, 228, 228, 0.24)",
                  }}
                />
              ) : (
                <div style={{ 
                  fontSize: "14px", 
                  fontWeight: 700, 
                  color: "black",
                  padding: "8px 0"
                }}>
                  {values.assignedUser || "Unassigned"}
                </div>
              )}
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
                <Checkbox
                  checked={values.isCompleted}
                  onChange={(checked) => isEditing && setValue("isCompleted", checked)}
                  disabled={!isEditing}
                />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "black" }}>
                  {values.isCompleted ? "Completed" : "Not Completed"}
                </span>
              </div>
            </div>
          </Form>
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
            <FormButton
              onClick={(e) => {
                e.preventDefault();
                onSave?.({ 
                  name: values.name, 
                  isCompleted: values.isCompleted, 
                  assignedUser: values.assignedUser || null, 
                  category: values.category, 
                  priority: values.priority 
                });
                setIsEditing(false);
              }}
              variant="primary"
              style={{
                width: "127px",
                height: "40px",
                fontSize: "20px",
              }}
            >
              Save
            </FormButton>
            <FormButton
              onClick={() => {
                if (isNew) {
                  onClose();
                } else {
                  setIsEditing(false);
                }
              }}
              variant="secondary"
              style={{
                width: "127px",
                height: "40px",
                fontSize: "20px",
              }}
            >
              {isNew ? "Cancel" : "Close"}
            </FormButton>
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
            <FormButton
              onClick={() => setIsEditing(true)}
              variant="primary"
              style={{
                width: "127px",
                height: "40px",
                fontSize: "20px",
              }}
            >
              Edit
            </FormButton>
            <FormButton
              onClick={onClose}
              variant="secondary"
              style={{
                width: "127px",
                height: "40px",
                fontSize: "20px",
              }}
            >
              Close
            </FormButton>
          </div>
        )}
      </div>
    </Draggable>
  );
}
