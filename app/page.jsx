"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";
import AuthForm from "./components/AuthForm";
import ProgressDashboard from "./components/ProgressDashboard";
import TaskFilters from "./components/TaskFilters";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { toast } from "sonner";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const { user, loading } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const fetchTasks = async () => {
    if (!user) return;

    try {
      let query = supabase.from("tasks").select("*").eq("user_id", user.id);

      // Filter by current workspace if one is selected
      if (currentWorkspace) {
        query = query.eq("workspace_id", currentWorkspace.id);
      } else {
        // Show personal tasks (tasks with no workspace) when no workspace is selected
        query = query.is("workspace_id", null);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Error fetching tasks:", error);
        if (error.code === "42P01") {
          setTasks([]);
          return;
        }
        toast.error("Failed to fetch tasks");
      } else {
        setTasks(data || []);
        console.log(
          `Loaded ${data?.length || 0} tasks for workspace: ${
            currentWorkspace ? currentWorkspace.name : "Personal"
          }`
        );
      }
    } catch (error) {
      console.error("Unexpected error fetching tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user, currentWorkspace]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 scale-in">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-center mt-4 text-lg">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-overlay"></div>
        <div className="relative z-10 slide-up">
          <AuthForm />
        </div>
      </div>
    );
  }

  const handleDelete = (id) => {
    // Remove the task locally after deletion
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleEdit = () => {
    fetchTasks();
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="bg-overlay"></div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header />

        {/* Main Content Container */}
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Workspace Status */}
          <div className="text-center mb-8 slide-up">
            <div className="glass-card inline-block rounded-full px-6 py-3 mb-4">
              <span className="text-sm font-medium">
                {currentWorkspace ? (
                  <>
                    <span className="text-green-600">● </span>
                    Viewing tasks in <strong>
                      {currentWorkspace.name}
                    </strong>{" "}
                    workspace
                  </>
                ) : (
                  <>
                    <span className="text-blue-600">🏠 </span>
                    Viewing <strong>Personal</strong> tasks
                  </>
                )}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {tasks.length} tasks found
            </div>
          </div>

          {/* Top Section - Add Task */}
          <div className="flex justify-center mb-12 scale-in">
            <div className="gradient-card rounded-2xl p-6 shadow-2xl hover-lift">
              <TaskForm onTaskCreated={fetchTasks} />
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center mt-20 slide-up">
              <div className="text-8xl mb-6 float-animation">📝</div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome to Your Todo App!
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
                Start organizing your tasks and boost your productivity. Create
                your first task to get started.
              </p>
              <div className="gradient-card rounded-2xl p-8 max-w-lg mx-auto hover-lift">
                <h3 className="font-semibold mb-4 text-lg">
                  ✨ Features you'll love:
                </h3>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-yellow-500">🏷️</span> Categories and
                    priority levels
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-500">📊</span> Progress tracking
                    and statistics
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">🔍</span> Advanced search
                    and filtering
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-500">📅</span> Due date
                    management
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard Section */}
              <div className="mb-12 slide-up">
                <ProgressDashboard tasks={tasks} />
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Filters */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6">
                    <div className="gradient-card rounded-2xl p-6 hover-lift">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        🔍 Filters & Search
                      </h3>
                      <TaskFilters
                        tasks={tasks}
                        onFilteredTasks={setFilteredTasks}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Main Content - Tasks */}
                <div className="lg:col-span-3">
                  <div className="gradient-card rounded-2xl p-6 hover-lift">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">
                        {filteredTasks.length === tasks.length
                          ? `All Tasks (${tasks.length})`
                          : `Filtered Tasks (${filteredTasks.length} of ${tasks.length})`}
                      </h3>
                      {filteredTasks.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {filteredTasks.filter((t) => t.completed).length}{" "}
                          completed
                        </div>
                      )}
                    </div>

                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="text-6xl mb-6 float-animation">🔍</div>
                        <h3 className="text-2xl font-semibold mb-4">
                          No tasks match your filters
                        </h3>
                        <p className="text-muted-foreground text-lg mb-6">
                          Try adjusting your search criteria or clearing filters
                          to see more tasks.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredTasks.map((task, index) => (
                          <div
                            key={task.id}
                            className={`slide-up priority-${task.priority}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <TaskCard
                              task={task}
                              onDelete={handleDelete}
                              onEdit={handleEdit}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
