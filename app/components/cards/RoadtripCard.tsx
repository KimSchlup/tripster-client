import { InvitationStatus } from "@/types/roadtripMember";
import { Roadtrip, RoadtripMemberDisplay } from "@/types/roadtrip";
import React from "react";
import Image from "next/image";

const styles = {
  card: {
    width: 328,
    boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  } as const,

  // Make banner the relative container
  banner: {
    position: "relative" as const,
    width: 328,
    height: 200, // grow height for your text overlay
    overflow: "hidden" as const,
  },

  // image sits underneath
  backgroundImage: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },

  // translucent panel at the bottom
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
};

export default function RoadtripCard({
  roadtrip,
  imageUrl,
  onClick,
  formatMembersList,
}: Props) {
  const pending = roadtrip.invitationStatus === InvitationStatus.PENDING;

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.banner}>
        {/* background image */}
        {imageUrl && (
          <Image
            width={328}
            height={200}
            src={imageUrl}
            alt="Cover"
            style={styles.backgroundImage}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}

        {/* pending badge */}
        {pending && <div style={styles.pendingBadge}>!</div>}

        {/* translucent overlay with text */}
        <div style={styles.overlay}>
          <h3 style={styles.title}>{roadtrip.name}</h3>
          <p style={styles.members}>
            {pending
              ? "Pending Invitation"
              : formatMembersList(roadtrip.roadtripMembers)}
          </p>
        </div>
      </div>
    </div>
  );
}
