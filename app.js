'use strict';

const VERSION = 'NGR Neo HTML v1.2 Polish Collection';
const STORE_KEY = 'ngr_neo_html_mapfix_v1';
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const now = () => Date.now();
const num = (v, d=0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const id = () => Math.random().toString(36).slice(2,10);
const fmtKm = v => `${num(v).toFixed(num(v)<10?1:0)} km`;
const fmtL = v => `${num(v).toFixed(2)} L`;
const fmtRp = v => 'Rp' + Math.round(num(v)).toLocaleString('id-ID');
const dateKey = (t=now()) => new Date(t).toISOString().slice(0,10);
const todayKey = () => dateKey(now());
const fmtDate = t => new Date(t).toLocaleDateString('id-ID',{day:'2-digit',month:'short'});
const fmtTime = t => new Date(t).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const SERVICES = [
  {key:'oil', name:'Oli Mesin', icon:'oil', intervalKm:2000, intervalDays:60, note:'Paling penting. Ganti lebih cepat kalau sering macet/stop-go.'},
  {key:'gear', name:'Oli Gardan', icon:'gear', intervalKm:8000, intervalDays:180, note:'Buat area gardan matic. Jangan kelamaan biar suara belakang aman.'},
  {key:'spark', name:'Busi', icon:'spark', intervalKm:8000, intervalDays:180, note:'Cek kalau susah starter, brebet, atau mati mendadak.'},
  {key:'cvt', name:'CVT', icon:'swirl', intervalKm:8000, intervalDays:180, note:'Cek kalau tarikan berat, getar awal, atau bunyi area CVT.'},
  {key:'brake', name:'Rem', icon:'brake', intervalKm:6000, intervalDays:120, note:'Cek kampas dan minyak rem. Prioritas keselamatan.'},
  {key:'air', name:'Filter Udara', icon:'filter', intervalKm:10000, intervalDays:240, note:'Cek kalau motor berat, boros, atau napas mesin ketahan.'}
];

const GUIDES = {
  dead:{title:'Motor mati di jalan', icon:'⚠️', tag:'Darurat', danger:'Pinggirkan motor dulu. Jangan cek busi dekat bensin atau mesin terlalu panas.', steps:['Cek bensin dan posisi standar samping/engine cut-off kalau ada.','Lihat indikator FI: nyala/kedip? Catat kedip panjang-pendek.','Coba starter: kalau cuma tek-tek atau lemah, curiga aki/kabel.','Cek sekring utama/lampu indikator.','Kalau masih bisa bongkar aman, cek kop busi longgar/busi basah.','Kalau mesin bunyi kasar, jangan paksa jalan jauh.'], service:null},
  spark:{title:'Cek busi lemah/mati', icon:'⚡', tag:'Pengapian', danger:'Jangan tes api busi dekat tangki/bensin. Kalau ragu, catat problem dan bawa ke bengkel.', steps:['Gejala: susah starter, brebet, langsam tidak stabil, mati mendadak.','Cek kop busi: longgar/retak/basah.','Kalau busi hitam basah, bisa kebanyakan bensin/percikan lemah.','Kalau elektroda aus/kotor parah, ganti busi.','Setelah ganti, catat service Busi di NGR.'], service:'spark'},
  oil:{title:'Ganti oli mesin', icon:'🛢️', tag:'Maintenance', danger:'Jangan buka baut oli saat mesin terlalu panas. Pakai standar tengah dan lap sisa oli.', steps:['Panaskan mesin sebentar, lalu matikan.','Buka baut pembuangan, tampung oli lama.','Tunggu sampai tetes berkurang, pasang baut lagi.','Isi oli sesuai rekomendasi kapasitas motor.','Nyalakan sebentar, cek rembes, lalu catat service Oli Mesin.'], service:'oil'},
  gear:{title:'Ganti oli gardan', icon:'⚙️', tag:'Maintenance', danger:'Jangan kelamaan interval oli gardan, suara belakang bisa kasar.', steps:['Motor di standar tengah.','Buka baut drain gardan dan tampung oli lama.','Tutup drain, isi oli gardan sesuai kapasitas.','Cek rembes area baut.','Catat service Oli Gardan.'], service:'gear'},
  cvt:{title:'CVT bunyi/getar', icon:'🌀', tag:'Transmisi', danger:'Kalau bunyi keras metalik, jangan dipaksa jauh.', steps:['Gejala umum: getar awal, tarikan berat, bunyi area kiri.','Cek kapan terakhir CVT dibersihkan.','Cek v-belt/roller/kampas ganda di bengkel kalau belum punya alat.','Kalau habis hujan/banjir, keringkan dan cek slip.','Catat problem biar keliatan pola.'], service:'cvt'},
  fi:{title:'FI Code Helper', icon:'💡', tag:'MIL/FI', danger:'Kode FI cuma arah diagnosa, bukan vonis part pasti. Tetap cek soket, kabel, dan aki.', steps:['Hitung kedipan panjang = puluhan.','Hitung kedipan pendek = satuan.','Contoh 1 panjang + 2 pendek = kode 12.','Catat kode dan gejala.','Cek aki/tegangan dan soket sensor sebelum ganti part.'], service:null}
};

const COLLECTION_CATS = ['Concept','Stop Lamp','Knalpot','Velg/Ban','Shock','Lampu','CVT','Body','Tools','Other'];
const COLLECTION_STATUS = ['Wishlist','Target','Nabung','Bought'];

const svgIcon = name => {
  const icons = {
    oil:'<svg viewBox="0 0 24 24"><path d="M8 3h8"/><path d="M9 3v4l-3 4v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8l-3-4V3"/><path d="M8 14h8"/></svg>',
    gear:'<svg viewBox="0 0 24 24"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 8.97 3.6 1.7 1.7 0 0 0 10 2.04V2a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 8c.12.35.42.63.8.8.2.08.42.13.65.13H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z"/></svg>',
    spark:'<svg viewBox="0 0 24 24"><path d="m13 2-8 12h6l-1 8 9-13h-6l0-7Z"/></svg>',
    swirl:'<svg viewBox="0 0 24 24"><path d="M19 12a7 7 0 1 1-7-7c4 0 6 3 6 5 0 3-2 5-5 5-2 0-4-1.3-4-3 0-1.4 1-2.5 2.5-2.5 1.2 0 2 .8 2 1.8"/></svg>',
    brake:'<svg viewBox="0 0 24 24"><path d="M6 6a9 9 0 0 0 0 12"/><path d="M18 6a9 9 0 0 1 0 12"/><circle cx="12" cy="12" r="4"/></svg>',
    filter:'<svg viewBox="0 0 24 24"><path d="M4 5h16"/><path d="M7 10h10"/><path d="M10 15h4"/><path d="M12 15v5"/></svg>',
    km:'<svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M3 12h18"/></svg>',
    fuel:'<svg viewBox="0 0 24 24"><path d="M6 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17"/><path d="M4 21h14"/><path d="M9 7h4"/><path d="M16 8h2l2 2v6.5a1.5 1.5 0 0 0 3 0V13l-3-3"/></svg>',
    money:'<svg viewBox="0 0 24 24"><path d="M3 7h18v12H3z"/><path d="M7 7V5h10v2"/><path d="M12 10v6"/></svg>',
    collection:'<svg viewBox="0 0 24 24"><path d="M4 7h16v12H4z"/><path d="M7 7V5h10v2"/><path d="M8 12h8"/><path d="M8 16h5"/></svg>',
    link:'<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/></svg>',
    wrench:'<svg viewBox="0 0 24 24"><path d="m14 7 3 3"/><path d="M5 19 15.5 8.5a4 4 0 0 1 5-5L17 7l-3-3 3.5-3.5a4 4 0 0 0-5 5L2 16v5h5Z"/></svg>'
  };
  return icons[name] || icons.wrench;
};

const DEFAULT_STATE = {
  version: VERSION,
  bike:{name:'Honda BeAT FI 2014', virtualKm:0},
  kmLogs:[],
  fuel:{liters:0, tankLiters:4.0, kmpl:55, prices:{Pertalite:10000,Pertamax:12950,Shell:14530}, logs:[], balance:[]},
  money:{monthlyBudget:250000, savings:0, savingsTarget:500000, expenses:[], collections:[]},
  service:{},
  routes:{favorites:[]},
  assist:{messages:[{role:'bot', ts:now(), text:'Yo, gw Kang Rusdi. Input KM/fuel/service dulu, nanti gw bantu scan motor lu.'}], problems:[]},
  settings:{tile:'voyager', reminderEnabled:false, reminderTime:'20:00'},
  ai:{key:'', baseUrl:'https://openrouter.ai/api/v1', model:'openai/gpt-4o-mini'}
};

let state = loadState();
let activeTab = 'home';
let map = null, routeLayer = null;
let routeMarkers = [];
let currentTileLayer = null;
const routeDraft = {mode:'start', points:[], result:null};

function loadState(){
  try{ return normalize(JSON.parse(localStorage.getItem(STORE_KEY))); }catch(e){ return normalize({}); }
}
function normalize(raw){
  const s = structuredClone(DEFAULT_STATE);
  merge(s, raw || {});
  s.version = VERSION;
  SERVICES.forEach(x => { if(!s.service[x.key]) s.service[x.key] = {lastKm:num(s.bike.virtualKm), lastTs:now()}; });
  return s;
}
function merge(target, src){
  for(const [k,v] of Object.entries(src||{})){
    if(v && typeof v === 'object' && !Array.isArray(v) && target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])) merge(target[k], v);
    else target[k] = v;
  }
}
function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2200); }

