-- =====================================================
-- MOVE OLD TASKS TO PERSONAL WORKSPACE
-- This will automatically move your 4 existing tasks to Personal Workspace
-- =====================================================

-- Move all tasks with no workspace to the Personal Workspace
-- This uses a subquery to automatically find the Personal Workspace ID
UPDATE public.tasks 
SET workspace_id = (
  SELECT id FROM public.workspaces 
  WHERE name = 'Personal Workspace' 
  AND owner_id = 'ee3a89f2-cfc1-4453-a7c9-7ffa2dd1e731'
  LIMIT 1
)
WHERE workspace_id IS NULL 
AND user_id = 'ee3a89f2-cfc1-4453-a7c9-7ffa2dd1e731';

-- Let's also verify the update worked
SELECT 
  t.title,
  t.workspace_id,
  w.name as workspace_name
FROM public.tasks t
LEFT JOIN public.workspaces w ON t.workspace_id = w.id
WHERE t.user_id = 'ee3a89f2-cfc1-4453-a7c9-7ffa2dd1e731'
ORDER BY t.created_at DESC;

-- =====================================================
-- DONE! Your 4 old tasks are now in Personal Workspace
-- Refresh your app and select "Personal Workspace" to see them
-- =====================================================