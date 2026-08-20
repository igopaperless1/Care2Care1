import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  FileCheck,
  Building,
  Calendar
} from 'lucide-react';
import { PropertyDocument, PropertyItem } from './propertyTypes';

interface DocumentsTabProps {
  documents: PropertyDocument[];
  properties: PropertyItem[];
  onUploadDocument: (doc: PropertyDocument) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  properties,
  onUploadDocument
}) => {
  const [filterType, setFilterType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Doc Form
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<PropertyDocument['type']>('Lease');
  const [propId, setPropId] = useState(properties[0]?.id || 'prop-lakeview');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All Types' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const prop = properties.find((p) => p.id === propId) || properties[0];

    const newDoc: PropertyDocument = {
      id: `doc-${Date.now()}`,
      propertyId: prop.id,
      propertyName: prop.name,
      title,
      type: docType,
      fileName: `${title.replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.4 MB',
      uploadDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      fileUrl: '#'
    };

    onUploadDocument(newDoc);
    setShowUploadModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="bg-white border border-orange-100 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-1.5 bg-orange-50/70 border border-orange-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="All Types">All Types</option>
            <option value="Lease">Lease Agreements</option>
            <option value="Deed">Property Deeds & Lalpurja</option>
            <option value="Insurance">Insurance Policies</option>
            <option value="Utility Bill">Utility Bills</option>
            <option value="Invoice">Repair Invoices</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search document names..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          />
        </div>
      </div>

      {/* Document Items List (Exact visual match to screenshot) */}
      <div className="space-y-2.5">
        {filteredDocs.map((doc) => {
          // Color badge based on doc type
          const badgeColor =
            doc.type === 'Lease'
              ? 'bg-red-50 text-red-600 border-red-200'
              : doc.type === 'Deed'
              ? 'bg-amber-50 text-amber-600 border-amber-200'
              : doc.type === 'Insurance'
              ? 'bg-sky-50 text-sky-600 border-sky-200'
              : doc.type === 'Utility Bill'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-purple-50 text-purple-600 border-purple-200';

          return (
            <div
              key={doc.id}
              className="p-4 bg-white border border-orange-100 hover:border-orange-200 rounded-3xl flex items-center justify-between gap-3 shadow-xs transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${badgeColor}`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">{doc.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mt-0.5">
                    <span className="uppercase text-[#FF5A36] font-black">PDF</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                    <span>•</span>
                    <span className="text-slate-400">{doc.propertyName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-400 hidden sm:inline-block">
                  {doc.uploadDate}
                </span>
                <button
                  onClick={() => alert(`Downloading ${doc.fileName}...`)}
                  className="w-9 h-9 rounded-xl bg-orange-50 hover:bg-[#FF5A36] text-[#FF5A36] hover:text-white border border-orange-200 flex items-center justify-center transition-colors cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Document CTA Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Upload className="w-4 h-4" />
        <span>+ Upload Document</span>
      </button>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl space-y-4 border border-orange-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Upload Property Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property</label>
                <select
                  value={propId}
                  onChange={(e) => setPropId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solar Installation Agreement"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Lease">Lease Agreement</option>
                  <option value="Deed">Property Deed / Lalpurja</option>
                  <option value="Insurance">Insurance Policy</option>
                  <option value="Utility Bill">Utility Bill</option>
                  <option value="Invoice">Repair / Maintenance Invoice</option>
                </select>
              </div>

              {/* Upload Dropzone */}
              <div className="p-4 border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50/40 text-center space-y-1.5 cursor-pointer">
                <Upload className="w-6 h-6 text-[#FF5A36] mx-auto" />
                <p className="text-xs font-bold text-slate-800">Select PDF, JPG or PNG</p>
                <span className="text-[10px] text-slate-400">Up to 25MB</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
