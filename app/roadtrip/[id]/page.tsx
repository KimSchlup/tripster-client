"use client";

import dynamic from "next/dynamic";
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
import "leaflet/dist/leaflet.css";

export default function RoadtripPage() {
    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                style={{ height: "100%", width: "100%" }}
                center={[48.8566, 2.3522]}
                zoom={5}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}
