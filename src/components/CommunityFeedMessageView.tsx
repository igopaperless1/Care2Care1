import React, { useState } from "react";
import {
  Users,
  MessageSquare,
  Sparkles,
  Heart,
  Share2,
  Send,
  Plus,
  Search,
  Bell,
  CheckCircle2,
  Smile,
  Shield,
  PhoneCall,
  Calendar,
  ChevronRight,
  TrendingUp,
  Award,
  Radio,
  Filter,
  MessageCircle,
  Newspaper,
  Check,
  Copy,
  Trophy,
  Flame,
  Target,
  Zap,
  Clock,
  ArrowRight,
  ThumbsUp,
  CheckCircle,
  Sliders,
  X
} from "lucide-react";
import { Patient } from "../types";

interface CommunityFeedMessageViewProps {
  patient?: Patient;
  onNavigateToCareSubTab?: (subTab: string) => void;
}

export interface ChallengeItem {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  category: "health" | "habit" | "fitness" | "finance" | "mindful";
  mode: "duel" | "group";
  opponentName?: string;
  opponentAvatar?: string;
  groupName?: string;
  participantCount?: number;
  dailyTarget: string;
  totalDays: number;
  userDay: number;
  opponentDay?: number;
  userCheckedInToday: boolean;
  opponentCheckedInToday?: boolean;
  userStreak: number;
  opponentStreak?: number;
  rewardBadge: string;
  participants?: Array<{
    id: string;
    name: string;
    avatar: string;
    currentDay: number;
    streak: number;
    checkedInToday: boolean;
  }>;
  copiedCount: number;
}

export interface ResolutionItem {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  category: "health" | "finance" | "mindset" | "fitness" | "career" | "family";
  targetDate: string;
  daysTotal: number;
  daysCompleted: number;
  milestones: string[];
  currentMilestoneIndex: number;
  pledgedCount: number;
  cheersCount: number;
  isUserPledged: boolean;
  isUserCheered: boolean;
  checkedInToday: boolean;
  notes?: string;
}

