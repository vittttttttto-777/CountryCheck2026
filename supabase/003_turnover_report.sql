-- CCI Country Audit — шаг 3: товарооборот страны и сводная таблица для администратора.
-- В проекте уже применено; файл — для воспроизведения установки с нуля (после 002_finish_audit.sql).

alter table public.ca_audits add column if not exists turnover numeric(14,2) check (turnover is null or turnover >= 0);
comment on column public.ca_audits.turnover is 'Товарооборот страны, € в месяц (вводит руководитель)';

create or replace function public.ca_set_turnover(p_token text, p_audit uuid, p_value numeric)
returns void language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token);
begin
  if p_value is not null and p_value < 0 then raise exception 'BAD_TURNOVER'; end if;
  update ca_audits set turnover = p_value, updated_at = now() where id = p_audit and user_id = v;
  if not found then raise exception 'NOT_FOUND'; end if;
end $$;

create or replace function public.ca_list_countries(p_token text)
returns json language plpgsql stable security definer set search_path = public as $$
declare v uuid := ca_require(p_token);
begin
  return coalesce((select json_agg(r order by r.updated_at desc) from (
    select a.id, a.country, a.stage, a.turnover, a.updated_at, a.completed_at,
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
    'id', a.id, 'country', a.country, 'stage', a.stage, 'turnover', a.turnover, 'define_text', a.define_text, 'completed_at', a.completed_at,
    'items', coalesce((select json_agg(json_build_object('phase', phase, 'section', section, 'idx', item_idx,
                         'status', status, 'comment', comment)) from ca_items where audit_id = a.id), '[]'::json));
end $$;

create or replace function public.ca_admin_overview(p_token text)
returns json language plpgsql stable security definer set search_path = public as $$
declare v uuid := ca_require(p_token, true);
begin
  return coalesce((select json_agg(r order by r.label, r.country) from (
    select a.id, u.label, a.country, a.stage, a.turnover, a.updated_at, a.completed_at, a.define_text,
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
    'id', a.id, 'country', a.country, 'stage', a.stage, 'turnover', a.turnover, 'define_text', a.define_text, 'completed_at', a.completed_at,
    'owner', (select label from ca_users where id = a.user_id),
    'items', coalesce((select json_agg(json_build_object('phase', phase, 'section', section, 'idx', item_idx,
                         'status', status, 'comment', comment)) from ca_items where audit_id = a.id), '[]'::json));
end $$;

create or replace function public.ca_admin_report(p_token text)
returns json language plpgsql stable security definer set search_path = public as $$
declare v uuid := ca_require(p_token, true);
begin
  return coalesce((select json_agg(r order by r.country, r.label) from (
    select a.id, u.label, a.country, a.stage, a.turnover, a.completed_at, a.updated_at,
      coalesce((select json_agg(json_build_object('phase', i.phase, 'section', i.section, 'idx', i.item_idx,
                  'text', i.item_text, 'status', i.status, 'comment', i.comment)
                  order by i.phase, i.section, i.item_idx)
         from ca_items i where i.audit_id = a.id and i.phase <= a.stage), '[]'::json) as items
    from ca_audits a join ca_users u on u.id = a.user_id) r), '[]'::json);
end $$;

revoke all on function public.ca_set_turnover(text, uuid, numeric) from public;
grant execute on function public.ca_set_turnover(text, uuid, numeric) to anon, authenticated;
revoke all on function public.ca_admin_report(text) from public;
grant execute on function public.ca_admin_report(text) to anon, authenticated;
