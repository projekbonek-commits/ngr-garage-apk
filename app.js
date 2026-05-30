const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];

const STORAGE = 'ngr_neo_poco_v21';
const defaultState = {
  theme: 'dark',
  tab: 'home',
  moneyMode: 'budget',
  bike: { name: 'Honda Beat FI 2014', plate: 'Plat Z 2002 WIE' },
  km: 0,
  dailyKm: 0,
  streak: 0,
  fuel: 2,
  kmpl: 55,
  tank: 4.2,
  budget: 250000,
  spent: 20000,
  fuelLogs: [
    { liter: 2.3, date: '12 Mei 2025 · 08:15', price: 34500, fuel: 'Pertalite' },
    { liter: 3.0, date: '11 Mei 2025 · 17:42', price: 45000, fuel: 'Pertalite' },
    { liter: 2.0, date: '9 Mei 2025 · 07:20', price: 30000, fuel: 'Pertalite' },
  ],
  transactions: [
    { name: 'Isi Bensin', note: 'Pertamax · SPBU 34.123.01', amount: 20000, when: 'Hari ini', cat: 'Fuel' },
    { name: 'Oli Mesin', note: 'Federal Matic 10W-30', amount: 65000, when: 'Kemarin', cat: 'Service' },
    { name: 'Juken 5 Dualband', note: 'RCB Official Store', amount: 1650000, when: '2 hari lalu', cat: 'Modif' },
    { name: 'Knalpot Racing', note: 'TDR GP7', amount: 780000, when: '3 hari lalu', cat: 'Tools' },
  ],
  collection: [
    { cat: 'ECU', name: 'RCB ECU Juken 5', price: 1350000, link: 'https://shopee.co.id/search?keyword=rcb%20ecu%20juken%205%20beat%20fi', note: 'Plug & Play untuk Beat FI, tenaga lebih responsif.' },
    { cat: 'Knalpot', name: 'Knalpot R9 H2', price: 850000, link: 'https://shopee.co.id/search?keyword=knalpot%20r9%20beat%20fi', note: 'Daily racing look, cek db killer.' },
    { cat: 'Velg', name: 'Velg RCB SP522', price: 1250000, link: 'https://shopee.co.id/search?keyword=velg%20rcb%20beat%20ring%2014', note: 'Cocok konsep Thai/Daily clean.' },
    { cat: 'Stop Lamp', name: 'Stop Lamp JPA V3', price: 175000, link: 'https://shopee.co.id/search?keyword=stop%20lamp%20beat%20fi%202014', note: 'Running light, pastikan soket cocok.' },
  ],
  route: { km: 1.9, points: 12, fuel: 0.09, cost: 900 },
  chat: [
    { from: 'rusdi', text: 'Hai! Ada yang bisa Kang Rusdi bantu terkait motor BeAT FI 2014 kamu?' },
    { from: 'me', text: 'Motor saya susah di starter pagi hari, apa yang harus dicek dulu?' },
    { from: 'rusdi', text: 'Bisa jadi aki lemah atau busi mulai aus. Coba cek tegangan aki dan kondisi busi terlebih dahulu ya.' },
  ]
};
let state = loadState();
function loadState(){ try { return { ...structuredClone(defaultState), ...(JSON.parse(localStorage.getItem(STORAGE)) || {}) }; } catch { return structuredClone(defaultState); }}
function save(){ localStorage.setItem(STORAGE, JSON.stringify(state)); }
function rupiah(n){ return 'Rp' + Math.round(Number(n)||0).toLocaleString('id-ID'); }
function fmt(n, d=1){ return Number(n||0).toFixed(d); }
function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }

