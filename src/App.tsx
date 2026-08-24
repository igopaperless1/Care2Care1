import React, { useState, useEffect } from "react";
import {
  AccountType,
  Patient,
  VitalSign,
  Medication,
  DocumentItem,
  MemoEntry,
  FamilyMember,
  VehicleItem,
  FarmRecord,
  FinancialRecord,
  PetItem,
  AppState
} from "./types";
import { DEFAULT_ACTIVE_MODULE_IDS } from "./utils/ServiceFactory";
import {
  INITIAL_PATIENTS,
  INITIAL_SERVICE_PROVIDERS,
  INITIAL_MEMO_ENTRIES,
  INITIAL_DOCUMENTS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_VEHICLES,
  INITIAL_FARM_RECORDS,
  INITIAL_FINANCIAL_RECORDS,
  INITIAL_PETS
} from "./data";
import { LanguageProvider } from "./context/LanguageContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NavigationHeader } from "./components/NavigationHeader";
import { BottomNavigation, NavTab } from "./components/BottomNavigation";
import { WaterTracker } from "./components/WaterTracker";
import { StepsTracker } from "./components/StepsTracker";
import { MedicineTracker } from "./components/MedicineTracker";
import { MedicineManagementService } from "./components/MedicineManagementService";
import { YogaMeditationTracker } from "./components/YogaMeditationTracker";
import { MoodHabitJournal } from "./components/MoodHabitJournal";
import { ElderlyCareTracker } from "./components/ElderlyCareTracker";
import { ExerciseTracker } from "./components/ExerciseTracker";
import { MentalHealthApp } from "./components/mental/MentalHealthApp";
import { HabitAndRecoveryTracker } from "./components/HabitAndRecoveryTracker";
import { HabitChallenges } from "./components/HabitChallenges";
import { KidsCareTracker } from "./components/KidsCareTracker";
import { FamilyTreeTracker } from "./components/FamilyTreeTracker";
import { StaffAndPayrollTracker } from "./components/StaffAndPayrollTracker";
import { ContractManagementTracker } from "./components/ContractManagementTracker";
import { VehicleCareTracker } from "./components/VehicleCareTracker";
import { PropertyLandTracker } from "./components/PropertyLandTracker";
import { PetCareTracker } from "./components/PetCareTracker";
import { NutritionTracker } from "./components/NutritionTracker";
import { FinanceBudgetTracker } from "./components/FinanceBudgetTracker";
import { InventoryManagementTracker } from "./components/InventoryManagementTracker";
import { InventoryManagementService } from "./components/InventoryManagementService";
import { MenstrualCycleTracker } from "./components/MenstrualCycleTracker";
import { CustomStoreService } from "./components/CustomStoreService";
import { GardenFarmTracker } from "./components/GardenFarmTracker";
import { FarmGardenService } from "./components/garden/FarmGardenService";
import { BillingInvoiceService } from "./components/billing/BillingInvoiceService";
import { TrackProgressView } from "./components/TrackProgressView";
import { CaregiverDashboard } from "./components/CaregiverDashboard";
import { PlanAndScheduleView } from "./components/PlanAndScheduleView";
import { ServicesAndToolsView } from "./components/ServicesAndToolsView";
import { SosModal } from "./components/SosModal";
import { HomeView } from "./components/HomeView";
import { ServiceLibrary } from "./pages/ServiceLibrary";
import { SosEmergencyTracker } from "./components/SosEmergencyTracker";
import { CalendarConverterTracker } from "./components/CalendarConverterTracker";
import { QuickActionOverlay } from "./components/QuickActionOverlay";
import { CameraScannerModal } from "./components/CameraScannerModal";
import { JobSearchCareerTracker } from "./components/JobSearchCareerTracker";
import { IGOPaperlessTracker } from "./components/IGOPaperlessTracker";
import { LifeDatesTracker } from "./components/LifeDatesTracker";
import { SleepTracker } from "./components/SleepTracker";
import { HybridStorageManagerView } from "./components/HybridStorageManagerView";
import { TicketQueueManagementTracker } from "./components/TicketQueueManagementTracker";
import { Care2CareAiAssistantModal } from "./components/Care2CareAiAssistantModal";
import { VoiceAssistantModal } from "./components/VoiceAssistantModal";
import { PasswordManagementTracker } from "./components/PasswordManagementTracker";
import { generatePatientPDFReport } from "./lib/pdfReportGenerator";
import { AdminDashboard, UserAccount } from "./components/AdminDashboard";
import { AuthModalAndWelcome } from "./components/AuthModalAndWelcome";
import { CommunityFeedMessageView } from "./components/CommunityFeedMessageView";
import { InsightsHubView } from "./components/InsightsHubView";
import { UserProfileManagerModal } from "./components/UserProfileManagerModal";
import { UserReceiptVaultModal } from "./components/UserReceiptVaultModal";
import { SplashEntranceAnimation } from "./components/SplashEntranceAnimation";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { AddMemberModal, MemberFormData } from "./components/AddMemberModal";
import { PaddlePaymentModal } from "./components/PaddlePaymentModal";
import { AdPlacement } from "./components/AdPlacement";
import { useAuthGuard } from "./hooks/useAuthGuard";
import { ModuleLoadingSkeleton } from "./components/ModuleLoadingSkeleton";
import { FeatureGuard } from "./components/FeatureGuard";
import { useAutoLogout } from "./hooks/useAutoLogout";
import {
  syncPatientsDebounced,
  fetchPatientsFromSupabase,
  subscribeSyncStatus,
  SyncStatus,
} from "./lib/supabaseSync";