function dailyLogs(key=todayKey()){ return state.kmLogs.filter(x => dateKey(x.ts) === key); }
function todayKm(){ return dailyLogs().reduce((a,x)=>a+num(x.km),0); }
function streakInfo(){
  let streak=0; let d=new Date();
  for(;;){ const key=dateKey(d.getTime()); if(dailyLogs(key).length){ streak++; d.setDate(d.getDate()-1); } else break; }
  let best=0, cur=0; const keys=[...new Set(state.kmLogs.map(x=>dateKey(x.ts)))].sort();
  let prev='';
  keys.forEach(k=>{ const dt=new Date(k); const p=prev?new Date(prev):null; const gap=p?(dt-p)/86400000:1; cur = gap===1 ? cur+1 : 1; best=Math.max(best,cur); prev=k; });
  return {streak,best};
}
function fuelRange(){ return Math.max(0, state.fuel.liters * state.fuel.kmpl); }
function monthExpenses(cat){ const d=new Date(); return state.money.expenses.filter(e=>{ const x=new Date(e.ts); return x.getMonth()===d.getMonth() && x.getFullYear()===d.getFullYear() && (!cat || e.cat===cat); }).reduce((a,e)=>a+num(e.amount),0); }
function serviceHealth(s){
  const rec = state.service[s.key] || {lastKm:0,lastTs:now()};
  const usedKm = Math.max(0, num(state.bike.virtualKm)-num(rec.lastKm));
  const usedDays = Math.max(0, (now()-num(rec.lastTs,now()))/86400000);
  const kmPct = 100 - (usedKm / s.intervalKm * 100);
  const dayPct = 100 - (usedDays / s.intervalDays * 100);
  return clamp(Math.min(kmPct,dayPct),0,100);
}
function serviceRemain(s){
  const rec = state.service[s.key] || {lastKm:0,lastTs:now()};
  const usedKm = Math.max(0, num(state.bike.virtualKm)-num(rec.lastKm));
  const usedDays = Math.max(0, (now()-num(rec.lastTs,now()))/86400000);
  return {km:Math.max(0,s.intervalKm-usedKm), days:Math.max(0, Math.ceil(s.intervalDays-usedDays))};
}
function servicePriority(){ return [...SERVICES].sort((a,b)=>serviceHealth(a)-serviceHealth(b)); }
function overallHealth(){ const vals=SERVICES.map(serviceHealth); return vals.reduce((a,b)=>a+b,0)/vals.length; }
function localScan(){
  const p=servicePriority()[0], h=serviceHealth(p), spent=monthExpenses();
  return `Hari ini ${fmtKm(todayKm())}. Streak ${streakInfo().streak} hari. Fuel ${fmtL(state.fuel.liters)} / range ${fmtKm(fuelRange())}. Service terdekat: ${p.name} ${h.toFixed(0)}%. Money bulan ini ${fmtRp(spent)}.`;
}

