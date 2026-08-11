import React, { useState, useEffect } from "react";
import { Patient } from "../types";
import {
  Brain,
  Heart,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  PhoneCall,
  MessageSquare,
  Calendar as CalendarIcon,
  BarChart3,
  Settings,
  Award,
  Clock,
  Wind,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Play,
  Pause,
  Download,
  Share2,
  FileText,
  Volume2,
  Bell,
  Info,
  Lock,
  User,
  TrendingUp,
  Activity,
  Filter,
  Search,
  RefreshCw,
  Zap,
  Flame,
  Shield,
  Phone,
  Edit2,
  ChevronRight,
  Sun,
  Moon,
  LifeBuoy
} from "lucide-react";

interface MentalHealthTrackerProps {
  patient?: Patient;
}

export interface MentalHealthCheckIn {
  id: string;
  date: string;
  time: string;
  primaryMood: string; // 😊 Happy, 😌 Calm, 😐 Neutral, 😟 Anxious, 😢 Sad, 😡 Angry, 😨 Scared, 🥱 Tired, 😞 Depressed, 🤗 Grateful
  moodIntensity: number; // 1-10
  stressLevel: number; // 1-10
  anxietyLevel: number; // 1-10
  depressionLevel: number; // 1-10
  irritabilityLevel: number; // 1-10
  energyLevel: number; // 1-10
  triggers: string[];
  physicalSymptoms: string[];
  copingStrategies: string[];
  sleepHours: number;
  sleepQuality: "Poor" | "Fair" | "Good" | "Excellent";
  appetiteQuality: "Poor" | "Fair" | "Good" | "Excellent";
  journalNotes?: string;
  gratitudeItems: string[];
  goalsTomorrow?: string;
  feelingSuicidal: boolean;
  feelingSelfHarm: boolean;
  overallScore: number; // 0-100 calculated
}

