import React, { useState } from 'react';
import {
  Phone,
  Star,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  Award,
  UserCheck,
  Mail
} from 'lucide-react';
import { VendorContact, TicketCategory } from './propertyTypes';

interface VendorsTabProps {
  vendors: VendorContact[];
  onAddVendor: (vendor: VendorContact) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({ vendors, onAddVendor }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Vendor Form
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Plumbing');
  const [phone, setPhone] = useState('');
  const [license, setLicense] = useState('');

  const categories = ['All', 'Plumber', 'Electrician', 'HVAC', 'Painting', 'Landscaping'];

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Plumber') return matchesSearch && v.category === 'Plumbing';
    if (activeCategory === 'Electrician') return matchesSearch && v.category === 'Electrical';
    return matchesSearch && v.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newVendor: VendorContact = {
      id: `ven-${Date.now()}`,
      name,
      contactPerson: contactPerson || name,
      category,
      phone: phone || '+977 9851000000',
      licenseNumber: license || `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 4.8,
      reviewsCount: 1,
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    onAddVendor(newVendor);
    setShowAddModal(false);
    setName('');
    setContactPerson('');
    setPhone('');
    setLicense('');
  };

  return (
    <div className="space-y-4">
      {/* Category Pills & Search */}
      <div className="bg-white border border-orange-100 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#FF5A36] text-white shadow-xs'
                    : 'bg-orange-50/60 text-slate-700 hover:bg-orange-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Vendors List (Exact visual match to screenshot) */}
      <div className="space-y-2.5">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="p-4 bg-white border border-orange-100 hover:border-orange-200 rounded-3xl flex items-center justify-between gap-3 shadow-xs transition-all"
          >
            <div className="flex items-center gap-3.5">
              <img
                src={vendor.avatar}
                alt={vendor.name}
                className="w-12 h-12 rounded-2xl object-cover border border-orange-200 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">{vendor.name}</h3>
                  {vendor.isPreferred && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Preferred
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                  {vendor.category} • License #{vendor.licenseNumber}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[11px] font-black text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{vendor.rating}</span>
                  <span className="text-slate-400 font-bold">({vendor.reviewsCount})</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${vendor.phone}`}
              className="w-10 h-10 rounded-2xl bg-orange-50 hover:bg-[#FF5A36] text-[#FF5A36] hover:text-white border border-orange-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title={`Call ${vendor.name}`}
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

      {/* Bottom Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add New Vendor</span>
      </button>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl space-y-4 border border-orange-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Add New Contractor / Vendor</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Trade Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nepal Solar Experts"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Ramesh Giri"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Painting">Painting</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Landscaping">Landscaping</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 98..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder="e.g. PL-9921"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
