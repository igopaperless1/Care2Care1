/**
 * Care2Care Server-Side Job Search & Intent Engine
 */

export interface ServerJob {
  id: string;
  source: "Indeed" | "LinkedIn" | "Seek" | "Remotive" | "Arbeitnow" | "USAJobs" | "MeroJob" | "Care2Care Verified";
  sourceJobId?: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  city?: string;
  country: string;
  isRemote: boolean;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  jobTerm: "Fixed" | "Long-term" | "Contract" | "Internship";
  category: string;
  salary: string;
  salaryType: "hour" | "week" | "fortnight" | "month" | "year";
  salaryMin?: number;
  salaryMax?: number;
  postedDate: string;
  timeRemaining?: string;
  description: string;
  requirements: string[];
  preferredQualifications?: string[];
  benefits?: string[];
  sourceUrl: string;
  applyUrl: string;
  visaSponsorshipStatus: "CONFIRMED" | "LIKELY" | "MENTIONED" | "UNCLEAR" | "NOT INDICATED" | "NOT AVAILABLE";
  visaSponsorshipSnippet?: string;
  visaTypes: string[];
  isSeasonal: boolean;
  contactEmail?: string;
  relevanceScore?: number;
  lastVerified: string;
}

export const SERVER_VERIFIED_JOBS: ServerJob[] = [
  {
    id: "srv-us-1",
    source: "Indeed",
    sourceJobId: "ind-us-78921",
    title: "Senior Software Engineer (H-1B / Visa Transfer Supported)",
    company: "Apex Cloud Systems Inc.",
    companyLogo: "☁️",
    location: "Austin, TX",
    city: "Austin",
    country: "USA",
    isRemote: true,
    employmentType: "Full-time",
    jobTerm: "Long-term",
    category: "IT & Software",
    salary: "$140,000 - $185,000 / yr",
    salaryType: "year",
    salaryMin: 140000,
    salaryMax: 185000,
    postedDate: "Today",
    timeRemaining: "25 days left",
    description: "Apex Cloud is seeking a Senior Distributed Systems Engineer. We are an E-Verify employer and provide H-1B visa sponsorship, H-1B transfers, and PERM / Green Card processing for qualified international engineers. Proficiency with Go, React, Kubernetes, and AWS required.",
    requirements: [
      "BS or MS in Computer Science or equivalent",
      "4+ years building high-throughput microservices",
      "Experience with Kubernetes, Go/TypeScript, and PostgreSQL",
      "Willing to collaborate in US Central time zone"
    ],
    preferredQualifications: ["Prior experience with distributed consensus algorithms", "Open-source contributions"],
    benefits: ["Full Visa & Legal Cost Coverage", "401(k) 5% Match", "Comprehensive Health/Dental", "Home Office Stipend"],
    sourceUrl: "https://www.indeed.com/jobs?q=software+engineer+visa+sponsorship",
    applyUrl: "https://www.indeed.com/jobs?q=software+engineer+visa+sponsorship",
    visaSponsorshipStatus: "CONFIRMED",
    visaSponsorshipSnippet: "We are an E-Verify employer and provide H-1B visa sponsorship, H-1B transfers, and PERM / Green Card processing.",
    visaTypes: ["H-1B", "STEM OPT", "Green Card (EB-2/EB-3)"],
    isSeasonal: false,
    contactEmail: "immigration-careers@apexcloud.io",
    lastVerified: "2025-05-14",
  },
  {
    id: "srv-us-2",
    source: "LinkedIn",
    sourceJobId: "li-us-44102",
    title: "Full Stack AI / React Engineer (Visa Sponsorship Available)",
    company: "Cognitive Healthcare AI",
    companyLogo: "🤖",
    location: "San Francisco, CA",
    city: "San Francisco",
    country: "USA",
    isRemote: true,
    employmentType: "Full-time",
    jobTerm: "Long-term",
    category: "IT & Software",
    salary: "$130,000 - $170,000 / yr",
    salaryType: "year",
    salaryMin: 130000,
    salaryMax: 170000,
    postedDate: "1 day ago",
    timeRemaining: "20 days left",
    description: "Join our healthcare intelligence team building patient-centric AI tools. We sponsor H-1B, O-1, and TN visas for standout candidates, and support STEM OPT extensions.",
    requirements: [
      "Strong proficiency in React, TypeScript, Python, and PyTorch/FastAPI",
      "3+ years product development experience",
      "Demonstrated ability to ship scalable web applications"
    ],
    benefits: ["Visa Support (H-1B / O-1 / TN)", "Unlimited PTO", "Equity Grants"],
    sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=software+engineer+visa+sponsorship",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=software+engineer+visa+sponsorship",
    visaSponsorshipStatus: "CONFIRMED",
    visaSponsorshipSnippet: "We sponsor H-1B, O-1, and TN visas for standout candidates, and support STEM OPT extensions.",
    visaTypes: ["H-1B", "O-1", "TN Visa", "STEM OPT"],
    isSeasonal: false,
    contactEmail: "talent@cognitivehealth.ai",
    lastVerified: "2025-05-14",
  },
  {
    id: "srv-au-1",
    source: "Seek",
    sourceJobId: "seek-au-99120",
    title: "Registered Nurse - Aged Care & Rehabilitation (482 TSS Visa Sponsorship)",
    company: "St. Jude Healthcare Services",
    companyLogo: "🏥",
    location: "Sydney, NSW",
    city: "Sydney",
    country: "Australia",
    isRemote: false,
    employmentType: "Full-time",
    jobTerm: "Long-term",
    category: "Healthcare",
    salary: "AUD $88,000 - $112,000 / yr",
    salaryType: "year",
    salaryMin: 88000,
    salaryMax: 112000,
    postedDate: "2 days ago",
    timeRemaining: "12 days left",
    description: "St. Jude Healthcare is recruiting experienced Registered Nurses for our Sydney aged care and rehabilitation clinics. We offer accredited 482 Temporary Skill Shortage (TSS) visa sponsorship with pathway to Australian Permanent Residency (PR 186). Relocation allowance included.",
    requirements: [
      "Bachelor of Nursing or recognized international equivalent",
      "Registration with AHPRA or in-progress initial assessment",
      "Minimum 2 years hospital or geriatric clinical experience",
      "IELTS 7.0 or OET Grade B in all sub-tests"
    ],
    preferredQualifications: ["Wound care certification", "Palliative clinical experience"],
    benefits: ["482 TSS Visa Sponsorship", "AUD $5,000 Relocation Grant", "3 Months Subsidized Accommodation"],
    sourceUrl: "https://www.seek.com.au/jobs?keywords=nurse+sponsorship",
    applyUrl: "https://www.seek.com.au/jobs?keywords=nurse+sponsorship",
    visaSponsorshipStatus: "CONFIRMED",
    visaSponsorshipSnippet: "We offer accredited 482 Temporary Skill Shortage (TSS) visa sponsorship with pathway to Australian Permanent Residency.",
    visaTypes: ["482 TSS (Australia)"],
    isSeasonal: false,
    contactEmail: "recruitment@stjudehealth.com.au",
    lastVerified: "2025-05-14",
  },
  {
    id: "srv-uk-1",
    source: "Indeed",
    sourceJobId: "ind-uk-61240",
    title: "NHS Staff Nurse / Clinical Caregiver (Skilled Worker Visa Tier 2)",
    company: "Greater Manchester NHS Trust",
    companyLogo: "🇬🇧",
    location: "Manchester",
    city: "Manchester",
    country: "UK",
    isRemote: false,
    employmentType: "Full-time",
    jobTerm: "Long-term",
    category: "Healthcare",
    salary: "£29,970 - £36,483 / yr (Band 5)",
    salaryType: "year",
    salaryMin: 29970,
    salaryMax: 36483,
    postedDate: "3 days ago",
    timeRemaining: "18 days left",
    description: "The NHS Greater Manchester Trust welcomes overseas nurses. We issue Certificates of Sponsorship (CoS) for the UK Health and Care Skilled Worker Visa, pay for your initial NMC registration CBT/OSCE, and provide arrival relocation flights.",
    requirements: [
      "BSc Nursing qualification",
      "Passed NMC CBT Part 1",
      "OET Grade B or IELTS 7.0",
      "Minimum 12 months acute ward experience"
    ],
    benefits: ["UK Skilled Worker Visa CoS", "OSCE Training & Exam Fee Paid", "NHS Pension & Relocation Flight"],
    sourceUrl: "https://uk.indeed.com/jobs?q=nurse+sponsorship",
    applyUrl: "https://uk.indeed.com/jobs?q=nurse+sponsorship",
    visaSponsorshipStatus: "CONFIRMED",
    visaSponsorshipSnippet: "We issue Certificates of Sponsorship (CoS) for the UK Health and Care Skilled Worker Visa.",
    visaTypes: ["Skilled Worker (UK)"],
    isSeasonal: false,
    contactEmail: "overseas-recruitment@mft.nhs.uk",
    lastVerified: "2025-05-14",
  },
  {
    id: "srv-ca-1",
    source: "LinkedIn",
    sourceJobId: "li-ca-55201",
    title: "Senior Backend / Distributed Systems Engineer (LMIA / Global Talent Stream)",
    company: "ShopStream Canada",
    companyLogo: "🍁",
    location: "Toronto, ON",
    city: "Toronto",
    country: "Canada",
    isRemote: true,
    employmentType: "Full-time",
    jobTerm: "Long-term",
    category: "IT & Software",
    salary: "CAD $135,000 - $165,000 / yr",
    salaryType: "year",
    salaryMin: 135000,
    salaryMax: 165000,
    postedDate: "Today",
    timeRemaining: "30 days left",
    description: "ShopStream is hiring Senior Software Engineers under Canada's Global Talent Stream (GTS). Fast-track 2-week LMIA-exempt work permit sponsorship provided, with expedited path to Express Entry Canadian Permanent Residency.",
    requirements: [
      "5+ years backend engineering in Node.js, Java, or Rust",
      "Experience with high-scale e-commerce architectures",
      "Strong understanding of relational data and caching"
    ],
    benefits: ["Canada Global Talent Stream 2-Week Work Permit", "Full Relocation Support", "Stock Options"],
    sourceUrl: "https://ca.indeed.com/jobs?q=software+engineer+sponsorship",
    applyUrl: "https://ca.indeed.com/jobs?q=software+engineer+sponsorship",
    visaSponsorshipStatus: "CONFIRMED",
    visaSponsorshipSnippet: "Fast-track 2-week LMIA-exempt work permit sponsorship provided under Canada's Global Talent Stream.",
    visaTypes: ["LMIA / GTS (Canada)"],
    isSeasonal: false,
    contactEmail: "global-talent@shopstream.ca",
    lastVerified: "2025-05-14",
  },
  {
    id: "srv-nz-1",
    source: "Seek",
    sourceJobId: "seek-nz-22019",
    title: "Aged Caregiver & Personal Care Assistant (Accredited Employer Work Visa)",
    company: "SilverCare New Zealand Ltd",
    companyLogo: "👵",
    location: "Auckland",
    city: "Auckland",
    country: "New Zealand",
    isRemote: false,
    employmentType: "Full-time",
    jobTerm: "Long-term",
    category: "Healthcare",
    salary: "NZD $28.50 - $33.00 / hr",
    salaryType: "hour",
    salaryMin: 28.5,
    salaryMax: 33.0,
    postedDate: "1 day ago",
    timeRemaining: "15 days left",
    description: "Assist elderly residents with daily living activities, medication management, and mobility support. SilverCare is an Immigration NZ Accredited Employer offering job tokens for the Accredited Employer Work Visa (AEWV). Pathway to residency for qualified care workforce.",
    requirements: [
      "NZ Certificate in Health and Wellbeing (Level 3 or 4) or overseas healthcare degree",
      "Valid CPR and First Aid Certificate",
      "Clear criminal background check",
      "Empathetic communication and patience"
    ],
    benefits: ["AEWV Visa Token Provided", "Overtime Rates", "Ongoing Professional Training"],
    sourceUrl: "https://nz.indeed.com/jobs?q=caregiver+sponsorship",
    applyUrl: "https://nz.indeed.com/jobs?q=caregiver+sponsorship",
    visaSponsorshipStatus: "CONFIRMED",
    visaSponsorshipSnippet: "SilverCare is an Immigration NZ Accredited Employer offering job tokens for the Accredited Employer Work Visa (AEWV).",
    visaTypes: ["AEWV (New Zealand)"],
    isSeasonal: false,
    contactEmail: "visas@silvercare.co.nz",
    lastVerified: "2025-05-14",
  },
  {
    id: "srv-us-neg-1",
    source: "Indeed",
    sourceJobId: "ind-us-neg-9901",
    title: "Government Security Compliance Officer (US Citizens Only - No Sponsorship)",
    company: "Federal Defense Solutions",
    companyLogo: "🛡️",
    location: "Washington, DC",
    city: "Washington",
    country: "USA",
    isRemote: false,
    employmentType: "Full-time",
    jobTerm: "Long-term",
    category: "Finance & Accounting",
    salary: "$95,000 - $125,000 / yr",
    salaryType: "year",
    salaryMin: 95000,
    salaryMax: 125000,
    postedDate: "5 days ago",
    timeRemaining: "10 days left",
    description: "Ensure regulatory compliance for federal agencies. Candidates must be authorized to work in the USA without sponsorship. U.S. citizenship required for security clearance. Employer will not sponsor visas.",
    requirements: [
      "Active Security Clearance or US Citizenship",
      "3+ years compliance and risk auditing",
      "Must be authorized to work without sponsorship"
    ],
    benefits: ["Federal Pension", "Full Health Coverage"],
    sourceUrl: "https://www.indeed.com",
    applyUrl: "https://www.indeed.com",
    visaSponsorshipStatus: "NOT AVAILABLE",
    visaSponsorshipSnippet: "Candidates must be authorized to work in the USA without sponsorship. Employer will not sponsor visas.",
    visaTypes: [],
    isSeasonal: false,
    contactEmail: "clearance-hr@feddefense.gov",
    lastVerified: "2025-05-14",
  }
];

