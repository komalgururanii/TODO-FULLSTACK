"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  Target,
  Calendar,
} from "lucide-react";

export default function ProgressDashboard({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Priority stats
  const priorityStats = {
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  };

  // Category stats
  const categoryStats = tasks.reduce((acc, task) => {
    const category = task.category || "general";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Overdue tasks
  const today = new Date();
  const overdueTasks = tasks.filter(
    (task) =>
      !task.completed && task.due_date && new Date(task.due_date) < today
  ).length;

  // Due today
  const dueTodayTasks = tasks.filter((task) => {
    if (!task.due_date || task.completed) return false;
    const dueDate = new Date(task.due_date);
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    return dueDate >= todayStart && dueDate < todayEnd;
  }).length;

  return (
    <div className="space-y-6">
      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Progress */}
        <Card className="col-span-1 md:col-span-2 gradient-card hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {completedTasks} of {totalTasks} completed
                </span>
                <span className="text-3xl font-bold text-blue-600">
                  {Math.round(completionRate)}%
                </span>
              </div>
              <Progress value={completionRate} className="h-3" />
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedTasks} Done</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>{totalTasks - completedTasks} Pending</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Stats */}
        <Card className="gradient-card hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">High</span>
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  {priorityStats.high}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Medium</span>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  {priorityStats.medium}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Low</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {priorityStats.low}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Due Dates */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Due Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueTasks > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600">Overdue</span>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    {overdueTasks}
                  </Badge>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-600">Due Today</span>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  {dueTodayTasks}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total with dates
                </span>
                <Badge variant="outline">
                  {tasks.filter((task) => task.due_date).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Row */}
      {Object.keys(categoryStats).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Categories Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div
                  key={category}
                  className="text-center p-3 bg-muted/30 rounded-lg"
                >
                  <div className="text-2xl mb-1">
                    {category === "general"
                      ? "📋"
                      : category === "work"
                      ? "💼"
                      : category === "personal"
                      ? "👤"
                      : category === "shopping"
                      ? "🛒"
                      : category === "health"
                      ? "🏥"
                      : category === "learning"
                      ? "📚"
                      : "📋"}
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {category}
                  </div>
                  <div className="text-lg font-bold text-blue-600">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
