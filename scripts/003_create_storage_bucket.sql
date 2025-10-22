-- Added DROP POLICY IF EXISTS statements to make script idempotent

-- Create storage bucket for PDFs
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', true)
on conflict (id) do nothing;

-- Drop existing policies first
drop policy if exists "Users can upload their own PDFs" on storage.objects;
drop policy if exists "Users can view their own PDFs" on storage.objects;
drop policy if exists "Users can delete their own PDFs" on storage.objects;
drop policy if exists "Public can view PDFs" on storage.objects;

-- Set up storage policies
create policy "Users can upload their own PDFs"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'pdfs' and
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view their own PDFs"
on storage.objects for select
to authenticated
using (
  bucket_id = 'pdfs' and
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own PDFs"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'pdfs' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to PDFs (for viewing in iframe)
create policy "Public can view PDFs"
on storage.objects for select
to public
using (bucket_id = 'pdfs');
