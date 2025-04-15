import type { Point } from "geojson";

export interface PointOfInterest {
    poiId: number;
    name: string;
    coordinate: Point;
    description: string;
    category: PoiCategory;
    priority: PoiPriority;
    creatorId: number;
    status: PoiAcceptanceStatus;
    upvotes: number; // temporary solution, not sure if a list of user_ids is needed here...
    downvotes: number;
    eligibleVoteCount: number;
}

export enum PoiCategory {
    SIGHTSEEING = "SIGHTSEEING",
    FOOD = "FOOD",
    ACCOMMODATION = "ACCOMMODATION",
    OTHER = "OTHER"
}

export enum PoiPriority {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    OPTIONAL = "OPTIONAL"
}

export enum PoiAcceptanceStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
