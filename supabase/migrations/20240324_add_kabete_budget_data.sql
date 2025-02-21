-- First add the main budget allocation for Kabete
insert into budget_allocations (region_type, region_name, amount, fiscal_year, description)
values ('constituency', 'Kabete', 8000000.00, '2023-2024', 'Infrastructure and Social Services Development');

-- Add budget item allocations for Kabete
insert into budget_item_allocations (budget_id, description, amount, fiscal_year)
select 
  (select id from budget_allocations where region_name = 'Kabete' limit 1),
  unnest(array[
    'Road Infrastructure Improvement',
    'Education Support Programs',
    'Water Supply Projects',
    'Youth Empowerment Initiatives'
  ]),
  unnest(array[
    3000000.00,
    2000000.00,
    2000000.00,
    1000000.00
  ]),
  '2023-2024';

-- Add some expenditure records
insert into budget_item_expenditures (budget_id, description, amount, fiscal_year)
select 
  (select id from budget_allocations where region_name = 'Kabete' limit 1),
  unnest(array[
    'Gitaru Road Rehabilitation Q1',
    'School Infrastructure Support',
    'Waterline Extensions Phase 1',
    'Youth Skills Training Program'
  ]),
  unnest(array[
    1500000.00,
    1200000.00,
    1000000.00,
    500000.00
  ]),
  '2023-2024';
