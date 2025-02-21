-- Create enum type if it doesn't exist
do $$ begin
  create type event_status as enum ('upcoming', 'ongoing', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

-- Create the events table
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  start_date timestamptz not null,
  end_date timestamptz,
  location text,
  region_name text not null,
  region_type text not null,
  organizer text,
  max_attendees integer,
  status event_status default 'upcoming',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Enable RLS
alter table events enable row level security;

-- Drop existing policies if they exist
do $$ begin
  drop policy if exists "Public can view events" on events;
  drop policy if exists "Authenticated users can create events" on events;
  drop policy if exists "Users can update their own events" on events;
exception
  when undefined_object then null;
end $$;

-- Create policies
create policy "Public can view events"
  on events for select using (true);

create policy "Authenticated users can create events"
  on events for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own events"
  on events for update using (auth.uid() = created_by);

-- Create indexes
create index if not exists events_region_name_idx on events(region_name);
create index if not exists events_region_type_idx on events(region_type);
create index if not exists events_start_date_idx on events(start_date);
create index if not exists events_status_idx on events(status);

-- Add sample data only if table is empty
insert into events (
  title,
  description,
  start_date,
  end_date,
  location,
  region_name,
  region_type,
  organizer,
  max_attendees,
  status
)
select * from (values
  (
    'Kabete Town Hall Meeting',
    'Monthly community meeting to discuss development projects and local issues',
    now() + interval '7 days',
    now() + interval '7 days' + interval '3 hours',
    'Kabete Technical Institute Hall',
    'Kabete',
    'constituency',
    'Constituency Office',
    200,
    'upcoming'::event_status
  ),
  (
    'Gitaru Youth Employment Workshop',
    'Career guidance and entrepreneurship training for youth',
    now() + interval '14 days',
    now() + interval '14 days' + interval '6 hours',
    'Gitaru Community Center',
    'Gitaru',
    'ward',
    'Ward Administrator',
    100,
    'upcoming'::event_status
  )
) as new_events
where not exists (select 1 from events limit 1);
