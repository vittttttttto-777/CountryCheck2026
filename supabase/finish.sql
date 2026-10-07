-- =====================================================================
-- CCI Country Audit: завершающий шаг установки.
-- Supabase → SQL Editor → вставить весь файл → Run.
-- Создаёт 5 функций, внутри которых есть удаление строк: вход (чистит
-- просроченные сессии), сохранение строки чек-листа, удаление страны,
-- заведение и удаление руководителя. Повторный запуск безопасен.
-- =====================================================================

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

create or replace function public.ca_delete_country(p_token text, p_audit uuid)
returns void language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token);
begin
  delete from ca_audits where id = p_audit and user_id = v;
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

do $$
declare f text;
begin
  foreach f in array array[
    'ca_login(text)','ca_save_item(text,uuid,int,text,int,text,text,text)','ca_delete_country(text,uuid)',
    'ca_admin_save_user(text,uuid,text,text,boolean)','ca_admin_delete_user(text,uuid)']
  loop
    execute format('revoke all on function public.%s from public', f);
    execute format('grant execute on function public.%s to anon, authenticated', f);
  end loop;
end $$;

select 'Готово: CCI Country Audit установлен' as result;