function render(){
  $('#tab-home').innerHTML = renderHome();
  $('#tab-maps').innerHTML = renderMaps();
  $('#tab-fuel').innerHTML = renderFuel();
  $('#tab-money').innerHTML = renderMoney();
  $('#tab-assist').innerHTML = renderAssist();
  $$('.screen').forEach(x=>x.classList.toggle('active', x.id === `tab-${activeTab}`));
  $$('.nav-item').forEach(x=>x.classList.toggle('active', x.dataset.tab===activeTab));
  $('#fab')?.classList.toggle('fab-hidden', activeTab==='home' || activeTab==='maps');
  if(activeTab==='maps') setTimeout(ensureMap, 80);
  setTimeout(()=>{drawFuelChart();drawMoneyChart();},80);
}
function renderHome(){
  const health=overallHealth(), st=streakInfo(), p=servicePriority()[0], ph=serviceHealth(p), pr=serviceRemain(p);
  const todayDone = dailyLogs().length>0;
  return `
    <div class="home-id-card card">
      <div class="id-top">
        <div class="bike-logo-wrap"><img src="icon-192.png" alt="NGR" /></div>
        <div class="bike-title-wrap">
          <div class="eyebrow">NGR Neo</div>
          <h1>${esc(state.bike.name || 'Honda BeAT FI 2014')}</h1>
          <p>Liquid Garage OS · daily motor log</p>
        </div>
        <span class="status-dot ${health<40?'danger':health<70?'warn':'ok'}"></span>
      </div>
      <div class="id-metrics">
        <div class="id-metric main"><b>${fmtKm(state.bike.virtualKm)}</b><span>Virtual KM</span></div>
        <div class="id-metric"><b>${fmtL(state.fuel.liters)}</b><span>Fuel</span></div>
        <div class="id-metric"><b>${fmtKm(fuelRange())}</b><span>Range</span></div>
        <div class="id-metric"><b>${health.toFixed(0)}%</b><span>Health</span></div>
      </div>
    </div>

    <div class="daily-card card">
      <div class="daily-head">
        <div>
          <div class="label">Hari ini</div>
          <h2>${fmtKm(todayKm())}</h2>
          <p>${todayDone ? 'Sudah input. Aman, streak jalan.' : 'Belum input KM. Isi 0 km juga tetap dihitung.'}</p>
        </div>
        <span class="pill ${todayDone?'green':'red'}">${st.streak} streak</span>
      </div>
      <div class="chips compact-chips">
        <button class="chip" data-action="km-add" data-km="0">0 km</button>
        <button class="chip" data-action="km-add" data-km="5">+5</button>
        <button class="chip" data-action="km-add" data-km="10">+10</button>
        <button class="chip" data-action="km-sheet">Custom</button>
        <button class="chip" data-tabgo="maps">Maps</button>
      </div>
      ${renderStreakStrip()}
    </div>

    <div class="home-actions">
      <button class="action-chip primary" data-action="km-sheet">${svgIcon('km')}<span>KM</span></button>
      <button class="action-chip" data-action="fuel-sheet">${svgIcon('fuel')}<span>Fuel</span></button>
      <button class="action-chip" data-action="service-sheet">${svgIcon('wrench')}<span>Service</span></button>
      <button class="action-chip" data-action="expense-sheet">${svgIcon('money')}<span>Money</span></button>
    </div>

    <div class="section-title slim"><h2>Prioritas</h2><small>cukup 1 yang penting</small></div>
    <button class="service-focus card" data-action="service-detail" data-key="${p.key}">
      <div class="item-icon">${svgIcon(p.icon)}</div>
      <div class="item-main">
        <b>${p.name}</b>
        <span>Sisa ${fmtKm(pr.km)} / ${pr.days} hari. ${ph<40?'Mulai siapin servis.':'Masih aman dipantau.'}</span>
      </div>
      <div class="mini-ring" style="--pct:${ph.toFixed(0)}">${ph.toFixed(0)}%</div>
    </button>

    <div class="rusdi-compact card">
      <div class="between">
        <div>
          <div class="label">Kang Rusdi</div>
          <p>${todayDone ? `Hari ini masuk ${fmtKm(todayKm())}. ` : 'Hari ini belum input. '}Fuel ${fmtL(state.fuel.liters)}, range ${fmtKm(fuelRange())}. Money bulan ini ${fmtRp(monthExpenses())}.</p>
        </div>
        <button class="btn" data-tabgo="assist">Buka</button>
      </div>
    </div>
  `;
}
function renderStreakStrip(){
  let html='<div class="streak-strip">'; const d=new Date();
  for(let i=6;i>=0;i--){ const day=new Date(d.getFullYear(),d.getMonth(),d.getDate()-i); const key=dateKey(day.getTime()); const logs=dailyLogs(key); const km=logs.reduce((a,x)=>a+num(x.km),0); const cls=logs.length?(km>0?'done':'zero'):''; html+=`<div class="streak-dot ${cls} ${key===todayKey()?'today':''}"><small>${day.toLocaleDateString('id-ID',{weekday:'short'}).slice(0,1)}</small><b>${day.getDate()}</b></div>`; }
  return html+'</div>';
}
function renderCalendar(){
  let html='<div class="calendar">'; const d=new Date();
  for(let i=13;i>=0;i--){ const day=new Date(d.getFullYear(),d.getMonth(),d.getDate()-i); const key=dateKey(day.getTime()); const logs=dailyLogs(key); const km=logs.reduce((a,x)=>a+num(x.km),0); const cls=logs.length?(km>0?'done':'zero'):''; html+=`<div class="day ${cls} ${key===todayKey()?'today':''}"><small>${day.toLocaleDateString('id-ID',{weekday:'short'}).slice(0,3)}</small>${day.getDate()}</div>`; }
  return html+'</div>';
}
function renderService(s){
  const h=serviceHealth(s), r=serviceRemain(s);
  return `<button class="item" data-action="service-detail" data-key="${s.key}"><div class="item-icon">${svgIcon(s.icon)}</div><div class="item-main"><b>${s.name}</b><span>Sisa ${fmtKm(r.km)} / ${r.days} hari · ${s.note}</span></div><div class="mini-ring" style="--pct:${h.toFixed(0)}">${h.toFixed(0)}%</div></button>`;
}
function renderMaps(){
  const r=routeDraft.result;
  return `
    <div class="map-page">
      <div class="map-card">
        <div id="map"></div>
        <div class="map-top"><span id="mapHint" class="map-pill">${mapHint()}</span><button class="map-pill" data-action="route-reset">Reset</button></div>
        <div id="mapFallback" class="map-fallback hide"><div><b>Map belum kebuka</b><div class="small muted" style="margin-top:6px">Cek internet. Versi ini pakai Leaflet + CARTO/OSM, lebih stabil dari MapLibre.</div><button class="btn primary" style="margin-top:12px" data-action="manual-route-sheet">Input jarak manual</button></div></div>
      </div>
      <div class="map-dock">
        <div class="seg-control"><button class="seg ${routeDraft.mode==='start'?'on':''}" data-action="map-mode" data-mode="start">Start</button><button class="seg ${routeDraft.mode==='goal'?'on':''}" data-action="map-mode" data-mode="goal">Tujuan</button><button class="seg ${routeDraft.mode==='stop'?'on':''}" data-action="map-mode" data-mode="stop">Stop</button></div>
        <div class="metrics"><div class="metric"><b id="metricPts">${routeDraft.points.length}</b><span>Titik</span></div><div class="metric"><b id="metricKm">${r?fmtKm(r.km):'-'}</b><span>Jarak jalan</span></div><div class="metric"><b id="metricCost">${r?fmtRp(r.cost):'-'}</b><span>Est BBM</span></div></div>
        <div class="route-actions"><button class="btn primary" data-action="route-calc">Hitung Jalan</button><button class="btn" data-action="route-add-km">Tambah KM</button><button class="btn" data-action="route-save">Simpan</button></div>
      </div>
    </div>
    <div class="route-list">
      <div class="section-title"><h2>Rusdi Route Scan</h2><small>${r? r.provider : 'context'}</small></div>
      <div class="card small">${routeScan()}<div class="row" style="margin-top:12px"><input id="mapAsk" placeholder="Tanya: rute ini boros gak?"/><button class="btn primary" data-action="map-ai-ask">Kirim</button></div></div>
      <div class="section-title"><h2>Rute Favorit</h2><small>${state.routes.favorites.length}</small></div>
      <div>${state.routes.favorites.length?state.routes.favorites.map(renderRouteFav).join(''):'<div class="card tight muted small">Belum ada rute favorit.</div>'}</div>
    </div>
  `;
}
function renderRouteFav(r){ return `<button class="item" data-action="route-use" data-id="${r.id}"><div class="item-icon">A→B</div><div class="item-main"><b>${esc(r.name)}</b><span>${fmtKm(r.km)} · ${r.provider || 'saved'}</span></div><b>${fmtRp(r.cost||0)}</b></button>`; }
function mapHint(){ if(routeDraft.points.length===0) return 'Tap map buat titik START'; if(routeDraft.points.length===1) return 'Tap TUJUAN'; if(!routeDraft.result) return 'Siap hitung rute jalan'; return `${fmtKm(routeDraft.result.km)} · ${routeDraft.result.provider}`; }
function routeScan(){
  const r=routeDraft.result; if(!r) return 'Belum ada rute. Tap Start + Tujuan di map, lalu Hitung Jalan. Versi ini bukan GPS live, jadi lebih stabil buat odometer mati.';
  const fuelNeed=r.km/Math.max(1,state.fuel.kmpl), after=state.fuel.liters-fuelNeed, p=servicePriority()[0];
  return `Rute ${fmtKm(r.km)} (${r.provider}). Estimasi fuel ${fmtL(fuelNeed)} / ${fmtRp(r.cost)}. Fuel setelah jalan kira-kira ${fmtL(after)}. Service terdekat: ${p.name} ${serviceHealth(p).toFixed(0)}%.`;
}
function renderFuel(){
  return `
    <div class="section-title"><h2>Fuel</h2><small>${fmtKm(fuelRange())} range</small></div>
    <div class="card">
      <div class="between"><div><div class="label">Sisa bensin</div><div class="big">${fmtL(state.fuel.liters)}</div></div><span class="pill ${state.fuel.liters>.8?'green':'red'}">${state.fuel.kmpl} km/L</span></div>
      <div class="progress" style="margin-top:13px"><i style="--w:${clamp(state.fuel.liters/state.fuel.tankLiters*100,0,100)}%"></i></div>
      <div class="chips" style="margin-top:13px"><button class="chip" data-action="fuel-add" data-type="Pertalite" data-liter="1">Pertalite 1L</button><button class="chip" data-action="fuel-add" data-type="Pertalite" data-liter="2">Pertalite 2L</button><button class="chip" data-action="fuel-add" data-type="Pertamax" data-liter="1">Pertamax</button><button class="chip" data-action="fuel-sheet">Custom</button></div>
    </div>
    <div class="section-title"><h2>Fuel Balance</h2><small>naik/turun</small></div><div class="card"><canvas id="fuelChart" class="chart"></canvas></div>
    <div class="section-title"><h2>History</h2><small>${state.fuel.logs.length}</small></div><div class="list">${state.fuel.logs.slice(0,14).map(x=>`<div class="item"><div class="item-icon">${svgIcon('fuel')}</div><div class="item-main"><b>${x.type} · ${fmtL(x.liters)}</b><span>${fmtDate(x.ts)} ${fmtTime(x.ts)}</span></div><b>${fmtRp(x.amount)}</b></div>`).join('') || '<div class="card tight muted small">Belum ada isi BBM.</div>'}</div>`;
}
function collectionTotal(status){ return state.money.collections.filter(x=>!status || x.status===status).reduce((a,x)=>a+num(x.price),0); }
function renderCollectionCard(c){
  const img = c.img ? `<img src="${esc(c.img)}" alt="${esc(c.title)}" loading="lazy" />` : svgIcon('collection');
  return `<button class="collection-card" data-action="collection-detail" data-id="${c.id}">
    <span class="status-badge">${esc(c.status||'Wishlist')}</span>
    <div class="thumb">${img}</div>
    <div class="body"><b>${esc(c.title)}</b><small>${esc(c.cat||'Other')} ${c.link?'· ada link':''}</small><div class="price">${fmtRp(c.price)}</div></div>
  </button>`;
}
function renderMoney(){
  const spent=monthExpenses(), pct=state.money.monthlyBudget?spent/state.money.monthlyBudget*100:0;
  const cols=state.money.collections || [];
  const target=collectionTotal();
  const bought=collectionTotal('Bought');
  return `
    <div class="section-title"><h2>Money</h2><small>${pct.toFixed(0)}% budget</small></div>
    <div class="card">
      <div class="money-overview">
        <div><div class="label">Bulan ini</div><div class="big">${fmtRp(spent)}</div><div class="progress" style="margin-top:13px"><i style="--w:${clamp(pct,0,100)}%"></i></div></div>
        <div class="money-mini"><b>${fmtRp(state.money.savings)}</b><span>Celengan</span><b style="margin-top:10px">${fmtRp(target)}</b><span>Target part</span></div>
      </div>
      <div class="chips" style="margin-top:13px"><button class="chip" data-action="expense-sheet">Tambah Expense</button><button class="chip" data-action="collection-sheet">Tambah Koleksi</button><button class="chip" data-action="saving-add" data-amount="10000">Celengan +10k</button><button class="chip" data-action="saving-add" data-amount="25000">+25k</button></div>
    </div>

    <div class="section-title"><h2>Garage Collection</h2><small>${cols.length} item</small></div>
    <div class="card">
      <div class="collection-head"><div><b>Konsep & part target</b><p>Masukin style motor, stop lamp, knalpot, velg, link toko, dan foto biar gak lupa.</p></div><span class="pill blue">Bought ${fmtRp(bought)}</span></div>
      ${cols.length?`<div class="collection-grid">${cols.slice(0,8).map(renderCollectionCard).join('')}</div>`:`<div class="collection-empty">Belum ada koleksi. Tambah stop lamp, knalpot, style Thai/retro, atau part incaran.</div>`}
    </div>

    <div class="section-title"><h2>Breakdown</h2><small>kategori</small></div><div class="card"><canvas id="moneyChart" class="chart"></canvas></div>
    <div class="section-title"><h2>Transaksi</h2><small>${state.money.expenses.length}</small></div><div class="list">${state.money.expenses.slice(0,10).map(e=>`<div class="item"><div class="item-icon">${e.cat==='Fuel'?svgIcon('fuel'):e.cat==='Service'?svgIcon('wrench'):e.cat==='Modif'?svgIcon('collection'):svgIcon('money')}</div><div class="item-main"><b>${esc(e.title)}</b><span>${e.cat} · ${fmtDate(e.ts)} ${e.note?`· ${esc(e.note)}`:''}</span></div><b>${fmtRp(e.amount)}</b></div>`).join('') || '<div class="card tight muted small">Belum ada transaksi.</div>'}</div>`;
}
function renderAssist(){
  const guideBtns=Object.entries(GUIDES).map(([k,g])=>`<button class="item" data-action="guide" data-key="${k}"><div class="item-icon">${g.icon}</div><div class="item-main"><b>${g.title}</b><span>${g.tag} · step-by-step</span></div></button>`).join('');
  return `
    <div class="section-title"><h2>NGR Assist</h2><small>Kang Rusdi</small></div>
    <div class="card"><div class="chat" id="chat">${state.assist.messages.slice(-12).map(m=>`<div class="msg ${m.role==='user'?'user':'bot'}">${esc(m.text)}</div>`).join('')}</div><div class="row" style="margin-top:12px"><input id="assistInput" placeholder="Tanya motor/fuel/money..."/><button class="btn primary" data-action="assist-send">Kirim</button></div></div>
    <div class="section-title"><h2>Emergency & Guide</h2><small>darurat</small></div><div class="list">${guideBtns}</div>
    <div class="section-title"><h2>Problem Diary</h2><small>${state.assist.problems.length}</small></div><div class="list">${state.assist.problems.slice(0,10).map(p=>`<div class="item"><div class="item-icon">!</div><div class="item-main"><b>${esc(p.title)}</b><span>${p.severity} · ${fmtDate(p.ts)} · ${esc(p.note||'')}</span></div></div>`).join('') || '<div class="card tight muted small">Belum ada problem dicatat.</div>'}</div>`;
}

