import type { LineString } from "geojson";

export enum TravelMode {
    DRIVING_CAR = "DRIVING_CAR",
    CYCLING_REGULAR = "CYCLING_REGULAR",
    FOOT_WALKING = "FOOT_WALKING",
    PUBLIC_TRANSPORT = "PUBLIC_TRANSPORT"
}

export enum RouteAcceptanceStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface Route {
    startId: number;
    endId: number;
    route: LineString;
    distance: number;
    travelTime: number;
    travelMode: TravelMode;
    status: RouteAcceptanceStatus;
}

export interface RouteCreateRequest {
    startId: number;
    endId: number;
    travelMode: TravelMode;
}
