-- Create annotations table for PDF markup
create table if not exists public.annotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pdf_id uuid not null references public.pdf_files(id) on delete cascade,
  page_number integer not null,
  type text not null check (type in ('highlight', 'underline', 'note')),
  color text not null default '#FFFF00',
  text_content text,
  note_content text,
  position jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.annotations enable row level security;

create policy "annotations_select_own"
  on public.annotations for select
  using (auth.uid() = user_id);

create policy "annotations_insert_own"
  on public.annotations for insert
  with check (auth.uid() = user_id);

create policy "annotations_update_own"
  on public.annotations for update
  using (auth.uid() = user_id);

create policy "annotations_delete_own"
  on public.annotations for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists annotations_pdf_page_idx on public.annotations(pdf_id, page_number);
