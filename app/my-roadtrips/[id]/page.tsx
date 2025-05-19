"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { useLeaflet } from "@/utils/leafletUtils";
import WelcomeBox from "@/components/WelcomeBox";
import LayerManager from "@/components/MapComponents/LayerManager";
import { LayerFilterProvider } from "@/components/MapComponents/LayerFilterContext";
import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { LeafletMouseEvent } from "leaflet";
import POIWindow from "@/components/MapComponents/POIWindow";
import VerticalSidebar from "@/components/MapComponents/VerticalSidebar";
import POIList from "@/components/MapComponents/POIList";
import RouteForm from "@/components/MapComponents/RouteForm";
import RouteEditForm from "@/components/MapComponents/RouteEditForm";
import RouteDetails from "@/components/MapComponents/RouteDetails";
import RouteList from "@/components/MapComponents/RouteList";
import MapLayersControl from "@/components/MapComponents/MapLayersControl";
import "leaflet/dist/leaflet.css";
import { useMapEvent } from "react-leaflet";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  PoiAcceptanceStatus,
  PoiCategory,
  PointOfInterest,
  PoiPriority,
  Comment,
} from "@/types/poi"; // Assuming PoiCategory is defined in the same file
import { RoadtripMember } from "@/types/roadtripMember";
import { useAuth } from "@/hooks/useAuth";
import { Route, RouteCreateRequest, TravelMode } from "@/types/routeTypes";
import type { RoadtripSettings } from "@/types/roadtripSettings";
import type { GeoJSON } from "geojson";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

