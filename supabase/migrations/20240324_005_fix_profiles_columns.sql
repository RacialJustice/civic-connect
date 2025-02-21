-- First verify current structure
select column_name, data_type 
from information_schema.columns 
where table_name = 'profiles';

-- Add missing columns if they don't exist
alter table profiles
add column if not exists ward text,
add column if not exists constituency text,
add column if not exists county text,
add column if not exists village text;

-- Copy data from old columns if they exist
do $$ 
begin
  -- Try to copy data from location_ prefixed columns if they exist
  begin
    update profiles 
    set 
      ward = location_ward,
      constituency = location_constituency,
      county = location_county
    where location_ward is not null 
       or location_constituency is not null 
       or location_county is not null;
  exception 
    when undefined_column then null;
  end;
end $$;

-- Create indexes for better performance
create index if not exists profiles_ward_idx on profiles(ward);
create index if not exists profiles_constituency_idx on profiles(constituency);
create index if not exists profiles_county_idx on profiles(county);

-- Verify the changes
select 
  id,
  ward,
  constituency,
  county,
  village
from profiles 
limit 5;
