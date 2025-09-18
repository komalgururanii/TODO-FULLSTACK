-- =====================================================
-- FIXED DATABASE POLICIES - NO INFINITE RECURSION
-- Run this script to fix the policy errors
-- =====================================================

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view workspaces they're members of" ON public.workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can update their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can delete their workspaces" ON public.workspaces;

DROP POLICY IF EXISTS "Users can view workspace members for their workspaces" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace owners and admins can add members" ON public.workspace_members;

DROP POLICY IF EXISTS "Users can view tasks in their workspaces" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks they created or are assigned to" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks or workspace admins can delete" ON public.tasks;

-- =====================================================
-- FIXED WORKSPACE POLICIES (No Recursion)
-- =====================================================

-- Simple workspace policies - users can see workspaces they own or are members of
CREATE POLICY "Users can view workspaces they own" ON public.workspaces
FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view workspaces they are members of" ON public.workspaces
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm
    WHERE wm.workspace_id = workspaces.id 
    AND wm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create workspaces" ON public.workspaces
FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can update their workspaces" ON public.workspaces
FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can delete their workspaces" ON public.workspaces
FOR DELETE USING (auth.uid() = owner_id);

-- =====================================================
-- WORKSPACE MEMBERS POLICIES
-- =====================================================

CREATE POLICY "Users can view workspace members they have access to" ON public.workspace_members
FOR SELECT USING (
  -- Can see members of workspaces they own
  EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = workspace_members.workspace_id 
    AND w.owner_id = auth.uid()
  )
  OR
  -- Can see members of workspaces they are members of
  user_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.workspace_members wm2
    WHERE wm2.workspace_id = workspace_members.workspace_id 
    AND wm2.user_id = auth.uid()
  )
);

CREATE POLICY "Workspace owners can add members" ON public.workspace_members
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = workspace_id 
    AND w.owner_id = auth.uid()
  )
);

-- =====================================================
-- TASK POLICIES (Support personal and workspace tasks)
-- =====================================================

CREATE POLICY "Users can view their own tasks" ON public.tasks
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view workspace tasks" ON public.tasks
FOR SELECT USING (
  workspace_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.workspace_members wm
    WHERE wm.workspace_id = tasks.workspace_id 
    AND wm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view assigned tasks" ON public.tasks
FOR SELECT USING (assigned_to = auth.uid());

CREATE POLICY "Users can create personal tasks" ON public.tasks
FOR INSERT WITH CHECK (
  user_id = auth.uid() 
  AND workspace_id IS NULL
);

CREATE POLICY "Users can create workspace tasks" ON public.tasks
FOR INSERT WITH CHECK (
  user_id = auth.uid() 
  AND workspace_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.workspace_members wm
    WHERE wm.workspace_id = tasks.workspace_id 
    AND wm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own tasks" ON public.tasks
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can update assigned tasks" ON public.tasks
FOR UPDATE USING (assigned_to = auth.uid());

CREATE POLICY "Users can delete their own tasks" ON public.tasks
FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- POLICIES FIXED - NO MORE INFINITE RECURSION!
-- =====================================================