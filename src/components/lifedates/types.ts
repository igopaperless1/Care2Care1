export type LifeDatesTab =
  | "dashboard"
  | "calendar"
  | "upcoming"
  | "event_details"
  | "memories"
  | "reminders"
  | "categories"
  | "couple_goals"
  | "analytics"
  | "quotes"
  | "gift_ideas"
  | "settings"
  | "people";

export interface LifePerson {
  id: string;
  name: string;
  relationship: "Partner" | "Self" | "Spouse" | "Child" | "Parent" | "Grandparent" | "Sibling" | "Best Friend" | "Friend" | "Family" | "Other";
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  dateOfBirthBS?: string;
  tithiBirth?: string;
  spouseId?: string;
  avatarUrl?: string;
  notes?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export type EventCategory =
  | "Anniversary"
  | "Birthday"
  | "Special Day"
  | "Personal Milestone"
  | "Couple Goal"
  | "Cultural & Ritual"
  | "Career & Growth"
  | "Custom Event";

export interface LifeEventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // e.g. "2025-05-24" or "24 May 2025"
  originalYear?: number; // e.g. 2020 (for 5th anniversary)
  daysLeft: number;
  repeat: "Yearly" | "Monthly" | "Weekly" | "Once" | "Custom";
  personId?: string;
  personName?: string;
  relationship?: string;
  reminderNotice: string; // e.g. "1 Day Before at 9:00 AM"
  reminderEnabled: boolean;
  notes?: string;
  location?: string;
  tags?: string[];
  bannerUrl?: string;
  dateBS?: string;
  tithi?: string;
  color?: string;
  isCompleted?: boolean;
}

export interface MemoryItem {
  id: string;
  eventId?: string;
  eventTitle?: string;
  title: string;
  date: string;
  type: "photo" | "video" | "note";
  mediaUrl: string;
  caption?: string;
  location?: string;
  likes?: number;
}

export interface CoupleGoalItem {
  id: string;
  title: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit?: string;
  progressPercent: number;
  status: "active" | "completed";
  targetDate?: string;
  notes?: string;
}

export interface LifeQuoteItem {
  id: string;
  quote: string;
  author: string;
  category: "For You" | "Love" | "Motivation" | "Life";
  isFavorite: boolean;
  date?: string;
}

export interface GiftIdeaItem {
  id: string;
  title: string;
  description: string;
  category: "For Him" | "For Her" | "For Both";
  priceRange: "$" | "$$" | "$$$" | "Free / DIY";
  iconName: string;
  tags: string[];
  buyLink?: string;
  isBookmarked: boolean;
}

export interface ReminderSettingItem {
  id: string;
  eventTitle: string;
  eventDate: string;
  noticeTime: string;
  enabled: boolean;
  category: EventCategory;
}
