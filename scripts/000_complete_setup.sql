-- Complete Database Setup Script
-- Run this single script to set up everything

-- ============================================
-- STEP 1: Clean up existing objects
-- ============================================

-- Drop existing policies
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "pdf_files_select_own" on public.pdf_files;
drop policy if exists "pdf_files_insert_own" on public.pdf_files;
drop policy if exists "pdf_files_delete_own" on public.pdf_files;
drop policy if exists "messages_select_own" on public.messages;
drop policy if exists "messages_insert_own" on public.messages;
drop policy if exists "messages_delete_own" on public.messages;

-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Drop existing tables (CASCADE will handle foreign keys)
drop table if exists public.messages cascade;
drop table if exists public.pdf_files cascade;
drop table if exists public.profiles cascade;

-- ============================================
-- STEP 2: Create tables
-- ============================================

-- Create profiles table (extends auth.users)
create table public.profiles (
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
create table public.pdf_files (
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
create table public.messages (
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

-- ============================================
-- STEP 3: Create profile trigger
-- ============================================

-- Function to create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- STEP 4: Create storage bucket
-- ============================================

-- Create storage bucket for PDFs
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', false)
on conflict (id) do nothing;

-- Storage policies for PDFs
drop policy if exists "pdf_upload_own" on storage.objects;
drop policy if exists "pdf_select_own" on storage.objects;
drop policy if exists "pdf_delete_own" on storage.objects;

create policy "pdf_upload_own"
  on storage.objects for insert
  with check (
    bucket_id = 'pdfs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "pdf_select_own"
  on storage.objects for select
  using (
    bucket_id = 'pdfs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "pdf_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'pdfs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
