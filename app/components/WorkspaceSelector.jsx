"use client";

import { useState } from "react";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Plus,
  Users,
  Crown,
  UserPlus,
  Settings,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function WorkspaceSelector() {
  const {
    workspaces,
    currentWorkspace,
    switchWorkspace,
    createWorkspace,
    inviteMember,
    deleteWorkspace,
    loading,
  } = useWorkspace();
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    description: "",
  });
  const [inviteEmail, setInviteEmail] = useState("");

  // Don't render if workspaces are still loading or if there's no workspace support yet
  if (loading || !workspaces) {
    return null;
  }

  const handleCreateWorkspace = async () => {
    if (!newWorkspace.name.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    const { data, error } = await createWorkspace(
      newWorkspace.name,
      newWorkspace.description
    );

    if (error) {
      toast.error("Failed to create workspace");
    } else {
      toast.success("Workspace created successfully");
      setNewWorkspace({ name: "", description: "" });
      setShowCreateDialog(false);
      switchWorkspace(data);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Email is required");
      return;
    }

    const { error } = await inviteMember(currentWorkspace.id, inviteEmail);

    if (error) {
      toast.error("Failed to invite member");
    } else {
      toast.success("Member invited successfully");
      setInviteEmail("");
      setShowInviteDialog(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspaceToDelete) return;

    const { error } = await deleteWorkspace(workspaceToDelete.id);

    if (error) {
      toast.error("Failed to delete workspace");
    } else {
      toast.success(
        `Workspace "${workspaceToDelete.name}" deleted successfully`
      );
      setShowDeleteDialog(false);
      setWorkspaceToDelete(null);
    }
  };

  const openDeleteDialog = (workspace) => {
    setWorkspaceToDelete(workspace);
    setShowDeleteDialog(true);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Workspace Selector */}
      <Select
        value={currentWorkspace?.id || "personal"}
        onValueChange={(value) => {
          if (value === "personal") {
            switchWorkspace(null);
          } else {
            const workspace = workspaces.find((w) => w.id === value);
            if (workspace) switchWorkspace(workspace);
          }
        }}
      >
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <SelectValue placeholder="Select workspace" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {/* Personal/No Workspace Option */}
          <SelectItem value="personal">
            <div className="flex items-center gap-2">
              <span>🏠 Personal</span>
            </div>
          </SelectItem>

          {workspaces.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id}>
              <div className="flex items-center justify-between w-full">
                <span>{workspace.name}</span>
                {workspace.owner_id === user?.id && (
                  <Crown className="w-3 h-3 ml-2 text-yellow-600" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Current Workspace Info */}
      {currentWorkspace && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {currentWorkspace.workspace_members?.length || 1}
        </Badge>
      )}

      {/* Workspace Actions */}
      {currentWorkspace && currentWorkspace.owner_id === user?.id && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openDeleteDialog(currentWorkspace)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}

      {/* Create Workspace */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={newWorkspace.name}
                onChange={(e) =>
                  setNewWorkspace({ ...newWorkspace, name: e.target.value })
                }
                placeholder="Enter workspace name..."
              />
            </div>
            <div>
              <Label htmlFor="workspace-description">
                Description (Optional)
              </Label>
              <Textarea
                id="workspace-description"
                value={newWorkspace.description}
                onChange={(e) =>
                  setNewWorkspace({
                    ...newWorkspace,
                    description: e.target.value,
                  })
                }
                placeholder="Enter workspace description..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateWorkspace}>Create Workspace</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Member */}
      {currentWorkspace && currentWorkspace.owner_id === user?.id && (
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <UserPlus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleInviteMember}>Send Invite</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Workspace Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{workspaceToDelete?.name}"? This
              action cannot be undone. All tasks and members in this workspace
              will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWorkspace}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Workspace
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
