import React, { useState } from "react";
import { INITIAL_SHARED_ITEMS } from "./data";
import { Share2, Plus, Users, Clock, ShieldCheck, Trash2, Link, Check, X } from "lucide-react";
import { SharedVaultItem } from "./types";

export const PasswordSharingCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"by_me" | "with_me">("by_me");
  const [sharedItems, setSharedItems] = useState<SharedVaultItem[]>(INITIAL_SHARED_ITEMS);
  const [isSharing, setIsSharing] = useState(false);
  const [itemToShare, setItemToShare] = useState("Netflix Account");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<"Read Only" | "Can Edit" | "Full Access">("Read Only");

  const handleShare = () => {
    if (!recipientEmail) return;
    const newItem: SharedVaultItem = {
      id: "sh-" + Date.now(),
      title: itemToShare,
      sharedWith: recipientEmail,
      accessLevel,
      expiresIn: "7 days",
      sharedDate: "Today",
    };
    setSharedItems((prev) => [newItem, ...prev]);
    setIsSharing(false);
    setRecipientEmail("");
  };

  const handleRevoke = (id: string) => {
    setSharedItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TABS & SHARE BUTTON */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("by_me")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "by_me"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Shared by Me ({sharedItems.length})
          </button>
          <button
            onClick={() => setActiveTab("with_me")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "with_me"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Shared with Me (2)
          </button>
        </div>

        <button
          onClick={() => setIsSharing(true)}
          className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Share Item</span>
        </button>
      </div>

      {/* SHARE MODAL/BAR */}
      {isSharing && (
        <div className="bg-[#FFF9F5] border-2 border-[#FF5A36] rounded-3xl p-5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">Share Vault Item Securely</h4>
            <button onClick={() => setIsSharing(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Item</label>
              <input
                type="text"
                value={itemToShare}
                onChange={(e) => setItemToShare(e.target.value)}
                className="w-full text-xs font-black bg-white border border-orange-200 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Recipient Email</label>
              <input
                type="email"
                placeholder="colleague@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full text-xs font-black bg-white border border-orange-200 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Access Level</label>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value as any)}
                className="w-full text-xs font-black bg-white border border-orange-200 rounded-xl p-2.5"
              >
                <option value="Read Only">Read Only (Auto-fill)</option>
                <option value="Can Edit">Can Edit</option>
                <option value="Full Access">Full Access</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsSharing(false)}
              className="px-4 py-2 rounded-xl bg-white text-slate-600 border border-orange-200 text-xs font-black cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              className="px-5 py-2 rounded-xl bg-[#FF5A36] text-white text-xs font-black cursor-pointer shadow-xs hover:bg-[#EA4C27]"
            >
              Create Secure Share Link
            </button>
          </div>
        </div>
      )}

      {/* SHARED LIST */}
      <div className="space-y-3">
        {sharedItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-orange-100 flex items-center justify-center text-xl shadow-2xs shrink-0">
                🤝
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs font-semibold text-slate-600">
                  Shared with <b className="text-slate-900">{item.sharedWith}</b>
                </p>
                <div className="flex items-center gap-3 pt-0.5 text-[11px] font-bold text-slate-500">
                  <span className="text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded-full border border-orange-200/60">
                    {item.accessLevel}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-orange-400" /> Expires: {item.expiresIn}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleRevoke(item.id)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revoke</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
