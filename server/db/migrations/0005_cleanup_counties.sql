-- First, let's see what we have
CREATE TEMP TABLE county_duplicates AS
SELECT name, code, COUNT(*)
FROM counties
GROUP BY name, code
HAVING COUNT(*) > 1;

-- Delete duplicates keeping the first entry
DELETE FROM counties a USING (
  SELECT MIN(ctid) as ctid, name, code
  FROM counties 
  GROUP BY name, code
  HAVING COUNT(*) > 1
) b
WHERE a.name = b.name 
AND a.code = b.code 
AND a.ctid <> b.ctid;

-- Remove any test or invalid entries
DELETE FROM counties 
WHERE code NOT SIMILAR TO '[0-9]{3}'
OR LENGTH(code) != 3
OR name IS NULL;
