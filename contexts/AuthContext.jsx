"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run auth logic if supabase client is available
    if (!supabase) {
      setLoading(false);
      return;
    }
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      setUser(session?.user ?? null);
      setLoading(false);

      // Handle specific auth events
      if (event === "SIGNED_OUT") {
        // Clear any cached data
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed successfully");
      } else if (event === "USER_UPDATED") {
        console.log("User updated");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    if (!supabase)
      return { data: null, error: { message: "Supabase not configured" } };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    if (!supabase)
      return { data: null, error: { message: "Supabase not configured" } };
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) return { error: { message: "Supabase not configured" } };

    try {
      // Clear user state immediately
      setUser(null);

      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();

      // Clear local storage regardless of API response
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      if (error) {
        console.error("Supabase signOut error:", error);
        // Even if the API call fails, we've cleared local state
        // This handles cases where the session is already expired
        if (
          error.message.includes("403") ||
          error.message.includes("unauthorized")
        ) {
          return { error: null }; // Treat as successful local logout
        }
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error("Unexpected signOut error:", err);

      // Clear local storage even on unexpected errors
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      return { error: { message: "Unexpected error during sign out" } };
    }
  };

  // Add a method to refresh session
  const refreshSession = async () => {
    if (!supabase) return { error: { message: "Supabase not configured" } };

    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Session refresh error:", error);
        // If refresh fails, sign out the user
        setUser(null);
      }
      return { data, error };
    } catch (err) {
      console.error("Unexpected session refresh error:", err);
      setUser(null);
      return { error: { message: "Session refresh failed" } };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
