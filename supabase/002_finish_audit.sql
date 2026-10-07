-- CCI Country Audit — шаг 2: кнопка «Завершить аудит страны» и предел 30 стран на руководителя.
-- В проекте уже применено; файл — для воспроизведения установки с нуля (после schema.sql и finish.sql).

alter table public.ca_audits add column if not exists completed_at timestamptz;
comment on column public.ca_audits.completed_at is 'Когда руководитель нажал «Завершить аудит страны» (последний раз)';

create or replace function public.ca_finish_audit(p_token text, p_audit uuid)
returns json language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token); a ca_audits;
begin
  update ca_audits set completed_at = now(), updated_at = now() where id = p_audit and user_id = v returning * into a;
  if a.id is null then raise exception 'NOT_FOUND'; end if;
  return json_build_object('id', a.id, 'country', a.country, 'stage', a.stage, 'completed_at', a.completed_at,
    'yes', (select count(*) from ca_items i where i.audit_id = a.id and i.phase <= a.stage and i.status = 'yes'),
    'no',  (select count(*) from ca_items i where i.audit_id = a.id and i.phase <= a.stage and i.status = 'no'));
end $$;

create or replace function public.ca_list_countries(p_token text)
returns json language plpgsql stable security definer set search_path = public as $$
declare v uuid := ca_require(p_token);
begin
  return coalesce((select json_agg(r order by r.updated_at desc) from (
    select a.id, a.country, a.stage, a.updated_at, a.completed_at,
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
    if (select count(*) from ca_audits where user_id = v) >= 30 then raise exception 'LIMIT_30'; end if;
    insert into ca_audits(user_id, country) values (v, btrim(p_country)) returning * into a;
  end if;
  return json_build_object(
    'id', a.id, 'country', a.country, 'stage', a.stage, 'define_text', a.define_text, 'completed_at', a.completed_at,
    'items', coalesce((select json_agg(json_build_object('phase', phase, 'section', section, 'idx', item_idx,
                         'status', status, 'comment', comment)) from ca_items where audit_id = a.id), '[]'::json));
end $$;

create or replace function public.ca_admin_overview(p_token text)
returns json language plpgsql stable security definer set search_path = public as $$
declare v uuid := ca_require(p_token, true);
begin
  return coalesce((select json_agg(r order by r.label, r.country) from (
    select a.id, u.label, a.country, a.stage, a.updated_at, a.completed_at, a.define_text,
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
    'id', a.id, 'country', a.country, 'stage', a.stage, 'define_text', a.define_text, 'completed_at', a.completed_at,
    'owner', (select label from ca_users where id = a.user_id),
    'items', coalesce((select json_agg(json_build_object('phase', phase, 'section', section, 'idx', item_idx,
                         'status', status, 'comment', comment)) from ca_items where audit_id = a.id), '[]'::json));
end $$;

revoke all on function public.ca_finish_audit(text, uuid) from public;
grant execute on function public.ca_finish_audit(text, uuid) to anon, authenticated;
