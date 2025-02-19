SELECT pgrst.register_function(
    'public',
    'execute_sql',
    ARRAY['_sql text']::text[]
);
