-- =====================================================================
-- CCI Country Audit — схема базы (Supabase, проект vittttttttto-777's Project)
-- Все объекты с приставкой ca_. Существующие таблицы не затрагиваются.
-- Клиент не имеет прямого доступа к таблицам: только через функции ca_*,
-- которые проверяют токен сессии. Каждый руководитель видит только свои строки.
-- =====================================================================

create table if not exists public.ca_users (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  pass_hash text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.ca_users is 'Аудит стран: руководители дивизионов (вход только по паролю, bcrypt-хеш)';

create table if not exists public.ca_sessions (
  token text primary key,
  user_id uuid not null references public.ca_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days'
);
create index if not exists ca_sessions_user_id_idx on public.ca_sessions(user_id);

create table if not exists public.ca_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.ca_users(id) on delete cascade,
  country text not null,
  country_key text generated always as (lower(btrim(country))) stored,
  stage int not null default 1 check (stage between 1 and 6),
  define_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, country_key)
);
comment on table public.ca_audits is 'Аудит стран: страна руководителя и текущая стадия (1–6)';

create table if not exists public.ca_items (
  audit_id uuid not null references public.ca_audits(id) on delete cascade,
  user_id uuid not null references public.ca_users(id) on delete cascade,
  country text not null,
  phase int not null check (phase between 1 and 6),
  section text not null check (section in ('build','leader')),
  item_idx int not null,
  item_text text,
  status text check (status in ('yes','no')),
  comment text,
  updated_at timestamptz not null default now(),
  primary key (audit_id, phase, section, item_idx)
);
create index if not exists ca_items_user_id_idx on public.ca_items(user_id);
comment on table public.ca_items is 'Аудит стран: ответы по строкам чек-листа (yes = есть, no = нет) и комментарии';

alter table public.ca_users    enable row level security;
alter table public.ca_sessions enable row level security;
alter table public.ca_audits   enable row level security;
alter table public.ca_items    enable row level security;
revoke all on public.ca_users, public.ca_sessions, public.ca_audits, public.ca_items from anon, authenticated;

-- ---------- helpers ----------
create or replace function public.ca_require(p_token text, p_admin boolean default false)
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v uuid; a boolean;
begin
  select s.user_id, u.is_admin into v, a from ca_sessions s join ca_users u on u.id = s.user_id
   where s.token = p_token and s.expires_at > now();
  if v is null then raise exception 'AUTH' using errcode = '28000'; end if;
  if p_admin and not a then raise exception 'FORBIDDEN' using errcode = '42501'; end if;
  return v;
end $$;
revoke all on function public.ca_require(text, boolean) from public, anon, authenticated;

-- ---------- auth ----------
create or replace function public.ca_login(p_password text)
returns json language plpgsql volatile security definer set search_path = public, extensions as $$
declare u record; tok text;
begin
  if coalesce(length(p_password),0) < 4 then perform pg_sleep(0.4); return null; end if;
  select * into u from ca_users where pass_hash = crypt(p_password, pass_hash) limit 1;
  if u.id is null then perform pg_sleep(0.6); return null; end if;
  tok := encode(gen_random_bytes(32), 'hex');
  insert into ca_sessions(token, user_id) values (tok, u.id);
  delete from ca_sessions where expires_at < now();
  return json_build_object('token', tok, 'label', u.label, 'is_admin', u.is_admin);
end $$;

create or replace function public.ca_me(p_token text)
returns json language sql stable security definer set search_path = public as $$
  select json_build_object('label', u.label, 'is_admin', u.is_admin)
  from ca_sessions s join ca_users u on u.id = s.user_id
  where s.token = p_token and s.expires_at > now();
$$;

create or replace function public.ca_logout(p_token text)
returns void language sql volatile security definer set search_path = public as $$
  delete from ca_sessions where token = p_token;
$$;

