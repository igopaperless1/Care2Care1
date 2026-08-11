import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini API client lazily / safely
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Care2Care", timestamp: new Date().toISOString() });
});

// Gemini Endpoint: Medicine Photo OCR & Analysis
app.post("/api/gemini/analyze-medicine", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    const ai = getGeminiAI();
    if (!ai) {
      return res.json({
        medicineName: "Amoxicillin / Multivitamin",
        dosage: "500 mg",
        frequency: "Twice daily after meals",
        timing: "08:00 AM & 08:00 PM",
        purpose: "Antibiotic / Daily Health Supplement",
        warnings: "Take with food to prevent upset stomach.",
        confidence: "Simulated AI Analysis (Set GEMINI_API_KEY for live OCR)",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Analyze this pill/medicine bottle or prescription photo. Return JSON ONLY with fields:
{
  "medicineName": "string",
  "dosage": "string",
  "frequency": "string",
  "timing": "string",
  "purpose": "string",
  "warnings": "string"
}`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Error analyzing medicine:", error);
    res.status(500).json({
      error: "Failed to analyze image",
      details: error.message,
    });
  }
});

// Gemini Endpoint: Clinical & Wellness Insights
app.post("/api/gemini/clinical-insight", async (req, res) => {
  try {
    const { waterIntake, goal, mood, steps, sleepHours, medsTaken, totalMeds, patientType } = req.body;

    const ai = getGeminiAI();
    if (!ai) {
      return res.json({
        insight: `Drinking water consistently (${waterIntake}ml of ${goal}ml today) improves cognitive clarity by up to 15%. Keep going!`,
        actionableTip: "Try drinking 250ml right after waking up for optimal metabolic activation.",
      });
    }

    const prompt = `Provide a concise, encouraging clinical/wellness insight (1-2 sentences) and 1 quick actionable tip for a patient/individual (${patientType || "General"}) with today's stats:
Water Intake: ${waterIntake || 0}ml / ${goal || 2500}ml
Mood: ${mood || "Balanced"}
Sleep: ${sleepHours || 7} hrs
Meds Taken: ${medsTaken || 0} / ${totalMeds || 0}

Return JSON with keys "insight" and "actionableTip".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    res.json({
      insight: "Staying hydrated and keeping regular medication schedules ensures maximum daily vitality and mental clarity.",
      actionableTip: "Set periodic gentle reminders to pause and take 3 deep diaphragmatic breaths.",
    });
  }
});

// Gemini Endpoint: Habit Builder Coaching & Performance Insights
app.post("/api/gemini/habit-coach", async (req, res) => {
  try {
    const { habits = [], completionRate = 80, currentStreak = 5, topCategory = "Health" } = req.body;

    const ai = getGeminiAI();
    if (!ai) {
      return res.json({
        summaryInsight: `Outstanding consistency! You've maintained a ${currentStreak}-day streak with an overall ${completionRate}% completion rate across your habits.`,
        strengths: ["You are most consistent with morning routines.", "Your hydration habit is strong."],
        recommendations: [
          "Try setting reminder alerts for evening wind-down tasks.",
          "Add 5 minutes of gentle stretching after workout sessions."
        ],
        motivationalPush: "Consistency builds momentum. Keep pushing forward day by day!"
      });
    }

    const prompt = `Analyze these user habit statistics and return a JSON object with habit coaching insights:
Completion Rate: ${completionRate}%
Current Streak: ${currentStreak} days
Top Active Category: ${topCategory}
Habits Summary: ${JSON.stringify(habits.slice(0, 8))}

Return JSON with structure:
{
  "summaryInsight": "1-2 inspiring analysis sentences",
  "strengths": ["string", "string"],
  "recommendations": ["string", "string"],
  "motivationalPush": "string"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    res.json({
      summaryInsight: "Your daily habits are building a solid foundation for long-term health and wellness.",
      strengths: ["Great momentum on morning routines", "Consistent habit completion rate"],
      recommendations: ["Set regular reminders for afternoon goals", "Pair new habits with existing daily triggers"],
      motivationalPush: "Every single checkmark moves you closer to your ideal routine!"
    });
  }
});

// Gemini Endpoint: Document Generator (SOP, Resume, Cover Letter, Certificates)
app.post("/api/gemini/generate-document", async (req, res) => {
  try {
    const { docType, name, details } = req.body;
    const ai = getGeminiAI();

    if (!ai) {
      return res.json({
        title: `${docType.toUpperCase()} for ${name || "Caregiver"}`,
        content: `Professional ${docType} generated for ${name}.\n\nDetails:\n${details || "Standard caregiving protocol and administrative competence."}\n\nKey Qualifications:\n- Patient Vitals Monitoring & Hydration Logistics\n- Emergency SOS Protocol Management\n- Patient Dignity & Daily Comfort Protocol`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate a complete professional ${docType} for candidate/person name "${name}". Context and details provided: "${details}". Ensure clean structured layout with headings and bullet points.`,
    });

    res.json({
      title: `${docType.toUpperCase()} - ${name}`,
      content: response.text,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vite & Express setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Care2Care Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
