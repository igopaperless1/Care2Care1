import React, { ReactNode } from "react";
import {
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  Filter,
  Plus,
  RotateCcw,
  Sliders,
  Check,
  LucideIcon
} from "lucide-react";

/* ==========================================================================
   CARE2CARE GLOBAL DESIGN TOKENS (MATCHING TARGET DESIGN SYSTEM SPEC)
   ========================================================================== */

export const CARE_TOKENS = {
  colors: {
    primary: "#FF6A45",          // Warm Coral/Orange
    primaryHover: "#EA580C",
    primarySoft: "#FFEEDB",      // Soft Peach Surface
    primarySoftDark: "#2A1810",
    secondary: "#FFD8C2",
    success: "#22C55E",          // Vibrant Emerald
    successSoft: "#DCFCE7",
    warning: "#F59E0B",          // Amber
    warningSoft: "#FEF3C7",
    danger: "#EF4444",           // Coral Red
    dangerSoft: "#FEE2E2",
    info: "#3B82F6",             // Electric Blue
    infoSoft: "#DBEAFE",
    textPrimary: "#0F172A",      // Dark Navy/Slate
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    border: "#FDD9CB",
    borderSubtle: "#E2E8F0",
    background: "#FAFAFA",
    backgroundPeach: "#FFF8F5",
    surface: "#FFFFFF",
    surfaceDark: "#0F172A"
  },
  radius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    pill: "rounded-full"
  }
};

/* ==========================================================================
   1. BUTTONS (PRIMARY, SECONDARY, TERTIARY, ICON BUTTON, CHIP)
   ========================================================================== */

interface CareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  icon?: LucideIcon | ReactNode;
  iconRight?: LucideIcon | ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const CareButton: React.FC<CareButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: "bg-[#FF6A45] hover:bg-[#EA580C] active:bg-[#C2410C] text-white shadow-xs border border-transparent",
    secondary: "bg-[#FFEEDB] dark:bg-orange-950/60 hover:bg-[#FDD9CB] dark:hover:bg-orange-900/60 text-[#C2410C] dark:text-orange-300 border border-[#FDD9CB] dark:border-orange-800",
    tertiary: "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs",
    outline: "bg-transparent hover:bg-orange-50 dark:hover:bg-orange-950/30 text-[#FF6A45] dark:text-orange-400 border border-[#FF6A45]",
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent",
    danger: "bg-[#EF4444] hover:bg-red-700 text-white shadow-xs border border-transparent",
    success: "bg-[#22C55E] hover:bg-emerald-700 text-white shadow-xs border border-transparent",
  };

  const sizeStyles = {
    xs: "px-2.5 py-1 text-[11px] h-7 rounded-lg gap-1.5",
    sm: "px-3.5 py-1.5 text-xs h-9 rounded-xl gap-1.5 font-black",
    md: "px-5 py-2.5 text-xs sm:text-sm h-11 rounded-2xl gap-2 font-black",
    lg: "px-6 py-3 text-sm sm:text-base h-12 rounded-2xl gap-2 font-black",
  };

  const renderIcon = (iconItem: any) => {
    if (!iconItem) return null;
    if (typeof iconItem === "function") {
      const Comp = iconItem;
      return <Comp className="w-4 h-4 shrink-0" />;
    }
    return iconItem;
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-black transition-all cursor-pointer select-none whitespace-nowrap active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        renderIcon(Icon)
      )}
      {children && <span>{children}</span>}
      {!isLoading && renderIcon(IconRight)}
    </button>
  );
};