const icons = {
  settings:`<svg viewBox="0 0 24 24"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2.1 2.1 0 1 1-2.97 2.97l-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.09 1.65V21.4a2.1 2.1 0 1 1-4.2 0v-.09a1.8 1.8 0 0 0-1.09-1.65 1.8 1.8 0 0 0-1.98.36l-.06.06a2.1 2.1 0 1 1-2.97-2.97l.06-.06A1.8 1.8 0 0 0 3.6 15a1.8 1.8 0 0 0-1.65-1.09H1.8a2.1 2.1 0 1 1 0-4.2h.09A1.8 1.8 0 0 0 3.54 8.6a1.8 1.8 0 0 0-.36-1.98l-.06-.06A2.1 2.1 0 1 1 6.09 3.6l.06.06a1.8 1.8 0 0 0 1.98.36A1.8 1.8 0 0 0 9.22 2.4V2.2a2.1 2.1 0 1 1 4.2 0v.09a1.8 1.8 0 0 0 1.09 1.65 1.8 1.8 0 0 0 1.98-.36l.06-.06a2.1 2.1 0 1 1 2.97 2.97l-.06.06a1.8 1.8 0 0 0-.36 1.98c.28.67.94 1.1 1.66 1.1H21.9a2.1 2.1 0 1 1 0 4.2h-.09A1.8 1.8 0 0 0 19.4 15Z"/></svg>`,
  moon:`<svg viewBox="0 0 24 24"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z"/></svg>`,
  sun:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  home:`<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V21h14V10.5"/><path d="M9 21v-6h6v6"/></svg>`,
  map:`<svg viewBox="0 0 24 24"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
  fuel:`<svg viewBox="0 0 24 24"><path d="M4 21V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"/><path d="M4 12h12M16 7h2l2 2v8a2 2 0 0 0 4 0v-6l-3-3"/><path d="M3 21h14"/></svg>`,
  wallet:`<svg viewBox="0 0 24 24"><path d="M3 7h15a3 3 0 0 1 3 3v9H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14v4"/><path d="M16 13h5"/></svg>`,
  headset:`<svg viewBox="0 0 24 24"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 13h4v6H6a2 2 0 0 1-2-2v-4Zm16 0h-4v6h2a2 2 0 0 0 2-2v-4Z"/><path d="M16 19c0 1.2-1 2-4 2"/></svg>`,
  speed:`<svg viewBox="0 0 24 24"><path d="M4 14a8 8 0 1 1 16 0"/><path d="m12 14 4-4"/><path d="M3 20h18"/></svg>`,
  shield:`<svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-5"/></svg>`,
  km:`<svg viewBox="0 0 24 24"><path d="M6 17c4-6 8 4 12-2"/><path d="M5 6h.01M19 6h.01"/><path d="M5 6c4 3 10-3 14 2"/></svg>`,
  wrench:`<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0 5 5L10 21l-5-5 9.7-9.7Z"/><path d="m7 18-2-2"/></svg>`,
  oil:`<svg viewBox="0 0 24 24"><path d="M4 13h11l4 4v3H4v-7Z"/><path d="M8 13V7h7v6"/><path d="M9 7V4h5v3"/><path d="M20 13s2 2 2 4a2 2 0 0 1-4 0c0-2 2-4 2-4Z"/></svg>`,
  route:`<svg viewBox="0 0 24 24"><path d="M5 6c4-5 10 1 6 5s2 9 8 5"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="16" r="2"/></svg>`,
  spark:`<svg viewBox="0 0 24 24"><path d="m13 2-8 11h6l-2 9 10-13h-6l0-7Z"/></svg>`,
  link:`<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.2-1.2"/></svg>`,
};
function icon(n){ return icons[n] || ''; }
function scooterSvg(){ return `<svg viewBox="0 0 260 150" role="img" aria-label="Honda Beat FI"><defs><linearGradient id="b" x1="0" x2="1"><stop stop-color="#53e4ff"/><stop offset="1" stop-color="#1d77ff"/></linearGradient></defs><ellipse cx="132" cy="132" rx="92" ry="11" fill="rgba(0,0,0,.25)"/><circle cx="72" cy="112" r="25" fill="#111b26" stroke="#344b60" stroke-width="7"/><circle cx="194" cy="112" r="27" fill="#111b26" stroke="#344b60" stroke-width="7"/><path d="M72 91h54l18-28h48l14 23-20 25h-74l-45 1" fill="#111d2c"/><path d="M118 70c24-6 52-5 75 11l-14 22h-62l-22 9-24-7 35-21z" fill="url(#b)"/><path d="M105 61h57l10 18h-82c3-10 8-15 15-18z" fill="#e9f3ff"/><path d="M154 83h42l-8 10h-36z" fill="#ff4a58" opacity=".8"/><path d="M133 45h42l9 15h-62c2-8 5-13 11-15z" fill="#0a1320"/><path d="M181 42l28-14M203 30l20-2M129 44l-11-22M117 22l-14-2" stroke="#b8c8d9" stroke-width="4" stroke-linecap="round"/><path d="M92 85l-10 25M168 90l16 22" stroke="#d7e6ff" stroke-width="4" stroke-linecap="round"/></svg>`; }
function personSvg(){ return `<svg viewBox="0 0 90 90"><defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#31455f"/><stop offset="1" stop-color="#0f1c2a"/></linearGradient></defs><rect width="90" height="90" rx="20" fill="url(#p)"/><circle cx="45" cy="34" r="16" fill="#cf986f"/><path d="M27 33c2-15 32-19 39-3-9-1-20-2-38 5z" fill="#111722"/><path d="M22 90c4-24 42-28 47 0z" fill="#111722"/><path d="M35 43c6 7 15 7 20 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`; }
function partSvg(type){
  const map={
    ECU:`<svg viewBox="0 0 120 80"><rect x="18" y="20" width="82" height="42" rx="6" fill="#2466c9"/><rect x="30" y="28" width="26" height="20" rx="3" fill="#06101d"/><path d="M70 27h20M70 37h18M70 47h14" stroke="#83c8ff" stroke-width="3"/><rect x="102" y="30" width="12" height="22" rx="3" fill="#242d36"/></svg>`,
    'Stop Lamp':`<svg viewBox="0 0 120 80"><path d="M15 28h90l-9 30H24L15 28Z" fill="#421014" stroke="#d9d9d9" stroke-width="4"/><path d="M28 35h64l-8 16H36Z" fill="#ec1c2e"/><path d="M45 52h30" stroke="#ff8a8a" stroke-width="5"/></svg>`,
    Spion:`<svg viewBox="0 0 120 80"><path d="M58 50 30 24m4-4H12v16h22V20Zm28 30 28-26m-4-4h22v16H86V20Z" stroke="#bdc7d5" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="60" cy="52" r="6" fill="#68798e"/></svg>`,
    Velg:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="#111821" stroke="#9aa7b9" stroke-width="5"/><circle cx="50" cy="50" r="10" fill="#2a3544"/><g stroke="#d5dee9" stroke-width="4"><path d="M50 12v28M50 60v28M12 50h28M60 50h28M24 24l20 20M56 56l20 20M24 76l20-20M56 44l20-20"/></g></svg>`,
    Knalpot:`<svg viewBox="0 0 120 80"><path d="M22 52 72 24c16-9 30 6 17 18L42 66Z" fill="#9aa7b9"/><path d="M64 28 82 56" stroke="#e9f3ff" stroke-width="5"/><path d="M14 58h18" stroke="#748194" stroke-width="8" stroke-linecap="round"/></svg>`,
    Shock:`<svg viewBox="0 0 80 100"><path d="M42 10v80" stroke="#d6dfec" stroke-width="8" stroke-linecap="round"/><path d="M25 25c18 0 18 10 0 10s-18 10 0 10 18 10 0 10-18 10 0 10 18 10 0 10" stroke="#9aa7b9" stroke-width="6" fill="none"/><circle cx="42" cy="10" r="8" fill="#657489"/><circle cx="42" cy="90" r="8" fill="#657489"/></svg>`,
    Ban:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="#101722" stroke="#2f3d4d" stroke-width="13"/><circle cx="50" cy="50" r="20" fill="#07101b"/><path d="M28 24c20 12 26 29 43 53" stroke="#667384" stroke-width="3" opacity=".7"/></svg>`,
    Sticker:`<svg viewBox="0 0 120 80"><path d="M12 52 50 14h58L72 66H20Z" fill="#1a77ff"/><path d="M24 53 58 24h32L66 56H28Z" fill="#f8fbff"/><path d="M40 52 64 30h16L62 53Z" fill="#0a1320"/></svg>`,
    Jok:`<svg viewBox="0 0 120 80"><path d="M18 45c20-18 52-18 84-8 10 3 10 16-2 18H26c-12 0-16-4-8-10Z" fill="#252d36" stroke="#6f7b8b" stroke-width="3"/><path d="M32 43h48" stroke="#4d5a6a" stroke-width="3"/></svg>`,
    Style:`<svg viewBox="0 0 120 80">${scooterSvg().replace('<svg viewBox="0 0 260 150" role="img" aria-label="Honda Beat FI">','<g transform="translate(0 -20) scale(.48)">').replace('</svg>','</g>')}</svg>`
  };
  return map[type] || map.ECU;
}

