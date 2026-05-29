'use strict';

const VERSION = 'v8.0 iOS Map Premium';
const KEY = 'ngr8_ios_map_premium_data';
const OLD_KEYS = ['ngr7_map_rusdi_data','ngr6_data','ngr5_data','ngr_data'];

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const now = () => Date.now();
const clamp = (n,min,max) => Math.max(min, Math.min(max, n));
const num = (v, d=0) => Number.isFinite(Number(v)) ? Number(v) : d;
const id = () => Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4);
const todayKey = (ts=now()) => new Date(ts).toISOString().slice(0,10);
const fmtDate = ts => new Date(ts).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
const fmtTime = ts => new Date(ts).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
const fmtDay = ts => new Date(ts).toLocaleDateString('id-ID',{weekday:'short'});
const fmtKm = n => `${num(n).toFixed(num(n)<10?1:0)} km`;
const fmtL = n => `${num(n).toFixed(2)} L`;
const fmtRp = n => 'Rp' + Math.round(num(n)).toLocaleString('id-ID');

const SERVICE_PRESETS = [
  {key:'oil', icon:'🛢', name:'Oli Mesin', intervalKm:2000, intervalDays:60, cost:65000, note:'Paling penting buat mesin. Ganti lebih cepat kalau sering macet/stop-go.'},
  {key:'gear', icon:'⚙', name:'Oli Gardan', intervalKm:8000, intervalDays:180, cost:25000, note:'Buat area gardan matic. Jangan kelamaan biar suara belakang aman.'},
  {key:'spark', icon:'⚡', name:'Busi', intervalKm:8000, intervalDays:180, cost:30000, note:'Cek kalau susah starter, brebet, atau mati mendadak.'},
  {key:'air', icon:'🌬', name:'Filter Udara', intervalKm:12000, intervalDays:240, cost:45000, note:'Cepat kotor kalau sering jalan berdebu.'},
  {key:'cvt', icon:'🌀', name:'CVT', intervalKm:8000, intervalDays:180, cost:85000, note:'Cek kalau tarikan berat, getar awal, atau bunyi area CVT.'},
  {key:'brake', icon:'🛑', name:'Rem', intervalKm:10000, intervalDays:180, cost:55000, note:'Jangan ditunda kalau mulai tipis/seret.'},
  {key:'tire', icon:'🛞', name:'Ban', intervalKm:16000, intervalDays:365, cost:260000, note:'Cek tekanan, retak, paku, benjol.'},
  {key:'battery', icon:'🔋', name:'Aki', intervalKm:18000, intervalDays:365, cost:220000, note:'Cek kalau starter berat, lampu redup, klakson lemah.'}
];

const GUIDE_DATA = {
  roadside:{icon:'🆘', title:'Motor mati di jalan', tag:'darurat', danger:'Pinggirkan dulu. Jangan bongkar di tengah jalan/area bahaya.', steps:['Cek bensin dulu, jangan percaya estimasi kalau tangki belum dikalibrasi.','Kontak ON, lihat indikator FI: mati, nyala terus, atau kedip.','Cek kelistrikan: lampu/klakson/starter kuat atau lemah.','Cek sekring utama kalau semua listrik mati.','Cek cop busi/kabel coil kalau gampang dijangkau.','Kalau starter muter tapi mesin tidak hidup, busi bisa basah/mati atau bensin/injektor bermasalah.','Kalau FI kedip, hitung panjang-pendek di FI Code Helper.','Kalau ada bunyi kasar, bau bensin kuat, atau rem/ban bermasalah: jangan dipaksa jauh.'], service:'spark'},
  fi:{icon:'⚠️', title:'FI Code Helper darurat', tag:'kode', danger:'Kode FI cuma petunjuk area masalah, bukan vonis part pasti.', steps:['Panjang biasanya dihitung puluhan, pendek satuan. Contoh 1 panjang + 2 pendek = 12.','Catat pola kedipan 2-3 putaran biar yakin.','Cek aki dulu karena tegangan drop bisa bikin sensor error aneh.','Cek soket/kabel sekitar sensor yang dicurigai.','Kalau motor masih normal tapi FI nyala, jalan pelan ke bengkel boleh dengan pantau gejala.','Kalau mesin brebet parah/mati-mati, jangan dipaksa.'], service:null},
  spark:{icon:'⚡', title:'Cek busi mati/lemah', tag:'cek cepat', danger:'Jangan tes api dekat bensin. Mesin panas, tunggu adem dulu.', steps:['Gejala: susah hidup, brebet, langsam pincang, mati saat gas awal.','Lepas cop busi pelan, buka busi pakai kunci busi.','Cek warna: coklat muda normal, hitam kering/basah perlu dicek, putih pucat bisa terlalu panas/miskin.','Kalau busi basah, keringkan/ganti. Kalau elektroda aus, ganti.','Pasang busi pakai tangan dulu biar ulir gak slek, baru kencangkan wajar.'], service:'spark'},
  oil:{icon:'🛢', title:'Ganti oli mesin', tag:'service', danger:'Mesin cukup hangat, jangan panas ekstrem. Oli bekas jangan dibuang ke selokan.', steps:['Standar tengah, matikan mesin.','Buka baut pembuangan oli dan tampung oli bekas.','Tunggu tetesan kecil, pasang baut lagi rapat wajar.','Isi oli baru sesuai takaran motor.','Nyalakan 30-60 detik, matikan, cek rembesan.','Catat service di NGR agar health oli balik 100%.'], service:'oil'},
  gear:{icon:'⚙', title:'Ganti oli gardan', tag:'service', danger:'Jangan sampai baut slek. Kalau belum yakin, lakukan di bengkel.', steps:['Standar tengah.','Buka baut bawah, buang oli gardan lama.','Pasang lagi baut bawah.','Isi oli gardan baru dari lubang atas sesuai takaran.','Bersihkan area baut, cek rembes setelah dipakai.'], service:'gear'},
  air:{icon:'🌬', title:'Cek filter udara', tag:'cek cepat', danger:'Filter kertas jangan dicuci air. Kalau kotor parah, ganti.', steps:['Buka box filter udara.','Cek filter: debu tebal, basah oli, robek, atau mampet.','Bersihkan box dengan lap kering.','Pasang rapat lagi supaya udara kotor tidak masuk.','Catat kalau filter sudah diganti.'], service:'air'},
  cvt:{icon:'🌀', title:'Cek CVT / tarikan berat', tag:'service', danger:'Bongkar CVT butuh alat. Jangan semprot cairan sembarangan ke kampas.', steps:['Dengarkan sumber bunyi: kiri CVT atau kanan mesin.','Gejala CVT: getar awal, tarikan berat, bunyi kretek, rpm naik tapi jalan lambat.','Cek kapan terakhir belt/roller/kampas ganda dibersihkan.','Kalau makin parah, jadwalkan bongkar CVT.','Setelah servis, catat biaya dan KM di NGR.'], service:'cvt'},
  battery:{icon:'🔋', title:'Aki / starter lemah', tag:'darurat', danger:'Jangan korslet terminal aki. Kalau aki panas/bengkak/bau, hentikan pengecekan.', steps:['Cek lampu/klakson: kalau lemah, aki bisa drop.','Cek terminal aki kendor/berkarat.','Cek sekring utama.','Kalau aki drop berulang, cek sistem pengisian di bengkel.','Kalau semua listrik mati total, jangan langsung vonis aki; cek sekring/kabel massa.'], service:'battery'},
  brake:{icon:'🛑', title:'Rem / ban sebelum jalan', tag:'safety', danger:'Kalau rem blong atau ban kempes parah, jangan jalan.', steps:['Cek tekanan ban, paku, sobek, benjol.','Cek rem depan/belakang: pakem, bunyi kasar, atau seret.','Cek kampas kalau terlihat tipis.','Kalau habis kena lubang, cek kaki-kaki/baut roda.','Catat problem kalau handling aneh.'], service:'brake'}
};

