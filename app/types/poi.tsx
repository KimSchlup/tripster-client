import type { Point } from "geojson";

export interface PointOfInterest {
    poiId: number;
    name: string;
    coordinate: Point;
    description: string;
    category: PoiCategory;
    priority: PoiPriority;
    creatorId: number;
    creatorUserName?: string; // optional, bis du es vom Backend bekommst
    status: PoiAcceptanceStatus;
    upvotes: number; // temporary solution, not sure if a list of user_ids is needed here...
    downvotes: number;
    eligibleVoteCount: number;
}

export enum PoiCategory {
    SIGHTSEEING = "SIGHTSEEING",
    FOOD = "FOOD",
    ACCOMMODATION = "ACCOMODATION",
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
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED"
}

export interface Comment {
    commentId: number;
    authorId: number;
    authorUserName?: string; // optional, bis du es vom Backend bekommst
    comment: string;
    creationDate: string; // ISO format, z.B. "2025-04-24"
}