// Utility function to check if a point is within a polygon
const isPointInPolygon = (
  point: [number, number],
  polygon: GeoJSON
): boolean => {
  if (!polygon || polygon.type !== "Polygon") return true; // If no polygon or not a polygon, don't restrict

  // Implementation of point-in-polygon algorithm
  const x = point[0];
  const y = point[1];
  const vertices = polygon.coordinates[0];

  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i][0],
      yi = vertices[i][1];
    const xj = vertices[j][0],
      yj = vertices[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

function RoadtripContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const apiService = useApi();
  const { showToast } = useToast();

  const [sidebarTop, setSidebarTop] = useState("30%");

  // Reference to store the initial basemap type fetched from the API
  const initialBasemapType = useRef<
    "SATELLITE" | "OPEN_STREET_MAP" | "TOPOGRAPHY"
  >("OPEN_STREET_MAP");

  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [decisionProcess, setDecisionProcess] = useState<string | null>(null);
  const [boundingBox, setBoundingBox] = useState<GeoJSON | undefined>(
    undefined
  );
  const { authState } = useAuth();
  const userId = authState.userId;

  // Debug logs for decisionProcess, userId, ownerId, and showVotingButtons
  console.log("userId:", userId, "ownerId:", ownerId);
  console.log(
    "showVotingButtons:",
    decisionProcess === "MAJORITY" || Number(userId) === ownerId
  );

  // Consolidated useEffect to fetch settings and owner info
  useEffect(() => {
    const fetchSettingsAndOwner = async () => {
      try {
        const settings = await apiService.get<RoadtripSettings>(
          `/roadtrips/${id}/settings`
        );
        // Update the initial basemap type
        initialBasemapType.current = settings.basemapType as
          | "SATELLITE"
          | "OPEN_STREET_MAP"
          | "TOPOGRAPHY";
        setDecisionProcess(settings.decisionProcess);
        setBoundingBox(settings.boundingBox);
        console.log("Fetched decisionProcess:", settings.decisionProcess);
        console.log("Fetched boundingBox:", settings.boundingBox);
      } catch (error) {
        console.error("Failed to fetch roadtrip settings", error);
      }

      try {
        const roadtrip = await apiService.get<{ ownerId: number }>(
          `/roadtrips/${id}`
        );
        setOwnerId(roadtrip.ownerId);
      } catch (error) {
        console.error("Failed to fetch roadtrip info", error);
      }
    };

    fetchSettingsAndOwner();
  }, [id, apiService]);

  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [newPoi, setNewPoi] = useState<PointOfInterest | null>(null);
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);
  const selectedPoi = pois.find((p) => p.poiId === selectedPoiId) || null;
  const [selectedPoiComments, setSelectedPoiComments] = useState<Comment[]>([]);
  const [members, setMembers] = useState<RoadtripMember[]>([]);
  const [contextMenuLatLng, setContextMenuLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [contextMenuScreenPosition, setContextMenuScreenPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showPOIList, setShowPOIList] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Add click outside handler for context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenuLatLng(null);
        setContextMenuScreenPosition(null);
      }
    };

    if (contextMenuLatLng && contextMenuScreenPosition) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenuLatLng, contextMenuScreenPosition]);

  // Route state
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [showRouteEditForm, setShowRouteEditForm] = useState(false);
  const [showRouteList, setShowRouteList] = useState(false);
  const [showLayerManager, setShowLayerManager] = useState(false);
  const [showWelcomeBox, setShowWelcomeBox] = useState(false);

  // Handler for emergency contacts button
  const handleEmergencyContactsClick = () => {
    router.push(`/my-roadtrips/${id}/emergency-contacts`);
  };

  // Reference to the Leaflet map instance
  const mapRef = useRef<LeafletMap | null>(null);

  // Function to zoom to a POI
  const zoomToPoi = useCallback((poi: PointOfInterest) => {
    if (mapRef.current && poi.coordinate) {
      const [lng, lat] = poi.coordinate.coordinates;
      mapRef.current.setView([lat, lng], 16);
    }
  }, []);

  // Get Leaflet instance
  const leaflet = useLeaflet();

  // Function to zoom to a route
  const zoomToRoute = useCallback(
    (route: Route) => {
      if (mapRef.current && route.route && leaflet) {
        try {
          // Parse the route data if it's a string
          let routeData;
          if (typeof route.route === "string") {
            try {
              routeData = JSON.parse(route.route);
            } catch (parseError) {
              console.error("Error parsing route string:", parseError);
              return;
            }
          } else {
            routeData = route.route;
          }

          // Check if we have valid coordinates
          if (
            !routeData ||
            !routeData.coordinates ||
            !Array.isArray(routeData.coordinates)
          ) {
            console.warn("Route has invalid coordinates:", routeData);
            return;
          }

          // Create bounds from the route coordinates
          if (!leaflet) return;

          const initialCoord: [number, number] = [
            routeData.coordinates[0][1],
            routeData.coordinates[0][0],
          ];

          const bounds = routeData.coordinates.reduce(
            (
              bounds: import("leaflet").LatLngBounds,
              coord: [number, number]
            ) => {
              return bounds.extend([coord[1], coord[0]]);
            },
            new leaflet.LatLngBounds(initialCoord, initialCoord)
          );

          // Fit the map to the bounds with some padding
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        } catch (error) {
          console.error("Error zooming to route:", error);
        }
      }
    },
    [leaflet]
  );

  // Check if welcome box should be shown (only on first visit)
  useEffect(() => {
    const welcomeBoxClosed = sessionStorage.getItem("welcomeBoxClosed");
    if (welcomeBoxClosed !== "true") {
      setShowWelcomeBox(true);
    }
  }, []);

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

  // Fetch POIs helper with memoized dependencies
  const fetchPois = useCallback(async () => {
    try {
      const data = await apiService.get<PointOfInterest[]>(
        `/roadtrips/${id}/pois`
      );
      const enriched = data.map((poi) => ({
        ...poi,
        creatorUserName: members.find((m) => m.userId === poi.creatorId)
          ?.username,
      }));
      setPois(enriched);
    } catch (error) {
      console.error("Failed to fetch POIs:", error);
    }
  }, [apiService, id, members]);

  // Fetch routes helper with memoized dependencies
  const fetchRoutes = useCallback(async () => {
    try {
      const data = await apiService.get<Route[]>(`/roadtrips/${id}/routes`);
      setRoutes(data);
      console.log("Fetched Routes:", data);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
    }
  }, [apiService, id]);

  // Use a ref to store the interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial fetch and polling setup for both POIs and Routes in a single useEffect
  useEffect(() => {
    // Initial fetch
    fetchPois();
    fetchRoutes();

    // Setup polling with ref to ensure proper cleanup
    intervalRef.current = setInterval(() => {
      fetchPois();
      fetchRoutes();
    }, 10000); // every 10 seconds (increased from 3 seconds)

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchPois, fetchRoutes]); // Include fetchPois and fetchRoutes to ensure they run with updated dependencies

  // Update data when dependencies change
  useEffect(() => {
    fetchPois();
  }, [fetchPois]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  useEffect(() => {
    apiService
      .get<RoadtripMember[]>(`/roadtrips/${id}/members`)
      .then(setMembers)
      .catch((err) => console.error("Failed to fetch roadtrip members", err));
  }, [id, apiService]);

  // Separate useEffect to enrich POIs with member usernames when either changes
  useEffect(() => {
    if (members.length > 0) {
      // Only enrich existing POIs with usernames, don't fetch new ones
      setPois((currentPois) =>
        currentPois.map((poi) => ({
          ...poi,
          creatorUserName: members.find((m) => m.userId === poi.creatorId)
            ?.username,
        }))
      );
    }
  }, [members]);

  useEffect(() => {
    if (!selectedPoi) return;
    const fetchCommentsWithAuthors = async () => {
      try {
        const comments = await apiService.get<Comment[]>(
          `/roadtrips/${id}/pois/${selectedPoi.poiId}/comments`
        );
        const enriched = comments.map((c) => ({
          ...c,
          authorUserName: members.find((m) => m.userId === c.authorId)
            ?.username,
        }));
        setSelectedPoiComments(enriched);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    fetchCommentsWithAuthors();
  }, [selectedPoi, apiService, id, members]);

  // Route handlers
  const handleCreateRoute = async (routeData: RouteCreateRequest) => {
    try {
      console.log("Creating route with data:", routeData);
      const newRoute = await apiService.addRoute<Route>(id, routeData);
      setRoutes((prevRoutes) => [...prevRoutes, newRoute]);
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
      setRoutes((prevRoutes) =>
        prevRoutes.filter((route) => route.routeId !== routeId)
      );
      setSelectedRoute(null);
      console.log("Route deleted successfully");
    } catch (error) {
      console.error("Failed to delete route:", error);
    }
  };

  const handleEditRoute = async (
    routeId: number,
    routeData: RouteCreateRequest
  ) => {
    try {
      console.log(`Editing route with ID ${routeId} with data:`, routeData);

      // Extract the enum name directly from the TravelMode enum value
      const getTravelModeEnumName = (travelMode: string): string => {
        // Find the enum key by its value
        for (const enumKey in TravelMode) {
          if (TravelMode[enumKey as keyof typeof TravelMode] === travelMode) {
            return enumKey;
          }
        }
        return travelMode;
      };

      // Create a clean payload with just the required fields
      const formattedRouteData = {
        startId: Number(routeData.startId),
        endId: Number(routeData.endId),
        travelMode: getTravelModeEnumName(routeData.travelMode),
      };

      // Use the put method directly
      const endpoint = `/roadtrips/${id}/routes/${routeId}`;
      const updatedRoute = await apiService.put<Route>(
        endpoint,
        formattedRouteData
      );

      // If the response is empty (204 No Content), create a default response
      const finalUpdatedRoute = updatedRoute || {
        ...selectedRoute!,
        ...routeData,
        routeId: routeId,
      };

      setRoutes((prevRoutes) =>
        prevRoutes.map((route) =>
          route.routeId === routeId ? finalUpdatedRoute : route
        )
      );
      setShowRouteEditForm(false);
      setSelectedRoute(null);
      console.log("Route updated successfully");
    } catch (error) {
      console.error("Failed to update route:", error);
    }
  };

  function MapClickHandler() {
    useMapEvent("contextmenu", (e: LeafletMouseEvent) => {
      setContextMenuLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
      setContextMenuScreenPosition({
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY,
      });
    });

    // Add click handler to close context menu when clicking on the map
    useMapEvent("click", () => {
      if (contextMenuLatLng && contextMenuScreenPosition) {
        setContextMenuLatLng(null);
        setContextMenuScreenPosition(null);
      }
    });

    // Add handlers to close context menu when scrolling/zooming the map
    useMapEvent("movestart", () => {
      if (contextMenuLatLng && contextMenuScreenPosition) {
        setContextMenuLatLng(null);
        setContextMenuScreenPosition(null);
      }
    });

    useMapEvent("zoomstart", () => {
      if (contextMenuLatLng && contextMenuScreenPosition) {
        setContextMenuLatLng(null);
        setContextMenuScreenPosition(null);
      }
    });

    return null;
  }

  return (
    <div style={{ height: "100vh", width: "100%", marginTop: "-144px" }}>
      {/* ------------- Logo ------------- */}
      <Link
        href="/my-roadtrips"
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
        onPOIList={() => setShowPOIList((prev) => !prev)}
        onRouteList={() => setShowRouteList((prev) => !prev)}
        onChecklist={() => router.push(`/my-roadtrips/${id}/checklist`)}
        onLayerManager={() => setShowLayerManager((prev) => !prev)}
        onSettings={() => router.push(`/my-roadtrips/${id}/settings`)}
        onEmergencyContacts={handleEmergencyContactsClick}
      />
      {showPOIList && (
        <POIList
          pois={pois}
          onClose={() => setShowPOIList(false)}
          onPoiSelect={(poi) => {
            setSelectedPoiId(poi.poiId);
            zoomToPoi(poi);
          }}
        />
      )}
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
              const createdPoi = await apiService.post<PointOfInterest>(
                `/roadtrips/${id}/pois`,
                updatedPoi
              );
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
            setPois((prevPois) =>
              prevPois.filter((poi) => poi.poiId !== newPoi.poiId)
            );
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
          onDownvote={() => {}}
          onClose={() => {
            setNewPoi(null);
            setContextMenuLatLng(null);
            setContextMenuScreenPosition(null);
          }}
          isNew={true}
          showVotingButtons={
            decisionProcess === "MAJORITY" || Number(userId) === ownerId
          }
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
              await apiService.post(
                `/roadtrips/${id}/pois/${selectedPoi.poiId}/comments`,
                {
                  comment: message,
                }
              );
              const updated = await apiService.get<Comment[]>(
                `/roadtrips/${id}/pois/${selectedPoi.poiId}/comments`
              );
              // Enrich comments with authorUserName after sending new comment
              const enriched = updated.map((c) => ({
                ...c,
                authorUserName: members.find((m) => m.userId === c.authorId)
                  ?.username,
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
              await apiService.put(
                `/roadtrips/${id}/pois/${selectedPoi?.poiId}`,
                updatedPoi
              );
              console.log("POI updated successfully");
            } catch (error) {
              console.error("Failed to update POI:", error);
            }
            setSelectedPoiId(null);
          }}
          onDelete={async () => {
            if (!selectedPoi) return;
            setPois((prevPois) =>
              prevPois.filter((poi) => poi.poiId !== selectedPoi.poiId)
            );
            try {
              await apiService.delete(
                `/roadtrips/${id}/pois/${selectedPoi.poiId}`
              );
              console.log("POI deleted successfully");
            } catch (error) {
              console.error("Failed to delete POI:", error);
            }
            setSelectedPoiId(null);
          }}
          onUpvote={async () => {
            if (!selectedPoi) return;
            try {
              await apiService.put(
                `/roadtrips/${id}/pois/${selectedPoi.poiId}/votes`,
                {
                  vote: "upvote",
                }
              );
              console.log("Upvote erfolgreich");
            } catch (error) {
              console.error("Fehler beim Upvoten:", error);
            }
          }}
          onDownvote={async () => {
            if (!selectedPoi) return;
            try {
              await apiService.put(
                `/roadtrips/${id}/pois/${selectedPoi.poiId}/votes`,
                {
                  vote: "downvote",
                }
              );
              console.log("Downvote erfolgreich");
            } catch (error) {
              console.error("Fehler beim Downvoten:", error);
            }
          }}
          onClose={() => setSelectedPoiId(null)}
          isNew={false}
          showVotingButtons={
            decisionProcess === "MAJORITY" || Number(userId) === ownerId
          }
        />
      )}
      {contextMenuLatLng && contextMenuScreenPosition && (
        <div
          ref={contextMenuRef}
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
          <button
            style={{
              backgroundColor: "white", // weißer Hintergrund
              color: "black",
              borderWidth: "0px",
            }}
            onClick={() => {
              // Check if point is within bounding box
              const point: [number, number] = [
                contextMenuLatLng.lng,
                contextMenuLatLng.lat,
              ];

              if (boundingBox && !isPointInPolygon(point, boundingBox)) {
                // Show error toast if outside boundaries
                showToast(
                  "Cannot create POI outside of defined boundaries",
                  "error"
                );
                setContextMenuLatLng(null);
                setContextMenuScreenPosition(null);
                return;
              }

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
            }}
          >
            Add POI
          </button>
        </div>
      )}
      {/* Route Components */}
      {showRouteList && (
        <RouteList
          routes={routes}
          pois={pois}
          onRouteSelect={(route) => {
            setSelectedRoute(route);
            zoomToRoute(route);
          }}
          onCreateRoute={() => setShowRouteForm(true)}
          onClose={() => setShowRouteList(false)}
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
          onEdit={() => {
            setShowRouteEditForm(true);
          }}
        />
      )}

      {showRouteEditForm && selectedRoute && (
        <RouteEditForm
          route={selectedRoute}
          pois={pois}
          onUpdateRoute={handleEditRoute}
          onCancel={() => setShowRouteEditForm(false)}
        />
      )}

      {showWelcomeBox && (
        <WelcomeBox
          onClose={() => {
            setShowWelcomeBox(false);
            // Save to session storage to remember that the welcome box has been closed
            sessionStorage.setItem("welcomeBoxClosed", "true");
          }}
        />
      )}

      <LayerFilterProvider>
        {showLayerManager && (
          <LayerManager
            members={members}
            onClose={() => setShowLayerManager(false)}
          />
        )}
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={[47.37013, 8.54427]}
          zoom={13}
          zoomControl={false}
          ref={mapRef}
        >
          <MapClickHandler />
          <MapLayersControl
            initialBasemapType={initialBasemapType.current}
            pois={pois}
            routes={routes}
            setSelectedPoiId={setSelectedPoiId}
            setSelectedRoute={setSelectedRoute}
            zoomToPoi={zoomToPoi}
            zoomToRoute={zoomToRoute}
            boundingBox={boundingBox}
          />
        </MapContainer>
      </LayerFilterProvider>
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