export default function App() {
  const {
    user: authUser,
    role: authRole,
    isAuthenticated,
    isLoading: isAuthLoading,
    login: authLogin,
    logout: authLogout,
    isAdmin: isAuthAdmin,
  } = useAuthGuard();

  const [accountType, setAccountType] = useState<AccountType>(() => {
    try {
      const saved = localStorage.getItem("care2care_account_type");
      return (saved as AccountType) || "family";
    } catch {
      return "family";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("care2care_account_type", accountType);
    } catch (e) {
      console.error(e);
    }
  }, [accountType]);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem("care2care_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync auth guard user when session resolves
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
      if (authUser.role === "admin") {
        setIsAdminViewActive(true);
      }
    } else {
      setCurrentUser(null);
      setIsAdminViewActive(false);
    }
  }, [authUser]);

  const [isSplashOpen, setIsSplashOpen] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false);
  const [userProfileInitialTab, setUserProfileInitialTab] = useState<"personal" | "professional" | "dependents" | "dashboard_customization">("personal");
  const [isReceiptVaultOpen, setIsReceiptVaultOpen] = useState<boolean>(false);
  const [isReconfigModalOpen, setIsReconfigModalOpen] = useState<boolean>(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState<boolean>(false);
  const [isAiToolsExpanded, setIsAiToolsExpanded] = useState<boolean>(false);

  const [hasAutoPromptedAuth, setHasAutoPromptedAuth] = useState<boolean>(false);

  // Auto-prompt auth modal once on launch if unauthenticated and splash is closed
  useEffect(() => {
    if (!isAuthLoading && !currentUser && !isSplashOpen && !hasAutoPromptedAuth) {
      setIsAuthModalOpen(true);
      setHasAutoPromptedAuth(true);
    }
  }, [isAuthLoading, currentUser, isSplashOpen, hasAutoPromptedAuth]);
  const [authInitialTab, setAuthInitialTab] = useState<"welcome" | "login" | "signup" | "credentials" | "faq">("welcome");
  const [isPaddleModalOpen, setIsPaddleModalOpen] = useState<boolean>(false);
  const [isAdminViewActive, setIsAdminViewActive] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("care2care_dark_mode") === "true";
    } catch {
      return false;
    }
  });
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");

  useEffect(() => {
    try {
      localStorage.setItem("care2care_dark_mode", String(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);
  // Progressive Onboarding & Active Services AppState
  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem("care2care_app_state");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error parsing care2care_app_state", e);
    }
    return {
      onboardingStep: 0,
      activeModules: DEFAULT_ACTIVE_MODULE_IDS,
      isOnboardingComplete: false,
      selectedRoles: ["Single Adult"],
      primaryMotivation: "personal"
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("care2care_app_state", JSON.stringify(appState));
    } catch (e) {
      console.error("Error saving care2care_app_state", e);
    }
  }, [appState]);

  const [showInterstitialAd, setShowInterstitialAd] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<NavTab>("services");
  // Independent active subTab preferences stored in localStorage
  const [personalCareSubTab, setPersonalCareSubTab] = useState<string>(() => {
    try {
      return localStorage.getItem("care2care_active_subtab_personal") || "elderly";
    } catch {
      return "elderly";
    }
  });

  const [professionalCareSubTab, setProfessionalCareSubTab] = useState<string>(() => {
    try {
      return localStorage.getItem("care2care_active_subtab_professional") || "staff_payroll";
    } catch {
      return "staff_payroll";
    }
  });

  const [careSubTab, setCareSubTab] = useState<
    | "vitals"
    | "career"
    | "ticket_queue"
    | "sos"
    | "calendar"
    | "water"
    | "steps"
    | "medicine"
    | "yoga"
    | "mood"
    | "elderly"
    | "exercise"
    | "mental"
    | "habit_challenges"
    | "challenges"
    | "habit"
    | "kids"
    | "family_tree"
    | "staff_payroll"
    | "contracts"
    | "vehicles"
    | "property"
    | "pets"
    | "nutrition"
    | "billing"
    | "invoices"
    | "finance"
    | "garden"
    | "jobs"
    | "paperless"
    | "life_dates"
    | "inventory"
    | "passwords"
    | "menstrual"
    | "sleep"
    | "hybrid_storage"
    | "custom_store"
  >(() => {
    try {
      const isProf = accountType === "professional" || accountType === "community";
      const savedKey = isProf ? "care2care_active_subtab_professional" : "care2care_active_subtab_personal";
      const fallback = isProf ? "staff_payroll" : "elderly";
      return (localStorage.getItem(savedKey) as any) || fallback;
    } catch {
      return "elderly";
    }
  });

  // Automatically restore the last visited sub-tab relevant to the specific account context when accountType changes
  useEffect(() => {
    const isProf = accountType === "professional" || accountType === "community";
    if (isProf) {
      setCareSubTab(professionalCareSubTab as any);
    } else {
      setCareSubTab(personalCareSubTab as any);
    }
  }, [accountType]);

  // Care Suite Navigation & Section Controls
  const [isCareMenuExpanded, setIsCareMenuExpanded] = useState<boolean>(true);
  const [isCareServiceExpanded, setIsCareServiceExpanded] = useState<boolean>(true);
  const [isModuleLoading, setIsModuleLoading] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ isSyncing: false, lastSyncedAt: null, error: null });

  // Subscribe to Supabase real-time sync status
  useEffect(() => {
    const unsubscribe = subscribeSyncStatus(setSyncStatus);
    return () => unsubscribe();
  }, []);

  // Track subTab usage frequency & recency
  const [tabUsage, setTabUsage] = useState<Record<string, { count: number; lastUsed: number }>>(() => {
    try {
      const saved = localStorage.getItem("care2care_tab_usage");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleSelectCareSubTab = (tabId: string) => {
    setIsModuleLoading(true);
    setCareSubTab(tabId as any);
    setTimeout(() => {
      setIsModuleLoading(false);
    }, 280);

    const isProf = accountType === "professional" || accountType === "community";
    try {
      if (isProf) {
        setProfessionalCareSubTab(tabId);
        localStorage.setItem("care2care_active_subtab_professional", tabId);
      } else {
        setPersonalCareSubTab(tabId);
        localStorage.setItem("care2care_active_subtab_personal", tabId);
      }
    } catch (e) {
      console.error(e);
    }

    setTabUsage((prev) => {
      const current = prev[tabId] || { count: 0, lastUsed: 0 };
      const updated = {
        ...prev,
        [tabId]: { count: current.count + 1, lastUsed: Date.now() }
      };
      try {
        localStorage.setItem("care2care_tab_usage", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };


  // Navigation History Stack for Universal Immediate Back Navigation
  const [navHistory, setNavHistory] = useState<Array<{ tab: NavTab; careSubTab?: string }>>([]);

  const handleNavigateTo = (newTab: NavTab, newCareSubTab?: string) => {
    if (newTab !== activeTab || (newCareSubTab && newCareSubTab !== careSubTab)) {
      setNavHistory((prev) => [...prev, { tab: activeTab, careSubTab }]);
    }
    setActiveTab(newTab);
    if (newCareSubTab) {
      handleSelectCareSubTab(newCareSubTab);
    }
  };

  const handleGoBack = () => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavHistory((prevList) => prevList.slice(0, -1));
      setActiveTab(prev.tab);
      if (prev.careSubTab) {
        setCareSubTab(prev.careSubTab as any);
      }
    } else {
      setActiveTab("home");
    }
  };

  // Persistent State via localStorage
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_patients");
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_fam_members");
      return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
    } catch {
      return INITIAL_FAMILY_MEMBERS;
    }
  });

  const [vehicles, setVehicles] = useState<VehicleItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_vehicles");
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [farmRecords, setFarmRecords] = useState<FarmRecord[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_farms");
      return saved ? JSON.parse(saved) : INITIAL_FARM_RECORDS;
    } catch {
      return INITIAL_FARM_RECORDS;
    }
  });

  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_finance");
      return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_RECORDS;
    } catch {
      return INITIAL_FINANCIAL_RECORDS;
    }
  });

  const [pets, setPets] = useState<PetItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_pets");
      return saved ? JSON.parse(saved) : INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });

  const [memoEntries, setMemoEntries] = useState<MemoEntry[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_memos");
      return saved ? JSON.parse(saved) : INITIAL_MEMO_ENTRIES;
    } catch {
      return INITIAL_MEMO_ENTRIES;
    }
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_docs");
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  // UI Modal & Active States
  const [selectedPatientId, setSelectedPatientId] = useState<string>("p-1");
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);

  // Auto-logout user after 30 minutes of inactivity
  const { isInactiveLoggedOut, dismissInactivityAlert } = useAutoLogout({
    isAuthenticated: Boolean(currentUser && isAuthenticated),
    onLogout: () => {
      authLogout();
      setCurrentUser(null);
      setIsAdminViewActive(false);
      setAuthInitialTab("welcome");
      setIsAuthModalOpen(true);
    },
    timeoutMinutes: 30,
  });

  // Fetch initial patient data from Supabase if available
  useEffect(() => {
    fetchPatientsFromSupabase().then((remotePatients) => {
      if (remotePatients && remotePatients.length > 0) {
        setPatients(remotePatients);
      }
    });
  }, []);

  // Sync patients, vitals, medications, and water logs to local storage & Supabase in real-time
  useEffect(() => {
    localStorage.setItem("care2care_patients", JSON.stringify(patients));
    syncPatientsDebounced(patients, 800);
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("care2care_fam_members", JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem("care2care_vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem("care2care_farms", JSON.stringify(farmRecords));
  }, [farmRecords]);

  useEffect(() => {
    localStorage.setItem("care2care_finance", JSON.stringify(financialRecords));
  }, [financialRecords]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("care2care_auth_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("care2care_auth_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("care2care_pets", JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem("care2care_memos", JSON.stringify(memoEntries));
  }, [memoEntries]);

  useEffect(() => {
    localStorage.setItem("care2care_docs", JSON.stringify(documents));
  }, [documents]);

  const selectedPatient = (patients && patients.length > 0 ? patients.find((p) => p.id === selectedPatientId) || patients[0] : INITIAL_PATIENTS[0]) || INITIAL_PATIENTS[0];

  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(newPatient.id);
  };

  // Domain Handlers
  const handleAddFamilyMember = (member: FamilyMember) => {
    setFamilyMembers((prev) => [member, ...prev]);
  };

  const handleAddVehicle = (vehicle: VehicleItem) => {
    setVehicles((prev) => [vehicle, ...prev]);
  };

  const handleAddFarmRecord = (farm: FarmRecord) => {
    setFarmRecords((prev) => [farm, ...prev]);
  };

  const handleAddFinancialRecord = (fin: FinancialRecord) => {
    setFinancialRecords((prev) => [fin, ...prev]);
  };

  const handleAddPet = (pet: PetItem) => {
    setPets((prev) => [pet, ...prev]);
  };

  // Water log handler
  const handleAddWater = (patientId: string, amountMl: number) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const newLog = {
          id: "w-" + Date.now(),
          amountMl,
          time: timeStr,
          timestamp: Date.now(),
        };
        return {
          ...p,
          waterCurrentMl: p.waterCurrentMl + amountMl,
          waterLogs: [newLog, ...p.waterLogs],
        };
      })
    );
  };

  const handleRemoveWaterLog = (patientId: string, logId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const targetLog = p.waterLogs.find((l) => l.id === logId);
        const sub = targetLog ? targetLog.amountMl : 0;
        return {
          ...p,
          waterCurrentMl: Math.max(0, p.waterCurrentMl - sub),
          waterLogs: p.waterLogs.filter((l) => l.id !== logId),
        };
      })
    );
  };

  // Toggle Medication Taken
  const handleToggleMedication = (patientId: string, medId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          medications: p.medications.map((m) =>
            m.id === medId ? { ...m, takenToday: !m.takenToday } : m
          ),
        };
      })
    );
  };

  // Add Vital Sign
  const handleAddVitalSign = (patientId: string, vital: VitalSign) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          vitals: [vital, ...p.vitals],
          lastCheckIn: "Just now",
        };
      })
    );
  };

  // Update Caregiver Notes
  const handleUpdateCaregiverNotes = (patientId: string, notes: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          caregiverNotes: notes,
        };
      })
    );
  };

  // Add Medication
  const handleAddMedication = (patientId: string, med: Medication) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          medications: [...p.medications, med],
        };
      })
    );
  };

  // Update Notes
  const handleUpdateNotes = (patientId: string, notes: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, caregiverNotes: notes } : p))
    );
  };

  // Memo Entry
  const handleAddMemoEntry = (entry: MemoEntry) => {
    setMemoEntries((prev) => [entry, ...prev]);
  };

  // Backup Export/Import
  const handleExportBackup = () => {
    const data = {
      patients,
      familyMembers,
      vehicles,
      farmRecords,
      financialRecords,
      pets,
      memoEntries,
      documents,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `care2care_encrypted_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.patients) setPatients(parsed.patients);
      if (parsed.familyMembers) setFamilyMembers(parsed.familyMembers);
      if (parsed.vehicles) setVehicles(parsed.vehicles);
      if (parsed.farmRecords) setFarmRecords(parsed.farmRecords);
      if (parsed.financialRecords) setFinancialRecords(parsed.financialRecords);
      if (parsed.pets) setPets(parsed.pets);
      if (parsed.memoEntries) setMemoEntries(parsed.memoEntries);
      if (parsed.documents) setDocuments(parsed.documents);
      alert("Backup restored successfully!");
    } catch {
      alert("Invalid backup file format.");
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <div className="absolute text-2xl font-black text-emerald-400">🛡️</div>
        </div>
        <h2 className="text-xl font-black text-white tracking-tight">Care2Care Security & Auth Guard</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm font-medium">
          Verifying Supabase authentication session & role permissions...
        </p>
      </div>
    );
  }

  return (
    <LanguageProvider initialLanguage={currentLanguage as any}>
      <div className={isDarkMode ? "min-h-screen bg-[#0B132B] text-slate-100 font-sans antialiased dark selection:bg-blue-800 selection:text-white" : "min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900"}>
      {/* Sticky Header */}
      <NavigationHeader
        accountType={accountType}
        setAccountType={setAccountType}
        patients={patients}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        onTriggerSOS={() => setIsSosOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthInitialTab("welcome");
          setIsAuthModalOpen(true);
        }}
        onToggleAdminView={() => setIsAdminViewActive(!isAdminViewActive)}
        isAdminViewActive={isAdminViewActive}
        onOpenPaddleModal={() => setIsPaddleModalOpen(true)}
        onOpenSplashAnimation={() => setIsSplashOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => setCurrentLanguage(lang)}
        onOpenUserProfileModal={() => {
          setUserProfileInitialTab("personal");
          setIsUserProfileModalOpen(true);
        }}
        onOpenReceiptVault={() => setIsReceiptVaultOpen(true)}
        onOpenReconfigWizard={() => setIsReconfigModalOpen(true)}
        onOpenAddMember={() => setIsAddMemberModalOpen(true)}
      />

      {/* Free Tier Top Banner Ad */}
      {!isAdminViewActive && (
        <AdPlacement
          type="banner"
          placementName="top_header"
          isPremiumUser={Boolean(currentUser?.plan && currentUser.plan !== "Free")}
        />
      )}

      {/* Main Container */}
      <main className={isAdminViewActive ? "w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-24" : "max-w-4xl mx-auto px-4 pt-4 pb-24"}>
        {/* Inactivity Auto-Logout Alert Banner */}
        {isInactiveLoggedOut && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-900 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white font-black flex items-center justify-center shrink-0 shadow-xs text-lg">
                ⏳
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">Session Terminated (30-Min Security Inactivity)</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Your session was automatically invalidated in Supabase to protect patient medical privacy.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                dismissInactivityAlert();
                setAuthInitialTab("login");
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-2xl transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              Sign In Again
            </button>
          </div>
        )}

        {/* Unauthenticated Security Guard Banner */}
        {!currentUser && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black flex items-center justify-center shrink-0 shadow-xs text-lg">
                🔒
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">Authentication Required</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sign in to access confidential patient health logs, vitals tracking, and real-time Supabase cloud sync.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setAuthInitialTab("login");
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-2xl transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Real-time Sync Toast Indicator */}
        {syncStatus.isSyncing && (
          <div className="fixed bottom-20 left-4 z-40 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Syncing with Supabase...</span>
          </div>
        )}

        <ErrorBoundary fallbackTitle="Main Application Render Protection">
          {isAdminViewActive && currentUser?.role === "admin" ? (
            <AdminDashboard
              currentUser={currentUser}
              onLogout={() => {
                setCurrentUser(null);
                setIsAdminViewActive(false);
              }}
              onCloseAdmin={() => setIsAdminViewActive(false)}
              isDarkMode={isDarkMode}
            />
          ) : (
            <>
              {(activeTab === "services" || activeTab === "home") && (
                <HomeView
                  appState={appState}
                  onUpdateAppState={setAppState}
                  accountType={accountType}
                  setAccountType={setAccountType}
                  patient={selectedPatient}
                  patients={patients}
                  currentUser={currentUser}
                  onSelectPatient={setSelectedPatientId}
                  onAddPatient={handleAddPatient}
                  onNavigateToTab={(tab) => handleNavigateTo(tab)}
                  onNavigateToCareSubTab={(sub) => {
                    handleNavigateTo("care", sub);
                  }}
                  onNavigateToServicesLibrary={() => handleNavigateTo("library")}
                  onNavigateToChallenges={() => {
                    handleNavigateTo("care", "habit_challenges");
                  }}
                  onAddWater={handleAddWater}
                  onOpenSosModal={() => setIsSosOpen(true)}
                  onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
                  onOpenAiAssistantModal={() => setIsAiAssistantOpen(true)}
                  onOpenVoiceAssistantModal={() => setIsVoiceAssistantOpen(true)}
                  onOpenAuthModal={() => {
                    setAuthInitialTab("login");
                    setIsAuthModalOpen(true);
                  }}
                  onOpenUserProfileModal={(tab) => {
                    if (tab) setUserProfileInitialTab(tab);
                    setIsUserProfileModalOpen(true);
                  }}
                  isAiToolsExpanded={isAiToolsExpanded}
                />
              )}

              {activeTab === "community" && (
                <CommunityFeedMessageView
                  patient={selectedPatient}
                  onNavigateToCareSubTab={(sub) => {
                    handleNavigateTo("care", sub);
                  }}
                />
              )}

              {activeTab === "insight" && (
                <InsightsHubView
                  patient={selectedPatient}
                  onNavigateToCareSubTab={(sub) => {
                    handleNavigateTo("care", sub);
                  }}
                />
              )}

              {activeTab === "track" && (
                <TrackProgressView
                  patient={selectedPatient}
                  onBack={handleGoBack}
                  onNavigateToWater={() => {
                    handleNavigateTo("care", "water");
                  }}
                  onNavigateToSubTab={(sub) => {
                    handleNavigateTo("care", sub);
                  }}
                  onToggleMedication={handleToggleMedication}
                  onAddVitalSign={handleAddVitalSign}
                  onUpdateCaregiverNotes={handleUpdateCaregiverNotes}
                />
              )}

              {activeTab === "care" && (
                <div className="space-y-3 max-w-7xl mx-auto">
                  {/* CLEAN LIGHT CARE SUITE NAVIGATION BAR */}
                  <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
                    {/* Back Button (Immediate Screen Back) */}
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-800 text-base font-black rounded-xl border border-slate-300 flex items-center justify-center cursor-pointer transition-all shrink-0"
                      title="Back to Previous Screen"
                    >
                      ←
                    </button>

                    {/* Scrollable Services (White for unselected, #2E7D32 Green for selected) */}
                    <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center gap-1.5 py-0.5">
                      {[
                        { id: "vitals", label: "🩺 Vitals & SpO2" },
                        { id: "sos", label: "🆘 SOS" },
                        { id: "elderly", label: "👴 Elderly Care" },
                        { id: "medicine", label: "💊 Medicine" },
                        { id: "water", label: "💧 Water" },
                        { id: "steps", label: "🚶 Steps" },
                        { id: "yoga", label: "🧘 Yoga" },
                        { id: "mood", label: "😊 Mood" },
                        { id: "exercise", label: "🏋️ Exercise" },
                        { id: "mental", label: "🧠 Mental" },
                        { id: "habit_challenges", label: "🏆 21-Day Challenges" },
                        { id: "habit", label: "📈 Habits" },
                        { id: "kids", label: "👶 Kids Care" },
                        { id: "family_tree", label: "👨‍👩‍👧‍👦 Family Tree" },
                        { id: "pets", label: "🐾 Pets" },
                        { id: "menstrual", label: "🌸 Menstrual" },
                        { id: "sleep", label: "🌙 Sleep" },
                        { id: "life_dates", label: "💝 Life Dates" },
                        { id: "nutrition", label: "🍽️ Nutrition" },
                        { id: "staff_payroll", label: "💼 Staff HR" },
                        { id: "contracts", label: "📜 Contracts" },
                        { id: "inventory", label: "📦 Inventory" },
                        { id: "property", label: "🏠 Property" },
                        { id: "jobs", label: "💼 Careers" },
                        { id: "finance", label: "💰 Finance" },
                        { id: "vehicles", label: "🚗 Vehicles" },
                        { id: "garden", label: "🌿 Garden & Farm" },
                        { id: "calendar", label: "🌍 40+ Calendars" },
                        { id: "paperless", label: "📄 Paperless Cards" },
                        { id: "passwords", label: "🔐 Passwords" },
                        { id: "hybrid_storage", label: "📁 Cloud Drive" },
                        { id: "custom_store", label: "🛒 Custom Store" },
                      ]
                        .sort((a, b) => {
                          const uA = tabUsage[a.id] || { count: 0, lastUsed: 0 };
                          const uB = tabUsage[b.id] || { count: 0, lastUsed: 0 };
                          const scoreA = uA.count * 100000000000 + uA.lastUsed;
                          const scoreB = uB.count * 100000000000 + uB.lastUsed;
                          return scoreB - scoreA;
                        })
                        .map((tab) => {
                          const isActive = careSubTab === tab.id;
                          const usage = tabUsage[tab.id];
                          return (
                            <button
                              key={tab.id}
                              onClick={() => handleSelectCareSubTab(tab.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border whitespace-nowrap ${
                                isActive
                                  ? "bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs"
                                  : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200 font-bold"
                              }`}
                            >
                              <span>{tab.label}</span>
                              {usage && usage.count > 0 && !isActive && (
                                <span className="text-[9px] bg-emerald-100 text-[#2E7D32] font-extrabold px-1.5 rounded-full">
                                  {usage.count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* SERVICE CONTENT CONTAINER */}
                  {isCareServiceExpanded && (
                    <div className="space-y-4">
                      {isModuleLoading ? (
                        <ModuleLoadingSkeleton moduleName={careSubTab} />
                      ) : (
                        <ErrorBoundary key={careSubTab} fallbackTitle="Service Module Render Protection">
                          {careSubTab === "vitals" && (
                            <FeatureGuard featureId="health_vitals" featureName="Health Vitals & SpO2">
                              <TrackProgressView
                                patient={selectedPatient}
                                onNavigateToWater={() => {
                                  setActiveTab("care");
                                  setCareSubTab("water");
                                }}
                                onNavigateToSubTab={(sub) => {
                                  setActiveTab("care");
                                  setCareSubTab(sub as any);
                                }}
                                onToggleMedication={handleToggleMedication}
                                onAddVitalSign={handleAddVitalSign}
                                onUpdateCaregiverNotes={handleUpdateCaregiverNotes}
                              />
                            </FeatureGuard>
                          )}
                          {careSubTab === "sos" && (
                            <FeatureGuard featureId="sos_emergency" featureName="SOS Emergency Panic Button">
                              <SosEmergencyTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "calendar" && <CalendarConverterTracker />}
                          {careSubTab === "medicine" && (
                            <FeatureGuard featureId="medicine" featureName="Medicine & Refill Manager">
                              <MedicineManagementService
                                onBack={handleGoBack}
                              />
                            </FeatureGuard>
                          )}
                          {careSubTab === "water" && (
                            <FeatureGuard featureId="water_hydration" featureName="Hydration & Water Tracker">
                              <WaterTracker
                                patient={selectedPatient}
                                onAddWater={handleAddWater}
                                onRemoveWaterLog={handleRemoveWaterLog}
                              />
                            </FeatureGuard>
                          )}
                          {careSubTab === "steps" && (
                            <FeatureGuard featureId="steps_exercise" featureName="Steps & Activity Log">
                              <StepsTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "yoga" && (
                            <FeatureGuard featureId="yoga_meditation" featureName="Yoga & Mindfulness">
                              <YogaMeditationTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "mood" && (
                            <FeatureGuard featureId="mood_habits" featureName="Mood & Recovery Log">
                              <MoodHabitJournal patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "elderly" && (
                            <FeatureGuard featureId="elderly_care" featureName="Elderly & Senior Portal">
                              <ElderlyCareTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "exercise" && <ExerciseTracker patient={selectedPatient} />}
                          {careSubTab === "mental" && <MentalHealthApp patientName={selectedPatient?.name || "Roshan"} />}
                          {(careSubTab === "habit_challenges" || careSubTab === "challenges") && (
                            <HabitChallenges onBackToHome={handleGoBack} />
                          )}
                          {careSubTab === "habit" && <HabitAndRecoveryTracker patient={selectedPatient} />}
                          {careSubTab === "kids" && (
                            <FeatureGuard featureId="kids_care" featureName="Kids & Pediatric Care">
                              <KidsCareTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "family_tree" && (
                            <FeatureGuard featureId="family_tree" featureName="Family Tree & Heritage">
                              <FamilyTreeTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "staff_payroll" && (
                            <FeatureGuard featureId="staff_payroll" featureName="Staff HR & Payroll">
                              <StaffAndPayrollTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "contracts" && (
                            <FeatureGuard featureId="contract_legal" featureName="Contract & Legal Vault">
                              <ContractManagementTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "vehicles" && (
                            <FeatureGuard featureId="vehicles_care" featureName="Vehicle Care & Mileage">
                              <VehicleCareTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "property" && (
                            <FeatureGuard featureId="property_farm" featureName="Property, Land & Farm">
                              <PropertyLandTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "pets" && (
                            <FeatureGuard featureId="pets_care" featureName="Pet & Vet Care">
                              <PetCareTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "nutrition" && <NutritionTracker patient={selectedPatient} />}
                          {careSubTab === "billing" && (
                            <FeatureGuard featureId="billing_invoices" featureName="Billing & Invoice Suite">
                              <BillingInvoiceService onBack={handleGoBack} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "finance" && (
                            <FeatureGuard featureId="finance_budget" featureName="Finance & Cash Flow">
                              <FinanceBudgetTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "garden" && <FarmGardenService onBack={() => setCareSubTab(null)} />}
                          {(careSubTab === "jobs" || careSubTab === "career") && <JobSearchCareerTracker patient={selectedPatient} />}
                          {careSubTab === "ticket_queue" && (
                            <FeatureGuard featureId="ticket_queue" featureName="Digital Ticket & Queue Counter">
                              <TicketQueueManagementTracker />
                            </FeatureGuard>
                          )}
                          {careSubTab === "paperless" && (
                            <FeatureGuard featureId="paperless_docs" featureName="Paperless Digital Vault">
                              <IGOPaperlessTracker patient={selectedPatient} />
                            </FeatureGuard>
                          )}
                          {careSubTab === "life_dates" && <LifeDatesTracker patient={selectedPatient} />}
                          {careSubTab === "inventory" && (
                            <FeatureGuard featureId="retail_inventory_pos" featureName="Retail POS & Stock Inventory">
                              <InventoryManagementService />
                            </FeatureGuard>
                          )}
                          {careSubTab === "passwords" && (
                            <FeatureGuard featureId="passwords_vault" featureName="Encrypted Password Manager">
                              <PasswordManagementTracker />
                            </FeatureGuard>
                          )}
                          {careSubTab === "menstrual" && <MenstrualCycleTracker />}
                          {careSubTab === "sleep" && <SleepTracker />}
                          {careSubTab === "hybrid_storage" && <HybridStorageManagerView />}
                          {careSubTab === "custom_store" && (
                            <FeatureGuard featureId="custom_store_marketplace" featureName="Custom E-Commerce Store & Marketplace">
                              <CustomStoreService onBack={() => handleNavigateTo("more")} />
                            </FeatureGuard>
                          )}
                        </ErrorBoundary>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "plan" && (
                <PlanAndScheduleView
                  patient={selectedPatient}
                  onAddMedication={handleAddMedication}
                  onBack={handleGoBack}
                />
              )}

              {activeTab === "more" && (
                <ServicesAndToolsView
                  accountType={accountType}
                  setAccountType={setAccountType}
                  documents={documents}
                  memoEntries={memoEntries}
                  serviceProviders={INITIAL_SERVICE_PROVIDERS}
                  onAddMemoEntry={handleAddMemoEntry}
                  onExportBackup={handleExportBackup}
                  onImportBackup={handleImportBackup}
                  onBack={handleGoBack}
                  onSelectCareSubTab={(tab) => {
                    handleNavigateTo("care", tab);
                  }}
                />
              )}

              {activeTab === "library" && (
                <ServiceLibrary
                  onBackToHome={() => handleNavigateTo("home")}
                  onSelectService={(subTabTarget) => {
                    if (subTabTarget === "track") {
                      handleNavigateTo("track");
                    } else if (subTabTarget === "plan") {
                      handleNavigateTo("plan");
                    } else if (subTabTarget === "community") {
                      handleNavigateTo("community");
                    } else if (subTabTarget === "insight") {
                      handleNavigateTo("insight");
                    } else if (
                      subTabTarget === "more" ||
                      subTabTarget === "tools" ||
                      subTabTarget === "credit_ledger"
                    ) {
                      handleNavigateTo("more");
                    } else if (subTabTarget === "camera" || subTabTarget === "qr_scanner") {
                      setIsCameraOpen(true);
                    } else if (subTabTarget === "ai_assistant") {
                      setIsAiAssistantOpen(true);
                    } else if (subTabTarget === "sos_modal") {
                      setIsSosOpen(true);
                    } else if (
                      subTabTarget === "visiting_cards" ||
                      subTabTarget === "tickets" ||
                      subTabTarget === "certificates" ||
                      subTabTarget === "coupons" ||
                      subTabTarget === "qr_generator" ||
                      subTabTarget === "signatures"
                    ) {
                      handleNavigateTo("care", "paperless");
                    } else {
                      handleNavigateTo("care", subTabTarget as any);
                    }
                  }}
                />
              )}
            </>
          )}
        </ErrorBoundary>
      </main>

      {/* Bottom Modals & Quick Actions (Bottom Navigation bar removed as per design system migration) */}
      <QuickActionOverlay
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onSelectAction={(tab, sub) => {
          setActiveTab(tab);
          if (sub) setCareSubTab(sub as any);
        }}
        onOpenSosModal={() => setIsSosOpen(true)}
      />

      {/* Camera & AI Scanner Modal */}
      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onAddMedication={(med: any) => handleAddMedication(selectedPatientId, med)}
      />

      {/* Emergency SOS Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* Care2Care AI Assistant Floating Modal */}
      <Care2CareAiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

      {/* Voice Assistant & Dictation Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onNavigateService={(subTab) => {
          setActiveTab("care");
          setCareSubTab(subTab as any);
        }}
        onTriggerAction={(action) => {
          if (action === "EXPORT_PDF") {
            const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
            if (selectedPatient) generatePatientPDFReport(selectedPatient);
          }
        }}
        currentNotes={
          (patients.find((p) => p.id === selectedPatientId) || patients[0])?.caregiverNotes || ""
        }
        onUpdateCaregiverNotes={(notes) => {
          handleUpdateCaregiverNotes(selectedPatientId || patients[0]?.id || "p-1", notes);
        }}
      />

      {/* App Entrance Splash & Logo Animation Modal */}
      <SplashEntranceAnimation
        isOpen={isSplashOpen}
        onClose={() => setIsSplashOpen(false)}
        onOpenWelcome={() => {
          setIsSplashOpen(false);
          setAuthInitialTab("welcome");
          setIsAuthModalOpen(true);
        }}
        onOpenLogin={() => {
          setIsSplashOpen(false);
          setAuthInitialTab("login");
          setIsAuthModalOpen(true);
        }}
        onOpenSignup={() => {
          setIsSplashOpen(false);
          setAuthInitialTab("signup");
          setIsAuthModalOpen(true);
        }}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === "admin") {
            setIsAdminViewActive(true);
          } else {
            setIsAdminViewActive(false);
          }
          try {
            localStorage.setItem("care2care_auth_user", JSON.stringify(user));
          } catch (e) {
            console.error(e);
          }
        }}
        onSelectLanguage={setCurrentLanguage}
        currentLanguage={currentLanguage}
      />

      {/* Authentication, Welcome & Credentials Modal */}
      <AuthModalAndWelcome
        isOpen={isAuthModalOpen}
        initialTab={authInitialTab}
        currentUser={currentUser}
        onClose={() => setIsAuthModalOpen(false)}
        onLogout={() => {
          authLogout();
          setCurrentUser(null);
          setIsAdminViewActive(false);
          try {
            localStorage.removeItem("care2care_auth_user");
          } catch (e) {
            console.error(e);
          }
        }}
        onLoginSuccess={(user) => {
          authLogin(user);
          setCurrentUser(user);
          if (user.role === "admin") {
            setIsAdminViewActive(true);
          } else {
            setIsAdminViewActive(false);
          }
          try {
            localStorage.setItem("care2care_auth_user", JSON.stringify(user));
          } catch (e) {
            console.error(e);
          }
        }}
      />


      {/* User Personal & Professional Profile Details & AI Analysis Suite Modal */}
      <UserProfileManagerModal
        isOpen={isUserProfileModalOpen}
        initialTab={userProfileInitialTab}
        onClose={() => setIsUserProfileModalOpen(false)}
        patients={patients}
      />

      {/* User Tax Receipts Vault Modal */}
      <UserReceiptVaultModal
        isOpen={isReceiptVaultOpen}
        onClose={() => setIsReceiptVaultOpen(false)}
      />

      {/* Re-config Wizard (Smart Setup Choice Modal) */}
      {isReconfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl my-8 relative">
            <button
              type="button"
              onClick={() => setIsReconfigModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors cursor-pointer z-10"
            >
              ✕
            </button>
            <OnboardingWizard
              appState={appState}
              onUpdateAppState={setAppState}
              onCompleteOnboarding={() => setIsReconfigModalOpen(false)}
              isModalMode={true}
              onCloseModal={() => setIsReconfigModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Add Member / Family Member Form Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        isDarkMode={isDarkMode}
        onAddMember={(newMember) => {
          // Add to patients/family members list dynamically
          if (newMember.category === "family" || newMember.category === "elderly") {
            const newPatient: Patient = {
              id: newMember.id,
              name: newMember.name,
              age: 65,
              category: newMember.category === "elderly" ? "Elderly" : "General",
              avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
              vitals: [],
              waterCurrentMl: 0,
              waterGoalMl: 2500,
              waterLogs: [],
              medications: [],
              mood: "Calm",
              sleepHours: 8,
              caregiverNotes: newMember.notes || `${newMember.relationOrRole}`,
              emergencyContact: {
                name: "Primary Family",
                phone: newMember.phone || "+977 9800000000",
                relation: newMember.relationOrRole || "Family",
              },
              lastCheckIn: "Just added",
              status: "Stable",
              relationship: newMember.relationOrRole,
            };
            setPatients((prev) => [...prev, newPatient]);
          } else if (newMember.category === "child") {
            const newKid = {
              id: newMember.id,
              name: newMember.name,
              dateOfBirth: newMember.dateOfBirth || "2020-01-01",
              growthLogs: [],
              milestones: [],
              vaccinations: [],
            };
            setFamilyMembers((prev: any) => [...prev, newKid]);
          }
        }}
      />

      {/* Paddle Payment & Subscription Modal */}
      <PaddlePaymentModal
        isOpen={isPaddleModalOpen}
        onClose={() => setIsPaddleModalOpen(false)}
        currentPlan={currentUser?.plan || "Free"}
        onSubscriptionSuccess={(newPlan) => {
          if (currentUser) {
            const updated = { ...currentUser, plan: newPlan };
            setCurrentUser(updated);
            try {
              localStorage.setItem("care2care_auth_user", JSON.stringify(updated));
            } catch (e) {
              console.error(e);
            }
          }
        }}
      />

      {/* Modern Bottom Navigation Suite */}
      <BottomNavigation
        activeTab={activeTab}
        setActiveTab={(tab) => handleNavigateTo(tab)}
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
        onOpenCamera={() => setIsCameraOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onOpenProfile={() => setIsUserProfileModalOpen(true)}
      />
      </div>
    </LanguageProvider>
  );
}
