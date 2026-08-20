export type PasswordTab =
  | "dashboard"
  | "all_items"
  | "item_details"
  | "generator"
  | "security_checkup"
  | "breach_monitor"
  | "folders"
  | "secure_notes"
  | "sharing_center"
  | "activity_log"
  | "settings"
  | "profile";

export interface VaultItem {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  category: "Work" | "Social Media" | "Banking" | "Shopping" | "Personal" | "Utilities" | string;
  folder: string;
  notes?: string;
  strength?: "very_weak" | "weak" | "fair" | "strong" | "very_strong";
  isFavorite: boolean;
  isCompromised?: boolean;
  isReused?: boolean;
  lastModified: string;
  createdAt: string;
  brandColor?: string;
  iconName?: string;
  totpSecret?: string;
}

export interface SecureNoteItem {
  id: string;
  title: string;
  preview?: string;
  content: string;
  category: string;
  folder?: string;
  isFavorite?: boolean;
  lastModified?: string;
  lastUpdated?: string;
  date?: string;
}

export interface SharedVaultItem {
  id: string;
  title: string;
  sharedWith: string | string[];
  sharedBy?: string;
  accessLevel: "read" | "edit" | "admin" | "Read Only" | "Can Edit" | "Full Access";
  sharedDate: string;
  expiresIn?: string;
  icon?: string;
  type?: "sent" | "received";
}

export interface PasswordActivityLogItem {
  id: string;
  action: string;
  targetItem?: string;
  timestamp: string;
  device?: string;
  type?: "view" | "copy" | "edit" | "create" | "login" | "export" | "delete";
}

export type ActivityAuditItem = PasswordActivityLogItem;

export interface PasswordFolder {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  color?: string;
  sizeMb?: string;
}
