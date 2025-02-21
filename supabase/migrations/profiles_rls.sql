-- Drop existing policies if they exist
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can create own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;

-- Drop existing trigger and function if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Enable RLS
alter table profiles enable row level security;

-- Create policies with proper UUID handling
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = user_id::uuid);

create policy "Users can create own profile"
  on profiles for insert
  with check (auth.uid() = user_id::uuid);

create policy "Users can update own profile"
  on profiles for update using (
    auth.uid() = user_id::uuid
  );

-- Default profile trigger
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, user_id)
  values (new.id, new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
