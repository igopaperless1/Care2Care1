import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus, Car, Bike, Truck, Bus, Fuel, Wrench, DollarSign, 
  Bell, Edit, Trash2, X, Search, RefreshCw,
  CheckCircle, XCircle, Clock, AlertTriangle, Shield,
  Zap
} from 'lucide-react';

// ============================================================
// SIMPLIFIED TYPES - No nested objects, all flat
// ============================================================

interface SimpleVehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  plate: string;
  fuelType: string;
  odometer: number;
  dailyRunKm: number;
  mileage: number;
  insuranceExpiry: string;
  insuranceType: "1st Party (Comprehensive)" | "2nd Party" | "3rd Party (Liability)" | "Zero Depreciation";
  insurancePolicyNo: string;
  insuranceProvider: string;
  insuranceDocUrl?: string;
  pucExpiry: string;
  serviceDue: string;
  color: string;
  notes: string;
  isActive: boolean;
}

interface SimpleFuelLog {
  id: string;
  vehicleId: string;
  date: string;
  liters: number;
  cost: number;
  odometer: number;
  tripDistance: number;
  mileage: number;
  station: string;
}

interface SimpleServiceLog {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  provider: string;
  cost: number;
  odometer: number;
  nextServiceDate: string;
  notes: string;
}

