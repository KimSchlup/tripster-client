"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LatLngBounds, LatLngTuple, LeafletMouseEvent } from "leaflet";
import type { GeoJSON } from "geojson";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Rectangle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Rectangle),
  { ssr: false }
);

// Import useMapEvents directly in the component where it's used

interface BoundingBoxSelectorProps {
  initialBoundingBox?: GeoJSON;
  onBoundingBoxChange: (boundingBox: GeoJSON) => void;
  onClose: () => void;
}

export default function BoundingBoxSelector({
  initialBoundingBox,
  onBoundingBoxChange,
  onClose,
}: BoundingBoxSelectorProps) {
  // State for the bounding box
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [startPoint, setStartPoint] = useState<LatLngTuple | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Convert initial GeoJSON to bounds if provided
  useEffect(() => {
    if (
      initialBoundingBox &&
      initialBoundingBox.type === "Polygon" &&
      mapReady
    ) {
      try {
        // Convert GeoJSON polygon to Leaflet bounds
        const coordinates = initialBoundingBox.coordinates[0];

        // Find min/max coordinates to create bounds
        let minLat = 90,
          maxLat = -90,
          minLng = 180,
          maxLng = -180;

        for (const [lng, lat] of coordinates) {
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        }

        const newBounds = new LatLngBounds([minLat, minLng], [maxLat, maxLng]);

        setBounds(newBounds);
      } catch (error) {
        console.error("Error converting GeoJSON to bounds:", error);
      }
    }
  }, [initialBoundingBox, mapReady]);

  // Map event handler component
  const MapEventHandler = dynamic(
    () =>
      import("react-leaflet").then((mod) => {
        const { useMapEvents } = mod;

        return function MapEvents() {
          useMapEvents({
            load: () => {
              setMapReady(true);
            },
            mousedown: (e: LeafletMouseEvent) => {
              if (!isDrawing) {
                setStartPoint([e.latlng.lat, e.latlng.lng]);
                setIsDrawing(true);
              }
            },
            mousemove: (e: LeafletMouseEvent) => {
              if (isDrawing && startPoint) {
                // Update rectangle as user drags
                const newBounds = new LatLngBounds(
                  [startPoint[0], startPoint[1]],
                  [e.latlng.lat, e.latlng.lng]
                );
                setBounds(newBounds);
              }
            },
            mouseup: (e: LeafletMouseEvent) => {
              if (isDrawing && startPoint) {
                // Finalize the rectangle
                const newBounds = new LatLngBounds(
                  [startPoint[0], startPoint[1]],
                  [e.latlng.lat, e.latlng.lng]
                );
                setBounds(newBounds);
                setIsDrawing(false);

                // Convert bounds to GeoJSON
                const boundingBoxGeoJSON = {
                  type: "Polygon",
                  coordinates: [
                    [
                      [newBounds.getWest(), newBounds.getSouth()],
                      [newBounds.getEast(), newBounds.getSouth()],
                      [newBounds.getEast(), newBounds.getNorth()],
                      [newBounds.getWest(), newBounds.getNorth()],
                      [newBounds.getWest(), newBounds.getSouth()],
                    ],
                  ],
                } as GeoJSON;

                onBoundingBoxChange(boundingBoxGeoJSON);
              }
            },
          });

          useEffect(() => {
            setMapReady(true);
          }, []);

          return null;
        };
      }),
    { ssr: false }
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "80%",
          height: "80%",
          backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            color: "black",
            fontSize: 24,
            fontFamily: "Manrope",
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          Select Geographic Boundaries
        </h2>
        <p
          style={{
            color: "black",
            fontSize: 16,
            marginBottom: 20,
          }}
        >
          Click and drag on the map to define the area where POIs can be
          created.
        </p>

        <div style={{ flex: 1, position: "relative" }}>
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[47.37013, 8.54427]}
            zoom={13}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEventHandler />
            {bounds && (
              <Rectangle
                bounds={bounds}
                pathOptions={{ color: "blue", weight: 2, fillOpacity: 0.2 }}
              />
            )}
          </MapContainer>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#E74C3C",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (bounds) {
                // Final confirmation
                const boundingBoxGeoJSON = {
                  type: "Polygon",
                  coordinates: [
                    [
                      [bounds.getWest(), bounds.getSouth()],
                      [bounds.getEast(), bounds.getSouth()],
                      [bounds.getEast(), bounds.getNorth()],
                      [bounds.getWest(), bounds.getNorth()],
                      [bounds.getWest(), bounds.getSouth()],
                    ],
                  ],
                } as GeoJSON;

                onBoundingBoxChange(boundingBoxGeoJSON);
                onClose();
              }
            }}
            disabled={!bounds}
            style={{
              padding: "10px 20px",
              backgroundColor: bounds ? "#007bff" : "#cccccc",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: bounds ? "pointer" : "not-allowed",
              fontWeight: "bold",
            }}
          >
            Save Boundaries
          </button>
        </div>
      </div>
    </div>
  );
}
