-- Check current events
select * from events;

-- Add some test events specifically for Kabete location
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
  'Kabete Residents Meeting',
  'Monthly meeting to discuss local development issues',
  now() + interval '5 days',
  now() + interval '5 days' + interval '2 hours',
  'Kabete Community Hall',
  'Kabete',
  'constituency',
  'Constituency Office',
  100,
  'upcoming'
),
(
  'Kiambu County Education Forum',
  'County-wide education stakeholders meeting',
  now() + interval '7 days',
  now() + interval '7 days' + interval '4 hours',
  'Kiambu County Assembly Hall',
  'Kiambu',
  'county',
  'County Education Office',
  200,
  'upcoming'
);
