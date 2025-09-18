"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import EditTaskForm from "./EditTaskForm";
import { PriorityBadge, CategoryBadge, TagBadge } from "./TaskBadges";
import { Trash2, Calendar, CheckCircle2, Circle } from "lucide-react";

export default function TaskCard({ task, onDelete, onEdit }) {
  const handleDelete = async () => {
    const { error } = await supabase.from("tasks").delete().eq("id", task.id);
    if (error) {
      toast.error("Failed to delete task");
    } else {
      toast.success("Task deleted");
      onDelete(task.id);
    }
  };

  const handleToggleComplete = async () => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    if (error) {
      toast.error("Failed to update task");
    } else {
      toast.success(
        task.completed ? "Task marked as incomplete" : "Task completed!"
      );
      onEdit();
    }
  };

  return (
    <Card
      className={`mb-4 gradient-card hover-lift transition-all duration-300 border-l-4 relative overflow-hidden ${
        task.priority === "high"
          ? "border-l-red-500 priority-high"
          : task.priority === "medium"
          ? "border-l-yellow-500 priority-medium"
          : "border-l-green-500 priority-low"
      } ${task.completed ? "opacity-75" : ""}`}
    >
      {/* Decorative gradient overlay */}
      <div
        className={`absolute top-0 right-0 w-20 h-20 opacity-10 ${
          task.priority === "high"
            ? "bg-red-400"
            : task.priority === "medium"
            ? "bg-yellow-400"
            : "bg-green-400"
        } rounded-full -translate-y-8 translate-x-8`}
      ></div>

      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleComplete}
              className="mt-1 p-0 h-auto hover:scale-110 transition-transform duration-200"
            >
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 drop-shadow-sm" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </Button>

            <div className="flex-1">
              <h3
                className={`text-xl font-bold mb-2 ${
                  task.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p
                  className={`text-sm mb-4 leading-relaxed ${
                    task.completed
                      ? "text-muted-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 mb-3">
                <CategoryBadge category={task.category} />
                <PriorityBadge priority={task.priority} />

                {task.tags && task.tags.length > 0 && (
                  <>
                    {task.tags.map((tag, index) => (
                      <TagBadge key={index} tag={tag} />
                    ))}
                  </>
                )}
              </div>

              {task.due_date && (
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                      new Date(task.due_date) < new Date()
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>
                      Due: {format(new Date(task.due_date), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            <EditTaskForm task={task} onTaskUpdated={onEdit} />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-105"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
