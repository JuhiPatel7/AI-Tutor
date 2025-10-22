-- Added DROP POLICY IF EXISTS statements to make script idempotent

-- Drop existing policies first
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "pdf_files_select_own" on public.pdf_files;
drop policy if exists "pdf_files_insert_own" on public.pdf_files;
drop policy if exists "pdf_files_delete_own" on public.pdf_files;
drop policy if exists "messages_select_own" on public.messages;
drop policy if exists "messages_insert_own" on public.messages;
drop policy if exists "messages_delete_own" on public.messages;

-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Create pdf_files table
create table if not exists public.pdf_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  url text not null,
  text_content text not null,
  page_count integer default 1,
  created_at timestamp with time zone default now()
);

alter table public.pdf_files enable row level security;

create policy "pdf_files_select_own"
  on public.pdf_files for select
  using (auth.uid() = user_id);

create policy "pdf_files_insert_own"
  on public.pdf_files for insert
  with check (auth.uid() = user_id);

create policy "pdf_files_delete_own"
  on public.pdf_files for delete
  using (auth.uid() = user_id);

-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pdf_id uuid references public.pdf_files(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now()
);

alter table public.messages enable row level security;

create policy "messages_select_own"
  on public.messages for select
  using (auth.uid() = user_id);

create policy "messages_insert_own"
  on public.messages for insert
  with check (auth.uid() = user_id);

create policy "messages_delete_own"
  on public.messages for delete
  using (auth.uid() = user_id);
