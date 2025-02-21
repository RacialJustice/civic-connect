-- Check the current structure of profiles
select column_name, data_type 
from information_schema.columns 
where table_name = 'profiles'
order by ordinal_position;

-- Check existing data with location fields
select 
    id,
    user_id,
    ward,
    constituency,
    county,
    village,
    updated_at
from profiles
where ward is not null 
   or constituency is not null 
   or county is not null;

-- Check if indexes exist
select indexname, indexdef
from pg_indexes
where tablename = 'profiles'
  and (
    indexname like '%ward%' 
    or indexname like '%constituency%' 
    or indexname like '%county%'
  );

-- Add a test profile if none exist
insert into profiles (
    id,
    user_id,
    constituency,
    county,
    ward,
    updated_at
)
select 
    gen_random_uuid(),
    auth.uid(),
    'Kabete',
    'Kiambu',
    'Gitaru',
    now()
where not exists (
    select 1 from profiles 
    where constituency = 'Kabete'
);
