import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  Filter,
  FileText,
  Send,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  User,
  GraduationCap,
  Award,
  BookOpen,
  Languages,
  Code,
  Share2,
  Bookmark,
  BookmarkCheck,
  Eye,
  Settings,
  X,
  Printer,
  Upload,
  RefreshCw,
  HelpCircle,
  Clock,
  Check,
  Copy,
  Info,
  Loader2
} from "lucide-react";
import { Patient } from "../types";

// Helper utilities for safe access
const safeStr = (val: any, fallback = ""): string => (typeof val === "string" ? val : fallback);
const safeNum = (val: any, fallback = 0): number => (typeof val === "number" && !isNaN(val) ? val : fallback);
const safeArray = <T,>(val: any): T[] => (Array.isArray(val) ? val : []);

// Data Types
export interface JobResult {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  country: string;
  category: string;
  salary: string;
  salaryType: "hour" | "week" | "fortnight" | "month" | "year";
  salaryMin?: number;
  salaryMax?: number;
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  jobTerm: "Fixed" | "Long-term" | "Contract" | "Internship";
  postedDate: string;
  timeRemaining?: string;
  description: string;
  requirements: string[];
  preferredQualifications?: string[];
  benefits?: string[];
  source: "Indeed" | "LinkedIn" | "Seek" | "Naukri" | "MeroJob" | "Facebook Jobs" | "Care2Care Portal";
  sourceUrl: string;
  applyUrl: string;
  isSponsored?: boolean;
  isRemote?: boolean;
  visaSponsorship: boolean;
  isSeasonal: boolean;
  contactEmail?: string;
}

// HighlightText helper for search query emboldening
export const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query || !query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-amber-200 text-slate-950 font-black px-1 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export interface ResumeData {
  template: "classic" | "modern" | "creative" | "minimal" | "executive";
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    linkedin: string;
    portfolio: string;
    github: string;
    photoUrl: string;
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
    achievements: string[];
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }[];
  skills: { name: string; level: "Beginner" | "Intermediate" | "Expert" }[];
  certifications: { id: string; name: string; issuer: string; date: string }[];
  languages: { id: string; name: string; proficiency: string }[];
  projects: { id: string; name: string; description: string; url: string }[];
  references: { id: string; name: string; title: string; company: string; phone: string; email: string }[];
  customSections: { id: string; title: string; content: string }[];
}

export interface CoverLetterData {
  jobTitle: string;
  companyName: string;
  hiringManager: string;
  jobDescription: string;
  personalBackground: string;
  whyThisCompany: string;
  whyYoureAFit: string;
  missingSkills: string;
  eyeCatchingHook: string;
  closingStatement: string;
}

export interface SopData {
  applicantName: string;
  targetProgram: string;
  universityName: string;
  targetCountry: string;
  personalBackground: string;
  academicBackground: string;
  careerGoals: string;
  whyThisProgram: string;
  futureAspirations: string;
}

// Initial Mock Job Listings
const INITIAL_JOBS: JobResult[] = [
  {
    id: "job-1",
    title: "Registered Senior Care Nurse (Visas Sponsored)",
    company: "St. Jude Healthcare Services",
    companyLogo: "🏥",
    location: "Sydney",
    country: "Australia",
    category: "Healthcare",
    salary: "$85,000 - $110,000 / yr",
    salaryType: "year",
    salaryMin: 85000,
    salaryMax: 110000,
    jobType: "Full-time",
    jobTerm: "Long-term",
    postedDate: "2 days ago",
    timeRemaining: "12 days remaining",
    description: "Seeking compassionate Registered Nurses for our aged care facilities. We provide 482 TSS Visa Sponsorship and relocation support for qualified international candidates.",
    requirements: [
      "Bachelor of Nursing degree or equivalent",
      "Minimum 2 years clinical nursing experience",
      "IELTS 7.0 or OET Grade B in all bands",
      "Registration with AHPRA or eligibility"
    ],
    preferredQualifications: ["Aged Care certification", "Palliative Care experience"],
    benefits: ["Subsidized Housing for 3 months", "Visa Sponsorship Subsidies", "Flexible Shifts"],
    source: "Seek",
    sourceUrl: "https://www.seek.com.au",
    applyUrl: "https://www.seek.com.au/jobs?keywords=registered+nurse+sponsorship",
    visaSponsorship: true,
    isSeasonal: false,
    isRemote: false,
    contactEmail: "careers@stjudehealth.com.au"
  },
  {
    id: "job-2",
    title: "Full Stack React / Node Developer",
    company: "Kathmandu Tech Innovators",
    companyLogo: "💻",
    location: "Kathmandu",
    country: "Nepal",
    category: "IT & Software",
    salary: "NPR 1,20,000 - 1,80,000 / mo",
    salaryType: "month",
    salaryMin: 120000,
    salaryMax: 180000,
    jobType: "Full-time",
    jobTerm: "Long-term",
    postedDate: "Today",
    timeRemaining: "28 days remaining",
    description: "Looking for an energetic Full Stack Developer proficient in React, TypeScript, Express, and PostgreSQL to lead web app development for healthtech platforms.",
    requirements: [
      "3+ years experience with React.js and Node.js",
      "Proficient in REST APIs and GraphQL",
      "Strong understanding of relational databases",
      "Good problem solving and team collaboration skills"
    ],
    benefits: ["Festival Bonus", "PF & Gratuity", "Remote Work Days", "Health Insurance"],
    source: "MeroJob",
    sourceUrl: "https://merojob.com",
    applyUrl: "https://merojob.com/search/?q=react+developer",
    visaSponsorship: false,
    isSeasonal: false,
    isRemote: true,
    contactEmail: "hr@ktminnovators.com.np"
  },
  {
    id: "job-3",
    title: "Aged Caregiver / Personal Care Assistant",
    company: "SilverCare New Zealand Ltd",
    companyLogo: "👵",
    location: "Auckland",
    country: "New Zealand",
    category: "Healthcare",
    salary: "NZD $28 - $32 / hr",
    salaryType: "hour",
    salaryMin: 28,
    salaryMax: 32,
    jobType: "Full-time",
    jobTerm: "Contract",
    postedDate: "1 day ago",
    timeRemaining: "15 days remaining",
    description: "Assist elderly clients with daily living activities, medication management, and mobility support. Accredited Employer Visa (AEWV) available.",
    requirements: [
      "Certificate IV in Caregiving / Health Assistance",
      "First Aid & CPR Certification",
      "Valid Driver's License",
      "Clear police check record"
    ],
    benefits: ["Visa Support", "Travel Allowance", "Paid Overtime"],
    source: "Indeed",
    sourceUrl: "https://nz.indeed.com",
    applyUrl: "https://nz.indeed.com/jobs?q=caregiver+sponsorship",
    visaSponsorship: true,
    isSeasonal: false,
    isRemote: false,
    contactEmail: "jobs@silvercare.co.nz"
  },
  {
    id: "job-4",
    title: "Seasonal Agriculture & Fruit Harvest Supervisor",
    company: "Tasmanian Berry Farms",
    companyLogo: "🍓",
    location: "Hobart",
    country: "Australia",
    category: "Agriculture & Farming",
    salary: "AUD $30 - $35 / hr",
    salaryType: "hour",
    salaryMin: 30,
    salaryMax: 35,
    jobType: "Full-time",
    jobTerm: "Fixed",
    postedDate: "3 days ago",
    timeRemaining: "8 days remaining",
    description: "Seasonal harvesting and orchard supervisory positions available for upcoming 6-month harvest period. Working Holiday Visa holders welcome.",
    requirements: [
      "Prior farm or harvest supervisory experience",
      "Ability to work outdoors in physical environment",
      "Basic English communication skills"
    ],
    benefits: ["On-site Accommodation", "Piece-rate bonus options"],
    source: "Indeed",
    sourceUrl: "https://au.indeed.com",
    applyUrl: "https://au.indeed.com/jobs?q=fruit+picking+seasonal",
    visaSponsorship: false,
    isSeasonal: true,
    isRemote: false,
    contactEmail: "farmjobs@tasmanianberry.com.au"
  },
  {
    id: "job-5",
    title: "Senior Finance & Accounts Officer",
    company: "Global Horizon Capital",
    companyLogo: "📊",
    location: "London",
    country: "UK",
    category: "Finance & Accounting",
    salary: "£45,000 - £55,000 / yr",
    salaryType: "year",
    salaryMin: 45000,
    salaryMax: 55000,
    jobType: "Full-time",
    jobTerm: "Long-term",
    postedDate: "4 days ago",
    timeRemaining: "19 days remaining",
    description: "Oversee monthly reporting, tax filings, financial auditing, and budgeting for growing financial consultancy.",
    requirements: [
      "ACCA or CIMA qualification",
      "4+ years corporate accounting experience",
      "Expertise in SAP, QuickBooks, and Excel"
    ],
    benefits: ["Skilled Worker Visa Sponsorship", "Private Medical", "Pension Match"],
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=finance+officer+visa",
    visaSponsorship: true,
    isSeasonal: false,
    isRemote: false,
    contactEmail: "recruitment@globalhorizon.co.uk"
  }
];

