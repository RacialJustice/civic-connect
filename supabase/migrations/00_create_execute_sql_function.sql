-- Function to execute SQL statements
create or replace function public.execute_sql(sql text) returns void as $$
begin
  execute sql;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function public.execute_sql to authenticated;
