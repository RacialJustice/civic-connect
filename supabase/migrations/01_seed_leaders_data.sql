-- Add MP for Aldai
INSERT INTO members_of_parliament (name, constituency, county, contact, image_url)
VALUES (
  'Marianne Kitany',
  'Aldai',
  'Nandi',
  '+254700000000',
  'https://parliament.go.ke/mp-images/kitany.jpg'
) ON CONFLICT (constituency) DO UPDATE 
SET name = EXCLUDED.name,
    county = EXCLUDED.county;

-- Add Governor for Nandi
INSERT INTO governors (name, county, contact, image_url)
VALUES (
  'Stephen Sang',
  'Nandi',
  '+254711000000',
  'https://county.go.ke/governors/sang.jpg'
) ON CONFLICT (county) DO UPDATE 
SET name = EXCLUDED.name;

-- Add Senator for Nandi
INSERT INTO senators (name, county, contact, image_url)
VALUES (
  'Samson Cherargei',
  'Nandi',
  '+254722000000',
  'https://senate.go.ke/senators/cherargei.jpg'
) ON CONFLICT (county) DO UPDATE 
SET name = EXCLUDED.name;
