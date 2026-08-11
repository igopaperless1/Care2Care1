import React, { useRef } from "react";
import qrcode from "qrcode-generator";
import { Heart, Download, Copy, Check, Save } from "lucide-react";

export type QrStylePattern = "square" | "rounded" | "dots" | "classy" | "extra-rounded";
export type QrErrorCorrectionLevel = "L" | "M" | "Q" | "H";
export type QrEyeStyle = "square" | "rounded" | "circle";

interface ProfessionalQrRendererProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  bgImageUrl?: string;
  level?: QrErrorCorrectionLevel;
  patternStyle?: QrStylePattern;
  eyeStyle?: QrEyeStyle;
  showLogo?: boolean;
  logoUrl?: string;
  className?: string;
  showActionButtons?: boolean;
  onSave?: (qrData: { value: string; fgColor: string; bgColor: string; patternStyle: string; eyeStyle: string; level: string }) => void;
}

export const ProfessionalQrRenderer: React.FC<ProfessionalQrRendererProps> = ({
  value,
  size = 220,
  fgColor = "#0f172a",
  bgColor = "#ffffff",
  bgImageUrl,
  level = "M",
  patternStyle = "rounded",
  eyeStyle = "rounded",
  showLogo = true,
  logoUrl,
  className = "",
  showActionButtons = false,
  onSave
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Generate QR Matrix using qrcode-generator
  const qrMatrix = React.useMemo(() => {
    try {
      const qr = qrcode(0, (level || "M") as any);
      qr.addData(value || "Care2Care");
      qr.make();
      const count = qr.getModuleCount();
      const modules: boolean[][] = [];
      for (let r = 0; r < count; r++) {
        const row: boolean[] = [];
        for (let c = 0; c < count; c++) {
          row.push(qr.isDark(r, c));
        }
        modules.push(row);
      }
      return { count, modules };
    } catch (e) {
      console.error("QR Generation Error:", e);
      // Fallback 21x21 matrix if text is too long for auto mode
      try {
        const qr = qrcode(4, (level || "M") as any);
        qr.addData(value || "Care2Care");
        qr.make();
        const count = qr.getModuleCount();
        const modules: boolean[][] = [];
        for (let r = 0; r < count; r++) {
          const row: boolean[] = [];
          for (let c = 0; c < count; c++) {
            row.push(qr.isDark(r, c));
          }
          modules.push(row);
        }
        return { count, modules };
      } catch (err) {
        return { count: 21, modules: Array(21).fill(Array(21).fill(false)) };
      }
    }
  }, [value, level]);

  const { count, modules } = qrMatrix;

  // Helper to check if (r, c) is inside one of the 3 Corner Eyes (7x7)
  const isEyeModule = (r: number, c: number): boolean => {
    const isTopLeft = r < 7 && c < 7;
    const isTopRight = r < 7 && c >= count - 7;
    const isBottomLeft = r >= count - 7 && c < 7;
    return isTopLeft || isTopRight || isBottomLeft;
  };

  // Helper to check if (r, c) is inside Center Excavated Area for Logo
  const isLogoExcavated = (r: number, c: number): boolean => {
    if (!showLogo) return false;
    const mid = Math.floor(count / 2);
    const radius = Math.max(2, Math.floor(count * 0.13));
    return Math.abs(r - mid) <= radius && Math.abs(c - mid) <= radius;
  };

  // Render individual eye
  const renderEye = (ox: number, oy: number, key: string) => {
    if (eyeStyle === "square") {
      return (
        <g key={key}>
          <rect x={ox} y={oy} width={7} height={7} fill={fgColor} />
          <rect x={ox + 1} y={oy + 1} width={5} height={5} fill={bgColor} />
          <rect x={ox + 2} y={oy + 2} width={3} height={3} fill={fgColor} />
        </g>
      );
    }

    if (eyeStyle === "circle") {
      return (
        <g key={key}>
          <circle cx={ox + 3.5} cy={oy + 3.5} r={3.5} fill={fgColor} />
          <circle cx={ox + 3.5} cy={oy + 3.5} r={2.5} fill={bgColor} />
          <circle cx={ox + 3.5} cy={oy + 3.5} r={1.5} fill={fgColor} />
        </g>
      );
    }

    // Default "rounded"
    return (
      <g key={key}>
        <rect x={ox} y={oy} width={7} height={7} rx={1.8} ry={1.8} fill={fgColor} />
        <rect x={ox + 1} y={oy + 1} width={5} height={5} rx={1.2} ry={1.2} fill={bgColor} />
        <rect x={ox + 2} y={oy + 2} width={3} height={3} rx={1} ry={1} fill={fgColor} />
      </g>
    );
  };

  // Download functionality
  const downloadPng = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 1000, 1000);
        ctx.drawImage(img, 0, 0, 1000, 1000);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `Care2Care-QR-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Logo center dimension in viewbox units
  const logoBoxSize = Math.max(5, Math.floor(count * 0.26));
  const logoBoxPos = (count - logoBoxSize) / 2;

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <div
        className="relative p-3.5 rounded-3xl shadow-xl border border-slate-200/90 transition-all flex items-center justify-center group"
        style={{ backgroundColor: bgColor }}
      >
        <svg
          ref={svgRef}
          viewBox={`-2 -2 ${count + 4} ${count + 4}`}
          width={size}
          height={size}
          className="w-full h-full max-w-full block"
          style={{ shapeRendering: "geometricPrecision" }}
        >
          {/* Quiet Zone Background */}
          <rect x={-2} y={-2} width={count + 4} height={count + 4} fill={bgColor} />

          {/* Custom Background Photo / Picture overlay if provided */}
          {bgImageUrl && (
            <image
              href={bgImageUrl}
              x={-2}
              y={-2}
              width={count + 4}
              height={count + 4}
              preserveAspectRatio="xMidYMid slice"
              opacity={0.25}
            />
          )}

          {/* Render Corner Eyes */}
          {renderEye(0, 0, `eye-tl-${eyeStyle}`)}
          {renderEye(count - 7, 0, `eye-tr-${eyeStyle}`)}
          {renderEye(0, count - 7, `eye-bl-${eyeStyle}`)}

          {/* Render Data Modules according to patternStyle */}
          {modules.map((row, r) =>
            row.map((isDark, c) => {
              if (!isDark) return null;
              if (isEyeModule(r, c)) return null;
              if (isLogoExcavated(r, c)) return null;

              const key = `mod-${patternStyle}-${r}-${c}`;

              if (patternStyle === "square") {
                return <rect key={key} x={c} y={r} width={1.02} height={1.02} fill={fgColor} />;
              }

              if (patternStyle === "dots") {
                return <circle key={key} cx={c + 0.5} cy={r + 0.5} r={0.41} fill={fgColor} />;
              }

              if (patternStyle === "classy") {
                return <rect key={key} x={c + 0.06} y={r + 0.06} width={0.88} height={0.88} rx={0.42} ry={0.08} fill={fgColor} />;
              }

              if (patternStyle === "extra-rounded") {
                return <rect key={key} x={c + 0.05} y={r + 0.05} width={0.9} height={0.9} rx={0.45} ry={0.45} fill={fgColor} />;
              }

              // Default "rounded"
              return <rect key={key} x={c + 0.08} y={r + 0.08} width={0.84} height={0.84} rx={0.28} ry={0.28} fill={fgColor} />;
            })
          )}

          {/* Center Logo Area */}
          {showLogo && (
            <g>
              <rect
                x={logoBoxPos}
                y={logoBoxPos}
                width={logoBoxSize}
                height={logoBoxSize}
                rx={logoBoxSize * 0.25}
                ry={logoBoxSize * 0.25}
                fill={bgColor}
                stroke={fgColor}
                strokeWidth={0.2}
              />
              {logoUrl ? (
                <image
                  href={logoUrl}
                  x={logoBoxPos + logoBoxSize * 0.15}
                  y={logoBoxPos + logoBoxSize * 0.15}
                  width={logoBoxSize * 0.7}
                  height={logoBoxSize * 0.7}
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <g transform={`translate(${logoBoxPos + logoBoxSize * 0.2}, ${logoBoxPos + logoBoxSize * 0.2}) scale(${logoBoxSize * 0.025})`}>
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="#10b981"
                  />
                </g>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* Action Toolbar under Generated QR */}
      {showActionButtons && (
        <div className="flex items-center gap-2 w-full max-w-[260px]">
          <button
            type="button"
            onClick={downloadPng}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-sm cursor-pointer flex items-center justify-center gap-1.5 transition-all"
            title="Download High-Resolution PNG QR Code"
          >
            <Download className="w-4 h-4" /> Download QR
          </button>
          <button
            type="button"
            onClick={copyToClipboard}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all"
            title="Copy QR Data Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
};
