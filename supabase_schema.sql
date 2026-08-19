-- ============================================================================
-- CARE2CARE & IGO PAPERLESS TRACKER PLATFORM - SUPABASE POSTGRESQL DATABASE SCHEMA
-- ============================================================================
-- Complete, production-ready relational schema with Row Level Security (RLS)
-- policies, foreign keys, performance indexes, triggers, and seed data.
-- ============================================================================

-- 1. EXTENSIONS & FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Automatic timestamp updater trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. ACCOUNTS & PROFILES
-- ============================================================================

-- Profiles table extending Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'organiser', 'staff')),
    account_type TEXT DEFAULT 'personal' CHECK (account_type IN ('personal', 'family', 'professional', 'property', 'community')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure role column exists if table was previously created without it
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Sub-accounts for family members or staff
CREATE TABLE IF NOT EXISTS public.sub_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relation_type TEXT,
    pin_code TEXT,
    access_level TEXT DEFAULT 'member' CHECK (access_level IN ('owner', 'admin', 'member', 'restricted')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. PATIENT & ELDERLY CARE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 0),
    category TEXT DEFAULT 'General' CHECK (category IN ('Elderly', 'Kids', 'Sick/Ill', 'Wounded/Handicapped', 'General')),
    avatar_url TEXT,
    water_current_ml INT DEFAULT 0,
    water_goal_ml INT DEFAULT 2500,
    mood TEXT DEFAULT 'Calm',
    sleep_hours NUMERIC(4, 1) DEFAULT 7.5,
    caregiver_notes TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    status TEXT DEFAULT 'Stable' CHECK (status IN ('Stable', 'Attention Needed', 'Critical')),
    last_check_in TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.water_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount_ml INT NOT NULL CHECK (amount_ml > 0),
    logged_time TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    scheduled_time TEXT,
    purpose TEXT,
    warnings TEXT,
    photo_url TEXT,
    taken_today BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vital_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    systolic_bp INT,
    diastolic_bp INT,
    heart_rate_bpm INT,
    spo2_percent INT,
    temperature_f NUMERIC(4, 1),
    blood_sugar_mg_dl INT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. DIGITAL VAULT & DOCUMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Personal' CHECK (category IN ('Medical', 'Personal', 'Financial', 'Property', 'Legal', 'Education')),
    file_type TEXT DEFAULT 'PDF',
    file_url TEXT,
    encrypted BOOLEAN DEFAULT FALSE,
    content_snippet TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.memo_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    relation TEXT,
    message TEXT NOT NULL,
    favorite_memory TEXT,
    favorite_song TEXT,
    sticker TEXT DEFAULT '❤️',
    voice_note_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. SERVICE PROVIDERS & CARE BOOKINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Doctor', 'Nurse', 'Caregiver', 'Physiotherapist', 'Plumber', 'Electrician', 'Handyman', 'Tutor')),
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    phone TEXT NOT NULL,
    available_now BOOLEAN DEFAULT TRUE,
    location TEXT NOT NULL,
    hourly_rate TEXT DEFAULT 'NPR 500 / hr',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. FINANCE & BUDGETING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    category TEXT NOT NULL,
    sub_category TEXT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT DEFAULT 'USD',
    transaction_date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    payment_method TEXT DEFAULT 'Cash',
    merchant TEXT,
    receipt_photo_url TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financial_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    sub_category TEXT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    spent NUMERIC(12, 2) DEFAULT 0.00,
    month_year TEXT NOT NULL, -- Format: YYYY-MM
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL,
    current_amount NUMERIC(12, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    target_date DATE,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
    category TEXT DEFAULT 'Emergency',
    monthly_contribution NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. GARDEN & FARM MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.gardens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'Vegetable',
    location TEXT,
    area NUMERIC(10, 2) DEFAULT 100.00,
    area_unit TEXT DEFAULT 'sq ft',
    soil_type TEXT DEFAULT 'Loamy',
    ph_level NUMERIC(3, 1) DEFAULT 6.5,
    sunlight TEXT DEFAULT 'Full Sun',
    water_source TEXT DEFAULT 'Tap',
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.plant_crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garden_id UUID NOT NULL REFERENCES public.gardens(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'Vegetable',
    variety TEXT,
    quantity INT DEFAULT 1,
    planting_date DATE DEFAULT CURRENT_DATE,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    status TEXT DEFAULT 'Growing',
    health_status TEXT DEFAULT 'Healthy',
    growth_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.harvest_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garden_id UUID NOT NULL REFERENCES public.gardens(id) ON DELETE CASCADE,
    plant_id UUID REFERENCES public.plant_crops(id) ON DELETE SET NULL,
    harvest_date DATE DEFAULT CURRENT_DATE,
    quantity NUMERIC(10, 2) NOT NULL,
    unit TEXT DEFAULT 'kg',
    quality TEXT DEFAULT 'Good',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. NUTRITION & MEAL TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT,
    calories INT DEFAULT 0,
    protein NUMERIC(6, 2) DEFAULT 0,
    carbs NUMERIC(6, 2) DEFAULT 0,
    fats NUMERIC(6, 2) DEFAULT 0,
    fiber NUMERIC(6, 2) DEFAULT 0,
    serving_size TEXT DEFAULT '1 serving',
    barcode TEXT,
    is_custom BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.meal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    meal_date DATE DEFAULT CURRENT_DATE,
    meal_type TEXT DEFAULT 'Lunch' CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage')),
    food_name TEXT NOT NULL,
    quantity NUMERIC(5, 2) DEFAULT 1.0,
    calories INT DEFAULT 0,
    protein NUMERIC(6, 2) DEFAULT 0,
    carbs NUMERIC(6, 2) DEFAULT 0,
    fats NUMERIC(6, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. INVENTORY MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    sku TEXT,
    barcode TEXT,
    unit TEXT DEFAULT 'piece',
    current_stock NUMERIC(10, 2) NOT NULL DEFAULT 0,
    minimum_stock NUMERIC(10, 2) NOT NULL DEFAULT 5,
    cost_price NUMERIC(10, 2) DEFAULT 0,
    selling_price NUMERIC(10, 2) DEFAULT 0,
    supplier_name TEXT,
    location TEXT,
    expiry_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment', 'return', 'damage')),
    quantity NUMERIC(10, 2) NOT NULL,
    previous_stock NUMERIC(10, 2) NOT NULL,
    new_stock NUMERIC(10, 2) NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. MENSTRUAL & REPRODUCTIVE HEALTH
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.cycle_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    cycle_length INT DEFAULT 28,
    period_length INT DEFAULT 5,
    flow_intensity TEXT DEFAULT 'Medium' CHECK (flow_intensity IN ('Light', 'Medium', 'Heavy')),
    pain_level INT DEFAULT 1 CHECK (pain_level BETWEEN 1 AND 10),
    symptoms TEXT[],
    mood TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. DIGITAL TICKETS & ORGANISER EVENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organiser_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Class Pass',
    venue TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TEXT DEFAULT '09:00 AM',
    description TEXT,
    price NUMERIC(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'NPR',
    is_class_pass BOOLEAN DEFAULT TRUE,
    quantity_type TEXT DEFAULT 'limited' CHECK (quantity_type IN ('limited', 'unlimited')),
    total_quantity INT DEFAULT 50,
    issued_count INT DEFAULT 0,
    organizer_name TEXT DEFAULT 'Care2Care Organiser',
    benefits TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.digital_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.organiser_events(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    event_type TEXT DEFAULT 'class_pass',
    event_date DATE NOT NULL,
    event_time TEXT,
    location TEXT NOT NULL,
    ticket_type TEXT DEFAULT 'class_pass',
    ticket_number TEXT UNIQUE NOT NULL,
    seat_number TEXT DEFAULT 'Pass #1',
    price NUMERIC(10, 2) DEFAULT 0,
    attendee_name TEXT NOT NULL,
    attendee_contact TEXT,
    organizer TEXT NOT NULL,
    qr_code_data TEXT NOT NULL,
    qr_color TEXT DEFAULT '#2E7D32',
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    gate_name TEXT,
    is_class_pass BOOLEAN DEFAULT TRUE,
    is_transferred BOOLEAN DEFAULT FALSE,
    transferred_from TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ticket_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES public.digital_tickets(id) ON DELETE CASCADE,
    scanned_by_staff TEXT DEFAULT 'Gate Supervisor',
    gate_name TEXT DEFAULT 'Gate 1',
    scan_time TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'SUCCESS'
);

-- ============================================================================
-- 12. SOS & EMERGENCY SERVICES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    priority TEXT DEFAULT 'primary' CHECK (priority IN ('primary', 'secondary', 'tertiary')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sos_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    alert_type TEXT DEFAULT 'Medical',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    location_address TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'responded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 13. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_patients_user_id ON public.patients(user_id);
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON public.water_logs(user_id, logged_time);
CREATE INDEX IF NOT EXISTS idx_medications_patient ON public.medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id, category);
CREATE INDEX IF NOT EXISTS idx_financial_trans_user_date ON public.financial_transactions(user_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_inventory_items_stock ON public.inventory_items(user_id, current_stock);
CREATE INDEX IF NOT EXISTS idx_tickets_number ON public.digital_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_qr ON public.digital_tickets(qr_code_data);

-- ============================================================================
-- 14. HELPER FUNCTIONS & ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Helper function to check if the current authenticated user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memo_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvest_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organiser_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if re-running script
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own sub accounts" ON public.sub_accounts;
DROP POLICY IF EXISTS "Users can manage own patients" ON public.patients;
DROP POLICY IF EXISTS "Users can manage own water logs" ON public.water_logs;
DROP POLICY IF EXISTS "Users can manage own medications" ON public.medications;
DROP POLICY IF EXISTS "Users can manage own vitals" ON public.vital_signs;
DROP POLICY IF EXISTS "Users can manage own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can manage own memos" ON public.memo_entries;
DROP POLICY IF EXISTS "Users can manage own financial transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Users can manage own budgets" ON public.financial_budgets;
DROP POLICY IF EXISTS "Users can manage own savings goals" ON public.savings_goals;
DROP POLICY IF EXISTS "Users can manage own gardens" ON public.gardens;
DROP POLICY IF EXISTS "Users can manage own inventory items" ON public.inventory_items;
DROP POLICY IF EXISTS "Users can manage own cycle records" ON public.cycle_records;
DROP POLICY IF EXISTS "Public read for organiser events" ON public.organiser_events;
DROP POLICY IF EXISTS "Organisers can insert and edit events" ON public.organiser_events;
DROP POLICY IF EXISTS "Admins can manage all events" ON public.organiser_events;
DROP POLICY IF EXISTS "Users can view own or assigned tickets" ON public.digital_tickets;
DROP POLICY IF EXISTS "Admins have full access to all tickets" ON public.digital_tickets;
DROP POLICY IF EXISTS "Users can manage emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Users can manage sos alerts" ON public.sos_alerts;

-- Generic RLS Policies
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can manage own sub accounts" ON public.sub_accounts FOR ALL USING (auth.uid() = parent_user_id OR public.is_admin());
CREATE POLICY "Users can manage own patients" ON public.patients FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own water logs" ON public.water_logs FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own medications" ON public.medications FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own vitals" ON public.vital_signs FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own documents" ON public.documents FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own memos" ON public.memo_entries FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own financial transactions" ON public.financial_transactions FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own budgets" ON public.financial_budgets FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own savings goals" ON public.savings_goals FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own gardens" ON public.gardens FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own inventory items" ON public.inventory_items FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own cycle records" ON public.cycle_records FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Public read for organiser events" ON public.organiser_events FOR SELECT USING (true);
CREATE POLICY "Organisers and Admins can manage events" ON public.organiser_events FOR ALL USING (auth.uid() = organizer_id OR public.is_admin());
CREATE POLICY "Users and Admins can manage tickets" ON public.digital_tickets FOR ALL USING (auth.uid() = user_id OR attendee_name IS NOT NULL OR public.is_admin());
CREATE POLICY "Users can manage emergency contacts" ON public.emergency_contacts FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage sos alerts" ON public.sos_alerts FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- ============================================================================
-- 15. 21-DAY GAMIFICATION ENGINE (HABIT CHALLENGES & PENALTIES)
-- ============================================================================

-- Add freeze_tokens, daily_reward_claimed, and coins to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS freeze_tokens INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_reward_claimed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins INT DEFAULT 100;

-- 21-Day Habit Challenges Table
CREATE TABLE IF NOT EXISTS public.habit_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Health' CHECK (category IN ('Health', 'Mindfulness', 'Physical', 'Productivity', 'Recovery', 'Custom')),
    current_day INT DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 21),
    total_days INT DEFAULT 21 CHECK (total_days = 21),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Not Started', 'Completed', 'Paused')),
    streak_count INT DEFAULT 0,
    last_completed_date TIMESTAMPTZ,
    icon TEXT DEFAULT '🏆',
    color TEXT DEFAULT '#F97316',
    missed_days INT DEFAULT 0,
    completed_days INT[] DEFAULT '{}',
    tasks_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Penalties Table
CREATE TABLE IF NOT EXISTS public.challenge_penalties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.habit_challenges(id) ON DELETE CASCADE,
    penalty_type TEXT DEFAULT 'pushups' CHECK (penalty_type IN ('pushups', 'meditation', 'hydration', 'walk', 'freeze_token', 'custom')),
    penalty_description TEXT NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    date_issued TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_habit_challenges_user ON public.habit_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_penalties_user ON public.challenge_penalties(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_penalties_challenge ON public.challenge_penalties(challenge_id);

-- RLS Policies for Gamification Engine
ALTER TABLE public.habit_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_penalties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own habit challenges" ON public.habit_challenges FOR ALL USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());
CREATE POLICY "Users can manage own challenge penalties" ON public.challenge_penalties FOR ALL USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

-- ============================================================================
-- 15. BEHAVIORAL CHALLENGES, TRIGGER PROFILES & DAILY BEHAVIOR METRICS
-- ============================================================================

-- Behavioral Challenges Table (Urge Tracking, Interventions & Recovery Protocols)
CREATE TABLE IF NOT EXISTS public.behavioral_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Recovery',
    is_sensitive BOOLEAN DEFAULT FALSE,
    sensitive_category TEXT,
    age_gate_verified BOOLEAN DEFAULT FALSE,
    pin_locked BOOLEAN DEFAULT FALSE,
    pin_hash TEXT,
    urges_logged_count INT DEFAULT 0,
    urges_resisted_count INT DEFAULT 0,
    recovery_points INT DEFAULT 0,
    top_trigger TEXT,
    top_intervention TEXT,
    active_streak_days INT DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger Profiles Table (Heatmaps, Patterns, Coping Mechanisms)
CREATE TABLE IF NOT EXISTS public.trigger_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    trigger_name TEXT NOT NULL,
    trigger_category TEXT DEFAULT 'Emotional' CHECK (trigger_category IN ('Emotional', 'Environmental', 'Social', 'Physical', 'Time-Based', 'Other')),
    frequency_count INT DEFAULT 1,
    avg_intensity NUMERIC(3, 1) DEFAULT 5.0,
    peak_hour INT CHECK (peak_hour >= 0 AND peak_hour <= 23),
    preferred_intervention TEXT,
    success_rate_percent NUMERIC(5, 2) DEFAULT 100.0,
    notes TEXT,
    last_triggered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Behavior Metrics Table (Urge Episodes, Interventions, Outcomes)
CREATE TABLE IF NOT EXISTS public.daily_behavior_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    day_number INT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    goals_targeted INT DEFAULT 1,
    goals_completed INT DEFAULT 0,
    urges_experienced INT DEFAULT 0,
    urges_overcome INT DEFAULT 0,
    relapse_count INT DEFAULT 0,
    recovery_points_earned INT DEFAULT 0,
    micro_pauses_completed INT DEFAULT 0,
    trigger_breakdown JSONB DEFAULT '{}'::jsonb,
    hourly_distribution JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Behavioral Tracking
CREATE INDEX IF NOT EXISTS idx_behavioral_challenges_user ON public.behavioral_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_behavioral_challenges_cid ON public.behavioral_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_trigger_profiles_user ON public.trigger_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_trigger_profiles_cid ON public.trigger_profiles(challenge_id);
CREATE INDEX IF NOT EXISTS idx_daily_behavior_metrics_user ON public.daily_behavior_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_behavior_metrics_date ON public.daily_behavior_metrics(date);
CREATE INDEX IF NOT EXISTS idx_daily_behavior_metrics_cid ON public.daily_behavior_metrics(challenge_id);

-- RLS Policies for Behavioral Suite
ALTER TABLE public.behavioral_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trigger_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_behavior_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own behavioral challenges" ON public.behavioral_challenges FOR ALL USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());
CREATE POLICY "Users can manage own trigger profiles" ON public.trigger_profiles FOR ALL USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());
CREATE POLICY "Users can manage own daily behavior metrics" ON public.daily_behavior_metrics FOR ALL USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

-- ============================================================================
-- 16. SAMPLE SEED DATA
-- ============================================================================

INSERT INTO public.service_providers (name, category, rating, reviews_count, phone, available_now, location, hourly_rate)
VALUES
('Dr. Sunita Shrestha', 'Doctor', 4.9, 128, '+977-9801234567', true, 'Kathmandu Care Clinic', 'NPR 1,200 / visit'),
('Rajesh Gurung', 'Caregiver', 4.8, 84, '+977-9841987654', true, 'Lalitpur Home Services', 'NPR 500 / hr'),
('Aasha Thapa, RN', 'Nurse', 5.0, 42, '+977-9851122334', true, 'Pokhara Healthcare Center', 'NPR 800 / hr')
ON CONFLICT DO NOTHING;

INSERT INTO public.organiser_events (title, category, venue, event_date, event_time, description, price, is_class_pass, quantity_type, total_quantity, issued_count, organizer_name, benefits)
VALUES
('Care2Care Yoga & Wellness 10-Session Pass', 'Class Pass', 'Care2Care Wellness Studio, Lazimpat', '2026-12-31', '07:00 AM', 'Pre-paid class pass for 10 sessions of yoga & diaphragmatic breathing.', 0, true, 'limited', 50, 18, 'Care2Care Health Foundation', ARRAY['Full Access to Studio', 'Free Yoga Mat Usage', 'Instructor Guidance']),
('Global Healthcare & Tech Summit 2026', 'Seminar', 'Grand Hyatt Ballroom, Kathmandu', '2026-09-15', '10:00 AM', 'Annual international medical innovations conference.', 2500, false, 'unlimited', 999999, 142, 'Care2Care Foundation', ARRAY['VIP Lounge', 'Conference Kit', 'Buffet Lunch', 'Certificate'])
ON CONFLICT DO NOTHING;

-- Schema deployment complete!
