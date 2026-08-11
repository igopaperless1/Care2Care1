import React, { useState, useRef } from "react";
import { Camera, Upload, PenTool, CheckCircle2, Trash2, X, RefreshCw, Sliders, Check, Fingerprint, Eye } from "lucide-react";

export interface PartyBiometricData {
  photoUrl?: string;
  signatureData?: string;
  leftThumbData?: string;
  rightThumbData?: string;
}

interface PartyBiometricCaptureCardProps {
  partyTitle: string; // e.g. "Witness Photo & Biometrics" or "Party A (Borrower)"
  partyRoleSubtitle?: string; // e.g. "Attach photo of witness, identity record, signature & thumb impressions"
  data: PartyBiometricData;
  onChange: (updatedData: PartyBiometricData) => void;
  readOnly?: boolean;
  accentColor?: "emerald" | "indigo" | "amber" | "cyan" | "purple";
}

export const PartyBiometricCaptureCard: React.FC<PartyBiometricCaptureCardProps> = ({
  partyTitle,
  partyRoleSubtitle = "Attach photo of witness, identity record, signature & thumb impressions",
  data,
  onChange,
  readOnly = false,
  accentColor = "emerald"
}) => {
  // Modal states
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState<"photo" | "leftThumb" | "rightThumb" | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Canvas ref for drawing signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#0f172a");
  const [penWidth, setPenWidth] = useState(3);

  // Webcam stream state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof PartyBiometricData) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        onChange({ ...data, [field]: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Signature Canvas Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onChange({ ...data, signatureData: dataUrl });
    setShowSignatureModal(false);
  };

  // Start Webcam
  const startCamera = async (target: "photo" | "leftThumb" | "rightThumb") => {
    setShowCameraModal(target);
    setCameraError(null);
    setCameraActive(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setCameraError("Camera access failed or unavailable in this environment. You can upload photo files directly!");
    }
  };

  const captureCameraSnapshot = () => {
    if (!videoRef.current || !showCameraModal) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imgUrl = canvas.toDataURL("image/png");

      if (showCameraModal === "photo") onChange({ ...data, photoUrl: imgUrl });
      if (showCameraModal === "leftThumb") onChange({ ...data, leftThumbData: imgUrl });
      if (showCameraModal === "rightThumb") onChange({ ...data, rightThumbData: imgUrl });
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCameraModal(null);
    setCameraActive(false);
  };

  // Generate Sample Thumb Impression for demo quick testing
  const generateSampleThumb = (side: "leftThumbData" | "rightThumbData") => {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Oval background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 200, 240);
      
      // Ink color
      ctx.strokeStyle = side === "leftThumbData" ? "#1e3a8a" : "#065f46";
      ctx.lineWidth = 2.5;

      // Draw concentric fingerprint ridges
      const centerX = 100;
      const centerY = 120;
      for (let r = 10; r < 90; r += 7) {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, r * 0.75, r, Math.PI / 12, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Center loop
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - 10, 8, 25, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Label text
      ctx.fillStyle = "#475569";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(side === "leftThumbData" ? "LEFT THUMB PRINT" : "RIGHT THUMB PRINT", centerX, 225);

      const dataUrl = canvas.toDataURL("image/png");
      onChange({ ...data, [side]: dataUrl });
    }
  };

  const colorClasses = {
    emerald: {
      border: "border-emerald-500",
      bg: "bg-emerald-50/50",
      accentBg: "bg-emerald-600 hover:bg-emerald-700",
      text: "text-emerald-800",
      lightBadge: "bg-emerald-100 text-emerald-800"
    },
    indigo: {
      border: "border-indigo-500",
      bg: "bg-indigo-50/50",
      accentBg: "bg-indigo-600 hover:bg-indigo-700",
      text: "text-indigo-800",
      lightBadge: "bg-indigo-100 text-indigo-800"
    },
    amber: {
      border: "border-amber-500",
      bg: "bg-amber-50/50",
      accentBg: "bg-amber-600 hover:bg-amber-700",
      text: "text-amber-800",
      lightBadge: "bg-amber-100 text-amber-800"
    },
    cyan: {
      border: "border-cyan-500",
      bg: "bg-cyan-50/50",
      accentBg: "bg-cyan-600 hover:bg-cyan-700",
      text: "text-cyan-800",
      lightBadge: "bg-cyan-100 text-cyan-800"
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-50/50",
      accentBg: "bg-purple-600 hover:bg-purple-700",
      text: "text-purple-800",
      lightBadge: "bg-purple-100 text-purple-800"
    }
  }[accentColor];

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-4 sm:p-5 space-y-4 shadow-sm font-sans relative overflow-hidden">
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Fingerprint className="w-4 h-4 text-emerald-600" />
          {partyTitle}
        </h4>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          Legal Biometrics & Identity Record
        </span>
      </div>

      {/* TOP SECTION: PHOTO & ATTACHMENT (Matching Handwritten Sketch Top Row) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-300">
        {/* Left Side: Photo Box ("No pic" or Image preview) */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {data.photoUrl ? (
            <div className="relative group shrink-0">
              <img
                src={data.photoUrl}
                alt="Party/Witness"
                className="w-16 h-16 rounded-lg object-cover border-2 border-slate-900 shadow-2xs cursor-pointer"
                onClick={() => setPreviewImage({ url: data.photoUrl!, title: partyTitle })}
              />
              <button
                type="button"
                onClick={() => setPreviewImage({ url: data.photoUrl!, title: partyTitle })}
                className="absolute inset-0 bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-lg"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-slate-200 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-500 font-bold text-[11px] shrink-0">
              <span>No pic</span>
            </div>
          )}

          {/* Center Text Label */}
          <div className="flex-1">
            <h5 className="text-xs font-bold text-slate-900">Witness photo / Party Photo</h5>
            <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{partyRoleSubtitle}</p>
          </div>
        </div>

        {/* Right Side: [ Upload ] Button & Camera Button */}
        {!readOnly && (
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs border border-slate-900 transition-all">
              <Upload className="w-3.5 h-3.5" />
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "photoUrl")}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => startCamera("photo")}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 transition-all border border-slate-300"
              title="Capture Photo using Webcam"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {data.photoUrl && (
              <button
                type="button"
                onClick={() => onChange({ ...data, photoUrl: undefined })}
                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs cursor-pointer transition-all border border-rose-200"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: SIGNATURE & THUMB IMPRESSIONS (Matching Handwritten Sketch Bottom Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Bottom Left: [ Signature ] Button & Preview */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              Signature
              {data.signatureData ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              ) : (
                <span className="text-[10px] text-amber-600 font-normal">(Pending)</span>
              )}
            </span>

            {!readOnly && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowSignatureModal(true)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] font-bold text-slate-800 flex items-center gap-1 cursor-pointer transition-all"
                >
                  <PenTool className="w-3 h-3 text-emerald-600" />
                  {data.signatureData ? "Redraw" : "Draw Signature"}
                </button>
                <label className="p-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] text-slate-700 cursor-pointer" title="Upload Signature File">
                  <Upload className="w-3 h-3" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "signatureData")}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {data.signatureData ? (
            <div className="relative bg-white border border-slate-200 rounded-lg p-2 h-16 flex items-center justify-center">
              <img src={data.signatureData} alt="Signature" className="max-h-12 object-contain" />
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => onChange({ ...data, signatureData: undefined })}
                  className="absolute top-1 right-1 p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 rounded-lg p-2 text-center text-[10px] text-slate-500 font-mono bg-white">
              No digital signature attached
            </div>
          )}
        </div>

        {/* Bottom Right: Thumbs [v] with [ Left ] and [ Right ] Buttons */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1">
              Thumbs
              <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Biometric Prints</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Left Thumb Button & Status */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (data.leftThumbData) {
                      setPreviewImage({ url: data.leftThumbData, title: `${partyTitle} - Left Thumb Print` });
                    } else if (!readOnly) {
                      generateSampleThumb("leftThumbData");
                    }
                  }}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-black border transition-all cursor-pointer flex items-center justify-between ${
                    data.leftThumbData
                      ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <span>Left</span>
                  {data.leftThumbData && <Check className="w-3 h-3 text-emerald-700 font-extrabold" />}
                </button>
              </div>

              {!readOnly && (
                <div className="flex items-center justify-between gap-1 text-[9px] text-slate-500">
                  <label className="hover:underline cursor-pointer text-slate-600 font-semibold">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "leftThumbData")}
                      className="hidden"
                    />
                  </label>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => generateSampleThumb("leftThumbData")}
                    className="hover:underline cursor-pointer text-emerald-700 font-semibold"
                  >
                    Auto-Scan
                  </button>
                  {data.leftThumbData && (
                    <>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => onChange({ ...data, leftThumbData: undefined })}
                        className="text-rose-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Thumb Button & Status */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (data.rightThumbData) {
                      setPreviewImage({ url: data.rightThumbData, title: `${partyTitle} - Right Thumb Print` });
                    } else if (!readOnly) {
                      generateSampleThumb("rightThumbData");
                    }
                  }}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-black border transition-all cursor-pointer flex items-center justify-between ${
                    data.rightThumbData
                      ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <span>Right</span>
                  {data.rightThumbData && <Check className="w-3 h-3 text-emerald-700 font-extrabold" />}
                </button>
              </div>

              {!readOnly && (
                <div className="flex items-center justify-between gap-1 text-[9px] text-slate-500">
                  <label className="hover:underline cursor-pointer text-slate-600 font-semibold">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "rightThumbData")}
                      className="hidden"
                    />
                  </label>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => generateSampleThumb("rightThumbData")}
                    className="hover:underline cursor-pointer text-emerald-700 font-semibold"
                  >
                    Auto-Scan
                  </button>
                  {data.rightThumbData && (
                    <>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => onChange({ ...data, rightThumbData: undefined })}
                        className="text-rose-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SIGNATURE DRAWING MODAL */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-emerald-600" />
                  Digital Signature Canvas
                </h3>
                <p className="text-[11px] text-slate-500">Sign with mouse, stylus, or touch screen</p>
              </div>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawing Controls */}
            <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600">Ink Color:</span>
                {["#0f172a", "#1e3a8a", "#065f46", "#991b1b"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setPenColor(c)}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                      penColor === c ? "border-slate-900 scale-110 shadow-xs" : "border-transparent opacity-80"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600">Width:</span>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={penWidth}
                  onChange={(e) => setPenWidth(Number(e.target.value))}
                  className="w-20 accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Canvas Container */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden touch-none relative shadow-inner">
              <canvas
                ref={canvasRef}
                width={460}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-48 bg-white cursor-crosshair"
              />
              <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono pointer-events-none">
                Draw here
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={clearCanvas}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Clear Canvas
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSignatureModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveSignature}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-md transition-all flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Save Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAMERA SNAPSHOT MODAL */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1">
                <Camera className="w-4 h-4 text-emerald-600" />
                Live Camera Capture ({showCameraModal})
              </h3>
              <button onClick={stopCamera} className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold">
                {cameraError}
              </div>
            ) : (
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-4/3 flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {!cameraActive && <p className="text-xs text-white">Starting camera...</p>}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Close
              </button>
              {cameraActive && (
                <button
                  type="button"
                  onClick={captureCameraSnapshot}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" /> Take Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW ENLARGED IMAGE MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-3 shadow-2xl border border-slate-200 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-900">{previewImage.title}</h3>
              <button onClick={() => setPreviewImage(null)} className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-100 p-2 rounded-2xl max-h-96 flex items-center justify-center overflow-auto">
              <img src={previewImage.url} alt="Enlarged Biometric" className="max-h-80 object-contain rounded-xl shadow-xs" />
            </div>
            <button
              onClick={() => setPreviewImage(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
