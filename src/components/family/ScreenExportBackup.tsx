import React, { useState } from "react";
import {
  DownloadCloud,
  UploadCloud,
  FileCode,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Check,
  RotateCcw
} from "lucide-react";
import { FamilyMember, GuruProfile } from "./types";

interface ScreenExportBackupProps {
  members: FamilyMember[];
  guruProfile: GuruProfile;
  onImportJSON: (importedMembers: FamilyMember[]) => void;
  onResetDefaultData: () => void;
}

export const ScreenExportBackup: React.FC<ScreenExportBackupProps> = ({
  members,
  guruProfile,
  onImportJSON,
  onResetDefaultData
}) => {
  const [copied, setCopied] = useState(false);

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      treeName: "Sacred Family Heritage & Guru Parampara",
      guruProfile,
      members
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `family_tree_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGEDCOM = () => {
    let gedcom = `0 HEAD\n1 SOUR SACRED_HERITAGE\n1 GEDC\n2 VERS 5.5.1\n2 FORM LINEAGE-LINKED\n1 CHAR UTF-8\n`;
    members.forEach((m) => {
      gedcom += `0 @${m.id}@ INDI\n`;
      gedcom += `1 NAME ${m.firstName} /${m.lastName}/\n`;
      gedcom += `1 SEX ${m.gender === "Male" ? "M" : m.gender === "Female" ? "F" : "U"}\n`;
      if (m.dateOfBirth) gedcom += `1 BIRT\n2 DATE ${m.dateOfBirth}\n`;
      if (m.placeOfBirth) gedcom += `2 PLAC ${m.placeOfBirth}\n`;
      if (!m.isAlive && m.dateOfDeath) gedcom += `1 DEAT\n2 DATE ${m.dateOfDeath}\n`;
    });
    gedcom += `0 TRLR\n`;

    const blob = new Blob([gedcom], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `family_tree_${new Date().toISOString().split("T")[0]}.ged`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.members && Array.isArray(parsed.members)) {
          onImportJSON(parsed.members);
          alert("Successfully restored family tree records!");
        } else if (Array.isArray(parsed)) {
          onImportJSON(parsed);
          alert("Successfully restored family tree records!");
        } else {
          alert("Invalid JSON format for Family Tree.");
        }
      } catch (err) {
        alert("Error parsing backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            <DownloadCloud className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Export, GEDCOM & Backup Sync</h2>
            <p className="text-xs text-slate-500">Universal genealogy standards (GEDCOM 5.5), JSON backup, and database restore</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* GEDCOM Export */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5A36] flex items-center justify-center font-bold">
            <FileCode className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Universal GEDCOM 5.5 Export</h3>
          <p className="text-xs text-slate-500">
            Export your entire family lineage into industry standard .GED format compatible with Ancestry, MyHeritage, FamilySearch, and Gramps.
          </p>
          <button
            type="button"
            onClick={handleExportGEDCOM}
            className="w-full py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer text-center"
          >
            Download GEDCOM (.ged)
          </button>
        </div>

        {/* JSON Full Database Backup */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <DownloadCloud className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Complete JSON Backup</h3>
          <p className="text-xs text-slate-500">
            Download the complete raw dataset including Guru profile, Vedic tithis, documents metadata, Gotras, and contact records.
          </p>
          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer text-center"
          >
            Download JSON Backup (.json)
          </button>
        </div>

        {/* Restore Backup */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <UploadCloud className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Restore / Import JSON File</h3>
          <p className="text-xs text-slate-500">
            Select a previously exported JSON backup file to overwrite or restore tree state.
          </p>
          <label className="block w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer text-center">
            <span>Browse & Restore Backup</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>

        {/* Reset Database */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Reset to Sacred Seed Data</h3>
          <p className="text-xs text-slate-500">
            Restore pre-configured Guru Swami Vedanand Saraswati, Mata Anandmayi, and multi-generation seed family tree.
          </p>
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset family tree to initial default seed dataset?")) {
                onResetDefaultData();
              }
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
          >
            Reset Seed Data
          </button>
        </div>
      </div>
    </div>
  );
};
