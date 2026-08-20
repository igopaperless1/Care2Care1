export type VehicleType = 'Car' | 'Motorcycle' | 'Van' | 'Bus' | 'Truck' | 'Scooter' | 'Other';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
export type OwnershipType = 'Personal' | 'Commercial' | 'Company' | 'Leased';

export interface VehiclePhoto {
  id: string;
  url: string;
  isPrimary?: boolean;
}

export interface DetailedVehicle {
  id: string;
  name: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  chassisNumber?: string;
  photos: string[];
  ownershipType: OwnershipType;
  purchaseDate: string;
  purchasePrice: number;
  currency: string;
  currentEstimatedValue: number;
  distanceUnit: 'km' | 'miles';
  odometer: number;
  fuelType: FuelType;
  notes?: string;
  isActive: boolean;
  
  // Quick status fields
  nextServiceDueKm?: number;
  nextServiceDueDate?: string;
  nextServiceDaysLeft?: number;
  insuranceExpiryDate?: string;
  insuranceDaysLeft?: number;
  taxRenewalDate?: string;
  taxDaysLeft?: number;
  status: 'Good' | 'Attention' | 'Overdue';
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  provider: string;
  cost: number;
  currency: string;
  serviceTags: string[];
  notes: string;
  isUpcoming?: boolean;
}

export interface VehicleExpense {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  type: 'Fuel' | 'Wash' | 'Parking' | 'Toll' | 'Maintenance' | 'Insurance' | 'Tax' | 'Fine' | 'Other';
  amount: number;
  currency: string;
  description: string;
  receiptUrl?: string;
  aiScanned?: boolean;
}

export interface InsurancePolicy {
  id: string;
  vehicleId: string;
  policyType: 'Comprehensive (1st Party)' | '3rd Party (Liability)' | 'Tax Token' | 'Blue Book' | 'Zero Dep';
  provider: string;
  policyNumber: string;
  startDate: string;
  expiryDate: string;
  premium: number;
  currency: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  daysLeft: number;
  documentUrl?: string;
}

export interface ParkingLocationData {
  vehicleId: string;
  savedAt: string;
  address: string;
  latitude: number;
  longitude: number;
  safetyAlertEnabled: boolean;
  notes?: string;
}

export interface FleetOverviewStats {
  totalVehicles: number;
  totalDistanceKm: number;
  totalExpenses: number;
  totalFuelCost: number;
  statusBreakdown: {
    good: number;
    attention: number;
    overdue: number;
  };
  alerts: {
    id: string;
    type: 'insurance' | 'service' | 'maintenance' | 'tax';
    message: string;
    severity: 'warning' | 'danger' | 'info';
  }[];
}
