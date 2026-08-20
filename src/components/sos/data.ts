import {
  SosEmergencyContact,
  SosContactGroup,
  SosNearbyService,
  SosMedicalProfile,
  SosIncident,
  SosAlertItem,
  SosHelpResource,
  SosActivityLogItem,
  SosSafetyPlan,
  SosSettingsConfig
} from "./types";

export const INITIAL_SOS_CONTACTS: SosEmergencyContact[] = [
  {
    id: "c1",
    name: "Amit Singh",
    relationship: "Brother",
    phone: "+977 9812345678",
    email: "amit.singh@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    priority: "primary",
    isFavorite: true,
    notes: "Lives 10 mins away. First responder contact."
  },
  {
    id: "c2",
    name: "Pooja Singh",
    relationship: "Sister",
    phone: "+977 9845678910",
    email: "pooja.singh@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    priority: "primary",
    isFavorite: true,
    notes: "Medical proxy and has spare keys."
  },
  {
    id: "c3",
    name: "Dad",
    relationship: "Father",
    phone: "+977 9856789123",
    email: "father.singh@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    priority: "secondary",
    isFavorite: true,
    notes: "Home landline backup available."
  },
  {
    id: "c4",
    name: "Mom",
    relationship: "Mother",
    phone: "+977 9867891234",
    email: "mother.singh@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    priority: "secondary",
    isFavorite: true,
    notes: "Available morning and evening."
  },
  {
    id: "c5",
    name: "Ravi Sharma",
    relationship: "Friend",
    phone: "+977 9800001111",
    email: "ravi.sharma@example.com",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    priority: "tertiary",
    isFavorite: false,
    notes: "Office colleague & daily commute partner."
  }
];

export const INITIAL_CONTACT_GROUPS: SosContactGroup[] = [
  {
    id: "g1",
    name: "Family Circle",
    description: "Immediate family members alerted synchronously on high priority",
    memberIds: ["c1", "c2", "c3", "c4"],
    color: "#FF5A36"
  },
  {
    id: "g2",
    name: "Close Friends",
    description: "Nearby friends alerted during outdoor emergencies & travels",
    memberIds: ["c5"],
    color: "#3B82F6"
  },
  {
    id: "g3",
    name: "Medical Team",
    description: "Primary physician, hospital emergency desk, and caregivers",
    memberIds: ["c1", "c2"],
    color: "#10B981"
  }
];

export const INITIAL_NEARBY_SERVICES: SosNearbyService[] = [
  {
    id: "s1",
    name: "City Hospital",
    type: "Hospital",
    distanceKm: 1.2,
    durationMin: 5,
    isOpen247: true,
    phone: "01-4240805",
    address: "Tripureshwor, Kathmandu, Nepal",
    lat: 27.6934,
    lng: 85.3148,
    rating: 4.8
  },
  {
    id: "s2",
    name: "Nepal Police Station",
    type: "Police",
    distanceKm: 1.5,
    durationMin: 6,
    isOpen247: true,
    phone: "100",
    address: "Ranipokhari, Kathmandu, Nepal",
    lat: 27.7072,
    lng: 85.3168,
    rating: 4.6
  },
  {
    id: "s3",
    name: "Care Ambulance Dispatch",
    type: "Ambulance",
    distanceKm: 1.1,
    durationMin: 4,
    isOpen247: true,
    phone: "102",
    address: "Bafal, Ring Road, Kathmandu",
    lat: 27.7011,
    lng: 85.2954,
    rating: 4.9
  },
  {
    id: "s4",
    name: "Roadside Assistance Quick Rescue",
    type: "Roadside",
    distanceKm: 2.0,
    durationMin: 8,
    isOpen247: true,
    phone: "+977 9801234455",
    address: "Kalanki Chowk, Kathmandu",
    lat: 27.6937,
    lng: 85.2816,
    rating: 4.7
  },
  {
    id: "s5",
    name: "Kathmandu Fire Brigade Station",
    type: "Fire",
    distanceKm: 2.1,
    durationMin: 7,
    isOpen247: true,
    phone: "101",
    address: "New Road, Kathmandu",
    lat: 27.7033,
    lng: 85.3115,
    rating: 4.8
  }
];

export const INITIAL_MEDICAL_PROFILE: SosMedicalProfile = {
  bloodGroup: "O+",
  allergies: ["Penicillin", "Pollen"],
  medicalConditions: ["Asthma"],
  currentMedications: ["Ventolin (Albuterol)", "Montelukast 10mg"],
  primaryDoctor: "Dr. Sandeep Shah",
  doctorPhone: "+977 9841298765",
  preferredHospital: "Norvic International Hospital",
  hospitalPhone: "01-5970032",
  organDonor: true,
  dnrStatus: false,
  emergencyNotes: "Carries inhaler in side backpack pocket. In case of asthma attack, assist with 2 puffs of Ventolin.",
  insuranceProvider: "Shikhar Health Protect",
  policyNumber: "SHK-2026-MED-9921",
  lastUpdated: "15 May 2025"
};

