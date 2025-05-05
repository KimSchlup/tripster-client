"use client";

import React from "react";
import Image from "next/image";

interface VerticalSidebarProps {
    sidebarTop: string,
    onPOIList: () => void;
    onChecklist: () => void;
    onLayerManager: () => void;
    onSettings: () => void;
    onRouteList?: () => void;
}

const VerticalSidebar: React.FC<VerticalSidebarProps> = ({
    sidebarTop,
    onPOIList,
    onChecklist,
    onLayerManager,
    onSettings,
    onRouteList,
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
          <Image src="/map-elements/wayfinder.svg" alt="POI List" width={50} height={50} />
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
