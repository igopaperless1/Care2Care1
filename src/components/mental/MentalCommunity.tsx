import React, { useState } from "react";
import {
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  Send,
  Plus,
  Smile,
  ShieldCheck,
  Award
} from "lucide-react";
import { soundEngine } from "./soundEngine";

export const MentalCommunity: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: "p-1",
      author: "Anonymous Dragonfly",
      time: "2 hours ago",
      text: "Completed 7 straight days of morning meditation! For anyone struggling at the start, 3 minutes is enough to begin feeling the shift.",
      likes: 24,
      liked: false,
      tag: "Mindfulness",
    },
    {
      id: "p-2",
      author: "Peaceful Otter",
      time: "4 hours ago",
      text: "Practiced the 4-7-8 breathing technique before my job interview today and actually felt calm and centered. It really works!",
      likes: 41,
      liked: true,
      tag: "Breathwork",
    },
    {
      id: "p-3",
      author: "Gentle Breeze",
      time: "Yesterday",
      text: "Sending strength to everyone working through work burnout. Remember that resting is productive.",
      likes: 56,
      liked: false,
      tag: "Encouragement",
    },
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);

  const toggleLike = (id: string) => {
    soundEngine.playChime(600, 0.2);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked }
          : p
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    soundEngine.playChime(650, 0.4);
    const newPost = {
      id: `p-${Date.now()}`,
      author: "Kind Cloud",
      time: "Just now",
      text: newPostText.trim(),
      likes: 1,
      liked: true,
      tag: "Mindfulness",
    };
    setPosts([newPost, ...posts]);
    setNewPostText("");
    setIsPostingModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
            Safe Community
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">Peer Support & Encouragement</h2>
          <p className="text-xs text-slate-500 font-medium">100% anonymous, moderated mindful sharing space.</p>
        </div>

        <button
          onClick={() => setIsPostingModalOpen(true)}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Share Note</span>
        </button>
      </div>

      {/* 2. Daily Inspiration Quote in Peach */}
      <div className="bg-gradient-to-r from-[#FF5A36] to-[#FF8B6B] rounded-3xl p-5 text-white shadow-xs space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-orange-200">Daily Mindfulness Thought</span>
        <p className="text-sm font-bold italic">
          "You don't have to control your thoughts. You just have to stop letting them control you."
        </p>
        <span className="text-[10px] block opacity-80 pt-1">— Dan Millman</span>
      </div>

      {/* 3. Community Posts Feed */}
      <div className="space-y-3">
        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 text-[#FF5A36] flex items-center justify-center text-xs font-black">
                  {p.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{p.author}</h4>
                  <span className="text-[10px] font-bold text-slate-400">{p.time}</span>
                </div>
              </div>

              <span className="text-[10px] font-black text-[#FF5A36] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-md">
                {p.tag}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">{p.text}</p>

            <div className="pt-2 border-t border-orange-50 flex items-center justify-between">
              <button
                onClick={() => toggleLike(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  p.liked
                    ? "bg-rose-50 text-rose-600 border border-rose-200 font-black"
                    : "bg-[#FFF9F5] text-slate-600 hover:bg-orange-100 border border-orange-200/80"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${p.liked ? "fill-current text-rose-500" : ""}`} />
                <span>{p.likes} Gratitude</span>
              </button>

              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Verified Mindful Member
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isPostingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-100 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Share Mindful Thought</h3>
            <textarea
              rows={4}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share an encouraging note, mindful reflection, or small victory..."
              className="w-full p-4 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsPostingModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="flex-1 py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
              >
                Post Anonymously
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
