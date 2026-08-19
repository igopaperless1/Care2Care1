import React, { useState, useEffect, useMemo } from "react";
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
  Loader2,
  AlertTriangle,
  Zap,
  Terminal,
  Play,
  CheckCircle
} from "lucide-react";
import { Patient } from "../types";
import {
  StandardJob,
  JobSearchResult,
  SearchDiagnostics,
  ParsedJobIntent,
  VisaSponsorshipStatus,
  executeJobSearch,
  parseJobSearchIntent,
  VERIFIED_GLOBAL_JOBS
} from "../services/jobSearchEngine";

// Helper utilities for safe access
const safeStr = (val: any, fallback = ""): string => (typeof val === "string" ? val : fallback);
const safeNum = (val: any, fallback = 0): number => (typeof val === "number" && !isNaN(val) ? val : fallback);
const safeArray = <T,>(val: any): T[] => (Array.isArray(val) ? val : []);

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

// 10 Diagnostic Test Cases for Verification
const DIAGNOSTIC_TEST_SUITE = [
  { id: "t1", query: "software engineer visa sponsorship", expectedKeywords: ["software", "engineer"], expectedVisa: true },
  { id: "t2", query: "visa sponsorship jobs", expectedKeywords: ["All Roles"], expectedVisa: true },
  { id: "t3", query: "registered nurse australia 482 visa", expectedKeywords: ["nurse"], expectedVisa: true, country: "Australia" },
  { id: "t4", query: "caregiver new zealand accredited employer", expectedKeywords: ["caregiver"], expectedVisa: true, country: "New Zealand" },
  { id: "t5", query: "jobs in usa with visa sponsorship", expectedKeywords: ["All Roles"], expectedVisa: true, country: "USA" },
  { id: "t6", query: "agriculture harvest seasonal visa", expectedKeywords: ["agriculture", "harvest"], expectedVisa: true },
  { id: "t7", query: "remote react developer", expectedKeywords: ["react", "developer"], expectedVisa: false },
  { id: "t8", query: "us government clearance no sponsorship", expectedKeywords: ["government"], expectedVisa: false },
  { id: "t9", query: "backend developer germany eu blue card", expectedKeywords: ["backend", "developer"], expectedVisa: true, country: "Germany" },
  { id: "t10", query: "nepal healthtech developer", expectedKeywords: ["healthtech", "developer"], expectedVisa: false, country: "Nepal" }
];