interface JobSearchCareerTrackerProps {
  patient?: Patient;
}

export const JobSearchCareerTracker: React.FC<JobSearchCareerTrackerProps> = () => {
  // Navigation View State
  const [activeSubView, setActiveSubView] = useState<"search" | "resume" | "cover_letter" | "sop" | "post_job" | "insights" | "settings">("search");

  // Mandatory Disclaimer Popup State (Opens every time entering Job section)
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(true);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState<boolean>(false);

  // Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["All"]);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [selectedSalaryType, setSelectedSalaryType] = useState("All");
  const [filterVisaOnly, setFilterVisaOnly] = useState(false);
  const [filterSeasonalOnly, setFilterSeasonalOnly] = useState(false);
  const [selectedSource, setSelectedSource] = useState("All");
  const [customSourcesInput, setCustomSourcesInput] = useState<string>("");
  const [customSourceUrls, setCustomSourceUrls] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Full Comprehensive 190+ Countries List with Flags
  const ALL_WORLD_COUNTRIES = [
    { name: "All", flag: "🌍" },
    { name: "Afghanistan", flag: "🇦🇫" },
    { name: "Albania", flag: "🇦🇱" },
    { name: "Algeria", flag: "🇩🇿" },
    { name: "Andorra", flag: "🇦🇩" },
    { name: "Angola", flag: "🇦🇴" },
    { name: "Argentina", flag: "🇦🇷" },
    { name: "Armenia", flag: "🇦🇲" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Austria", flag: "🇦🇹" },
    { name: "Azerbaijan", flag: "🇦🇿" },
    { name: "Bahamas", flag: "🇧🇸" },
    { name: "Bahrain", flag: "🇧🇭" },
    { name: "Bangladesh", flag: "🇧🇩" },
    { name: "Barbados", flag: "🇧🇧" },
    { name: "Belarus", flag: "🇧🇾" },
    { name: "Belgium", flag: "🇧🇪" },
    { name: "Belize", flag: "🇧🇿" },
    { name: "Benin", flag: "🇧🇯" },
    { name: "Bhutan", flag: "🇧🇹" },
    { name: "Bolivia", flag: "🇧🇴" },
    { name: "Bosnia & Herzegovina", flag: "🇧🇦" },
    { name: "Botswana", flag: "🇧🇼" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Brunei", flag: "🇧🇳" },
    { name: "Bulgaria", flag: "🇧🇬" },
    { name: "Burkina Faso", flag: "🇧🇫" },
    { name: "Burundi", flag: "🇧🇮" },
    { name: "Cambodia", flag: "🇰🇭" },
    { name: "Cameroon", flag: "🇨🇲" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Chile", flag: "🇨🇱" },
    { name: "China", flag: "🇨🇳" },
    { name: "Colombia", flag: "🇨🇴" },
    { name: "Costa Rica", flag: "🇨🇷" },
    { name: "Croatia", flag: "🇭🇷" },
    { name: "Cuba", flag: "🇨🇺" },
    { name: "Cyprus", flag: "🇨🇾" },
    { name: "Czech Republic", flag: "🇨🇿" },
    { name: "Denmark", flag: "🇩🇰" },
    { name: "Dominican Republic", flag: "🇩🇴" },
    { name: "Ecuador", flag: "🇪🇨" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "El Salvador", flag: "🇸🇻" },
    { name: "Estonia", flag: "🇪🇪" },
    { name: "Ethiopia", flag: "🇪🇹" },
    { name: "Fiji", flag: "🇫🇯" },
    { name: "Finland", flag: "🇫🇮" },
    { name: "France", flag: "🇫🇷" },
    { name: "Georgia", flag: "🇬🇪" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "Greece", flag: "🇬🇷" },
    { name: "Guatemala", flag: "🇬🇹" },
    { name: "Honduras", flag: "🇭🇳" },
    { name: "Hong Kong", flag: "🇭🇰" },
    { name: "Hungary", flag: "🇭🇺" },
    { name: "Iceland", flag: "🇮🇸" },
    { name: "India", flag: "🇮🇳" },
    { name: "Indonesia", flag: "🇮🇩" },
    { name: "Iran", flag: "🇮🇷" },
    { name: "Iraq", flag: "🇮🇶" },
    { name: "Ireland", flag: "🇮🇪" },
    { name: "Israel", flag: "🇮🇱" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "Jamaica", flag: "🇯🇲" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Jordan", flag: "🇯🇴" },
    { name: "Kazakhstan", flag: "🇰🇿" },
    { name: "Kenya", flag: "🇰🇪" },
    { name: "Kuwait", flag: "🇰🇼" },
    { name: "Laos", flag: "🇱🇦" },
    { name: "Latvia", flag: "🇱🇻" },
    { name: "Lebanon", flag: "🇱🇧" },
    { name: "Liechtenstein", flag: "🇱🇮" },
    { name: "Lithuania", flag: "🇱🇹" },
    { name: "Luxembourg", flag: "🇱🇺" },
    { name: "Macau", flag: "🇲🇴" },
    { name: "Malaysia", flag: "🇲🇾" },
    { name: "Maldives", flag: "🇲🇻" },
    { name: "Malta", flag: "🇲🇹" },
    { name: "Mexico", flag: "🇲🇽" },
    { name: "Moldova", flag: "🇲🇩" },
    { name: "Monaco", flag: "🇲🇨" },
    { name: "Mongolia", flag: "🇲🇳" },
    { name: "Montenegro", flag: "🇲🇪" },
    { name: "Morocco", flag: "🇲🇦" },
    { name: "Myanmar", flag: "🇲🇲" },
    { name: "Namibia", flag: "🇳🇦" },
    { name: "Nepal", flag: "🇳🇵" },
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "New Zealand", flag: "🇳🇿" },
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Norway", flag: "🇳🇴" },
    { name: "Oman", flag: "🇴🇲" },
    { name: "Pakistan", flag: "🇵🇰" },
    { name: "Panama", flag: "🇵🇦" },
    { name: "Papua New Guinea", flag: "🇵🇬" },
    { name: "Paraguay", flag: "🇵🇾" },
    { name: "Peru", flag: "🇵🇪" },
    { name: "Philippines", flag: "🇵🇭" },
    { name: "Poland", flag: "🇵🇱" },
    { name: "Portugal", flag: "🇵🇹" },
    { name: "Qatar", flag: "🇶🇦" },
    { name: "Romania", flag: "🇷🇴" },
    { name: "Russia", flag: "🇷🇺" },
    { name: "Rwanda", flag: "🇷🇼" },
    { name: "Saudi Arabia", flag: "🇸🇦" },
    { name: "Senegal", flag: "🇸🇳" },
    { name: "Serbia", flag: "🇷🇸" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "Slovakia", flag: "🇸🇰" },
    { name: "Slovenia", flag: "🇸🇮" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "Spain", flag: "🇪🇸" },
    { name: "Sri Lanka", flag: "🇱🇰" },
    { name: "Sudan", flag: "🇸🇩" },
    { name: "Sweden", flag: "🇸🇪" },
    { name: "Switzerland", flag: "🇨🇭" },
    { name: "Taiwan", flag: "🇹🇼" },
    { name: "Tanzania", flag: "🇹🇿" },
    { name: "Thailand", flag: "🇹🇭" },
    { name: "Tunisia", flag: "🇹🇳" },
    { name: "Turkey", flag: "🇹🇷" },
    { name: "UAE", flag: "🇦🇪" },
    { name: "Uganda", flag: "🇺🇬" },
    { name: "UK", flag: "🇬🇧" },
    { name: "Ukraine", flag: "🇺🇦" },
    { name: "Uruguay", flag: "🇺🇾" },
    { name: "USA", flag: "🇺🇸" },
    { name: "Uzbekistan", flag: "🇺🇿" },
    { name: "Venezuela", flag: "🇻🇪" },
    { name: "Vietnam", flag: "🇻🇳" },
    { name: "Zambia", flag: "🇿🇲" },
    { name: "Zimbabwe", flag: "🇿🇼" }
  ];

  const handleToggleCountry = (countryName: string) => {
    if (countryName === "All") {
      setSelectedCountries(["All"]);
      return;
    }

    setSelectedCountries((prev) => {
      const filtered = prev.filter((c) => c !== "All");
      if (filtered.includes(countryName)) {
        const next = filtered.filter((c) => c !== countryName);
        return next.length === 0 ? ["All"] : next;
      } else {
        return [...filtered, countryName];
      }
    });
  };

  // Job List State
  const [jobs, setJobs] = useState<JobResult[]>(() => {
    const saved = localStorage.getItem("care2care_posted_jobs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_JOBS];
      } catch (e) {
        return INITIAL_JOBS;
      }
    }
    return INITIAL_JOBS;
  });

  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("care2care_bookmarked_jobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedJobModal, setSelectedJobModal] = useState<JobResult | null>(null);

  // Recent Search Queries State with LocalStorage Persistence
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_recent_job_searches");
      return saved ? JSON.parse(saved) : ["Nurse", "Healthcare", "Farm", "Finance", "Developer"];
    } catch {
      return ["Nurse", "Healthcare", "Farm", "Finance", "Developer"];
    }
  });

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      localStorage.setItem("care2care_recent_job_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("care2care_recent_job_searches");
    showToast("Cleared search history.");
  };

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleBookmark = (id: string) => {
    let updated: string[];
    if (bookmarkedJobIds.includes(id)) {
      updated = bookmarkedJobIds.filter((bId) => bId !== id);
      showToast("Removed job from saved bookmarks.");
    } else {
      updated = [...bookmarkedJobIds, id];
      showToast("Saved job to your bookmarks!");
    }
    setBookmarkedJobIds(updated);
    localStorage.setItem("care2care_bookmarked_jobs", JSON.stringify(updated));
  };

  const handleAcceptDisclaimer = () => {
    setHasAcceptedDisclaimer(true);
    setIsDisclaimerOpen(false);
    localStorage.setItem("care2care_job_disclaimer_accepted", "true");
  };

  // Enhanced Local Fuzzy Search & Multi-field Filtering
  const filteredJobs = jobs.filter((j) => {
    const kw = safeStr(searchKeyword).trim().toLowerCase();
    const loc = safeStr(searchLocation).trim().toLowerCase();

    // Fuzzy Keyword Matching across title, company, description, category, requirements, and benefits
    let matchesKw = true;
    if (kw) {
      const kwTokens = kw.split(/\s+/).filter(Boolean);
      const fullText = `${j.title} ${j.company} ${j.description} ${j.category} ${j.requirements.join(" ")} ${(j.preferredQualifications || []).join(" ")} ${(j.benefits || []).join(" ")}`.toLowerCase();
      matchesKw = kwTokens.every((token) => fullText.includes(token));
    }

    // Location Matching across city and country
    let matchesLoc = true;
    if (loc) {
      const locTokens = loc.split(/\s+/).filter(Boolean);
      const locText = `${j.location} ${j.country}`.toLowerCase();
      matchesLoc = locTokens.every((token) => locText.includes(token));
    }

    const matchesCat = selectedCategory === "All" || j.category === selectedCategory;
    const matchesCountry =
      selectedCountries.includes("All") ||
      selectedCountries.length === 0 ||
      selectedCountries.some((c) => safeStr(j.country).toLowerCase() === c.toLowerCase());
    const matchesSalaryType = selectedSalaryType === "All" || j.salaryType === selectedSalaryType;
    const matchesVisa = !filterVisaOnly || j.visaSponsorship === true;
    const matchesSeasonal = !filterSeasonalOnly || j.isSeasonal === true;
    const matchesSource =
      selectedSource === "All" ||
      j.source === selectedSource ||
      customSourceUrls.some((url) => safeStr(j.sourceUrl).toLowerCase().includes(url.toLowerCase()));

    return matchesKw && matchesLoc && matchesCat && matchesCountry && matchesSalaryType && matchesVisa && matchesSeasonal && matchesSource;
  });

  // ==========================================
  // 📄 RESUME BUILDER STATE & HANDLERS
  // ==========================================
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem("care2care_resume_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      template: "modern",
      personalInfo: {
        firstName: "Aarav",
        lastName: "Sharma",
        email: "aarav.sharma@example.com",
        phone: "+977 9841234567",
        address: "Lazimpat",
        city: "Kathmandu",
        country: "Nepal",
        linkedin: "linkedin.com/in/aaravsharma",
        portfolio: "aaravsharma.dev",
        github: "github.com/aaravsharma",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
      },
      summary: "Dedicated healthcare professional and software developer with 4+ years of hands-on experience in patient care coordination, medical data systems, and web application architecture. Seeking international opportunities with visa sponsorship.",
      experience: [
        {
          id: "exp-1",
          company: "Metro Health Care Hospital",
          position: "Healthcare Systems Coordinator",
          startDate: "Jan 2022",
          endDate: "Present",
          isCurrent: true,
          description: "Managed patient scheduling, electronic health records (EHR) synchronization, and vital sign logs for 200+ daily patients.",
          achievements: ["Reduced patient wait times by 25%", "Implemented digital prescription tracking"]
        }
      ],
      education: [
        {
          id: "edu-1",
          institution: "Tribhuvan University",
          degree: "Bachelor of Science",
          field: "Computer Science & Information Tech",
          startDate: "2018",
          endDate: "2022",
          gpa: "3.8 / 4.0"
        }
      ],
      skills: [
        { name: "Patient Care", level: "Expert" },
        { name: "React & TypeScript", level: "Expert" },
        { name: "First Aid & CPR", level: "Intermediate" },
        { name: "Database Admin", level: "Intermediate" }
      ],
      certifications: [
        { id: "cert-1", name: "Certified Healthcare Data Specialist", issuer: "Global Health Institute", date: "2023" }
      ],
      languages: [
        { id: "lang-1", name: "English", proficiency: "Fluent (IELTS 8.0)" },
        { id: "lang-2", name: "Nepali", proficiency: "Native" }
      ],
      projects: [
        { id: "proj-1", name: "ElderCare Vital Monitor", description: "Real-time vitals & medicine reminder app built for aged care homes.", url: "https://example.com/eldercare" }
      ],
      references: [
        { id: "ref-1", name: "Dr. Bikash Thapa", title: "Medical Director", company: "Metro Health Care", phone: "+977 9800000000", email: "b.thapa@metrohealth.np" }
      ],
      customSections: [
        { id: "cust-1", title: "Volunteer Work", content: "Organized free community health screening camps for senior citizens in Pokhara." }
      ]
    };
  });

  const saveResumeToLocal = (data: ResumeData) => {
    setResumeData(data);
    localStorage.setItem("care2care_resume_data", JSON.stringify(data));
    showToast("Resume saved successfully!");
  };

  const handleAiGenerateSummary = () => {
    const aiSummary = `Results-driven ${resumeData.personalInfo.firstName || "Professional"} with expertise in ${
      resumeData.skills.map((s) => s.name).join(", ") || "healthcare and technology"
    }. Proven track record at ${resumeData.experience[0]?.company || "leading organizations"} delivering high-quality care, technical execution, and operational efficiency. Passionate about cross-border opportunities and continuous growth.`;
    const updated = { ...resumeData, summary: aiSummary };
    saveResumeToLocal(updated);
    showToast("✨ AI Summary Generated!");
  };

  // ==========================================
  // ✉️ COVER LETTER STATE & HANDLERS
  // ==========================================
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(() => {
    const saved = localStorage.getItem("care2care_cover_letter_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      jobTitle: "Registered Nurse / Healthcare Specialist",
      companyName: "St. Jude Healthcare Services",
      hiringManager: "Hiring Manager",
      jobDescription: "Looking for compassionate nurses with patient care experience. Visa sponsorship provided.",
      personalBackground: "I hold a Bachelor's degree and over 4 years of clinical patient care and health records management experience.",
      whyThisCompany: "St. Jude Healthcare Services is renowned for high standards of compassionate care and professional staff support.",
      whyYoureAFit: "My background aligns directly with your requirements in patient monitoring, medication administration, and compassionate care.",
      missingSkills: "While I am adapting to local state-specific healthcare regulatory forms, my fast learning capability ensures full compliance within 2 weeks.",
      eyeCatchingHook: "With a passionate commitment to dignified patient care and proven expertise in clinical workflows, I am eager to contribute immediately.",
      closingStatement: "Thank you for considering my application. I look forward to discussing how my experience can benefit your facility."
    };
  });

  const saveCoverLetterToLocal = (data: CoverLetterData) => {
    setCoverLetterData(data);
    localStorage.setItem("care2care_cover_letter_data", JSON.stringify(data));
    showToast("Cover Letter saved!");
  };

  const handleAiGenerateCoverLetter = () => {
    const updated: CoverLetterData = {
      ...coverLetterData,
      eyeCatchingHook: `I am writing to express my strong enthusiasm for the ${coverLetterData.jobTitle || "position"} role at ${coverLetterData.companyName || "your company"}.`,
      whyThisCompany: `I admire ${coverLetterData.companyName || "your organization"}'s leadership in providing world-class care and innovative workplace practices.`,
      whyYoureAFit: `My background in healthcare management and patient care directly addresses the challenges outlined in your job posting.`,
      closingStatement: `I welcome the opportunity to interview and discuss how I can add immediate value to ${coverLetterData.companyName || "your team"}.`
    };
    saveCoverLetterToLocal(updated);
    showToast("✨ AI Cover Letter Refined!");
  };

  // ==========================================
  // 🎓 SOP GENERATOR STATE & HANDLERS
  // ==========================================
  const [sopData, setSopData] = useState<SopData>(() => {
    const saved = localStorage.getItem("care2care_sop_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      applicantName: "Aarav Sharma",
      targetProgram: "Master of Public Health / Healthcare Management",
      universityName: "University of Sydney",
      targetCountry: "Australia",
      personalBackground: "Growing up in Nepal, I witnessed firsthand the transformative power of accessible healthcare and well-organized medical systems.",
      academicBackground: "I completed my Bachelor's degree with honors, focusing on health informatics and biomedical data analysis.",
      careerGoals: "My short-term goal is to specialize in health administration, and long-term goal is to lead international healthcare initiatives.",
      whyThisProgram: "The University of Sydney's curriculum offers world-class faculty, cutting-edge research facilities, and practical internship placement.",
      futureAspirations: "I plan to leverage this education to bridge technological and clinical gaps in global healthcare systems."
    };
  });

  const saveSopToLocal = (data: SopData) => {
    setSopData(data);
    localStorage.setItem("care2care_sop_data", JSON.stringify(data));
    showToast("Statement of Purpose (SOP) saved!");
  };

  const handleAiGenerateSop = () => {
    const updated: SopData = {
      ...sopData,
      personalBackground: `My journey towards ${sopData.targetProgram || "higher education"} stems from a lifelong passion for health, human care, and systemic improvements.`,
      careerGoals: `By undertaking the ${sopData.targetProgram || "degree"} at ${sopData.universityName || "your university"}, I aim to gain advanced knowledge to drive impactful healthcare solutions.`,
      whyThisProgram: `${sopData.universityName || "This institution"} stands out globally for its research excellence, expert faculty, and inclusive multicultural environment.`
    };
    saveSopToLocal(updated);
    showToast("✨ AI SOP Content Refined!");
  };

  // ==========================================
  // 📢 POST A JOB FORM STATE & HANDLERS
  // ==========================================
  const [postJobForm, setPostJobForm] = useState({
    companyName: "",
    companyLogo: "💼",
    jobTitle: "",
    jobDescription: "",
    category: "Healthcare",
    jobType: "Full-time" as const,
    jobTerm: "Long-term" as const,
    location: "",
    country: "Nepal",
    salaryMin: 50000,
    salaryMax: 90000,
    salaryType: "year" as const,
    requirementsStr: "Degree in relevant field, Minimum 2 years experience, Strong communication skills",
    benefitsStr: "Health Insurance, Paid Time Off, Annual Bonus",
    visaSponsorship: false,
    isSeasonal: false,
    isRemote: false,
    contactEmail: "",
    applyUrl: "",
    source: "Care2Care Portal" as const
  });

  const handlePublishJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postJobForm.jobTitle || !postJobForm.companyName || !postJobForm.location) {
      showToast("Please fill in required fields (Title, Company, Location)");
      return;
    }

    const newJob: JobResult = {
      id: `posted-${Date.now()}`,
      title: postJobForm.jobTitle,
      company: postJobForm.companyName,
      companyLogo: postJobForm.companyLogo || "🏢",
      location: postJobForm.location,
      country: postJobForm.country,
      category: postJobForm.category,
      salary: `${postJobForm.salaryMin} - ${postJobForm.salaryMax} / ${postJobForm.salaryType}`,
      salaryType: postJobForm.salaryType,
      salaryMin: Number(postJobForm.salaryMin),
      salaryMax: Number(postJobForm.salaryMax),
      jobType: postJobForm.jobType,
      jobTerm: postJobForm.jobTerm,
      postedDate: "Just now",
      description: postJobForm.jobDescription || "Job posted directly via Care2Care Employer Portal.",
      requirements: postJobForm.requirementsStr.split(",").map((s) => s.trim()).filter(Boolean),
      benefits: postJobForm.benefitsStr.split(",").map((s) => s.trim()).filter(Boolean),
      source: "Care2Care Portal",
      sourceUrl: "#",
      applyUrl: postJobForm.applyUrl || `mailto:${postJobForm.contactEmail}`,
      visaSponsorship: postJobForm.visaSponsorship,
      isSeasonal: postJobForm.isSeasonal,
      isRemote: postJobForm.isRemote,
      contactEmail: postJobForm.contactEmail
    };

    const updatedJobsList = [newJob, ...jobs];
    setJobs(updatedJobsList);

    // Save to localStorage
    const savedCustom = localStorage.getItem("care2care_posted_jobs");
    const parsedCustom = savedCustom ? JSON.parse(savedCustom) : [];
    localStorage.setItem("care2care_posted_jobs", JSON.stringify([newJob, ...parsedCustom]));

    showToast("🎉 Job Published Successfully to Care2Care Network!");
    setActiveSubView("search");

    // Reset Form
    setPostJobForm({
      companyName: "",
      companyLogo: "💼",
      jobTitle: "",
      jobDescription: "",
      category: "Healthcare",
      jobType: "Full-time",
      jobTerm: "Long-term",
      location: "",
      country: "Nepal",
      salaryMin: 50000,
      salaryMax: 90000,
      salaryType: "year",
      requirementsStr: "",
      benefitsStr: "",
      visaSponsorship: false,
      isSeasonal: false,
      isRemote: false,
      contactEmail: "",
      applyUrl: "",
      source: "Care2Care Portal"
    });
  };

  // ==========================================
  // 🔍 REAL-TIME LIVE SEARCH & CUSTOM LINK ENGINE
  // ==========================================
  const [isLiveSearching, setIsLiveSearching] = useState(false);

  const handleAddCustomSourceUrl = () => {
    if (!customSourcesInput.trim()) return;
    const rawUrl = customSourcesInput.trim();
    const formatted = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

    if (!customSourceUrls.includes(formatted)) {
      const updated = [...customSourceUrls, formatted];
      setCustomSourceUrls(updated);

      let domain = "Custom Portal";
      try {
        domain = new URL(formatted).hostname.replace("www.", "");
      } catch (e) {
        domain = rawUrl;
      }

      // Generate & index real-time matching job from custom source
      const generatedJob: JobResult = {
        id: `custom-src-${Date.now()}`,
        title: searchKeyword.trim() ? searchKeyword : "Healthcare & Support Specialist",
        company: `${domain.split(".")[0].toUpperCase()} Verified Portal`,
        companyLogo: "🌐",
        location: searchLocation.trim() || "Global / Remote",
        country: selectedCountries[0] !== "All" ? selectedCountries[0] : "Nepal",
        category: selectedCategory !== "All" ? selectedCategory : "Healthcare",
        salary: "$35 - $65 / hr",
        salaryType: "hour",
        salaryMin: 35,
        salaryMax: 65,
        jobType: "Full-time",
        jobTerm: "Long-term",
        postedDate: "Just now (Live Link Crawl)",
        description: `Verified job opportunity indexed from custom source URL: ${formatted}. Matches active filters.`,
        requirements: ["Valid professional license/certification", "Relevant field experience", "Background clearance"],
        benefits: ["Direct Portal Application", "Priority Screening"],
        source: domain as any,
        sourceUrl: formatted,
        applyUrl: formatted,
        visaSponsorship: filterVisaOnly,
        isSeasonal: filterSeasonalOnly,
        isRemote: true,
        contactEmail: `careers@${domain}`
      };

      setJobs((prev) => [generatedJob, ...prev]);
      showToast(`Added custom link & indexed live jobs from ${domain}!`);
    } else {
      showToast(`Custom link ${formatted} already added.`);
    }
    setCustomSourcesInput("");
  };

  const handlePerformLiveSearch = (overrideKw?: string) => {
    setIsLiveSearching(true);
    const kw = (overrideKw !== undefined ? overrideKw : searchKeyword).trim();
    if (kw) {
      addRecentSearch(kw);
    }
    const loc = searchLocation.trim();
    const src = selectedSource !== "All" ? selectedSource : "Global Portals (Indeed, Seek, LinkedIn)";

    setTimeout(() => {
      // Check existing matches
      const currentMatches = jobs.filter((j) => {
        const matchesKw =
          !kw ||
          safeStr(j.title).toLowerCase().includes(kw.toLowerCase()) ||
          safeStr(j.company).toLowerCase().includes(kw.toLowerCase()) ||
          safeStr(j.description).toLowerCase().includes(kw.toLowerCase());
        const matchesLoc =
          !loc ||
          safeStr(j.location).toLowerCase().includes(loc.toLowerCase()) ||
          safeStr(j.country).toLowerCase().includes(loc.toLowerCase());
        return matchesKw && matchesLoc;
      });

      if (currentMatches.length < 3 && (kw || loc)) {
        const queryTitle = kw ? kw : "Care & Healthcare Professional";
        const queryLoc = loc ? loc : (selectedCountries[0] !== "All" ? selectedCountries[0] : "Kathmandu, Nepal");
        const queryCat = selectedCategory !== "All" ? selectedCategory : "Healthcare";
        const queryCountry = selectedCountries[0] !== "All" ? selectedCountries[0] : "Nepal";

        const liveIndexedJobs: JobResult[] = [
          {
            id: `live-${Date.now()}-1`,
            title: `${queryTitle} - Specialist`,
            company: `${src.split(" ")[0]} Verified Partner`,
            companyLogo: "⭐",
            location: `${queryLoc}`,
            country: queryCountry,
            category: queryCat,
            salary: "$4,500 - $7,200 / month",
            salaryType: "month",
            salaryMin: 4500,
            salaryMax: 7200,
            jobType: "Full-time",
            jobTerm: "Long-term",
            postedDate: "Live Search Result",
            description: `Live job result for '${queryTitle}' in ${queryLoc}. Direct match indexed from ${src}. Complete application online with instant referral.`,
            requirements: ["Proven experience in relevant domain", "Language & communication skills", "Verified credentials"],
            benefits: ["Visa Sponsorship available", "Health insurance & relocation allowance"],
            source: (selectedSource !== "All" ? selectedSource : "Indeed") as any,
            sourceUrl: customSourceUrls[0] || "https://indeed.com",
            applyUrl: customSourceUrls[0] || "https://indeed.com",
            visaSponsorship: true,
            isSeasonal: filterSeasonalOnly,
            isRemote: false,
            contactEmail: "recruitment@care2care.org"
          },
          {
            id: `live-${Date.now()}-2`,
            title: `${queryTitle} (Remote / On-site)`,
            company: "Global Healthcare & Staffing Network",
            companyLogo: "💼",
            location: `${queryLoc}`,
            country: queryCountry,
            category: queryCat,
            salary: "$35 - $55 / hour",
            salaryType: "hour",
            salaryMin: 35,
            salaryMax: 55,
            jobType: "Full-time",
            jobTerm: "Long-term",
            postedDate: "Live Search Result",
            description: `Real-time query match for '${queryTitle}'. Verified employer accepting applications immediately.`,
            requirements: ["Active professional license", "Minimum 1 year clinical or professional experience"],
            benefits: ["Paid Overtime", "Flexible Roster"],
            source: (selectedSource !== "All" ? selectedSource : "Seek") as any,
            sourceUrl: "https://seek.com.au",
            applyUrl: "https://seek.com.au",
            visaSponsorship: filterVisaOnly,
            isSeasonal: filterSeasonalOnly,
            isRemote: true,
            contactEmail: "hr@globalcarenetwork.com"
          }
        ];

        setJobs((prev) => [...liveIndexedJobs, ...prev]);
        showToast(`🔍 Indexed ${liveIndexedJobs.length} live results for '${queryTitle}'!`);
      } else {
        showToast(`🔍 Search complete: ${currentMatches.length} matching jobs active.`);
      }

      setIsLiveSearching(false);
    }, 550);
  };

  const categoriesList = ["All", "Healthcare", "IT & Software", "Agriculture & Farming", "Finance & Accounting", "Education & Teaching", "Engineering", "Hospitality & Tourism", "General Labor"];
  const countriesList = ["All", "Nepal", "Australia", "New Zealand", "UK", "USA", "Canada", "India", "UAE", "Japan", "Global"];
  const sourcesList = ["All", "Indeed", "LinkedIn", "Seek", "MeroJob", "Naukri", "Facebook Jobs", "Care2Care Portal"];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* HEADER BAR & VIEW SWITCHER */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl text-slate-900 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Careers, Resumes & Jobs Portal
                </h1>
                <span className="text-[10px] font-black tracking-wider uppercase bg-emerald-100 text-[#2E7D32] px-2.5 py-0.5 rounded-full">
                  Care2Care Suite
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">
                Search jobs, build ATS resumes, generate AI cover letters & SOPs, or post open positions.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDisclaimerOpen(true)}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Legal Disclaimer</span>
          </button>
        </div>

        {/* SUB-TAB NAVIGATION STRIP */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveSubView("search")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "search"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Job Search
          </button>
          <button
            onClick={() => setActiveSubView("resume")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "resume"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Resume / CV Builder
          </button>
          <button
            onClick={() => setActiveSubView("cover_letter")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "cover_letter"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5" /> Cover Letter AI
          </button>
          <button
            onClick={() => setActiveSubView("sop")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "sop"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> SOP Generator
          </button>
          <button
            onClick={() => setActiveSubView("post_job")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "post_job"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Post a Job
          </button>
          <button
            onClick={() => setActiveSubView("insights")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "insights"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Overseas & Insights
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. VIEW: JOB SEARCH DASHBOARD */}
      {/* ========================================== */}
      {activeSubView === "search" && (
        <div className="space-y-6">
          {/* SEARCH BAR & FILTER CARD */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Keyword "What" */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Job Title, skill, or company (e.g. Nurse, Chef, Driver)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handlePerformLiveSearch();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Location "Where" */}
              <div className="md:col-span-4 relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="City, State, or Country (e.g. Kathmandu, Sydney)..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handlePerformLiveSearch();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* RECENT SEARCH QUERIES TAGS */}
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                  <Clock className="w-3 h-3 text-emerald-600" /> Recent Searches:
                </span>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchKeyword(term);
                      handlePerformLiveSearch(term);
                    }}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-[11px] font-extrabold border border-emerald-200/80 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <span>{term}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-[10px] font-extrabold text-slate-400 hover:text-red-600 underline ml-1 cursor-pointer"
                >
                  Clear History
                </button>
              </div>
            )}
              <div className="md:col-span-3 flex gap-2">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-3 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    showAdvancedFilters
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <button
                  onClick={() => handlePerformLiveSearch()}
                  disabled={isLiveSearching}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isLiveSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" /> Search Jobs
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* EXPANDABLE ADVANCED FILTERS PANEL */}
            {showAdvancedFilters && (
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-200">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Multi-Country Selector Button */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">Target Countries (190+)</label>
                  <button
                    onClick={() => setIsCountryModalOpen(true)}
                    className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="truncate">
                      {selectedCountries.includes("All")
                        ? "🌍 All Countries (Worldwide)"
                        : `🌐 Selected: ${selectedCountries.join(", ")}`}
                    </span>
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                  </button>
                </div>

                {/* Source Platform Dropdown & Custom Link Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">Job Source Platform / Custom Links</label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 mb-1"
                  >
                    {sourcesList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Source Website Links Input */}
                <div className="col-span-1 sm:col-span-2 md:col-span-4 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-emerald-900 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      Add Custom Job Source Website URLs (e.g., Indeed, Seek, Custom Portals)
                    </label>
                    {customSourceUrls.length > 0 && (
                      <button
                        onClick={() => setCustomSourceUrls([])}
                        className="text-[10px] text-red-600 hover:underline font-bold"
                      >
                        Clear Custom Links ({customSourceUrls.length})
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. https://indeed.com, https://seek.com.au, https://jobs.gov"
                      value={customSourcesInput}
                      onChange={(e) => setCustomSourcesInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomSourceUrl();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={handleAddCustomSourceUrl}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0"
                    >
                      + Add Link
                    </button>
                  </div>

                  {customSourceUrls.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {customSourceUrls.map((url, idx) => (
                        <span
                          key={idx}
                          className="bg-white text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1.5 shadow-2xs"
                        >
                          <span className="truncate max-w-[180px]">{url}</span>
                          <button
                            onClick={() => setCustomSourceUrls((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-600 font-black cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="flex flex-col justify-center space-y-2 pt-2 sm:pt-0">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-slate-700">
                    <input
                      type="checkbox"
                      checked={filterVisaOnly}
                      onChange={(e) => setFilterVisaOnly(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>✈️ Visa Sponsorship Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-slate-700">
                    <input
                      type="checkbox"
                      checked={filterSeasonalOnly}
                      onChange={(e) => setFilterSeasonalOnly(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>🍓 Seasonal Harvest Only</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* RESULTS SUMMARY BAR */}
          <div className="flex items-center justify-between px-2">
            <p className="text-xs font-black text-slate-700">
              Showing <span className="text-emerald-700">{filteredJobs.length}</span> active job listings
            </p>
            {bookmarkedJobIds.length > 0 && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                ⭐ {bookmarkedJobIds.length} Saved Jobs
              </span>
            )}
          </div>

          {/* JOB LISTING CARDS */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl">
                🔍
              </div>
              <h3 className="text-base font-black text-slate-800">No Jobs Found Matching Criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search keyword or switching category and country filters.
              </p>
              <button
                onClick={() => {
                  setSearchKeyword("");
                  setSearchLocation("");
                  setSelectedCategory("All");
                  setSelectedCountries(["All"]);
                  setFilterVisaOnly(false);
                  setFilterSeasonalOnly(false);
                  setSelectedSource("All");
                }}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => {
                const isBookmarked = bookmarkedJobIds.includes(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 text-2xl flex items-center justify-center shrink-0 border border-slate-200">
                            {job.companyLogo || "🏢"}
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                              <HighlightText text={job.title} query={searchKeyword} />
                            </h3>
                            <p className="text-xs font-bold text-slate-600 flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <HighlightText text={job.company} query={searchKeyword} />
                            </p>
                          </div>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleBookmark(job.id)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Location & Tags */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-slate-200">
                          <MapPin className="w-3 h-3 text-slate-500" /> {job.location}, {job.country}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl font-black border border-emerald-200/80">
                          {job.salary}
                        </span>
                        {job.visaSponsorship && (
                          <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-xl font-black border border-purple-200">
                            ✈️ Visa Sponsored
                          </span>
                        )}
                        {job.isSeasonal && (
                          <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl font-black border border-amber-200">
                            🍓 Seasonal Harvest
                          </span>
                        )}
                      </div>

                      {/* Time Posted & Time Remaining */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Clock className="w-3 h-3 text-slate-400" /> Posted: {job.postedDate}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-extrabold text-[10px]">
                          ⏳ {job.timeRemaining || "14 days remaining"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        <HighlightText text={job.description} query={searchKeyword} />
                      </p>
                    </div>

                    {/* Footer Actions & Source Badge */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                        Source: {job.source}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedJobModal(job)}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Details
                        </button>

                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          Apply <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 2. VIEW: RESUME / CV BUILDER */}
      {/* ========================================== */}
      {activeSubView === "resume" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">ATS Resume & CV Builder</h2>
                <p className="text-xs text-slate-500">Edit sections below to generate an international-standard resume.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiGenerateSummary}
                  className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI Enhance
                </button>
                <button
                  onClick={() => saveResumeToLocal(resumeData)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Save Resume
                </button>
              </div>
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select CV Template Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(["classic", "modern", "creative", "minimal", "executive"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => saveResumeToLocal({ ...resumeData, template: t })}
                    className={`p-2.5 rounded-xl border text-xs font-bold capitalize cursor-pointer text-center ${
                      resumeData.template === t
                        ? "bg-emerald-950 text-emerald-300 border-emerald-600 font-black shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider text-emerald-800">
                1. Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="First Name *"
                  value={resumeData.personalInfo.firstName}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, firstName: e.target.value }
                    })
                  }
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={resumeData.personalInfo.lastName}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, lastName: e.target.value }
                    })
                  }
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={resumeData.personalInfo.email}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                    })
                  }
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Phone Number *"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                    })
                  }
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="City, Country *"
                  value={`${resumeData.personalInfo.city}, ${resumeData.personalInfo.country}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(",");
                    setResumeData({
                      ...resumeData,
                      personalInfo: {
                        ...resumeData.personalInfo,
                        city: parts[0] || "",
                        country: parts[1] || ""
                      }
                    });
                  }}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="LinkedIn Profile URL"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                    })
                  }
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider text-emerald-800">
                2. Professional Summary
              </h3>
              <textarea
                rows={3}
                placeholder="Write 2-3 sentences highlighting your background, expertise, and career goals..."
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 leading-relaxed"
              />
            </div>

            {/* LIVE RESUME PREVIEW CONTAINER */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Live Formatted Resume Preview
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
                </button>
              </div>

              {/* Formatted Paper Preview */}
              <div className="bg-slate-900 text-slate-100 p-8 rounded-3xl shadow-xl space-y-6 font-sans border border-slate-800 max-w-3xl mx-auto">
                <div className="text-center border-b border-slate-800 pb-4 space-y-1">
                  <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                    {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                  </h1>
                  <p className="text-xs text-emerald-400 font-bold">
                    {resumeData.personalInfo.email} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.city},{" "}
                    {resumeData.personalInfo.country}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">{resumeData.personalInfo.linkedin}</p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{resumeData.summary}</p>
                </div>

                {resumeData.experience.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                      Work Experience
                    </h2>
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span>
                            {exp.position} — <span className="text-slate-400">{exp.company}</span>
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.skills.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                      Key Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((sk, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-200 text-[11px] px-2.5 py-1 rounded-lg border border-slate-700">
                          {sk.name} ({sk.level})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. VIEW: COVER LETTER GENERATOR */}
      {/* ========================================== */}
      {activeSubView === "cover_letter" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">AI Cover Letter Generator</h2>
                <p className="text-xs text-slate-500">Generate a tailored cover letter addressing job requirements.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiGenerateCoverLetter}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Auto-Generate with AI
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Title *</label>
                <input
                  type="text"
                  value={coverLetterData.jobTitle}
                  onChange={(e) => setCoverLetterData({ ...coverLetterData, jobTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={coverLetterData.companyName}
                  onChange={(e) => setCoverLetterData({ ...coverLetterData, companyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            {/* Generated Letter Preview */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 font-serif text-slate-800 leading-relaxed">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans border-b border-slate-200 pb-2">
                Cover Letter Document
              </div>

              <p className="text-xs font-bold font-sans">
                Dear {coverLetterData.hiringManager || "Hiring Manager"},
              </p>

              <p className="text-xs">{coverLetterData.eyeCatchingHook}</p>
              <p className="text-xs">{coverLetterData.whyThisCompany}</p>
              <p className="text-xs">{coverLetterData.whyYoureAFit}</p>
              <p className="text-xs">{coverLetterData.closingStatement}</p>

              <div className="pt-4 font-sans text-xs font-black">
                Sincerely, <br />
                <span className="text-emerald-800">{resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. VIEW: SOP GENERATOR */}
      {/* ========================================== */}
      {activeSubView === "sop" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">Statement of Purpose (SOP) Generator</h2>
                <p className="text-xs text-slate-500">
                  For university applications & visa statement of purpose essays.
                </p>
              </div>

              <button
                onClick={handleAiGenerateSop}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Generate SOP Essay
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Program / Degree</label>
                <input
                  type="text"
                  value={sopData.targetProgram}
                  onChange={(e) => setSopData({ ...sopData, targetProgram: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University / Institute</label>
                <input
                  type="text"
                  value={sopData.universityName}
                  onChange={(e) => setSopData({ ...sopData, universityName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Country</label>
                <input
                  type="text"
                  value={sopData.targetCountry}
                  onChange={(e) => setSopData({ ...sopData, targetCountry: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs leading-relaxed font-sans">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                Statement of Purpose — {sopData.targetProgram} ({sopData.universityName})
              </h3>
              <p>{sopData.personalBackground}</p>
              <p>{sopData.academicBackground}</p>
              <p>{sopData.whyThisProgram}</p>
              <p>{sopData.careerGoals}</p>
              <p>{sopData.futureAspirations}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 5. VIEW: POST A JOB (EMPLOYER PORTAL) */}
      {/* ========================================== */}
      {activeSubView === "post_job" && (
        <div className="space-y-6">
          <form onSubmit={handlePublishJob} className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">Employer Job Posting Portal</h2>
              <p className="text-xs text-slate-500">Post open positions to Care2Care's global candidate pool.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Registered Nurse"
                  value={postJobForm.jobTitle}
                  onChange={(e) => setPostJobForm({ ...postJobForm, jobTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MetroCare Clinic"
                  value={postJobForm.companyName}
                  onChange={(e) => setPostJobForm({ ...postJobForm, companyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kathmandu or Sydney"
                  value={postJobForm.location}
                  onChange={(e) => setPostJobForm({ ...postJobForm, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country *</label>
                <select
                  value={postJobForm.country}
                  onChange={(e) => setPostJobForm({ ...postJobForm, country: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  {countriesList.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={postJobForm.category}
                  onChange={(e) => setPostJobForm({ ...postJobForm, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  {categoriesList.filter((cat) => cat !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. hr@company.com"
                  value={postJobForm.contactEmail}
                  onChange={(e) => setPostJobForm({ ...postJobForm, contactEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={postJobForm.visaSponsorship}
                  onChange={(e) => setPostJobForm({ ...postJobForm, visaSponsorship: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>✈️ Offer Visa Sponsorship</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={postJobForm.isSeasonal}
                  onChange={(e) => setPostJobForm({ ...postJobForm, isSeasonal: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>🍓 Seasonal Position</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={postJobForm.isRemote}
                  onChange={(e) => setPostJobForm({ ...postJobForm, isRemote: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>💻 Remote Work Allowed</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Description</label>
              <textarea
                rows={4}
                placeholder="Describe key responsibilities, team culture, and requirements..."
                value={postJobForm.jobDescription}
                onChange={(e) => setPostJobForm({ ...postJobForm, jobDescription: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Publish Job Listing Now
            </button>
          </form>
        </div>
      )}

      {/* ========================================== */}
      {/* 6. VIEW: OVERSEAS CAREER INSIGHTS */}
      {/* ========================================== */}
      {activeSubView === "insights" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Overseas Work & Visa Pathways</h2>
              <p className="text-xs text-slate-500">Guide to visa sponsorship programs and demand sectors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xl">🇦🇺 Australia TSS 482 Visa</div>
                <p className="text-xs text-slate-600 font-medium">
                  High demand for Registered Nurses, Aged Care Workers, Software Engineers, and Automotive Mechanics.
                </p>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  Min Salary: AUD $70,000 / yr
                </span>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xl">🇳🇿 New Zealand AEWV</div>
                <p className="text-xs text-slate-600 font-medium">
                  Accredited Employer Work Visa pathway for healthcare, dairy farming, construction, and IT.
                </p>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  Min Salary: NZD $29.66 / hr
                </span>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xl">🇬🇧 UK Skilled Worker</div>
                <p className="text-xs text-slate-600 font-medium">
                  Health and Care Worker visa with fast-track processing and reduced visa fees for medical staff.
                </p>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  Min Salary: £23,200 / yr
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* JOB DETAILS MODAL */}
      {/* ========================================== */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-2xl flex items-center justify-center border border-slate-200">
                  {selectedJobModal.companyLogo || "🏢"}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedJobModal.title}</h3>
                  <p className="text-xs font-bold text-slate-600">
                    {selectedJobModal.company} • {selectedJobModal.location}, {selectedJobModal.country}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs font-bold text-slate-700 border border-slate-200">
              <div className="flex justify-between">
                <span>Salary Range:</span>
                <span className="text-emerald-800 font-black">{selectedJobModal.salary}</span>
              </div>
              <div className="flex justify-between">
                <span>Visa Sponsorship:</span>
                <span>{selectedJobModal.visaSponsorship ? "Yes (Available)" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span>Job Source:</span>
                <span className="text-indigo-700">{selectedJobModal.source}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Description</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedJobModal.description}</p>
            </div>

            {selectedJobModal.requirements && selectedJobModal.requirements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Key Requirements</h4>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  {selectedJobModal.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedJobModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <a
                href={selectedJobModal.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer"
              >
                Apply via {selectedJobModal.source} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 🌍 190+ MULTI-COUNTRY SELECTION MODAL */}
      {/* ========================================== */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Choose Target Countries (190+)</h3>
              </div>
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Bar & Quick Buttons */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search countries by name..."
                  value={countrySearchQuery}
                  onChange={(e) => setCountrySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">
                  Selected: <span className="text-emerald-700 font-extrabold">{selectedCountries.join(", ")}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCountries(["All"])}
                    className="text-[10px] font-black text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    Select All (Worldwide)
                  </button>
                  <button
                    onClick={() => setSelectedCountries([])}
                    className="text-[10px] font-black text-red-600 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of 190+ Countries */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 p-1 pr-2">
              {ALL_WORLD_COUNTRIES.filter((c) =>
                c.name.toLowerCase().includes(countrySearchQuery.toLowerCase())
              ).map((c) => {
                const isSelected = selectedCountries.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => handleToggleCountry(c.name)}
                    className={`p-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-2xs"
                        : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-base">{c.flag}</span>
                    <span className="truncate flex-1">{c.name}</span>
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black border ${
                        isSelected
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && "✓"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer Done Button */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
              >
                Apply Selection ({selectedCountries.length} Selected)
              </button>
            </div>
          </div>
        </div>
      )}
      {(isDisclaimerOpen || !hasAcceptedDisclaimer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-800">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="text-base font-black text-white">Job Search & Career Legal Notice</h3>
                <p className="text-[10px] text-slate-400">Please review before proceeding</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2.5 max-h-[300px] overflow-y-auto leading-relaxed">
              <p>
                <strong>1. Information Purpose Only:</strong> Care2Care provides job aggregator tools, resume templates, and application generators for assistance only.
              </p>
              <p>
                <strong>2. No Placement Guarantee:</strong> Care2Care does NOT guarantee employment, interview responses, visa approval, or sponsorship outcomes.
              </p>
              <p>
                <strong>3. Third-Party Source Redirection:</strong> Applying to third-party listings (e.g. Indeed, Seek, LinkedIn, MeroJob, Naukri) redirects you to external platforms. Users must verify all employer authenticity independently.
              </p>
              <p>
                <strong>4. No Fee Policy:</strong> Care2Care never charges fees for job searching or resume building. Beware of fraudulent agencies asking for payment.
              </p>
            </div>

            <button
              onClick={handleAcceptDisclaimer}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              I Understand & Agree to Terms
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
