import React, { useState, useEffect } from "react";
import { Patient } from "../types";
import { FamilyTab, FamilyMember, GuruProfile, GuruMataProfile, SpiritualEvent, DiscipleRecord, FastingRule, FamilyDocumentMedia } from "./family/types";
import {
  INITIAL_FAMILY_MEMBERS,
  INITIAL_GURU_PROFILE,
  INITIAL_GURU_MATA_PROFILE,
  INITIAL_SPIRITUAL_EVENTS,
  INITIAL_DISCIPLES,
  INITIAL_FASTING_RULES,
  INITIAL_DOCUMENTS_MEDIA
} from "./family/mockData";
import { FamilyHeader } from "./family/FamilyHeader";
import { FamilyNavScroll } from "./family/FamilyNavScroll";
import { ScreenInteractiveTree } from "./family/ScreenInteractiveTree";
import { ScreenPedigree } from "./family/ScreenPedigree";
import { ScreenDescendants } from "./family/ScreenDescendants";
import { ScreenFanChart } from "./family/ScreenFanChart";
import { ScreenTimeline } from "./family/ScreenTimeline";
import { ScreenMembersDirectory } from "./family/ScreenMembersDirectory";
import { ScreenGuruProfile } from "./family/ScreenGuruProfile";
import { ScreenGuruDetails } from "./family/ScreenGuruDetails";
import { ScreenSpiritualDiscipleship } from "./family/ScreenSpiritualDiscipleship";
import { ScreenFamilySpiritualLink } from "./family/ScreenFamilySpiritualLink";
import { ScreenEventsRituals } from "./family/ScreenEventsRituals";
import { ScreenTithisShraddha } from "./family/ScreenTithisShraddha";
import { ScreenDisciples } from "./family/ScreenDisciples";
import { ScreenFastingObservances } from "./family/ScreenFastingObservances";
import { ScreenDocumentsMedia } from "./family/ScreenDocumentsMedia";
import { ScreenNotesInstructions } from "./family/ScreenNotesInstructions";
import { ScreenGenealogyStats } from "./family/ScreenGenealogyStats";
import { ScreenExportBackup } from "./family/ScreenExportBackup";
import { MemberModal } from "./family/MemberModal";
import { AddEventModal } from "./family/AddEventModal";

interface FamilyTreeServiceProps {
  patient?: Patient;
  onBack?: () => void;
}

