import React, { useState } from "react";
import {
  FileText,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  Camera,
  Plus,
  CheckCircle2,
  X,
  Upload,
  Search,
  Filter,
  Eye,
  Trash2,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { SosIncident, IncidentStatus } from "./types";

interface SosIncidentsProps {
  incidents: SosIncident[];
  initialMode?: "list" | "report";
  onAddIncident: (incident: Omit<SosIncident, "id">) => void;
  onUpdateIncidentStatus?: (id: string, status: IncidentStatus) => void;
  onNotify: (msg: string) => void;
}

export const SosIncidents: React.FC<SosIncidentsProps> = ({
  incidents,
  initialMode = "list",
  onAddIncident,
  onUpdateIncidentStatus,
  onNotify
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"my_incidents" | "reported" | "all">("my_incidents");
  const [isReporting, setIsReporting] = useState<boolean>(initialMode === "report");
  const [selectedIncident, setSelectedIncident] = useState<SosIncident | null>(null);

  // Form State
  const [formType, setFormType] = useState<string>("Road Accident");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDate, setFormDate] = useState<string>("15 May 2025");
  const [formTime, setFormTime] = useState<string>("08:30 PM");
  const [formLocation, setFormLocation] = useState<string>("Kathmandu, Nepal (Tripureshwor)");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formSeverity, setFormSeverity] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [formPhotos, setFormPhotos] = useState<string[]>([]);

  const incidentTypes = [
    "Road Accident",
    "Harassment",
    "Theft",
    "Medical Emergency",
    "Physical Assault",
    "Fire Incident",
    "Lost / Missing Person",
    "Suspicious Activity",
    "Natural Hazard",
    "Other"
  ];

  const handleSimulatePhotoUpload = () => {
    const sampleImgs = [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=80"
    ];
    const picked = sampleImgs[formPhotos.length % sampleImgs.length];
    setFormPhotos((prev) => [...prev, picked]);
    onNotify("Photo evidence added to incident draft.");
  };

  const handleAutoDetectLocation = () => {
    setFormLocation("Tripureshwor Chowk, Kathmandu (27.6934° N, 85.3148° E)");
    onNotify("GPS Location detected.");
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formType || !formDescription.trim()) return;

    onAddIncident({
      type: formType,
      title: formTitle.trim() || `${formType} reported at ${formLocation.split(",")[0]}`,
      date: formDate,
      time: formTime,
      location: formLocation,
      description: formDescription.trim(),
      status: "Open",
      reportedBy: "Roshan",
      severity: formSeverity,
      photos: formPhotos
    });

    onNotify("Incident report submitted successfully!");
    setIsReporting(false);
    // Reset
    setFormTitle("");
    setFormDescription("");
    setFormPhotos([]);
  };

  return (
    <div className="space-y-4">
      {/* TOGGLE REPORT FORM / INCIDENTS LIST */}
      {!isReporting ? (
        <>
          {/* TABS (SCREEN 7: My Incidents | Reported) */}
          <div className="flex bg-[#FFF0EB] p-1 rounded-2xl border border-[#FFD9CC]">
            <button
              onClick={() => setActiveSubTab("my_incidents")}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activeSubTab === "my_incidents"
                  ? "bg-[#FF5A36] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Incidents ({incidents.length})
            </button>
            <button
              onClick={() => setActiveSubTab("reported")}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activeSubTab === "reported"
                  ? "bg-[#FF5A36] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Reported to Police
            </button>
          </div>

          {/* INCIDENTS LIST (SCREEN 7) */}
          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className="bg-white border border-[#FFE8DE] hover:border-orange-300 rounded-3xl p-5 shadow-xs transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        inc.type === "Road Accident"
                          ? "bg-rose-100 text-rose-600"
                          : inc.type === "Harassment"
                          ? "bg-purple-100 text-purple-600"
                          : inc.type === "Theft"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900">{inc.type}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {inc.date}, {inc.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold mt-0.5">
                        <MapPin className="w-3 h-3 text-[#FF5A36]" />
                        <span>{inc.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-xl border ${
                      inc.status === "Open"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : inc.status === "In Progress"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed bg-[#FFF9F5] p-3 rounded-2xl border border-orange-100">
                  {inc.description}
                </p>

                {inc.photos && inc.photos.length > 0 && (
                  <div className="flex items-center gap-2">
                    {inc.photos.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt="Proof"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ))}
                    <span className="text-[10px] font-bold text-slate-400">
                      +{inc.photos.length} Photo Evidence
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* REPORT INCIDENT BUTTON (SCREEN 7) */}
          <button
            onClick={() => setIsReporting(true)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A50] hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Report Incident</span>
          </button>
        </>
      ) : (
        /* SCREEN 8: REPORT INCIDENT FORM */
        <div className="bg-white border border-[#FFE8DE] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-orange-100/70 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Report Incident
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Provide details to create an encrypted safety record & alert responders
              </p>
            </div>
            <button
              onClick={() => setIsReporting(false)}
              className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmitReport} className="space-y-4">
            {/* Incident Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Incident Type *
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full p-3 text-xs bg-[#FFF9F5] border border-orange-200 rounded-2xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none font-semibold text-slate-800"
              >
                {incidentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Date *
                </label>
                <input
                  type="text"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Time *
                </label>
                <input
                  type="text"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Location *</label>
                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  className="text-[11px] font-bold text-[#FF5A36] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-detect GPS</span>
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#FF5A36] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Kathmandu, Nepal"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe what happened, vehicle registration numbers, attacker descriptions, or emergency status..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full p-3 text-xs bg-[#FFF9F5] border border-orange-200 rounded-2xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none"
              />
            </div>

            {/* Photos / Videos */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Photos / Videos
              </label>
              <div
                onClick={handleSimulatePhotoUpload}
                className="border-2 border-dashed border-orange-200 hover:border-[#FF5A36] rounded-2xl p-4 text-center bg-[#FFF9F5] cursor-pointer transition-colors space-y-1.5"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 text-[#FF5A36] flex items-center justify-center mx-auto">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-slate-800">
                  Add photos or videos
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Supports JPG, PNG, MP4 up to 50MB (Watermarked with GPS)
                </div>
              </div>

              {formPhotos.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {formPhotos.map((p, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={p}
                        alt="Upload"
                        className="w-14 h-14 rounded-xl object-cover border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormPhotos((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button (SCREEN 8) */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#FF5A36] hover:bg-[#E63920] text-white font-black text-xs shadow-xs cursor-pointer transition-all mt-2"
            >
              Submit Report
            </button>
          </form>
        </div>
      )}

      {/* INCIDENT DETAILS VIEW MODAL */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-orange-100 text-[#FF5A36]">
                  {selectedIncident.type}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {selectedIncident.date}
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-base font-black text-slate-900">
              {selectedIncident.title}
            </h3>

            <div className="p-3 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>{selectedIncident.location}</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {selectedIncident.description}
              </p>
            </div>

            {selectedIncident.photos && selectedIncident.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {selectedIncident.photos.map((p, idx) => (
                  <img
                    key={idx}
                    src={p}
                    alt="Proof"
                    className="w-full h-28 rounded-xl object-cover border border-slate-200"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-500">
                Status: {selectedIncident.status}
              </span>
              <button
                onClick={() => {
                  if (onUpdateIncidentStatus) {
                    onUpdateIncidentStatus(
                      selectedIncident.id,
                      selectedIncident.status === "Open" ? "In Progress" : "Closed"
                    );
                  }
                  setSelectedIncident(null);
                  onNotify("Incident status updated.");
                }}
                className="px-4 py-2 rounded-xl bg-orange-100 text-[#FF5A36] text-xs font-bold hover:bg-orange-200"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