function baseData(){
  const ts = now();
  return {
    version: VERSION,
    bike:{name:'Honda Beat FI 2014', virtualKm:0, tankLiters:4.0},
    dailyLogs:[],
    services: SERVICE_PRESETS.map(s => ({...s, lastKm:0, lastDate:ts, lastCost:0, history:[]})),
    fuel:{liters:0, kmpl:55, prices:{Pertalite:10000, Pertamax:12950, 'Shell Super':13990}, logs:[], balance:[]},
    money:{monthlyBudget:250000, fuelBudget:100000, savingsTarget:1000000, savings:0, expenses:[]},
    routes:{orsKey:'', favorites:[], logs:[]},
    assist:{messages:[{role:'bot', ts, text:'Yo bos, Kang Rusdi siap. Sekarang NGR fokus manual harian + maps titik-ke-titik, bukan GPS ribet.'}], problems:[]},
    ai:{baseUrl:'https://openrouter.ai/api/v1', key:'', model:'openrouter/auto'},
    settings:{reminderEnabled:false, reminderTime:'20:00', lastReminderDate:'', routeProfile:'driving-car', theme:'glass', mapStyle:'positron', mapTilerKey:''}
  };
}

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(raw) return normalize(JSON.parse(raw));
  }catch(e){ console.warn(e); }
  const migrated = migrateOld();
  const data = migrated || baseData();
  save(data); return data;
}
function save(data=state){ localStorage.setItem(KEY, JSON.stringify(data)); }
function normalize(d){
  const b = baseData();
  d.version = VERSION;
  d.bike = {...b.bike, ...(d.bike||{})};
  d.dailyLogs = Array.isArray(d.dailyLogs) ? d.dailyLogs : [];
  d.services = Array.isArray(d.services) && d.services.length ? mergeServices(d.services) : b.services;
  d.fuel = {...b.fuel, ...(d.fuel||{}), prices:{...b.fuel.prices, ...((d.fuel||{}).prices||{})}, logs: Array.isArray(d.fuel?.logs)?d.fuel.logs:[], balance:Array.isArray(d.fuel?.balance)?d.fuel.balance:[]};
  d.money = {...b.money, ...(d.money||{}), expenses:Array.isArray(d.money?.expenses)?d.money.expenses:[]};
  d.routes = {...b.routes, ...(d.routes||{}), favorites:Array.isArray(d.routes?.favorites)?d.routes.favorites:[], logs:Array.isArray(d.routes?.logs)?d.routes.logs:[]};
  d.assist = {...b.assist, ...(d.assist||{}), messages:Array.isArray(d.assist?.messages)?d.assist.messages:b.assist.messages, problems:Array.isArray(d.assist?.problems)?d.assist.problems:[]};
  d.ai = {...b.ai, ...(d.ai||{})};
  d.settings = {...b.settings, ...(d.settings||{})};
  return d;
}
function mergeServices(input){
  return SERVICE_PRESETS.map(def => {
    const old = input.find(s => s.key === def.key || s.name === def.name);
    return {...def, ...(old||{}), history:Array.isArray(old?.history)?old.history:[]};
  });
}
function migrateOld(){
  for(const k of OLD_KEYS){
    try{
      const raw = localStorage.getItem(k);
      if(!raw) continue;
      const old = JSON.parse(raw);
      const d = baseData();
      if(old.profile){ d.bike.name = old.profile.name || d.bike.name; d.bike.virtualKm = num(old.profile.virtualKm, num(old.profile.km)); d.bike.tankLiters = num(old.profile.tankLiters, 4); }
      if(old.fuel){ d.fuel = {...d.fuel, ...old.fuel, prices:{...d.fuel.prices, ...(old.fuel.prices||{})}, logs:Array.isArray(old.fuel.logs)?old.fuel.logs:[], balance:Array.isArray(old.fuel.balance)?old.fuel.balance:[]}; }
      if(Array.isArray(old.components)) d.services = old.components.map((c,i)=> ({...(SERVICE_PRESETS[i]||SERVICE_PRESETS[0]), ...c, history:[]}));
      if(Array.isArray(old.expenses)) d.money.expenses = old.expenses;
      if(old.routes){ d.routes.favorites = old.routes.favorites || []; d.routes.logs = old.routes.logs || []; }
      if(old.ai) d.ai = {...d.ai, ...old.ai};
      if(old.settings){ d.money.monthlyBudget = num(old.settings.monthlyBudget, d.money.monthlyBudget); d.money.fuelBudget = num(old.settings.fuelBudget, d.money.fuelBudget); }
      d.assist.messages.push({role:'bot',ts:now(),text:'Data lama kebaca dan dimigrasi ke NGR v7.'});
      return normalize(d);
    }catch(e){ console.warn('migrate fail', k, e); }
  }
  return null;
}

let state = load();
let activeTab = 'home';
let map = null, mapLoaded = false;
let markers = [];
let draftRoute = {mode:'start', points:[], line:null, result:null};

function serviceHealth(s){
  const kmUsed = Math.max(0, num(state.bike.virtualKm) - num(s.lastKm));
  const daysUsed = Math.max(0, (now() - num(s.lastDate, now())) / 86400000);
  const kmPct = s.intervalKm ? (1 - kmUsed / s.intervalKm) * 100 : 100;
  const dayPct = s.intervalDays ? (1 - daysUsed / s.intervalDays) * 100 : 100;
  return clamp(Math.min(kmPct, dayPct), 0, 100);
}
function serviceRemain(s){
  const kmUsed = Math.max(0, num(state.bike.virtualKm) - num(s.lastKm));
  const daysUsed = Math.max(0, (now() - num(s.lastDate, now())) / 86400000);
  return {km: Math.max(0, num(s.intervalKm)-kmUsed), days: Math.max(0, Math.round(num(s.intervalDays)-daysUsed)), usedKm:kmUsed};
}
function healthColor(p){ return p < 22 ? 'var(--red)' : p < 45 ? 'var(--yellow)' : 'var(--green)'; }
function overallHealth(){
  const arr = state.services.map(serviceHealth);
  const avg = arr.reduce((a,b)=>a+b,0) / Math.max(1, arr.length);
  const fuelPenalty = state.fuel.liters <= .25 ? 8 : 0;
  return clamp(avg - fuelPenalty, 0, 100);
}
function servicePriority(){ return [...state.services].sort((a,b)=> serviceHealth(a)-serviceHealth(b)); }
function fuelRange(){ return num(state.fuel.liters) * num(state.fuel.kmpl,55); }
function monthRange(ts=now()){
  const d = new Date(ts); const start = new Date(d.getFullYear(), d.getMonth(), 1).getTime(); const end = new Date(d.getFullYear(), d.getMonth()+1, 1).getTime();
  return {start,end};
}
function inThisMonth(ts){ const r=monthRange(); return ts>=r.start && ts<r.end; }
function monthExpenses(cat){ return state.money.expenses.filter(e => inThisMonth(num(e.ts)) && (!cat || e.cat===cat)).reduce((a,e)=>a+num(e.amount),0); }
function dailyFor(date=todayKey()){ return state.dailyLogs.filter(l=>l.date===date); }
function todayKm(){ return dailyFor().reduce((a,l)=>a+num(l.km),0); }
function streakInfo(){
  let streak=0; const d = new Date();
  for(let i=0;i<365;i++){
    const key = new Date(d.getFullYear(),d.getMonth(),d.getDate()-i).toISOString().slice(0,10);
    if(dailyFor(key).length) streak++; else break;
  }
  let best=0, cur=0; const dates=[...new Set(state.dailyLogs.map(l=>l.date))].sort(); let prev=null;
  for(const dk of dates){
    const t = new Date(dk).getTime()/86400000;
    if(prev!==null && t===prev+1) cur++; else cur=1;
    best=Math.max(best,cur); prev=t;
  }
  return {streak,best};
}
function logEvent(text){
  state.assist.messages.push({role:'bot', ts:now(), text});
  state.assist.messages = state.assist.messages.slice(-60);
}
function addExpense(cat,title,amount,note=''){
  const item={id:id(), ts:now(), cat, title, amount:num(amount), note};
  state.money.expenses.unshift(item); return item;
}
function consumeFuelByKm(km, source='KM'){
  const used = num(km) / Math.max(1, num(state.fuel.kmpl,55));
  if(used>0){
    state.fuel.liters = Math.max(0, num(state.fuel.liters)-used);
    state.fuel.balance.push({id:id(), ts:now(), liters: state.fuel.liters, delta:-used, source});
  }
  return used;
}
function addDailyKm(km, source='Manual', note=''){
  km = Math.max(0, num(km));
  const ts = now();
  const before = num(state.bike.virtualKm);
  state.bike.virtualKm = before + km;
  const fuelUsed = consumeFuelByKm(km, source);
  state.dailyLogs.unshift({id:id(), ts, date:todayKey(ts), day:fmtDay(ts), km, source, note, fuelUsed});
  logEvent(`Daily KM masuk: +${fmtKm(km)} dari ${source}. Estimasi bensin kepakai ${fmtL(fuelUsed)}. Virtual KM sekarang ${fmtKm(state.bike.virtualKm)}.`);
  save(); render(); checkReminder(); toast(`Masuk +${fmtKm(km)} ke Daily KM`);
}
function fillFuel(type, liters, pricePerLiter){
  liters = Math.max(0, num(liters)); pricePerLiter = Math.max(0, num(pricePerLiter));
  const amount = liters * pricePerLiter;
  state.fuel.liters = Math.min(num(state.bike.tankLiters,4), num(state.fuel.liters)+liters);
  const log={id:id(), ts:now(), type, liters, pricePerLiter, amount, km:num(state.bike.virtualKm)};
  state.fuel.logs.unshift(log);
  state.fuel.balance.push({id:id(), ts:log.ts, liters:state.fuel.liters, delta:liters, source:`Isi ${type}`});
  addExpense('Fuel', `Isi ${type}`, amount, `${fmtL(liters)} @ ${fmtRp(pricePerLiter)}`);
  logEvent(`BBM masuk: ${type} ${fmtL(liters)}. Range nambah kira-kira ${fmtKm(liters*num(state.fuel.kmpl,55))}.`);
  save(); render(); toast(`BBM ${type} +${fmtL(liters)}`);
}
function recordService(key, cost, note=''){
  const s = state.services.find(x=>x.key===key); if(!s) return;
  const ts=now();
  s.lastKm = num(state.bike.virtualKm); s.lastDate = ts; s.lastCost = num(cost); s.history.unshift({id:id(), ts, km:s.lastKm, cost:num(cost), note});
  if(num(cost)>0) addExpense('Service', s.name, cost, note);
  logEvent(`Service dicatat: ${s.name}. Health ${s.name} balik 100% di ${fmtKm(s.lastKm)}.`);
  save(); render(); toast(`${s.name} dicatat`);
}
function addProblem(title, severity='pantau', note=''){
  state.assist.problems.unshift({id:id(), ts:now(), title, severity, note, status:'dipantau'});
  logEvent(`Problem dicatat: ${title}. Status dipantau dulu.`);
  save(); render(); toast('Problem dicatat');
}

