import React from "react";

interface ModuleLoadingSkeletonProps {
  moduleName?: string;
}

export const ModuleLoadingSkeleton: React.FC<ModuleLoadingSkeletonProps> = ({ moduleName }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-slate-200 rounded-lg" />
            <div className="h-3 w-64 bg-slate-100 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 bg-slate-200 rounded-xl" />
          <div className="h-9 w-24 bg-emerald-100/60 rounded-xl" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-slate-200 rounded-md" />
              <div className="w-7 h-7 rounded-lg bg-slate-200" />
            </div>
            <div className="h-7 w-28 bg-slate-300 rounded-lg" />
            <div className="h-2 w-full bg-slate-200 rounded-full" />
          </div>
        ))}
      </div>

      {/* Main Content & Tabs Skeleton */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="h-8 w-24 bg-emerald-200/50 rounded-xl" />
          <div className="h-8 w-28 bg-slate-200 rounded-xl" />
          <div className="h-8 w-20 bg-slate-200 rounded-xl" />
          <div className="h-8 w-32 bg-slate-200 rounded-xl" />
        </div>

        {/* Shimmer List Cards */}
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-40 bg-slate-300 rounded-md" />
                  <div className="h-3 w-56 bg-slate-200 rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="h-8 w-20 bg-slate-200 rounded-xl" />
                <div className="h-8 w-24 bg-emerald-200/60 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Syncing {moduleName || "care module"} data with Supabase...</span>
        </div>
        <div className="h-3 w-28 bg-slate-200 rounded-md" />
      </div>
    </div>
  );
};
