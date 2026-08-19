-- ====================================================================
-- MIGRATION: Khalti International Payment Links & Dynamic Receipt Engine
-- ====================================================================

-- 1. Create admin_generated_invoices Table (Khalti/Stripe International Billing)
CREATE TABLE IF NOT EXISTS admin_generated_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT NOT NULL DEFAULT 'admin-primary',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  subscription_item TEXT NOT NULL, -- e.g. "Premium 1-Month Plan"
  amount_npr NUMERIC(12,2) NOT NULL, -- Stored in NPR
  amount_paisa BIGINT NOT NULL, -- Khalti requires Paisa
  purchase_order_id TEXT UNIQUE NOT NULL, -- e.g. INV-2026-0891
  khalti_payment_url TEXT, -- Secure link returned by Khalti/Stripe
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  khalti_transaction_id TEXT, -- Populated via webhook
  pdf_invoice_url TEXT, -- URL to uploaded agreement/invoice PDF
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 2. Create admin_billing_configuration Table (Custom Branding & Auto-Delivery)
CREATE TABLE IF NOT EXISTS admin_billing_configuration (
  id TEXT PRIMARY KEY DEFAULT 'cfg-primary',
  company_name TEXT NOT NULL DEFAULT 'Care2Care Health Enterprises Pvt. Ltd.',
  company_logo_url TEXT DEFAULT 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=200&q=80',
  company_address TEXT DEFAULT 'Durbar Marg, Kathmandu 44600, Nepal',
  company_pan_vat_number TEXT DEFAULT 'PAN # 609823411 / VAT Registered',
  company_registration_number TEXT DEFAULT 'REG # 189234/078/079',
  
  -- Bank Details for receipt footer
  bank_name TEXT DEFAULT 'Standard Chartered Bank Nepal Ltd.',
  bank_account_holder TEXT DEFAULT 'Care2Care Health Enterprises Pvt. Ltd.',
  bank_account_number TEXT DEFAULT '0100-9823-45001',
  bank_ifsc_swift TEXT DEFAULT 'SCBLNPKAXXX',
  
  -- Custom Messages / Boxes
  receipt_custom_header TEXT DEFAULT 'Thank you for supporting our digital healthcare & practice management platform!',
  receipt_custom_footer TEXT DEFAULT 'This is an official computer-generated IRD-compliant Zero-Rated Export VAT tax receipt.',
  refund_policy_text TEXT DEFAULT 'All digital subscription sales are final. Refunds eligible within 7 days upon formal review.',

  -- Auto-Delivery Routing Toggles
  enable_email_receipt BOOLEAN DEFAULT true,
  enable_whatsapp_receipt BOOLEAN DEFAULT true,
  custom_webhook_url TEXT DEFAULT 'https://api.care2care.org/v1/accounting-sync-webhook',
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_invoices_email ON admin_generated_invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_admin_invoices_status ON admin_generated_invoices(status);
CREATE INDEX IF NOT EXISTS idx_admin_invoices_poid ON admin_generated_invoices(purchase_order_id);