function render(){
  $('#tab-home').innerHTML = renderHome();
  $('#tab-maps').innerHTML = renderMaps();
  $('#tab-fuel').innerHTML = renderFuel();
  $('#tab-money').innerHTML = renderMoney();
  $('#tab-assist').innerHTML = renderAssist();
  $('#top-sub').textContent = `${state.bike.name} · ${fmtKm(state.bike.virtualKm)}`;
  bindScreenActions();
  drawChartsSoon();
  if(activeTab==='maps') setTimeout(ensureMap, 60);
}

function renderHome(){
  const h=overallHealth(); const pr=servicePriority(); const s=streakInfo(); const tKm=todayKm();
  const status = tKm>0 ? `<span class="pill green">Hari ini +${fmtKm(tKm)}</span>` : dailyFor().length ? '<span class="pill yellow">Hari ini 0 km</span>' : '<span class="pill red">Belum input</span>';
  return `
    <div class="section-title"><h2>Home</h2><small>${VERSION}</small></div>
    <div class="card health-card">
      <div class="health-ring" style="--pct:${h.toFixed(0)};--col:${healthColor(h)}"><div><strong>${h.toFixed(0)}%</strong><small>Health</small></div></div>
      <div class="stack">
        <div class="grid2">
          <div class="stat-tile"><b>${fmtKm(state.bike.virtualKm)}</b><span>Virtual KM</span></div>
          <div class="stat-tile ${state.fuel.liters<.4?'danger':''}"><b>${fmtL(state.fuel.liters)}</b><span>Fuel · ${fmtKm(fuelRange())}</span></div>
        </div>
        <div class="grid2">
          <div class="stat-tile"><b>${s.streak} hari</b><span>Streak input</span></div>
          <div class="stat-tile"><b>${fmtRp(monthExpenses())}</b><span>Money bulan ini</span></div>
        </div>
      </div>
    </div>

    <div class="card rusdi-card">
      <div class="between"><div><b>Daily KM</b><div class="small muted">Input harian biar streak gak putus. GPS dibuang.</div></div>${status}</div>
      <div class="chips" style="margin-top:12px">
        <button class="chip" data-action="add-km" data-km="0">0 km</button>
        <button class="chip" data-action="add-km" data-km="5">+5</button>
        <button class="chip" data-action="add-km" data-km="10">+10</button>
        <button class="chip" data-action="add-km" data-km="15">+15</button>
        <button class="chip" data-action="custom-km">Custom</button>
        <button class="chip active" data-tabgo="maps">Pakai Maps</button>
      </div>
      <div class="hr"></div>
      ${renderMiniCalendar()}
    </div>

    <div class="quick-grid">
      <button class="quick primary" data-action="custom-km"><i>＋</i>KM</button>
      <button class="quick" data-action="fuel-sheet"><i>⛽</i>Fuel</button>
      <button class="quick" data-action="service-sheet"><i>🛠</i>Service</button>
      <button class="quick" data-action="expense-sheet"><i>💸</i>Money</button>
    </div>

    <div class="section-title"><h2>Service Priority</h2><small>terdekat</small></div>
    <div class="list">${pr.slice(0,4).map(renderServiceItem).join('')}</div>

    <div class="section-title"><h2>Kang Rusdi Scan</h2><small>ringkas</small></div>
    <div class="card rusdi-card">
      <div class="small">${localScan()}</div>
      <button class="btn block" style="margin-top:12px" data-tabgo="assist">Buka NGR Assist</button>
    </div>`;
}
function renderMiniCalendar(){
  const d = new Date(); let html='<div class="calendar">';
  for(let i=13;i>=0;i--){
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()-i);
    const key = day.toISOString().slice(0,10); const logs=dailyFor(key); const km=logs.reduce((a,l)=>a+num(l.km),0);
    const cls = logs.length ? (km>0?'done':'zero') : ''; const today = key===todayKey() ? ' today' : '';
    html += `<div class="daydot ${cls}${today}"><small>${day.toLocaleDateString('id-ID',{weekday:'short'}).slice(0,3)}</small>${day.getDate()}</div>`;
  }
  html += '</div>'; return html;
}
function renderServiceItem(s){
  const h=serviceHealth(s), r=serviceRemain(s);
  return `<div class="item" data-action="service-detail" data-key="${s.key}">
    <div class="item-icon">${s.icon}</div><div class="item-main"><b>${s.name}</b><span>Sisa ${fmtKm(r.km)} / ${r.days} hari · ${s.note}</span></div>
    <div class="mini-ring" style="--pct:${h.toFixed(0)};--col:${healthColor(h)}">${h.toFixed(0)}%</div>
  </div>`;
}
function renderMaps(){
  const r = draftRoute.result;
  const pts = draftRoute.points;
  return `
    <div class="map-shell">
      <div class="map-hero">
        <div>
          <div class="eyebrow">NGR MAPS</div>
          <h2>Route Planner</h2>
          <p>Tap start dan tujuan. Rute ikut jalan, bukan garis lurus GPS ribet.</p>
        </div>
        <button class="map-reset" data-action="route-reset" aria-label="Reset route">↺</button>
      </div>
      <div class="premium-map-card">
        <div id="map"></div>
        <div class="route-help"><span id="mapHint" class="glass-pill">${mapHint()}</span></div>
        <div id="mapFallback" class="map-fallback hide">
          <b>Map belum kebuka</b>
          <span>Cek internet/CDN. Routing masih bisa dicoba, atau pakai rute favorit/manual KM.</span>
        </div>
      </div>
      <div class="route-dock">
        <div class="seg-control">
          <button class="seg ${draftRoute.mode==='start'?'on':''}" data-action="map-mode" data-mode="start">Start</button>
          <button class="seg ${draftRoute.mode==='goal'?'on':''}" data-action="map-mode" data-mode="goal">Tujuan</button>
          <button class="seg ${draftRoute.mode==='stop'?'on':''}" data-action="map-mode" data-mode="stop">Stop</button>
        </div>
        <div class="route-metrics">
          <div><b id="routePts">${pts.length}</b><span>Titik</span></div>
          <div><b id="routeKm">${r?fmtKm(r.km):'-'}</b><span>Jarak</span></div>
          <div><b id="routeFuel">${r?fmtRp(r.cost):'-'}</b><span>Est. BBM</span></div>
        </div>
        <div class="route-actions">
          <button class="btn primary" data-action="route-calc">Hitung rute jalan</button>
          <button class="btn" data-action="route-add-km">Tambah ke KM</button>
          <button class="btn" data-action="route-save">Simpan</button>
        </div>
      </div>
    </div>
    <div class="card rusdi-card premium">
      <div class="between"><div><b>Kang Rusdi Route Scan</b><div class="small muted">Baca rute, fuel, money, dan service.</div></div><span class="pill blue">Context AI</span></div>
      <div id="routeScanText" class="small" style="margin-top:10px">${routeScan()}</div>
      <div class="row" style="margin-top:12px"><input id="map-ai-input" placeholder="Tanya: rute ini boros gak?" /><button class="btn primary" data-action="map-ai-ask">Kirim</button></div>
    </div>
    <div class="section-title"><h2>Rute Favorit</h2><small>${state.routes.favorites.length}</small></div>
    <div id="routeFavList" class="list">${state.routes.favorites.length ? state.routes.favorites.map(renderRouteFav).join('') : `<div class="card tight muted small">Belum ada rute favorit. Tap start-tujuan, hitung, lalu simpan.</div>`}</div>
    <div class="warnbox soft">Default map pakai OpenFreeMap/MapLibre biar gratis. Kalau punya MapTiler key, isi di Settings biar basemap makin premium.</div>`;
}

