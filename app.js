(() => {
  'use strict';

  const VERSION = 3.2;
  const $ = (q, c = document) => c.querySelector(q);
  const $$ = (q, c = document) => [...c.querySelectorAll(q)];
  const el = id => document.getElementById(id);
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const safeNum = v => Number.isFinite(Number(v)) ? Number(v) : 0;
  const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const fmt = {
    rp(n){ n = safeNum(n); return 'Rp ' + n.toLocaleString('id-ID'); },
    km(n){ n = safeNum(n); return n.toLocaleString('id-ID', {maximumFractionDigits:1}) + ' km'; },
    liter(n){ return safeNum(n).toLocaleString('id-ID', {maximumFractionDigits:2}) + ' L'; },
    date(v){ const d = v ? new Date(v) : new Date(); return d.toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'}); },
    time(v){ const d = v ? new Date(v) : new Date(); return d.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}); },
    min(ms){ const m = Math.max(0, Math.round(ms / 60000)); const h = Math.floor(m/60); const mm = m%60; return h ? `${h}j ${mm}m` : `${mm}m`; }
  };

  const ICONS = {
    home:'<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"/>',
    garage:'<path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-7h6v7"/><path d="M7 11h10"/>',
    fuel:'<path d="M5 22V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v18"/><path d="M3 22h15"/><path d="M8 6h5"/><path d="M16 7h1l3 3v7a2 2 0 0 0 2 2h0"/>',
    ai:'<path d="M12 3a6 6 0 0 0-6 6v3a6 6 0 0 0 12 0V9a6 6 0 0 0-6-6Z"/><path d="M8 10h.01M16 10h.01M9 15c1.5 1 4.5 1 6 0"/><path d="M4 12H2M22 12h-2"/>',
    speed:'<path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-5"/><path d="M12 16h.01"/>',
    ride:'<path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M8 14h4l2-5h2l3 5"/><path d="M12 14 9 8h2"/>',
    wrench:'<path d="M14.7 6.3a4 4 0 0 0-5 5L3 18v3h3l6.7-6.7a4 4 0 0 0 5-5l-2.5 2.5-2-2 2.5-2.5Z"/>',
    oil:'<path d="M8 3h8"/><path d="M10 3v4l-3 7a5 5 0 0 0 10 0l-3-7V3"/><path d="M9 15h6"/>',
    gear:'<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2 3.4-.2-.1a1.8 1.8 0 0 0-2.1.5l-.1.1h-4l-.1-.1a1.8 1.8 0 0 0-2.1-.5l-.2.1-2-3.4.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.6-1.2H6v-4h.2A1.8 1.8 0 0 0 7.8 8a1.8 1.8 0 0 0-.4-2l-.1-.1 2-3.4.2.1a1.8 1.8 0 0 0 2.1-.5l.1-.1h4l.1.1a1.8 1.8 0 0 0 2.1.5l.2-.1 2 3.4-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.6 1.2h.2v4h-.2a1.8 1.8 0 0 0-1.6 1.2Z"/>',
    spark:'<path d="m13 2-8 12h6l-1 8 9-13h-6l0-7Z"/>',
    filter:'<path d="M4 5h16"/><path d="M6 9h12"/><path d="M8 13h8"/><path d="M10 17h4"/>',
    tire:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/>',
    brake:'<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7"/>',
    battery:'<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2M7 12h4M9 10v4M14 12h2"/>',
    lamp:'<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8 14a6 6 0 1 1 8 0c-.8.7-1 1.5-1 2H9c0-.5-.2-1.3-1-2Z"/>',
    body:'<path d="M4 15h11l5-4-4-4H8l-4 4v4Z"/><path d="M7 15v3M17 13v5"/>',
    money:'<path d="M4 7h16v10H4z"/><path d="M7 10h.01M17 14h.01"/><circle cx="12" cy="12" r="2"/>',
    star:'<path d="m12 2 3 6 7 .9-5 4.9 1.2 7-6.2-3.3-6.2 3.3 1.2-7-5-4.9L9 8l3-6Z"/>',
    check:'<path d="m20 6-11 11-5-5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
    pin:'<path d="M12 21s7-4.7 7-11a7 7 0 1 0-14 0c0 6.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2"/>'
  };
  const iconSvg = name => `<svg viewBox="0 0 24 24">${ICONS[name] || ICONS.wrench}</svg>`;
  function hydrateIcons(root = document){ $$('[data-icon]', root).forEach(n => { n.innerHTML = iconSvg(n.dataset.icon); }); }

  const SERVICE_DEFAULTS = [
    ['oil-engine','Oli Mesin','oil',2000,60,65000,'Mesin'],
    ['oil-gear','Oli Gardan','oil',8000,180,25000,'CVT'],
    ['spark-plug','Busi','spark',8000,180,35000,'Mesin'],
    ['air-filter','Filter Udara','filter',12000,180,45000,'FI'],
    ['v-belt','V-Belt CVT','gear',24000,365,180000,'CVT'],
    ['roller','Roller CVT','gear',12000,240,90000,'CVT'],
    ['front-brake','Kampas Rem Depan','brake',10000,365,65000,'Rem'],
    ['rear-brake','Kampas Rem Belakang','brake',10000,365,65000,'Rem'],
    ['front-tire','Ban Depan','tire',20000,730,230000,'Kaki-kaki'],
    ['rear-tire','Ban Belakang','tire',18000,730,250000,'Kaki-kaki'],
    ['battery','Aki','battery',20000,730,230000,'Kelistrikan'],
    ['injector','Injektor / Throttle Body','filter',10000,180,85000,'FI'],
    ['front-bearing','Bearing Roda Depan','gear',15000,365,70000,'Kaki-kaki'],
    ['rear-bearing','Bearing Roda Belakang','gear',15000,365,70000,'Kaki-kaki']
  ];
  const CHECK_DEFAULTS = [
    ['headlamp','Lampu Depan','lamp','Front Area'],['front-sein','Sein Depan','lamp','Front Area'],['front-fender','Spakbor Depan','body','Front Area'],['front-disc','Piringan Cakram','brake','Front Area'],['front-caliper','Kaliper','brake','Front Area'],['front-shock','Shock Depan','wrench','Front Area'],
    ['speedometer','Speedometer','speed','Cockpit'],['mirror','Spion','body','Cockpit'],['handlebar','Stang','body','Cockpit'],['throttle','Grip Gas','wrench','Cockpit'],['switch','Saklar Kanan/Kiri','wrench','Cockpit'],
    ['engine-body','Area Mesin','gear','Engine / FI'],['wiring','Kabel-kabel','wrench','Engine / FI'],['sensor-fi','Sensor FI','ai','Engine / FI'],
    ['cvt-cover','Cover CVT','body','CVT'],['clutch','Kampas Ganda','gear','CVT'],['bowl','Mangkok Ganda','gear','CVT'],
    ['side-body','Body Samping','body','Body'],['deck','Dek Tengah','body','Body'],['seat','Jok','body','Body'],['clips','Baut / Clip Body','wrench','Body'],
    ['rear-fender','Spakbor Belakang','body','Rear Area'],['tail-lamp','Lampu Belakang','lamp','Rear Area'],['rear-sein','Sein Belakang','lamp','Rear Area'],['muffler','Knalpot','gear','Rear Area'],['plate','Plat Nomor','body','Rear Area']
  ];
  const FUEL_TYPES = [
    {id:'pertalite', name:'Pertalite', price:10000, color:'#35d07f'},
    {id:'pertamax', name:'Pertamax', price:12300, color:'#2d8cff'},
    {id:'shell-super', name:'Shell Super', price:13370, color:'#ff9f43'}
  ];

  const SERVICE_PACKAGES = [
    {id:'light', name:'Servis Ringan', icon:'wrench', desc:'Oli, busi, filter, rem, ban', items:['oil-engine','spark-plug','air-filter','front-brake','rear-brake','front-tire','rear-tire']},
    {id:'cvt', name:'Paket CVT', icon:'gear', desc:'Oli gardan, V-Belt, roller', items:['oil-gear','v-belt','roller']},
    {id:'fuel-fi', name:'Paket FI Irit', icon:'filter', desc:'Filter udara, busi, injector/TB', items:['air-filter','spark-plug','injector']},
    {id:'safety', name:'Paket Safety', icon:'brake', desc:'Rem, ban, aki, bearing', items:['front-brake','rear-brake','front-tire','rear-tire','battery','front-bearing','rear-bearing']}
  ];

  const LS_KEY = 'ngr_v2_state';
  const getLS = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
  const setLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){ console.warn(e); } };

  function createDefaultState(){
    const oldProfile = getLS('ngr_profile', null);
    const oldFuel = getLS('ngr_fuel_state', null);
    const oldFuels = getLS('ngr_fuels', []);
    const oldMods = getLS('ngr_mods', []);
    const oldSavings = getLS('ngr_savings', {target:0,collected:0});
    const oldServices = getLS('ngr_services', []);
    const oldNotes = getLS('ngr_notes', []);
    const currentKm = oldFuel?.current_km || oldProfile?.km || 0;
    const now = todayISO();
    return {
      version: VERSION,
      profile:{ name: oldProfile?.name || 'Honda Beat FI 2014', plate: oldProfile?.plat || '', color: oldProfile?.warna || '', image: oldProfile?.img || '', virtualKm: safeNum(currentKm), kmMode:'virtual', startDate: now },
      serviceComponents: SERVICE_DEFAULTS.map(d => ({id:d[0], name:d[1], icon:d[2], intervalKm:d[3], intervalDays:d[4], estimate:d[5], category:d[6], lastKm:0, lastDate:now, brand:'', note:'', history:[]})),
      bikeChecks: CHECK_DEFAULTS.map(d => ({id:d[0], name:d[1], icon:d[2], area:d[3], status:'ok', note:'', ts:Date.now()})),
      fuels: oldFuels.map(f => ({id:f.id||uid(), type:f.type||'Pertalite', liters:safeNum(f.liters), price:safeNum(f.price), km:safeNum(f.km || f.currentKm || currentKm), ts:f.ts||Date.now()})),
      fuelState:{ liters:safeNum(oldFuel?.liters), kmPerLiter:safeNum(oldFuel?.km_per_liter || 55), tankSize:4.2 },
      fuelSettings:{ prices:Object.fromEntries(FUEL_TYPES.map(f => [f.id, f.price])) },
      mods: oldMods.map(m => ({id:m.id||uid(), name:m.name||'Part modif', price:safeNum(m.price), link:m.link||'', img:m.img||'', note:m.note||'', status:'wishlist', category:'Modif', ts:m.ts||Date.now()})),
      styles:[],
      savings:{ target:safeNum(oldSavings.target), collected:safeNum(oldSavings.collected), tx:[] },
      expenses:[
        ...oldFuels.map(f => ({id:uid(), category:'Fuel', title:(f.type||'BBM') + ' ' + (f.liters||0) + 'L', amount:safeNum(f.price), ts:f.ts||Date.now(), note:'Migrasi data lama'})),
        ...oldServices.filter(s=>s.price).map(s => ({id:uid(), category:'Service', title:s.name||'Service', amount:safeNum(s.price), ts:s.ts||Date.now(), note:'Migrasi data lama'})),
        ...oldNotes.filter(n=>n.spend).map(n => ({id:uid(), category:'Other', title:n.text||'Catatan biaya', amount:safeNum(n.spend), ts:n.ts||Date.now(), note:'Migrasi catatan lama'}))
      ].sort((a,b)=>b.ts-a.ts),
      rides:[],
      ai:{ key:'', model:'openai/gpt-4o-mini', baseUrl:'https://openrouter.ai/api/v1/chat/completions', chat:[] }
    };
  }
  let state = getLS(LS_KEY, null);
  if(!state){
    state = createDefaultState();
    setLS(LS_KEY, state);
  } else {
    const def = createDefaultState();
    state = {
      ...def, ...state,
      profile: {...def.profile, ...(state.profile || {})},
      fuelState: {...def.fuelState, ...(state.fuelState || {})},
      fuelSettings: {...def.fuelSettings, ...(state.fuelSettings || {}), prices: {...def.fuelSettings.prices, ...((state.fuelSettings && state.fuelSettings.prices) || {})}},
      savings: {...def.savings, ...(state.savings || {}), tx: (state.savings && state.savings.tx) || []},
      ai: {...def.ai, ...(state.ai || {})},
      serviceComponents: (state.serviceComponents && state.serviceComponents.length) ? state.serviceComponents : def.serviceComponents,
      bikeChecks: (state.bikeChecks && state.bikeChecks.length) ? state.bikeChecks : def.bikeChecks,
      fuels: state.fuels || [], mods: state.mods || [], styles: state.styles || [], expenses: state.expenses || [], rides: state.rides || []
    };
  }
  if(!state.version || state.version < VERSION){ state.version = VERSION; save(); }
  function save(){ setLS(LS_KEY, state); }

  function toast(msg, type='ok'){
    const t = el('toast'); t.textContent = msg; t.className = 'toast show' + (type==='err'?' err':'');
    clearTimeout(toast._timer); toast._timer = setTimeout(()=>t.classList.remove('show'), 2400);
  }

  function daysBetween(a,b){ const A = new Date(a); const B = new Date(b); A.setHours(0,0,0,0); B.setHours(0,0,0,0); return Math.floor((B-A)/86400000); }
  function serviceHealth(c){
    const kmUsed = Math.max(0, state.profile.virtualKm - safeNum(c.lastKm));
    const dayUsed = c.lastDate ? Math.max(0, daysBetween(c.lastDate, todayISO())) : 0;
    const kmPct = c.intervalKm ? 100 - (kmUsed / c.intervalKm * 100) : 100;
    const dayPct = c.intervalDays ? 100 - (dayUsed / c.intervalDays * 100) : 100;
    const pct = clamp(Math.floor(Math.min(kmPct, dayPct)), 0, 100);
    const kmLeft = c.intervalKm ? Math.round(c.intervalKm - kmUsed) : null;
    const dayLeft = c.intervalDays ? Math.round(c.intervalDays - dayUsed) : null;
    return {pct, kmLeft, dayLeft, kmUsed, dayUsed, status: statusFromPct(pct)};
  }
  function checkHealth(part){
    const map = {ok:100, replaced:100, modif:100, wishlist:60, check:60, worn:35, broken:0};
    const pct = map[part.status] ?? 80;
    return {pct, status: statusFromPct(pct)};
  }
  function fuelHealth(){
    const k = safeNum(state.fuelState.kmPerLiter) || 55;
    const pct = k >= 50 ? 100 : k >= 45 ? 85 : k >= 40 ? 70 : k >= 35 ? 50 : 30;
    return {pct, status: statusFromPct(pct)};
  }
  function statusFromPct(p){ if(p <= 20) return 'danger'; if(p <= 55) return 'warn'; return 'ok'; }
  function colorFromPct(p){ if(p <= 20) return 'var(--red)'; if(p <= 40) return 'var(--orange)'; if(p <= 65) return 'var(--yellow)'; if(p <= 80) return 'var(--lime)'; return 'var(--green)'; }
  function statusLabel(s){ return {ok:'Healthy', warn:'Need Check', danger:'Urgent'}[s] || 'Unknown'; }
  function partStatusLabel(s){ return {ok:'Aman', check:'Perlu Cek', worn:'Aus/Lemah', broken:'Rusak', replaced:'Diganti', modif:'Modif', wishlist:'Wishlist'}[s] || s; }
  function healthScore(){
    const svc = state.serviceComponents.map(serviceHealth).map(x=>x.pct);
    const chk = state.bikeChecks.map(checkHealth).map(x=>x.pct);
    const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 100;
    return Math.round(avg(svc)*0.62 + avg(chk)*0.28 + fuelHealth().pct*0.10);
  }
  function ringHtml(pct, cls=''){
    return `<div class="health-ring ${cls}" style="--pct:${pct};--ring:${colorFromPct(pct)}"><span>${pct}%</span></div>`;
  }

  function renderIconsLater(root=document){ requestAnimationFrame(()=>hydrateIcons(root)); }

  function switchTab(tab){
    $$('.bottom-nav button').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
    $$('.page').forEach(p=>p.classList.toggle('active', p.dataset.page===tab));
    closeDial();
    if(tab==='home') renderHome();
    if(tab==='garage') renderGarage();
    if(tab==='fuel') renderFuel();
    if(tab==='ai') renderAI();
  }
  function switchGarage(tab){
    $$('#garage-tabs button').forEach(b=>b.classList.toggle('active', b.dataset.garageTab===tab));
    $$('.garage-pane').forEach(p=>p.classList.toggle('active', p.id === 'garage-' + tab));
    renderGarage();
  }

  function getTimeline(limit=8){
    const rides = state.rides.map(r => ({type:'Ride', title:`Ride +${fmt.km(r.distance)}`, amount:'', ts:r.ts, icon:'ride', sub:`${fmt.min(r.durationMs)} · ${Math.round(r.avgSpeed)} km/j`}));
    const exp = state.expenses.map(e => ({type:e.category, title:e.title, amount:fmt.rp(e.amount), ts:e.ts, icon:e.category==='Fuel'?'fuel':e.category==='Service'?'wrench':e.category==='Modif'?'star':'money', sub:fmt.date(e.ts)}));
    return [...rides, ...exp].sort((a,b)=>b.ts-a.ts).slice(0,limit);
  }

  function priorityItems(limit=5){
    const svc = state.serviceComponents.map(c => {
      const h = serviceHealth(c);
      return {kind:'Service', name:c.name, icon:c.icon, pct:h.pct, tone:h.status, score:(100-h.pct)+(h.status==='danger'?45:h.status==='warn'?18:0), sub:componentSub(h), go:'service'};
    });
    const checks = state.bikeChecks.filter(p => p.status !== 'ok').map(p => {
      const h = checkHealth(p);
      return {kind:'Bike Check', name:p.name, icon:p.icon, pct:h.pct, tone:h.status, score:(100-h.pct)+(p.status==='broken'?45:p.status==='worn'?25:12), sub:partStatusLabel(p.status), go:'check'};
    });
    const fuel = fuelHealth();
    const fuelItem = fuel.pct < 88 ? [{kind:'Fuel', name:'Konsumsi BBM', icon:'fuel', pct:fuel.pct, tone:fuel.pct<60?'danger':'warn', score:100-fuel.pct+10, sub:`${state.fuelState.kmPerLiter.toFixed(0)} km/L · pantau boros`, go:'fuel'}] : [];
    return [...svc, ...checks, ...fuelItem].sort((a,b)=>b.score-a.score).slice(0, limit);
  }
  function renderPriorityList(){
    const target = el('priority-list'); if(!target) return;
    const items = priorityItems(5);
    target.innerHTML = items.length ? items.map((it,i)=>`
      <button class="priority-item ${it.tone}" data-go="${it.go==='fuel'?'fuel':'garage'}" ${it.go!=='fuel' ? `data-garage-tab="${it.go}"` : ''}>
        <span class="priority-num">${i+1}</span>
        <span class="row-icon" data-icon="${it.icon}"></span>
        <span class="priority-main"><b>${esc(it.name)}</b><small>${esc(it.kind)} · ${esc(it.sub || 'cek detail')}</small></span>
        ${ringHtml(it.pct)}
      </button>`).join('') : `<div class="empty">Belum ada prioritas. Beat lagi aman.</div>`;
    renderIconsLater(target);
  }

  function renderHome(){
    el('brand-sub').textContent = state.profile.name;
    el('home-bike-name').textContent = state.profile.name;
    el('home-bike-meta').textContent = `${state.profile.kmMode === 'virtual' ? 'Virtual Odometer aktif' : 'Actual Odometer'}${state.profile.plate ? ' · ' + state.profile.plate : ''}`;
    el('home-km').textContent = fmt.km(state.profile.virtualKm);
    const score = healthScore();
    const ring = el('home-health-ring'); ring.style.setProperty('--pct', score); ring.style.setProperty('--ring', colorFromPct(score));
    el('home-health-pct').textContent = score + '%';
    const urgentSvc = state.serviceComponents.map(c=>({c,h:serviceHealth(c)})).filter(x=>x.h.status==='danger');
    const warnSvc = state.serviceComponents.map(c=>({c,h:serviceHealth(c)})).filter(x=>x.h.status==='warn');
    const badParts = state.bikeChecks.filter(p=>['check','worn','broken'].includes(p.status));
    const strip = el('home-status-strip');
    const dot = $('.dot', strip); dot.className = 'dot ' + (score<=50?'danger':score<=75?'warn':'ok');
    el('home-status-title').textContent = score<=50 ? 'Urgent Check' : score<=75 ? 'Need Check' : 'All Good';
    el('home-status-sub').textContent = urgentSvc.length ? `${urgentSvc.length} service urgent · ${badParts.length} part perlu cek` : warnSvc.length ? `${warnSvc.length} service soon · ${badParts.length} part perlu cek` : badParts.length ? `${badParts.length} part perlu cek` : 'Semua komponen utama aman.';

    const serviceItems = state.serviceComponents.map(c=>({type:'service', id:c.id, name:c.name, icon:c.icon, h:serviceHealth(c)}));
    const checkItems = state.bikeChecks.filter(p=>p.status!=='ok').map(p=>({type:'check', id:p.id, name:p.name, icon:p.icon, h:checkHealth(p), sub:partStatusLabel(p.status)}));
    let items = [...serviceItems, ...checkItems].sort((a,b)=>a.h.pct-b.h.pct).slice(0,8);
    if(items.length < 8) items = [...items, ...serviceItems.filter(x=>!items.find(y=>y.id===x.id)).slice(0,8-items.length)];
    el('home-components').innerHTML = items.map(it => `
      <button class="component-card" data-go="garage" data-garage-tab="${it.type==='service'?'service':'check'}">
        <div class="tile-icon" data-icon="${it.icon}"></div>
        <div class="component-info"><b>${esc(it.name)}</b><small>${it.type==='service' ? componentSub(it.h) : esc(it.sub)}</small></div>
        ${ringHtml(it.h.pct)}
      </button>`).join('') || `<div class="empty">Belum ada data komponen.</div>`;
    renderIconsLater(el('home-components'));
    renderPriorityList();
    el('ai-insight').innerHTML = generateInsight();
    renderTimeline(el('home-timeline'), getTimeline(5));
  }
  function componentSub(h){
    const km = h.kmLeft == null ? '' : (h.kmLeft < 0 ? `${fmt.km(Math.abs(h.kmLeft))} lewat` : `${fmt.km(h.kmLeft)} left`);
    const d = h.dayLeft == null ? '' : (h.dayLeft < 0 ? `${Math.abs(h.dayLeft)} hari lewat` : `${h.dayLeft} hari`);
    return [km,d].filter(Boolean).join(' / ');
  }
  function generateInsight(){
    const top = priorityItems(1)[0];
    const worstSvc = state.serviceComponents.map(c=>({c,h:serviceHealth(c)})).sort((a,b)=>a.h.pct-b.h.pct)[0];
    const badPart = state.bikeChecks.find(p=>['broken','worn','check'].includes(p.status));
    const fuel = fuelHealth();
    if(top && top.score > 90) return `Bos, prioritas nomor satu sekarang <b>${esc(top.name)}</b>. Statusnya ${top.pct}% healthy, jangan ditunda kalau dipakai harian.`;
    if(worstSvc && worstSvc.h.pct <= 20) return `Bos, <b>${esc(worstSvc.c.name)}</b> sudah urgent. Prioritasin dulu, estimasi budget sekitar <b>${fmt.rp(worstSvc.c.estimate)}</b>.`;
    if(badPart) return `Bos, <b>${esc(badPart.name)}</b> statusnya <b>${partStatusLabel(badPart.status)}</b>. Masukin prioritas cek di Garage biar health naik.`;
    if(worstSvc && worstSvc.h.pct <= 55) return `Bos, <b>${esc(worstSvc.c.name)}</b> mulai dekat jadwal. Sisa ${componentSub(worstSvc.h)}.`;
    if(fuel.pct < 80) return `Fuel agak turun. Coba pantau tekanan ban, filter udara, dan CVT kalau konsumsi makin boros.`;
    return `Beat masih sehat. Tetap update Virtual KM, fuel, dan bike check biar NGR Health tetap akurat.`;
  }

  function renderGarage(){
    const active = $('#garage-tabs button.active')?.dataset.garageTab || 'service';
    if(active==='service') renderServiceList();
    if(active==='check') renderCheckList();
    if(active==='modif') renderModif();
    if(active==='style') renderStyles();
    if(active==='expense') renderExpenses();
  }
  function renderServiceList(){
    const pkgStrip = el('service-package-strip');
    if(pkgStrip){
      pkgStrip.innerHTML = SERVICE_PACKAGES.map(pkg => `<button class="package-chip" data-action="service-package" data-package="${pkg.id}"><span data-icon="${pkg.icon}"></span><b>${esc(pkg.name)}</b><small>${esc(pkg.desc)}</small></button>`).join('');
      renderIconsLater(pkgStrip);
    }
    el('service-list').innerHTML = state.serviceComponents.map(c=>{
      const h = serviceHealth(c);
      return `<div class="service-card">
        <div class="row-icon" data-icon="${c.icon}"></div>
        <div class="row-content"><b>${esc(c.name)}</b><small>${componentSub(h)} · terakhir ${fmt.km(c.lastKm)} / ${fmt.date(c.lastDate)}</small></div>
        <div class="row-actions">${ringHtml(h.pct)}<button class="status-pill ${h.status}" data-action="service-id" data-id="${c.id}">Update</button></div>
      </div>`;
    }).join('');
    renderIconsLater(el('service-list'));
  }
  function renderCheckList(){
    const groups = [...new Set(state.bikeChecks.map(p=>p.area))];
    el('check-list').innerHTML = groups.map(area => `
      <div class="check-group"><p class="eyebrow" style="margin:8px 2px">${esc(area)}</p>${state.bikeChecks.filter(p=>p.area===area).map(p=>{
        const h = checkHealth(p);
        return `<div class="check-card">
          <div class="row-icon" data-icon="${p.icon}"></div>
          <div class="row-content"><b>${esc(p.name)}</b><small>${partStatusLabel(p.status)}${p.note ? ' · ' + esc(p.note) : ''}</small></div>
          <div class="row-actions">${ringHtml(h.pct)}<button class="status-pill ${h.status}" data-action="check-id" data-id="${p.id}">Set</button></div>
        </div>`;
      }).join('')}</div>`).join('');
    renderIconsLater(el('check-list'));
  }
  function renderModif(){
    const s = state.savings; const left = Math.max(0, safeNum(s.target)-safeNum(s.collected)); const pct = s.target ? clamp(s.collected/s.target*100,0,100) : 0;
    el('saving-collected').textContent = fmt.rp(s.collected); el('saving-target').textContent = fmt.rp(s.target); el('saving-left').textContent = fmt.rp(left); el('saving-bar').style.width = pct + '%';
    el('mod-list').innerHTML = state.mods.length ? state.mods.map(m=>`<div class="mod-card">
      <div class="row-icon" data-icon="star"></div><div class="row-content"><b>${esc(m.name)}</b><small>${fmt.rp(m.price)} · ${esc(m.status)}${m.note?' · '+esc(m.note):''}</small></div>
      <span class="status-pill ${m.status==='terpasang'?'ok':m.status==='dibeli'?'warn':''}">${esc(m.status)}</span>
    </div>`).join('') : `<div class="empty">Belum ada wishlist part.</div>`;
    renderIconsLater(el('mod-list'));
  }
  function renderStyles(){
    el('style-list').innerHTML = state.styles.length ? state.styles.map(s=>`<div class="style-card">
      <div class="row-icon" data-icon="star"></div><div class="row-content"><b>${esc(s.name)}</b><small>${esc(s.desc)} · ${fmt.rp(s.budget)} · ${esc(s.status)}</small></div>
    </div>`).join('') : `<div class="empty">Belum ada ide style. Tambah konsep modifan pertama.</div>`;
    renderIconsLater(el('style-list'));
  }
  function monthFilter(ts){ const d=new Date(ts), n=new Date(); return d.getMonth()===n.getMonth() && d.getFullYear()===n.getFullYear(); }
  function renderExpenses(){
    const month = state.expenses.filter(e=>monthFilter(e.ts));
    const sum = cat => month.filter(e=>cat==='all'||e.category===cat).reduce((a,b)=>a+safeNum(b.amount),0);
    el('exp-month').textContent = fmt.rp(sum('all')); el('exp-fuel').textContent = fmt.rp(sum('Fuel')); el('exp-service').textContent = fmt.rp(sum('Service')); el('exp-modif').textContent = fmt.rp(sum('Modif'));
    const monthKm = state.rides.filter(r=>monthFilter(r.ts)).reduce((a,b)=>a+safeNum(b.distance),0);
    const costPerKm = monthKm > 0 ? Math.round(sum('all') / monthKm) : 0;
    const cpk = el('exp-cost-km'); if(cpk) cpk.textContent = costPerKm ? `${fmt.rp(costPerKm)}/km` : 'Belum ada ride';
    renderTimeline(el('expense-list'), getTimeline(40));
  }
  function renderTimeline(target, items){
    target.innerHTML = items.length ? items.map(t=>`<div class="timeline-item"><div class="row-icon" data-icon="${t.icon}"></div><div class="timeline-main"><b>${esc(t.title)}</b><small>${esc(t.sub || fmt.date(t.ts))}</small></div>${t.amount ? `<div class="timeline-amount">${esc(t.amount)}</div>` : ''}</div>`).join('') : `<div class="empty">Belum ada history.</div>`;
    renderIconsLater(target);
  }

  function renderFuel(){
    el('fuel-liters').textContent = fmt.liter(state.fuelState.liters);
    el('fuel-kml').textContent = (state.fuelState.kmPerLiter || 55).toFixed(0);
    el('fuel-range').textContent = 'Range ± ' + fmt.km(state.fuelState.liters * state.fuelState.kmPerLiter);
    const monthFuel = state.expenses.filter(e=>e.category==='Fuel' && monthFilter(e.ts)).reduce((a,b)=>a+safeNum(b.amount),0);
    el('fuel-spend-month').textContent = fmt.rp(monthFuel);
    const liters = [1,2,3];
    el('fuel-shortcuts').innerHTML = FUEL_TYPES.flatMap(f => liters.map(l => {
      const price = safeNum(state.fuelSettings.prices[f.id] || f.price) * l;
      return `<button class="fuel-btn" data-action="fuel-shortcut" data-fuel="${f.id}" data-liter="${l}"><b>${esc(f.name)}</b><strong>${l}L</strong><small>${fmt.rp(price)}</small></button>`;
    })).join('');
    el('fuel-log').innerHTML = state.fuels.length ? state.fuels.slice(0,30).map(f=>`<div class="timeline-item"><div class="row-icon" data-icon="fuel"></div><div class="timeline-main"><b>${esc(f.type)} · ${fmt.liter(f.liters)}</b><small>${fmt.date(f.ts)} · ${fmt.km(f.km)}</small></div><div class="timeline-amount">${fmt.rp(f.price)}</div></div>`).join('') : `<div class="empty">Belum ada riwayat fuel.</div>`;
    renderIconsLater(el('fuel-log'));
    drawFuelChart();
  }
  function drawFuelChart(){
    const canvas = el('fuel-chart'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); const dpr = devicePixelRatio || 1; const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, rect.width*dpr); canvas.height = 140*dpr; ctx.scale(dpr,dpr); ctx.clearRect(0,0,rect.width,140);
    const rows = state.fuels.slice(0,8).reverse(); const max = Math.max(10000, ...rows.map(f=>f.price));
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.moveTo(0,118); ctx.lineTo(rect.width,118); ctx.stroke();
    rows.forEach((f,i)=>{ const w = rect.width / Math.max(rows.length,1); const x = i*w + w*.18; const h = (f.price/max)*96; const y = 118-h; const grd=ctx.createLinearGradient(0,y,0,118); grd.addColorStop(0,'#2d8cff'); grd.addColorStop(1,'#35d07f'); ctx.fillStyle=grd; roundRect(ctx,x,y,w*.64,h,8); ctx.fill(); });
    if(!rows.length){ ctx.fillStyle='rgba(255,255,255,.45)'; ctx.font='12px Inter'; ctx.textAlign='center'; ctx.fillText('Belum ada data fuel', rect.width/2, 72); }
  }
  function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

  function renderAI(){
    el('ai-key').value = state.ai.key || ''; el('ai-model').value = state.ai.model || 'openai/gpt-4o-mini'; el('ai-base-url').value = state.ai.baseUrl || 'https://openrouter.ai/api/v1/chat/completions';
    const intro = {role:'assistant', content:'Halo bos! Kang Rusdi siap baca data NGR Health, service, fuel, bike check, modif, dan expense. Tanya aja kondisi Beat kamu.'};
    const msgs = state.ai.chat.length ? state.ai.chat : [intro];
    el('chat-list').innerHTML = msgs.map(m=>`<div class="bubble ${m.role==='user'?'user':'ai'}">${esc(m.content)}</div>`).join('');
    requestAnimationFrame(()=>{ const s=el('ai-scroll'); s.scrollTop=s.scrollHeight; });
  }

  const sheet = el('sheet'), overlay = el('sheet-overlay');
  function openSheet(html){
    closeDial(); sheet.innerHTML = `<div class="sheet-handle"></div>${html}`; overlay.classList.add('open'); sheet.classList.add('open'); hydrateIcons(sheet);
  }
  function closeSheet(){ overlay.classList.remove('open'); sheet.classList.remove('open'); setTimeout(()=>{ if(!sheet.classList.contains('open')) sheet.innerHTML=''; }, 260); }
  function sheetTitle(title, sub=''){ return `<div class="sheet-title"><div><h3>${title}</h3>${sub?`<p>${sub}</p>`:''}</div><button class="sheet-close" data-action="close-sheet">✕</button></div>`; }

  function smartPicker(id, options, selected, cls=''){
    return `<div class="smart-picker ${cls}" id="${id}" data-picker="${id}" data-value="${esc(selected || '')}">${options.map(o=>{
      const active = String(o.value) === String(selected);
      const icon = o.icon ? `<span class="pick-icon" data-icon="${o.icon}"></span>` : '';
      const tone = o.tone ? ` ${o.tone}` : '';
      const sub = o.sub ? `<small>${esc(o.sub)}</small>` : '';
      const meta = o.meta ? `<em>${esc(o.meta)}</em>` : '';
      return `<button type="button" class="pick-option${active?' active':''}${tone}" data-pick="${esc(o.value)}">${icon}<span><b>${esc(o.label)}</b>${sub}</span>${meta}</button>`;
    }).join('')}</div>`;
  }
  function getPickerValue(id){ return el(id)?.dataset.value || $(`#${id} .pick-option.active`)?.dataset.pick || ''; }
  function fuelPriceFor(id){ const ft = FUEL_TYPES.find(x=>x.id===id) || FUEL_TYPES[0]; return safeNum(state.fuelSettings.prices[ft.id] || ft.price); }
  function updateActivePicker(btn){ const picker = btn.closest('[data-picker]'); if(!picker) return; $$('.pick-option', picker).forEach(x=>x.classList.toggle('active', x===btn)); picker.dataset.value = btn.dataset.pick; picker.dispatchEvent(new CustomEvent('pickerchange', {detail:{value:btn.dataset.pick}, bubbles:false})); }

  function openKmSheet(){
    openSheet(`${sheetTitle('Virtual KM', 'Tambah jarak manual kalau gak pakai GPS.')}
      <div class="choice-grid">
        ${[5,10,25,50].map(n=>`<button class="choice" data-action="add-km" data-km="${n}"><b>+${n} km</b><small>Quick add</small></button>`).join('')}
      </div>
      <label class="field"><span>Custom KM</span><input id="km-custom" type="number" inputmode="decimal" placeholder="Contoh 12.5" /></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="add-custom-km">Tambah KM</button></div>`);
  }
  function addKm(km, source='manual'){
    km = Math.max(0, safeNum(km)); if(!km) return toast('KM belum diisi', 'err');
    state.profile.virtualKm += km;
    state.fuelState.liters = Math.max(0, state.fuelState.liters - (km / (state.fuelState.kmPerLiter || 55)));
    state.rides.unshift({id:uid(), source, distance:km, durationMs:0, avgSpeed:0, maxSpeed:0, ts:Date.now(), savedToKm:true});
    save(); closeSheet(); toast(`Virtual KM +${fmt.km(km)}`); renderAll();
  }

  function openServiceSheet(id){
    const c = id ? state.serviceComponents.find(x=>x.id===id) : state.serviceComponents[0];
    const serviceOptions = state.serviceComponents.map(x=>{ const h = serviceHealth(x); return {value:x.id, label:x.name, sub:`${x.category} · ${h.pct}% healthy`, meta:componentSub(h), icon:x.icon, tone:h.status}; });
    openSheet(`${sheetTitle('Catat Service', 'Floating picker, tanpa dropdown jadul. KM & tanggal otomatis.')}
      <div class="mini-caption">Pilih komponen</div>
      ${smartPicker('svc-picker', serviceOptions, c.id, 'picker-list compact')}
      <div class="form-grid"><label class="field"><span>KM Service</span><input id="svc-km" type="number" value="${state.profile.virtualKm}" /></label><label class="field"><span>Tanggal</span><input id="svc-date" type="date" value="${todayISO()}" /></label></div>
      <div class="form-grid"><label class="field"><span>Biaya</span><input id="svc-cost" type="number" placeholder="${c.estimate}" /></label><label class="field"><span>Merk / Part</span><input id="svc-brand" placeholder="Federal, AHMP, dll" /></label></div>
      <label class="field"><span>Catatan</span><textarea id="svc-note" placeholder="Catatan service..."></textarea></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-service">Simpan</button></div>`);
  }
  function saveService(){
    const c = state.serviceComponents.find(x=>x.id===getPickerValue('svc-picker')); if(!c) return;
    const km = safeNum(el('svc-km').value); const date = el('svc-date').value || todayISO(); const cost = safeNum(el('svc-cost').value); const brand = el('svc-brand').value.trim(); const note = el('svc-note').value.trim();
    const entry = {id:uid(), km, date, cost, brand, note, ts:Date.now()};
    c.lastKm = km; c.lastDate = date; c.brand = brand; c.note = note; c.history.unshift(entry);
    if(cost>0) state.expenses.unshift({id:uid(), category:'Service', title:c.name, amount:cost, ts:Date.now(), note:[brand,note].filter(Boolean).join(' · ')});
    save(); closeSheet(); toast('Service tersimpan'); renderAll();
  }

  function openServicePackageSheet(packageId='light'){
    const pkgOptions = SERVICE_PACKAGES.map(pkg => {
      const est = pkg.items.map(id => state.serviceComponents.find(c=>c.id===id)?.estimate || 0).reduce((a,b)=>a+b,0);
      return {value:pkg.id, label:pkg.name, sub:pkg.desc, meta:fmt.rp(est), icon:pkg.icon, tone:'ok'};
    });
    const current = SERVICE_PACKAGES.find(p=>p.id===packageId) || SERVICE_PACKAGES[0];
    const currentEst = current.items.map(id => state.serviceComponents.find(c=>c.id===id)?.estimate || 0).reduce((a,b)=>a+b,0);
    openSheet(`${sheetTitle('Service Package', 'Sekali simpan, beberapa komponen langsung refresh healthy 100%.')}
      <div class="mini-caption">Pilih paket</div>
      ${smartPicker('pkg-picker', pkgOptions, current.id, 'picker-list compact')}
      <div class="form-grid"><label class="field"><span>KM Service</span><input id="pkg-km" type="number" value="${state.profile.virtualKm}" /></label><label class="field"><span>Tanggal</span><input id="pkg-date" type="date" value="${todayISO()}" /></label></div>
      <label class="field"><span>Total Biaya</span><input id="pkg-cost" type="number" value="${currentEst}" /></label>
      <label class="field"><span>Catatan</span><textarea id="pkg-note" placeholder="Servis ringan / CVT / safety check..."></textarea></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-service-package">Simpan Paket</button></div>`);
    el('pkg-picker').addEventListener('pickerchange', () => {
      const pkg = SERVICE_PACKAGES.find(p=>p.id===getPickerValue('pkg-picker')) || SERVICE_PACKAGES[0];
      const est = pkg.items.map(id => state.serviceComponents.find(c=>c.id===id)?.estimate || 0).reduce((a,b)=>a+b,0);
      el('pkg-cost').value = est;
    });
  }
  function saveServicePackage(){
    const pkg = SERVICE_PACKAGES.find(p=>p.id===getPickerValue('pkg-picker')) || SERVICE_PACKAGES[0];
    const km = safeNum(el('pkg-km').value); const date = el('pkg-date').value || todayISO(); const cost = safeNum(el('pkg-cost').value); const note = el('pkg-note').value.trim();
    const touched = [];
    pkg.items.forEach(id => {
      const c = state.serviceComponents.find(x=>x.id===id); if(!c) return;
      const entry = {id:uid(), km, date, cost:0, brand:pkg.name, note, packageId:pkg.id, ts:Date.now()};
      c.lastKm = km; c.lastDate = date; c.brand = pkg.name; c.note = note || pkg.desc; c.history.unshift(entry); touched.push(c.name);
    });
    if(cost>0) state.expenses.unshift({id:uid(), category:'Service', title:pkg.name, amount:cost, ts:Date.now(), note:touched.join(', ')});
    save(); closeSheet(); toast(`${pkg.name} tersimpan`); renderAll();
  }

  function openCheckSheet(id){
    const p = id ? state.bikeChecks.find(x=>x.id===id) : state.bikeChecks[0];
    const statuses = [
      {value:'ok', label:'Aman', sub:'100% healthy', icon:'check', tone:'ok'},
      {value:'check', label:'Perlu Cek', sub:'60% healthy', icon:'wrench', tone:'warn'},
      {value:'worn', label:'Aus/Lemah', sub:'35% healthy', icon:'brake', tone:'warn'},
      {value:'broken', label:'Rusak', sub:'0% healthy', icon:'lamp', tone:'danger'},
      {value:'replaced', label:'Diganti', sub:'baru / fresh', icon:'check', tone:'ok'},
      {value:'modif', label:'Modif', sub:'custom part', icon:'star', tone:'ok'},
      {value:'wishlist', label:'Wishlist', sub:'rencana beli', icon:'money', tone:'warn'}
    ];
    const partOptions = state.bikeChecks.map(x=>({value:x.id, label:x.name, sub:x.area, icon:x.icon, meta:partStatusLabel(x.status), tone:checkHealth(x).status}));
    openSheet(`${sheetTitle('Bike Check', 'Update kondisi part depan sampai belakang tanpa dropdown bawaan HP.')}
      <div class="mini-caption">Pilih part</div>
      ${smartPicker('check-picker', partOptions, p.id, 'picker-list compact')}
      <div class="mini-caption">Status kondisi</div>
      ${smartPicker('check-statuses', statuses, p.status, 'status-picker')}
      <label class="field"><span>Catatan</span><textarea id="check-note" placeholder="Contoh: retak kecil, lampu redup...">${esc(p.note||'')}</textarea></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-check">Simpan</button></div>`);
  }
  function saveCheck(){
    const p = state.bikeChecks.find(x=>x.id===getPickerValue('check-picker')); if(!p) return;
    p.status = getPickerValue('check-statuses') || 'ok'; p.note = el('check-note').value.trim(); p.ts = Date.now();
    save(); closeSheet(); toast('Bike check update'); renderAll();
  }

  function openFuelSheet(typeId='pertalite', liters=1, custom=false){
    const f = FUEL_TYPES.find(x=>x.id===typeId) || FUEL_TYPES[0]; const pricePer = fuelPriceFor(f.id); const total = Math.round(pricePer * liters);
    const fuelOptions = FUEL_TYPES.map(x=>({value:x.id, label:x.name, sub:`${fmt.rp(fuelPriceFor(x.id))} / L`, icon:'fuel', tone:x.id===f.id?'ok':''}));
    openSheet(`${sheetTitle(custom?'Input Fuel Custom':'Konfirmasi Fuel', 'Shortcut cepat, tetap bisa edit sebelum simpan.')}
      <div class="fuel-confirm">
        <div class="fuel-confirm-icon" data-icon="fuel"></div>
        <div><b id="fuel-preview-name">${esc(f.name)}</b><small id="fuel-preview-sub">${liters} L · ${fmt.rp(total)}</small></div>
      </div>
      <div class="mini-caption">Bahan bakar</div>
      ${smartPicker('fuel-type-picker', fuelOptions, f.id, 'fuel-picker')}
      <div class="mini-caption">Liter cepat</div>
      ${smartPicker('fuel-liter-picker', [1,2,3,5].map(n=>({value:String(n), label:`${n} Liter`, sub:fmt.rp(Math.round(pricePer*n)), icon:'fuel'})), String(liters), 'liter-picker')}
      <div class="form-grid"><label class="field"><span>Liter</span><input id="fuel-lit" type="number" inputmode="decimal" step="0.01" value="${liters}" /></label><label class="field"><span>Total Harga</span><input id="fuel-price" type="number" value="${total}" /></label></div>
      <label class="field"><span>Virtual KM</span><input id="fuel-km" type="number" value="${state.profile.virtualKm}" /></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-fuel">Simpan Fuel</button></div>`);
    const refresh = (fromLiterPicker=false) => {
      const ft = FUEL_TYPES.find(x=>x.id===getPickerValue('fuel-type-picker')) || FUEL_TYPES[0];
      if(fromLiterPicker) el('fuel-lit').value = getPickerValue('fuel-liter-picker');
      const p = fuelPriceFor(ft.id), lit=safeNum(el('fuel-lit').value || 0), total=Math.round(p*lit);
      el('fuel-price').value = total; el('fuel-preview-name').textContent = ft.name; el('fuel-preview-sub').textContent = `${lit || 0} L · ${fmt.rp(total)}`;
      $$('#fuel-liter-picker .pick-option').forEach(btn=>{ const n=safeNum(btn.dataset.pick); const small=btn.querySelector('small'); if(small) small.textContent = fmt.rp(Math.round(p*n)); });
    };
    el('fuel-lit').addEventListener('input', ()=>refresh(false));
    el('fuel-type-picker').addEventListener('pickerchange', ()=>refresh(false));
    el('fuel-liter-picker').addEventListener('pickerchange', ()=>refresh(true));
  }
  function saveFuel(){
    const ft = FUEL_TYPES.find(x=>x.id===getPickerValue('fuel-type-picker')) || FUEL_TYPES[0]; const liters=safeNum(el('fuel-lit').value); const price=safeNum(el('fuel-price').value); const km=safeNum(el('fuel-km').value);
    if(!liters || !price) return toast('Liter/harga belum lengkap', 'err');
    state.profile.virtualKm = Math.max(state.profile.virtualKm, km); state.fuelState.liters += liters;
    const rec = {id:uid(), type:ft.name, typeId:ft.id, liters, price, km:state.profile.virtualKm, ts:Date.now()};
    state.fuels.unshift(rec); state.expenses.unshift({id:uid(), category:'Fuel', title:`${ft.name} ${liters}L`, amount:price, ts:rec.ts, note:`KM ${fmt.km(rec.km)}`});
    updateKmPerLiter(); save(); closeSheet(); toast('Fuel tersimpan'); renderAll();
  }
  function updateKmPerLiter(){
    const fs = state.fuels.slice().sort((a,b)=>a.ts-b.ts);
    if(fs.length >= 2){ const last = fs.at(-1), prev = fs.at(-2); const dist = Math.max(0, last.km - prev.km); if(dist > 0 && prev.liters > 0) state.fuelState.kmPerLiter = clamp(dist / prev.liters, 20, 80); }
  }
  function openFuelSettings(){
    openSheet(`${sheetTitle('Harga BBM', 'Default bisa kamu edit kapan aja.')}
      ${FUEL_TYPES.map(f=>`<label class="field"><span>${f.name} / liter</span><input id="price-${f.id}" type="number" value="${state.fuelSettings.prices[f.id] || f.price}" /></label>`).join('')}
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-fuel-settings">Simpan Harga</button></div>`);
  }
  function saveFuelSettings(){ FUEL_TYPES.forEach(f=>state.fuelSettings.prices[f.id]=safeNum(el(`price-${f.id}`).value)||f.price); save(); closeSheet(); toast('Harga BBM disimpan'); renderFuel(); }

  function openSavingSheet(){
    openSheet(`${sheetTitle('Celengan Modif', 'Tambah dana atau pakai dana untuk part.')}
      <label class="field"><span>Target Dana</span><input id="sav-target" type="number" value="${state.savings.target}" /></label>
      <div class="form-grid"><label class="field"><span>Tambah Dana</span><input id="sav-add" type="number" placeholder="100000" /></label><label class="field"><span>Pakai Dana</span><input id="sav-use" type="number" placeholder="0" /></label></div>
      <label class="field"><span>Catatan</span><input id="sav-note" placeholder="Nabung / beli part" /></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-saving">Simpan</button></div>`);
  }
  function saveSaving(){
    const target=safeNum(el('sav-target').value); const add=safeNum(el('sav-add').value); const use=safeNum(el('sav-use').value); const note=el('sav-note').value.trim();
    state.savings.target = target; state.savings.collected = Math.max(0, state.savings.collected + add - use);
    if(add) state.savings.tx.unshift({id:uid(), type:'in', amount:add, note, ts:Date.now()});
    if(use){ state.savings.tx.unshift({id:uid(), type:'out', amount:use, note, ts:Date.now()}); state.expenses.unshift({id:uid(), category:'Modif', title:note||'Pakai dana celengan', amount:use, ts:Date.now(), note:'Celengan Modif'}); }
    save(); closeSheet(); toast('Celengan disimpan'); renderAll();
  }
  function openModifSheet(){
    const statusOptions = [
      {value:'wishlist', label:'Wishlist', sub:'masih incaran', icon:'star', tone:'warn'},
      {value:'dibeli', label:'Dibeli', sub:'sudah keluar uang', icon:'money', tone:'warn'},
      {value:'terpasang', label:'Terpasang', sub:'sudah di motor', icon:'check', tone:'ok'}
    ];
    openSheet(`${sheetTitle('Tambah Part Modif', 'Floating card input, bukan form jadul.')}
      <label class="field hero-input"><span>Nama Part</span><input id="mod-name" placeholder="Velg, shock, lampu..." /></label>
      <div class="mini-caption">Status part</div>
      ${smartPicker('mod-status-picker', statusOptions, 'wishlist', 'status-picker')}
      <div class="form-grid"><label class="field"><span>Harga</span><input id="mod-price" type="number" placeholder="850000" /></label><label class="field"><span>Kategori</span><input id="mod-cat" placeholder="Kaki-kaki, body..." /></label></div>
      <label class="field"><span>Link toko</span><input id="mod-link" placeholder="https://..." /></label>
      <label class="field"><span>Catatan</span><textarea id="mod-note" placeholder="Alasan, style, spek..."></textarea></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-modif">Simpan</button></div>`);
  }
  function saveModif(){
    const name=el('mod-name').value.trim(); if(!name) return toast('Nama part wajib diisi', 'err'); const price=safeNum(el('mod-price').value); const status=getPickerValue('mod-status-picker') || 'wishlist';
    state.mods.unshift({id:uid(), name, price, status, link:el('mod-link').value.trim(), img:'', note:el('mod-note').value.trim(), category:el('mod-cat').value.trim()||'Modif', ts:Date.now()});
    if(price && status !== 'wishlist') state.expenses.unshift({id:uid(), category:'Modif', title:name, amount:price, ts:Date.now(), note:status});
    save(); closeSheet(); toast('Part tersimpan'); renderAll();
  }
  function openStyleSheet(){
    const styleStatus = [
      {value:'Ide', label:'Ide', sub:'masih konsep', icon:'star', tone:'warn'},
      {value:'Proses', label:'Proses', sub:'lagi dibangun', icon:'wrench', tone:'warn'},
      {value:'Selesai', label:'Selesai', sub:'final look', icon:'check', tone:'ok'}
    ];
    openSheet(`${sheetTitle('Style Idea', 'Konsep modifan clean, pakai status card modern.')}
      <label class="field hero-input"><span>Nama Konsep</span><input id="style-name" placeholder="Daily Proper Dark Blue" /></label>
      <label class="field"><span>Deskripsi</span><textarea id="style-desc" placeholder="Velg silver, ban proper, decal minimal..."></textarea></label>
      <div class="mini-caption">Status style</div>
      ${smartPicker('style-status-picker', styleStatus, 'Ide', 'status-picker')}
      <label class="field"><span>Estimasi Budget</span><input id="style-budget" type="number" placeholder="2500000" /></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-style">Simpan</button></div>`);
  }
  function saveStyle(){ const name=el('style-name').value.trim(); if(!name) return toast('Nama style wajib diisi','err'); state.styles.unshift({id:uid(), name, desc:el('style-desc').value.trim(), budget:safeNum(el('style-budget').value), status:getPickerValue('style-status-picker') || 'Ide', ts:Date.now()}); save(); closeSheet(); toast('Style disimpan'); renderAll(); }
  function openExpenseSheet(){
    const cats = ['Service','Modif','Fuel','Tools','Sparepart','Other'].map(c=>({value:c, label:c, sub:c==='Fuel'?'BBM':c==='Service'?'perawatan':c==='Modif'?'part/style':'biaya', icon:c==='Fuel'?'fuel':c==='Modif'?'star':c==='Service'?'wrench':'money'}));
    openSheet(`${sheetTitle('Tambah Expense', 'Semua biaya masuk history detail.')}
      <label class="field hero-input"><span>Judul</span><input id="exp-title" placeholder="Beli tools / sparepart" /></label>
      <div class="mini-caption">Kategori</div>
      ${smartPicker('exp-cat-picker', cats, 'Service', 'status-picker')}
      <label class="field"><span>Nominal</span><input id="exp-amount" type="number" placeholder="50000" /></label>
      <label class="field"><span>Catatan</span><textarea id="exp-note"></textarea></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-expense">Simpan</button></div>`);
  }
  function saveExpense(){ const title=el('exp-title').value.trim(); const amount=safeNum(el('exp-amount').value); if(!title||!amount) return toast('Judul/nominal belum lengkap','err'); state.expenses.unshift({id:uid(), category:getPickerValue('exp-cat-picker') || 'Other', title, amount, note:el('exp-note').value.trim(), ts:Date.now()}); save(); closeSheet(); toast('Expense tersimpan'); renderAll(); }

  let tracker = null;
  function openRideSheet(){
    openSheet(`${sheetTitle('NGR Ride Lite', 'Offline GPS tanpa map. Jarak masuk KM hanya kalau disimpan.')}
      <div class="tracker-display"><div class="tracker-distance" id="trk-dist">0.00</div><div class="muted">kilometer</div></div>
      <div class="tracker-meta"><div><b id="trk-time">0m</b><small>Durasi</small></div><div><b id="trk-speed">0</b><small>km/j</small></div><div><b id="trk-max">0</b><small>max</small></div></div>
      <div class="form-actions" id="trk-actions"><button class="save-btn" data-action="tracker-start">GO</button><button class="cancel-btn" data-action="close-sheet">Tutup</button></div>`);
  }
  function haversine(a,b){ const R=6371e3, toRad=x=>x*Math.PI/180; const p1=toRad(a.lat), p2=toRad(b.lat), dp=toRad(b.lat-a.lat), dl=toRad(b.lon-a.lon); const s=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2; return 2*R*Math.atan2(Math.sqrt(s),Math.sqrt(1-s)); }
  function startTracker(){
    if(!navigator.geolocation) return toast('GPS tidak tersedia', 'err');
    tracker = {watchId:null, start:Date.now(), paused:false, pauseStart:0, pausedMs:0, last:null, distance:0, maxSpeed:0, bad:0, points:0, tick:null};
    tracker.watchId = navigator.geolocation.watchPosition(pos=>{
      if(!tracker || tracker.paused) return;
      const c = pos.coords; const p = {lat:c.latitude, lon:c.longitude, ts:pos.timestamp, acc:c.accuracy || 999};
      if(p.acc > 70){ tracker.bad++; return; }
      if(tracker.last){
        const d = haversine(tracker.last, p); const dt = Math.max(.001, (p.ts - tracker.last.ts)/1000); const speedKmh = (d/dt)*3.6;
        if(d < 250 && speedKmh < 130){ tracker.distance += d; tracker.maxSpeed = Math.max(tracker.maxSpeed, speedKmh); tracker.points++; }
        else tracker.bad++;
      }
      tracker.last = p;
      if(c.speed != null && c.speed >= 0) tracker.maxSpeed = Math.max(tracker.maxSpeed, c.speed*3.6);
      updateTrackerUI();
    }, err=>toast('GPS: ' + err.message, 'err'), {enableHighAccuracy:true, maximumAge:1000, timeout:10000});
    tracker.tick = setInterval(updateTrackerUI, 1000);
    $('#trk-actions').innerHTML = `<button class="cancel-btn" data-action="tracker-pause">Pause</button><button class="save-btn" data-action="tracker-stop">Stop</button>`;
    toast('Ride dimulai');
  }
  function trackerDuration(){ if(!tracker) return 0; return Date.now() - tracker.start - tracker.pausedMs - (tracker.paused ? Date.now()-tracker.pauseStart : 0); }
  function updateTrackerUI(){ if(!tracker || !el('trk-dist')) return; const dur=trackerDuration(); const km=tracker.distance/1000; const avg=dur ? km/(dur/3600000) : 0; el('trk-dist').textContent = km.toFixed(2); el('trk-time').textContent = fmt.min(dur); el('trk-speed').textContent = Math.round(avg); el('trk-max').textContent = Math.round(tracker.maxSpeed); }
  function pauseTracker(){ if(!tracker) return; tracker.paused = !tracker.paused; if(tracker.paused){ tracker.pauseStart=Date.now(); $('#trk-actions').innerHTML = `<button class="cancel-btn" data-action="tracker-pause">Resume</button><button class="save-btn" data-action="tracker-stop">Stop</button>`; } else { tracker.pausedMs += Date.now()-tracker.pauseStart; $('#trk-actions').innerHTML = `<button class="cancel-btn" data-action="tracker-pause">Pause</button><button class="save-btn" data-action="tracker-stop">Stop</button>`; } }
  function stopTracker(){
    if(!tracker) return; if(tracker.watchId != null) navigator.geolocation.clearWatch(tracker.watchId); clearInterval(tracker.tick);
    const dur=trackerDuration(), km=tracker.distance/1000, avg=dur ? km/(dur/3600000) : 0, max=tracker.maxSpeed;
    const badRatio = tracker.bad / Math.max(1, tracker.bad + tracker.points); let detect='Suspicious', msg='Data agak nanggung, review dulu sebelum masuk KM.';
    if(badRatio > .45){ detect='GPS Unstable'; msg='GPS kurang stabil, jarak mungkin kurang akurat.'; }
    else if(avg < 8 && max < 15){ detect='Looks Like Walking'; msg='Bos, ini kelihatan kayak jalan kaki/jogging. Jangan masukin ke KM motor dulu?'; }
    else if((avg >= 12 || max >= 20) && km >= .5){ detect='Motor Ride'; msg='Trip terlihat seperti ride motor. Aman buat masuk Virtual KM.'; }
    const summary = {distance:km, durationMs:dur, avgSpeed:avg, maxSpeed:max, detect, msg, ts:Date.now()}; tracker = null;
    openSheet(`${sheetTitle('Review Ride', 'KM belum masuk sebelum kamu simpan.')}
      <div class="tracker-display"><div class="tracker-distance">${km.toFixed(2)}</div><div class="muted">kilometer</div></div>
      <div class="tracker-meta"><div><b>${fmt.min(dur)}</b><small>Durasi</small></div><div><b>${Math.round(avg)}</b><small>avg km/j</small></div><div><b>${Math.round(max)}</b><small>max km/j</small></div></div>
      <div class="warning-box"><b>${detect}</b><br>${msg}</div>
      <div class="form-actions"><button class="cancel-btn" data-action="discard-ride">Buang</button><button class="cancel-btn" data-action="log-ride-only">Log saja</button><button class="save-btn" data-action="save-ride-km">Simpan KM</button></div>`);
    sheet._rideSummary = summary;
  }
  function saveRide(toKm){
    const r = sheet._rideSummary; if(!r) return closeSheet();
    r.id = uid(); r.savedToKm = !!toKm; state.rides.unshift(r);
    if(toKm){ state.profile.virtualKm += r.distance; state.fuelState.liters = Math.max(0, state.fuelState.liters - (r.distance / (state.fuelState.kmPerLiter || 55))); }
    save(); closeSheet(); toast(toKm ? 'Ride masuk Virtual KM' : 'Ride disimpan sebagai log'); renderAll();
  }

  function saveAISettings(){ state.ai.key=el('ai-key').value.trim(); state.ai.model=el('ai-model').value.trim()||'openai/gpt-4o-mini'; state.ai.baseUrl=el('ai-base-url').value.trim()||'https://openrouter.ai/api/v1/chat/completions'; save(); toast('AI settings disimpan'); }
  function appContext(){
    const worst = state.serviceComponents.map(c=>({name:c.name, health:serviceHealth(c).pct, left:componentSub(serviceHealth(c))})).sort((a,b)=>a.health-b.health).slice(0,5);
    const bad = state.bikeChecks.filter(p=>p.status!=='ok').slice(0,8).map(p=>`${p.name}: ${partStatusLabel(p.status)}`);
    return `Motor: ${state.profile.name}. Virtual KM: ${fmt.km(state.profile.virtualKm)}. NGR Health: ${healthScore()}%. Service prioritas: ${worst.map(w=>`${w.name} ${w.health}% (${w.left})`).join('; ')}. Bike check bermasalah: ${bad.join('; ') || 'tidak ada'}. Fuel: ${fmt.liter(state.fuelState.liters)}, ${state.fuelState.kmPerLiter.toFixed(0)} km/L. Jawab sebagai Kang Rusdi, santai, praktis, Bahasa Indonesia.`;
  }
  async function sendAI(){
    const input = el('ai-input'); const text = input.value.trim(); if(!text) return; if(!state.ai.key) return toast('Isi API Key dulu', 'err');
    state.ai.chat.push({role:'user', content:text}); input.value=''; renderAI();
    state.ai.chat.push({role:'assistant', content:'Kang Rusdi mikir dulu...'}); renderAI();
    try{
      const messages = [{role:'system', content:appContext()}, ...state.ai.chat.filter(m=>m.content!=='Kang Rusdi mikir dulu...').slice(-12)];
      const res = await fetch(state.ai.baseUrl, {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+state.ai.key,'X-Title':'NGR Health Garage'}, body:JSON.stringify({model:state.ai.model, messages})});
      if(!res.ok) throw new Error(await res.text()); const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || data.output_text || 'Maaf bos, respon kosong.';
      state.ai.chat[state.ai.chat.length-1] = {role:'assistant', content:reply}; save(); renderAI();
    }catch(e){ state.ai.chat[state.ai.chat.length-1] = {role:'assistant', content:'Error AI: ' + (e.message || e)}; save(); renderAI(); }
  }

  function exportData(){ const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ngr-health-backup.json'; a.click(); URL.revokeObjectURL(a.href); }
  function importData(file){ const r=new FileReader(); r.onload=()=>{ try{ const data=JSON.parse(r.result); if(!data.profile) throw new Error('File bukan backup NGR'); state = {...createDefaultState(), ...data, version:VERSION}; save(); toast('Backup berhasil diimport'); renderAll(); }catch(e){ toast('Import gagal: '+e.message,'err'); } }; r.readAsText(file); }
  function resetData(){ if(confirm('Reset semua data NGR v2?')){ localStorage.removeItem(LS_KEY); state=createDefaultState(); save(); renderAll(); toast('Data direset'); } }

  function renderAll(){ renderHome(); renderGarage(); renderFuel(); renderAI(); hydrateIcons(); }

  function openProfileSheet(){
    openSheet(`${sheetTitle('Profil Motor', 'Logo PWA pakai icon-192.png dan icon-512.png.')}
      <label class="field"><span>Nama Motor</span><input id="prof-name" value="${esc(state.profile.name)}" /></label>
      <div class="form-grid"><label class="field"><span>Plat</span><input id="prof-plate" value="${esc(state.profile.plate)}" /></label><label class="field"><span>Warna</span><input id="prof-color" value="${esc(state.profile.color)}" /></label></div>
      <label class="field"><span>Virtual KM</span><input id="prof-km" type="number" value="${state.profile.virtualKm}" /></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-profile">Simpan</button></div>`);
  }
  function saveProfile(){ state.profile.name=el('prof-name').value.trim()||'Honda Beat FI 2014'; state.profile.plate=el('prof-plate').value.trim(); state.profile.color=el('prof-color').value.trim(); state.profile.virtualKm=safeNum(el('prof-km').value); save(); closeSheet(); toast('Profil disimpan'); renderAll(); }

  function toggleDial(){ el('fab-main').classList.toggle('open'); el('speed-dial').classList.toggle('open'); }
  function closeDial(){ el('fab-main').classList.remove('open'); el('speed-dial').classList.remove('open'); }

  document.addEventListener('click', e => {
    const pick = e.target.closest('[data-pick]'); if(pick) { updateActivePicker(pick); return; }
    const nav = e.target.closest('.bottom-nav [data-tab]'); if(nav) return switchTab(nav.dataset.tab);
    const garageTab = e.target.closest('#garage-tabs [data-garage-tab]'); if(garageTab) return switchGarage(garageTab.dataset.garageTab);
    const go = e.target.closest('[data-go]'); if(go){ switchTab(go.dataset.go); if(go.dataset.garageTab) setTimeout(()=>switchGarage(go.dataset.garageTab), 0); return; }
    const svcBtn = e.target.closest('[data-action="service-id"]'); if(svcBtn) return openServiceSheet(svcBtn.dataset.id);
    const pkgBtn = e.target.closest('[data-action="service-package"]'); if(pkgBtn) return openServicePackageSheet(pkgBtn.dataset.package || 'light');
    const checkBtn = e.target.closest('[data-action="check-id"]'); if(checkBtn) return openCheckSheet(checkBtn.dataset.id);
    const a = e.target.closest('[data-action]')?.dataset.action;
    if(!a) return;
    const target = e.target.closest('[data-action]');
    const actions = {
      'close-sheet': closeSheet,
      'open-km': openKmSheet,
      'quick-service': () => openServiceSheet(),
      'save-service-package': saveServicePackage,
      'bike-check': () => openCheckSheet(),
      'quick-fuel': () => openFuelSheet('pertalite', 1, false),
      'fuel-custom': () => openFuelSheet('pertalite', 1, true),
      'fuel-settings': openFuelSettings,
      'saving': openSavingSheet,
      'modif': openModifSheet,
      'style': openStyleSheet,
      'expense': openExpenseSheet,
      'ride': openRideSheet,
      'add-custom-km': () => addKm(el('km-custom').value),
      'save-service': saveService,
      'save-check': saveCheck,
      'save-fuel': saveFuel,
      'save-fuel-settings': saveFuelSettings,
      'save-saving': saveSaving,
      'save-modif': saveModif,
      'save-style': saveStyle,
      'save-expense': saveExpense,
      'tracker-start': startTracker,
      'tracker-pause': pauseTracker,
      'tracker-stop': stopTracker,
      'discard-ride': closeSheet,
      'log-ride-only': () => saveRide(false),
      'save-ride-km': () => saveRide(true)
    };
    if(a === 'add-km') return addKm(target.dataset.km);
    if(a === 'fuel-shortcut') return openFuelSheet(target.dataset.fuel, safeNum(target.dataset.liter), false);
    if(actions[a]) return actions[a]();
  });

  el('fab-main').addEventListener('click', toggleDial);
  overlay.addEventListener('click', closeSheet);
  el('quick-ride').addEventListener('click', openRideSheet);
  el('btn-profile').addEventListener('click', openProfileSheet);
  el('btn-save-ai-settings').addEventListener('click', saveAISettings);
  el('btn-ai-send').addEventListener('click', sendAI);
  el('ai-input').addEventListener('keydown', e=>{ if(e.key==='Enter') sendAI(); });
  el('btn-export').addEventListener('click', exportData);
  el('btn-import').addEventListener('click', ()=>el('import-file').click());
  el('import-file').addEventListener('change', e=>{ const f=e.target.files[0]; if(f) importData(f); e.target.value=''; });
  el('btn-reset').addEventListener('click', resetData);
  window.addEventListener('resize', ()=>{ if($('#page-fuel.active')) drawFuelChart(); });
  if('serviceWorker' in navigator){ window.addEventListener('load', ()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{})); }

  hydrateIcons(); renderAll();
})();