function setTab(tab){ activeTab=tab; render(); if(tab==='maps') setTimeout(ensureMap,100); }
document.addEventListener('click', e=>{
  const nav=e.target.closest('[data-tab]'); if(nav) return setTab(nav.dataset.tab);
  const tabgo=e.target.closest('[data-tabgo]'); if(tabgo) return setTab(tabgo.dataset.tabgo);
  const el=e.target.closest('[data-action]'); if(!el) return;
  const a=el.dataset.action;
  if(a==='settings') return openSettings();
  if(a==='km-sheet') return openKmSheet();
  if(a==='fuel-sheet') return openFuelSheet();
  if(a==='expense-sheet') return openExpenseSheet();
  if(a==='collection-sheet') return openCollectionSheet();
  if(a==='collection-detail') return openCollectionDetail(el.dataset.id);
  if(a==='collection-open') return openCollectionLink(el.dataset.id);
  if(a==='collection-delete') return deleteCollection(el.dataset.id);
  if(a==='collection-bought') return markCollectionBought(el.dataset.id);
  if(a==='service-sheet') return openServiceSheet();
  if(a==='km-add') return addDailyKm(num(el.dataset.km), 'Quick KM');
  if(a==='fuel-add') return addFuel(el.dataset.type, num(el.dataset.liter));
  if(a==='saving-add') return addSaving(num(el.dataset.amount));
  if(a==='service-detail') return openServiceDetail(el.dataset.key);
  if(a==='map-mode') return setMapMode(el.dataset.mode);
  if(a==='route-reset') return resetRoute();
  if(a==='route-calc') return calculateRoute();
  if(a==='route-add-km') return addRouteToKm();
  if(a==='route-save') return saveRouteFav();
  if(a==='route-use') return useRouteFav(el.dataset.id);
  if(a==='map-ai-ask') return sendAssist(`[Maps] ${$('#mapAsk')?.value || 'Rute ini gimana?'}`);
  if(a==='assist-send') return sendAssist($('#assistInput')?.value || '');
  if(a==='guide') return openGuide(el.dataset.key);
  if(a==='manual-route-sheet') return openManualRouteSheet();
});
$('#fab').addEventListener('click', openQuickSheet);
$('.sheet-backdrop').addEventListener('click', closeSheet);
document.addEventListener('change', e=>{ if(e.target?.id==='importFile') importData(e); if(e.target?.id==='inColPhoto') previewCollectionPhoto(e); });

