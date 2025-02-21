-- Create budget items tables
create table if not exists budget_item_allocations (
  id uuid default gen_random_uuid() primary key,
  budget_id uuid references budget_allocations(id) on delete cascade,
  description text not null,
  amount decimal(15,2) not null,
  fiscal_year text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id),
  
  constraint positive_allocation check (amount >= 0)
);

create table if not exists budget_item_expenditures (
  id uuid default gen_random_uuid() primary key,
  budget_id uuid references budget_allocations(id) on delete cascade,
  description text not null,
  amount decimal(15,2) not null,
  fiscal_year text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id),
  
  constraint positive_expenditure check (amount >= 0)
);

-- Enable RLS
alter table budget_item_allocations enable row level security;
alter table budget_item_expenditures enable row level security;

-- Drop existing policies if they exist
do $$ begin
  drop policy if exists "Public can view budget_item_allocations" on budget_item_allocations;
  drop policy if exists "Authenticated users can insert budget_item_allocations" on budget_item_allocations;
  drop policy if exists "Users can update their own budget_item_allocations" on budget_item_allocations;
  
  drop policy if exists "Public can view budget_item_expenditures" on budget_item_expenditures;
  drop policy if exists "Authenticated users can insert budget_item_expenditures" on budget_item_expenditures;
  drop policy if exists "Users can update their own budget_item_expenditures" on budget_item_expenditures;
exception
  when undefined_object then null;
end $$;

-- Create policies for budget_item_allocations
create policy "Public can view budget_item_allocations"
  on budget_item_allocations
  for select
  using (true);

create policy "Authenticated users can insert budget_item_allocations"
  on budget_item_allocations
  for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own budget_item_allocations"
  on budget_item_allocations
  for update
  using (auth.uid() = created_by);

-- Create policies for budget_item_expenditures
create policy "Public can view budget_item_expenditures"
  on budget_item_expenditures
  for select
  using (true);

create policy "Authenticated users can insert budget_item_expenditures"
  on budget_item_expenditures
  for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own budget_item_expenditures"
  on budget_item_expenditures
  for update
  using (auth.uid() = created_by);

-- Add sample data for the first budget allocation
insert into budget_item_allocations (budget_id, description, amount, fiscal_year)
select 
  (select id from budget_allocations where region_name = 'Nairobi' limit 1),
  unnest(array[
    'School Infrastructure',
    'Teacher Training Programs',
    'Learning Materials'
  ]),
  unnest(array[
    7000000.00,
    5000000.00,
    3000000.00
  ]),
  '2023-2024';

insert into budget_item_expenditures (budget_id, description, amount, fiscal_year)
select 
  (select id from budget_allocations where region_name = 'Nairobi' limit 1),
  unnest(array[
    'School Renovations Q1',
    'Teacher Workshop Series',
    'Textbook Distribution'
  ]),
  unnest(array[
    3500000.00,
    2500000.00,
    1500000.00
  ]),
  '2023-2024';
