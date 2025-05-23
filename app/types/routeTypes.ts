import type { LineString } from "geojson";

export enum TravelMode {
    DRIVING_CAR = "Car Drive",
    CYCLING_REGULAR = "Cycling",
    FOOT_WALKING = "Walk by foot"
}

export enum RouteAcceptanceStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED"
}

export interface Route {
    routeId?: number;  // Added routeId property
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
