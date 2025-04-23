"use client";

import { useState } from "react";
import ChecklistItemWindow from "@/components/ChecklistItemWindow";
import { ChecklistItemCategory, ChecklistItemPriority } from "@/types/checklistItem";

export default function ChecklistItemPage() {
  const [itemData, setItemData] = useState({
    name: "",
    isCompleted: false,
    assignedUser: null as string | null,
    category: ChecklistItemCategory.ITEM,
    priority: ChecklistItemPriority.MEDIUM
  });

  // Handle saving the item
  const handleSave = (updatedItem: { 
    name: string; 
    isCompleted: boolean; 
    assignedUser: string | null; 
    category: string; 
    priority: string;
  }) => {
    console.log("Saving item:", updatedItem);
    
    // Cast the string values to the correct enum types
    setItemData({
      ...updatedItem,
      category: updatedItem.category as ChecklistItemCategory,
      priority: updatedItem.priority as ChecklistItemPriority
    });
    
    alert("Item saved: " + updatedItem.name);
  };

  // Handle closing the window
  const handleClose = () => {
    console.log("Close button clicked");
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "#f5f5f5",
      position: "relative"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <ChecklistItemWindow
          name={itemData.name}
          isCompleted={itemData.isCompleted}
          assignedUser={itemData.assignedUser}
          category={itemData.category}
          priority={itemData.priority}
          onClose={handleClose}
          onSave={handleSave}
          isNew={true}
        />
      </div>
    </div>
  );
}
