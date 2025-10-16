-- KLIO Database Functions
-- Run these in your Supabase SQL editor

-- Function to atomically replace user interests
CREATE OR REPLACE FUNCTION replace_user_interests(
  p_user_id UUID,
  p_interest_ids VARCHAR(50)[]
)
RETURNS VOID AS $$
BEGIN
  -- Delete existing interests for user
  DELETE FROM user_interests WHERE user_id = p_user_id;
  
  -- Insert new interests
  IF array_length(p_interest_ids, 1) > 0 THEN
    INSERT INTO user_interests (user_id, interest_id)
    SELECT p_user_id, unnest(p_interest_ids);
  END IF;
  
  -- Update profile with new interests count and timestamp
  UPDATE profiles 
  SET 
    interests_count = array_length(p_interest_ids, 1),
    last_interests_updated = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION replace_user_interests(UUID, VARCHAR(50)[]) TO authenticated;
