"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { ChecklistItem, ChecklistItemCategory, ChecklistItemPriority } from "@/types/checklistItem";
import ChecklistItemWindow from "@/components/ChecklistItemWindow";
import Checkbox from "@/components/Checkbox";
import { ApplicationError } from "@/types/error";
import BackToMapButton from "@/components/BackToMapButton";

export default function ChecklistPage() {
  const params = useParams();
  const id = params.id as string;
  const apiService = useApi();

  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddItemWindow, setShowAddItemWindow] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

  const router = useRouter();
  const { authState } = useAuth();

  // Function to refresh the checklist from the server
  const refreshChecklist = async () => {
    try {
      console.log("Refreshing checklist data from server");
      const data = await apiService.getChecklist<ChecklistItem[]>(id);
      console.log("Refreshed checklist data:", data);
      setChecklist(Array.isArray(data) ? data : []);
      return true;
    } catch (err) {
      console.error("Error refreshing checklist:", err);
      return false;
    }
  };

  // Fetch checklist items
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in
        if (!authState.isLoggedIn) {
          console.error("User is not logged in, redirecting to login page");
          router.push('/login');
          return;
        }
        
        // Validate roadtrip ID
        if (!id) {
          throw new Error("Invalid roadtrip ID: ID is missing");
        }
        
        console.log("Attempting to fetch checklist for roadtrip ID:", id);
        console.log("Roadtrip ID type:", typeof id);
        
        // Try to fetch the checklist from the API
        console.log("Calling apiService.getChecklist with ID:", id);
        const data = await apiService.getChecklist<ChecklistItem[]>(id);
        console.log(data)
        
        console.log("API response received for checklist:", data);
        
        // Set the checklist data
        console.log("Successfully fetched checklist data:", data);
        setChecklist(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching checklist:", err);
        console.error("Full error object:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
        
        // Show a more detailed error message
        let errorMessage = "Unknown error";
        let status = 0;
        
        if (err instanceof Error) {
          errorMessage = err.message;
          console.error("Error name:", err.name);
          console.error("Error message:", err.message);
          console.error("Error stack:", err.stack);
          
          // Check if it's an ApplicationError with status
          if ('status' in err) {
            status = (err as ApplicationError).status;
            console.error("Error status:", status);
          }
        }
        
        // Handle 401 Unauthorized errors
        if (status === 401 || errorMessage.includes("Invalid or expired token")) {
          console.error("Authentication error detected, redirecting to login page");
          setError("Your session has expired. Please log in again.");
          
          // Redirect to login page after a short delay
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          
          return;
        }
        
        setError(`Failed to load checklist: ${errorMessage}`);
        setChecklist([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log("Initiating checklist fetch for roadtrip ID:", id);
      fetchChecklist();
    } else {
      console.error("Cannot fetch checklist: No roadtrip ID provided");
    }
  }, [apiService, id, router, authState.isLoggedIn]);

  // Handle adding a new checklist item
  const handleAddItem = async (item: { 
    name: string; 
    isCompleted: boolean; 
    assignedUser: string | null; 
    category: string; 
    priority: string 
  }) => {
    try {
      console.log("Adding new checklist item:", item);
      
      // Validate required fields
      if (!item.name || item.name.trim() === "") {
        throw new Error("Checklist item name is required");
      }
      
      const newItem: Omit<ChecklistItem, "checklistItemId"> = {
        name: item.name.trim(),
        isCompleted: item.isCompleted,
        assignedUser: item.assignedUser && item.assignedUser.trim() !== "" ? item.assignedUser.trim() : null,
        priority: item.priority as ChecklistItemPriority,
        category: item.category as ChecklistItemCategory,
        roadtripId: parseInt(id)
      };

      console.log("Formatted new item for API:", newItem);

      // Call API to create the item
      const createdItem = await apiService.addChecklistElement<ChecklistItem>(id, newItem);
      
      console.log("API response for created item:", createdItem);
      
      if (createdItem && typeof createdItem === 'object') {
        console.log("Successfully created checklist item:", createdItem);
        
        // Refresh the checklist from the server to ensure UI is in sync
        await refreshChecklist();
        
        setShowAddItemWindow(false);
        
        // Show success message
        setError(null);
      } else {
        console.error("Invalid response format from API:", createdItem);
        throw new Error("Invalid response from API when creating checklist item");
      }
    } catch (err) {
      console.error("Error adding checklist item:", err);
      
      // Show error message to user
      let errorMessage = "Unknown error";
      
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error("Error details:", {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
        
        // Check for specific error types
        if (err.message.includes("network") || err.message.includes("fetch")) {
          errorMessage = "Network error. Please check your internet connection.";
        } else if (err.message.includes("401") || err.message.includes("unauthorized")) {
          errorMessage = "Authentication error. Please log in again.";
          // Redirect to login after a delay
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      }
      
      setError(`Failed to add checklist item: ${errorMessage}`);
      
      // Don't close the window if it's a validation error
      if (!(err instanceof Error) || !err.message.includes("required")) {
        setShowAddItemWindow(false);
      }
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  // Handle updating an existing checklist item
  const handleUpdateItem = async (item: { 
    name: string; 
    isCompleted: boolean; 
    assignedUser: string | null; 
    category: string; 
    priority: string 
  }) => {
    if (!selectedItem) return;

    try {
      const updatedItem: ChecklistItem = {
        ...selectedItem,
        name: item.name,
        isCompleted: item.isCompleted,
        assignedUser: item.assignedUser,
        priority: item.priority as ChecklistItemPriority,
        category: item.category as ChecklistItemCategory
      };

      // Call API to update the item
      await apiService.updateChecklistElement<ChecklistItem>(id, selectedItem.checklistItemId, updatedItem);
      
      // Refresh the checklist from the server to ensure UI is in sync
      await refreshChecklist();
      
      setSelectedItem(null);
    } catch (err) {
      console.error("Error updating checklist item:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to update checklist item: ${errorMessage}`);
      setSelectedItem(null);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  // Handle deleting a checklist item
  const handleDeleteItem = async (itemId: number) => {
    try {
      // Call API to delete the item
      await apiService.deleteChecklistElement(id, itemId);
      
      // Refresh the checklist from the server to ensure UI is in sync
      await refreshChecklist();
      
      setSelectedItem(null);
    } catch (err) {
      console.error("Error deleting checklist item:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to delete checklist item: ${errorMessage}`);
      setSelectedItem(null);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  // Handle toggling completion status
  const handleToggleCompletion = async (item: ChecklistItem) => {
    try {
      // Create a new updated item with toggled isCompleted status
      const updatedItem: ChecklistItem = {
        ...item,
        isCompleted: !item.isCompleted
      };

      console.log(`Toggling item ${item.name} from ${item.isCompleted} to ${updatedItem.isCompleted}`);

      // Update local state immediately for better user experience
      setChecklist(prev => 
        prev.map(i => i.checklistItemId === item.checklistItemId ? updatedItem : i)
      );

      // Call API to update the item
      await apiService.updateChecklistElement<ChecklistItem>(id, item.checklistItemId, updatedItem);
      
      // Refresh the checklist from the server to ensure UI is in sync
      await refreshChecklist();
    } catch (err) {
      console.error("Error updating checklist item:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to toggle checklist item: ${errorMessage}`);
      
      // Revert the local state change if the API call fails
      setChecklist(prev => [...prev]);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  // Ensure each checklist item has a unique ID
  const processedChecklist = useMemo(() => {
    // Create a copy of the checklist to avoid modifying the original
    const processed = [...checklist];
    const seenIds = new Set<number>();
    
    // Process each item to ensure unique IDs
    return processed.map(item => {
      // Check if the item has a checklistElementId from the server
      const itemWithPossibleElementId = item as unknown as { checklistElementId?: number };
      if (itemWithPossibleElementId.checklistElementId) {
        // Use the server's ID as the checklistItemId
        const serverItem = {
          ...item,
          checklistItemId: itemWithPossibleElementId.checklistElementId
        };
        
        // If this ID is already seen, generate a new one
        if (seenIds.has(serverItem.checklistItemId)) {
          const newId = Date.now() + Math.floor(Math.random() * 10000);
          return { ...serverItem, checklistItemId: newId };
        }
        
        // Otherwise, mark this ID as seen and return the item with the server's ID
        seenIds.add(serverItem.checklistItemId);
        return serverItem;
      }
      
      // If item doesn't have an ID or ID is already seen, generate a new one
      if (!item.checklistItemId || seenIds.has(item.checklistItemId)) {
        // Generate a unique ID based on timestamp and a random number
        const newId = Date.now() + Math.floor(Math.random() * 10000);
        return { ...item, checklistItemId: newId };
      }
      
      // Otherwise, mark this ID as seen and return the item as is
      seenIds.add(item.checklistItemId);
      return item;
    });
  }, [checklist]);

  // Filter checklist items
  const filteredChecklist = processedChecklist.filter(item => {
    if (filterCategory && item.category !== filterCategory) return false;
    if (filterPriority && item.priority !== filterPriority) return false;
    if (filterCompleted !== null && item.isCompleted !== filterCompleted) return false;
    return true;
  });

  // Group checklist items by category
  const groupedChecklist: Record<string, ChecklistItem[]> = {};
  filteredChecklist.forEach(item => {
    if (!groupedChecklist[item.category]) {
      groupedChecklist[item.category] = [];
    }
    groupedChecklist[item.category].push(item);
  });

  return (
    <>
      <Header />
      <div className="container" style={{ 
        padding: "16px", 
        margin: "16px auto 0", 
        maxWidth: "1400px",
        position: "relative"
      }}>
        <BackToMapButton roadtripId={id} />
        
        {/* Add spacing div to prevent overlap with the button */}
        <div style={{ height: "50px" }}></div>
        {loading && <p>Loading checklist...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {!loading && (
          <div style={{
            width: "100%",
            position: "relative"
          }}>
            <div style={{
              color: "#090909",
              fontSize: 36,
              fontFamily: "Manrope",
              fontWeight: 700,
              lineHeight: "48px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>Roadtrip Checklist</span>
              <button 
                onClick={() => setShowAddItemWindow(true)}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Add Item
              </button>
            </div>
            <div style={{
              width: "100%",
              height: 0,
              border: "1.5px solid #090909",
              marginBottom: "40px"
            }}></div>
            
            {/* Filters */}
            <div style={{
              background: "#D9D9D9",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: 10,
              padding: "20px",
              marginBottom: "30px"
            }}>
              <div style={{
                color: "black",
                fontSize: 24,
                fontFamily: "Manrope",
                fontWeight: 700,
                marginBottom: "20px"
              }}>
                Filters
              </div>
              <div style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap"
              }}>
                {/* Category Filter */}
                <div>
                  <label style={{
                    color: "black",
                    fontSize: 16,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    marginBottom: "5px",
                    display: "block"
                  }}>
                    Category
                  </label>
                  <select
                    value={filterCategory || ""}
                    onChange={(e) => setFilterCategory(e.target.value || null)}
                    style={{
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      minWidth: "200px"
                    }}
                  >
                    <option value="">All Categories</option>
                    {Object.values(ChecklistItemCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                {/* Priority Filter */}
                <div>
                  <label style={{
                    color: "black",
                    fontSize: 16,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    marginBottom: "5px",
                    display: "block"
                  }}>
                    Priority
                  </label>
                  <select
                    value={filterPriority || ""}
                    onChange={(e) => setFilterPriority(e.target.value || null)}
                    style={{
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      minWidth: "200px"
                    }}
                  >
                    <option value="">All Priorities</option>
                    {Object.values(ChecklistItemPriority).map(pri => (
                      <option key={pri} value={pri}>{pri}</option>
                    ))}
                  </select>
                </div>
                
                {/* Completion Filter */}
                <div>
                  <label style={{
                    color: "black",
                    fontSize: 16,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    marginBottom: "5px",
                    display: "block"
                  }}>
                    Status
                  </label>
                  <select
                    value={filterCompleted === null ? "" : filterCompleted ? "completed" : "pending"}
                    onChange={(e) => {
                      if (e.target.value === "") setFilterCompleted(null);
                      else setFilterCompleted(e.target.value === "completed");
                    }}
                    style={{
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      minWidth: "200px"
                    }}
                  >
                    <option value="">All Items</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Not Completed</option>
                  </select>
                </div>
                
                {/* Clear Filters Button */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-end"
                }}>
                  <button
                    onClick={() => {
                      setFilterCategory(null);
                      setFilterPriority(null);
                      setFilterCompleted(null);
                    }}
                    style={{
                      padding: "8px 16px",
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
            
            {/* Checklist Items */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px"
            }}>
              {Object.entries(groupedChecklist).map(([category, items]) => (
                <div key={category} style={{
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  borderRadius: 10,
                  padding: "20px"
                }}>
                  <div style={{
                    color: "black",
                    fontSize: 24,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    marginBottom: "20px"
                  }}>
                    {category}
                  </div>
                  
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}>
                    {items.map(item => (
                      <div key={item.checklistItemId} style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #E4E4E4",
                        background: item.isCompleted ? "rgba(121, 164, 77, 0.1)" : "white"
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          flex: 1
                        }}>
                          <Checkbox
                            checked={item.isCompleted}
                            onChange={() => handleToggleCompletion(item)}
                          />
                          <div style={{
                            display: "flex",
                            flexDirection: "column"
                          }}>
                            <span style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "black",
                              textDecoration: item.isCompleted ? "line-through" : "none"
                            }}>
                              {item.name}
                            </span>
                            {item.assignedUser && (
                              <span style={{
                                fontSize: "14px",
                                color: "#666",
                                marginTop: "2px"
                              }}>
                                Assigned to: {item.assignedUser}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px"
                        }}>
                          {/* Category Badge */}
                          <span style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#3F51B5", // Blue color for category
                            padding: "4px 8px",
                            borderRadius: "4px",
                            background: "rgba(63, 81, 181, 0.1)"
                          }}>
                            {item.category}
                          </span>
                          
                          {/* Priority Badge */}
                          <span style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color:
                              item.priority === ChecklistItemPriority.HIGH ? "#E6393B" :
                              item.priority === ChecklistItemPriority.MEDIUM ? "#F3A712" :
                              item.priority === ChecklistItemPriority.LOW ? "#79A44D" :
                              "#999999",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            background: "rgba(0, 0, 0, 0.05)"
                          }}>
                            {item.priority}
                          </span>
                          
                          <button
                            onClick={() => setSelectedItem(item)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: "#007bff",
                              fontWeight: 700,
                              fontSize: "14px"
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(groupedChecklist).length === 0 && (
                <div style={{
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  borderRadius: 10,
                  padding: "40px 20px",
                  textAlign: "center"
                }}>
                  <p style={{
                    fontSize: "18px",
                    color: "#666"
                  }}>
                    No Checklist Items available yet. Click &quot;Add Item&quot; to create one.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Item Window */}
      {showAddItemWindow && (
        <ChecklistItemWindow
          name=""
          isCompleted={false}
          assignedUser={null}
          category={ChecklistItemCategory.ITEM}
          priority={ChecklistItemPriority.MEDIUM}
          onClose={() => setShowAddItemWindow(false)}
          onSave={handleAddItem}
          isNew={true}
        />
      )}

      {/* Edit Item Window */}
      {selectedItem && (
        <ChecklistItemWindow
          name={selectedItem.name}
          isCompleted={selectedItem.isCompleted}
          assignedUser={selectedItem.assignedUser}
          category={selectedItem.category}
          priority={selectedItem.priority}
          onClose={() => setSelectedItem(null)}
          onSave={handleUpdateItem}
          onDelete={() => handleDeleteItem(selectedItem.checklistItemId)}
          isNew={false}
        />
      )}
    </>
  );
}
