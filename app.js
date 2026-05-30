'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = n => 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID');
const km = n => (Number(n) || 0).toFixed(1);
const todayKey = () => new Date().toISOString().slice(0, 10);
const nowLabel = () => new Intl.DateTimeFormat('id-ID', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }).format(new Date());

const icons = {
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  maps:'<path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  fuel:'<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M4 11h12"/><path d="M16 7h2l2 3v8a2 2 0 0 0 2 2"/>',
  money:'<path d="M3 7h18v13H3z"/><path d="M16 3v4"/><path d="M8 3v4"/><circle cx="17" cy="14" r="1"/>',
  assist:'<path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v4a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2z"/><path d="M20 13v4a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2z"/>',
  gear:'<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2.1 2.1 0 0 1-2.97 2.97l-.06-.06A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6l-.05.07a2.1 2.1 0 0 1-3.9 0l-.05-.07a1.8 1.8 0 0 0-1-.6 1.8 1.8 0 0 0-1.98.36l-.06.06a2.1 2.1 0 0 1-2.97-2.97l.06-.06A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1l-.07-.05a2.1 2.1 0 0 1 0-3.9L4 10a1.8 1.8 0 0 0 .6-1 1.8 1.8 0 0 0-.36-1.98l-.06-.06a2.1 2.1 0 0 1 2.97-2.97l.06.06A1.8 1.8 0 0 0 9 4.6c.35-.16.7-.35 1-.6l.05-.07a2.1 2.1 0 0 1 3.9 0L14 4c.3.25.65.44 1 .6a1.8 1.8 0 0 0 1.98-.36l.06-.06a2.1 2.1 0 0 1 2.97 2.97l-.06.06A1.8 1.8 0 0 0 19.4 9c.16.35.35.7.6 1l.07.05a2.1 2.1 0 0 1 0 3.9L20 14c-.25.3-.44.65-.6 1z"/>',
  plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',
  chat:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
  wrench:'<path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-3 3-2-2 3-3z"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  oil:'<path d="M4 14l6-6h6l4 4v5H4z"/><path d="M12 8V5h4"/><path d="M20 18c1.5 1.5 1.5 3 0 3s-1.5-1.5 0-3z"/>',
  route:'<path d="M6 6h.01"/><path d="M18 18h.01"/><path d="M7 6c4 0 4 4 0 4s-4 4 0 4h10c4 0 4 4 1 4"/>',
  spark:'<path d="M13 2L3 14h8l-1 8 11-14h-8z"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.07 0l-2 2a5 5 0 0 0 7.07 7.07l1.1-1.1"/>',
  save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  external:'<path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  tire:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>',
  mirror:'<path d="M4 9c0-3 3-5 7-4 2 .5 3 2 2 4-1 3-6 5-9 3V9z"/><path d="M13 10l5 8"/><path d="M17 19h4"/>',
  exhaust:'<path d="M3 16l8-8 7 7-8 4-7-3z"/><path d="M18 15l3-3"/><path d="M10 9l5 5"/>',
  lamp:'<path d="M4 8h16l-2 8H6z"/><path d="M7 10l3 4 2-3 3 3 2-4"/>',
  ecu:'<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 10h8M8 14h5"/><path d="M20 10h2M20 14h2M2 10h2M2 14h2"/>',
  seat:'<path d="M4 15c3-5 10-7 16-4l-1 4H4z"/><path d="M4 15c2 3 12 4 15 0"/>',
  sticker:'<path d="M4 17l4-10 5 3 7-3-4 10-5-3-7 3z"/>',
  warning:'<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  plug:'<path d="M8 2l8 8"/><path d="M6 6l12 12"/><path d="M5 10l9 9"/><path d="M10 5l-4 4"/><path d="M15 10l-4 4"/>',
  cvt:'<circle cx="7" cy="12" r="4"/><circle cx="17" cy="12" r="4"/><path d="M7 8h10M7 16h10"/>'
};
function svg(name, cls='') { return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.home}</svg>`; }
function logoSvg(){return `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="lg" x1="0" x2="1" y1="1" y2="0"><stop stop-color="#2f8cff"/><stop offset=".45" stop-color="#49e8f0"/><stop offset="1" stop-color="#54ff87"/></linearGradient></defs><path d="M19 72 35 20c2-7 12-6 14 1l8 32 10-34c2-7 14-7 14 2L66 75c-2 8-14 7-16 0l-8-31-9 31c-2 7-14 6-14-3Z" fill="url(#lg)"/></svg>`}
function scooterSvg(){return `<svg viewBox="0 0 420 230" aria-label="Honda Beat FI"><defs><linearGradient id="b1" x1="0" x2="1"><stop stop-color="#0d63ff"/><stop offset="1" stop-color="#4ee9ff"/></linearGradient><linearGradient id="w1" x1="0" x2="1"><stop stop-color="#eef6ff"/><stop offset="1" stop-color="#b7c9e3"/></linearGradient></defs><ellipse cx="210" cy="205" rx="150" ry="18" fill="rgba(0,0,0,.32)"/><circle cx="110" cy="174" r="38" fill="#0d1520" stroke="#4e6074" stroke-width="9"/><circle cx="110" cy="174" r="15" fill="#111f30"/><circle cx="305" cy="174" r="40" fill="#0d1520" stroke="#4e6074" stroke-width="9"/><circle cx="305" cy="174" r="15" fill="#111f30"/><path d="M75 142c45-55 120-70 200-56 31 5 61 21 85 47l-19 22c-56-23-122-21-205-6-23 5-45 4-61-7z" fill="url(#b1)"/><path d="M126 112c66-22 131-17 199 15l-42 36c-46-16-93-19-146-11z" fill="url(#w1)"/><path d="M177 73h82c22 0 38 14 47 34l-98 10-57-14c3-19 12-30 26-30z" fill="#09111b"/><path d="M287 99l58 8c21 3 35 18 38 39l-44 8-33-34z" fill="url(#b1)"/><path d="M311 76l40-12" stroke="#d7e8ff" stroke-width="7" stroke-linecap="round"/><path d="M351 64l22 4" stroke="#d7e8ff" stroke-width="6" stroke-linecap="round"/><path d="M114 92l-27-21" stroke="#d7e8ff" stroke-width="6" stroke-linecap="round"/><path d="M82 68l-25-3" stroke="#d7e8ff" stroke-width="5" stroke-linecap="round"/><path d="M134 128c37 12 79 13 122 4" stroke="#f32f5f" stroke-width="5" stroke-linecap="round"/><path d="M155 139c44 5 74 3 94-4" stroke="#1b57ff" stroke-width="6" stroke-linecap="round"/></svg>`}
function avatarSvg(){return `<svg viewBox="0 0 100 100"><defs><linearGradient id="skin" x1="0" x2="1"><stop stop-color="#9b6038"/><stop offset="1" stop-color="#d28a56"/></linearGradient></defs><circle cx="50" cy="48" r="24" fill="url(#skin)"/><path d="M25 100V78c8-11 42-11 50 0v22" fill="#121b25"/><path d="M22 34c6-19 49-24 59 0-18-6-39-7-59 0z" fill="#0c121c"/><path d="M36 54c8 10 20 10 28 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="40" cy="45" r="3" fill="#151515"/><circle cx="60" cy="45" r="3" fill="#151515"/></svg>`}
function partIcon(name){
  const map = { 'Style Modif':'spark', ECU:'ecu', 'Stop Lamp':'lamp', Spion:'mirror', Knalpot:'exhaust', Velg:'tire', Jok:'seat', Sticker:'sticker', Shock:'wrench', Ban:'tire', 'Body Kit':'sticker', Busi:'plug', CVT:'cvt' };
  return svg(map[name] || 'wrench');
}