function setTheme(theme){ state.theme = theme; document.documentElement.dataset.theme = theme; save(); $('#themeBtn').innerHTML = icon(theme === 'dark' ? 'moon':'sun'); }
function boot(){ document.documentElement.dataset.theme = state.theme; $('#themeBtn').innerHTML = icon(state.theme === 'dark' ? 'moon':'sun'); $('#settingsBtn').innerHTML = icon('settings'); $('#themeBtn').onclick = () => { setTheme(state.theme === 'dark' ? 'light' : 'dark'); }; $('#settingsBtn').onclick = settingsSheet; renderNav(); render(); if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }}
function renderNav(){ const tabs = [{id:'home',label:'Home',ic:'home'},{id:'maps',label:'Maps',ic:'map'},{id:'fuel',label:'Fuel',ic:'fuel'},{id:'money',label:'Money',ic:'wallet'},{id:'assist',label:'Assist',ic:'headset'}]; $('#bottomNav').innerHTML = tabs.map(t=>`<button class="nav-item ${state.tab===t.id?'active':''}" data-tab="${t.id}">${icon(t.ic)}<span>${t.label}</span></button>`).join(''); $$('.nav-item').forEach(b=>b.onclick=()=>{ state.tab=b.dataset.tab; save(); renderNav(); render(); }); }
function render(){ const view = $('#view'); view.innerHTML = ({home:homeView,maps:mapsView,fuel:fuelView,money:moneyView,assist:assistView}[state.tab] || homeView)(); bindView(); }
function bindView(){ $$('[data-add-km]').forEach(b=>b.onclick=()=>addKm(Number(b.dataset.addKm))); $$('[data-open]').forEach(b=>b.onclick=()=>{ state.tab=b.dataset.open; save(); renderNav(); render(); }); $$('[data-fuel]').forEach(b=>b.onclick=()=>addFuel(Number(b.dataset.fuel), b.dataset.kind || 'Pertalite')); $$('[data-money-mode]').forEach(b=>b.onclick=()=>{ state.moneyMode=b.dataset.moneyMode; save(); render(); }); $$('[data-sheet]').forEach(b=>b.onclick=()=>openSheet(b.dataset.sheet)); const send = $('#sendChat'); if(send) send.onclick=sendChat; const msg=$('#chatInput'); if(msg) msg.addEventListener('keydown',e=>{if(e.key==='Enter')sendChat();}); }

