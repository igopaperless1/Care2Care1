import React, { useState } from "react";
import {
  Heart,
  Calendar,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Bell,
  Star,
  Trophy,
  BarChart3,
  Quote,
  Gift,
  Sliders,
  Users,
  Plus,
  CheckCircle2,
  Share2
} from "lucide-react";
import { Patient } from "../types";
import {
  LifeDatesTab,
  LifeEventItem,
  LifePerson,
  EventCategory
} from "./lifedates/types";
import {
  INITIAL_EVENTS,
  INITIAL_PEOPLE
} from "./lifedates/data";

import { LifeDatesDashboard } from "./lifedates/LifeDatesDashboard";
import { LifeDatesCalendar } from "./lifedates/LifeDatesCalendar";
import { LifeDatesUpcoming } from "./lifedates/LifeDatesUpcoming";
import { LifeDatesEventDetails } from "./lifedates/LifeDatesEventDetails";
import { LifeDatesMemories } from "./lifedates/LifeDatesMemories";
import { LifeDatesReminders } from "./lifedates/LifeDatesReminders";
import { LifeDatesCategories } from "./lifedates/LifeDatesCategories";
import { LifeDatesCoupleGoals } from "./lifedates/LifeDatesCoupleGoals";
import { LifeDatesAnalytics } from "./lifedates/LifeDatesAnalytics";
import { LifeDatesQuotes } from "./lifedates/LifeDatesQuotes";
import { LifeDatesGiftIdeas } from "./lifedates/LifeDatesGiftIdeas";
import { LifeDatesSettings } from "./lifedates/LifeDatesSettings";
import { LifeDatesPeople } from "./lifedates/LifeDatesPeople";
import { LifeDatesAddEventModal } from "./lifedates/LifeDatesAddEventModal";

interface LifeDatesTrackerProps {
  patient?: Patient;
}

export const LifeDatesTracker: React.FC<LifeDatesTrackerProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<LifeDatesTab>("dashboard");
  const [events, setEvents] = useState<LifeEventItem[]>(INITIAL_EVENTS);
  const [people, setPeople] = useState<LifePerson[]>(INITIAL_PEOPLE);
  const [selectedEvent, setSelectedEvent] = useState<LifeEventItem>(INITIAL_EVENTS[0]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LifeEventItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const navMenuItems: Array<{ id: LifeDatesTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: Heart },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "upcoming", label: "Upcoming", icon: Clock },
    { id: "event_details", label: "Event Details", icon: Sparkles },
    { id: "memories", label: "Memories", icon: ImageIcon },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "categories", label: "Categories", icon: Star },
    { id: "couple_goals", label: "Couple Goals", icon: Trophy },
    { id: "analytics", label: "Analytics & Insights", icon: BarChart3 },
    { id: "quotes", label: "Quotes", icon: Quote },
    { id: "gift_ideas", label: "Gift Ideas", icon: Gift },
    { id: "people", label: "Loved Ones", icon: Users },
    { id: "settings", label: "Settings", icon: Sliders },
  ];

  const handleSelectEvent = (event: LifeEventItem) => {
    setSelectedEvent(event);
    setActiveTab("event_details");
  };

  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setIsAddEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: LifeEventItem) => {
    setEditingEvent(evt);
    setIsAddEventModalOpen(true);
  };

  const handleSaveEvent = (savedEvent: LifeEventItem) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === savedEvent.id);
      if (exists) {
        return prev.map((e) => (e.id === savedEvent.id ? savedEvent : e));
      }
      return [savedEvent, ...prev];
    });
    setSelectedEvent(savedEvent);
    showToast(editingEvent ? "Event updated successfully." : "New event added to calendar.");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast("Event deleted.");
    setActiveTab("upcoming");
  };

  const handleAddPerson = (newPerson: LifePerson) => {
    setPeople((prev) => [...prev, newPerson]);
    showToast(`${newPerson.name} added to your family circle.`);
  };

  const handleDeletePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    showToast("Person removed.");
  };

  const handleShareEvent = (evt: LifeEventItem) => {
    if (navigator.share) {
      navigator
        .share({
          title: evt.title,
          text: `Celebrating ${evt.title} on ${evt.date}! Countdown: ${evt.daysLeft} days left.`,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`Celebrating ${evt.title} on ${evt.date}! Countdown: ${evt.daysLeft} days left.`);
      showToast("Celebration invitation copied to clipboard!");
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#FF5A36] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-black animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER IN WATER COLOR THEME */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Life Dates Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">Anniversaries & Milestones</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Life Events, Memories & Celebrations
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddEvent}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SCROLLING PILL BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border whitespace-nowrap ${
                isActive
                  ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                  : "bg-[#FFF9F5] hover:bg-[#FFF2EB] text-slate-700 border-orange-200/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE SCREEN RENDERING */}
      {activeTab === "dashboard" && (
        <LifeDatesDashboard
          onNavigate={(tab) => setActiveTab(tab)}
          onSelectEvent={handleSelectEvent}
          onAddNewEvent={handleOpenAddEvent}
          events={events}
          userName={patient?.name ? patient.name.split(" ")[0] : "Roshan"}
        />
      )}

      {activeTab === "calendar" && (
        <LifeDatesCalendar
          events={events}
          onSelectEvent={handleSelectEvent}
          onAddNewEvent={handleOpenAddEvent}
        />
      )}

      {activeTab === "upcoming" && (
        <LifeDatesUpcoming
          events={events}
          onSelectEvent={handleSelectEvent}
          onAddNewEvent={handleOpenAddEvent}
        />
      )}

      {activeTab === "event_details" && (
        <LifeDatesEventDetails
          event={selectedEvent}
          onBack={() => setActiveTab("dashboard")}
          onEdit={handleOpenEditEvent}
          onDelete={handleDeleteEvent}
          onShare={handleShareEvent}
          onAddMemory={(eventId) => {
            setActiveTab("memories");
            showToast("Opening memories gallery.");
          }}
        />
      )}

      {activeTab === "memories" && <LifeDatesMemories />}

      {activeTab === "reminders" && (
        <LifeDatesReminders onOpenSettings={() => setActiveTab("settings")} />
      )}

      {activeTab === "categories" && (
        <LifeDatesCategories
          onSelectCategory={(catName) => {
            showToast(`Filtering by ${catName}`);
            setActiveTab("upcoming");
          }}
          onNavigate={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === "couple_goals" && <LifeDatesCoupleGoals />}

      {activeTab === "analytics" && <LifeDatesAnalytics events={events} />}

      {activeTab === "quotes" && <LifeDatesQuotes />}

      {activeTab === "gift_ideas" && <LifeDatesGiftIdeas />}

      {activeTab === "people" && (
        <LifeDatesPeople
          people={people}
          onAddPerson={handleAddPerson}
          onDeletePerson={handleDeletePerson}
        />
      )}

      {activeTab === "settings" && <LifeDatesSettings />}

      {/* ADD/EDIT EVENT MODAL */}
      <LifeDatesAddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSave={handleSaveEvent}
        people={people}
        initialEvent={editingEvent}
      />
    </div>
  );
};

export default LifeDatesTracker;
