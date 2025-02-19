-- Initial seed data
INSERT INTO counties (name, code) VALUES
('Nairobi', '047'),
('Kiambu', '022')
ON CONFLICT DO NOTHING;
