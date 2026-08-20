import React, { useState } from 'react';
import {
  Building,
  Home,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PropertyItem } from './propertyTypes';

interface PropertyPortfolioTabProps {
  properties: PropertyItem[];
  selectedPropertyId: string;
  onSelectProperty: (property: PropertyItem) => void;
  onOpenAddProperty: () => void;
  onEditProperty: (property: PropertyItem) => void;
}

export const PropertyPortfolioTab: React.FC<PropertyPortfolioTabProps> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  onOpenAddProperty,
  onEditProperty
}) => {
  const [viewMode, setViewMode] = useState<'All' | 'Professional'>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPortfolioValue = properties.reduce(
    (sum, p) => sum + (p.currentEstimatedValue || 0),
    0
  );
  const totalMonthlyRentalIncome = properties.reduce(
    (sum, p) => sum + (p.monthlyRent || 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Top Portfolio Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-orange-100 rounded-3xl p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Total Portfolio Value
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            NPR {(totalPortfolioValue / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] font-bold text-emerald-600">
            Across {properties.length} prime properties
          </span>
        </div>

        <div className="bg-white border border-orange-100 rounded-3xl p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Gross Monthly Rent
          </span>
          <div className="text-lg sm:text-xl font-black text-[#FF5A36] mt-1">
            NPR {totalMonthlyRentalIncome.toLocaleString()}
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            Yield ~ {((totalMonthlyRentalIncome * 12) / totalPortfolioValue * 100).toFixed(1)}% p.a.
          </span>
        </div>

        <div className="bg-white border border-orange-100 rounded-3xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Active Leases
            </span>
            <div className="text-lg sm:text-xl font-black text-indigo-600 mt-1">
              {properties.filter((p) => p.status === 'Rented Out').length} Occupied
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              {properties.filter((p) => p.status === 'Under Renovation').length} in renovation
            </span>
          </div>
          <button
            onClick={onOpenAddProperty}
            className="px-3.5 py-2 rounded-2xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Filter and Mode Toggle Header */}
      <div className="bg-white border border-orange-100 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Toggle Mode: All Properties / Professional Mode */}
        <div className="flex items-center gap-1.5 bg-orange-50/70 p-1 rounded-2xl border border-orange-200/60 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('All')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewMode === 'All'
                ? 'bg-[#FF5A36] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setViewMode('Professional')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewMode === 'Professional'
                ? 'bg-[#FF5A36] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Professional Mode
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search property or location..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-400"
            />
          </div>
        </div>
      </div>

      {/* Properties Grid - Designed identically to the screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProperties.map((prop) => {
          const isSelected = prop.id === selectedPropertyId;
          return (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className={`bg-white rounded-3xl border transition-all overflow-hidden cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#FF5A36] ring-2 ring-[#FF5A36]/20 shadow-md'
                  : 'border-orange-100 hover:border-orange-300 shadow-xs'
              }`}
            >
              {/* Photo & Status Overlay */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={
                    prop.photos?.[0] ||
                    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={prop.name || 'Property'}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs backdrop-blur-md ${
                      prop.status === 'Rented Out'
                        ? 'bg-emerald-600/90 text-white'
                        : prop.status === 'Owner-Occupied'
                        ? 'bg-blue-600/90 text-white'
                        : 'bg-amber-600/90 text-white'
                    }`}
                  >
                    {prop.status}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-[#FF5A36] text-white shadow-xs">
                      Active
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProperty(prop);
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-xs backdrop-blur-sm cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-xl text-white text-[11px] font-black">
                  NPR {prop.currentEstimatedValue ? (prop.currentEstimatedValue / 100000).toFixed(0) + ' Lakhs' : 'Valuation N/A'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      {prop.name}
                    </h3>
                    <span className="text-xs font-bold text-slate-400">{prop.type}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">
                      {prop.address}, {prop.city}
                    </span>
                  </div>
                </div>

                {/* Specs Pill List (Beds, Baths, Area) */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600">
                  {prop.bedrooms !== undefined && (
                    <span className="px-2.5 py-1 bg-orange-50/70 border border-orange-200/60 rounded-xl flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-orange-500" />
                      {prop.bedrooms} Beds
                    </span>
                  )}
                  {prop.bathrooms !== undefined && (
                    <span className="px-2.5 py-1 bg-orange-50/70 border border-orange-200/60 rounded-xl flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-orange-500" />
                      {prop.bathrooms} Baths
                    </span>
                  )}
                  <span className="px-2.5 py-1 bg-orange-50/70 border border-orange-200/60 rounded-xl flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-orange-500" />
                    {prop.areaTotal || 1000} {prop.areaUnit || 'sq ft'}
                  </span>
                </div>

                {/* Professional Mode Extra Stats */}
                {viewMode === 'Professional' && (
                  <div className="pt-2 border-t border-dashed border-slate-200 grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block">Monthly Rent</span>
                      <span className="text-slate-900 font-black">
                        NPR {(Number(prop.monthlyRent) || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block">Land Registry #</span>
                      <span className="text-slate-900 font-black truncate block">
                        {prop.landRegistryNumber || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
