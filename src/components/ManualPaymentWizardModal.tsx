import React, { useState, useEffect } from "react";
import {
  Building2,
  QrCode,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  FileText,
  DollarSign
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import {
  PaymentConfiguration,
  getPaymentConfiguration,
  submitPaymentRequest
} from "../utils/ManualPaymentEngine";

interface ManualPaymentWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: "Premium" | "Family" | "Enterprise";
  planPrice: number;
  billingCycle: "monthly" | "yearly";
  userEmail?: string;
  userName?: string;
  onSuccess?: () => void;
}

export const ManualPaymentWizardModal: React.FC<ManualPaymentWizardModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  planPrice,
  billingCycle,
  userEmail = "user@care2care.org",
  userName = "Valued User",
  onSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [config, setConfig] = useState<PaymentConfiguration>(() => getPaymentConfiguration());

  // Form Inputs for Step 3
  const [transactionId, setTransactionId] = useState("");
  const [transferredAmount, setTransferredAmount] = useState<number>(planPrice);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(getPaymentConfiguration());
      setTransferredAmount(planPrice);
      setStep(1);
    }
  }, [isOpen, planPrice]);

  if (!isOpen) return null;

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = () => {
    if (!transactionId.trim()) {
      alert("Please enter your Bank/UPI Transaction ID or UTR Reference Number.");
      return;
    }
    if (!proofImage) {
      alert("Please upload or drag & drop a screenshot or receipt of your completed payment.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      submitPaymentRequest({
        userId: `usr-${Date.now().toString().slice(-4)}`,
        userName: userName,
        userEmail: userEmail,
        planId: selectedPlan,
        planName: `${selectedPlan} Suite (${billingCycle})`,
        amount: Number(transferredAmount),
        currency: "USD",
        transactionId: transactionId.trim(),
        paymentProofImageUrl: proofImage,
      });

      setIsSubmitting(false);
      setStep(4);
      if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30">
              Offline Bank Transfer & UPI Gateway
            </span>
            <h2 className="text-xl font-black text-white mt-1">
              Payment Wizard: {selectedPlan} Plan
            </h2>
            <p className="text-xs text-indigo-200">
              Step {step} of 4 • Instant Verification Request
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex justify-between gap-1 text-[11px] font-bold">
          <div className={`flex-1 py-1.5 text-center rounded-lg transition-all ${step >= 1 ? "bg-indigo-900 text-amber-300 font-black shadow-xs" : "text-slate-400"}`}>
            1. Summary
          </div>
          <div className={`flex-1 py-1.5 text-center rounded-lg transition-all ${step >= 2 ? "bg-indigo-900 text-amber-300 font-black shadow-xs" : "text-slate-400"}`}>
            2. Bank Details
          </div>
          <div className={`flex-1 py-1.5 text-center rounded-lg transition-all ${step >= 3 ? "bg-indigo-900 text-amber-300 font-black shadow-xs" : "text-slate-400"}`}>
            3. Upload Proof
          </div>
          <div className={`flex-1 py-1.5 text-center rounded-lg transition-all ${step === 4 ? "bg-emerald-600 text-white font-black shadow-xs" : "text-slate-400"}`}>
            4. Confirmation
          </div>
        </div>

        {/* BODY CONTENT BY STEP */}
        <div className="p-6 text-xs space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* STEP 1: PLAN SUMMARY */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{selectedPlan} Subscription Tier</h3>
                    <p className="text-slate-500 font-medium text-[11px]">Billed {billingCycle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-800">${planPrice.toFixed(2)}</span>
                    <span className="text-slate-400 text-[10px] block">USD Total</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Full 100% Ad-Free Access Across All Devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Gemini AI Vitals & Health Insights Enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instant Admin Verification & Activation</span>
                  </div>
                </div>
              </div>

              {!config.isActive ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Manual bank transfer payments are currently paused for system maintenance. Please try again later.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Pay via Manual Bank Transfer & QR Code</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              )}
            </div>
          )}

          {/* STEP 2: INSTRUCTIONS & QR CODE */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-indigo-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-bold text-[11px]">Scan the QR Code or copy bank details below to transfer ${planPrice.toFixed(2)}.</span>
              </div>

              {/* QR Code Centerpiece */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
                <div className="bg-white p-3 rounded-2xl shadow-xl">
                  {config.qrCodeImageUrl ? (
                    <img
                      src={config.qrCodeImageUrl}
                      alt="Payment QR Code"
                      className="w-44 h-44 object-contain rounded-xl"
                    />
                  ) : (
                    <QRCodeCanvas
                      value={`upi://pay?pa=${encodeURIComponent(config.upiId || "care2care@upi")}&pn=${encodeURIComponent(
                        config.accountHolderName || "Care2Care"
                      )}&am=${planPrice}&cu=INR`}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  )}
                </div>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                  Scan with eSewa, Fonepay, Khalti, or Banking App
                </p>
              </div>

              {/* Bank Details Cards */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 font-medium">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">Bank Name:</span>
                  <span className="font-black text-slate-900">{config.bankName}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">Account Holder:</span>
                  <span className="font-extrabold text-slate-900">{config.accountHolderName}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">Account Number:</span>
                  <div className="flex items-center gap-2 font-mono font-black text-slate-900">
                    <span>{config.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(config.accountNumber, "acc")}
                      className="p-1 hover:bg-slate-200 rounded text-indigo-600 cursor-pointer"
                    >
                      {copiedField === "acc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {config.ifscSwiftCode && (
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-bold">IFSC / SWIFT:</span>
                    <span className="font-mono font-bold text-slate-900">{config.ifscSwiftCode}</span>
                  </div>
                )}

                {config.upiId && (
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500 font-bold">UPI / Mobile ID:</span>
                    <div className="flex items-center gap-2 font-mono font-black text-indigo-900">
                      <span>{config.upiId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(config.upiId, "upi")}
                        className="p-1 hover:bg-slate-200 rounded text-indigo-600 cursor-pointer"
                      >
                        {copiedField === "upi" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>I Have Completed Payment (Upload Proof)</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROOF OF PAYMENT UPLOADER & REF NUMBER */}
          {step === 3 && (
            <div className="space-y-4">
              
              {/* Image Drag-and-Drop Uploader */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Upload Payment Screenshot / Receipt Proof <span className="text-rose-500">*</span>
                </label>
                
                <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center">
                  {proofImage ? (
                    <div className="space-y-2">
                      <img src={proofImage} alt="Payment Proof" className="max-h-36 rounded-xl border border-slate-200 shadow-md mx-auto" />
                      <span className="text-[10px] text-emerald-700 font-bold block">✓ Payment Receipt Attached. Click to Change.</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-indigo-600 mb-2" />
                      <span className="font-extrabold text-slate-800 text-xs">Drag and drop your bank receipt here</span>
                      <span className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP screenshots</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Transaction ID / UTR Reference Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. SCB-UTR-998827361 or 2026081299"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Exact Amount Transferred */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Exact Amount Transferred ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={transferredAmount}
                  onChange={(e) => setTransferredAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitPayment}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>{isSubmitting ? "Submitting Request..." : "SUBMIT FOR ADMIN VERIFICATION"}</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: SUBMISSION CONFIRMATION */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Payment Request Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Your reference ID <span className="font-mono font-bold text-indigo-900">{transactionId}</span> has been dispatched to our Admin Verification Engine.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 text-[11px] font-medium text-left space-y-1">
                <p>✓ Admin live WhatsApp & Telegram alerts dispatched.</p>
                <p>✓ Verification normally completed within 15–30 minutes.</p>
                <p>✓ You will receive an instant in-app push notification upon approval.</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-md cursor-pointer transition-all"
              >
                Done & Return to App
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