function showSheet(html){ $('#sheetContent').innerHTML=html; $('#sheetWrap').classList.add('show'); $('#sheetWrap').setAttribute('aria-hidden','false'); }
function closeSheet(){ $('#sheetWrap').classList.remove('show'); $('#sheetWrap').setAttribute('aria-hidden','true'); }
function openQuickSheet(){ showSheet(`<h2>Quick Add</h2><div class="quick-grid"><button class="quick primary" onclick="closeSheet();setTimeout(openKmSheet,90)">${svgIcon('km')}KM</button><button class="quick" onclick="closeSheet();setTimeout(openFuelSheet,90)">${svgIcon('fuel')}Fuel</button><button class="quick" onclick="closeSheet();setTimeout(openServiceSheet,90)">${svgIcon('wrench')}Service</button><button class="quick" onclick="closeSheet();setTimeout(openExpenseSheet,90)">${svgIcon('money')}Money</button><button class="quick" onclick="closeSheet();setTimeout(openCollectionSheet,90)">${svgIcon('collection')}Koleksi</button></div><button class="btn block" style="margin-top:12px" onclick="closeSheet()">Tutup</button>`); }
function openKmSheet(){ showSheet(`<h2>Input Daily KM</h2><div class="field"><label>KM hari ini</label><input id="inKm" type="number" step="0.1" placeholder="contoh 12.5" /></div><div class="field"><label>Catatan</label><input id="inKmNote" placeholder="sekolah, bengkel, muter sore" /></div><button class="btn primary block" onclick="submitKm()">Simpan KM</button>`); }
function submitKm(){ const km=num($('#inKm').value); addDailyKm(km, $('#inKmNote').value || 'Daily KM'); closeSheet(); }
function openFuelSheet(){ showSheet(`<h2>Isi BBM</h2><div class="field"><label>Jenis</label><select id="inFuelType"><option>Pertalite</option><option>Pertamax</option><option>Shell</option></select></div><div class="grid2"><div class="field"><label>Liter</label><input id="inFuelL" type="number" step="0.01" placeholder="1.5" /></div><div class="field"><label>Total Rp opsional</label><input id="inFuelRp" type="number" placeholder="auto" /></div></div><button class="btn primary block" onclick="submitFuel()">Simpan Fuel</button>`); }
function submitFuel(){ const type=$('#inFuelType').value, liters=num($('#inFuelL').value), amount=num($('#inFuelRp').value, liters*(state.fuel.prices[type]||10000)); addFuel(type, liters, amount); closeSheet(); }
function openExpenseSheet(){ showSheet(`<h2>Tambah Expense</h2><div class="field"><label>Judul</label><input id="inExpTitle" placeholder="contoh beli oli" /></div><div class="grid2"><div class="field"><label>Kategori</label><select id="inExpCat"><option>Service</option><option>Fuel</option><option>Modif</option><option>Tools</option><option>Other</option></select></div><div class="field"><label>Nominal</label><input id="inExpAmount" type="number" /></div></div><div class="field"><label>Catatan</label><input id="inExpNote" /></div><button class="btn primary block" onclick="submitExpense()">Simpan Money</button>`); }

function submitExpense(){ addExpense($('#inExpCat').value, $('#inExpTitle').value || 'Expense', num($('#inExpAmount').value), $('#inExpNote').value||''); closeSheet(); }
function openCollectionSheet(){
  const cats=COLLECTION_CATS.map(c=>`<option>${c}</option>`).join('');
  const stats=COLLECTION_STATUS.map(s=>`<option>${s}</option>`).join('');
  showSheet(`<h2>Tambah Koleksi Garage</h2>
    <div class="field"><label>Nama item / konsep</label><input id="inColTitle" placeholder="Stop lamp running text, knalpot, Thai look..." /></div>
    <div class="grid2"><div class="field"><label>Kategori</label><select id="inColCat">${cats}</select></div><div class="field"><label>Status</label><select id="inColStatus">${stats}</select></div></div>
    <div class="grid2"><div class="field"><label>Target harga</label><input id="inColPrice" type="number" placeholder="250000" /></div><div class="field"><label>Link toko/referensi</label><input id="inColLink" placeholder="https://..." /></div></div>
    <div class="field"><label>Foto URL opsional</label><input id="inColImg" placeholder="https://gambar..." /></div>
    <label class="file-like"><input id="inColPhoto" type="file" accept="image/*" style="display:none"/>Upload foto dari HP</label>
    <div id="colPreview" class="photo-preview" style="margin-top:10px">Belum ada foto</div>
    <div class="field"><label>Catatan</label><textarea id="inColNote" placeholder="Ukuran, warna, toko, cocok sama konsep apa..."></textarea></div>
    <button class="btn primary block" onclick="submitCollection()">Simpan Koleksi</button>`);
}
function previewCollectionPhoto(e){
  const f=e.target.files?.[0]; if(!f) return;
  if(f.size>1200000) toast('Foto kegedean, coba screenshot/kompres dulu');
  const fr=new FileReader(); fr.onload=()=>{ const prev=$('#colPreview'); if(prev){ prev.innerHTML=`<img src="${fr.result}" alt="preview" />`; prev.dataset.img=fr.result; } }; fr.readAsDataURL(f);
}
function submitCollection(){
  const img=($('#colPreview')?.dataset.img || $('#inColImg')?.value || '').trim();
  const title=($('#inColTitle')?.value || '').trim();
  if(!title) return toast('Nama item belum diisi');
  state.money.collections.unshift({id:id(),ts:now(),title,cat:$('#inColCat')?.value||'Other',status:$('#inColStatus')?.value||'Wishlist',price:num($('#inColPrice')?.value),link:($('#inColLink')?.value||'').trim(),img,note:($('#inColNote')?.value||'').trim()});
  save(); closeSheet(); render(); toast('Koleksi disimpan');
}
function openCollectionDetail(cid){
  const c=state.money.collections.find(x=>x.id===cid); if(!c) return;
  const img=c.img?`<div class="photo-preview"><img src="${esc(c.img)}" alt="${esc(c.title)}" /></div>`:'<div class="photo-preview">Belum ada foto</div>';
  showSheet(`<h2>${esc(c.title)}</h2>${img}<div class="grid2" style="margin-top:12px"><div class="card tight"><div class="label">Kategori</div><b>${esc(c.cat)}</b></div><div class="card tight"><div class="label">Harga target</div><b>${fmtRp(c.price)}</b></div></div><p class="small muted">${esc(c.note||'Belum ada catatan.')}</p><div class="link-row"><button class="btn" onclick="markCollectionBought('${c.id}')">Tandai Bought</button><button class="btn" onclick="openCollectionLink('${c.id}')">Buka Link</button></div><button class="btn danger block" style="margin-top:10px" onclick="deleteCollection('${c.id}')">Hapus</button>`);
}
function openCollectionLink(cid){ const c=state.money.collections.find(x=>x.id===cid); if(!c?.link) return toast('Belum ada link'); window.open(c.link, '_blank'); }
function markCollectionBought(cid){ const c=state.money.collections.find(x=>x.id===cid); if(!c) return; c.status='Bought'; if(c.price) addExpense('Modif', c.title, c.price, 'Garage Collection'); save(); closeSheet(); render(); toast('Masuk Bought + expense'); }
function deleteCollection(cid){ state.money.collections=state.money.collections.filter(x=>x.id!==cid); save(); closeSheet(); render(); toast('Koleksi dihapus'); }

