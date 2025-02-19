/*
  # Add Kabete Leaders

  1. New Data
    - Add MP for Kabete Constituency
    - Add Governor for Kiambu County
    - Add Senator for Kiambu County
    - Add Women Representative for Kiambu County

  2. Security
    - Maintain RLS policies
*/

-- Insert Kabete MP
INSERT INTO public.officials (
  name,
  role,
  level,
  position,
  party,
  constituency,
  county,
  status,
  house_type,
  representation_type
) VALUES (
  'Wamacukuru Muhia',
  'MP',
  'constituency',
  'legislative',
  'UDA',
  'Kabete',
  'Kiambu',
  'active',
  'lower_house',
  'elected'
) ON CONFLICT DO NOTHING;

-- Insert Kiambu Governor
INSERT INTO public.officials (
  name,
  role,
  level,
  position,
  party,
  county,
  status,
  representation_type
) VALUES (
  'Kimani Wamatangi',
  'Governor',
  'county',
  'executive',
  'UDA',
  'Kiambu',
  'active',
  'elected'
) ON CONFLICT DO NOTHING;

-- Insert Kiambu Senator
INSERT INTO public.officials (
  name,
  role,
  level,
  position,
  party,
  county,
  status,
  house_type,
  representation_type
) VALUES (
  'Karungo Thangwa',
  'Senator',
  'county',
  'legislative',
  'UDA',
  'Kiambu',
  'active',
  'upper_house',
  'elected'
) ON CONFLICT DO NOTHING;

-- Insert Kiambu Women Representative
INSERT INTO public.officials (
  name,
  role,
  level,
  position,
  party,
  county,
  status,
  house_type,
  representation_type
) VALUES (
  'Anne Wamuratha',
  'Women Representative',
  'county',
  'legislative',
  'UDA',
  'Kiambu',
  'active',
  'lower_house',
  'elected'
) ON CONFLICT DO NOTHING;