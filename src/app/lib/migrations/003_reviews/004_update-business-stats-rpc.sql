-- Create or replace RPC to update business statistics for a business
-- Uses SECURITY DEFINER so it can run despite RLS on business_stats

CREATE OR REPLACE FUNCTION public.update_business_stats(p_business_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_reviews INTEGER;
  average_rating DECIMAL(3,2);
  rating_dist JSONB;
  percentiles JSONB;
BEGIN
  -- Aggregate review data
  SELECT
    COUNT(*)::INTEGER,
    COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
  INTO
    total_reviews,
    average_rating
  FROM reviews
  WHERE business_id = p_business_id;

  SELECT jsonb_build_object(
    '1', COUNT(*) FILTER (WHERE rating = 1),
    '2', COUNT(*) FILTER (WHERE rating = 2),
    '3', COUNT(*) FILTER (WHERE rating = 3),
    '4', COUNT(*) FILTER (WHERE rating = 4),
    '5', COUNT(*) FILTER (WHERE rating = 5)
  )
  INTO rating_dist
  FROM reviews
  WHERE business_id = p_business_id;

  -- Default distribution when no reviews exist
  rating_dist := COALESCE(
    rating_dist,
    jsonb_build_object('1', 0, '2', 0, '3', 0, '4', 0, '5', 0)
  );

  IF total_reviews = 0 THEN
    average_rating := 0;
  END IF;

  -- Simple percentile approximation (can be replaced with real analytics later)
  percentiles := jsonb_build_object(
    'service', LEAST(95, GREATEST(0, ROUND(average_rating * 20))),
    'price', LEAST(90, GREATEST(0, ROUND((average_rating - 0.2) * 20))),
    'ambience', LEAST(93, GREATEST(0, ROUND((average_rating + 0.1) * 20)))
  );

  INSERT INTO business_stats (
    business_id,
    total_reviews,
    average_rating,
    rating_distribution,
    percentiles,
    updated_at
  )
  VALUES (
    p_business_id,
    total_reviews,
    average_rating,
    rating_dist,
    percentiles,
    NOW()
  )
  ON CONFLICT (business_id) DO UPDATE
  SET
    total_reviews = EXCLUDED.total_reviews,
    average_rating = EXCLUDED.average_rating,
    rating_distribution = EXCLUDED.rating_distribution,
    percentiles = EXCLUDED.percentiles,
    updated_at = NOW();
END;
$$;

-- Allow authenticated and service roles to execute the function
GRANT EXECUTE ON FUNCTION public.update_business_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_business_stats(UUID) TO service_role;

-- Refresh schema cache so PostgREST sees the function
NOTIFY pgrst, 'reload schema';

