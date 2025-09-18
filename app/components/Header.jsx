"use client";

import { ThemeToggle } from "./ThemeToggle";
import WorkspaceSelector from "./WorkspaceSelector";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

export default function Header() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  return (
    <header className="w-full flex justify-between items-center py-6 px-8 bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-blue-500/10 backdrop-blur-md border-b border-white/20 shadow-2xl">
      <div className="flex items-center gap-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
          ✨ ToDo App
        </h1>
        {user && (
          <div className="scale-in">
            <WorkspaceSelector />
          </div>
        )}
      </div>
      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-3 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">{user.email}</span>
          </div>
        )}
        <ThemeToggle />
        {user && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-red-500/10 border-red-300/50 text-red-600 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        )}
      </div>
    </header>
  );
}
