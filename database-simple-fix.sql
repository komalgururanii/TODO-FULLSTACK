-- =====================================================
-- FINAL FIX - SUPER SIMPLE POLICIES (NO RECURSION)
-- This will definitely work - run this now!
-- =====================================================

-- Drop ALL existing policies completely
DROP POLICY IF EXISTS "Users can view workspaces they own" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view workspaces they're members of" ON public.workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can update their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can delete their workspaces" ON public.workspaces;

DROP POLICY IF EXISTS "Users can view workspace members they have access to" ON public.workspace_members;
DROP POLICY IF EXISTS "Users can view workspace members for their workspaces" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace owners can add members" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace owners and admins can add members" ON public.workspace_members;

DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view workspace tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view assigned tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view tasks in their workspaces" ON public.tasks;
DROP POLICY IF EXISTS "Users can create personal tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create workspace tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update assigned tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks they created or are assigned to" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks or workspace admins can delete" ON public.tasks;

-- =====================================================
-- SUPER SIMPLE POLICIES - NO CROSS-TABLE REFERENCES
-- =====================================================

-- WORKSPACES: Only owners can see their own workspaces
CREATE POLICY "workspace_owner_access" ON public.workspaces
FOR ALL USING (owner_id = auth.uid());

-- WORKSPACE MEMBERS: Simple access control
CREATE POLICY "workspace_members_simple" ON public.workspace_members
FOR ALL USING (user_id = auth.uid());

-- TASKS: Users can only see/manage their own tasks (for now)
CREATE POLICY "tasks_user_access" ON public.tasks
FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- TEMPORARY SIMPLE POLICIES - NO MORE RECURSION!
-- We'll enhance these later once basic functionality works
-- =====================================================