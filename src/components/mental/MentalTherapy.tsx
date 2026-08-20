import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Plus,
  MessageSquare,
  UserCheck,
  Star,
  CheckCircle2,
  Phone,
  Search,
  Sparkles,
  X,
  Send,
  Droplets,
  Heart,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { TherapistSession } from "./types";
import { soundEngine } from "./soundEngine";

interface MentalTherapyProps {
  onBookSession?: () => void;
}

export const MentalTherapy: React.FC<MentalTherapyProps> = () => {
  const [activeSegment, setActiveSegment] = useState<"Sessions" | "Therapists" | "Chat">("Sessions");
  const [selectedNotesSession, setSelectedNotesSession] = useState<TherapistSession | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedTherapistForBooking, setSelectedTherapistForBooking] = useState<any | null>(null);

  // Chat simulator state
  const [chatMessages, setChatMessages] = useState([
    { id: "m1", sender: "therapist", text: "Hello! How have you been feeling since our last session regarding workplace boundaries?", time: "4:45 PM" },
    { id: "m2", sender: "user", text: "I practiced the 5-minute box breathing before meetings and it helped a lot.", time: "4:47 PM" },
    { id: "m3", sender: "therapist", text: "That is wonderful progress. Let's discuss expanding that grounding tool today.", time: "4:50 PM" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const upcomingSession: TherapistSession = {
    id: "up-1",
    therapistName: "Dr. Ananya Sharma",
    role: "Clinical Psychologist",
    title: "Overcoming Anxiety & Cognitive Restructuring",
    date: "14 May 2025",
    time: "5:00 PM",
    avatar: "https://images.unsplash.com/photo-1594824813589-7f5b3310065a?w=150&auto=format&fit=crop&q=80",
    status: "upcoming",
  };

  const pastSessions: TherapistSession[] = [
    {
      id: "p-1",
      therapistName: "Dr. Ananya Sharma",
      role: "Clinical Psychologist",
      title: "Managing Workplace Anxiety",
      date: "7 May 2025",
      time: "5:00 PM",
      avatar: "https://images.unsplash.com/photo-1594824813589-7f5b3310065a?w=150&auto=format&fit=crop&q=80",
      status: "completed",
      notes: "Client reported high fatigue. Practiced diaphragmatic 4-7-8 breathing and thought categorization. Homework: maintain thought diary.",
    },
    {
      id: "p-2",
      therapistName: "Dr. Ananya Sharma",
      role: "Clinical Psychologist",
      title: "Stress & Sleep Reset",
      date: "30 Apr 2025",
      time: "5:00 PM",
      avatar: "https://images.unsplash.com/photo-1594824813589-7f5b3310065a?w=150&auto=format&fit=crop&q=80",
      status: "completed",
      notes: "Reviewed trigger points. Established daily relaxation milestones and 15-minute screen pause before bedtime.",
    },
    {
      id: "p-3",
      therapistName: "Dr. Ananya Sharma",
      role: "Clinical Psychologist",
      title: "Building Self Confidence & Boundaries",
      date: "23 Apr 2025",
      time: "5:00 PM",
      avatar: "https://images.unsplash.com/photo-1594824813589-7f5b3310065a?w=150&auto=format&fit=crop&q=80",
      status: "completed",
      notes: "Explored positive cognitive reframing for performance evaluation scenarios.",
    },
  ];

  const therapistDirectory = [
    {
      id: "t1",
      name: "Dr. Ananya Sharma",
      role: "Clinical Psychologist (Ph.D.)",
      rating: "4.9",
      reviews: 142,
      specialties: ["Anxiety", "CBT", "Burnout", "Mindfulness"],
      avatar: "https://images.unsplash.com/photo-1594824813589-7f5b3310065a?w=150&auto=format&fit=crop&q=80",
      availability: "Available Today • 5:00 PM",
      fee: "$85 / 50 min",
    },
    {
      id: "t2",
      name: "Dr. Marcus Vance",
      role: "Licensed Marriage & Family Counselor",
      rating: "4.8",
      reviews: 98,
      specialties: ["Relationships", "Trauma", "Depression"],
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
      availability: "Available Tomorrow • 10:00 AM",
      fee: "$90 / 50 min",
    },
    {
      id: "t3",
      name: "Dr. Elena Rostova",
      role: "Somatic & Mindfulness Therapist",
      rating: "5.0",
      reviews: 64,
      specialties: ["Stress", "Breathwork", "Grief"],
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
      availability: "Available Thursday • 2:00 PM",
      fee: "$75 / 50 min",
    },
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    soundEngine.playChime(600, 0.15);
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "user",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    setTimeout(() => {
      soundEngine.playChime(520, 0.2);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `m-resp-${Date.now()}`,
          sender: "therapist",
          text: "Thank you for sharing that. Keep noticing how your breath responds in those moments.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF5A36] shadow-xs">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
              Professional Care
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">Therapy & Consultation</h2>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedTherapistForBooking(therapistDirectory[0]);
            setIsBookingModalOpen(true);
          }}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Book Session</span>
        </button>
      </div>

      {/* 2. Segmented Navigation Tabs */}
      <div className="flex bg-[#FFF9F5] p-1 rounded-2xl border border-orange-200/80 gap-1">
        {(["Sessions", "Therapists", "Chat"] as const).map((seg) => (
          <button
            key={seg}
            onClick={() => setActiveSegment(seg)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSegment === seg
                ? "bg-[#FF5A36] text-white shadow-xs font-black"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            {seg === "Sessions" ? "My Sessions" : seg === "Therapists" ? "Find Therapist" : "Live Chat"}
          </button>
        ))}
      </div>

      {/* SEGMENT 1: SESSIONS */}
      {activeSegment === "Sessions" && (
        <div className="space-y-4">
          {/* Upcoming Session Card */}
          <div className="bg-white border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Upcoming Appointment
              </span>
              <span className="px-2.5 py-1 bg-orange-100 text-[#FF5A36] border border-orange-200 rounded-full text-[10px] font-black uppercase">
                Confirmed
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <div className="flex items-center gap-3.5">
                <img
                  src={upcomingSession.avatar}
                  alt={upcomingSession.therapistName}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-orange-200 shadow-2xs"
                />
                <div>
                  <h4 className="text-sm font-black text-slate-900">{upcomingSession.therapistName}</h4>
                  <p className="text-xs font-bold text-slate-500">{upcomingSession.role}</p>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 mt-1">
                    <span className="flex items-center gap-1 text-[#FF5A36]">
                      <Calendar className="w-3.5 h-3.5" />
                      {upcomingSession.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {upcomingSession.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Call</span>
                </button>
                <button
                  onClick={() => setActiveSegment("Chat")}
                  className="p-2.5 bg-white hover:bg-orange-50 text-slate-700 border border-slate-200/80 rounded-2xl cursor-pointer"
                  title="Message"
                >
                  <MessageSquare className="w-4 h-4 text-[#FF5A36]" />
                </button>
              </div>
            </div>
          </div>

          {/* Past Sessions History */}
          <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              Previous Session Notes
            </span>

            <div className="space-y-2.5">
              {pastSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 bg-white border border-slate-200/80 hover:border-orange-200 rounded-2xl transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF5A36]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{sess.title}</h4>
                      <p className="text-[11px] font-bold text-slate-400">
                        {sess.therapistName} • {sess.date}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedNotesSession(sess)}
                    className="px-3 py-1.5 bg-[#FFF9F5] hover:bg-orange-100 text-[#FF5A36] border border-orange-200 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    View Notes
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEGMENT 2: THERAPIST DIRECTORY */}
      {activeSegment === "Therapists" && (
        <div className="space-y-3">
          {therapistDirectory.map((th) => (
            <div
              key={th.id}
              className="bg-white border border-orange-100 hover:border-orange-200 rounded-3xl p-5 shadow-xs space-y-3 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={th.avatar}
                    alt={th.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-orange-200"
                  />
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{th.name}</h3>
                    <p className="text-xs font-bold text-slate-500">{th.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center text-amber-500 text-xs font-black">
                        <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                        {th.rating}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">({th.reviews} reviews)</span>
                      <span className="text-[11px] font-black text-[#FF5A36]">{th.fee}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTherapistForBooking(th);
                    setIsBookingModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black shadow-xs cursor-pointer"
                >
                  Book Session
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {th.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="px-2.5 py-0.5 bg-orange-50 border border-orange-200 text-slate-700 rounded-lg text-[11px] font-bold"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SEGMENT 3: LIVE CHAT */}
      {activeSegment === "Chat" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2.5">
              <img
                src={upcomingSession.avatar}
                alt="Therapist"
                className="w-9 h-9 rounded-xl object-cover border border-orange-200"
              />
              <div>
                <h4 className="text-xs font-black text-slate-900">{upcomingSession.therapistName}</h4>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Encrypted Consultation</span>
          </div>

          <div className="h-64 overflow-y-auto space-y-2.5 p-2 bg-[#FFF9F5] border border-orange-100 rounded-2xl">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#FF5A36] text-white rounded-br-xs font-semibold"
                      : "bg-white text-slate-800 border border-orange-200/80 rounded-bl-xs font-medium"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] block mt-1 ${
                      msg.sender === "user" ? "text-orange-200 text-right" : "text-slate-400"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message to Dr. Sharma..."
              className="flex-1 px-4 py-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36]"
            />
            <button
              onClick={handleSendMessage}
              className="p-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl cursor-pointer transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Video Call Simulator Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-100 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-200 text-[#FF5A36] mx-auto flex items-center justify-center animate-bounce">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Connecting to Virtual Room...</h3>
            <p className="text-xs text-slate-500">
              Dr. Ananya Sharma is in the room. Audio & HD Video connection active.
            </p>
            <div className="p-3 bg-[#FFF9F5] rounded-2xl border border-orange-200 text-xs font-bold text-[#FF5A36]">
              Session Topic: Overcoming Anxiety & Cognitive Restructuring
            </div>
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
            >
              Leave / End Consultation
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Confirm Booking</h3>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-[#FFF9F5] rounded-2xl border border-orange-200/80 flex items-center gap-3">
              <img
                src={selectedTherapistForBooking?.avatar}
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-orange-200"
              />
              <div>
                <h4 className="text-xs font-black text-slate-900">{selectedTherapistForBooking?.name}</h4>
                <p className="text-[11px] font-bold text-slate-500">{selectedTherapistForBooking?.role}</p>
                <p className="text-[11px] font-black text-[#FF5A36] mt-0.5">{selectedTherapistForBooking?.fee}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 block">Select Slot</label>
              <select className="w-full p-2.5 bg-[#FFF9F5] border border-orange-200 rounded-xl text-xs font-bold text-slate-800">
                <option>Today • 5:00 PM (Instant)</option>
                <option>Tomorrow • 10:30 AM</option>
                <option>Thursday • 4:00 PM</option>
              </select>
            </div>

            <button
              onClick={() => {
                soundEngine.playChime(600, 0.5);
                setIsBookingModalOpen(false);
                setActiveSegment("Sessions");
              }}
              className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
            >
              Confirm & Schedule
            </button>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {selectedNotesSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">{selectedNotesSession.title}</h3>
              <button
                onClick={() => setSelectedNotesSession(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-400">
              {selectedNotesSession.therapistName} • {selectedNotesSession.date}
            </p>
            <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-orange-200/80 text-xs text-slate-700 leading-relaxed font-medium">
              {selectedNotesSession.notes}
            </div>
            <button
              onClick={() => setSelectedNotesSession(null)}
              className="w-full py-2.5 bg-orange-100 hover:bg-orange-200 text-[#FF5A36] rounded-2xl text-xs font-black cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
