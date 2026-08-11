// ============================================================
// Care2Care - Paddle Payment Gateway & Subscription Helper
// ============================================================

export interface PaddleConfig {
  clientToken: string;
  vendorId: string;
  environment: "sandbox" | "production";
  priceIds: {
    premiumMonthly: string;
    premiumYearly: string;
    familyMonthly: string;
    familyYearly: string;
    enterpriseMonthly: string;
    enterpriseYearly: string;
  };
  isConfigured: boolean;
}

const PADDLE_STORAGE_KEY = "care2care_paddle_config";

export function getSavedPaddleConfig(): PaddleConfig {
  try {
    const saved = localStorage.getItem(PADDLE_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load Paddle config from localStorage", e);
  }

  return {
    clientToken: (import.meta as any).env?.VITE_PADDLE_CLIENT_TOKEN || "test_73a98f7129b01c238491",
    vendorId: (import.meta as any).env?.VITE_PADDLE_VENDOR_ID || "104859",
    environment: "sandbox",
    priceIds: {
      premiumMonthly: "pri_premium_monthly_499",
      premiumYearly: "pri_premium_yearly_4999",
      familyMonthly: "pri_family_monthly_999",
      familyYearly: "pri_family_yearly_9999",
      enterpriseMonthly: "pri_enterprise_monthly_2999",
      enterpriseYearly: "pri_enterprise_yearly_29999",
    },
    isConfigured: false,
  };
}

export function savePaddleConfig(
  clientToken: string,
  vendorId: string,
  environment: "sandbox" | "production" = "sandbox"
): PaddleConfig {
  const isConfigured = Boolean(clientToken.trim() && vendorId.trim() && !clientToken.includes("test_73a98f7129b01c238491"));
  const config: PaddleConfig = {
    clientToken: clientToken.trim(),
    vendorId: vendorId.trim(),
    environment,
    priceIds: {
      premiumMonthly: "pri_premium_monthly_499",
      premiumYearly: "pri_premium_yearly_4999",
      familyMonthly: "pri_family_monthly_999",
      familyYearly: "pri_family_yearly_9999",
      enterpriseMonthly: "pri_enterprise_monthly_2999",
      enterpriseYearly: "pri_enterprise_yearly_29999",
    },
    isConfigured,
  };
  localStorage.setItem(PADDLE_STORAGE_KEY, JSON.stringify(config));
  return config;
}

export const REFINED_CARE2CARE_PADDLE_PROMPT = `Create my Care2Care platform product catalog in my Paddle sandbox account.

I want to offer 3 subscription tiers for the Care2Care Senior Vitals & Family Suite:

1. Premium Single Caregiver (Starter)
   - USD 4.99/month (amount: "499")
   - USD 49.99/year (amount: "4999")
   - Features: 100% Ad-Free, Single Caregiver, Gemini AI Vitals Insights

2. Family Suite (Pro — Recommended)
   - USD 9.99/month (amount: "999")
   - USD 99.99/year (amount: "9999")
   - Features: 100% Ad-Free for up to 5 family members, Staff Payroll & Attendance engine

3. Enterprise Clinic (Advanced)
   - USD 29.99/month (amount: "2999")
   - USD 299.99/year (amount: "29999")
   - Features: 100% Ad-Free, Unlimited Senior Patients, Dedicated Account Manager

Include a 7-day free trial on all plans.

Country Price Overrides (adjusted for local purchasing power):
- UK (GBP):
  * Premium Single: £3.99/mo ("399"), £39.99/yr ("3999")
  * Family Suite: £7.99/mo ("799"), £79.99/yr ("7999")
  * Enterprise Clinic: £24.99/mo ("2499"), £249.99/yr ("24999")
- Ireland / EU (EUR):
  * Premium Single: €4.49/mo ("449"), €44.99/yr ("4499")
  * Family Suite: €8.99/mo ("899"), €89.99/yr ("8999")
  * Enterprise Clinic: €26.99/mo ("2699"), €269.99/yr ("26999")
- Australia (AUD):
  * Premium Single: AUD 6.99/mo ("699"), AUD 69.99/yr ("6999")
  * Family Suite: AUD 13.99/mo ("1399"), AUD 139.99/yr ("13999")
  * Enterprise Clinic: AUD 42.99/mo ("4299"), AUD 429.99/yr ("42999")

Notes:
- Paddle amounts are in lowest denomination as strings (e.g., USD 4.99 is "499", USD 49.99 is "4999").
- Create one product per plan, with both monthly and annual price objects attached.
- When finished, list every product and price created with its Paddle ID (e.g. pri_...) so I can store the mapping in Care2Care's environment configuration.`;


export const PADDLE_WEBHOOK_SETUP_GUIDE = `-- Paddle Webhook & Backend Integration Script (Node.js / Express)
-- Route for listening to Paddle Payment Events

const express = require('express');
const crypto = require('crypto');
const app = express();

app.post('/api/webhooks/paddle', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['paddle-signature'];
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

  // Verify Paddle Signature
  // Event types: subscription.created, subscription.updated, subscription.canceled
  const event = JSON.parse(req.body);

  if (event.event_type === 'subscription.created') {
    const userId = event.data.custom_data?.user_id;
    const plan = event.data.items[0].price.name;
    console.log(\`User \${userId} subscribed to \${plan}\`);
    // Update user profile in Supabase to Premium
  }

  res.status(200).send({ received: true });
});
`;