function applyAppTheme(){
  const theme = state?.settings?.theme || 'glass';
  document.body.classList.toggle('theme-solid', theme === 'solid');
  document.body.classList.toggle('theme-glass', theme !== 'solid');
}
function setMapMode(mode){
  draftRoute.mode = mode || 'start';
  updateMapUI();
  toast(mode==='start'?'Tap map buat titik start':mode==='goal'?'Tap map buat tujuan':'Tap map buat stop/waypoint');
}
function updateMapUI(){
  const hint=$('#mapHint'); if(hint) hint.textContent = mapHint();
  const pts=$('#routePts'); if(pts) pts.textContent = draftRoute.points.length;
  const km=$('#routeKm'); if(km) km.textContent = draftRoute.result ? fmtKm(draftRoute.result.km) : '-';
  const fuel=$('#routeFuel'); if(fuel) fuel.textContent = draftRoute.result ? fmtRp(draftRoute.result.cost) : '-';
  const scan=$('#routeScanText'); if(scan) scan.textContent = routeScan();
  $$('.seg[data-mode]').forEach(b=>b.classList.toggle('on', b.dataset.mode === draftRoute.mode));
}
function mapStyleUrl(){
  const key = state?.settings?.mapTilerKey || '';
  if(key) return `https://api.maptiler.com/maps/streets-v2/style.json?key=${encodeURIComponent(key)}`;
  const style = state?.settings?.mapStyle || 'positron';
  if(style === 'liberty') return 'https://tiles.openfreemap.org/styles/liberty';
  if(style === 'bright') return 'https://tiles.openfreemap.org/styles/bright';
  return 'https://tiles.openfreemap.org/styles/positron';
}
function detachMap(){
  try{ if(map){ map.remove(); } }catch(e){}
  map=null; mapLoaded=false; markers=[];
}
function mapHint(){
  if(!draftRoute.points.length) return 'Tap map buat START';
  if(draftRoute.points.length===1) return 'Tap TUJUAN, lalu hitung rute jalan';
  if(!draftRoute.result) return 'Titik siap. Tap Hitung rute jalan';
  return `${fmtKm(draftRoute.result.km)} · ${draftRoute.result.provider}`;
}
function routeScan(){
  if(!draftRoute.result) return 'Belum ada rute. Pilih start + tujuan dulu. Nanti Rusdi hitung estimasi bensin, biaya, sisa range, dan warning service.';
  const r=draftRoute.result; const fuelNeed=r.km/Math.max(1,num(state.fuel.kmpl,55)); const enough=state.fuel.liters>=fuelNeed;
  const urgent=servicePriority()[0]; const uh=serviceHealth(urgent);
  return `Rute ${fmtKm(r.km)} lewat jalan (${r.provider}). Estimasi bensin ${fmtL(fuelNeed)} / ${fmtRp(r.cost)}. Fuel sekarang ${fmtL(state.fuel.liters)} jadi ${enough?'aman':'kurang, isi dulu'}. Service terdekat: ${urgent.name} ${uh.toFixed(0)}%.`;
}
function renderRouteFav(r){
  return `<div class="item"><div class="item-icon">🗺</div><div class="item-main"><b>${r.name}</b><span>${fmtKm(r.km)} · ${r.points?.length||2} titik · ${r.provider||'route'}</span></div><button class="btn small" data-action="use-route" data-id="${r.id}">Pakai</button></div>`;
}
function renderFuel(){
  const monthFuel = monthExpenses('Fuel'); const range=fuelRange();
  return `
    <div class="section-title"><h2>Fuel</h2><small>BBM & range</small></div>
    <div class="card">
      <div class="grid2">
        <div class="stat-tile ${state.fuel.liters<.4?'danger':''}"><b>${fmtL(state.fuel.liters)}</b><span>Sisa bensin</span></div>
        <div class="stat-tile"><b>${fmtKm(range)}</b><span>Estimasi range</span></div>
      </div>
      <div class="progress" style="margin-top:12px"><i style="--w:${clamp(state.fuel.liters/state.bike.tankLiters*100,0,100)}%"></i></div>
      <div class="chips" style="margin-top:12px">
        <button class="chip active" data-action="quick-fuel" data-type="Pertalite" data-liters="1">Pertalite 1L</button>
        <button class="chip" data-action="quick-fuel" data-type="Pertalite" data-liters="2">Pertalite 2L</button>
        <button class="chip" data-action="quick-fuel" data-type="Pertamax" data-liters="1">Pertamax 1L</button>
        <button class="chip" data-action="quick-fuel" data-type="Shell Super" data-liters="1">Shell 1L</button>
        <button class="chip" data-action="fuel-sheet">Custom</button>
      </div>
    </div>
    <div class="grid2">
      <div class="card tight"><div class="label">Bensin bulan ini</div><div class="value">${fmtRp(monthFuel)}</div><div class="small muted">Budget ${fmtRp(state.money.fuelBudget)}</div></div>
      <div class="card tight"><div class="label">Estimasi irit</div><div class="value">${state.fuel.kmpl} km/L</div><div class="small muted">Bisa diedit di Settings</div></div>
    </div>
    <div class="section-title"><h2>Fuel Balance</h2><small>naik/turun</small></div>
    <div class="canvas-wrap"><canvas id="fuelChart"></canvas></div>
    <div class="section-title"><h2>History</h2><small>${state.fuel.logs.length}</small></div>
    <div class="list">${state.fuel.logs.slice(0,12).map(f=>`<div class="item"><div class="item-icon">⛽</div><div class="item-main"><b>${f.type} · ${fmtL(f.liters)}</b><span>${fmtDate(f.ts)} ${fmtTime(f.ts)} · ${fmtRp(f.amount)}</span></div></div>`).join('') || '<div class="card tight muted small">Belum ada isi BBM.</div>'}</div>`;
}
function renderMoney(){
  const total=monthExpenses(), fuel=monthExpenses('Fuel'), service=monthExpenses('Service'), modif=monthExpenses('Modif'), tools=monthExpenses('Tools');
  const pct=state.money.monthlyBudget ? clamp(total/state.money.monthlyBudget*100,0,160) : 0;
  return `
    <div class="section-title"><h2>Money</h2><small>duit motor</small></div>
    <div class="card ${pct>100?'dangerbox':''}">
      <div class="between"><div><div class="label">Bulan ini</div><div class="big">${fmtRp(total)}</div></div><span class="pill ${pct>100?'red':pct>75?'yellow':'green'}">${pct.toFixed(0)}%</span></div>
      <div class="progress" style="margin-top:12px"><i style="--w:${clamp(pct,0,100)}%"></i></div>
      <div class="small muted" style="margin-top:8px">Budget ${fmtRp(state.money.monthlyBudget)} · ${pct>100?'udah jebol, tahan modif dulu':pct>75?'mulai mepet':'masih aman'}</div>
    </div>
    <div class="grid2">
      <div class="stat-tile"><b>${fmtRp(fuel)}</b><span>Fuel</span></div>
      <div class="stat-tile"><b>${fmtRp(service)}</b><span>Service</span></div>
      <div class="stat-tile"><b>${fmtRp(modif)}</b><span>Modif</span></div>
      <div class="stat-tile"><b>${fmtRp(tools)}</b><span>Tools</span></div>
    </div>
    <div class="card" style="margin-top:12px">
      <div class="between"><div><b>Celengan Modif</b><div class="small muted">Target ${fmtRp(state.money.savingsTarget)}</div></div><div class="value">${fmtRp(state.money.savings)}</div></div>
      <div class="progress" style="margin-top:12px"><i style="--w:${clamp(state.money.savings/state.money.savingsTarget*100,0,100)}%"></i></div>
      <div class="chips" style="margin-top:12px"><button class="chip" data-action="saving-add" data-amount="10000">+10k</button><button class="chip" data-action="saving-add" data-amount="25000">+25k</button><button class="chip" data-action="saving-custom">Custom</button><button class="chip" data-action="expense-sheet">Tambah Expense</button></div>
    </div>
    <div class="section-title"><h2>Grafik</h2><small>bulan ini</small></div>
    <div class="canvas-wrap"><canvas id="moneyChart"></canvas></div>
    <div class="section-title"><h2>Transaksi</h2><small>${state.money.expenses.length}</small></div>
    <div class="list">${state.money.expenses.slice(0,15).map(e=>`<div class="item"><div class="item-icon">${e.cat==='Fuel'?'⛽':e.cat==='Service'?'🛠':e.cat==='Modif'?'✨':'💸'}</div><div class="item-main"><b>${e.title}</b><span>${e.cat} · ${fmtDate(e.ts)} · ${e.note||''}</span></div><b>${fmtRp(e.amount)}</b></div>`).join('') || '<div class="card tight muted small">Belum ada transaksi.</div>'}</div>`;
}
function renderAssist(){
  const guides = Object.entries(GUIDE_DATA).map(([k,g])=>`<button class="item" data-action="guide" data-key="${k}"><div class="item-icon">${g.icon}</div><div class="item-main"><b>${g.title}</b><span>${g.tag} · langkah cepat</span></div></button>`).join('');
  return `
    <div class="section-title"><h2>NGR Assist</h2><small>Kang Rusdi</small></div>
    <div class="card rusdi-card">
      <div class="between"><div><b>Kang Rusdi Chat</b><div class="small muted">Bisa tanya rute, KM, fuel, money, panduan, problem.</div></div><span class="pill blue">AI/context</span></div>
      <div class="chat-box" id="chatBox" style="margin-top:12px">${state.assist.messages.slice(-12).map(m=>`<div class="msg ${m.role==='user'?'user':'bot'}">${escapeHtml(m.text)}</div>`).join('')}</div>
      <div class="row" style="margin-top:12px"><input id="assistInput" placeholder="Tanya Kang Rusdi..." /><button class="btn primary" data-action="assist-send">Kirim</button></div>
    </div>
    <div class="section-title"><h2>FI Code Helper</h2><small>darurat</small></div>
    <div class="card">
      <div class="grid2"><div class="field"><label>Kedipan panjang</label><input id="fiLong" inputmode="numeric" placeholder="contoh 1" /></div><div class="field"><label>Kedipan pendek</label><input id="fiShort" inputmode="numeric" placeholder="contoh 2" /></div></div>
      <button class="btn primary block" data-action="fi-check">Hitung kode FI</button>
      <div id="fiResult" class="warnbox" style="margin-top:10px">Panjang = puluhan, pendek = satuan. Contoh 1 panjang + 2 pendek = 12.</div>
    </div>
    <div class="section-title"><h2>Panduan Darurat & Pergantian</h2><small>${Object.keys(GUIDE_DATA).length}</small></div>
    <div class="list">${guides}</div>
    <div class="section-title"><h2>Problem Diary</h2><small>${state.assist.problems.length}</small></div>
    <div class="list">${state.assist.problems.slice(0,10).map(p=>`<div class="item"><div class="item-icon">⚠️</div><div class="item-main"><b>${p.title}</b><span>${p.severity} · ${fmtDate(p.ts)} · ${p.note||''}</span></div></div>`).join('') || '<div class="card tight muted small">Belum ada problem dicatat.</div>'}</div>`;
}
function localScan(){
  const p=servicePriority()[0], ph=serviceHealth(p), km=todayKm(), moneyPct=state.money.monthlyBudget?monthExpenses()/state.money.monthlyBudget*100:0;
  const bits=[];
  bits.push(km>0?`Hari ini motor kepakai ${fmtKm(km)}.`:'Hari ini belum input KM. Jangan putus streak.');
  bits.push(`Service paling dekat: ${p.name} ${ph.toFixed(0)}%.`);
  bits.push(state.fuel.liters<.4?`Bensin tinggal ${fmtL(state.fuel.liters)}, isi dulu kalau mau jauh.`:`Range bensin sekitar ${fmtKm(fuelRange())}.`);
  bits.push(moneyPct>80?'Money bulan ini mulai boros, tahan jajan/modif dulu.':'Money bulan ini masih relatif aman.');
  return bits.join(' ');
}
function escapeHtml(s=''){ return String(s).replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

function bindScreenActions(){
  $$('[data-tabgo]').forEach(b=>b.onclick=()=>setTab(b.dataset.tabgo));
  $$('[data-action]').forEach(el=>{
    const a=el.dataset.action;
    el.onclick = ev => handleAction(a, el, ev);
  });
}
function handleAction(a, el, ev){
  if(a==='settings') return openSettings();
  if(a==='add-km') return addDailyKm(num(el.dataset.km), 'Manual');
  if(a==='custom-km') return openKmSheet();
  if(a==='fuel-sheet') return openFuelSheet();
  if(a==='quick-fuel') return fillFuel(el.dataset.type, num(el.dataset.liters), state.fuel.prices[el.dataset.type]);
  if(a==='service-sheet') return openServiceSheet();
  if(a==='service-detail') return openServiceDetail(el.dataset.key);
  if(a==='expense-sheet') return openExpenseSheet();
  if(a==='saving-add') { state.money.savings += num(el.dataset.amount); logEvent(`Celengan modif nambah ${fmtRp(el.dataset.amount)}.`); save(); render(); return; }
  if(a==='saving-custom') return openSavingSheet();
  if(a==='guide') return openGuide(el.dataset.key);
  if(a==='fi-check') return fiCheck();
  if(a==='assist-send') return sendAssist($('#assistInput')?.value || '');
  if(a==='map-ai-ask') return sendMapAsk($('#map-ai-input')?.value || '');
  if(a==='map-mode') { setMapMode(el.dataset.mode); return; }
  if(a==='route-reset') return resetRoute();
  if(a==='route-calc') return calculateRoute();
  if(a==='route-add-km') return addRouteToKm();
  if(a==='route-save') return saveRouteFav();
  if(a==='use-route') return useRouteFav(el.dataset.id);
}

$$('.nav-item').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
$('#fab').addEventListener('click', openQuickSheet);
$('.sheet-backdrop').addEventListener('click', closeSheet);
$('[data-action="settings"]').addEventListener('click', openSettings);

function setTab(tab){
  activeTab = tab;
  $$('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  $$('.screen').forEach(s=>s.classList.toggle('active', s.id===`tab-${tab}`));
  if(tab==='maps') setTimeout(ensureMap, 80);
  applyAppTheme();
  drawChartsSoon();
}
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2200); }
function sheet(html){ $('#sheet-content').innerHTML=html; $('#sheet').classList.add('show'); $('#sheet').setAttribute('aria-hidden','false'); bindSheetActions(); }
function closeSheet(){ $('#sheet').classList.remove('show'); $('#sheet').setAttribute('aria-hidden','true'); }
function bindSheetActions(){ $$('[data-sheet-action]').forEach(el => el.onclick=()=>handleSheet(el.dataset.sheetAction, el)); }
function handleSheet(a, el){
  if(a==='close') return closeSheet();
  if(a==='save-km') { const km=num($('#kmVal').value); const note=$('#kmNote').value; closeSheet(); return addDailyKm(km,'Manual custom',note); }
  if(a==='save-fuel') { const type=$('#fuelType').value || 'Pertalite'; const liters=num($('#fuelLiters').value); const price=num($('#fuelPrice').value, state.fuel.prices[type]); closeSheet(); return fillFuel(type,liters,price); }
  if(a==='save-expense') { const cat=$('#expCat').value||'Other'; const title=$('#expTitle').value||cat; const amount=num($('#expAmount').value); const note=$('#expNote').value; addExpense(cat,title,amount,note); logEvent(`Expense masuk: ${title} ${fmtRp(amount)}.`); save(); render(); closeSheet(); return; }
  if(a==='save-service') { const key=$('#svcKey').value; const cost=num($('#svcCost').value); const note=$('#svcNote').value; closeSheet(); return recordService(key,cost,note); }
  if(a==='service-from-detail') { const key=el.dataset.key; const s=state.services.find(x=>x.key===key); closeSheet(); return openServiceSheet(key, s?.cost||0); }
  if(a==='problem-from-guide') { const title=el.dataset.title; closeSheet(); return openProblemSheet(title); }
  if(a==='service-from-guide') { const key=el.dataset.key; closeSheet(); return openServiceSheet(key); }
  if(a==='save-problem') { const title=$('#probTitle').value||'Problem motor'; const sev=$('#probSev').value||'pantau'; const note=$('#probNote').value; closeSheet(); return addProblem(title,sev,note); }
  if(a==='saving-save') { state.money.savings += num($('#savingVal').value); logEvent(`Celengan modif nambah ${fmtRp($('#savingVal').value)}.`); save(); render(); closeSheet(); return; }
  if(a==='save-settings') return saveSettingsFromSheet();
  if(a==='export') return exportData();
  if(a==='import') return $('#importFile').click();
  if(a==='reset') { if(confirm('Reset semua data NGR v8?')) { localStorage.removeItem(KEY); state=baseData(); save(); closeSheet(); render(); toast('Data direset'); } }
}
function openQuickSheet(){ sheet(`<h2>Quick Add</h2><div class="quick-grid"><button class="quick primary" data-sheet-action="close" onclick="setTimeout(openKmSheet,120)"><i>＋</i>KM</button><button class="quick" data-sheet-action="close" onclick="setTimeout(openFuelSheet,120)"><i>⛽</i>Fuel</button><button class="quick" data-sheet-action="close" onclick="setTimeout(openServiceSheet,120)"><i>🛠</i>Service</button><button class="quick" data-sheet-action="close" onclick="setTimeout(openExpenseSheet,120)"><i>💸</i>Money</button></div><button class="btn block" style="margin-top:12px" data-sheet-action="close">Tutup</button>`); }
function openKmSheet(){ sheet(`<h2>Input Daily KM</h2><div class="field"><label>KM hari ini</label><input id="kmVal" inputmode="decimal" placeholder="contoh 8.5" /></div><div class="field"><label>Catatan</label><input id="kmNote" placeholder="contoh sekolah + muter" /></div><button class="btn primary block" data-sheet-action="save-km">Simpan KM</button>`); }
function openFuelSheet(){ sheet(`<h2>Isi BBM</h2><div class="field"><label>Jenis</label><input id="fuelType" list="fuelTypes" value="Pertalite" /><datalist id="fuelTypes"><option>Pertalite</option><option>Pertamax</option><option>Shell Super</option></datalist></div><div class="form-row"><div class="field"><label>Liter</label><input id="fuelLiters" inputmode="decimal" value="1" /></div><div class="field"><label>Harga/liter</label><input id="fuelPrice" inputmode="numeric" value="${state.fuel.prices.Pertalite}" /></div></div><button class="btn primary block" data-sheet-action="save-fuel">Simpan Fuel</button>`); }
function openExpenseSheet(){ sheet(`<h2>Tambah Expense</h2><div class="field"><label>Kategori</label><input id="expCat" list="cats" value="Other" /><datalist id="cats"><option>Fuel</option><option>Service</option><option>Modif</option><option>Tools</option><option>Other</option></datalist></div><div class="field"><label>Judul</label><input id="expTitle" placeholder="contoh beli busi" /></div><div class="field"><label>Nominal</label><input id="expAmount" inputmode="numeric" placeholder="contoh 30000" /></div><div class="field"><label>Catatan</label><input id="expNote" /></div><button class="btn primary block" data-sheet-action="save-expense">Simpan Expense</button>`); }
function openServiceSheet(key='', cost=''){
  const options=state.services.map(s=>`<option value="${s.key}" ${key===s.key?'selected':''}>${s.name}</option>`).join('');
  sheet(`<h2>Catat Service</h2><div class="field"><label>Part</label><select id="svcKey">${options}</select></div><div class="field"><label>Biaya</label><input id="svcCost" inputmode="numeric" value="${cost||''}" placeholder="opsional" /></div><div class="field"><label>Catatan</label><input id="svcNote" placeholder="contoh ganti di bengkel" /></div><button class="btn primary block" data-sheet-action="save-service">Catat Service</button>`);
}
function openServiceDetail(key){
  const s=state.services.find(x=>x.key===key); if(!s) return; const h=serviceHealth(s), r=serviceRemain(s);
  sheet(`<h2>${s.icon} ${s.name}</h2><div class="card tight"><div class="between"><div><div class="label">Health</div><div class="big">${h.toFixed(0)}%</div></div><span class="pill ${h<25?'red':h<50?'yellow':'green'}">${fmtKm(r.km)} / ${r.days} hari</span></div><p class="small muted">${s.note}</p></div><div class="grid2"><div class="stat-tile"><b>${fmtKm(s.intervalKm)}</b><span>Interval KM</span></div><div class="stat-tile"><b>${s.intervalDays} hari</b><span>Interval hari</span></div></div><button class="btn primary block" style="margin-top:12px" data-sheet-action="service-from-detail" data-key="${s.key}">Catat sudah diganti</button>`);
}
function openSavingSheet(){ sheet(`<h2>Tambah Celengan</h2><div class="field"><label>Nominal</label><input id="savingVal" inputmode="numeric" placeholder="contoh 15000" /></div><button class="btn primary block" data-sheet-action="saving-save">Simpan</button>`); }
function openProblemSheet(title='Problem motor'){ sheet(`<h2>Catat Problem</h2><div class="field"><label>Judul</label><input id="probTitle" value="${escapeHtml(title)}" /></div><div class="field"><label>Severity</label><input id="probSev" list="severity" value="pantau" /><datalist id="severity"><option>ringan</option><option>pantau</option><option>urgent</option><option>bahaya</option></datalist></div><div class="field"><label>Catatan</label><textarea id="probNote" placeholder="gejala muncul kapan, suara dari mana, dll"></textarea></div><button class="btn primary block" data-sheet-action="save-problem">Simpan Problem</button>`); }
function openGuide(key){
  const g=GUIDE_DATA[key]; if(!g) return;
  sheet(`<h2>${g.icon} ${g.title}</h2><div class="dangerbox">${g.danger}</div><div class="section-title"><h2>Langkah cepat</h2><small>${g.tag}</small></div><div class="list">${g.steps.map((s,i)=>`<div class="item"><div class="item-icon">${i+1}</div><div class="item-main"><b>${s}</b></div></div>`).join('')}</div><div class="grid2" style="margin-top:12px"><button class="btn" data-sheet-action="problem-from-guide" data-title="${g.title}">Catat Problem</button>${g.service?`<button class="btn primary" data-sheet-action="service-from-guide" data-key="${g.service}">Catat Service</button>`:'<button class="btn primary" data-sheet-action="close">Selesai</button>'}</div>`);
}
function openSettings(){
  sheet(`<h2>Settings</h2>
    <div class="field"><label>Nama motor</label><input id="setBike" value="${escapeHtml(state.bike.name)}" /></div>
    <div class="form-row"><div class="field"><label>Virtual KM</label><input id="setKm" inputmode="decimal" value="${state.bike.virtualKm}" /></div><div class="field"><label>Tank liter</label><input id="setTank" inputmode="decimal" value="${state.bike.tankLiters}" /></div></div>
    <div class="section-title"><h2>Route API</h2><small>ikut jalan</small></div>
    <div class="field"><label>OpenRouteService API Key</label><input id="setOrs" value="${escapeHtml(state.routes.orsKey)}" placeholder="kosong = OSRM fallback" /></div>
    <div class="form-row"><div class="field"><label>Map Style</label><input id="setMapStyle" list="mapStyles" value="${state.settings.mapStyle||'positron'}" /><datalist id="mapStyles"><option>positron</option><option>liberty</option><option>bright</option></datalist></div><div class="field"><label>Tema UI</label><input id="setTheme" list="themes" value="${state.settings.theme||'glass'}" /><datalist id="themes"><option>glass</option><option>solid</option></datalist></div></div>
    <div class="field"><label>MapTiler Key optional</label><input id="setMapTiler" value="${escapeHtml(state.settings.mapTilerKey||'')}" placeholder="opsional: basemap lebih premium" /></div>
    <div class="section-title"><h2>Fuel & Money</h2><small>estimasi</small></div>
    <div class="form-row"><div class="field"><label>km/L</label><input id="setKmpl" inputmode="decimal" value="${state.fuel.kmpl}" /></div><div class="field"><label>Budget bulanan</label><input id="setBudget" inputmode="numeric" value="${state.money.monthlyBudget}" /></div></div>
    <div class="form-row"><div class="field"><label>Harga Pertalite</label><input id="setPertalite" inputmode="numeric" value="${state.fuel.prices.Pertalite}" /></div><div class="field"><label>Harga Pertamax</label><input id="setPertamax" inputmode="numeric" value="${state.fuel.prices.Pertamax}" /></div></div>
    <div class="field"><label>Harga Shell Super</label><input id="setShell" inputmode="numeric" value="${state.fuel.prices['Shell Super']}" /></div>
    <div class="section-title"><h2>Notif Streak</h2><small>daily</small></div>
    <div class="form-row"><div class="field"><label>Jam reminder</label><input id="setReminder" type="time" value="${state.settings.reminderTime}" /></div><div class="field"><label>Reminder aktif</label><input id="setReminderOn" value="${state.settings.reminderEnabled?'ya':'tidak'}" /></div></div>
    <div class="section-title"><h2>AI Kang Rusdi</h2><small>optional</small></div>
    <div class="field"><label>Base URL</label><input id="setAiBase" value="${escapeHtml(state.ai.baseUrl)}" /></div>
    <div class="field"><label>API Key</label><input id="setAiKey" value="${escapeHtml(state.ai.key)}" placeholder="kosong = mode lokal" /></div>
    <div class="field"><label>Model</label><input id="setAiModel" value="${escapeHtml(state.ai.model)}" /></div>
    <button class="btn primary block" data-sheet-action="save-settings">Simpan Settings</button>
    <div class="grid2" style="margin-top:10px"><button class="btn" data-sheet-action="export">Export JSON</button><button class="btn" data-sheet-action="import">Import JSON</button></div>
    <input id="importFile" type="file" accept="application/json" class="hide" />
    <button class="btn danger block" style="margin-top:10px" data-sheet-action="reset">Reset Data</button>`);
  $('#importFile').onchange = importData;
}
function saveSettingsFromSheet(){
  state.bike.name=$('#setBike').value||state.bike.name; state.bike.virtualKm=num($('#setKm').value); state.bike.tankLiters=num($('#setTank').value,4);
  state.routes.orsKey=$('#setOrs').value.trim(); state.settings.mapStyle=$('#setMapStyle')?.value || 'positron'; state.settings.theme=$('#setTheme')?.value || 'glass'; state.settings.mapTilerKey=$('#setMapTiler')?.value.trim() || ''; detachMap(); state.fuel.kmpl=num($('#setKmpl').value,55); state.money.monthlyBudget=num($('#setBudget').value,250000);
  state.fuel.prices.Pertalite=num($('#setPertalite').value,10000); state.fuel.prices.Pertamax=num($('#setPertamax').value,12950); state.fuel.prices['Shell Super']=num($('#setShell').value,13990);
  state.settings.reminderTime=$('#setReminder').value||'20:00'; state.settings.reminderEnabled=/ya|on|true|1|aktif/i.test($('#setReminderOn').value);
  state.ai.baseUrl=$('#setAiBase').value.trim()||state.ai.baseUrl; state.ai.key=$('#setAiKey').value.trim(); state.ai.model=$('#setAiModel').value.trim()||state.ai.model;
  save(); scheduleReminder(); applyAppTheme(); closeSheet(); render(); toast('Settings disimpan');
}

