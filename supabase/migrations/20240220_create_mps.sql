create table if not exists public.members_of_parliament (
    id serial primary key,
    name text not null,
    constituency text not null,
    party text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create index for faster searches
create index if not exists members_of_parliament_constituency_idx on public.members_of_parliament(constituency);
create index if not exists members_of_parliament_party_idx on public.members_of_parliament(party);

-- Enable RLS
alter table public.members_of_parliament enable row level security;

-- Create policy
create policy "Allow public read access"
    on public.members_of_parliament for select
    to authenticated
    using (true);