-- ---------- countries & checklist ----------
create or replace function public.ca_list_countries(p_token text)
returns json language plpgsql stable security definer set search_path = public as $$
declare v uuid := ca_require(p_token);
begin
  return coalesce((select json_agg(r order by r.updated_at desc) from (
    select a.id, a.country, a.stage, a.updated_at,
      (select count(*) from ca_items i where i.audit_id = a.id and i.phase <= a.stage and i.status = 'yes') as yes,
      (select count(*) from ca_items i where i.audit_id = a.id and i.phase <= a.stage and i.status = 'no')  as no
    from ca_audits a where a.user_id = v) r), '[]'::json);
end $$;

create or replace function public.ca_open_country(p_token text, p_country text)
returns json language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token); a ca_audits;
begin
  if coalesce(btrim(p_country),'') = '' then raise exception 'EMPTY_COUNTRY'; end if;
  select * into a from ca_audits where user_id = v and country_key = lower(btrim(p_country));
  if a.id is null then
    insert into ca_audits(user_id, country) values (v, btrim(p_country)) returning * into a;
  end if;
  return json_build_object(
    'id', a.id, 'country', a.country, 'stage', a.stage, 'define_text', a.define_text,
    'items', coalesce((select json_agg(json_build_object('phase', phase, 'section', section, 'idx', item_idx,
                         'status', status, 'comment', comment)) from ca_items where audit_id = a.id), '[]'::json));
end $$;

create or replace function public.ca_set_stage(p_token text, p_audit uuid, p_stage int)
returns void language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token);
begin
  update ca_audits set stage = p_stage, updated_at = now() where id = p_audit and user_id = v;
  if not found then raise exception 'NOT_FOUND'; end if;
end $$;

create or replace function public.ca_set_define(p_token text, p_audit uuid, p_text text)
returns void language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token);
begin
  update ca_audits set define_text = p_text, updated_at = now() where id = p_audit and user_id = v;
  if not found then raise exception 'NOT_FOUND'; end if;
end $$;

create or replace function public.ca_save_item(p_token text, p_audit uuid, p_phase int, p_section text,
  p_idx int, p_text text, p_status text, p_comment text)
returns void language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token); c text;
begin
  select country into c from ca_audits where id = p_audit and user_id = v;
  if c is null then raise exception 'NOT_FOUND'; end if;
  if p_status is null and coalesce(btrim(p_comment),'') = '' then
    delete from ca_items where audit_id = p_audit and phase = p_phase and section = p_section and item_idx = p_idx;
  else
    insert into ca_items(audit_id, user_id, country, phase, section, item_idx, item_text, status, comment, updated_at)
    values (p_audit, v, c, p_phase, p_section, p_idx, p_text, p_status, nullif(btrim(p_comment),''), now())
    on conflict (audit_id, phase, section, item_idx) do update
      set item_text = excluded.item_text, status = excluded.status, comment = excluded.comment, updated_at = now();
  end if;
  update ca_audits set updated_at = now() where id = p_audit;
end $$;

create or replace function public.ca_rename_country(p_token text, p_audit uuid, p_country text)
returns void language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token);
begin
  if coalesce(btrim(p_country),'') = '' then raise exception 'EMPTY_COUNTRY'; end if;
  update ca_audits set country = btrim(p_country), updated_at = now() where id = p_audit and user_id = v;
  update ca_items  set country = btrim(p_country) where audit_id = p_audit and user_id = v;
end $$;

create or replace function public.ca_delete_country(p_token text, p_audit uuid)
returns void language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token);
begin
  delete from ca_audits where id = p_audit and user_id = v;
end $$;

-- ---------- admin ----------
create or replace function public.ca_admin_users(p_token text)
returns json language plpgsql stable security definer set search_path = public as $$
declare v uuid := ca_require(p_token, true);
begin
  return coalesce((select json_agg(json_build_object('id', u.id, 'label', u.label, 'is_admin', u.is_admin,
     'countries', (select count(*) from ca_audits a where a.user_id = u.id)) order by u.is_admin desc, u.label)
     from ca_users u), '[]'::json);
end $$;

