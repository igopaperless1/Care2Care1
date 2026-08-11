// ============================================================
// Care2Care - Supabase Database Client & Credential Manager
// ============================================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

const STORAGE_KEY = "care2care_supabase_config";

export function getSavedSupabaseConfig(): SupabaseConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url,
          anonKey: parsed.anonKey,
          isConnected: Boolean(parsed.url && parsed.anonKey && !parsed.url.includes("xyzcompany")),
        };
      }
    }
  } catch (e) {
    console.error("Failed to load Supabase config from localStorage", e);
  }

  const defaultUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "https://fursypwvnynrxewklaej.supabase.co";
  const defaultKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_key";

  return {
    url: defaultUrl,
    anonKey: defaultKey,
    isConnected: Boolean(defaultUrl && defaultKey && !defaultUrl.includes("xyzcompany")),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): SupabaseConfig {
  const isConnected = Boolean(url.trim() && anonKey.trim() && !url.includes("xyzcompany"));
  const config: SupabaseConfig = {
    url: url.trim(),
    anonKey: anonKey.trim(),
    isConnected,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  // Reset cached instance so it recreates with new config
  supabaseInstance = null;
  return config;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSavedSupabaseConfig();
  if (!config.url || !config.anonKey) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
      return null;
    }
  }
  return supabaseInstance;
}

export const SUPABASE_SQL_SCHEMA_FULL = `-- ============================================================
-- Care2Care Complete Supabase DDL PostgreSQL Database Schema
-- Run this script inside your Supabase Project -> SQL Editor
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Profiles Table (Synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  subscription_plan TEXT CHECK (subscription_plan IN ('Free', 'Premium', 'Family', 'Enterprise')) DEFAULT 'Free',
  paddle_customer_id TEXT,
  paddle_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Care Patients & Senior Profiles Table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT NOT NULL,
  category TEXT DEFAULT 'Elderly Senior',
  avatar_url TEXT,
  water_current_ml INT DEFAULT 0,
  water_goal_ml INT DEFAULT 2000,
  mood TEXT DEFAULT 'Calm',
  sleep_hours NUMERIC DEFAULT 8.0,
  caregiver_notes TEXT,
  emergency_contact JSONB,
  status TEXT DEFAULT 'Stable',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vitals & Biometrics Logs Table
CREATE TABLE IF NOT EXISTS public.vitals_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  systolic INT,
  diastolic INT,
  heart_rate_bpm INT,
  spo2_percent INT,
  temperature_f NUMERIC,
  blood_sugar_mg_dl INT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Water Hydration Logs Table
CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  amount_ml INT NOT NULL,
  logged_time TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

-- 6. Medications & Prescriptions Table
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  taken_today BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  purpose TEXT,
  warnings TEXT
);

-- 7. Staff Attendance & Payroll Records
CREATE TABLE IF NOT EXISTS public.staff_payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_name TEXT NOT NULL,
  role TEXT NOT NULL,
  daily_rate NUMERIC DEFAULT 0,
  probation_status TEXT DEFAULT 'On Probation',
  probation_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitals_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS Policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full access profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
`;
