-- Enable RLS and create SQL execution function
CREATE OR REPLACE FUNCTION exec(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION exec TO service_role;

-- Rename other migrations to run after this one
-- 0000_initial.sql -> 0001_initial.sql