/* Icon Circular Action Button */
interface CareIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon | ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const CareIconButton: React.FC<CareIconButtonProps> = ({
  icon: Icon,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  const variantMap = {
    primary: "bg-[#FF6A45] hover:bg-[#EA580C] text-white shadow-xs",
    secondary: "bg-[#FFEEDB] hover:bg-[#FDD9CB] text-[#C2410C] border border-[#FDD9CB]",
    outline: "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
  };

  return (
    <button
      type="button"
      className={`rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      {...props}
    >
      {typeof Icon === "function" ? React.createElement(Icon, { className: "w-5 h-5" }) : Icon}
    </button>
  );
};

/* Chip Filter / Toggle */
interface CareChipProps {
  label: string;
  icon?: LucideIcon | ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  count?: number | string;
}

export const CareChip: React.FC<CareChipProps> = ({
  label,
  icon: Icon,
  isActive = false,
  onClick,
  count
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap select-none ${
        isActive
          ? "bg-[#FF6A45] text-white shadow-xs border border-[#EA580C]"
          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300"
      }`}
    >
      {Icon && (typeof Icon === "function" ? React.createElement(Icon, { className: "w-3.5 h-3.5" }) : Icon)}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
          {count}
        </span>
      )}
    </button>
  );
};

/* ==========================================================================
   2. CARDS (DEFAULT, ELEVATED, OUTLINE, FOCUS CARD)
   ========================================================================== */

interface CareCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  headerAction?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  isHoverable?: boolean;
  variant?: "default" | "elevated" | "outline" | "peach";
}

