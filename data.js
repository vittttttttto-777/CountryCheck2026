/* Данные этапов — перенесены без изменений из инструмента Кристиана (Coral Club Growth Model Map v3) */
const MKT=['new','new','new','new','dev','dev'];
/* ============ PHASE DATA (bilingual) ============ */
const PHASES=[
{
  id:"p1", rev:"€30k", founders:false, consumers:"~230",
  revsub:{en:"/ month · organic", ru:"/ месяц · органика"},
  eb:{en:"Trigger · Organic pull", ru:"Триггер · Органический спрос"},
  short:{en:"Preparation begins", ru:"Начало подготовки"},
  top3:{
    en:["<b>€30k/mo</b> organic from the hub — no local setup yet",
        "Market research + <b>Go / No-Go</b>; start product registration",
        "Map the leaders already selling"],
    ru:["<b>€30k/мес</b> органики из хаба — без местной инфраструктуры",
        "Анализ рынка + <b>Go / No-Go</b>; старт регистрации продукции",
        "Карта уже продающих лидеров"]
  },
  build:{
    en:["Confirm the €30k organic run-rate is <b>sustained</b>, not a one-month spike",
        "Assign a project leader from the expansion team and open the phase tracker",
        "Complete market, competitor, regulatory, tax & import research",
        "Sign the <b>Go / No-Go</b> — the €30k signal is necessary, not sufficient",
        "Choose entity type; shortlist consultant/lawyer (min. 3 quotes)",
        "Start the <b>product-registration dossier</b> — lead products first, cosmetics after",
        "Draft the landed-cost & local price model (freight, duty, VAT bands, card fees)"],
    ru:["Подтвердите, что уровень €30k органики <b>устойчив</b>, а не разовый всплеск",
        "Назначьте руководителя проекта из команды экспансии и откройте трекер этапа",
        "Проведите анализ рынка, конкурентов, регулирования, налогов и импорта",
        "Подпишите решение <b>Go / No-Go</b> — сигнал €30k необходим, но недостаточен",
        "Выберите форму юрлица; составьте шорт-лист консультанта/юриста (мин. 3 предложения)",
        "Запустите <b>досье на регистрацию продукции</b> — сначала ключевые продукты, затем косметика",
        "Подготовьте модель ввозной себестоимости и локальных цен (фрахт, пошлины, ставки НДС, комиссии по картам)"]
  },
  leader:{
    en:["Map the leaders already driving the organic sales — who, and how much",
        "Signal quietly that the country is opening: early movers know they can be <b>Founders</b>",
        "First translated materials start arriving; identify who will pull hardest"],
    ru:["Составьте карту лидеров, уже дающих органические продажи — кто и сколько",
        "Тихо дайте сигнал, что страна открывается: ранние лидеры понимают, что могут стать <b>Основателями</b>",
        "Начинают поступать первые переведённые материалы; определите, кто потянет сильнее всех"]
  },
  side:{
    intro:{en:"This is the readiness phase. Everything that <b>doesn't</b> need local staff gets done now, so the moment revenue justifies a local leader the runway is already clear.",
           ru:"Это этап готовности. Всё, что <b>не</b> требует местного персонала, делается сейчас — чтобы к моменту, когда выручка оправдает местного руководителя, дорожка была уже расчищена."},
    chips:{en:["Hub still ships all","0 local staff","Expansion + Controlling"],
           ru:["Хаб по-прежнему отгружает всё","0 местного персонала","Экспансия + Контроллинг"]},
    metrics:{en:[["€30k","organic / mo","aq"],["3+ mo","run-rate","co"]],
             ru:[["€30k","органика / мес","aq"],["3+ мес","устойчивость","co"]]},
    callouts:{en:[["<b>Best practice.</b> Start the registration dossier the day the plan opens — it is the classic bottleneck, and it never depends on the local leader arriving.","gd"]],
              ru:[["<b>Лучшая практика.</b> Начинайте досье на регистрацию в день открытия плана — это классическое «узкое место», и оно не зависит от прихода местного руководителя.","gd"]]},
    gate:{en:["Gate to next station","<b>Go / No-Go passed</b> and revenue approaching €50k."],
          ru:["Условие перехода к следующей станции","<b>Решение Go / No-Go принято</b>, выручка приближается к €50k."]}
  }
},
{
  id:"p2", rev:"€50k", founders:false, consumers:"~385",
  revsub:{en:"/ month", ru:"/ месяц"},
  eb:{en:"Trigger · Board Go-decision", ru:"Триггер · Решение Go Совета"},
  short:{en:"Board decision & setup", ru:"Решение Совета и подготовка"},
  top3:{
    en:["At €50k the <b>Board decides Go</b> — continue, or hold",
        "If Go: office / warehouse, product registration, bank, webshop",
        "Regional GM visits + MLM activations grow the first leaders"],
    ru:["При €50k <b>Совет решает Go</b> — продолжать или ждать",
        "Если Go: офис / склад, регистрация продукции, банк, веб-магазин",
        "Визиты регионального GM + MLM-активации растят первых лидеров"]
  },
  build:{
    en:["<b>Board Go / No-Go decision at €50k</b> — the gate to invest in the launch",
        "If Go: engage the local consultant and assign the expansion-team member",
        "Sign the office/warehouse lease; complete fit-out to standard",
        "Register products locally — lead range live, cosmetics in process",
        "Print localized materials (brochures, price list, presentation)",
        "Open local bank accounts (operational + commission)",
        "Stand up the Internal Company System - Enterprise mandator, local webshop and payment methods"],
    ru:["<b>Решение Совета Go / No-Go при €50k</b> — рубеж для инвестиций в запуск",
        "Если Go: привлеките местного консультанта и назначьте участника команды экспансии",
        "Подпишите договор аренды офиса/склада; завершите отделку по стандарту",
        "Зарегистрируйте продукцию локально — ключевая линейка запущена, косметика в процессе",
        "Напечатайте локализованные материалы (брошюры, прайс-лист, презентация)",
        "Откройте местные банковские счета (операционный + комиссионный)",
        "Разверните мандатора Internal Company System - Enterprise, локальный веб-магазин и способы оплаты"]
  },
  leader:{
    en:["Regional GM visits: presentations in-country, rented halls, invited audiences",
        "Run MLM-specific activations to grow the first leaders",
        "The early €30k leaders start climbing toward €50k as momentum builds"],
    ru:["Визиты регионального GM: презентации в стране, аренда залов, приглашённые аудитории",
        "Проводите MLM-активации, чтобы растить первых лидеров",
        "Ранние лидеры с €30k начинают расти к €50k по мере набора динамики"]
  },
  side:{
    intro:{en:"The Board makes the Go / No-Go call at €50k. If it's Go, the physical setup begins — a signed building, products registered, materials in-market. The first local hire comes later, at €70k.",
           ru:"Совет принимает решение Go / No-Go при €50k. Если Go — начинается физическая подготовка: подписанное здание, зарегистрированная продукция, материалы на рынке. Первый местный найм — позже, при €70k."},
    chips:{en:["Board Go-decision","Setup begins","Consultant + Expansion"],
           ru:["Решение Go Совета","Старт подготовки","Консультант + Экспансия"]},
    metrics:{en:[["€50k","organic / mo","aq"],["Go","board decision","gd"]],
             ru:[["€50k","органика / мес","aq"],["Go","решение Совета","gd"]]},
    callouts:{en:[["<b>A decision gate, not a hire.</b> €50k is where the Board commits to the launch and funds the setup. The first local leader — a Sales &amp; BDM — is hired at €70k, once revenue holds.","gd"]],
              ru:[["<b>Это рубеж решения, а не найм.</b> При €50k Совет принимает решение о запуске и финансирует подготовку. Первый местный руководитель — Продажи и BDM — нанимается при €70k, когда выручка держится.","gd"]]},
    gate:{en:["Gate to next station","Setup underway and revenue holding at €70k for 3 months."],
          ru:["Условие перехода к следующей станции","Подготовка идёт, выручка держится на €70k 3 месяца."]}
  }
},
{
  id:"p3", rev:"€70k", founders:false, consumers:"~540",
  revsub:{en:"/ month · 3 months", ru:"/ месяц · 3 месяца"},
  eb:{en:"Trigger · First local hire", ru:"Триггер · Первый местный найм"},
  short:{en:"Sales & Business Development Manager", ru:"Менеджер по продажам и развитию бизнеса"},
  top3:{
    en:["<b>Sales &amp; Business Development Manager</b> hired (€70k held 3 months)",
        "Plan the operations setup for go-live at €100k",
        "Recruiting peaks: <b>2–3 presentations/week</b>, BDA, transfers"],
    ru:["Нанят <b>Менеджер по продажам и развитию бизнеса</b> (€70k держится 3 мес.)",
        "Планирование операций к запуску при €100k",
        "Пик рекрутинга: <b>2–3 презентации/нед.</b>, BDA, переходы"]
  },
  build:{
    en:["Hire the <b>Sales &amp; Business Development Manager</b> (sales profile, MLM experience a must) — at €70k held 3 months",
        "Plan the warehouse / 3PL and operations setup (go-live is at €100k)",
        "Draft SOPs, security & access, FEFO & temperature requirements for launch"],
    ru:["Наймите <b>Менеджера по продажам и развитию бизнеса</b> (профиль продавца, опыт MLM обязателен) — при €70k за 3 месяца",
        "Спланируйте склад / 3PL и операции (запуск — при €100k)",
        "Подготовьте СОП, безопасность и доступ, требования FEFO и температуры к запуску"]
  },
  leader:{
    en:["<b>2–3 opportunity presentations per week</b> — the recruiting rhythm",
        "Structured meetings with potential leaders",
        "Company posts the <b>BDA</b>; transfer contracts for leaders from other companies who want to be first",
        "Work with recruitment consultants to land strategic transfers",
        "€50k leaders push toward €70k–100k as materials, office and support land"],
    ru:["<b>2–3 презентации возможностей в неделю</b> — ритм рекрутинга",
        "Структурированные встречи с потенциальными лидерами",
        "Компания открывает <b>BDA</b>; контракты перехода для лидеров из других компаний, желающих быть первыми",
        "Работайте с рекрутинговыми консультантами для стратегических переходов",
        "Лидеры с €50k растут к €70k–100k по мере поступления материалов, офиса и поддержки"]
  },
  side:{
    intro:{en:"The first local hire arrives: a sales-driven <b>Sales &amp; BDM</b>, once €70k holds for 3 months. Operations are planned here but go live at €100k — recruiting moves into high gear.",
           ru:"Появляется первый местный найм: ориентированный на продажи <b>Менеджер по продажам и BDM</b>, когда €70k держится 3 месяца. Операции здесь планируются, но запускаются при €100k — рекрутинг выходит на полную мощность."},
    chips:{en:["Hire: Sales &amp; BDM","Ops planned, not launched","+1 per €50k"],
           ru:["Найм: Продажи и BDM","Операции спланированы, не запущены","+1 на каждые €50k"]},
    metrics:{en:[["€70k","3 months","aq"],["1","Sales &amp; BDM","gd"]],
             ru:[["€70k","3 месяца","aq"],["1","Продажи и BDM","gd"]]},
    callouts:{en:[["<b>Sales first, a sales profile not an administrator.</b> The first local hire is the Sales &amp; BDM at €70k; operations support comes from Global remotely until the €100k go-live. Warehouse ops and the call center are hired at €100k.","co"]],
              ru:[["<b>Сначала продажи, профиль продавца, а не администратора.</b> Первый местный найм — Продажи и BDM при €70k; операционную поддержку даёт Global удалённо до запуска при €100k. Склад и колл-центр нанимаются при €100k.","co"]]},
    gate:{en:["Gate to next station","Sales &amp; BDM productive; revenue approaching ~€100k."],
          ru:["Условие перехода к следующей станции","Продажи и BDM продуктивны; выручка приближается к ~€100k."]}
  }
},
{
  id:"p4", rev:"~€100k", founders:false, consumers:"~770",
  revsub:{en:"ideal · pre-launch", ru:"идеал · пре-лонч"},
  eb:{en:"Milestone · Operationally open", ru:"Веха · Операционное открытие"},
  short:{en:"Pre-Launch & go-live", ru:"Пре-лонч и запуск"},
  top3:{
    en:["Hire & go live: <b>Call Centre + Operations/Warehouse</b> — <b>3-person team</b>",
        "Company-funded Pre-Launch: 200–300 guests, operationally open",
        "The <b>Founders race</b> begins"],
    ru:["Найм и запуск: <b>Колл-центр + Операции/Склад</b> — <b>команда из 3</b>",
        "Пре-лонч за счёт компании: 200–300 гостей, операционно открыто",
        "Стартует <b>гонка за Основателей</b>"]
  },
  build:{
    en:["Hire <b>Operations / Warehouse</b> and the <b>Call Centre (1 FTE)</b> in local language — both go live",
        "Reach a core team of <b>3 FTE</b> (Sales &amp; BDM, operations/warehouse, call centre)",
        "Host the company-funded opening event — 200–300 guests at the office",
        "Declare the country <b>operationally open</b> (official launch still ahead)",
        "Larger MLM machine begins: road shows, bigger events as revenue clears €150k"],
    ru:["Наймите <b>Операции / Склад</b> и <b>Колл-центр (1 FTE)</b> на местном языке — оба запускаются",
        "Соберите ядро команды из <b>3 FTE</b> (Продажи и BDM, операции/склад, колл-центр)",
        "Проведите событие открытия за счёт компании — 200–300 гостей в офисе",
        "Объявите страну <b>операционно открытой</b> (официальный запуск ещё впереди)",
        "Запускается более крупная MLM-машина: роуд-шоу, крупные события по мере выхода выручки за €150k"]
  },
  leader:{
    en:["Make the <b>Founders race</b> explicit — the whole room learns what the 30 seats take",
        "Leaders now scaling €100k → €150k where real MLM work begins",
        "Pipeline management: move builders toward €15k+ concurrent team volume",
        "Recognition made visible so the field races toward the same 30 seats"],
    ru:["Сделайте <b>гонку за Основателей</b> явной — весь зал узнаёт, чего стоят 30 мест",
        "Лидеры теперь растут €100k → €150k, где начинается настоящая MLM-работа",
        "Управление воронкой: подводите строителей к €15k+ командного оборота одновременно",
        "Признание делается заметным, чтобы сеть боролась за те же 30 мест"]
  },
  side:{
    intro:{en:"Go-live and announcement in one: operations/warehouse and the call centre start, the team reaches 3 FTE, and the Pre-Launch turns a working operation into an energised community — still a New market, now racing toward Developing.",
           ru:"Запуск и анонс в одном: операции/склад и колл-центр стартуют, команда достигает 3 FTE, а пре-лонч превращает работающую операцию в заряженное сообщество — пока это новый рынок, рвущийся к развивающемуся."},
    chips:{en:["3 FTE reached","Ops + call centre live","Founders race starts"],
           ru:["Достигнуты 3 FTE","Операции + колл-центр","Старт гонки за Основателей"]},
    metrics:{en:[["~€100k","ideal / mo","co"],["3 FTE","core team","aq"]],
             ru:[["~€100k","идеал / мес","co"],["3 FTE","ядро команды","aq"]]},
    callouts:{en:[["<b>Not the finish line.</b> Treat Pre-Launch as the starting gun for the Founders race. Everyone should leave knowing exactly what becoming a founding leader takes.","gd"]],
              ru:[["<b>Это не финиш.</b> Считайте пре-лонч выстрелом стартового пистолета в гонке за Основателей. Каждый должен уйти, точно понимая, чего стоит стать лидером-основателем.","gd"]]},
    gate:{en:["Gate to next station","Momentum toward 30 concurrent €15k+ leaders."],
          ru:["Условие перехода к следующей станции","Динамика к 30 одновременным лидерам с €15k+."]}
  }
},
{
  id:"p5", rev:"30 × €15k", founders:true, consumers:"~2,000+",
  revsub:{en:"leaders · concurrent", ru:"лидеров · одновременно"},
  eb:{en:"Milestone · The graduation", ru:"Веха · Выпускной рубеж"},
  short:{en:"Founders achieved", ru:"Основатели достигнуты"},
  top3:{
    en:["<b>30 leaders at €15k+/mo</b>, active in the <b>same month</b>",
        "Country crosses <b>~2,000 consumers</b> → Developing market",
        "Founders confirmed → <b>2-month countdown</b> to opening"],
    ru:["<b>30 лидеров с €15k+/мес</b>, активны в <b>один месяц</b>",
        "Страна переходит <b>~2 000 потребителей</b> → развивающийся рынок",
        "Основатели подтверждены → <b>2-месячный отсчёт</b> до открытия"]
  },
  build:{
    en:["Confirm <b>30 leaders at €15k+/month concurrently</b> against one clear definition",
        "Declare Founders reached",
        "Start the fixed <b>2-month countdown</b> to Gala & Official Country Opening Event"],
    ru:["Подтвердите <b>30 лидеров с €15k+/месяц одновременно</b> по единому чёткому определению",
        "Объявите, что Основатели достигнуты",
        "Запустите фиксированный <b>2-месячный отсчёт</b> до Гала и Официального открытия страны"]
  },
  leader:{
    en:["Leader development: move the pipeline from active builders to €15k+ team producers",
        "Recognition that rewards reaching <b>and holding</b> the leader line",
        "Duplication — leaders building leaders, so depth is structural not personality-driven",
        "Retention & autoship so the €15k lines are stable month to month"],
    ru:["Развитие лидеров: переводите воронку от активных строителей к тем, кто даёт €15k+ с командой",
        "Признание, которое вознаграждает достижение <b>и удержание</b> уровня лидера",
        "Дупликация — лидеры растят лидеров, чтобы глубина была структурной, а не на одной личности",
        "Удержание и автозаказ, чтобы линии по €15k были стабильны из месяца в месяц"]
  },
  side:{
    intro:{en:"The defining milestone of the whole model. A country carried by 30 independent €15k+ leaders no longer depends on HQ push — it has its own engine.",
           ru:"Определяющая веха всей модели. Страна, которую держат 30 независимых лидеров с €15k+, больше не зависит от толчка головного офиса — у неё есть собственный двигатель."},
    chips:{en:["30 leaders","€15k each, w/ team","Concurrent — same month"],
           ru:["30 лидеров","по €15k, с командой","Одновременно — один месяц"]},
    metrics:{en:[["30","concurrent leaders","gd"],["€15k","each / month","co"]],
             ru:[["30","лидеров одновременно","gd"],["€15k","каждый / месяц","co"]]},
    callouts:{en:[["<b>Why simultaneity.</b> Not 30 who have <em>ever</em> hit €15k — 30 producing €15k+ in the <b>same month</b>. That proves concurrent depth, the precondition for stable growth.","gd"]],
              ru:[["<b>Почему одновременность.</b> Не 30 тех, кто <em>когда-либо</em> брал €15k, а 30, дающих €15k+ в <b>один и тот же месяц</b>. Это доказывает одновременную глубину — предпосылку устойчивого роста.","gd"]]},
    define:true,
    gate:{en:["Then the clock starts","Founders reached triggers a fixed 2-month countdown to the finale."],
          ru:["Затем запускается отсчёт","Достижение Основателей запускает фиксированный 2-месячный отсчёт до финала."]}
  }
},
{
  id:"p6", rev:"+2", founders:true, consumers:"2,000 → 10,000",
  revsub:{en:"months · after Founders", ru:"месяца · после Основателей"},
  eb:{en:"Finale · Officially launched", ru:"Финал · Официальный запуск"},
  short:{en:"Gala & Official Country Opening Event", ru:"Гала и Официальное открытие страны"},
  top3:{
    en:["<b>Founders Gala</b> + <b>Official Opening</b> — 1,000+, owner, media & TV",
        "Officially launched — a firm <b>Developing market</b>",
        "Next horizon: <b>Mature</b> at 10,000+ consumers"],
    ru:["<b>Гала Основателей</b> + <b>Официальное открытие</b> — 1000+, владелец, СМИ и ТВ",
        "Официально запущена — уверенно <b>развивающийся рынок</b>",
        "Следующий горизонт: <b>зрелость</b> при 10 000+ потребителей"]
  },
  build:{
    en:["<b>Founders Gala</b> — recognition programme for the 30 founding leaders",
        "<b>Official Country Opening Event</b> — 1,000+ venue, owner keynote, media & TV secured",
        "Execute the PR & trade-media plan around both nights",
        "Confirm the country as a <b>Developing market</b>; activate the post-launch scale plan toward Mature"],
    ru:["<b>Гала Основателей</b> — программа признания 30 лидеров-основателей",
        "<b>Официальное открытие страны</b> — площадка на 1000+, ключевое выступление владельца, СМИ и ТВ",
        "Реализуйте PR- и отраслевой медиаплан вокруг обоих вечеров",
        "Закрепите страну как <b>развивающийся рынок</b>; активируйте план масштабирования к зрелому"]
  },
  leader:{
    en:["Honour the 30 who carried the country across the line",
        "Convert internal achievement into external credibility & recruiting gravity",
        "Feed learnings back into the Blueprint for the next country"],
    ru:["Отметьте тех 30, кто перевёл страну через черту",
        "Превратите внутреннее достижение во внешний авторитет и рекрутинговую силу притяжения",
        "Верните извлечённые уроки в Blueprint для следующей страны"]
  },
  side:{
    intro:{en:"Mark the official transition and broadcast it. The Official Country Opening Event launches the country as a firmly <b>Developing market</b> — self-sustaining and growing toward Mature (10,000+ consumers), where the company will train and motivate rather than recruit.",
           ru:"Зафиксируйте официальный переход и заявите о нём. Официальное открытие страны запускает её как уверенно <b>развивающийся рынок</b> — самостоятельный и растущий к зрелому (10 000+ потребителей), где компания будет обучать и мотивировать, а не рекрутировать."},
    chips:{en:["1,000+ guests","Owner + TV","Developing → Mature"],
           ru:["1000+ гостей","Владелец + ТВ","Развивающийся → Зрелый"]},
    metrics:{en:[["1,000+","Opening Event","gd"],["2 mo","after Founders","aq"]],
             ru:[["1000+","Событие открытия","gd"],["2 мес","после Основателей","aq"]]},
    callouts:{en:[["<b>Two nights.</b> Night 1 — Founders Gala, an intimate high-recognition celebration of the 30. Night 2 — the Official Country Opening Event, the public statement that launches the country.","co"],
                  ["<b>Next horizon: Mature.</b> The Blueprint's job is done. As the country grows past 10,000 active consumers it becomes Mature — the company shifts to training and motivating the network. Keep the dashboards running.","aq"]],
              ru:[["<b>Два вечера.</b> Вечер 1 — Гала Основателей, камерное чествование тех 30 с высоким признанием. Вечер 2 — Официальное открытие страны, публичное заявление о запуске.","co"],
                  ["<b>Следующий горизонт — зрелость.</b> Задача Blueprint выполнена. Когда страна перерастёт 10 000 активных потребителей, она станет зрелой — компания переходит к обучению и мотивации сети. Держите дашборды.","aq"]]},
    gate:{en:["Outcome","Officially launched — a Developing market growing toward Mature."],
          ru:["Результат","Официально запущена — развивающийся рынок, растущий к зрелому."]}
  }
},
];

/* ============ DEFINE box strings ============ */
const DEF={
  label:{en:'Define the €15k leader — you set this', ru:'Определите лидера €15k — это задаёте вы'},
  ph:{en:'e.g. €15k = total team volume per month across the full downline, measured in the local month-end close…',
      ru:'напр., €15k = совокупный оборот команды за месяц по всей нижней структуре, по локальному закрытию месяца…'},
  hint:{en:'This is the one number the whole model turns on. Fix it once, apply it identically in every country.',
        ru:'Это единственное число, на котором держится вся модель. Зафиксируйте его один раз и применяйте одинаково в каждой стране.'}
};

