import React, { useState, useEffect, useMemo } from 'react';
import {
  Car,
  Plus,
  History,
  Settings as SettingsIcon,
  Wrench,
  Fuel,
  Receipt,
  MapPin,
  Shield,
  BarChart3,
  Calendar as CalendarIcon,
  Bell,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Filter,
  Trash2,
  Check,
  CheckCircle2,
  Share2,
  AlertTriangle,
  Compass,
  FileText,
  DollarSign,
  Clock,
  Camera,
  Layers,
  ArrowRight,
  RefreshCw,
  Gauge,
  Sliders,
  ExternalLink,
  Edit3,
  Upload,
  Loader2
} from 'lucide-react';
import {
  DetailedVehicle,
  ServiceRecord,
  VehicleExpense,
  InsurancePolicy,
  ParkingLocationData,
  FleetOverviewStats
} from './vehicle/vehicleTypes';
import {
  INITIAL_DETAILED_VEHICLES,
  INITIAL_SERVICE_RECORDS,
  INITIAL_EXPENSES,
  INITIAL_POLICIES,
  INITIAL_PARKING_LOCATION,
  INITIAL_FLEET_STATS
} from './vehicle/vehicleData';

export type VehicleTab =
  | 'dashboard'
  | 'my_vehicles'
  | 'log_service'
  | 'service_history'
  | 'expenses'
  | 'ai_scan'
  | 'insurance'
  | 'parking'
  | 'fleet'
  | 'reminders'
  | 'settings';

interface VehicleCareTrackerProps {
  patient?: any;
}