export const FamilyTreeService: React.FC<FamilyTreeServiceProps> = ({ patient, onBack }) => {
  const [currentTab, setCurrentTab] = useState<FamilyTab>("interactive_tree");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("mem-self");

  // Local storage state initialization with fallbacks
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem("sacred_family_members");
      return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
    } catch {
      return INITIAL_FAMILY_MEMBERS;
    }
  });

  const [guruProfile, setGuruProfile] = useState<GuruProfile>(() => {
    try {
      const saved = localStorage.getItem("sacred_guru_profile");
      return saved ? JSON.parse(saved) : INITIAL_GURU_PROFILE;
    } catch {
      return INITIAL_GURU_PROFILE;
    }
  });

  const [guruMataProfile, setGuruMataProfile] = useState<GuruMataProfile>(() => {
    try {
      const saved = localStorage.getItem("sacred_guru_mata_profile");
      return saved ? JSON.parse(saved) : INITIAL_GURU_MATA_PROFILE;
    } catch {
      return INITIAL_GURU_MATA_PROFILE;
    }
  });

  const [events, setEvents] = useState<SpiritualEvent[]>(() => {
    try {
      const saved = localStorage.getItem("sacred_spiritual_events");
      return saved ? JSON.parse(saved) : INITIAL_SPIRITUAL_EVENTS;
    } catch {
      return INITIAL_SPIRITUAL_EVENTS;
    }
  });

  const [disciples, setDisciples] = useState<DiscipleRecord[]>(() => {
    try {
      const saved = localStorage.getItem("sacred_disciples");
      return saved ? JSON.parse(saved) : INITIAL_DISCIPLES;
    } catch {
      return INITIAL_DISCIPLES;
    }
  });

  const [fastingRules, setFastingRules] = useState<FastingRule[]>(() => {
    try {
      const saved = localStorage.getItem("sacred_fasting_rules");
      return saved ? JSON.parse(saved) : INITIAL_FASTING_RULES;
    } catch {
      return INITIAL_FASTING_RULES;
    }
  });

  const [documents, setDocuments] = useState<FamilyDocumentMedia[]>(() => {
    try {
      const saved = localStorage.getItem("sacred_documents_media");
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS_MEDIA;
    } catch {
      return INITIAL_DOCUMENTS_MEDIA;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("sacred_family_members", JSON.stringify(members));
    } catch (e) {
      console.error(e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem("sacred_guru_profile", JSON.stringify(guruProfile));
    } catch (e) {
      console.error(e);
    }
  }, [guruProfile]);

  useEffect(() => {
    try {
      localStorage.setItem("sacred_guru_mata_profile", JSON.stringify(guruMataProfile));
    } catch (e) {
      console.error(e);
    }
  }, [guruMataProfile]);

  useEffect(() => {
    try {
      localStorage.setItem("sacred_spiritual_events", JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem("sacred_disciples", JSON.stringify(disciples));
    } catch (e) {
      console.error(e);
    }
  }, [disciples]);

  useEffect(() => {
    try {
      localStorage.setItem("sacred_documents_media", JSON.stringify(documents));
    } catch (e) {
      console.error(e);
    }
  }, [documents]);

  // Modal States
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // Handlers
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setShowMemberModal(true);
  };

  const handleOpenMemberDetail = (member: FamilyMember) => {
    setEditingMember(member);
    setShowMemberModal(true);
  };

  const handleSaveMember = (member: FamilyMember) => {
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === member.id);
      if (exists) {
        return prev.map((m) => (m.id === member.id ? member : m));
      }
      return [member, ...prev];
    });
    setSelectedMemberId(member.id);
    setShowMemberModal(false);
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (selectedMemberId === id) {
      setSelectedMemberId("mem-self");
    }
  };

  const handleAddEvent = (evt: SpiritualEvent) => {
    setEvents((prev) => [evt, ...prev]);
    setShowAddEventModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddDisciple = (d: DiscipleRecord) => {
    setDisciples((prev) => [d, ...prev]);
  };

  const handleDeleteDisciple = (id: string) => {
    setDisciples((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddDocument = (doc: FamilyDocumentMedia) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleResetDefaultData = () => {
    setMembers(INITIAL_FAMILY_MEMBERS);
    setGuruProfile(INITIAL_GURU_PROFILE);
    setGuruMataProfile(INITIAL_GURU_MATA_PROFILE);
    setEvents(INITIAL_SPIRITUAL_EVENTS);
    setDisciples(INITIAL_DISCIPLES);
    setFastingRules(INITIAL_FASTING_RULES);
    setDocuments(INITIAL_DOCUMENTS_MEDIA);
    setSelectedMemberId("mem-self");
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-800 pb-20 selection:bg-orange-200 selection:text-orange-900">
      {/* 1. Master Sticky Header */}
      <FamilyHeader
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        guruProfile={guruProfile}
        totalMembers={members.length}
        activeGenerations={4}
        upcomingRitualsCount={events.length}
        onOpenAddMember={handleOpenAddMember}
        onBack={onBack}
      />

      {/* 2. Scrolling Navigation Menu Bar */}
      <FamilyNavScroll
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        totalMembersCount={members.length}
        upcomingEventsCount={events.length}
        totalDisciplesCount={disciples.length}
      />

      {/* 3. Main Screen View Switcher */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-5">
        {currentTab === "interactive_tree" && (
          <ScreenInteractiveTree
            members={members}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
            onOpenAddMember={handleOpenAddMember}
            onOpenMemberDetail={handleOpenMemberDetail}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "pedigree" && (
          <ScreenPedigree
            members={members}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
            onOpenMemberDetail={handleOpenMemberDetail}
          />
        )}

        {currentTab === "descendant" && (
          <ScreenDescendants
            members={members}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
            onOpenMemberDetail={handleOpenMemberDetail}
          />
        )}

        {currentTab === "fan_chart" && (
          <ScreenFanChart
            members={members}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
            onOpenMemberDetail={handleOpenMemberDetail}
          />
        )}

        {currentTab === "timeline" && (
          <ScreenTimeline
            members={members}
            onSelectMember={setSelectedMemberId}
            onOpenMemberDetail={handleOpenMemberDetail}
          />
        )}

        {currentTab === "members" && (
          <ScreenMembersDirectory
            members={members}
            onSelectMember={setSelectedMemberId}
            onOpenMemberDetail={handleOpenMemberDetail}
            onOpenAddMember={handleOpenAddMember}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {currentTab === "guru_profile" && (
          <ScreenGuruProfile
            profile={guruProfile}
            onUpdateProfile={(up) => setGuruProfile((prev) => ({ ...prev, ...up }))}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "guru_details" && (
          <ScreenGuruDetails
            profile={guruProfile}
            onUpdateProfile={(up) => setGuruProfile((prev) => ({ ...prev, ...up }))}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "spiritual_details" && (
          <ScreenSpiritualDiscipleship
            profile={guruProfile}
            onUpdateProfile={(up) => setGuruProfile((prev) => ({ ...prev, ...up }))}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "family_link" && (
          <ScreenFamilySpiritualLink
            guruProfile={guruProfile}
            guruMataProfile={guruMataProfile}
            onUpdateGuruMata={(up) => setGuruMataProfile((prev) => ({ ...prev, ...up }))}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "events_rituals" && (
          <ScreenEventsRituals
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onNavigate={setCurrentTab}
            onOpenAddEventModal={() => setShowAddEventModal(true)}
          />
        )}

        {currentTab === "janam_tithi" && (
          <ScreenTithisShraddha
            profile={guruProfile}
            onUpdateProfile={(up) => setGuruProfile((prev) => ({ ...prev, ...up }))}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "disciples" && (
          <ScreenDisciples
            disciples={disciples}
            onAddDisciple={handleAddDisciple}
            onDeleteDisciple={handleDeleteDisciple}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "fasting" && (
          <ScreenFastingObservances
            fastingRules={fastingRules}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "documents_media" && (
          <ScreenDocumentsMedia
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "notes_instructions" && (
          <ScreenNotesInstructions
            profile={guruProfile}
            onUpdateProfile={(up) => setGuruProfile((prev) => ({ ...prev, ...up }))}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "analytics" && (
          <ScreenGenealogyStats members={members} />
        )}

        {currentTab === "export_sync" && (
          <ScreenExportBackup
            members={members}
            guruProfile={guruProfile}
            onImportJSON={(imported) => setMembers(imported)}
            onResetDefaultData={handleResetDefaultData}
          />
        )}
      </main>

      {/* 4. Modals */}
      {showMemberModal && (
        <MemberModal
          member={editingMember}
          allMembers={members}
          onSave={handleSaveMember}
          onClose={() => setShowMemberModal(false)}
        />
      )}

      {showAddEventModal && (
        <AddEventModal
          onSave={handleAddEvent}
          onClose={() => setShowAddEventModal(false)}
        />
      )}
    </div>
  );
};
