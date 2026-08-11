import { useState, useEffect, useCallback } from "react";
import { getSavedSupabaseConfig, getSupabaseClient } from "../lib/supabase";
import { UserAccount } from "../components/AdminDashboard";

export interface AuthGuardState {
  user: UserAccount | null;
  role: "user" | "admin" | "organiser" | "staff" | "guest";
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  supabaseConnected: boolean;
}

const STORAGE_AUTH_KEY = "care2care_auth_user";

export function useAuthGuard() {
  const [authState, setAuthState] = useState<AuthGuardState>({
    user: null,
    role: "guest",
    isAuthenticated: false,
    isLoading: true,
    error: null,
    supabaseConnected: false,
  });

  // Verify auth session on mount & subscribe to changes
  const checkSession = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const config = getSavedSupabaseConfig();
      const client = getSupabaseClient();
      let activeUser: UserAccount | null = null;

      // 1. Try Supabase Auth getSession if connected
      if (client) {
        const { data: { session }, error } = await client.auth.getSession();
        if (!error && session?.user) {
          const u = session.user;
          const isAdmin = Boolean(
            u.email?.toLowerCase().includes("admin") ||
            u.user_metadata?.role === "admin"
          );
          activeUser = {
            id: u.id,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "Care User",
            email: u.email || "",
            role: isAdmin ? "admin" : (u.user_metadata?.role || "user"),
            plan: u.user_metadata?.plan || "Family",
            status: "Active",
            createdAt: u.created_at ? u.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            lastLogin: "Just now",
          };
        }
      }

      // 2. Fallback to cached local session ONLY if Supabase client is not configured
      if (!activeUser && !client) {
        const cached = localStorage.getItem(STORAGE_AUTH_KEY);
        if (cached) {
          try {
            activeUser = JSON.parse(cached);
          } catch {
            localStorage.removeItem(STORAGE_AUTH_KEY);
          }
        }
      }

      if (activeUser) {
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(activeUser));
        setAuthState({
          user: activeUser,
          role: (activeUser.role as any) || "user",
          isAuthenticated: true,
          isLoading: false,
          error: null,
          supabaseConnected: config.isConnected,
        });
      } else {
        localStorage.removeItem(STORAGE_AUTH_KEY);
        setAuthState({
          user: null,
          role: "guest",
          isAuthenticated: false,
          isLoading: false,
          error: null,
          supabaseConnected: config.isConnected,
        });
      }
    } catch (err: any) {
      console.error("Error in useAuthGuard session check:", err);
      setAuthState({
        user: null,
        role: "guest",
        isAuthenticated: false,
        isLoading: false,
        error: err.message || "Failed to authenticate session",
        supabaseConnected: false,
      });
    }
  }, []);

  useEffect(() => {
    checkSession();

    const client = getSupabaseClient();
    if (client) {
      const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u = session.user;
          const isAdmin = Boolean(
            u.email?.toLowerCase().includes("admin") ||
            u.user_metadata?.role === "admin"
          );
          const activeUser: UserAccount = {
            id: u.id,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "Care User",
            email: u.email || "",
            role: isAdmin ? "admin" : (u.user_metadata?.role || "user"),
            plan: u.user_metadata?.plan || "Family",
            status: "Active",
            createdAt: u.created_at ? u.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            lastLogin: "Just now",
          };
          localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(activeUser));
          setAuthState((prev) => ({
            ...prev,
            user: activeUser,
            role: (activeUser.role as any) || "user",
            isAuthenticated: true,
            isLoading: false,
          }));
        } else {
          localStorage.removeItem(STORAGE_AUTH_KEY);
          setAuthState((prev) => ({
            ...prev,
            user: null,
            role: "guest",
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [checkSession]);

  const login = useCallback((user: UserAccount) => {
    try {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
      setAuthState({
        user,
        role: (user.role as any) || "user",
        isAuthenticated: true,
        isLoading: false,
        error: null,
        supabaseConnected: getSavedSupabaseConfig().isConnected,
      });
    } catch (e: any) {
      console.error("Failed to store user login state:", e);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const client = getSupabaseClient();
      if (client) {
        await client.auth.signOut().catch(() => {});
      }
      localStorage.removeItem(STORAGE_AUTH_KEY);
      setAuthState({
        user: null,
        role: "guest",
        isAuthenticated: false,
        isLoading: false,
        error: null,
        supabaseConnected: getSavedSupabaseConfig().isConnected,
      });
    } catch (e: any) {
      console.error("Failed to logout user:", e);
    }
  }, []);

  const hasRole = useCallback(
    (requiredRoles: Array<"user" | "admin" | "organiser" | "staff" | "guest">) => {
      return requiredRoles.includes(authState.role);
    },
    [authState.role]
  );

  return {
    ...authState,
    checkSession,
    login,
    logout,
    hasRole,
    isAdmin: authState.role === "admin",
    isOrganiser: authState.role === "organiser" || authState.role === "admin",
  };
}
