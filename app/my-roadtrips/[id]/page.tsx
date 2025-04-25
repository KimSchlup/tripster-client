"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {useEffect, useState} from "react";
import { useCallback } from "react";
import {useParams, useRouter} from "next/navigation";
import type {LeafletMouseEvent} from "leaflet";
import {ColoredMarker} from "@/components/MapComponents/coloredMarker";
import POIWindow from "@/components/MapComponents/POIWindow";
import VerticalSidebar from "@/components/MapComponents/VerticalSidebar";
import POIList from "@/components/MapComponents/POIList";
import RouteDisplay from "@/components/MapComponents/RouteDisplay";
import RouteForm from "@/components/MapComponents/RouteForm";
import RouteDetails from "@/components/MapComponents/RouteDetails";
import RouteList from "@/components/MapComponents/RouteList";
import "leaflet/dist/leaflet.css";
import {Marker, useMapEvent} from "react-leaflet";
import {useApi} from "@/hooks/useApi";
import ProtectedRoute from "@/components/ProtectedRoute";

import {PoiAcceptanceStatus, PoiCategory, PointOfInterest, PoiPriority, Comment} from "@/types/poi"; // Assuming PoiCategory is defined in the same file
import { RoadtripMember} from "@/types/roadtripMember";
import { useAuth } from "@/hooks/useAuth";
import {Route, RouteCreateRequest} from "@/types/routeTypes";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);


// Define map modes
enum MapMode {
  POI = "POI",
  ROUTE = "ROUTE"
}

function RoadtripContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const apiService = useApi();

  const [sidebarTop, setSidebarTop] = useState("30%");
  const [basemapType, setBasemapType] = useState<"SATELLITE" | "OPEN_STREET_MAP">("OPEN_STREET_MAP");
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await apiService.get<{ basemapType: string }>(`/roadtrips/${id}/settings`);
        setBasemapType(settings.basemapType as "SATELLITE" | "OPEN_STREET_MAP");
      } catch (error) {
        console.error("Failed to fetch roadtrip settings", error);
      }
    };
    fetchSettings();
  }, [id, apiService]);

  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [decisionProcess, setDecisionProcess] = useState<"MAJORITY" | "OWNER_DECISION">("MAJORITY");
  const { authState } = useAuth();
  const userId = authState.userId;

  // Debug logs for decisionProcess, userId, ownerId, and showVotingButtons
  console.log("userId:", userId, "ownerId:", ownerId);
  console.log("showVotingButtons:", decisionProcess === "MAJORITY" || Number(userId) === ownerId);

  useEffect(() => {
    const fetchRoadtrip = async () => {
      try {
        const roadtrip = await apiService.get<{ ownerId: number; decisionProcess: string }>(`/roadtrips/${id}`);
        setOwnerId(roadtrip.ownerId);
        const raw = roadtrip.decisionProcess?.trim().toUpperCase();
        if (raw === "MAJORITY" || raw === "OWNER_DECISION") {
          setDecisionProcess(raw);
        } else {
          console.error("Unexpected decisionProcess value:", raw);
        }
        console.log("decisionProcess:", decisionProcess);
      } catch (error) {
        console.error("Failed to fetch roadtrip info", error);
      }
    };
    fetchRoadtrip();
  }, [id, apiService, decisionProcess]);

  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [newPoi, setNewPoi] = useState<PointOfInterest | null>(null);
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);
  const selectedPoi = pois.find(p => p.poiId === selectedPoiId) || null;
  const [selectedPoiComments, setSelectedPoiComments] = useState<Comment[]>([]);
  const [members, setMembers] = useState<RoadtripMember[]>([]);
  const [contextMenuLatLng, setContextMenuLatLng] = useState<{ lat: number, lng: number } | null>(null);
  const [contextMenuScreenPosition, setContextMenuScreenPosition] = useState<{ x: number, y: number } | null>(null);
  const [showPOIList, setShowPOIList] = useState(false);
  
  // Route state
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.POI);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [showRouteList, setShowRouteList] = useState(false);

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
  const fetchPois = useCallback(async () => {
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
  }, [apiService, id, members]);

  // Initial fetchPois call
  useEffect(() => {
    fetchPois();
  }, [fetchPois]);

  // Polling fetchPois every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPois();
    }, 5000); // alle 5 Sekunden
    return () => clearInterval(interval);
  }, [fetchPois]);

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

  // Fetch routes when in route mode
  useEffect(() => {
    if (mapMode === MapMode.ROUTE) {
      async function fetchRoutes() {
        try {
          const data = await apiService.get<Route[]>(`/roadtrips/${id}/routes`);
          console.log("Fetched Routes Structure:", JSON.stringify(data, null, 2));
          console.log("Route data type:", typeof data);
          if (data && data.length > 0) {
            console.log("First route properties:", Object.keys(data[0]));
            console.log("Route.route type:", data[0].route ? typeof data[0].route : "undefined");
            if (data[0].route) {
              console.log("Route.route properties:", Object.keys(data[0].route));
            }
          }
          setRoutes(data);
          console.log("Fetched Routes:", data);
        } catch (error) {
          console.error("Failed to fetch routes:", error);
        }
      }
      fetchRoutes();
    }
  }, [id, apiService, mapMode]);

  // Route handlers
  const handleCreateRoute = async (routeData: RouteCreateRequest) => {
    try {
      console.log("Creating route with data:", routeData);
      const newRoute = await apiService.addRoute<Route>(id, routeData);
      setRoutes(prevRoutes => [...prevRoutes, newRoute]);
      setShowRouteForm(false);
      console.log("Route created successfully");
    } catch (error) {
      console.error("Failed to create route:", error);
    }
  };

  const handleDeleteRoute = async (routeId: number) => {
    try {
      console.log(`Deleting route with ID ${routeId}`);
      await apiService.deleteRoute(id, routeId);
      setRoutes(prevRoutes => prevRoutes.filter(route => route.routeId !== routeId));
      setSelectedRoute(null);
      console.log("Route deleted successfully");
    } catch (error) {
      console.error("Failed to delete route:", error);
    }
  };

  // Toggle between POI and Route mode
  const toggleMapMode = () => {
    setMapMode(prevMode => prevMode === MapMode.POI ? MapMode.ROUTE : MapMode.POI);
    setSelectedPoiId(null);
    setSelectedRoute(null);
    setShowPOIList(false);
    setShowRouteList(false);
    setShowRouteForm(false);
  };

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
          onWayfinder={() => toggleMapMode()}
          onPOIList={() => setShowPOIList((prev) => !prev)}
          onRouteList={() => setShowRouteList((prev) => !prev)}
          onChecklist={() => router.push(`/my-roadtrips/${id}/checklist`)}
          onLayerManager={() => console.log("klick on LayerManager")}
          onSettings={() => router.push(`/my-roadtrips/${id}/settings`)}
          isRouteMode={mapMode === MapMode.ROUTE}
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
          showVotingButtons={decisionProcess === "MAJORITY" || Number(userId) === ownerId}
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
          showVotingButtons={decisionProcess === "MAJORITY" || Number(userId) === ownerId}
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
      {/* Route Components */}
      {showRouteList && (
        <RouteList 
          routes={routes} 
          pois={pois} 
          onRouteSelect={(route) => setSelectedRoute(route)} 
        />
      )}
      
      {showRouteForm && (
        <RouteForm 
          pois={pois} 
          onCreateRoute={handleCreateRoute} 
          onCancel={() => setShowRouteForm(false)} 
        />
      )}
      
      {selectedRoute && (
        <RouteDetails 
          route={selectedRoute} 
          pois={pois} 
          onClose={() => setSelectedRoute(null)} 
          onDelete={() => handleDeleteRoute(selectedRoute.routeId!)} 
        />
      )}

      {/* Mode Toggle Button */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          right: "30px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <span style={{ fontWeight: 600 }}>Mode:</span>
        <button
          onClick={toggleMapMode}
          style={{
            background: mapMode === MapMode.POI ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "3px",
            cursor: "pointer"
          }}
        >
          POI
        </button>
        <button
          onClick={toggleMapMode}
          style={{
            background: mapMode === MapMode.ROUTE ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "3px",
            cursor: "pointer"
          }}
        >
          Route
        </button>
      </div>

      {/* Create Route Button (only in Route mode) */}
      {mapMode === MapMode.ROUTE && (
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
            zIndex: 1000
          }}
        >
          <button
            onClick={() => setShowRouteForm(true)}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: 600,
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              cursor: "pointer"
            }}
          >
            Create Route
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
        {basemapType === "SATELLITE" && (
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        )}
        {basemapType === "OPEN_STREET_MAP" && (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        )}
        {/* Display POIs in POI mode */}
        {mapMode === MapMode.POI && pois.map((poi) => {
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

        {/* Display Routes in Route mode */}
        {mapMode === MapMode.ROUTE && (
          <>
            {/* Display all POIs as markers */}
            {pois.map((poi) => (
              <Marker
                key={poi.poiId}
                position={[poi.coordinate.coordinates[1], poi.coordinate.coordinates[0]]}
                icon={ColoredMarker("#000000")}
                eventHandlers={{
                  click: () => setSelectedPoiId(poi.poiId),
                }}
              />
            ))}
            
            {/* Display routes as polylines */}
            <RouteDisplay 
              routes={routes} 
              onRouteClick={(route) => setSelectedRoute(route)} 
            />
          </>
        )}
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