export const CareCard: React.FC<CareCardProps> = ({
  children,
  className = "",
  title,
  subtitle,
  icon,
  headerAction,
  footer,
  onClick,
  isHoverable = false,
  variant = "default"
}) => {
  const variantStyles = {
    default: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs",
    elevated: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md",
    outline: "bg-transparent border border-slate-300 dark:border-slate-700",
    peach: "bg-[#FFF8F5] dark:bg-[#1E1715] border border-[#FFE2D6] dark:border-[#3D2821] shadow-2xs"
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-4 sm:p-5 transition-all ${variantStyles[variant]} ${
        isHoverable || onClick ? "hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md cursor-pointer" : ""
      } ${className}`}
    >
      {(title || icon || headerAction) && (
        <div className="flex items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && <div className="text-[#FF6A45] shrink-0">{icon}</div>}
            <div className="min-w-0">
              {title && <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">{title}</h3>}
              {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};

/* Focus Card (Warm Peach Hero Card) */
interface CareFocusCardProps {
  title: string;
  subtitle: string;
  metricLabel: string;
  metricCurrent: string | number;
  metricTarget: string | number;
  progressPercent: number;
  icon?: ReactNode;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const CareFocusCard: React.FC<CareFocusCardProps> = ({
  title,
  subtitle,
  metricLabel,
  metricCurrent,
  metricTarget,
  progressPercent,
  icon,
  actionButton
}) => {
  return (
    <div className="bg-gradient-to-br from-[#FFEEDB] via-[#FFF3EC] to-[#FFE6D8] dark:from-orange-950/60 dark:via-slate-900 dark:to-orange-950/40 border border-[#FDD9CB] dark:border-orange-900/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-orange-400">
            Today's Focus
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            {subtitle}
          </p>
        </div>

        {icon && (
          <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs flex items-center justify-center text-3xl shadow-xs shrink-0 border border-orange-100 dark:border-orange-900">
            {icon}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-700 dark:text-slate-300">{metricLabel}</span>
          <span className="text-[#C2410C] dark:text-orange-400 font-black">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-white/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-orange-200 dark:border-orange-900">
          <div
            className="h-full bg-gradient-to-r from-[#FF6A45] to-[#FB923C] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>

      {actionButton && (
        <button
          type="button"
          onClick={actionButton.onClick}
          className="w-full py-3 bg-[#FF6A45] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm rounded-2xl shadow-xs transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{actionButton.label}</span>
        </button>
      )}
    </div>
  );
};

/* ==========================================================================
   3. INPUTS & FORM CONTROLS (INPUT, SELECT, TOGGLE, DATEPICKER)
   ========================================================================== */

interface CareInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: LucideIcon | ReactNode;
}

export const CareInput: React.FC<CareInputProps> = ({
  label,
  helperText,
  error,
  icon: Icon,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || (label ? `care-input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-black text-slate-700 dark:text-slate-300">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-2xl shadow-2xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {typeof Icon === "function" ? React.createElement(Icon, { className: "w-4 h-4" }) : Icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-slate-50 dark:bg-slate-850 border text-slate-900 dark:text-white rounded-2xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF6A45] placeholder:text-slate-400 ${
            Icon ? "pl-10 pr-3.5 py-2.5" : "px-3.5 py-2.5"
          } ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-200 dark:border-slate-700"
          } ${className}`}
          {...props}
        />
      </div>

      {error && <p className="text-[11px] font-bold text-rose-500">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};

interface CareSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const CareSelect: React.FC<CareSelectProps> = ({
  label,
  helperText,
  error,
  options,
  className = "",
  id,
  ...props
}) => {
  const selectId = id || (label ? `care-select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-black text-slate-700 dark:text-slate-300">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <select
        id={selectId}
        className={`w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-xs sm:text-sm px-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF6A45] cursor-pointer ${
          error ? "border-rose-400" : ""
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-[11px] font-bold text-rose-500">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};

/* Toggle Switch */
interface CareToggleProps {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export const CareToggle: React.FC<CareToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  id
}) => {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      {(label || description) && (
        <div>
          {label && <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{label}</p>}
          {description && <p className="text-[11px] text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-[#22C55E]" : "bg-slate-200 dark:bg-slate-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

/* ==========================================================================
   4. STAT TILES & BADGES
   ========================================================================== */

interface CareStatTileProps {
  label: string;
  value: string | number;
  icon?: LucideIcon | ReactNode;
  subtitle?: string;
  trend?: { value: string; isPositive?: boolean };
  accentColor?: "orange" | "emerald" | "blue" | "indigo" | "amber" | "rose" | "purple";
  onClick?: () => void;
}

export const CareStatTile: React.FC<CareStatTileProps> = ({
  label,
  value,
  icon: Icon,
  subtitle,
  trend,
  accentColor = "orange",
  onClick,
}) => {
  const colors = {
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200/60 dark:border-orange-800",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800",
    blue: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200/60 dark:border-sky-800",
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800",
    amber: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200/60 dark:border-rose-800",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/60 dark:border-purple-800",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-2xs flex flex-col justify-between transition-all ${
        onClick ? "hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
          {label}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border shrink-0 ${colors[accentColor]}`}>
            {typeof Icon === "function" ? React.createElement(Icon, { className: "w-4 h-4" }) : Icon}
          </div>
        )}
      </div>

      <div className="mt-2.5">
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {trend && (
              <span
                className={`font-black ${
                  trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {trend.value}
              </span>
            )}
            {subtitle && <span className="truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

/* Badge */
interface CareBadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "orange";
  size?: "sm" | "md";
}

export const CareBadge: React.FC<CareBadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
}) => {
  const variants = {
    orange: "bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-300/40",
    success: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300/40",
    warning: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300/40",
    danger: "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300/40",
    info: "bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300/40",
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={`inline-flex items-center gap-1 font-black rounded-full border tracking-wide uppercase ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

/* Empty State */
interface CareEmptyStateProps {
  icon: string | LucideIcon | ReactNode;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export const CareEmptyState: React.FC<CareEmptyStateProps> = ({
  icon,
  title,
  description,
  actionButton,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-slate-800 flex items-center justify-center text-3xl text-orange-500">
        {typeof icon === "string" ? (
          <span>{icon}</span>
        ) : typeof icon === "function" ? (
          React.createElement(icon, { className: "w-7 h-7 text-orange-500" })
        ) : (
          icon
        )}
      </div>
      <div className="max-w-sm space-y-1">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {actionButton && (
        <CareButton
          variant="primary"
          size="sm"
          onClick={actionButton.onClick}
          icon={actionButton.icon}
          className="mt-2"
        >
          {actionButton.label}
        </CareButton>
      )}
    </div>
  );
};
