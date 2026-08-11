import { useState, useEffect, useRef, useCallback } from "react";

export interface VoiceCommandCallback {
  (commandType: string, payload?: any): void;
}

export function useVoiceRecognition(onCommandMatched?: VoiceCommandCallback) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Text-To-Speech helper
  const speakText = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Parse voice commands
  const parseCommand = useCallback(
    (text: string) => {
      const lower = text.toLowerCase().trim();

      if (lower.includes("open water") || lower.includes("water service") || lower.includes("go to water")) {
        speakText("Opening Water Tracker for you now.");
        if (onCommandMatched) onCommandMatched("NAVIGATE", "water");
        return true;
      }
      if (lower.includes("open medicine") || lower.includes("medicine tracker") || lower.includes("go to medicine") || lower.includes("check pills")) {
        speakText("Opening Medicine Tracker.");
        if (onCommandMatched) onCommandMatched("NAVIGATE", "medicine");
        return true;
      }
      if (lower.includes("open sos") || lower.includes("emergency service") || lower.includes("trigger sos")) {
        speakText("Navigating to SOS Emergency Service.");
        if (onCommandMatched) onCommandMatched("NAVIGATE", "sos");
        return true;
      }
      if (lower.includes("open exercise") || lower.includes("workout")) {
        speakText("Opening Exercise Tracker.");
        if (onCommandMatched) onCommandMatched("NAVIGATE", "exercise");
        return true;
      }
      if (lower.includes("open yoga") || lower.includes("meditation")) {
        speakText("Opening Yoga and Meditation Tracker.");
        if (onCommandMatched) onCommandMatched("NAVIGATE", "yoga");
        return true;
      }
      if (lower.includes("open steps") || lower.includes("pedometer")) {
        speakText("Opening Steps Tracker.");
        if (onCommandMatched) onCommandMatched("NAVIGATE", "steps");
        return true;
      }
      if (lower.includes("open kids") || lower.includes("child care")) {
        speakText("Opening Kids Care Tracker.");
        if (onCommandMatched) onCommandMatched("NAVIGATE", "kids");
        return true;
      }
      if (lower.includes("open elderly") || lower.includes("senior care")) {
        speakText("Opening Elderly Care Tracker.");
        if (onCommandMatched) onCommandMatched("NAVIGATE", "elderly");
        return true;
      }
      if (lower.includes("open finance") || lower.includes("budget")) {
        speakText("Opening Finance and Budget Tracker.");
        if (onCommandMatched) onCommandMatched("NAVIGATE", "finance");
        return true;
      }
      if (lower.includes("open password") || lower.includes("password manager") || lower.includes("passwords") || lower.includes("vault")) {
        speakText("Opening Password Management Service.");
        if (onCommandMatched) onCommandMatched("NAVIGATE", "passwords");
        return true;
      }
      if (lower.includes("export pdf") || lower.includes("download report") || lower.includes("download pdf") || lower.includes("export vitals")) {
        speakText("Generating PDF Health Report.");
        if (onCommandMatched) onCommandMatched("ACTION", "EXPORT_PDF");
        return true;
      }
      if (lower.includes("log water") || lower.includes("add water")) {
        speakText("Opening Water intake logger.");
        if (onCommandMatched) onCommandMatched("ACTION", "LOG_WATER");
        return true;
      }

      return false;
    },
    [onCommandMatched, speakText]
  );

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Web Speech API is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalStr = "";
      let interimStr = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalStr += transcriptPart + " ";
          parseCommand(transcriptPart);
        } else {
          interimStr += transcriptPart;
        }
      }

      if (finalStr) {
        setTranscript((prev) => prev + finalStr);
      }
      setInterimTranscript(interimStr);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition notice:", event.error);
      if (event.error !== "no-speech") {
        setError(`Speech error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [parseCommand]);

  const startListening = useCallback(() => {
    setError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        console.warn("Speech recognition already running or error:", err);
      }
    } else {
      setError("Speech recognition unavailable.");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.warn(err);
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    speakText,
  };
}
