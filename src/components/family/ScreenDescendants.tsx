import React from "react";
import { Users, ChevronRight, Heart, Calendar } from "lucide-react";
import { FamilyMember } from "./types";

interface ScreenDescendantsProps {
  members: FamilyMember[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
  onOpenMemberDetail: (member: FamilyMember) => void;
}

export const ScreenDescendants: React.FC<ScreenDescendantsProps> = ({
  members,
  selectedMemberId,
  onSelectMember,
  onOpenMemberDetail
}) => {
  const root = members.find((m) => m.id === selectedMemberId) || members.find((m) => m.isSelf) || members[0];
  const children = members.filter((m) => m.fatherId === root?.id || m.motherId === root?.id);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Descendants Branch View</h2>
            <p className="text-xs text-slate-500">Downward lineage tree showing offspring, children & future generations</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-orange-100/90 shadow-2xs space-y-6">
        {/* Parent Node */}
        <div className="p-4 bg-orange-50/40 rounded-3xl border border-orange-200/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={root?.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
              alt={root?.firstName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-2xl object-cover border border-orange-300"
            />
            <div>
              <h3 className="text-sm font-black text-slate-900">{root?.firstName} {root?.lastName}</h3>
              <p className="text-xs text-slate-500">Root Progenitor • Born {root?.dateOfBirth}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => root && onOpenMemberDetail(root)}
            className="px-3 py-1.5 bg-[#FF5A36] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Profile
          </button>
        </div>

        {/* Children List */}
        <div className="space-y-3 pl-4 border-l-2 border-orange-300">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Offspring ({children.length})</h4>
          {children.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No direct children recorded for this member.</p>
          ) : (
            children.map((child) => {
              const grandChildren = members.filter((m) => m.fatherId === child.id || m.motherId === child.id);
              return (
                <div key={child.id} className="space-y-3">
                  <div
                    onClick={() => onSelectMember(child.id)}
                    className="p-3.5 bg-white hover:bg-orange-50/50 rounded-2xl border border-orange-200 shadow-2xs flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={child.profilePhoto || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80"}
                        alt={child.firstName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-orange-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{child.firstName} {child.lastName}</div>
                        <div className="text-[10px] text-slate-500">{child.gender} • Born {child.dateOfBirth}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenMemberDetail(child);
                      }}
                      className="p-1.5 text-slate-400 hover:text-[#FF5A36] rounded-xl hover:bg-orange-100 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Grandchildren if any */}
                  {grandChildren.length > 0 && (
                    <div className="pl-6 border-l-2 border-orange-200 space-y-2">
                      {grandChildren.map((gc) => (
                        <div
                          key={gc.id}
                          onClick={() => onSelectMember(gc.id)}
                          className="p-2.5 bg-orange-50/30 rounded-xl border border-orange-100 text-xs font-medium text-slate-800 flex items-center justify-between cursor-pointer hover:bg-orange-100/50"
                        >
                          <span>{gc.firstName} {gc.lastName} (Grandchild)</span>
                          <span className="text-[10px] text-slate-400">{gc.dateOfBirth}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