const defaultProducts = [
  { id:crypto.randomUUID(), category:'ECU', name:'RCB ECU Juken 5', price:1350000, link:'https://shopee.co.id/search?keyword=RCB%20ECU%20Juken%205%20Beat%20FI', note:'Plug & play, cocok buat riset performa harian.', img:'' },
  { id:crypto.randomUUID(), category:'ECU', name:'Juken 5 Dualband', price:1650000, link:'https://shopee.co.id/search?keyword=Juken%205%20Dualband%20Beat%20FI', note:'Performa stabil, wajib mapping bener.', img:'' },
  { id:crypto.randomUUID(), category:'Knalpot', name:'Knalpot R9 H2', price:850000, link:'https://shopee.co.id/search?keyword=Knalpot%20R9%20Beat%20FI', note:'Look racing, cek suara & aturan harian.', img:'' },
  { id:crypto.randomUUID(), category:'Velg', name:'Velg RCB SP522', price:1250000, link:'https://shopee.co.id/search?keyword=Velg%20RCB%20Beat%20FI', note:'Cocok clean daily / thai look.', img:'' },
  { id:crypto.randomUUID(), category:'Stop Lamp', name:'Stop Lamp JPA V3', price:175000, link:'https://shopee.co.id/search?keyword=Stop%20lamp%20JPA%20Beat%20FI', note:'Tampilan belakang lebih modern.', img:'' },
  { id:crypto.randomUUID(), category:'Spion', name:'Spion CNC Mini', price:85000, link:'https://shopee.co.id/search?keyword=spion%20cnc%20beat%20fi', note:'Jangan terlalu kecil buat harian.', img:'' },
  { id:crypto.randomUUID(), category:'Jok', name:'Jok Custom Clean', price:280000, link:'https://shopee.co.id/search?keyword=jok%20custom%20beat%20fi', note:'Bikin look lebih rapi.', img:'' },
  { id:crypto.randomUUID(), category:'Sticker', name:'Striping Custom BMW M3 GTR', price:165000, link:'https://shopee.co.id/search?keyword=sticker%20custom%20beat%20fi%20bmw%20m3%20gtr', note:'Konsep race car / clean blue.', img:'' }
];
const defaultState = {
  tab:'home', theme:'dark', routeMode:'start', collectionView:'dashboard', collectionCategory:null,
  bike:{ name:'Honda Beat FI 2014', plate:'Plat Z 2002 WIE' },
  virtualKm:0, fuel:2, fuelEfficiency:55, tank:4.2,
  daily:{}, bestStreak:0,
  services:[
    { id:'oil', name:'Oli Mesin', intervalKm:2000, intervalDays:60, lastKm:0, lastDate:todayKey(), note:'Masih aman dipantau.', icon:'oil' },
    { id:'gear', name:'Oli Gardan', intervalKm:8000, intervalDays:180, lastKm:0, lastDate:todayKey(), note:'Biar area gardan matic aman.', icon:'gear' },
    { id:'plug', name:'Busi', intervalKm:8000, intervalDays:180, lastKm:0, lastDate:todayKey(), note:'Cek kalau susah starter / brebet.', icon:'plug' },
    { id:'cvt', name:'CVT', intervalKm:8000, intervalDays:180, lastKm:0, lastDate:todayKey(), note:'Cek kalau tarikan berat/getar.', icon:'cvt' }
  ],
  fuelHistory:[
    { id:crypto.randomUUID(), type:'Pertalite', liter:1, cost:10000, date:todayKey(), note:'awal data' },
    { id:crypto.randomUUID(), type:'Pertalite', liter:1, cost:10000, date:todayKey(), note:'awal data' }
  ],
  fuelEvents:[{date:'8 Mei',value:0},{date:'9 Mei',value:1},{date:'10 Mei',value:1.8},{date:'11 Mei',value:1.3},{date:'12 Mei',value:2}],
  budget:250000,
  transactions:[
    { id:crypto.randomUUID(), category:'Fuel', title:'Isi Bensin', desc:'Pertalite 2L', amount:20000, date:'Hari ini' }
  ],
  products: defaultProducts,
  styleNotes:[
    { id:crypto.randomUUID(), style:'Thai Look', title:'Ban donat + R14', note:'Velg kecil, ban tebal, body clean.' },
    { id:crypto.randomUUID(), style:'Racing Daily', title:'Stop lamp + knalpot', note:'Tetap aman harian, jangan terlalu berisik.' },
    { id:crypto.randomUUID(), style:'Simple Clean', title:'Striping minimal', note:'Utamain warna biru/abu gelap.' }
  ],
  lastRoute:{ distanceKm:1.9, fuelL:0.09, cost:900, source:'OSRM road route', points:2 },
  chat:[
    {from:'bot', text:'Hai! Ada yang bisa Kang Rusdi bantu terkait motor BeAT FI 2014 kamu?'},
    {from:'user', text:'Motor saya susah di starter pagi hari, apa yang harus dicek dulu?'},
    {from:'bot', text:'Bisa jadi aki lemah atau busi mulai aus. Coba cek tegangan aki dan kondisi busi terlebih dahulu ya.'}
  ]
};
let state = loadState();
function loadState(){
  try { return { ...structuredClone(defaultState), ...(JSON.parse(localStorage.getItem('ngrNeoV2')) || {}) }; }
  catch { return structuredClone(defaultState); }
}
function save(){ localStorage.setItem('ngrNeoV2', JSON.stringify(state)); }
function toast(msg){ const t=$('#toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove('show'),1800); }
function setTheme(){ document.body.dataset.theme=state.theme; document.documentElement.dataset.theme=state.theme; }
function pct(n,max){ return Math.max(0, Math.min(100, (Number(n)||0)/(Number(max)||1)*100)); }
function todayKm(){ return Number(state.daily[todayKey()]?.km || 0); }
function hasToday(){ return Boolean(state.daily[todayKey()]); }
function streak(){
  let s=0; let d=new Date();
  while(true){ const k=d.toISOString().slice(0,10); if(state.daily[k]){ s++; d.setDate(d.getDate()-1); } else break; }
  state.bestStreak=Math.max(state.bestStreak||0,s); return s;
}
function totalSpent(){ return state.transactions.reduce((a,t)=>a+Number(t.amount||0),0); }
function addTx(category,title,amount,desc=''){ state.transactions.unshift({id:crypto.randomUUID(),category,title,amount:Number(amount)||0,desc,date:'Hari ini'}); save(); }
function addFuel(type,liter,cost){
  liter=Number(liter)||0; cost=Number(cost)||0;
  state.fuel=Math.min(state.tank, Math.max(0, Number(state.fuel||0)+liter));
  state.fuelHistory.unshift({id:crypto.randomUUID(), type, liter, cost, date:todayKey(), note:'fuel masuk'});
  state.fuelEvents.push({date:new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short'}),value:state.fuel});
  addTx('Fuel', `Isi ${type}`, cost, `${liter} L`);
  save(); render(); toast(`Fuel masuk ${liter.toFixed(1)} L`);
}
function addDailyKm(value, source='manual'){
  const v=Number(value)||0; const k=todayKey(); const old=Number(state.daily[k]?.km||0);
  state.daily[k]={ km: old+v, time: nowLabel(), source };
  state.virtualKm=Number(state.virtualKm||0)+v;
  const used=v/(Number(state.fuelEfficiency)||55);
  state.fuel=Math.max(0, Number(state.fuel||0)-used);
  state.fuelEvents.push({date:new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short'}),value:state.fuel});
  save(); render(); toast(v===0?'0 km dicatat, streak aman':`+${v.toFixed(1)} km masuk`);
}
function serviceHealth(item){
  const kmUsed=Math.max(0, Number(state.virtualKm)-Number(item.lastKm||0));
  const kmLeft=Math.max(0, Number(item.intervalKm)-kmUsed);
  const days=(Date.now()-new Date(item.lastDate).getTime())/(1000*60*60*24);
  const dayLeft=Math.max(0, Number(item.intervalDays)-days);
  const p=Math.min(kmLeft/item.intervalKm, dayLeft/item.intervalDays)*100;
  return { kmLeft, dayLeft, p:Math.max(0,Math.min(100,p)) };
}
function priority(){ return [...state.services].sort((a,b)=>serviceHealth(a).p-serviceHealth(b).p)[0]; }
function render(){ setTheme(); const app=$('#app'); app.innerHTML = layout(); requestAnimationFrame(afterRender); }
function layout(){ return `${statusBar()}${topBar()}<main class="screen">${screens[state.tab] ? screens[state.tab]() : screens.home()}</main>${nav()}${sheetMarkup()}`; }
function statusBar(){return `<div class="statusbar"><span>9:41</span><div class="sys-icons"><span class="signal"><i></i><i></i><i></i><i></i></span><span class="wifi"></span><span class="battery"></span></div></div>`}
function topBar(){return `<header class="topbar"><div class="brand"><div class="logo">${logoSvg()}</div><div><h1>NGR Neo</h1><p>Liquid Garage OS · Honda Beat FI 2014</p></div></div><button class="icon-btn" data-action="settings">${svg('gear')}</button></header>`}
function nav(){ const tabs=[['home','Home','home'],['maps','Maps','maps'],['fuel','Fuel','fuel'],['money','Money','money'],['assist','Assist','assist']]; return `<nav class="nav">${tabs.map(t=>`<button class="${state.tab===t[0]?'active':''}" data-tab="${t[0]}">${svg(t[2])}<span>${t[1]}</span></button>`).join('')}</nav>` }

const screens = {
  home(){
    const item=priority(); const h=serviceHealth(item); const s=streak(); const fuelRange=state.fuel*state.fuelEfficiency;
    return `<section class="card hero">
      <div class="hero-grid">
        <div class="bike-title"><small>Honda</small><h2>Beat FI 2014 <span class="dot" style="display:inline-block;vertical-align:middle"></span></h2><span class="plate">${state.bike.plate}<span class="dot"></span></span><div class="check-line"><span class="check-dot">✓</span><span>Semua komponen<br>dalam kondisi baik</span></div></div>
        <div class="scooter">${scooterSvg()}</div>
        <div class="health-ring"><small class="muted">KONDISI MOTOR</small><div class="ring"><div class="ring-content"><strong>${Math.round(h.p)}%</strong><span>${h.p>65?'SEHAT':h.p>35?'PANTAU':'URGENT'}</span></div></div></div>
        <div class="hero-stats">
          ${stat('route', km(state.virtualKm),'km','Virtual KM')}
          ${stat('fuel', Number(state.fuel).toFixed(2),'L','Fuel')}
          ${stat('money', km(fuelRange),'km','Range')}
          ${stat('shield', Math.round(h.p)+'%','','Health')}
        </div>
      </div>
    </section>
    <section class="card daily">
      <div class="daily-head"><div><h2>Hari Ini</h2><div class="muted">Catat km perjalanan Anda</div><div class="big-km">${km(todayKm())}<span>km</span></div></div><div class="streak-badge"><div>🔥</div><b>${s}</b><small>streak</small></div></div>
      <div class="daily-actions"><button class="btn" data-km="0">0 km</button><button class="btn" data-km="5">+5</button><button class="btn" data-km="10">+10</button><button class="btn" data-action="customKm">Custom</button><button class="btn primary" data-tab="maps">${svg('maps')} Maps</button></div>
    </section>
    <section class="card weekly"><div style="display:flex;justify-content:space-between"><b>Streak Mingguan</b><button class="accent" data-action="calendar">Lihat Kalender ›</button></div><div class="days">${weekDays().map(d=>`<div class="day ${d.done?'done':''}"><span>${d.label}</span><small>${d.sub}</small></div>`).join('')}</div></section>
    <div class="quick-grid">${quick('KM','Catat KM','route','blue','customKm')}${quick('Fuel','Catat BBM','fuel','green','fuelSheet')}${quick('Service','Cek Komponen','wrench','orange','serviceSheet')}${quick('Money','Pengeluaran','money','purple','expenseSheet')}</div>
    <div class="section-title"><h2>Prioritas</h2><button class="accent" data-action="serviceSheet">Lihat Semua ›</button></div>
    <section class="card priority-card"><div class="part-img">${svg(item.icon)}</div><div><h3>${item.name}<span class="badge">Prioritas ${h.p<45?'Tinggi':'Aman'}</span></h3><p>Sisa <span class="green">${Math.round(h.kmLeft)} km / ${Math.round(h.dayLeft)} hari</span></p><p>Est. ${new Date(Date.now()+h.dayLeft*864e5).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</p></div><div class="mini-ring">${Math.round(h.p)}%</div><span class="muted">›</span></section>
    <section class="card rusdi-card"><div class="avatar">${avatarSvg()}</div><div><h3>Kang Rusdi <span class="badge" style="color:#7dbbff;background:rgba(47,140,255,.12)">Asisten Anda</span></h3><p>Siap bantu scan motor, baca kode FI, sampai panduan darurat.</p></div><button class="btn" data-tab="assist">${svg('chat')} Mulai Chat</button></section>`;
  },
  maps(){
    const r=state.lastRoute;
    return `<section class="card map-card"><div id="map" class="map-canvas"></div><div class="map-chip">${svg('route')} ${km(r.distanceKm)} km · ${r.source}</div><button class="map-reset" data-action="resetMap">${svg('maps')} Reset</button></section>
    <section class="card route-controls">
      <div class="route-row"><button class="route-point ${state.routeMode==='start'?'active':''}" data-route-mode="start"><b><span class="letter">A</span>Start</b><small class="muted">Tap map buat titik awal</small></button><button class="route-point ${state.routeMode==='dest'?'active':''}" data-route-mode="dest"><b><span class="letter">B</span>Tujuan</b><small class="muted">Tap map buat tujuan</small></button><button class="route-point ${state.routeMode==='stop'?'active':''}" data-route-mode="stop"><b><span class="letter stop">■</span>Stop</b><small class="muted">Opsional titik berhenti</small></button></div>
      <div class="route-stats"><div class="info-tile">${svg('maps')}<b>${r.points||2}</b><small>Titik Lewat</small></div><div class="info-tile">${svg('route')}<b>${km(r.distanceKm)} km</b><small>Jarak Jalan</small></div><div class="info-tile">${svg('fuel')}<b>${(r.fuelL||0).toFixed(2)} L</b><small>Est. BBM</small></div></div>
      <div class="action-row"><button class="btn primary" data-action="calcRoute">${svg('link')} Hitung Jalan</button><button class="btn" data-action="addRouteKm">${svg('plus')} Tambah KM</button><button class="btn" data-action="saveRoute">${svg('save')} Simpan</button></div>
    </section>
    <section class="card route-summary"><div class="round-icon">${svg('route')}</div><div><b>Rute terbaik dari Start ke Tujuan</b><p class="muted">${km(r.distanceKm)} km · Est. ${(r.fuelL||0).toFixed(2)} L BBM</p><h3 class="accent" style="margin:.2em 0 0">± ${money(r.cost||0)}</h3></div></section>`;
  },
  fuel(){
    const range=state.fuel*state.fuelEfficiency; const fill=pct(state.fuel,state.tank);
    return `<section class="card fuel-hero"><h2>Sisa Bensin</h2><div class="fuel-value">${Number(state.fuel).toFixed(2)}<span> L</span></div><div class="soft"><b>${km(range)}</b> km range</div><span class="pill" style="position:absolute;right:20px;top:26px">💧 ${state.fuelEfficiency} km/L</span><div class="bike-small">${scooterSvg()}</div><div class="fuel-progress"><span style="width:${fill}%"></span></div><div class="fuel-scale"><span>E</span><span>${Math.round(fill)}% · ${fill>60?'Aman':fill>25?'Sedang':'Tipis'}</span><span>F</span></div></section>
    <div class="fill-grid"><button class="fill-btn" data-fuel="Pertalite,1,10000">${svg('fuel')}<span><b>Pertalite 1L</b><br><small>1 Liter</small></span></button><button class="fill-btn" data-fuel="Pertalite,2,20000">${svg('fuel')}<span><b>Pertalite 2L</b><br><small>2 Liter</small></span></button><button class="fill-btn" data-fuel="Pertamax,3,39000">${svg('fuel')}<span><b>Pertamax</b><br><small>3 Liter</small></span></button></div>
    <section class="card chart-card"><div class="chart-head"><div><h2 style="margin:0">Fuel Balance</h2><small class="muted">Liter (L)</small></div><button class="chip">7 Hari Terakhir⌄</button></div>${fuelChart()}</section>
    <div class="section-title"><h2>History</h2><small>${state.fuelHistory.length}</small></div><section class="card history-card">${state.fuelHistory.slice(0,5).map(f=>`<div class="list-row"><span class="round-icon" style="width:44px;height:44px;color:var(--green)">${svg('fuel')}</span><div><h3>${Number(f.liter).toFixed(1)} L</h3><p>${f.date} · ${f.note||''}</p></div><div style="text-align:right"><b>${money(f.cost)}</b><p>Pertalite</p></div><span>›</span></div>`).join('') || '<div class="empty">Belum ada isi BBM.</div>'}</section>`;
  },
  money(){
    const spent=totalSpent(); const p=pct(spent,state.budget); const by=categoryTotals();
    return `<section class="card money-hero"><div style="display:flex;justify-content:space-between;align-items:start"><div><h2>Budget Bulanan</h2><div class="amount">${money(spent)}</div><div class="muted">Total terpakai bulan ini</div></div><div style="text-align:right"><span class="pill">Januari 2026</span><br><br><span class="pill">Budget ${money(state.budget)}</span></div></div><div class="progress"><span style="width:${p}%"></span></div><div style="display:flex;justify-content:space-between"><span>Sisa budget <b class="green">${money(Math.max(0,state.budget-spent))}</b></span><b>${Math.round(p)}%</b></div></section>
    <div class="money-actions"><button class="btn" data-action="expenseSheet">${svg('plus')} Tambah Expense</button><button class="btn" data-action="saveMoney">🐷 Celengan +10k</button><button class="btn green" data-action="addBudget">+25k</button></div>
    <section class="card breakdown"><div style="display:flex;justify-content:space-between"><h2 style="margin:0">Breakdown Pengeluaran</h2><button class="accent">Lihat Detail ›</button></div>${Object.entries(by).map(([k,v])=>barRow(k,v,spent)).join('')}</section>
    <div class="section-title"><h2>Transaksi Terbaru</h2><small>${state.transactions.length}</small></div><section class="card history-card">${state.transactions.slice(0,5).map(t=>`<div class="list-row"><span class="round-icon" style="width:44px;height:44px;color:${catColor(t.category)}">${svg(catIcon(t.category))}</span><div><h3>${t.title}</h3><p>${t.desc||t.category}</p></div><div style="text-align:right"><b>-${money(t.amount)}</b><p>${t.date}</p></div><span>›</span></div>`).join('') || '<div class="empty">Belum ada transaksi.</div>'}</section>
    <section class="card collection-cta"><div class="mini-bike">${scooterSvg()}</div><div><h3>Collection</h3><p class="muted">Koleksi link part, style modif, dan pengetahuan motor.</p><button class="btn full" data-action="openCollection">Jelajahi Collection ›</button></div></section>`;
  },
  collection(){
    if(state.collectionCategory) return collectionDetail(state.collectionCategory);
    const cats=['Style Modif','ECU','Stop Lamp','Spion','Knalpot','Velg','Jok','Sticker'];
    return `<section class="card collection-page"><h2 style="font-size:30px;margin:0">Collection</h2><p class="muted">konsep & parts</p><div class="seg"><button class="active">${svg('wrench')} Parts</button><button>${svg('spark')} Style</button></div><div class="cat-grid">${cats.map(c=>catTile(c)).join('')}</div><button class="btn full" style="margin-top:12px" data-action="addProduct">${svg('plus')} Tambah link produk</button></section>
    <div class="section-title"><h2>Pilihan Produk</h2><button class="accent">Lihat Semua ›</button></div><section class="card collection-page"><div class="product-grid">${state.products.slice(0,4).map(productCard).join('')}</div></section>
    <section class="card collection-cta"><div class="mini-bike">${scooterSvg()}</div><div><h3>Butuh inspirasi?</h3><p class="muted">Lihat ratusan konsep modifikasi dari catatan NGR Neo.</p><button class="btn full" data-action="styleNotes">Jelajahi Konsep ›</button></div></section>`;
  },
  assist(){
    return `<section class="card assist-chat"><div class="chat-head"><div class="avatar" style="width:64px;height:64px;border-radius:22px">${avatarSvg()}</div><div><h2 style="margin:0">Kang Rusdi</h2><div class="accent">Asisten Anda</div></div><span class="pill online">● Online</span></div>${state.chat.slice(-4).map(m=>`<div class="bubble ${m.from==='user'?'user':''}">${escapeHtml(m.text)}<br><small class="muted">09:41</small></div>`).join('')}<div class="input-row"><input id="chatInput" class="input" placeholder="Tulis pesan..."/><button class="btn primary" data-action="sendChat">${svg('route')} Kirim</button></div></section>
    <div class="section-title"><h2>Emergency & Guide</h2><small>darurat</small></div><section class="card collection-page"><div class="guide-grid">${guide('Motor mati di jalan','warning')}${guide('Cek busi lemah/mati','plug')}${guide('Ganti oli mesin','oil')}${guide('Ganti oli gardan','gear')}${guide('CVT bunyi/getar','cvt')}${guide('FI Code Helper','ecu')}</div></section><section class="card collection-page"><h3>Bantuan Cepat</h3><div class="chip-row"><button class="chip" data-guide="Kode FI umum">Kode FI umum</button><button class="chip" data-guide="Cara reset ECU">Cara reset ECU</button><button class="chip" data-guide="Aki & kelistrikan">Aki & kelistrikan</button><button class="chip" data-guide="Mesin brebet">Mesin brebet</button></div></section>`;
  }
};
function stat(ic,a,b,c){ return `<div class="stat"><span class="ico">${svg(ic)}</span><span><b>${a}</b><small>${b}<br>${c}</small></span></div>` }
function quick(t,s,ic,c,act){return `<button class="quick" data-action="${act}"><span class="qico ${c}">${svg(ic)}</span><span><b>${t}</b><small>${s}</small></span></button>`}
function weekDays(){const labels=['M','S','S','R','K','J','S']; const subs=['Hari ini','Sel','Rab','Kam','Jum','Sab','Min']; return labels.map((l,i)=>({label:l,sub:subs[i],done:i===0&&hasToday()}));}
function categoryTotals(){ const base={Fuel:0,Service:0,Modif:0,Tools:0,Other:0}; state.transactions.forEach(t=>{base[t.category] = (base[t.category]||0)+Number(t.amount||0)}); return base; }
function catColor(c){return {Fuel:'var(--blue)',Service:'var(--green)',Modif:'var(--purple)',Tools:'var(--orange)',Other:'var(--muted)'}[c]||'var(--blue)'}
function catIcon(c){return {Fuel:'fuel',Service:'wrench',Modif:'money',Tools:'gear',Other:'money'}[c]||'money'}
function barRow(k,v,total){const p=total?pct(v,total):0; return `<div class="bar-row"><span>${svg(catIcon(k))} ${k}</span><div class="bar"><span style="width:${p}%;background:${catColor(k)}"></span></div><b>${Math.round(p)}%</b><span>${money(v)}</span></div>`}
function fuelChart(){ const vals=state.fuelEvents.slice(-5); const max=Math.max(4, state.tank, ...vals.map(v=>v.value)); const W=360,H=170,pad=28; const pts=vals.map((v,i)=>[pad+i*((W-pad*2)/(Math.max(1,vals.length-1))), H-pad-(v.value/max)*(H-pad*2), v]); const d=pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' '); const area=`M${pad} ${H-pad} ${d.slice(1)} L${W-pad} ${H-pad} Z`; const yLabels=[0,1,2,3,4].map(y=>`<text x="2" y="${H-pad-(y/max)*(H-pad*2)+4}" class="mutedText">${y}L</text>`).join(''); const grid=[0,1,2,3,4].map(y=>`<line x1="28" y1="${H-pad-(y/max)*(H-pad*2)}" x2="${W-pad}" y2="${H-pad-(y/max)*(H-pad*2)}" class="grid"/>`).join(''); return `<svg class="fuel-chart" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#2f8cff" stop-opacity=".45"/><stop offset="1" stop-color="#2f8cff" stop-opacity="0"/></linearGradient></defs><style>.grid{stroke:rgba(255,255,255,.14);stroke-dasharray:4 6}.mutedText{fill:rgba(190,205,228,.75);font:10px sans-serif}.dateText{fill:rgba(190,205,228,.75);font:10px sans-serif}.line{fill:none;stroke:#2f8cff;stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round}.dot{fill:#061424;stroke:#8ac3ff;stroke-width:3}.area{fill:url(#chartGrad)}</style>${grid}${yLabels}<path d="${area}" class="area"/><path d="${d}" class="line"/>${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" class="dot"/><text x="${p[0]-10}" y="${p[1]-12}" class="dateText">${Number(p[2].value).toFixed(1)} L</text><text x="${p[0]-12}" y="${H-8}" class="dateText">${p[2].date}</text>`).join('')}</svg>` }
function catTile(c){ const count= c==='Style Modif'? state.styleNotes.length : state.products.filter(p=>p.category===c).length; return `<button class="cat-tile" data-cat="${c}"><div class="thumb">${partIcon(c)}</div><h3>${c}</h3><p>${count} ${c==='Style Modif'?'konsep':'item'}</p><span class="arrow">›</span></button>` }
function productCard(p){return `<div class="product-card"><div class="photo">${p.img?`<img src="${escapeAttr(p.img)}" alt="" style="max-width:100%;max-height:100%;border-radius:14px">`:partIcon(p.category)}</div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.category)}</p><div class="price">${money(p.price)}</div><a class="btn full" href="${escapeAttr(p.link||'#')}" target="_blank" rel="noopener">Buka Link ${svg('external')}</a></div>`}
function collectionDetail(c){ const items=state.products.filter(p=>p.category===c); return `<section class="card collection-page"><button class="chip" data-action="backCollection">‹ Kembali</button><h2 style="font-size:30px;margin:14px 0 4px">${c}</h2><p class="muted">${items.length} item · link produk & catatan</p><button class="btn primary full" data-action="addProduct" data-prefcat="${c}">${svg('plus')} Tambah ${c}</button></section><section class="card collection-page" style="margin-top:14px"><div class="product-grid">${items.map(productCard).join('') || '<div class="empty">Belum ada item di kategori ini.</div>'}</div></section>`}
function guide(title,ic){ return `<button class="guide" data-guide="${title}"><span class="gico">${svg(ic)}</span><b>${title}</b><span class="muted" style="margin-left:auto">›</span></button>` }
function escapeHtml(str){ return String(str??'').replace(/[&<>"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
function escapeAttr(str){ return escapeHtml(str).replace(/'/g,'&#39;'); }

let currentSheet = null;
function sheetMarkup(){ if(!currentSheet) return ''; return `<div class="sheet-backdrop" data-action="closeSheet"><div class="sheet" onclick="event.stopPropagation()">${currentSheet}</div></div>` }
function openSheet(html){ currentSheet=html; render(); }
function closeSheet(){ currentSheet=null; render(); }
function settingsSheet(){ openSheet(`<h2>Settings</h2><div class="form"><div class="field"><label>Theme</label><select id="themeSel"><option value="dark">Dark Liquid</option><option value="light">Light Glass</option></select></div><button class="btn primary" data-action="saveSettings">Simpan</button><button class="btn" data-action="exportData">Export JSON</button><label class="btn"><input id="importFile" type="file" accept="application/json" hidden>Import JSON</label><button class="btn danger" data-action="resetData">Reset data</button></div>`); setTimeout(()=>{ const s=$('#themeSel'); if(s) s.value=state.theme; const f=$('#importFile'); if(f) f.addEventListener('change', importData); },0); }
function kmSheet(){ openSheet(`<h2>Catat KM</h2><div class="form"><div class="field"><label>KM hari ini</label><input id="kmInput" type="number" min="0" step="0.1" placeholder="contoh 12.5"></div><button class="btn primary" data-action="submitKm">Simpan KM</button></div>`); }
function fuelSheet(){ openSheet(`<h2>Isi BBM</h2><div class="form"><div class="field"><label>Jenis</label><select id="fuelType"><option>Pertalite</option><option>Pertamax</option><option>Shell Super</option></select></div><div class="field"><label>Liter</label><input id="fuelLiter" type="number" step="0.1" placeholder="2"></div><div class="field"><label>Biaya</label><input id="fuelCost" type="number" placeholder="20000"></div><button class="btn primary" data-action="submitFuel">Simpan Fuel</button></div>`); }
function expenseSheet(){ openSheet(`<h2>Tambah Expense</h2><div class="form"><div class="field"><label>Judul</label><input id="txTitle" placeholder="contoh Oli Mesin"></div><div class="field"><label>Kategori</label><select id="txCat"><option>Fuel</option><option>Service</option><option>Modif</option><option>Tools</option><option>Other</option></select></div><div class="field"><label>Nominal</label><input id="txAmount" type="number" placeholder="65000"></div><div class="field"><label>Catatan</label><input id="txDesc" placeholder="Federal Matic 10W-30"></div><button class="btn primary" data-action="submitExpense">Simpan Expense</button></div>`); }
function productSheet(pref=''){ const cats=['ECU','Stop Lamp','Spion','Knalpot','Velg','Jok','Sticker','Shock','Ban','Body Kit','Style Modif']; openSheet(`<h2>Tambah Collection</h2><div class="form"><div class="field"><label>Nama produk/ide</label><input id="pName" placeholder="contoh Stop Lamp JPA V3"></div><div class="field"><label>Kategori</label><select id="pCat">${cats.map(c=>`<option ${c===pref?'selected':''}>${c}</option>`).join('')}</select></div><div class="field"><label>Harga target</label><input id="pPrice" type="number" placeholder="175000"></div><div class="field"><label>Link produk</label><input id="pLink" placeholder="https://..."></div><div class="field"><label>Foto URL opsional</label><input id="pImg" placeholder="https://..."></div><div class="field"><label>Catatan pengetahuan</label><textarea id="pNote" placeholder="Cocok buat daily clean, cek kualitas, dll"></textarea></div><button class="btn primary" data-action="submitProduct">Simpan Collection</button></div>`); }
function serviceSheet(){ const rows=state.services.map(s=>{ const h=serviceHealth(s); return `<div class="list-row"><span class="round-icon" style="width:44px;height:44px;color:var(--green)">${svg(s.icon)}</span><div><h3>${s.name}</h3><p>Sisa ${Math.round(h.kmLeft)} km / ${Math.round(h.dayLeft)} hari</p></div><b>${Math.round(h.p)}%</b><button class="btn" data-reset-service="${s.id}">Reset</button></div>`}).join(''); openSheet(`<h2>Service Components</h2><section class="history-card">${rows}</section>`); }
function guideSheet(title){ const content={
  'Motor mati di jalan':'1. Pinggirkan motor dan matikan kontak. 2. Cek bensin, aki, sekring, dan kabel busi. 3. Kalau starter ngeden, curiga aki. Kalau engkol ada tapi tidak hidup, cek busi/pengapian/fuel pump.',
  'Cek busi lemah/mati':'Gejala: susah starter, brebet, langsam tidak stabil, mati mendadak. Cek kepala busi, kabel, warna elektroda, dan percikan. Ganti kalau aus/hitam basah/parah.',
  'Ganti oli mesin':'Panaskan sebentar, buka baut pembuangan, tunggu habis, tutup lagi, isi oli sesuai takaran. Jangan kelamaan telat oli karena mesin matic kecil cepat kasar.',
  'Ganti oli gardan':'Buka baut drain gardan, buang oli lama, tutup drain, isi oli gardan dari lubang atas. Interval aman sekitar 6-8 ribu km atau 6 bulan.',
  'CVT bunyi/getar':'Cek roller, v-belt, kampas ganda, mangkok, dan pulley. Gejala getar awal sering dari kampas/mangkok kotor atau roller peyang.',
  'FI Code Helper':'Hitung kedipan MIL: kedipan panjang = 10, pendek = 1. Total kode dipakai sebagai diagnosa awal sensor/injeksi, tetap cocokkan manual/bengkel.',
  'Kode FI umum':'Kode MIL Honda dihitung dari lampu indikator. Panjang 10, pendek 1. Catat polanya sebelum reset.',
  'Cara reset ECU':'Reset ECU tidak selalu menyelesaikan masalah. Pastikan penyebab seperti sensor, aki, konektor, atau busi sudah dicek.',
  'Aki & kelistrikan':'Aki lemah bikin starter berat, lampu redup, dan FI bisa error. Cek terminal aki, sekring, massa, dan tegangan.',
  'Mesin brebet':'Penyebab umum: busi, filter udara, injektor/fuel pump, bensin kotor, atau CVT berat. Cek dari paling murah dulu.'
  }[title] || 'Panduan belum tersedia.'; openSheet(`<h2>${title}</h2><p style="line-height:1.6;color:var(--soft)">${content}</p><button class="btn primary full" data-action="closeSheet">Paham</button>`); }
function calendarSheet(){ const days=[]; for(let i=13;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const k=d.toISOString().slice(0,10); days.push(`<div class="day ${state.daily[k]?'done':''}"><span>${d.getDate()}</span><small>${state.daily[k]?km(state.daily[k].km)+' km':'-'}</small></div>`); } openSheet(`<h2>Kalender Streak</h2><div class="days">${days.join('')}</div>`); }
function exportData(){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ngr-neo-backup.json'; a.click(); URL.revokeObjectURL(a.href); toast('Backup JSON dibuat'); }
function importData(e){ const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=()=>{ try{ state={...state,...JSON.parse(r.result)}; save(); closeSheet(); toast('Data berhasil diimport'); }catch{ toast('File JSON tidak valid'); } }; r.readAsText(file); }

let map, routeLayer, markerA, markerB, markerStop;
let coords = { A:[-7.426,112.548], B:[-7.435,112.565], S:null };
function afterRender(){ initEvents(); if(state.tab==='maps') setTimeout(initMap,60); }
function initEvents(){
  $$('[data-tab]').forEach(el=>el.onclick=()=>{ state.tab=el.dataset.tab; if(state.tab!=='collection') { state.collectionCategory=null; } save(); render(); });
  $$('[data-action]').forEach(el=>el.onclick=(ev)=>{ const act=el.dataset.action; if(act==='closeSheet') closeSheet(); else actions[act]?.(el,ev); });
  $$('[data-km]').forEach(el=>el.onclick=()=>addDailyKm(Number(el.dataset.km)));
  $$('[data-fuel]').forEach(el=>el.onclick=()=>{ const [type,l,c]=el.dataset.fuel.split(','); addFuel(type,Number(l),Number(c)); });
  $$('[data-route-mode]').forEach(el=>el.onclick=()=>{ state.routeMode=el.dataset.routeMode; save(); render(); });
  $$('[data-cat]').forEach(el=>el.onclick=()=>{ state.collectionCategory=el.dataset.cat; save(); render(); });
  $$('[data-guide]').forEach(el=>el.onclick=()=>guideSheet(el.dataset.guide));
  $$('[data-reset-service]').forEach(el=>el.onclick=()=>{ const item=state.services.find(s=>s.id===el.dataset.resetService); if(item){ item.lastKm=state.virtualKm; item.lastDate=todayKey(); save(); closeSheet(); toast(`${item.name} direset`); } });
}
const actions={
  settings(){ settingsSheet(); }, customKm(){ kmSheet(); }, fuelSheet(){ fuelSheet(); }, expenseSheet(){ expenseSheet(); }, serviceSheet(){ serviceSheet(); }, calendar(){ calendarSheet(); },
  saveSettings(){ state.theme=$('#themeSel')?.value||'dark'; save(); closeSheet(); toast('Tema disimpan'); },
  submitKm(){ addDailyKm(Number($('#kmInput')?.value||0)); closeSheet(); },
  submitFuel(){ addFuel($('#fuelType')?.value||'Pertalite', Number($('#fuelLiter')?.value||0), Number($('#fuelCost')?.value||0)); closeSheet(); },
  submitExpense(){ addTx($('#txCat')?.value||'Other', $('#txTitle')?.value||'Expense', Number($('#txAmount')?.value||0), $('#txDesc')?.value||''); closeSheet(); render(); toast('Expense masuk'); },
  saveMoney(){ state.budget += 10000; save(); render(); toast('Celengan +10k'); }, addBudget(){ state.budget += 25000; save(); render(); toast('Budget +25k'); },
  openCollection(){ state.tab='collection'; state.collectionCategory=null; save(); render(); }, backCollection(){ state.collectionCategory=null; save(); render(); }, addProduct(el){ productSheet(el.dataset.prefcat||state.collectionCategory||''); },
  submitProduct(){ const p={id:crypto.randomUUID(), name:$('#pName')?.value||'Produk baru', category:$('#pCat')?.value||'Other', price:Number($('#pPrice')?.value||0), link:$('#pLink')?.value||'', img:$('#pImg')?.value||'', note:$('#pNote')?.value||''}; state.products.unshift(p); if(p.category==='Style Modif') state.styleNotes.unshift({id:p.id,style:p.name,title:p.name,note:p.note}); save(); closeSheet(); render(); toast('Collection ditambah'); },
  styleNotes(){ state.collectionCategory='Style Modif'; save(); render(); }, exportData(){ exportData(); }, resetData(){ if(confirm('Reset semua data NGR Neo?')){ localStorage.removeItem('ngrNeoV2'); state=structuredClone(defaultState); closeSheet(); render(); } },
  resetMap(){ coords={A:[-7.426,112.548],B:[-7.435,112.565],S:null}; state.lastRoute={distanceKm:1.9,fuelL:.09,cost:900,source:'OSRM road route',points:2}; save(); render(); }, calcRoute(){ calculateRoute(); }, addRouteKm(){ addDailyKm(state.lastRoute.distanceKm,'maps'); }, saveRoute(){ toast('Rute disimpan di history'); }, sendChat(){ sendChat(); }
};
function initMap(){
  if(typeof L==='undefined'){ $('#map').innerHTML='<div class="empty" style="padding-top:140px">Map butuh internet buat load Leaflet.</div>'; return; }
  if(map){ map.remove(); map=null; }
  const mapEl=$('#map'); if(!mapEl) return;
  map=L.map(mapEl,{zoomControl:true,attributionControl:false,preferCanvas:true}).setView([-7.431,112.556],14);
  const dark='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const light='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  L.tileLayer(state.theme==='light'?light:dark,{maxZoom:19}).addTo(map);
  markerA=L.marker(coords.A,{icon:markerIcon('A')}).addTo(map);
  markerB=L.marker(coords.B,{icon:markerIcon('B')}).addTo(map);
  if(coords.S) markerStop=L.marker(coords.S,{icon:markerIcon('S')}).addTo(map);
  drawRoute([[coords.A[1],coords.A[0]],[coords.B[1],coords.B[0]]],false);
  map.on('click',e=>{ const ll=[e.latlng.lat,e.latlng.lng]; if(state.routeMode==='dest'){coords.B=ll;} else if(state.routeMode==='stop'){coords.S=ll;} else {coords.A=ll;} render(); });
}
function markerIcon(txt){ return L.divIcon({className:'', html:`<div class="markerLabel"><span>${txt}</span></div>`, iconSize:[42,42], iconAnchor:[20,38]}); }
async function calculateRoute(){
  if(typeof L==='undefined'||!map) return toast('Map belum siap');
  try{
    const way=[coords.A, ...(coords.S?[coords.S]:[]), coords.B].map(p=>`${p[1]},${p[0]}`).join(';');
    const url=`https://router.project-osrm.org/route/v1/driving/${way}?overview=full&geometries=geojson&steps=false`;
    const data=await fetch(url).then(r=>r.json());
    if(!data.routes?.[0]) throw new Error('route kosong');
    const route=data.routes[0]; const d=route.distance/1000; const fuel=d/state.fuelEfficiency; const cost=fuel*10000;
    state.lastRoute={ distanceKm:d, fuelL:fuel, cost, source:'OSRM road route', points:route.geometry.coordinates.length };
    drawRoute(route.geometry.coordinates,true); save(); render(); toast('Rute ikut jalan dihitung');
  }catch(e){
    const d=dist(coords.A,coords.B); state.lastRoute={distanceKm:d,fuelL:d/state.fuelEfficiency,cost:d/state.fuelEfficiency*10000,source:'fallback garis lurus',points:2}; save(); render(); toast('Routing gagal, fallback garis lurus');
  }
}
function drawRoute(coordsLngLat, fit){
  if(!map) return; if(routeLayer) routeLayer.remove();
  const latlngs=coordsLngLat.map(c=>[c[1],c[0]]);
  routeLayer=L.polyline(latlngs,{color:'#1788ff',weight:6,opacity:.96,lineCap:'round',lineJoin:'round'}).addTo(map);
  if(fit||true) map.fitBounds(routeLayer.getBounds(),{padding:[45,45]});
}
function dist(a,b){ const R=6371; const dLat=(b[0]-a[0])*Math.PI/180; const dLon=(b[1]-a[1])*Math.PI/180; const lat1=a[0]*Math.PI/180; const lat2=b[0]*Math.PI/180; const x=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2; return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)); }
function sendChat(){ const input=$('#chatInput'); const text=input?.value?.trim(); if(!text) return; state.chat.push({from:'user',text}); const low=text.toLowerCase(); let reply='Siap. Input KM, fuel, service, atau gejala motor dulu biar Kang Rusdi bisa scan lebih tepat.'; if(low.includes('busi')) reply='Cek busi dari warna elektroda, percikan, dan kabelnya. Kalau susah starter/brebet, busi bisa jadi kandidat awal.'; if(low.includes('mogok')||low.includes('mati')) reply='Kalau motor mati di jalan: pinggirkan, cek bensin, aki, sekring, kabel busi, lalu dengarkan fuel pump saat kontak ON.'; if(low.includes('fi')||low.includes('kedip')) reply='Untuk kode FI/MIL: kedipan panjang dihitung 10, pendek dihitung 1. Catat polanya dulu sebelum reset.'; if(low.includes('boros')) reply='Cek tekanan ban, filter udara, busi, roller/CVT, dan gaya gas. Dari data sekarang fuel range kira-kira '+km(state.fuel*state.fuelEfficiency)+' km.'; state.chat.push({from:'bot',text:reply}); save(); render(); }

if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{})); }
setTheme(); render();
