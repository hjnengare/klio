-- =============================================
-- FUNCTION: Delete User Account
-- Run this in your Supabase SQL editor
-- =============================================

-- Create function to delete user account
-- This must be SECURITY DEFINER to allow deletion of auth.users
CREATE OR REPLACE FUNCTION public.delete_user_account(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete from auth.users (this will cascade to all related tables)
  -- Note: RLS doesn't apply to auth.users table
  DELETE FROM auth.users WHERE id = p_user_id;
  
  -- Return void
  RETURN;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_account(UUID) TO authenticated;
