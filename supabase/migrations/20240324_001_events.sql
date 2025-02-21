-- First create the events table
create type event_status as enum ('upcoming', 'ongoing', 'completed', 'cancelled');

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

-- Enable RLS and create policies
alter table events enable row level security;

create policy "Public can view events"
  on events for select using (true);

create policy "Authenticated users can create events"
  on events for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own events"
  on events for update using (auth.uid() = created_by);

-- Create indexes
create index events_region_name_idx on events(region_name);
create index events_region_type_idx on events(region_type);
create index events_start_date_idx on events(start_date);
create index events_status_idx on events(status);

-- Add sample events for Kabete
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
) values 
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
  'upcoming'
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
  'upcoming'
),
(
  'Infrastructure Development Forum',
  'Public participation meeting on upcoming road projects',
  now() + interval '10 days',
  now() + interval '10 days' + interval '2 hours',
  'Kabete Sub-County Offices',
  'Kabete',
  'constituency',
  'County Works Department',
  150,
  'upcoming'
);
