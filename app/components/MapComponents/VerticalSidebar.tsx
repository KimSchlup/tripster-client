"use client";

import React from "react";
import Image from "next/image";

interface VerticalSidebarProps {
    sidebarTop: string,
    onWayfinder: () => void;
    onPOIList: () => void;
    onChecklist: () => void;
    onLayerManager: () => void;
    onSettings: () => void;
    onRouteList?: () => void;
    isRouteMode?: boolean;
}

const VerticalSidebar: React.FC<VerticalSidebarProps> = ({
    sidebarTop,
  onWayfinder,
  onPOIList,
  onChecklist,
  onLayerManager,
  onSettings,
  onRouteList,
  isRouteMode = false,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: sidebarTop,
        left: "30px",
        width: "60px",
        height: "340px",
        borderRadius: "30px",
        background: "linear-gradient(to bottom, #62BDE1, #6DA5F0)",
        boxShadow: "0 0 30px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      {/* Wayfinder */}
      <button
        onClick={onWayfinder}
        style={{
          background: "transparent",
          border: "none",
          width: "60px",
          height: "60px",
          position: "relative",
          borderRadius: "30%",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0.1"
        }
        onMouseLeave={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0"
        }
      >
        <Image src="/map-elements/wayfinder.svg" alt="Wayfinder" width={50} height={50} />
        <span
          className="hover-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#3d2f57",
            borderRadius: "30%",
            opacity: 0,
            transition: "opacity 0.2s",
            pointerEvents: "none",
          }}
        />
      </button>

      {/* POI List */}
      <button
        onClick={onPOIList}
        style={{
          background: "transparent",
          border: "none",
          width: "60px",
          height: "60px",
          position: "relative",
          borderRadius: "30%",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0.1"
        }
        onMouseLeave={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0"
        }
      >
        <Image src="/map-elements/poi-list.svg" alt="POI List" width={45} height={45} />
        <span
          className="hover-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#3d2f57",
            borderRadius: "30%",
            opacity: 0,
            transition: "opacity 0.2s",
            pointerEvents: "none",
          }}
        />
      </button>

      {/* Route List */}
      <button
        onClick={onRouteList}
        style={{
          background: isRouteMode ? "rgba(255, 255, 255, 0.2)" : "transparent",
          border: "none",
          width: "60px",
          height: "60px",
          position: "relative",
          borderRadius: "30%",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0.1"
        }
        onMouseLeave={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0"
        }
      >
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: "5px" }}>
          <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="white"/>
          <path d="M3 3H11V5H3V3ZM3 7H11V9H3V7ZM3 11H11V13H3V11Z" fill="white"/>
        </svg>
        <span
          className="hover-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#3d2f57",
            borderRadius: "30%",
            opacity: 0,
            transition: "opacity 0.2s",
            pointerEvents: "none",
          }}
        />
      </button>

      {/* Layer Manager */}
      <button
        onClick={onLayerManager}
        style={{
          background: "transparent",
          border: "none",
          width: "60px",
          height: "60px",
          position: "relative",
          borderRadius: "30%",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0.1"
        }
        onMouseLeave={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0"
        }
      >
        <Image src="/map-elements/layer-manager.svg" alt="Layer Manager" width={50} height={50} />
        <span
          className="hover-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#3d2f57",
            borderRadius: "30%",
            opacity: 0,
            transition: "opacity 0.2s",
            pointerEvents: "none",
          }}
        />
      </button>

      {/* Checklist */}
      <button
        onClick={onChecklist}
        style={{
          background: "transparent",
          border: "none",
          width: "60px",
          height: "60px",
          position: "relative",
          borderRadius: "30%",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0.1"
        }
        onMouseLeave={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0"
        }
      >
        <Image src="/map-elements/checklist.svg" alt="Checklist" width={50} height={50} />
        <span
          className="hover-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#3d2f57",
            borderRadius: "30%",
            opacity: 0,
            transition: "opacity 0.2s",
            pointerEvents: "none",
          }}
        />
      </button>

      {/* Settings */}
      <button
        onClick={onSettings}
        style={{
          background: "transparent",
          border: "none",
          width: "60px",
          height: "60px",
          position: "relative",
          borderRadius: "30%",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0.1"
        }
        onMouseLeave={(e) =>
          (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0"
        }
      >
        <Image src="/map-elements/settings.svg" alt="Settings" width={50} height={50} />
        <span
          className="hover-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#3d2f57",
            borderRadius: "30%",
            opacity: 0,
            transition: "opacity 0.2s",
            pointerEvents: "none",
          }}
        />
      </button>
    </div>
  );
};

export default VerticalSidebar;