function homeView(){ const range = state.fuel*state.kmpl; return `
  <section class="hero glass">
    <div class="bike-hero">
      <div class="bike-info">
        <div class="muted small">Honda</div><h3>Beat FI 2014</h3><span class="tag">${state.bike.plate}</span>
        <div class="status-line"><span class="check">✓</span><span>Semua komponen<br>dalam kondisi baik</span></div>
      </div>
      <div><div class="bike-art">${scooterSvg()}</div><div class="health-ring"><div class="ring"><b>100%</b><small>SEHAT</small></div></div></div>
    </div>
    <div class="hero-stats">
      ${stat(icon('speed'),fmt(state.km,1),'km','Virtual KM')}
      ${stat(icon('fuel'),fmt(state.fuel,2),'L','Fuel')}
      ${stat(icon('wallet'),Math.round(range),'km','Range')}
      ${stat(icon('shield'),'100%','','Health')}
    </div>
  </section>
  <section class="daily glass">
    <div class="daily-top"><div><h2>Hari Ini</h2><p class="muted small">Catat km perjalanan Anda</p></div><div class="streak-badge"><div>🔥</div><b>${state.streak}</b><small>streak</small></div></div>
    <div class="big">${fmt(state.dailyKm,1)}<span>km</span></div>
    <div class="quick-row"><button data-add-km="0">0 km</button><button data-add-km="5">+5</button><button data-add-km="10">+10</button><button data-sheet="km">Custom</button><button class="primary" data-open="maps">${icon('map')} Maps</button></div>
  </section>
  <section class="streak-row glass"><div class="section-head" style="margin:0"><h2 style="font-size:17px">Streak Mingguan</h2><span>Lihat Kalender ›</span></div><div class="days">${['M','S','S','R','K','J','S'].map((d,i)=>`<div class="day ${i===0?'active':''}"><div>${d}</div></div>`).join('')}</div></section>
  <section class="shortcuts">${shortcut('KM','Catat KM','km','sblue','km')}${shortcut('Fuel','Catat BBM','fuel','sgreen','fuel')}${shortcut('Service','Cek Komponen','wrench','sorange','service')}${shortcut('Money','Pengeluaran','wallet','spurple','money')}</section>
  <div class="section-head"><h2>Prioritas</h2><span>Lihat Semua ›</span></div>
  <section class="priority-card glass"><div class="item-img">${icon('oil')}</div><div><h3>Oli Mesin <span class="pill ok">Prioritas Tinggi</span></h3><p class="muted">Sisa <span class="ok">2000 km / 60 hari</span><br>Est. 11 Jan 2026</p></div><div class="progress">100%</div></section>
  <section class="rusdi glass"><div class="avatar">${personSvg()}</div><div><h3>Kang Rusdi <span class="pill blue">Asisten Anda</span></h3><p>Siap bantu scan motor, baca kode FI, hingga panduan darurat.</p></div><button class="ghost-btn" data-open="assist">💬 Mulai</button></section>
`; }
function stat(ic, val, unit, label){ return `<div class="stat">${ic}<div><b>${val}<span class="unit">${unit}</span></b><small>${label}</small></div></div>`; }
function shortcut(title, sub, ic, cls, action){ return `<button class="shortcut" ${action==='fuel'?'data-open="fuel"':action==='money'?'data-open="money"':'data-sheet="'+action+'"'}><span class="sicon ${cls}">${icon(ic)}</span><b>${title}</b><small>${sub}</small></button>`; }
function addKm(km){ state.dailyKm = (state.dailyKm||0)+km; state.km = (state.km||0)+km; state.streak = Math.max(1, state.streak||0); if(km>0){ const used = km/state.kmpl; state.fuel = clamp(state.fuel-used,0,state.tank); } save(); render(); toast(`KM masuk ${km} km`); }

