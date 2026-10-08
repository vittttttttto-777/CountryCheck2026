/* CCI Country Audit — приложение на основе карты экспансии Coral Club (инструмент Кристиана) */
'use strict';

const CFG = window.CA_CONFIG;
const ROOT = document.getElementById('root');

/* ================= icons ================= */
const IC = {
  check:'<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
  x:'<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  build:'<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"/></svg>',
  ldr:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/></svg>',
  cmt:'<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  trash:'<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>',
  info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  dl:'<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  out:'<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  chev:'<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>',
  lock:'<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
};

/* ================= strings ================= */
const S = {
  appTitle:{ru:'Аудит <span>страны</span>',en:'Country <span>Audit</span>'},
  appTag:{ru:'Coral Club · Карта запуска страны',en:'Coral Club · Country Expansion Map'},
  loginEb:{ru:'Coral Club · Global Growth OS',en:'Coral Club · Global Growth OS'},
  loginH:{ru:'Аудит стран',en:'Country Audit'},
  loginSub:{ru:'Вход для руководителей дивизионов. Введите свой личный пароль.',en:'Sign-in for division heads. Enter your personal password.'},
  password:{ru:'Пароль',en:'Password'},
  signIn:{ru:'Войти',en:'Sign in'},
  badPass:{ru:'Неверный пароль',en:'Wrong password'},
  netErr:{ru:'Нет связи с сервером. Попробуйте ещё раз.',en:'Cannot reach the server. Please try again.'},
  hello:{ru:'Здравствуйте, {n}',en:'Hello, {n}'},
  pickSub:{ru:'Укажите страну, по которой проводите аудит.',en:'Enter the country you are auditing.'},
  country:{ru:'Страна',en:'Country'},
  countryPh:{ru:'Например: Польша',en:'e.g. Poland'},
  open:{ru:'Открыть',en:'Open'},
  pickHint:{ru:'Если страна уже есть в вашем списке, откроется она; иначе будет создана новая.',en:'If the country is already on your list it opens; otherwise a new one is created.'},
  myCountries:{ru:'Ваши страны',en:'Your countries'},
  noCountries:{ru:'Пока нет ни одной страны. Впишите название выше.',en:'No countries yet. Type a name above.'},
  stageN:{ru:'Стадия {n}',en:'Stage {n}'},
  answered:{ru:'{a} из {t} отмечено',en:'{a} of {t} answered'},
  delCountry:{ru:'Удалить страну «{c}» со всеми отметками и комментариями?',en:'Delete “{c}” with all answers and comments?'},
  logout:{ru:'Выйти',en:'Sign out'},
  admin:{ru:'Админ-панель',en:'Admin panel'},
  change:{ru:'сменить',en:'change'},
  saved:{ru:'Сохранено',en:'Saved'},
  saving:{ru:'Сохранение…',en:'Saving…'},
  saveFail:{ru:'Не сохранено — повторить',en:'Not saved — retry'},
  whereH:{ru:'На какой стадии сейчас страна?',en:'Which stage is the country at now?'},
  whereP:{ru:'Выберите текущую стадию. Все стадии до неё включительно проходятся по чек-листу: отметьте «Есть» или «Нет», а там, где нет — оставьте пояснение.',
          en:'Pick the current stage. Every stage up to and including it is audited: mark “Yes” or “No”, and explain every “No” in a comment.'},
  overall:{ru:'Аудит стадий 1–{n}',en:'Audit of stages 1–{n}'},
  current:{ru:'Сейчас',en:'Now'},
  ahead:{ru:'Впереди',en:'Ahead'},
  yes:{ru:'Есть',en:'Yes'},
  no:{ru:'Нет',en:'No'},
  open_:{ru:'не отм.',en:'open'},
  gaps:{ru:'Пробелы',en:'Gaps'},
  exportCsv:{ru:'Выгрузить CSV',en:'Export CSV'},
  mapFoot:{ru:'Число потребителей ориентировочное, при среднем чеке €130. Статус рынка — по активным потребителям: новый до 2 000, развивающийся 2 000–10 000, зрелый 10 000+.',
           en:'Consumer counts are indicative, at €130 average order value. Market status follows active consumers: New under 2,000, Developing 2,000–10,000, Mature 10,000+.'},
  back:{ru:'‹ Карта',en:'‹ Map'},
  prev:{ru:'‹ Предыдущая стадия',en:'‹ Previous stage'},
  next:{ru:'Следующая стадия ›',en:'Next stage ›'},
  aheadBanner:{ru:'Эта стадия впереди: страна до неё ещё не дошла. Отметки появятся, когда вы переключите текущую стадию на эту или более позднюю.',
               en:'This stage is ahead: the country has not reached it yet. Answers open once you switch the current stage to this one or later.'},
  roBanner:{ru:'Просмотр аудита руководителя «{o}». Только чтение.',en:'Viewing the audit of “{o}”. Read-only.'},
  top3:{ru:'Топ-3 для совета',en:'Top 3 for the board'},
  buildLabel:{ru:'Что вы строите',en:'What you build'},
  leaderLabel:{ru:'Как растёт сеть',en:'How the field grows'},
  whyExists:{ru:'Зачем нужен этот этап',en:'Why this phase exists'},
  cmtPh:{ru:'Почему нет? Что мешает, что планируется и к какому сроку…',en:'Why not? What blocks it, what is planned and by when…'},
  cmtPhYes:{ru:'Комментарий (необязательно)',en:'Comment (optional)'},
  needCmt:{ru:'Добавьте пояснение, почему этого нет',en:'Add an explanation of why this is missing'},
  addCmt:{ru:'Комментарий',en:'Comment'},
  gapsH:{ru:'Пробелы по стране',en:'Country gaps'},
  gapsP:{ru:'Всё, что отмечено «Нет» на стадиях 1–{n}, с пояснениями. Пункты без пояснения выделены.',en:'Everything marked “No” on stages 1–{n}, with explanations. Items without an explanation are flagged.'},
  noGaps:{ru:'Пробелов нет — всё, что отмечено, есть в наличии.',en:'No gaps — everything answered is in place.'},
  noCmt:{ru:'Пояснение не указано',en:'No explanation given'},
  unanswered:{ru:'Ещё не отмечено: {n}',en:'Not yet answered: {n}'},
  toMap:{ru:'К карте',en:'To the map'},
  mktNew:{ru:'Новый / стартап рынок',en:'New / Startup market'},
  mktDev:{ru:'Развивающийся рынок',en:'Developing market'},
  mktNewRange:{ru:'менее 2 000 активных потребителей',en:'under 2,000 active consumers'},
  mktDevRange:{ru:'2 000–10 000 потребителей',en:'2,000–10,000 consumers'},
  consumersLabel:{ru:'активных потребителей / мес',en:'active consumers / mo'},
  /* admin */
  adminH:{ru:'Админ-панель',en:'Admin panel'},
  tabOverview:{ru:'Сводка по странам',en:'Countries overview'},
  tabUsers:{ru:'Руководители',en:'Division heads'},
  colOwner:{ru:'Руководитель',en:'Division head'},
  colCountry:{ru:'Страна',en:'Country'},
  colStage:{ru:'Стадия',en:'Stage'},
  colUpd:{ru:'Обновлено',en:'Updated'},
  colName:{ru:'Имя',en:'Name'},
  colCountries:{ru:'Стран',en:'Countries'},
  view:{ru:'Открыть',en:'Open'},
  noAudits:{ru:'Пока никто не начал аудит.',en:'No audits yet.'},
  name:{ru:'Имя и фамилия',en:'Full name'},
  newPass:{ru:'Пароль (мин. 6 символов)',en:'Password (min. 6 chars)'},
  gen:{ru:'Сгенерировать',en:'Generate'},
  isAdmin:{ru:'Администратор',en:'Administrator'},
  addUser:{ru:'Добавить',en:'Add'},
  setPass:{ru:'Новый пароль',en:'New password'},
  del:{ru:'Удалить',en:'Delete'},
  delUser:{ru:'Удалить руководителя «{n}» вместе со всеми его странами и отметками?',en:'Delete “{n}” with all their countries and answers?'},
  passFor:{ru:'Пароль для «{n}»: {p} — передайте его лично. Он больше не будет показан.',en:'Password for “{n}”: {p} — hand it over personally. It will not be shown again.'},
  askPass:{ru:'Новый пароль для «{n}» (мин. 6 символов). Оставьте пустым, чтобы сгенерировать.',en:'New password for “{n}” (min. 6 chars). Leave empty to generate one.'},
  E_PASSWORD_TAKEN:{ru:'Такой пароль уже занят — придумайте другой.',en:'This password is already in use — choose another.'},
  E_SHORT_PASSWORD:{ru:'Пароль слишком короткий (минимум 6 символов).',en:'Password too short (min. 6 chars).'},
  E_EMPTY_NAME:{ru:'Укажите имя.',en:'Enter a name.'},
  E_SELF_DELETE:{ru:'Нельзя удалить самого себя.',en:'You cannot delete yourself.'},
  E_SELF_DEMOTE:{ru:'Нельзя снять права администратора с себя.',en:'You cannot remove your own admin rights.'},
  you:{ru:'это вы',en:'you'},
  adminBack:{ru:'‹ К стране',en:'‹ Back'},
  adminBackOv:{ru:'‹ Сводка',en:'‹ Overview'},
  finish:{ru:'Завершить аудит страны',en:'Complete country audit'},
  howTo:{ru:'Как это работает',en:'How it works'},
  finishShort:{ru:'Завершить аудит',en:'Complete audit'},
  aboutStage:{ru:'О стадии: зачем она, метрики, условие перехода',en:'About this stage: purpose, metrics, gate'},
  finishing:{ru:'Сохраняю…',en:'Saving…'},
  finishAsk:{ru:'Завершить аудит «{c}» и записать результат?',en:'Complete the audit of “{c}” and record the result?'},
  finishOpen:{ru:'• не отмечено строк: {n}',en:'• unanswered rows: {n}'},
  finishNoCmt:{ru:'• «Нет» без пояснения: {n}',en:'• “No” without explanation: {n}'},
  finishLater:{ru:'Их можно дополнить позже — страна останется в вашем списке.',en:'You can fill them in later — the country stays on your list.'},
  finishSaveFail:{ru:'Не все изменения сохранены. Проверьте связь и нажмите ещё раз.',en:'Some changes are not saved yet. Check the connection and try again.'},
  finishedBanner:{ru:'Аудит «{c}» завершён и записан: стадия {s}, ✓ {y} есть, ✗ {n} нет. Можно открыть следующую страну.',
                  en:'Audit of “{c}” completed and recorded: stage {s}, ✓ {y} yes, ✗ {n} no. You can open the next country.'},
  done:{ru:'Завершён {d}',en:'Completed {d}'},
  inWork:{ru:'В работе',en:'In progress'},
  countLimit:{ru:'{n} из {m}',en:'{n} of {m}'},
  limitReached:{ru:'Достигнут предел в {m} стран. Откройте страну из списка или удалите ненужную.',en:'Limit of {m} countries reached. Open one from the list or delete one you no longer need.'},
  E_LIMIT_30:{ru:'Достигнут предел в 30 стран.',en:'Limit of 30 countries reached.'},
  colStatus:{ru:'Статус',en:'Status'},
  selected:{ru:'Выбрано: {n}',en:'Selected: {n}'},
  delSelected:{ru:'Удалить выбранные',en:'Delete selected'},
  delAll:{ru:'Удалить все данные',en:'Delete all data'},
  selAll:{ru:'Выбрать все',en:'Select all'},
  delOneAsk:{ru:'Удалить страну «{c}» руководителя {o} вместе со всеми отметками и комментариями?\n\nЭто нельзя отменить.',
             en:'Delete “{c}” of {o} with all answers and comments?\n\nThis cannot be undone.'},
  delManyAsk:{ru:'Удалить выбранные страны ({n}) вместе со всеми отметками и комментариями?\n\nЭто нельзя отменить.',
              en:'Delete the selected countries ({n}) with all answers and comments?\n\nThis cannot be undone.'},
  delAllAsk:{ru:'Будут удалены ВСЕ страны всех руководителей ({n}) со всеми отметками и комментариями. Руководители и пароли останутся.\n\nЧтобы подтвердить, введите слово УДАЛИТЬ',
             en:'ALL countries of all division heads ({n}) will be deleted with every answer and comment. Division heads and passwords stay.\n\nTo confirm, type DELETE'},
  delAllWord:{ru:'УДАЛИТЬ',en:'DELETE'},
  deleted:{ru:'Удалено стран: {n}',en:'Countries deleted: {n}'},
  delNotInstalled:{ru:'Удаление ещё не включено в базе: выполните supabase/005_admin_delete.sql в Supabase → SQL Editor.',
                   en:'Deletion is not enabled in the database yet: run supabase/005_admin_delete.sql in Supabase → SQL Editor.'},
  auditGone:{ru:'Эту страну удалил администратор. Последние изменения не сохранены — откройте страну заново.',
             en:'This country was deleted by the administrator. Recent changes were not saved — open the country again.'},
  turnover:{ru:'Товарооборот, € / мес',en:'Turnover, € / month'},
  turnoverPh:{ru:'напр. 52 000',en:'e.g. 52,000'},
  colTurnover:{ru:'Товарооборот',en:'Turnover'},
  psLabel:{ru:'Число параллельных структур',en:'Parallel structures'},
  ddLabel:{ru:'Лидеры Diamond Director и выше',en:'Diamond Director+ leaders'},
  countPh:{ru:'напр. 4',en:'e.g. 4'},
  metricsHint:{ru:'* обязательно для завершения аудита',en:'* required to complete the audit'},
  fieldReq:{ru:'Заполните, чтобы завершить аудит',en:'Fill in to complete the audit'},
  badInt:{ru:'Только целое число от 0',en:'Whole number from 0 only'},
  badMoney:{ru:'Только число от 0',en:'Number from 0 only'},
  needMetrics:{ru:'Сначала заполните обязательные поля: {f}',en:'Fill in the required fields first: {f}'},
  metricsMissing:{ru:'показатели не заполнены',en:'metrics missing'},
  colPS:{ru:'Параллельных структур',en:'Parallel structures'},
  colDD:{ru:'Лидеров DD+',en:'DD+ leaders'},
  colDDFull:{ru:'Лидеры уровня Diamond Director и выше',en:'Leaders at Diamond Director level and above'},
  psShort:{ru:'{n} парал. структ.',en:'{n} parallel'},
  ddShort:{ru:'{n} DD+',en:'{n} DD+'},
  E_METRICS_REQUIRED:{ru:'Заполните товарооборот, число параллельных структур и лидеров Diamond Director и выше.',en:'Fill in turnover, parallel structures and Diamond Director+ leaders.'},
  E_BAD_VALUE:{ru:'Недопустимое значение.',en:'Invalid value.'},
  tabReport:{ru:'Сводная таблица',en:'Summary table'},
  reportP:{ru:'Все страны всех руководителей: товарооборот и ответы по чек-листу на стадиях до текущей включительно.',
           en:'All countries of all division heads: turnover and checklist answers for stages up to the current one.'},
  colYesItems:{ru:'Чек-лист: есть',en:'Checklist: yes'},
  colNoItems:{ru:'Чек-лист: нет',en:'Checklist: no'},
  colComments:{ru:'Комментарии',en:'Comments'},
  filterAll:{ru:'Все руководители',en:'All division heads'},
  search:{ru:'Поиск по стране…',en:'Search country…'},
  noRows:{ru:'Нет данных',en:'No data'},
  exportXls:{ru:'Выгрузить в Excel (CSV)',en:'Export to Excel (CSV)'},
  stShort:{ru:'С{n}',en:'S{n}'},
  repHead:{ru:['Страна','Руководитель','Стадия','Товарооборот, €/мес','Параллельных структур','Лидеров Diamond Director+','Статус','Есть, шт.','Нет, шт.','Не отмечено, шт.','Чек-лист: есть','Чек-лист: нет','Комментарии'],
           en:['Country','Division head','Stage','Turnover, €/mo','Parallel structures','Diamond Director+ leaders','Status','Yes, #','No, #','Open, #','Checklist: yes','Checklist: no','Comments']},
  csvHead:{ru:['Руководитель','Страна','Текущая стадия','Товарооборот, €/мес','Параллельных структур','Лидеров Diamond Director+','Стадия','Раздел','№','Пункт','Статус','Комментарий'],
           en:['Division head','Country','Current stage','Turnover, €/mo','Parallel structures','Diamond Director+ leaders','Stage','Section','#','Item','Status','Comment']},
};