export interface CBTThoughtRecord {
  id: string;
  date: string;
  time: string;
  location: string;
  situation: string;
  automaticThoughts: string;
  thoughtBeliefRating: number; // 1-10
  emotions: string[];
  initialEmotionIntensity: number; // 1-10
  physicalSensations?: string;
  evidenceSupporting: string;
  evidenceAgainst: string;
  alternativePerspective: string;
  rationalResponse: string;
  newThought: string;
  newThoughtBeliefRating: number; // 1-10
  newEmotionIntensity: number; // 1-10
  actionPlan?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface SafetyPlan {
  warningSigns: string[];
  copingStrategies: string[];
  supportNetworkContacts: string[];
  professionalContacts: string[];
  safeEnvironmentSteps: string[];
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  content: string;
  moodTag: string;
  tags: string[];
  gratitudeText?: string;
  privacy: "Private" | "Shared Provider" | "Public";
  voiceNoteAttached?: boolean;
}

export interface ScreeningResult {
  id: string;
  type: "PHQ-9" | "GAD-7" | "PSS-10";
  date: string;
  score: number;
  maxScore: number;
  severity: string;
  interpretation: string;
  answers: number[];
}

export const MentalHealthTracker: React.FC<MentalHealthTrackerProps> = () => {
  // Main Tab State
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "checkin" | "breathing" | "cbt" | "crisis" | "journal" | "screening" | "analytics" | "achievements" | "settings"
  >("dashboard");

  // Global Feedback Toast
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3200);
  };

  // Emergency Alert Toast State
  const [crisisAlert, setCrisisAlert] = useState<boolean>(false);

  // Settings State
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>("20:00");
  const [notificationSound, setNotificationSound] = useState<string>("Calm Chime");
  const [autoScreeningEnabled, setAutoScreeningEnabled] = useState<boolean>(true);
  const [journalPrivacyDefault, setJournalPrivacyDefault] = useState<"Private" | "Shared Provider">("Private");

  // ==================== STATE: CHECK-INS HISTORY ====================
  const [checkIns, setCheckIns] = useState<MentalHealthCheckIn[]>([
    {
      id: "chk-1",
      date: new Date().toISOString().split("T")[0],
      time: "08:30 AM",
      primaryMood: "😌 Calm",
      moodIntensity: 8,
      stressLevel: 3,
      anxietyLevel: 2,
      depressionLevel: 1,
      irritabilityLevel: 2,
      energyLevel: 7,
      triggers: ["Work Deadlines"],
      physicalSymptoms: ["Mild Muscle Tension"],
      copingStrategies: ["Deep Breathing", "Morning Walk"],
      sleepHours: 7.5,
      sleepQuality: "Good",
      appetiteQuality: "Good",
      journalNotes: "Had a serene morning meditation. Feeling centered and grounded for the day ahead.",
      gratitudeItems: ["Warm morning coffee", "Supportive team", "Good sleep last night"],
      goalsTomorrow: "Complete project draft & practice 10 min box breathing",
      feelingSuicidal: false,
      feelingSelfHarm: false,
      overallScore: 82,
    },
    {
      id: "chk-2",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      time: "07:45 PM",
      primaryMood: "😟 Anxious",
      moodIntensity: 6,
      stressLevel: 7,
      anxietyLevel: 6,
      depressionLevel: 2,
      irritabilityLevel: 5,
      energyLevel: 5,
      triggers: ["Overwhelm", "Financial Worries"],
      physicalSymptoms: ["Chest Tightness", "Headache"],
      copingStrategies: ["Talking to someone", "Journaling"],
      sleepHours: 6.0,
      sleepQuality: "Fair",
      appetiteQuality: "Fair",
      journalNotes: "Felt overwhelmed by afternoon meeting. Writing down my worries helped ease the chest tightness.",
      gratitudeItems: ["Evening walk with friend", "Fresh air"],
      goalsTomorrow: "Take short breaks every hour",
      feelingSuicidal: false,
      feelingSelfHarm: false,
      overallScore: 58,
    },
  ]);

  // ==================== CHECK-IN FORM STATE ====================
  const [formMood, setFormMood] = useState<string>("😌 Calm");
  const [formMoodIntensity, setFormMoodIntensity] = useState<number>(7);
  const [formStress, setFormStress] = useState<number>(4);
  const [formAnxiety, setFormAnxiety] = useState<number>(3);
  const [formDepression, setFormDepression] = useState<number>(1);
  const [formIrritability, setFormIrritability] = useState<number>(2);
  const [formEnergy, setFormEnergy] = useState<number>(7);
  const [formTriggers, setFormTriggers] = useState<string[]>(["Work Stress"]);
  const [formPhysicalSymptoms, setFormPhysicalSymptoms] = useState<string[]>(["Muscle Tension"]);
  const [formCoping, setFormCoping] = useState<string[]>(["Breathing Exercises", "Listening to Music"]);
  const [formSleepHours, setFormSleepHours] = useState<number>(7.5);
  const [formSleepQuality, setFormSleepQuality] = useState<"Poor" | "Fair" | "Good" | "Excellent">("Good");
  const [formAppetiteQuality, setFormAppetiteQuality] = useState<"Poor" | "Fair" | "Good" | "Excellent">("Good");
  const [formJournal, setFormJournal] = useState<string>("");
  const [formGratitude1, setFormGratitude1] = useState<string>("Peaceful morning time");
  const [formGratitude2, setFormGratitude2] = useState<string>("Health and safety");
  const [formGratitude3, setFormGratitude3] = useState<string>("Family support");
  const [formGoalsTomorrow, setFormGoalsTomorrow] = useState<string>("");
  const [formSuicidal, setFormSuicidal] = useState<boolean>(false);
  const [formSelfHarm, setFormSelfHarm] = useState<boolean>(false);

  const toggleTrigger = (trig: string) => {
    if (formTriggers.includes(trig)) {
      setFormTriggers(formTriggers.filter((t) => t !== trig));
    } else {
      setFormTriggers([...formTriggers, trig]);
    }
  };

  const togglePhysical = (symp: string) => {
    if (formPhysicalSymptoms.includes(symp)) {
      setFormPhysicalSymptoms(formPhysicalSymptoms.filter((s) => s !== symp));
    } else {
      setFormPhysicalSymptoms([...formPhysicalSymptoms, symp]);
    }
  };

  const toggleCoping = (cop: string) => {
    if (formCoping.includes(cop)) {
      setFormCoping(formCoping.filter((c) => c !== cop));
    } else {
      setFormCoping([...formCoping, cop]);
    }
  };

  const handleSaveCheckIn = (andAnother: boolean = false) => {
    // Calculate overall wellness score out of 100
    const calculatedScore = Math.max(
      10,
      Math.min(
        100,
        Math.round(
          100 -
            (formStress * 3 + formAnxiety * 3 + formDepression * 3 + formIrritability * 2) +
            formEnergy * 2 +
            formMoodIntensity * 1.5
        )
      )
    );

    if (formSuicidal || formSelfHarm) {
      setCrisisAlert(true);
      showFeedback("⚠️ Emergency Safety Alert triggered. Immediate support contacts displayed.");
    }

    const newCheckIn: MentalHealthCheckIn = {
      id: `chk-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      primaryMood: formMood,
      moodIntensity: formMoodIntensity,
      stressLevel: formStress,
      anxietyLevel: formAnxiety,
      depressionLevel: formDepression,
      irritabilityLevel: formIrritability,
      energyLevel: formEnergy,
      triggers: formTriggers,
      physicalSymptoms: formPhysicalSymptoms,
      copingStrategies: formCoping,
      sleepHours: formSleepHours,
      sleepQuality: formSleepQuality,
      appetiteQuality: formAppetiteQuality,
      journalNotes: formJournal || "Daily mental health check-in logged.",
      gratitudeItems: [formGratitude1, formGratitude2, formGratitude3].filter((g) => g.trim().length > 0),
      goalsTomorrow: formGoalsTomorrow,
      feelingSuicidal: formSuicidal,
      feelingSelfHarm: formSelfHarm,
      overallScore: calculatedScore,
    };

    setCheckIns([newCheckIn, ...checkIns]);
    showFeedback(`Check-in logged! Mental Wellness Score: ${calculatedScore}/100`);

    if (andAnother) {
      setFormJournal("");
    } else {
      if (formSuicidal || formSelfHarm) {
        setActiveTab("crisis");
      } else {
        setActiveTab("dashboard");
      }
    }
  };

  // ==================== STATE: BREATHING EXERCISES ====================
  const [selectedBreathExercise, setSelectedBreathExercise] = useState<
    "4-7-8" | "Box Breathing" | "4-4-4" | "5-5-5" | "Belly Breathing"
  >("4-7-8");
  const [breathActive, setBreathActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Pause">("Inhale");
  const [breathPhaseSeconds, setBreathPhaseSeconds] = useState<number>(4);
  const [breathTotalCycles, setBreathTotalCycles] = useState<number>(0);
  const [breathTimerSeconds, setBreathTimerSeconds] = useState<number>(0);
  const [soundGuideEnabled, setSoundGuideEnabled] = useState<boolean>(true);

  // Breathing timings config
  const breathConfigs = {
    "4-7-8": { inhale: 4, hold1: 7, exhale: 8, pause: 0, desc: "Relaxation & Anxiety Relief" },
    "Box Breathing": { inhale: 4, hold1: 4, exhale: 4, pause: 4, desc: "Deep Focus & High Stress Control" },
    "4-4-4": { inhale: 4, hold1: 4, exhale: 4, pause: 0, desc: "Quick Calming & Grounding" },
    "5-5-5": { inhale: 5, hold1: 5, exhale: 5, pause: 0, desc: "Balanced Nervous System Reset" },
    "Belly Breathing": { inhale: 5, hold1: 2, exhale: 6, pause: 0, desc: "Diaphragmatic Parasympathetic Reset" },
  };

  useEffect(() => {
    let interval: any = null;
    if (breathActive) {
      interval = setInterval(() => {
        setBreathTimerSeconds((prev) => prev + 1);
        setBreathPhaseSeconds((prev) => {
          if (prev <= 1) {
            const cfg = breathConfigs[selectedBreathExercise];
            if (breathPhase === "Inhale") {
              if (cfg.hold1 > 0) {
                setBreathPhase("Hold");
                return cfg.hold1;
              } else {
                setBreathPhase("Exhale");
                return cfg.exhale;
              }
            } else if (breathPhase === "Hold") {
              setBreathPhase("Exhale");
              return cfg.exhale;
            } else if (breathPhase === "Exhale") {
              if (cfg.pause > 0) {
                setBreathPhase("Pause");
                return cfg.pause;
              } else {
                setBreathPhase("Inhale");
                setBreathTotalCycles((c) => c + 1);
                return cfg.inhale;
              }
            } else {
              setBreathPhase("Inhale");
              setBreathTotalCycles((c) => c + 1);
              return cfg.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [breathActive, breathPhase, selectedBreathExercise]);

  const handleStartBreathing = () => {
    const cfg = breathConfigs[selectedBreathExercise];
    setBreathPhase("Inhale");
    setBreathPhaseSeconds(cfg.inhale);
    setBreathActive(true);
    showFeedback(`Started ${selectedBreathExercise} breathing guide!`);
  };

  // ==================== STATE: CBT THOUGHT RECORDS ====================
  const [cbtRecords, setCbtRecords] = useState<CBTThoughtRecord[]>([
    {
      id: "cbt-1",
      date: new Date().toISOString().split("T")[0],
      time: "02:15 PM",
      location: "Office / Workspace",
      situation: "Manager asked for urgent project review meeting",
      automaticThoughts: "I must have made a major mistake and I'm going to get reprimanded.",
      thoughtBeliefRating: 8,
      emotions: ["Anxious", "Scared", "Overwhelmed"],
      initialEmotionIntensity: 8,
      physicalSensations: "Rapid heart rate and cold sweaty palms",
      evidenceSupporting: "I turned in the quarterly report late by 2 hours.",
      evidenceAgainst: "My manager commended my previous presentation. Urgent meetings happen all the time for strategy.",
      alternativePerspective: "An urgent meeting means we need to align priorities quickly, not necessarily a negative review.",
      rationalResponse: "I will prepare my status notes calm and ask clarifying questions.",
      newThought: "This meeting is just routine alignment and I am capable of answering any questions.",
      newThoughtBeliefRating: 3,
      newEmotionIntensity: 3,
      actionPlan: "Review slide deck for 5 minutes and take 3 deep belly breaths before entering.",
    },
  ]);

  // CBT Form State
  const [cbtSituation, setCbtSituation] = useState<string>("");
  const [cbtLocation, setCbtLocation] = useState<string>("Home / Office");
  const [cbtAutoThought, setCbtAutoThought] = useState<string>("");
  const [cbtThoughtBelief, setCbtThoughtBelief] = useState<number>(8);
  const [cbtEmotions, setCbtEmotions] = useState<string[]>(["Anxious", "Overwhelmed"]);
  const [cbtInitialIntensity, setCbtInitialIntensity] = useState<number>(8);
  const [cbtPhysicalSensations, setCbtPhysicalSensations] = useState<string>("Tightness in chest");
  const [cbtEvidenceFor, setCbtEvidenceFor] = useState<string>("");
  const [cbtEvidenceAgainst, setCbtEvidenceAgainst] = useState<string>("");
  const [cbtAlternative, setCbtAlternative] = useState<string>("");
  const [cbtRationalResponse, setCbtRationalResponse] = useState<string>("");
  const [cbtNewThought, setCbtNewThought] = useState<string>("");
  const [cbtNewBelief, setCbtNewBelief] = useState<number>(3);
  const [cbtNewIntensity, setCbtNewIntensity] = useState<number>(3);
  const [cbtActionPlan, setCbtActionPlan] = useState<string>("");

  const handleSaveCbtRecord = () => {
    if (!cbtSituation.trim() || !cbtAutoThought.trim()) {
      showFeedback("Please fill out Situation and Automatic Thought!");
      return;
    }

    const newRecord: CBTThoughtRecord = {
      id: `cbt-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      location: cbtLocation,
      situation: cbtSituation,
      automaticThoughts: cbtAutoThought,
      thoughtBeliefRating: cbtThoughtBelief,
      emotions: cbtEmotions,
      initialEmotionIntensity: cbtInitialIntensity,
      physicalSensations: cbtPhysicalSensations,
      evidenceSupporting: cbtEvidenceFor || "Initial assumption",
      evidenceAgainst: cbtEvidenceAgainst || "Balanced reasoning",
      alternativePerspective: cbtAlternative || "Reframed mindset",
      rationalResponse: cbtRationalResponse || "Constructive outlook",
      newThought: cbtNewThought || "I can handle this step-by-step.",
      newThoughtBeliefRating: cbtNewBelief,
      newEmotionIntensity: cbtNewIntensity,
      actionPlan: cbtActionPlan || "Focus on present actions",
    };

    setCbtRecords([newRecord, ...cbtRecords]);
    showFeedback(`CBT Thought Record saved! Emotion reduced from ${cbtInitialIntensity}/10 to ${cbtNewIntensity}/10 🎉`);
    setCbtSituation("");
    setCbtAutoThought("");
    setActiveTab("dashboard");
  };

  // ==================== STATE: CRISIS SUPPORT & SAFETY PLAN ====================
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: "ec-1", name: "Sarah Vance (Sister)", relationship: "Family", phone: "+1 (800) 555-0199", isPrimary: true },
    { id: "ec-2", name: "Dr. Robert Chen (Therapist)", relationship: "Healthcare Provider", phone: "+1 (800) 555-0122", isPrimary: false },
  ]);

  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan>({
    warningSigns: ["Pacing around room", "Inability to sleep past 2 AM", "Feeling overwhelmed by noise"],
    copingStrategies: ["4-7-8 Deep Breathing", "Listening to ambient rain soundscapes", "15 minute cold water wrist immersion"],
    supportNetworkContacts: ["Sarah Vance (+1 800-555-0199)", "Mark Miller (Best Friend)"],
    professionalContacts: ["988 Suicide & Crisis Lifeline", "Crisis Text Line (Text HOME to 741741)"],
    safeEnvironmentSteps: ["Remove stressors from immediate room", "Go to a safe, quiet space with supportive company"],
    updatedAt: new Date().toISOString().split("T")[0],
  });

  // ==================== STATE: CLINICAL SCREENING TOOLS (PHQ-9, GAD-7, PSS-10) ====================
  const [screeningModalType, setScreeningModalType] = useState<"PHQ-9" | "GAD-7" | "PSS-10" | null>(null);
  const [phqAnswers, setPhqAnswers] = useState<number[]>([0, 1, 0, 1, 0, 0, 0, 0, 0]);
  const [gadAnswers, setGadAnswers] = useState<number[]>([1, 1, 0, 1, 0, 1, 0]);
  const [pssAnswers, setPssAnswers] = useState<number[]>([1, 2, 2, 1, 2, 1, 2, 1, 2, 1]);

  const [screeningHistory, setScreeningHistory] = useState<ScreeningResult[]>([
    {
      id: "scr-1",
      type: "PHQ-9",
      date: new Date().toISOString().split("T")[0],
      score: 4,
      maxScore: 27,
      severity: "Minimal Depression",
      interpretation: "Score 0-4 indicates minimal or no depressive symptoms present.",
      answers: [0, 1, 0, 1, 1, 0, 0, 1, 0],
    },
    {
      id: "scr-2",
      type: "GAD-7",
      date: new Date().toISOString().split("T")[0],
      score: 5,
      maxScore: 21,
      severity: "Mild Anxiety",
      interpretation: "Score 5-9 suggests mild anxiety symptoms. Monitor and practice relaxation techniques.",
      answers: [1, 1, 1, 1, 0, 1, 0],
    },
    {
      id: "scr-3",
      type: "PSS-10",
      date: new Date().toISOString().split("T")[0],
      score: 14,
      maxScore: 40,
      severity: "Moderate Stress",
      interpretation: "Score 14-26 indicates moderate stress levels. Regular coping strategies recommended.",
      answers: [1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
    },
  ]);

  const phq9Questions = [
    "1. Little interest or pleasure in doing things",
    "2. Feeling down, depressed, or hopeless",
    "3. Trouble falling or staying asleep, or sleeping too much",
    "4. Feeling tired or having little energy",
    "5. Poor appetite or overeating",
    "6. Feeling bad about yourself — or that you are a failure",
    "7. Trouble concentrating on things, such as reading or watching TV",
    "8. Moving or speaking slowly, or being fidgety/restless",
    "9. Thoughts that you would be better off dead or of hurting yourself",
  ];

  const gad7Questions = [
    "1. Feeling nervous, anxious, or on edge",
    "2. Not being able to stop or control worrying",
    "3. Worrying too much about different things",
    "4. Trouble relaxing",
    "5. Being so restless that it is hard to sit still",
    "6. Becoming easily annoyed or irritable",
    "7. Feeling afraid as if something awful might happen",
  ];

  const pss10Questions = [
    "1. Been upset because of something that happened unexpectedly?",
    "2. Felt unable to control the important things in your life?",
    "3. Felt nervous and stressed?",
    "4. Felt confident about your ability to handle personal problems? (Reverse scored)",
    "5. Felt that things were going your way? (Reverse scored)",
    "6. Found that you could not cope with all the things you had to do?",
    "7. Been able to control irritations in your life? (Reverse scored)",
    "8. Felt that you were on top of things? (Reverse scored)",
    "9. Been angered because of things that happened that were outside your control?",
    "10. Felt difficulties were piling up so high that you could not overcome them?",
  ];

  const handleCalculateScreening = (type: "PHQ-9" | "GAD-7" | "PSS-10") => {
    let score = 0;
    let maxScore = 0;
    let severity = "";
    let interpretation = "";

    if (type === "PHQ-9") {
      score = phqAnswers.reduce((a, b) => a + b, 0);
      maxScore = 27;
      if (score <= 4) {
        severity = "Minimal Depression";
        interpretation = "Score 0-4: Minimal or no depressive symptoms present.";
      } else if (score <= 9) {
        severity = "Mild Depression";
        interpretation = "Score 5-9: Mild depressive symptoms. Continue self-care and monitoring.";
      } else if (score <= 14) {
        severity = "Moderate Depression";
        interpretation = "Score 10-14: Moderate depressive symptoms. Consider consultation with a healthcare provider.";
      } else if (score <= 19) {
        severity = "Moderately Severe Depression";
        interpretation = "Score 15-19: Moderately severe symptoms. Clinical intervention recommended.";
      } else {
        severity = "Severe Depression";
        interpretation = "Score 20-27: Severe depressive symptoms. Immediate medical/psychiatric evaluation recommended.";
      }

      if (phqAnswers[8] > 0) {
        setCrisisAlert(true);
        interpretation += " ⚠️ Affirmative response to Question 9 triggers safety protocol.";
      }
    } else if (type === "GAD-7") {
      score = gadAnswers.reduce((a, b) => a + b, 0);
      maxScore = 21;
      if (score <= 4) {
        severity = "Minimal Anxiety";
        interpretation = "Score 0-4: Minimal anxiety symptoms.";
      } else if (score <= 9) {
        severity = "Mild Anxiety";
        interpretation = "Score 5-9: Mild anxiety. Mindfulness and relaxation exercises suggested.";
      } else if (score <= 14) {
        severity = "Moderate Anxiety";
        interpretation = "Score 10-14: Moderate anxiety. Further evaluation recommended.";
      } else {
        severity = "Severe Anxiety";
        interpretation = "Score 15-21: Severe anxiety. Professional therapy or clinical review recommended.";
      }
    } else if (type === "PSS-10") {
      score = pssAnswers.reduce((a, b) => a + b, 0);
      maxScore = 40;
      if (score <= 13) {
        severity = "Low Stress";
        interpretation = "Score 0-13: Low perceived stress levels.";
      } else if (score <= 26) {
        severity = "Moderate Stress";
        interpretation = "Score 14-26: Moderate perceived stress levels.";
      } else {
        severity = "High Perceived Stress";
        interpretation = "Score 27-40: High perceived stress levels. Active stress-reduction strategies advised.";
      }
    }

    const newResult: ScreeningResult = {
      id: `scr-${Date.now()}`,
      type,
      date: new Date().toISOString().split("T")[0],
      score,
      maxScore,
      severity,
      interpretation,
      answers: type === "PHQ-9" ? [...phqAnswers] : type === "GAD-7" ? [...gadAnswers] : [...pssAnswers],
    };

    setScreeningHistory([newResult, ...screeningHistory]);
    setScreeningModalType(null);
    showFeedback(`Completed ${type} Assessment! Result: ${severity} (Score: ${score}/${maxScore})`);
  };

  // ==================== STATE: MENTAL HEALTH JOURNAL ====================
  const [journals, setJournals] = useState<JournalEntry[]>([
    {
      id: "j-1",
      date: new Date().toISOString().split("T")[0],
      time: "09:00 AM",
      title: "Morning Reflections on Balance and Focus",
      content: "Started the day with 10 minutes of deep box breathing. The mental noise from yesterday faded away. Practicing gratitude for small quiet moments.",
      moodTag: "😌 Calm",
      tags: ["Mindfulness", "Morning Routine", "Gratitude"],
      gratitudeText: "Clean air, warm tea, quiet workspace",
      privacy: "Private",
    },
  ]);

  const [journalTitle, setJournalTitle] = useState<string>("");
  const [journalContent, setJournalContent] = useState<string>("");
  const [journalMoodTag, setJournalMoodTag] = useState<string>("😌 Calm");
  const [journalPrivacy, setJournalPrivacy] = useState<"Private" | "Shared Provider">("Private");

  const handleSaveJournal = () => {
    if (!journalTitle.trim() || !journalContent.trim()) {
      showFeedback("Please provide a Title and Journal Content!");
      return;
    }

    const newJ: JournalEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      title: journalTitle,
      content: journalContent,
      moodTag: journalMoodTag,
      tags: ["Reflection", "Journal"],
      privacy: journalPrivacy,
    };

    setJournals([newJ, ...journals]);
    showFeedback("Saved Mental Health Journal Entry!");
    setJournalTitle("");
    setJournalContent("");
    setActiveTab("dashboard");
  };

  // Stats Calculations
  const latestCheckIn = checkIns[0];
  const avgStress = Math.round(checkIns.reduce((a, c) => a + c.stressLevel, 0) / (checkIns.length || 1));
  const avgAnxiety = Math.round(checkIns.reduce((a, c) => a + c.anxietyLevel, 0) / (checkIns.length || 1));
  const goodDaysCount = checkIns.filter((c) => c.overallScore >= 70).length;

  return (
    <div className="space-y-4 pb-20">
      {/* Top Navigation Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-xl shadow-md">
              🧠
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Mental Health & Stress Management
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">Mood, Anxiety, CBT, PHQ-9/GAD-7 & Crisis Support</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("crisis")}
            className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl text-xs flex items-center gap-1 shadow-md cursor-pointer animate-pulse"
          >
            <Shield className="w-4 h-4 text-white" />
            <span>🆘 Crisis Support</span>
          </button>
        </div>

        {/* Main Navigation Sub-Bar */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "dashboard" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Brain className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab("checkin")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "checkin" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Smile className="w-3.5 h-3.5" /> Check-in
          </button>
          <button
            onClick={() => setActiveTab("breathing")}
            className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "breathing" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Wind className="w-3.5 h-3.5" /> Breathing
          </button>
          <button
            onClick={() => setActiveTab("cbt")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "cbt" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <BookOpen className="w-3.5 h-3.5" /> CBT Tool
          </button>
          <button
            onClick={() => setActiveTab("screening")}
            className={`flex-1 min-w-[105px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "screening" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Activity className="w-3.5 h-3.5" /> Screenings
          </button>
          <button
            onClick={() => setActiveTab("journal")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "journal" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <FileText className="w-3.5 h-3.5" /> Journal
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "analytics" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "achievements" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Award className="w-3.5 h-3.5" /> Badges
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "settings" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" /> {feedbackMsg}
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-indigo-700 font-black">✕</button>
        </div>
      )}

      {/* EMERGENCY CRISIS WARNING BANNER */}
      {crisisAlert && (
        <div className="bg-rose-600 text-white p-4 rounded-3xl shadow-xl space-y-3 border-2 border-rose-300 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-yellow-300" />
              <span>SAFETY PROTOCOL ACTIVATED: Immediate Support Available</span>
            </div>
            <button onClick={() => setCrisisAlert(false)} className="text-white/80 hover:text-white font-black text-sm">✕</button>
          </div>
          <p className="text-xs text-rose-100 font-medium">
            If you or someone you know is struggling or in distress, help is available. You are not alone.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-xs font-bold">
            <a href="tel:988" className="py-2 px-4 bg-white text-rose-900 rounded-xl shadow-xs hover:bg-rose-50 flex items-center gap-1">
              📞 Call/Text 988 (National Suicide & Crisis Lifeline)
            </a>
            <a href="sms:741741?body=HOME" className="py-2 px-4 bg-rose-800 text-white rounded-xl hover:bg-rose-900 flex items-center gap-1">
              💬 Text HOME to 741741 (Crisis Text Line)
            </a>
          </div>
        </div>
      )}

      {/* ==================== TAB 1: DASHBOARD OVERVIEW ==================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          {/* Today's Mental Wellness Hero Card */}
          <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold tracking-wider text-indigo-200 uppercase">TODAY'S MENTAL WELLNESS</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-black">{latestCheckIn ? latestCheckIn.primaryMood : "😌 Calm"}</span>
                  <span className="text-xs bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full font-bold">
                    Score: {latestCheckIn ? latestCheckIn.overallScore : 82}/100
                  </span>
                </div>
                <p className="text-xs text-indigo-100/90 font-medium pt-1">
                  Stress Level: {latestCheckIn ? latestCheckIn.stressLevel : 3}/10 • Anxiety Level: {latestCheckIn ? latestCheckIn.anxietyLevel : 2}/10
                </p>
              </div>

              <button
                onClick={() => setActiveTab("checkin")}
                className="py-3 px-4 bg-white text-indigo-950 font-black rounded-2xl text-xs hover:bg-indigo-50 cursor-pointer shadow-md"
              >
                + Check-In Now
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/20 text-xs font-bold text-center text-indigo-50">
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-sm font-black">{avgStress}/10</span>
                <span className="text-[9px] text-indigo-200 uppercase">Avg Stress</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-sm font-black">{avgAnxiety}/10</span>
                <span className="text-[9px] text-indigo-200 uppercase">Avg Anxiety</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-sm font-black">{goodDaysCount} Days</span>
                <span className="text-[9px] text-indigo-200 uppercase">Calm Days</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-sm font-black">5 Days 🔥</span>
                <span className="text-[9px] text-indigo-200 uppercase">Streak</span>
              </div>
            </div>
          </div>

          {/* Quick Tools Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveTab("breathing")}
              className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-indigo-300 transition-all text-left space-y-1.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-black">
                🌬️
              </div>
              <h3 className="font-black text-slate-900 text-xs">4-7-8 Breathing</h3>
              <p className="text-[10px] text-slate-500 font-medium">Calm nervous system in 2 mins</p>
            </button>

            <button
              onClick={() => setActiveTab("cbt")}
              className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-indigo-300 transition-all text-left space-y-1.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                🧠
              </div>
              <h3 className="font-black text-slate-900 text-xs">CBT Thought Record</h3>
              <p className="text-[10px] text-slate-500 font-medium">Reframe anxious assumptions</p>
            </button>

            <button
              onClick={() => setActiveTab("screening")}
              className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-indigo-300 transition-all text-left space-y-1.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                📋
              </div>
              <h3 className="font-black text-slate-900 text-xs">PHQ-9 & GAD-7</h3>
              <p className="text-[10px] text-slate-500 font-medium">Clinical screening tools</p>
            </button>

            <button
              onClick={() => setActiveTab("crisis")}
              className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-indigo-300 transition-all text-left space-y-1.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                🆘
              </div>
              <h3 className="font-black text-slate-900 text-xs">Safety Plan & Crisis</h3>
              <p className="text-[10px] text-slate-500 font-medium">Helplines & trusted contacts</p>
            </button>
          </div>

          {/* Gemini AI Clinical Insight */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-4 rounded-3xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Gemini AI Mental Health Insight
              </span>
              <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
                Clinical Assist
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "Your anxiety levels dropped by 35% after completing your evening CBT thought records this week. Continuing 5-minute box breathing prior to work presentations helps maintain your parasympathetic rest state."
            </p>
          </div>

          {/* Recent Check-Ins History List */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xs font-black text-slate-900">Recent Check-In History</h3>
              <button onClick={() => setActiveTab("checkin")} className="text-xs font-bold text-indigo-600 hover:underline">
                + New Check-in
              </button>
            </div>

            <div className="space-y-2">
              {checkIns.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-900">
                      {c.primaryMood} (Mood: {c.moodIntensity}/10)
                    </span>
                    <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full">
                      Score: {c.overallScore}/100
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">{c.journalNotes}</p>
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>Triggers: {c.triggers.join(", ") || "None"}</span>
                    <span>{c.date} at {c.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: MENTAL HEALTH CHECK-IN FORM ==================== */}
      {activeTab === "checkin" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Daily Mental Health Check-In</h2>
              <p className="text-[10px] text-slate-500 font-medium">Record mood, stress, anxiety, triggers, coping strategies & gratitude</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Primary Mood Selector */}
            <div>
              <label className="font-extrabold text-slate-800 block mb-1.5">Primary Mood Today *</label>
              <div className="grid grid-cols-5 gap-2 text-center">
                {["😊 Happy", "😌 Calm", "😐 Neutral", "😟 Anxious", "😢 Sad", "😡 Angry", "😨 Scared", "🥱 Tired", "😞 Depressed", "🤗 Grateful"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormMood(m)}
                    className={`p-2 rounded-2xl border font-bold text-[11px] cursor-pointer transition-all ${formMood === m ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Intensity & Stress Level Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-extrabold text-slate-800">Mood Intensity</label>
                  <span className="font-black text-indigo-900">{formMoodIntensity} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formMoodIntensity}
                  onChange={(e) => setFormMoodIntensity(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-extrabold text-slate-800">Stress Level *</label>
                  <span className="font-black text-indigo-900">{formStress} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formStress}
                  onChange={(e) => setFormStress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Anxiety & Depression Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-extrabold text-slate-800">Anxiety Level *</label>
                  <span className="font-black text-indigo-900">{formAnxiety} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formAnxiety}
                  onChange={(e) => setFormAnxiety(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-extrabold text-slate-800">Depression / Low Mood</label>
                  <span className="font-black text-indigo-900">{formDepression} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formDepression}
                  onChange={(e) => setFormDepression(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Triggers Multi-select */}
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Triggers / Stressors Today</label>
              <div className="flex flex-wrap gap-1.5">
                {["Work Stress", "Relationship Issues", "Financial Worries", "Health Concerns", "Family Problems", "Social Anxiety", "Lack of Sleep", "Overwhelm", "Burnout"].map((trig) => (
                  <button
                    key={trig}
                    type="button"
                    onClick={() => toggleTrigger(trig)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold cursor-pointer transition-all border ${formTriggers.includes(trig) ? "bg-indigo-100 text-indigo-900 border-indigo-300" : "bg-slate-50 text-slate-600 border-slate-200"}`}
                  >
                    {formTriggers.includes(trig) ? "✓ " : "+ "}{trig}
                  </button>
                ))}
              </div>
            </div>

            {/* Coping Strategies Multi-select */}
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Coping Strategies Used</label>
              <div className="flex flex-wrap gap-1.5">
                {["Breathing Exercises", "Talking to someone", "Exercise", "Meditation", "Journaling", "Listening to Music", "Nature Walk", "Hobbies"].map((cop) => (
                  <button
                    key={cop}
                    type="button"
                    onClick={() => toggleCoping(cop)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold cursor-pointer transition-all border ${formCoping.includes(cop) ? "bg-teal-100 text-teal-900 border-teal-300" : "bg-slate-50 text-slate-600 border-slate-200"}`}
                  >
                    {formCoping.includes(cop) ? "✓ " : "+ "}{cop}
                  </button>
                ))}
              </div>
            </div>

            {/* Gratitude & Reflections */}
            <div className="bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100 space-y-2">
              <label className="font-extrabold text-slate-800 block">3 Things You Are Grateful For Today:</label>
              <input type="text" value={formGratitude1} onChange={(e) => setFormGratitude1(e.target.value)} placeholder="1. e.g. Supportive friend" className="w-full p-2 bg-white border rounded-xl font-bold" />
              <input type="text" value={formGratitude2} onChange={(e) => setFormGratitude2(e.target.value)} placeholder="2. e.g. Peaceful morning walk" className="w-full p-2 bg-white border rounded-xl font-bold" />
              <input type="text" value={formGratitude3} onChange={(e) => setFormGratitude3(e.target.value)} placeholder="3. e.g. Fresh healthy dinner" className="w-full p-2 bg-white border rounded-xl font-bold" />
            </div>

            {/* Journal Notes */}
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Journal Reflection / Thoughts</label>
              <textarea
                rows={2}
                value={formJournal}
                onChange={(e) => setFormJournal(e.target.value)}
                placeholder="Write freely about your day and thoughts..."
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium"
              />
            </div>

            {/* Crisis Check Checkboxes */}
            <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 space-y-2">
              <label className="font-extrabold text-rose-900 block text-[11px]">Safety Check:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 font-bold text-rose-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSuicidal}
                    onChange={(e) => setFormSuicidal(e.target.checked)}
                    className="accent-rose-600"
                  />
                  Thoughts of self-harm / suicide today?
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveCheckIn(false)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Save Check-In Entry
              </button>

              <button
                type="button"
                onClick={() => handleSaveCheckIn(true)}
                className="py-3 px-4 bg-purple-100 hover:bg-purple-200 text-purple-950 font-extrabold rounded-2xl text-xs cursor-pointer"
              >
                Save & Add Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: BREATHING EXERCISES ==================== */}
      {activeTab === "breathing" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-indigo-600" /> Interactive Breathing Exercises
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Guided parasympathetic nervous system reset & anxiety relief</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Close</button>
          </div>

          <div className="space-y-4">
            {/* Technique Selector */}
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-bold overflow-x-auto scrollbar-none">
              {(["4-7-8", "Box Breathing", "4-4-4", "5-5-5", "Belly Breathing"] as const).map((tech) => (
                <button
                  key={tech}
                  onClick={() => {
                    setSelectedBreathExercise(tech);
                    setBreathActive(false);
                  }}
                  className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer ${selectedBreathExercise === tech ? "bg-white text-indigo-900 shadow-xs" : "text-slate-600"}`}
                >
                  {tech}
                </button>
              ))}
            </div>

            {/* Visual Pulsing Breathing Guide Circle */}
            <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl border border-indigo-900/50 relative overflow-hidden">
              <p className="text-xs font-black tracking-widest text-indigo-300 uppercase">
                {selectedBreathExercise} • {breathConfigs[selectedBreathExercise].desc}
              </p>

              {/* Pulsing Circle Animation */}
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full border-4 border-indigo-400 transition-all duration-1000 ${
                    breathPhase === "Inhale"
                      ? "scale-110 bg-indigo-500/30"
                      : breathPhase === "Hold"
                      ? "scale-105 bg-indigo-400/20"
                      : "scale-75 bg-purple-500/20"
                  }`}
                />
                <div className="relative z-10 text-center space-y-1">
                  <div className="text-xl font-black text-indigo-200 uppercase">{breathPhase}</div>
                  <div className="text-4xl font-black font-mono text-white">{breathPhaseSeconds}s</div>
                </div>
              </div>

              <div className="text-xs font-bold text-indigo-200">
                Completed Cycles: <span className="text-white font-black">{breathTotalCycles}</span> • Total Time: {Math.floor(breathTimerSeconds / 60)}m {breathTimerSeconds % 60}s
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-3 pt-2">
                {!breathActive ? (
                  <button
                    onClick={handleStartBreathing}
                    className="py-2.5 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-current" /> Start Breathing
                  </button>
                ) : (
                  <button
                    onClick={() => setBreathActive(false)}
                    className="py-2.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Pause className="w-4 h-4 fill-current" /> Pause Session
                  </button>
                )}

                <button
                  onClick={() => {
                    setBreathActive(false);
                    setBreathTotalCycles(0);
                    setBreathTimerSeconds(0);
                    showFeedback("Reset breathing session.");
                  }}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-xs cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: CBT THOUGHT RECORD ==================== */}
      {activeTab === "cbt" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" /> CBT Cognitive Thought Record
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Cognitive Behavioral Therapy tool to challenge & reframe negative automatic thoughts</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">1. Situation / Trigger Event *</label>
              <input
                type="text"
                value={cbtSituation}
                onChange={(e) => setCbtSituation(e.target.value)}
                placeholder="What happened? Where were you? Who were you with?"
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-800 block mb-1">2. Automatic Negative Thought *</label>
              <textarea
                rows={2}
                value={cbtAutoThought}
                onChange={(e) => setCbtAutoThought(e.target.value)}
                placeholder="What went through your mind? (e.g., 'I will definitely fail this meeting')"
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between items-center font-extrabold text-slate-800">
                  <span>Initial Belief Rating</span>
                  <span className="text-indigo-900 font-black">{cbtThoughtBelief} / 10</span>
                </div>
                <input type="range" min="1" max="10" value={cbtThoughtBelief} onChange={(e) => setCbtThoughtBelief(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between items-center font-extrabold text-slate-800">
                  <span>Initial Emotion Intensity</span>
                  <span className="text-indigo-900 font-black">{cbtInitialIntensity} / 10</span>
                </div>
                <input type="range" min="1" max="10" value={cbtInitialIntensity} onChange={(e) => setCbtInitialIntensity(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-extrabold text-slate-800 block mb-1">3. Evidence Supporting Thought</label>
                <textarea rows={2} value={cbtEvidenceFor} onChange={(e) => setCbtEvidenceFor(e.target.value)} placeholder="Facts that support this thought..." className="w-full p-2 bg-slate-50 border rounded-xl font-medium" />
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1">4. Evidence Against Thought</label>
                <textarea rows={2} value={cbtEvidenceAgainst} onChange={(e) => setCbtEvidenceAgainst(e.target.value)} placeholder="Facts that contradict or disprove this thought..." className="w-full p-2 bg-slate-50 border rounded-xl font-medium" />
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-800 block mb-1">5. Reframed Rational Thought & New Mindset</label>
              <textarea rows={2} value={cbtNewThought} onChange={(e) => setCbtNewThought(e.target.value)} placeholder="A balanced, realistic alternative thought..." className="w-full p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl font-bold text-indigo-950" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100 space-y-1">
                <div className="flex justify-between items-center font-extrabold text-indigo-900">
                  <span>New Belief Rating</span>
                  <span className="font-black">{cbtNewBelief} / 10</span>
                </div>
                <input type="range" min="1" max="10" value={cbtNewBelief} onChange={(e) => setCbtNewBelief(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>

              <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100 space-y-1">
                <div className="flex justify-between items-center font-extrabold text-indigo-900">
                  <span>New Emotion Intensity</span>
                  <span className="font-black">{cbtNewIntensity} / 10</span>
                </div>
                <input type="range" min="1" max="10" value={cbtNewIntensity} onChange={(e) => setCbtNewIntensity(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>
            </div>

            <button
              onClick={handleSaveCbtRecord}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" /> Save CBT Thought Record
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: CLINICAL SCREENINGS (PHQ-9, GAD-7, PSS-10) ==================== */}
      {activeTab === "screening" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" /> Standardized Clinical Screenings
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Validated tools: PHQ-9 (Depression), GAD-7 (Anxiety) & PSS-10 (Perceived Stress)</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Close</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-2 text-center">
              <h3 className="font-black text-slate-900 text-xs">PHQ-9 Screening</h3>
              <p className="text-[10px] text-slate-500 font-medium">9-question Patient Health Questionnaire for depression severity assessment.</p>
              <button
                onClick={() => setScreeningModalType("PHQ-9")}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs cursor-pointer shadow-2xs"
              >
                Take PHQ-9 Test →
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-2 text-center">
              <h3 className="font-black text-slate-900 text-xs">GAD-7 Screening</h3>
              <p className="text-[10px] text-slate-500 font-medium">7-question Generalized Anxiety Disorder questionnaire for anxiety tracking.</p>
              <button
                onClick={() => setScreeningModalType("GAD-7")}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs cursor-pointer shadow-2xs"
              >
                Take GAD-7 Test →
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-2 text-center">
              <h3 className="font-black text-slate-900 text-xs">PSS-10 Stress Scale</h3>
              <p className="text-[10px] text-slate-500 font-medium">10-item Perceived Stress Scale measuring stress control & coping confidence.</p>
              <button
                onClick={() => setScreeningModalType("PSS-10")}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs cursor-pointer shadow-2xs"
              >
                Take PSS-10 Test →
              </button>
            </div>
          </div>

          {/* Screening History List */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-900">Past Assessment Results</h3>
            {screeningHistory.map((s) => (
              <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-center text-xs">
                <div>
                  <span className="font-black text-slate-900">{s.type}: {s.severity}</span>
                  <p className="text-[10px] text-slate-500 font-medium">{s.interpretation}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded-full text-[11px]">
                    {s.score} / {s.maxScore}
                  </span>
                  <span className="block text-[9px] text-slate-400 font-bold mt-0.5">{s.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SCREENING TEST MODAL */}
          {screeningModalType && (
            <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl border border-indigo-200 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-black text-indigo-900 text-sm">
                    {screeningModalType} Assessment Questionnaire
                  </h3>
                  <button onClick={() => setScreeningModalType(null)} className="text-slate-400 font-bold hover:text-slate-700">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-slate-600 font-bold">
                    Over the last 2 weeks, how often have you been bothered by the following problems?
                  </p>

                  {(screeningModalType === "PHQ-9"
                    ? phq9Questions
                    : screeningModalType === "GAD-7"
                    ? gad7Questions
                    : pss10Questions
                  ).map((q, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border rounded-2xl space-y-1.5">
                      <p className="font-bold text-slate-800">{q}</p>
                      <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
                        {["Not at all (0)", "Several days (1)", "More than half (2)", "Nearly every day (3)"].map((opt, val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              if (screeningModalType === "PHQ-9") {
                                const next = [...phqAnswers];
                                next[idx] = val;
                                setPhqAnswers(next);
                              } else if (screeningModalType === "GAD-7") {
                                const next = [...gadAnswers];
                                next[idx] = val;
                                setGadAnswers(next);
                              } else {
                                const next = [...pssAnswers];
                                next[idx] = val;
                                setPssAnswers(next);
                              }
                            }}
                            className={`p-1.5 rounded-xl border text-center cursor-pointer transition-all ${
                              (screeningModalType === "PHQ-9"
                                ? phqAnswers[idx] === val
                                : screeningModalType === "GAD-7"
                                ? gadAnswers[idx] === val
                                : pssAnswers[idx] === val)
                                ? "bg-indigo-600 text-white border-indigo-600 font-black"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleCalculateScreening(screeningModalType)}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer"
                    >
                      Submit & Calculate Result
                    </button>
                    <button
                      onClick={() => setScreeningModalType(null)}
                      className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 6: CRISIS SUPPORT & HELPLINES ==================== */}
      {activeTab === "crisis" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-rose-700 flex items-center gap-1.5">
                <Shield className="w-5 h-5 text-rose-600" /> Crisis Support & Emergency Directory
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Immediate helplines, emergency contacts & personal safety plan</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Close</button>
          </div>

          <div className="space-y-4 text-xs">
            {/* National Helplines Box */}
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-4 space-y-3">
              <h3 className="font-black text-rose-900 text-xs flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-rose-600" /> Immediate 24/7 Crisis Helplines
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-bold">
                <a href="tel:988" className="p-3 bg-white border border-rose-200 rounded-2xl flex items-center justify-between text-rose-900 hover:bg-rose-100/50">
                  <span>📞 988 Suicide & Crisis Lifeline</span>
                  <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black">Call/Text 988</span>
                </a>

                <a href="sms:741741?body=HOME" className="p-3 bg-white border border-rose-200 rounded-2xl flex items-center justify-between text-rose-900 hover:bg-rose-100/50">
                  <span>💬 Crisis Text Line</span>
                  <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black">Text HOME to 741741</span>
                </a>
              </div>
            </div>

            {/* Trusted Emergency Contacts */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-900 text-xs">Your Trusted Emergency Contacts</h3>
                <button
                  onClick={() => {
                    const cName = prompt("Enter Contact Name & Relationship:");
                    const cPhone = prompt("Enter Phone Number:");
                    if (cName && cPhone) {
                      setEmergencyContacts([
                        ...emergencyContacts,
                        { id: `ec-${Date.now()}`, name: cName, relationship: "Trusted Contact", phone: cPhone, isPrimary: false },
                      ]);
                      showFeedback(`Added emergency contact: ${cName}`);
                    }
                  }}
                  className="py-1 px-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black cursor-pointer"
                >
                  + Add Contact
                </button>
              </div>

              <div className="space-y-1.5">
                {emergencyContacts.map((c) => (
                  <div key={c.id} className="p-2.5 bg-white border rounded-2xl flex justify-between items-center font-bold text-xs">
                    <div>
                      <span>{c.name} ({c.relationship})</span>
                      <p className="text-[10px] text-slate-400 font-medium">{c.phone}</p>
                    </div>
                    <a href={`tel:${c.phone}`} className="py-1 px-3 bg-emerald-100 text-emerald-900 rounded-xl text-[11px] font-extrabold">
                      📞 Call Now
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Safety Plan */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-2">
              <h3 className="font-black text-slate-900 text-xs">Personal Crisis Safety Plan</h3>
              <div className="space-y-1.5 text-slate-700">
                <p className="font-bold text-[11px]">Warning Signs: <span className="font-normal">{safetyPlan.warningSigns.join(", ")}</span></p>
                <p className="font-bold text-[11px]">Coping Strategies: <span className="font-normal">{safetyPlan.copingStrategies.join(", ")}</span></p>
                <p className="font-bold text-[11px]">Safe Environment: <span className="font-normal">{safetyPlan.safeEnvironmentSteps.join(", ")}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 7: MENTAL HEALTH JOURNAL ==================== */}
      {activeTab === "journal" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" /> Mental Health Journal
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Expressive writing, emotional processing & secure reflection logs</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Journal Entry Title *</label>
              <input
                type="text"
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                placeholder="e.g., Evening reflections on grounding"
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Journal Content *</label>
              <textarea
                rows={4}
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="Write your thoughts, feelings, and insights freely..."
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium"
              />
            </div>

            <button
              onClick={handleSaveJournal}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" /> Save Journal Entry
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 8: ANALYTICS & REPORTS ==================== */}
      {activeTab === "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Mental Health Analytics & Reports
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Trends in mood, stress level, anxiety, PHQ-9 & GAD-7 clinical progress</p>
            </div>
            <button
              onClick={() => showFeedback("Exporting Mental Health PDF Report...")}
              className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Weekly Summary Grid */}
            <div className="grid grid-cols-3 gap-2 text-center font-bold">
              <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                <span className="text-base font-black text-indigo-900">{avgStress}/10</span>
                <p className="text-[9px] text-indigo-700 uppercase">Avg Stress</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100">
                <span className="text-base font-black text-purple-900">{avgAnxiety}/10</span>
                <p className="text-[9px] text-purple-700 uppercase">Avg Anxiety</p>
              </div>
              <div className="bg-teal-50 p-3 rounded-2xl border border-teal-100">
                <span className="text-base font-black text-teal-900">{goodDaysCount}</span>
                <p className="text-[9px] text-teal-700 uppercase">Calm Days</p>
              </div>
            </div>

            {/* Simulated Chart Container */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-2">
              <h3 className="font-black text-slate-800 text-xs">Weekly Mood & Stress Trend</h3>
              <div className="h-28 bg-white rounded-2xl border border-slate-200 p-2 flex items-end justify-between gap-2 text-[10px] font-bold text-slate-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-indigo-500 rounded-t-lg transition-all"
                      style={{ height: `${(idx % 3 + 4) * 12}px` }}
                    />
                    <span>{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 9: ACHIEVEMENTS & BADGES ==================== */}
      {activeTab === "achievements" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" /> Mental Health Milestones & Badges
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Celebrate consistency, grounding practices & emotional growth</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Close</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-1">
              <div className="text-2xl">🧠</div>
              <h3 className="font-black text-indigo-900">First Check-in</h3>
              <p className="text-[9px] text-indigo-700 font-medium">Unlocked ✓</p>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-1">
              <div className="text-2xl">🌬️</div>
              <h3 className="font-black text-indigo-900">Breathing Master</h3>
              <p className="text-[9px] text-indigo-700 font-medium">Unlocked ✓</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1 opacity-60">
              <div className="text-2xl">🏆</div>
              <h3 className="font-black text-slate-800">30-Day Streak</h3>
              <p className="text-[9px] text-slate-500 font-medium">Locked 🔒</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1 opacity-60">
              <div className="text-2xl">🏅</div>
              <h3 className="font-black text-slate-800">CBT Champion</h3>
              <p className="text-[9px] text-slate-500 font-medium">Locked 🔒</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 10: SETTINGS & CUSTOMIZATION ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-600" /> Mental Health Preferences & Reminders
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Configure daily check-in alerts, privacy defaults & screening schedules</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Close</button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-black text-slate-900 block">Daily Check-In Reminder</span>
                <span className="text-[10px] text-slate-500 font-medium">Receive evening notification prompt</span>
              </div>
              <input
                type="checkbox"
                checked={dailyReminderEnabled}
                onChange={(e) => {
                  setDailyReminderEnabled(e.target.checked);
                  showFeedback(`Updated reminder setting: ${e.target.checked ? "Enabled" : "Disabled"}`);
                }}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-black text-slate-900 block">Automatic PHQ-9 & GAD-7 Monthly Prompt</span>
                <span className="text-[10px] text-slate-500 font-medium">Monthly clinical screening check</span>
              </div>
              <input
                type="checkbox"
                checked={autoScreeningEnabled}
                onChange={(e) => {
                  setAutoScreeningEnabled(e.target.checked);
                  showFeedback(`Updated screening prompt setting.`);
                }}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
