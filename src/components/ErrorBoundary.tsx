import React, { ErrorInfo, ReactNode, Key } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
  key?: Key;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Care2Care Uncaught Error Boundary caught:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm my-4 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
            <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {this.props.fallbackTitle || "Service Module Render Issue"}
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
              {this.state.error?.message || "An unexpected issue occurred while displaying this section. Please try resetting or refreshing."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reload Module
            </button>
            <button
              type="button"
              onClick={() => {
                this.handleReset();
                window.location.reload();
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" /> Reset App View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
