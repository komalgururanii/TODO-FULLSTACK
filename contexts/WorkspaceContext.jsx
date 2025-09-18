"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

const WorkspaceContext = createContext({});

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
};

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWorkspaces();
    }
  }, [user]);

  const fetchWorkspaces = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .select(
          `
          *,
          workspace_members(role, user_id)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setWorkspaces(data || []);

      // Set first workspace as current if none selected
      if (data && data.length > 0 && !currentWorkspace) {
        setCurrentWorkspace(data[0]);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (name, description) => {
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .insert([
          {
            name,
            description,
            owner_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "42P01") {
          throw new Error(
            "Database tables not set up yet. Please run the migration script."
          );
        }
        throw error;
      }

      // Add creator as member
      await supabase.from("workspace_members").insert([
        {
          workspace_id: data.id,
          user_id: user.id,
          role: "owner",
        },
      ]);

      await fetchWorkspaces();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const inviteMember = async (workspaceId, email, role = "member") => {
    try {
      // First, check if user exists
      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("id")
        .eq("email", email)
        .single();

      if (userError) {
        return { error: "User not found" };
      }

      const { data, error } = await supabase.from("workspace_members").insert([
        {
          workspace_id: workspaceId,
          user_id: userData.id,
          role,
        },
      ]);

      if (error) throw error;

      await fetchWorkspaces();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const switchWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
    if (workspace) {
      localStorage.setItem("currentWorkspaceId", workspace.id);
    } else {
      localStorage.removeItem("currentWorkspaceId");
    }
  };

  const deleteWorkspace = async (workspaceId) => {
    try {
      // First, delete all tasks in the workspace
      await supabase.from("tasks").delete().eq("workspace_id", workspaceId);

      // Then delete all workspace members
      await supabase
        .from("workspace_members")
        .delete()
        .eq("workspace_id", workspaceId);

      // Finally, delete the workspace itself
      const { error } = await supabase
        .from("workspaces")
        .delete()
        .eq("id", workspaceId)
        .eq("owner_id", user.id); // Only owner can delete

      if (error) throw error;

      // If we're deleting the current workspace, switch to null
      if (currentWorkspace && currentWorkspace.id === workspaceId) {
        setCurrentWorkspace(null);
      }

      await fetchWorkspaces();
      return { data: true, error: null };
    } catch (error) {
      console.error("Error deleting workspace:", error);
      return { data: null, error };
    }
  };

  // Subscribe to real-time changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("workspace-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workspaces" },
        () => fetchWorkspaces()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workspace_members" },
        () => fetchWorkspaces()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const value = {
    workspaces,
    currentWorkspace,
    loading,
    createWorkspace,
    inviteMember,
    switchWorkspace,
    deleteWorkspace,
    fetchWorkspaces,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