function ensureMap(){
  if(activeTab!=='maps') return;
  const mapEl = $('#map'); if(!mapEl) return;
  if(typeof maplibregl==='undefined') { $('#mapFallback')?.classList.remove('hide'); return; }
  // If render() replaced the map container, recreate safely instead of keeping a stale canvas.
  if(map && map.getContainer && map.getContainer() !== mapEl) detachMap();
  if(map){ map.resize(); renderMapObjects(); updateMapUI(); return; }
  mapEl.innerHTML='';
  try{
    map = new maplibregl.Map({
      container:'map',
      center:[112.62,-7.44],
      zoom:12.2,
      pitch:0,
      attributionControl:false,
      style: mapStyleUrl(),
      cooperativeGestures:false
    });
    map.addControl(new maplibregl.NavigationControl({showCompass:false, visualizePitch:false}), 'top-right');
    map.on('load',()=>{ mapLoaded=true; $('#mapFallback')?.classList.add('hide'); map.resize(); renderMapObjects(); updateMapUI(); });
    map.on('error', e => { console.warn('map error', e?.error || e); $('#mapFallback')?.classList.remove('hide'); });
    map.on('click', e => addMapPoint(e.lngLat.lng, e.lngLat.lat));
    setTimeout(()=>{ try{ map?.resize(); }catch(e){} },450);
  }catch(e){ console.warn(e); $('#mapFallback')?.classList.remove('hide'); }
}
function addMapPoint(lng,lat){
  if(draftRoute.mode==='start'){
    const i=draftRoute.points.findIndex(p=>p.kind==='start');
    if(i>=0) draftRoute.points[i]={lng,lat,kind:'start'}; else draftRoute.points.unshift({lng,lat,kind:'start'});
    draftRoute.mode = draftRoute.points.some(p=>p.kind==='goal') ? 'stop' : 'goal';
  } else if(draftRoute.mode==='goal'){
    const i=draftRoute.points.findIndex(p=>p.kind==='goal');
    if(i>=0) draftRoute.points[i]={lng,lat,kind:'goal'}; else draftRoute.points.push({lng,lat,kind:'goal'});
    draftRoute.mode='stop';
  } else {
    const goalIndex=draftRoute.points.findIndex(p=>p.kind==='goal');
    const stop={lng,lat,kind:'stop'};
    if(goalIndex>=0) draftRoute.points.splice(goalIndex,0,stop); else draftRoute.points.push(stop);
  }
  draftRoute.result=null; draftRoute.line=null;
  clearRouteLine();
  renderMapObjects(); updateMapUI();
}
function orderedPoints(){
  const start=draftRoute.points.find(p=>p.kind==='start'); const goal=draftRoute.points.find(p=>p.kind==='goal'); const stops=draftRoute.points.filter(p=>p.kind==='stop');
  return [start,...stops,goal].filter(Boolean);
}
function renderMapObjects(){
  if(!map || !mapLoaded) return;
  markers.forEach(m=>m.remove()); markers=[];
  const pts=orderedPoints();
  pts.forEach((p,i)=>{
    const el=document.createElement('div'); el.className='marker-pill '+(p.kind==='goal'?'goal':p.kind==='stop'?'stop':''); el.textContent=p.kind==='start'?'A':p.kind==='goal'?'B':String(i+1);
    markers.push(new maplibregl.Marker({element:el}).setLngLat([p.lng,p.lat]).addTo(map));
  });
  if(draftRoute.line) drawRouteLine(draftRoute.line);
  if(pts.length){
    const b=pts.reduce((bounds,p)=>bounds.extend([p.lng,p.lat]), new maplibregl.LngLatBounds([pts[0].lng,pts[0].lat],[pts[0].lng,pts[0].lat]));
    if(pts.length>1) map.fitBounds(b,{padding:70,maxZoom:15,duration:300}); else map.flyTo({center:[pts[0].lng,pts[0].lat], zoom:14, duration:250});
  }
}
function drawRouteLine(coords){
  if(!map || !mapLoaded) return;
  const data={type:'FeatureCollection', features:[{type:'Feature', geometry:{type:'LineString', coordinates:coords}, properties:{}}]};
  if(map.getSource('route')) map.getSource('route').setData(data);
  else {
    map.addSource('route',{type:'geojson', data});
    map.addLayer({id:'route-glow',type:'line',source:'route',paint:{'line-color':'#60a5fa','line-width':9,'line-opacity':.25,'line-blur':2}});
    map.addLayer({id:'route-line',type:'line',source:'route',paint:{'line-color':'#32d6c5','line-width':5,'line-opacity':.95}});
  }
}
function clearRouteLine(){ try{ if(map?.getSource('route')) map.getSource('route').setData({type:'FeatureCollection',features:[]}); }catch(e){} }
function resetRoute(){ draftRoute={mode:'start', points:[], line:null, result:null}; clearRouteLine(); markers.forEach(m=>m.remove()); markers=[]; updateMapUI(); toast('Rute direset'); }
function routeCoordsStr(pts){ return pts.map(p=>`${p.lng},${p.lat}`).join(';'); }
async function calculateRoute(){
  const pts=orderedPoints();
  if(pts.length<2) return toast('Butuh start dan tujuan dulu');
  toast('Ngitung rute ikut jalan...');
  try{
    let res;
    if(state.routes.orsKey) res = await routeWithORS(pts); else res = await routeWithOSRM(pts);
    draftRoute.line=res.coords; draftRoute.result=res;
    const fuelNeed=res.km/Math.max(1,num(state.fuel.kmpl,55)); res.cost = fuelNeed * state.fuel.prices.Pertalite;
    state.routes.logs.unshift({id:id(), ts:now(), km:res.km, cost:res.cost, provider:res.provider, points:pts});
    logEvent(`Rute dihitung: ${fmtKm(res.km)} lewat jalan (${res.provider}). Estimasi bensin ${fmtL(fuelNeed)}.`);
    save(); renderMapObjects(); updateMapUI(); toast('Rute jalan siap');
  }catch(e){
    console.warn(e);
    const coords=pts.map(p=>[p.lng,p.lat]); const km=polylineKm(coords); const fuelNeed=km/Math.max(1,num(state.fuel.kmpl,55));
    draftRoute.line=coords; draftRoute.result={km, durationMin:0, coords, provider:'fallback garis lurus', cost:fuelNeed*state.fuel.prices.Pertalite};
    logEvent(`Routing gagal, fallback garis lurus ${fmtKm(km)}. Cek internet/API key.`);
    renderMapObjects(); updateMapUI(); toast('Routing gagal, fallback lurus');
  }
}
async function routeWithORS(pts){
  const body={coordinates:pts.map(p=>[p.lng,p.lat])};
  const r=await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson',{method:'POST',headers:{'Authorization':state.routes.orsKey,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok) throw new Error('ORS '+r.status);
  const j=await r.json(); const f=j.features?.[0]; if(!f) throw new Error('ORS no route');
  const coords=f.geometry.coordinates; const km=polylineKm(coords); const dur=num(f.properties?.summary?.duration)/60;
  return {km, durationMin:dur, coords, provider:'OpenRouteService'};
}
async function routeWithOSRM(pts){
  const url=`https://router.project-osrm.org/route/v1/driving/${routeCoordsStr(pts)}?overview=full&geometries=geojson&steps=false&alternatives=false`;
  const r=await fetch(url); if(!r.ok) throw new Error('OSRM '+r.status);
  const j=await r.json(); const route=j.routes?.[0]; if(!route) throw new Error('OSRM no route');
  const coords=route.geometry.coordinates; const km=num(route.distance)/1000 || polylineKm(coords); const dur=num(route.duration)/60;
  return {km, durationMin:dur, coords, provider:'OSRM road route'};
}
function polylineKm(coords){ let d=0; for(let i=1;i<coords.length;i++) d+=haversine(coords[i-1],coords[i]); return d; }
function haversine(a,b){ const R=6371; const toRad=x=>x*Math.PI/180; const dLat=toRad(b[1]-a[1]), dLng=toRad(b[0]-a[0]); const s=Math.sin(dLat/2)**2 + Math.cos(toRad(a[1]))*Math.cos(toRad(b[1]))*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(s)); }
function addRouteToKm(){
  const r=draftRoute.result; if(!r) return toast('Hitung rute dulu');
  addDailyKm(r.km, 'Maps route', `${r.provider} · est ${fmtRp(r.cost)}`);
}
function saveRouteFav(){
  const r=draftRoute.result; if(!r) return toast('Hitung rute dulu');
  const name=prompt('Nama rute favorit?', `Rute ${fmtKm(r.km)}`); if(!name) return;
  state.routes.favorites.unshift({id:id(), name, km:r.km, cost:r.cost, provider:r.provider, points:orderedPoints(), coords:r.coords, ts:now()});
  save(); const list=$('#routeFavList'); if(list) list.innerHTML = state.routes.favorites.map(renderRouteFav).join(''); toast('Rute favorit disimpan');
}
function useRouteFav(routeId){
  const r=state.routes.favorites.find(x=>x.id===routeId); if(!r) return;
  draftRoute.points=r.points||[]; draftRoute.line=r.coords||null; draftRoute.result={km:r.km,cost:r.cost||r.km/Math.max(1,state.fuel.kmpl)*state.fuel.prices.Pertalite,provider:r.provider||'favorite route',coords:r.coords||[]};
  setTab('maps'); setTimeout(()=>{ ensureMap(); renderMapObjects(); updateMapUI(); },100); toast('Rute favorit siap');
}

