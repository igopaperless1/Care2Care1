import React from "react";
import { designTokens, LAYOUT_GRIDS } from "../../theme/designTokens";

interface UniformWidgetShellProps {
  id?: string;
  type?: string;
  title?: string;
  subtitle?: string;
  gridSpan?: keyof typeof LAYOUT_GRIDS | string;
  isCompact?: boolean;
  isExpanded?: boolean;
  onSettingsClick?: () => void;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const UniformWidgetShell: React.FC<UniformWidgetShellProps> = ({
  id,
  type,
  title,
  subtitle,
  gridSpan = "FULL_WIDTH",
  isCompact = false,
  isExpanded = false,
  onSettingsClick,
  children,
  headerAction,
}) => {
  const spanClass = LAYOUT_GRIDS[gridSpan as keyof typeof LAYOUT_GRIDS] || gridSpan;

  return (
    <div
      id={id ? `widget-shell-${id}` : undefined}
      className={`${spanClass} bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col ${
        isCompact ? "p-3.5 max-h-[380px]" : isExpanded ? "p-6 min-h-[320px]" : "p-5 max-h-[520px]"
      }`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-3.5 shrink-0">
          <div>
            {title && (
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight flex items-center gap-2">
                <span>{title}</span>
              </h3>
            )}
            {subtitle && !isCompact && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {headerAction}
            {onSettingsClick && (
              <button
                type="button"
                onClick={onSettingsClick}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer text-xs"
                title="Widget Settings"
              >
                ⚙️
              </button>
            )}
          </div>
        </div>
      )}

      {/* Widget Content Body with Controlled Scroll Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        {children}
      </div>
    </div>
  );
};