function mapsView(){ return `
  <section class="map-card glass">
    <div class="map-grid"></div>
    <svg class="route" viewBox="0 0 400 310" preserveAspectRatio="none"><path d="M338 105 C320 114 328 132 300 135 C260 138 269 170 229 169 C195 168 190 194 154 197 C117 200 114 230 78 235" stroke="rgba(44,140,255,.22)" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M338 105 C320 114 328 132 300 135 C260 138 269 170 229 169 C195 168 190 194 154 197 C117 200 114 230 78 235" stroke="#1c83ff" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
    <div class="map-chip"><b>${fmt(state.route.km,1)} km</b><small>OSRM road route</small></div><button class="pill reset">⌖ Reset</button><div class="zoom"><button>+</button><button>−</button></div>
    <div class="map-marker mk-a"><span>A</span></div><div class="map-marker mk-b"><span>B</span></div><span class="route-place a">Jatiwarna</span><span class="route-place b">Pondok Gede</span><span class="route-place c">Cipayung</span>
  </section>
  <section class="control-row"><button class="control"><span class="bubble">A</span><span><b>Start</b><small>Jl. Raya Jatiwaringin</small></span></button><button class="control"><span class="bubble">B</span><span><b>Tujuan</b><small>Jl. Raya Hankam</small></span></button><button class="control"><span class="bubble red">■</span><span><b>Stop</b><small>Opsional</small></span></button></section>
  <section class="metrics"><div class="metric"><span class="sicon sblue">${icon('map')}</span><br><b>${state.route.points}</b><small>Titik Lewat</small></div><div class="metric"><span class="sicon sblue">${icon('route')}</span><br><b>${fmt(state.route.km,1)} km</b><small>Total Rute</small></div><div class="metric"><span class="sicon sblue">${icon('fuel')}</span><br><b>${fmt(state.route.fuel,2)} L</b><small>Perkiraan</small></div></section>
  <section class="actions"><button class="chip-btn primary" onclick="calcRoute()">${icon('route')} Hitung Jalan</button><button class="chip-btn" onclick="addRouteKm()">＋ Tambah KM</button><button class="chip-btn" onclick="toast('Rute disimpan')">▣ Simpan</button></section>
  <section class="summary-card glass"><div class="summary-icon">${icon('route')}</div><div><b>Rute terbaik dari Start ke Tujuan</b><p class="muted">${fmt(state.route.km,1)} km · Est. ${fmt(state.route.fuel,2)} L BBM<br><span class="blue">± ${rupiah(state.route.cost)}</span></p></div></section>
`; }
window.calcRoute = function(){ state.route.km = Number((1.5 + Math.random()*5).toFixed(1)); state.route.points = Math.round(8+Math.random()*18); state.route.fuel = Number((state.route.km/state.kmpl).toFixed(2)); state.route.cost = state.route.fuel*10000; save(); render(); toast('Rute dihitung'); };
window.addRouteKm = function(){ addKm(state.route.km); };

function fuelView(){ const pct = clamp(state.fuel/state.tank*100,0,100); const points=[1.2,2.7,1.6,3.4,state.fuel]; const max=4.0; const coords=points.map((p,i)=>[30+i*78, 165-(p/max)*140]); const line=coords.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' '); return `
  <section class="fuel-hero glass"><div class="fuel-main"><div><h2>Sisa Bensin</h2><div class="liter">${fmt(state.fuel,2)}<span> L</span></div><p><span class="tag">A</span> ${Math.round(state.fuel*state.kmpl)} km range</p></div><div class="bike-art">${scooterSvg()}</div><span class="pill kmpl">💧 ${fmt(state.kmpl,1)} km/L</span><div class="fuel-bar"><div class="fuel-fill" style="width:${pct}%"></div></div><div class="ef"><span>E</span><span>${Math.round(pct)}% · Sedang</span><span>F</span></div></div></section>
  <section class="fill-options"><button class="fuel-option" data-fuel="1" data-kind="Pertalite">${icon('fuel')}<span><b>Pertalite 1L</b><small>1 Liter</small></span></button><button class="fuel-option" data-fuel="2" data-kind="Pertalite">${icon('fuel')}<span><b>Pertalite 2L</b><small>2 Liter</small></span></button><button class="fuel-option" data-fuel="3" data-kind="Pertamax">${icon('fuel')}<span><b>Pertamax</b><small>3 Liter</small></span></button></section>
  <section class="chart-card glass"><div class="section-head" style="margin:0"><h2>Fuel Balance</h2><span class="pill">7 Hari Terakhir⌄</span></div><p class="muted small">Liter (L)</p><div class="chart-wrap"><svg viewBox="0 0 360 190"><g stroke="rgba(255,255,255,.12)" stroke-dasharray="5 7">${[25,60,95,130,165].map(y=>`<line x1="30" y1="${y}" x2="342" y2="${y}"/>`).join('')}</g><g fill="var(--muted)" font-size="10">${['4.0 L','3.0 L','2.0 L','1.0 L','0 L'].map((t,i)=>`<text x="0" y="${29+i*35}">${t}</text>`).join('')}</g><path d="M30 165 L342 165" stroke="rgba(255,255,255,.25)"/><path d="${line}" stroke="#1687ff" stroke-width="4" fill="none"/><path d="${line} L342 165 L30 165 Z" fill="rgba(22,135,255,.14)"/>${coords.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#0d1a2a" stroke="#79c9ff" stroke-width="3"/><text x="${p[0]-12}" y="${p[1]-12}" fill="var(--text)" font-size="12">${fmt(points[i],1)} L</text>`).join('')}<g fill="var(--soft)" font-size="11">${['8 Mei','9 Mei','10 Mei','11 Mei','12 Mei'].map((t,i)=>`<text x="${20+i*78}" y="184">${t}</text>`).join('')}</g></svg></div></section>
  <div class="section-head"><h2>History</h2><span>Lihat Semua ›</span></div><section class="glass card"><div class="history-list">${state.fuelLogs.map(l=>`<div class="list-row"><div class="list-icon">${icon('fuel')}</div><div><b>${fmt(l.liter,1)} L</b><br><small>${l.date}</small></div><div class="list-right">${rupiah(l.price)}<br><small>${l.fuel}</small></div></div>`).join('')}</div></section>
