-- =====================================================================
-- CCI Country Audit — шаг 5: администратор удаляет страны (вместе со всеми ответами).
-- Supabase → SQL Editor → вставить весь файл → Run. Повторный запуск безопасен.
-- Функция удаляет только по списку id, только для сессии администратора.
-- Ответы по чек-листу (ca_items) удаляются каскадом вместе со страной.
-- =====================================================================

create or replace function public.ca_admin_delete_audits(p_token text, p_ids uuid[])
returns int language plpgsql volatile security definer set search_path = public as $$
declare v uuid := ca_require(p_token, true); n int;
begin
  if p_ids is null or cardinality(p_ids) = 0 then return 0; end if;
  delete from ca_audits where id = any(p_ids);
  get diagnostics n = row_count;
  return n;
end $$;

comment on function public.ca_admin_delete_audits(text, uuid[]) is
  'Аудит стран: администратор удаляет страны (со всеми ответами) по списку id';
revoke all on function public.ca_admin_delete_audits(text, uuid[]) from public;
grant execute on function public.ca_admin_delete_audits(text, uuid[]) to anon, authenticated;

select 'Готово: удаление для администратора включено' as result;
