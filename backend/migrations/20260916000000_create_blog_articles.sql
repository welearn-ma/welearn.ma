-- Blog articles, backing the Supabase-sourced blog on welearn.ma.
-- Run in the Supabase SQL editor for the welearn.ma project.

begin;

create table if not exists public.blog_articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text,
  category      text,
  content       text not null,          -- full article body, Markdown
  cover_image   text,                   -- path relative to /public, e.g. /blogs/article-01.../cover.png
  published     boolean not null default true,
  published_at  date not null,          -- editorial date shown on the site (original publish date)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists blog_articles_published_at_idx
  on public.blog_articles (published_at desc);

create index if not exists blog_articles_category_idx
  on public.blog_articles (category);

-- Keep updated_at current on every edit
create or replace function public.set_blog_articles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_blog_articles_updated_at on public.blog_articles;
create trigger trg_blog_articles_updated_at
  before update on public.blog_articles
  for each row execute function public.set_blog_articles_updated_at();

-- RLS: public (anon) can only ever read published rows.
-- No insert/update/delete policy is created for anon/authenticated —
-- writes go through the service_role key only (seed script, future admin panel).
alter table public.blog_articles enable row level security;

drop policy if exists "Public can read published blog articles" on public.blog_articles;
create policy "Public can read published blog articles"
  on public.blog_articles
  for select
  using (published = true);

commit;

notify pgrst, 'reload schema';
