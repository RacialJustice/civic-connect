-- Select all events with their details
select 
  id,
  title,
  region_name,
  region_type,
  start_date
from events
order by start_date;

-- Get Kabete specific events
select 
  id,
  title,
  region_name,
  region_type,
  start_date
from events 
where region_name in ('Kabete', 'Kiambu')
order by start_date;
