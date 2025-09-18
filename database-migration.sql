-- =====================================================
-- TODO APP COLLABORATION DATABASE MIGRATION
-- Run this script in your Supabase SQL Editor
-- =====================================================

-- Create workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create workspace_members table
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(workspace_id, user_id)
);

-- Add workspace_id to tasks table
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view workspaces they're members of" ON public.workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can update their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can delete their workspaces" ON public.workspaces;

DROP POLICY IF EXISTS "Users can view workspace members for their workspaces" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace owners and admins can add members" ON public.workspace_members;

-- Create RLS policies for workspaces
CREATE POLICY "Users can view workspaces they're members of" ON public.workspaces
FOR SELECT USING (
  id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create workspaces" ON public.workspaces
FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can update their workspaces" ON public.workspaces
FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can delete their workspaces" ON public.workspaces
FOR DELETE USING (auth.uid() = owner_id);

-- Create RLS policies for workspace_members
CREATE POLICY "Users can view workspace members for their workspaces" ON public.workspace_members
FOR SELECT USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Workspace owners and admins can add members" ON public.workspace_members
FOR INSERT WITH CHECK (
  workspace_id IN (
    SELECT w.id FROM public.workspaces w
    LEFT JOIN public.workspace_members wm ON w.id = wm.workspace_id
    WHERE (w.owner_id = auth.uid()) 
    OR (wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
  )
);

-- Update tasks RLS policies for workspace support
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

-- New task policies that support both personal and workspace tasks
CREATE POLICY "Users can view tasks in their workspaces" ON public.tasks
FOR SELECT USING (
  (user_id = auth.uid()) OR
  (workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "Users can create tasks" ON public.tasks
FOR INSERT WITH CHECK (
  (user_id = auth.uid()) AND
  (workspace_id IS NULL OR workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "Users can update tasks they created or are assigned to" ON public.tasks
FOR UPDATE USING (
  (user_id = auth.uid()) OR 
  (assigned_to = auth.uid()) OR
  (workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ))
);

CREATE POLICY "Users can delete their own tasks or workspace admins can delete" ON public.tasks
FOR DELETE USING (
  (user_id = auth.uid()) OR
  (workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_id ON public.tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);

-- =====================================================
-- MIGRATION COMPLETE
-- Your app should now work with collaboration features!
-- =====================================================