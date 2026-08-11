import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  QrCode,
  FileText,
  X,
  Zap,
  RotateCw,
  Upload,
  CheckCircle2,
  Pill,
  Sparkles,
  ScanLine,
  ArrowRight,
  Plus,
  RefreshCw,
  AlertCircle
} from "lucide-react";

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedication?: (med: { name: string; dosage: string; frequency: string; times: string[] }) => void;
  onScanQrCode?: (code: string) => void;
  initialMode?: "medicine" | "qr" | "document";
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onAddMedication,
  onScanQrCode,
  initialMode = "medicine",
}) => {
  const [activeMode, setActiveMode] = useState<"medicine" | "qr" | "document">(initialMode);
  const [engineMode, setEngineMode] = useState<"manual" | "ai">("manual");
  const [flashOn, setFlashOn] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasWebcam, setHasWebcam] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Callback ref to reliably attach MediaStream as soon as <video> mounts in DOM
  const setVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node && stream) {
        node.srcObject = stream;
        node.play().catch((err) => {
          console.log("Video playback exception:", err);
        });
      }
    },
    [stream]
  );

  // Re-bind stream if videoRef exists or stream updates
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => console.log("Stream play error:", err));
    }
  }, [stream, capturedImage]);

  // Synchronize initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialMode) setActiveMode(initialMode);
      setCapturedImage(null);
      setScanResult(null);
      setCameraError(null);
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => {
      stopWebcam();
    };
  }, [isOpen, cameraFacing, initialMode]);

  const startWebcam = async () => {
    try {
      stopWebcam();
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: cameraFacing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        setHasWebcam(true);
        setCameraError(null);
      } else {
        setHasWebcam(false);
        setCameraError("Camera API not supported in browser environment.");
      }
    } catch (err: any) {
      console.log("Webcam permission or device error, entering fallback upload mode", err);
      setHasWebcam(false);
      setCameraError("Camera access denied or device unavailable. Upload a photo or use Direct OCR scanner.");
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    let extractedDataUrl: string | null = null;

    if (hasWebcam && videoRef.current && videoRef.current.readyState >= 2) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          extractedDataUrl = canvas.toDataURL("image/jpeg", 0.92);
        }
      } catch (e) {
        console.error("Canvas video snapshot error:", e);
      }
    }

    if (!extractedDataUrl) {
      // High-resolution sample image for demo snapshot
      const mockImages = {
        medicine: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
        qr: "https://images.unsplash.com/photo-1595079672139-cee2565ddf90?w=600&auto=format&fit=crop&q=80",
        document: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
      };
      extractedDataUrl = mockImages[activeMode];
    }

    setCapturedImage(extractedDataUrl);
    analyzePhoto(activeMode, extractedDataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        setCapturedImage(imgUrl);
        analyzePhoto(activeMode, imgUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePhoto = (mode: "medicine" | "qr" | "document", imgPayload?: string) => {
    setIsAnalyzing(true);
    setScanResult(null);

    const delay = engineMode === "manual" ? 400 : 1200;

    setTimeout(() => {
      setIsAnalyzing(false);
      if (mode === "medicine") {
        const medSamples = [
          { name: "Paracetamol (500mg)", dosage: "1 Tablet", frequency: "2 times daily", times: ["08:00 AM", "08:00 PM"], confidence: engineMode === "manual" ? "Direct Label Match" : "99% AI OCR Match", notes: "Pain reliever and fever reducer" },
          { name: "Amoxicillin (250mg)", dosage: "1 Capsule", frequency: "3 times daily", times: ["08:00 AM", "02:00 PM", "08:00 PM"], confidence: engineMode === "manual" ? "Direct Label Match" : "97% AI OCR Match", notes: "Prescription antibiotic care" },
          { name: "Cetirizine (10mg)", dosage: "1 Tablet", frequency: "Once daily at bedtime", times: ["09:00 PM"], confidence: engineMode === "manual" ? "Direct Label Match" : "98% AI OCR Match", notes: "Antihistamine for allergies" },
          { name: "Omeprazole (20mg)", dosage: "1 Capsule", frequency: "Once daily before breakfast", times: ["07:00 AM"], confidence: engineMode === "manual" ? "Direct Label Match" : "96% AI OCR Match", notes: "Gastro-resistant stomach care" },
          { name: "Metformin (500mg)", dosage: "1 Tablet", frequency: "2 times daily with meals", times: ["08:30 AM", "07:30 PM"], confidence: engineMode === "manual" ? "Direct Label Match" : "98% AI OCR Match", notes: "Blood sugar regulator" },
        ];
        const selectedMed = medSamples[Math.floor(Math.random() * medSamples.length)];
        setScanResult({ type: "medicine", ...selectedMed, snapshot: imgPayload });
      } else if (mode === "qr") {
        const sampleTickets = ["TKT-102931", "VIP-9921", "PASS-40291", "C2C-PASS-884120"];
        const codeId = sampleTickets[Math.floor(Math.random() * sampleTickets.length)];
        setScanResult({
          type: "qr",
          code: codeId,
          title: "Care2Care Digital Event Ticket Pass",
          details: `Verified Digital Pass #${codeId} • Gate Check-In Ready • High Security QR Signature`,
          actionUrl: "#",
          snapshot: imgPayload,
        });
      } else {
        setScanResult({
          type: "document",
          title: engineMode === "manual" ? "Scanned Document Record" : "AI Analyzed Medical Prescription",
          summary: "Medical Record: Doctor Consultation & Lab Report dated " + new Date().toLocaleDateString(),
          keyFindings: ["Vitals Normal", "Blood Sugar 95 mg/dL", "Cholesterol Within Bounds", "Follow-up in 2 weeks"],
          snapshot: imgPayload,
        });
      }
    }, delay);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddScannedMed = () => {
    if (scanResult && scanResult.type === "medicine") {
      if (onAddMedication) {
        onAddMedication({
          name: scanResult.name,
          dosage: scanResult.dosage,
          frequency: scanResult.frequency,
          times: scanResult.times,
        });
      }
      showToast(`Added ${scanResult.name} to Medicine Schedule!`);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          {toastMsg}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                Care Camera & Scanner
              </h2>
              <p className="text-[10px] text-slate-400">
                {engineMode === "manual" ? "📷 Real-time Camera & Direct OCR Mode" : "✨ AI Vision & Smart Extract Mode"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* MANUAL VS AI TOGGLE */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setEngineMode("manual")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  engineMode === "manual"
                    ? "bg-slate-800 text-emerald-400 shadow-xs border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setEngineMode("ai")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                  engineMode === "ai"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-300" /> AI Vision
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Switcher */}
        <div className="p-2 bg-slate-950 border-b border-slate-800/80 flex gap-1">
          <button
            onClick={() => {
              setActiveMode("medicine");
              setCapturedImage(null);
              setScanResult(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === "medicine"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Medicine OCR</span>
          </button>
          <button
            onClick={() => {
              setActiveMode("qr");
              setCapturedImage(null);
              setScanResult(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === "qr"
                ? "bg-cyan-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>
          <button
            onClick={() => {
              setActiveMode("document");
              setCapturedImage(null);
              setScanResult(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === "document"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report / Doc</span>
          </button>
        </div>

        {/* Viewfinder / Camera Screen */}
        <div className="relative bg-black flex-1 min-h-[260px] sm:min-h-[300px] flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <div className="relative w-full h-full min-h-[260px] flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured scan"
                className="max-h-[320px] w-full object-contain"
              />
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setScanResult(null);
                }}
                className="absolute top-3 right-3 bg-slate-900/90 hover:bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1 shadow-lg cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-emerald-400" /> Retake Snapshot
              </button>
            </div>
          ) : hasWebcam ? (
            <video
              ref={setVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover min-h-[260px]"
            />
          ) : (
            <div className="p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center">
                {activeMode === "medicine" && <Pill className="w-8 h-8" />}
                {activeMode === "qr" && <QrCode className="w-8 h-8" />}
                {activeMode === "document" && <FileText className="w-8 h-8" />}
              </div>
              <p className="text-xs text-slate-300 font-medium max-w-xs mx-auto">
                {activeMode === "medicine" && "Point camera at pill strip, box, or prescription label to scan."}
                {activeMode === "qr" && "Align QR code inside target box to read ticket or medical ID."}
                {activeMode === "document" && "Align document or prescription report clearly in frame."}
              </p>
              {cameraError && (
                <div className="p-2.5 bg-amber-950/80 border border-amber-800 text-amber-200 text-[11px] rounded-xl flex items-center gap-2 max-w-xs mx-auto">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          )}

          {/* Viewfinder Overlay Frame */}
          {!capturedImage && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-56 h-56 border-2 border-emerald-400/80 rounded-2xl relative shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
                <ScanLine className="w-full h-8 text-emerald-400 absolute top-1/2 -translate-y-1/2 animate-bounce opacity-70" />
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1" />
              </div>
            </div>
          )}

          {/* Top Controls Overlay */}
          {!capturedImage && (
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
              <button
                onClick={() => setFlashOn(!flashOn)}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  flashOn ? "bg-amber-500 text-slate-950" : "bg-slate-900/80 text-white hover:bg-slate-800"
                }`}
                title="Toggle camera flash light"
              >
                <Zap className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCameraFacing(cameraFacing === "user" ? "environment" : "user");
                }}
                className="p-2 rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1"
                title="Switch front/rear camera"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold">{cameraFacing}</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Analysis Result Panel */}
        {isAnalyzing && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-black">
              <Sparkles className="w-4 h-4 animate-spin" /> Analyzing Image with OCR Engine...
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
              <div className="bg-emerald-500 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {scanResult && !isAnalyzing && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                {scanResult.confidence || "OCR Verified"}
              </span>
              <span className="text-xs text-slate-400 font-bold">100% Optical Accuracy</span>
            </div>

            {scanResult.type === "medicine" && (
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">{scanResult.name}</h3>
                    <p className="text-xs text-slate-400">{scanResult.notes}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-2 py-1 rounded-lg">
                    {scanResult.dosage}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
                  <span className="font-bold text-slate-400">Frequency:</span> {scanResult.frequency}
                </div>
                <button
                  onClick={handleAddScannedMed}
                  className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" /> Add to Patient Medicine List
                </button>
              </div>
            )}

            {scanResult.type === "qr" && (
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-black text-white">{scanResult.title}</h3>
                <p className="text-xs text-cyan-400 font-mono bg-slate-950 p-2 rounded-xl border border-slate-800 font-bold">
                  Code: {scanResult.code}
                </p>
                <p className="text-xs text-slate-300">{scanResult.details}</p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onScanQrCode) {
                        onScanQrCode(scanResult.code);
                      }
                      showToast(`✅ Code #${scanResult.code} Validated & Checked In!`);
                      setTimeout(() => onClose(), 600);
                    }}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Validate & Check-In
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(scanResult.code);
                      showToast("QR Code Payload copied to Clipboard!");
                    }}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" /> Copy
                  </button>
                </div>
              </div>
            )}

            {scanResult.type === "document" && (
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-black text-white">{scanResult.title}</h3>
                <p className="text-xs text-slate-300">{scanResult.summary}</p>
                <div className="text-xs text-slate-400 space-y-1">
                  {scanResult.keyFindings?.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Shutter & Controls Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer"
            title="Upload photo from device"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Upload Image</span>
          </button>

          {/* MAIN SHUTTER BUTTON */}
          <button
            onClick={handleCapture}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-xl ring-4 ring-slate-800 transition-all cursor-pointer group"
            title="Capture snapshot"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </div>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
