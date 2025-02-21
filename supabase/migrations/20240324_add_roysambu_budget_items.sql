-- Add sample data for Roysambu constituency budget
insert into budget_item_allocations (budget_id, description, amount, fiscal_year)
select 
  (select id from budget_allocations where region_name = 'Roysambu' limit 1),
  unnest(array[
    'Healthcare Equipment',
    'Medical Staff Training',
    'Facility Renovations',
    'Outreach Programs'
  ]),
  unnest(array[
    2000000.00,
    1000000.00,
    1500000.00,
    500000.00
  ]),
  '2023-2024';

insert into budget_item_expenditures (budget_id, description, amount, fiscal_year)
select 
  (select id from budget_allocations where region_name = 'Roysambu' limit 1),
  unnest(array[
    'Medical Equipment Purchase Q1',
    'Staff Training Workshop Series',
    'Clinic Renovations Phase 1',
    'Community Health Campaign'
  ]),
  unnest(array[
    1800000.00,
    800000.00,
    1200000.00,
    400000.00
  ]),
  '2023-2024';