export const INITIAL_INCIDENTS: SosIncident[] = [
  {
    id: "inc-1",
    type: "Road Accident",
    title: "Minor two-wheeler collision at intersection",
    date: "15 May 2025",
    time: "08:30 PM",
    location: "Kathmandu, Nepal (Tripureshwor Chowk)",
    coordinates: { lat: 27.6934, lng: 85.3148 },
    description: "Rear-ended by a scooter at traffic light. Minor knee scratch, bike indicator cracked. Traffic police intervened.",
    status: "Open",
    reportedBy: "Roshan",
    severity: "Medium",
    photos: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&auto=format&fit=crop&q=80"]
  },
  {
    id: "inc-2",
    type: "Harassment",
    title: "Suspicious vehicle following on commute",
    date: "28 Apr 2025",
    time: "07:10 PM",
    location: "Lalitpur, Nepal (Jhamsikhel)",
    coordinates: { lat: 27.6782, lng: 85.3122 },
    description: "Silver sedan was tailing closely for 3 blocks. Activated fake call and ducked into nearby supermarket safely.",
    status: "In Progress",
    reportedBy: "Roshan",
    severity: "High",
    photos: []
  },
  {
    id: "inc-3",
    type: "Theft",
    title: "Bicycle lock tampered outside convenience store",
    date: "10 Apr 2025",
    time: "11:45 AM",
    location: "Kathmandu, Nepal (New Baneshwor)",
    coordinates: { lat: 27.6915, lng: 85.3421 },
    description: "Cable lock cut while inside store for 5 minutes. CCTV footage secured and submitted to local police beat.",
    status: "Closed",
    reportedBy: "Roshan",
    severity: "Low",
    photos: []
  }
];

export const INITIAL_ALERTS: SosAlertItem[] = [
  {
    id: "alt-1",
    type: "high_speed",
    title: "High Speed Alert",
    description: "Sudden deceleration and speed change detected above normal threshold on Ring Road.",
    timestamp: "15 May 2025, 8:30 PM",
    read: false,
    severity: "warning",
    actionRequired: true
  },
  {
    id: "alt-2",
    type: "geofence",
    title: "Geofence Alert",
    description: "You departed designated Home Safe Zone after 6:00 PM.",
    timestamp: "15 May 2025, 6:15 PM",
    read: false,
    severity: "info",
    actionRequired: false
  },
  {
    id: "alt-3",
    type: "battery_low",
    title: "Battery Low (14%)",
    description: "Device battery dropped below 15%. Location power saving mode recommended.",
    timestamp: "15 May 2025, 5:40 PM",
    read: true,
    severity: "warning",
    actionRequired: false
  },
  {
    id: "alt-4",
    type: "sos_test",
    title: "SOS Test Alert",
    description: "Monthly safety hardware and beacon simulated test completed successfully.",
    timestamp: "13 May 2025, 3:20 PM",
    read: true,
    severity: "info",
    actionRequired: false
  },
  {
    id: "alt-5",
    type: "checkin_missed",
    title: "Check-in Missed",
    description: "Scheduled evening 10:00 PM safety check-in was not confirmed within 15 minutes.",
    timestamp: "14 May 2025, 10:15 PM",
    read: true,
    severity: "danger",
    actionRequired: false
  }
];