function openServiceSheet(){ const opts=SERVICES.map(s=>`<option value="${s.key}">${s.name}</option>`).join(''); showSheet(`<h2>Catat Service</h2><div class="field"><label>Part</label><select id="inService">${opts}</select></div><div class="field"><label>Biaya opsional</label><input id="inServiceCost" type="number" placeholder="0" /></div><button class="btn primary block" onclick="submitService()">Catat sudah diganti</button>`); }
function submitService(){ const key=$('#inService').value; const cost=num($('#inServiceCost').value); markService(key, cost); closeSheet(); }
function openServiceDetail(key){ const s=SERVICES.find(x=>x.key===key); if(!s) return; const h=serviceHealth(s), r=serviceRemain(s); showSheet(`<h2>${s.name}</h2><div class="card tight"><div class="between"><div><div class="label">Health</div><div class="big">${h.toFixed(0)}%</div></div><span class="pill ${h<30?'red':'green'}">${fmtKm(r.km)} / ${r.days} hari</span></div><p class="small muted">${s.note}</p></div><button class="btn primary block" style="margin-top:12px" onclick="markService('${s.key}',0);closeSheet()">Catat sudah diganti</button>`); }
function openGuide(key){ const g=GUIDES[key]; if(!g) return; showSheet(`<h2>${g.icon} ${g.title}</h2><div class="dangerbox small">${g.danger}</div><div class="section-title"><h2>Langkah cepat</h2><small>${g.tag}</small></div><div class="list">${g.steps.map((x,i)=>`<div class="item"><div class="item-icon">${i+1}</div><div class="item-main"><b>${x}</b></div></div>`).join('')}</div><div class="grid2" style="margin-top:12px"><button class="btn" onclick="problemFromGuide('${g.title}')">Catat Problem</button>${g.service?`<button class="btn primary" onclick="markService('${g.service}',0);closeSheet()">Catat Service</button>`:`<button class="btn primary" onclick="closeSheet()">Selesai</button>`}</div>`); }
function openManualRouteSheet(){ showSheet(`<h2>Input Rute Manual</h2><div class="field"><label>Jarak KM</label><input id="manualRouteKm" type="number" step="0.1" /></div><button class="btn primary block" onclick="submitManualRoute()">Pakai jarak ini</button>`); }
function submitManualRoute(){ const km=num($('#manualRouteKm').value); routeDraft.result={km, cost: routeCost(km), provider:'manual input', coords:[]}; updateMapUi(); closeSheet(); toast('Rute manual siap'); }
function openSettings(){ showSheet(`<h2>Settings</h2><div class="field"><label>Nama motor</label><input id="setBikeName" value="${esc(state.bike.name)}" /></div><div class="grid2"><div class="field"><label>KM/L default</label><input id="setKmpl" type="number" value="${state.fuel.kmpl}" /></div><div class="field"><label>Budget bulanan</label><input id="setBudget" type="number" value="${state.money.monthlyBudget}" /></div></div><div class="field"><label>Map tile</label><select id="setTile"><option ${state.settings.tile==='voyager'?'selected':''}>voyager</option><option ${state.settings.tile==='dark'?'selected':''}>dark</option><option ${state.settings.tile==='osm'?'selected':''}>osm</option></select></div><div class="grid2"><button class="btn" onclick="exportData()">Export JSON</button><label class="btn" style="display:grid;place-items:center"><input id="importFile" type="file" accept="application/json" style="display:none"/>Import JSON</label></div><button class="btn primary block" style="margin-top:12px" onclick="saveSettings();closeSheet()">Simpan Settings</button><button class="btn danger block" style="margin-top:10px" onclick="resetData()">Reset Data</button>`); }
function saveSettings(){ state.bike.name=$('#setBikeName').value.trim()||state.bike.name; state.fuel.kmpl=num($('#setKmpl').value,55); state.money.monthlyBudget=num($('#setBudget').value,250000); state.settings.tile=$('#setTile').value; save(); if(map){ setTileLayer(); } render(); toast('Settings disimpan'); }
function resetData(){ if(!confirm('Reset semua data NGR?')) return; localStorage.removeItem(STORE_KEY); state=normalize({}); closeSheet(); render(); toast('Data reset'); }

function addDailyKm(km, note='Daily KM', extra=''){
  km=Math.max(0,num(km));
  state.kmLogs.unshift({id:id(),ts:now(),km,note,extra});
  if(km>0){ state.bike.virtualKm += km; const used=km/Math.max(1,state.fuel.kmpl); state.fuel.liters=Math.max(0,state.fuel.liters-used); state.fuel.balance.push({ts:now(), liters:state.fuel.liters, reason:'km', km}); }
  state.assist.messages.push({role:'bot',ts:now(),text:`KM hari ini +${fmtKm(km)}. Fuel estimasi turun. ${localScan()}`});
  save(); render(); toast(`KM masuk: ${fmtKm(km)}`);
}
function addFuel(type, liters, amount){ liters=Math.max(0,num(liters)); if(!liters) return toast('Liter belum diisi'); amount = num(amount, liters*(state.fuel.prices[type]||10000)); state.fuel.liters=clamp(state.fuel.liters+liters,0,state.fuel.tankLiters); state.fuel.logs.unshift({id:id(),ts:now(),type,liters,amount}); state.fuel.balance.push({ts:now(),liters:state.fuel.liters,reason:'fill'}); addExpense('Fuel', `${type} ${fmtL(liters)}`, amount, 'auto fuel'); save(); render(); toast(`Fuel masuk ${fmtL(liters)}`); }
function addExpense(cat,title,amount,note=''){ amount=Math.max(0,num(amount)); if(!amount) return toast('Nominal belum diisi'); state.money.expenses.unshift({id:id(),ts:now(),cat,title,amount,note}); save(); render(); toast('Expense disimpan'); }
function addSaving(amount){ state.money.savings+=num(amount); save(); render(); toast(`Celengan +${fmtRp(amount)}`); }
function markService(key,cost=0){ const s=SERVICES.find(x=>x.key===key); if(!s) return; state.service[key]={lastKm:state.bike.virtualKm,lastTs:now()}; if(cost>0) addExpense('Service', s.name, cost, 'service'); else { save(); render(); } toast(`${s.name} dicatat`); }
function problemFromGuide(title){ state.assist.problems.unshift({id:id(),ts:now(),title,severity:'dipantau',note:'Dari guide'}); save(); closeSheet(); render(); toast('Problem dicatat'); }

