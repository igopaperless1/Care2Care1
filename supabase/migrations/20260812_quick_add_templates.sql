-- ====================================================================
-- MIGRATION: Unified Global Quick-Add Templates & Pending Review Queue
-- ====================================================================

-- 1. Create quick_add_templates Table
CREATE TABLE IF NOT EXISTS quick_add_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'usr-default',
  service_type TEXT NOT NULL, -- 'expense', 'prescription', 'pet_care', 'retail_sale', 'employee_clockin', 'vehicle_mileage', 'vital_log', 'water_log'
  template_name TEXT NOT NULL, -- e.g. "Subcontractor Payout", "Morning Meds", "Gas Refuel"
  
  -- Pre-configured fixed data payload (e.g. { "category": "Office", "tax_code": "VAT-20", "vendor": "Shell" })
  hidden_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Array of dynamic inputs exposed in the 3-field Quick-Add popup (e.g. ['amount', 'description', 'date'])
  visible_fields TEXT[] NOT NULL DEFAULT ARRAY['amount', 'description'],
  
  is_reminder_enabled BOOLEAN DEFAULT false,
  reminder_time TEXT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create pending_review_queue Table (Draft & Review Safety Net)
CREATE TABLE IF NOT EXISTS pending_review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'usr-default',
  service_type TEXT NOT NULL,
  template_id UUID REFERENCES quick_add_templates(id) ON DELETE SET NULL,
  template_name TEXT NOT NULL,
  draft_payload JSONB NOT NULL,
  flagged_reason TEXT NOT NULL DEFAULT 'Requires manual review or missing required fields',
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'reviewed', 'dismissed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_quick_add_templates_user ON quick_add_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_quick_add_templates_service ON quick_add_templates(service_type);
CREATE INDEX IF NOT EXISTS idx_pending_review_queue_user_status ON pending_review_queue(user_id, status);