export function parseQueryOnServer(query: string, location = "", country = "") {
  const cleanQ = (query || "").trim();
  const lowerQ = cleanQ.toLowerCase();

  const sponsorshipTerms = [
    "visa sponsorship", "visa sponsor", "sponsorship", "sponsor", "sponsoring",
    "h1b", "h-1b", "opt", "cpt", "stem opt", "tn visa", "e-3", "o-1",
    "green card", "international candidates", "overseas candidates",
    "work visa", "work authorization sponsorship", "relocation sponsorship"
  ];

  let visaSponsorshipRequired = sponsorshipTerms.some((t) => lowerQ.includes(t));
  const detectedVisaTypes: string[] = [];

  if (/\bh-?1b\b/i.test(lowerQ)) detectedVisaTypes.push("H-1B");
  if (/\bopt\b/i.test(lowerQ)) detectedVisaTypes.push("OPT");
  if (/\bstem\s+opt\b/i.test(lowerQ)) detectedVisaTypes.push("STEM OPT");
  if (/\btn\s+visa|\btn-1\b/i.test(lowerQ)) detectedVisaTypes.push("TN Visa");
  if (/\be-?3\b/i.test(lowerQ)) detectedVisaTypes.push("E-3");
  if (/\bo-?1\b/i.test(lowerQ)) detectedVisaTypes.push("O-1");
  if (/\b482\b|\btss\b/i.test(lowerQ)) detectedVisaTypes.push("482 TSS (Australia)");
  if (/\baewv\b/i.test(lowerQ)) detectedVisaTypes.push("AEWV (New Zealand)");

  let detectedCountry = country && country !== "All" ? country : "";
  if (!detectedCountry) {
    if (/\b(usa|united states|us|america)\b/i.test(lowerQ)) detectedCountry = "USA";
    else if (/\b(australia|sydney|melbourne)\b/i.test(lowerQ)) detectedCountry = "Australia";
    else if (/\b(canada|toronto)\b/i.test(lowerQ)) detectedCountry = "Canada";
    else if (/\b(uk|united kingdom|london)\b/i.test(lowerQ)) detectedCountry = "UK";
    else if (/\b(new zealand|nz|auckland)\b/i.test(lowerQ)) detectedCountry = "New Zealand";
  }

  let cleanTitle = lowerQ
    .replace(/\bjobs?\b/g, " ")
    .replace(/\bwith\b/g, " ")
    .replace(/\bfor\b/g, " ")
    .replace(/\bin\b/g, " ")
    .replace(/\brequiring\b/g, " ")
    .replace(/\bvisa sponsorship\b/g, " ")
    .replace(/\bvisa sponsor\b/g, " ")
    .replace(/\bsponsorship\b/g, " ")
    .replace(/\bsponsor\b/g, " ")
    .replace(/\busa\b/g, " ")
    .replace(/\baustralia\b/g, " ")
    .replace(/\bcanada\b/g, " ")
    .replace(/\buk\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanTitle) cleanTitle = "All Roles";

  return {
    rawQuery: cleanQ,
    jobTitle: cleanTitle,
    location: location || detectedCountry || "Worldwide",
    country: detectedCountry,
    visaSponsorshipRequired,
    visaTypes: detectedVisaTypes,
    searchVariants: [
      cleanTitle,
      `${cleanTitle} visa sponsorship`,
      `${cleanTitle} H1B`,
    ]
  };
}
