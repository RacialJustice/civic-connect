create table if not exists public.leaders (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    role text not null,
    area text not null,
    constituency text,
    ward text,
    county text,
    contact text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.leaders enable row level security;

-- Create policy for reading leaders
create policy "Anyone can read leaders"
    on public.leaders for select
    using (true);

-- Create indices for location-based queries
create index leaders_constituency_idx on public.leaders(constituency);
create index leaders_ward_idx on public.leaders(ward);
create index leaders_county_idx on public.leaders(county);
