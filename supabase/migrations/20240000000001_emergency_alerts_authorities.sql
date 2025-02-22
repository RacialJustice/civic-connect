-- Drop existing table and policies if they exist
DROP POLICY IF EXISTS "Admins can manage emergency authorities" ON public.emergency_authorities;
DROP POLICY IF EXISTS "Authenticated users can view emergency authorities" ON public.emergency_authorities;
DROP TABLE IF EXISTS public.emergency_authorities CASCADE;

-- Create a table for authority assignments
create table public.emergency_authorities (
  id uuid default gen_random_uuid() primary key,
  authority_type text not null,
  region text not null,
  contact_email text not null,
  contact_phone text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.emergency_authorities enable row level security;

-- Add policy for admins
create policy "Admins can manage emergency authorities"
  on public.emergency_authorities for all
  to authenticated
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.role = 'admin'
    )
  );

-- Add policy for read-only access
create policy "Authenticated users can view emergency authorities"
  on public.emergency_authorities for select
  to authenticated
  using (true);
