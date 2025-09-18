"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { toast } from "sonner";
import { Plus, Tag } from "lucide-react";

export default function TaskForm({ onTaskCreated }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState("");
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const handleAddTask = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const { data, error } = await supabase.from("tasks").insert([
      {
        title,
        description,
        due_date: dueDate || null,
        category,
        priority,
        tags: tagsArray,
        user_id: user.id,
        workspace_id: currentWorkspace ? currentWorkspace.id : null,
      },
    ]);

    if (error) {
      toast.error("Failed to add task");
      console.error("Error:", error);
    } else {
      toast.success("Task added successfully");
      setTitle("");
      setDescription("");
      setDueDate("");
      setCategory("general");
      setPriority("medium");
      setTags("");
      setOpen(false);
      onTaskCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-center">
        <DialogTrigger asChild>
          <Button
            className="mb-4 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-2xl hover:scale-105 hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-purple-400 rounded-xl px-8 py-4 text-lg pulse-animation"
            size="lg"
          >
            <Plus className="w-6 h-6" />
            Add New Task
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">📋 General</SelectItem>
                  <SelectItem value="work">💼 Work</SelectItem>
                  <SelectItem value="personal">👤 Personal</SelectItem>
                  <SelectItem value="shopping">🛒 Shopping</SelectItem>
                  <SelectItem value="health">🏥 Health</SelectItem>
                  <SelectItem value="learning">📚 Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">⬇️ Low</SelectItem>
                  <SelectItem value="medium">➖ Medium</SelectItem>
                  <SelectItem value="high">⬆️ High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas..."
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Example: urgent, meeting, deadline
            </p>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAddTask}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Add Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
