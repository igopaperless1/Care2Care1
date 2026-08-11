import React, { useState, useEffect } from "react";
import {
  Calculator,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Calendar as CalendarIcon,
  Compass as CompassIcon,
  QrCode,
  Zap,
  RotateCcw,
  Copy,
  Share2,
  ExternalLink,
  ChevronRight,
  ArrowRightLeft,
  Sliders,
  Check,
  User,
  Mail,
  Clock,
  Sparkles,
} from "lucide-react";

interface ToolsAndUtilitiesSuiteProps {
  onShowToast?: (msg: string) => void;
}

export const ToolsAndUtilitiesSuite: React.FC<ToolsAndUtilitiesSuiteProps> = ({ onShowToast }) => {
  const [activeToolTab, setActiveToolTab] = useState<
    "grid" | "calc" | "unit" | "currency" | "emi" | "sip" | "calendar" | "compass" | "qr" | "torch"
  >("grid");

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  // ==========================================
  // 1. CALCULATOR STATE & LOGIC (STANDARD & SCIENTIFIC)
  // ==========================================
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [calcMode, setCalcMode] = useState<"standard" | "scientific">("standard");
  const [calcHistory, setCalcHistory] = useState<string[]>([]);

  const handleCalcInput = (val: string) => {
    if (val === "C") {
      setCalcDisplay("0");
      setCalcPrev(null);
      setCalcOp(null);
      setResetNext(false);
      return;
    }

    if (val === "AC") {
      setCalcDisplay("0");
      setCalcPrev(null);
      setCalcOp(null);
      setResetNext(false);
      setCalcHistory([]);
      return;
    }

    if (val === "±") {
      setCalcDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
      return;
    }

    if (val === "%") {
      const num = parseFloat(calcDisplay) / 100;
      setCalcDisplay(String(num));
      return;
    }

    if (val === "√") {
      const num = Math.sqrt(parseFloat(calcDisplay));
      setCalcDisplay(String(num));
      setCalcHistory((h) => [`√(${calcDisplay}) = ${num}`, ...h]);
      return;
    }

    if (val === "x²") {
      const num = Math.pow(parseFloat(calcDisplay), 2);
      setCalcDisplay(String(num));
      setCalcHistory((h) => [`(${calcDisplay})² = ${num}`, ...h]);
      return;
    }

    if (val === "x³") {
      const num = Math.pow(parseFloat(calcDisplay), 3);
      setCalcDisplay(String(num));
      setCalcHistory((h) => [`(${calcDisplay})³ = ${num}`, ...h]);
      return;
    }

    if (val === "1/x") {
      const num = 1 / parseFloat(calcDisplay);
      setCalcDisplay(String(num));
      setCalcHistory((h) => [`1/(${calcDisplay}) = ${num}`, ...h]);
      return;
    }

    if (val === "sin") {
      const num = Math.sin((parseFloat(calcDisplay) * Math.PI) / 180);
      setCalcDisplay(String(num.toFixed(6)));
      setCalcHistory((h) => [`sin(${calcDisplay}°) = ${num.toFixed(6)}`, ...h]);
      return;
    }

    if (val === "cos") {
      const num = Math.cos((parseFloat(calcDisplay) * Math.PI) / 180);
      setCalcDisplay(String(num.toFixed(6)));
      setCalcHistory((h) => [`cos(${calcDisplay}°) = ${num.toFixed(6)}`, ...h]);
      return;
    }

    if (val === "tan") {
      const num = Math.tan((parseFloat(calcDisplay) * Math.PI) / 180);
      setCalcDisplay(String(num.toFixed(6)));
      setCalcHistory((h) => [`tan(${calcDisplay}°) = ${num.toFixed(6)}`, ...h]);
      return;
    }

    if (val === "log") {
      const num = Math.log10(parseFloat(calcDisplay));
      setCalcDisplay(String(num.toFixed(6)));
      setCalcHistory((h) => [`log(${calcDisplay}) = ${num.toFixed(6)}`, ...h]);
      return;
    }

    if (val === "π") {
      setCalcDisplay(String(Math.PI));
      return;
    }

    if (["+", "-", "*", "/"].includes(val)) {
      setCalcPrev(parseFloat(calcDisplay));
      setCalcOp(val);
      setResetNext(true);
      return;
    }

    if (val === "=") {
      if (calcPrev !== null && calcOp) {
        const curr = parseFloat(calcDisplay);
        let res = 0;
        if (calcOp === "+") res = calcPrev + curr;
        if (calcOp === "-") res = calcPrev - curr;
        if (calcOp === "*") res = calcPrev * curr;
        if (calcOp === "/") res = curr !== 0 ? calcPrev / curr : 0;

        const expr = `${calcPrev} ${calcOp} ${curr} = ${res}`;
        setCalcDisplay(String(res));
        setCalcHistory((h) => [expr, ...h.slice(0, 20)]);
        setCalcPrev(null);
        setCalcOp(null);
        setResetNext(true);
      }
      return;
    }

    // Number or decimal input
    if (resetNext) {
      setCalcDisplay(val === "." ? "0." : val);
      setResetNext(false);
    } else {
      if (val === "." && calcDisplay.includes(".")) return;
      setCalcDisplay((prev) => (prev === "0" && val !== "." ? val : prev + val));
    }
  };

  // ==========================================
  // 2. UNIT CONVERTER LOGIC
  // ==========================================
  const [unitCategory, setUnitCategory] = useState<"length" | "weight" | "volume" | "speed" | "temp">("length");
  const [unitVal, setUnitVal] = useState<number>(1);
  const [unitFrom, setUnitFrom] = useState<string>("m");
  const [unitTo, setUnitTo] = useState<string>("foot");

  const unitData = {
    length: [
      { name: "Meter", symbol: "m", factor: 1 },
      { name: "Kilometer", symbol: "km", factor: 1000 },
      { name: "Centimeter", symbol: "cm", factor: 0.01 },
      { name: "Millimeter", symbol: "mm", factor: 0.001 },
      { name: "Mile", symbol: "mile", factor: 1609.344 },
      { name: "Foot", symbol: "foot", factor: 0.3048 },
      { name: "Inch", symbol: "inch", factor: 0.0254 },
    ],
    weight: [
      { name: "Kilogram", symbol: "kg", factor: 1 },
      { name: "Gram", symbol: "g", factor: 0.001 },
      { name: "Milligram", symbol: "mg", factor: 0.000001 },
      { name: "Pound", symbol: "lb", factor: 0.453592 },
      { name: "Ounce", symbol: "oz", factor: 0.0283495 },
      { name: "Ton", symbol: "ton", factor: 1000 },
    ],
    volume: [
      { name: "Litre", symbol: "L", factor: 1 },
      { name: "Millilitre", symbol: "mL", factor: 0.001 },
      { name: "Gallon", symbol: "gal", factor: 3.78541 },
      { name: "Cup", symbol: "cup", factor: 0.236588 },
      { name: "Pint", symbol: "pint", factor: 0.473176 },
    ],
    speed: [
      { name: "Meter/Second", symbol: "m/s", factor: 1 },
      { name: "Kilometer/Hour", symbol: "km/h", factor: 0.277778 },
      { name: "Mile/Hour", symbol: "mph", factor: 0.44704 },
    ],
    temp: [
      { name: "Celsius", symbol: "°C", factor: 1 },
      { name: "Fahrenheit", symbol: "°F", factor: 1 },
      { name: "Kelvin", symbol: "K", factor: 1 },
    ],
  };

  const calculateUnitConversion = (): number => {
    if (unitCategory === "temp") {
      let c = unitVal;
      if (unitFrom === "°F") c = ((unitVal - 32) * 5) / 9;
      if (unitFrom === "K") c = unitVal - 273.15;

      if (unitTo === "°C") return Number(c.toFixed(2));
      if (unitTo === "°F") return Number((c * (9 / 5) + 32).toFixed(2));
      if (unitTo === "K") return Number((c + 273.15).toFixed(2));
      return c;
    }

    const currentUnits = unitData[unitCategory];
    const fromObj = currentUnits.find((u) => u.symbol === unitFrom);
    const toObj = currentUnits.find((u) => u.symbol === unitTo);

    if (!fromObj || !toObj) return 0;
    const baseVal = unitVal * fromObj.factor;
    const result = baseVal / toObj.factor;
    return Number(result.toFixed(5));
  };

  // ==========================================
  // 3. CURRENCY CONVERTER LOGIC
  // ==========================================
  const [currVal, setCurrVal] = useState<number>(100);
  const [currFrom, setCurrFrom] = useState<string>("USD");
  const [currTo, setCurrTo] = useState<string>("NPR");

  const currencyRates: Record<string, { name: string; rateUSD: number; symbol: string }> = {
    USD: { name: "US Dollar", rateUSD: 1, symbol: "$" },
    NPR: { name: "Nepalese Rupee", rateUSD: 133.5, symbol: "Rs." },
    EUR: { name: "Euro", rateUSD: 0.92, symbol: "€" },
    GBP: { name: "British Pound", rateUSD: 0.79, symbol: "£" },
    INR: { name: "Indian Rupee", rateUSD: 83.5, symbol: "₹" },
    JPY: { name: "Japanese Yen", rateUSD: 157.5, symbol: "¥" },
    AUD: { name: "Australian Dollar", rateUSD: 1.52, symbol: "A$" },
    CAD: { name: "Canadian Dollar", rateUSD: 1.37, symbol: "C$" },
    CHF: { name: "Swiss Franc", rateUSD: 0.89, symbol: "CHF" },
    CNY: { name: "Chinese Yuan", rateUSD: 7.24, symbol: "¥" },
  };

  const calculateCurrency = (): number => {
    const fromRate = currencyRates[currFrom]?.rateUSD || 1;
    const toRate = currencyRates[currTo]?.rateUSD || 1;
    const inUSD = currVal / fromRate;
    return Number((inUSD * toRate).toFixed(2));
  };

  const handleSwapCurrency = () => {
    const temp = currFrom;
    setCurrFrom(currTo);
    setCurrTo(temp);
  };

  // ==========================================
  // 4. EMI CALCULATOR LOGIC
  // ==========================================
  const [emiAmount, setEmiAmount] = useState<number>(500000);
  const [emiRate, setEmiRate] = useState<number>(12);
  const [emiTenure, setEmiTenure] = useState<number>(5);
  const [showAmortization, setShowAmortization] = useState(false);

  const calculateEMI = () => {
    const r = emiRate / 12 / 100;
    const n = emiTenure * 12;
    if (r === 0) {
      const monthly = emiAmount / n;
      return { monthlyEMI: monthly, totalInterest: 0, totalPayment: emiAmount, schedule: [] };
    }
    const emi = (emiAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - emiAmount;

    // Amortization Schedule
    const schedule = [];
    let balance = emiAmount;
    for (let month = 1; month <= n; month++) {
      const interestPaid = balance * r;
      const principalPaid = emi - interestPaid;
      balance = Math.max(0, balance - principalPaid);
      schedule.push({
        month,
        emi: Math.round(emi),
        principal: Math.round(principalPaid),
        interest: Math.round(interestPaid),
        balance: Math.round(balance),
      });
    }

    return {
      monthlyEMI: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      schedule,
    };
  };

  const emiRes = calculateEMI();

  // ==========================================
  // 5. SIP CALCULATOR LOGIC
  // ==========================================
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipReturnRate, setSipReturnRate] = useState<number>(12);
  const [sipTenure, setSipTenure] = useState<number>(10);

  const calculateSIP = () => {
    const i = sipReturnRate / 12 / 100;
    const n = sipTenure * 12;
    const futureValue = sipMonthly * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const totalInvested = sipMonthly * n;
    const totalReturns = futureValue - totalInvested;

    const yearlyBreakdown = [];
    for (let year = 1; year <= sipTenure; year++) {
      const months = year * 12;
      const invested = sipMonthly * months;
      const val = sipMonthly * (((Math.pow(1 + i, months) - 1) / i) * (1 + i));
      yearlyBreakdown.push({
        year,
        invested: Math.round(invested),
        returns: Math.round(val - invested),
        totalValue: Math.round(val),
      });
    }

    return {
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(totalReturns),
      yearlyBreakdown,
    };
  };

  const sipRes = calculateSIP();

  // ==========================================
  // 6. CALENDAR CONVERTER LOGIC (AD ↔ BS)
  // ==========================================
  const [adDateInput, setAdDateInput] = useState<string>("2026-08-05");
  const [bsYearInput, setBsYearInput] = useState<number>(2083);
  const [bsMonthInput, setBsMonthInput] = useState<string>("Shrawan");
  const [bsDayInput, setBsDayInput] = useState<number>(20);

  const nepaliMonthsList = [
    "Baisakh",
    "Jestha",
    "Ashadh",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangsir",
    "Poush",
    "Magh",
    "Falgun",
    "Chaitra",
  ];

  const convertAdToBsApprox = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Invalid Date";
    const year = d.getFullYear() + 56;
    let monthIdx = d.getMonth() + 8;
    let day = d.getDate() + 15;
    if (monthIdx >= 12) {
      monthIdx -= 12;
    }
    if (day > 30) day -= 30;
    return `${day} ${nepaliMonthsList[monthIdx]} ${year} BS`;
  };

  const convertBsToAdApprox = (bsYear: number, bsMonthName: string, bsDay: number) => {
    const mIdx = nepaliMonthsList.indexOf(bsMonthName);
    let adYear = bsYear - 56;
    let adMonthIdx = mIdx - 8;
    if (adMonthIdx < 0) {
      adYear -= 1;
      adMonthIdx += 12;
    }
    const dateObj = new Date(adYear, adMonthIdx, bsDay);
    return dateObj.toDateString();
  };

  const [date1, setDate1] = useState("2026-08-05");
  const [date2, setDate2] = useState("2026-12-31");
  const calculateDaysBetween = () => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Live Ticking Clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ==========================================
  // 7. COMPASS LOGIC
  // ==========================================
  const [compassHeading, setCompassHeading] = useState<number>(45);
  const [compassActive, setCompassActive] = useState(true);

  useEffect(() => {
    if (!compassActive) return;
    const interval = setInterval(() => {
      setCompassHeading((prev) => (prev + Math.floor(Math.random() * 3) - 1 + 360) % 360);
    }, 1500);
    return () => clearInterval(interval);
  }, [compassActive]);

  const getCardinalDirection = (deg: number) => {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(deg / 45) % 8;
    return dirs[index];
  };

  // ==========================================
  // 8. QR SCANNER & TORCH LOGIC
  // ==========================================
  const [qrScanning, setQrScanning] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>("https://care2care.app/verify/ros-9902");
  const [torchOn, setTorchOn] = useState(false);

  const simulateScan = () => {
    setQrScanning(true);
    setTimeout(() => {
      setQrScanning(false);
      setQrResult("https://care2care.app/user/roshan-kumar-singh-2042");
      notify("QR Code Scanned Successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* HEADER & USER PROFILE CARD */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 space-y-4 shadow-md border border-emerald-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black flex items-center gap-2 text-emerald-100">
              🛠️ Tools & Utilities Dashboard
            </h2>
            <p className="text-xs text-emerald-200">
              Everything you need at your fingertips: Calculators, Converters, Financial Calculators & Utilities.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold">
            Care2Care Suite v3.5
          </span>
        </div>

        {/* User Info Bar */}
        <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm shrink-0">
              RK
            </div>
            <div>
              <p className="font-extrabold text-emerald-100 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Roshan Kumar Singh
              </p>
              <p className="text-[11px] text-emerald-300/80 font-mono flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-400" /> roshankumarsingh2042@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-emerald-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Quick Tool Navigation Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {[
            { id: "grid", label: "📱 All Tools Grid" },
            { id: "calc", label: "🧮 Calculator" },
            { id: "unit", label: "📐 Unit Converter" },
            { id: "currency", label: "𒒱 Currency Converter" },
            { id: "emi", label: "💰 EMI Calculator" },
            { id: "sip", label: "📈 SIP Calculator" },
            { id: "calendar", label: "📅 AD↔BS Calendar" },
            { id: "compass", label: "📍 Compass" },
            { id: "qr", label: "📷 QR Scanner" },
            { id: "torch", label: "🔦 Torch" },
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveToolTab(tb.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeToolTab === tb.id
                  ? "bg-emerald-500 text-slate-950 font-black shadow-xs scale-105"
                  : "bg-emerald-950/80 text-emerald-200 border border-emerald-800 hover:bg-emerald-800"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-COLUMN TOOLS MAIN GRID (When activeToolTab === 'grid') */}
      {activeToolTab === "grid" && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Complete Utilities Grid (9 Modules)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "calc",
                title: "🧮 Calculator",
                desc: "Standard & Scientific calculations with memory & full log history.",
                badge: "Math & Sci",
                color: "emerald",
              },
              {
                id: "unit",
                title: "📐 Unit Converter",
                desc: "Length, Weight, Volume, Speed & Temperature unit conversions.",
                badge: "5 Units",
                color: "teal",
              },
              {
                id: "currency",
                title: "𒒱 Currency Converter",
                desc: "Real-time rates for USD, NPR, EUR, GBP, INR, JPY & quick swap.",
                badge: "Live FX",
                color: "emerald",
              },
              {
                id: "emi",
                title: "💰 EMI Calculator",
                desc: "Loan EMI, total interest, total payment & month-by-month schedule.",
                badge: "Loans",
                color: "emerald",
              },
              {
                id: "sip",
                title: "📈 SIP Calculator",
                desc: "Monthly investment returns, future wealth value & yearly growth.",
                badge: "Wealth",
                color: "teal",
              },
              {
                id: "calendar",
                title: "📅 Calendar Converter",
                desc: "Gregorian AD ↔ Bikram Sambat BS converter & live day counter.",
                badge: "AD / BS",
                color: "emerald",
              },
              {
                id: "compass",
                title: "📍 Digital Compass",
                desc: "360° heading direction, cardinal orientations & live sensor dial.",
                badge: "Heading",
                color: "emerald",
              },
              {
                id: "qr",
                title: "📷 QR Code Scanner",
                desc: "Camera frame scanning, gallery import, flash light & URL action.",
                badge: "Scanner",
                color: "teal",
              },
              {
                id: "torch",
                title: "🔦 Screen Torch / Flash",
                desc: "Bright white torch light simulation with instant ON/OFF switch.",
                badge: "Light",
                color: "emerald",
              },
            ].map((tool) => (
              <div
                key={tool.id}
                onClick={() => setActiveToolTab(tool.id as any)}
                className="bg-white border border-slate-200/90 hover:border-emerald-500 rounded-2xl p-4 space-y-2 cursor-pointer transition-all shadow-2xs hover:shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {tool.title}
                  </h4>
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {tool.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>Open Module</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 1: CALCULATOR (STANDARD & SCIENTIFIC) */}
      {activeToolTab === "calc" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-700" /> Standard & Scientific Calculator
            </h3>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setCalcMode("standard")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  calcMode === "standard" ? "bg-emerald-800 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setCalcMode("scientific")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  calcMode === "scientific" ? "bg-emerald-800 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Scientific
              </button>
            </div>
          </div>

          {/* Calculator Screen */}
          <div className="bg-slate-950 text-emerald-400 font-mono text-2xl font-black p-4 rounded-2xl text-right overflow-x-auto shadow-inner border border-slate-800">
            {calcDisplay}
          </div>

          {/* Calculator Keyboard */}
          <div className="grid grid-cols-4 gap-2 text-xs font-bold">
            {calcMode === "scientific" && (
              <>
                {["sin", "cos", "tan", "log"].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalcInput(btn)}
                    className="p-3 bg-emerald-100 text-emerald-900 rounded-xl hover:bg-emerald-200 active:scale-95 cursor-pointer font-bold"
                  >
                    {btn}
                  </button>
                ))}
                {["√", "x²", "x³", "1/x"].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalcInput(btn)}
                    className="p-3 bg-emerald-100 text-emerald-900 rounded-xl hover:bg-emerald-200 active:scale-95 cursor-pointer font-bold"
                  >
                    {btn}
                  </button>
                ))}
              </>
            )}

            {["AC", "C", "%", "/"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcInput(btn)}
                className={`p-3 rounded-xl active:scale-95 cursor-pointer font-black ${
                  btn === "AC"
                    ? "bg-rose-100 text-rose-800 hover:bg-rose-200"
                    : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                }`}
              >
                {btn}
              </button>
            ))}

            {["7", "8", "9", "*"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcInput(btn)}
                className={`p-3 rounded-xl active:scale-95 cursor-pointer ${
                  btn === "*" ? "bg-amber-100 text-amber-900 hover:bg-amber-200 font-black" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {btn === "*" ? "×" : btn}
              </button>
            ))}

            {["4", "5", "6", "-"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcInput(btn)}
                className={`p-3 rounded-xl active:scale-95 cursor-pointer ${
                  btn === "-" ? "bg-amber-100 text-amber-900 hover:bg-amber-200 font-black" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {btn}
              </button>
            ))}

            {["1", "2", "3", "+"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcInput(btn)}
                className={`p-3 rounded-xl active:scale-95 cursor-pointer ${
                  btn === "+" ? "bg-amber-100 text-amber-900 hover:bg-amber-200 font-black" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {btn}
              </button>
            ))}

            {["±", "0", ".", "="].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcInput(btn)}
                className={`p-3 rounded-xl active:scale-95 cursor-pointer ${
                  btn === "="
                    ? "bg-emerald-800 text-white font-black text-base shadow-xs hover:bg-emerald-900"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Calculator History Panel */}
          {calcHistory.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700">📜 Calculation History</span>
                <button
                  onClick={() => setCalcHistory([])}
                  className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear History
                </button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto text-xs font-mono text-slate-600">
                {calcHistory.map((item, idx) => (
                  <div key={idx} className="bg-white p-1.5 rounded-lg border border-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: UNIT CONVERTER */}
      {activeToolTab === "unit" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700" /> Multi-Unit Converter
          </h3>

          {/* Unit Category Selector */}
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            {[
              { id: "length", label: "📏 Length" },
              { id: "weight", label: "⚖️ Weight" },
              { id: "volume", label: "🧪 Volume" },
              { id: "speed", label: "🚀 Speed" },
              { id: "temp", label: "🌡️ Temperature" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setUnitCategory(cat.id as any);
                  const firstUnit = unitData[cat.id as keyof typeof unitData][0].symbol;
                  const secondUnit = unitData[cat.id as keyof typeof unitData][1].symbol;
                  setUnitFrom(firstUnit);
                  setUnitTo(secondUnit);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  unitCategory === cat.id
                    ? "bg-emerald-800 text-white font-black"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 text-xs font-semibold text-slate-700">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Value To Convert</label>
              <input
                type="number"
                value={unitVal}
                onChange={(e) => setUnitVal(parseFloat(e.target.value) || 0)}
                className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-2xl p-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">From Unit</label>
                <select
                  value={unitFrom}
                  onChange={(e) => setUnitFrom(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-2xl p-3 font-bold"
                >
                  {unitData[unitCategory].map((u) => (
                    <option key={u.symbol} value={u.symbol}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">To Unit</label>
                <select
                  value={unitTo}
                  onChange={(e) => setUnitTo(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-2xl p-3 font-bold"
                >
                  {unitData[unitCategory].map((u) => (
                    <option key={u.symbol} value={u.symbol}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversion Result Output Box */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-1">
              <span className="text-xs text-emerald-800 font-bold block">Converted Value</span>
              <span className="text-xl font-black text-emerald-900">
                {unitVal} {unitFrom} = {calculateUnitConversion()} {unitTo}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: CURRENCY CONVERTER */}
      {activeToolTab === "currency" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-700" /> Live Currency Exchange
            </h3>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              Live Rates Reference
            </span>
          </div>

          <div className="space-y-3 text-xs font-semibold text-slate-700">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Amount</label>
              <input
                type="number"
                value={currVal}
                onChange={(e) => setCurrVal(parseFloat(e.target.value) || 0)}
                className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-2xl p-3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 block mb-1">From Currency</label>
                <select
                  value={currFrom}
                  onChange={(e) => setCurrFrom(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-2xl p-3 font-bold"
                >
                  {Object.keys(currencyRates).map((c) => (
                    <option key={c} value={c}>
                      {c} - {currencyRates[c].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center pt-2 sm:pt-4">
                <button
                  onClick={handleSwapCurrency}
                  className="p-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full cursor-pointer transition-transform active:rotate-180"
                  title="Swap Currencies"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 block mb-1">To Currency</label>
                <select
                  value={currTo}
                  onChange={(e) => setCurrTo(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-2xl p-3 font-bold"
                >
                  {Object.keys(currencyRates).map((c) => (
                    <option key={c} value={c}>
                      {c} - {currencyRates[c].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-1 shadow-2xs">
              <span className="text-xs text-emerald-800 font-bold block">Converted Output</span>
              <span className="text-xl font-black text-emerald-900">
                {currencyRates[currFrom]?.symbol} {currVal} {currFrom} = {currencyRates[currTo]?.symbol}{" "}
                {calculateCurrency()} {currTo}
              </span>
              <p className="text-[10px] text-slate-400 italic">Rates updated for reference standard.</p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: EMI CALCULATOR */}
      {activeToolTab === "emi" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-700" /> Loan EMI Calculator
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Loan Amount ($ / Rs.)</label>
              <input
                type="number"
                value={emiAmount}
                onChange={(e) => setEmiAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Interest Rate (% p.a.)</label>
              <input
                type="number"
                value={emiRate}
                onChange={(e) => setEmiRate(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Loan Tenure (Years)</label>
              <input
                type="number"
                value={emiTenure}
                onChange={(e) => setEmiTenure(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 block">Monthly EMI</span>
              <span className="text-lg font-black text-emerald-900">Rs. {emiRes.monthlyEMI.toLocaleString()}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 block">Total Interest</span>
              <span className="text-lg font-black text-amber-800">Rs. {emiRes.totalInterest.toLocaleString()}</span>
            </div>
            <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 block">Total Payment</span>
              <span className="text-lg font-black text-slate-900">Rs. {emiRes.totalPayment.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setShowAmortization(!showAmortization)}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
          >
            {showAmortization ? "Hide Amortization Schedule" : "📊 View Amortization Schedule"}
          </button>

          {showAmortization && (
            <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 rounded-2xl p-2 text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-600">
                    <th className="p-2">Month</th>
                    <th className="p-2">EMI</th>
                    <th className="p-2">Principal</th>
                    <th className="p-2">Interest</th>
                    <th className="p-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {emiRes.schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50">
                      <td className="p-2 font-bold">{row.month}</td>
                      <td className="p-2">Rs. {row.emi}</td>
                      <td className="p-2 text-emerald-700">Rs. {row.principal}</td>
                      <td className="p-2 text-amber-700">Rs. {row.interest}</td>
                      <td className="p-2 text-right font-extrabold">Rs. {row.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TOOL 5: SIP CALCULATOR */}
      {activeToolTab === "sip" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700" /> Systematic Investment Plan (SIP) Calculator
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Monthly Investment ($ / Rs.)</label>
              <input
                type="number"
                value={sipMonthly}
                onChange={(e) => setSipMonthly(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Expected Return (% p.a.)</label>
              <input
                type="number"
                value={sipReturnRate}
                onChange={(e) => setSipReturnRate(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Time Period (Years)</label>
              <input
                type="number"
                value={sipTenure}
                onChange={(e) => setSipTenure(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 block">Expected Future Value</span>
              <span className="text-lg font-black text-emerald-900">Rs. {sipRes.futureValue.toLocaleString()}</span>
            </div>
            <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 block">Total Invested</span>
              <span className="text-lg font-black text-slate-900">Rs. {sipRes.totalInvested.toLocaleString()}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 block">Estimated Returns</span>
              <span className="text-lg font-black text-amber-800">Rs. {sipRes.totalReturns.toLocaleString()}</span>
            </div>
          </div>

          {/* Yearly Growth Table */}
          <div className="space-y-2 border border-slate-200 rounded-2xl p-3 text-xs">
            <h4 className="font-black text-slate-800">📈 Yearly Investment Growth Breakdown</h4>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-600">
                    <th className="p-2">Year</th>
                    <th className="p-2">Invested</th>
                    <th className="p-2">Returns</th>
                    <th className="p-2 text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {sipRes.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50">
                      <td className="p-2 font-bold">Year {row.year}</td>
                      <td className="p-2">Rs. {row.invested.toLocaleString()}</td>
                      <td className="p-2 text-amber-700">Rs. {row.returns.toLocaleString()}</td>
                      <td className="p-2 text-right font-extrabold text-emerald-800">
                        Rs. {row.totalValue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 6: CALENDAR CONVERTER (AD ↔ BS) */}
      {activeToolTab === "calendar" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-700" /> Gregorian (AD) ↔ Bikram Sambat (BS) Calendar Converter
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AD → BS Panel */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
              <h4 className="font-black text-emerald-900">Gregorian AD → Bikram Sambat BS</h4>
              <label className="font-bold text-slate-600 block">Select AD Date</label>
              <input
                type="date"
                value={adDateInput}
                onChange={(e) => setAdDateInput(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
              />
              <div className="bg-emerald-100 border border-emerald-300 p-2.5 rounded-xl text-center mt-2">
                <span className="text-[10px] text-emerald-800 font-bold block">Equivalent Bikram Sambat (BS)</span>
                <span className="text-sm font-black text-emerald-950">{convertAdToBsApprox(adDateInput)}</span>
              </div>
            </div>

            {/* BS → AD Panel */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
              <h4 className="font-black text-emerald-900">Bikram Sambat BS → Gregorian AD</h4>
              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Year</label>
                  <input
                    type="number"
                    value={bsYearInput}
                    onChange={(e) => setBsYearInput(Number(e.target.value))}
                    className="w-full p-2 bg-white border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Month</label>
                  <select
                    value={bsMonthInput}
                    onChange={(e) => setBsMonthInput(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl font-bold text-xs"
                  >
                    {nepaliMonthsList.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Day</label>
                  <input
                    type="number"
                    value={bsDayInput}
                    onChange={(e) => setBsDayInput(Number(e.target.value))}
                    className="w-full p-2 bg-white border rounded-xl font-bold"
                  />
                </div>
              </div>
              <div className="bg-emerald-100 border border-emerald-300 p-2.5 rounded-xl text-center mt-2">
                <span className="text-[10px] text-emerald-800 font-bold block">Equivalent Gregorian Date (AD)</span>
                <span className="text-sm font-black text-emerald-950">
                  {convertBsToAdApprox(bsYearInput, bsMonthInput, bsDayInput)}
                </span>
              </div>
            </div>
          </div>

          {/* Days Between Counter */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2 text-xs">
            <h4 className="font-black text-emerald-900">⏳ Days Between Dates Calculator</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-600 block">Start Date</label>
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="w-full p-2 bg-white border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block">End Date</label>
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="w-full p-2 bg-white border rounded-xl font-bold"
                />
              </div>
            </div>
            <div className="text-center font-extrabold text-emerald-900 text-sm pt-1">
              Difference: <strong className="text-emerald-700 text-base">{calculateDaysBetween()} Days</strong> apart
            </div>
          </div>
        </div>
      )}

      {/* TOOL 7: COMPASS */}
      {activeToolTab === "compass" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs text-center">
          <h3 className="text-sm font-black text-slate-900 flex items-center justify-center gap-2">
            <CompassIcon className="w-4 h-4 text-emerald-700" /> Digital Orienting Compass
          </h3>

          <div className="relative w-48 h-48 mx-auto border-4 border-emerald-800 rounded-full flex items-center justify-center bg-slate-950 text-white shadow-lg">
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${-compassHeading}deg)` }}
            >
              {/* Compass Needle */}
              <div className="w-1.5 h-36 bg-gradient-to-b from-rose-500 via-white to-emerald-500 rounded-full" />
              <span className="absolute top-2 font-black text-rose-500 text-xs">N</span>
              <span className="absolute bottom-2 font-black text-emerald-400 text-xs">S</span>
              <span className="absolute right-2 font-black text-white text-xs">E</span>
              <span className="absolute left-2 font-black text-white text-xs">W</span>
            </div>
            <div className="z-10 bg-slate-900/90 px-3 py-1.5 rounded-2xl border border-emerald-500 text-center">
              <span className="text-lg font-black text-emerald-400 block">{compassHeading}°</span>
              <span className="text-[10px] font-bold text-emerald-200 uppercase">
                {getCardinalDirection(compassHeading)}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCompassActive(!compassActive)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl cursor-pointer"
            >
              {compassActive ? "Pause Sensor" : "Start Live Heading"}
            </button>
            <button
              onClick={() => {
                setCompassHeading(Math.floor(Math.random() * 360));
                notify("Compass Calibrated!");
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
            >
              Calibrate Compass
            </button>
          </div>
        </div>
      )}

      {/* TOOL 8: QR SCANNER */}
      {activeToolTab === "qr" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-700" /> QR Code Scanner & Reader
          </h3>

          <div className="relative w-full max-w-sm mx-auto h-52 bg-slate-950 rounded-2xl border-2 border-emerald-600 flex items-center justify-center text-white overflow-hidden shadow-md">
            {qrScanning ? (
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-emerald-300">Scanning Viewfinder Active...</p>
                <div className="w-full h-1 bg-rose-500 absolute top-1/2 animate-pulse" />
              </div>
            ) : (
              <div className="text-center space-y-2 p-4">
                <QrCode className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-slate-300">
                  Align QR Code inside camera frame to scan automatically
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={simulateScan}
              disabled={qrScanning}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              📷 Scan QR Code
            </button>
            <button
              onClick={() => {
                notify("Opened device gallery to import QR image");
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
            >
              🖼️ Upload Gallery QR
            </button>
          </div>

          {qrResult && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">QR Scan Result Payload:</span>
              <p className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-emerald-900 font-extrabold break-all">
                {qrResult}
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(qrResult);
                    notify("Copied QR link to clipboard!");
                  }}
                  className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </button>
                <a
                  href={qrResult}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Link
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 9: TORCH / LIGHT MODE */}
      {activeToolTab === "torch" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs text-center">
          <h3 className="text-sm font-black text-slate-900 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-emerald-700" /> Screen Flashlight & Torch
          </h3>

          <div
            className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
              torchOn
                ? "bg-amber-300 text-slate-950 shadow-[0_0_50px_rgba(252,211,77,0.9)] scale-105"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            <Zap className={`w-16 h-16 ${torchOn ? "animate-bounce" : ""}`} />
          </div>

          <div>
            <button
              onClick={() => setTorchOn(!torchOn)}
              className={`px-6 py-3 rounded-2xl font-black text-xs cursor-pointer shadow-md transition-all ${
                torchOn ? "bg-amber-400 text-slate-950 hover:bg-amber-500" : "bg-emerald-800 text-white hover:bg-emerald-900"
              }`}
            >
              {torchOn ? "🔦 Turn Off Flashlight" : "💡 Turn On Torch"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
