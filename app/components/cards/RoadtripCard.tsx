import { InvitationStatus } from "@/types/roadtripMember";
import { Roadtrip, RoadtripMemberDisplay } from "@/types/roadtrip";
import React, { useState, ReactNode } from "react";

const styles = {
  card: {
    width: 328,
    boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  } as const,

  banner: {
    position: "relative" as const,
    width: 328,
    height: 200,
    overflow: "hidden" as const,
  },

  backgroundImage: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },

  overlay: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    padding: "8px 0",
  },

  pendingBadge: {
    position: "absolute" as const,
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "white",
    color: "#FFA500",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    fontWeight: "bold",
  } as const,

  title: {
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: 24,
    margin: 0,
  } as const,

  members: {
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: 14,
    margin: 0,
    color: "#333",
  } as const,
};

type Props = {
  roadtrip: Roadtrip;
  imageUrl?: string;
  onClick: () => void;
  formatMembersList: (members?: RoadtripMemberDisplay[]) => string;
  membersComponent?: ReactNode;
};

export default function RoadtripCard({
  roadtrip,
  imageUrl,
  onClick,
  formatMembersList,
  membersComponent,
}: Props) {
  const pending = roadtrip.invitationStatus === InvitationStatus.PENDING;
  const [imageError, setImageError] = useState(false);

  const showImage = imageUrl && !imageError;

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.banner}>
        {showImage ? (
          <img
            width={328}
            height={200}
            src={imageUrl}
            alt="Cover"
            style={styles.backgroundImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            style={{
              width: 328,
              height: 100,
              background: pending ? "#FFA500" : "#D9D9D9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 24,
                fontFamily: "Manrope",
                fontWeight: "700",
              }}
            >
              {roadtrip.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {pending && <div style={styles.pendingBadge}>!</div>}

        <div style={styles.overlay}>
          <h3 style={styles.title}>{roadtrip.name}</h3>
          {pending ? (
            <p style={styles.members}>Pending Invitation</p>
          ) : membersComponent ? (
            <div style={{ 
              marginTop: "5px", 
              width: "100%", 
              display: "flex", 
              justifyContent: "center" 
            }}>
              {membersComponent}
            </div>
          ) : (
            <p style={styles.members}>
              {formatMembersList(roadtrip.roadtripMembers)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
