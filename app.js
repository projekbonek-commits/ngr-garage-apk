(() => {
  'use strict';

  const VERSION = 4.1;
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
    pin:'<path d="M12 21s7-4.7 7-11a7 7 0 1 0-14 0c0 6.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2"/>',
    image:'<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="8.5" cy="10" r="1.5"/><path d="m21 15-5-5L5 19"/>',
    link:'<path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/>'
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

  const DEFAULT_AI_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
  const DEFAULT_AI_MODEL = 'openrouter/free';
  const AI_MODEL_PRESETS = [
    {id:'openrouter/free', name:'OpenRouter Free', note:'otomatis pilih model free'},
    {id:'openrouter/auto', name:'Auto Router', note:'pilih model otomatis'},
    {id:'openai/gpt-4o-mini', name:'GPT-4o Mini', note:'manual jika tersedia'},
    {id:'deepseek/deepseek-chat-v3-0324:free', name:'DeepSeek Free', note:'opsi free populer'}
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
      places:[],
      ai:{ key:'', model:DEFAULT_AI_MODEL, baseUrl:DEFAULT_AI_BASE_URL, chat:[] },
      links: oldMods.filter(m=>m.link).map(m => ({id:uid(), title:m.name||'Link part', url:m.link, category:'Modif', note:'Migrasi dari wishlist', ts:m.ts||Date.now()}))
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
      fuels: state.fuels || [], mods: state.mods || [], styles: state.styles || [], expenses: state.expenses || [], rides: state.rides || [], places: state.places || [], links: state.links || []
    };
  }
  state.ai.model = normalizeModelId(state.ai.model);
  state.ai.baseUrl = state.ai.baseUrl || DEFAULT_AI_BASE_URL;
  if(!state.links) state.links = [];
  if(!state.places) state.places = [];
  state.rides = (state.rides || []).map(r => ({route:[], checkpoints:[], pulse:null, ...r}));
  if(!state.version || state.version < VERSION){ state.version = VERSION; save(); }
  function save(){ setLS(LS_KEY, state); }

  function normalizeModelId(value){
    let v = String(value || '').trim().replace(/\s+/g, '');
    const looksBroken = !v || v.includes('gpt-4o-minideepseek') || v.includes('deepseek-v4') || v.includes('undefined') || v.split('/').length > 3;
    return looksBroken ? DEFAULT_AI_MODEL : v;
  }

  function cleanAiError(raw, status){
    let msg = raw || 'request gagal';
    try {
      const data = JSON.parse(raw);
      msg = data?.error?.message || data?.message || msg;
    } catch {}
    if(String(msg).includes('not a valid model ID')) msg = 'Model ID tidak valid. Pilih preset OpenRouter Free / Auto dulu di API Settings.';
    return `AI error ${status}: ${msg}`;
  }

  function readImageFile(inputOrFile, maxSize=960, quality=.76){
    const file = inputOrFile?.files ? inputOrFile.files[0] : inputOrFile;
    return new Promise((resolve, reject) => {
      if(!file) return resolve('');
      if(!file.type || !file.type.startsWith('image/')) return reject(new Error('File harus gambar'));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Gagal baca foto'));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(reader.result);
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function photoPicker(inputId, previewId, current=''){
    return `<div class="photo-pick">
      <input id="${inputId}" type="file" accept="image/*" data-preview="${previewId}" hidden />
      <button type="button" class="photo-btn" data-action="pick-photo" data-target="${inputId}"><span data-icon="image"></span><b>Tambah Foto</b><small>galeri / kamera</small></button>
      <img id="${previewId}" class="photo-preview" src="${esc(current)}" style="display:${current ? 'block' : 'none'}" alt="preview" />
    </div>`;
  }

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
    const b = healthBreakdown();
    return b.score;
  }
  function avg(arr, fallback=100){ return arr && arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : fallback; }
  function monthExpenses(category=null){
    return (state.expenses || []).filter(e => (!category || e.category === category) && monthFilter(e.ts)).reduce((a,b)=>a+safeNum(b.amount),0);
  }
  function monthRideKm(){
    return (state.rides || []).filter(r => monthFilter(r.ts) && r.savedToKm !== false).reduce((a,b)=>a+safeNum(b.distance),0);
  }
  function latestPulse(){
    const rides = (state.rides || []).filter(r=>r.pulse);
    if(!rides.length) return null;
    const recent = rides.slice(0,8);
    return {
      smooth: Math.round(avg(recent.map(r=>safeNum(r.pulse.smoothScore)), 85)),
      stress: Math.round(avg(recent.map(r=>safeNum(r.pulse.fuelStress)), 18)),
      spikes: recent.reduce((a,b)=>a+safeNum(b.pulse.hardAccel),0),
      fuelLiters: recent.reduce((a,b)=>a+safeNum(b.pulse.fuelLiters),0)
    };
  }
  function healthBreakdown(){
    const svc = state.serviceComponents.map(serviceHealth).map(x=>x.pct);
    const chk = state.bikeChecks.map(checkHealth).map(x=>x.pct);
    const fuel = fuelHealth().pct;
    const pulse = latestPulse();
    const ride = pulse ? clamp(Math.round(pulse.smooth*.68 + (100-pulse.stress)*.32),0,100) : 88;
    const urgentCount = priorityItems(99).filter(x=>x.tone==='danger').length;
    const monthSpend = monthExpenses();
    const serviceNeed = state.serviceComponents.map(c=>serviceHealth(c)).filter(h=>h.pct<55).length;
    const budget = clamp(Math.round(100 - (monthSpend/800000*28) - serviceNeed*5 - urgentCount*8),35,100);
    const score = Math.round(avg(svc)*0.45 + avg(chk)*0.22 + fuel*0.16 + ride*0.10 + budget*0.07);
    return {score, service:Math.round(avg(svc)), check:Math.round(avg(chk)), fuel, ride, budget, pulse, urgentCount, monthSpend, serviceNeed};
  }
  function renderMetricCard(label, value, sub, tone='ok'){
    return `<div class="os-metric ${tone}"><small>${esc(label)}</small><b>${esc(String(value))}</b><em>${esc(sub || '')}</em></div>`;
  }
  function buildSmartRecommendations(limit=5){
    const list = [];
    const top = priorityItems(3);
    if(top[0] && top[0].pct < 75) list.push({tone:top[0].tone, icon:top[0].icon, title:`Prioritas: ${top[0].name}`, sub:`${top[0].kind} · ${top[0].pct}% healthy · ${top[0].sub}`, action:top[0].go});
    const pulse = latestPulse();
    if(pulse && pulse.stress >= 55) list.push({tone:'warn', icon:'ride', title:'Riding agak boros', sub:`Fuel Stress rata-rata ${pulse.stress}/100. Gas lebih smooth biar fuel turun.`, action:'ride'});
    if(pulse && pulse.smooth < 70) list.push({tone:'warn', icon:'speed', title:'Smooth score perlu naik', sub:`Rata-rata smooth ${pulse.smooth}%. Hindari stop-go dan speed spike.`, action:'ride'});
    const fuel = fuelHealth();
    if(fuel.pct < 88) list.push({tone:fuel.status, icon:'fuel', title:'Pantau konsumsi BBM', sub:`Saat ini ${Math.round(state.fuelState.kmPerLiter || 0)} km/L. Bandingkan dengan ride log.`, action:'fuel'});
    const urgent = state.serviceComponents.map(c=>({c,h:serviceHealth(c)})).filter(x=>x.h.pct<25).sort((a,b)=>a.h.pct-b.h.pct)[0];
    if(urgent) list.push({tone:'danger', icon:urgent.c.icon, title:`Jangan modif dulu: ${urgent.c.name}`, sub:`Estimasi service ${fmt.rp(urgent.c.estimate)} lebih prioritas dari wishlist.`, action:'garage'});
    const monthSpend = monthExpenses();
    if(monthSpend > 500000) list.push({tone:'warn', icon:'money', title:'Budget bulan ini mulai tinggi', sub:`Total ${fmt.rp(monthSpend)}. Cek expense sebelum beli part baru.`, action:'expense'});
    if(!state.rides.length) list.push({tone:'ok', icon:'ride', title:'Mulai Ride Report', sub:'Coba GO Ride pendek buat kalibrasi fuel dan smooth score.', action:'ride'});
    if(!list.length) list.push({tone:'ok', icon:'garage', title:'Beat aman', sub:'Data sehat. Tetap update KM, fuel, bike check, dan backup berkala.', action:'home'});
    return list.slice(0, limit);
  }
  function renderSmartRecommendations(targetId='smart-recommendations'){
    const box = el(targetId); if(!box) return;
    box.innerHTML = buildSmartRecommendations().map(r => `<button class="reco-card ${r.tone}" data-go="${r.action==='fuel'?'fuel':r.action==='ride'?'ride':'garage'}" ${r.action==='expense'? 'data-garage-tab="expense"' : r.action==='garage'? 'data-garage-tab="service"' : ''}><span class="row-icon" data-icon="${r.icon}"></span><span><b>${esc(r.title)}</b><small>${esc(r.sub)}</small></span></button>`).join('');
    renderIconsLater(box);
  }
  function renderHealthBreakdown(){
    const box = el('health-breakdown'); if(!box) return;
    const b = healthBreakdown();
    const rows = [
      ['Service', b.service, `${state.serviceComponents.length} komponen`, 'wrench'],
      ['Bike Check', b.check, `${state.bikeChecks.filter(p=>p.status!=='ok').length} part perlu cek`, 'brake'],
      ['Fuel', b.fuel, `${Math.round(state.fuelState.kmPerLiter || 0)} km/L`, 'fuel'],
      ['Ride Style', b.ride, b.pulse ? `Smooth ${b.pulse.smooth}% · Stress ${b.pulse.stress}` : 'belum ada ride', 'ride'],
      ['Budget', b.budget, `${fmt.rp(b.monthSpend)} bulan ini`, 'money']
    ];
    box.innerHTML = rows.map(([name,pct,sub,icon])=>`<div class="break-card"><span class="row-icon" data-icon="${icon}"></span><span><b>${name}</b><small>${esc(sub)}</small></span>${ringHtml(pct)}</div>`).join('');
    renderIconsLater(box);
  }
  function renderHomeOsStrip(){
    const box = el('home-os-strip'); if(!box) return;
    const b = healthBreakdown();
    const rideKm = monthRideKm();
    const costKm = rideKm ? monthExpenses()/rideKm : 0;
    box.innerHTML = [
      renderMetricCard('Health 2.0', b.score+'%', b.urgentCount ? `${b.urgentCount} urgent` : 'smart score', b.score<55?'danger':b.score<78?'warn':'ok'),
      renderMetricCard('Bulan Ini', fmt.rp(b.monthSpend), rideKm ? `${fmt.rp(costKm)}/km` : 'belum ada ride', 'ok'),
      renderMetricCard('Fuel Real', Math.round(state.fuelState.kmPerLiter||0)+' km/L', `${fmt.liter(state.fuelState.liters)} tersisa`, b.fuel<70?'warn':'ok')
    ].join('');
  }
  function smartTimeline(limit=50){
    const base = getTimeline(limit);
    const svc = state.serviceComponents.flatMap(c => (c.history||[]).map(h=>({type:'Service', title:c.name, amount:h.cost?fmt.rp(h.cost):'', ts:h.ts||Date.now(), icon:c.icon, sub:`${fmt.km(h.km||c.lastKm)} · ${h.brand||'service log'}`})));
    const mod = state.mods.map(m=>({type:'Modif', title:m.name, amount:m.price?fmt.rp(m.price):'', ts:m.ts, icon:'star', sub:m.status||'wishlist'}));
    const styles = state.styles.map(x=>({type:'Style', title:x.name, amount:x.budget?fmt.rp(x.budget):'', ts:x.ts, icon:'star', sub:x.status||'ide'}));
    const places = (state.places||[]).map(p=>({type:'Place', title:p.name||'Location Memory', amount:'', ts:p.ts, icon:'pin', sub:p.note||'spot tersimpan'}));
    return [...base, ...svc, ...mod, ...styles, ...places].sort((a,b)=>b.ts-a.ts).slice(0,limit);
  }
  function renderGarageCommand(){
    const box = el('garage-command-grid'); if(!box) return;
    const b = healthBreakdown(); const rideKm = monthRideKm(); const spend = monthExpenses();
    const urgent = priorityItems(1)[0];
    box.innerHTML = `
      ${renderMetricCard('OS Score', b.score+'%', urgent ? urgent.name : 'all good', b.score<55?'danger':b.score<78?'warn':'ok')}
      ${renderMetricCard('Cost / KM', rideKm?fmt.rp(spend/rideKm)+'/km':'—', `${fmt.km(rideKm)} bulan ini`, 'ok')}
      ${renderMetricCard('Next Action', urgent?urgent.pct+'%':'Aman', urgent?urgent.sub:'tidak ada urgent', urgent?.tone || 'ok')}`;
  }
  function renderBudgetControl(){
    const box = el('budget-control'); if(!box) return;
    const spend = monthExpenses(); const fuel = monthExpenses('Fuel'); const service = monthExpenses('Service'); const modif = monthExpenses('Modif');
    const urgentCost = state.serviceComponents.map(c=>({c,h:serviceHealth(c)})).filter(x=>x.h.pct<55).reduce((a,x)=>a+safeNum(x.c.estimate),0);
    const target = safeNum(state.savings.target); const collected = safeNum(state.savings.collected); const left = Math.max(0,target-collected);
    const mode = urgentCost > 0 ? 'Service dulu' : left > 0 ? 'Modif aman dicicil' : 'Budget aman';
    box.innerHTML = `
      ${renderMetricCard('Total Bulan Ini', fmt.rp(spend), `Fuel ${fmt.rp(fuel)} · Service ${fmt.rp(service)}`, spend>600000?'warn':'ok')}
      ${renderMetricCard('Service Wajib', fmt.rp(urgentCost), urgentCost?'prioritas sebelum modif':'tidak ada urgent', urgentCost?'danger':'ok')}
      ${renderMetricCard('Celengan', fmt.rp(collected), left?`kurang ${fmt.rp(left)}`:'target tercapai', left?'warn':'ok')}
      <div class="budget-advice"><b>${mode}</b><small>${urgentCost?`Siapkan minimal ${fmt.rp(urgentCost)} buat komponen soon/urgent.`:'Kalau mau beli part, tetap sisihin dana fuel dan service.'}</small></div>`;
  }
  function fuelIntelStats(){
    const ridesKm = (state.rides||[]).slice(0,20).reduce((a,b)=>a+safeNum(b.distance),0);
    const fuelLiters = (state.fuels||[]).slice(0,20).reduce((a,b)=>a+safeNum(b.liters),0);
    const realKml = fuelLiters>0 && ridesKm>0 ? ridesKm/fuelLiters : safeNum(state.fuelState.kmPerLiter)||55;
    const pulse = latestPulse();
    const weeklyKm = monthRideKm()/Math.max(1,(new Date().getDate()/7));
    const weeklyFuelCost = weeklyKm / Math.max(1,realKml) * (state.fuelSettings?.prices?.pertalite || 10000);
    return {realKml, ridesKm, fuelLiters, pulse, weeklyFuelCost};
  }
  function renderFuelIntel(){
    const box = el('fuel-intel-grid'); if(!box) return;
    const f = fuelIntelStats();
    const stress = f.pulse ? f.pulse.stress : 0;
    box.innerHTML = `
      ${renderMetricCard('Real Avg', Math.round(f.realKml)+' km/L', `${fmt.km(f.ridesKm)} / ${fmt.liter(f.fuelLiters)}`, f.realKml<42?'warn':'ok')}
      ${renderMetricCard('Prediksi Mingguan', fmt.rp(f.weeklyFuelCost), 'berdasar ride bulan ini', 'ok')}
      ${renderMetricCard('Fuel Stress', f.pulse?stress+'/100':'—', f.pulse?`Smooth ${f.pulse.smooth}%`:'butuh ride log', stress>60?'warn':'ok')}`;
  }
  function componentWearHtml(r){
    const d = safeNum(r.distance); const stress = safeNum(r.pulse?.fuelStress);
    const oil = Math.min(5, d/20 + stress/140);
    const tire = Math.min(5, d/35 + stress/180);
    const cvt = Math.min(5, d/45 + stress/160);
    return `<div class="wear-grid"><div><b>-${oil.toFixed(1)}%</b><small>Oli impact</small></div><div><b>-${tire.toFixed(1)}%</b><small>Ban impact</small></div><div><b>-${cvt.toFixed(1)}%</b><small>CVT impact</small></div></div>`;
  }
  function renderRideReportMini(){
    const box = el('ride-report-mini'); if(!box) return;
    const r = (state.rides||[])[0];
    if(!r){ box.innerHTML = '<div class="empty">Belum ada ride report. Tap GO Ride buat bikin report pertama.</div>'; return; }
    const p = r.pulse || computeRidePulse(r.route||[], r.distance, r.durationMs, r.maxSpeed);
    box.innerHTML = `<div class="ride-report-card"><div><b>${esc(r.name||'Ride terakhir')}</b><small>${fmt.km(r.distance)} · ${fmt.min(r.durationMs)} · ${fmt.date(r.ts)}</small></div><div class="ride-pulse-strip"><div><b>${p.smoothScore}%</b><small>Smooth</small></div><div><b>${p.fuelStress}/100</b><small>Fuel Stress</small></div><div><b>${fmt.liter(p.fuelLiters)}</b><small>Fuel est.</small></div></div>${componentWearHtml({...r,pulse:p})}</div>`;
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
    if(tab==='ride') renderRide();
    if(tab==='fuel') renderFuel();
    if(tab==='ai') renderAI();
  }
  function switchGarage(tab){
    $$('#garage-tabs button').forEach(b=>b.classList.toggle('active', b.dataset.garageTab===tab));
    $$('.garage-pane').forEach(p=>p.classList.toggle('active', p.id === 'garage-' + tab));
    renderGarage();
  }

  function getTimeline(limit=8){
    const rides = state.rides.map(r => ({type:'Ride', title:`${r.name || 'Ride'} +${fmt.km(r.distance)}`, amount:'', ts:r.ts, icon:'ride', sub:`${fmt.min(r.durationMs)} · ${Math.round(r.avgSpeed)} km/j${r.pulse ? ' · Smooth '+r.pulse.smoothScore+'%' : ''}`}));
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
    renderHomeOsStrip();
    renderHealthBreakdown();
    renderSmartRecommendations();
    el('ai-insight').innerHTML = generateInsight();
    renderTimeline(el('home-timeline'), smartTimeline(6));
  }
  function componentSub(h){
    const km = h.kmLeft == null ? '' : (h.kmLeft < 0 ? `${fmt.km(Math.abs(h.kmLeft))} lewat` : `${fmt.km(h.kmLeft)} left`);
    const d = h.dayLeft == null ? '' : (h.dayLeft < 0 ? `${Math.abs(h.dayLeft)} hari lewat` : `${h.dayLeft} hari`);
    return [km,d].filter(Boolean).join(' / ');
  }
  function generateInsight(){
    const rec = buildSmartRecommendations(1)[0];
    const top = priorityItems(1)[0];
    const worstSvc = state.serviceComponents.map(c=>({c,h:serviceHealth(c)})).sort((a,b)=>a.h.pct-b.h.pct)[0];
    const badPart = state.bikeChecks.find(p=>['broken','worn','check'].includes(p.status));
    const fuel = fuelHealth();
    if(rec && rec.tone !== 'ok') return `Bos, Smart OS baca prioritas: <b>${esc(rec.title)}</b>. ${esc(rec.sub)}.`;
    if(top && top.score > 90) return `Bos, prioritas nomor satu sekarang <b>${esc(top.name)}</b>. Statusnya ${top.pct}% healthy, jangan ditunda kalau dipakai harian.`;
    if(worstSvc && worstSvc.h.pct <= 20) return `Bos, <b>${esc(worstSvc.c.name)}</b> sudah urgent. Prioritasin dulu, estimasi budget sekitar <b>${fmt.rp(worstSvc.c.estimate)}</b>.`;
    if(badPart) return `Bos, <b>${esc(badPart.name)}</b> statusnya <b>${partStatusLabel(badPart.status)}</b>. Masukin prioritas cek di Garage biar health naik.`;
    if(worstSvc && worstSvc.h.pct <= 55) return `Bos, <b>${esc(worstSvc.c.name)}</b> mulai dekat jadwal. Sisa ${componentSub(worstSvc.h)}.`;
    if(fuel.pct < 80) return `Fuel agak turun. Coba pantau tekanan ban, filter udara, dan CVT kalau konsumsi makin boros.`;
    return `Beat masih sehat. Tetap update Virtual KM, fuel, dan bike check biar NGR Health tetap akurat.`;
  }

  function renderGarage(){
    renderGarageCommand();
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
      ${m.img ? `<img class="item-thumb" src="${esc(m.img)}" alt="${esc(m.name)}" />` : `<div class="row-icon" data-icon="star"></div>`}
      <div class="row-content"><b>${esc(m.name)}</b><small>${fmt.rp(m.price)} · ${esc(m.status)}${m.note?' · '+esc(m.note):''}</small>${m.link ? `<a class="inline-link" href="${esc(m.link)}" target="_blank" rel="noopener">Buka link toko</a>` : ''}</div>
      <span class="status-pill ${m.status==='terpasang'?'ok':m.status==='dibeli'?'warn':''}">${esc(m.status)}</span>
    </div>`).join('') : `<div class="empty">Belum ada wishlist part.</div>`;
    renderLinkLibrary();
    renderIconsLater(el('mod-list'));
  }
  function renderStyles(){
    el('style-list').innerHTML = state.styles.length ? state.styles.map(st=>`<div class="style-card">
      ${st.img ? `<img class="item-thumb wide" src="${esc(st.img)}" alt="${esc(st.name)}" />` : `<div class="row-icon" data-icon="star"></div>`}
      <div class="row-content"><b>${esc(st.name)}</b><small>${esc(st.desc)} · ${fmt.rp(st.budget)} · ${esc(st.status)}</small>${st.link ? `<a class="inline-link" href="${esc(st.link)}" target="_blank" rel="noopener">Buka referensi</a>` : ''}</div>
    </div>`).join('') : `<div class="empty">Belum ada ide style. Tambah konsep modifan pertama.</div>`;
    renderIconsLater(el('style-list'));
  }
  function getLinkLibrary(){
    const manual = (state.links || []).map(l => ({...l, source:'Library'}));
    const modLinks = state.mods.filter(m=>m.link).map(m => ({id:'mod-'+m.id, title:m.name, url:m.link, category:'Modif', note:m.status, ts:m.ts, source:'Part'}));
    const styleLinks = state.styles.filter(st=>st.link).map(st => ({id:'style-'+st.id, title:st.name, url:st.link, category:'Style', note:st.status, ts:st.ts, source:'Style'}));
    return [...manual, ...modLinks, ...styleLinks].sort((a,b)=>safeNum(b.ts)-safeNum(a.ts));
  }
  function renderLinkLibrary(){
    const box = el('link-library'); if(!box) return;
    const links = getLinkLibrary();
    box.innerHTML = links.length ? links.slice(0,30).map(l=>`<a class="link-card" href="${esc(l.url)}" target="_blank" rel="noopener">
      <span data-icon="link"></span><div><b>${esc(l.title || 'Link')}</b><small>${esc(l.category || 'Link')} · ${esc(l.source || '')}${l.note ? ' · ' + esc(l.note) : ''}</small></div>
    </a>`).join('') : `<div class="empty">Belum ada link. Simpan link toko / referensi modif di sini.</div>`;
    renderIconsLater(box);
  }
  function monthFilter(ts){ const d=new Date(ts), n=new Date(); return d.getMonth()===n.getMonth() && d.getFullYear()===n.getFullYear(); }
  function renderExpenses(){
    const month = state.expenses.filter(e=>monthFilter(e.ts));
    const sum = cat => month.filter(e=>cat==='all'||e.category===cat).reduce((a,b)=>a+safeNum(b.amount),0);
    el('exp-month').textContent = fmt.rp(sum('all')); el('exp-fuel').textContent = fmt.rp(sum('Fuel')); el('exp-service').textContent = fmt.rp(sum('Service')); el('exp-modif').textContent = fmt.rp(sum('Modif'));
    const mKm = monthRideKm();
    const costPerKm = mKm > 0 ? Math.round(sum('all') / mKm) : 0;
    const cpk = el('exp-cost-km'); if(cpk) cpk.textContent = costPerKm ? `${fmt.rp(costPerKm)}/km` : 'Belum ada ride';
    renderBudgetControl();
    renderTimeline(el('expense-list'), smartTimeline(60));
  }
  function renderTimeline(target, items){
    target.innerHTML = items.length ? items.map(t=>`<div class="timeline-item"><div class="row-icon" data-icon="${t.icon}"></div><div class="timeline-main"><b>${esc(t.title)}</b><small>${esc(t.sub || fmt.date(t.ts))}</small></div>${t.amount ? `<div class="timeline-amount">${esc(t.amount)}</div>` : ''}</div>`).join('') : `<div class="empty">Belum ada history.</div>`;
    renderIconsLater(target);
  }


  function latestRideContext(){
    const r = (state.rides || [])[0];
    if(!r) return 'belum ada ride';
    return `${fmt.km(r.distance)}, ${fmt.min(r.durationMs)}, avg ${Math.round(r.avgSpeed)} km/j, ${r.pulse ? `Smooth ${r.pulse.smoothScore}%, Fuel Stress ${r.pulse.fuelStress}/100` : 'belum ada Ride Pulse'}`;
  }

  function renderRide(){
    const rides = state.rides || [];
    const places = state.places || [];
    const totalKm = rides.reduce((a,b)=>a+safeNum(b.distance),0);
    const pulseRides = rides.filter(r=>r.pulse);
    const avgSmooth = pulseRides.length ? Math.round(pulseRides.reduce((a,b)=>a+b.pulse.smoothScore,0)/pulseRides.length) + '%' : '—';
    if(el('ride-total-km')) el('ride-total-km').textContent = fmt.km(totalKm);
    if(el('ride-count')) el('ride-count').textContent = rides.length;
    if(el('place-count')) el('place-count').textContent = places.length;
    if(el('ride-smooth-avg')) el('ride-smooth-avg').textContent = avgSmooth;
    const rh = el('ride-history');
    if(rh){
      rh.innerHTML = rides.length ? rides.slice(0,12).map((r,i)=>rideCardHtml(r, i)).join('') : `<div class="empty">Belum ada ride. Tap GO Ride, lalu lihat Summary Map setelah Stop.</div>`;
    }
    renderRideReportMini();
    const pl = el('place-list');
    if(pl){
      pl.innerHTML = places.length ? places.slice(0,12).map(placeCardHtml).join('') : `<div class="empty">Belum ada location memory. Tambah foto saat ride atau + Place manual.</div>`;
      renderIconsLater(pl);
    }
  }

  function rideCardHtml(r,i){
    const pulse = r.pulse || computeRidePulse(r.route||[], r.distance, r.durationMs, r.maxSpeed);
    const chips = (r.checkpoints||[]).slice(0,5).map(c=>`<div class="checkpoint"><img src="${esc(c.photo)}" alt="checkpoint"/><small>${esc(c.name||'Checkpoint')}</small></div>`).join('');
    return `<article class="ride-card">
      <div class="ride-card-head">
        <div><b>${esc(r.name || 'Ride ' + fmt.date(r.ts))}</b><small>${fmt.date(r.ts)} · ${r.savedToKm ? 'Masuk Virtual KM' : 'Log saja'} · ${esc(r.detect||'Ride')}</small></div>
        <button class="mini-link" data-action="view-ride" data-id="${esc(r.id)}">Detail</button>
      </div>
      <div class="ride-pulse-strip">
        <div><b>${pulse.smoothScore}%</b><small>Smooth</small></div>
        <div><b>${pulse.fuelStress}/100</b><small>Fuel Stress</small></div>
        <div><b>${pulse.hardAccel}x</b><small>Speed Spike</small></div>
      </div>
      <div class="ride-card-stats">
        <div><b>${fmt.km(r.distance)}</b><small>Jarak</small></div>
        <div><b>${fmt.min(r.durationMs)}</b><small>Durasi</small></div>
        <div><b>${Math.round(r.avgSpeed||0)}</b><small>Avg km/j</small></div>
        <div><b>${fmt.liter(pulse.fuelLiters)}</b><small>Fuel est.</small></div>
      </div>
      ${chips ? `<div class="checkpoint-strip">${chips}</div>` : ''}
    </article>`;
  }

  function placeCardHtml(p){
    return `<article class="place-card">
      <div class="place-img">${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}"/>` : `<span data-icon="pin"></span>`}</div>
      <div><b>${esc(p.name || 'Lokasi')}</b><small>${fmt.date(p.ts)} · ${p.lat && p.lon ? `${Number(p.lat).toFixed(5)}, ${Number(p.lon).toFixed(5)}` : 'manual'}<br>${esc(p.note || 'Memory lokasi NGR')}</small></div>
    </article>`;
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
    renderFuelIntel();
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
    el('ai-key').value = state.ai.key || '';
    el('ai-model').value = normalizeModelId(state.ai.model || DEFAULT_AI_MODEL);
    el('ai-base-url').value = state.ai.baseUrl || DEFAULT_AI_BASE_URL;
    const presets = el('ai-model-presets');
    if(presets){
      presets.innerHTML = AI_MODEL_PRESETS.map(p=>`<button type="button" class="model-chip ${p.id===el('ai-model').value?'active':''}" data-action="ai-model-preset" data-model="${esc(p.id)}"><b>${esc(p.name)}</b><small>${esc(p.note)}</small></button>`).join('');
    }
    const intro = {role:'assistant', content:'Halo bos! Kang Rusdi siap baca data NGR Health, service, fuel, bike check, modif, link library, foto part, dan expense. Tanya aja kondisi Beat kamu.'};
    const msgs = state.ai.chat.length ? state.ai.chat : [intro];
    el('chat-list').innerHTML = msgs.map(m=>`<div class="bubble ${m.role==='user'?'user':'ai'}">${esc(m.content)}</div>`).join('');
    requestAnimationFrame(()=>{ const s=el('ai-scroll'); s.scrollTop=s.scrollHeight; });
  }

  const sheet = el('sheet'), overlay = el('sheet-overlay');
  function openSheet(html){
    closeDial(); sheet.innerHTML = `<div class="sheet-handle"></div>${html}`; overlay.classList.add('open'); sheet.classList.add('open'); hydrateIcons(sheet);
  }
  function closeSheet(){ if(warmup){ stopGpsWarmup(false); } overlay.classList.remove('open'); sheet.classList.remove('open'); setTimeout(()=>{ if(!sheet.classList.contains('open')) sheet.innerHTML=''; }, 260); }
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
    openSheet(`${sheetTitle('Tambah Part Modif', 'Foto + link toko masuk Link Library otomatis.')}
      <label class="field hero-input"><span>Nama Part</span><input id="mod-name" placeholder="Velg, shock, lampu..." /></label>
      ${photoPicker('mod-img','mod-img-preview')}
      <div class="mini-caption">Status part</div>
      ${smartPicker('mod-status-picker', statusOptions, 'wishlist', 'status-picker')}
      <div class="form-grid"><label class="field"><span>Harga</span><input id="mod-price" type="number" placeholder="850000" /></label><label class="field"><span>Kategori</span><input id="mod-cat" placeholder="Kaki-kaki, body..." /></label></div>
      <label class="field"><span>Link toko</span><input id="mod-link" placeholder="https://..." /></label>
      <label class="field"><span>Catatan</span><textarea id="mod-note" placeholder="Alasan, style, spek..."></textarea></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-modif">Simpan</button></div>`);
  }
  async function saveModif(){
    const name=el('mod-name').value.trim(); if(!name) return toast('Nama part wajib diisi', 'err'); const price=safeNum(el('mod-price').value); const status=getPickerValue('mod-status-picker') || 'wishlist';
    let img = ''; try { img = el('mod-img')._dataUrl || await readImageFile(el('mod-img')); } catch(e){ toast(e.message, 'err'); return; }
    const link = el('mod-link').value.trim();
    state.mods.unshift({id:uid(), name, price, status, link, img, note:el('mod-note').value.trim(), category:el('mod-cat').value.trim()||'Modif', ts:Date.now()});
    if(link && !state.links.some(l=>l.url===link)) state.links.unshift({id:uid(), title:name, url:link, category:'Modif', note:'Dari part modif', ts:Date.now()});
    if(price && status !== 'wishlist') state.expenses.unshift({id:uid(), category:'Modif', title:name, amount:price, ts:Date.now(), note:status});
    save(); closeSheet(); toast('Part + foto/link tersimpan'); renderAll();
  }
  function openStyleSheet(){
    const styleStatus = [
      {value:'Ide', label:'Ide', sub:'masih konsep', icon:'star', tone:'warn'},
      {value:'Proses', label:'Proses', sub:'lagi dibangun', icon:'wrench', tone:'warn'},
      {value:'Selesai', label:'Selesai', sub:'final look', icon:'check', tone:'ok'}
    ];
    openSheet(`${sheetTitle('Style Idea', 'Bisa simpan foto referensi + link inspirasi.')}
      <label class="field hero-input"><span>Nama Konsep</span><input id="style-name" placeholder="Daily Proper Dark Blue" /></label>
      ${photoPicker('style-img','style-img-preview')}
      <label class="field"><span>Deskripsi</span><textarea id="style-desc" placeholder="Velg silver, ban proper, decal minimal..."></textarea></label>
      <label class="field"><span>Link referensi</span><input id="style-link" placeholder="https://..." /></label>
      <div class="mini-caption">Status style</div>
      ${smartPicker('style-status-picker', styleStatus, 'Ide', 'status-picker')}
      <label class="field"><span>Estimasi Budget</span><input id="style-budget" type="number" placeholder="2500000" /></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-style">Simpan</button></div>`);
  }
  async function saveStyle(){
    const name=el('style-name').value.trim(); if(!name) return toast('Nama style wajib diisi','err');
    let img = ''; try { img = el('style-img')._dataUrl || await readImageFile(el('style-img')); } catch(e){ toast(e.message, 'err'); return; }
    const link = el('style-link').value.trim();
    const item = {id:uid(), name, desc:el('style-desc').value.trim(), budget:safeNum(el('style-budget').value), status:getPickerValue('style-status-picker') || 'Ide', link, img, ts:Date.now()};
    state.styles.unshift(item);
    if(link && !state.links.some(l=>l.url===link)) state.links.unshift({id:uid(), title:name, url:link, category:'Style', note:'Referensi style', ts:Date.now()});
    save(); closeSheet(); toast('Style + foto/link disimpan'); renderAll();
  }
  function openLinkSheet(){
    const cats = ['Modif','Style','Service','Sparepart','Tools','Other'].map(c=>({value:c, label:c, sub:c==='Modif'?'link part':c==='Style'?'referensi look':'link penting', icon:c==='Style'?'star':c==='Modif'?'link':'link'}));
    openSheet(`${sheetTitle('Link Library', 'Simpan link toko, referensi part, video, atau inspirasi modif.')}
      <label class="field hero-input"><span>Judul Link</span><input id="link-title" placeholder="Velg / shock / referensi style" /></label>
      <label class="field"><span>URL</span><input id="link-url" type="url" placeholder="https://..." /></label>
      <div class="mini-caption">Kategori</div>
      ${smartPicker('link-cat-picker', cats, 'Modif', 'status-picker')}
      <label class="field"><span>Catatan</span><textarea id="link-note" placeholder="harga, toko, ukuran, catatan..."></textarea></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-link">Simpan Link</button></div>`);
  }
  function saveLink(){
    const title = el('link-title').value.trim(); const url = el('link-url').value.trim();
    if(!title || !url) return toast('Judul/link belum lengkap', 'err');
    state.links.unshift({id:uid(), title, url, category:getPickerValue('link-cat-picker') || 'Modif', note:el('link-note').value.trim(), ts:Date.now()});
    save(); closeSheet(); toast('Link masuk library'); renderAll();
  }

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

  let tracker = null, warmup = null;

  function openRideSheet(){
    openSheet(`${sheetTitle('NGR Ride Lite', 'GPS siap dulu, baru jalan. Biar jarak nggak kosong.')}
      <div class="tracker-card">
        <div class="tracker-status-row"><span class="gps-badge warn">Cek GPS</span><span class="muted">tunggu status SIAP</span></div>
        <div class="tracker-display"><div class="tracker-distance">GPS</div><div class="muted">siap jalan?</div></div>
        <div class="tracker-meta"><div><b>±25m</b><small>Ideal</small></div><div><b>±35m</b><small>Ready</small></div><div><b>Force</b><small>darurat</small></div></div>
        <p class="tracker-map-note">Taruh HP di dashboard. Jangan jalan dulu sampai muncul status <b>GPS TRACKING SIAP — JALAN SEKARANG</b>.</p>
      </div>
      <div class="gps-rules">
        <b>GPS harus siap dulu</b>
        <small>Setelah tap GO, NGR nyari sinyal dulu. Kalau sudah siap, status berubah jadi GPS TRACKING SIAP — baru gas.</small>
      </div>
      <div class="form-actions" id="trk-actions"><button class="save-btn" data-action="tracker-start">Cek GPS</button><button class="cancel-btn" data-action="close-sheet">Tutup</button></div>`);
  }

  function gpsSignalInfo(acc){
    acc = safeNum(acc) || 999;
    if(acc <= 25) return {label:'GPS TRACKING SIAP', tone:'ok', pct:100, note:'GPS mantap. Tunggu sheet tracking kebuka, lalu jalan sekarang.'};
    if(acc <= 35) return {label:'CUKUP SIAP', tone:'ok', pct:82, note:'GPS cukup siap. NGR akan masuk tracking otomatis sebentar lagi.'};
    if(acc <= 55) return {label:'BELUM SIAP', tone:'warn', pct:55, note:'Jangan jalan dulu. Tunggu akurasi turun di bawah ±35m.'};
    if(acc <= 85) return {label:'LEMAH', tone:'danger', pct:28, note:'GPS lemah. Geser HP ke dashboard atas/dekat kaca.'};
    return {label:'NO FIX', tone:'danger', pct:10, note:'Belum dapat lokasi. Jangan jalan dulu.'};
  }
  function stopGpsWarmup(showToast=true){
    if(warmup?.watchId != null){ try{ navigator.geolocation.clearWatch(warmup.watchId); }catch{} }
    if(warmup?.autoTimer){ clearTimeout(warmup.autoTimer); }
    warmup = null;
    if(showToast) toast('GPS warm-up dibatalkan');
  }
  function updateWarmupUI(){
    if(!warmup || !el('warm-accuracy')) return;
    const acc = warmup.last ? Math.round(warmup.last.acc) : null;
    const info = gpsSignalInfo(acc || 999);
    const elapsed = Math.round((Date.now() - warmup.start) / 1000);
    const ready = !!warmup.ready;
    el('warm-accuracy').textContent = acc ? `±${acc} m` : '—';
    el('warm-status').textContent = ready ? 'GPS TRACKING SIAP' : info.label;
    el('warm-status').className = `gps-badge ${ready ? '' : info.tone === 'warn' ? 'warn' : info.tone === 'danger' ? 'danger' : ''}`;
    el('warm-time').textContent = elapsed + 's';
    el('warm-fix').textContent = warmup.fixes + ' fix';
    el('warm-best').textContent = warmup.bestAcc < 999 ? `±${Math.round(warmup.bestAcc)}m` : '—';
    el('warm-bar-fill').style.width = clamp(info.pct, 8, 100) + '%';
    el('warm-note').textContent = warmup.error || (ready ? 'GPS TRACKING SIAP — tunggu sebentar, tracking akan kebuka otomatis. Kalau sheet tracking sudah muncul, baru jalan.' : info.note);
    const btn = el('warm-start-btn');
    if(btn){
      btn.disabled = !ready;
      btn.textContent = ready ? 'GPS Tracking Siap' : 'Tunggu GPS Siap';
    }
  }
  function startGpsWarmup(){
    if(!navigator.geolocation) return toast('GPS tidak tersedia', 'err');
    if(warmup) stopGpsWarmup(false);
    warmup = {watchId:null, start:Date.now(), fixes:0, bestAcc:999, last:null, ready:false, error:'', autoTimer:null};
    openSheet(`${sheetTitle('GPS Tracking Check', 'Tunggu status GPS TRACKING SIAP sebelum jalan.')}
      <div class="warmup-card">
        <div class="warmup-top"><span class="gps-badge warn" id="warm-status">CEK GPS</span><span class="muted">jangan jalan dulu</span></div>
        <div class="warmup-accuracy" id="warm-accuracy">—</div>
        <div class="muted">akurasi lokasi</div>
        <div class="warmup-bar"><i id="warm-bar-fill" style="width:8%"></i></div>
        <div class="tracker-meta"><div><b id="warm-time">0s</b><small>Warm-up</small></div><div><b id="warm-fix">0 fix</b><small>Sinyal</small></div><div><b id="warm-best">—</b><small>Terbaik</small></div></div>
        <p class="tracker-map-note" id="warm-note">Mencari GPS stabil... tunggu sampai muncul GPS TRACKING SIAP.</p>
      </div>
      <div class="gps-rules">
        <b>Tips dashboard</b>
        <small>Letakkan HP di dashboard atas/dekat kaca. Jangan gas dulu sebelum status siap, karena jarak sebelum GPS siap memang belum dihitung.</small>
      </div>
      <div class="form-actions"><button class="cancel-btn" data-action="warmup-cancel">Batal</button><button class="cancel-btn" data-action="warmup-force">Low Signal</button><button class="save-btn" id="warm-start-btn" data-action="warmup-start" disabled>Tunggu GPS Siap</button></div>`);
    warmup.watchId = navigator.geolocation.watchPosition(pos => {
      if(!warmup) return;
      const c = pos.coords;
      const p = {lat:c.latitude, lon:c.longitude, ts:pos.timestamp || Date.now(), acc:c.accuracy || 999};
      warmup.last = p;
      warmup.fixes++;
      warmup.bestAcc = Math.min(warmup.bestAcc, p.acc);
      warmup.ready = (p.acc <= 25) || (p.acc <= 35 && warmup.fixes >= 2);
      warmup.error = '';
      updateWarmupUI();
      if(warmup.ready && !warmup.autoTimer){
        warmup.autoTimer = setTimeout(() => {
          if(warmup && warmup.ready) beginTrackerFromWarmup(false);
        }, 1200);
      }
    }, err => {
      if(!warmup) return;
      warmup.error = 'GPS: ' + err.message;
      updateWarmupUI();
    }, {enableHighAccuracy:true, maximumAge:0, timeout:15000});
    updateWarmupUI();
  }
  function beginTrackerFromWarmup(force=false){
    const hadFix = warmup?.last || null;
    if(warmup?.watchId != null){ try{ navigator.geolocation.clearWatch(warmup.watchId); }catch{} }
    if(warmup?.autoTimer){ clearTimeout(warmup.autoTimer); }
    warmup = null;
    startTracker(!!force, hadFix);
  }
  function renderTrackingSheet(forceStart=false){
    openSheet(`${sheetTitle('NGR Ride Tracking', forceStart ? 'Low Signal Mode aktif. Jarak tetap difilter ketat.' : 'GPS TRACKING SIAP — jalan sekarang.')}
      <div class="tracker-card">
        <div class="tracker-status-row"><span class="gps-badge" id="trk-mode">${forceStart ? 'Low Signal' : 'GPS Tracking Siap'}</span><span class="muted">jarak valid-only</span></div>
        <div class="tracker-display"><div class="tracker-distance" id="trk-dist">0.00</div><div class="muted">kilometer</div></div>
        <div class="tracker-meta"><div><b id="trk-time">0m</b><small>Durasi</small></div><div><b id="trk-speed">0</b><small>avg km/j</small></div><div><b id="trk-max">0</b><small>max</small></div></div>
        <p class="tracker-map-note" id="trk-gps-note">${forceStart ? 'Low signal mode: tunggu gerakan valid, drift tetap diabaikan.' : 'GPS TRACKING SIAP — jalan sekarang. NGR mulai hitung setelah gerakan valid terkonfirmasi.'}</p>
      </div>
      <div class="gps-rules">
        <b>Stable Mode aktif</b>
        <small>Kalau kamu berhenti/kasir/kasur, GPS drift tidak dihitung. Setelah Stop, hasil ride baru direview.</small>
      </div>
      <div class="pulse-grid" id="trk-pulse" style="display:none"></div>
      <input id="ride-photo" type="file" accept="image/*" capture="environment" hidden />
      <div class="form-actions" id="trk-actions"><button class="cancel-btn" data-action="tracker-pause">Pause</button><button class="cancel-btn" data-action="ride-checkpoint">+ Foto</button><button class="save-btn" data-action="tracker-stop">Stop</button></div>`);
  }

  function haversine(a,b){ const R=6371e3, toRad=x=>x*Math.PI/180; const p1=toRad(a.lat), p2=toRad(b.lat), dp=toRad(b.lat-a.lat), dl=toRad(b.lon-a.lon); const q=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2; return 2*R*Math.atan2(Math.sqrt(q),Math.sqrt(1-q)); }
  function routeDistance(points){ let m=0; for(let i=1;i<points.length;i++) m += haversine(points[i-1], points[i]); return m/1000; }
  function classifyPoint(prev,p,d,dt,speedKmh){
    if(!prev) return 'normal';
    if(p.acc > 50) return 'warn';
    if(d > 180 || speedKmh > 115) return 'bad';
    const accel = (speedKmh - safeNum(prev.speedKmh)) / Math.max(1, dt);
    if(speedKmh < 4) return 'stop';
    if(accel > 1.9 || speedKmh > 70) return 'stress';
    if(accel > .95) return 'push';
    return 'normal';
  }
  function gpsNoiseMeters(a,b){
    const accA = Math.min(80, Math.max(0, safeNum(a?.acc || 0)));
    const accB = Math.min(80, Math.max(0, safeNum(b?.acc || 0)));
    return clamp(Math.max(30, (accA + accB) * .72), 30, 70);
  }
  function rawSpeedKmh(coords){ return coords.speed != null && coords.speed >= 0 ? coords.speed * 3.6 : NaN; }
  function movementGate(ref,p,d,dt,speedKmh,raw){
    const need = gpsNoiseMeters(ref,p);
    const hasSpeed = (Number.isFinite(raw) && raw >= 7) || speedKmh >= 8;
    const saneTime = dt > 0.8 && dt < 45;
    const accLimit = tracker?.forceStart ? 55 : 35;
    return p.acc <= accLimit && d >= need && hasSpeed && saneTime && speedKmh < 115;
  }
  function addAcceptedPoint(p, ref, d, dt, speedKmh){
    const prev = tracker.lastAccepted;
    const seg = classifyPoint(prev || ref, p, d, dt, speedKmh);
    if(seg === 'bad') { tracker.bad++; tracker.gpsNote = 'GPS loncat, titik dibuang'; return false; }
    p.speedKmh = speedKmh;
    p.seg = seg;
    if(prev){
      tracker.distance += d;
      tracker.movingMs += Math.min(dt * 1000, 12000);
    }
    tracker.maxSpeed = Math.max(tracker.maxSpeed, speedKmh);
    tracker.currentSpeed = speedKmh;
    tracker.points++;
    tracker.lastAccepted = p;
    tracker.anchor = p;
    tracker.route.push(p);
    tracker.pending = [];
    tracker.gpsNote = `Moving · GPS ±${Math.round(p.acc)}m · +${Math.round(prev ? d : 0)}m`;
    return true;
  }
  function ignoreAsDrift(p, reason='Indoor drift ignored'){
    tracker.ignored++;
    tracker.currentSpeed = 0;
    tracker.lastRaw = p;
    if(tracker.lastAccepted) tracker.stopMs += Math.max(0, p.ts - (tracker.lastRaw?.ts || p.ts));
    if(!tracker.lastAccepted && p.acc <= 45) tracker.anchor = p;
    tracker.gpsNote = `${reason} · ±${Math.round(p.acc)}m`;
  }
  function startTracker(forceStart=false, warmFix=null){
    if(!navigator.geolocation) return toast('GPS tidak tersedia', 'err');
    renderTrackingSheet(forceStart);
    tracker = {watchId:null, start:Date.now(), paused:false, pauseStart:0, pausedMs:0, anchor:warmFix || null, lastAccepted:null, lastRaw:warmFix || null, pending:[], distance:0, movingMs:0, maxSpeed:0, currentSpeed:0, bad:0, points:0, ignored:0, stopMs:0, gpsNote:forceStart ? 'Low Signal Mode · menunggu gerakan valid' : 'GPS TRACKING SIAP — jalan sekarang', route:[], checkpoints:[], tick:null, forceStart:!!forceStart};
    tracker.watchId = navigator.geolocation.watchPosition(pos=>{
      if(!tracker || tracker.paused) return;
      const c = pos.coords;
      const raw = rawSpeedKmh(c);
      const p = {lat:c.latitude, lon:c.longitude, ts:pos.timestamp || Date.now(), acc:c.accuracy || 999, speedKmh:0, rawSpeedKmh:raw, seg:'normal'};
      const maxAcc = tracker.forceStart ? 95 : 65;
      if(p.acc > maxAcc){ tracker.bad++; tracker.lastRaw = p; tracker.gpsNote = `GPS lemah (${Math.round(p.acc)}m), tunggu sinyal stabil`; updateTrackerUI(); return; }
      if(!tracker.anchor){ tracker.anchor = p; tracker.lastRaw = p; tracker.gpsNote = `GPS lock ±${Math.round(p.acc)}m · belum hitung jarak`; updateTrackerUI(); return; }

      const ref = tracker.lastAccepted || tracker.anchor;
      const d = haversine(ref, p);
      const dt = Math.max(.001, (p.ts - ref.ts)/1000);
      const derivedSpeed = (d/dt)*3.6;
      const speedKmh = Number.isFinite(raw) && raw > 1 ? raw : derivedSpeed;

      if(!movementGate(ref, p, d, dt, speedKmh, raw)){
        const why = tracker.lastAccepted ? `Idle / drift ${Math.round(d)}m diabaikan` : `Indoor drift ${Math.round(d)}m diabaikan`;
        ignoreAsDrift(p, why);
        updateTrackerUI();
        return;
      }

      if(!tracker.lastAccepted){
        tracker.pending.push(p);
        tracker.gpsNote = `Gerakan terdeteksi ${tracker.pending.length}/3 · konfirmasi dulu`;
        if(tracker.pending.length >= 3 || d >= 85){
          const first = tracker.pending[0];
          first.speedKmh = 0; first.seg = 'normal';
          tracker.lastAccepted = first; tracker.route.push(first); tracker.points++;
          for(const nxt of tracker.pending.slice(1)){
            const prev = tracker.lastAccepted;
            const dd = haversine(prev, nxt);
            const ddT = Math.max(.001, (nxt.ts - prev.ts)/1000);
            const sp = Number.isFinite(nxt.rawSpeedKmh) && nxt.rawSpeedKmh > 1 ? nxt.rawSpeedKmh : (dd/ddT)*3.6;
            addAcceptedPoint(nxt, prev, dd, ddT, sp);
          }
          tracker.gpsNote = 'Moving confirmed · jarak mulai dihitung';
        }
        tracker.lastRaw = p;
        updateTrackerUI();
        return;
      }

      const ok = d < 180 && speedKmh < 115 && p.acc <= 45;
      if(ok) addAcceptedPoint(p, tracker.lastAccepted, d, dt, speedKmh);
      else { tracker.bad++; ignoreAsDrift(p, d >= 180 ? 'GPS loncat dibuang' : 'GPS kurang stabil'); }
      tracker.lastRaw = p;
      updateTrackerUI();
    }, err=>toast('GPS: ' + err.message, 'err'), {enableHighAccuracy:true, maximumAge:500, timeout:12000});
    tracker.tick = setInterval(()=>updateTrackerUI(), 1000);
    $('#trk-actions').innerHTML = `<button class="cancel-btn" data-action="tracker-pause">Pause</button><button class="cancel-btn" data-action="ride-checkpoint">+ Foto</button><button class="save-btn" data-action="tracker-stop">Stop</button>`;
    toast(forceStart ? 'Ride Lite dimulai: Low Signal' : 'GPS tracking siap. Jalan sekarang');
  }
  function trackerDuration(){ if(!tracker) return 0; return Date.now() - tracker.start - tracker.pausedMs - (tracker.paused ? Date.now()-tracker.pauseStart : 0); }
  function trackerAvgSpeed(){ if(!tracker || tracker.movingMs <= 0 || tracker.distance < 20) return 0; return (tracker.distance/1000) / (tracker.movingMs/3600000); }
  function updateTrackerUI(){
    if(!tracker || !el('trk-dist')) return;
    const dur=trackerDuration(), km=tracker.distance/1000, avg=trackerAvgSpeed();
    el('trk-dist').textContent = km.toFixed(2);
    el('trk-time').textContent = fmt.min(dur);
    el('trk-speed').textContent = Math.round(avg);
    el('trk-max').textContent = Math.round(tracker.maxSpeed);
    if(el('trk-gps-note')) el('trk-gps-note').textContent = tracker.gpsNote || 'GPS aktif';
    const badge = el('trk-mode');
    if(badge){
      const moving = tracker.currentSpeed > 6 && tracker.distance > 0;
      badge.textContent = tracker.paused ? 'Paused' : moving ? 'Moving' : tracker.lastAccepted ? 'Idle Lock' : (tracker.anchor && !tracker.forceStart ? 'GPS Siap' : 'Searching GPS');
      badge.className = 'gps-badge' + (tracker.bad > tracker.points ? ' danger' : tracker.ignored ? ' warn' : '');
    }
    const pulse = computeRidePulse(tracker.route, km, dur, tracker.maxSpeed, tracker.stopMs);
    const pg = el('trk-pulse'); if(pg && tracker.route.length > 3){ pg.style.display='grid'; pg.innerHTML = pulseMiniHtml(pulse); }
  }
  function pauseTracker(){
    if(!tracker) return; tracker.paused = !tracker.paused;
    if(tracker.paused){ tracker.pauseStart=Date.now(); $('#trk-actions').innerHTML = `<button class="cancel-btn" data-action="tracker-pause">Resume</button><button class="cancel-btn" data-action="ride-checkpoint">+ Foto</button><button class="save-btn" data-action="tracker-stop">Stop</button>`; }
    else { tracker.pausedMs += Date.now()-tracker.pauseStart; $('#trk-actions').innerHTML = `<button class="cancel-btn" data-action="tracker-pause">Pause</button><button class="cancel-btn" data-action="ride-checkpoint">+ Foto</button><button class="save-btn" data-action="tracker-stop">Stop</button>`; }
  }
  function pickRideCheckpoint(){ if(!tracker) return toast('Mulai ride dulu', 'err'); el('ride-photo')?.click(); }
  async function addRideCheckpointFromFile(file){
    if(!tracker || !file) return;
    const loc = tracker.lastAccepted || tracker.lastRaw || tracker.anchor;
    if(!loc) return toast('GPS belum lock', 'err');
    const photo = await readImageFile({files:[file]});
    const cp = {id:uid(), lat:loc.lat, lon:loc.lon, ts:Date.now(), photo, name:`Checkpoint ${tracker.checkpoints.length+1}`, note:''};
    tracker.checkpoints.push(cp);
    toast('Foto lokasi masuk checkpoint');
  }
  function stopTracker(){
    if(!tracker) return; if(tracker.watchId != null) navigator.geolocation.clearWatch(tracker.watchId); clearInterval(tracker.tick);
    const dur=trackerDuration(), km=tracker.distance/1000, avg=trackerAvgSpeed(), max=tracker.maxSpeed;
    const badRatio = tracker.bad / Math.max(1, tracker.bad + tracker.points); let detect='Suspicious', msg='Data agak nanggung, review dulu sebelum masuk KM.';
    if(km < .05 && max < 10){ detect='No Movement'; msg='Kayaknya kamu masih diam. Jarak tidak masuk Virtual KM kecuali kamu paksa simpan.'; }
    else if(badRatio > .45){ detect='GPS Unstable'; msg='GPS kurang stabil, jarak mungkin kurang akurat.'; }
    else if(avg < 8 && max < 15){ detect='Looks Like Walking'; msg='Bos, ini kelihatan kayak jalan kaki/jogging. Jangan masukin ke KM motor dulu?'; }
    else if((avg >= 12 || max >= 20) && km >= .2){ detect='Motor Ride'; msg='Trip terlihat seperti ride motor. Aman buat masuk Virtual KM.'; }
    const route = simplifyRoute(tracker.route, 450); const checkpoints = tracker.checkpoints || []; const pulse = computeRidePulse(route, km, dur, max, tracker.stopMs);
    const summary = {distance:km, durationMs:dur, movingMs:tracker.movingMs, avgSpeed:avg, maxSpeed:max, detect, msg, route, checkpoints, pulse, ignored:tracker.ignored, bad:tracker.bad, ts:Date.now(), name:'Ride '+fmt.date(Date.now())}; tracker = null;
    openSheet(`${sheetTitle('Review Ride Lite', 'KM belum masuk sebelum kamu simpan.')}
      <div class="tracker-display"><div class="tracker-distance">${km.toFixed(2)}</div><div class="muted">kilometer valid</div></div>
      <div class="tracker-meta"><div><b>${fmt.min(dur)}</b><small>Durasi</small></div><div><b>${Math.round(avg)}</b><small>avg valid</small></div><div><b>${Math.round(max)}</b><small>max km/j</small></div></div>
      <div class="pulse-grid">${pulseMiniHtml(pulse)}</div>
      <div class="warning-box"><b>${detect}</b><br>${msg}<br><br><b>Stable GPS:</b> ${summary.ignored||0} drift diabaikan · ${summary.bad||0} titik buruk dibuang. Estimasi bensin ${fmt.liter(pulse.fuelLiters)} · fuel stress ${pulse.fuelStress}/100. Ini estimasi GPS, bukan bukaan gas ECU asli.</div>
      ${renderRideSummaryMapShell('ride-review-map', route, checkpoints)}
      ${checkpointStripHtml(checkpoints)}
      <div class="form-actions"><button class="cancel-btn" data-action="discard-ride">Buang</button><button class="cancel-btn" data-action="log-ride-only">Log saja</button><button class="save-btn" data-action="save-ride-km">Simpan KM</button></div>`);
    sheet._rideSummary = summary;
    setTimeout(() => renderRideSummaryMap('ride-review-map', route, checkpoints), 80);
  }
  function saveRide(toKm){
    const r = sheet._rideSummary; if(!r) return closeSheet();
    r.id = uid(); r.savedToKm = !!toKm; state.rides.unshift(r);
    (r.checkpoints||[]).forEach((c,idx)=>state.places.unshift({id:uid(), name:c.name || `Checkpoint ${idx+1}`, lat:c.lat, lon:c.lon, photo:c.photo, note:`Dari ${r.name || 'Ride'}`, ts:c.ts || r.ts, rideId:r.id}));
    if(toKm){ state.profile.virtualKm += r.distance; state.fuelState.liters = Math.max(0, state.fuelState.liters - (r.distance / (state.fuelState.kmPerLiter || 55))); }
    save(); closeSheet(); toast(toKm ? 'Ride Lite masuk Virtual KM' : 'Ride Lite disimpan sebagai log'); renderAll();
  }

  function computeRidePulse(points=[], distanceKm=0, durationMs=0, maxSpeed=0, extraStopMs=0){
    const pts = points || []; let hard=0, push=0, stopMs=0, stressSegments=0, validSeg=0;
    for(let i=1;i<pts.length;i++){
      const a=pts[i-1], b=pts[i], dt=Math.max(1,(b.ts-a.ts)/1000), dv=safeNum(b.speedKmh)-safeNum(a.speedKmh), acc=dv/dt;
      if(safeNum(b.speedKmh)<4) stopMs += dt*1000;
      if(acc > 1.7 || b.seg==='stress'){ hard++; stressSegments++; }
      else if(acc > .8 || b.seg==='push'){ push++; stressSegments += .45; }
      if(b.seg && b.seg!=='bad') validSeg++;
    }
    stopMs += safeNum(extraStopMs);
    const durMin = Math.max(1, durationMs/60000); const hardRate = hard/durMin; const stopPct = durationMs ? stopMs/durationMs : 0;
    const fuelStress = clamp(Math.round(hardRate*22 + push*2 + stopPct*35 + Math.max(0, maxSpeed-65)*.7),0,100);
    const smoothScore = clamp(Math.round(100 - fuelStress*.72 - hard*2.2 - stopPct*12),0,100);
    const baseKml = state.fuelState.kmPerLiter || 55; const stressPenalty = 1 + fuelStress/170;
    const fuelLiters = distanceKm && baseKml ? distanceKm/baseKml*stressPenalty : 0;
    const fuelCost = fuelLiters * (state.fuelSettings?.prices?.pertalite || 10000);
    return {smoothScore, fuelStress, hardAccel:hard, speedPush:push, stopGoMs:Math.round(stopMs), fuelLiters, fuelCost, validSeg};
  }
  function pulseMiniHtml(p){
    return `<div class="pulse-metric"><b>${p.smoothScore}%</b><small>Smooth Score</small><div class="pulse-bar"><i style="width:${p.smoothScore}%"></i></div></div>
      <div class="pulse-metric fuel-stress"><b>${p.fuelStress}/100</b><small>Fuel Stress</small><div class="pulse-bar"><i style="width:${p.fuelStress}%"></i></div></div>
      <div class="pulse-metric"><b>${p.hardAccel}x</b><small>Speed spike</small></div>
      <div class="pulse-metric"><b>${fmt.min(p.stopGoMs)}</b><small>Stop-go</small></div>`;
  }
  function checkpointStripHtml(checkpoints){
    return checkpoints && checkpoints.length ? `<div class="checkpoint-strip">${checkpoints.map(c=>`<div class="checkpoint"><img src="${esc(c.photo)}" alt="checkpoint"/><small>${esc(c.name||'Checkpoint')}</small></div>`).join('')}</div>` : '';
  }
  function simplifyRoute(points, max=700){
    if(!points || points.length<=max) return points || [];
    const step = Math.ceil(points.length/max); return points.filter((_,i)=>i%step===0 || i===points.length-1);
  }

  function renderRouteStats(points=[], checkpoints=[]){
    const pts = points || [];
    return `<div class="gps-rules"><b>Route data</b><small>${pts.length} titik valid tersimpan · ${checkpoints.length} foto checkpoint. Map hanya dirender di summary/detail, bukan live tracking.</small></div>`;
  }

  function renderRideSummaryMapShell(id, route=[], checkpoints=[]){
    const pts = route || [];
    const hasRoute = pts.length >= 2;
    return `<div class="ride-map-card">
      <div class="ride-map-head"><b>Ride Summary Map</b><small>${pts.length} titik valid · ${checkpoints.length} foto checkpoint</small></div>
      <div id="${id}" class="ride-summary-map ${hasRoute ? '' : 'empty'}">
        ${hasRoute ? '<div class="map-loading">Loading map hasil ride...</div>' : '<div class="map-empty"><b>Belum ada rute valid</b><small>GPS belum cukup stabil buat gambar route.</small></div>'}
      </div>
      <small class="ride-map-note">Map muncul setelah ride selesai supaya tracking tetap ringan. Kalau offline, rute tetap tersimpan dan map bisa muncul saat online.</small>
    </div>`;
  }

  let _leafletLoadPromise = null;
  function ensureLeaflet(){
    if(window.L) return Promise.resolve(window.L);
    if(_leafletLoadPromise) return _leafletLoadPromise;
    _leafletLoadPromise = new Promise((resolve, reject) => {
      const cssId = 'leaflet-css';
      if(!document.getElementById(cssId)){
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => window.L ? resolve(window.L) : reject(new Error('Leaflet gagal dimuat'));
      script.onerror = () => reject(new Error('Map butuh internet untuk tile/library'));
      document.head.appendChild(script);
    });
    return _leafletLoadPromise;
  }

  function routeBounds(route=[]){
    const pts = (route || []).filter(p => Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon)));
    if(!pts.length) return null;
    const lats = pts.map(p=>Number(p.lat));
    const lons = pts.map(p=>Number(p.lon));
    return {minLat:Math.min(...lats), maxLat:Math.max(...lats), minLon:Math.min(...lons), maxLon:Math.max(...lons)};
  }

  function fallbackRouteSvg(route=[]){
    const pts = (route || []).filter(p => Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon)));
    if(pts.length < 2) return '<div class="map-empty"><b>Rute belum cukup</b><small>Minimal 2 titik valid.</small></div>';
    const b = routeBounds(pts);
    const w = 320, h = 180, pad = 24;
    const dx = Math.max(1e-9, b.maxLon - b.minLon), dy = Math.max(1e-9, b.maxLat - b.minLat);
    const xy = p => {
      const x = pad + ((Number(p.lon)-b.minLon)/dx) * (w-pad*2);
      const y = h - pad - ((Number(p.lat)-b.minLat)/dy) * (h-pad*2);
      return [x,y];
    };
    const d = pts.map((p,i)=>{ const [x,y]=xy(p); return `${i?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ');
    const [sx,sy] = xy(pts[0]); const [ex,ey] = xy(pts[pts.length-1]);
    return `<svg viewBox="0 0 ${w} ${h}" class="route-svg" role="img" aria-label="Route preview"><defs><linearGradient id="routeGrad" x1="0" x2="1"><stop offset="0" stop-color="#2d8cff"/><stop offset="1" stop-color="#23d2ff"/></linearGradient></defs><path d="${d}" fill="none" stroke="url(#routeGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${sx}" cy="${sy}" r="7" fill="#35d07f"/><circle cx="${ex}" cy="${ey}" r="7" fill="#ff5b6e"/></svg>`;
  }

  async function renderRideSummaryMap(id, route=[], checkpoints=[]){
    const box = el(id);
    if(!box) return;
    const pts = (route || []).filter(p => Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon)));
    if(pts.length < 2){ box.innerHTML = '<div class="map-empty"><b>Belum ada rute valid</b><small>Tracking tidak cukup buat map.</small></div>'; return; }
    try{
      const L = await ensureLeaflet();
      if(!el(id)) return;
      box.innerHTML = '';
      const map = L.map(id, {zoomControl:false, attributionControl:false, dragging:true, scrollWheelZoom:false, tap:true});
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {maxZoom:19, subdomains:'abcd'}).addTo(map);
      const latlngs = pts.map(p => [Number(p.lat), Number(p.lon)]);
      const line = L.polyline(latlngs, {color:'#2d8cff', weight:5, opacity:.92, lineCap:'round', lineJoin:'round'}).addTo(map);
      L.circleMarker(latlngs[0], {radius:7, color:'#06131e', weight:3, fillColor:'#35d07f', fillOpacity:1}).addTo(map);
      L.circleMarker(latlngs[latlngs.length-1], {radius:7, color:'#06131e', weight:3, fillColor:'#ff5b6e', fillOpacity:1}).addTo(map);
      (checkpoints||[]).filter(c=>c.lat&&c.lon).forEach(c => {
        const marker = L.circleMarker([Number(c.lat), Number(c.lon)], {radius:6, color:'#06131e', weight:2, fillColor:'#ffd166', fillOpacity:1}).addTo(map);
        if(c.photo) marker.bindPopup(`<img src="${c.photo}" style="width:120px;height:82px;object-fit:cover;border-radius:10px;display:block;margin-bottom:6px"><b>${esc(c.name || 'Checkpoint')}</b>`);
      });
      map.fitBounds(line.getBounds(), {padding:[18,18]});
      setTimeout(()=>map.invalidateSize(), 160);
    }catch(err){
      box.innerHTML = fallbackRouteSvg(pts) + `<div class="map-fallback-note">Map tile butuh internet. Ini preview rute offline dari titik GPS valid.</div>`;
    }
  }

  function openRideDetail(id){
    const r = state.rides.find(x=>x.id===id); if(!r) return;
    const pulse = r.pulse || computeRidePulse(r.route||[], r.distance, r.durationMs, r.maxSpeed);
    openSheet(`${sheetTitle(r.name || 'Ride Detail', 'Summary map, foto checkpoint, dan estimasi gaya riding.')}
      <div class="ride-pulse-strip big">
        <div><b>${pulse.smoothScore}%</b><small>Smooth Score</small></div>
        <div><b>${pulse.fuelStress}/100</b><small>Fuel Stress</small></div>
        <div><b>${pulse.hardAccel}x</b><small>Speed Spike</small></div>
      </div>
      <div class="tracker-meta"><div><b>${fmt.km(r.distance)}</b><small>Jarak</small></div><div><b>${fmt.min(r.durationMs)}</b><small>Durasi</small></div><div><b>${Math.round(r.maxSpeed||0)}</b><small>Max km/j</small></div></div>
      ${renderRideSummaryMapShell('ride-detail-map', r.route||[], r.checkpoints||[])}
      <div class="pulse-grid">${pulseMiniHtml(pulse)}</div>
      ${componentWearHtml({...r,pulse})}
      <div class="ai-insight">Kang Rusdi: ride ini ${pulse.fuelStress>65?'cukup boros karena banyak speed spike/stop-go':pulse.smoothScore>78?'halus dan cukup irit':'normal, masih bisa dibuat lebih smooth'}. Estimasi fuel ${fmt.liter(pulse.fuelLiters)} (${fmt.rp(pulse.fuelCost)}). Ini estimasi dari GPS, bukan ECU asli.</div>
      ${checkpointStripHtml(r.checkpoints||[])}
      <div class="form-actions"><button class="save-btn" data-action="close-sheet">Tutup</button></div>`);
    setTimeout(() => renderRideSummaryMap('ride-detail-map', r.route||[], r.checkpoints||[]), 80);
  }

  function openPlaceSheet(){
    openSheet(`${sheetTitle('Tambah Location Memory', 'Simpan spot touring, bengkel, SPBU, atau tempat foto motor.')}
      ${photoPicker('place-img','place-img-preview')}
      <label class="field"><span>Nama Lokasi</span><input id="place-name" placeholder="Contoh: Waduk Pondok" /></label>
      <div class="form-grid"><label class="field"><span>Latitude</span><input id="place-lat" type="number" step="any" placeholder="auto/current optional" /></label><label class="field"><span>Longitude</span><input id="place-lon" type="number" step="any" placeholder="auto/current optional" /></label></div>
      <label class="field"><span>Catatan</span><textarea id="place-note" placeholder="Cerita dikit..." rows="3"></textarea></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-place">Simpan Place</button></div>`);
    if(navigator.geolocation){ navigator.geolocation.getCurrentPosition(pos=>{ if(el('place-lat')){ el('place-lat').value=pos.coords.latitude; el('place-lon').value=pos.coords.longitude; } }, ()=>{}, {enableHighAccuracy:true, maximumAge:60000, timeout:6000}); }
  }
  async function savePlace(){
    const name = el('place-name').value.trim() || 'Location Memory';
    let photo=''; try{ photo = el('place-img')._dataUrl || await readImageFile(el('place-img')); }catch(e){ photo=''; }
    state.places.unshift({id:uid(), name, lat:safeNum(el('place-lat').value), lon:safeNum(el('place-lon').value), note:el('place-note').value.trim(), photo, ts:Date.now()});
    save(); closeSheet(); toast('Location memory disimpan'); renderAll();
  }

  function saveAISettings(){ state.ai.key=el('ai-key').value.trim(); state.ai.model=normalizeModelId(el('ai-model').value || DEFAULT_AI_MODEL); state.ai.baseUrl=el('ai-base-url').value.trim()||DEFAULT_AI_BASE_URL; el('ai-model').value = state.ai.model; save(); toast('AI settings disimpan'); renderAI(); }
  function appContext(){
    const worst = state.serviceComponents.map(c=>({name:c.name, health:serviceHealth(c).pct, left:componentSub(serviceHealth(c))})).sort((a,b)=>a.health-b.health).slice(0,5);
    const bad = state.bikeChecks.filter(p=>p.status!=='ok').slice(0,8).map(p=>`${p.name}: ${partStatusLabel(p.status)}`);
    return `Motor: ${state.profile.name}. Virtual KM: ${fmt.km(state.profile.virtualKm)}. NGR Smart Garage OS Health 2.0: ${healthScore()}%. Smart recommendation: ${buildSmartRecommendations(1)[0]?.title || 'aman'}. Service prioritas: ${worst.map(w=>`${w.name} ${w.health}% (${w.left})`).join('; ')}. Bike check bermasalah: ${bad.join('; ') || 'tidak ada'}. Fuel: ${fmt.liter(state.fuelState.liters)}, ${state.fuelState.kmPerLiter.toFixed(0)} km/L. Budget bulan ini: ${fmt.rp(monthExpenses())}. Link library: ${getLinkLibrary().slice(0,5).map(l=>`${l.title} (${l.category})`).join('; ') || 'kosong'}. Ride terakhir: ${latestRideContext()}. Jawab sebagai Kang Rusdi, santai, praktis, Bahasa Indonesia. Jelaskan kalau analisis fuel/ride itu estimasi GPS, bukan ECU asli.`;
  }
  async function sendAI(){
    const input = el('ai-input'); const text = input.value.trim(); if(!text) return; if(!state.ai.key) return toast('Isi API Key dulu', 'err');
    state.ai.chat.push({role:'user', content:text}); input.value=''; renderAI();
    state.ai.chat.push({role:'assistant', content:'Kang Rusdi mikir dulu...'}); renderAI();
    try{
      const messages = [{role:'system', content:appContext()}, ...state.ai.chat.filter(m=>m.content!=='Kang Rusdi mikir dulu...').slice(-12)];
      const model = normalizeModelId(state.ai.model);
      const res = await fetch(state.ai.baseUrl || DEFAULT_AI_BASE_URL, {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+state.ai.key,'X-Title':'NGR Health Garage'}, body:JSON.stringify({model, messages})});
      if(!res.ok) throw new Error(cleanAiError(await res.text(), res.status)); const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || data.output_text || 'Maaf bos, respon kosong.';
      state.ai.chat[state.ai.chat.length-1] = {role:'assistant', content:reply}; save(); renderAI();
    }catch(e){ state.ai.chat[state.ai.chat.length-1] = {role:'assistant', content:'⚠️ ' + (e.message || e)}; save(); renderAI(); }
  }

  function exportData(){ const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ngr-health-backup.json'; a.click(); URL.revokeObjectURL(a.href); }
  function importData(file){ const r=new FileReader(); r.onload=()=>{ try{ const data=JSON.parse(r.result); if(!data.profile) throw new Error('File bukan backup NGR'); state = {...createDefaultState(), ...data, version:VERSION}; save(); toast('Backup berhasil diimport'); renderAll(); }catch(e){ toast('Import gagal: '+e.message,'err'); } }; r.readAsText(file); }
  function resetData(){ if(confirm('Reset semua data NGR v2?')){ localStorage.removeItem(LS_KEY); state=createDefaultState(); save(); renderAll(); toast('Data direset'); } }

  function renderAll(){ renderHome(); renderGarage(); renderRide(); renderFuel(); renderAI(); hydrateIcons(); }

  function openProfileSheet(){
    openSheet(`${sheetTitle('Profil Motor', 'Foto motor juga bisa disimpan lokal.')}
      ${photoPicker('prof-img','prof-img-preview', state.profile.image || '')}
      <label class="field"><span>Nama Motor</span><input id="prof-name" value="${esc(state.profile.name)}" /></label>
      <div class="form-grid"><label class="field"><span>Plat</span><input id="prof-plate" value="${esc(state.profile.plate)}" /></label><label class="field"><span>Warna</span><input id="prof-color" value="${esc(state.profile.color)}" /></label></div>
      <label class="field"><span>Virtual KM</span><input id="prof-km" type="number" value="${state.profile.virtualKm}" /></label>
      <div class="form-actions"><button class="cancel-btn" data-action="close-sheet">Batal</button><button class="save-btn" data-action="save-profile">Simpan</button></div>`);
  }
  async function saveProfile(){
    state.profile.name=el('prof-name').value.trim()||'Honda Beat FI 2014'; state.profile.plate=el('prof-plate').value.trim(); state.profile.color=el('prof-color').value.trim(); state.profile.virtualKm=safeNum(el('prof-km').value);
    try { const img = el('prof-img')._dataUrl || await readImageFile(el('prof-img')); if(img) state.profile.image = img; } catch(e){ toast(e.message, 'err'); return; }
    save(); closeSheet(); toast('Profil disimpan'); renderAll();
  }

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
      'link': openLinkSheet,
      'ride': openRideSheet,
      'add-custom-km': () => addKm(el('km-custom').value),
      'save-service': saveService,
      'save-check': saveCheck,
      'save-fuel': saveFuel,
      'save-fuel-settings': saveFuelSettings,
      'save-saving': saveSaving,
      'save-modif': saveModif,
      'save-style': saveStyle,
      'save-link': saveLink,
      'save-expense': saveExpense,
      'tracker-start': startGpsWarmup,
      'tracker-pause': pauseTracker,
      'tracker-stop': stopTracker,
      'warmup-start': () => beginTrackerFromWarmup(false),
      'warmup-force': () => beginTrackerFromWarmup(true),
      'warmup-cancel': () => { stopGpsWarmup(); closeSheet(); },
      'ride-checkpoint': pickRideCheckpoint,
      'discard-ride': closeSheet,
      'log-ride-only': () => saveRide(false),
      'save-ride-km': () => saveRide(true),
      'place': openPlaceSheet,
      'save-place': savePlace
    };
    if(a === 'view-ride') return openRideDetail(target.dataset.id);
    if(a === 'pick-photo') return el(target.dataset.target)?.click();
    if(a === 'ai-model-preset'){ el('ai-model').value = target.dataset.model || DEFAULT_AI_MODEL; return saveAISettings(); }
    if(a === 'add-km') return addKm(target.dataset.km);
    if(a === 'fuel-shortcut') return openFuelSheet(target.dataset.fuel, safeNum(target.dataset.liter), false);
    if(actions[a]) return actions[a]();
  });

  document.addEventListener('change', async e => {
    const input = e.target;
    if(input.id === 'ride-photo'){ const f=input.files && input.files[0]; if(f) addRideCheckpointFromFile(f).catch(err=>toast(err.message||'Foto gagal','err')); input.value=''; return; }
    if(!input.matches('input[type="file"][data-preview]')) return;
    try{
      const data = await readImageFile(input);
      input._dataUrl = data;
      const img = el(input.dataset.preview);
      if(img && data){ img.src = data; img.style.display = 'block'; }
    }catch(err){ toast(err.message || 'Foto gagal dibaca', 'err'); input.value=''; }
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
