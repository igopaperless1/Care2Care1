import React, { useState } from "react";
import {
  X,
  Share2,
  Search,
  CheckCircle2,
  Mail,
  UserCheck,
  Shield,
  Send,
  Users
} from "lucide-react";
import { PaperlessAsset, PaperlessUserContact } from "./paperlessTypes";
import { MOCK_CONTACTS } from "./paperlessCategoriesData";

interface PaperlessShareModalProps {
  asset: PaperlessAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onShareComplete: (
    assetId: string,
    user: { userId: string; name: string; email: string; role: "view" | "edit" | "admin" }
  ) => void;
  showToast: (msg: string) => void;
}

export const PaperlessShareModal: React.FC<PaperlessShareModalProps> = ({
  asset,
  isOpen,
  onClose,
  onShareComplete,
  showToast
}) => {
  const [emailOrName, setEmailOrName] = useState("");
  const [selectedUser, setSelectedUser] = useState<PaperlessUserContact | null>(null);
  const [accessLevel, setAccessLevel] = useState<"view" | "edit" | "admin">("view");
  const [notifyViaEmail, setNotifyViaEmail] = useState(true);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !asset) return null;

  const handleSelectContact = (contact: PaperlessUserContact) => {
    setSelectedUser(contact);
    setEmailOrName(contact.email);
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrName.trim()) {
      showToast("Please enter an email or select a user to share with");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const recipientName = selectedUser
        ? selectedUser.name
        : emailOrName.split("@")[0];
      const recipientEmail = selectedUser ? selectedUser.email : emailOrName;

      onShareComplete(asset.id, {
        userId: selectedUser ? selectedUser.id : `usr-${Date.now()}`,
        name: recipientName,
        email: recipientEmail,
        role: accessLevel
      });

      setIsSending(false);
      showToast(`Shared "${asset.name}" with ${recipientName} successfully!`);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5A36] to-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Share Asset
              </h3>
              <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{asset.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleShareSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Email or Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Share with
            </label>
            <div className="relative">
              <input
                type="text"
                value={emailOrName}
                onChange={(e) => {
                  setEmailOrName(e.target.value);
                  setSelectedUser(null);
                }}
                placeholder="Enter email or user name"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Quick Select User List */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or select user
            </p>
            <div className="space-y-1.5">
              {MOCK_CONTACTS.slice(0, 3).map((contact) => {
                const isSelected = selectedUser?.id === contact.id;
                return (
                  <div
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#FF5A36] bg-orange-50/60 dark:bg-orange-950/30"
                        : "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={contact.avatarUrl}
                        alt={contact.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {contact.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{contact.email}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#FF5A36] text-white flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Access Level Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Access Level
            </label>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as "view" | "edit" | "admin")}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="view">View Only</option>
              <option value="edit">Can Edit & Annotate</option>
              <option value="admin">Full Admin Rights</option>
            </select>
          </div>

          {/* Notify via Email Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="notifyEmailCheck"
              checked={notifyViaEmail}
              onChange={(e) => setNotifyViaEmail(e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded-md focus:ring-orange-400"
            />
            <label
              htmlFor="notifyEmailCheck"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Notify via email
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-[#FF5A36] text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? "Sharing Asset..." : "Share Asset"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
