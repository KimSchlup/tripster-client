import type { LineString } from "geojson";

export enum TravelMode {
    DRIVING_CAR = "Car Drive",
    CYCLING_REGULAR = "Cycling",
    FOOT_WALKING = "Walk by foot"
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
