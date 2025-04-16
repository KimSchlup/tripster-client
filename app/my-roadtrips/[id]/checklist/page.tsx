"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { useApi } from "@/hooks/useApi";
import { ChecklistItem, ChecklistItemCategory, ChecklistItemPriority } from "@/types/checklistItem";
import ChecklistItemWindow from "@/components/ChecklistItemWindow";
import Checkbox from "@/components/Checkbox";

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

  // Fetch checklist items
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        setLoading(true);
        const data = await apiService.get<ChecklistItem[]>(`/roadtrips/${id}/checklist`);
        setChecklist(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching checklist:", err);
        setError("Failed to load checklist. Please try again later.");
        // If the API is not implemented yet, use sample data
        setChecklist([
          {
            checklistItemId: 1,
            name: "Book hotel in Zurich",
            isCompleted: true,
            assignedUser: "John",
            priority: ChecklistItemPriority.HIGH,
            category: ChecklistItemCategory.TODO,
            roadtripId: parseInt(id)
          },
          {
            checklistItemId: 2,
            name: "Pack hiking boots",
            isCompleted: false,
            assignedUser: "Sarah",
            priority: ChecklistItemPriority.MEDIUM,
            category: ChecklistItemCategory.ITEM,
            roadtripId: parseInt(id)
          },
          {
            checklistItemId: 3,
            name: "Rent car",
            isCompleted: false,
            assignedUser: null,
            priority: ChecklistItemPriority.HIGH,
            category: ChecklistItemCategory.TODO,
            roadtripId: parseInt(id)
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChecklist();
    }
  }, [apiService, id]);

  // Handle adding a new checklist item
  const handleAddItem = async (item: { 
    name: string; 
    isCompleted: boolean; 
    assignedUser: string | null; 
    category: string; 
    priority: string 
  }) => {
    try {
      const newItem: Omit<ChecklistItem, "checklistItemId"> = {
        name: item.name,
        isCompleted: item.isCompleted,
        assignedUser: item.assignedUser,
        priority: item.priority as ChecklistItemPriority,
        category: item.category as ChecklistItemCategory,
        roadtripId: parseInt(id)
      };

      // Call API to create the item
      const createdItem = await apiService.post<ChecklistItem>(`/roadtrips/${id}/checklist`, newItem);
      
      // Update local state
      setChecklist(prev => [...prev, createdItem]);
      setShowAddItemWindow(false);
    } catch (err) {
      console.error("Error adding checklist item:", err);
      // If the API is not implemented yet, create a mock item
      const mockItem: ChecklistItem = {
        ...item,
        checklistItemId: Date.now(),
        priority: item.priority as ChecklistItemPriority,
        category: item.category as ChecklistItemCategory,
        roadtripId: parseInt(id)
      } as ChecklistItem;
      
      setChecklist(prev => [...prev, mockItem]);
      setShowAddItemWindow(false);
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
      await apiService.put<void>(`/roadtrips/${id}/checklist/${selectedItem.checklistItemId}`, updatedItem);
      
      // Update local state
      setChecklist(prev => 
        prev.map(i => i.checklistItemId === selectedItem.checklistItemId ? updatedItem : i)
      );
      setSelectedItem(null);
    } catch (err) {
      console.error("Error updating checklist item:", err);
      // If the API is not implemented yet, update the mock item
      const updatedItem: ChecklistItem = {
        ...selectedItem,
        name: item.name,
        isCompleted: item.isCompleted,
        assignedUser: item.assignedUser,
        priority: item.priority as ChecklistItemPriority,
        category: item.category as ChecklistItemCategory
      };
      
      setChecklist(prev => 
        prev.map(i => i.checklistItemId === selectedItem.checklistItemId ? updatedItem : i)
      );
      setSelectedItem(null);
    }
  };

  // Handle deleting a checklist item
  const handleDeleteItem = async (itemId: number) => {
    try {
      // Call API to delete the item
      await apiService.delete<void>(`/roadtrips/${id}/checklist/${itemId}`);
      
      // Update local state
      setChecklist(prev => prev.filter(i => i.checklistItemId !== itemId));
      setSelectedItem(null);
    } catch (err) {
      console.error("Error deleting checklist item:", err);
      // If the API is not implemented yet, delete the mock item
      setChecklist(prev => prev.filter(i => i.checklistItemId !== itemId));
      setSelectedItem(null);
    }
  };

  // Handle toggling completion status
  const handleToggleCompletion = async (item: ChecklistItem) => {
    try {
      const updatedItem: ChecklistItem = {
        ...item,
        isCompleted: !item.isCompleted
      };

      // Call API to update the item
      await apiService.put<void>(`/roadtrips/${id}/checklist/${item.checklistItemId}`, updatedItem);
      
      // Update local state
      setChecklist(prev => 
        prev.map(i => i.checklistItemId === item.checklistItemId ? updatedItem : i)
      );
    } catch (err) {
      console.error("Error updating checklist item:", err);
      // If the API is not implemented yet, update the mock item
      const updatedItem: ChecklistItem = {
        ...item,
        isCompleted: !item.isCompleted
      };
      
      setChecklist(prev => 
        prev.map(i => i.checklistItemId === item.checklistItemId ? updatedItem : i)
      );
    }
  };

  // Filter checklist items
  const filteredChecklist = checklist.filter(item => {
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
        maxWidth: "1400px"
      }}>
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
                    No checklist items found. Click &quot;Add Item&quot; to create one.
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
