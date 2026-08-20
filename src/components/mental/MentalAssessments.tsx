import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Droplets,
  Heart
} from "lucide-react";
import { AssessmentTest } from "./types";
import { soundEngine } from "./soundEngine";

export const MentalAssessments: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<AssessmentTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<{ score: number; severity: string; recommendation: string } | null>(null);

  const tests: AssessmentTest[] = [
    {
      id: "phq9",
      title: "PHQ-9 Depression Screener",
      code: "PHQ-9",
      questionCount: 9,
      duration: "3 mins",
      lastTaken: "10 May 2025",
      lastScore: 4,
      lastSeverity: "Minimal / None",
      description: "Standard clinical screening instrument for assessing depression symptoms over the past 2 weeks.",
    },
    {
      id: "gad7",
      title: "GAD-7 Generalized Anxiety Screener",
      code: "GAD-7",
      questionCount: 7,
      duration: "2 mins",
      lastTaken: "8 May 2025",
      lastScore: 3,
      lastSeverity: "Low Anxiety",
      description: "Validated diagnostic questionnaire measuring generalized anxiety severity.",
    },
    {
      id: "pss10",
      title: "Perceived Stress Scale (PSS-10)",
      code: "PSS-10",
      questionCount: 10,
      duration: "4 mins",
      lastTaken: "2 May 2025",
      lastScore: 14,
      lastSeverity: "Moderate Stress",
      description: "Measures the degree to which life situations are appraised as unpredictable, uncontrollable, or overloading.",
    },
    {
      id: "who5",
      title: "WHO-5 Well-Being Index",
      code: "WHO-5",
      questionCount: 5,
      duration: "2 mins",
      description: "World Health Organization 5-item index measuring emotional wellbeing and vitality.",
    },
  ];

  const sampleQuestions = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself — or that you are a failure or have let yourself down?",
    "Trouble concentrating on things, such as reading or watching television?",
    "Moving or speaking so slowly that other people could have noticed? Or being fidgety/restless?",
    "Thoughts that you would be better off dead, or of hurting yourself in some way?",
  ];

  const options = [
    { text: "Not at all", score: 0 },
    { text: "Several days", score: 1 },
    { text: "More than half the days", score: 2 },
    { text: "Nearly every day", score: 3 },
  ];

  const handleStartTest = (test: AssessmentTest) => {
    soundEngine.playChime(580, 0.3);
    setSelectedTest(test);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTestResult(null);
  };

  const handleSelectAnswer = (score: number) => {
    soundEngine.playChime(450 + score * 40, 0.2);
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 < (selectedTest?.questionCount || 9)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate results
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      let severity = "Minimal";
      let recommendation = "Your symptoms are within healthy, normative ranges. Continue regular mindfulness.";

      if (totalScore >= 15) {
        severity = "Moderately Severe / Severe";
        recommendation = "We strongly suggest booking a consultation with Dr. Sharma or calling the 24/7 helpline.";
      } else if (totalScore >= 10) {
        severity = "Moderate";
        recommendation = "Consider structured CBT thought journaling and scheduling a guided therapy check-in.";
      } else if (totalScore >= 5) {
        severity = "Mild";
        recommendation = "Practice 5-minute daily meditation and maintain healthy sleep hygiene.";
      }

      setTestResult({ score: totalScore, severity, recommendation });
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
            Validated Screeners
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">Clinical Self-Assessments</h2>
          <p className="text-xs text-slate-500 font-medium">Clinically backed assessments used by psychologists worldwide.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF5A36]">
          <FileText className="w-6 h-6" />
        </div>
      </div>

      {/* ACTIVE TEST QUESTIONNAIRE */}
      {selectedTest && !testResult && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#FF5A36] uppercase">
              {selectedTest.code} • Question {currentQuestionIndex + 1} of {selectedTest.questionCount}
            </span>
            <button
              onClick={() => setSelectedTest(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Progress Bar in Peach */}
          <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF5A36] transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / selectedTest.questionCount) * 100}%` }}
            />
          </div>

          <div className="py-2">
            <h3 className="text-base font-black text-slate-900 leading-snug">
              Over the last 2 weeks, how often have you been bothered by:
            </h3>
            <p className="text-sm font-bold text-slate-700 mt-2 p-4 bg-[#FFF9F5] rounded-2xl border border-orange-200/80">
              "{sampleQuestions[currentQuestionIndex % sampleQuestions.length]}"
            </p>
          </div>

          <div className="space-y-2">
            {options.map((opt) => (
              <button
                key={opt.score}
                onClick={() => handleSelectAnswer(opt.score)}
                className="w-full p-3.5 bg-white hover:bg-orange-50/60 active:bg-orange-100 border border-slate-200/80 hover:border-orange-300 rounded-2xl text-left font-bold text-xs text-slate-800 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>{opt.text}</span>
                <span className="text-[10px] text-slate-400 font-bold">+{opt.score} pt</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TEST RESULT CARD */}
      {selectedTest && testResult && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-6 shadow-xs space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-200 text-[#FF5A36] mx-auto flex items-center justify-center text-xl font-black">
            {testResult.score}
          </div>
          <div>
            <span className="text-xs font-black text-[#FF5A36] uppercase">{selectedTest.code} Complete</span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">Severity: {testResult.severity}</h3>
          </div>

          <p className="text-xs text-slate-600 font-medium p-4 bg-[#FFF9F5] rounded-2xl border border-orange-200/80 leading-relaxed">
            {testResult.recommendation}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handleStartTest(selectedTest)}
              className="flex-1 py-3 bg-[#FFF9F5] hover:bg-orange-100 text-[#FF5A36] border border-orange-200 rounded-2xl text-xs font-black cursor-pointer"
            >
              Retake Test
            </button>
            <button
              onClick={() => setSelectedTest(null)}
              className="flex-1 py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
            >
              Done & Save
            </button>
          </div>
        </div>
      )}

      {/* TESTS DIRECTORY FEED */}
      {!selectedTest && (
        <div className="space-y-3">
          {tests.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-orange-100 hover:border-orange-200 rounded-3xl p-5 shadow-xs space-y-3 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF5A36] flex items-center justify-center font-black text-xs">
                    {t.code}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{t.title}</h3>
                    <p className="text-[11px] font-bold text-slate-400">
                      {t.questionCount} Questions • {t.duration}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleStartTest(t)}
                  className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black shadow-xs cursor-pointer"
                >
                  Take Test
                </button>
              </div>

              <p className="text-xs text-slate-500 font-medium">{t.description}</p>

              {t.lastTaken && (
                <div className="pt-2 border-t border-orange-50 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Last taken: {t.lastTaken}</span>
                  <span className="text-[#FF5A36]">Score: {t.lastScore} ({t.lastSeverity})</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
