import React, { useState } from 'react';
import {
  Building,
  MapPin,
  FileText,
  Camera,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Layers,
  DollarSign,
  Shield,
  Home
} from 'lucide-react';
import { PropertyItem, PropertyType, PropertyStatus, OwnershipType } from './propertyTypes';

interface AddPropertyWizardTabProps {
  onSaveProperty: (property: PropertyItem) => void;
  onCancel: () => void;
}

export const AddPropertyWizardTab: React.FC<AddPropertyWizardTabProps> = ({
  onSaveProperty,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState<Partial<PropertyItem>>({
    name: 'Lakeview Apartment',
    type: 'Apartment / Condo',
    status: 'Rented Out',
    ownershipType: 'Self-Owned',
    address: 'Lakeside, Pokhara, Nepal',
    city: 'Pokhara',
    state: 'Gandaki',
    country: 'Nepal',
    pincode: '33700',
    landRegistryNumber: '12-1-45-678',
    areaTotal: 1100,
    areaUnit: 'sq ft',
    builtUpArea: 1100,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpots: 1,
    currentEstimatedValue: 24500000,
    currency: 'NPR',
    monthlyRent: 50000,
    securityDeposit: 100000,
    occupancyRate: 100,
    nextRentDueDate: '2025-06-01',
    annualMaintenanceCost: 18450,
    propertyTax: 22000,
    insuranceProvider: 'Siddhartha Premier Insurance',
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
    ],
    documentsCount: 2,
    isActive: true
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      // Final submit
      const newProperty: PropertyItem = {
        id: `prop-${Date.now()}`,
        name: formData.name || 'New Property',
        type: formData.type || 'Apartment / Condo',
        status: formData.status || 'Owner-Occupied',
        ownershipType: formData.ownershipType || 'Self-Owned',
        address: formData.address || 'Kathmandu, Nepal',
        city: formData.city || 'Kathmandu',
        state: formData.state || 'Bagmati',
        country: formData.country || 'Nepal',
        pincode: formData.pincode || '44600',
        landRegistryNumber: formData.landRegistryNumber || '',
        areaTotal: Number(formData.areaTotal) || 1000,
        areaUnit: formData.areaUnit || 'sq ft',
        builtUpArea: Number(formData.builtUpArea) || 1000,
        bedrooms: Number(formData.bedrooms) || 2,
        bathrooms: Number(formData.bathrooms) || 2,
        parkingSpots: Number(formData.parkingSpots) || 1,
        currentEstimatedValue: Number(formData.currentEstimatedValue) || 15000000,
        currency: 'NPR',
        monthlyRent: Number(formData.monthlyRent) || 0,
        securityDeposit: Number(formData.securityDeposit) || 0,
        occupancyRate: formData.status === 'Rented Out' ? 100 : 0,
        nextRentDueDate: formData.nextRentDueDate || '2025-06-01',
        annualMaintenanceCost: Number(formData.annualMaintenanceCost) || 12000,
        propertyTax: Number(formData.propertyTax) || 20000,
        insuranceProvider: formData.insuranceProvider || '',
        photos: formData.photos?.length
          ? formData.photos
          : [
              'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
            ],
        documentsCount: 2,
        isActive: true
      };
      onSaveProperty(newProperty);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    } else {
      onCancel();
    }
  };

  return (
    <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6 max-w-3xl mx-auto">
      {/* Wizard Step Indicator Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-lg sm:text-xl font-black text-slate-900">Add New Property</h2>
        <span className="text-xs font-bold text-slate-400">Step {currentStep} of 4</span>
      </div>

      {/* Steps Pill Tabs */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { num: 1, label: 'Basic Info' },
          { num: 2, label: 'Location' },
          { num: 3, label: 'Details' },
          { num: 4, label: 'Photos & Docs' }
        ].map((step) => {
          const isActive = currentStep === step.num;
          const isPassed = currentStep > step.num;
          return (
            <div
              key={step.num}
              onClick={() => setCurrentStep(step.num as any)}
              className="cursor-pointer flex flex-col items-center gap-1.5"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  isActive
                    ? 'bg-[#FF5A36] text-white ring-4 ring-orange-100'
                    : isPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isPassed ? <Check className="w-3.5 h-3.5" /> : step.num}
              </div>
              <span
                className={`text-[10px] font-bold truncate max-w-full ${
                  isActive ? 'text-[#FF5A36]' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: Basic Info */}
      {currentStep === 1 && (
        <div className="space-y-4 pt-2">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            Property Identity
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property Name / Nickname
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Lakeview Apartment"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property Type
            </label>
            <select
              value={formData.type || 'Apartment / Condo'}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as PropertyType })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-400"
            >
              <option value="Apartment / Condo">Apartment / Condo</option>
              <option value="Residential House">Residential House</option>
              <option value="Commercial Office / Space">Commercial Office / Space</option>
              <option value="Villa / Bungalow">Villa / Bungalow</option>
              <option value="Agricultural Land">Agricultural Land</option>
              <option value="Vacant Plot">Vacant Plot</option>
              <option value="Townhouse">Townhouse</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property Status
            </label>
            <select
              value={formData.status || 'Rented Out'}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as PropertyStatus })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-400"
            >
              <option value="Owner-Occupied">Owner-Occupied</option>
              <option value="Rented Out">Rented Out</option>
              <option value="Under Renovation">Under Renovation</option>
              <option value="Vacant">Vacant</option>
              <option value="Listed For Sale">Listed For Sale</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ownership Model
            </label>
            <select
              value={formData.ownershipType || 'Self-Owned'}
              onChange={(e) =>
                setFormData({ ...formData, ownershipType: e.target.value as OwnershipType })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-400"
            >
              <option value="Self-Owned">Self-Owned</option>
              <option value="Joint Ownership">Joint Ownership</option>
              <option value="Family Trust">Family Trust</option>
              <option value="Leasehold">Leasehold</option>
            </select>
          </div>
        </div>
      )}

      {/* STEP 2: Legal & Location */}
      {currentStep === 2 && (
        <div className="space-y-4 pt-2">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            Legal & Location
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Physical Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Lakeside, Pokhara, Nepal"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-400 pr-10"
              />
              <MapPin className="w-4 h-4 text-orange-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Interactive Map Visual Mockup */}
          <div className="relative rounded-2xl overflow-hidden border border-orange-200 bg-orange-50/40 p-4 flex flex-col items-center justify-center min-h-[160px] text-center">
            <div className="w-10 h-10 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-md animate-bounce mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-xs font-black text-slate-900">{formData.address || 'Selected Location Pin'}</p>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5">GPS: 28.2096° N, 83.9571° E (Pokhara Valley)</p>
            <button
              type="button"
              className="mt-3 px-4 py-1.5 rounded-xl bg-[#FF5A36] text-white text-[11px] font-black shadow-xs hover:bg-[#E04826] cursor-pointer"
            >
              Use this location
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Pokhara"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Land Registry Number (Optional)
              </label>
              <input
                type="text"
                value={formData.landRegistryNumber || ''}
                onChange={(e) =>
                  setFormData({ ...formData, landRegistryNumber: e.target.value })
                }
                placeholder="e.g. 12-1-45-678"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Details & Rooms */}
      {currentStep === 3 && (
        <div className="space-y-4 pt-2">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            Property Specifications & Financials
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Area ({formData.areaUnit || 'sq ft'})
              </label>
              <input
                type="number"
                value={formData.areaTotal || ''}
                onChange={(e) => setFormData({ ...formData, areaTotal: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Area Unit
              </label>
              <select
                value={formData.areaUnit || 'sq ft'}
                onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="sq ft">sq ft</option>
                <option value="sq m">sq m</option>
                <option value="Ropani">Ropani</option>
                <option value="Bigha">Bigha</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms || 2}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms || 2}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parking</label>
              <input
                type="number"
                value={formData.parkingSpots || 1}
                onChange={(e) => setFormData({ ...formData, parkingSpots: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Monthly Rent (NPR)
              </label>
              <input
                type="number"
                value={formData.monthlyRent || 0}
                onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                placeholder="50000"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Security Deposit (NPR)
              </label>
              <input
                type="number"
                value={formData.securityDeposit || 0}
                onChange={(e) =>
                  setFormData({ ...formData, securityDeposit: Number(e.target.value) })
                }
                placeholder="100000"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Photos & Documents */}
      {currentStep === 4 && (
        <div className="space-y-4 pt-2">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            Property Media & Documentation
          </div>

          {/* Photo Gallery Picker */}
          <div className="p-4 border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50/30 text-center space-y-2">
            <Camera className="w-8 h-8 text-[#FF5A36] mx-auto" />
            <div className="text-xs font-black text-slate-800">
              Upload High-Resolution Property Photos
            </div>
            <p className="text-[11px] text-slate-400">
              Supports JPG, PNG up to 10MB each
            </p>
            <button
              type="button"
              className="px-4 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#FF5A36] text-xs font-black transition-colors cursor-pointer"
            >
              Select Images
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Insurance Provider
              </label>
              <input
                type="text"
                value={formData.insuranceProvider || ''}
                onChange={(e) =>
                  setFormData({ ...formData, insuranceProvider: e.target.value })
                }
                placeholder="e.g. Siddhartha Premier"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Annual Property Tax (NPR)
              </label>
              <input
                type="number"
                value={formData.propertyTax || 0}
                onChange={(e) =>
                  setFormData({ ...formData, propertyTax: Number(e.target.value) })
                }
                placeholder="22000"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons Row - Exactly as in the design */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleBack}
          className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer"
        >
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-2xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>{currentStep === 4 ? 'Save Property' : 'Next'}</span>
          {currentStep < 4 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
