import React, { useState } from "react";
import { Clock, Calendar, Heart, Award, MapPin, Sparkles, Plus } from "lucide-react";
import { FamilyMember } from "./types";

interface ScreenTimelineProps {
  members: FamilyMember[];
  onSelectMember: (id: string) => void;
  onOpenMemberDetail: (member: FamilyMember) => void;
}

export const ScreenTimeline: React.FC<ScreenTimelineProps> = ({
  members,
  onSelectMember,
  onOpenMemberDetail
}) => {
  // Sort events chronologically from member birth/death dates
  const timelineEvents: {
    id: string;
    year: number;
    title: string;
    description: string;
    type: "birth" | "death" | "milestone";
    member: FamilyMember;
  }[] = [];

  members.forEach((m) => {
    if (m.dateOfBirth) {
      const year = parseInt(m.dateOfBirth.split("-")[0]);
      if (!isNaN(year)) {
        timelineEvents.push({
          id: `birth-${m.id}`,
          year,
          title: `Birth of ${m.firstName} ${m.lastName}`,
          description: `Born on ${m.dateOfBirth} at ${m.placeOfBirth || "Hometown"}`,
          type: "birth",
          member: m
        });
      }
    }
    if (!m.isAlive && m.dateOfDeath) {
      const year = parseInt(m.dateOfDeath.split("-")[0]);
      if (!isNaN(year)) {
        timelineEvents.push({
          id: `death-${m.id}`,
          year,
          title: `Passing of ${m.firstName} ${m.lastName}`,
          description: `Passed into celestial peace on ${m.dateOfDeath} at ${m.placeOfDeath || "Ashram/Home"}`,
          type: "death",
          member: m
        });
      }
    }
  });

  timelineEvents.sort((a, b) => a.year - b.year);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Life Milestones Timeline</h2>
            <p className="text-xs text-slate-500">Chronological history of births, transitions & family milestones across eras</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100/90 shadow-2xs space-y-6">
        <div className="relative pl-6 sm:pl-8 border-l-2 border-orange-200 space-y-6">
          {timelineEvents.map((evt) => {
            const isBirth = evt.type === "birth";
            return (
              <div key={evt.id} className="relative group">
                {/* Dot */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                    isBirth ? "bg-emerald-500" : "bg-purple-600"
                  }`}
                />

                <div
                  onClick={() => onOpenMemberDetail(evt.member)}
                  className="bg-orange-50/40 hover:bg-orange-100/60 p-4 rounded-2xl border border-orange-200/90 transition-all cursor-pointer shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-[#FF5A36] border border-orange-200">
                        {evt.year}
                      </span>
                      <h4 className="text-xs font-black text-slate-900">{evt.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{evt.description}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <img
                      src={evt.member.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                      alt={evt.member.firstName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-xl object-cover border border-orange-200"
                    />
                    <span className="text-[10px] text-[#FF5A36] font-bold">View &rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
