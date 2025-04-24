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
import RouteDisplay from "@/components/MapComponents/RouteDisplay";
import RouteForm from "@/components/MapComponents/RouteForm";
import RouteDetails from "@/components/MapComponents/RouteDetails";
import RouteList from "@/components/MapComponents/RouteList";
import "leaflet/dist/leaflet.css";
import {Marker, useMapEvent} from "react-leaflet";
import {useApi} from "@/hooks/useApi";
import ProtectedRoute from "@/components/ProtectedRoute";
import {PoiAcceptanceStatus, PoiCategory, PointOfInterest, PoiPriority} from "@/types/poi";
import {Route, RouteAcceptanceStatus, RouteCreateRequest, TravelMode} from "@/types/route";

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

  const [sidebarTop, setSidebarTop] = useState("30%");
  const apiService = useApi();
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [newPoi, setNewPoi] = useState<PointOfInterest | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<PointOfInterest | null>(null);
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

  useEffect(() => {
    async function fetchPois() {
      try {
        const data = await apiService.get<PointOfInterest[]>(`/roadtrips/${id}/pois`);
        setPois(data);
        console.log("Fetched POIs:", data);
      } catch (error) {
        console.error("Failed to fetch POIs:", error);
      }
    }
    fetchPois();
  }, [id, apiService]);

  // Fetch routes when in route mode
  useEffect(() => {
    if (mapMode === MapMode.ROUTE) {
      async function fetchRoutes() {
        try {
          const data = await apiService.get<Route[]>(`/roadtrips/${id}/routes`);
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

  const handleDeleteRoute = async (startId: number, endId: number) => {
    try {
      console.log(`Deleting route from ${startId} to ${endId}`);
      await apiService.deleteRoute(id, startId, endId);
      setRoutes(prevRoutes => prevRoutes.filter(
        route => !(route.startId === startId && route.endId === endId)
      ));
      setSelectedRoute(null);
      console.log("Route deleted successfully");
    } catch (error) {
      console.error("Failed to delete route:", error);
    }
  };

  // Toggle between POI and Route mode
  const toggleMapMode = () => {
    setMapMode(prevMode => prevMode === MapMode.POI ? MapMode.ROUTE : MapMode.POI);
    setSelectedPoi(null);
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
        />
      )}
      {selectedPoi && (
        <POIWindow
          title={selectedPoi.name}
          description={selectedPoi.description}
          category={selectedPoi.category}
          priority={selectedPoi.priority}
          status={selectedPoi.status}
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
            setSelectedPoi(null);
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
            setSelectedPoi(null);
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
          onClose={() => setSelectedPoi(null)}
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
          onDelete={() => handleDeleteRoute(selectedRoute.startId, selectedRoute.endId)} 
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
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Display POIs in POI mode */}
        {mapMode === MapMode.POI && pois.map((poi) => {
          let color = "#000000"; // Default
          if (poi.status === PoiAcceptanceStatus.PENDING) color = "#FFD700"; // Gelb
          else if (poi.status === PoiAcceptanceStatus.APPROVED) color = "#79A44D"; // Grün
          else if (poi.status === PoiAcceptanceStatus.REJECTED) color = "#FF0000"; // Rot

          return (
            <Marker
              key={poi.poiId}
              position={[poi.coordinate.coordinates[1], poi.coordinate.coordinates[0]]}
              icon={ColoredMarker(color)}
              eventHandlers={{
                click: () => setSelectedPoi(poi),
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
                  click: () => setSelectedPoi(poi),
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
