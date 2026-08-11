import { getSupabaseClient } from "./supabase";
import { Patient, VitalSign, Medication } from "../types";

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
}

let currentSyncStatus: SyncStatus = {
  isSyncing: false,
  lastSyncedAt: null,
  error: null,
};

type SyncListener = (status: SyncStatus) => void;
const listeners: Set<SyncListener> = new Set();

export function subscribeSyncStatus(listener: SyncListener): () => void {
  listeners.add(listener);
  listener(currentSyncStatus);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((l) => l(currentSyncStatus));
}

// Debounce timer for high-frequency state updates (like water logs, vitals)
let syncDebounceTimer: NodeJS.Timeout | null = null;

/**
 * Real-time Sync Patients & Vital Signs & Medications & Water Logs to Supabase
 */
export async function syncPatientsToSupabase(patients: Patient[]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) {
    return false; // Fallback to localStorage gracefully
  }

  currentSyncStatus = { ...currentSyncStatus, isSyncing: true, error: null };
  notifyListeners();

  try {
    const { data: { user } } = await client.auth.getUser();
    
    // We attempt to upsert patient records into 'user_app_data' KV table or 'patients' table
    // 1. First, upsert full JSON payload into user_app_data for reliable snapshot recovery
    const payload = {
      user_id: user?.id || "guest-session",
      data_key: "patients_entities",
      payload: patients,
      updated_at: new Date().toISOString(),
    };

    const { error: kvError } = await client
      .from("user_app_data")
      .upsert(payload, { onConflict: "user_id,data_key" });

    if (kvError) {
      console.warn("Supabase user_app_data upsert notice:", kvError.message);
    }

    // 2. Also upsert to relational 'patients' table if user is authenticated
    if (user?.id) {
      for (const p of patients) {
        const patientRow = {
          user_id: user.id,
          name: p.name,
          age: p.age,
          category: p.category || "Elderly Senior",
          water_current_ml: p.waterCurrentMl,
          water_goal_ml: p.waterGoalMl,
          mood: p.mood,
          sleep_hours: p.sleepHours,
          caregiver_notes: p.caregiverNotes,
          status: p.status,
        };

        try {
          await client.from("patients").upsert(patientRow, { onConflict: "user_id,name" });
        } catch (e) {
          console.warn("Relational patients upsert notice:", e);
        }

        // Sync Vitals
        if (p.vitals && p.vitals.length > 0) {
          const latestVital = p.vitals[0];
          try {
            await client.from("vitals_logs").insert({
              patient_id: p.id,
              systolic: latestVital.bloodPressureSystolic,
              diastolic: latestVital.bloodPressureDiastolic,
              heart_rate_bpm: latestVital.heartRateBpm,
              spo2_percent: latestVital.spO2Percent,
              temperature_f: latestVital.temperatureF,
              blood_sugar_mg_dl: latestVital.bloodSugarMgDl,
              logged_at: latestVital.dateStr || new Date(latestVital.timestamp || Date.now()).toISOString(),
            });
          } catch (e) {
            console.warn("Vitals log insert notice:", e);
          }
        }

        // Sync Water Logs
        if (p.waterLogs && p.waterLogs.length > 0) {
          const latestWater = p.waterLogs[0];
          try {
            await client.from("water_logs").insert({
              patient_id: p.id,
              amount_ml: latestWater.amountMl,
              logged_time: latestWater.time,
              timestamp: latestWater.timestamp,
            });
          } catch (e) {
            console.warn("Water log insert notice:", e);
          }
        }
      }
    }

    currentSyncStatus = {
      isSyncing: false,
      lastSyncedAt: new Date(),
      error: null,
    };
    notifyListeners();
    return true;
  } catch (err: any) {
    console.error("Failed to sync patient entities to Supabase:", err);
    currentSyncStatus = {
      isSyncing: false,
      lastSyncedAt: currentSyncStatus.lastSyncedAt,
      error: err.message || "Cloud sync error",
    };
    notifyListeners();
    return false;
  }
}

/**
 * Debounced wrapper for high-frequency state updates
 */
export function syncPatientsDebounced(patients: Patient[], delayMs = 1000) {
  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer);
  }
  syncDebounceTimer = setTimeout(() => {
    syncPatientsToSupabase(patients);
  }, delayMs);
}

/**
 * Fetch Patients state from Supabase if connected
 */
export async function fetchPatientsFromSupabase(): Promise<Patient[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return null;

    const { data, error } = await client
      .from("user_app_data")
      .select("payload")
      .eq("user_id", user.id)
      .eq("data_key", "patients_entities")
      .single();

    if (!error && data?.payload && Array.isArray(data.payload)) {
      return data.payload as Patient[];
    }
  } catch (e) {
    console.warn("Could not fetch patients from Supabase, using local fallback:", e);
  }
  return null;
}
