// ============================================================
// Care2Care - Age-Gating, Content Safety & Consent Engine
// ============================================================

import { RestrictedContentConsent } from "../types";
import { getSupabaseClient } from "./supabase";

export interface ContentSafetyEvaluation {
  isSensitive: boolean;
  category: "adult_content" | "substances" | "general_sensitive" | "none";
  matchedTerms: string[];
  requiresAgeGate: boolean;
  safetyAdvisory: string;
  helplineInfo: {
    name: string;
    contact: string;
    hours: string;
    description: string;
  } | null;
}

const AGE_CONSENT_STORAGE_KEY = "care2care_restricted_content_consent_v1";

// Sensitive behavioral keyword taxonomies
const ADULT_CONTENT_KEYWORDS = [
  "porn",
  "pornography",
  "masturbat",
  "masturbation",
  "xxx",
  "erotica",
  "onlyfans",
  "nsfw",
  "sexual urge",
  "sexual compulsion",
  "compulsive sexual",
  "nofap",
  "semen retention",
  "orgasm control",
  "lust"
];

const SUBSTANCE_KEYWORDS = [
  "drug",
  "drugs",
  "weed",
  "cannabis",
  "marijuana",
  "cocaine",
  "alcohol",
  "drinking",
  "liquor",
  "beer",
  "wine",
  "opioid",
  "narcotic",
  "pills",
  "substance",
  "sober",
  "sobriety",
  "vaping thc",
  "intoxication"
];

/**
 * Scans user input for sensitive keywords requiring age-gating & safety protocols
 */
export function evaluateContentSafety(rawText: string): ContentSafetyEvaluation {
  if (!rawText || !rawText.trim()) {
    return {
      isSensitive: false,
      category: "none",
      matchedTerms: [],
      requiresAgeGate: false,
      safetyAdvisory: "",
      helplineInfo: null
    };
  }

  const lower = rawText.toLowerCase();

  // Check Adult Content / Sexual Compulsion
  const matchedAdult = ADULT_CONTENT_KEYWORDS.filter((kw) => lower.includes(kw));
  if (matchedAdult.length > 0) {
    return {
      isSensitive: true,
      category: "adult_content",
      matchedTerms: matchedAdult,
      requiresAgeGate: true,
      safetyAdvisory:
        "Care2Care provides a compassionate, confidential, and non-judgmental space for self-regulation and urge management. This pathway is age-gated (18+) to ensure ethical compliance and user safety.",
      helplineInfo: {
        name: "Confidential Behavioral & Mental Health Support (SAMHSA)",
        contact: "1-800-662-4357",
        hours: "24/7 Free & Confidential",
        description: "National helpline providing non-judgmental counseling, referrals, and support resources."
      }
    };
  }

  // Check Substances / Addictions
  const matchedSubstances = SUBSTANCE_KEYWORDS.filter((kw) => lower.includes(kw));
  if (matchedSubstances.length > 0) {
    return {
      isSensitive: true,
      category: "substances",
      matchedTerms: matchedSubstances,
      requiresAgeGate: true,
      safetyAdvisory:
        "Care2Care provides behavioral self-management routines, not medical detoxification or clinical therapy. If you are experiencing severe substance dependence, please seek medical supervision.",
      helplineInfo: {
        name: "SAMHSA National Substance & Addiction Helpline",
        contact: "1-800-662-4357 (or text HOME to 741741)",
        hours: "24/7 Free, Confidential",
        description: "Immediate guidance, local treatment facilities, and support groups."
      }
    };
  }

  return {
    isSensitive: false,
    category: "none",
    matchedTerms: [],
    requiresAgeGate: false,
    safetyAdvisory: "",
    helplineInfo: null
  };
}

/**
 * Checks if the active user or session has already confirmed 18+ consent
 */
export async function getAgeConsentStatus(category: string = "adult_content"): Promise<{
  isVerifiedAdult: boolean;
  consentRecord: RestrictedContentConsent | null;
}> {
  // 1. Check local storage cache
  try {
    const raw = localStorage.getItem(AGE_CONSENT_STORAGE_KEY);
    if (raw) {
      const records: RestrictedContentConsent[] = JSON.parse(raw);
      const match = records.find(
        (r) =>
          (r.category === category || r.category === "general_sensitive") &&
          r.isAdult &&
          r.status === "active"
      );
      if (match) {
        return { isVerifiedAdult: true, consentRecord: match };
      }
    }
  } catch (e) {
    console.warn("Age consent localStorage check notice:", e);
  }

  // 2. Check Supabase `restricted_content_consent` table if user is authenticated
  const client = getSupabaseClient();
  if (client) {
    try {
      const {
        data: { user }
      } = await client.auth.getUser();

      if (user) {
        const { data, error } = await client
          .from("restricted_content_consent")
          .select("*")
          .eq("user_id", user.id)
          .eq("category", category)
          .eq("is_adult", true)
          .eq("status", "active")
          .maybeSingle();

        if (!error && data) {
          const record: RestrictedContentConsent = {
            id: data.id,
            userId: data.user_id,
            category: data.category,
            isAdult: data.is_adult,
            ageConfirmed: data.age_confirmed,
            consentGivenAt: data.consent_given_at,
            minimumAge: data.minimum_age || 18,
            status: data.status,
            userAgent: data.user_agent
          };
          return { isVerifiedAdult: true, consentRecord: record };
        }
      }
    } catch (e) {
      console.warn("Supabase restricted_content_consent query notice:", e);
    }
  }

  return { isVerifiedAdult: false, consentRecord: null };
}

/**
 * Records user age consent in local storage and Supabase table
 */
export async function recordAgeConsent(
  category: "adult_content" | "substances" | "sexual_compulsion" | "general_sensitive",
  isAdult: boolean
): Promise<{ success: boolean; consentRecord: RestrictedContentConsent }> {
  const nowIso = new Date().toISOString();
  const consentRecord: RestrictedContentConsent = {
    id: `consent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    category,
    isAdult,
    ageConfirmed: isAdult,
    consentGivenAt: nowIso,
    minimumAge: 18,
    status: isAdult ? "active" : "denied",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "browser"
  };

  // 1. Save to localStorage
  try {
    const raw = localStorage.getItem(AGE_CONSENT_STORAGE_KEY);
    const records: RestrictedContentConsent[] = raw ? JSON.parse(raw) : [];
    // remove existing for this category
    const filtered = records.filter((r) => r.category !== category);
    filtered.push(consentRecord);
    localStorage.setItem(AGE_CONSENT_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to save age consent to localStorage:", e);
  }

  // 2. Persist to Supabase if connected
  const client = getSupabaseClient();
  if (client) {
    try {
      const {
        data: { user }
      } = await client.auth.getUser();

      await client.from("restricted_content_consent").upsert(
        {
          id: consentRecord.id,
          user_id: user?.id || "guest-session",
          category: consentRecord.category,
          is_adult: consentRecord.isAdult,
          age_confirmed: consentRecord.ageConfirmed,
          consent_given_at: consentRecord.consentGivenAt,
          minimum_age: consentRecord.minimumAge,
          status: consentRecord.status,
          user_agent: consentRecord.userAgent
        },
        { onConflict: "id" }
      );
    } catch (e) {
      console.warn("Supabase restricted_content_consent sync notice:", e);
    }
  }

  return { success: true, consentRecord };
}

/**
 * Revokes consent and clears restricted session token
 */
export async function revokeAgeConsent(): Promise<void> {
  try {
    localStorage.removeItem(AGE_CONSENT_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
}
