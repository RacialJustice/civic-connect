-- Create temporary tables for verification
CREATE TEMP TABLE table_info AS
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('wards', 'constituencies', 'counties');

CREATE TEMP TABLE fk_info AS
SELECT 
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY';

-- Output results
SELECT 'Table Structure:' as check_type;
SELECT * FROM table_info ORDER BY table_name, column_name;

SELECT 'Foreign Key Relationships:' as check_type;
SELECT * FROM fk_info ORDER BY table_name;

-- Verify indexes
SELECT 'Indexes:' as check_type;
SELECT 
    tablename, 
    indexname, 
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('wards', 'constituencies', 'counties')
ORDER BY tablename, indexname;

-- Clean up
DROP TABLE table_info;
DROP TABLE fk_info;
