import React, { useState, useEffect } from "react";
import {
  MedicineItemModel,
  DoseLogModel,
  JournalEntryModel,
  DrugInteractionModel,
  DependentCareModel,
  MedicineSettingsModel,
  MedicineTab,
  DoseStatus
} from "./medicine/types";
import {
  INITIAL_MEDICINES,
  INITIAL_TODAY_DOSES,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_DRUG_INTERACTIONS,
  INITIAL_DEPENDENTS,
  INITIAL_SETTINGS
} from "./medicine/mockData";
import { MedicineHeader } from "./medicine/MedicineHeader";
import { MedicineNavScroll } from "./medicine/MedicineNavScroll";
import { ScreenOverview } from "./medicine/ScreenOverview";
import { ScreenMyMedicines } from "./medicine/ScreenMyMedicines";
import { ScreenAddMedicineWizard } from "./medicine/ScreenAddMedicineWizard";
import { ScreenTodayDoses } from "./medicine/ScreenTodayDoses";
import { ScreenDoseAction } from "./medicine/ScreenDoseAction";
import { ScreenRefillInventory } from "./medicine/ScreenRefillInventory";
import { ScreenMedicineJournal } from "./medicine/ScreenMedicineJournal";
import { ScreenInteractionsSafety } from "./medicine/ScreenInteractionsSafety";
import { ScreenAdherenceCalendar } from "./medicine/ScreenAdherenceCalendar";
import { ScreenCaregiverFamily } from "./medicine/ScreenCaregiverFamily";
import { ScreenDoctorReports } from "./medicine/ScreenDoctorReports";
import { ScreenSettings } from "./medicine/ScreenSettings";
import { PrescriptionScannerModal } from "./medicine/PrescriptionScannerModal";
import { playMedicineTone } from "./medicine/soundUtil";

interface MedicineManagementServiceProps {
  onBack?: () => void;
}

