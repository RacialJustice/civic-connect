CREATE OR REPLACE FUNCTION public.execute_sql(_sql text)
RETURNS void AS $$
BEGIN
    EXECUTE _sql;
END;
$$ LANGUAGE plpgsql;