export const VehicleCareTracker: React.FC<VehicleCareTrackerProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<VehicleTab>('dashboard');
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Core Data State with Local Storage persistence
  const [vehicles, setVehicles] = useState<DetailedVehicle[]>(() => {
    try {
      const saved = localStorage.getItem('care2care_vehicles_v3');
      return saved ? JSON.parse(saved) : INITIAL_DETAILED_VEHICLES;
    } catch {
      return INITIAL_DETAILED_VEHICLES;
    }
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    return INITIAL_DETAILED_VEHICLES[0]?.id || 'veh-honda-city';
  });

  const [services, setServices] = useState<ServiceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('care2care_services_v3');
      return saved ? JSON.parse(saved) : INITIAL_SERVICE_RECORDS;
    } catch {
      return INITIAL_SERVICE_RECORDS;
    }
  });

  const [expenses, setExpenses] = useState<VehicleExpense[]>(() => {
    try {
      const saved = localStorage.getItem('care2care_expenses_v3');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [policies, setPolicies] = useState<InsurancePolicy[]>(() => {
    try {
      const saved = localStorage.getItem('care2care_policies_v3');
      return saved ? JSON.parse(saved) : INITIAL_POLICIES;
    } catch {
      return INITIAL_POLICIES;
    }
  });

  const [parkingLocation, setParkingLocation] = useState<ParkingLocationData>(() => {
    try {
      const saved = localStorage.getItem('care2care_parking_v3');
      return saved ? JSON.parse(saved) : INITIAL_PARKING_LOCATION;
    } catch {
      return INITIAL_PARKING_LOCATION;
    }
  });

  // Reminders list state
  const [reminders, setReminders] = useState([
    { id: 'rem-1', title: 'Periodic Engine Oil Change', interval: 'Every 5,000 km', due: 'in 12 days (15 May 2025)', enabled: true, category: 'Maintenance' },
    { id: 'rem-2', title: 'Tire Rotation & Wheel Alignment', interval: 'Every 10,000 km', due: 'in 40 days (10 Jun 2025)', enabled: true, category: 'Tires' },
    { id: 'rem-3', title: 'Comprehensive Insurance Renewal', interval: 'Annual (30 May)', due: 'in 25 days (30 May 2025)', enabled: true, category: 'Legal' },
    { id: 'rem-4', title: 'Blue Book / Road Tax Renewal', interval: 'Annual (24 Aug)', due: 'in 110 days (24 Aug 2025)', enabled: true, category: 'Tax' },
    { id: 'rem-5', title: 'Brake Fluid & Brake Pads Inspection', interval: 'Every 20,000 km', due: 'in 75 days (15 Jul 2025)', enabled: false, category: 'Safety' },
  ]);

  // Modals & form states
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [historyTabMode, setHistoryTabMode] = useState<'history' | 'upcoming'>('history');
  const [expenseFilterPeriod, setExpenseFilterPeriod] = useState<'this_month' | 'last_month' | 'all'>('this_month');
  const [expenseFilterType, setExpenseFilterType] = useState<string>('all');

  // AI Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    vendor: string;
    amount: number;
    liters: number;
    date: string;
    category: string;
  } | null>(null);

  // New Vehicle Form State
  const [newVehicle, setNewVehicle] = useState<Partial<DetailedVehicle>>({
    name: 'Hyundai Creta',
    brand: 'Hyundai',
    model: 'Creta SX(O)',
    type: 'Car',
    year: 2023,
    licensePlate: 'BA 4 CHA 9876',
    odometer: 14500,
    fuelType: 'Petrol',
    ownershipType: 'Personal',
    purchasePrice: 4850000,
    currency: 'NPR',
    currentEstimatedValue: 4200000,
    photos: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80']
  });

  // Log Service Form State
  const [serviceDate, setServiceDate] = useState('2025-05-14');
  const [serviceOdometer, setServiceOdometer] = useState(28560);
  const [serviceProvider, setServiceProvider] = useState('Dream Auto Care, Lalitpur');
  const [serviceCost, setServiceCost] = useState(4800);
  const [serviceTags, setServiceTags] = useState<string[]>([
    'Oil Change',
    'Oil Filter',
    'Tire Rotation',
    'Brake Pads Check'
  ]);
  const [serviceNotes, setServiceNotes] = useState('Synthetic 5W-30 engine oil replaced, spark plugs cleaned, fluid levels inspected.');

  // Quick Expense Form State
  const [expType, setExpType] = useState<VehicleExpense['type']>('Fuel');
  const [expAmount, setExpAmount] = useState(3200);
  const [expDate, setExpDate] = useState('2025-05-14');
  const [expOdometer, setExpOdometer] = useState(28560);
  const [expDesc, setExpDesc] = useState('Full tank petrol - NOC Pulchowk');

  // New Policy Form State
  const [newPolType, setNewPolType] = useState<InsurancePolicy['policyType']>('Comprehensive (1st Party)');
  const [newPolProvider, setNewPolProvider] = useState('Himalayan Everest Insurance');
  const [newPolNumber, setNewPolNumber] = useState('');
  const [newPolExpiry, setNewPolExpiry] = useState('2026-05-30');
  const [newPolPremium, setNewPolPremium] = useState(18500);

  // New Reminder State
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemInterval, setNewRemInterval] = useState('Every 10,000 km');
  const [newRemDue, setNewRemDue] = useState('in 30 days');
  const [newRemCategory, setNewRemCategory] = useState('Maintenance');

  // Local storage synchronization
  useEffect(() => {
    try {
      localStorage.setItem('care2care_vehicles_v3', JSON.stringify(vehicles));
    } catch (e) {
      console.error(e);
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem('care2care_services_v3', JSON.stringify(services));
    } catch (e) {
      console.error(e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('care2care_expenses_v3', JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('care2care_policies_v3', JSON.stringify(policies));
    } catch (e) {
      console.error(e);
    }
  }, [policies]);

  useEffect(() => {
    try {
      localStorage.setItem('care2care_parking_v3', JSON.stringify(parkingLocation));
    } catch (e) {
      console.error(e);
    }
  }, [parkingLocation]);

  // Selected Active Vehicle
  const selectedVehicle = useMemo(() => {
    return (
      vehicles.find((v) => v.id === selectedVehicleId) ||
      vehicles[0] ||
      INITIAL_DETAILED_VEHICLES[0]
    );
  }, [vehicles, selectedVehicleId]);

  // Filtered sub-data for active vehicle
  const vehicleServices = useMemo(() => {
    return services.filter((s) => s.vehicleId === selectedVehicle?.id || s.vehicleId === 'veh-honda-city');
  }, [services, selectedVehicle]);

  const vehicleExpenses = useMemo(() => {
    return expenses.filter((e) => e.vehicleId === selectedVehicle?.id || e.vehicleId === 'veh-honda-city');
  }, [expenses, selectedVehicle]);

  const vehiclePolicies = useMemo(() => {
    return policies.filter((p) => p.vehicleId === selectedVehicle?.id || p.vehicleId === 'veh-honda-city');
  }, [policies, selectedVehicle]);

  // Calculations
  const totalExpensesAmount = vehicleExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalFuelCost = vehicleExpenses
    .filter((e) => e.type === 'Fuel')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Available service tags
  const allServiceTags = [
    'Oil Change',
    'Oil Filter',
    'Tire Rotation',
    'Wheel Alignment',
    'Brake Pads Check',
    'Battery Health',
    'AC Filter Clean',
    'Coolant Flush',
    'Spark Plugs',
    'Transmission Fluid',
    'Suspension Check',
    'Wiper Replacement'
  ];

  const toggleServiceTag = (tag: string) => {
    if (serviceTags.includes(tag)) {
      setServiceTags(serviceTags.filter((t) => t !== tag));
    } else {
      setServiceTags([...serviceTags, tag]);
    }
  };

  // Add Service Handler
  const handleSaveService = () => {
    const newRecord: ServiceRecord = {
      id: `srv-${Date.now()}`,
      vehicleId: selectedVehicle.id,
      date: serviceDate,
      odometer: Number(serviceOdometer),
      provider: serviceProvider,
      cost: Number(serviceCost),
      currency: 'NPR',
      serviceTags: serviceTags.length > 0 ? serviceTags : ['General Inspection'],
      notes: serviceNotes
    };

    setServices([newRecord, ...services]);
    // Also record as a maintenance expense automatically
    const newExp: VehicleExpense = {
      id: `exp-${Date.now()}`,
      vehicleId: selectedVehicle.id,
      date: serviceDate,
      odometer: Number(serviceOdometer),
      type: 'Maintenance',
      amount: Number(serviceCost),
      currency: 'NPR',
      description: `Service at ${serviceProvider} (${serviceTags.slice(0, 2).join(', ')})`
    };
    setExpenses([newExp, ...expenses]);

    // Update vehicle odometer if higher
    if (Number(serviceOdometer) > selectedVehicle.odometer) {
      setVehicles(
        vehicles.map((v) =>
          v.id === selectedVehicle.id ? { ...v, odometer: Number(serviceOdometer) } : v
        )
      );
    }

    showNotification(`Service recorded! NPR ${serviceCost.toLocaleString()} logged.`);
    setActiveTab('service_history');
  };

  // Add Vehicle Handler
  const handleSaveNewVehicle = () => {
    const newId = `veh-${Date.now()}`;
    const vehicleItem: DetailedVehicle = {
      id: newId,
      name: newVehicle.name || 'New Vehicle',
      brand: newVehicle.brand || 'Brand',
      model: newVehicle.model || 'Model',
      type: newVehicle.type || 'Car',
      year: Number(newVehicle.year) || 2023,
      licensePlate: newVehicle.licensePlate || 'BA 1 CHA 0000',
      chassisNumber: newVehicle.chassisNumber || `MAK${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
      photos: newVehicle.photos?.length
        ? newVehicle.photos
        : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
      ownershipType: newVehicle.ownershipType || 'Personal',
      purchaseDate: '2023-01-15',
      purchasePrice: Number(newVehicle.purchasePrice) || 3500000,
      currency: 'NPR',
      currentEstimatedValue: Number(newVehicle.currentEstimatedValue) || 3000000,
      distanceUnit: 'km',
      odometer: Number(newVehicle.odometer) || 0,
      fuelType: newVehicle.fuelType || 'Petrol',
      notes: newVehicle.notes || 'Added to Care2Care fleet',
      isActive: true,
      nextServiceDaysLeft: 60,
      nextServiceDueKm: (Number(newVehicle.odometer) || 0) + 5000,
      insuranceDaysLeft: 365,
      taxDaysLeft: 300,
      status: 'Good'
    };

    setVehicles([vehicleItem, ...vehicles]);
    setSelectedVehicleId(newId);
    setIsAddVehicleOpen(false);
    showNotification(`Vehicle ${vehicleItem.name} added successfully!`);
    setActiveTab('dashboard');
  };

  // Add Expense Handler
  const handleSaveExpense = () => {
    const newExp: VehicleExpense = {
      id: `exp-${Date.now()}`,
      vehicleId: selectedVehicle.id,
      date: expDate,
      odometer: Number(expOdometer),
      type: expType,
      amount: Number(expAmount),
      currency: 'NPR',
      description: expDesc
    };
    setExpenses([newExp, ...expenses]);
    setIsAddExpenseOpen(false);
    showNotification(`Expense NPR ${expAmount.toLocaleString()} added!`);
  };

  // Add Policy Handler
  const handleSavePolicy = () => {
    const newPol: InsurancePolicy = {
      id: `pol-${Date.now()}`,
      vehicleId: selectedVehicle.id,
      policyType: newPolType,
      provider: newPolProvider,
      policyNumber: newPolNumber || `POL-${Math.floor(100000 + Math.random() * 900000)}`,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: newPolExpiry,
      premium: Number(newPolPremium),
      currency: 'NPR',
      status: 'Active',
      daysLeft: 365
    };
    setPolicies([newPol, ...policies]);
    setIsAddPolicyOpen(false);
    showNotification(`Policy ${newPol.policyNumber} saved!`);
  };

  // Add Reminder Handler
  const handleAddReminder = () => {
    if (!newRemTitle) return;
    const item = {
      id: `rem-${Date.now()}`,
      title: newRemTitle,
      interval: newRemInterval,
      due: newRemDue,
      enabled: true,
      category: newRemCategory
    };
    setReminders([item, ...reminders]);
    setNewRemTitle('');
    setIsAddReminderOpen(false);
    showNotification('Service reminder scheduled!');
  };

  // AI Scan Trigger
  const handleSimulateAIScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        vendor: 'Sajha Yatayat Petrol Station, Pulchowk',
        amount: 3450,
        liters: 23.8,
        date: '2025-05-14',
        category: 'Fuel'
      });
      showNotification('Receipt analyzed! Details auto-filled.');
    }, 1400);
  };

  const handleApplyAIScan = () => {
    if (!scanResult) return;
    const newExp: VehicleExpense = {
      id: `exp-${Date.now()}`,
      vehicleId: selectedVehicle.id,
      date: scanResult.date,
      odometer: selectedVehicle.odometer,
      type: 'Fuel',
      amount: scanResult.amount,
      currency: 'NPR',
      description: `AI Scanned: ${scanResult.vendor} (${scanResult.liters} L)`,
      aiScanned: true
    };
    setExpenses([newExp, ...expenses]);
    setScanResult(null);
    showNotification(`NPR ${newExp.amount.toLocaleString()} Fuel expense saved!`);
    setActiveTab('expenses');
  };

  // Delete Vehicle Handler
  const handleDeleteVehicle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (vehicles.length <= 1) {
      showNotification('Cannot delete the only vehicle in your garage.');
      return;
    }
    const filtered = vehicles.filter((v) => v.id !== id);
    setVehicles(filtered);
    if (selectedVehicleId === id) {
      setSelectedVehicleId(filtered[0]?.id || '');
    }
    showNotification('Vehicle removed from garage.');
  };

  // Navigation tabs definition
  const navMenuItems: Array<{ id: VehicleTab; label: string; icon: any }> = [
    { id: 'dashboard', label: 'Dashboard', icon: Car },
    { id: 'my_vehicles', label: 'My Vehicles', icon: Layers },
    { id: 'log_service', label: 'Log Service', icon: Wrench },
    { id: 'service_history', label: 'Service History', icon: History },
    { id: 'expenses', label: 'Expenses & Fuel', icon: Receipt },
    { id: 'ai_scan', label: 'AI Scan Receipt', icon: Sparkles },
    { id: 'insurance', label: 'Insurance & Vault', icon: Shield },
    { id: 'parking', label: 'Parking GPS', icon: MapPin },
    { id: 'fleet', label: 'Fleet Analytics', icon: BarChart3 },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-[#FF5A36] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-black animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* TOP HEADER - Aligned with Water Service Archetype */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs shrink-0">
            <Car className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                Vehicle Service
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">14 May 2025</span>
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">
              Vehicle Care & Fleet Maintenance
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {/* Quick Active Vehicle Dropdown - Compact & Responsive */}
          <div className="relative flex-1 sm:flex-initial min-w-0 max-w-[210px] sm:max-w-[240px]">
            <select
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                const veh = vehicles.find((v) => v.id === e.target.value);
                if (veh) showNotification(`Active vehicle switched to ${veh.name}`);
              }}
              className="w-full appearance-none bg-white hover:bg-orange-50/60 text-slate-800 text-[11px] sm:text-xs font-bold py-1.5 pl-2.5 pr-7 rounded-xl sm:rounded-2xl border border-orange-200 cursor-pointer shadow-xs focus:outline-none truncate"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  🚗 {v.name} ({v.licensePlate})
                </option>
              ))}
            </select>
            <ChevronRight className="w-3 h-3 text-orange-500 absolute right-2 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>

          <button
            onClick={() => setActiveTab('log_service')}
            className="shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-[11px] sm:text-xs font-black rounded-xl sm:rounded-2xl shadow-xs transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Log Service</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SCROLLING MENU (Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs font-black scale-102'
                  : 'bg-white text-slate-700 hover:bg-orange-50 border-slate-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#FF5A36]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VEHICLE DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Active Vehicle Hero Card */}
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Active Vehicle
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {selectedVehicle.status}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  {selectedVehicle.name}
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  {selectedVehicle.brand} {selectedVehicle.model} • {selectedVehicle.year} • Plate:{' '}
                  <span className="text-slate-800 font-black">{selectedVehicle.licensePlate}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showNotification(`Vehicle details for ${selectedVehicle.name} copied!`)}
                  className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-orange-200 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => setActiveTab('my_vehicles')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold flex items-center gap-1 border border-slate-200 cursor-pointer"
                >
                  <span>Garage ({vehicles.length})</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Vehicle Hero Display: Image + Key Radial / Meter Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Vehicle Photo with aesthetic gradient overlay */}
              <div className="md:col-span-6 relative h-48 sm:h-52 rounded-2xl overflow-hidden border border-orange-200/80 group">
                <img
                  src={selectedVehicle.photos[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedVehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-3.5 text-white">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span>Valuation: NPR {selectedVehicle.currentEstimatedValue.toLocaleString()}</span>
                    <span className="bg-[#FF5A36] text-white px-2 py-0.5 rounded-lg text-[10px]">
                      {selectedVehicle.ownershipType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gauges & Vital Metrics */}
              <div className="md:col-span-6 grid grid-cols-2 gap-3">
                {/* Odometer Card */}
                <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/70 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                    <span>Odometer</span>
                    <Gauge className="w-3.5 h-3.5 text-[#FF5A36]" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {selectedVehicle.odometer.toLocaleString()} <span className="text-xs font-bold text-slate-500">km</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-600">Daily avg ~28 km</span>
                </div>

                {/* Fuel Level Card */}
                <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/70 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                    <span>Fuel ({selectedVehicle.fuelType})</span>
                    <Fuel className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    ~75% <span className="text-xs font-bold text-slate-500">(36L)</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-500">~420 km range</span>
                </div>

                {/* Next Service Due */}
                <div className="p-3.5 bg-orange-50/50 border border-orange-200 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                    <span>Next Service</span>
                    <Wrench className="w-3.5 h-3.5 text-[#FF5A36]" />
                  </div>
                  <div className="text-sm font-black text-slate-900 mt-1">
                    in {selectedVehicle.nextServiceDaysLeft || 12} days
                  </div>
                  <span className="text-[10px] font-black text-[#FF5A36]">
                    Due @ 30,000 km
                  </span>
                </div>

                {/* Insurance Expiry */}
                <div className="p-3.5 bg-orange-50/50 border border-orange-200 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                    <span>Insurance Expiry</span>
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <div className="text-sm font-black text-slate-900 mt-1">
                    in {selectedVehicle.insuranceDaysLeft || 25} days
                  </div>
                  <span className="text-[10px] font-black text-indigo-600">30 May 2025</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Quick Actions
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => setActiveTab('log_service')}
                  className="p-3 rounded-2xl bg-orange-50/80 hover:bg-orange-100 text-slate-800 text-xs font-black border border-orange-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-[#FF5A36]" />
                  <span>Log Service</span>
                </button>

                <button
                  onClick={() => {
                    setExpType('Fuel');
                    setIsAddExpenseOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-orange-50/80 hover:bg-orange-100 text-slate-800 text-xs font-black border border-orange-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Fuel className="w-4 h-4 text-emerald-500" />
                  <span>Add Fuel</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai_scan')}
                  className="p-3 rounded-2xl bg-orange-50/80 hover:bg-orange-100 text-slate-800 text-xs font-black border border-orange-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                  <span>Scan Receipt</span>
                </button>

                <button
                  onClick={() => setActiveTab('parking')}
                  className="p-3 rounded-2xl bg-orange-50/80 hover:bg-orange-100 text-slate-800 text-xs font-black border border-orange-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-sky-500" />
                  <span>Find My Car</span>
                </button>
              </div>
            </div>
          </div>

          {/* Highlights Grid: Expenses & Recent Service Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly Financials Card */}
            <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">Monthly Expense Summary</h3>
                <span className="text-[10px] font-extrabold text-[#FF5A36] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  May 2025
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Total Spent</p>
                  <p className="text-xs font-black text-slate-900 mt-0.5">
                    NPR {totalExpensesAmount.toLocaleString()}
                  </p>
                </div>
                <div className="border-x border-slate-200 px-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Fuel Cost</p>
                  <p className="text-xs font-black text-slate-900 mt-0.5">
                    NPR {totalFuelCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Cost / km</p>
                  <p className="text-xs font-black text-emerald-600 mt-0.5">NPR 11.2</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('expenses')}
                className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] text-xs font-black rounded-xl border border-orange-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Full Expense Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Upcoming Maintenance Tasks Card */}
            <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">Upcoming Vehicle To-Dos</h3>
                <button
                  onClick={() => setActiveTab('reminders')}
                  className="text-xs font-bold text-[#FF5A36] hover:underline"
                >
                  Manage
                </button>
              </div>

              <div className="space-y-2">
                {reminders.slice(0, 3).map((rem) => (
                  <div
                    key={rem.id}
                    className="p-2.5 bg-[#FFF9F5] border border-orange-200/60 rounded-xl flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-black text-slate-900 truncate">{rem.title}</p>
                      <p className="text-[10px] font-bold text-[#FF5A36] mt-0.5">{rem.due}</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-orange-200 shrink-0">
                      {rem.interval}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY VEHICLES (GARAGE) */}
      {activeTab === 'my_vehicles' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">My Garage & Fleet</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Manage all personal, family, and company vehicles in one unified dashboard.
                </p>
              </div>

              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Vehicle</span>
              </button>
            </div>

            {/* Vehicles Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {vehicles.map((v) => {
                const isSelected = v.id === selectedVehicle.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicleId(v.id);
                      showNotification(`Selected ${v.name}`);
                    }}
                    className={`rounded-3xl border p-4 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                      isSelected
                        ? 'bg-gradient-to-b from-orange-50/80 to-white border-orange-400 shadow-md ring-2 ring-orange-400/20'
                        : 'bg-white border-slate-200/90 hover:border-orange-200 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="relative h-32 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                        <img
                          src={v.photos[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                          alt={v.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-lg">
                            {v.type}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#FF5A36] text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className="text-sm font-black text-slate-900 truncate">{v.name}</h3>
                      <p className="text-xs font-bold text-slate-500">
                        {v.brand} {v.model} ({v.year})
                      </p>

                      <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-1 text-[11px]">
                        <div>
                          <span className="text-slate-400 font-bold block text-[9px] uppercase">Plate</span>
                          <span className="font-black text-slate-800">{v.licensePlate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block text-[9px] uppercase">Mileage</span>
                          <span className="font-black text-slate-800">{v.odometer.toLocaleString()} km</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-black text-[#FF5A36]">
                        NPR {v.currentEstimatedValue ? (v.currentEstimatedValue / 100000).toFixed(1) + ' Lakhs' : 'NPR 25L'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleDeleteVehicle(v.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVehicleId(v.id);
                            setActiveTab('dashboard');
                          }}
                          className="px-2.5 py-1 bg-orange-100 hover:bg-[#FF5A36] hover:text-white text-[#FF5A36] rounded-xl text-[11px] font-black transition-colors"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOG NEW SERVICE */}
      {activeTab === 'log_service' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Log Vehicle Service</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Record periodic maintenance, fluid changes, and repairs for{' '}
                  <span className="font-black text-[#FF5A36]">{selectedVehicle.name}</span>.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('service_history')}
                className="text-xs font-black text-[#FF5A36] hover:underline"
              >
                View History
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Date */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Service Date <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF5A36] focus:bg-white rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none transition-all"
                />
              </div>

              {/* Current Odometer */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Odometer Reading (km) <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="number"
                  value={serviceOdometer}
                  onChange={(e) => setServiceOdometer(Number(e.target.value))}
                  placeholder="e.g. 28,560"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF5A36] focus:bg-white rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none transition-all"
                />
              </div>

              {/* Service Workshop */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Workshop / Service Provider <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={serviceProvider}
                  onChange={(e) => setServiceProvider(e.target.value)}
                  placeholder="e.g. Dream Auto Care, Lalitpur"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF5A36] focus:bg-white rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none transition-all"
                />
              </div>

              {/* Total Cost */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Total Cost (NPR) <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="number"
                  value={serviceCost}
                  onChange={(e) => setServiceCost(Number(e.target.value))}
                  placeholder="e.g. 4,800"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF5A36] focus:bg-white rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            {/* Service Tags Multi-Select */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                Service Checklist & Done Items <span className="font-normal text-slate-400">(Select all that apply)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {allServiceTags.map((tag) => {
                  const isChecked = serviceTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleServiceTag(tag)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between border ${
                        isChecked
                          ? 'bg-orange-50 border-[#FF5A36] text-[#FF5A36] font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{tag}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-[#FF5A36]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technician Notes */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Technician Notes & Observations
              </label>
              <textarea
                rows={3}
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
                placeholder="Details of parts replaced, engine conditions, coolant levels, recommendations..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF5A36] focus:bg-white rounded-2xl p-3 text-xs font-medium text-slate-900 outline-none transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveService}
                className="px-6 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Service Entry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICE HISTORY & UPCOMING */}
      {activeTab === 'service_history' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Maintenance Logbook</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Service chronology and upcoming maintenance intervals for{' '}
                  <span className="font-black text-[#FF5A36]">{selectedVehicle.name}</span>.
                </p>
              </div>

              {/* Sub-tab Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => setHistoryTabMode('history')}
                  className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all ${
                    historyTabMode === 'history'
                      ? 'bg-white text-[#FF5A36] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Completed History ({vehicleServices.length})
                </button>
                <button
                  onClick={() => setHistoryTabMode('upcoming')}
                  className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all ${
                    historyTabMode === 'upcoming'
                      ? 'bg-white text-[#FF5A36] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Upcoming To-Dos (2)
                </button>
              </div>
            </div>

            {historyTabMode === 'history' ? (
              <div className="space-y-3">
                {vehicleServices.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-orange-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">
                          {new Date(rec.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-slate-300 font-bold">•</span>
                        <span className="text-xs font-bold text-slate-600">
                          {rec.odometer.toLocaleString()} km
                        </span>
                        <span className="text-slate-300 font-bold">•</span>
                        <span className="text-xs font-extrabold text-[#FF5A36]">
                          {rec.provider}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {rec.serviceTags.map((t, idx) => (
                          <span
                            key={idx}
                            className="bg-orange-50 text-[#FF5A36] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-orange-200/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {rec.notes && (
                        <p className="text-xs text-slate-500 font-medium">{rec.notes}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-slate-900">
                        NPR {rec.cost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  {
                    title: 'Periodic Maintenance 30,000 km',
                    due: 'in 12 days (15 May 2025)',
                    tags: ['Engine Oil 5W-30', 'Coolant Flush', 'Brake Check', 'Spark Plugs'],
                    estimatedCost: 'NPR 5,000'
                  },
                  {
                    title: 'Tire Alignment & Wheel Balance',
                    due: 'in 40 days (10 Jun 2025)',
                    tags: ['Wheel Alignment', 'Tire Rotation'],
                    estimatedCost: 'NPR 1,800'
                  }
                ].map((task, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFF9F5] border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{task.title}</h4>
                      <p className="text-[11px] font-black text-[#FF5A36] mt-0.5">{task.due}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {task.tags.map((t, i) => (
                          <span
                            key={i}
                            className="bg-white text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-orange-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-400 uppercase block">Est. Cost</span>
                      <span className="text-sm font-black text-slate-900">{task.estimatedCost}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: EXPENSES & FUEL */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Expenses & Fuel Tracker</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Track every rupee spent on fuel, tolls, parking, detailing, and legal renewals.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Expense</span>
                </button>
              </div>
            </div>

            {/* Stats Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFF9F5] border border-orange-200/80 p-4 rounded-2xl text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Expenses</span>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  NPR {totalExpensesAmount.toLocaleString()}
                </p>
              </div>
              <div className="sm:border-l border-orange-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fuel Spent</span>
                <p className="text-base font-black text-emerald-600 mt-0.5">
                  NPR {totalFuelCost.toLocaleString()}
                </p>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-orange-200/60 pt-2 sm:pt-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Distance</span>
                <p className="text-base font-black text-slate-900 mt-0.5">1,245 km</p>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-orange-200/60 pt-2 sm:pt-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Fuel Econ</span>
                <p className="text-base font-black text-[#FF5A36] mt-0.5">15.4 km/L</p>
              </div>
            </div>

            {/* Expense Records List */}
            <div className="space-y-2.5">
              {vehicleExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-orange-200 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        exp.type === 'Fuel'
                          ? 'bg-emerald-50 text-emerald-600'
                          : exp.type === 'Wash'
                          ? 'bg-sky-50 text-sky-600'
                          : exp.type === 'Parking'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-orange-50 text-[#FF5A36]'
                      }`}
                    >
                      {exp.type === 'Fuel' ? (
                        <Fuel className="w-4 h-4" />
                      ) : exp.type === 'Wash' ? (
                        <Sparkles className="w-4 h-4" />
                      ) : exp.type === 'Parking' ? (
                        <MapPin className="w-4 h-4" />
                      ) : (
                        <Receipt className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">
                          {new Date(exp.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-slate-300 font-bold">•</span>
                        <span className="text-xs font-extrabold text-slate-700">{exp.type}</span>
                        {exp.aiScanned && (
                          <span className="bg-orange-100 text-[#FF5A36] text-[9px] font-black px-1.5 py-0.2 rounded-md">
                            AI Scanned
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {exp.description || 'Logged expense'} • {exp.odometer.toLocaleString()} km
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-900">
                      NPR {exp.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI SCAN RECEIPT */}
      {activeTab === 'ai_scan' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-orange-100 text-[#FF5A36] px-2 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3" />
                <span>AI Vision Scanner</span>
              </div>
              <h2 className="text-lg font-black text-slate-900">Smart Fuel & Service Receipt OCR</h2>
              <p className="text-xs text-slate-500 font-medium">
                Snap or upload any petrol pump slip, workshop invoice, or parking ticket. Gemini AI auto-extracts liters, total NPR, and odometer.
              </p>
            </div>

            {/* Scan Dropzone Card */}
            <div
              onClick={handleSimulateAIScan}
              className="border-2 border-dashed border-orange-200 hover:border-[#FF5A36] bg-[#FFF9F5] hover:bg-orange-50 rounded-3xl p-8 text-center cursor-pointer transition-all group"
            >
              {isScanning ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader2 className="w-10 h-10 text-[#FF5A36] animate-spin mb-2" />
                  <p className="text-sm font-black text-slate-900">Analyzing receipt with Gemini Vision...</p>
                  <p className="text-xs text-slate-500 mt-1">Extracting vendor, vat amount, petrol liters & date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-7 h-7 text-[#FF5A36]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {scanResult ? 'Receipt Scanned Successfully!' : 'Click to Upload or Snap Receipt'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Supports Nepal Oil Corporation receipts, workshop bills, VAT invoices</p>
                  </div>
                </div>
              )}
            </div>

            {/* Scan Results Card */}
            {scanResult && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-xs font-black text-emerald-950">Extracted Bill Data</h4>
                  </div>
                  <span className="text-[10px] font-black bg-white text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    High Confidence (99.4%)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Vendor</span>
                    <span className="font-black text-slate-900 truncate block">{scanResult.vendor}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Amount</span>
                    <span className="font-black text-slate-900">NPR {scanResult.amount.toLocaleString()}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Quantity</span>
                    <span className="font-black text-slate-900">{scanResult.liters} Liters</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Category</span>
                    <span className="font-black text-slate-900">{scanResult.category}</span>
                  </div>
                </div>

                <button
                  onClick={handleApplyAIScan}
                  className="w-full py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Save to Expenses</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: INSURANCE & LEGAL VAULT */}
      {activeTab === 'insurance' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Insurance & Legal Vault</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Comprehensive 1st party insurance, 3rd party liability, and Nepal Blue Book / Tax Token tracker.
                </p>
              </div>

              <button
                onClick={() => setIsAddPolicyOpen(true)}
                className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Policy</span>
              </button>
            </div>

            {/* Active Policy Highlight Card */}
            <div className="bg-gradient-to-r from-orange-50 to-[#FFF9F5] border border-orange-200 p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF5A36] text-white flex items-center justify-center shadow-xs">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#FF5A36] uppercase tracking-wider">
                      Primary Active Policy
                    </span>
                    <h3 className="text-base font-black text-slate-900">Comprehensive (1st Party)</h3>
                  </div>
                </div>

                <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-200">
                  Active (25 days left)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-orange-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Insurer</span>
                  <span className="font-black text-slate-900">Himalayan Everest Insurance</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Policy No.</span>
                  <span className="font-black text-slate-900">HEI/12345/2024</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Expiry Date</span>
                  <span className="font-black text-[#FF5A36]">30 May 2025</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Annual Premium</span>
                  <span className="font-black text-slate-900">NPR 18,500</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showNotification('Opening Policy PDF Document...')}
                  className="px-4 py-2 bg-white hover:bg-orange-50 text-[#FF5A36] text-xs font-black rounded-xl border border-orange-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Policy Document (PDF)</span>
                </button>
              </div>
            </div>

            {/* Blue Book & Road Tax Token Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-black text-slate-900">Nepal Blue Book & Road Tax Status</h4>
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Tax Paid
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Registered Office: Ekantakuna, Lalitpur Yatayat Karyalaya. Next renewal is due before{' '}
                <span className="font-black text-slate-900">24 August 2025</span> (110 days left).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: PARKING GPS TRACKER */}
      {activeTab === 'parking' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Parking GPS Location</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Locate where you parked {selectedVehicle.name}, navigate back, or share live coordinates.
                </p>
              </div>

              <button
                onClick={() => {
                  setParkingLocation({
                    ...parkingLocation,
                    savedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  });
                  showNotification('Parked location updated to current GPS!');
                }}
                className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <MapPin className="w-4 h-4" />
                <span>Park Here Now</span>
              </button>
            </div>

            {/* Address Banner */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{parkingLocation.address}</h4>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                    Saved at {parkingLocation.savedAt} • {parkingLocation.latitude.toFixed(4)}° N, {parkingLocation.longitude.toFixed(4)}° E
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${parkingLocation.latitude},${parkingLocation.longitude}`, '_blank');
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-orange-50 text-[#FF5A36] text-xs font-black rounded-xl border border-orange-200 flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `Parked vehicle location: ${parkingLocation.address} (https://maps.google.com/?q=${parkingLocation.latitude},${parkingLocation.longitude})`
                    );
                    showNotification('Location link copied to clipboard!');
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-orange-50 text-[#FF5A36] text-xs font-black rounded-xl border border-orange-200 flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Stylized Interactive Map Preview */}
            <div className="relative w-full h-64 rounded-3xl overflow-hidden border border-slate-200 bg-[#E8ECE9]">
              <svg className="w-full h-full" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#F1F4F1" />
                {/* Grid */}
                <pattern id="veh-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#D7DDD8" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#veh-grid)" />
                {/* Major Roads */}
                <path d="M 0 120 Q 180 100 280 140 T 400 120" fill="none" stroke="#FFFFFF" strokeWidth="22" />
                <path d="M 0 120 Q 180 100 280 140 T 400 120" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="6,4" />
                <path d="M 210 0 L 230 240" fill="none" stroke="#FFFFFF" strokeWidth="18" />
                {/* Landmark area */}
                <rect x="140" y="60" width="130" height="90" rx="10" fill="#D4EDDA" opacity="0.9" />
                <text x="150" y="90" fill="#2E7D32" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  Pulchowk Campus
                </text>
                <text x="150" y="105" fill="#4B6B50" fontSize="8" fontFamily="sans-serif">
                  IOE Engineering Grounds
                </text>
              </svg>

              {/* Pin Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                <div className="w-9 h-9 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-lg animate-bounce">
                  <Car className="w-5 h-5" />
                </div>
                <div className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full mt-1 shadow-md">
                  {selectedVehicle.name} Parked Here
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: FLEET ANALYTICS & HEALTH */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg font-black text-slate-900">Fleet Analytics & Health Overview</h2>
              <p className="text-xs text-slate-500 font-medium">
                Comprehensive status distribution, cost per kilometer, and service compliance.
              </p>
            </div>

            {/* Top 3 Fleet Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Fleet Vehicles</span>
                <p className="text-xl font-black text-slate-900 mt-1">{vehicles.length} Vehicles</p>
                <span className="text-[10px] font-extrabold text-emerald-600">All registered</span>
              </div>
              <div className="p-4 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Mileage</span>
                <p className="text-xl font-black text-slate-900 mt-1">106,240 km</p>
                <span className="text-[10px] font-extrabold text-slate-500">Across entire garage</span>
              </div>
              <div className="p-4 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fleet Valuation</span>
                <p className="text-xl font-black text-[#FF5A36] mt-1">NPR 84.5 Lakhs</p>
                <span className="text-[10px] font-extrabold text-slate-500">Asset value</span>
              </div>
            </div>

            {/* Health Donut & Status Breakdown */}
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="flex items-center justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#E2E8F0" strokeWidth="12" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#10B981"
                      strokeWidth="12"
                      strokeDasharray="160 238"
                      strokeDashoffset="0"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#F97316"
                      strokeWidth="12"
                      strokeDasharray="60 238"
                      strokeDashoffset="-160"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#EF4444"
                      strokeWidth="12"
                      strokeDasharray="18 238"
                      strokeDashoffset="-220"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-900">{vehicles.length}</span>
                    <span className="text-[9px] font-bold text-slate-400">Total</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-black text-slate-800">Healthy (Good)</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">2 Vehicles</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="text-xs font-black text-slate-800">Attention (Service Soon)</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">1 Vehicle</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-xs font-black text-slate-800">Overdue (Tax / Service)</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">0 Vehicles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: REMINDERS & SCHEDULE */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Service Reminders & Intervals</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Automated notifications for oil changes, tire rotations, road tax, and policy renewals.
                </p>
              </div>

              <button
                onClick={() => setIsAddReminderOpen(true)}
                className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Reminder</span>
              </button>
            </div>

            <div className="space-y-3">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-orange-200 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{rem.title}</span>
                      <span className="text-[10px] font-black text-[#FF5A36] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                        {rem.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Interval: <span className="font-bold text-slate-800">{rem.interval}</span> •{' '}
                      <span className="text-orange-600 font-bold">{rem.due}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setReminders(
                        reminders.map((r) =>
                          r.id === rem.id ? { ...r, enabled: !r.enabled } : r
                        )
                      );
                      showNotification(`Reminder ${rem.title} ${rem.enabled ? 'disabled' : 'enabled'}`);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      rem.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        rem.enabled ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-black text-slate-900">Vehicle Service Preferences</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="font-black text-slate-800 block">Distance Metric</span>
                  <span className="text-slate-400 font-medium">Measurement unit for odometers</span>
                </div>
                <span className="font-black text-[#FF5A36] bg-orange-50 px-3 py-1 rounded-xl border border-orange-200">
                  Kilometers (km)
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="font-black text-slate-800 block">Preferred Currency</span>
                  <span className="text-slate-400 font-medium">Currency for service, parts & fuel</span>
                </div>
                <span className="font-black text-[#FF5A36] bg-orange-50 px-3 py-1 rounded-xl border border-orange-200">
                  NPR (Nepali Rupees)
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="font-black text-slate-800 block">Proactive Service Alerts</span>
                  <span className="text-slate-400 font-medium">Notify when odometer reaches service intervals</span>
                </div>
                <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  Enabled
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  localStorage.removeItem('care2care_vehicles_v3');
                  localStorage.removeItem('care2care_services_v3');
                  localStorage.removeItem('care2care_expenses_v3');
                  setVehicles(INITIAL_DETAILED_VEHICLES);
                  setServices(INITIAL_SERVICE_RECORDS);
                  setExpenses(INITIAL_EXPENSES);
                  showNotification('Reset garage data to defaults.');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-colors cursor-pointer"
              >
                Reset Demo Data to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD VEHICLE */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Add Vehicle to Garage</h3>
              <button
                onClick={() => setIsAddVehicleOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-black text-slate-700 block mb-1">Vehicle Nickname / Display Name</label>
                <input
                  type="text"
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  placeholder="e.g. Honda City"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-black text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    placeholder="Honda"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="font-black text-slate-700 block mb-1">Model</label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    placeholder="City VX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-black text-slate-700 block mb-1">License Plate</label>
                  <input
                    type="text"
                    value={newVehicle.licensePlate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                    placeholder="BA 3 CHA 1234"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="font-black text-slate-700 block mb-1">Year</label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: Number(e.target.value) })}
                    placeholder="2022"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-black text-slate-700 block mb-1">Fuel Type</label>
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric (EV)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="font-black text-slate-700 block mb-1">Current Odometer (km)</label>
                  <input
                    type="number"
                    value={newVehicle.odometer}
                    onChange={(e) => setNewVehicle({ ...newVehicle, odometer: Number(e.target.value) })}
                    placeholder="15000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-slate-700 block mb-1">Current Estimated Value (NPR)</label>
                <input
                  type="number"
                  value={newVehicle.currentEstimatedValue}
                  onChange={(e) => setNewVehicle({ ...newVehicle, currentEstimatedValue: Number(e.target.value) })}
                  placeholder="2500000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddVehicleOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewVehicle}
                className="px-5 py-2 bg-[#FF5A36] text-white font-black rounded-xl text-xs"
              >
                Save Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXPENSE */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Add Vehicle Expense</h3>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-black text-slate-700 block mb-1">Expense Type</label>
                <select
                  value={expType}
                  onChange={(e) => setExpType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                >
                  <option value="Fuel">Fuel</option>
                  <option value="Wash">Wash / Detailing</option>
                  <option value="Parking">Parking</option>
                  <option value="Toll">Toll</option>
                  <option value="Maintenance">Maintenance / Repair</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Tax">Blue Book / Road Tax</option>
                  <option value="Fine">Traffic Fine</option>
                </select>
              </div>

              <div>
                <label className="font-black text-slate-700 block mb-1">Amount (NPR)</label>
                <input
                  type="number"
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  placeholder="3200"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-black text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="font-black text-slate-700 block mb-1">Odometer (km)</label>
                  <input
                    type="number"
                    value={expOdometer}
                    onChange={(e) => setExpOdometer(Number(e.target.value))}
                    placeholder="28560"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-slate-700 block mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="e.g. NOC Petrol Pump Pulchowk"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveExpense}
                className="px-5 py-2 bg-[#FF5A36] text-white font-black rounded-xl text-xs"
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD POLICY */}
      {isAddPolicyOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Add Policy / Document</h3>
              <button
                onClick={() => setIsAddPolicyOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-black text-slate-700 block mb-1">Policy Type</label>
                <select
                  value={newPolType}
                  onChange={(e) => setNewPolType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                >
                  <option value="Comprehensive (1st Party)">Comprehensive (1st Party)</option>
                  <option value="3rd Party (Liability)">3rd Party (Liability)</option>
                  <option value="Tax Token">Blue Book / Road Tax Token</option>
                  <option value="Zero Dep">Zero Depreciation</option>
                </select>
              </div>

              <div>
                <label className="font-black text-slate-700 block mb-1">Insurance Provider</label>
                <input
                  type="text"
                  value={newPolProvider}
                  onChange={(e) => setNewPolProvider(e.target.value)}
                  placeholder="e.g. Himalayan Everest Insurance"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div>
                <label className="font-black text-slate-700 block mb-1">Policy Number</label>
                <input
                  type="text"
                  value={newPolNumber}
                  onChange={(e) => setNewPolNumber(e.target.value)}
                  placeholder="e.g. HEI/88771/2025"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-black text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newPolExpiry}
                    onChange={(e) => setNewPolExpiry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="font-black text-slate-700 block mb-1">Premium (NPR)</label>
                  <input
                    type="number"
                    value={newPolPremium}
                    onChange={(e) => setNewPolPremium(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddPolicyOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePolicy}
                className="px-5 py-2 bg-[#FF5A36] text-white font-black rounded-xl text-xs"
              >
                Save Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD REMINDER */}
      {isAddReminderOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Schedule Service Reminder</h3>
              <button
                onClick={() => setIsAddReminderOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-black text-slate-700 block mb-1">Reminder Title</label>
                <input
                  type="text"
                  value={newRemTitle}
                  onChange={(e) => setNewRemTitle(e.target.value)}
                  placeholder="e.g. Brake Fluid Flush"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div>
                <label className="font-black text-slate-700 block mb-1">Interval</label>
                <input
                  type="text"
                  value={newRemInterval}
                  onChange={(e) => setNewRemInterval(e.target.value)}
                  placeholder="e.g. Every 15,000 km"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-black text-slate-700 block mb-1">Due</label>
                  <input
                    type="text"
                    value={newRemDue}
                    onChange={(e) => setNewRemDue(e.target.value)}
                    placeholder="in 45 days"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="font-black text-slate-700 block mb-1">Category</label>
                  <select
                    value={newRemCategory}
                    onChange={(e) => setNewRemCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-bold"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Tires">Tires</option>
                    <option value="Legal">Legal</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddReminderOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddReminder}
                className="px-5 py-2 bg-[#FF5A36] text-white font-black rounded-xl text-xs"
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