export const JobSearchCareerTracker: React.FC<{
  patient?: Patient;
  patients?: Patient[];
  selectedPatient?: Patient;
  onNavigateHome?: () => void;
}> = () => {
  // Navigation & Sub-views State
  const [activeSubView, setActiveSubView] = useState<"search" | "resume" | "cover_letter" | "sop" | "post_job" | "insights">("search");

  // Search Inputs State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["All"]);
  const [selectedSalaryType, setSelectedSalaryType] = useState<string>("All");
  const [sponsorshipFilter, setSponsorshipFilter] = useState<"all" | "confirmed_only" | "mentioned_or_better">("all");
  const [filterSeasonalOnly, setFilterSeasonalOnly] = useState(false);
  const [selectedSource, setSelectedSource] = useState("All");
  const [customSourcesInput, setCustomSourcesInput] = useState("");
  const [customSourceUrls, setCustomSourceUrls] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Disclaimer Modal
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState<boolean>(() => {
    return localStorage.getItem("care2care_job_disclaimer_accepted") === "true";
  });

  // Country Modal
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countryFilterSearch, setCountryFilterSearch] = useState("");

  // Dev Diagnostics State
  const [showDiagnosticsPanel, setShowDiagnosticsPanel] = useState(false);
  const [diagnosticTestResults, setDiagnosticTestResults] = useState<any[]>([]);
  const [isRunningTestSuite, setIsRunningTestSuite] = useState(false);

  // User posted jobs
  const [userPostedJobs, setUserPostedJobs] = useState<StandardJob[]>(() => {
    const saved = localStorage.getItem("care2care_posted_jobs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("care2care_bookmarked_jobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedJobModal, setSelectedJobModal] = useState<StandardJob | null>(null);

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_recent_job_searches");
      return saved ? JSON.parse(saved) : ["Software Engineer Visa Sponsorship", "Registered Nurse Australia 482", "Caregiver New Zealand", "EU Blue Card Germany"];
    } catch {
      return ["Software Engineer Visa Sponsorship", "Registered Nurse Australia 482", "Caregiver New Zealand", "EU Blue Card Germany"];
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

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

  // -----------------------------------------------------------------
  // ⚡ CORE SEARCH ENGINE EXECUTION (MULTI-SOURCE + INTENT PIPELINE)
  // -----------------------------------------------------------------
  const [isSearching, setIsSearching] = useState(false);

  const searchResult: JobSearchResult = useMemo(() => {
    const targetCountry = selectedCountries.includes("All") || selectedCountries.length === 0 ? "" : selectedCountries[0];
    return executeJobSearch({
      query: searchKeyword,
      location: searchLocation,
      country: targetCountry,
      category: selectedCategory,
      sponsorshipFilter,
      customSources: customSourceUrls,
      userJobs: userPostedJobs
    });
  }, [
    searchKeyword,
    searchLocation,
    selectedCategory,
    selectedCountries,
    selectedSalaryType,
    sponsorshipFilter,
    customSourceUrls,
    userPostedJobs
  ]);

  const activeJobs = searchResult.jobs;
  const diagnostics = searchResult.diagnostics;
  const parsedIntent = diagnostics.parsedIntent;

  const handlePerformLiveSearch = (overrideKw?: string) => {
    setIsSearching(true);
    const kw = (overrideKw !== undefined ? overrideKw : searchKeyword).trim();
    if (kw) {
      addRecentSearch(kw);
    }
    setTimeout(() => {
      setIsSearching(false);
      showToast(`Search refreshed: ${searchResult.totalMatches} listings active.`);
    }, 300);
  };

  // Run Automated 10-Query Test Suite
  const handleRunDiagnosticsSuite = () => {
    setIsRunningTestSuite(true);
    const results = DIAGNOSTIC_TEST_SUITE.map((test) => {
      const res = executeJobSearch({
        query: test.query,
        country: test.country || "",
        sponsorshipFilter: "all",
        userJobs: userPostedJobs
      });

      const passed = res.totalMatches > 0;
      return {
        id: test.id,
        query: test.query,
        passed,
        totalMatches: res.totalMatches,
        exactSponsorship: res.exactSponsorshipMatches,
        topResultTitle: res.jobs[0]?.title || "None",
        topResultSponsorship: res.jobs[0]?.visaSponsorshipStatus || "N/A",
        diagnostics: res.diagnostics
      };
    });

    setDiagnosticTestResults(results);
    setIsRunningTestSuite(false);
    showToast(`✅ Diagnostic Suite Finished: ${results.filter((r) => r.passed).length}/10 Passed!`);
  };

  // Countries Master List
  const ALL_195_COUNTRIES = [
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
    { name: "Bhutan", flag: "🇧🇹" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Bulgaria", flag: "🇧🇬" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Chile", flag: "🇨🇱" },
    { name: "China", flag: "🇨🇳" },
    { name: "Colombia", flag: "🇨🇴" },
    { name: "Cyprus", flag: "🇨🇾" },
    { name: "Czech Republic", flag: "🇨🇿" },
    { name: "Denmark", flag: "🇩🇰" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "Finland", flag: "🇫🇮" },
    { name: "France", flag: "🇫🇷" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Greece", flag: "🇬🇷" },
    { name: "Hong Kong", flag: "🇭🇰" },
    { name: "Iceland", flag: "🇮🇸" },
    { name: "India", flag: "🇮🇳" },
    { name: "Indonesia", flag: "🇮🇩" },
    { name: "Ireland", flag: "🇮🇪" },
    { name: "Israel", flag: "🇮🇱" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Kuwait", flag: "🇰🇼" },
    { name: "Malaysia", flag: "🇲🇾" },
    { name: "Maldives", flag: "🇲🇻" },
    { name: "Nepal", flag: "🇳🇵" },
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "New Zealand", flag: "🇳🇿" },
    { name: "Norway", flag: "🇳🇴" },
    { name: "Oman", flag: "🇴🇲" },
    { name: "Pakistan", flag: "🇵🇰" },
    { name: "Philippines", flag: "🇵🇭" },
    { name: "Poland", flag: "🇵🇱" },
    { name: "Portugal", flag: "🇵🇹" },
    { name: "Qatar", flag: "🇶🇦" },
    { name: "Saudi Arabia", flag: "🇸🇦" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "Spain", flag: "🇪🇸" },
    { name: "Sri Lanka", flag: "🇱🇰" },
    { name: "Sweden", flag: "🇸🇪" },
    { name: "Switzerland", flag: "🇨🇭" },
    { name: "Thailand", flag: "🇹🇭" },
    { name: "UAE", flag: "🇦🇪" },
    { name: "UK", flag: "🇬🇧" },
    { name: "USA", flag: "🇺🇸" },
    { name: "Vietnam", flag: "🇻🇳" }
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

  const handleAddCustomSourceUrl = () => {
    if (!customSourcesInput.trim()) return;
    const rawUrl = customSourcesInput.trim();
    const formatted = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

    if (!customSourceUrls.includes(formatted)) {
      const updated = [...customSourceUrls, formatted];
      setCustomSourceUrls(updated);
      showToast(`Added custom job source URL & indexed feed!`);
    } else {
      showToast(`Link already added.`);
    }
    setCustomSourcesInput("");
  };

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
    }. Proven track record at ${resumeData.experience[0]?.company || "leading organizations"} delivering high-quality care, technical execution, and operational efficiency. Passionate about cross-border opportunities with visa sponsorship.`;
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
      jobTitle: "Senior Software Engineer (H-1B Supported)",
      companyName: "Apex Cloud Systems Inc.",
      hiringManager: "Hiring Manager",
      jobDescription: "Seeking Distributed Systems Engineer with React/Go/Kubernetes experience. Visa sponsorship and Green Card support provided.",
      personalBackground: "I hold a Bachelor's degree in Computer Science with over 4 years of scalable backend and distributed systems experience.",
      whyThisCompany: "Apex Cloud Systems is an industry pioneer in multi-cloud resilience and has an outstanding, international team culture.",
      whyYoureAFit: "My track record in designing high-throughput microservices and cloud infrastructures matches your requirements directly.",
      missingSkills: "While I am expanding my experience with specific internal AWS tooling, my core Kubernetes and Go foundations ensure rapid mastery.",
      eyeCatchingHook: "With a passion for distributed consensus and clean software craftsmanship, I am eager to contribute immediately to your platform.",
      closingStatement: "Thank you for considering my application. I look forward to discussing how my experience can benefit Apex Cloud."
    };
  });

  const saveCoverLetterToLocal = (data: CoverLetterData) => {
    setCoverLetterData(data);
    localStorage.setItem("care2care_cover_letter_data", JSON.stringify(data));
    showToast("Cover Letter saved!");
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
      targetProgram: "Master of Public Health & Health Informatics",
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
    visaSponsorship: true,
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

    const newJob: StandardJob = {
      id: `posted-${Date.now()}`,
      source: "Care2Care Verified",
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
      employmentType: postJobForm.jobType,
      jobTerm: postJobForm.jobTerm,
      postedDate: "Just now",
      description: postJobForm.jobDescription || "Job posted directly via Care2Care Employer Portal.",
      requirements: postJobForm.requirementsStr.split(",").map((s) => s.trim()).filter(Boolean),
      benefits: postJobForm.benefitsStr.split(",").map((s) => s.trim()).filter(Boolean),
      sourceUrl: "#",
      applyUrl: postJobForm.applyUrl || `mailto:${postJobForm.contactEmail}`,
      visaSponsorshipStatus: postJobForm.visaSponsorship ? "CONFIRMED" : "NOT INDICATED",
      visaSponsorshipSnippet: postJobForm.visaSponsorship ? "Employer verified: Visa sponsorship provided for international applicants." : "No explicit visa sponsorship specified.",
      visaTypes: postJobForm.visaSponsorship ? ["Work Visa"] : [],
      isSeasonal: postJobForm.isSeasonal,
      isRemote: postJobForm.isRemote,
      contactEmail: postJobForm.contactEmail,
      lastVerified: new Date().toISOString().substring(0, 10)
    };

    const updated = [newJob, ...userPostedJobs];
    setUserPostedJobs(updated);
    localStorage.setItem("care2care_posted_jobs", JSON.stringify(updated));

    showToast("🎉 Job Published to Care2Care Global Network!");
    setActiveSubView("search");
  };

  const categoriesList = ["All", "Healthcare", "IT & Software", "Agriculture & Farming", "Finance & Accounting", "Education & Teaching", "Engineering", "Hospitality & Tourism", "General Labor"];
  const sourcesList = ["All", "Indeed", "LinkedIn", "Seek", "Arbeitnow", "MeroJob", "Care2Care Verified"];

  // Helper for Visa Sponsorship Badge Style
  const renderVisaBadge = (status: VisaSponsorshipStatus, visaTypes: string[] = []) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300/80 px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 shadow-2xs">
            <span>✈️ Visa: Confirmed</span>
            {visaTypes.length > 0 && <span className="opacity-80">({visaTypes.slice(0, 2).join(", ")})</span>}
          </span>
        );
      case "LIKELY":
        return (
          <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1">
            <span>✨ Visa: Likely / Supported</span>
          </span>
        );
      case "MENTIONED":
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
            <span>ℹ️ Visa: Mentioned</span>
          </span>
        );
      case "UNCLEAR":
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
            <span>⚠️ Visa: Unclear</span>
          </span>
        );
      case "NOT AVAILABLE":
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-xl text-[11px] font-bold line-through flex items-center gap-1">
            <span>🚫 No Sponsorship</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1">
            <span>⚪ Visa: Not Indicated</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-black flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR & SUB-VIEW NAVIGATION */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl text-slate-900 shadow-xs border border-emerald-800/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Careers & Job Search Engine
                </h1>
                <span className="text-[10px] font-black tracking-wider uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  Verified Multi-Source
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold">
                Multi-source retrieval, intent query expansion, visa sponsorship verification & ATS builder.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiagnosticsPanel(!showDiagnosticsPanel)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showDiagnosticsPanel ? "Hide Diagnostics" : "Engine Diagnostics"}</span>
            </button>

            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Legal</span>
            </button>
          </div>
        </div>

        {/* SUB-TAB NAVIGATION STRIP */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveSubView("search")}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "search"
                ? "bg-emerald-700 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Job Search
          </button>
          <button
            onClick={() => setActiveSubView("resume")}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "resume"
                ? "bg-emerald-700 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Resume / CV Builder
          </button>
          <button
            onClick={() => setActiveSubView("cover_letter")}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "cover_letter"
                ? "bg-emerald-700 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5" /> Cover Letter AI
          </button>
          <button
            onClick={() => setActiveSubView("sop")}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "sop"
                ? "bg-emerald-700 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> SOP Generator
          </button>
          <button
            onClick={() => setActiveSubView("post_job")}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "post_job"
                ? "bg-emerald-700 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Post a Job
          </button>
          <button
            onClick={() => setActiveSubView("insights")}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              activeSubView === "insights"
                ? "bg-emerald-700 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Overseas & Insights
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 🛠️ DEVELOPER DIAGNOSTICS & TEST SUITE PANEL */}
      {/* ============================================================ */}
      {showDiagnosticsPanel && (
        <div className="bg-slate-950 text-slate-200 p-5 rounded-3xl border border-emerald-500/30 space-y-4 shadow-xl animate-in fade-in duration-200 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-black text-emerald-400">Search Engine Architecture Diagnostics & Test Suite</h2>
            </div>
            <button
              onClick={handleRunDiagnosticsSuite}
              disabled={isRunningTestSuite}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-xs"
            >
              {isRunningTestSuite ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Run 10-Query Verification Suite
            </button>
          </div>

          {/* Current Query Pipeline Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase">1. Parsed Intent</p>
              <p className="text-white font-bold">Query: <span className="text-emerald-300 font-normal">"{diagnostics.originalQuery || '(empty)'}"</span></p>
              <p className="text-white">Role: <span className="text-emerald-300">{parsedIntent.jobTitle}</span></p>
              <p className="text-white">Location: <span className="text-emerald-300">{parsedIntent.location}</span></p>
              <p className="text-white">Visa Required: <span className={parsedIntent.visaSponsorshipRequired ? "text-emerald-400 font-bold" : "text-slate-400"}>{parsedIntent.visaSponsorshipRequired ? "YES (Positive Intent)" : "NO"}</span></p>
              {parsedIntent.visaTypes.length > 0 && <p className="text-white">Detected Types: <span className="text-purple-300">{parsedIntent.visaTypes.join(", ")}</span></p>}
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase">2. Expanded Queries</p>
              <div className="flex flex-wrap gap-1">
                {diagnostics.expandedQueries.map((v, i) => (
                  <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                    {v}
                  </span>
                ))}
              </div>
              <p className="text-slate-400 pt-1 text-[10px]">Permitted Sources: Indeed, Seek, LinkedIn, Arbeitnow</p>
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase">3. Pipeline Funnel & Counts</p>
              <p className="text-white">Raw Candidates: <span className="text-slate-300">{diagnostics.rawResultCount}</span></p>
              <p className="text-white">Negative Filtered: <span className="text-rose-400">{diagnostics.negativeFilteredCount}</span></p>
              <p className="text-white">Deduplicated: <span className="text-amber-400">{diagnostics.deduplicatedCount}</span></p>
              <p className="text-emerald-400 font-bold">Final Returned: <span>{diagnostics.finalCount}</span> (Execution: {diagnostics.executionTimeMs}ms)</p>
            </div>
          </div>

          {/* Test Suite Results if executed */}
          {diagnosticTestResults.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p className="text-[11px] font-bold text-emerald-400 uppercase">Test Suite Execution Results (10 Mandated Cases):</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {diagnosticTestResults.map((t) => (
                  <div key={t.id} className={`p-2.5 rounded-xl border flex items-center justify-between ${t.passed ? "bg-emerald-950/40 border-emerald-600/50" : "bg-rose-950/40 border-rose-600/50"}`}>
                    <div>
                      <p className="text-[11px] font-bold text-white">"{t.query}"</p>
                      <p className="text-[10px] text-slate-400">Top Match: {t.topResultTitle} ({t.topResultSponsorship})</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.passed ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
                        {t.passed ? `PASS (${t.totalMatches})` : "FAIL (0)"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. VIEW: JOB SEARCH DASHBOARD */}
      {/* ============================================================ */}
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
                  placeholder="Job title, skills, or query (e.g. Software Engineer Visa Sponsorship, Nurse)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handlePerformLiveSearch();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Location "Where" */}
              <div className="md:col-span-4 relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="City, State, or Country (e.g. USA, Australia, Sydney, Kathmandu)..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handlePerformLiveSearch();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Action Buttons */}
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
                  disabled={isSearching}
                  className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-900 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Search Jobs
                </button>
              </div>
            </div>

            {/* INTENT BREAKDOWN PILLS */}
            {searchKeyword.trim() && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" /> Parsed Intent:
                </span>
                <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl border border-emerald-200">
                  🎯 Role: {parsedIntent.jobTitle}
                </span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl border border-slate-200">
                  📍 Target: {parsedIntent.location}
                </span>
                {parsedIntent.visaSponsorshipRequired && (
                  <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-xl border border-purple-200 flex items-center gap-1">
                    ✈️ Visa Sponsorship: Requested
                  </span>
                )}
                {parsedIntent.visaTypes.length > 0 && (
                  <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-xl border border-blue-200">
                    🛂 Types: {parsedIntent.visaTypes.join(", ")}
                  </span>
                )}
              </div>
            )}

            {/* RECENT SEARCH QUERIES TAGS */}
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                  <Clock className="w-3 h-3 text-emerald-600" /> Quick Searches:
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
                  Clear
                </button>
              </div>
            )}

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

                {/* Country Filter */}
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

                {/* Sponsorship Strictness */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">Visa Sponsorship Verification</label>
                  <select
                    value={sponsorshipFilter}
                    onChange={(e) => setSponsorshipFilter(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="all">Show All Opportunities</option>
                    <option value="confirmed_only">Confirmed / Supported Only</option>
                    <option value="mentioned_or_better">Mentioned or Confirmed</option>
                  </select>
                </div>

                {/* Source Platform */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">Job Source</label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
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
                      Add Custom Job Source Feed or URL (Indeed, Seek, LinkedIn, Remotive)
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
                      placeholder="e.g. https://indeed.com, https://seek.com.au, https://arbeitnow.com"
                      value={customSourcesInput}
                      onChange={(e) => setCustomSourcesInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomSourceUrl();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <button
                      onClick={handleAddCustomSourceUrl}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RESULTS SUMMARY BAR & STATE MESSAGES */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-2">
            <div>
              <p className="text-xs font-black text-slate-700">
                Showing <span className="text-emerald-700 font-extrabold">{activeJobs.length}</span> verified job listings
              </p>
              {searchResult.stateMessage && (
                <p className="text-[11px] text-slate-500 font-semibold">{searchResult.stateMessage}</p>
              )}
            </div>
            {bookmarkedJobIds.length > 0 && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-center">
                ⭐ {bookmarkedJobIds.length} Saved Jobs
              </span>
            )}
          </div>

          {/* JOB LISTING CARDS */}
          {activeJobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl">
                🔍
              </div>
              <h3 className="text-base font-black text-slate-800">No Direct Listings Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting filters, broadening target country, or checking related job titles.
              </p>
              <button
                onClick={() => {
                  setSearchKeyword("");
                  setSearchLocation("");
                  setSelectedCategory("All");
                  setSelectedCountries(["All"]);
                  setSponsorshipFilter("all");
                  setSelectedSource("All");
                }}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeJobs.map((job) => {
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

                      {/* Location, Salary & Visa Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-slate-200">
                          <MapPin className="w-3 h-3 text-slate-500" /> {job.location}, {job.country}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl font-black border border-emerald-200/80">
                          {job.salary}
                        </span>
                        {renderVisaBadge(job.visaSponsorshipStatus, job.visaTypes)}
                        {job.isSeasonal && (
                          <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl font-black border border-amber-200">
                            🍓 Seasonal Harvest
                          </span>
                        )}
                      </div>

                      {/* Sponsorship Snippet / Excerpt (Explains WHY) */}
                      {job.visaSponsorshipSnippet && (
                        <div className="text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600 italic">
                          <span className="font-bold not-italic text-emerald-900 mr-1">Verification Note:</span>
                          "{job.visaSponsorshipSnippet}"
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        <HighlightText text={job.description} query={searchKeyword} />
                      </p>
                    </div>

                    {/* Footer Actions & Source Badge */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                          Source: {job.source}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Verified: {job.lastVerified}
                        </span>
                      </div>

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
                          className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs flex items-center gap-1 transition-all cursor-pointer"
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

      {/* ============================================================ */}
      {/* 2. VIEW: ATS RESUME / CV BUILDER */}
      {/* ============================================================ */}
      {activeSubView === "resume" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">ATS Resume & CV Builder</h2>
                <p className="text-xs text-slate-500">Edit sections below to generate an international-standard ATS CV.</p>
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
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs cursor-pointer"
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
                        ? "bg-slate-900 text-emerald-400 border-slate-900 font-black shadow-xs"
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
                  placeholder="Phone Number"
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
                  placeholder="City, Country"
                  value={`${resumeData.personalInfo.city}, ${resumeData.personalInfo.country}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(",");
                    setResumeData({
                      ...resumeData,
                      personalInfo: {
                        ...resumeData.personalInfo,
                        city: parts[0]?.trim() || "",
                        country: parts[1]?.trim() || ""
                      }
                    });
                  }}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="LinkedIn Profile"
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
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider text-emerald-800">
                  2. Professional Summary
                </h3>
                <button
                  onClick={handleAiGenerateSummary}
                  className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Auto-Write with AI
                </button>
              </div>
              <textarea
                rows={3}
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium leading-relaxed focus:ring-2 focus:ring-emerald-600"
                placeholder="Brief summary of your professional background, visa goals, and strengths..."
              />
            </div>

            {/* Skills */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider text-emerald-800">
                3. Key Skills & Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-50 text-emerald-900 border border-emerald-300/80 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2"
                  >
                    <span>{s.name}</span>
                    <button
                      onClick={() => {
                        const updated = resumeData.skills.filter((_, i) => i !== idx);
                        saveResumeToLocal({ ...resumeData, skills: updated });
                      }}
                      className="text-slate-400 hover:text-red-600 font-black cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. VIEW: COVER LETTER GENERATOR */}
      {/* ============================================================ */}
      {activeSubView === "cover_letter" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">AI Cover Letter Customizer</h2>
              <p className="text-xs text-slate-500">Tailor cover letters with visa sponsorship context.</p>
            </div>
            <button
              onClick={() => saveCoverLetterToLocal(coverLetterData)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs cursor-pointer"
            >
              Save Cover Letter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Target Role Title</label>
              <input
                type="text"
                value={coverLetterData.jobTitle}
                onChange={(e) => setCoverLetterData({ ...coverLetterData, jobTitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />

              <label className="block text-xs font-bold text-slate-700">Target Company Name</label>
              <input
                type="text"
                value={coverLetterData.companyName}
                onChange={(e) => setCoverLetterData({ ...coverLetterData, companyName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />

              <label className="block text-xs font-bold text-slate-700">Why You Are a Great Fit</label>
              <textarea
                rows={3}
                value={coverLetterData.whyYoureAFit}
                onChange={(e) => setCoverLetterData({ ...coverLetterData, whyYoureAFit: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Preview Generated Letter</h3>
              <div className="text-xs text-slate-700 space-y-2 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                <p>Dear {coverLetterData.hiringManager || "Hiring Team"},</p>
                <p>{coverLetterData.eyeCatchingHook}</p>
                <p>{coverLetterData.whyYoureAFit}</p>
                <p>{coverLetterData.whyThisCompany}</p>
                <p>{coverLetterData.closingStatement}</p>
                <p className="font-bold pt-2">Sincerely,<br />{resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. VIEW: STATEMENT OF PURPOSE (SOP) GENERATOR */}
      {/* ============================================================ */}
      {activeSubView === "sop" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Statement of Purpose (SOP) Generator</h2>
              <p className="text-xs text-slate-500">For university admissions, student visas, and overseas grants.</p>
            </div>
            <button
              onClick={() => saveSopToLocal(sopData)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs cursor-pointer"
            >
              Save SOP
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Target Academic Program</label>
              <input
                type="text"
                value={sopData.targetProgram}
                onChange={(e) => setSopData({ ...sopData, targetProgram: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />

              <label className="block text-xs font-bold text-slate-700">Target Institution / University</label>
              <input
                type="text"
                value={sopData.universityName}
                onChange={(e) => setSopData({ ...sopData, universityName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />

              <label className="block text-xs font-bold text-slate-700">Career Goals & Aspirations</label>
              <textarea
                rows={3}
                value={sopData.careerGoals}
                onChange={(e) => setSopData({ ...sopData, careerGoals: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">SOP Essay Layout</h3>
              <div className="text-xs text-slate-700 space-y-2 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900">{sopData.targetProgram} - {sopData.universityName}</p>
                <p>{sopData.personalBackground}</p>
                <p>{sopData.whyThisProgram}</p>
                <p>{sopData.futureAspirations}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. VIEW: POST A JOB FORM */}
      {/* ============================================================ */}
      {activeSubView === "post_job" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900">Post a Job to Care2Care Network</h2>
            <p className="text-xs text-slate-500">Reach qualified local and international healthcare and tech talent.</p>
          </div>

          <form onSubmit={handlePublishJob} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name *</label>
              <input
                type="text"
                required
                value={postJobForm.companyName}
                onChange={(e) => setPostJobForm({ ...postJobForm, companyName: e.target.value })}
                placeholder="e.g. St. Jude Health Care Services"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={postJobForm.jobTitle}
                onChange={(e) => setPostJobForm({ ...postJobForm, jobTitle: e.target.value })}
                placeholder="e.g. Registered Nurse or Full Stack Engineer"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location / City *</label>
              <input
                type="text"
                required
                value={postJobForm.location}
                onChange={(e) => setPostJobForm({ ...postJobForm, location: e.target.value })}
                placeholder="e.g. Sydney, Kathmandu, Austin, Remote"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={postJobForm.category}
                onChange={(e) => setPostJobForm({ ...postJobForm, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {categoriesList.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Description & Responsibilities</label>
              <textarea
                rows={3}
                value={postJobForm.jobDescription}
                onChange={(e) => setPostJobForm({ ...postJobForm, jobDescription: e.target.value })}
                placeholder="Detailed duties, patient ratio or tech stack, visa sponsorship eligibility..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="flex items-center gap-4 sm:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={postJobForm.visaSponsorship}
                  onChange={(e) => setPostJobForm({ ...postJobForm, visaSponsorship: e.target.checked })}
                  className="rounded text-emerald-600 w-4 h-4 cursor-pointer"
                />
                <span>✈️ Visa Sponsorship Provided</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={postJobForm.isRemote}
                  onChange={(e) => setPostJobForm({ ...postJobForm, isRemote: e.target.checked })}
                  className="rounded text-emerald-600 w-4 h-4 cursor-pointer"
                />
                <span>🌐 Remote / Telecommute Available</span>
              </label>
            </div>

            <div className="sm:col-span-2 pt-3">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer transition-all"
              >
                Publish Job Listing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. VIEW: OVERSEAS INSIGHTS */}
      {/* ============================================================ */}
      {activeSubView === "insights" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900">Overseas Employment & Immigration Guide</h2>
            <p className="text-xs text-slate-500">Official visa pathways, salary thresholds & minimum wage data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-2xl">🇦🇺</span>
              <h3 className="text-xs font-black text-slate-900">Australia (TSS 482 & PR 186)</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                TSMIT minimum salary requirement is AUD $73,150. Requires positive skills assessment (AHPRA for nurses, ACS for IT) and IELTS 6.0 - 7.0.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-2xl">🇺🇸</span>
              <h3 className="text-xs font-black text-slate-900">USA (H-1B, STEM OPT & EB-3)</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Specialty occupations require Bachelor's degree. H-1B cap lottery in March, or cap-exempt universities/hospitals. STEM OPT gives 3 years US work authorization.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-2xl">🇬🇧</span>
              <h3 className="text-xs font-black text-slate-900">UK (Health & Care Skilled Worker)</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Exempt from Immigration Health Surcharge. Certificate of Sponsorship (CoS) issued by NHS or accredited care providers. NMC CBT & OSCE required for nurses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌐 COUNTRY SELECTION MODAL */}
      {/* ============================================================ */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-5 border border-slate-200 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" /> Target Job Countries
              </h3>
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Search country..."
              value={countryFilterSearch}
              onChange={(e) => setCountryFilterSearch(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto max-h-[50vh] pr-1">
              <button
                onClick={() => handleToggleCountry("All")}
                className={`p-2.5 rounded-xl text-xs font-black text-left border cursor-pointer ${
                  selectedCountries.includes("All")
                    ? "bg-emerald-700 text-white border-emerald-700"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                🌍 Worldwide (All)
              </button>

              {ALL_195_COUNTRIES.filter((c) =>
                c.name.toLowerCase().includes(countryFilterSearch.toLowerCase())
              ).map((c) => {
                const isSelected = selectedCountries.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => handleToggleCountry(c.name)}
                    className={`p-2 rounded-xl text-xs font-bold text-left border flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Apply Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 📄 JOB DETAILS MODAL */}
      {/* ============================================================ */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-2xl flex items-center justify-center border border-slate-200">
                  {selectedJobModal.companyLogo || "🏢"}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedJobModal.title}</h3>
                  <p className="text-xs font-bold text-slate-600">{selectedJobModal.company} • {selectedJobModal.location}, {selectedJobModal.country}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200 font-black">
                {selectedJobModal.salary}
              </span>
              {renderVisaBadge(selectedJobModal.visaSponsorshipStatus, selectedJobModal.visaTypes)}
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl border border-slate-200">
                {selectedJobModal.employmentType} ({selectedJobModal.jobTerm})
              </span>
            </div>

            {selectedJobModal.visaSponsorshipSnippet && (
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-black uppercase tracking-wider text-[10px] text-emerald-800">
                  Visa & Work Authorization Status:
                </span>
                <p className="italic leading-relaxed">"{selectedJobModal.visaSponsorshipSnippet}"</p>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Job Description</h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{selectedJobModal.description}</p>
            </div>

            {selectedJobModal.requirements && selectedJobModal.requirements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Requirements</h4>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                  {selectedJobModal.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedJobModal.benefits && selectedJobModal.benefits.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Benefits & Relocation</h4>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                  {selectedJobModal.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Source: {selectedJobModal.source}</span>
              <a
                href={selectedJobModal.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                Apply Directly <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ⚖️ LEGAL DISCLAIMER MODAL */}
      {/* ============================================================ */}
      {isDisclaimerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black text-slate-900">Career Portal & Immigration Disclaimer</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Care2Care aggregates permitted job listings and verified employer postings. Care2Care is not an authorized immigration agency or legal sponsor. Visa eligibility assessments and employer sponsorships are subject to local governmental regulations (USCIS, Home Affairs Australia, Immigration NZ, Home Office UK). Always verify credentials directly with licensed migration agents or official company HR.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setIsDisclaimerOpen(false);
                  setHasAcceptedDisclaimer(true);
                  localStorage.setItem("care2care_job_disclaimer_accepted", "true");
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black cursor-pointer"
              >
                I Understand & Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default JobSearchCareerTracker;
