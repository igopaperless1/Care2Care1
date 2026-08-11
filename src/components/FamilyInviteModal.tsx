import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Users,
  X,
  Copy,
  Check,
  Share2,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Link2,
  QrCode,
  UserPlus,
} from "lucide-react";
import { Patient } from "../types";

interface FamilyInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient | null;
}

export const FamilyInviteModal: React.FC<FamilyInviteModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const [role, setRole] = useState<"Co-Caregiver" | "Family Member" | "Physician" | "Staff Nurse">("Co-Caregiver");
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"link" | "qr">("link");

  if (!isOpen) return null;

  const familyCode = `CARE-${Math.floor(100000 + Math.random() * 900000)}`;
  const patientName = patient?.name || "Family Patient";
  const baseUrl = window.location.origin + window.location.pathname;
  const inviteUrl = `${baseUrl}?invite=${familyCode}&patient=${encodeURIComponent(patientName)}&role=${encodeURIComponent(role)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Join Care2Care family circle to support and monitor health for ${patientName}: ${inviteUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareEmail = () => {
    const subject = `Invitation to join ${patientName}'s Care2Care Circle`;
    const body = `Hi,\n\nYou have been invited as a ${role} to join ${patientName}'s Care2Care family dashboard context.\n\nClick here to accept invitation and access health logs: ${inviteUrl}\n\nSecurity Invitation Code: ${familyCode}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg">Invite Family & Caregivers</h2>
              <p className="text-xs text-emerald-100">
                Share dashboard context for <span className="font-bold underline">{patientName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Role Selection */}
          <div>
            <label className="block font-black text-slate-800 mb-2">
              Select Invitee Access Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Co-Caregiver", desc: "Full edit & log access" },
                { name: "Family Member", desc: "View vitals & update notes" },
                { name: "Physician", desc: "View medical reports & export" },
                { name: "Staff Nurse", desc: "Shift vitals & medicine logger" },
              ].map((r) => (
                <button
                  key={r.name}
                  onClick={() => setRole(r.name as any)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    role === r.name
                      ? "border-emerald-500 bg-emerald-50/70 text-slate-900 font-black shadow-2xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <p className="font-black text-xs">{r.name}</p>
                  <p className="text-[10px] text-slate-500">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Share Format Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab("link")}
              className={`flex items-center gap-1.5 pb-2 font-black border-b-2 text-xs transition-colors cursor-pointer ${
                activeTab === "link"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Shareable Invitation Link</span>
            </button>
            <button
              onClick={() => setActiveTab("qr")}
              className={`flex items-center gap-1.5 pb-2 font-black border-b-2 text-xs transition-colors cursor-pointer ${
                activeTab === "qr"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR Code</span>
            </button>
          </div>

          {activeTab === "link" ? (
            <div className="space-y-4">
              {/* Generated Link Field */}
              <div>
                <label className="block text-slate-500 font-bold mb-1">
                  Unique Family Security Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-3 py-2.5 text-slate-700 font-mono text-[11px] truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      isCopied
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-emerald-400" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share Channels */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleShareWhatsApp}
                  className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>
                <button
                  onClick={handleShareEmail}
                  className="p-3 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-md">
                <QRCodeSVG value={inviteUrl} size={160} level="H" />
              </div>
              <p className="text-center text-slate-500 text-[11px]">
                Scan with any smartphone camera to open and join{" "}
                <span className="font-bold text-slate-800">{patientName}</span>'s care circle.
              </p>
            </div>
          )}

          {/* Security Note */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Invitees will gain read/write access to vital logs and medications for this patient in real-time. Link automatically expires in 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