interface SimpleExpense {
  id: string;
  vehicleId: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

interface SimpleReminder {
  id: string;
  vehicleId: string;
  title: string;
  dueDate: string;
  type: string;
  isDone: boolean;
}

// ============================================================
// DEFAULT VALUES - All properties have safe defaults
// ============================================================

const emptyVehicle = (): SimpleVehicle => ({
  id: '',
  name: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  type: 'Car',
  plate: '',
  fuelType: 'Petrol',
  odometer: 0,
  dailyRunKm: 25,
  mileage: 0,
  insuranceExpiry: '',
  insuranceType: '1st Party (Comprehensive)',
  insurancePolicyNo: '',
  insuranceProvider: '',
  insuranceDocUrl: '',
  pucExpiry: '',
  serviceDue: '',
  color: '',
  notes: '',
  isActive: true
});

const emptyFuelLog = (): SimpleFuelLog => ({
  id: '',
  vehicleId: '',
  date: new Date().toISOString().split('T')[0],
  liters: 0,
  cost: 0,
  odometer: 0,
  tripDistance: 0,
  mileage: 0,
  station: ''
});

const emptyServiceLog = (): SimpleServiceLog => ({
  id: '',
  vehicleId: '',
  date: new Date().toISOString().split('T')[0],
  type: 'Oil Change',
  provider: '',
  cost: 0,
  odometer: 0,
  nextServiceDate: '',
  notes: ''
});

const emptyExpense = (): SimpleExpense => ({
  id: '',
  vehicleId: '',
  date: new Date().toISOString().split('T')[0],
  category: 'Fuel',
  amount: 0,
  description: ''
});

const emptyReminder = (): SimpleReminder => ({
  id: '',
  vehicleId: '',
  title: '',
  dueDate: new Date().toISOString().split('T')[0],
  type: 'Service',
  isDone: false
});

// ============================================================
// SAFE HELPER FUNCTIONS - No .toLowerCase() crashes
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

const safeFilter = (items: any[], query: string): any[] => {
  if (!items || !Array.isArray(items)) return [];
  if (!query || query.trim() === '') return items;
  
  const search = query.toLowerCase().trim();
  return items.filter(item => {
    const name = safeStr(item.name || item.vehicleName || '').toLowerCase();
    const brand = safeStr(item.brand || '').toLowerCase();
    const model = safeStr(item.model || '').toLowerCase();
    const plate = safeStr(item.plate || item.licensePlate || '').toLowerCase();
    
    return name.includes(search) || 
           brand.includes(search) || 
           model.includes(search) || 
           plate.includes(search);
  });
};

// ============================================================
// DEMO DATA - Safe and complete
// ============================================================

const DEMO_VEHICLES: SimpleVehicle[] = [
  {
    id: 'v1',
    name: 'Honda City',
    brand: 'Honda',
    model: 'City',
    year: 2020,
    type: 'Car',
    plate: 'BA 1 KHA 1234',
    fuelType: 'Petrol',
    odometer: 25000,
    dailyRunKm: 35,
    mileage: 15.5,
    insuranceExpiry: '2026-12-31',
    insuranceType: '1st Party (Comprehensive)',
    insurancePolicyNo: 'POL-8823901',
    insuranceProvider: 'HDFC ERGO',
    pucExpiry: '2026-09-30',
    serviceDue: '2026-09-10',
    color: 'White',
    notes: 'Regularly maintained',
    isActive: true
  },
  {
    id: 'v2',
    name: 'Yamaha R15',
    brand: 'Yamaha',
    model: 'R15',
    year: 2022,
    type: 'Motorcycle',
    plate: 'BA 2 KHA 5678',
    fuelType: 'Petrol',
    odometer: 12000,
    dailyRunKm: 20,
    mileage: 40.0,
    insuranceExpiry: '2026-08-19',
    insuranceType: '3rd Party (Liability)',
    insurancePolicyNo: 'POL-1029481',
    insuranceProvider: 'Oriental Insurance',
    pucExpiry: '2026-11-30',
    serviceDue: '2026-12-15',
    color: 'Blue',
    notes: 'Sports bike',
    isActive: true
  }
];

const DEMO_FUEL_LOGS: SimpleFuelLog[] = [
  {
    id: 'f1',
    vehicleId: 'v1',
    date: '2026-07-20',
    liters: 40,
    cost: 6000,
    odometer: 25000,
    tripDistance: 400,
    mileage: 10.0,
    station: 'ABC Petrol Pump'
  },
  {
    id: 'f2',
    vehicleId: 'v1',
    date: '2026-07-15',
    liters: 35,
    cost: 5250,
    odometer: 24600,
    tripDistance: 350,
    mileage: 10.0,
    station: 'XYZ Petrol Pump'
  }
];

const DEMO_SERVICES: SimpleServiceLog[] = [
  {
    id: 's1',
    vehicleId: 'v1',
    date: '2026-03-10',
    type: 'Oil Change',
    provider: 'Honda Service Center',
    cost: 5000,
    odometer: 22000,
    nextServiceDate: '2026-09-10',
    notes: 'Regular oil change'
  }
];

const DEMO_EXPENSES: SimpleExpense[] = [
  {
    id: 'e1',
    vehicleId: 'v1',
    date: '2026-07-20',
    category: 'Fuel',
    amount: 6000,
    description: 'Fuel for trip'
  }
];

const DEMO_REMINDERS: SimpleReminder[] = [
  {
    id: 'r1',
    vehicleId: 'v1',
    title: 'Oil Change Due',
    dueDate: '2026-09-10',
    type: 'Service',
    isDone: false
  }
];

interface VehicleCareTrackerProps {
  patient?: any;
}

export const VehicleCareTracker: React.FC<VehicleCareTrackerProps> = () => {
  // ============================================================
  // STATE - Simple and flat
  // ============================================================
  
  const [vehicles, setVehicles] = useState<SimpleVehicle[]>([]);
  const [fuelLogs, setFuelLogs] = useState<SimpleFuelLog[]>([]);
  const [services, setServices] = useState<SimpleServiceLog[]>([]);
  const [expenses, setExpenses] = useState<SimpleExpense[]>([]);
  const [reminders, setReminders] = useState<SimpleReminder[]>([]);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddFuel, setShowAddFuel] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false);
  
  // Form states
  const [newVehicle, setNewVehicle] = useState<SimpleVehicle>(emptyVehicle());
  const [editVehicle, setEditVehicle] = useState<SimpleVehicle>(emptyVehicle());
  const [newFuel, setNewFuel] = useState<SimpleFuelLog>(emptyFuelLog());
  const [newService, setNewService] = useState<SimpleServiceLog>(emptyServiceLog());
  const [newExpense, setNewExpense] = useState<SimpleExpense>(emptyExpense());
  const [newReminder, setNewReminder] = useState<SimpleReminder>(emptyReminder());

  // ============================================================
  // LOAD DATA
  // ============================================================
  
  const loadData = useCallback(() => {
    try {
      setLoading(true);
      const saved = localStorage.getItem('care2care_vehicleCareData');
      if (saved) {
        const parsed = JSON.parse(saved);
        setVehicles(Array.isArray(parsed.vehicles) ? parsed.vehicles : DEMO_VEHICLES);
        setFuelLogs(Array.isArray(parsed.fuelLogs) ? parsed.fuelLogs : DEMO_FUEL_LOGS);
        setServices(Array.isArray(parsed.services) ? parsed.services : DEMO_SERVICES);
        setExpenses(Array.isArray(parsed.expenses) ? parsed.expenses : DEMO_EXPENSES);
        setReminders(Array.isArray(parsed.reminders) ? parsed.reminders : DEMO_REMINDERS);
      } else {
        setVehicles(DEMO_VEHICLES);
        setFuelLogs(DEMO_FUEL_LOGS);
        setServices(DEMO_SERVICES);
        setExpenses(DEMO_EXPENSES);
        setReminders(DEMO_REMINDERS);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading vehicle data:', err);
      setError('Failed to load vehicle data. Using demo data.');
      setVehicles(DEMO_VEHICLES);
      setFuelLogs(DEMO_FUEL_LOGS);
      setServices(DEMO_SERVICES);
      setExpenses(DEMO_EXPENSES);
      setReminders(DEMO_REMINDERS);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // SAVE DATA
  // ============================================================
  
  const saveData = useCallback(() => {
    try {
      const data = {
        vehicles,
        fuelLogs,
        services,
        expenses,
        reminders
      };
      localStorage.setItem('care2care_vehicleCareData', JSON.stringify(data));
    } catch (err) {
      console.error('Error saving vehicle data:', err);
    }
  }, [vehicles, fuelLogs, services, expenses, reminders]);

  useEffect(() => {
    if (!loading) {
      saveData();
    }
  }, [vehicles, fuelLogs, services, expenses, reminders, loading, saveData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ============================================================
  // SELECTED VEHICLE
  // ============================================================
  
  const selectedVehicle = useMemo(() => {
    if (!selectedId) return null;
    return vehicles.find(v => v.id === selectedId) || null;
  }, [vehicles, selectedId]);

  // ============================================================
  // FILTERED DATA
  // ============================================================
  
  const filteredVehicles = useMemo(() => {
    return safeFilter(vehicles, searchQuery);
  }, [vehicles, searchQuery]);

  const vehicleFuelLogs = useMemo(() => {
    if (!selectedId) return [];
    return fuelLogs.filter(f => f.vehicleId === selectedId);
  }, [fuelLogs, selectedId]);

  const vehicleServices = useMemo(() => {
    if (!selectedId) return [];
    return services.filter(s => s.vehicleId === selectedId);
  }, [services, selectedId]);

  const vehicleExpenses = useMemo(() => {
    if (!selectedId) return [];
    return expenses.filter(e => e.vehicleId === selectedId);
  }, [expenses, selectedId]);

  const vehicleReminders = useMemo(() => {
    if (!selectedId) return [];
    return reminders.filter(r => r.vehicleId === selectedId);
  }, [reminders, selectedId]);

  // ============================================================
  // HANDLERS
  // ============================================================
  
  const handleAddVehicle = () => {
    try {
      const newId = `v${Date.now()}`;
      const vehicle = {
        ...emptyVehicle(),
        ...newVehicle,
        id: newId,
        name: newVehicle.name || 'New Vehicle',
        brand: newVehicle.brand || 'Unknown',
        model: newVehicle.model || 'Unknown',
        year: newVehicle.year || new Date().getFullYear(),
        plate: newVehicle.plate || 'N/A',
        fuelType: newVehicle.fuelType || 'Petrol'
      };
      setVehicles([...vehicles, vehicle]);
      setSelectedId(newId);
      setShowAddVehicle(false);
      setNewVehicle(emptyVehicle());
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError('Failed to add vehicle. Please try again.');
    }
  };

  const handleUpdateVehicle = () => {
    try {
      if (!selectedId) return;
      setVehicles(vehicles.map(v => 
        v.id === selectedId ? { ...editVehicle, id: selectedId } : v
      ));
      setShowEditVehicle(false);
      setEditVehicle(emptyVehicle());
    } catch (err) {
      console.error('Error updating vehicle:', err);
      setError('Failed to update vehicle. Please try again.');
    }
  };

  const handleDeleteVehicle = (id: string) => {
    try {
      if (!window.confirm('Delete this vehicle and all its data?')) return;
      setVehicles(vehicles.filter(v => v.id !== id));
      setFuelLogs(fuelLogs.filter(f => f.vehicleId !== id));
      setServices(services.filter(s => s.vehicleId !== id));
      setExpenses(expenses.filter(e => e.vehicleId !== id));
      setReminders(reminders.filter(r => r.vehicleId !== id));
      if (selectedId === id) {
        setSelectedId(vehicles.length > 1 ? vehicles.find(v => v.id !== id)?.id || null : null);
        setShowDetail(false);
      }
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError('Failed to delete vehicle. Please try again.');
    }
  };

  const handleAddFuel = () => {
    try {
      if (!selectedId) return;
      const fuel = {
        ...newFuel,
        id: `f${Date.now()}`,
        vehicleId: selectedId,
        tripDistance: 0,
        mileage: 0
      };
      const vehicle = vehicles.find(v => v.id === selectedId);
      if (vehicle) {
        const prevOdometer = vehicle.odometer || 0;
        const currentOdometer = newFuel.odometer || 0;
        fuel.tripDistance = Math.max(0, currentOdometer - prevOdometer);
        fuel.mileage = newFuel.liters > 0 ? fuel.tripDistance / newFuel.liters : 0;
      }
      setFuelLogs([...fuelLogs, fuel]);
      if (newFuel.odometer > 0) {
        setVehicles(vehicles.map(v => 
          v.id === selectedId 
            ? { ...v, odometer: newFuel.odometer, mileage: fuel.mileage || v.mileage }
            : v
        ));
      }
      setShowAddFuel(false);
      setNewFuel(emptyFuelLog());
    } catch (err) {
      console.error('Error adding fuel log:', err);
      setError('Failed to add fuel log. Please try again.');
    }
  };

  const handleAddService = () => {
    try {
      if (!selectedId) return;
      const service = {
        ...newService,
        id: `s${Date.now()}`,
        vehicleId: selectedId
      };
      setServices([...services, service]);
      if (newService.nextServiceDate) {
        setVehicles(vehicles.map(v => 
          v.id === selectedId 
            ? { ...v, serviceDue: newService.nextServiceDate }
            : v
        ));
      }
      setShowAddService(false);
      setNewService(emptyServiceLog());
    } catch (err) {
      console.error('Error adding service log:', err);
      setError('Failed to add service log. Please try again.');
    }
  };

  const handleAddExpense = () => {
    try {
      if (!selectedId) return;
      const expense = {
        ...newExpense,
        id: `e${Date.now()}`,
        vehicleId: selectedId
      };
      setExpenses([...expenses, expense]);
      setShowAddExpense(false);
      setNewExpense(emptyExpense());
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense. Please try again.');
    }
  };

  const handleAddReminder = () => {
    try {
      if (!selectedId) return;
      const reminder = {
        ...newReminder,
        id: `r${Date.now()}`,
        vehicleId: selectedId,
        isDone: false
      };
      setReminders([...reminders, reminder]);
      setShowAddReminder(false);
      setNewReminder(emptyReminder());
    } catch (err) {
      console.error('Error adding reminder:', err);
      setError('Failed to add reminder. Please try again.');
    }
  };

  const handleToggleReminder = (id: string) => {
    try {
      setReminders(reminders.map(r => 
        r.id === id ? { ...r, isDone: !r.isDone } : r
      ));
    } catch (err) {
      console.error('Error toggling reminder:', err);
    }
  };

  const handleRunDiagnostics = () => {
    try {
      if (!selectedVehicle) {
        setError('No vehicle selected for diagnostics');
        return;
      }
      
      const v = selectedVehicle;
      const alerts = [];
      
      const name = v.name || 'Vehicle';
      const mileage = v.mileage || 0;
      const insuranceExpiry = v.insuranceExpiry || '';
      const pucExpiry = v.pucExpiry || '';
      const serviceDue = v.serviceDue || '';
      
      if (mileage > 0 && mileage < 8) {
        alerts.push(`⚠️ ${name}: Low fuel efficiency (${mileage} km/L). Consider servicing.`);
      }
      
      if (insuranceExpiry) {
        try {
          const days = Math.ceil((new Date(insuranceExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (days < 30 && days > 0) {
            alerts.push(`⚠️ ${name}: Insurance expires in ${days} days.`);
          }
        } catch {}
      }
      
      if (pucExpiry) {
        try {
          const days = Math.ceil((new Date(pucExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (days < 30 && days > 0) {
            alerts.push(`⚠️ ${name}: PUC expires in ${days} days.`);
          }
        } catch {}
      }
      
      if (serviceDue) {
        try {
          const days = Math.ceil((new Date(serviceDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (days < 15 && days > 0) {
            alerts.push(`⚠️ ${name}: Service due in ${days} days.`);
          }
        } catch {}
      }
      
      if (alerts.length === 0) {
        alerts.push(`✅ ${name}: All systems nominal. Vehicle is in good condition.`);
      }
      
      alert(alerts.join('\n\n'));
    } catch (err) {
      console.error('Error running diagnostics:', err);
      setError('Failed to run diagnostics. Please try again.');
    }
  };

  // ============================================================
  // RENDER HELPERS
  // ============================================================
  
  const getVehicleIcon = (type: string) => {
    const t = safeStr(type).toLowerCase();
    if (t.includes('car') || t.includes('suv')) return <Car className="w-5 h-5" />;
    if (t.includes('bike') || t.includes('motorcycle')) return <Bike className="w-5 h-5" />;
    if (t.includes('truck')) return <Truck className="w-5 h-5" />;
    if (t.includes('bus')) return <Bus className="w-5 h-5" />;
    return <Car className="w-5 h-5" />;
  };

  const renderVehicleCard = (vehicle: SimpleVehicle) => {
    const name = safeStr(vehicle.name);
    const brand = safeStr(vehicle.brand);
    const model = safeStr(vehicle.model);
    const plate = safeStr(vehicle.plate);
    const fuelType = safeStr(vehicle.fuelType);
    const mileage = safeNum(vehicle.mileage);
    const insuranceExpiry = safeDate(vehicle.insuranceExpiry);
    const pucExpiry = safeDate(vehicle.pucExpiry);
    const serviceDue = safeDate(vehicle.serviceDue);
    
    const isInsValid = insuranceExpiry ? new Date(insuranceExpiry) > new Date() : false;
    const isPucValid = pucExpiry ? new Date(pucExpiry) > new Date() : false;
    
    return (
      <div
        key={vehicle.id}
        onClick={() => {
          setSelectedId(vehicle.id);
          setShowDetail(true);
        }}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-500 transition-all cursor-pointer space-y-3 group"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl text-indigo-600 flex items-center justify-center font-bold">
              {getVehicleIcon(vehicle.type)}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600">{name || 'Unnamed'}</h3>
              <p className="text-xs text-slate-500">{brand} {model} • {vehicle.year}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{plate}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vehicle.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {vehicle.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Fuel</span>
            <span className="font-bold text-slate-700">{fuelType}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Mileage</span>
            <span className="font-bold text-slate-700">{mileage > 0 ? `${mileage} km/L` : 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Docs</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              {isInsValid ? <Shield className="w-3.5 h-3.5 text-emerald-500" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
              {isPucValid ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
            </div>
          </div>
        </div>
        
        {serviceDue && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-50 pt-2">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px]">
              Service due: <strong className="text-slate-700">{serviceDue}</strong>
            </span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-xs font-bold text-slate-600">Loading vehicles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🚗</span>
              <h2 className="text-xl font-black tracking-tight">Vehicle Fuel, PUC & Service Care</h2>
            </div>
            <p className="text-xs text-indigo-100 mt-1">
              Complete maintenance tracking, fuel logs, service reminders & expenses for your family fleet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddVehicle(true)}
              className="px-4 py-2 rounded-xl bg-white text-indigo-800 text-xs font-black hover:bg-indigo-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-700 text-xs font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search vehicles by name, brand, model, or plate..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
          <Car className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-xs text-slate-500">No vehicles found matching search query.</p>
          <button
            onClick={() => setShowAddVehicle(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map(renderVehicleCard)}
        </div>
      )}

      {/* VEHICLE DETAIL MODAL */}
      {showDetail && selectedVehicle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="sticky top-0 bg-white z-10 border-b border-slate-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                  {getVehicleIcon(selectedVehicle.type)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{selectedVehicle.name}</h3>
                  <p className="text-xs text-slate-500">{selectedVehicle.brand} {selectedVehicle.model} • {selectedVehicle.plate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditVehicle(selectedVehicle);
                    setShowEditVehicle(true);
                    setShowDetail(false);
                  }}
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                  title="Edit Vehicle"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteVehicle(selectedVehicle.id)}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold cursor-pointer"
                  title="Delete Vehicle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats & Insurance Renewal Countdown */}
              {(() => {
                const today = new Date();
                const expDate = selectedVehicle.insuranceExpiry ? new Date(selectedVehicle.insuranceExpiry) : null;
                const diffTime = expDate ? expDate.getTime() - today.getTime() : null;
                const remainingDays = diffTime !== null ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : null;

                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Odometer Run</span>
                        <span className="text-sm font-black text-slate-800">{selectedVehicle.odometer?.toLocaleString() || 0} km</span>
                        <span className="text-[9px] text-slate-500 font-bold block">~{selectedVehicle.dailyRunKm || 25} km/day</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Avg Mileage</span>
                        <span className="text-sm font-black text-emerald-700">{selectedVehicle.mileage > 0 ? `${selectedVehicle.mileage} km/L` : 'N/A'}</span>
                      </div>
                      <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100 text-center">
                        <span className="text-[10px] font-bold text-indigo-900 uppercase block">Insurance Type</span>
                        <span className="text-xs font-black text-indigo-950 block truncate">{selectedVehicle.insuranceType || '1st Party'}</span>
                      </div>
                      <div className={`p-3 rounded-2xl border text-center ${
                        remainingDays !== null && remainingDays <= 30
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        <span className="text-[10px] font-bold uppercase block">Renewal Countdown</span>
                        <span className="text-sm font-black block">
                          {remainingDays !== null
                            ? remainingDays < 0 ? 'Expired 🚨' : `${remainingDays} Days Left`
                            : 'Set Expiry'}
                        </span>
                      </div>
                    </div>

                    {/* Extended Insurance Details Card */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-slate-900 flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-indigo-600" /> Policy Information ({selectedVehicle.insuranceType || '1st Party'})
                        </h4>
                        <span className="text-[10px] font-bold text-slate-500">Exp: {selectedVehicle.insuranceExpiry || 'N/A'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase">Provider</span>
                          <span>{selectedVehicle.insuranceProvider || 'Primary Insurer'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase">Policy No.</span>
                          <span className="font-mono">{selectedVehicle.insurancePolicyNo || 'POL-9048102'}</span>
                        </div>
                      </div>

                      {/* Attached Document Image */}
                      {selectedVehicle.insuranceDocUrl && (
                        <div className="pt-2">
                          <span className="text-[10px] font-bold text-slate-500 block mb-1">📷 Insurance Policy Document / Image Paper:</span>
                          <img
                            src={selectedVehicle.insuranceDocUrl}
                            alt="Insurance Document"
                            className="max-h-40 rounded-xl border border-slate-200 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowAddFuel(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Fuel className="w-4 h-4" /> Log Fuel
                </button>
                <button
                  onClick={() => setShowAddService(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-4 h-4" /> Log Service
                </button>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" /> Add Expense
                </button>
                <button
                  onClick={() => setShowAddReminder(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-4 h-4" /> Add Reminder
                </button>
                <button
                  onClick={handleRunDiagnostics}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Zap className="w-4 h-4" /> AI Health Audit
                </button>
              </div>

              {/* Fuel logs */}
              {vehicleFuelLogs.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Fuel History</h4>
                  <div className="space-y-2">
                    {vehicleFuelLogs.map(log => (
                      <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{log.liters} Liters • NPR {log.cost}</p>
                          <p className="text-[10px] text-slate-400">{log.date} • Odometer: {log.odometer} km • {log.station || 'Petrol Pump'}</p>
                        </div>
                        {log.mileage > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {log.mileage.toFixed(1)} km/L
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service logs */}
              {vehicleServices.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Service History</h4>
                  <div className="space-y-2">
                    {vehicleServices.map(sr => (
                      <div key={sr.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{sr.type} ({sr.provider || 'Garage'})</p>
                          <p className="text-[10px] text-slate-400">Date: {sr.date} • Odometer: {sr.odometer} km</p>
                        </div>
                        <span className="font-black text-slate-900">NPR {sr.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reminders */}
              {vehicleReminders.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Reminders</h4>
                  <div className="space-y-2">
                    {vehicleReminders.map(rem => (
                      <div key={rem.id} className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-indigo-950">{rem.title}</p>
                          <p className="text-[10px] text-indigo-700">Due: {rem.dueDate} ({rem.type})</p>
                        </div>
                        <button
                          onClick={() => handleToggleReminder(rem.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer ${
                            rem.isDone ? 'bg-emerald-600 text-white' : 'bg-white text-indigo-800 border'
                          }`}
                        >
                          {rem.isDone ? 'Done ✓' : 'Mark Done'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Add New Vehicle</h3>
              <button onClick={() => setShowAddVehicle(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vehicle Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Honda City"
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand *</label>
                <input
                  type="text"
                  placeholder="e.g. Honda"
                  value={newVehicle.brand}
                  onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Model</label>
                <input
                  type="text"
                  placeholder="e.g. City"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">License Plate *</label>
                <input
                  type="text"
                  placeholder="e.g. BA 1 KHA 1234"
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vehicle Type</label>
                <select
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Fuel Type</label>
                <select
                  value={newVehicle.fuelType}
                  onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Odometer (Total Run KM)</label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  value={newVehicle.odometer || ''}
                  onChange={(e) => setNewVehicle({ ...newVehicle, odometer: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Estimated Daily Run (KM / Day)</label>
                <input
                  type="number"
                  placeholder="e.g. 35"
                  value={newVehicle.dailyRunKm || 25}
                  onChange={(e) => setNewVehicle({ ...newVehicle, dailyRunKm: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              {/* INSURANCE DETAILED OPTIONS */}
              <div className="col-span-1 sm:col-span-2 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" /> Insurance & Policy Renewal Details
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Insurance Cover Type *</label>
                    <select
                      value={newVehicle.insuranceType}
                      onChange={(e) => setNewVehicle({ ...newVehicle, insuranceType: e.target.value as any })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="1st Party (Comprehensive)">1st Party (Comprehensive / Full Cover)</option>
                      <option value="Zero Depreciation">Zero Depreciation (Bumper to Bumper)</option>
                      <option value="2nd Party">2nd Party Cover</option>
                      <option value="3rd Party (Liability)">3rd Party (Liability Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Insurance Provider Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Oriental / HDFC ERGO / Shikhar"
                      value={newVehicle.insuranceProvider}
                      onChange={(e) => setNewVehicle({ ...newVehicle, insuranceProvider: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Insurance Policy Number</label>
                    <input
                      type="text"
                      placeholder="e.g. POL-88239102-99"
                      value={newVehicle.insurancePolicyNo}
                      onChange={(e) => setNewVehicle({ ...newVehicle, insurancePolicyNo: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Insurance Expiry Renewal Date</label>
                    <input
                      type="date"
                      value={newVehicle.insuranceExpiry}
                      onChange={(e) => setNewVehicle({ ...newVehicle, insuranceExpiry: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-indigo-900"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Upload Insurance Document / Paper Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setNewVehicle({ ...newVehicle, insuranceDocUrl: ev.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-700"
                    />
                    {newVehicle.insuranceDocUrl && (
                      <p className="text-[10px] text-emerald-700 mt-1 font-bold">✓ Insurance paper image attached!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddVehicle(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVehicle}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-md"
              >
                Save Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT VEHICLE MODAL */}
      {showEditVehicle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Edit Vehicle</h3>
              <button onClick={() => setShowEditVehicle(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vehicle Name *</label>
                <input
                  type="text"
                  value={editVehicle.name}
                  onChange={(e) => setEditVehicle({ ...editVehicle, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand *</label>
                <input
                  type="text"
                  value={editVehicle.brand}
                  onChange={(e) => setEditVehicle({ ...editVehicle, brand: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">License Plate *</label>
                <input
                  type="text"
                  value={editVehicle.plate}
                  onChange={(e) => setEditVehicle({ ...editVehicle, plate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Odometer (km)</label>
                <input
                  type="number"
                  value={editVehicle.odometer || ''}
                  onChange={(e) => setEditVehicle({ ...editVehicle, odometer: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowEditVehicle(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateVehicle}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-md"
              >
                Update Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FUEL MODAL */}
      {showAddFuel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Log Fuel Fill-Up</h3>
              <button onClick={() => setShowAddFuel(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Date *</label>
                <input
                  type="date"
                  value={newFuel.date}
                  onChange={(e) => setNewFuel({ ...newFuel, date: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Liters *</label>
                  <input
                    type="number"
                    placeholder="e.g. 35"
                    value={newFuel.liters || ''}
                    onChange={(e) => setNewFuel({ ...newFuel, liters: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cost (NPR) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={newFuel.cost || ''}
                    onChange={(e) => setNewFuel({ ...newFuel, cost: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Odometer (km)</label>
                <input
                  type="number"
                  placeholder="e.g. 25400"
                  value={newFuel.odometer || ''}
                  onChange={(e) => setNewFuel({ ...newFuel, odometer: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Station Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kathmandu Fuel Center"
                  value={newFuel.station}
                  onChange={(e) => setNewFuel({ ...newFuel, station: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddFuel(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFuel}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-md"
              >
                Save Fuel Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {showAddService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Log Service & Maintenance</h3>
              <button onClick={() => setShowAddService(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Type *</label>
                <select
                  value={newService.type}
                  onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Oil Change">Oil Change & Filter</option>
                  <option value="Full Service">Annual Full Service</option>
                  <option value="Tire Rotation">Tire Alignment & Rotation</option>
                  <option value="Brake Pad">Brake Pad Replacement</option>
                  <option value="Battery">Battery Check / Replacement</option>
                  <option value="AC Filter">AC Service & Gas</option>
                  <option value="General Repair">General Repair</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date *</label>
                  <input
                    type="date"
                    value={newService.date}
                    onChange={(e) => setNewService({ ...newService, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cost (NPR) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 4500"
                    value={newService.cost || ''}
                    onChange={(e) => setNewService({ ...newService, cost: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Provider / Garage</label>
                <input
                  type="text"
                  placeholder="e.g. Authorized Service Center"
                  value={newService.provider}
                  onChange={(e) => setNewService({ ...newService, provider: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Next Recommended Service Date</label>
                <input
                  type="date"
                  value={newService.nextServiceDate}
                  onChange={(e) => setNewService({ ...newService, nextServiceDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddService(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-md"
              >
                Save Service Log
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
              <h3 className="text-sm font-black text-slate-900">Add Vehicle Expense</h3>
              <button onClick={() => setShowAddExpense(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Fuel">Fuel</option>
                  <option value="Insurance Renewal">Insurance Renewal</option>
                  <option value="PUC Renewal">PUC Renewal</option>
                  <option value="Cleaning & Washing">Cleaning & Washing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Toll & Parking">Toll & Parking</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount (NPR) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={newExpense.amount || ''}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date *</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Insurance Renewal"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
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
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 cursor-pointer shadow-md"
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
              <h3 className="text-sm font-black text-slate-900">Add Service / Document Alert</h3>
              <button onClick={() => setShowAddReminder(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reminder Title *</label>
                <input
                  type="text"
                  placeholder="e.g. PUC Checkup Renewal Due"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type</label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Service">Service</option>
                    <option value="Insurance">Insurance</option>
                    <option value="PUC">PUC Certificate</option>
                    <option value="Tax">Bluebook Tax</option>
                  </select>
                </div>
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
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 cursor-pointer shadow-md"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleCareTracker;
