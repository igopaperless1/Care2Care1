// designTokens.ts - Single Source of Truth for Design System
export const designTokens = {
  colors: {
    primary: "emerald",
    primaryHex: "#059669",
    secondaryHex: "#0d9488",
    accentAmber: "#f59e0b",
    lightBg: "#f8fafc",
    darkBg: "#0f172a",
    lightCardBg: "#ffffff",
    darkCardBg: "#1e293b",
    lightBorder: "#e2e8f0",
    darkBorder: "#334155",
    textDark: "#0f172a",
    textLight: "#f8fafc",
    textMuted: "#64748b",
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    body: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    title: "1.5rem", // 24px
  },
  radii: {
    card: "20px",
    pill: "9999px",
    button: "16px",
    input: "12px",
  },
  spacing: {
    cardPadding: "1.25rem", // 20px
    gridGap: "1rem", // 16px
  },
  shadows: {
    card: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
    hover: "0 20px 30px -10px rgba(0, 0, 0, 0.1)",
  },
};

export const LAYOUT_GRIDS = {
  FULL_WIDTH: "col-span-12",
  HALF_WIDTH_ROW: "col-span-12 md:col-span-6",
  THIRD_WIDTH_ROW: "col-span-12 md:col-span-4",
  COMPACT_2X2: "col-span-12 sm:col-span-6 lg:col-span-3",
};
