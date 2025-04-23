"use client";

import { useRouter } from "next/navigation";

interface BackToMapButtonProps {
  roadtripId: string | number;
}

export default function BackToMapButton({ roadtripId }: BackToMapButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/my-roadtrips/${roadtripId}`);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        background: "#000000",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 10
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 8H1M1 8L8 15M1 8L8 1"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back to Map
    </button>
  );
}
