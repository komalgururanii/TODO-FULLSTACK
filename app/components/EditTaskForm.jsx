"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { Edit } from "lucide-react";

export default function EditTaskForm({ task, onTaskUpdated }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.due_date ? task.due_date.slice(0, 10) : ""); // Format for input date yyyy-MM-dd
      setPriority(task.priority || "medium");
    }
  }, [task]);

  const handleUpdateTask = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({ title, description, due_date: dueDate || null, priority })
      .eq("id", task.id);

    if (error) {
      toast.error("Failed to update task");
    } else {
      toast.success("Task updated successfully");
      onTaskUpdated();
      setOpen(false);
    }
  };

  if (!task) return null; // Prevent rendering if no task selected

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-dueDate">Due Date</Label>
            <Input
              type="date"
              id="edit-dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-priority">Priority</Label>
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
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