export const INITIAL_HELP_RESOURCES: SosHelpResource[] = [
  {
    id: "res-1",
    category: "Emergency Numbers",
    name: "Nepal Police Emergency Control",
    phone: "100",
    tollFree: true,
    description: "National emergency police dispatch for immediate safety and crime response.",
    availability: "24/7 Nationwide"
  },
  {
    id: "res-2",
    category: "Emergency Numbers",
    name: "Red Cross & Nepal Ambulance Service",
    phone: "102",
    tollFree: true,
    description: "First aid, trauma response, and emergency patient hospital transport.",
    availability: "24/7 Nationwide"
  },
  {
    id: "res-3",
    category: "Emergency Numbers",
    name: "Fire & Rescue Brigade",
    phone: "101",
    tollFree: true,
    description: "Firefighting, structural collapse rescue, and hazardous material spills.",
    availability: "24/7 Nationwide"
  },
  {
    id: "res-4",
    category: "Emergency Numbers",
    name: "Traffic Police Control Center",
    phone: "103",
    tollFree: true,
    description: "Road accidents, traffic emergencies, hit-and-run, and towing assistance.",
    availability: "24/7 Nationwide"
  },
  {
    id: "res-5",
    category: "Government Helplines",
    name: "National Emergency Operations Center (NEOC)",
    phone: "1155",
    tollFree: true,
    description: "Ministry of Home Affairs disaster coordination, landslides, floods, and earthquakes.",
    availability: "24/7 Nationwide"
  },
  {
    id: "res-6",
    category: "Government Helplines",
    name: "Tourist Police Helpline",
    phone: "1144",
    tollFree: true,
    description: "Dedicated assistance for tourists, travelers, trekking emergencies, and lost property.",
    availability: "24/7 Nationwide"
  },
  {
    id: "res-7",
    category: "NGO & Support Groups",
    name: "Nepal Red Cross Society Headquarters",
    phone: "01-4270650",
    tollFree: false,
    description: "Disaster relief, blood bank coordination, community emergency volunteers.",
    availability: "8:00 AM - 8:00 PM"
  },
  {
    id: "res-8",
    category: "NGO & Support Groups",
    name: "National Human Rights Commission (NHRC)",
    phone: "01-5010015",
    tollFree: false,
    description: "Protection of civil rights, urgent intervention in illegal detentions or threats.",
    availability: "9:00 AM - 5:00 PM"
  },
  {
    id: "res-9",
    category: "Women Safety Resources",
    name: "National Women Commission (NWC) Helpline",
    phone: "1145",
    tollFree: true,
    description: "24/7 confidential domestic violence, harassment, shelter, and legal support.",
    availability: "24/7 Nationwide"
  },
  {
    id: "res-10",
    category: "Women Safety Resources",
    name: "Maiti Nepal Anti-Trafficking Helpline",
    phone: "01-4492904",
    tollFree: false,
    description: "Border rescue, crisis shelter, and sexual violence survivor assistance.",
    availability: "24/7 Crisis Team"
  },
  {
    id: "res-11",
    category: "Mental Health Support",
    name: "National Mental Health & Suicide Prevention",
    phone: "1166",
    tollFree: true,
    description: "Confidential psychological counseling, acute emotional distress, and crisis intervention.",
    availability: "24/7 Nationwide"
  },
  {
    id: "res-12",
    category: "Mental Health Support",
    name: "TPO Nepal Psychosocial Counseling",
    phone: "1660-01-02005",
    tollFree: true,
    description: "Certified clinical psychologists and trauma healing counselors.",
    availability: "9:00 AM - 6:00 PM"
  },
  {
    id: "res-13",
    category: "Disaster Management",
    name: "Department of Hydrology & Meteorology Flood Alert",
    phone: "1155",
    tollFree: true,
    description: "Live river basin flood warnings, rainfall gauges, and monsoon alerts.",
    availability: "24/7 Realtime"
  }
];

export const INITIAL_ACTIVITY_LOGS: SosActivityLogItem[] = [
  {
    id: "act-1",
    type: "sos_sent",
    title: "SOS Alert Sent",
    description: "Emergency distress broadcast initiated to Family Circle (4 recipients)",
    timestamp: "15 May 2025, 8:30 PM",
    location: "Kathmandu, Nepal (Tripureshwor)"
  },
  {
    id: "act-2",
    type: "location_shared",
    title: "Location Shared",
    description: "Live GPS coordinates broadcast link generated and dispatched via SMS",
    timestamp: "15 May 2025, 8:30 PM",
    recipient: "Amit Singh, Pooja Singh"
  },
  {
    id: "act-3",
    type: "contact_called",
    title: "Contact Called",
    description: "Direct emergency voice dial placed to Brother (Amit Singh)",
    timestamp: "15 May 2025, 8:31 PM",
    recipient: "Amit Singh (+977 9812345678)"
  },
  {
    id: "act-4",
    type: "incident_reported",
    title: "Incident Reported",
    description: "Submitted official incident report #INC-849: Road Accident at Tripureshwor",
    timestamp: "15 May 2025, 8:35 PM",
    location: "Tripureshwor Chowk"
  },
  {
    id: "act-5",
    type: "settings_updated",
    title: "Settings Updated",
    description: "Changed SOS activation method to 'Press & Hold 3s' and enabled Siren Alert Sound",
    timestamp: "15 May 2025, 7:45 PM"
  },
  {
    id: "act-6",
    type: "toolkit_used",
    title: "Safety Siren Activated",
    description: "Decibel siren alarm triggered for 12 seconds during testing",
    timestamp: "13 May 2025, 3:22 PM"
  },
  {
    id: "act-7",
    type: "checkin",
    title: "Safe Check-In Confirmed",
    description: "User verified safe arrival at Home Zone",
    timestamp: "13 May 2025, 6:00 PM"
  }
];