/* ================= state ================= */
let LANG = lsGet('ca-lang') || 'ru';
let SESSION = (() => { try { return JSON.parse(lsGet('ca-session')); } catch (e) { return null; } })();
let AUDIT = null;        // {id,country,stage,define_text, owner?}
let ANS = {};            // key "phase|section|idx" -> {status, comment}
let READONLY = false;    // admin viewing someone else's audit
let VIEW = 'login';
let CUR_PHASE = 0;
let ADMIN_TAB = 'overview';
let LAST_FINISH = null;  // result of the last completed audit, shown on the country screen
const MAX_COUNTRIES = 30;

function lsGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
function lsSet(k,v){ try { v==null ? localStorage.removeItem(k) : localStorage.setItem(k,v); } catch(e){} }

function t(key, vars){
  const o = S[key]; let s = o ? (o[LANG] !== undefined ? o[LANG] : o.ru) : key;
  if (vars && typeof s === 'string') for (const k in vars) s = s.split('{'+k+'}').join(vars[k]);
  return s;
}
function L(obj){ if(!obj) return ''; return obj[LANG] !== undefined ? obj[LANG] : (obj.en !== undefined ? obj.en : ''); }
function esc(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function strip(html){ const d=document.createElement('div'); d.innerHTML=html; return d.textContent.trim(); }
function key(ph, sec, idx){ return ph+'|'+sec+'|'+idx; }
function fmtMoney(v){ if (v==null || v==='') return ''; const n=Number(v); return isFinite(n) ? n.toLocaleString(LANG==='ru'?'ru-RU':'en-GB',{maximumFractionDigits:2}) : ''; }
function itemText(phase, sec, idx, fallback){
  const p = PHASES[phase-1]; const arr = p && (sec==='build' ? L(p.build) : L(p.leader));
  return strip((arr && arr[idx]) || fallback || '');
}
function fmtDate(s){ try { return new Date(s).toLocaleString(LANG==='ru'?'ru-RU':'en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); } catch(e){ return ''; } }

/* ================= api ================= */
class ApiError extends Error {}
async function rpc(fn, args){
  let r;
  try {
    r = await fetch(`${CFG.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method:'POST',
      headers:{ apikey:CFG.SUPABASE_KEY, 'Content-Type':'application/json', Accept:'application/json' },
      body: JSON.stringify(args || {})
    });
  } catch(e){ throw new ApiError('NETWORK'); }
  const txt = await r.text();
  let data = null; try { data = txt ? JSON.parse(txt) : null; } catch(e){}
  if (!r.ok){
    const msg = (data && data.message) || r.statusText || 'ERROR';
    if (msg === 'AUTH'){ signOut(true); }
    throw new ApiError(msg);
  }
  return data;
}
function errText(e){
  const m = e && e.message;
  if (m === 'NETWORK') return t('netErr');
  if (S['E_'+m]) return t('E_'+m);
  return m || 'Error';
}

/* ================= toast ================= */
let tTimer;
function toast(msg){ const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(tTimer); tTimer=setTimeout(()=>el.classList.remove('show'),2600); }

/* ================= saving queue ================= */
const PENDING = new Map();   // key -> payload
const TIMERS = new Map();
let saveState = 'ok';        // ok | busy | fail
function setSaveState(s){
  saveState = s;
  const el = document.getElementById('saving'); if(!el) return;
  el.className = 'saving' + (s==='busy'?' busy':s==='fail'?' fail':'');
  el.innerHTML = `<i></i><span class="lbl">${s==='busy'?t('saving'):s==='fail'?t('saveFail'):t('saved')}</span>`;
}
function queueSave(k, payload, delay){
  PENDING.set(k, payload);
  clearTimeout(TIMERS.get(k));
  setSaveState('busy');
  TIMERS.set(k, setTimeout(flush, delay||0));
}
let flushing = false;
async function flush(){
  if (flushing) return; flushing = true;
  let failed = false, gone = false;
  try {
    while (PENDING.size){
      const [k, p] = PENDING.entries().next().value;
      PENDING.delete(k);
      try { await rpc(p.fn, p.args); }
      catch(e){
        if (e.message === 'NOT_FOUND'){ gone = true; break; }
        failed = true; if(!PENDING.has(k)) PENDING.set(k,p); break;
      }
    }
  } finally { flushing = false; }
  if (gone){ auditGone(); return; }
  setSaveState(failed ? 'fail' : (PENDING.size ? 'busy' : 'ok'));
  if (failed) toast(t('netErr'));
}
// the country was deleted (by the admin) while this person was filling it in
function auditGone(){
  TIMERS.forEach(tm => clearTimeout(tm)); TIMERS.clear(); PENDING.clear();
  saveState = 'ok';
  if (READONLY) return;
  AUDIT = null; ANS = {}; CUR_PHASE = 0; LAST_FINISH = null;
  alert(t('auditGone'));
  go('country');
}
async function flushAll(){
  TIMERS.forEach(tm => clearTimeout(tm)); TIMERS.clear();
  for (let i=0; i<50 && flushing; i++) await new Promise(r=>setTimeout(r,100));
  await flush();
  return PENDING.size === 0 && saveState !== 'fail';
}
window.addEventListener('beforeunload', e => { if (PENDING.size){ e.preventDefault(); e.returnValue=''; } });

/* ================= helpers on data ================= */
function phaseItems(i){
  const p = PHASES[i];
  const out = [];
  L(p.build).forEach((tx,k)=>out.push({sec:'build',idx:k,txt:tx,ru:p.build.ru[k]}));
  L(p.leader).forEach((tx,k)=>out.push({sec:'leader',idx:k,txt:tx,ru:p.leader.ru[k]}));
  return out;
}
function phaseTally(i){
  let y=0,n=0,miss=0; const items = phaseItems(i);
  items.forEach(it=>{ const a=ANS[key(i+1,it.sec,it.idx)]; if(a&&a.status==='yes')y++; else if(a&&a.status==='no'){n++; if(!a.comment)miss++;} });
  return {y,n,miss,total:items.length,open:items.length-y-n};
}
function totalItems(upTo){ let s=0; for(let i=0;i<upTo;i++) s+=phaseItems(i).length; return s; }
function overallTally(){
  let y=0,n=0,total=0;
  for(let i=0;i<AUDIT.stage;i++){ const tl=phaseTally(i); y+=tl.y; n+=tl.n; total+=tl.total; }
  return {y,n,total};
}
function stageShort(i){ return L(PHASES[i].short); }

/* ================= mobile ================= */
const MQ = window.matchMedia('(max-width:700px)');
function isMobile(){ return MQ.matches; }
MQ.addEventListener('change', () => {
  const ae = document.activeElement;
  if (ae && (ae.tagName==='TEXTAREA' || ae.tagName==='INPUT')) return; // don't kill typing (e.g. keyboard opening)
  if (SESSION && (VIEW==='phase')) render();
});

/* ================= routing ================= */
function go(view){ VIEW = view; render(); window.scrollTo(0,0); }
function render(){
  renderView();
  if (window.tourAfter) window.tourAfter();
}
function renderView(){
  if (!SESSION) return renderLogin();
  switch (VIEW){
    case 'country': return renderCountry();
    case 'map': return renderMap();
    case 'phase': return renderPhase();
    case 'gaps': return renderGaps();
    case 'admin': return renderAdmin();
    default: return renderCountry();
  }
}

/* ================= login ================= */
function langSwitch(){
  return `<div class="lang">${['ru','en'].map(l=>`<button data-lang="${l}" class="${l===LANG?'on':''}">${l.toUpperCase()}</button>`).join('')}</div>`;
}
function bindLang(){
  ROOT.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>{ LANG=b.dataset.lang; lsSet('ca-lang',LANG); document.documentElement.lang=LANG; render(); });
}
function renderLogin(){
  ROOT.innerHTML = `
  <div class="center"><div class="card login">
    <span class="drop"></span>
    <div class="eyebrow">${t('loginEb')}</div>
    <h1>${t('loginH')}</h1>
    <p class="sub">${t('loginSub')}</p>
    <form id="lf" autocomplete="on">
      <label class="field"><span>${t('password')}</span>
        <input class="input" type="password" id="pw" autocomplete="current-password" autofocus required></label>
      <button class="btn primary" type="submit" id="lb">${t('signIn')}</button>
      <div class="err" id="le"></div>
    </form>
    <div class="langrow">${langSwitch()}</div>
  </div></div>`;
  bindLang();
  const f = document.getElementById('lf');
  f.onsubmit = async e => {
    e.preventDefault();
    const pw = document.getElementById('pw').value, btn = document.getElementById('lb'), er = document.getElementById('le');
    btn.disabled = true; er.textContent = '';
    try {
      const r = await rpc('ca_login', {p_password: pw});
      if (!r){ er.textContent = t('badPass'); btn.disabled=false; document.getElementById('pw').select(); return; }
      SESSION = r; lsSet('ca-session', JSON.stringify(r));
      if (window.tourMaybeStart) window.tourMaybeStart();
      go('country');
    } catch(err){ er.textContent = errText(err); btn.disabled=false; }
  };
}
async function signOut(expired){
  const tok = SESSION && SESSION.token;
  SESSION = null; AUDIT = null; ANS = {}; lsSet('ca-session', null);
  if (tok && !expired) { try { await rpc('ca_logout',{p_token:tok}); } catch(e){} }
  VIEW = 'login'; render();
}

/* ================= country picker ================= */
async function renderCountry(){
  READONLY = false;
  ROOT.innerHTML = `
  <div class="center"><div class="card cpick">
    <div class="head">
      <span class="drop" style="margin-top:6px"></span>
      <div class="who">
        <div class="eyebrow">${t('loginH')}</div>
        <h1>${esc(t('hello',{n:SESSION.label}))}</h1>
        <p>${t('pickSub')}</p>
      </div>
      ${langSwitch()}
    </div>
    ${LAST_FINISH ? `<div class="finished">${IC.check}<span>${esc(t('finishedBanner',{c:LAST_FINISH.country,s:LAST_FINISH.stage,y:LAST_FINISH.yes,n:LAST_FINISH.no}))}</span></div>` : ''}
    <form id="cf">
      <input class="input" id="cin" placeholder="${esc(t('countryPh'))}" aria-label="${esc(t('country'))}" maxlength="80" autofocus required>
      <button class="btn primary" type="submit">${t('open')}</button>
    </form>
    <div class="hint" id="chint">${t('pickHint')}</div>
    <div class="clist-h" style="display:flex;justify-content:space-between"><span>${t('myCountries')}</span><span id="ccount"></span></div>
    <div class="clist" id="clist"><div class="empty">…</div></div>
    <div class="foot">
      <div style="display:flex;gap:8px;flex-wrap:wrap">${SESSION.is_admin?`<button class="btn" id="toAdmin">${t('admin')}</button>`:''}
        <button class="btn ghost tour-start">? ${t('howTo')}</button></div>
      <button class="btn ghost" id="lo">${t('logout')}</button>
    </div>
  </div></div>`;
  bindLang();
  document.getElementById('lo').onclick = () => signOut();
  const ta = document.getElementById('toAdmin'); if (ta) ta.onclick = () => go('admin');
  document.getElementById('cf').onsubmit = e => { e.preventDefault(); const v=document.getElementById('cin').value.trim(); if(v) openCountry(v); };
  try {
    const list = await rpc('ca_list_countries', {p_token: SESSION.token});
    const el = document.getElementById('clist'); if (!el) return;
    const cc = document.getElementById('ccount'); if (cc) cc.textContent = t('countLimit',{n:list.length,m:MAX_COUNTRIES});
    if (list.length >= MAX_COUNTRIES){
      const h = document.getElementById('chint'); if (h){ h.textContent = t('limitReached',{m:MAX_COUNTRIES}); h.style.color='var(--no)'; }
      const f = document.getElementById('cf');
      f.onsubmit = e => { e.preventDefault(); const v=document.getElementById('cin').value.trim();
        const hit = list.find(c=>c.country.toLowerCase()===v.toLowerCase());
        if (hit) openCountry(hit.country); else toast(t('limitReached',{m:MAX_COUNTRIES})); };
    }
    if (!list.length){ el.innerHTML = `<div class="empty">${t('noCountries')}</div>`; return; }
    el.innerHTML = list.map(c=>{
      const tot = totalItems(c.stage), done = c.yes + c.no, pct = tot ? Math.round(done/tot*100) : 0;
      const st = c.completed_at ? `<span class="st-done">${esc(t('done',{d:fmtDate(c.completed_at)}))}</span>` : `<span class="st-work">${t('inWork')}</span>`;
      return `<div class="citem" data-c="${esc(c.country)}">
        <div class="nm"><span class="nmt">${esc(c.country)}</span><div style="margin-top:3px">${st}</div></div>
        <div class="meta">${t('stageN',{n:c.stage})} · ${esc(stageShort(c.stage-1))}<br>${t('answered',{a:done,t:tot})}${c.turnover!=null?` · € ${esc(fmtMoney(c.turnover))}`:''}
          ${c.turnover==null||c.parallel_structures==null||c.dd_leaders==null
            ? `<br><span class="miss">${t('metricsMissing')}</span>`
            : `<br>${esc(t('psShort',{n:c.parallel_structures}))} · ${esc(t('ddShort',{n:c.dd_leaders}))}`}</div>
        <div class="mini"><i style="width:${pct}%"></i></div>
        <button class="del" data-id="${c.id}" data-n="${esc(c.country)}" title="${esc(t('del'))}">${IC.trash}</button>
      </div>`;
    }).join('');
    el.querySelectorAll('.citem').forEach(x=>x.onclick=()=>openCountry(x.dataset.c));
    el.querySelectorAll('.del').forEach(b=>b.onclick=async e=>{
      e.stopPropagation();
      if (!confirm(t('delCountry',{c:b.dataset.n}))) return;
      try { await rpc('ca_delete_country',{p_token:SESSION.token,p_audit:b.dataset.id}); renderCountry(); } catch(err){ toast(errText(err)); }
    });
  } catch(err){ const el=document.getElementById('clist'); if(el) el.innerHTML=`<div class="empty">${esc(errText(err))}</div>`; }
}

function loadAudit(a){
  AUDIT = {id:a.id, country:a.country, stage:a.stage, turnover:a.turnover,
    parallel_structures:a.parallel_structures, dd_leaders:a.dd_leaders, _bad:{}, define_text:a.define_text||'', owner:a.owner, completed_at:a.completed_at};
  ANS = {};
  (a.items||[]).forEach(it=>{ ANS[key(it.phase,it.section,it.idx)] = {status:it.status, comment:it.comment||''}; });
}
async function openCountry(name){
  try {
    const a = await rpc('ca_open_country',{p_token:SESSION.token, p_country:name});
    loadAudit(a); READONLY = false; LAST_FINISH = null; go('map');
  } catch(err){ toast(errText(err)); }
}

/* ================= app shell ================= */
function shell(inner, cls, bar){
  const ro = READONLY;
  return `<div class="app">
    <header class="top">
      <div class="brand"><span class="drop"></span><div class="txtb"><h1>${t('appTitle')}</h1><div class="tag">${t('appTag')}</div></div></div>
      <div class="cchip" id="cchip" title="${esc(t('change'))}">
        <span class="cn">${esc(AUDIT.country)}</span>
        ${ro?`<span class="sw">${esc(AUDIT.owner||'')}</span>`:`<span class="sw">${t('change')}</span>`}
      </div>
      <div class="spacer"></div>
      ${ro?'':`<div class="saving" id="saving"><i></i><span class="lbl">${t('saved')}</span></div>`}
      ${ro?'':`<button class="btn sm ghost tour-start help" title="${esc(t('howTo'))}" aria-label="${esc(t('howTo'))}">?</button>`}
      ${langSwitch()}
      <div class="userbox"><span class="av">${esc((SESSION.label||'?').trim().charAt(0).toUpperCase())}</span><span class="nm">${esc(SESSION.label)}</span>
        <button class="btn sm ghost" id="lo" title="${esc(t('logout'))}">${IC.out}<span class="lbl">${t('logout')}</span></button></div>
    </header>
    <main class="page ${cls||''} ${bar?'hasbar':''}">${inner}</main>
    ${bar?`<nav class="mbar">${bar}</nav>`:''}
  </div>`;
}
function bindShell(){
  bindLang();
  document.getElementById('lo').onclick = () => signOut();
  document.getElementById('cchip').onclick = () => { if (READONLY){ go('admin'); } else go('country'); };
  ROOT.querySelectorAll('.mbar [data-go]').forEach(b => b.onclick = () => go(b.dataset.go));
  const sv = document.getElementById('saving');
  if (sv){ setSaveState(saveState); sv.onclick = () => { if (saveState==='fail'){ setSaveState('busy'); flush(); } }; }
}

/* ================= map ================= */
function stageBar(){
  const ov = overallTally();
  const pctY = ov.total ? ov.y/ov.total*100 : 0, pctN = ov.total ? ov.n/ov.total*100 : 0;
  return `<section class="stagebar">
    <div class="row1">
      <div><h2>${t('whereH')}</h2><p>${t('whereP')}</p></div>
      <div class="row1r">
        <div class="overall"><span>${t('overall',{n:AUDIT.stage})}</span>
          <div class="obar"><i class="y" style="width:${pctY}%"></i><i class="n" style="width:${pctN}%"></i></div>
          <b>${ov.y+ov.n}/${ov.total}</b></div>
        ${READONLY?'':`<button class="btn primary finish-btn">${IC.check}${t('finish')}</button>`}
      </div>
    </div>
    ${metricsBlock()}
    <div class="seg" id="seg">${PHASES.map((p,i)=>`
      <button data-s="${i+1}" class="${i+1===AUDIT.stage?'on':i+1<AUDIT.stage?'past':''}" ${READONLY?'disabled':''}>
        <span class="n">${t('stageN',{n:i+1})}</span><span class="r">${p.rev}</span><span class="s">${esc(stageShort(i))}</span>
      </button>`).join('')}</div>
  </section>`;
}
const METRICS = [
  {f:'turnover', lbl:'turnover', ph:'turnoverPh', money:true, id:'turnIn'},
  {f:'parallel_structures', lbl:'psLabel', ph:'countPh'},
  {f:'dd_leaders', lbl:'ddLabel', ph:'countPh'}
];
function fmtMetric(m, v){ return v==null ? '' : (m.money ? fmtMoney(v) : String(v)); }
function metricsBlock(){
  return `<div class="metrics">${METRICS.map(m=>`
      <label class="turn${AUDIT[m.f]==null&&!READONLY?' unset':''}" data-f="${m.f}"><span>${t(m.lbl)}${READONLY?'':'<i class="req">*</i>'}</span>
        <input class="input" ${m.id?`id="${m.id}"`:''} data-f="${m.f}" inputmode="${m.money?'decimal':'numeric'}" ${m.money?'':'pattern="[0-9]*"'} autocomplete="off"
          placeholder="${esc(t(m.ph))}" value="${esc(fmtMetric(m, AUDIT[m.f]))}" ${READONLY?'disabled':''}>
        <em class="ferr"></em></label>`).join('')}
      ${READONLY?'':`<div class="mhint">${t('metricsHint')}</div>`}
    </div>`;
}
function bindMetrics(){
  if (READONLY) return;
  ROOT.querySelectorAll('.metrics input[data-f]').forEach(inp => {
    const m = METRICS.find(x=>x.f===inp.dataset.f), box = inp.closest('.turn'), err = box.querySelector('.ferr');
    inp.addEventListener('input', () => {
      const raw = inp.value.replace(/[\s\u00a0€]/g,'').replace(',', '.');
      const v = raw === '' ? null : Number(raw);
      const bad = raw !== '' && (!isFinite(v) || v < 0 || (!m.money && !Number.isInteger(v)));
      AUDIT._bad[m.f] = bad;
      box.classList.toggle('bad', bad);
      box.classList.toggle('unset', !bad && v == null);
      box.classList.remove('need');
      err.textContent = bad ? t(m.money?'badMoney':'badInt') : '';
      if (bad) return;
      AUDIT[m.f] = v;
      queueSave('m:'+m.f, {fn:'ca_set_metric', args:{p_token:SESSION.token, p_audit:AUDIT.id, p_field:m.f, p_value:v}}, 700);
    });
    inp.addEventListener('blur', () => { if (!AUDIT._bad[m.f] && AUDIT[m.f]!=null) inp.value = fmtMetric(m, AUDIT[m.f]); });
  });
}
function missingMetrics(){ return METRICS.filter(m => AUDIT[m.f]==null || (AUDIT._bad && AUDIT._bad[m.f])); }
function flagMissingMetrics(list){
  list.forEach(m => {
    const box = ROOT.querySelector(`.metrics .turn[data-f="${m.f}"]`); if (!box) return;
    box.classList.add('need');
    const e = box.querySelector('.ferr'); if (e && !AUDIT._bad[m.f]) e.textContent = t('fieldReq');
  });
  const first = ROOT.querySelector(`.metrics .turn[data-f="${list[0].f}"] input`);
  if (first){ first.scrollIntoView({block:'center', behavior:'smooth'}); setTimeout(()=>first.focus({preventScroll:true}), 350); }
}
function mktBand(){
  const cells=[];
  for(let i=0;i<6;i++){
    const m=MKT[i], first = i===0 || MKT[i-1]!==m;
    if(first){
      const name = m==='new'?t('mktNew'):t('mktDev'), range = m==='new'?t('mktNewRange'):t('mktDevRange');
      cells.push(`<div class="mkt-seg ${m}"><span class="sw"></span><span>${name} · <span style="opacity:.7;font-weight:600">${range}</span></span><span class="bracket"></span></div>`);
    } else cells.push(`<div class="mkt-seg ${m}"><span class="bracket"></span></div>`);
  }
  return `<div class="mkt-band">${cells.join('')}</div>`;
}
function renderMap(){
  const cards = PHASES.map((p,i)=>{
    const st = i+1, ahead = st > AUDIT.stage, cur = st === AUDIT.stage, tl = phaseTally(i);
    const pill = L(p.eb).split('·')[0].trim();
    const tally = ahead ? '' : `
      <div class="tally"><span class="t-yes">✓ ${tl.y}</span><span class="t-no">✗ ${tl.n}</span><span class="t-open">${tl.open} ${t('open_')}</span></div>
      <div class="pbar"><i class="y" style="width:${tl.y/tl.total*100}%"></i><i class="n" style="width:${tl.n/tl.total*100}%"></i></div>`;
    return `<div class="st ${p.founders?'founders':''} ${cur?'current':''} ${ahead?'ahead':''}" data-i="${i}">
      <span class="goldline"></span><span class="num">0${st}</span>
      ${cur?`<span class="cur-tag">${t('current')}</span>`:''}${ahead?`<span class="ahead-tag">${t('ahead')}</span>`:''}
      <span class="pill">${pill}</span>
      <div class="rev">${p.rev}</div>
      <div class="revsub">${L(p.revsub)}</div>
      <div class="cons"><b>${p.consumers}</b><span>${t('consumersLabel')}</span></div>
      <h3>${L(p.short)}</h3>
      <ul class="top3">${L(p.top3).map(x=>`<li>${x}</li>`).join('')}</ul>
      <div class="cgate"><span class="cgl">${L(p.side.gate)[0]}</span>${L(p.side.gate)[1]}</div>
      ${tally}
    </div>`;
  }).join('');
  ROOT.innerHTML = shell(`
    ${stageBar()}
    ${mktBand()}
    <div class="track" id="track">${cards}</div>
    <div class="map-foot" style="justify-content:space-between;flex-wrap:wrap">
      <span style="display:flex;gap:10px;align-items:center"><span class="dot"></span><span>${t('mapFoot')}</span></span>
      <span class="map-actions">
        ${READONLY?`<button class="btn sm" id="backOv">${t('adminBackOv')}</button>`:''}
        <button class="btn sm" id="toGaps">${t('gaps')}</button>
        <button class="btn sm" id="csv">${IC.dl}${t('exportCsv')}</button>
        ${READONLY?'':`<button class="btn sm primary finish-btn">${IC.check}${t('finish')}</button>`}
      </span>
    </div>`, 'fill', READONLY
      ? `<button class="btn" data-go="admin">${t('adminBackOv')}</button><button class="btn" data-go="gaps">${t('gaps')}</button>`
      : `<button class="btn" data-go="gaps">${t('gaps')}</button><button class="btn primary finish-btn">${IC.check}${t('finishShort')}</button>`);
  bindShell();
  bindFinish();
  const segOn = ROOT.querySelector('#seg button.on'); if (segOn && isMobile()) segOn.scrollIntoView({inline:'center', block:'nearest'});
  ROOT.querySelectorAll('.st').forEach(el=>el.onclick=()=>{ CUR_PHASE=+el.dataset.i; go('phase'); });
  ROOT.querySelectorAll('#seg button').forEach(b=>b.onclick=()=>setStage(+b.dataset.s));
  bindMetrics();
  document.getElementById('toGaps').onclick = () => go('gaps');
  document.getElementById('csv').onclick = exportCsv;
  const bo = document.getElementById('backOv'); if (bo) bo.onclick = () => go('admin');
}
function setStage(s){
  if (READONLY || s === AUDIT.stage) return;
  AUDIT.stage = s;
  queueSave('stage', {fn:'ca_set_stage', args:{p_token:SESSION.token, p_audit:AUDIT.id, p_stage:s}}, 0);
  render();
}

/* ================= phase ================= */
function renderPhase(){
  const i = CUR_PHASE, p = PHASES[i], st = i+1, ahead = st > AUDIT.stage, ro = READONLY || ahead;
  const m = MKT[i];
  const items = phaseItems(i);
  const itemHtml = it => {
    const a = ANS[key(st,it.sec,it.idx)] || {}, s = a.status || '';
    const showC = !ahead && (s==='no' || (a.comment||'').length || a._open);
    let cmt = '';
    if (showC){
      if (READONLY) cmt = a.comment ? `<div class="cmt"><div class="ro">${esc(a.comment)}</div></div>` : (s==='no'?`<div class="cmt"><div class="need">${t('noCmt')}</div></div>`:'');
      else cmt = `<div class="cmt"><textarea data-k="${it.sec}|${it.idx}" placeholder="${esc(s==='no'?t('cmtPh'):t('cmtPhYes'))}">${esc(a.comment||'')}</textarea>
        ${s==='no' && !(a.comment||'').trim() ? `<div class="need">${t('needCmt')}</div>`:''}</div>`;
    }
    const btns = ahead ? '' : `<div class="yn">
        <button class="y ${s==='yes'?'on':''}" data-a="yes" ${ro?'disabled':''}>${IC.check}${t('yes')}</button>
        <button class="n ${s==='no'?'on':''}" data-a="no" ${ro?'disabled':''}>${IC.x}${t('no')}</button>
        ${READONLY?'':`<button class="c ${(a.comment||'').trim()?'has':''}" data-a="cmt" title="${esc(t('addCmt'))}">${IC.cmt}</button>`}
      </div>`;
    return `<li class="${s}" data-sec="${it.sec}" data-idx="${it.idx}">
      <div class="rowi"><span class="txt">${it.txt}</span>${btns}</div>${cmt}</li>`;
  };
  const b = items.filter(x=>x.sec==='build'), l = items.filter(x=>x.sec==='leader');
  const tl = phaseTally(i);
  const sd = p.side, mets = L(sd.metrics), g = L(sd.gate);
  let side = `<div class="side-h">${t('whyExists')}</div><div class="side-p">${L(sd.intro)}</div>
    <div class="chips">${L(sd.chips).map((c,k)=>`<span class="chip ${k===0?'aq':k===1?'co':'gd'}">${c}</span>`).join('')}</div>
    <div class="side-metric ${mets[1][2]}">${mets.map(mm=>`<div><b>${mm[0]}</b><span>${mm[1]}</span></div>`).join('')}</div>
    ${L(sd.callouts).map(c=>`<div class="callout ${c[1]}">${c[0]}</div>`).join('')}`;
  if (sd.define){
    side += `<div class="define"><label>${L(DEF.label)}</label>
      ${READONLY ? `<div class="cmt" style="padding:0"><div class="ro">${esc(AUDIT.define_text||'—')}</div></div>`
                 : `<textarea id="defText" placeholder="${esc(L(DEF.ph))}">${esc(AUDIT.define_text||'')}</textarea>`}
      <div class="hint">${L(DEF.hint)}</div></div>`;
  }
  side += `<div class="gate"><div class="gl">${g[0]}</div><p>${g[1]}</p></div>`;

  const mob = isMobile();
  const mbar = `<button class="btn" data-go="map">${t('back')}</button>
      <button class="btn icon" id="mPrev" ${i>0?'':'disabled'} aria-label="${esc(t('prev'))}">‹</button>
      <span class="msum" id="mSum">${t('stageN',{n:st})}</span>
      <button class="btn icon" id="mNext" ${i<PHASES.length-1?'':'disabled'} aria-label="${esc(t('next'))}">›</button>`;
  ROOT.innerHTML = shell(`
    <div class="backrow" style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">
      <button class="btn" id="back">${t('back')}</button>
    </div>
    <section class="ph">
      <div class="ph-top">
        <div class="rev">${p.rev}<small>${L(p.revsub).replace(/^\/ ?/,'')} · ${p.consumers}</small></div>
        <div class="ttl"><div class="eyebrow">${t('stageN',{n:st})} · ${L(p.eb)}</div><h2>${L(p.short)}</h2></div>
        <span class="mkt ${m}">${m==='new'?t('mktNew'):t('mktDev')}</span>
      </div>
      <div class="ph-body">
        <div class="ph-lists">
          ${READONLY?`<div class="banner ro">${IC.lock}<span>${esc(t('roBanner',{o:AUDIT.owner||''}))}</span></div>`:''}
          ${ahead?`<div class="banner ahead">${IC.info}<span>${t('aheadBanner')}</span></div>`:''}
          <div class="headline"><div class="hl">${t('top3')}</div><ol>${L(p.top3).map(x=>`<li>${x}</li>`).join('')}</ol></div>
          <div class="tracklabel rev"><span class="ic">${IC.build}</span>${t('buildLabel')}<span class="cnt" id="cntB"></span></div>
          <ul class="chk" id="chkB">${b.map(itemHtml).join('')}</ul>
          <div class="tracklabel ldr"><span class="ic">${IC.ldr}</span>${t('leaderLabel')}<span class="cnt" id="cntL"></span></div>
          <ul class="chk" id="chkL">${l.map(itemHtml).join('')}</ul>
          <div class="ph-nav">
            ${i>0?`<button class="btn" id="prev">${t('prev')}</button>`:'<span></span>'}
            <span style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
              ${!READONLY && st===AUDIT.stage?`<button class="btn primary finish-btn">${IC.check}${t('finish')}</button>`:''}
              ${i<PHASES.length-1?`<button class="btn" id="next">${t('next')}</button>`:''}
            </span>
          </div>
        </div>
        <aside class="ph-side">
          ${ahead?'':`<div class="ph-summary" id="phSum"></div>`}
          ${mob ? `<details class="sdet"><summary>${t('aboutStage')}${IC.chev}</summary>${side}</details>` : side}
        </aside>
      </div>
    </section>`, '', mbar);
  bindShell();
  document.getElementById('back').onclick = () => go('map');
  const pv = document.getElementById('prev'); if (pv) pv.onclick = () => { CUR_PHASE--; go('phase'); };
  const nx = document.getElementById('next'); if (nx) nx.onclick = () => { CUR_PHASE++; go('phase'); };
  const mp = document.getElementById('mPrev'); if (mp) mp.onclick = () => { if (CUR_PHASE>0){ CUR_PHASE--; go('phase'); } };
  const mn = document.getElementById('mNext'); if (mn) mn.onclick = () => { if (CUR_PHASE<PHASES.length-1){ CUR_PHASE++; go('phase'); } };
  bindFinish();
  updatePhaseCounts();

  if (!READONLY && !ahead){
    ROOT.querySelectorAll('.chk li').forEach(li=>{
      li.querySelectorAll('.yn button').forEach(btn=>btn.onclick=()=>onAnswer(li, btn.dataset.a));
      bindComment(li);
    });
  }
  const dt = document.getElementById('defText');
  if (dt) dt.addEventListener('input', () => {
    AUDIT.define_text = dt.value;
    queueSave('define', {fn:'ca_set_define', args:{p_token:SESSION.token, p_audit:AUDIT.id, p_text:dt.value}}, 700);
  });
}
function bindComment(li){
  const ta = li.querySelector('textarea'); if (!ta) return;
  ta.addEventListener('input', () => {
    const st = CUR_PHASE+1, sec = li.dataset.sec, idx = +li.dataset.idx, k = key(st,sec,idx);
    const a = ANS[k] || (ANS[k] = {status:null, comment:''});
    a.comment = ta.value;
    const need = li.querySelector('.need');
    if (a.status==='no' && !ta.value.trim()){ if(!need){ const d=document.createElement('div'); d.className='need'; d.textContent=t('needCmt'); ta.after(d);} }
    else if (need) need.remove();
    const cb = li.querySelector('.yn .c'); if (cb) cb.classList.toggle('has', !!ta.value.trim());
    saveItem(st, sec, idx, 800);
    updatePhaseCounts();
  });
}
function onAnswer(li, action){
  const st = CUR_PHASE+1, sec = li.dataset.sec, idx = +li.dataset.idx, k = key(st,sec,idx);
  const a = ANS[k] || (ANS[k] = {status:null, comment:''});
  if (action === 'cmt'){
    a._open = true;
    redrawItem(li);
    const ta = li.querySelector('textarea'); if (ta) ta.focus();
    return;
  }
  a.status = a.status === action ? null : action;
  redrawItem(li);
  saveItem(st, sec, idx, 0);
  updatePhaseCounts();
  if (a.status === 'no'){ const ta = li.querySelector('textarea'); if (ta && !ta.value) ta.focus(); }
}
function redrawItem(li){
  // re-render only this row, keep the rest of the page (and focus elsewhere) intact
  const st = CUR_PHASE+1, sec = li.dataset.sec, idx = +li.dataset.idx;
  const it = phaseItems(CUR_PHASE).find(x=>x.sec===sec && x.idx===idx);
  const a = ANS[key(st,sec,idx)] || {}, s = a.status || '';
  li.className = s;
  li.querySelectorAll('.yn button').forEach(b=>{
    if (b.dataset.a==='yes') b.classList.toggle('on', s==='yes');
    if (b.dataset.a==='no') b.classList.toggle('on', s==='no');
    if (b.dataset.a==='cmt') b.classList.toggle('has', !!(a.comment||'').trim());
  });
  const show = s==='no' || (a.comment||'').length || a._open;
  let box = li.querySelector('.cmt');
  if (!show){ if (box) box.remove(); return; }
  const html = `<textarea data-k="${sec}|${idx}" placeholder="${esc(s==='no'?t('cmtPh'):t('cmtPhYes'))}">${esc(a.comment||'')}</textarea>
    ${s==='no' && !(a.comment||'').trim() ? `<div class="need">${t('needCmt')}</div>`:''}`;
  if (!box){ box = document.createElement('div'); box.className='cmt'; li.appendChild(box); box.innerHTML = html; bindComment(li); }
  else {
    const ta = box.querySelector('textarea');
    ta.placeholder = s==='no'?t('cmtPh'):t('cmtPhYes');
    const need = box.querySelector('.need');
    if (s==='no' && !(a.comment||'').trim()){ if(!need){ const d=document.createElement('div'); d.className='need'; d.textContent=t('needCmt'); ta.after(d);} }
    else if (need) need.remove();
  }
  void it;
}
function saveItem(st, sec, idx, delay){
  const k = key(st,sec,idx), a = ANS[k] || {};
  const p = PHASES[st-1];
  const ruText = strip((sec==='build'?p.build.ru:p.leader.ru)[idx] || '');
  queueSave('i:'+k, {fn:'ca_save_item', args:{
    p_token:SESSION.token, p_audit:AUDIT.id, p_phase:st, p_section:sec, p_idx:idx,
    p_text:ruText, p_status:a.status||null, p_comment:a.comment||''}}, delay);
}
function updatePhaseCounts(){
  const i = CUR_PHASE, st = i+1, p = PHASES[i];
  const count = (sec,len) => { let d=0; for(let k=0;k<len;k++){ const a=ANS[key(st,sec,k)]; if(a&&a.status) d++; } return d; };
  const bl = p.build.en.length, ll = p.leader.en.length;
  const cB = document.getElementById('cntB'), cL = document.getElementById('cntL');
  if (cB) cB.textContent = `${count('build',bl)}/${bl}`;
  if (cL) cL.textContent = `${count('leader',ll)}/${ll}`;
  const ms = document.getElementById('mSum');
  if (ms){ const tl = phaseTally(i);
    ms.innerHTML = st > AUDIT.stage ? `${t('stageN',{n:st})} · ${t('ahead')}` : `${t('stageN',{n:st})}<span><b class="y">✓${tl.y}</b><b class="n">✗${tl.n}</b><b class="o">${tl.open}</b></span>`; }
  const ps = document.getElementById('phSum');
  if (ps){ const tl = phaseTally(i);
    ps.innerHTML = `<span class="t-yes">✓ ${t('yes')}: ${tl.y}</span><span class="t-no">✗ ${t('no')}: ${tl.n}</span><span class="t-open">${tl.open} ${t('open_')}</span>`; }
}

/* ================= gaps ================= */
function renderGaps(){
  let html = '', any = false, open = 0;
  for (let i=0;i<AUDIT.stage;i++){
    const st = i+1, items = phaseItems(i).filter(it=>{ const a=ANS[key(st,it.sec,it.idx)]; if(!a||!a.status) open++; return a && a.status==='no'; });
    if (!items.length) continue; any = true;
    html += `<div class="gap-stage"><h3>${t('stageN',{n:st})} · ${esc(stageShort(i))} <small>${PHASES[i].rev}</small></h3>
      ${items.map(it=>{ const a=ANS[key(st,it.sec,it.idx)];
        return `<div class="gap"><div class="gs">${it.sec==='build'?t('buildLabel'):t('leaderLabel')}</div><div class="gt">${it.txt}</div>
          <div class="gc ${a.comment&&a.comment.trim()?'':'miss'}">${a.comment&&a.comment.trim()?esc(a.comment):t('noCmt')}</div></div>`; }).join('')}
    </div>`;
  }
  ROOT.innerHTML = shell(`
    <div style="display:flex;gap:10px;margin-bottom:14px"><button class="btn" id="back">${t('back')}</button></div>
    <section class="panel">
      <div class="panel-h"><div><h2>${t('gapsH')} · ${esc(AUDIT.country)}</h2><p>${t('gapsP',{n:AUDIT.stage})}</p></div>
        <span class="map-actions"><button class="btn sm" id="csv">${IC.dl}${t('exportCsv')}</button>
        ${READONLY?'':`<button class="btn sm primary finish-btn">${IC.check}${t('finish')}</button>`}</span></div>
      ${open?`<div class="notice">${t('unanswered',{n:open})}</div>`:''}
      ${any?html:`<div class="okmsg">${t('noGaps')}</div>`}
    </section>`, '', `<button class="btn" data-go="map">${t('back')}</button>${READONLY?'':`<button class="btn primary finish-btn">${IC.check}${t('finishShort')}</button>`}`);
  bindShell();
  document.getElementById('back').onclick = () => go('map');
  document.getElementById('csv').onclick = exportCsv;
  bindFinish();
}

/* ================= finish audit ================= */
function bindFinish(){ ROOT.querySelectorAll('.finish-btn').forEach(b => b.onclick = () => finishAudit(b)); }
async function finishAudit(btn){
  if (READONLY || !AUDIT) return;
  const miss = missingMetrics();
  if (miss.length){
    toast(t('needMetrics',{f: miss.map(m=>t(m.lbl).replace(/,.*$/,'')).join(', ')}));
    if (VIEW !== 'map'){ go('map'); }
    flagMissingMetrics(miss);
    return;
  }
  // what is still missing on stages 1..current
  let open = 0, noCmt = 0;
  for (let i=0;i<AUDIT.stage;i++){
    const st=i+1;
    phaseItems(i).forEach(it=>{ const a=ANS[key(st,it.sec,it.idx)];
      if (!a || !a.status) open++; else if (a.status==='no' && !(a.comment||'').trim()) noCmt++; });
  }
  let msg = t('finishAsk',{c:AUDIT.country});
  if (open || noCmt){
    msg += '\n\n' + [open?t('finishOpen',{n:open}):'', noCmt?t('finishNoCmt',{n:noCmt}):''].filter(Boolean).join('\n');
    msg += '\n\n' + t('finishLater');
  }
  if (!confirm(msg)) return;
  const btns = ROOT.querySelectorAll('.finish-btn');
  btns.forEach(b=>{ b.disabled = true; b.dataset.l = b.innerHTML; b.textContent = t('finishing'); });
  try {
    if (!(await flushAll())) throw new Error('SAVE');
    const r = await rpc('ca_finish_audit', {p_token:SESSION.token, p_audit:AUDIT.id});
    LAST_FINISH = r;
    AUDIT = null; ANS = {}; CUR_PHASE = 0;
    go('country');
  } catch(err){
    toast(err.message==='SAVE' ? t('finishSaveFail') : errText(err));
    btns.forEach(b=>{ b.disabled = false; if (b.dataset.l) b.innerHTML = b.dataset.l; });
    if (err.message==='METRICS_REQUIRED'){ if (VIEW!=='map') go('map'); flagMissingMetrics(METRICS); }
    if (err.message==='NOT_FOUND') auditGone();
  }
  void btn;
}

/* ================= CSV ================= */
function exportCsv(){
  const head = t('csvHead');
  const rows = [head];
  const owner = READONLY ? (AUDIT.owner||'') : SESSION.label;
  for (let i=0;i<PHASES.length;i++){
    const st = i+1;
    phaseItems(i).forEach(it=>{
      const a = ANS[key(st,it.sec,it.idx)] || {};
      const status = st > AUDIT.stage ? (LANG==='ru'?'впереди':'ahead') : a.status==='yes' ? t('yes') : a.status==='no' ? t('no') : '';
      rows.push([owner, AUDIT.country, AUDIT.stage,
        AUDIT.turnover!=null?Number(AUDIT.turnover):'', AUDIT.parallel_structures??'', AUDIT.dd_leaders??'', st, it.sec==='build'?t('buildLabel'):t('leaderLabel'), it.idx+1, strip(it.txt), status, a.comment||'']);
    });
  }
  const csv = '﻿' + rows.map(r=>r.map(v=>{ const s=String(v??''); return /[;"\n\r]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; }).join(';')).join('\r\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `audit-${AUDIT.country.replace(/[^\p{L}\p{N}]+/gu,'-')}-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}

/* ================= admin ================= */
function genPass(){
  const al = 'abcdefghjkmnpqrstuvwxyz23456789';
  const arr = new Uint32Array(10); crypto.getRandomValues(arr);
  return Array.from(arr, x=>al[x%al.length]).join('').replace(/^(.{5})/,'$1-');
}
async function renderAdmin(){
  if (!SESSION.is_admin) return go('country');
  ROOT.innerHTML = `<div class="app">
    <header class="top">
      <div class="brand"><span class="drop"></span><div class="txtb"><h1>${t('adminH')}</h1><div class="tag">${t('appTag')}</div></div></div>
      <div class="spacer"></div>${langSwitch()}
      <div class="userbox"><span class="av">${esc(SESSION.label.trim().charAt(0).toUpperCase())}</span><span class="nm">${esc(SESSION.label)}</span>
        <button class="btn sm ghost" id="lo">${t('logout')}</button></div>
    </header>
    <main class="page">
      <div style="display:flex;gap:10px;margin-bottom:14px"><button class="btn" id="back">${t('adminBack')}</button></div>
      <div class="tabs"><button data-t="overview" class="${ADMIN_TAB==='overview'?'on':''}">${t('tabOverview')}</button>
        <button data-t="report" class="${ADMIN_TAB==='report'?'on':''}">${t('tabReport')}</button>
        <button data-t="users" class="${ADMIN_TAB==='users'?'on':''}">${t('tabUsers')}</button></div>
      <section class="panel" id="apanel"><div class="empty">…</div></section>
    </main></div>`;
  bindLang();
  document.getElementById('lo').onclick = () => signOut();
  document.getElementById('back').onclick = () => go('country');
  ROOT.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{ ADMIN_TAB=b.dataset.t; renderAdmin(); });
  try { ADMIN_TAB==='overview' ? await adminOverview() : ADMIN_TAB==='report' ? await adminReport() : await adminUsers(); }
  catch(err){ document.getElementById('apanel').innerHTML = `<div class="empty">${esc(errText(err))}</div>`; }
}
async function adminOverview(){
  const rows = await rpc('ca_admin_overview',{p_token:SESSION.token});
  const el = document.getElementById('apanel'); if (!el) return;
  if (!rows.length){ el.innerHTML = `<div class="empty">${t('noAudits')}</div>`; return; }
  el.innerHTML = `<div class="deltools">
      <label class="selall"><input type="checkbox" id="selAll"> ${t('selAll')}</label>
      <span class="selcnt" id="selCnt"></span>
      <button class="btn sm danger" id="delSel" disabled>${IC.trash}${t('delSelected')}</button>
      <span style="flex:1"></span>
      <button class="btn sm danger" id="delAll">${IC.trash}${t('delAll')}</button>
    </div>
    <div class="tblwrap"><table class="tbl cards ovr"><thead><tr>
      <th class="ck"></th><th>${t('colOwner')}</th><th>${t('colCountry')}</th><th>${t('colStage')}</th><th class="num">${t('colTurnover')}</th>
      <th class="num">${t('colPS')}</th><th class="num" title="${esc(t('colDDFull'))}">${t('colDD')}</th>
      <th class="num">✓ ${t('yes')}</th><th class="num">✗ ${t('no')}</th><th class="num">${t('open_')}</th><th>${t('colStatus')}</th><th>${t('colUpd')}</th><th></th></tr></thead>
    <tbody>${rows.map(r=>{ const tot=totalItems(r.stage);
      return `<tr data-id="${r.id}"><td class="ck"><input type="checkbox" class="rowck" value="${r.id}" aria-label="${esc(r.country)}"></td>
        <td data-l="${esc(t('colOwner'))}">${esc(r.label)}</td><td class="country">${esc(r.country)}</td>
        <td data-l="${esc(t('colStage'))}">${r.stage} · ${esc(stageShort(r.stage-1))}</td>
        <td class="num" data-l="${esc(t('colTurnover'))}" style="white-space:nowrap">${r.turnover!=null?'€ '+esc(fmtMoney(r.turnover)):'—'}</td>
        <td class="num" data-l="${esc(t('colPS'))}">${r.parallel_structures??'—'}</td>
        <td class="num" data-l="${esc(t('colDD'))}">${r.dd_leaders??'—'}</td>
        <td class="num" data-l="✓ ${esc(t('yes'))}"><span class="t-yes" style="padding:2px 7px;border-radius:5px">${r.yes}</span></td>
        <td class="num" data-l="✗ ${esc(t('no'))}"><span class="t-no" style="padding:2px 7px;border-radius:5px">${r.no}</span></td>
        <td class="num" data-l="${esc(t('open_'))}">${tot-r.yes-r.no}</td>
        <td data-l="${esc(t('colStatus'))}">${r.completed_at?`<span class="st-done">${esc(t('done',{d:fmtDate(r.completed_at)}))}</span>`:`<span class="st-work">${t('inWork')}</span>`}</td>
        <td data-l="${esc(t('colUpd'))}" style="white-space:nowrap;color:var(--muted)">${fmtDate(r.updated_at)}</td>
        <td><div class="acts"><button class="btn sm" data-id="${r.id}">${t('view')}</button>
          <button class="btn sm danger icon-only" data-del="${r.id}" data-c="${esc(r.country)}" data-o="${esc(r.label)}" title="${esc(t('del'))}" aria-label="${esc(t('del'))}">${IC.trash}</button></div></td></tr>`; }).join('')}
    </tbody></table></div>`;
  el.querySelectorAll('button[data-id]').forEach(b=>b.onclick=async()=>{
    try { const a = await rpc('ca_admin_audit',{p_token:SESSION.token,p_audit:b.dataset.id}); loadAudit(a); READONLY=true; go('map'); }
    catch(err){ toast(errText(err)); }
  });
  // ---- deletion ----
  const cks = [...el.querySelectorAll('.rowck')], selAll = el.querySelector('#selAll');
  const picked = () => cks.filter(c=>c.checked).map(c=>c.value);
  const sync = () => {
    const n = picked().length;
    el.querySelector('#selCnt').textContent = n ? t('selected',{n}) : '';
    el.querySelector('#delSel').disabled = !n;
    selAll.checked = n && n === cks.length; selAll.indeterminate = n > 0 && n < cks.length;
    cks.forEach(c => c.closest('tr').classList.toggle('picked', c.checked));
  };
  cks.forEach(c => c.onchange = sync);
  selAll.onchange = () => { cks.forEach(c => c.checked = selAll.checked); sync(); };
  const doDelete = async (ids) => {
    try {
      const n = await rpc('ca_admin_delete_audits', {p_token:SESSION.token, p_ids:ids});
      toast(t('deleted',{n}));
      await adminOverview();
    } catch(err){
      toast(/ca_admin_delete_audits|Could not find the function|PGRST202/i.test(err.message) ? t('delNotInstalled') : errText(err));
    }
  };
  el.querySelectorAll('button[data-del]').forEach(b => b.onclick = () => {
    if (confirm(t('delOneAsk',{c:b.dataset.c, o:b.dataset.o}))) doDelete([b.dataset.del]);
  });
  el.querySelector('#delSel').onclick = () => { const ids = picked(); if (ids.length && confirm(t('delManyAsk',{n:ids.length}))) doDelete(ids); };
  el.querySelector('#delAll').onclick = () => {
    const w = prompt(t('delAllAsk',{n:rows.length}), '');
    if (w === null) return;
    if (w.trim().toUpperCase() !== t('delAllWord')){ toast(t('delAllWord') + '?'); return; }
    doDelete(rows.map(r=>r.id));
  };
}
/* ---- summary table: country · turnover · yes · no · comments ---- */
let REPORT = [], REP_OWNER = '', REP_Q = '';
function reportRows(){
  return REPORT.filter(r => (!REP_OWNER || r.label===REP_OWNER) && (!REP_Q || r.country.toLowerCase().includes(REP_Q.toLowerCase())));
}
function prepReport(r){
  const yes = [], no = [], cm = [];
  (r.items||[]).forEach(it=>{
    const lbl = t('stShort',{n:it.phase}), txt = itemText(it.phase, it.section, it.idx, it.text);
    const row = {lbl, txt, comment:(it.comment||'').trim(), status:it.status};
    if (it.status==='yes') yes.push(row); else if (it.status==='no') no.push(row);
    if (row.comment) cm.push(row);
  });
  return {yes, no, cm, open: totalItems(r.stage) - yes.length - no.length};
}
async function adminReport(){
  REPORT = await rpc('ca_admin_report',{p_token:SESSION.token});
  const el = document.getElementById('apanel'); if (!el) return;
  const owners = [...new Set(REPORT.map(r=>r.label))].sort();
  el.innerHTML = `
    <div class="panel-h"><div><h2>${t('tabReport')}</h2><p>${t('reportP')}</p></div>
      <button class="btn sm" id="repCsv">${IC.dl}${t('exportXls')}</button></div>
    <div class="repfilters">
      <select class="input" id="repOwner"><option value="">${t('filterAll')}</option>${owners.map(o=>`<option ${o===REP_OWNER?'selected':''}>${esc(o)}</option>`).join('')}</select>
      <input class="input" id="repQ" placeholder="${esc(t('search'))}" value="${esc(REP_Q)}">
    </div>
    <div class="tblwrap"><table class="tbl rep cards"><thead><tr>
      <th>${t('colCountry')}</th><th class="num">${t('colTurnover')}</th>
      <th class="num">${t('colPS')}</th><th class="num" title="${esc(t('colDDFull'))}">${t('colDD')}</th>
      <th>${t('colYesItems')}</th><th>${t('colNoItems')}</th><th>${t('colComments')}</th></tr></thead>
      <tbody id="repBody"></tbody></table></div>`;
  const draw = () => {
    const rows = reportRows();
    document.getElementById('repBody').innerHTML = rows.length ? rows.map(r=>{
      const d = prepReport(r);
      const li = (arr, cls) => arr.length ? `<ul class="rl ${cls}">${arr.map(x=>`<li><span class="sl">${x.lbl}</span>${esc(x.txt)}</li>`).join('')}</ul>` : '<span class="dash">—</span>';
      const cms = d.cm.length ? `<ul class="rl cm">${d.cm.map(x=>`<li class="${x.status}"><span class="sl">${x.lbl} ${x.status==='no'?'✗':'✓'}</span><b>${esc(x.txt)}</b><div class="cmt-t">${esc(x.comment)}</div></li>`).join('')}</ul>` : '<span class="dash">—</span>';
      return `<tr>
        <td class="rc"><div class="country">${esc(r.country)}</div><div class="sub">${esc(r.label)}</div>
          <div class="sub">${t('stageN',{n:r.stage})} · ${esc(stageShort(r.stage-1))}</div>
          <div style="margin-top:6px">${r.completed_at?`<span class="st-done">${esc(t('done',{d:fmtDate(r.completed_at)}))}</span>`:`<span class="st-work">${t('inWork')}</span>`}</div>
          ${d.open?`<div class="sub" style="margin-top:4px">${d.open} ${t('open_')}</div>`:''}</td>
        <td class="num rt" data-l="${esc(t('colTurnover'))}">${r.turnover!=null?'€ '+esc(fmtMoney(r.turnover)):'—'}</td>
        <td class="num rt" data-l="${esc(t('colPS'))}">${r.parallel_structures??'—'}</td>
        <td class="num rt" data-l="${esc(t('colDD'))}">${r.dd_leaders??'—'}</td>
        <td data-l="${esc(t('colYesItems'))}"><details class="rdet" ${isMobile()?'':'open'}><summary><span class="cnt-h t-yes">✓ ${d.yes.length}</span></summary>${li(d.yes,'y')}</details></td>
        <td data-l="${esc(t('colNoItems'))}"><details class="rdet" open><summary><span class="cnt-h t-no">✗ ${d.no.length}</span></summary>${li(d.no,'n')}</details></td>
        <td data-l="${esc(t('colComments'))}">${cms}</td></tr>`;
    }).join('') : `<tr><td colspan="7"><div class="empty">${t('noRows')}</div></td></tr>`;
  };
  draw();
  document.getElementById('repOwner').onchange = e => { REP_OWNER = e.target.value; draw(); };
  document.getElementById('repQ').oninput = e => { REP_Q = e.target.value; draw(); };
  document.getElementById('repCsv').onclick = exportReport;
}
function exportReport(){
  const rows = [t('repHead')];
  reportRows().forEach(r=>{
    const d = prepReport(r);
    const join = arr => arr.map(x=>`${x.lbl}: ${x.txt}`).join('\n');
    rows.push([r.country, r.label, `${r.stage} · ${stageShort(r.stage-1)}`, r.turnover!=null?Number(r.turnover):'',
      r.parallel_structures??'', r.dd_leaders??'',
      r.completed_at ? t('done',{d:fmtDate(r.completed_at)}) : t('inWork'),
      d.yes.length, d.no.length, d.open, join(d.yes), join(d.no),
      d.cm.map(x=>`${x.lbl} ${x.status==='no'?'✗':'✓'} ${x.txt} — ${x.comment}`).join('\n')]);
  });
  downloadCsv(rows, `audit-summary-${new Date().toISOString().slice(0,10)}.csv`);
}
function downloadCsv(rows, name){
  const csv = '﻿' + rows.map(r=>r.map(v=>{ const s=String(v??''); return /[;"\n\r]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; }).join(';')).join('\r\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}
async function adminUsers(){
  const users = await rpc('ca_admin_users',{p_token:SESSION.token});
  const el = document.getElementById('apanel'); if (!el) return;
  el.innerHTML = `
    <div id="pwNotice"></div>
    <form class="uform" id="uf">
      <label class="field"><span>${t('name')}</span><input class="input" id="un" maxlength="80" required></label>
      <label class="field"><span>${t('newPass')}</span><div class="pwrow"><input class="input" id="up" minlength="6" required><button type="button" class="btn sm" id="ug">${t('gen')}</button></div></label>
      <label class="chkl"><input type="checkbox" id="ua"> ${t('isAdmin')}</label>
      <button class="btn primary" type="submit" style="margin-bottom:2px">${t('addUser')}</button>
    </form>
    <div class="tblwrap"><table class="tbl cards"><thead><tr><th>${t('colName')}</th><th class="num">${t('colCountries')}</th><th></th></tr></thead>
    <tbody>${users.map(u=>`<tr><td class="country">${esc(u.label)} ${u.is_admin?`<span class="badge">${t('isAdmin')}</span>`:''}</td>
      <td class="num" data-l="${esc(t('colCountries'))}">${u.countries}</td>
      <td><div class="acts"><button class="btn sm" data-pw="${u.id}" data-n="${esc(u.label)}" data-a="${u.is_admin}">${t('setPass')}</button>
        <button class="btn sm danger" data-del="${u.id}" data-n="${esc(u.label)}">${t('del')}</button></div></td></tr>`).join('')}
    </tbody></table></div>`;
  document.getElementById('ug').onclick = () => { document.getElementById('up').value = genPass(); };
  document.getElementById('uf').onsubmit = async e => {
    e.preventDefault();
    const n = document.getElementById('un').value.trim(), p = document.getElementById('up').value, a = document.getElementById('ua').checked;
    try {
      await rpc('ca_admin_save_user',{p_token:SESSION.token,p_id:null,p_label:n,p_password:p,p_is_admin:a});
      await adminUsers();
      showPw(n,p);
    } catch(err){ toast(errText(err)); }
  };
  el.querySelectorAll('[data-pw]').forEach(b=>b.onclick=async()=>{
    let p = prompt(t('askPass',{n:b.dataset.n}), ''); if (p === null) return;
    p = p.trim() || genPass();
    try { await rpc('ca_admin_save_user',{p_token:SESSION.token,p_id:b.dataset.pw,p_label:b.dataset.n,p_password:p,p_is_admin:b.dataset.a==='true'}); showPw(b.dataset.n,p); }
    catch(err){ toast(errText(err)); }
  });
  el.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{
    if (!confirm(t('delUser',{n:b.dataset.n}))) return;
    try { await rpc('ca_admin_delete_user',{p_token:SESSION.token,p_id:b.dataset.del}); await adminUsers(); }
    catch(err){ toast(errText(err)); }
  });
}
function showPw(n,p){
  const el = document.getElementById('pwNotice'); if (!el) return;
  el.innerHTML = `<div class="notice">${t('passFor',{n:esc(n),p:`<code>${esc(p)}</code>`})}</div>`;
}

/* ================= boot ================= */
document.documentElement.lang = LANG;
document.addEventListener('keydown', e => { if (e.key==='Escape' && VIEW==='phase') go('map'); });
(async function boot(){
  if (!SESSION){ return render(); }
  try {
    const me = await rpc('ca_me',{p_token:SESSION.token});
    if (!me){ return signOut(true); }
    SESSION.label = me.label; SESSION.is_admin = me.is_admin; lsSet('ca-session', JSON.stringify(SESSION));
    go('country');
  } catch(e){ VIEW='country'; render(); }
})();
