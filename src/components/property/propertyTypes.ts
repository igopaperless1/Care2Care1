export type PropertyType =
  | 'Apartment / Condo'
  | 'Residential House'
  | 'Commercial Office / Space'
  | 'Villa / Bungalow'
  | 'Agricultural Land'
  | 'Vacant Plot'
  | 'Townhouse'
  | 'Warehouse';

export type PropertyStatus = 'Owner-Occupied' | 'Rented Out' | 'Vacant' | 'Under Renovation' | 'Listed For Sale';
export type OwnershipType = 'Self-Owned' | 'Joint Ownership' | 'Family Trust' | 'Leasehold';

export interface PropertyItem {
  id: string;
  name: string;
  type: PropertyType;
  status: PropertyStatus;
  ownershipType: OwnershipType;
  address: string;
  city: string;
  state?: string;
  country: string;
  pincode?: string;
  landRegistryNumber?: string;
  
  // Dimensions & Specs
  areaTotal: number;
  areaUnit: 'sq ft' | 'sq m' | 'Ropani' | 'Bigha' | 'Acres';
  landArea?: number;
  builtUpArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  floorNumber?: number;
  totalFloors?: number;
  
  // Valuation & Financials
  purchaseDate?: string;
  purchasePrice?: number;
  currentEstimatedValue: number;
  currency: string;
  monthlyRent: number;
  securityDeposit: number;
  occupancyRate: number; // 0 to 100%
  nextRentDueDate: string;
  annualMaintenanceCost: number;
  
  // Media & Legal
  photos: string[];
  documentsCount: number;
  propertyTax: number;
  taxDueDate?: string;
  taxStatus?: 'Paid' | 'Due Soon' | 'Overdue';
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
  
  notes?: string;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
}

export type TicketCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'HVAC'
  | 'Painting'
  | 'Carpentry'
  | 'Appliance Repair'
  | 'Roofing'
  | 'General Maintenance'
  | 'Cleaning'
  | 'Security';

export type TicketStatus = 'Reported' | 'Assigned' | 'In Progress' | 'Completed';

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string; // e.g. #TKT-0012
  propertyId: string;
  propertyName: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: TicketStatus;
  reportedDate: string;
  reportedTime?: string;
  reportedBy: string;
  
  // Contractor info
  assignedContractorId?: string;
  assignedContractorName?: string;
  assignedContractorContact?: string;
  assignedContractorAvatar?: string;
  assignedDate?: string;
  
  inProgressDate?: string;
  completedDate?: string;
  
  estimatedCost: number;
  finalCost?: number;
  currency: string;
  
  beforePhotos: string[];
  afterPhotos: string[];
  
  workflowSteps: Array<{
    status: TicketStatus;
    label: string;
    timestamp: string;
    note: string;
    actor: string;
    completed: boolean;
  }>;
}

export interface TenantInfo {
  id: string;
  propertyId: string;
  propertyName: string;
  fullName: string;
  phone: string;
  email: string;
  avatar?: string;
  occupation: string;
  emergencyContact: string;
  moveInDate: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  securityDeposit: number;
  rentStatus: 'Paid' | 'Due Soon' | 'Overdue';
  activeAgreementFile?: string;
  notes?: string;
}

export interface RentPaymentEntry {
  id: string;
  propertyId: string;
  propertyName: string;
  tenantName: string;
  month: string;
  year: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  paymentMethod: 'eSewa' | 'Khalti' | 'Bank Transfer' | 'Cash' | 'Cheque';
  status: 'Paid' | 'Pending' | 'Overdue';
  receiptUrl?: string;
}

export interface VendorContact {
  id: string;
  name: string;
  contactPerson: string;
  category: TicketCategory | 'Landscaping' | 'Solar' | 'Internet / IT';
  phone: string;
  email?: string;
  licenseNumber: string;
  rating: number;
  reviewsCount: number;
  avatar: string;
  isPreferred?: boolean;
}

export interface PropertyDocument {
  id: string;
  propertyId: string;
  propertyName: string;
  title: string;
  type: 'Lease' | 'Deed' | 'Insurance' | 'Utility Bill' | 'Invoice' | 'Tax Receipt' | 'Blueprint';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  fileUrl: string;
}

export interface UtilityRecord {
  id: string;
  propertyId: string;
  month: string;
  electricityCost: number;
  electricityUnits: number; // kWh
  waterCost: number;
  waterVolume: number; // Liters
  gasCost: number;
  gasUnits: number; // m3
  internetCost: number;
  internetSpeed: string; // Mbps
  wasteManagementCost: number;
  totalCost: number;
}
