create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'),
  display_name text not null default '',
  bio text not null default '',
  avatar_url text not null default '',
  website_url text not null default '',
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.series (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null,
  title text not null,
  description text not null default '',
  category text not null references public.categories (name) on update cascade,
  color_theme text not null default 'bg-card',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (author_id, slug)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  series_id uuid references public.series (id) on delete set null,
  series_order integer check (series_order is null or series_order > 0),
  slug text not null,
  title text not null,
  content text not null default '',
  excerpt text not null default '',
  category text references public.categories (name) on update cascade,
  published boolean not null default false,
  character_count integer not null default 0 check (character_count >= 0),
  shadow_title text,
  shadow_content text,
  shadow_updated_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (author_id, slug)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(name) <= 13 and name ~ '^[a-z0-9-]+$'),
  created_at timestamptz not null default now()
);

create table public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

create index idx_series_slug on public.series (slug);
create index idx_series_author_id on public.series (author_id);

create index idx_posts_author_id on public.posts (author_id);
create index idx_posts_series_id on public.posts (series_id);
create index idx_posts_slug on public.posts (slug);
create index idx_posts_published on public.posts (published);
create index idx_posts_published_at on public.posts (published_at desc);
create index idx_posts_shadow_updated_at on public.posts (shadow_updated_at)
where shadow_updated_at is not null;

create index idx_post_tags_tag_id on public.post_tags (tag_id);

insert into public.categories (name)
values
  ('API'),
  ('DOCS'),
  ('LIB'),
  ('TOOL'),
  ('DEV'),
  ('CLOUD'),
  ('DATA')
on conflict (name) do nothing;

create or replace function public.normalize_profile_username(raw_value text, user_id uuid)
returns text
language plpgsql
set search_path = public
as $$
declare
  candidate text;
  suffix text := left(replace(user_id::text, '-', ''), 8);
begin
  candidate := lower(coalesce(raw_value, ''));
  candidate := regexp_replace(candidate, '[^a-z0-9-]+', '-', 'g');
  candidate := regexp_replace(candidate, '(^-+|-+$)', '', 'g');

  if candidate = '' then
    candidate := 'user';
  end if;

  if length(candidate) < 3 then
    candidate := candidate || suffix;
  end if;

  candidate := left(candidate, 30);
  candidate := regexp_replace(candidate, '(^-+|-+$)', '', 'g');

  if candidate !~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$' then
    candidate := 'user-' || suffix;
  end if;

  return candidate;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  base_username text;
  username_candidate text;
  display_name_value text;
  avatar_url_value text;
  username_suffix text := left(replace(new.id::text, '-', ''), 8);
begin
  base_username := coalesce(
    nullif(metadata ->> 'preferred_username', ''),
    nullif(metadata ->> 'user_name', ''),
    nullif(metadata ->> 'username', ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'user'
  );

  username_candidate := public.normalize_profile_username(base_username, new.id);
  display_name_value := coalesce(
    nullif(metadata ->> 'full_name', ''),
    nullif(metadata ->> 'name', ''),
    ''
  );
  avatar_url_value := coalesce(
    nullif(metadata ->> 'avatar_url', ''),
    nullif(metadata ->> 'picture', ''),
    ''
  );

  begin
    insert into public.profiles (id, username, display_name, avatar_url)
    values (new.id, username_candidate, display_name_value, avatar_url_value);
  exception
    when unique_violation then
      insert into public.profiles (id, username, display_name, avatar_url)
      values (
        new.id,
        public.normalize_profile_username(left(username_candidate, 21) || '-' || username_suffix, new.id),
        display_name_value,
        avatar_url_value
      )
      on conflict (id) do nothing;
  end;

  return new;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create trigger posts_updated_at
  before update on public.posts
  for each row execute procedure public.set_updated_at();

create trigger series_updated_at
  before update on public.series
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.series enable row level security;
alter table public.posts enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;

create policy "Profiles are viewable by everyone"
on public.profiles
for select
using (true);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Categories are viewable by everyone"
on public.categories
for select
using (true);

create policy "Authenticated users can insert categories"
on public.categories
for insert
to authenticated
with check (true);

create policy "Series are viewable by everyone"
on public.series
for select
using (true);

create policy "Users can insert their own series"
on public.series
for insert
to authenticated
with check (auth.uid() = author_id);

create policy "Users can update their own series"
on public.series
for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "Users can delete their own series"
on public.series
for delete
to authenticated
using (auth.uid() = author_id);

create policy "Published posts are public and authors can view their drafts"
on public.posts
for select
using (published or auth.uid() = author_id);

create policy "Users can insert their own posts"
on public.posts
for insert
to authenticated
with check (auth.uid() = author_id);

create policy "Users can update their own posts"
on public.posts
for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "Users can delete their own posts"
on public.posts
for delete
to authenticated
using (auth.uid() = author_id);

create policy "Tags are viewable by everyone"
on public.tags
for select
using (true);

create policy "Authenticated users can insert tags"
on public.tags
for insert
to authenticated
with check (true);

create policy "Post tags are viewable by everyone"
on public.post_tags
for select
using (true);

create policy "Authors can insert tags for their own posts"
on public.post_tags
for insert
to authenticated
with check (
  exists (
    select 1
    from public.posts
    where posts.id = post_tags.post_id
      and posts.author_id = auth.uid()
  )
);

create policy "Authors can delete tags from their own posts"
on public.post_tags
for delete
to authenticated
using (
  exists (
    select 1
    from public.posts
    where posts.id = post_tags.post_id
      and posts.author_id = auth.uid()
  )
);