`; }
function addFuel(liter, kind){ state.fuel = clamp(state.fuel + liter, 0, state.tank); const price = kind==='Pertamax' ? liter*14000 : liter*10000; state.fuelLogs.unshift({liter,date:'Hari ini',price,fuel:kind}); state.transactions.unshift({name:'Isi Bensin', note:kind, amount:price, when:'Hari ini', cat:'Fuel'}); state.spent += price; save(); render(); toast(`Fuel masuk ${liter} L`); }

function moneyView(){ if(state.moneyMode==='collection') return collectionView(); const pct = clamp(state.spent/state.budget*100,0,100); const rows=[['Fuel',45,9000,'sblue','fuel'],['Service',25,5000,'sgreen','wrench'],['Modif',15,3000,'spurple','wallet'],['Tools',10,2000,'sorange','settings'],['Other',5,1000,'','']]; return `
  <div class="seg"><button class="active" data-money-mode="budget">Budget</button><button data-money-mode="collection">Collection</button></div>
  <section class="money-hero glass"><div class="budget-top"><div><div class="muted">Budget Bulanan</div><div class="amount">${rupiah(state.spent)}</div><span class="muted">Total terpakai bulan ini</span></div><div style="text-align:right"><span class="pill">Januari 2026</span><br><br><span class="pill">Budget ${rupiah(state.budget)}</span></div></div><div class="progressbar" style="margin-top:22px"><span style="width:${pct}%"></span></div><div class="budget-foot"><span>Sisa budget<br><b class="ok">${rupiah(state.budget-state.spent)}</b></span><span>${Math.round(pct)}%</span><span>15 hari lagi</span></div></section>
  <section class="money-actions"><button class="chip-btn" data-sheet="expense">＋ Tambah<br>Expense</button><button class="chip-btn" onclick="addSaving()">🐷 Celengan<br>+10k</button><button class="chip-btn" onclick="addBudget()"><span class="ok">+25k</span><br>Tambah Budget</button></section>
  <section class="breakdown glass"><div class="section-head" style="margin:0"><h2>Breakdown Pengeluaran</h2><span>Lihat Detail ›</span></div>${rows.map(r=>`<div class="bar-row"><span class="mini-ico ${r[3]}">${r[4]?icon(r[4]):'•••'}</span><b>${r[0]}</b><div class="bar"><span style="width:${r[1]}%;background:var(${r[3]==='sgreen'?'--green':r[3]==='spurple'?'--purple':r[3]==='sorange'?'--orange':'--blue'})"></span></div><span>${r[1]}%</span><span>${rupiah(r[2])}</span></div>`).join('')}</section>
  <div class="section-head"><h2>Transaksi Terbaru</h2><span>Lihat Semua ›</span></div><section class="glass card"><div class="history-list">${state.transactions.slice(0,4).map(t=>`<div class="list-row"><div class="list-icon">${icon(t.cat==='Fuel'?'fuel':t.cat==='Service'?'wrench':'wallet')}</div><div><b>${t.name}</b><br><small>${t.note}</small></div><div class="list-right">-${rupiah(t.amount)}<br><small>${t.when}</small></div></div>`).join('')}</div></section>
  <section class="summary-card glass" data-money-mode="collection" style="cursor:pointer"><div class="summary-icon">★</div><div><b>Collection</b><p class="muted">Jelajahi koleksi part modifikasi dan inspirasi style untuk motor kamu.</p></div></section>
