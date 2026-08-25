create table public.anniversary_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  sender_name text not null,
  partner_name text not null,
  anniversary_date date not null,
  title text not null default 'Happy Anniversary',
  subtitle text not null default 'A little story about us',
  story text not null default 'It all started with you.',
  closing text not null default 'Here is to every beautiful day still waiting for us.',
  photo_urls text[] not null default '{}',
  content jsonb not null default '{}'::jsonb,
  password_hash text not null default '',
  created_at timestamptz not null default now()
);

alter table public.anniversary_pages
  add column if not exists password_hash text not null default '';

alter table public.anniversary_pages enable row level security;
drop policy if exists "Anyone can view anniversary pages" on public.anniversary_pages;
create policy "Anyone can create an anniversary page"
  on public.anniversary_pages for insert with check (true);

create or replace function public.unlock_anniversary_page(page_slug text, provided_hash text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select content from public.anniversary_pages
  where slug = page_slug and ((password_hash = '' and provided_hash = '') or password_hash = provided_hash);
$$;

grant execute on function public.unlock_anniversary_page(text, text) to anon, authenticated;

create or replace function public.edit_anniversary_page(page_slug text)
returns jsonb
language sql
security definer
set search_path = public
as $$ select content from public.anniversary_pages where slug = page_slug; $$;

create or replace function public.save_anniversary_page(page_slug text, next_content jsonb, next_password_hash text)
returns boolean
language sql
security definer
set search_path = public
as $$
  update public.anniversary_pages
  set content = next_content, password_hash = next_password_hash
  where slug = page_slug;
  select found;
$$;

grant execute on function public.edit_anniversary_page(text) to anon, authenticated;
grant execute on function public.save_anniversary_page(text, jsonb, text) to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('anniversary-photos', 'anniversary-photos', true)
on conflict (id) do nothing;

create policy "Anyone can upload anniversary photos"
  on storage.objects for insert
  with check (bucket_id = 'anniversary-photos');
create policy "Anyone can view anniversary photos"
  on storage.objects for select
  using (bucket_id = 'anniversary-photos');