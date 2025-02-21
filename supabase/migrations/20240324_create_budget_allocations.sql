-- First create the function for updating timestamps
create or replace function fn_set_updated_at()
returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

-- Create the enum type if it doesn't exist
do $$ begin
  create type region_type as enum ('ward', 'constituency', 'county');
exception
  when duplicate_object then null;
end $$;

create table if not exists budget_allocations (
  id uuid default gen_random_uuid() primary key,
  region_type region_type not null,
  region_name text not null,
  amount decimal(15,2) not null,
  fiscal_year text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id),
  
  -- Add constraints
  constraint positive_amount check (amount >= 0)
);

-- Enable RLS
alter table budget_allocations enable row level security;

-- Drop existing policies if they exist
do $$ begin
  drop policy if exists "Public can view budget_allocations" on budget_allocations;
  drop policy if exists "Authenticated users can insert budget_allocations" on budget_allocations;
  drop policy if exists "Users can update their own budget_allocations" on budget_allocations;
exception
  when undefined_object then null;
end $$;

-- Create policies
create policy "Public can view budget_allocations"
  on budget_allocations
  for select
  using (true);

create policy "Authenticated users can insert budget_allocations"
  on budget_allocations
  for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own budget_allocations"
  on budget_allocations
  for update
  using (auth.uid() = created_by);

-- Create or replace trigger
drop trigger if exists set_updated_at on budget_allocations;
create trigger set_updated_at
  before update on budget_allocations
  for each row
  execute function fn_set_updated_at();

-- Add some sample data
insert into budget_allocations (region_type, region_name, amount, fiscal_year, description)
select 
  unnest(array[
    'ward'::region_type, 
    'constituency'::region_type, 
    'county'::region_type
  ]) as region_type,
  unnest(array[
    'Kahawa West', 
    'Roysambu', 
    'Nairobi'
  ]) as region_name,
  unnest(array[
    1500000.00, 
    5000000.00, 
    15000000.00
  ]) as amount,
  '2023-2024' as fiscal_year,
  unnest(array[
    'Road maintenance and street lighting',
    'Healthcare facility upgrades',
    'Education infrastructure'
  ]) as description
where not exists (select 1 from budget_allocations);