function ensureMap(){
  if(activeTab!=='maps') return;
  const el=$('#map'); if(!el) return;
  if(typeof L === 'undefined'){ $('#mapFallback')?.classList.remove('hide'); return; }
  if(map && map.getContainer && map.getContainer() !== el){ map.remove(); map=null; routeLayer=null; routeMarkers=[]; }
  if(!map){
    map = L.map(el, {zoomControl:true, attributionControl:true, preferCanvas:true}).setView([-7.44,112.62], 13);
    setTileLayer();
    map.on('click', ev => addMapPoint(ev.latlng.lng, ev.latlng.lat));
  }
  setTimeout(()=>map.invalidateSize(true),80);
  setTimeout(()=>map.invalidateSize(true),450);
  $('#mapFallback')?.classList.add('hide');
  drawMapObjects();
}
function setTileLayer(){
  if(!map) return;
  if(currentTileLayer) currentTileLayer.remove();
  const tile=state.settings.tile || 'voyager';
  let url, attr;
  if(tile==='dark'){ url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'; attr='&copy; OpenStreetMap &copy; CARTO'; }
  else if(tile==='osm'){ url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; attr='&copy; OpenStreetMap'; }
  else { url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'; attr='&copy; OpenStreetMap &copy; CARTO'; }
  currentTileLayer = L.tileLayer(url,{maxZoom:20, attribution:attr, crossOrigin:true}).addTo(map);
}
function setMapMode(mode){ routeDraft.mode=mode||'start'; updateMapUi(); toast(mode==='start'?'Tap map buat START':mode==='goal'?'Tap map buat TUJUAN':'Tap map buat stop/waypoint'); }
function addMapPoint(lng,lat){
  if(routeDraft.mode==='start'){
    const i=routeDraft.points.findIndex(p=>p.kind==='start'); const p={kind:'start',lng,lat}; if(i>=0) routeDraft.points[i]=p; else routeDraft.points.unshift(p); routeDraft.mode=routeDraft.points.some(p=>p.kind==='goal')?'stop':'goal';
  } else if(routeDraft.mode==='goal'){
    const i=routeDraft.points.findIndex(p=>p.kind==='goal'); const p={kind:'goal',lng,lat}; if(i>=0) routeDraft.points[i]=p; else routeDraft.points.push(p); routeDraft.mode='stop';
  } else {
    const goal=routeDraft.points.findIndex(p=>p.kind==='goal'); const p={kind:'stop',lng,lat}; if(goal>=0) routeDraft.points.splice(goal,0,p); else routeDraft.points.push(p);
  }
  routeDraft.result=null; drawMapObjects(); updateMapUi();
}
function orderedPoints(){ const start=routeDraft.points.find(p=>p.kind==='start'), goal=routeDraft.points.find(p=>p.kind==='goal'), stops=routeDraft.points.filter(p=>p.kind==='stop'); return [start,...stops,goal].filter(Boolean); }
function drawMapObjects(){
  if(!map) return;
  routeMarkers.forEach(m=>m.remove()); routeMarkers=[];
  if(routeLayer){ routeLayer.remove(); routeLayer=null; }
  const pts=orderedPoints();
  pts.forEach((p,i)=>{ const label=p.kind==='start'?'A':p.kind==='goal'?'B':String(i+1); const icon=L.divIcon({className:'',html:`<div class="map-pin ${p.kind==='goal'?'goal':p.kind==='stop'?'stop':''}">${label}</div>`,iconSize:[34,34],iconAnchor:[17,17]}); routeMarkers.push(L.marker([p.lat,p.lng],{icon}).addTo(map)); });
  if(routeDraft.result?.coords?.length){ routeLayer=L.polyline(routeDraft.result.coords.map(c=>[c[1],c[0]]),{color:'#3487ff',weight:6,opacity:.92,lineCap:'round',lineJoin:'round'}).addTo(map); }
  else if(pts.length>1){ routeLayer=L.polyline(pts.map(p=>[p.lat,p.lng]),{color:'#58e2dc',weight:4,opacity:.6,dashArray:'8 8'}).addTo(map); }
  const allCoords=routeDraft.result?.coords?.length ? routeDraft.result.coords.map(c=>[c[1],c[0]]) : pts.map(p=>[p.lat,p.lng]);
  if(allCoords.length){ try{ map.fitBounds(L.latLngBounds(allCoords), {padding:[36,36], maxZoom:15}); }catch(e){} }
}
function updateMapUi(){
  $('#mapHint') && ($('#mapHint').textContent=mapHint());
  $('#metricPts') && ($('#metricPts').textContent=routeDraft.points.length);
  $('#metricKm') && ($('#metricKm').textContent=routeDraft.result?fmtKm(routeDraft.result.km):'-');
  $('#metricCost') && ($('#metricCost').textContent=routeDraft.result?fmtRp(routeDraft.result.cost):'-');
  $$('.seg[data-mode]').forEach(b=>b.classList.toggle('on',b.dataset.mode===routeDraft.mode));
}
function resetRoute(){ routeDraft.points=[]; routeDraft.result=null; routeDraft.mode='start'; drawMapObjects(); updateMapUi(); toast('Route direset'); }
function routeCost(km){ return km/Math.max(1,state.fuel.kmpl)*(state.fuel.prices.Pertalite||10000); }
async function calculateRoute(){
  const pts=orderedPoints(); if(pts.length<2) return toast('Pilih Start + Tujuan dulu');
  toast('Hitung rute jalan...');
  const coords=pts.map(p=>`${p.lng},${p.lat}`).join(';');
  const url=`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`;
  try{
    const res=await fetch(url); if(!res.ok) throw new Error('OSRM '+res.status);
    const j=await res.json(); const route=j.routes?.[0]; if(!route) throw new Error('no route');
    const km=route.distance/1000; const line=route.geometry.coordinates;
    routeDraft.result={km, cost:routeCost(km), provider:'OSRM road route', coords:line};
    drawMapObjects(); updateMapUi(); toast(`Rute jalan: ${fmtKm(km)}`);
  }catch(e){
    console.warn(e); const km=straightKm(pts); routeDraft.result={km, cost:routeCost(km), provider:'fallback garis lurus', coords:pts.map(p=>[p.lng,p.lat])}; drawMapObjects(); updateMapUi(); toast('Routing gagal, fallback garis lurus');
  }
}
function straightKm(pts){ let km=0; for(let i=1;i<pts.length;i++) km += hav([pts[i-1].lng,pts[i-1].lat],[pts[i].lng,pts[i].lat]); return km; }
function hav(a,b){ const R=6371, toRad=x=>x*Math.PI/180; const dLat=toRad(b[1]-a[1]), dLng=toRad(b[0]-a[0]); const s=Math.sin(dLat/2)**2+Math.cos(toRad(a[1]))*Math.cos(toRad(b[1]))*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(s)); }
function addRouteToKm(){ if(!routeDraft.result) return toast('Hitung rute dulu'); addDailyKm(routeDraft.result.km,'Maps route',routeDraft.result.provider); }
function saveRouteFav(){ if(!routeDraft.result) return toast('Hitung rute dulu'); const name=prompt('Nama rute favorit?','Rute '+fmtKm(routeDraft.result.km)); if(!name) return; state.routes.favorites.unshift({id:id(),name,km:routeDraft.result.km,cost:routeDraft.result.cost,provider:routeDraft.result.provider,points:orderedPoints(),coords:routeDraft.result.coords,ts:now()}); save(); render(); toast('Rute disimpan'); }
function useRouteFav(rid){ const r=state.routes.favorites.find(x=>x.id===rid); if(!r) return; routeDraft.points=r.points||[]; routeDraft.result={km:r.km,cost:r.cost,provider:r.provider||'favorite',coords:r.coords||[]}; routeDraft.mode='stop'; setTab('maps'); setTimeout(()=>{drawMapObjects();updateMapUi();},180); }

async function sendAssist(q){ q=String(q).trim(); if(!q) return; state.assist.messages.push({role:'user',ts:now(),text:q}); const ans=await askRusdi(q); state.assist.messages.push({role:'bot',ts:now(),text:ans}); save(); render(); setTab('assist'); }
async function askRusdi(q){
  if(!state.ai.key) return localRusdi(q);
  try{ const ctx={bike:state.bike,health:overallHealth(),todayKm:todayKm(),fuel:{liters:state.fuel.liters,range:fuelRange(),kmpl:state.fuel.kmpl},money:{month:monthExpenses(),budget:state.money.monthlyBudget},service:servicePriority().slice(0,3).map(s=>({name:s.name,health:serviceHealth(s)})),route:routeDraft.result}; const res=await fetch(state.ai.baseUrl.replace(/\/$/,'')+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+state.ai.key},body:JSON.stringify({model:state.ai.model,messages:[{role:'system',content:'Kamu Kang Rusdi, asisten motor Honda Beat FI 2014. Jawab santai, singkat, praktis. Jangan diagnosis pasti. Konteks: '+JSON.stringify(ctx)},{role:'user',content:q}],temperature:.55})}); if(!res.ok) throw new Error(res.status); const j=await res.json(); return j.choices?.[0]?.message?.content?.trim() || localRusdi(q); }catch(e){ return localRusdi(q)+' (AI API gagal, mode lokal.)'; }
}
function localRusdi(q){
  const low=q.toLowerCase();
  if(low.includes('rute')||low.includes('maps')) return routeDraft.result ? `Rute ${fmtKm(routeDraft.result.km)} via ${routeDraft.result.provider}. Estimasi ${fmtRp(routeDraft.result.cost)}. Fuel range ${fmtKm(fuelRange())}.` : 'Pilih start + tujuan di Maps, lalu Hitung Jalan dulu.';
  if(low.includes('koleksi')||low.includes('part')||low.includes('modif')) return `Koleksi garage ada ${(state.money.collections||[]).length} item dengan target ${fmtRp(collectionTotal())}. Kalau budget bulanan mulai sesak, beli part status Target dulu, Wishlist belakangan.`;
  if(low.includes('boros')||low.includes('uang')||low.includes('budget')) return `Money bulan ini ${fmtRp(monthExpenses())} dari budget ${fmtRp(state.money.monthlyBudget)}. Kalau udah lewat 75%, tahan modif dulu, prioritaskan service.`;
  if(low.includes('busi')||low.includes('mati')) return 'Cek cepat: bensin, indikator FI, aki/starter, sekring, kop busi. Kalau bunyi kasar atau mesin mati-mati, jangan dipaksa jauh.';
  return localScan();
}