create or replace function public.ca_admin_save_user(p_token text, p_id uuid, p_label text, p_password text, p_is_admin boolean)
returns uuid language plpgsql volatile security definer set search_path = public, extensions as $$
declare v uuid := ca_require(p_token, true); nid uuid;
begin
  if coalesce(btrim(p_label),'') = '' then raise exception 'EMPTY_NAME'; end if;
  if p_password is not null and length(p_password) < 6 then raise exception 'SHORT_PASSWORD'; end if;
  if p_password is not null and exists (select 1 from ca_users where pass_hash = crypt(p_password, pass_hash)
       and (p_id is null or id <> p_id)) then
    raise exception 'PASSWORD_TAKEN';
  end if;
  if p_id is null then
    if p_password is null then raise exception 'SHORT_PASSWORD'; end if;
    insert into ca_users(label, pass_hash, is_admin)
      values (btrim(p_label), crypt(p_password, gen_salt('bf', 10)), coalesce(p_is_admin,false))
      returning id into nid;
    return nid;
  end if;
  if p_id = v and not coalesce(p_is_admin, true) then raise exception 'SELF_DEMOTE'; end if;
  update ca_users set label = btrim(p_label), is_admin = coalesce(p_is_admin, is_admin),
     pass_hash = case when p_password is null then pass_hash else crypt(p_password, gen_salt('bf', 10)) end,
     updated_at = now() where id = p_id;
  if p_password is not null then delete from ca_sessions where user_id = p_id and token <> p_token; end if;
  return p_id;
end $$;

create or replace function public.ca_admin_delete_user(p_token text, p_id uuid)
returns void language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token, true);
begin
  if p_id = v then raise exception 'SELF_DELETE'; end if;
  delete from ca_users where id = p_id;
end $$;

create or replace function public.ca_admin_overview(p_token text)
returns json language plpgsql stable security definer set search_path = public as $$
declare v uuid := ca_require(p_token, true);
begin
  return coalesce((select json_agg(r order by r.label, r.country) from (
    select a.id, u.label, a.country, a.stage, a.updated_at, a.define_text,
      (select count(*) from ca_items i where i.audit_id = a.id and i.phase <= a.stage and i.status = 'yes') as yes,
      (select count(*) from ca_items i where i.audit_id = a.id and i.phase <= a.stage and i.status = 'no')  as no
    from ca_audits a join ca_users u on u.id = a.user_id) r), '[]'::json);
end $$;

create or replace function public.ca_admin_audit(p_token text, p_audit uuid)
returns json language plpgsql stable security definer set search_path = public as $$
declare v uuid := ca_require(p_token, true); a ca_audits;
begin
  select * into a from ca_audits where id = p_audit;
  if a.id is null then raise exception 'NOT_FOUND'; end if;
  return json_build_object(
    'id', a.id, 'country', a.country, 'stage', a.stage, 'define_text', a.define_text,
    'owner', (select label from ca_users where id = a.user_id),
    'items', coalesce((select json_agg(json_build_object('phase', phase, 'section', section, 'idx', item_idx,
                         'status', status, 'comment', comment)) from ca_items where audit_id = a.id), '[]'::json));
end $$;

-- ---------- grants: only the public RPCs are callable from the site ----------
do $$
declare f text;
begin
  foreach f in array array[
    'ca_login(text)','ca_me(text)','ca_logout(text)','ca_list_countries(text)','ca_open_country(text,text)',
    'ca_set_stage(text,uuid,int)','ca_set_define(text,uuid,text)',
    'ca_save_item(text,uuid,int,text,int,text,text,text)','ca_rename_country(text,uuid,text)',
    'ca_delete_country(text,uuid)','ca_admin_users(text)','ca_admin_save_user(text,uuid,text,text,boolean)',
    'ca_admin_delete_user(text,uuid)','ca_admin_overview(text)','ca_admin_audit(text,uuid)']
  loop
    execute format('revoke all on function public.%s from public', f);
    execute format('grant execute on function public.%s to anon, authenticated', f);
  end loop;
end $$;
