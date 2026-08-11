import { useEffect, useRef, useState, useCallback } from "react";

interface AutoLogoutOptions {
  isAuthenticated: boolean;
  onLogout: () => void | Promise<void>;
  timeoutMinutes?: number;
}

export function useAutoLogout({
  isAuthenticated,
  onLogout,
  timeoutMinutes = 30,
}: AutoLogoutOptions) {
  const [isInactiveLoggedOut, setIsInactiveLoggedOut] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState<number>(timeoutMinutes);
  const lastActivityRef = useRef<number>(Date.now());
  const timeoutMs = timeoutMinutes * 60 * 1000;

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsInactiveLoggedOut(false);
      return;
    }

    const activityEvents = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    const handleUserActivity = () => {
      resetTimer();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remainingMs = Math.max(0, timeoutMs - elapsed);
      const remainingMins = Math.ceil(remainingMs / 60000);
      setMinutesRemaining(remainingMins);

      if (elapsed >= timeoutMs) {
        console.warn(`[AutoLogout] User inactive for ${timeoutMinutes} minutes. Automatically invalidating session.`);
        setIsInactiveLoggedOut(true);
        onLogout();
      }
    }, 10000); // Check every 10 seconds

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(intervalId);
    };
  }, [isAuthenticated, onLogout, resetTimer, timeoutMs, timeoutMinutes]);

  const dismissInactivityAlert = () => {
    setIsInactiveLoggedOut(false);
  };

  return {
    isInactiveLoggedOut,
    minutesRemaining,
    dismissInactivityAlert,
    resetTimer,
  };
}
