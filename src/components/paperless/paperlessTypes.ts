export type PaperlessAssetType = "pdf" | "image" | "doc" | "video" | "audio" | "archive" | "other";

export type PaperlessAccessLevel = "private" | "family" | "workspace" | "public";

export interface PaperlessSubService {
  id: string;
  name: string;
  count?: number;
  iconName?: string;
  description?: string;
}

export interface PaperlessMainCategory {
  id: string;
  name: string;
  iconName: string;
  color: string;
  badgeColor: string;
  totalAssets: number;
  subServices: PaperlessSubService[];
}

export interface PaperlessAsset {
  id: string;
  name: string;
  fileName: string;
  fileSize: string; // e.g. "2.4 MB"
  fileSizeBytes: number;
  fileType: PaperlessAssetType;
  category: string; // matches Category ID or Name
  subService: string; // matches SubService ID or Name
  status: "verified" | "pending" | "rejected" | "encrypted";
  uploadedBy: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  uploadDate: string; // e.g. "Today • 2m ago" or "2026-08-22"
  uploadTimestamp: number;
  isFavorite: boolean;
  tags: string[];
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  qrCodeData?: string;
  accessLevel: PaperlessAccessLevel;
  sharedWith: {
    userId: string;
    name: string;
    email: string;
    role: "view" | "edit" | "admin";
  }[];
  activityLog: {
    id: string;
    action: string;
    performedBy: string;
    timestamp: string;
  }[];
}

export interface PaperlessUserContact {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  department?: string;
}

export interface PaperlessVerificationRequest {
  id: string;
  assetId: string;
  documentName: string;
  category: "payment_receipts" | "identity_documents" | "business_documents" | "other_requests";
  submittedBy: string;
  submitterEmail: string;
  date: string;
  amount?: string;
  status: "pending" | "approved" | "rejected";
  proofUrl: string;
  notes?: string;
}

export interface PaperlessFilterState {
  searchQuery: string;
  category: string; // "all" or specific category ID
  subService: string; // "all" or specific sub-service
  assetType: "all" | PaperlessAssetType;
  uploadedBy: string; // "all" or user ID
  dateRange: {
    fromDate?: string;
    toDate?: string;
  };
  status: "all" | "verified" | "pending" | "favorite";
  sortBy: "newest" | "oldest" | "name_asc" | "name_desc" | "size_desc";
}