export const CommunityFeedMessageView: React.FC<CommunityFeedMessageViewProps> = ({
  patient,
  onNavigateToCareSubTab
}) => {
  // Tab state: "chat" | "community" | "challenge" | "resolution" | "feed"
  const [activeTab, setActiveTab] = useState<"chat" | "community" | "challenge" | "resolution" | "feed">("challenge");

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==========================================
  // 1. CHALLENGE STATE & DATA
  // ==========================================
  const [challengeFilter, setChallengeFilter] = useState<"all" | "duel" | "group">("all");
  const [isCreateChallengeModalOpen, setIsCreateChallengeModalOpen] = useState(false);
  const [newChallengeTitle, setNewChallengeTitle] = useState("");
  const [newChallengeDailyTarget, setNewChallengeDailyTarget] = useState("");
  const [newChallengeTotalDays, setNewChallengeTotalDays] = useState(21);
  const [newChallengeMode, setNewChallengeMode] = useState<"duel" | "group">("duel");
  const [newChallengeOpponent, setNewChallengeOpponent] = useState("Alex R.");
  const [newChallengeGroupName, setNewChallengeGroupName] = useState("Early Birds Squad");
  const [newChallengeCategory, setNewChallengeCategory] = useState<"health" | "habit" | "fitness" | "finance" | "mindful">("health");
  const [newChallengeReward, setNewChallengeReward] = useState("🏆 Gold Champion Badge");

  const [challenges, setChallenges] = useState<ChallengeItem[]>([
    {
      id: "chal_1",
      title: "21-Day 10,000 Steps Daily Duel",
      creator: "Eleanor Vance (You)",
      creatorAvatar: "EV",
      category: "fitness",
      mode: "duel",
      opponentName: "Alex Rivera",
      opponentAvatar: "AR",
      dailyTarget: "10,000 Steps / Day",
      totalDays: 21,
      userDay: 8,
      opponentDay: 7,
      userCheckedInToday: true,
      opponentCheckedInToday: false,
      userStreak: 8,
      opponentStreak: 6,
      rewardBadge: "🏆 Step Master Shield",
      copiedCount: 48
    },
    {
      id: "chal_2",
      title: "30-Day Zero Refined Sugar Sprint",
      creator: "Dr. Sarah Jenkins",
      creatorAvatar: "SJ",
      category: "health",
      mode: "group",
      groupName: "Cardio Health Squad",
      participantCount: 14,
      dailyTarget: "0g Added Sugar + Water",
      totalDays: 30,
      userDay: 12,
      userCheckedInToday: false,
      userStreak: 11,
      rewardBadge: "🌱 Clean Glycemia Crest",
      participants: [
        { id: "p1", name: "You (Eleanor)", avatar: "EV", currentDay: 12, streak: 11, checkedInToday: false },
        { id: "p2", name: "Dr. Sarah J.", avatar: "SJ", currentDay: 13, streak: 13, checkedInToday: true },
        { id: "p3", name: "Marcus V.", avatar: "MV", currentDay: 12, streak: 12, checkedInToday: true },
        { id: "p4", name: "Chloe K.", avatar: "CK", currentDay: 10, streak: 9, checkedInToday: false },
        { id: "p5", name: "Liam B.", avatar: "LB", currentDay: 13, streak: 13, checkedInToday: true }
      ],
      copiedCount: 129
    },
    {
      id: "chal_3",
      title: "14-Day Morning Breathwork & Meditation",
      creator: "Marcus Vance",
      creatorAvatar: "MV",
      category: "mindful",
      mode: "duel",
      opponentName: "Dr. Michael Chen",
      opponentAvatar: "MC",
      dailyTarget: "15 Mins Pranayama / Yoga",
      totalDays: 14,
      userDay: 5,
      opponentDay: 5,
      userCheckedInToday: true,
      opponentCheckedInToday: true,
      userStreak: 5,
      opponentStreak: 5,
      rewardBadge: "🧘 Zen Flow Medal",
      copiedCount: 64
    },
    {
      id: "chal_4",
      title: "7-Day Zero Unnecessary Spend Challenge",
      creator: "David Miller, CPA",
      creatorAvatar: "DM",
      category: "finance",
      mode: "group",
      groupName: "Financial Freedom Cohort",
      participantCount: 28,
      dailyTarget: "Essentials Only + Log Expense",
      totalDays: 7,
      userDay: 3,
      userCheckedInToday: true,
      userStreak: 3,
      rewardBadge: "💰 Smart Saver Badge",
      participants: [
        { id: "p1", name: "You (Eleanor)", avatar: "EV", currentDay: 3, streak: 3, checkedInToday: true },
        { id: "p2", name: "David M.", avatar: "DM", currentDay: 3, streak: 3, checkedInToday: true },
        { id: "p3", name: "Maya S.", avatar: "MS", currentDay: 2, streak: 2, checkedInToday: false },
        { id: "p4", name: "Robert T.", avatar: "RT", currentDay: 3, streak: 3, checkedInToday: true }
      ],
      copiedCount: 88
    }
  ]);

  // Handle Copy & Carry On Challenge
  const handleCopyChallenge = (challenge: ChallengeItem) => {
    // 1. Copy text to clipboard
    const textToCopy = `🏆 21-Day Habit Challenge: ${challenge.title}\nDaily Goal: ${challenge.dailyTarget} (${challenge.totalDays} Days)\nJoin and carry on the streak!`;
    navigator.clipboard?.writeText(textToCopy);

    // 2. Clone challenge to user's list if not already created by user
    setChallenges((prev) =>
      prev.map((c) => (c.id === challenge.id ? { ...c, copiedCount: c.copiedCount + 1 } : c))
    );

    // Add clone
    const clonedChallenge: ChallengeItem = {
      id: `cloned_${Date.now()}`,
      title: `[My Quest] ${challenge.title}`,
      creator: "You (Adopted)",
      creatorAvatar: "ME",
      category: challenge.category,
      mode: "duel",
      opponentName: challenge.creator,
      opponentAvatar: challenge.creatorAvatar,
      dailyTarget: challenge.dailyTarget,
      totalDays: challenge.totalDays,
      userDay: 1,
      opponentDay: challenge.userDay,
      userCheckedInToday: false,
      opponentCheckedInToday: true,
      userStreak: 0,
      opponentStreak: challenge.userStreak,
      rewardBadge: challenge.rewardBadge,
      copiedCount: 1
    };

    setChallenges((prev) => [clonedChallenge, ...prev]);
    showToast(`📋 Challenge copied & carried on to your active daily tracker! You're on Day 1.`);
  };

  // Handle Daily Check-in for Challenge
  const handleChallengeCheckIn = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== challengeId) return c;
        const nextUserDay = c.userCheckedInToday ? c.userDay : Math.min(c.totalDays, c.userDay + 1);
        const nextStreak = c.userCheckedInToday ? c.userStreak : c.userStreak + 1;
        return {
          ...c,
          userCheckedInToday: true,
          userDay: nextUserDay,
          userStreak: nextStreak,
          participants: c.participants
            ? c.participants.map((p) =>
                p.id === "p1"
                  ? { ...p, currentDay: nextUserDay, streak: nextStreak, checkedInToday: true }
                  : p
              )
            : undefined
        };
      })
    );
    showToast("🎉 Daily Check-in logged! Daily streak & progress bar updated.");
  };

  // Create Challenge
  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallengeTitle.trim() || !newChallengeDailyTarget.trim()) return;

    const newChal: ChallengeItem = {
      id: `chal_${Date.now()}`,
      title: newChallengeTitle,
      creator: "Eleanor Vance (You)",
      creatorAvatar: "EV",
      category: newChallengeCategory,
      mode: newChallengeMode,
      opponentName: newChallengeMode === "duel" ? newChallengeOpponent : undefined,
      opponentAvatar: newChallengeMode === "duel" ? "OP" : undefined,
      groupName: newChallengeMode === "group" ? newChallengeGroupName : undefined,
      participantCount: newChallengeMode === "group" ? 1 : undefined,
      dailyTarget: newChallengeDailyTarget,
      totalDays: Number(newChallengeTotalDays),
      userDay: 1,
      opponentDay: newChallengeMode === "duel" ? 1 : undefined,
      userCheckedInToday: true,
      opponentCheckedInToday: false,
      userStreak: 1,
      opponentStreak: 0,
      rewardBadge: newChallengeReward || "🏆 Challenger Cup",
      copiedCount: 0,
      participants:
        newChallengeMode === "group"
          ? [{ id: "p1", name: "You (Eleanor)", avatar: "EV", currentDay: 1, streak: 1, checkedInToday: true }]
          : undefined
    };

    setChallenges((prev) => [newChal, ...prev]);
    setIsCreateChallengeModalOpen(false);
    setNewChallengeTitle("");
    setNewChallengeDailyTarget("");
    showToast("✨ New Challenge created & launched! Anyone can now copy & carry on this challenge.");
  };

  // ==========================================
  // 2. RESOLUTION STATE & DATA
  // ==========================================
  const [resolutionFilter, setResolutionFilter] = useState<"all" | "my" | "community">("all");
  const [isCreateResolutionModalOpen, setIsCreateResolutionModalOpen] = useState(false);
  const [newResTitle, setNewResTitle] = useState("");
  const [newResCategory, setNewResCategory] = useState<"health" | "finance" | "mindset" | "fitness" | "career" | "family">("health");
  const [newResDaysTotal, setNewResDaysTotal] = useState(90);
  const [newResMilestones, setNewResMilestones] = useState("");

  const [resolutions, setResolutions] = useState<ResolutionItem[]>([
    {
      id: "res_1",
      title: "Master Blood Pressure & Lose 10kg in 2026",
      author: "Eleanor Vance (You)",
      authorAvatar: "EV",
      category: "health",
      targetDate: "Dec 31, 2026",
      daysTotal: 365,
      daysCompleted: 54,
      milestones: [
        "Phase 1: Daily 10k steps & sodium limit <1,500mg",
        "Phase 2: Systolic BP consistently <125 mm Hg",
        "Phase 3: 10kg weight reduction milestone reached"
      ],
      currentMilestoneIndex: 0,
      pledgedCount: 38,
      cheersCount: 94,
      isUserPledged: true,
      isUserCheered: false,
      checkedInToday: true,
      notes: "Logged morning BP 118/76. Hydration target complete."
    },
    {
      id: "res_2",
      title: "Zero Credit Card Debt & Build $10,000 Emergency Fund",
      author: "David Miller, CPA",
      authorAvatar: "DM",
      category: "finance",
      targetDate: "Nov 30, 2026",
      daysTotal: 300,
      daysCompleted: 82,
      milestones: [
        "Cut monthly subscriptions by $150",
        "Pay off first high-interest card ($2,400)",
        "Reach $5,000 cash reserve envelope",
        "Fully debt-free with $10,000 safety vault"
      ],
      currentMilestoneIndex: 1,
      pledgedCount: 112,
      cheersCount: 245,
      isUserPledged: false,
      isUserCheered: true,
      checkedInToday: true,
      notes: "Transferred $300 to savings envelope this week."
    },
    {
      id: "res_3",
      title: "Daily 20-Min Breathwork & Unshakable Mental Peace",
      author: "Dr. Maya Lin",
      authorAvatar: "ML",
      category: "mindset",
      targetDate: "Dec 31, 2026",
      daysTotal: 180,
      daysCompleted: 45,
      milestones: [
        "14 consecutive days of morning Pranayama",
        "No screen time 1 hour before bed",
        "Complete 90 days mindfulness log"
      ],
      currentMilestoneIndex: 0,
      pledgedCount: 76,
      cheersCount: 180,
      isUserPledged: false,
      isUserCheered: false,
      checkedInToday: false
    }
  ]);

  // Handle Join / Pledge Resolution
  const handlePledgeResolution = (resId: string) => {
    setResolutions((prev) =>
      prev.map((r) => {
        if (r.id !== resId) return r;
        const nextPledged = !r.isUserPledged;
        return {
          ...r,
          isUserPledged: nextPledged,
          pledgedCount: nextPledged ? r.pledgedCount + 1 : Math.max(0, r.pledgedCount - 1)
        };
      })
    );
    showToast("🤝 You have pledged this resolution! Added to your life accountability commitments.");
  };

  // Handle Cheer Resolution
  const handleCheerResolution = (resId: string) => {
    setResolutions((prev) =>
      prev.map((r) => {
        if (r.id !== resId) return r;
        const nextCheered = !r.isUserCheered;
        return {
          ...r,
          isUserCheered: nextCheered,
          cheersCount: nextCheered ? r.cheersCount + 1 : Math.max(0, r.cheersCount - 1)
        };
      })
    );
  };

  // Handle Resolution Daily Check-In
  const handleResolutionCheckIn = (resId: string) => {
    setResolutions((prev) =>
      prev.map((r) => {
        if (r.id !== resId) return r;
        return {
          ...r,
          checkedInToday: true,
          daysCompleted: r.checkedInToday ? r.daysCompleted : r.daysCompleted + 1
        };
      })
    );
    showToast("✨ Resolution daily check-in recorded! Accountability streak refreshed.");
  };

  // Create Resolution
  const handleCreateResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim()) return;

    const milestonesList = newResMilestones
      .split("\n")
      .map((m) => m.trim())
      .filter(Boolean);

    const newRes: ResolutionItem = {
      id: `res_${Date.now()}`,
      title: newResTitle,
      author: "Eleanor Vance (You)",
      authorAvatar: "EV",
      category: newResCategory,
      targetDate: new Date(Date.now() + newResDaysTotal * 86400000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      daysTotal: Number(newResDaysTotal),
      daysCompleted: 1,
      milestones:
        milestonesList.length > 0
          ? milestonesList
          : ["Phase 1: Build consistent daily foundation", "Phase 2: Sustain momentum past 60 days", "Phase 3: Complete transformation"],
      currentMilestoneIndex: 0,
      pledgedCount: 1,
      cheersCount: 1,
      isUserPledged: true,
      isUserCheered: true,
      checkedInToday: true
    };

    setResolutions((prev) => [newRes, ...prev]);
    setIsCreateResolutionModalOpen(false);
    setNewResTitle("");
    setNewResMilestones("");
    showToast("🎯 Resolution started! Committed to your accountability dashboard.");
  };

  // ==========================================
  // 3. COMMUNITY & SEARCH STATE
  // ==========================================
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCircleCategory, setSelectedCircleCategory] = useState("all");
  const [joinedCircleIds, setJoinedCircleIds] = useState<string[]>(["elderly_circle", "neighborhood_circle"]);

  const communityCircles = [
    {
      id: "elderly_circle",
      name: "Senior & Elderly Care Circle",
      members: "1,420 members",
      badge: "Caregivers & Seniors",
      icon: "👴",
      category: "health",
      desc: "Daily check-ins, medication tips, mobility support and caregiver mutual aid.",
      subTab: "elderly"
    },
    {
      id: "wellness_club",
      name: "Mindful Yoga & Habit Guild",
      members: "3,890 members",
      badge: "21-Day Streak",
      icon: "🧘",
      category: "wellness",
      desc: "Daily morning yoga, breathwork challenges, meditation streaks and gratitude.",
      subTab: "yoga"
    },
    {
      id: "neighborhood_circle",
      name: "Greenwood Family & Housing Hub",
      members: "640 neighbors",
      badge: "Verified Local",
      icon: "🏡",
      category: "local",
      desc: "Local community notices, emergency neighborhood watch, tool sharing and events.",
      subTab: "property"
    },
    {
      id: "pediatric_parents",
      name: "Parenting & Pediatric Wellness",
      members: "2,150 parents",
      badge: "Kids & Teens",
      icon: "👶",
      category: "family",
      desc: "Vaccination reminders, developmental milestones, school schedules and diet.",
      subTab: "kids"
    },
    {
      id: "farm_garden",
      name: "Urban Farm & Organic Gardeners",
      members: "980 growers",
      badge: "Sustainability",
      icon: "🌿",
      category: "lifestyle",
      desc: "Seasonal planting schedules, harvest trading, organic pest control and composting.",
      subTab: "garden"
    },
    {
      id: "paperless_pioneers",
      name: "Paperless Living & Digital IDs",
      members: "4,300 digital nomads",
      badge: "Zero Paper",
      icon: "📄",
      category: "productivity",
      desc: "Deed digitization, digital business cards, smart contracts and paperless workflows.",
      subTab: "paperless"
    },
    {
      id: "heart_health",
      name: "Cardio & Blood Pressure Watch",
      members: "1,820 members",
      badge: "Vitals & BP",
      icon: "🩺",
      category: "health",
      desc: "Low-sodium meal swaps, blood pressure tracking logs and cardiologist Q&A.",
      subTab: "vitals"
    },
    {
      id: "finance_freedom",
      name: "Family Budget & Smart Invoicing",
      members: "2,400 members",
      badge: "Finance",
      icon: "💰",
      category: "finance",
      desc: "Expense reduction hacks, invoice templates and debt-free family milestones.",
      subTab: "finance"
    }
  ];

  // ==========================================
  // 4. FEED STATE & DATA
  // ==========================================
  const [feedFilter, setFeedFilter] = useState("all");
  const [newPostText, setNewPostText] = useState("");
  const [newPostTag, setNewPostTag] = useState("💬 Update");

  const [feedPosts, setFeedPosts] = useState([
    {
      id: "post_1",
      author: "Dr. Sarah Jenkins, MD",
      role: "Cardiologist & Medical Advisor",
      avatar: "SJ",
      time: "25m ago",
      title: "The 20-Minute Evening Walk Effect on Blood Pressure",
      content:
        "Consistent daily walks of just 5,000–7,000 steps reduce systolic pressure by an average of 4-9 mm Hg. Pair it with evening hydration for optimal cardiovascular recovery.",
      likes: 42,
      isLiked: false,
      comments: 7,
      tag: "Health Advice",
      challengePrompt: "21-Day 10,000 Steps Daily Duel"
    },
    {
      id: "post_2",
      author: "Marcus Vance",
      role: "21-Day Habit Champion",
      avatar: "MV",
      time: "2h ago",
      title: "Completed Day 21 of Mindful Hydration! 🎉",
      content:
        "Started with difficulty drinking 1 liter a day, now effortlessly logging 2.7L daily with morning lemon water. My resting heart rate dropped from 76 to 68 bpm!",
      likes: 88,
      isLiked: true,
      comments: 19,
      tag: "Milestone",
      challengePrompt: "30-Day Zero Refined Sugar Sprint"
    },
    {
      id: "post_3",
      author: "Greenwood Caregiver Council",
      role: "Community Support",
      avatar: "GC",
      time: "5h ago",
      title: "Weekly Blood Pressure & Vitals Check-in Open",
      content:
        "Community clinic nurse volunteers are available this Saturday at Greenwood Center from 9am to 1pm for free blood pressure, SpO2 and glucose screening.",
      likes: 31,
      isLiked: false,
      comments: 4,
      tag: "Community Event"
    }
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: `post_${Date.now()}`,
      author: patient?.name ? `${patient.name} (You)` : "Eleanor Vance (You)",
      role: "Care Member",
      avatar: "ME",
      time: "Just now",
      title: newPostTag === "🏆 Milestone" ? "New Milestone Achieved!" : "Community Update",
      content: newPostText,
      likes: 1,
      isLiked: true,
      comments: 0,
      tag: newPostTag
    };

    setFeedPosts([newPost, ...feedPosts]);
    setNewPostText("");
    showToast("🎉 Post shared with your community feed!");
  };

  const handleToggleLike = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  // ==========================================
  // 5. MESSAGES & CHAT STATE
  // ==========================================
  const [messageInput, setMessageInput] = useState("");
  const [activeChatId, setActiveChatId] = useState<string>("caregiver_1");

  const [chatThreads, setChatThreads] = useState([
    {
      id: "caregiver_1",
      name: "Dr. Sarah Jenkins",
      role: "Attending Cardiologist",
      avatar: "SJ",
      online: true,
      badge: "Verified MD",
      lastMessage: "Vitals log looks stable this week. Continue 10mg Lisinopril.",
      time: "10:45 AM",
      unread: 0,
      messages: [
        {
          id: "m1",
          sender: "Dr. Sarah Jenkins",
          text: "Good morning Eleanor. I reviewed your blood pressure logs from Wednesday. Systolic average at 122 mm Hg is right in our target zone.",
          time: "10:30 AM",
          isMe: false
        },
        {
          id: "m2",
          sender: "Eleanor",
          text: "Thank you Dr. Jenkins! The morning 20-minute walk routine has really helped keep it steady.",
          time: "10:40 AM",
          isMe: true
        },
        {
          id: "m3",
          sender: "Dr. Sarah Jenkins",
          text: "Excellent! Vitals log looks stable this week. Continue 10mg Lisinopril as scheduled.",
          time: "10:45 AM",
          isMe: false
        }
      ]
    },
    {
      id: "family_1",
      name: "Family Caregiver Circle",
      role: "Marcus & Chloe",
      avatar: "FC",
      online: true,
      badge: "Family Sync",
      lastMessage: "Marcus: Picked up prescription refill from Walgreens!",
      time: "Yesterday",
      unread: 2,
      messages: [
        {
          id: "mf1",
          sender: "Chloe",
          text: "Did Mom take her morning vitamins?",
          time: "Yesterday 9:00 AM",
          isMe: false
        },
        {
          id: "mf2",
          sender: "Marcus",
          text: "Yes, logged in pillbox app at 8:30 AM. Also picked up prescription refill from Walgreens!",
          time: "Yesterday 2:15 PM",
          isMe: false
        }
      ]
    },
    {
      id: "ai_concierge",
      name: "Care2Care AI Health Concierge",
      role: "24/7 Care Assistant",
      avatar: "✨",
      online: true,
      badge: "Smart AI",
      lastMessage: "Your next water goal check-in is in 45 minutes.",
      time: "11:00 AM",
      unread: 0,
      messages: [
        {
          id: "ma1",
          sender: "AI Concierge",
          text: "Hello! You have reached 1,750ml of your 2,500ml water goal today. Tap (+) in the quick bar to log your next glass.",
          time: "11:00 AM",
          isMe: false
        }
      ]
    }
  ]);

  const activeChat = chatThreads.find((c) => c.id === activeChatId) || chatThreads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: "Eleanor",
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true
    };

    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === activeChatId) {
          return {
            ...thread,
            lastMessage: `You: ${messageInput}`,
            time: "Just now",
            messages: [...thread.messages, newMsg]
          };
        }
        return thread;
      })
    );
    setMessageInput("");
  };

  const handleToggleJoinCircle = (circleId: string) => {
    setJoinedCircleIds((prev) =>
      prev.includes(circleId) ? prev.filter((id) => id !== circleId) : [...prev, circleId]
    );
  };

  // Filtered Circles
  const filteredCircles = communityCircles.filter((circle) => {
    const matchesSearch =
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCircleCategory === "all" || circle.category === selectedCircleCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto text-left">
      {/* ========================================================================= */}
      {/* TOAST NOTIFICATION */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-orange-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md">
          <span className="text-xl">✨</span>
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HERO HEADER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-orange-500 via-[#FF6A45] to-amber-500 text-white rounded-3xl p-4 sm:p-5 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
              Connected Life Ecosystem
            </span>
            <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-300 animate-pulse" /> Social Arena & Hub
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Chat, Community, Challenges & Resolutions
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 font-medium max-w-xl">
            Challenge friends to 1-on-1 duels or squad quests, copy & carry on daily challenges, start life resolutions, and chat securely with caregivers.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 text-8xl text-white/10 select-none pointer-events-none">
          🏆
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 5-SEGMENTED TAB SELECTOR: CHAT / COMMUNITY / CHALLENGE / RESOLUTION / FEED */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        {/* Tab 1: Chat / Messages */}
        <button
          type="button"
          onClick={() => setActiveTab("chat")}
          className={`py-2 px-1.5 rounded-xl font-black text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
            activeTab === "chat"
              ? "bg-[#FF6A45] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span className="truncate">Chat</span>
        </button>

        {/* Tab 2: Community */}
        <button
          type="button"
          onClick={() => setActiveTab("community")}
          className={`py-2 px-1.5 rounded-xl font-black text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
            activeTab === "community"
              ? "bg-[#FF6A45] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span className="truncate">Community</span>
        </button>

        {/* Tab 3: Challenge */}
        <button
          type="button"
          onClick={() => setActiveTab("challenge")}
          className={`py-2 px-1.5 rounded-xl font-black text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer relative ${
            activeTab === "challenge"
              ? "bg-[#FF6A45] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Trophy className="w-4 h-4 shrink-0 text-amber-300 sm:text-inherit" />
          <span className="truncate">Challenges</span>
          <span className="hidden sm:inline-block text-[9px] px-1 bg-amber-400 text-slate-900 rounded font-black">
            Duel
          </span>
        </button>

        {/* Tab 4: Resolution */}
        <button
          type="button"
          onClick={() => setActiveTab("resolution")}
          className={`py-2 px-1.5 rounded-xl font-black text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
            activeTab === "resolution"
              ? "bg-[#FF6A45] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Target className="w-4 h-4 shrink-0 text-rose-300 sm:text-inherit" />
          <span className="truncate">Resolutions</span>
        </button>

        {/* Tab 5: Feed */}
        <button
          type="button"
          onClick={() => setActiveTab("feed")}
          className={`py-2 px-1.5 rounded-xl font-black text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
            activeTab === "feed"
              ? "bg-[#FF6A45] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Newspaper className="w-4 h-4 shrink-0" />
          <span className="truncate">Feed</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONDITIONAL TAB VIEWS */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* [CHALLENGE TAB]: Post Challenge, Copy & Carry On, 1-on-1 Duel & Groups */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === "challenge" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Action Bar & Filter */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚔️</span>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Social Challenge Arena
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF6A45]">
                  Copy & Carry On
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Post challenges, copy any challenge in 1-tap, and track daily duel progress side-by-side.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setChallengeFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    challengeFilter === "all" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs" : "text-slate-500"
                  }`}
                >
                  All ({challenges.length})
                </button>
                <button
                  type="button"
                  onClick={() => setChallengeFilter("duel")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    challengeFilter === "duel" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs" : "text-slate-500"
                  }`}
                >
                  ⚔️ 1-on-1 Duels
                </button>
                <button
                  type="button"
                  onClick={() => setChallengeFilter("group")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    challengeFilter === "group" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs" : "text-slate-500"
                  }`}
                >
                  👥 Squads
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateChallengeModalOpen(true)}
                className="px-3.5 py-2 bg-[#FF6A45] hover:bg-[#EA580C] text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Post Challenge</span>
              </button>
            </div>
          </div>

          {/* List of Challenges */}
          <div className="space-y-3.5">
            {challenges
              .filter((c) => (challengeFilter === "all" ? true : c.mode === challengeFilter))
              .map((chal) => {
                const userPct = Math.round((chal.userDay / chal.totalDays) * 100);
                const opponentPct = chal.opponentDay ? Math.round((chal.opponentDay / chal.totalDays) * 100) : 0;

                return (
                  <div
                    key={chal.id}
                    className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4 hover:border-orange-200 dark:hover:border-orange-900/60 transition-all"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                              chal.mode === "duel"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200"
                            }`}
                          >
                            {chal.mode === "duel" ? "⚔️ 1-on-1 Duel" : "👥 Group Challenge"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            • Goal: {chal.dailyTarget}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {chal.totalDays} Days Quest
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          {chal.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Created by <strong className="text-slate-700 dark:text-slate-300">{chal.creator}</strong> • Reward: {chal.rewardBadge}
                        </p>
                      </div>

                      {/* COPY & CARRY ON BUTTON */}
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleCopyChallenge(chal)}
                          className="px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-[#FF6A45] hover:text-white text-[#FF6A45] text-xs font-black border border-orange-200/80 dark:border-orange-800/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
                          title="Copy this challenge and add to your active personal challenges"
                        >
                          <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          <span>Copy & Carry On</span>
                          <span className="text-[10px] opacity-75 font-normal">({chal.copiedCount})</span>
                        </button>
                      </div>
                    </div>

                    {/* PROGRESS COMPARISON SECTION */}
                    {chal.mode === "duel" ? (
                      /* 1-on-1 DUEL COMPARISON */
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
                        <div className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
                          <span>Daily Duel Comparison</span>
                          <span className="text-orange-600 dark:text-orange-400 font-bold">
                            {chal.userDay >= (chal.opponentDay || 0) ? "🏆 You are leading!" : "⚡ Duel in progress"}
                          </span>
                        </div>

                        {/* Player 1 (You) */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-black text-[10px] flex items-center justify-center">
                                {chal.creatorAvatar}
                              </span>
                              <span className="font-black text-slate-900 dark:text-white">
                                You (Day {chal.userDay}/{chal.totalDays})
                              </span>
                              {chal.userCheckedInToday ? (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" /> Checked in today
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                  ⏳ Needs check-in
                                </span>
                              )}
                            </div>
                            <span className="font-black text-slate-700 dark:text-slate-300">
                              🔥 {chal.userStreak}d Streak ({userPct}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-[#FF6A45] rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, userPct)}%` }}
                            />
                          </div>
                        </div>

                        {/* Player 2 (Opponent) */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-400 text-white font-black text-[10px] flex items-center justify-center">
                                {chal.opponentAvatar || "OP"}
                              </span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                {chal.opponentName} (Day {chal.opponentDay}/{chal.totalDays})
                              </span>
                              {chal.opponentCheckedInToday ? (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" /> Checked in
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400">
                                  Pending today
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-slate-500">
                              🔥 {chal.opponentStreak || 0}d Streak ({opponentPct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, opponentPct)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* GROUP SQUAD LEADERBOARD */
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
                          <span>Squad Leaderboard ({chal.groupName})</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">
                            {chal.participants?.length || 4} Active Warriors
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {chal.participants?.map((p, idx) => {
                            const pPct = Math.round((p.currentDay / chal.totalDays) * 100);
                            return (
                              <div
                                key={p.id}
                                className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-slate-400 w-4">#{idx + 1}</span>
                                  <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6A45] font-black text-[10px] flex items-center justify-center">
                                    {p.avatar}
                                  </span>
                                  <span className="font-black text-slate-900 dark:text-white">
                                    {p.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[11px] font-bold text-slate-500">
                                    Day {p.currentDay}/{chal.totalDays}
                                  </span>
                                  <span className="text-[11px] font-black text-orange-600 dark:text-orange-400">
                                    🔥 {p.streak}d
                                  </span>
                                  {p.checkedInToday ? (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60">
                                      ✓ Done
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 dark:bg-slate-700">
                                      Pending
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ACTION BAR: Check In Today */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-400">
                        {chal.userCheckedInToday ? "✓ You are on track for today!" : "⚠️ Log today's target to maintain your streak"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChallengeCheckIn(chal.id)}
                        disabled={chal.userCheckedInToday}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          chal.userCheckedInToday
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 cursor-default"
                            : "bg-[#FF6A45] hover:bg-[#EA580C] text-white shadow-xs active:scale-95"
                        }`}
                      >
                        {chal.userCheckedInToday ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Checked In Today (+1 Day)</span>
                          </>
                        ) : (
                          <>
                            <Flame className="w-4 h-4" />
                            <span>✓ Check In Today (+1 Day Streak)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* [RESOLUTION TAB]: Start a New Resolution, Shared Pledges & Milestones */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === "resolution" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Action Bar & Create Resolution */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Life Resolutions & Transformation Hub
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600">
                  Shared Pledges
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Start a personal or public resolution, commit together with cohort pledges, and track milestone checkpoints.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setResolutionFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    resolutionFilter === "all" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs" : "text-slate-500"
                  }`}
                >
                  All ({resolutions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setResolutionFilter("my")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    resolutionFilter === "my" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs" : "text-slate-500"
                  }`}
                >
                  🎯 My Pledges
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateResolutionModalOpen(true)}
                className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Start New Resolution</span>
              </button>
            </div>
          </div>

          {/* Resolutions Grid */}
          <div className="space-y-3.5">
            {resolutions
              .filter((r) => (resolutionFilter === "my" ? r.isUserPledged : true))
              .map((res) => {
                const resPercent = Math.round((res.daysCompleted / res.daysTotal) * 100);

                return (
                  <div
                    key={res.id}
                    className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4 hover:border-rose-200 dark:hover:border-rose-900/60 transition-all"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200">
                            {res.category} Transformation
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            • Target: {res.targetDate} ({res.daysTotal} Days)
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          {res.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Created by <strong className="text-slate-700 dark:text-slate-300">{res.author}</strong> • {res.pledgedCount} community members pledged
                        </p>
                      </div>

                      {/* JOIN & PLEDGE RESOLUTION BUTTON */}
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <button
                          type="button"
                          onClick={() => handlePledgeResolution(res.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                            res.isUserPledged
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600"
                          }`}
                        >
                          <Target className="w-3.5 h-3.5" />
                          <span>{res.isUserPledged ? "✓ Pledged" : "🤝 Join & Pledge"}</span>
                          <span className="text-[10px] opacity-75 font-normal">({res.pledgedCount})</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Milestones */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-slate-700 dark:text-slate-300">
                          Progress: Day {res.daysCompleted} of {res.daysTotal} Days ({resPercent}%)
                        </span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          {res.daysTotal - res.daysCompleted} days remaining
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, resPercent)}%` }}
                        />
                      </div>

                      {/* Milestone Checkpoints */}
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Accountability Milestones ({res.milestones.length})
                        </p>
                        <div className="space-y-1">
                          {res.milestones.map((m, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 text-xs p-2 rounded-xl border ${
                                idx <= res.currentMilestoneIndex
                                  ? "bg-white dark:bg-slate-800 border-rose-200/80 dark:border-rose-900/60 font-bold text-slate-900 dark:text-white"
                                  : "bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 text-slate-400"
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-[10px] font-black shrink-0">
                                {idx <= res.currentMilestoneIndex ? "✓" : idx + 1}
                              </span>
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions: Cheer & Check In */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleCheerResolution(res.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          res.isUserCheered
                            ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${res.isUserCheered ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span>Cheer ({res.cheersCount})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResolutionCheckIn(res.id)}
                        disabled={res.checkedInToday}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          res.checkedInToday
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 cursor-default"
                            : "bg-rose-500 hover:bg-rose-600 text-white shadow-xs active:scale-95"
                        }`}
                      >
                        {res.checkedInToday ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Checked In Today</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>✓ Check In Today (+1 Day)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* [COMMUNITY TAB]: Circles, Hubs & Support Groups */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === "community" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Search & Category Filter */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-2xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circles (Elderly Care, Yoga, Gardening, Neighborhood...)"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder:text-slate-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {[
                { id: "all", label: "All Hubs" },
                { id: "health", label: "🩺 Health & Care" },
                { id: "wellness", label: "🧘 Wellness & Yoga" },
                { id: "family", label: "👶 Family & Kids" },
                { id: "local", label: "🏡 Neighborhood" },
                { id: "productivity", label: "📄 Paperless & Tech" },
                { id: "lifestyle", label: "🌿 Garden & Nature" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCircleCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCircleCategory === cat.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Circles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredCircles.map((circle) => {
              const isJoined = joinedCircleIds.includes(circle.id);
              return (
                <div
                  key={circle.id}
                  onClick={() => onNavigateToCareSubTab?.(circle.subTab)}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-orange-300 dark:hover:border-orange-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl p-2 rounded-2xl bg-orange-50 dark:bg-slate-800 border border-orange-100 dark:border-slate-700">
                        {circle.icon}
                      </span>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60">
                        {circle.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#FF6A45] transition-colors">
                        {circle.name}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400 block mt-0.5">
                        {circle.members}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {circle.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF6A45] group-hover:underline flex items-center gap-1">
                      Open Hub <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleJoinCircle(circle.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                        isJoined
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                          : "bg-orange-50 dark:bg-slate-800 hover:bg-[#FF6A45] hover:text-white text-[#EA580C]"
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Joined
                        </>
                      ) : (
                        "+ Join Circle"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* [FEED TAB]: Live Updates, Stories, Milestones & Share Post */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === "feed" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Quick Post Box */}
          <form
            onSubmit={handleCreatePost}
            className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Create Community Post
              </h3>
              <div className="flex items-center gap-1">
                {["💬 Update", "🏆 Milestone", "🩺 Advice", "❓ Question"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNewPostTag(tag)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      newPostTag === tag
                        ? "bg-[#FF6A45] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={2}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share a health milestone, post a challenge, or neighborhood update..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-white placeholder:text-slate-400 resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("challenge");
                    setIsCreateChallengeModalOpen(true);
                  }}
                  className="text-[11px] font-black text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>⚡ Post a Challenge</span>
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("resolution");
                    setIsCreateResolutionModalOpen(true);
                  }}
                  className="text-[11px] font-black text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>🎯 Start Resolution</span>
                </button>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF6A45] hover:bg-[#EA580C] text-white text-xs font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Post Now
              </button>
            </div>
          </form>

          {/* Posts list */}
          <div className="space-y-3.5">
            {feedPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-slate-800 text-[#FF6A45] font-black text-xs flex items-center justify-center border border-orange-200/60 dark:border-slate-700">
                      {post.avatar}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {post.author}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {post.role} • {post.time}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {post.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Challenge prompt button if attached */}
                {post.challengePrompt && (
                  <div className="p-2.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-900 dark:text-orange-200">
                      <span>🏆 Active Challenge:</span>
                      <span>{post.challengePrompt}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("challenge")}
                      className="px-2.5 py-1 bg-[#FF6A45] text-white rounded-lg text-xs font-black hover:bg-[#EA580C] cursor-pointer"
                    >
                      View & Duel →
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                      post.isLiked ? "text-rose-500" : "hover:text-slate-700"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.isLiked ? "fill-rose-500" : ""}`} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.comments} Comments</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast("Link copied to clipboard!")}
                      className="flex items-center gap-1 hover:text-slate-700 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* [CHAT TAB]: Doctor, Family Caregivers & AI Health Concierge */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === "chat" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 animate-in fade-in duration-200">
          {/* Threads List Sidebar */}
          <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider px-1">
              Active Conversations ({chatThreads.length})
            </h3>
            <div className="space-y-1">
              {chatThreads.map((thread) => {
                const isSelected = thread.id === activeChatId;
                return (
                  <div
                    key={thread.id}
                    onClick={() => setActiveChatId(thread.id)}
                    className={`p-2.5 rounded-2xl cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
                    }`}
                  >
                    <div className="relative">
                      <span className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                        {thread.avatar}
                      </span>
                      {thread.online && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border-2 border-white dark:border-slate-900" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {thread.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {thread.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {thread.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation Area */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between min-h-[420px]">
            {/* Chat Header */}
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-orange-100 text-[#FF6A45] font-black text-xs flex items-center justify-center">
                  {activeChat.avatar}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {activeChat.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      {activeChat.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">{activeChat.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast(`Initiating secure call with ${activeChat.name}...`)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#FF6A45]" />
                <span className="hidden sm:inline">Audio Call</span>
              </button>
            </div>

            {/* Messages Stream */}
            <div className="py-4 space-y-3 flex-1 overflow-y-auto max-h-72">
              {activeChat.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.isMe
                        ? "bg-[#FF6A45] text-white rounded-br-none"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none"
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${activeChat.name}...`}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#FF6A45] hover:bg-[#EA580C] text-white font-black cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: POST A NEW CHALLENGE */}
      {/* ========================================================================= */}
      {isCreateChallengeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚔️</span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Post a New Challenge
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Anyone can copy, carry on, or duel you in daily progress
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateChallengeModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 21-Day 10,000 Steps Duel, Zero Sugar Sprint"
                  value={newChallengeTitle}
                  onChange={(e) => setNewChallengeTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Daily Target Metric *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10,000 Steps, 2.5L Water"
                    value={newChallengeDailyTarget}
                    onChange={(e) => setNewChallengeDailyTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Duration (Days)
                  </label>
                  <select
                    value={newChallengeTotalDays}
                    onChange={(e) => setNewChallengeTotalDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white font-bold"
                  >
                    <option value={7}>7 Days (1 Week Sprint)</option>
                    <option value={14}>14 Days (2 Weeks Habit)</option>
                    <option value={21}>21 Days (Habit Master)</option>
                    <option value={30}>30 Days (1 Month Transformation)</option>
                    <option value={60}>60 Days (Bi-Monthly Quest)</option>
                    <option value={90}>90 Days (Quarterly Peak)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Challenge Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewChallengeMode("duel")}
                    className={`p-2.5 rounded-xl border text-center font-black cursor-pointer transition-all ${
                      newChallengeMode === "duel"
                        ? "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-400 shadow-2xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    ⚔️ 1-on-1 Duel
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewChallengeMode("group")}
                    className={`p-2.5 rounded-xl border text-center font-black cursor-pointer transition-all ${
                      newChallengeMode === "group"
                        ? "bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-400 shadow-2xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    👥 Group / Squad Challenge
                  </button>
                </div>
              </div>

              {newChallengeMode === "duel" ? (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Challenger / Opponent Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera, Dr. Jenkins, Open to anyone"
                    value={newChallengeOpponent}
                    onChange={(e) => setNewChallengeOpponent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Squad / Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cardio Warriors, Early Riser Guild"
                    value={newChallengeGroupName}
                    onChange={(e) => setNewChallengeGroupName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Reward / Trophy Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🏆 Gold Champion Badge + Smoothies"
                  value={newChallengeReward}
                  onChange={(e) => setNewChallengeReward(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateChallengeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF6A45] hover:bg-[#EA580C] text-white font-black shadow-xs cursor-pointer"
                >
                  Launch Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: START A NEW RESOLUTION */}
      {/* ========================================================================= */}
      {isCreateResolutionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Start a New Resolution
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Commit to a long-term goal with accountability milestones
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateResolutionModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResolution} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Resolution Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Blood Pressure & Lose 10kg, Zero Debt in 2026"
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={newResCategory}
                    onChange={(e) => setNewResCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white font-bold"
                  >
                    <option value="health">🩺 Health & Care</option>
                    <option value="finance">💰 Finance & Debt</option>
                    <option value="mindset">🧠 Mindset & Peace</option>
                    <option value="fitness">🏋️ Fitness & Body</option>
                    <option value="career">💼 Career & Growth</option>
                    <option value="family">👨‍👩‍👧‍👦 Family & Kinship</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Commitment Timeline
                  </label>
                  <select
                    value={newResDaysTotal}
                    onChange={(e) => setNewResDaysTotal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white font-bold"
                  >
                    <option value={90}>90 Days (Quarterly Focus)</option>
                    <option value={180}>180 Days (Half Year Transformation)</option>
                    <option value={365}>365 Days (Full Year Resolution)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Key Milestones (1 per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={"Phase 1: Build consistent 30-day base\nPhase 2: Measurable metric progress\nPhase 3: Final sustained triumph"}
                  value={newResMilestones}
                  onChange={(e) => setNewResMilestones(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateResolutionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black shadow-xs cursor-pointer"
                >
                  Start Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