function drawFuelChart(){ const c=$('#fuelChart'); if(!c) return; let pts=state.fuel.balance.slice(-30).map(x=>num(x.liters)); if(!pts.length) pts=[0,state.fuel.liters]; if(pts[0]!==0) pts=[0,...pts]; drawLine(c,pts,0,state.fuel.tankLiters); }
function drawMoneyChart(){ const c=$('#moneyChart'); if(!c) return; const labels=['Fuel','Service','Modif','Tools','Other']; const vals=labels.map(monthExpenses); drawBars(c,labels,vals); }
function prepCanvas(c){ const dpr=window.devicePixelRatio||1, r=c.getBoundingClientRect(); c.width=r.width*dpr; c.height=r.height*dpr; const ctx=c.getContext('2d'); ctx.scale(dpr,dpr); return [ctx,r.width,r.height]; }
function drawLine(c,pts,min=0,max=1){ const [ctx,w,h]=prepCanvas(c); ctx.clearRect(0,0,w,h); ctx.strokeStyle='rgba(255,255,255,.11)'; ctx.lineWidth=1; for(let i=0;i<=4;i++){const y=14+(h-28)*i/4;ctx.beginPath();ctx.moveTo(8,y);ctx.lineTo(w-8,y);ctx.stroke();} const span=Math.max(.1,max-min); ctx.strokeStyle='#58e2dc'; ctx.lineWidth=3; ctx.beginPath(); pts.forEach((p,i)=>{ const x=12+(w-24)*(i/Math.max(1,pts.length-1)); const y=h-14-(h-28)*((clamp(p,min,max)-min)/span); i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,.55)'; ctx.font='10px system-ui'; ctx.fillText(`${max.toFixed(1)}L`,10,12); ctx.fillText('0L',10,h-4); }
function drawBars(c,labels,vals){ const [ctx,w,h]=prepCanvas(c); const max=Math.max(...vals,1); ctx.clearRect(0,0,w,h); labels.forEach((l,i)=>{ const bw=(w-28)/labels.length-8, x=14+i*((w-28)/labels.length)+4, bh=(h-38)*(vals[i]/max); ctx.fillStyle='rgba(118,167,255,.82)'; ctx.fillRect(x,h-24-bh,bw,bh); ctx.fillStyle='rgba(255,255,255,.62)'; ctx.font='10px system-ui'; ctx.fillText(l.slice(0,6),x,h-7); }); }

function exportData(){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`ngr-neo-backup-${todayKey()}.json`; a.click(); URL.revokeObjectURL(url); toast('Export dibuat'); }
function importData(e){ const file=e.target.files?.[0]; if(!file) return; const fr=new FileReader(); fr.onload=()=>{ try{ state=normalize(JSON.parse(fr.result)); save(); closeSheet(); render(); toast('Import berhasil'); }catch(err){ toast('Import gagal'); } }; fr.readAsText(file); }

if('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(()=>{});
render();

Object.assign(window, {closeSheet, openKmSheet, openFuelSheet, openServiceSheet, openExpenseSheet, submitKm, submitFuel, submitExpense, openCollectionSheet, submitCollection, previewCollectionPhoto, openCollectionDetail, openCollectionLink, markCollectionBought, deleteCollection, submitService, markService, problemFromGuide, submitManualRoute, saveSettings, resetData, exportData});
