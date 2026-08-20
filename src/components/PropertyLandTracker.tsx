import React, { useState, useEffect, useCallback } from 'react';
import {
  Building,
  Home,
  Plus,
  Wrench,
  DollarSign,
  Users,
  FileText,
  Zap,
  Phone,
  Settings,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import {
  PropertyItem,
  MaintenanceTicket,
  TenantInfo,
  RentPaymentEntry,
  VendorContact,
  PropertyDocument,
  UtilityRecord,
  TicketStatus
} from './property/propertyTypes';
import {
  INITIAL_PROPERTIES,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_TENANTS,
  INITIAL_RENT_PAYMENTS,
  INITIAL_VENDORS,
  INITIAL_DOCUMENTS,
  INITIAL_UTILITY_RECORDS
} from './property/propertyData';

// Sub-components
import { PropertyDashboardTab } from './property/PropertyDashboardTab';
import { PropertyPortfolioTab } from './property/PropertyPortfolioTab';
import { AddPropertyWizardTab } from './property/AddPropertyWizardTab';
import { MaintenanceTicketsTab } from './property/MaintenanceTicketsTab';
import { FinancialsTab } from './property/FinancialsTab';
import { VendorsTab } from './property/VendorsTab';
import { DocumentsTab } from './property/DocumentsTab';
import { UtilitiesTab } from './property/UtilitiesTab';
import { TenantsTab } from './property/TenantsTab';
import { RemindersAndSettingsTab } from './property/RemindersAndSettingsTab';

interface PropertyLandTrackerProps {
  patient?: any;
}

export type PropertyTabKey =
  | 'dashboard'
  | 'portfolio'
  | 'add_property'
  | 'tenants'
  | 'maintenance'
  | 'financials'
  | 'vendors'
  | 'documents'
  | 'utilities'
  | 'reminders_settings';

export const PropertyLandTracker: React.FC<PropertyLandTrackerProps> = () => {
  // State
  const [properties, setProperties] = useState<PropertyItem[]>(INITIAL_PROPERTIES);
  const [selectedPropId, setSelectedPropId] = useState<string>(INITIAL_PROPERTIES[0].id);
  const [activeTab, setActiveTab] = useState<PropertyTabKey>('dashboard');

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_MAINTENANCE_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(
    INITIAL_MAINTENANCE_TICKETS[0]
  );
  const [tenants, setTenants] = useState<TenantInfo[]>(INITIAL_TENANTS);
  const [payments, setPayments] = useState<RentPaymentEntry[]>(INITIAL_RENT_PAYMENTS);
  const [vendors, setVendors] = useState<VendorContact[]>(INITIAL_VENDORS);
  const [documents, setDocuments] = useState<PropertyDocument[]>(INITIAL_DOCUMENTS);
  const [utilityRecords, setUtilityRecords] = useState<UtilityRecord[]>(INITIAL_UTILITY_RECORDS);
  const [currency, setCurrency] = useState<string>('NPR');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('care2care_propertyData');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.properties) && parsed.properties.length > 0) {
          setProperties(parsed.properties);
        }
        if (Array.isArray(parsed.tickets)) setTickets(parsed.tickets);
        if (Array.isArray(parsed.tenants)) setTenants(parsed.tenants);
        if (Array.isArray(parsed.payments)) setPayments(parsed.payments);
        if (Array.isArray(parsed.vendors)) setVendors(parsed.vendors);
        if (Array.isArray(parsed.documents)) setDocuments(parsed.documents);
        if (Array.isArray(parsed.utilityRecords)) setUtilityRecords(parsed.utilityRecords);
        if (parsed.selectedPropId) setSelectedPropId(parsed.selectedPropId);
      }
    } catch (err) {
      console.error('Error loading property storage:', err);
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback(
    (customData?: Partial<{
      properties: PropertyItem[];
      tickets: MaintenanceTicket[];
      tenants: TenantInfo[];
      payments: RentPaymentEntry[];
      vendors: VendorContact[];
      documents: PropertyDocument[];
      utilityRecords: UtilityRecord[];
      selectedPropId: string;
    }>) => {
      try {
        const payload = {
          properties: customData?.properties || properties,
          tickets: customData?.tickets || tickets,
          tenants: customData?.tenants || tenants,
          payments: customData?.payments || payments,
          vendors: customData?.vendors || vendors,
          documents: customData?.documents || documents,
          utilityRecords: customData?.utilityRecords || utilityRecords,
          selectedPropId: customData?.selectedPropId || selectedPropId
        };
        localStorage.setItem('care2care_propertyData', JSON.stringify(payload));
      } catch (err) {
        console.error('Error saving property data:', err);
      }
    },
    [properties, tickets, tenants, payments, vendors, documents, utilityRecords, selectedPropId]
  );

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const activeProperty =
    properties.find((p) => p.id === selectedPropId) || properties[0] || INITIAL_PROPERTIES[0];

  // Actions
  const handleAddProperty = (newProperty: PropertyItem) => {
    const updated = [newProperty, ...properties];
    setProperties(updated);
    setSelectedPropId(newProperty.id);
    setActiveTab('dashboard');
    saveToStorage({ properties: updated, selectedPropId: newProperty.id });
    showNotification(`Added ${newProperty.name} to portfolio!`);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const steps = t.workflowSteps.map((step) => {
          if (step.status === newStatus) {
            return {
              ...step,
              completed: true,
              timestamp: 'Just now'
            };
          }
          return step;
        });
        return {
          ...t,
          status: newStatus,
          workflowSteps: steps
        };
      }
      return t;
    });
    setTickets(updated);
    const updatedSelected = updated.find((t) => t.id === ticketId) || null;
    setSelectedTicket(updatedSelected);
    saveToStorage({ tickets: updated });
    showNotification(`Ticket updated to ${newStatus}`);
  };

  const handleAddTicket = (ticket: MaintenanceTicket) => {
    const updated = [ticket, ...tickets];
    setTickets(updated);
    setSelectedTicket(ticket);
    saveToStorage({ tickets: updated });
    showNotification(`Logged new ticket ${ticket.ticketNumber}`);
  };

  const handleAddAfterPhoto = (ticketId: string, photoUrl: string) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          afterPhotos: [photoUrl]
        };
      }
      return t;
    });
    setTickets(updated);
    setSelectedTicket(updated.find((t) => t.id === ticketId) || null);
    saveToStorage({ tickets: updated });
    showNotification('Added completion verification photo!');
  };

  const handleLogPayment = (entry: RentPaymentEntry) => {
    const updated = [entry, ...payments];
    setPayments(updated);
    saveToStorage({ payments: updated });
    showNotification(`Logged rent payment of NPR ${entry.amount.toLocaleString()}`);
  };

  const handleAddVendor = (vendor: VendorContact) => {
    const updated = [vendor, ...vendors];
    setVendors(updated);
    saveToStorage({ vendors: updated });
    showNotification(`Saved vendor ${vendor.name}`);
  };

  const handleUploadDocument = (doc: PropertyDocument) => {
    const updated = [doc, ...documents];
    setDocuments(updated);
    saveToStorage({ documents: updated });
    showNotification(`Saved document ${doc.title}`);
  };

  const handleAddTenant = (tenant: TenantInfo) => {
    const updated = [tenant, ...tenants];
    setTenants(updated);
    saveToStorage({ tenants: updated });
    showNotification(`Added tenant lease for ${tenant.fullName}`);
  };

  const handleResetDemo = () => {
    setProperties(INITIAL_PROPERTIES);
    setTickets(INITIAL_MAINTENANCE_TICKETS);
    setTenants(INITIAL_TENANTS);
    setPayments(INITIAL_RENT_PAYMENTS);
    setVendors(INITIAL_VENDORS);
    setDocuments(INITIAL_DOCUMENTS);
    setUtilityRecords(INITIAL_UTILITY_RECORDS);
    setSelectedPropId(INITIAL_PROPERTIES[0].id);
    localStorage.removeItem('care2care_propertyData');
    showNotification('Reset to demo properties & tickets');
  };

  // Nav pills definitions
  const NAV_PILLS: Array<{ key: PropertyTabKey; label: string; icon: React.ReactNode }> = [
    { key: 'dashboard', label: 'Property Dashboard', icon: <Home className="w-3.5 h-3.5" /> },
    { key: 'portfolio', label: 'My Portfolio', icon: <Building className="w-3.5 h-3.5" /> },
    { key: 'add_property', label: '+ Add Property', icon: <Plus className="w-3.5 h-3.5" /> },
    { key: 'maintenance', label: 'Maintenance Tickets', icon: <Wrench className="w-3.5 h-3.5" /> },
    { key: 'financials', label: 'Financial Overview', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { key: 'tenants', label: 'Leases & Tenants', icon: <Users className="w-3.5 h-3.5" /> },
    { key: 'vendors', label: 'Vendors Directory', icon: <Phone className="w-3.5 h-3.5" /> },
    { key: 'documents', label: 'Documents Vault', icon: <FileText className="w-3.5 h-3.5" /> },
    { key: 'utilities', label: 'Utilities & Usage', icon: <Zap className="w-3.5 h-3.5" /> },
    { key: 'reminders_settings', label: 'Tax & Reminders', icon: <Shield className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900/90 text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-sm border border-slate-700 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER - Aligned with Water & Vehicle Care Archetype */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs shrink-0">
            <Building className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                Property Service
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">14 May 2025</span>
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">
              Property Care & Real Estate Portfolio
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {/* Quick Active Property Dropdown */}
          <div className="relative flex-1 sm:flex-initial min-w-0 max-w-[210px] sm:max-w-[240px]">
            <select
              value={selectedPropId}
              onChange={(e) => {
                setSelectedPropId(e.target.value);
                const prop = properties.find((p) => p.id === e.target.value);
                if (prop) showNotification(`Switched active view to ${prop.name}`);
              }}
              className="w-full appearance-none bg-white hover:bg-orange-50/60 text-slate-800 text-[11px] sm:text-xs font-bold py-1.5 pl-2.5 pr-7 rounded-xl sm:rounded-2xl border border-orange-200 cursor-pointer shadow-xs focus:outline-none truncate"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
            <ChevronRight className="w-3 h-3 text-orange-500 absolute right-2 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>

          <button
            onClick={() => setActiveTab('add_property')}
            className="shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-[11px] sm:text-xs font-black rounded-xl sm:rounded-2xl shadow-xs transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Property</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL PILL NAVIGATION MENU */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
        {NAV_PILLS.map((pill) => {
          const isActive = activeTab === pill.key;
          return (
            <button
              key={pill.key}
              onClick={() => setActiveTab(pill.key)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${
                isActive
                  ? 'bg-[#FF5A36] text-white'
                  : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200/80 hover:border-orange-200'
              }`}
            >
              {pill.icon}
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC TAB VIEWS */}
      {activeTab === 'dashboard' && (
        <PropertyDashboardTab
          activeProperty={activeProperty}
          tickets={tickets}
          documents={documents}
          onNavigateTab={(tab) => setActiveTab(tab as PropertyTabKey)}
          onOpenLogRent={() => setActiveTab('financials')}
          onOpenAddTicket={() => setActiveTab('maintenance')}
          onOpenUploadDoc={() => setActiveTab('documents')}
          onOpenEditDetails={() => setActiveTab('portfolio')}
          onSelectTicket={(ticket) => {
            setSelectedTicket(ticket);
            setActiveTab('maintenance');
          }}
        />
      )}

      {activeTab === 'portfolio' && (
        <PropertyPortfolioTab
          properties={properties}
          selectedPropertyId={selectedPropId}
          onSelectProperty={(prop) => {
            setSelectedPropId(prop.id);
            setActiveTab('dashboard');
            showNotification(`Switched active property to ${prop.name}`);
          }}
          onOpenAddProperty={() => setActiveTab('add_property')}
          onEditProperty={(prop) => {
            setSelectedPropId(prop.id);
            setActiveTab('dashboard');
          }}
        />
      )}

      {activeTab === 'add_property' && (
        <AddPropertyWizardTab
          onSaveProperty={handleAddProperty}
          onCancel={() => setActiveTab('dashboard')}
        />
      )}

      {activeTab === 'maintenance' && (
        <MaintenanceTicketsTab
          tickets={tickets}
          properties={properties}
          vendors={vendors}
          selectedTicket={selectedTicket}
          onSelectTicket={setSelectedTicket}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          onAddTicket={handleAddTicket}
          onAddAfterPhoto={handleAddAfterPhoto}
        />
      )}

      {activeTab === 'financials' && (
        <FinancialsTab
          properties={properties}
          payments={payments}
          onLogPayment={handleLogPayment}
        />
      )}

      {activeTab === 'tenants' && (
        <TenantsTab
          tenants={tenants}
          properties={properties}
          onAddTenant={handleAddTenant}
        />
      )}

      {activeTab === 'vendors' && (
        <VendorsTab
          vendors={vendors}
          onAddVendor={handleAddVendor}
        />
      )}

      {activeTab === 'documents' && (
        <DocumentsTab
          documents={documents}
          properties={properties}
          onUploadDocument={handleUploadDocument}
        />
      )}

      {activeTab === 'utilities' && (
        <UtilitiesTab
          properties={properties}
          utilityRecords={utilityRecords}
          onLogUtility={(record) => {
            const updated = [record, ...utilityRecords];
            setUtilityRecords(updated);
            saveToStorage({ utilityRecords: updated });
            showNotification('Saved monthly utility usage bill');
          }}
        />
      )}

      {activeTab === 'reminders_settings' && (
        <RemindersAndSettingsTab
          properties={properties}
          currency={currency}
          onUpdateCurrency={setCurrency}
          onResetDemoData={handleResetDemo}
        />
      )}
    </div>
  );
};
