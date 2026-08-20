export type SosTab =
  | "dashboard"
  | "emergency_sos"
  | "contacts"
  | "nearby_help"
  | "safety_toolkit"
  | "medical_info"
  | "incidents"
  | "report_incident"
  | "alerts"
  | "resources"
  | "settings"
  | "activity_log"
  | "safety_plans";

export interface SosEmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  avatar?: string;
  priority: "primary" | "secondary" | "tertiary";
  isFavorite?: boolean;
  notes?: string;
}

export interface SosContactGroup {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  color: string;
}

export interface SosNearbyService {
  id: string;
  name: string;
  type: "Hospital" | "Police" | "Ambulance" | "Fire" | "Roadside" | "Helpline";
  distanceKm: number;
  durationMin: number;
  isOpen247: boolean;
  phone: string;
  address: string;
  lat?: number;
  lng?: number;
  rating?: number;
}

export interface SosMedicalProfile {
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  currentMedications: string[];
  primaryDoctor: string;
  doctorPhone?: string;
  preferredHospital: string;
  hospitalPhone?: string;
  organDonor: boolean;
  dnrStatus?: boolean;
  emergencyNotes: string;
  insuranceProvider?: string;
  policyNumber?: string;
  lastUpdated: string;
}

export type IncidentStatus = "Open" | "In Progress" | "Closed" | "Resolved";

export interface SosIncident {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  description: string;
  status: IncidentStatus;
  reportedBy: string;
  photos?: string[];
  audioRecordings?: string[];
  severity: "Low" | "Medium" | "High" | "Critical";
  assignedTo?: string;
}

export interface SosAlertItem {
  id: string;
  type: "high_speed" | "geofence" | "battery_low" | "sos_test" | "checkin_missed" | "weather" | "general";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  severity: "info" | "warning" | "danger";
  actionRequired?: boolean;
}

export interface SosHelpResource {
  id: string;
  category: "Emergency Numbers" | "Government Helplines" | "NGO & Support Groups" | "Women Safety Resources" | "Mental Health Support" | "Disaster Management";
  name: string;
  phone: string;
  tollFree?: boolean;
  description: string;
  website?: string;
  availability: string;
}

export interface SosActivityLogItem {
  id: string;
  type: "sos_sent" | "location_shared" | "contact_called" | "incident_reported" | "settings_updated" | "toolkit_used" | "checkin";
  title: string;
  description: string;
  timestamp: string;
  recipient?: string;
  location?: string;
}

export interface SosSafetyPlan {
  id: string;
  name: string;
  description: string;
  steps: string[];
  emergencyContacts: string[];
  emergencyMessage: string;
  locationDetails: string;
  escapeRoutes: string[];
  safePlaces: string[];
  importantDocuments: string[];
  notes?: string;
}

export interface SosSettingsConfig {
  activationMethod: "Press & Hold 3s" | "Tap to Activate" | "Triple Tap";
  alertSound: "Siren" | "Loud Alarm" | "High Beep" | "Silent Strobe";
  autoCallOnSos: boolean;
  autoCallContactId: string;
  shareExactLocation: boolean;
  enableCheckIn: boolean;
  checkInIntervalHours: number;
  missedCheckInAction: "Alert Contacts" | "Trigger SOS" | "Send SMS";
  smsBroadcastEnabled: boolean;
  vibrationFeedback: boolean;
  strobeLightOnSos: boolean;
}
