import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Lock,
  PhoneCall,
  Sparkles,
  ArrowRight,
  X,
  LifeBuoy
} from "lucide-react";
import { ContentSafetyEvaluation, recordAgeConsent } from "../lib/safetyEngine";

interface AgeConsentModalProps {
  isOpen: boolean;
  safetyEval: ContentSafetyEvaluation;
  onClose: () => void;
  onConsentConfirmed: (pinCode?: string) => void;
  onUnderAgeRedirect: () => void;
  userDob?: string;
}

export const AgeConsentModal: React.FC<AgeConsentModalProps> = ({
  isOpen,
  safetyEval,
  onClose,
  onConsentConfirmed,
  onUnderAgeRedirect,
  userDob
}) => {
  const [viewState, setViewState] = useState<"verify" | "under_18_support" | "recording">("verify");
  const [confirmedCheck, setConfirmedCheck] = useState<boolean>(false);
  const [enablePinLock, setEnablePinLock] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>("");
  const [customDob, setCustomDob] = useState<string>(userDob || "");

  if (!isOpen) return null;

  // Calculate age from DOB if present
  const calculatedAge = React.useMemo(() => {
    const dobString = customDob || userDob;
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [customDob, userDob]);

  const handleConfirmAdult = async () => {
    if (calculatedAge !== null && calculatedAge < 18) {
      handleSelectUnder18();
      return;
    }

    setViewState("recording");
    try {
      await recordAgeConsent(
        safetyEval.category === "substances" ? "substances" : "adult_content",
        true
      );
    } catch (e) {
      console.warn("Age consent record notice:", e);
    }
    setTimeout(() => {
      onConsentConfirmed(enablePinLock && pinCode.length >= 4 ? pinCode : undefined);
      setViewState("verify");
    }, 400);
  };

  const handleSelectUnder18 = async () => {
    try {
      await recordAgeConsent(
        safetyEval.category === "substances" ? "substances" : "adult_content",
        false
      );
    } catch (e) {
      console.warn("Age consent record notice:", e);
    }
    setViewState("under_18_support");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 overflow-hidden relative"
        >
          {/* Top Close / Return */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ========================================================================= */}
          {/* VIEW: AGE VERIFICATION (18+) */}
          {/* ========================================================================= */}
          {viewState === "verify" && (
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Confidential & Ethical Safety Protocol
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Age Consent & Safety Verification
                  </h3>
                </div>
              </div>

              {/* Advisory Context Box */}
              <div className="p-4 bg-[#FFF8F3] dark:bg-slate-850 border border-[#FDE7D6] dark:border-slate-800 rounded-2xl space-y-2">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  You are setting up a behavioral challenge in a sensitive focus category (
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    {safetyEval.category === "substances"
                      ? "Substance & Habit Reduction"
                      : "Adult Behavioral Self-Regulation"}
                  </span>
                  ).
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Care2Care prioritizes user privacy, safety ethics, and clinical non-judgment. To protect minors and provide age-appropriate guidance, adult confirmation is required before accessing these specific protocols.
                </p>
              </div>

              {/* Optional DOB verification field if not set */}
              {!userDob && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Verify Date of Birth (Optional)
                  </label>
                  <input
                    type="date"
                    value={customDob}
                    onChange={(e) => setCustomDob(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                  />
                  {calculatedAge !== null && (
                    <div className="text-[10px] text-slate-500 font-medium">
                      Calculated Age: <strong className={calculatedAge < 18 ? "text-rose-600" : "text-emerald-600"}>{calculatedAge} years old</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={confirmedCheck}
                  onChange={(e) => setConfirmedCheck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
                />
                <div className="text-xs text-slate-800 dark:text-slate-200">
                  <div className="font-bold">I certify that I am 18 years of age or older.</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    I understand this provides behavioral habit tracking and self-regulation tools, not medical treatment.
                  </div>
                </div>
              </label>

              {/* Sensitive Pathway PIN-Lock Option */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Private PIN-Lock Protection
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Require a 4-digit PIN to open this sensitive challenge
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enablePinLock}
                    onChange={(e) => setEnablePinLock(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500"
                  />
                </div>

                {enablePinLock && (
                  <div className="pt-1">
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="Enter 4-6 digit privacy PIN"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-center tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={!confirmedCheck}
                  onClick={handleConfirmAdult}
                  className={`w-full py-3.5 font-black text-xs sm:text-sm rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    confirmedCheck
                      ? "bg-[#FFC9A7] hover:bg-[#ffb68c] active:bg-[#fca576] text-orange-950"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>I am 18+ — Proceed Confidentially</span>
                </button>

                <button
                  type="button"
                  onClick={handleSelectUnder18}
                  className="w-full py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>I am under 18 years old</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: UNDER 18 SUPPORTIVE SAFE REDIRECT */}
          {/* ========================================================================= */}
          {viewState === "under_18_support" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 shrink-0">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    Youth Wellness & Support
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Compassionate Guidance for You
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-2xl space-y-2">
                <p className="text-xs text-teal-950 dark:text-teal-200 font-medium leading-relaxed">
                  Thank you for your honesty. Navigating stress, impulse control, and growing up can be challenging.
                </p>
                <p className="text-[11px] text-teal-800 dark:text-teal-300 leading-relaxed">
                  Care2Care restricts adult-oriented challenges for minors to ensure safety. We encourage you to focus on positive foundational habits such as <strong>Digital Screen Balance</strong>, <strong>Mindfulness & Stress Relief</strong>, or <strong>Healthy Sleep and Daily Exercise</strong>.
                </p>
              </div>

              {/* Free Confidential Youth Helpline */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
                  <LifeBuoy className="w-4 h-4 text-orange-500" />
                  <span>Confidential Youth Support Resources</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  • <strong>Teen Line:</strong> Call 1-800-852-8336 (or text TEEN to 839863)
                  <br />
                  • <strong>Crisis Text Line:</strong> Text HOME to 741741 (Free, 24/7, Anonymous)
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onUnderAgeRedirect();
                    onClose();
                  }}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Switch to Youth-Safe Wellness Plan</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-xs text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                >
                  Choose a Different Goal
                </button>
              </div>
            </div>
          )}

          {/* VIEW: RECORDING / LOADING */}
          {viewState === "recording" && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 mx-auto border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Securing confidential consent...
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
