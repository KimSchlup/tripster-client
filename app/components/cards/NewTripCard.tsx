// File: components/cards/NewTripCard.tsx
import React from "react";

const styles = {
  card: {
    width: 328,
    boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  } as const,

  // relative container
  banner: {
    position: "relative" as const,
    width: 328,
    height: 200, // same height you use for RoadtripCard
    background: "#D9D9D9",
    overflow: "hidden" as const,
  } as const,

  // the translucent white overlay at bottom
  overlay: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px 0",
  } as const,

  // large "+" in the middle of the banner
  fallbackAvatar: {
    position: "absolute" as const,
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    fontSize: 100,
    fontFamily: "Manrope",
    fontWeight: 700,
  } as const,

  title: {
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: 24,
    margin: 10,
    color: "rgba(0,0,0,0.6)",
  } as const,
};

type NewTripCardProps = {
  onClick: () => void;
};

export default function NewTripCard({ onClick }: NewTripCardProps) {
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.banner}>
        {/* big "+" in the center */}
        <div style={styles.fallbackAvatar}>+</div>

        {/* translucent overlay with the title */}
        <div style={styles.overlay}>
          <h3 style={styles.title}>Create Roadtrip</h3>
        </div>
      </div>
    </div>
  );
}
