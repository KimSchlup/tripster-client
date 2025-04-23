"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { LeafletMouseEvent } from "leaflet";
import { Icon } from "leaflet";
import POIWindow from "@/components/POIWindow";
import VerticalSidebar from "@/components/VerticalSidebar";
import POIList from "@/components/POIList";
import "leaflet/dist/leaflet.css";
import { Marker, useMapEvent } from "react-leaflet";
import { ApiService } from "@/api/apiService";
import {
  PoiAcceptanceStatus,
  PoiCategory,
  PointOfInterest,
  PoiPriority,
} from "@/types/poi";
import { useParams, useRouter } from "next/navigation";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

function createColoredMarker(color: string): Icon {
  const svgString = `
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.01639 21.8641L17.125 34.5L27.2337 21.8641C29.1862 19.4235 30.25 16.3909 30.25 13.2652V12.625C30.25 5.37626 24.3737 -0.5 17.125 -0.5C9.87626 -0.5 4 5.37626 4 12.625V13.2652C4 16.3909 5.06378 19.4235 7.01639 21.8641ZM17.125 17C19.5412 17 21.5 15.0412 21.5 12.625C21.5 10.2088 19.5412 8.25 17.125 8.25C14.7088 8.25 12.75 10.2088 12.75 12.625C12.75 15.0412 14.7088 17 17.125 17Z" fill="${color}"/>
    </svg>
  `;
  const svgUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

  return new Icon({
    iconUrl: svgUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}

export default function RoadtripPage() {
  let token = localStorage.getItem("token") ?? "";
  token = token.replace(/^"|"$/g, "");
  const params = useParams();
  const [sidebarTop, setSidebarTop] = useState("30%");
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [newPoi, setNewPoi] = useState<PointOfInterest | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<PointOfInterest | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [newPoiLatLng, setNewPoiLatLng] = useState<[number, number] | null>(
    null
  );
  const [showPOIList, setShowPOIList] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const logoBottom = 30 + 60 + 20;
      const idealPosition = globalThis.innerHeight * 0.2;
      setSidebarTop(idealPosition > logoBottom ? "20%" : `${logoBottom}px`);
    };
    handleResize();
    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchPois() {
      try {
        const apiService = new ApiService();
        const data = await apiService.get<PointOfInterest[]>(
          `/roadtrips/${params.id}/pois`
        );
        setPois(data);
      } catch (error) {
        console.error("Failed to fetch POIs:", error);
      }
    }
    fetchPois();
  }, []);

  useEffect(() => {
    async function postNewPoi() {
      if (newPoi) {
        try {
          const apiService = new ApiService();
          await apiService.post(`/roadtrips/${params.id}/pois`, newPoi);
          console.log("POI successfully posted:", newPoi);
        } catch (error) {
          console.error("Failed to post new POI:", error);
        }
      }
    }
    postNewPoi();
  }, [newPoi]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        // append your token in the WS URL
        new SockJS(
          `http://localhost:8080/ws?token=${encodeURIComponent(token)}`
        ),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        const topic = `/topic/roadtrips/${params.id}/pois`;

        client.subscribe(topic, (message: IMessage) => {
          const newPoi: PointOfInterest = JSON.parse(message.body);
          setPois((prev) => [...prev, newPoi]);
        });
      },
      onStompError: (frame) =>
        console.error("STOMP ERR", frame.headers.message),
    });
    client.activate();

    return () => {
      client.deactivate(); // Clean up on unmount
    };
  }, [params.id, token]);

  function MapClickHandler() {
    useMapEvent("contextmenu", (e: LeafletMouseEvent) => {
      setContextMenuPosition({
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY,
      });
      setNewPoiLatLng([e.latlng.lng, e.latlng.lat]);
    });
    return null;
  }

  return (
    <div style={{ height: "100vh", width: "100%", marginTop: "-144px" }}>
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
        <Image
          src="/logo-no-text-white.png"
          alt="Logo"
          width={60}
          height={60}
          style={{ borderRadius: "10%" }}
        />
      </Link>
      <VerticalSidebar
        sidebarTop={sidebarTop}
        onWayfinder={() => console.log("click on Wayfinder")}
        onPOIList={() => setShowPOIList((prev) => !prev)}
        onChecklist={() => console.log("click on Checklist")}
        onLayerManager={() => console.log("click on LayerManager")}
        onSettings={() => console.log("click on Settings")}
      />
      {showPOIList && <POIList pois={pois} />}
      {newPoi && (
        <POIWindow
          title={newPoi.name}
          description={newPoi.description}
          category={newPoi.category}
          onSave={({ title, description, category }) => {
            const updatedPoi: PointOfInterest = {
              ...newPoi,
              name: title,
              description: description,
              category: category as PoiCategory,
            };
            setPois((prevPois) => [...prevPois, updatedPoi]);
            setNewPoi(null);
            setContextMenuPosition(null);
          }}
          onDelete={() => {
            setNewPoi(null);
            setContextMenuPosition(null);
          }}
          onUpvote={() => {}}
          onDownvote={() => {}}
          onClose={() => {
            setNewPoi(null);
            setContextMenuPosition(null);
          }}
          isNew={true}
        />
      )}
      {selectedPoi && (
        <POIWindow
          title={selectedPoi.name}
          description={selectedPoi.description}
          category={selectedPoi.category}
          onSave={({ title, description, category }) => {
            setPois((prevPois) =>
              prevPois.map((poi) =>
                poi.poiId === selectedPoi.poiId
                  ? {
                      ...poi,
                      name: title,
                      description,
                      category: category as PoiCategory,
                    }
                  : poi
              )
            );
            setSelectedPoi(null);
          }}
          onDelete={() => setSelectedPoi(null)}
          onUpvote={() => {}}
          onDownvote={() => {}}
          onClose={() => setSelectedPoi(null)}
          isNew={false}
        />
      )}
      {contextMenuPosition && newPoiLatLng && (
        <div
          style={{
            position: "absolute",
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
            padding: "8px",
            zIndex: 2000,
          }}
        >
          <button
            style={{
              backgroundColor: "white",
              color: "black",
              borderWidth: "0px",
            }}
            onClick={() => {
              const [lng, lat] = newPoiLatLng;
              const newPoint: PointOfInterest = {
                poiId: Date.now(),
                name: "",
                coordinate: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
                description: "",
                category: PoiCategory.OTHER,
                priority: PoiPriority.OPTIONAL,
                creatorId: 0,
                status: PoiAcceptanceStatus.PENDING,
                upvotes: 0,
                downvotes: 0,
                eligibleVoteCount: 0,
              };
              setNewPoi(newPoint);
              setContextMenuPosition(null);
              setNewPoiLatLng(null);
            }}
          >
            Add POI
          </button>
        </div>
      )}
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={[47.37013, 8.54427]}
        zoom={13}
        zoomControl={false}
      >
        <MapClickHandler />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pois.map((poi) => {
          let color = "#000000";
          if (poi.status === PoiAcceptanceStatus.PENDING) color = "#FFD700";
          else if (poi.status === PoiAcceptanceStatus.APPROVED)
            color = "#79A44D";
          else if (poi.status === PoiAcceptanceStatus.REJECTED)
            color = "#FF0000";

          return (
            <Marker
              key={poi.poiId}
              position={[
                poi.coordinate.coordinates[1],
                poi.coordinate.coordinates[0],
              ]}
              icon={createColoredMarker(color)}
              eventHandlers={{
                click: () => setSelectedPoi(poi),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
