import { useState, useEffect } from "react";
import Image from "next/image";

interface WelcomeBoxProps {
  onClose: () => void;
}

export default function WelcomeBox({ onClose }: WelcomeBoxProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "100px",
        right: "30px",
        width: "350px",
        background: "rgba(255, 255, 255, 0.85)",
        boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        border: "1px solid #DDDDDD",
        backdropFilter: "blur(5px)",
        zIndex: 1500,
        padding: "20px",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <Image
          src="/map-elements/close.svg"
          alt="Close"
          width={20}
          height={20}
        />
      </button>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 700,
          marginTop: "0",
          marginBottom: "15px",
          color: "#333",
        }}
      >
        Welcome to MapMates!
      </h3>
      <p
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#555",
        }}
      >
        To begin planning your journey, right-click on the map where you want to add a Point Of Interest (POI).
      </p>
    </div>
  );
}
