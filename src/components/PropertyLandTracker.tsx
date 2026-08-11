import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Home, Plus, Search, RefreshCw, Edit, Trash2, X, Phone, Mail,
  Calendar, DollarSign, Wrench, FileText, TrendingUp, Bell, CheckCircle,
  AlertTriangle, Shield, MapPin, UserCheck, Layers, PieChart as PieChartIcon,
  Download, Upload, Settings, Sparkles, Clock, Check, Eye, ChevronRight,
  Filter, Building, Tag, Camera, Sliders
} from 'lucide-react';
import { ServiceSetupModal } from './ServiceSetupModal';

// ============================================================
// DATA INTERFACES
// ============================================================

export interface Property {
  id: string;
  name: string;
  type: string; // House, Apartment, Commercial Building, Agricultural Land, Vacant Land, Industrial, Townhouse, Villa
  ownershipType: string; // Self-owned, Joint, Leasehold
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  areaTotal: number;
  areaUnit: string; // sq ft, sq m, acres, bigha
  landArea: number;
  builtUpArea: number;
  rooms?: number;
  bathrooms?: number;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  lastValuationDate: string;
  registrationNumber: string;
  deedDocument: string;
  propertyTax: number;
  insuranceProvider: string;
  insurancePolicy: string;
  insuranceExpiry: string;
  notes: string;
  photos: string[];
  documents: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  propertyId: string;
  fullName: string;
  phone: string;
  email: string;
  occupation: string;
  emergencyContact: string;
  moveInDate: string;
  moveOutDate: string;
  monthlyRent: number;
  securityDeposit: number;
  leaseStart: string;
  leaseEnd: string;
  leaseDocument: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RentalPayment {
  id: string;
  propertyId: string;
  tenantId: string;
  month: string; // MM-YYYY or Month Year
  year: number;
  amount: number;
  dueDate: string;
  paidDate: string;
  paymentMethod: string; // Cash, Bank Transfer, Cheque, Online
  transactionId: string;
  isPaid: boolean;
  lateFee: number;
  notes: string;
  receiptPhoto: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceLog {
  id: string;
  propertyId: string;
  date: string;
  type: string; // Repair, Renovation, Cleaning, Plumbing, Electrical, Painting
  description: string;
  cost: number;
  contractor: string;
  contractorPhone: string;
  status: string; // Pending, In Progress, Completed
  scheduledDate: string;
  completedDate: string;
  beforePhotos: string[];
  afterPhotos: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyExpense {
  id: string;
  propertyId: string;
  date: string;
  category: string; // Tax, Insurance, Maintenance, Utility, Legal/HOA
  amount: number;
  description: string;
  paymentMethod: string;
  receiptPhoto: string;
  recurring: boolean;
  recurrencePattern: string; // Monthly, Yearly
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyReminder {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  dueDate: string;
  type: string; // Tax, Insurance, Maintenance, Rental
  remindBefore: number;
  isActive: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyValuation {
  id: string;
  propertyId: string;
  valuationDate: string;
  value: number;
  valuationBy: string;
  valuationCompany: string;
  notes: string;
  document: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// DEFAULT OBJECT GENERATORS
// ============================================================

const emptyProperty = (): Property => ({
  id: '',
  name: '',
  type: 'House',
  ownershipType: 'Self-owned',
  address: '',
  city: 'Kathmandu',
  state: 'Bagmati',
  country: 'Nepal',
  pincode: '44600',
  areaTotal: 1500,
  areaUnit: 'sq ft',
  landArea: 1500,
  builtUpArea: 1200,
  rooms: 3,
  bathrooms: 2,
  purchaseDate: '2020-01-15',
  purchasePrice: 15000000,
  currentValue: 18500000,
  lastValuationDate: new Date().toISOString().split('T')[0],
  registrationNumber: 'REG-2020-8841',
  deedDocument: '',
  propertyTax: 25000,
  insuranceProvider: 'Siddhartha Insurance',
  insurancePolicy: 'POL-992381',
  insuranceExpiry: '2026-12-31',
  notes: '',
  photos: [],
  documents: [],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const emptyTenant = (): Tenant => ({
  id: '',
  propertyId: '',
  fullName: '',
  phone: '',
  email: '',
  occupation: '',
  emergencyContact: '',
  moveInDate: new Date().toISOString().split('T')[0],
  moveOutDate: '',
  monthlyRent: 25000,
  securityDeposit: 50000,
  leaseStart: new Date().toISOString().split('T')[0],
  leaseEnd: '2027-07-31',
  leaseDocument: '',
  notes: '',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const emptyRentalPayment = (): RentalPayment => ({
  id: '',
  propertyId: '',
  tenantId: '',
  month: 'August 2026',
  year: 2026,
  amount: 25000,
  dueDate: new Date().toISOString().split('T')[0],
  paidDate: new Date().toISOString().split('T')[0],
  paymentMethod: 'Bank Transfer',
  transactionId: '',
  isPaid: true,
  lateFee: 0,
  notes: '',
  receiptPhoto: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const emptyMaintenanceLog = (): MaintenanceLog => ({
  id: '',
  propertyId: '',
  date: new Date().toISOString().split('T')[0],
  type: 'Repair',
  description: '',
  cost: 5000,
  contractor: '',
  contractorPhone: '',
  status: 'Pending',
  scheduledDate: new Date().toISOString().split('T')[0],
  completedDate: '',
  beforePhotos: [],
  afterPhotos: [],
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const emptyExpense = (): PropertyExpense => ({
  id: '',
  propertyId: '',
  date: new Date().toISOString().split('T')[0],
  category: 'Tax',
  amount: 10000,
  description: '',
  paymentMethod: 'Bank Transfer',
  receiptPhoto: '',
  recurring: false,
  recurrencePattern: 'Yearly',
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const emptyReminder = (): PropertyReminder => ({
  id: '',
  propertyId: '',
  title: '',
  description: '',
  dueDate: new Date().toISOString().split('T')[0],
  type: 'Tax',
  remindBefore: 7,
  isActive: true,
  isCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const emptyValuation = (): PropertyValuation => ({
  id: '',
  propertyId: '',
  valuationDate: new Date().toISOString().split('T')[0],
  value: 20000000,
  valuationBy: 'Certified Appraiser',
  valuationCompany: 'Himalayan Real Estate Assessors',
  notes: '',
  document: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// ============================================================
// SAFE HELPER UTILITIES
// ============================================================

const safeStr = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

const safeNum = (value: any, fallback: number = 0): number => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

const safeDate = (value: any): string => {
  if (!value) return '';
  return String(value);
};

const safeFilter = (items: Property[], query: string, typeFilter: string): Property[] => {
  if (!items || !Array.isArray(items)) return [];
  
  let result = items;

  if (typeFilter && typeFilter !== 'All') {
    result = result.filter(item => safeStr(item.type).toLowerCase() === typeFilter.toLowerCase());
  }

  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    result = result.filter(item => {
      const name = safeStr(item.name).toLowerCase();
      const addr = safeStr(item.address).toLowerCase();
      const city = safeStr(item.city).toLowerCase();
      const reg = safeStr(item.registrationNumber).toLowerCase();
      const type = safeStr(item.type).toLowerCase();
      return name.includes(q) || addr.includes(q) || city.includes(q) || reg.includes(q) || type.includes(q);
    });
  }

  return result;
};

// ============================================================
// DEMO INITIAL DATA
// ============================================================

const DEMO_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'Kathmandu Residency & Apartment',
    type: 'Apartment',
    ownershipType: 'Self-owned',
    address: 'Lazimpat Ward No. 3',
    city: 'Kathmandu',
    state: 'Bagmati',
    country: 'Nepal',
    pincode: '44600',
    areaTotal: 1850,
    areaUnit: 'sq ft',
    landArea: 0,
    builtUpArea: 1850,
    rooms: 4,
    bathrooms: 3,
    purchaseDate: '2021-03-10',
    purchasePrice: 22000000,
    currentValue: 28000000,
    lastValuationDate: '2026-01-15',
    registrationNumber: 'KTM-DEED-98214',
    deedDocument: 'Deed_Lazimpat_2021.pdf',
    propertyTax: 35000,
    insuranceProvider: 'Neco Insurance',
    insurancePolicy: 'POL-NC-88120',
    insuranceExpiry: '2026-12-15',
    notes: 'Premium 3BHK Apartment on 4th floor with dedicated parking space.',
    photos: [],
    documents: ['Deed_Lazimpat.pdf', 'Tax_Receipt_2025.pdf'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prop-2',
    name: 'Pokhara Agricultural Farm Plot',
    type: 'Agricultural Land',
    ownershipType: 'Self-owned',
    address: 'Hemja Plot No. 42',
    city: 'Pokhara',
    state: 'Gandaki',
    country: 'Nepal',
    pincode: '33700',
    areaTotal: 8,
    areaUnit: 'Ropani',
    landArea: 8,
    builtUpArea: 400,
    rooms: 1,
    bathrooms: 1,
    purchaseDate: '2019-11-20',
    purchasePrice: 12000000,
    currentValue: 19500000,
    lastValuationDate: '2025-11-01',
    registrationNumber: 'PKR-LAND-44120',
    deedDocument: 'Land_Cert_Hemja.pdf',
    propertyTax: 12000,
    insuranceProvider: 'Prabhu Insurance',
    insurancePolicy: 'POL-PR-11029',
    insuranceExpiry: '2027-02-28',
    notes: 'Fertile agricultural plot suitable for organic farming and agro-tourism.',
    photos: [],
    documents: ['Land_Certificate_Hemja.pdf', 'Cadastral_Map_42.pdf'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prop-3',
    name: 'Lalitpur Commercial Complex',
    type: 'Commercial Building',
    ownershipType: 'Self-owned',
    address: 'Jawalakhel Main Road',
    city: 'Lalitpur',
    state: 'Bagmati',
    country: 'Nepal',
    pincode: '44700',
    areaTotal: 3200,
    areaUnit: 'sq ft',
    landArea: 1200,
    builtUpArea: 3200,
    rooms: 6,
    bathrooms: 4,
    purchaseDate: '2018-05-12',
    purchasePrice: 35000000,
    currentValue: 48000000,
    lastValuationDate: '2026-02-10',
    registrationNumber: 'LAL-COMM-3321',
    deedDocument: 'Deed_Jawalakhel.pdf',
    propertyTax: 65000,
    insuranceProvider: 'Siddhartha Insurance',
    insurancePolicy: 'POL-SI-77312',
    insuranceExpiry: '2026-10-30',
    notes: 'Ground floor shop + 2 floors office space. Prime rental yield location.',
    photos: [],
    documents: ['Commercial_Deed_Lalitpur.pdf', 'Building_Permit_LAL.pdf'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEMO_TENANTS: Tenant[] = [
  {
    id: 'ten-1',
    propertyId: 'prop-1',
    fullName: 'Rohan Shrestha',
    phone: '+977 9851012345',
    email: 'rohan.shrestha@example.com',
    occupation: 'Software Engineer',
    emergencyContact: '+977 9841239876',
    moveInDate: '2024-02-01',
    moveOutDate: '',
    monthlyRent: 35000,
    securityDeposit: 70000,
    leaseStart: '2024-02-01',
    leaseEnd: '2027-01-31',
    leaseDocument: 'Lease_Rohan_2024.pdf',
    notes: 'Prompt payer, quiet family tenant.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ten-2',
    propertyId: 'prop-3',
    fullName: 'Himalayan Tech Solutions Pvt Ltd',
    phone: '+977 01-5521098',
    email: 'info@himalayantech.com',
    occupation: 'Corporate Office',
    emergencyContact: '+977 9801122334',
    moveInDate: '2023-06-15',
    moveOutDate: '',
    monthlyRent: 85000,
    securityDeposit: 255000,
    leaseStart: '2023-06-15',
    leaseEnd: '2028-06-14',
    leaseDocument: 'Commercial_Lease_HimalayanTech.pdf',
    notes: '5-year corporate lease agreement with 10% annual escalation.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEMO_RENTALS: RentalPayment[] = [
  {
    id: 'rent-1',
    propertyId: 'prop-1',
    tenantId: 'ten-1',
    month: 'July 2026',
    year: 2026,
    amount: 35000,
    dueDate: '2026-07-05',
    paidDate: '2026-07-03',
    paymentMethod: 'Bank Transfer',
    transactionId: 'NIBL-TXN-881293',
    isPaid: true,
    lateFee: 0,
    notes: 'Received via eSewa / Bank Transfer.',
    receiptPhoto: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rent-2',
    propertyId: 'prop-3',
    tenantId: 'ten-2',
    month: 'July 2026',
    year: 2026,
    amount: 85000,
    dueDate: '2026-07-10',
    paidDate: '2026-07-08',
    paymentMethod: 'Bank Transfer',
    transactionId: 'NABIL-COMM-00912',
    isPaid: true,
    lateFee: 0,
    notes: 'Corporate lease auto-credit.',
    receiptPhoto: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEMO_MAINTENANCE: MaintenanceLog[] = [
  {
    id: 'maint-1',
    propertyId: 'prop-1',
    date: '2026-05-10',
    type: 'Plumbing Repair',
    description: 'Bathroom faucet replacement and main valve overhaul',
    cost: 4500,
    contractor: 'Shree Krishna Plumbing Works',
    contractorPhone: '+977 9841100223',
    status: 'Completed',
    scheduledDate: '2026-05-10',
    completedDate: '2026-05-10',
    beforePhotos: [],
    afterPhotos: [],
    notes: 'Fixed leak under sink basin.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'maint-2',
    propertyId: 'prop-3',
    date: '2026-06-20',
    type: 'Exterior Painting',
    description: 'Facade waterproofing touch-up & lobby painting',
    cost: 42000,
    contractor: 'Asian Paints Authorized Decorators',
    contractorPhone: '+977 9851199887',
    status: 'Completed',
    scheduledDate: '2026-06-15',
    completedDate: '2026-06-22',
    beforePhotos: [],
    afterPhotos: [],
    notes: 'Annual building facade maintenance.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEMO_EXPENSES: PropertyExpense[] = [
  {
    id: 'exp-1',
    propertyId: 'prop-1',
    date: '2026-01-10',
    category: 'Property Tax',
    amount: 35000,
    description: 'Municipality Property Tax FY 2082/83',
    paymentMethod: 'Online Bank',
    receiptPhoto: '',
    recurring: true,
    recurrencePattern: 'Yearly',
    notes: 'Ward Office receipt archived.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'exp-2',
    propertyId: 'prop-3',
    date: '2026-03-15',
    category: 'Insurance',
    amount: 28000,
    description: 'Annual Commercial Building Fire & Earthquake Cover',
    paymentMethod: 'Cheque',
    receiptPhoto: '',
    recurring: true,
    recurrencePattern: 'Yearly',
    notes: 'Siddhartha Insurance Policy renewed.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEMO_REMINDERS: PropertyReminder[] = [
  {
    id: 'rem-1',
    propertyId: 'prop-1',
    title: 'Property Tax Due - Kathmandu Ward 3',
    description: 'Annual municipal house tax clearance before fiscal year end.',
    dueDate: '2026-09-15',
    type: 'Tax',
    remindBefore: 15,
    isActive: true,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rem-2',
    propertyId: 'prop-3',
    title: 'Insurance Renewal - Jawalakhel Complex',
    description: 'Siddhartha Insurance Commercial policy expiry alert.',
    dueDate: '2026-10-30',
    type: 'Insurance',
    remindBefore: 30,
    isActive: true,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEMO_VALUATIONS: PropertyValuation[] = [
  {
    id: 'val-1',
    propertyId: 'prop-1',
    valuationDate: '2026-01-15',
    value: 28000000,
    valuationBy: 'Er. Suresh Pokharel',
    valuationCompany: 'Kathmandu Valley Property Valuers',
    notes: 'Market rate appreciated due to new road widening and nearby metro planning.',
    document: 'Valuation_Report_2026.pdf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface PropertyLandTrackerProps {
  patient?: any;
}

export const PropertyLandTracker: React.FC<PropertyLandTrackerProps> = () => {
  // ============================================================
  // CORE STATE
  // ============================================================
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [rentals, setRentals] = useState<RentalPayment[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [expenses, setExpenses] = useState<PropertyExpense[]>([]);
  const [reminders, setReminders] = useState<PropertyReminder[]>([]);
  const [valuations, setValuations] = useState<PropertyValuation[]>([]);

  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [activeProfileTab, setActiveProfileTab] = useState<
    'overview' | 'tenants' | 'rentals' | 'maintenance' | 'expenses' | 'documents' | 'valuation' | 'reminders'
  >('overview');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Visibility States
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showEditProperty, setShowEditProperty] = useState(false);
  const [showPropertyProfile, setShowPropertyProfile] = useState(false);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showAddRental, setShowAddRental] = useState(false);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showAddValuation, setShowAddValuation] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Form Holding States
  const [newProp, setNewProp] = useState<Property>(emptyProperty());
  const [editProp, setEditProp] = useState<Property>(emptyProperty());
  const [newTen, setNewTen] = useState<Tenant>(emptyTenant());
  const [newRent, setNewRent] = useState<RentalPayment>(emptyRentalPayment());
  const [newMaint, setNewMaint] = useState<MaintenanceLog>(emptyMaintenanceLog());
  const [newExp, setNewExp] = useState<PropertyExpense>(emptyExpense());
  const [newRem, setNewRem] = useState<PropertyReminder>(emptyReminder());
  const [newVal, setNewVal] = useState<PropertyValuation>(emptyValuation());
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    defaultCurrency: 'NPR',
    defaultAreaUnit: 'sq ft',
    remindDaysBefore: 15,
    enableTaxAlerts: true,
    enableInsuranceAlerts: true,
    enableRentAlerts: true
  });

  // ============================================================
  // LOAD & SAVE DATA
  // ============================================================
  const loadData = useCallback(() => {
    try {
      setLoading(true);
      const saved = localStorage.getItem('care2care_propertyData');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProperties(Array.isArray(parsed.properties) ? parsed.properties : DEMO_PROPERTIES);
        setTenants(Array.isArray(parsed.tenants) ? parsed.tenants : DEMO_TENANTS);
        setRentals(Array.isArray(parsed.rentals) ? parsed.rentals : DEMO_RENTALS);
        setMaintenanceLogs(Array.isArray(parsed.maintenanceLogs) ? parsed.maintenanceLogs : DEMO_MAINTENANCE);
        setExpenses(Array.isArray(parsed.expenses) ? parsed.expenses : DEMO_EXPENSES);
        setReminders(Array.isArray(parsed.reminders) ? parsed.reminders : DEMO_REMINDERS);
        setValuations(Array.isArray(parsed.valuations) ? parsed.valuations : DEMO_VALUATIONS);
      } else {
        setProperties(DEMO_PROPERTIES);
        setTenants(DEMO_TENANTS);
        setRentals(DEMO_RENTALS);
        setMaintenanceLogs(DEMO_MAINTENANCE);
        setExpenses(DEMO_EXPENSES);
        setReminders(DEMO_REMINDERS);
        setValuations(DEMO_VALUATIONS);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading Property data:', err);
      setError('Failed to load stored property records. Loaded demo records instead.');
      setProperties(DEMO_PROPERTIES);
      setTenants(DEMO_TENANTS);
      setRentals(DEMO_RENTALS);
      setMaintenanceLogs(DEMO_MAINTENANCE);
      setExpenses(DEMO_EXPENSES);
      setReminders(DEMO_REMINDERS);
      setValuations(DEMO_VALUATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveData = useCallback(() => {
    try {
      const payload = {
        properties,
        tenants,
        rentals,
        maintenanceLogs,
        expenses,
        reminders,
        valuations
      };
      localStorage.setItem('care2care_propertyData', JSON.stringify(payload));
    } catch (err) {
      console.error('Error saving Property data:', err);
    }
  }, [properties, tenants, rentals, maintenanceLogs, expenses, reminders, valuations]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!loading) {
      saveData();
    }
  }, [properties, tenants, rentals, maintenanceLogs, expenses, reminders, valuations, loading, saveData]);

  // Selected Property Object
  const selectedProperty = useMemo(() => {
    if (!selectedPropId) return null;
    return properties.find(p => p.id === selectedPropId) || null;
  }, [properties, selectedPropId]);

  // Filtered Properties for Main Grid
  const filteredProperties = useMemo(() => {
    return safeFilter(properties, searchQuery, typeFilter);
  }, [properties, searchQuery, typeFilter]);

  // Aggregate Metrics
  const totalValueSum = useMemo(() => {
    return properties.reduce((acc, p) => acc + safeNum(p.currentValue), 0);
  }, [properties]);

  const totalMonthlyRentSum = useMemo(() => {
    return tenants.filter(t => t.isActive).reduce((acc, t) => acc + safeNum(t.monthlyRent), 0);
  }, [tenants]);

  const activeTenantsCount = useMemo(() => {
    return tenants.filter(t => t.isActive).length;
  }, [tenants]);

  const pendingMaintenanceCount = useMemo(() => {
    return maintenanceLogs.filter(m => m.status === 'Pending' || m.status === 'In Progress').length;
  }, [maintenanceLogs]);

  // Property-Specific Filtered Records
  const propTenants = useMemo(() => {
    if (!selectedPropId) return [];
    return tenants.filter(t => t.propertyId === selectedPropId);
  }, [tenants, selectedPropId]);

  const propRentals = useMemo(() => {
    if (!selectedPropId) return [];
    return rentals.filter(r => r.propertyId === selectedPropId);
  }, [rentals, selectedPropId]);

  const propMaintenance = useMemo(() => {
    if (!selectedPropId) return [];
    return maintenanceLogs.filter(m => m.propertyId === selectedPropId);
  }, [maintenanceLogs, selectedPropId]);

  const propExpenses = useMemo(() => {
    if (!selectedPropId) return [];
    return expenses.filter(e => e.propertyId === selectedPropId);
  }, [expenses, selectedPropId]);

  const propReminders = useMemo(() => {
    if (!selectedPropId) return [];
    return reminders.filter(r => r.propertyId === selectedPropId);
  }, [reminders, selectedPropId]);

  const propValuations = useMemo(() => {
    if (!selectedPropId) return [];
    return valuations.filter(v => v.propertyId === selectedPropId);
  }, [valuations, selectedPropId]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleAddProperty = () => {
    try {
      if (!newProp.name || !newProp.address) {
        setError('Please provide property name and address.');
        return;
      }
      const newId = `prop-${Date.now()}`;
      const created: Property = {
        ...newProp,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProperties(prev => [created, ...prev]);
      setSelectedPropId(newId);
      setShowAddProperty(false);
      setNewProp(emptyProperty());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to create property profile.');
    }
  };

  const handleUpdateProperty = () => {
    try {
      if (!selectedPropId) return;
      setProperties(prev =>
        prev.map(p => (p.id === selectedPropId ? { ...editProp, id: selectedPropId, updatedAt: new Date().toISOString() } : p))
      );
      setShowEditProperty(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to update property details.');
    }
  };

  const handleDeleteProperty = (id: string) => {
    try {
      if (!window.confirm('Are you sure you want to delete this property and all linked records?')) return;
      setProperties(prev => prev.filter(p => p.id !== id));
      setTenants(prev => prev.filter(t => t.propertyId !== id));
      setRentals(prev => prev.filter(r => r.propertyId !== id));
      setMaintenanceLogs(prev => prev.filter(m => m.propertyId !== id));
      setExpenses(prev => prev.filter(e => e.propertyId !== id));
      setReminders(prev => prev.filter(r => r.propertyId !== id));
      setValuations(prev => prev.filter(v => v.propertyId !== id));

      if (selectedPropId === id) {
        setSelectedPropId(null);
        setShowPropertyProfile(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete property.');
    }
  };

  const handleAddTenant = () => {
    try {
      if (!selectedPropId || !newTen.fullName) {
        setError('Please enter tenant full name.');
        return;
      }
      const created: Tenant = {
        ...newTen,
        id: `ten-${Date.now()}`,
        propertyId: selectedPropId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTenants(prev => [created, ...prev]);
      setShowAddTenant(false);
      setNewTen(emptyTenant());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to register tenant.');
    }
  };

  const handleAddRental = () => {
    try {
      if (!selectedPropId) return;
      const created: RentalPayment = {
        ...newRent,
        id: `rent-${Date.now()}`,
        propertyId: selectedPropId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setRentals(prev => [created, ...prev]);
      setShowAddRental(false);
      setNewRent(emptyRentalPayment());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to record rental payment.');
    }
  };

  const handleAddMaintenance = () => {
    try {
      if (!selectedPropId || !newMaint.description) {
        setError('Please enter a description for the maintenance request.');
        return;
      }
      const created: MaintenanceLog = {
        ...newMaint,
        id: `maint-${Date.now()}`,
        propertyId: selectedPropId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMaintenanceLogs(prev => [created, ...prev]);
      setShowAddMaintenance(false);
      setNewMaint(emptyMaintenanceLog());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to log maintenance.');
    }
  };

  const handleAddExpense = () => {
    try {
      if (!selectedPropId || !newExp.amount) {
        setError('Please enter a valid expense amount.');
        return;
      }
      const created: PropertyExpense = {
        ...newExp,
        id: `exp-${Date.now()}`,
        propertyId: selectedPropId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setExpenses(prev => [created, ...prev]);
      setShowAddExpense(false);
      setNewExp(emptyExpense());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to record property expense.');
    }
  };

  const handleAddReminder = () => {
    try {
      if (!selectedPropId || !newRem.title) {
        setError('Please enter reminder title.');
        return;
      }
      const created: PropertyReminder = {
        ...newRem,
        id: `rem-${Date.now()}`,
        propertyId: selectedPropId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setReminders(prev => [created, ...prev]);
      setShowAddReminder(false);
      setNewRem(emptyReminder());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to add reminder.');
    }
  };

  const handleToggleReminderDone = (id: string) => {
    try {
      setReminders(prev => prev.map(r => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddValuation = () => {
    try {
      if (!selectedPropId || !newVal.value) return;
      const created: PropertyValuation = {
        ...newVal,
        id: `val-${Date.now()}`,
        propertyId: selectedPropId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setValuations(prev => [created, ...prev]);
      // Update current value on property as well
      setProperties(prev =>
        prev.map(p => (p.id === selectedPropId ? { ...p, currentValue: newVal.value, lastValuationDate: newVal.valuationDate } : p))
      );
      setShowAddValuation(false);
      setNewVal(emptyValuation());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to log property valuation.');
    }
  };

  // Icon Helper for Property Types
  const getPropertyTypeIcon = (type: string) => {
    const t = safeStr(type).toLowerCase();
    if (t.includes('house') || t.includes('villa')) return <Home className="w-5 h-5" />;
    if (t.includes('apartment')) return <Building className="w-5 h-5" />;
    if (t.includes('commercial') || t.includes('industrial')) return <Building className="w-5 h-5" />;
    if (t.includes('land') || t.includes('agricultural') || t.includes('vacant')) return <Layers className="w-5 h-5" />;
    return <Home className="w-5 h-5" />;
  };

  // ============================================================
  // RENDER MAIN VIEW
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="text-xs font-bold text-slate-600">Loading Property & Land Records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🏠</span>
              <h2 className="text-xl font-black tracking-tight">Property & Land Management</h2>
            </div>
            <p className="text-xs text-emerald-100 max-w-2xl">
              Track residential & commercial real estate, land plots, tenant leases, rental income collections, maintenance logs & legal deeds.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAnalyticsModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <PieChartIcon className="w-4 h-4" /> Portfolio Analytics
            </button>
            <button
              onClick={() => setIsSetupOpen(true)}
              className="px-3 py-2 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Setup Property Options & Features"
            >
              <Sliders className="w-4 h-4 text-amber-300" /> Setup
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setNewProp(emptyProperty());
                setShowAddProperty(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 text-xs font-black hover:bg-emerald-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Property
            </button>
          </div>
        </div>

        {/* METRIC BADGES BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Total Portfolio Value</span>
            <span className="text-base font-black text-white">NPR {totalValueSum.toLocaleString()}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Monthly Rental Income</span>
            <span className="text-base font-black text-emerald-300">NPR {totalMonthlyRentSum.toLocaleString()}/mo</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Active Leased Tenants</span>
            <span className="text-base font-black text-white">{activeTenantsCount} Tenants</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Pending Maintenance</span>
            <span className="text-base font-black text-amber-300">{pendingMaintenanceCount} Requests</span>
          </div>
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-800 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search property name, location, deed #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {['All', 'House', 'Apartment', 'Commercial Building', 'Agricultural Land', 'Vacant Land'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                typeFilter === t ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* PROPERTY GRID */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Home className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-sm font-black text-slate-800">No Properties Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No real estate or land plots match your current search filter. Add your first house, apartment, or land record.
          </p>
          <button
            onClick={() => {
              setNewProp(emptyProperty());
              setShowAddProperty(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map(prop => {
            const propTenantsList = tenants.filter(t => t.propertyId === prop.id && t.isActive);
            const propMonthlyRent = propTenantsList.reduce((acc, t) => acc + safeNum(t.monthlyRent), 0);

            return (
              <div
                key={prop.id}
                onClick={() => {
                  setSelectedPropId(prop.id);
                  setActiveProfileTab('overview');
                  setShowPropertyProfile(true);
                }}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4 group relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black group-hover:scale-105 transition-all">
                        {getPropertyTypeIcon(prop.type)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {prop.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {prop.city}, {prop.state}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {prop.type}
                    </span>
                  </div>

                  {/* Location Details */}
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 line-clamp-2">
                    {prop.address}
                  </p>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Market Value</span>
                      <span className="font-black text-slate-900">NPR {safeNum(prop.currentValue).toLocaleString()}</span>
                    </div>
                    <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">Rental Yield</span>
                      <span className="font-black text-emerald-900">
                        {propMonthlyRent > 0 ? `NPR ${propMonthlyRent.toLocaleString()}/mo` : 'Vacant / Self'}
                      </span>
                    </div>
                  </div>

                  {/* Additional info pills */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" /> {prop.areaTotal} {prop.areaUnit}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" /> {propTenantsList.length} Active Tenant(s)
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-all">
                  <span>Manage Profile & Records</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================
          PROPERTY PROFILE MODAL (FULL 8 TABS VIEW)
          ============================================================ */}
      {showPropertyProfile && selectedProperty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  {getPropertyTypeIcon(selectedProperty.type)}
                </div>
                <div>
                  <h3 className="text-base font-black">{selectedProperty.name}</h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" /> {selectedProperty.address}, {selectedProperty.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditProp(selectedProperty);
                    setShowEditProperty(true);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                  title="Edit Property"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProperty(selectedProperty.id)}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                  title="Delete Property"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowPropertyProfile(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Navigation Tabs (8 Tabs) */}
            <div className="bg-slate-100 border-b border-slate-200 flex items-center gap-1 p-2 overflow-x-auto shrink-0 scrollbar-none">
              {[
                { id: 'overview', label: '📋 Overview' },
                { id: 'tenants', label: `👥 Tenants (${propTenants.length})` },
                { id: 'rentals', label: `💰 Rentals (${propRentals.length})` },
                { id: 'maintenance', label: `🔧 Maintenance (${propMaintenance.length})` },
                { id: 'expenses', label: `💸 Expenses (${propExpenses.length})` },
                { id: 'documents', label: `📄 Documents (${selectedProperty.documents.length})` },
                { id: 'valuation', label: `📊 Valuation (${propValuations.length})` },
                { id: 'reminders', label: `⏰ Reminders (${propReminders.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeProfileTab === tab.id ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 grow">
              {/* TAB 1: OVERVIEW */}
              {activeProfileTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Market Value</span>
                      <span className="text-sm font-black text-slate-900">NPR {selectedProperty.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Purchase Price</span>
                      <span className="text-sm font-black text-slate-800">NPR {selectedProperty.purchasePrice.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Area</span>
                      <span className="text-sm font-black text-slate-800">
                        {selectedProperty.areaTotal} {selectedProperty.areaUnit}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Annual Property Tax</span>
                      <span className="text-sm font-black text-emerald-800">NPR {selectedProperty.propertyTax.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Primary Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                      <h4 className="font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-emerald-600" /> Property Specifications
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400 block">Property Type:</span>
                          <strong className="text-slate-800">{selectedProperty.type}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Ownership:</span>
                          <strong className="text-slate-800">{selectedProperty.ownershipType}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Land Area:</span>
                          <strong className="text-slate-800">
                            {selectedProperty.landArea} {selectedProperty.areaUnit}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Built-up Area:</span>
                          <strong className="text-slate-800">{selectedProperty.builtUpArea} sq ft</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Rooms / Bathrooms:</span>
                          <strong className="text-slate-800">
                            {selectedProperty.rooms || 0} Rooms / {selectedProperty.bathrooms || 0} Baths
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Purchase Date:</span>
                          <strong className="text-slate-800">{selectedProperty.purchaseDate}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                      <h4 className="font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-600" /> Legal & Insurance Cover
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400 block">Deed Registration #:</span>
                          <strong className="text-slate-800">{selectedProperty.registrationNumber}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Deed Document:</span>
                          <strong className="text-emerald-700">{selectedProperty.deedDocument || 'Deed_On_File.pdf'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Insurance Provider:</span>
                          <strong className="text-slate-800">{selectedProperty.insuranceProvider || 'N/A'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Policy #:</span>
                          <strong className="text-slate-800">{selectedProperty.insurancePolicy || 'N/A'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Insurance Expiry:</span>
                          <strong className="text-amber-800 font-bold">{selectedProperty.insuranceExpiry || 'N/A'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedProperty.notes && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-700">Property Notes & Key Instructions:</span>
                      <p className="text-slate-600 leading-relaxed">{selectedProperty.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TENANTS */}
              {activeProfileTab === 'tenants' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase">Leased Tenants</h4>
                    <button
                      onClick={() => {
                        setNewTen(emptyTenant());
                        setShowAddTenant(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Tenant
                    </button>
                  </div>

                  {propTenants.length === 0 ? (
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                      <UserCheck className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="text-xs text-slate-500">No active or past tenants linked to this property.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {propTenants.map(ten => (
                        <div key={ten.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-black text-slate-900 text-sm">{ten.fullName}</h5>
                              <p className="text-slate-500">{ten.occupation || 'Tenant'} • Phone: {ten.phone}</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Rent: NPR {ten.monthlyRent.toLocaleString()}/mo
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                            <div>Move-In: {ten.moveInDate}</div>
                            <div>Lease End: {ten.leaseEnd}</div>
                            <div>Deposit: NPR {ten.securityDeposit.toLocaleString()}</div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${ten.phone}`}
                                className="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200 flex items-center gap-1 font-bold"
                              >
                                <Phone className="w-3 h-3" /> Call
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: RENTALS */}
              {activeProfileTab === 'rentals' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase">Rental Collection History</h4>
                    <button
                      onClick={() => {
                        setNewRent(emptyRentalPayment());
                        setShowAddRental(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Record Rental Payment
                    </button>
                  </div>

                  {propRentals.length === 0 ? (
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                      <DollarSign className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="text-xs text-slate-500">No rental payment records logged yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {propRentals.map(rent => (
                        <div
                          key={rent.id}
                          className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-black text-slate-900 block">{rent.month} Payment</span>
                            <span className="text-[11px] text-slate-500">
                              Paid: {rent.paidDate} • Method: {rent.paymentMethod}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-emerald-800 text-sm block">NPR {rent.amount.toLocaleString()}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              Paid ✓
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: MAINTENANCE */}
              {activeProfileTab === 'maintenance' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase">Maintenance & Repairs Log</h4>
                    <button
                      onClick={() => {
                        setNewMaint(emptyMaintenanceLog());
                        setShowAddMaintenance(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log Maintenance
                    </button>
                  </div>

                  {propMaintenance.length === 0 ? (
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                      <Wrench className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="text-xs text-slate-500">No maintenance tasks recorded for this property.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {propMaintenance.map(maint => (
                        <div key={maint.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 text-xs space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-black text-slate-900 block">{maint.type}</span>
                              <p className="text-slate-600 mt-0.5">{maint.description}</p>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                maint.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : maint.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {maint.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                            <span>Contractor: {maint.contractor || 'N/A'}</span>
                            <span className="font-black text-slate-800">Cost: NPR {maint.cost.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: EXPENSES */}
              {activeProfileTab === 'expenses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase">Property Overhead Expenses</h4>
                    <button
                      onClick={() => {
                        setNewExp(emptyExpense());
                        setShowAddExpense(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Record Expense
                    </button>
                  </div>

                  {propExpenses.length === 0 ? (
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                      <DollarSign className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="text-xs text-slate-500">No property expenses logged.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {propExpenses.map(exp => (
                        <div key={exp.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-black text-slate-900 block">{exp.category}</span>
                            <p className="text-[11px] text-slate-500">{exp.description || 'General expense'} • Date: {exp.date}</p>
                          </div>
                          <span className="font-black text-rose-700 text-sm">- NPR {exp.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: DOCUMENTS */}
              {activeProfileTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase">Property Deeds & Legal Certificates</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <div>
                          <span className="font-bold text-slate-800 block">Land Ownership Deed</span>
                          <span className="text-[10px] text-slate-400">Reg #: {selectedProperty.registrationNumber}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">Verified</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        <div>
                          <span className="font-bold text-slate-800 block">Insurance Policy Certificate</span>
                          <span className="text-[10px] text-slate-400">{selectedProperty.insuranceProvider}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">Active Policy</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: VALUATION */}
              {activeProfileTab === 'valuation' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase">Valuation & Market Assessment</h4>
                    <button
                      onClick={() => {
                        setNewVal(emptyValuation());
                        setShowAddValuation(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log New Valuation
                    </button>
                  </div>

                  {propValuations.length === 0 ? (
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                      <TrendingUp className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="text-xs text-slate-500">Current Valuation: NPR {selectedProperty.currentValue.toLocaleString()}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {propValuations.map(val => (
                        <div key={val.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-black text-slate-900 block">Appraisal: NPR {val.value.toLocaleString()}</span>
                            <span className="text-[11px] text-slate-500">Date: {val.valuationDate} • Valuer: {val.valuationBy}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: REMINDERS */}
              {activeProfileTab === 'reminders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase">Tax & Insurance Reminders</h4>
                    <button
                      onClick={() => {
                        setNewRem(emptyReminder());
                        setShowAddReminder(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Reminder
                    </button>
                  </div>

                  {propReminders.length === 0 ? (
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                      <Bell className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="text-xs text-slate-500">No active alerts set for this property.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {propReminders.map(rem => (
                        <div key={rem.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className={`font-black block ${rem.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {rem.title}
                            </span>
                            <span className="text-[11px] text-slate-500">Due: {rem.dueDate} ({rem.type})</span>
                          </div>
                          <button
                            onClick={() => handleToggleReminderDone(rem.id)}
                            className={`px-3 py-1 rounded-xl text-[10px] font-bold cursor-pointer ${
                              rem.isCompleted ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {rem.isCompleted ? 'Completed ✓' : 'Mark Done'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: ADD NEW PROPERTY
          ============================================================ */}
      {showAddProperty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-100 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Add New Property or Land Record</h3>
              <button onClick={() => setShowAddProperty(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Property Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Kathmandu Residency"
                  value={newProp.name}
                  onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Property Type *</label>
                <select
                  value={newProp.type}
                  onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="House">House (Residential)</option>
                  <option value="Apartment">Apartment / Flat</option>
                  <option value="Commercial Building">Commercial Building</option>
                  <option value="Agricultural Land">Agricultural Land</option>
                  <option value="Vacant Land">Vacant Plot</option>
                  <option value="Industrial">Industrial Property</option>
                  <option value="Villa">Villa / Estate</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Full Address *</label>
                <input
                  type="text"
                  placeholder="Street / Ward No / Plot Address"
                  value={newProp.address}
                  onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City *</label>
                <input
                  type="text"
                  value={newProp.city}
                  onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">State / Province</label>
                <input
                  type="text"
                  value={newProp.state}
                  onChange={(e) => setNewProp({ ...newProp, state: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Total Area & Unit</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newProp.areaTotal || ''}
                    onChange={(e) => setNewProp({ ...newProp, areaTotal: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <select
                    value={newProp.areaUnit}
                    onChange={(e) => setNewProp({ ...newProp, areaUnit: e.target.value })}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="sq ft">sq ft</option>
                    <option value="sq m">sq m</option>
                    <option value="acres">acres</option>
                    <option value="Ropani">Ropani</option>
                    <option value="Bigha">Bigha</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Valuation (NPR)</label>
                <input
                  type="number"
                  value={newProp.currentValue || ''}
                  onChange={(e) => setNewProp({ ...newProp, currentValue: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deed Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. REG-2025-9921"
                  value={newProp.registrationNumber}
                  onChange={(e) => setNewProp({ ...newProp, registrationNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Annual Property Tax (NPR)</label>
                <input
                  type="number"
                  value={newProp.propertyTax || ''}
                  onChange={(e) => setNewProp({ ...newProp, propertyTax: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddProperty(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProperty}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md"
              >
                Save Property Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROPERTY MODAL */}
      {showEditProperty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Edit Property Details</h3>
              <button onClick={() => setShowEditProperty(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Property Name</label>
                <input
                  type="text"
                  value={editProp.name}
                  onChange={(e) => setEditProp({ ...editProp, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Valuation (NPR)</label>
                <input
                  type="number"
                  value={editProp.currentValue || ''}
                  onChange={(e) => setEditProp({ ...editProp, currentValue: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowEditProperty(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProperty}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md"
              >
                Update Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TENANT MODAL */}
      {showAddTenant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Add New Tenant Lease</h3>
              <button onClick={() => setShowAddTenant(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tenant Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rohan Shrestha"
                  value={newTen.fullName}
                  onChange={(e) => setNewTen({ ...newTen, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone *</label>
                  <input
                    type="text"
                    placeholder="+977..."
                    value={newTen.phone}
                    onChange={(e) => setNewTen({ ...newTen, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Rent (NPR) *</label>
                  <input
                    type="number"
                    value={newTen.monthlyRent || ''}
                    onChange={(e) => setNewTen({ ...newTen, monthlyRent: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddTenant(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTenant}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md"
              >
                Save Tenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD RENTAL MODAL */}
      {showAddRental && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Record Rental Payment</h3>
              <button onClick={() => setShowAddRental(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Month</label>
                <input
                  type="text"
                  placeholder="e.g. August 2026"
                  value={newRent.month}
                  onChange={(e) => setNewRent({ ...newRent, month: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount Paid (NPR)</label>
                <input
                  type="number"
                  value={newRent.amount || ''}
                  onChange={(e) => setNewRent({ ...newRent, amount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddRental(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRental}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MAINTENANCE MODAL */}
      {showAddMaintenance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Log Maintenance / Repair</h3>
              <button onClick={() => setShowAddMaintenance(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Repair Category</label>
                <select
                  value={newMaint.type}
                  onChange={(e) => setNewMaint({ ...newMaint, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Plumbing Repair">Plumbing Repair</option>
                  <option value="Electrical Work">Electrical Work</option>
                  <option value="Painting">Exterior / Interior Painting</option>
                  <option value="Roof & Waterproofing">Roof & Waterproofing</option>
                  <option value="Renovation">General Renovation</option>
                  <option value="Cleaning">Deep Cleaning & Pest Control</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description *</label>
                <textarea
                  placeholder="Details of repair work required..."
                  value={newMaint.description}
                  onChange={(e) => setNewMaint({ ...newMaint, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cost (NPR)</label>
                <input
                  type="number"
                  value={newMaint.cost || ''}
                  onChange={(e) => setNewMaint({ ...newMaint, cost: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddMaintenance(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMaintenance}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Record Property Expense</h3>
              <button onClick={() => setShowAddExpense(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Expense Category</label>
                <select
                  value={newExp.category}
                  onChange={(e) => setNewExp({ ...newExp, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Tax">Property / Land Tax</option>
                  <option value="Insurance">Insurance Premium</option>
                  <option value="Maintenance">Maintenance & Repairs</option>
                  <option value="Utility">Water / Electricity Utility</option>
                  <option value="Legal/HOA">HOA / Legal Fees</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount (NPR) *</label>
                <input
                  type="number"
                  value={newExp.amount || ''}
                  onChange={(e) => setNewExp({ ...newExp, amount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddExpense(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md"
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD REMINDER MODAL */}
      {showAddReminder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Set Tax / Expiry Reminder</h3>
              <button onClick={() => setShowAddReminder(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Ward 3 Property Tax Clearance"
                  value={newRem.title}
                  onChange={(e) => setNewRem({ ...newRem, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={newRem.dueDate}
                  onChange={(e) => setNewRem({ ...newRem, dueDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddReminder(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReminder}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD VALUATION MODAL */}
      {showAddValuation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Log Property Market Assessment</h3>
              <button onClick={() => setShowAddValuation(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assessed Value (NPR) *</label>
                <input
                  type="number"
                  value={newVal.value || ''}
                  onChange={(e) => setNewVal({ ...newVal, value: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Appraiser / Valuer Name</label>
                <input
                  type="text"
                  value={newVal.valuationBy}
                  onChange={(e) => setNewVal({ ...newVal, valuationBy: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddValuation(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddValuation}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md"
              >
                Save Valuation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO ANALYTICS MODAL */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-900">Real Estate Portfolio Analytics & AI Insights</h3>
              </div>
              <button onClick={() => setShowAnalyticsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Total Portfolio Value</span>
                <span className="text-base font-black text-emerald-950">NPR {totalValueSum.toLocaleString()}</span>
              </div>
              <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Annual Rental Income</span>
                <span className="text-base font-black text-blue-950">NPR {(totalMonthlyRentSum * 12).toLocaleString()}/yr</span>
              </div>
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-100">
                <span className="text-[10px] font-bold text-purple-800 uppercase block">Avg Gross Yield</span>
                <span className="text-base font-black text-purple-950">
                  {totalValueSum > 0 ? `${(((totalMonthlyRentSum * 12) / totalValueSum) * 100).toFixed(2)}%` : '0%'}
                </span>
              </div>
            </div>

            {/* AI Advisor Breakdown */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Sparkles className="w-4 h-4" /> AI Property Advisor Assessment
              </div>
              <ul className="space-y-1.5 text-slate-300 list-disc pl-4 leading-relaxed">
                <li>Your real estate portfolio consists of {properties.length} active property/land holdings with a healthy gross yield.</li>
                <li>Ensure land cadastral maps & tax receipts for Kathmandu and Lalitpur holdings are scanned into the Documents tab for legal safety.</li>
                <li>Annual property tax clearances for ward offices are recommended 15 days prior to fiscal year end to avoid late penalties.</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer"
              >
                Close Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Property Tracker Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Default Currency</label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="NPR">Nepalese Rupee (NPR)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="INR">Indian Rupee (₹)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Default Land Area Unit</label>
                <select
                  value={settings.defaultAreaUnit}
                  onChange={(e) => setSettings({ ...settings, defaultAreaUnit: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="sq ft">Square Feet (sq ft)</option>
                  <option value="Ropani">Ropani / Aana / Paisa</option>
                  <option value="Bigha">Bigha / Kattha / Dhur</option>
                  <option value="acres">Acres</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE SETUP MODAL */}
      <ServiceSetupModal
        serviceId="property"
        serviceName="Property & Land Management"
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
};

export default PropertyLandTracker;
