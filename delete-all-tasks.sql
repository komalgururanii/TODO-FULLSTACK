-- =====================================================
-- DELETE ALL TASKS AND START FRESH
-- This will remove all your existing tasks from the database
-- =====================================================

-- Delete all tasks for your user account
DELETE FROM public.tasks 
WHERE user_id = 'ee3a89f2-cfc1-4453-a7c9-7ffa2dd1e731';

-- Verify all tasks are deleted
SELECT COUNT(*) as remaining_tasks 
FROM public.tasks 
WHERE user_id = 'ee3a89f2-cfc1-4453-a7c9-7ffa2dd1e731';

-- Show all workspaces (these will remain intact)
SELECT id, name, description 
FROM public.workspaces 
WHERE owner_id = 'ee3a89f2-cfc1-4453-a7c9-7ffa2dd1e731';

-- =====================================================
-- DONE! All your tasks are deleted
-- Your workspaces remain intact:
-- - Office
-- - Personal Workspace
-- - komal
-- 
-- Now you can create fresh tasks in any workspace!
-- =====================================================