// DataPropagationEngine.ts
// Central Data Propagation Engine & Rule Listener for Care2Care

export interface PropagatedFieldChange {
  id: string;
  targetModule: "Family Tree" | "Healthcare & Medical" | "Caregiver Details" | "Marketplace Store";
  recordId: string;
  recordName: string;
  field: string;
  fieldKey: string;
  oldValue: any;
  newValue: any;
  ruleApplied: string;
  overrideApplied: boolean; // true if skipped due to manual lock
  status: "SUCCESS" | "SKIPPED_MANUAL_LOCK" | "VERIFICATION_FLAGGED";
  verificationNotice?: string;
  timestamp: string;
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  sourceModule: "Profile Settings" | "Sub-Account Update" | "API Sync";
  changedMasterFields: string[];
  propagatedChanges: PropagatedFieldChange[];
  totalPropagated: number;
  totalSkippedLocks: number;
  totalFlaggedVerifications: number;
  status: "SUCCESS" | "PARTIAL_SKIPPED" | "VERIFICATION_REQUIRED";
}

const FIELD_LOCKS_STORAGE_KEY = "care2care_field_source_locks";
const SYNC_LOGS_STORAGE_KEY = "care2care_sync_logs";

// Get field source lock map from LocalStorage
export function getFieldSourceMap(): Record<string, "auto_sync" | "manual"> {
  try {
    const raw = localStorage.getItem(FIELD_LOCKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// Check if a specific target field is locked manually
export function isFieldLockedManually(targetFieldKey: string): boolean {
  const map = getFieldSourceMap();
  return map[targetFieldKey] === "manual";
}

// Mark a specific field as manually edited by the user
export function lockFieldAsManual(targetFieldKey: string): void {
  try {
    const map = getFieldSourceMap();
    map[targetFieldKey] = "manual";
    localStorage.setItem(FIELD_LOCKS_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error("Error locking field as manual:", e);
  }
}

// Mark a specific field as auto_synced
export function setFieldAsAutoSynced(targetFieldKey: string): void {
  try {
    const map = getFieldSourceMap();
    map[targetFieldKey] = "auto_sync";
    localStorage.setItem(FIELD_LOCKS_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error("Error setting field auto_sync:", e);
  }
}

// Get all sync logs from local storage
export function getLocalSyncLogs(): SyncLogEntry[] {
  try {
    const raw = localStorage.getItem(SYNC_LOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : getInitialDemoLogs();
  } catch (e) {
    return getInitialDemoLogs();
  }
}

// Save sync log entry
export function saveSyncLogEntry(entry: SyncLogEntry): void {
  try {
    const logs = getLocalSyncLogs();
    const updated = [entry, ...logs.slice(0, 49)];
    localStorage.setItem(SYNC_LOGS_STORAGE_KEY, JSON.stringify(updated));

    // Also sync to backend API if reachable
    fetch("/api/sync-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    }).catch(() => {
      // Ignore API offline fallback
    });
  } catch (e) {
    console.error("Error saving sync log entry:", e);
  }
}

// Central Data Propagation Engine Main Function
export function propagateUserProfileUpdates(
  updatedProfile: any,
  oldProfile: any = {},
  source: "Profile Settings" | "Sub-Account Update" = "Profile Settings"
): { syncLog: SyncLogEntry; summaryText: string; affectedModules: string[] } {
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
  const userId = updatedProfile.id || updatedProfile.email || "usr-primary";
  const userName = updatedProfile.fullName || updatedProfile.name || "Primary User";

  const changedFields: string[] = [];
  const propagatedChanges: PropagatedFieldChange[] = [];

  // Identify changed master fields
  const masterFieldsToCheck = [
    { key: "fullName", label: "Full Name" },
    { key: "gender", label: "Gender" },
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "maritalStatus", label: "Marital Status" },
    { key: "phone", label: "Phone Number" },
    { key: "email", label: "Email Address" },
    { key: "address", label: "Home Address" },
    { key: "bloodGroup", label: "Blood Group" },
    { key: "emergencyContact", label: "Emergency Contact" },
    { key: "allergies", label: "Allergies" },
    { key: "chronicConditions", label: "Chronic Conditions" },
  ];

  masterFieldsToCheck.forEach((mf) => {
    if (updatedProfile[mf.key] !== undefined && updatedProfile[mf.key] !== oldProfile[mf.key]) {
      changedFields.push(mf.label);
    }
  });

  // Default fallback if no oldProfile was passed
  if (changedFields.length === 0) {
    changedFields.push("Personal Demographics", "Contact Info");
  }

  // ============================================================
  // RULE A: User Profile => Family Tree
  // ============================================================
  try {
    const familyDataRaw = localStorage.getItem("family_members_data");
    let familyMembers: any[] = familyDataRaw ? JSON.parse(familyDataRaw) : [];

    // Find Self or Primary member
    let selfMemberIndex = familyMembers.findIndex((m) => m.isSelf || m.id === "self" || m.email === updatedProfile.email);
    if (selfMemberIndex === -1 && familyMembers.length > 0) {
      selfMemberIndex = 0;
    }

    if (selfMemberIndex !== -1) {
      const selfMember = familyMembers[selfMemberIndex];

      // Rule A1: Gender
      if (updatedProfile.gender) {
        const fieldKey = `family_tree.${selfMember.id}.gender`;
        const isLocked = isFieldLockedManually(fieldKey);
        const mappedGender = updatedProfile.gender.toLowerCase() === "female" ? "Female" : updatedProfile.gender.toLowerCase() === "male" ? "Male" : "Other";
        
        if (isLocked) {
          propagatedChanges.push({
            id: `change-${Date.now()}-1`,
            targetModule: "Family Tree",
            recordId: selfMember.id,
            recordName: `${selfMember.firstName || ""} ${selfMember.lastName || ""}`.trim() || "Self Record",
            field: "Gender",
            fieldKey,
            oldValue: selfMember.gender,
            newValue: mappedGender,
            ruleApplied: "Rule A1: Profile => Family Tree Gender",
            overrideApplied: true,
            status: "SKIPPED_MANUAL_LOCK",
            timestamp,
          });
        } else {
          propagatedChanges.push({
            id: `change-${Date.now()}-1`,
            targetModule: "Family Tree",
            recordId: selfMember.id,
            recordName: `${selfMember.firstName || ""} ${selfMember.lastName || ""}`.trim() || "Self Record",
            field: "Gender",
            fieldKey,
            oldValue: selfMember.gender || "Not Set",
            newValue: mappedGender,
            ruleApplied: "Rule A1: Profile => Family Tree Gender",
            overrideApplied: false,
            status: "SUCCESS",
            timestamp,
          });
          selfMember.gender = mappedGender;
          setFieldAsAutoSynced(fieldKey);
        }
      }

      // Rule A2: Date of Birth
      if (updatedProfile.dateOfBirth) {
        const fieldKey = `family_tree.${selfMember.id}.dateOfBirth`;
        const isLocked = isFieldLockedManually(fieldKey);

        if (isLocked) {
          propagatedChanges.push({
            id: `change-${Date.now()}-2`,
            targetModule: "Family Tree",
            recordId: selfMember.id,
            recordName: `${selfMember.firstName || ""} ${selfMember.lastName || ""}`.trim() || "Self Record",
            field: "Date of Birth",
            fieldKey,
            oldValue: selfMember.dateOfBirth,
            newValue: updatedProfile.dateOfBirth,
            ruleApplied: "Rule A2: Profile => Family Tree DOB",
            overrideApplied: true,
            status: "SKIPPED_MANUAL_LOCK",
            timestamp,
          });
        } else {
          propagatedChanges.push({
            id: `change-${Date.now()}-2`,
            targetModule: "Family Tree",
            recordId: selfMember.id,
            recordName: `${selfMember.firstName || ""} ${selfMember.lastName || ""}`.trim() || "Self Record",
            field: "Date of Birth",
            fieldKey,
            oldValue: selfMember.dateOfBirth || "Not Set",
            newValue: updatedProfile.dateOfBirth,
            ruleApplied: "Rule A2: Profile => Family Tree DOB",
            overrideApplied: false,
            status: "SUCCESS",
            timestamp,
          });
          selfMember.dateOfBirth = updatedProfile.dateOfBirth;
          setFieldAsAutoSynced(fieldKey);
        }
      }

      // Rule A3: Marital Status Verification Flag for Spouse
      if (updatedProfile.maritalStatus) {
        const spouse = familyMembers.find((m) => m.relation === "Spouse" || m.id === selfMember.spouseIds?.[0]);
        if (spouse) {
          const fieldKey = `family_tree.${spouse.id}.maritalStatusVerification`;
          propagatedChanges.push({
            id: `change-${Date.now()}-3`,
            targetModule: "Family Tree",
            recordId: spouse.id,
            recordName: `${spouse.firstName || ""} ${spouse.lastName || ""}`.trim() || "Spouse",
            field: "Marital Status Verification",
            fieldKey,
            oldValue: spouse.maritalStatus || "Unverified",
            newValue: `Verification Flagged: ${updatedProfile.maritalStatus}`,
            ruleApplied: "Rule A3: Profile Marital Status Spouse Privacy Flag",
            overrideApplied: false,
            status: "VERIFICATION_FLAGGED",
            verificationNotice: `Primary user updated marital status to "${updatedProfile.maritalStatus}". Spouse profile flagged for verification before auto-syncing.`,
            timestamp,
          });
          spouse.verificationRequired = true;
          spouse.pendingMaritalStatusChange = updatedProfile.maritalStatus;
        }
      }

      // Sync name & contact
      if (updatedProfile.fullName) {
        const parts = updatedProfile.fullName.split(" ");
        selfMember.firstName = parts[0] || selfMember.firstName;
        if (parts.length > 1) selfMember.lastName = parts.slice(1).join(" ");
      }
      if (updatedProfile.phone) selfMember.phone = updatedProfile.phone;
      if (updatedProfile.email) selfMember.email = updatedProfile.email;
      if (updatedProfile.address) selfMember.permanentAddress = updatedProfile.address;
      if (updatedProfile.bloodGroup) selfMember.bloodGroup = updatedProfile.bloodGroup;

      familyMembers[selfMemberIndex] = selfMember;
      localStorage.setItem("family_members_data", JSON.stringify(familyMembers));
    }
  } catch (e) {
    console.error("Rule A execution error:", e);
  }

  // ============================================================
  // RULE B: User Profile => Healthcare & Medical Records
  // ============================================================
  try {
    const rawDemo = localStorage.getItem("patient_demographics");
    let patientObj = rawDemo ? JSON.parse(rawDemo) : { name: userName, age: updatedProfile.age || 38 };

    const fieldKeyGender = `medical_records.patient.gender`;
    const fieldKeyDOB = `medical_records.patient.dateOfBirth`;

    if (updatedProfile.gender) {
      if (isFieldLockedManually(fieldKeyGender)) {
        propagatedChanges.push({
          id: `change-${Date.now()}-4`,
          targetModule: "Healthcare & Medical",
          recordId: "patient-1",
          recordName: patientObj.name || userName,
          field: "Gender",
          fieldKey: fieldKeyGender,
          oldValue: patientObj.gender,
          newValue: updatedProfile.gender,
          ruleApplied: "Rule B1: Profile => Patient Demographics Gender",
          overrideApplied: true,
          status: "SKIPPED_MANUAL_LOCK",
          timestamp,
        });
      } else {
        propagatedChanges.push({
          id: `change-${Date.now()}-4`,
          targetModule: "Healthcare & Medical",
          recordId: "patient-1",
          recordName: patientObj.name || userName,
          field: "Gender",
          fieldKey: fieldKeyGender,
          oldValue: patientObj.gender || "Not Set",
          newValue: updatedProfile.gender,
          ruleApplied: "Rule B1: Profile => Patient Demographics Gender",
          overrideApplied: false,
          status: "SUCCESS",
          timestamp,
        });
        patientObj.gender = updatedProfile.gender;
        setFieldAsAutoSynced(fieldKeyGender);
      }
    }

    if (updatedProfile.dateOfBirth) {
      if (isFieldLockedManually(fieldKeyDOB)) {
        propagatedChanges.push({
          id: `change-${Date.now()}-5`,
          targetModule: "Healthcare & Medical",
          recordId: "patient-1",
          recordName: patientObj.name || userName,
          field: "Date of Birth",
          fieldKey: fieldKeyDOB,
          oldValue: patientObj.dateOfBirth,
          newValue: updatedProfile.dateOfBirth,
          ruleApplied: "Rule B2: Profile => Patient Demographics DOB",
          overrideApplied: true,
          status: "SKIPPED_MANUAL_LOCK",
          timestamp,
        });
      } else {
        propagatedChanges.push({
          id: `change-${Date.now()}-5`,
          targetModule: "Healthcare & Medical",
          recordId: "patient-1",
          recordName: patientObj.name || userName,
          field: "Date of Birth",
          fieldKey: fieldKeyDOB,
          oldValue: patientObj.dateOfBirth || "Not Set",
          newValue: updatedProfile.dateOfBirth,
          ruleApplied: "Rule B2: Profile => Patient Demographics DOB",
          overrideApplied: false,
          status: "SUCCESS",
          timestamp,
        });
        patientObj.dateOfBirth = updatedProfile.dateOfBirth;
        if (updatedProfile.age) patientObj.age = updatedProfile.age;
        setFieldAsAutoSynced(fieldKeyDOB);
      }
    }

    if (updatedProfile.allergies) patientObj.allergies = updatedProfile.allergies;
    if (updatedProfile.chronicConditions) patientObj.chronicConditions = updatedProfile.chronicConditions;
    if (updatedProfile.bloodGroup) patientObj.bloodGroup = updatedProfile.bloodGroup;

    localStorage.setItem("patient_demographics", JSON.stringify(patientObj));
  } catch (e) {
    console.error("Rule B execution error:", e);
  }

  // ============================================================
  // RULE C: User Profile => Caregiver Details
  // ============================================================
  try {
    const rawCaregiver = localStorage.getItem("caregiver_profile");
    let caregiver = rawCaregiver ? JSON.parse(rawCaregiver) : { caregiverName: "Default Caregiver", emergencyPhone: "+977 9801234567" };

    const fieldKeyContact = `caregiver.emergencyContact`;

    if (updatedProfile.phone || updatedProfile.emergencyContact || updatedProfile.address) {
      const newEmergencyContact = typeof updatedProfile.emergencyContact === "object"
        ? `${updatedProfile.emergencyContact.name || "Contact"} (${updatedProfile.emergencyContact.phone || updatedProfile.phone})`
        : updatedProfile.emergencyContact || updatedProfile.phone;

      if (isFieldLockedManually(fieldKeyContact)) {
        propagatedChanges.push({
          id: `change-${Date.now()}-6`,
          targetModule: "Caregiver Details",
          recordId: "caregiver-1",
          recordName: caregiver.caregiverName || "Primary Caregiver",
          field: "Emergency Contact & Address",
          fieldKey: fieldKeyContact,
          oldValue: caregiver.emergencyContact,
          newValue: newEmergencyContact,
          ruleApplied: "Rule C1: Profile => Caregiver Emergency Contact",
          overrideApplied: true,
          status: "SKIPPED_MANUAL_LOCK",
          timestamp,
        });
      } else {
        propagatedChanges.push({
          id: `change-${Date.now()}-6`,
          targetModule: "Caregiver Details",
          recordId: "caregiver-1",
          recordName: caregiver.caregiverName || "Primary Caregiver",
          field: "Emergency Contact & Address",
          fieldKey: fieldKeyContact,
          oldValue: caregiver.emergencyContact || caregiver.emergencyPhone || "Not Set",
          newValue: newEmergencyContact,
          ruleApplied: "Rule C1: Profile => Caregiver Emergency Contact",
          overrideApplied: false,
          status: "SUCCESS",
          timestamp,
        });
        caregiver.emergencyContact = newEmergencyContact;
        caregiver.address = updatedProfile.address || caregiver.address;
        caregiver.patientPhone = updatedProfile.phone || caregiver.patientPhone;
        setFieldAsAutoSynced(fieldKeyContact);
      }
    }

    localStorage.setItem("caregiver_profile", JSON.stringify(caregiver));
  } catch (e) {
    console.error("Rule C execution error:", e);
  }

  // ============================================================
  // RULE D: User Profile => Marketplace Store Owner
  // ============================================================
  try {
    const rawStore = localStorage.getItem("custom_store_config");
    let storeConfig = rawStore ? JSON.parse(rawStore) : { storeName: "My Enterprise Pharmacy & Store" };

    const fieldKeyStoreProprietor = `marketplace_store.proprietor`;

    if (updatedProfile.fullName || updatedProfile.email || updatedProfile.phone) {
      if (isFieldLockedManually(fieldKeyStoreProprietor)) {
        propagatedChanges.push({
          id: `change-${Date.now()}-7`,
          targetModule: "Marketplace Store",
          recordId: "store-1",
          recordName: storeConfig.storeName || "Marketplace Store",
          field: "Store Proprietor Info",
          fieldKey: fieldKeyStoreProprietor,
          oldValue: storeConfig.proprietorName,
          newValue: userName,
          ruleApplied: "Rule D1: Profile => Marketplace Store Owner",
          overrideApplied: true,
          status: "SKIPPED_MANUAL_LOCK",
          timestamp,
        });
      } else {
        propagatedChanges.push({
          id: `change-${Date.now()}-7`,
          targetModule: "Marketplace Store",
          recordId: "store-1",
          recordName: storeConfig.storeName || "Marketplace Store",
          field: "Store Proprietor Info",
          fieldKey: fieldKeyStoreProprietor,
          oldValue: storeConfig.proprietorName || "Not Set",
          newValue: userName,
          ruleApplied: "Rule D1: Profile => Marketplace Store Owner",
          overrideApplied: false,
          status: "SUCCESS",
          timestamp,
        });
        storeConfig.proprietorName = userName;
        storeConfig.contactEmail = updatedProfile.email || storeConfig.contactEmail;
        storeConfig.contactPhone = updatedProfile.phone || storeConfig.contactPhone;
        storeConfig.storeAddress = updatedProfile.address || storeConfig.storeAddress;
        setFieldAsAutoSynced(fieldKeyStoreProprietor);
      }
    }

    localStorage.setItem("custom_store_config", JSON.stringify(storeConfig));
  } catch (e) {
    console.error("Rule D execution error:", e);
  }

  // Compute Statistics
  const totalPropagated = propagatedChanges.filter((c) => c.status === "SUCCESS").length;
  const totalSkippedLocks = propagatedChanges.filter((c) => c.status === "SKIPPED_MANUAL_LOCK").length;
  const totalFlaggedVerifications = propagatedChanges.filter((c) => c.status === "VERIFICATION_FLAGGED").length;

  const affectedModuleSet = new Set(propagatedChanges.map((c) => c.targetModule));
  const affectedModules = Array.from(affectedModuleSet);

  const overallStatus = totalFlaggedVerifications > 0
    ? "VERIFICATION_REQUIRED"
    : totalSkippedLocks > 0
    ? "PARTIAL_SKIPPED"
    : "SUCCESS";

  const syncLog: SyncLogEntry = {
    id: `log-${Date.now()}`,
    timestamp,
    userId,
    userName,
    sourceModule: source,
    changedMasterFields: changedFields,
    propagatedChanges,
    totalPropagated,
    totalSkippedLocks,
    totalFlaggedVerifications,
    status: overallStatus,
  };

  saveSyncLogEntry(syncLog);

  const summaryText = `Profile updated. ${totalPropagated} related record${totalPropagated === 1 ? "" : "s"} auto-synced across (${affectedModules.join(", ") || "No modules"}).`;

  return { syncLog, summaryText, affectedModules };
}

// Revert a sync log change
export function revertSyncChange(logId: string, changeId: string): boolean {
  try {
    const logs = getLocalSyncLogs();
    const logIndex = logs.findIndex((l) => l.id === logId);
    if (logIndex === -1) return false;

    const log = logs[logIndex];
    const change = log.propagatedChanges.find((c) => c.id === changeId);
    if (!change) return false;

    // Apply revert based on target module
    if (change.targetModule === "Family Tree") {
      const familyDataRaw = localStorage.getItem("family_members_data");
      if (familyDataRaw) {
        let members = JSON.parse(familyDataRaw);
        const member = members.find((m: any) => m.id === change.recordId || m.isSelf);
        if (member) {
          if (change.field === "Gender") member.gender = change.oldValue;
          if (change.field === "Date of Birth") member.dateOfBirth = change.oldValue;
          localStorage.setItem("family_members_data", JSON.stringify(members));
        }
      }
    } else if (change.targetModule === "Healthcare & Medical") {
      const rawDemo = localStorage.getItem("patient_demographics");
      if (rawDemo) {
        let p = JSON.parse(rawDemo);
        if (change.field === "Gender") p.gender = change.oldValue;
        if (change.field === "Date of Birth") p.dateOfBirth = change.oldValue;
        localStorage.setItem("patient_demographics", JSON.stringify(p));
      }
    }

    // Lock reverted field as manual
    lockFieldAsManual(change.fieldKey);

    change.status = "SKIPPED_MANUAL_LOCK";
    change.overrideApplied = true;
    change.newValue = `[REVERTED TO: ${change.oldValue}]`;

    logs[logIndex] = log;
    localStorage.setItem(SYNC_LOGS_STORAGE_KEY, JSON.stringify(logs));
    return true;
  } catch (e) {
    console.error("Error reverting sync change:", e);
    return false;
  }
}

// Demo initial logs for Admin Dashboard
function getInitialDemoLogs(): SyncLogEntry[] {
  return [
    {
      id: "log-demo-101",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      userId: "usr-1",
      userName: "Roshan Singh",
      sourceModule: "Profile Settings",
      changedMasterFields: ["Date of Birth", "Gender", "Marital Status", "Address"],
      propagatedChanges: [
        {
          id: "c-101",
          targetModule: "Family Tree",
          recordId: "self-1",
          recordName: "Roshan Singh (Self)",
          field: "Gender",
          fieldKey: "family_tree.self-1.gender",
          oldValue: "Not Set",
          newValue: "Male",
          ruleApplied: "Rule A1: Profile => Family Tree Gender",
          overrideApplied: false,
          status: "SUCCESS",
          timestamp: "2026-08-11 10:15",
        },
        {
          id: "c-102",
          targetModule: "Family Tree",
          recordId: "self-1",
          recordName: "Roshan Singh (Self)",
          field: "Date of Birth",
          fieldKey: "family_tree.self-1.dateOfBirth",
          oldValue: "1988-01-01",
          newValue: "1988-05-15",
          ruleApplied: "Rule A2: Profile => Family Tree DOB",
          overrideApplied: false,
          status: "SUCCESS",
          timestamp: "2026-08-11 10:15",
        },
        {
          id: "c-103",
          targetModule: "Family Tree",
          recordId: "spouse-1",
          recordName: "Sujata Singh (Spouse)",
          field: "Marital Status Verification",
          fieldKey: "family_tree.spouse-1.maritalStatusVerification",
          oldValue: "Single",
          newValue: "Verification Flagged: married",
          ruleApplied: "Rule A3: Profile Marital Status Spouse Privacy Flag",
          overrideApplied: false,
          status: "VERIFICATION_FLAGGED",
          verificationNotice: "User updated marital status to 'married'. Spouse profile flagged for verification.",
          timestamp: "2026-08-11 10:15",
        },
        {
          id: "c-104",
          targetModule: "Healthcare & Medical",
          recordId: "patient-1",
          recordName: "Roshan Singh",
          field: "Date of Birth",
          fieldKey: "medical_records.patient.dateOfBirth",
          oldValue: "1988-01-01",
          newValue: "1988-05-15",
          ruleApplied: "Rule B2: Profile => Patient Demographics DOB",
          overrideApplied: false,
          status: "SUCCESS",
          timestamp: "2026-08-11 10:15",
        },
        {
          id: "c-105",
          targetModule: "Caregiver Details",
          recordId: "caregiver-1",
          recordName: "Primary Caregiver",
          field: "Emergency Contact & Address",
          fieldKey: "caregiver.emergencyContact",
          oldValue: "Old Phone",
          newValue: "Sujata (+977 9841234567)",
          ruleApplied: "Rule C1: Profile => Caregiver Emergency Contact",
          overrideApplied: false,
          status: "SUCCESS",
          timestamp: "2026-08-11 10:15",
        },
        {
          id: "c-106",
          targetModule: "Marketplace Store",
          recordId: "store-1",
          recordName: "Apex Retail Pharmacy & Store",
          field: "Store Proprietor Info",
          fieldKey: "marketplace_store.proprietor",
          oldValue: "Roshan S.",
          newValue: "Roshan Singh",
          ruleApplied: "Rule D1: Profile => Marketplace Store Owner",
          overrideApplied: false,
          status: "SUCCESS",
          timestamp: "2026-08-11 10:15",
        },
      ],
      totalPropagated: 5,
      totalSkippedLocks: 0,
      totalFlaggedVerifications: 1,
      status: "VERIFICATION_REQUIRED",
    },
  ];
}
