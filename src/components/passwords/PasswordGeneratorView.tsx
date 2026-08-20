import React, { useState, useEffect, useCallback } from "react";
import {
  Key,
  Copy,
  RefreshCw,
  Check,
  Sliders,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export const PasswordGeneratorView: React.FC = () => {
  const [passwordLength, setPasswordLength] = useState<number>(20);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(true);

  const [generatedPassword, setGeneratedPassword] = useState<string>("K9#pL7@xQ!2mnN$zR8");
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = useCallback(() => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHJKLMNPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijkmnpqrstuvwxyz";
    if (includeNumbers) charset += "23456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~|}{[]:;?><,.-=";

    if (!excludeSimilar) {
      if (includeUppercase) charset += "IO";
      if (includeLowercase) charset += "lo";
      if (includeNumbers) charset += "01";
    }

    if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";

    let result = "";
    const cryptoObj = window.crypto || (window as any).msCrypto;
    if (cryptoObj && cryptoObj.getRandomValues) {
      const values = new Uint32Array(passwordLength);
      cryptoObj.getRandomValues(values);
      for (let i = 0; i < passwordLength; i++) {
        result += charset[values[i] % charset.length];
      }
    } else {
      for (let i = 0; i < passwordLength; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }
    setGeneratedPassword(result);
  }, [
    passwordLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
  ]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthLabel = () => {
    if (passwordLength >= 16 && includeSymbols && includeNumbers) return "Very Strong";
    if (passwordLength >= 12) return "Strong";
    if (passwordLength >= 8) return "Fair";
    return "Weak";
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Password Generator
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Cryptographically secure entropy generator with custom character rules
          </p>
        </div>
      </div>

      {/* GENERATOR CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        {/* PASSWORD OUTPUT DISPLAY */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-wider break-all select-all">
              {generatedPassword}
            </span>
            <button
              onClick={handleCopy}
              className="p-3 rounded-2xl bg-orange-100/80 hover:bg-orange-100 text-[#FF5A36] transition-colors cursor-pointer shrink-0 shadow-2xs"
              title="Copy Password"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Strength Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-700 font-black">{getStrengthLabel()}</span>
              <span className="text-slate-400">{passwordLength} characters</span>
            </div>
            <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF5A36] via-[#FF8B6B] to-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (passwordLength / 24) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* LENGTH SLIDER */}
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-800">
            <span>Password Length</span>
            <span className="text-sm font-black text-[#FF5A36] bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200">
              {passwordLength}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={40}
            value={passwordLength}
            onChange={(e) => setPasswordLength(Number(e.target.value))}
            className="w-full accent-[#FF5A36] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>8 (Minimum)</span>
            <span>20 (Recommended)</span>
            <span>40 (Max)</span>
          </div>
        </div>

        {/* CHARACTER RULE TOGGLES */}
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-2xs space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Include
          </span>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs font-bold text-slate-800">Uppercase (A-Z)</span>
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs font-bold text-slate-800">Lowercase (a-z)</span>
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs font-bold text-slate-800">Numbers (0-9)</span>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs font-bold text-slate-800">Symbols (!@#$%)</span>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-100 pt-2">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Exclude Similar Characters
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                i, l, 1, L, o, 0, O
              </span>
            </div>
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={(e) => setExcludeSimilar(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] cursor-pointer"
            />
          </label>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleCopy}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Password</span>
          </button>

          <button
            onClick={generatePassword}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-orange-50 text-[#FF5A36] border border-orange-200 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate Password</span>
          </button>
        </div>
      </div>
    </div>
  );
};
