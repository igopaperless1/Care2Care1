export type FamilyTab =
  | "interactive_tree"
  | "pedigree"
  | "descendant"
  | "fan_chart"
  | "timeline"
  | "members"
  | "guru_profile"
  | "guru_details"
  | "spiritual_details"
  | "family_link"
  | "events_rituals"
  | "janam_tithi"
  | "disciples"
  | "fasting"
  | "documents_media"
  | "notes_instructions"
  | "analytics"
  | "export_sync";

export type Gender = "Male" | "Female" | "Other";

export interface FamilyMember {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  maidenName?: string;
  nickname?: string;
  prefix?: string;
  suffix?: string;
  gender: Gender;
  isSelf: boolean;
  isAlive: boolean;
  dateOfBirth?: string;
  placeOfBirth?: string;
  dateOfDeath?: string;
  placeOfDeath?: string;
  causeOfDeath?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  occupation?: string;
  education?: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  religion?: string;
  caste?: string;
  gotra?: string;
  kula?: string;
  nationality?: string;
  nationalId?: string;
  passportNumber?: string;
  profilePhoto?: string;
  biography?: string;
  notes?: string;

  // Relationship Links
  fatherId?: string;
  motherId?: string;
  spouseIds?: string[];
  marriageDates?: { [spouseId: string]: string };
  ceremonyTypes?: { [spouseId: string]: string };
  childrenIds?: string[];
  siblingIds?: string[];

  // Attachments
  documents?: { id: string; title: string; type: string; fileUrl: string }[];
  photos?: string[];
  religiousCeremonies?: string[];
  healthConditions?: string[];
}

export interface GuruProfile {
  id: string;
  name: string;
  role: "Guru" | "Guru Mata" | "Spiritual Preceptor";
  alsoKnownAs: string;
  dateOfBirthVS: string; // Vikram Samvat
  dateOfBirthGregorian: string;
  placeOfBirth: string;
  dateOfDikshaVS: string;
  dateOfDikshaGregorian: string;
  gotra: string;
  sampradaya: string;
  currentAshram: string;
  photoUrl: string;
  thumbnailPhotos: string[];
  
  // Personal & Spiritual Details
  gender: string;
  bloodGroup: string;
  nationality: string;
  maritalStatus: string;
  languagesKnown: string[];
  education: string;
  professionBeforeDiksha: string;
  biography: string;
  phone: string;
  email: string;
  altPhone: string;
  permanentAddress: string;
  temporaryAddress: string;

  // Spiritual & Discipleship
  discipleSince: string;
  initiationMantra: string;
  spiritualGuidanceFor: string;
  totalDisciples: number;
  roleInLife: string;
  teachingsUpdesh: string;
  specialInstructions: string;

  // Punyatithi & Mahasamadhi
  isMahasamadhi: boolean;
  punyatithiVS?: string;
  punyatithiGregorian?: string;
  placeOfMahasamadhi?: string;
  tithiType?: string;
  timeOfMahasamadhi?: string;

  // Shraddha Details
  annualShraddhaDate?: string;
  shraddhaTithiType?: string;
  shraddhaVidhi?: string;
  shraddhaLocation?: string;
  shraddhaNotes?: string;

  // Patrika & docs
  janamPatrikaFileName?: string;
  janamPatrikaFileSize?: string;
}

export interface GuruMataProfile {
  id: string;
  name: string;
  role: string;
  alsoKnownAs: string;
  dateOfBirthVS: string;
  dateOfBirthGregorian: string;
  dateOfDikshaVS: string;
  dateOfDikshaGregorian: string;
  gotra: string;
  photoUrl: string;
  biography: string;
  currentAshram: string;
}

export interface SpiritualEvent {
  id: string;
  title: string;
  type: "Guru Purnima" | "Janam Tithi" | "Punyatithi" | "Shraddha" | "Diwas / Aradhana" | "Festival" | "Satsang";
  dateFormatted: string;
  tithiVS?: string;
  daysRemainingLabel: string;
  isRecurring: boolean;
  recurringFrequency?: string;
  location?: string;
  description?: string;
  organizer?: string;
}

export interface DiscipleRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  initiationDate: string;
  initiationLocation?: string;
  isFamilyDisciple: boolean;
  status: "Active Disciple" | "Pending Initiation" | "Alumni";
  role?: string;
  avatar?: string;
}

export interface FastingRule {
  id: string;
  title: string;
  type: "Full Day Fast" | "Half Day Fast" | "Ekadashi Fast" | "Custom Vrata";
  timing: string;
  status: "Upcoming" | "Recurring" | "Completed";
  description: string;
  allowedFoods: string[];
  guidelines: string[];
}

export interface FamilyDocumentMedia {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: "document" | "photo" | "video" | "audio";
  uploadedDate: string;
  category: "Diksha" | "Patrika" | "Photo" | "Audio" | "Legal" | "Certificate";
  url?: string;
}

export interface VedicLineageConfig {
  gotra: string;
  pravara: string[];
  varna: string;
  vedaSakha: string;
  kuldevi: string;
  kuldevta: string;
  moolGhar: string;
  isthadevata: string;
}
