"use client";

import { useState } from "react";
import { useRoadtripMembers } from "@/hooks/useRoadtripMembers";
import { User } from "@/types/user";
import { InvitationStatus } from "@/types/roadtripMember";

// Extended User type that includes invitation status
interface UserWithInvitationStatus extends User {
  invitationStatus?: InvitationStatus;
}
import { useAuth } from "@/hooks/useAuth";

interface RoadtripMemberManagementProps {
  roadtripId: string | number;
  isOwner: boolean;
}

export default function RoadtripMemberManagement({ roadtripId, isOwner }: RoadtripMemberManagementProps) {
  const { userId: currentUserId } = useAuth();
  const { 
    members, 
    loading, 
    error, 
    inviteMember, 
    removeMember,
    updateMemberStatus
  } = useRoadtripMembers({ roadtripId });

  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [addMemberError, setAddMemberError] = useState<string | null>(null);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Handle adding a new member
  const handleAddUser = () => {
    setShowAddMemberPopup(true);
    setNewMemberUsername("");
    setAddMemberError(null);
    setInviteSuccess(null);
  };

  // Handle submitting the add member form
  const handleAddMemberSubmit = async () => {
    if (!newMemberUsername.trim()) {
      setAddMemberError("Please enter a username");
      return;
    }

    try {
      setAddMemberError(null);
      const result = await inviteMember(newMemberUsername);
      
      if (result) {
        setInviteSuccess(`Successfully invited ${newMemberUsername} to the roadtrip.`);
        // Clear the form after a short delay
        setTimeout(() => {
          setShowAddMemberPopup(false);
          setInviteSuccess(null);
        }, 2000);
      } else {
        setAddMemberError("Failed to invite member. Please check the username and try again.");
      }
    } catch (err) {
      console.error("Error adding member:", err);
      setAddMemberError("Failed to add member. Please try again.");
    }
  };

  // Handle removing a user
  const handleRemoveUser = async (userId: string) => {
    try {
      // Check if the user is removing themselves
      if (userId === currentUserId) {
        // If a user is removing themselves, set their invitation status to DECLINED instead
        console.log(`User is removing themselves. Setting invitation status to DECLINED for user ${userId}`);
        await updateMemberStatus(userId, InvitationStatus.DECLINED);
      } else {
        // If an owner is removing someone else, use the removeMember function
        console.log(`Removing user ${userId} from roadtrip`);
        await removeMember(userId);
      }
      setSelectedMemberId(null);
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  // Get invitation status label
  const getInvitationStatusLabel = (user: User): string => {
    // In a real implementation, we would get the invitation status from the user object
    // For now, we'll simulate it with a random status for demonstration
    
    // Check if this is the current user (always show as "Member")
    if (user.userId === currentUserId) {
      return "Member";
    }
    
    // For other users, we'll use the invitationStatus property if it exists
    // or simulate it with a random status for demonstration
    const userWithStatus = user as UserWithInvitationStatus;
    if (userWithStatus.invitationStatus) {
      switch (userWithStatus.invitationStatus) {
        case InvitationStatus.PENDING:
          return "Pending";
        case InvitationStatus.ACCEPTED:
          return "Member";
        case InvitationStatus.DECLINED:
          return "Declined";
        default:
          return "Member";
      }
    }
    
    // If no status is available, randomly assign one for demonstration
    // In a real implementation, this would come from the API
    const randomStatus = Math.random();
    if (randomStatus < 0.2) {
      return "Pending";
    } else if (randomStatus < 0.3) {
      return "Declined";
    } else {
      return "Member";
    }
  };
  
  // Get status color based on invitation status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "#FFA500"; // Orange
      case "Declined":
        return "#FF0000"; // Red
      default:
        return "#4CAF50"; // Green for Accepted/Member
    }
  };

  return (
    <div style={{
      width: "100%",
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
        Users
      </div>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {loading && members.length === 0 ? (
        <p>Loading members...</p>
      ) : (
        <>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px"
          }}>
            {members.length === 0 ? (
              <p>No members found. Invite users to join this roadtrip.</p>
            ) : (
              members.map((member) => {
                const status = getInvitationStatusLabel(member);
                const statusColor = getStatusColor(status);
                
                return (
                  <div 
                    key={member.userId}
                    className="roadtrip-member"
                    onClick={() => isOwner && setSelectedMemberId(selectedMemberId === member.userId ? null : member.userId)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "rgba(128, 128, 128, 0.55)",
                      borderRadius: 10,
                      padding: "5px 10px",
                      position: "relative",
                      cursor: isOwner ? "pointer" : "default"
                    }}
                  >
                    <div style={{
                      color: "white",
                      fontSize: 16,
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      marginRight: "10px"
                    }}>
                      {member.username}
                    </div>
                    
                    {/* Status indicator */}
                    <div style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: statusColor,
                      marginRight: "5px"
                    }}></div>
                    
                    <div style={{
                      color: "white",
                      fontSize: 12,
                      fontFamily: "Manrope",
                      fontWeight: 400
                    }}>
                      {status}
                    </div>
                    
                    {selectedMemberId === member.userId && (
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 10,
                        marginTop: "5px",
                        background: "white",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        borderRadius: "5px",
                        padding: "5px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px"
                      }}>
                        {/* Show different options based on status and user role */}
                        {status === "Pending" && (
                          <>
                            {/* Owner can accept/decline/remove pending members */}
                            {isOwner && (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateMemberStatus(member.userId as string, InvitationStatus.ACCEPTED);
                                    setSelectedMemberId(null);
                                  }}
                                  style={{
                                    background: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    padding: "5px 10px",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  Accept Invitation
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateMemberStatus(member.userId as string, InvitationStatus.DECLINED);
                                    setSelectedMemberId(null);
                                  }}
                                  style={{
                                    background: "#FFA500",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    padding: "5px 10px",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  Decline Invitation
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveUser(member.userId as string);
                                  }}
                                  style={{
                                    background: "#E74C3C",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    padding: "5px 10px",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  Remove Member
                                </button>
                              </>
                            )}
                            
                            {/* Current user can accept/decline their own pending invitations */}
                            {member.userId === currentUserId && (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateMemberStatus(member.userId as string, InvitationStatus.ACCEPTED);
                                    setSelectedMemberId(null);
                                  }}
                                  style={{
                                    background: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    padding: "5px 10px",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  Accept Invitation
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateMemberStatus(member.userId as string, InvitationStatus.DECLINED);
                                    setSelectedMemberId(null);
                                  }}
                                  style={{
                                    background: "#E74C3C",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    padding: "5px 10px",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  Decline Invitation
                                </button>
                              </>
                            )}
                          </>
                        )}
                        
                        {/* For accepted members, owner can remove them */}
                        {status === "Member" && isOwner && member.userId !== currentUserId && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveUser(member.userId as string);
                            }}
                            style={{
                              background: "#E74C3C",
                              color: "white",
                              border: "none",
                              borderRadius: "3px",
                              padding: "5px 10px",
                              fontSize: "12px",
                              cursor: "pointer",
                              whiteSpace: "nowrap"
                            }}
                          >
                            Remove Member
                          </button>
                        )}
                        
                        {/* For declined members, owner can remove them or re-invite */}
                        {status === "Declined" && isOwner && (
                          <>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateMemberStatus(member.userId as string, InvitationStatus.PENDING);
                                setSelectedMemberId(null);
                              }}
                              style={{
                                background: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                padding: "5px 10px",
                                fontSize: "12px",
                                cursor: "pointer",
                                whiteSpace: "nowrap"
                              }}
                            >
                              Re-invite Member
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveUser(member.userId as string);
                              }}
                              style={{
                                background: "#E74C3C",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                padding: "5px 10px",
                                fontSize: "12px",
                                cursor: "pointer",
                                whiteSpace: "nowrap"
                              }}
                            >
                              Remove Member
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          {isOwner && (
            <div style={{
              display: "flex",
              gap: "20px"
            }}>
              <button 
                onClick={handleAddUser}
                className="form-button"
                style={{ width: "auto" }}
              >
                <span className="form-button-text">Add user</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Member Popup */}
      {showAddMemberPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            width: "400px",
            background: "white",
            borderRadius: 10,
            padding: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)"
          }}>
            <div style={{
              color: "black",
              fontSize: 24,
              fontFamily: "Manrope",
              fontWeight: 700,
              marginBottom: "20px"
            }}>
              Add Member
            </div>
            
            <div style={{
              marginBottom: "20px"
            }}>
              <div className="form-input-container" data-clicked={newMemberUsername ? "Clicked" : "Default"} data-state="Default">
                {!newMemberUsername && (
                  <div className="form-input-placeholder">
                    <div>Username</div>
                  </div>
                )}
                <input
                  type="text"
                  value={newMemberUsername}
                  onChange={(e) => setNewMemberUsername(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              {addMemberError && (
                <div style={{
                  color: "red",
                  fontSize: 14,
                  marginTop: "5px"
                }}>
                  {addMemberError}
                </div>
              )}
              {inviteSuccess && (
                <div style={{
                  color: "green",
                  fontSize: 14,
                  marginTop: "5px"
                }}>
                  {inviteSuccess}
                </div>
              )}
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px"
            }}>
              <button
                onClick={() => setShowAddMemberPopup(false)}
                className="form-button"
                style={{ background: "#ccc", width: "auto" }}
              >
                <span className="form-button-text">Cancel</span>
              </button>
              <button
                onClick={handleAddMemberSubmit}
                className="form-button"
                style={{ width: "auto" }}
              >
                <span className="form-button-text">Add</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