`; }
window.addSaving=()=>{ state.spent = Math.max(0,state.spent-10000); save(); render(); toast('Celengan +10k'); };
window.addBudget=()=>{ state.budget += 25000; save(); render(); toast('Budget +25k'); };
function collectionView(){ const cats=[['Style Modif','108 konsep','Style'],['ECU','12 item','ECU'],['Stop Lamp','10 item','Stop Lamp'],['Spion','14 item','Spion'],['Knalpot','16 item','Knalpot'],['Velg','18 item','Velg'],['Jok','12 item','Jok'],['Sticker','22 item','Sticker']]; return `
  <div class="seg"><button data-money-mode="budget">Budget</button><button class="active" data-money-mode="collection">Collection</button></div>
  <section class="glass card"><div class="section-head" style="margin:0 0 14px"><div><h2>Collection</h2><p class="muted small">konsep & parts</p></div><button class="pill" data-sheet="collection">＋ Tambah</button></div><div class="collection-grid">${cats.map(c=>`<button class="cat-card" data-sheet="cat-${c[0]}"><div class="cat-art">${partSvg(c[2])}</div><div><b>${c[0]}</b><br><small>${c[1]}</small></div></button>`).join('')}</div><button class="chip-btn" style="width:100%;margin-top:12px">🔗 Lihat semua parts (123 item) ›</button></section>
  <section class="glass card"><div class="section-head" style="margin:0 0 12px"><div><h2>Pilihan Produk</h2><p class="muted small">Rekomendasi parts pilihan untuk motor kamu.</p></div><span>Lihat Semua ›</span></div><div class="product-scroll">${state.collection.map(p=>productCard(p)).join('')}</div></section>
  <section class="summary-card glass"><div class="bike-art" style="width:80px;height:60px">${scooterSvg()}</div><div><b>Butuh inspirasi?</b><p class="muted">Lihat ratusan konsep modifikasi dari komunitas NGR Neo.</p><button class="chip-btn primary" style="width:100%">Jelajahi Konsep ›</button></div></section>
