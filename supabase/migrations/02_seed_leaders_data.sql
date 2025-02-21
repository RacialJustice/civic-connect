-- Add MP for Aldai
INSERT INTO members_of_parliament (name, constituency, county, phone, email, image_url)
VALUES (
  'Marianne Kitany',
  'Aldai',
  'Nandi',
  '+254700000000',
  'kitany@parliament.go.ke',
  'https://parliament.go.ke/sites/default/files/2022-10/Hon.%20Marianne%20Kitany.jpg'
) ON CONFLICT (constituency) DO UPDATE 
SET name = EXCLUDED.name,
    county = EXCLUDED.county;

-- Add Governor for Nandi
INSERT INTO governors (name, county, phone, email, image_url)
VALUES (
  'Stephen Sang',
  'Nandi',
  '+254711000000',
  'governor@nandi.go.ke',
  'https://nandi.go.ke/wp-content/uploads/2022/09/H.E-STEPHEN-SANG.jpg'
) ON CONFLICT (county) DO UPDATE 
SET name = EXCLUDED.name;

-- Add Senator for Nandi
INSERT INTO senators (name, county, phone, email, image_url)
VALUES (
  'Samson Cherargei',
  'Nandi',
  '+254722000000',
  'cherargei@senate.go.ke',
  'https://senate.go.ke/wp-content/uploads/2022/09/Hon.-Samson-Cherargei.jpg'
) ON CONFLICT (county) DO UPDATE 
SET name = EXCLUDED.name;
