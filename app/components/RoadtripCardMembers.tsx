"use client";

import { useRoadtripMembers } from "@/hooks/useRoadtripMembers";
import { User } from "@/types/user";
import { InvitationStatus } from "@/types/roadtripMember";
import { useAuth } from "@/hooks/useAuth";

interface RoadtripCardMembersProps {
  roadtripId: string | number;
}

export default function RoadtripCardMembers({
  roadtripId,
}: RoadtripCardMembersProps) {
  const { authState } = useAuth();
  const userId = authState.userId;
  const { members, loading, error } = useRoadtripMembers({ roadtripId });

  if (loading) return <span>Loading members...</span>;
  if (error) return <span>Error loading members</span>;

  // Get invitation status label
  const getInvitationStatusLabel = (user: User): string => {
    // Check if this is the current user (always show as "Member")
    if (user.userId === userId) {
      return "Member";
    }

    // For other users, we'll use the invitationStatus property if it exists
    const userWithStatus = user as User & {
      invitationStatus?: InvitationStatus;
    };
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

    // Default to Member if no status is available
    return "Member";
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

  // Limit display to 2 members with "+ X more" indicator
  const displayMembers = members.slice(0, 2);
  const remainingCount = members.length - 2;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
        justifyContent: "center",
      }}
    >
      {displayMembers.map((member) => {
        const status = getInvitationStatusLabel(member);
        const statusColor = getStatusColor(status);

        return (
          <div
            key={member.userId}
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "rgba(128, 128, 128, 0.55)",
              borderRadius: 10,
              padding: "3px 6px",
              margin: "2px",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 12,
                fontFamily: "Manrope",
                fontWeight: 700,
                marginRight: "5px",
              }}
            >
              {member.username}
            </div>

            {/* Status indicator */}
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: statusColor,
                marginRight: "3px",
              }}
            ></div>

            <div
              style={{
                color: "white",
                fontSize: 10,
                fontFamily: "Manrope",
                fontWeight: 400,
              }}
            >
              {status}
            </div>
          </div>
        );
      })}

      {/* Show "+ X more" indicator if there are more than 2 members */}
      {remainingCount > 0 && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(128, 128, 128, 0.55)",
            borderRadius: 10,
            padding: "3px 6px",
            margin: "2px",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 12,
              fontFamily: "Manrope",
              fontWeight: 700,
            }}
          >
            +{remainingCount} more
          </div>
        </div>
      )}

      {members.length === 0 && (
        <span style={{ color: "#666" }}>No members</span>
      )}
    </div>
  );
}
