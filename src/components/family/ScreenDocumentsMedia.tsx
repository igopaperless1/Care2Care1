import React, { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Download,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles
} from "lucide-react";
import { FamilyDocumentMedia, FamilyTab } from "./types";

interface ScreenDocumentsMediaProps {
  documents: FamilyDocumentMedia[];
  onAddDocument: (doc: FamilyDocumentMedia) => void;
  onDeleteDocument: (id: string) => void;
  onNavigate: (tab: FamilyTab) => void;
}

export const ScreenDocumentsMedia: React.FC<ScreenDocumentsMediaProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"All Documents" | "Photos" | "Videos" | "Audio">("All Documents");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDoc, setNewDoc] = useState<Partial<FamilyDocumentMedia>>({
    title: "",
    fileName: "",
    fileSize: "1.0 MB",
    fileType: "document",
    category: "Certificate"
  });

  const filteredDocs = documents.filter((doc) => {
    if (activeSubTab === "Photos") return doc.fileType === "photo";
    if (activeSubTab === "Videos") return doc.fileType === "video";
    if (activeSubTab === "Audio") return doc.fileType === "audio";
    return true;
  });

  const handleUploadSubmit = () => {
    if (!newDoc.title || !newDoc.fileName) {
      alert("Please provide title and file name.");
      return;
    }
    const created: FamilyDocumentMedia = {
      id: `doc-${Date.now()}`,
      title: newDoc.title!,
      fileName: newDoc.fileName!,
      fileSize: newDoc.fileSize || "1.5 MB",
      fileType: (newDoc.fileType as any) || "document",
      uploadedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      category: (newDoc.category as any) || "Legal"
    };
    onAddDocument(created);
    setShowUploadModal(false);
    setNewDoc({ title: "", fileName: "", fileSize: "1.0 MB", fileType: "document", category: "Certificate" });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case "video":
        return <Video className="w-5 h-5 text-purple-600" />;
      case "audio":
        return <Music className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-[#FF5A36]" />;
    }
  };

  const handleDownload = (doc: FamilyDocumentMedia) => {
    const content = `Heritage Document Archive\nDocument Title: ${doc.title}\nCategory: ${doc.category}\nDate: ${doc.uploadedDate}\nVerified Digital Artifact`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            11
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Documents & Media</h2>
            <p className="text-xs text-slate-500">Diksha certificates, Janam Patrikas, portraits & sacred audio updesh</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/20 cursor-pointer active:scale-95 transition-transform"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload New Document</span>
        </button>
      </div>

      {/* 2. Sub Tabs: All Documents | Photos | Videos | Audio */}
      <div className="flex items-center gap-1 bg-orange-50/70 p-1.5 rounded-2xl border border-orange-200/80">
        {(["All Documents", "Photos", "Videos", "Audio"] as const).map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                isActive
                  ? "bg-[#FF5A36] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. Document Items List (Matching Card 11) */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-orange-100 text-center space-y-2">
            <FileText className="w-8 h-8 text-orange-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No media artifacts in this tab</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white hover:bg-orange-50/30 rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                  {getIcon(doc.fileType)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{doc.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5A36] border border-orange-200">
                      {doc.category}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-medium flex items-center gap-3 mt-1">
                    <span className="font-mono text-slate-700">{doc.fileName}</span>
                    <span>• {doc.fileSize}</span>
                    <span>• {doc.uploadedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] text-xs font-bold rounded-xl border border-orange-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteDocument(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-200 shadow-2xl space-y-4 animate-in fade-in">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#FF5A36]" /> Upload Heritage Document or Media
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="e.g. Diksha Certificate"
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">File Name *</label>
                <input
                  type="text"
                  value={newDoc.fileName}
                  onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })}
                  placeholder="e.g. diksha_certificate.pdf"
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">File Type</label>
                  <select
                    value={newDoc.fileType}
                    onChange={(e) => setNewDoc({ ...newDoc, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="document">PDF / Document</option>
                    <option value="photo">Photo / Portrait</option>
                    <option value="audio">Audio Updesh</option>
                    <option value="video">Video Recording</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="Diksha">Diksha</option>
                    <option value="Patrika">Patrika</option>
                    <option value="Photo">Photo</option>
                    <option value="Audio">Audio</option>
                    <option value="Legal">Legal</option>
                    <option value="Certificate">Certificate</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-orange-100">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadSubmit}
                className="px-5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
