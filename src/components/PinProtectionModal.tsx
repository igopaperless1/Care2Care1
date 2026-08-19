import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Unlock, KeyRound, Shield, AlertCircle, X, Check, Eye, EyeOff } from "lucide-react";

interface PinProtectionModalProps {
  isOpen: boolean;
  mode: "unlock" | "set_pin" | "change_pin";
  challengeTitle?: string;
  correctPin?: string;
  onSuccess: (pin?: string) => void;
  onClose: () => void;
}

export const PinProtectionModal: React.FC<PinProtectionModalProps> = ({
  isOpen,
  mode = "unlock",
  challengeTitle = "Private Challenge",
  correctPin = "0000",
  onSuccess,
  onClose
}) => {
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [isConfirmStep, setIsConfirmStep] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);
  const [showNumbers, setShowNumbers] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setConfirmPin("");
      setIsConfirmStep(false);
      setErrorMsg(null);
      setAttemptsLeft(5);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleDigitPress = (digit: string) => {
    setErrorMsg(null);
    if (mode === "unlock") {
      if (pin.length < 4) {
        const nextPin = pin + digit;
        setPin(nextPin);
        if (nextPin.length === 4) {
          validateUnlock(nextPin);
        }
      }
    } else {
      // Setup or Change mode
      if (!isConfirmStep) {
        if (pin.length < 4) {
          const nextPin = pin + digit;
          setPin(nextPin);
          if (nextPin.length === 4) {
            setIsConfirmStep(true);
          }
        }
      } else {
        if (confirmPin.length < 4) {
          const nextConfirm = confirmPin + digit;
          setConfirmPin(nextConfirm);
          if (nextConfirm.length === 4) {
            validateNewPin(pin, nextConfirm);
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    setErrorMsg(null);
    if (mode === "unlock") {
      setPin((prev) => prev.slice(0, -1));
    } else {
      if (!isConfirmStep) {
        setPin((prev) => prev.slice(0, -1));
      } else {
        if (confirmPin.length > 0) {
          setConfirmPin((prev) => prev.slice(0, -1));
        } else {
          setIsConfirmStep(false);
        }
      }
    }
  };

  const handleClear = () => {
    setErrorMsg(null);
    if (mode === "unlock") {
      setPin("");
    } else {
      setPin("");
      setConfirmPin("");
      setIsConfirmStep(false);
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const validateUnlock = (enteredPin: string) => {
    if (enteredPin === correctPin) {
      onSuccess();
    } else {
      triggerShake();
      const left = attemptsLeft - 1;
      setAttemptsLeft(left);
      if (left <= 0) {
        setErrorMsg("Too many incorrect attempts. Please try again later.");
      } else {
        setErrorMsg(`Incorrect PIN. ${left} attempts remaining.`);
      }
      setTimeout(() => setPin(""), 600);
    }
  };

  const validateNewPin = (p1: string, p2: string) => {
    if (p1 === p2) {
      onSuccess(p1);
    } else {
      triggerShake();
      setErrorMsg("PINs did not match. Please try again.");
      setTimeout(() => {
        setConfirmPin("");
        setIsConfirmStep(false);
        setPin("");
      }, 700);
    }
  };

  const activeDigits = mode === "unlock" ? pin : isConfirmStep ? confirmPin : pin;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
          }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center relative"
        >
          {/* Close button (allowed for setup/change or if can return) */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon & Title */}
          <div className="space-y-1.5 pt-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-orange-600">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {mode === "unlock"
                ? "Confidential Challenge Lock"
                : isConfirmStep
                ? "Confirm Your 4-Digit PIN"
                : "Create 4-Digit Security PIN"}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {mode === "unlock"
                ? `Enter your PIN to access "${challengeTitle}"`
                : isConfirmStep
                ? "Re-enter the 4 digits to confirm"
                : "Set a confidential PIN to protect sensitive challenge logs"}
            </p>
          </div>

          {/* 4-Digit Dots */}
          <div className="flex justify-center items-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const filled = idx < activeDigits.length;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all border ${
                    filled
                      ? "bg-orange-500 border-orange-600 scale-110 shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  }`}
                />
              );
            })}
          </div>

          {/* Error / Feedback Message */}
          {errorMsg && (
            <div className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Number Pad Grid (0-9) */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto pt-1">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitPress(digit)}
                className="w-full h-12 bg-[#FFF8F3] dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-slate-700 active:bg-orange-200 border border-[#FDE7D6] dark:border-slate-700 rounded-2xl text-base font-black text-slate-800 dark:text-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="w-full h-12 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-2xl text-xs font-black flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleDigitPress("0")}
              className="w-full h-12 bg-[#FFF8F3] dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-slate-700 active:bg-orange-200 border border-[#FDE7D6] dark:border-slate-700 rounded-2xl text-base font-black text-slate-800 dark:text-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="w-full h-12 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-2xl text-xs font-black flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              ⌫
            </button>
          </div>

          <div className="pt-2">
            <p className="text-[10px] text-slate-400">
              🔒 Encrypted local session protection • Care2Care Privacy
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
