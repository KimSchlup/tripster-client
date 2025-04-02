"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { LeafletMouseEvent } from "leaflet";
import POIWindow from "@/components/POIWindow";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const useMapEvent = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMapEvent),
  { ssr: false },
);

export default function RoadtripPage() {
  const [popupPosition, setPopupPosition] = useState<[number, number] | null>(
    null,
  );
  const [sidebarTop, setSidebarTop] = useState("30%");

  useEffect(() => {
    const handleResize = () => {
      const logoBottom = 30 + 60 + 20; // logo top + logo height + Abstand
      const idealPosition = globalThis.innerHeight * 0.2;
      if (idealPosition > logoBottom) {
        setSidebarTop("20%");
        console.log("idealPosition", idealPosition, "logoBottom", logoBottom);
      } else {
        setSidebarTop(`${logoBottom}px`);
      }
    };
    handleResize();
    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, []);

  function MapClickHandler() {
    useMapEvent("contextmenu", (e: LeafletMouseEvent) => {
      setPopupPosition([e.latlng.lat, e.latlng.lng]);
    });
    return null;
  }

  return (
    <div style={{ height: "100vh", width: "100%", marginTop: "-144px"}}>
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          background: "transparent",
          zIndex: 1000,
        }}
      >
        <img
          src="/logo-no-text-white.png"
          alt="Logo"
          style={{ width: "60px", height: "60px", borderRadius: "10%" }}
        />
      </Link>
      {/* ----------------- Vertical Sidebar ----------------- */}

      <div
        style={{
          position: "absolute",
          top: sidebarTop,
          left: "30px",
          // transform: "translateY(-50%)",
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
        {/* ----------------- Button: Wayfinder ----------------- */}
        <button
          style={{
            background: "transparent",
            border: "none",
            width: "60px",
            height: "60px",
            position: "relative",
            borderRadius: "30%",
            overflow: "hidden",
          }}
          onMouseEnter={(e) =>
            e.currentTarget.querySelector(".hover-overlay")!.style.opacity =
              "0.1"}
          onMouseLeave={(e) =>
            e.currentTarget.querySelector(".hover-overlay")!.style.opacity =
              "0"}
        >
          <img
            src="/map-elements/wayfinder.svg"
            alt="Wayfinder"
            style={{ width: "50px", height: "50px" }}
          />
          <span
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
            className="hover-overlay"
          />
        </button>

        {/* ----------------- Button: POI List ----------------- */}
        <button
          style={{
            background: "transparent",
            border: "none",
            width: "60px",
            height: "60px",
            position: "relative",
            borderRadius: "30%",
            overflow: "hidden",
          }}
          onMouseEnter={(e) =>
            e.currentTarget.querySelector(".hover-overlay")!.style.opacity =
              "0.1"}
          onMouseLeave={(e) =>
            e.currentTarget.querySelector(".hover-overlay")!.style.opacity =
              "0"}
        >
          <img
            src="/map-elements/poi-list.svg"
            alt="POI List"
            style={{ width: "45px", height: "45px" }}
          />
          <span
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
            className="hover-overlay"
          />
        </button>

        {/* ----------------- Button: Layer Manager ----------------- */}
        <button
          style={{
            background: "transparent",
            border: "none",
            width: "60px",
            height: "60px",
            position: "relative",
            borderRadius: "30%",
            overflow: "hidden",
          }}
          onMouseEnter={(e) =>
            e.currentTarget.querySelector(".hover-overlay")!.style.opacity =
              "0.1"}
          onMouseLeave={(e) =>
            e.currentTarget.querySelector(".hover-overlay")!.style.opacity =
              "0"}
        >
          <img
            src="/map-elements/layer-manager.svg"
            alt="Layer Manager"
            style={{ width: "50px", height: "50px" }}
          />
          <span
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
            className="hover-overlay"
          />
        </button>

        {/* ----------------- Button: Checklist ----------------- */}
        <button
          style={{
            background: "transparent",
            border: "none",
            width: "60px",
            height: "60px",
            position: "relative",
            borderRadius: "30%",
            overflow: "hidden",
          }}
          onMouseEnter={(e) =>
            e.currentTarget.querySelector(".hover-overlay")!.style.opacity =
              "0.1"}
          onMouseLeave={(e) =>
            e.currentTarget.querySelector(".hover-overlay")!.style.opacity =
              "0"}
        >
          <img
            src="/map-elements/checklist.svg"
            alt="Checklist"
            style={{ width: "50px", height: "50px" }}
          />
          <span
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
            className="hover-overlay"
          />
        </button>

        {/* ----------------- Button: Settings ----------------- */}
        <button
          style={{
            background: "transparent",
            border: "none",
            width: "60px",
            height: "60px",
            position: "relative",
            borderRadius: "30%",
            overflow: "hidden",
          }}
          onMouseEnter={(e) =>
            e.currentTarget.querySelector(".hover-overlay")!.style.opacity =
              "0.1"}
          onMouseLeave={(e) =>
            e.currentTarget.querySelector(".hover-overlay")!.style.opacity =
              "0"}
        >
          <img
            src="/map-elements/settings.svg"
            alt="Settings"
            style={{ width: "50px", height: "50px" }}
          />
          <span
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
            className="hover-overlay"
          />
        </button>
      </div>
      <POIWindow
        title="Riga"
        description="Lot to see there, Old Hansa City, Art Nouveau Architecture. Seems to have great Bars and Hostels. There are also some good Museums, like Soviet Cars. We could make a historic city tour?"
        category="Capital City, Museum, Bars, Architecture"
        onClose={() => console.log("closed")}
      />
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={[47.37013, 8.54427]}
        zoom={13}
        zoomControl={false}
      >
        <MapClickHandler />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {popupPosition && (
          <Popup position={popupPosition}>
            <div style={{ borderRadius: "8px", padding: "8px" }}>
              <strong>Coordinates:</strong>
              <br />
              Lat: {popupPosition[0].toFixed(5)} <br />
              Long: {popupPosition[1].toFixed(5)}
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