`; }
function productCard(p){ return `<article class="product-card"><div class="prod-img">${partSvg(p.cat)}</div><div><b>${p.name}</b><br><small class="muted">${p.cat}</small><div class="price">${rupiah(p.price)}</div><a class="link-btn" href="${p.link}" target="_blank" rel="noopener">Buka Link ↗</a></div></article>`; }

function assistView(){ return `<section class="assist-card glass"><div class="chat-head"><div class="chat-name"><div class="avatar smallava">${personSvg()}</div><div><h2 style="margin:0">Kang Rusdi</h2><span class="blue">Asisten Anda</span></div></div><span class="pill online">● Online</span></div><div class="chat-list">${state.chat.map(m=>`<div class="bubble-chat ${m.from==='me'?'user':''}">${m.text}<div class="small muted" style="margin-top:8px">09:41</div></div>`).join('')}</div><div class="message-bar"><input id="chatInput" placeholder="Tulis pesan..."/><button id="sendChat">✈ Kirim</button></div></section><div class="section-head"><h2>Emergency & Guide</h2></div><section class="guide-grid">${[['⚠️','Motor mati di jalan'],['🔌','Cek busi lemah/mati'],['🛢','Ganti oli mesin'],['⚙️','Ganti oli gardan'],['🌀','CVT bunyi/getar'],['FI','FI Code Helper']].map(g=>`<button class="guide-card" onclick="guideSheet('${g[1]}')"><span class="sicon sblue">${g[0]}</span><b>${g[1]}</b><span>›</span></button>`).join('')}</section>`; }
function sendChat(){ const input=$('#chatInput'); const text=input.value.trim(); if(!text) return; state.chat.push({from:'me',text}); state.chat.push({from:'rusdi',text:rusdiReply(text)}); input.value=''; save(); render(); }
function rusdiReply(t){ t=t.toLowerCase(); if(t.includes('mogok')||t.includes('mati')) return 'Kalau motor mati di jalan: cek bensin dulu, kontak/kunci, standar samping, aki, sekring, lalu busi. Jangan langsung bongkar berat.'; if(t.includes('fi')||t.includes('kedip')) return 'Kode FI/MIL dihitung dari kedipan panjang = 10 dan pendek = 1. Catat polanya dulu, baru cocokkan gejalanya.'; if(t.includes('oli')) return 'Untuk Beat FI, oli mesin jangan telat. Kalau sering macet/stop-go, aman ganti lebih cepat dari interval.'; return 'Oke, catat gejalanya: kapan muncul, saat dingin/panas, pas gas atau langsam, lalu cek dari yang paling ringan dulu.'; }
window.guideSheet=(title)=>{ openSheet('guide', title); };

function openSheet(type, extra){ const sc=$('#sheetContent'); let html=''; if(type==='km'){ html=`<h2>Input KM Manual</h2><div class="field"><label>KM hari ini</label><input id="kmManual" type="number" inputmode="decimal" placeholder="contoh 7.5"></div><div class="sheet-actions"><button class="chip-btn" onclick="closeSheet()">Batal</button><button class="chip-btn primary" onclick="manualKm()">Simpan</button></div>`; } else if(type==='expense'){ html=`<h2>Tambah Expense</h2><div class="field"><label>Nama</label><input id="exName" placeholder="contoh Oli Mesin"></div><div class="field"><label>Nominal</label><input id="exAmt" type="number" inputmode="numeric" placeholder="65000"></div><div class="field"><label>Kategori</label><select id="exCat"><option>Fuel</option><option>Service</option><option>Modif</option><option>Tools</option><option>Other</option></select></div><div class="sheet-actions"><button class="chip-btn" onclick="closeSheet()">Batal</button><button class="chip-btn primary" onclick="manualExpense()">Simpan</button></div>`; } else if(type==='collection'){ html=`<h2>Tambah Collection</h2><div class="field"><label>Nama produk</label><input id="coName" placeholder="Stop Lamp JPA V3"></div><div class="field"><label>Kategori</label><select id="coCat"><option>ECU</option><option>Stop Lamp</option><option>Spion</option><option>Knalpot</option><option>Velg</option><option>Jok</option><option>Sticker</option></select></div><div class="field"><label>Harga</label><input id="coPrice" type="number" placeholder="175000"></div><div class="field"><label>Link produk</label><input id="coLink" placeholder="https://..."></div><div class="field"><label>Catatan</label><textarea id="coNote" placeholder="cocok buat Thai look / daily clean..."></textarea></div><div class="sheet-actions"><button class="chip-btn" onclick="closeSheet()">Batal</button><button class="chip-btn primary" onclick="manualCollection()">Simpan</button></div>`; } else if(type==='guide'){ html=`<h2>${extra}</h2><p class="muted">Panduan awal:</p><ol style="line-height:1.6;color:var(--soft)"><li>Berhenti di tempat aman.</li><li>Cek hal ringan dulu: bensin, aki, sekring, busi, soket.</li><li>Catat gejala: dingin/panas, langsam/gas, bunyi, bau, lampu FI kedip.</li><li>Kalau FI kedip: panjang = 10, pendek = 1. Jangan vonis part sebelum cek ulang.</li></ol><button class="chip-btn primary" style="width:100%" onclick="closeSheet()">Paham</button>`; } else { html=`<h2>${type.replace('cat-','')}</h2><p class="muted">Masuk kategori ini nanti berisi list produk/link dan catatan modif.</p><button class="chip-btn primary" style="width:100%" onclick="closeSheet()">Oke</button>`; }
  sc.innerHTML=html; $('#sheetBackdrop').hidden=false; $('#sheet').hidden=false; $('#sheetBackdrop').onclick=closeSheet; }
window.closeSheet=function(){ $('#sheetBackdrop').hidden=true; $('#sheet').hidden=true; };
window.manualKm=function(){ const v=Number($('#kmManual').value||0); addKm(v); closeSheet(); };
window.manualExpense=function(){ const name=$('#exName').value.trim()||'Expense'; const amount=Number($('#exAmt').value||0); const cat=$('#exCat').value; state.transactions.unshift({name,note:cat,amount,when:'Hari ini',cat}); state.spent += amount; save(); closeSheet(); render(); toast('Expense masuk'); };
window.manualCollection=function(){ const item={ name:$('#coName').value.trim()||'Produk baru', cat:$('#coCat').value, price:Number($('#coPrice').value||0), link:$('#coLink').value.trim()||'#', note:$('#coNote').value.trim() }; state.collection.unshift(item); save(); closeSheet(); render(); toast('Collection masuk'); };
function settingsSheet(){ const data=encodeURIComponent(JSON.stringify(state)); openSheet('settings'); $('#sheetContent').innerHTML=`<h2>Settings</h2><p class="muted">Mode tampilan & backup.</p><div class="seg"><button onclick="setTheme('dark')">Dark</button><button onclick="setTheme('light')">Light</button></div><div class="sheet-actions"><button class="chip-btn" onclick="exportData()">Export JSON</button><label class="chip-btn" style="display:grid;place-items:center"><input id="importFile" type="file" accept="application/json" hidden>Import JSON</label></div><button class="chip-btn primary" style="width:100%;margin-top:10px" onclick="closeSheet()">Tutup</button>`; $('#importFile').onchange=importData; }
window.exportData=function(){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ngr-neo-backup.json'; a.click(); URL.revokeObjectURL(a.href); };
function importData(e){ const file=e.target.files[0]; if(!file)return; const r=new FileReader(); r.onload=()=>{ try{ state={...defaultState,...JSON.parse(r.result)}; save(); closeSheet(); renderNav(); render(); toast('Data diimport'); }catch{toast('JSON rusak');} }; r.readAsText(file); }
function toast(msg){ let t=$('#toast'); if(!t){ t=document.createElement('div'); t.id='toast'; t.style.cssText='position:fixed;left:50%;bottom:100px;transform:translateX(-50%);z-index:99;background:rgba(5,13,24,.9);border:1px solid rgba(169,214,255,.22);color:#fff;border-radius:999px;padding:12px 16px;box-shadow:0 12px 35px rgba(0,0,0,.35);font-weight:750;backdrop-filter:blur(14px);'; document.body.appendChild(t);} t.textContent=msg; t.hidden=false; clearTimeout(t._tm); t._tm=setTimeout(()=>t.hidden=true,1400); }
boot();
