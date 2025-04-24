"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import type {LeafletMouseEvent} from "leaflet";
import {ColoredMarker} from "@/components/MapComponents/coloredMarker";
import POIWindow from "@/components/MapComponents/POIWindow";
import VerticalSidebar from "@/components/MapComponents/VerticalSidebar";
import POIList from "@/components/MapComponents/POIList";
import "leaflet/dist/leaflet.css";
import {Marker, useMapEvent} from "react-leaflet";
import {useApi} from "@/hooks/useApi";
import ProtectedRoute from "@/components/ProtectedRoute";
import {PoiAcceptanceStatus, PoiCategory, PointOfInterest, PoiPriority, Comment} from "@/types/poi"; // Assuming PoiCategory is defined in the same file
import { RoadtripMember} from "@/types/roadtripMember";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);


function RoadtripContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [sidebarTop, setSidebarTop] = useState("30%");
  const apiService = useApi();
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [newPoi, setNewPoi] = useState<PointOfInterest | null>(null);
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);
  const selectedPoi = pois.find(p => p.poiId === selectedPoiId) || null;
  const [selectedPoiComments, setSelectedPoiComments] = useState<Comment[]>([]);
  const [members, setMembers] = useState<RoadtripMember[]>([]);
  const [contextMenuLatLng, setContextMenuLatLng] = useState<{ lat: number, lng: number } | null>(null);
  const [contextMenuScreenPosition, setContextMenuScreenPosition] = useState<{ x: number, y: number } | null>(null);
  const [showPOIList, setShowPOIList] = useState(false);

  // Dynamically resize VerticalSidebar Position, if Browser Window is shortened
    // Checks, that SideBar slides upwards, but doesn't cover Logo
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

  // Fetch POIs helper
  const fetchPois = async () => {
    try {
      const data = await apiService.get<PointOfInterest[]>(`/roadtrips/${id}/pois`);
      const enriched = data.map(poi => ({
        ...poi,
        creatorUserName: members.find(m => m.userId === poi.creatorId)?.username
      }));
      setPois(enriched);
    } catch (error) {
      console.error("Failed to fetch POIs:", error);
    }
  };

  // Initial fetchPois call
  useEffect(() => {
    fetchPois();
  }, [id, apiService, members]);

  // Polling fetchPois every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPois();
    }, 5000); // alle 5 Sekunden
    return () => clearInterval(interval);
  }, [id, apiService, members]);

  useEffect(() => {
    apiService.get<RoadtripMember[]>(`/roadtrips/${id}/members`)
      .then(setMembers)
      .catch((err) => console.error("Failed to fetch roadtrip members", err));
  }, [id, apiService]);

  useEffect(() => {
    if (!selectedPoi) return;
    const fetchCommentsWithAuthors = async () => {
      try {
        const comments = await apiService.get<Comment[]>(`/roadtrips/${id}/pois/${selectedPoi.poiId}/comments`);
        const enriched = comments.map((c) => ({
          ...c,
          authorUserName: members.find(m => m.userId === c.authorId)?.username
        }));
        setSelectedPoiComments(enriched);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    fetchCommentsWithAuthors();
  }, [selectedPoi, apiService, id, members]);

  function MapClickHandler() {
    useMapEvent("contextmenu", (e: LeafletMouseEvent) => {
      setContextMenuLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
      setContextMenuScreenPosition({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
    });
    return null;
  }

  return (
    <div style={{ height: "100vh", width: "100%", marginTop: "-144px"}}>
        {/* ------------- Logo ------------- */}
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
        {/* ------------- SideBar ------------- */}
        <VerticalSidebar
        sidebarTop={sidebarTop}
        onWayfinder={() => console.log("klick on Wayfinder")}
        onPOIList={() => setShowPOIList((prev) => !prev)}
        onChecklist={() => router.push(`/my-roadtrips/${id}/checklist`)}
        onLayerManager={() => console.log("klick on LayerManager")}
        onSettings={() => router.push(`/my-roadtrips/${id}/settings`)}
      />
      {showPOIList && <POIList pois={pois} />}
      {newPoi && (
        <POIWindow
          title={newPoi.name}
          description={newPoi.description}
          category={newPoi.category}
          priority={newPoi.priority}
          status={newPoi.status}
          onSave={async ({ title, description, category, priority }) => {
            if (!newPoi) return;
            const updatedPoi: PointOfInterest = {
              ...newPoi,
              name: title,
              description: description,
              category: category as PoiCategory,
              priority: priority as PoiPriority,
            };
            try {
              const createdPoi = await apiService.post<PointOfInterest>(`/roadtrips/${id}/pois`, updatedPoi);
              setPois((prevPois) => [...prevPois, createdPoi]);
              console.log("POI created successfully");
            } catch (error) {
              console.error("Failed to create POI:", error);
            }
            setContextMenuLatLng(null);
            setContextMenuScreenPosition(null);
            setNewPoi(null);
          }}
          onDelete={() => {
            if (!newPoi) return;
            setPois((prevPois) => prevPois.filter((poi) => poi.poiId !== newPoi.poiId));
            /*const apiService = new ApiService();
            apiService.delete(`/roadtrips/${id}/pois/${newPoi.poiId}`).catch((error) => {
              console.error("Failed to delete POI:", error);
            });*/
              // TODO: Delete "new POI" könnte vereinfacht werden, ein API DELETE braucht es vermutlich nicht
            setNewPoi(null);
            setContextMenuLatLng(null);
            setContextMenuScreenPosition(null);
          }}
          onUpvote={() => {}}
          onDownvote={ () => {}}
          onClose={() => {
            setNewPoi(null);
            setContextMenuLatLng(null);
            setContextMenuScreenPosition(null);
          }}
          isNew={true}
        />
      )}
      {selectedPoi && (
        <POIWindow
          title={selectedPoi.name}
          description={selectedPoi.description}
          category={selectedPoi.category}
          priority={selectedPoi.priority}
          status={selectedPoi.status}
          comments={selectedPoiComments}
          onSendComment={async (message) => {
            try {
              await apiService.post(`/roadtrips/${id}/pois/${selectedPoi.poiId}/comments`, {
                comment: message
              });
              const updated = await apiService.get<Comment[]>(`/roadtrips/${id}/pois/${selectedPoi.poiId}/comments`);
              // Enrich comments with authorUserName after sending new comment
              const enriched = updated.map((c) => ({
                ...c,
                authorUserName: members.find(m => m.userId === c.authorId)?.username
              }));
              setSelectedPoiComments(enriched);
            } catch (err) {
              console.error("Failed to send comment:", err);
            }
          }}
          onSave={async ({ title, description, category, priority }) => {
            const updatedPoi: PointOfInterest = {
              ...selectedPoi,
              name: title,
              description: description,
              category: category as PoiCategory,
              priority: priority as PoiPriority,
            };
            setPois((prevPois) =>
              prevPois.map((poi) =>
                poi.poiId === selectedPoi?.poiId ? updatedPoi : poi
              )
            );
            try {
              await apiService.put(`/roadtrips/${id}/pois/${selectedPoi?.poiId}`, updatedPoi);
              console.log("POI updated successfully");
            } catch (error) {
              console.error("Failed to update POI:", error);
            }
            setSelectedPoiId(null);
          }}
          onDelete={async () => {
            if (!selectedPoi) return;
            setPois((prevPois) => prevPois.filter((poi) => poi.poiId !== selectedPoi.poiId));
            try {
              await apiService.delete(`/roadtrips/${id}/pois/${selectedPoi.poiId}`);
              console.log("POI deleted successfully");
            } catch (error) {
              console.error("Failed to delete POI:", error);
            }
            setSelectedPoiId(null);
          }}
          onUpvote={async () => {
              if (!selectedPoi) return;
              try {
                  await apiService.put(`/roadtrips/${id}/pois/${selectedPoi.poiId}/votes`, {
                      vote: "upvote",
                  });
                  console.log("Upvote erfolgreich");
              } catch (error) {
                  console.error("Fehler beim Upvoten:", error);
              }
          }}
          onDownvote={async () => {
              if (!selectedPoi) return;
              try {
                  await apiService.put(`/roadtrips/${id}/pois/${selectedPoi.poiId}/votes`, {
                      vote: "downvote",
                  });
                  console.log("Downvote erfolgreich");
              } catch (error) {
                  console.error("Fehler beim Downvoten:", error);
              }
          }}
          onClose={() => setSelectedPoiId(null)}
          isNew={false}
        />
      )}
      {contextMenuLatLng && contextMenuScreenPosition && (
        <div
          style={{
            position: "absolute",
            top: contextMenuScreenPosition.y,
            left: contextMenuScreenPosition.x,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
            padding: "8px",
            zIndex: 2000,
          }}
        >
          <button style = {{backgroundColor: "white",  // weißer Hintergrund
            color: "black",
          borderWidth: "0px"}}
                  onClick={() => {
            const newPoint: PointOfInterest = {
              poiId: Date.now(), // TODO: Anpassen?
              name: "",
              coordinate: {
                type: "Point",
                coordinates: [contextMenuLatLng.lng, contextMenuLatLng.lat],
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
            setContextMenuScreenPosition(null);
            setContextMenuLatLng(null);
          }}>Add POI</button>
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
          console.log("Rendering POI:", poi);
          let color = "#000000"; // Default
          if (poi.status === PoiAcceptanceStatus.PENDING) color = "#FFD700"; // Gelb
          else if (poi.status === PoiAcceptanceStatus.ACCEPTED) color = "#79A44D"; // Grün
          else if (poi.status === PoiAcceptanceStatus.DECLINED) color = "#FF0000"; // Rot

          return (
            <Marker
              key={poi.poiId}
              position={[poi.coordinate.coordinates[1], poi.coordinate.coordinates[0]]}
              icon={ColoredMarker(color)}
              eventHandlers={{
                click: () => setSelectedPoiId(poi.poiId),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

// Wrap the content with ProtectedRoute
export default function RoadtripPage() {
  return (
    <ProtectedRoute>
      <RoadtripContent />
    </ProtectedRoute>
  );
}
