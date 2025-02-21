-- Add location columns to profiles table
alter table if exists profiles
add column if not exists ward text,
add column if not exists constituency text,
add column if not exists county text,
add column if not exists village text;

-- Create index for faster lookups
create index if not exists profiles_constituency_idx on profiles(constituency);
create index if not exists profiles_county_idx on profiles(county);

-- Update RLS policies to allow users to update their own location
create policy "Users can update their own profile location"
on profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Optional: Update any existing null values to empty string
update profiles
set 
  ward = coalesce(ward, ''),
  constituency = coalesce(constituency, ''),
  county = coalesce(county, ''),
  village = coalesce(village, '')
where 
  ward is null 
  or constituency is null 
  or county is null 
  or village is null;