export const MedicineManagementService: React.FC<MedicineManagementServiceProps> = ({ onBack }) => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<MedicineTab>("overview");

  // Persistent States
  const [medicines, setMedicines] = useState<MedicineItemModel[]>(() => {
    const saved = localStorage.getItem("c2c_medicines_list_v2");
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [todayDoses, setTodayDoses] = useState<DoseLogModel[]>(() => {
    const saved = localStorage.getItem("c2c_today_doses_v2");
    return saved ? JSON.parse(saved) : INITIAL_TODAY_DOSES;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntryModel[]>(() => {
    const saved = localStorage.getItem("c2c_journal_entries_v2");
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
  });

  const [interactions, setInteractions] = useState<DrugInteractionModel[]>(() => {
    const saved = localStorage.getItem("c2c_drug_interactions_v2");
    return saved ? JSON.parse(saved) : INITIAL_DRUG_INTERACTIONS;
  });

  const [dependents, setDependents] = useState<DependentCareModel[]>(() => {
    const saved = localStorage.getItem("c2c_dependents_v2");
    return saved ? JSON.parse(saved) : INITIAL_DEPENDENTS;
  });

  const [settings, setSettings] = useState<MedicineSettingsModel>(() => {
    const saved = localStorage.getItem("c2c_medicine_settings_v2");
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Modal States
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [selectedDoseForAction, setSelectedDoseForAction] = useState<DoseLogModel | null>(null);
  const [editingMedicine, setEditingMedicine] = useState<MedicineItemModel | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("c2c_medicines_list_v2", JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem("c2c_today_doses_v2", JSON.stringify(todayDoses));
  }, [todayDoses]);

  useEffect(() => {
    localStorage.setItem("c2c_journal_entries_v2", JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem("c2c_medicine_settings_v2", JSON.stringify(settings));
  }, [settings]);

  // Key Counters
  const dueNowDoses = todayDoses.filter((d) => d.status === "Pending");
  const lowStockMeds = medicines.filter((m) => m.remainingStock <= m.lowStockThreshold);
  const takenDoses = todayDoses.filter((d) => d.status === "Taken");
  const adherencePercent =
    todayDoses.length > 0 ? Math.round((takenDoses.length / todayDoses.length) * 100) : 100;

  // Handlers
  const handleOpenAddModal = () => {
    setEditingMedicine(null);
    setCurrentTab("add_medicine");
  };

  const handleEditMedicine = (med: MedicineItemModel) => {
    setEditingMedicine(med);
    setCurrentTab("add_medicine");
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    setTodayDoses((prev) => prev.filter((d) => d.medicineId !== id));
  };

  const handleSaveMedicine = (medData: Partial<MedicineItemModel>) => {
    if (medData.id) {
      // Edit existing
      setMedicines((prev) =>
        prev.map((m) => (m.id === medData.id ? ({ ...m, ...medData } as MedicineItemModel) : m))
      );
    } else {
      // Add new
      const newMed: MedicineItemModel = {
        id: `med-${Date.now()}`,
        name: medData.name || "Untitled Medicine",
        brandName: medData.brandName,
        activeIngredient: medData.activeIngredient,
        type: medData.type || "Tablet",
        strength: medData.strength || "500mg",
        purpose: medData.purpose || "Prescription",
        prescribingDoctor: medData.prescribingDoctor || "Dr. Sandeep Shah",
        doctorPhone: medData.doctorPhone || "+977 9801234567",
        hospitalClinic: medData.hospitalClinic || "Norvic Hospital",
        scheduleType: medData.scheduleType || "fixed",
        dosesPerDay: medData.dosesPerDay || 1,
        doseTimes: medData.doseTimes || ["08:00 AM"],
        takeWith: medData.takeWith || "Water",
        foodRelation: medData.foodRelation || "After Food",
        instructions: medData.instructions || "Take as prescribed.",
        totalPrescribed: medData.totalPrescribed || 30,
        remainingStock: medData.remainingStock || 30,
        lowStockThreshold: medData.lowStockThreshold || 10,
        refillReminderEnabled: medData.refillReminderEnabled ?? true,
        prescriptionExpiryDate: medData.prescriptionExpiryDate || "2026-12-31",
        image:
          medData.image ||
          "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80",
        status: "Active",
        sideEffects: medData.sideEffects,
        warnings: medData.warnings,
        notes: medData.notes,
        colorTag: "#FF5A36",
        createdAt: new Date().toISOString().split("T")[0]
      };

      setMedicines((prev) => [newMed, ...prev]);

      // Automatically generate today's doses for this medicine
      const newDoseLogs: DoseLogModel[] = (newMed.doseTimes || ["08:00 AM"]).map((timeStr, idx) => {
        let slot: "Morning" | "Afternoon" | "Evening" | "Night" = "Morning";
        if (timeStr.includes("PM")) {
          const hour = parseInt(timeStr.split(":")[0], 10);
          slot = hour < 6 || hour === 12 ? "Afternoon" : "Evening";
        }
        return {
          id: `dose-${Date.now()}-${idx}`,
          medicineId: newMed.id,
          medicineName: `${newMed.name} ${newMed.strength}`,
          dosage: `1 ${newMed.type}`,
          type: newMed.type,
          scheduledDate: new Date().toISOString().split("T")[0],
          scheduledTime: timeStr,
          slot,
          status: "Pending"
        };
      });

      setTodayDoses((prev) => [...prev, ...newDoseLogs]);
    }

    setEditingMedicine(null);
    setCurrentTab("my_medicines");
  };

  const handleOpenDoseAction = (dose: DoseLogModel) => {
    setSelectedDoseForAction(dose);
    setCurrentTab("dose_action");
  };

  const handleRecordDoseAction = (
    doseId: string,
    status: DoseStatus,
    reason?: string,
    note?: string,
    photoProofUrl?: string
  ) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setTodayDoses((prev) =>
      prev.map((d) => {
        if (d.id === doseId) {
          return {
            ...d,
            status,
            takenAt: status === "Taken" ? nowTime : undefined,
            skipReason: reason,
            note,
            photoProofUrl
          };
        }
        return d;
      })
    );

    // If taken, decrement stock in inventory
    if (status === "Taken") {
      const targetDose = todayDoses.find((d) => d.id === doseId);
      if (targetDose) {
        setMedicines((prev) =>
          prev.map((m) =>
            m.id === targetDose.medicineId
              ? { ...m, remainingStock: Math.max(0, m.remainingStock - 1) }
              : m
          )
        );
      }
    }

    setSelectedDoseForAction(null);
    setCurrentTab("today_doses");
  };

  const handleQuickMarkTaken = (doseId: string) => {
    handleRecordDoseAction(doseId, "Taken");
  };

  const handleQuickSnooze = (doseId: string) => {
    handleRecordDoseAction(doseId, "Snoozed", "Snoozed for 10 minutes");
  };

  const handleUpdateStock = (medId: string, newStock: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, remainingStock: newStock } : m))
    );
  };

  const handleAddJournalEntry = (entry: Partial<JournalEntryModel>) => {
    const newEntry: JournalEntryModel = {
      id: `j-${Date.now()}`,
      date: entry.date || new Date().toISOString().split("T")[0],
      mood: entry.mood || "Good",
      energyLevel: entry.energyLevel || 8,
      symptoms: entry.symptoms || [],
      notes: entry.notes,
      createdAt: new Date().toISOString()
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  const handleAddDependent = (dep: Partial<DependentCareModel>) => {
    const newDep: DependentCareModel = {
      id: `dep-${Date.now()}`,
      name: dep.name || "Member",
      relation: dep.relation || "Family",
      phone: dep.phone || "+977 9800000000",
      hasMissedAlert: false,
      recentActivities: []
    };
    setDependents((prev) => [newDep, ...prev]);
  };

  const handleResetData = () => {
    setMedicines(INITIAL_MEDICINES);
    setTodayDoses(INITIAL_TODAY_DOSES);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setInteractions(INITIAL_DRUG_INTERACTIONS);
    setDependents(INITIAL_DEPENDENTS);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem("c2c_medicines_list_v2");
    localStorage.removeItem("c2c_today_doses_v2");
    localStorage.removeItem("c2c_journal_entries_v2");
    localStorage.removeItem("c2c_medicine_settings_v2");
    alert("Medicine reminder service data reset to clean initial state.");
    setCurrentTab("overview");
  };

  const handleExtractedMedicinesFromOcr = (extracted: Partial<MedicineItemModel>[]) => {
    extracted.forEach((item) => {
      handleSaveMedicine(item);
    });
    alert(`Successfully imported ${extracted.length} prescriptions with complete schedules!`);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-900 flex flex-col antialiased">
      {/* 1. Master Header with due counters, adherence & scan trigger */}
      <MedicineHeader
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        dueNowCount={dueNowDoses.length}
        lowStockCount={lowStockMeds.length}
        adherencePercent={adherencePercent}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenAddModal={handleOpenAddModal}
        onBack={onBack}
      />

      {/* 2. Horizontal Scrolling Pill Menu for all 12 sections */}
      <MedicineNavScroll
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        dueNowCount={dueNowDoses.length}
        lowStockCount={lowStockMeds.length}
      />

      {/* 3. Main Workspace / Screen Outlet */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-5">
        {currentTab === "overview" && (
          <ScreenOverview
            medicines={medicines}
            todayDoses={todayDoses}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDoseAction={handleOpenDoseAction}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {currentTab === "my_medicines" && (
          <ScreenMyMedicines
            medicines={medicines}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAddModal={handleOpenAddModal}
            onEditMedicine={handleEditMedicine}
            onDeleteMedicine={handleDeleteMedicine}
            onRefillMedicine={(med) => {
              setCurrentTab("refill_inventory");
            }}
          />
        )}

        {currentTab === "add_medicine" && (
          <ScreenAddMedicineWizard
            initialData={editingMedicine || undefined}
            onSaveMedicine={handleSaveMedicine}
            onCancel={() => setCurrentTab("my_medicines")}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "schedule_dosing" && (
          <ScreenAddMedicineWizard
            initialData={editingMedicine || medicines[0] || undefined}
            onSaveMedicine={handleSaveMedicine}
            onCancel={() => setCurrentTab("overview")}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "today_doses" && (
          <ScreenTodayDoses
            todayDoses={todayDoses}
            onOpenDoseAction={handleOpenDoseAction}
            onQuickMarkTaken={handleQuickMarkTaken}
            onQuickSnooze={handleQuickSnooze}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "dose_action" && (
          <ScreenDoseAction
            dose={selectedDoseForAction || todayDoses[0]}
            onRecordAction={handleRecordDoseAction}
            onCancel={() => setCurrentTab("today_doses")}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "refill_inventory" && (
          <ScreenRefillInventory
            medicines={medicines}
            onUpdateStock={handleUpdateStock}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "medicine_journal" && (
          <ScreenMedicineJournal
            entries={journalEntries}
            onAddEntry={handleAddJournalEntry}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "interactions_safety" && (
          <ScreenInteractionsSafety
            interactions={interactions}
            medicines={medicines}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "adherence_history" && (
          <ScreenAdherenceCalendar onNavigate={(tab) => setCurrentTab(tab)} />
        )}

        {currentTab === "caregiver_family" && (
          <ScreenCaregiverFamily
            dependents={dependents}
            onAddDependent={handleAddDependent}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "doctor_reports" && (
          <ScreenDoctorReports
            medicines={medicines}
            todayDoses={todayDoses}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "settings" && (
          <ScreenSettings
            settings={settings}
            onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
            onResetData={handleResetData}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}
      </main>

      {/* 4. AI OCR Prescription Scanner Modal */}
      <PrescriptionScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onExtractedMedicines={handleExtractedMedicinesFromOcr}
      />
    </div>
  );
};
export default MedicineManagementService;
