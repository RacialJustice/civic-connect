-- First check existing events
select * from events;

-- Add more specific events for Kabete areas
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
  'Kabete Market Day',
  'Weekly market day with local produce and goods',
  now() + interval '3 days',
  now() + interval '3 days' + interval '8 hours',
  'Kabete Market Ground',
  'Kabete',
  'constituency',
  'Market Committee',
  500,
  'upcoming'
),
(
  'Community Health Drive',
  'Free medical checkups and health education',
  now() + interval '5 days',
  now() + interval '5 days' + interval '6 hours',
  'Gitaru Health Center',
  'Gitaru',
  'ward',
  'Ministry of Health',
  300,
  'upcoming'
),
(
  'Kiambu County Sports Day',
  'Inter-constituency sports competition',
  now() + interval '10 days',
  now() + interval '10 days' + interval '8 hours',
  'Kiambu Stadium',
  'Kiambu',
  'county',
  'County Sports Department',
  1000,
  'upcoming'
);