export const INITIAL_SAFETY_PLANS: SosSafetyPlan[] = [
  {
    id: "plan-1",
    name: "Home Medical & Cardiac Crisis Protocol",
    description: "Standard operating procedure in case of sudden chest pain, breathing difficulty, or collapse at home.",
    steps: [
      "1. Press & hold the SOS panic button for 3 seconds or trigger Ambulance 102.",
      "2. Unlock front door latch so medical responders and family can enter without delay.",
      "3. Sit upright in a comfortable chair or couch; loosen collar and belts.",
      "4. Inhale 2 puffs of Ventolin inhaler if experiencing asthma / bronchospasm.",
      "5. Primary contact (Amit Singh) will receive immediate live GPS link and automated SMS."
    ],
    emergencyContacts: ["c1", "c2"],
    emergencyMessage: "URGENT MEDICAL EMERGENCY: In distress at home address. Ambulance dispatched. Please come immediately!",
    locationDetails: "Home Address: House 42, Sanepa-2, Lalitpur. Gate code: 4821. Porch light is turned ON.",
    escapeRoutes: ["Main Living Room Front Gate", "Kitchen Rear Patio"],
    safePlaces: ["Living Room Couch", "Front Veranda"],
    importantDocuments: ["Medical Insurance Card", "Medication List (Fridge magnet)", "Blood Group Card"],
    notes: "First aid medical kit stored in hallway top drawer."
  },
  {
    id: "plan-2",
    name: "Earthquake & Natural Disaster Evacuation",
    description: "Immediate safety checklist during tremor or structural shaking in Kathmandu valley.",
    steps: [
      "1. Drop, Cover, and Hold On under a sturdy dining table or door frame until shaking stops.",
      "2. Turn off main kitchen gas cylinder valve and electrical breaker switch if accessible.",
      "3. Grab the Prepared Emergency Go-Bag containing water, flashlight, and documents.",
      "4. Evacuate calmly avoiding elevators, glass facades, and overhead power cables.",
      "5. Assemble at designated open ground safe zone: Sanepa Ward Community Ground (200m away)."
    ],
    emergencyContacts: ["c1", "c3", "c4"],
    emergencyMessage: "EARTHQUAKE ALERT: Safe and evacuated to Sanepa Ward Community Ground. Phone battery is good.",
    locationDetails: "Evacuation Point: Sanepa Ward Community Ground, Lalitpur.",
    escapeRoutes: ["Ground Floor Staircase Exit"],
    safePlaces: ["Sanepa Ward Open Ground", "Elm Tree Park"],
    importantDocuments: ["Citizenship & Passport Copies", "Emergency Cash", "Medical Prescription Folder"],
    notes: "Emergency Go-Bag is kept beside master bedroom door."
  },
  {
    id: "plan-3",
    name: "Late Night Solo Travel & Commute Safety",
    description: "Safety protocol for late-night transit, taxi rides, and remote routes.",
    steps: [
      "1. Enable Live Location Sharing to Family Circle group before boarding transport.",
      "2. Note taxi vehicle number and send snapshot to Amit Singh.",
      "3. Keep phone volume audible with Safety Toolkit 'Fake Call' ready.",
      "4. If feeling threatened, trigger 1-touch Siren or dial Police 100.",
      "5. Confirm arrival with Safe Check-In within 5 minutes of destination."
    ],
    emergencyContacts: ["c1", "c5"],
    emergencyMessage: "TRANSIT ALERT: Traveling late night via Taxi. Live tracking link active. Expecting arrival in 20 mins.",
    locationDetails: "Commute route from New Baneshwor to Sanepa.",
    escapeRoutes: ["Well-lit commercial road"],
    safePlaces: ["24/7 Fuel Station", "Police Checkpoint"],
    importantDocuments: ["Driver details", "Transit card"],
    notes: "Always keep battery above 30% before departure."
  }
];

export const INITIAL_SETTINGS: SosSettingsConfig = {
  activationMethod: "Press & Hold 3s",
  alertSound: "Siren",
  autoCallOnSos: true,
  autoCallContactId: "c1",
  shareExactLocation: true,
  enableCheckIn: true,
  checkInIntervalHours: 1,
  missedCheckInAction: "Alert Contacts",
  smsBroadcastEnabled: true,
  vibrationFeedback: true,
  strobeLightOnSos: true
};
