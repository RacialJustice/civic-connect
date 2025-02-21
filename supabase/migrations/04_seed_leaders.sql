-- Add MP for Aldai
INSERT INTO members_of_parliament (name, constituency, county, contact, image_url)
VALUES (
  'Marianne Kitany',
  'Aldai',
  'Nandi',
  '+254700000000',
  'https://parliament.go.ke/sites/default/files/2022-10/Hon.%20Marianne%20Kitany.jpg'
) ON CONFLICT (constituency) DO UPDATE 
SET name = EXCLUDED.name,
    county = EXCLUDED.county,
    contact = EXCLUDED.contact,
    image_url = EXCLUDED.image_url;

-- Add Governor for Nandi
INSERT INTO governors (name, county, contact, image_url)
VALUES (
  'Stephen Sang',
  'Nandi',
  '+254711000000',
  'https://nandi.go.ke/wp-content/uploads/2022/09/H.E-STEPHEN-SANG.jpg'
) ON CONFLICT (county) DO UPDATE 
SET name = EXCLUDED.name,
    contact = EXCLUDED.contact,
    image_url = EXCLUDED.image_url;

-- Add Senator for Nandi
INSERT INTO senators (name, county, contact, image_url)
VALUES (
  'Samson Cherargei',
  'Nandi',
  '+254722000000',
  'https://senate.go.ke/wp-content/uploads/2022/09/Hon.-Samson-Cherargei.jpg'
) ON CONFLICT (county) DO UPDATE 
SET name = EXCLUDED.name,
    contact = EXCLUDED.contact,
    image_url = EXCLUDED.image_url;