function fiCheck(){
  const long=num($('#fiLong').value), short=num($('#fiShort').value); const code=long*10+short;
  let text=`Kode terbaca: ${code || 0}. `;
  if(!code) text+='Isi jumlah kedipan panjang/pendek dulu.';
  else text+='Catat kode ini, cek aki/tegangan dan soket kabel dulu. Kode FI adalah arah diagnosa, bukan vonis part pasti. Kalau mesin brebet/mati-mati, jangan dipaksa jauh.';
  $('#fiResult').textContent=text; logEvent(`FI Code dicek: kode ${code}.`); save();
}
async function sendAssist(q){
  q=String(q).trim(); if(!q) return;
  state.assist.messages.push({role:'user',ts:now(),text:q}); save(); render(); setTab('assist');
  const ans = await askRusdi(q, buildContext());
  state.assist.messages.push({role:'bot',ts:now(),text:ans}); save(); render();
}
async function sendMapAsk(q){
  q=String(q).trim() || 'Rute ini gimana, boros atau aman?';
  state.assist.messages.push({role:'user',ts:now(),text:`[Maps] ${q}`});
  const ans = await askRusdi(q, buildContext('maps'));
  state.assist.messages.push({role:'bot',ts:now(),text:ans}); save(); render(); toast('Jawaban masuk Assist');
}
function buildContext(scope='all'){
  const p=servicePriority()[0];
  return {
    scope, bike:state.bike, health:overallHealth().toFixed(0), todayKm:todayKm(), streak:streakInfo(), fuel:{liters:state.fuel.liters, rangeKm:fuelRange(), kmpl:state.fuel.kmpl, prices:state.fuel.prices},
    money:{monthTotal:monthExpenses(), budget:state.money.monthlyBudget, fuel:monthExpenses('Fuel'), service:monthExpenses('Service')},
    servicePriority:{name:p.name, health:serviceHealth(p).toFixed(0), remain:serviceRemain(p)},
    route:draftRoute.result ? {km:draftRoute.result.km, provider:draftRoute.result.provider, cost:draftRoute.result.cost} : null,
    problems:state.assist.problems.slice(0,5)
  };
}
async function askRusdi(q, context){
  if(!state.ai.key) return localRusdi(q, context);
  try{
    const res=await fetch(`${state.ai.baseUrl.replace(/\/$/,'')}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+state.ai.key},body:JSON.stringify({model:state.ai.model,messages:[{role:'system',content:'Kamu Kang Rusdi, asisten motor Honda Beat FI 2014. Jawab bahasa Indonesia santai, singkat, praktis. Jangan diagnosis pasti; beri langkah cek aman. Pakai konteks NGR berikut: '+JSON.stringify(context)},{role:'user',content:q}],temperature:.55})});
    if(!res.ok) throw new Error('AI '+res.status);
    const j=await res.json(); return j.choices?.[0]?.message?.content?.trim() || localRusdi(q, context);
  }catch(e){ console.warn(e); return localRusdi(q, context) + ' (Mode lokal, AI API gagal/kosong.)'; }
}
function localRusdi(q, c){
  const low=q.toLowerCase();
  if(low.includes('boros')||low.includes('budget')||low.includes('uang')) return `Menurut Rusdi, bulan ini pengeluaran motor ${fmtRp(c.money.monthTotal)} dari budget ${fmtRp(c.money.budget)}. Fuel ${fmtRp(c.money.fuel)}, service ${fmtRp(c.money.service)}. Kalau udah di atas 75%, tahan modif dulu, prioritas service penting.`;
  if(low.includes('rute')||low.includes('maps')||low.includes('jalan')) return c.route ? `Rute ${fmtKm(c.route.km)} via ${c.route.provider}. Estimasi biaya bensin ${fmtRp(c.route.cost)}. Fuel sekarang range ${fmtKm(c.fuel.rangeKm)}, jadi ${c.fuel.rangeKm>=c.route.km?'aman':'kurang, isi dulu'}.` : 'Belum ada rute dihitung. Tap start + tujuan di Maps, hitung rute jalan dulu.';
  if(low.includes('busi')||low.includes('mati')) return 'Cek aman: bensin, indikator FI, aki/starter, sekring, lalu busi. Busi lemah biasanya susah starter, brebet, langsam gak stabil. Jangan tes api dekat bensin.';
  if(low.includes('fuel')||low.includes('bensin')) return `Bensin sekarang ${fmtL(c.fuel.liters)}, range kira-kira ${fmtKm(c.fuel.rangeKm)} di ${c.fuel.kmpl} km/L. Kalau sering stop-go, anggap range lebih pendek.`;
  return `Scan singkat: health ${c.health}%, hari ini ${fmtKm(c.todayKm)}, streak ${c.streak.streak} hari. Service paling dekat ${c.servicePriority.name} ${c.servicePriority.health}%. ${c.fuel.liters<.4?'Isi bensin dulu kalau mau jalan jauh.':'Fuel masih lumayan aman.'}`;
}

function drawChartsSoon(){ setTimeout(()=>{ drawFuelChart(); drawMoneyChart(); },60); }
function drawLineChart(canvas, points){
  if(!canvas) return; const dpr=window.devicePixelRatio||1; const rect=canvas.getBoundingClientRect(); canvas.width=rect.width*dpr; canvas.height=rect.height*dpr; const ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr); const w=rect.width,h=rect.height; ctx.clearRect(0,0,w,h); ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=1; for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(8,h*i/4);ctx.lineTo(w-8,h*i/4);ctx.stroke();}
  if(!points.length){ ctx.fillStyle='rgba(255,255,255,.5)'; ctx.font='12px system-ui'; ctx.fillText('Belum ada data',16,h/2); return; }
  const max=Math.max(...points,1), min=Math.min(...points,0), span=Math.max(.1,max-min); ctx.strokeStyle='#32d6c5'; ctx.lineWidth=3; ctx.beginPath(); points.forEach((p,i)=>{ const x=12+(w-24)*(i/Math.max(1,points.length-1)); const y=h-14-(h-28)*((p-min)/span); if(i)ctx.lineTo(x,y); else ctx.moveTo(x,y); }); ctx.stroke(); ctx.fillStyle='#eef5ff'; ctx.font='11px system-ui'; ctx.fillText(`${max.toFixed(max<10?1:0)}`,12,14); ctx.fillText(`${min.toFixed(min<10?1:0)}`,12,h-8);
}
function drawFuelChart(){ const c=$('#fuelChart'); if(!c) return; const pts=state.fuel.balance.slice(-30).map(x=>num(x.liters)); if(!pts.length && state.fuel.liters>0) pts.push(state.fuel.liters); drawLineChart(c, pts); }
function drawMoneyChart(){ const c=$('#moneyChart'); if(!c) return; const cats=['Fuel','Service','Modif','Tools','Other']; const vals=cats.map(cat=>monthExpenses(cat)); drawBars(c,cats,vals); }
function drawBars(canvas, labels, vals){
  if(!canvas) return; const dpr=window.devicePixelRatio||1; const rect=canvas.getBoundingClientRect(); canvas.width=rect.width*dpr; canvas.height=rect.height*dpr; const ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr); const w=rect.width,h=rect.height; ctx.clearRect(0,0,w,h); const max=Math.max(...vals,1); const bw=(w-28)/vals.length-8; vals.forEach((v,i)=>{ const x=14+i*((w-28)/vals.length)+4; const bh=(h-42)*(v/max); ctx.fillStyle='rgba(90,141,255,.82)'; ctx.fillRect(x,h-26-bh,bw,bh); ctx.fillStyle='rgba(255,255,255,.64)'; ctx.font='10px system-ui'; ctx.fillText(labels[i].slice(0,5),x,h-8); });
}

async function scheduleReminder(){
  if(!state.settings.reminderEnabled) return;
  try{
    const cap=window.Capacitor?.Plugins?.LocalNotifications;
    const [hour,minute]=state.settings.reminderTime.split(':').map(Number);
    if(cap){
      await cap.requestPermissions();
      await cap.cancel({notifications:[{id:701}]});
      await cap.schedule({notifications:[{id:701,title:'NGR Streak',body:'Jangan lupa input KM motor hari ini, bos.',schedule:{on:{hour,minute},repeats:true},smallIcon:'ic_stat_icon_config_sample'}]});
      toast('Native reminder aktif'); return;
    }
    if('Notification' in window) await Notification.requestPermission();
    toast('Reminder aktif saat app kebuka');
  }catch(e){ console.warn(e); toast('Reminder fallback aktif'); }
}
function checkReminder(){
  if(!state.settings.reminderEnabled) return;
  const key=todayKey(); if(state.settings.lastReminderDate===key) return;
  const [h,m]=state.settings.reminderTime.split(':').map(Number); const d=new Date();
  if(d.getHours()>h || (d.getHours()===h && d.getMinutes()>=m)){
    if(!dailyFor().length){
      state.settings.lastReminderDate=key; save();
      if('Notification' in window && Notification.permission==='granted') new Notification('NGR Streak', {body:'Hari ini belum input KM motor. Jangan putus streak.'});
      toast('Hari ini belum input KM');
    }
  }
}
setInterval(checkReminder, 60000);

function exportData(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`ngr-backup-${todayKey()}.json`; a.click(); URL.revokeObjectURL(url); toast('Export JSON dibuat');
}
function importData(ev){ const file=ev.target.files?.[0]; if(!file) return; const fr=new FileReader(); fr.onload=()=>{ try{ state=normalize(JSON.parse(fr.result)); save(); closeSheet(); render(); toast('Import berhasil'); }catch(e){ toast('Import gagal'); } }; fr.readAsText(file); }

if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }
applyAppTheme(); render(); checkReminder(); scheduleReminder();
