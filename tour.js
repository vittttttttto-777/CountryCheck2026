/* Интерактивный онбординг: подсвечивает элемент, объясняет шаг и идёт дальше вслед за действиями пользователя.
   Порядок: страна → стадия → товарооборот → чек-лист → «Завершить аудит». */
'use strict';
(function(){
  const TS = {
    next:{ru:'Далее',en:'Next'}, skip:{ru:'Пропустить',en:'Skip'}, done:{ru:'Понятно, начинаю',en:'Got it'},
    of:{ru:'Шаг {n} из {t}',en:'Step {n} of {t}'},
    country:{ru:['Впишите страну','Напишите название страны, по которой проводите аудит, и нажмите «Открыть». Если страна уже есть в списке ниже — просто нажмите на неё.'],
             en:['Enter the country','Type the country you are auditing and press “Open”. If it is already in the list below, just tap it.']},
    stage:{ru:['Выберите стадию','Нажмите на стадию, на которой страна находится сейчас. Все стадии до неё включительно попадут в аудит.'],
           en:['Pick the stage','Tap the stage the country is at right now. Every stage up to and including it will be audited.']},
    turn:{ru:['Впишите товарооборот','Укажите текущий товарооборот страны в евро за месяц. Сохраняется сам, отдельная кнопка не нужна.'],
          en:['Enter the turnover','Enter the country’s current monthly turnover in euros. It saves automatically.']},
    open:{ru:['Откройте стадию','Нажмите на карточку, чтобы пройти её чек-лист. Так же пройдите все стадии до текущей — они отмечены счётчиками ✓ / ✗.'],
          en:['Open a stage','Tap the card to go through its checklist. Do the same for every stage up to the current one — see the ✓ / ✗ counters.']},
    check:{ru:['Пройдите чек-лист','По каждой строке нажмите «Есть» или «Нет». Для «Нет» появится поле — напишите, почему этого нет, что планируется и к какому сроку.'],
           en:['Go through the checklist','For each row tap “Yes” or “No”. For “No” a field appears — write why it is missing, what is planned and by when.']},
    nav:{ru:['Переходите между стадиями','Этими кнопками листайте стадии, не возвращаясь на карту. Всё сохраняется автоматически — следите за точкой «Сохранено» вверху.'],
         en:['Move between stages','Use these buttons to switch stages without going back to the map. Everything saves automatically — watch the “Saved” dot at the top.']},
    back:{ru:['Вернитесь к карте','Когда стадии пройдены, вернитесь на карту.'],
          en:['Back to the map','When the stages are done, go back to the map.']},
    finish:{ru:['Запишите результат','Нажмите «Завершить аудит страны» — результат запишется, и вы вернётесь к списку стран, чтобы взять следующую.'],
            en:['Record the result','Press “Complete country audit” — the result is recorded and you return to your country list to take the next one.']}
  };
  const tt = (k, vars) => { let v = TS[k][LANG] || TS[k].ru; if (vars && typeof v==='string') for (const x in vars) v = v.split('{'+x+'}').join(vars[x]); return v; };
  const mob = () => (typeof isMobile === 'function' && isMobile());

  // view: where the step lives · sel: what to highlight · act: 'next' (button) | 'click' (tap the target) | 'view:<v>' (done when view changes)
  const STEPS = [
    {k:'country', view:'country', sel:()=>'#cf', act:'view:map'},
    {k:'stage',   view:'map', sel:()=>'#seg', act:'click', within:'#seg button'},
    {k:'turn',    view:'map', sel:()=>'.turn', act:'next'},
    {k:'open',    view:'map', sel:()=>'.st.current', act:'view:phase'},
    {k:'check',   view:'phase', sel:()=>'#chkB li:first-child', act:'next'},
    {k:'nav',     view:'phase', sel:()=> mob() ? '.mbar' : '.ph-nav', act:'next'},
    {k:'back',    view:'phase', sel:()=> mob() ? '.mbar [data-go="map"]' : '#back', act:'view:map'},
    {k:'finish',  view:'map', sel:()=> mob() ? '.mbar .finish-btn' : '.stagebar .finish-btn', act:'end'}
  ];

  let STEP = -1;
  const doneKey = () => 'ca-tour-done:' + (SESSION && SESSION.label || '');
  const store = (k, v) => { try { v==null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch(e){} };
  const read = k => { try { return localStorage.getItem(k); } catch(e){ return null; } };

  let layer, hole, card, target = null, raf = 0;
  function ensureDom(){
    if (layer) return;
    layer = document.createElement('div'); layer.className = 'tour';
    layer.innerHTML = '<div class="tour-hole"></div><div class="tour-card" role="dialog" aria-live="polite"></div>';
    document.body.appendChild(layer);
    hole = layer.querySelector('.tour-hole'); card = layer.querySelector('.tour-card');
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule);
  }
  function hide(){ if (layer) layer.classList.remove('on'); target = null; }
  function stop(markDone){ STEP = -1; hide(); if (markDone) store(doneKey(), '1'); }
  function schedule(){ cancelAnimationFrame(raf); raf = requestAnimationFrame(place); }

  function place(){
    if (!target || !document.body.contains(target)) return;
    const r = target.getBoundingClientRect(), pad = 6, vw = window.innerWidth, vh = window.innerHeight;
    Object.assign(hole.style, {left:(r.left-pad)+'px', top:(r.top-pad)+'px', width:(r.width+pad*2)+'px', height:(r.height+pad*2)+'px'});
    const cw = Math.min(340, vw-24); card.style.width = cw + 'px';
    const ch = card.offsetHeight;
    let top = r.bottom + 14;
    if (top + ch > vh - 12) top = r.top - ch - 14;           // not enough room below → above
    if (top < 12) top = Math.min(vh - ch - 12, Math.max(12, r.top + 12)); // tall target → overlay inside
    let left = Math.min(Math.max(12, r.left + r.width/2 - cw/2), vw - cw - 12);
    card.style.top = top + 'px'; card.style.left = left + 'px';
  }

  function show(){
    const s = STEPS[STEP];
    const el = document.querySelector(s.sel());
    if (!el){ hide(); return; }
    ensureDom();
    target = el;
    const [h, p] = tt(s.k);
    const last = s.act === 'end';
    card.innerHTML = `<div class="tour-step">${tt('of',{n:STEP+1,t:STEPS.length})}</div>
      <div class="tour-h">${h}</div><p>${p}</p>
      <div class="tour-btns"><button class="btn sm ghost" data-t="skip">${tt('skip')}</button>
        ${s.act==='next' ? `<button class="btn sm primary" data-t="next">${tt('next')}</button>` : ''}
        ${last ? `<button class="btn sm primary" data-t="end">${tt('done')}</button>` : ''}</div>`;
    card.querySelector('[data-t="skip"]').onclick = () => stop(true);
    const nb = card.querySelector('[data-t="next"]'); if (nb) nb.onclick = () => { STEP++; show(); };
    const eb = card.querySelector('[data-t="end"]'); if (eb) eb.onclick = () => stop(true);
    layer.classList.add('on');
    // bring into view, then position (twice: after smooth scroll settles)
    const r = el.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight - 110) el.scrollIntoView({block:'center', behavior:'smooth'});
    schedule(); setTimeout(schedule, 350); setTimeout(schedule, 700);
  }

  // called by app.js after every render
  window.tourAfter = function(){
    if (STEP < 0) return;
    if (typeof READONLY !== 'undefined' && READONLY){ hide(); return; }
    const s = STEPS[STEP];
    // the user did what the step asked by navigating
    if (s.act.startsWith('view:') && VIEW === s.act.slice(5)) STEP++;
    // jumped ahead (e.g. opened an existing country) — find the first step for this view
    else if (STEPS[STEP].view !== VIEW){
      const idx = STEPS.findIndex((x,i) => i > STEP && x.view === VIEW);
      if (idx > -1 && VIEW !== 'gaps' && VIEW !== 'admin') STEP = idx; else { hide(); return; }
    }
    if (STEP >= STEPS.length){ stop(true); return; }
    setTimeout(show, 60);
  };

  // advance "click" steps when the user taps the highlighted thing (capture: before the app re-renders)
  document.addEventListener('click', e => {
    const st = e.target.closest && e.target.closest('.tour-start');
    if (st){ e.preventDefault(); start(); return; }
    if (STEP < 0) return;
    const s = STEPS[STEP];
    if (s.act === 'click' && e.target.closest(s.within || s.sel())){ STEP++; setTimeout(() => window.tourAfter(), 80); }
    if (s.act === 'end' && e.target.closest('.finish-btn')) stop(true);
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && STEP >= 0) stop(true); });

  function start(){
    STEP = Math.max(0, STEPS.findIndex(x => x.view === VIEW));
    if (VIEW === 'gaps' || VIEW === 'admin') STEP = 0;
    show();
  }
  window.tourMaybeStart = function(){ if (!read(doneKey())) STEP = 0; };
  // first visit with a remembered session (no login screen this time)
  window.addEventListener('load', () => { if (SESSION && !read(doneKey()) && STEP < 0){ STEP = 0; window.tourAfter(); } });
})();
