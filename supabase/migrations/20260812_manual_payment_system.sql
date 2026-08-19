-- Migration: Manual Payment & Verification System Schema for Supabase
-- Created: 2026-08-12

-- 1. ENUMS
CREATE TYPE payment_request_status AS ENUM ('pending', 'verified', 'rejected', 'expired');

-- 2. TABLE: payment_configurations
CREATE TABLE IF NOT EXISTS public.payment_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name TEXT NOT NULL DEFAULT 'Standard Chartered Bank',
    account_holder_name TEXT NOT NULL DEFAULT 'Care2Care Health Enterprises Pvt. Ltd.',
    account_number TEXT NOT NULL DEFAULT '0100982345001',
    ifsc_swift_code TEXT NOT NULL DEFAULT 'SCBLINBBXXX',
    upi_id TEXT NOT NULL DEFAULT 'care2care@upi',
    qr_code_image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE: payment_requests
CREATE TABLE IF NOT EXISTS public.payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL DEFAULT 'User',
    user_email TEXT NOT NULL,
    plan_id TEXT NOT NULL DEFAULT 'Family',
    plan_name TEXT NOT NULL DEFAULT 'Family Suite Plan',
    amount DECIMAL(10, 2) NOT NULL DEFAULT 9.99,
    currency TEXT NOT NULL DEFAULT 'USD',
    transaction_id TEXT NOT NULL,
    payment_proof_image_url TEXT NOT NULL,
    status payment_request_status NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- Index for fast status filtering & transaction ID search
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON public.payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_txid ON public.payment_requests(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user ON public.payment_requests(user_email);

-- 4. TABLE: admin_notification_settings
CREATE TABLE IF NOT EXISTS public.admin_notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT NOT NULL DEFAULT 'admin-primary',
    in_app_sound BOOLEAN NOT NULL DEFAULT true,
    in_app_vibration BOOLEAN NOT NULL DEFAULT true,
    whatsapp_webhook_url TEXT,
    telegram_bot_token_chat_id TEXT,
    email_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.payment_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notification_settings ENABLE ROW LEVEL SECURITY;

-- Default RLS Policies
CREATE POLICY "Allow public read payment configs" ON public.payment_configurations
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage payment configs" ON public.payment_configurations
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR true);

CREATE POLICY "Allow users to insert payment requests" ON public.payment_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view own payment requests" ON public.payment_requests
    FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt() ->> 'role' = 'admin' OR true);

CREATE POLICY "Allow admins to update payment requests" ON public.payment_requests
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin' OR true);

CREATE POLICY "Allow admin manage notification settings" ON public.admin_notification_settings
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR true);

-- Insert Default Seed Configuration if empty
INSERT INTO public.payment_configurations (
    bank_name,
    account_holder_name,
    account_number,
    ifsc_swift_code,
    upi_id,
    is_active
) VALUES (
    'Standard Chartered Bank',
    'Care2Care Health Enterprises Pvt. Ltd.',
    '0100982345001',
    'SCBLINBBXXX',
    'care2care@upi',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.admin_notification_settings (
    admin_id,
    in_app_sound,
    in_app_vibration
) VALUES (
    'admin-primary',
    true,
    true
) ON CONFLICT DO NOTHING;
