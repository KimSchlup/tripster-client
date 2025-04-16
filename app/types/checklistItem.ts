export interface ChecklistItem {
  checklistItemId: number;
  name: string;
  isCompleted: boolean;
  assignedUser: string | null;
  priority: ChecklistItemPriority;
  category: ChecklistItemCategory;
  roadtripId: number;
}

export enum ChecklistItemPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  OPTIONAL = "OPTIONAL"
}

export enum ChecklistItemCategory {
  PREPARATION = "PREPARATION",
  PACKING = "PACKING",
  ACCOMMODATION = "ACCOMMODATION",
  TRANSPORTATION = "TRANSPORTATION",
  OTHER = "OTHER"
}
