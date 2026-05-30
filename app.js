
const VERSION = '2.2-real-poco';
const STORE = 'ngr_neo_real_poco_state_v22';
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const now = () => Date.now();
const esc = v => String(v ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const num = (v,d=0)=> Number.isFinite(+v) ? +v : d;
const clamp = (v,a,b)=> Math.max(a,Math.min(b,v));
const fmtRp = v => 'Rp' + Math.round(num(v)).toLocaleString('id-ID');
const fmtKm = v => `${num(v).toFixed(num(v)<10?1:0)} km`;
const fmtL = v => `${num(v).toFixed(2)} L`;
const dateKey = ts => new Date(ts).toISOString().slice(0,10);
const todayKey = () => dateKey(now());

const PARTS = [
  {id:'style', name:'Style Modif', icon:'🏍️', count:'108 konsep'},
  {id:'ecu', name:'ECU', icon:'🧠', count:'12 item'},
  {id:'stoplamp', name:'Stop Lamp', icon:'🔴', count:'10 item'},
  {id:'spion', name:'Spion', icon:'🪞', count:'14 item'},
  {id:'knalpot', name:'Knalpot', icon:'🧯', count:'16 item'},
  {id:'velg', name:'Velg', icon:'🛞', count:'18 item'},
  {id:'jok', name:'Jok', icon:'▰', count:'12 item'},
  {id:'sticker', name:'Sticker', icon:'⚡', count:'22 item'}
];
const PRODUCTS = [
  {cat:'ECU', name:'RCB ECU Juken 5', price:1350000, icon:'🧠', link:'https://shopee.co.id/', note:'Plug & Play Beat FI, tenaga lebih responsif.'},
  {cat:'Knalpot', name:'Knalpot R9 H2', price:850000, icon:'🧯', link:'https://shopee.co.id/', note:'Suara racing, tetap cocok konsep daily.'},
  {cat:'Velg', name:'Velg RCB SP522', price:1250000, icon:'🛞', link:'https://shopee.co.id/', note:'Cocok Thai look / clean racing.'},
  {cat:'Stop Lamp', name:'Stop Lamp JPA V3', price:175000, icon:'🔴', link:'https://shopee.co.id/', note:'Stop lamp LED look modern.'}
];
const STYLES = [
  {name:'Thai Look', count:'24 inspirasi', icon:'🏍️'},
  {name:'Racing Daily', count:'28 inspirasi', icon:'🏁'},
  {name:'Simple Clean', count:'21 inspirasi', icon:'✨'},
  {name:'Touring', count:'16 inspirasi', icon:'🧭'},
  {name:'Retro Sport', count:'19 inspirasi', icon:'🏍️'}
];
const GUIDES = {
  mogok:{title:'Motor mati di jalan', icon:'⚠️', steps:['Pinggirkan motor dan hidupkan hazard/senter HP.','Cek bensin, kunci kontak, standar samping, dan aki.','Coba starter elektrik dan kick starter.','Kalau FI kedip, catat jumlah kedipan.','Jangan dipaksa terus kalau bunyi aneh atau bau gosong.']},
  busi:{title:'Cek busi lemah/mati', icon:'⚡', steps:['Gejala: susah starter, brebet, mati mendadak.','Cek cop busi jangan longgar atau basah.','Buka busi kalau aman, lihat warna elektroda.','Hitam basah bisa banjir bensin/oli; putih pucat bisa terlalu panas.','Bawa busi cadangan kalau sering jarak jauh.']},
  oli:{title:'Ganti oli mesin', icon:'🛢️', steps:['Panaskan mesin sebentar, jangan sampai terlalu panas.','Siapkan oli 10W-30 matic sekitar 0.8L.','Buka baut pembuangan, tampung oli lama.','Pasang lagi baut, isi oli baru, cek dipstick.','Catat di Service agar reminder jalan.']},
  gardan:{title:'Ganti oli gardan', icon:'⚙️', steps:['Ganti oli gardan tiap ±8000 km / 6 bulan.','Buka baut buang dan isi area gardan.','Buang oli lama, isi sesuai takaran.','Kalau suara belakang kasar, cek lebih cepat.']},
  cvt:{title:'CVT bunyi/getar', icon:'🌀', steps:['Gejala: getar awal, tarikan berat, klotok area CVT.','Cek roller, v-belt, kampas ganda, mangkok.','Bersihkan debu CVT, jangan kena oli.','Kalau belt retak, jangan tunda ganti.']},
  fi:{title:'FI Code Helper', icon:'FI', steps:['Kedipan panjang = 10, kedipan pendek = 1.','Contoh 1 panjang + 2 pendek = kode 12.','Catat kode + gejala mesin.','Cek aki, soket, dan kabel sebelum vonis sensor.','Untuk kode pasti, cocokkan manual/bengkel Honda.']}
};
const SERVICES = [
  {key:'oil', name:'Oli Mesin', icon:'🛢️', km:2000, days:60},
  {key:'gardan', name:'Oli Gardan', icon:'⚙️', km:8000, days:180},
  {key:'busi', name:'Busi', icon:'⚡', km:8000, days:180},
  {key:'cvt', name:'CVT', icon:'🌀', km:8000, days:180}
];
const DEFAULT = {
  version: VERSION,
  theme:'dark',
  bike:{name:'Honda Beat FI 2014', plate:'Plat Z 2002 WIE', virtualKm:1.9},
  kmLogs:[{ts:now()-86400000,km:1.9,note:'demo'}],
  fuel:{liters:1.97,tank:4,kmpl:55,logs:[{ts:now()-86400000*2,type:'Pertalite',liters:2,amount:20000}],balance:[{ts:now()-86400000*4,l:1.2},{ts:now()-86400000*3,l:2.7},{ts:now()-86400000*2,l:1.6},{ts:now()-86400000,l:3.4},{ts:now(),l:1.97}]},
  money:{budget:250000, savings:0, expenses:[{ts:now(),cat:'Fuel',title:'Isi Bensin',desc:'Pertalite',amount:20000}]},
  route:{start:'Jl. Raya Jatiwaringin', dest:'Jl. Raya Hankam', stop:'Opsional', km:1.9, points:12},
  service:{},
  products:PRODUCTS,
  assist:{messages:[{role:'bot',text:'Yo, gw Kang Rusdi. Tanya motor, fuel, money, FI code, atau panduan darurat di sini.'}]}
};
let state = load();
let active = 'home';
let moneyMode = 'money';
let selectedCat = null;

function load(){ try{ return norm(JSON.parse(localStorage.getItem(STORE))); } catch { return norm({}); } }
function merge(t,s){ for(const k in s||{}){ if(s[k] && typeof s[k]==='object' && !Array.isArray(s[k]) && t[k] && typeof t[k]==='object' && !Array.isArray(t[k])) merge(t[k],s[k]); else t[k]=s[k]; } }
function norm(raw){ const s=structuredClone(DEFAULT); merge(s,raw||{}); SERVICES.forEach(x=>{ if(!s.service[x.key]) s.service[x.key]={lastKm:s.bike.virtualKm,lastTs:now()}; }); if(!s.products?.length) s.products=structuredClone(PRODUCTS); return s; }
function save(){ localStorage.setItem(STORE,JSON.stringify(state)); }
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),1800); }
function setTheme(t){ state.theme=t; document.body.classList.toggle('light',t==='light'); $('#themeBtn').textContent=t==='light'?'☀':'☾'; save(); }
function monthSpend(cat){ const d=new Date(); return state.money.expenses.filter(e=>{const x=new Date(e.ts);return x.getMonth()===d.getMonth()&&x.getFullYear()===d.getFullYear()&&(!cat||e.cat===cat)}).reduce((a,e)=>a+num(e.amount),0); }
function todayKm(){ return state.kmLogs.filter(x=>dateKey(x.ts)===todayKey()).reduce((a,x)=>a+num(x.km),0); }
function streak(){ let n=0, d=new Date(); for(;;){const k=dateKey(d); if(state.kmLogs.some(x=>dateKey(x.ts)===k)){n++; d.setDate(d.getDate()-1)} else break;} return n; }
function healthOf(s){ const rec=state.service[s.key]; const usedKm=Math.max(0,state.bike.virtualKm-rec.lastKm); const usedDays=Math.max(0,(now()-rec.lastTs)/86400000); return clamp(Math.min(100-(usedKm/s.km*100),100-(usedDays/s.days*100)),0,100); }
function priority(){ return [...SERVICES].sort((a,b)=>healthOf(a)-healthOf(b))[0]; }
function range(){ return state.fuel.liters*state.fuel.kmpl; }

function bikeSvg(){return `<svg class="bike-svg" viewBox="0 0 160 90" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><circle cx="38" cy="64" r="18" opacity=".22"/><circle cx="122" cy="64" r="18" opacity=".22"/><path d="M40 61h46l18-25h28" opacity=".45"/><path d="M76 40h45"/><path d="M88 32l-9 29"/><path d="M130 30l13-8"/><path d="M123 22h18"/></g><path d="M45 54h54l13-18H77c-20 0-27 7-32 18Z" fill="url(#b)"/><path d="M91 34h40l7 17H86Z" fill="#e9f4ff"/><defs><linearGradient id="b"><stop stop-color="#59e0ff"/><stop offset="1" stop-color="#4f93ff"/></linearGradient></defs></svg>`}
function routeSvg(){return `<svg viewBox="0 0 360 260" preserveAspectRatio="none" class="route-svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g stroke="currentColor" opacity=".14" stroke-width="1"><path d="M0 48 C80 30 115 70 190 50 S280 25 360 40"/><path d="M0 110 C55 120 95 90 150 110 S255 150 360 125"/><path d="M20 220 C90 178 115 205 190 178 S290 190 350 160"/><path d="M54 0 L96 260M160 0 L132 260M260 0 L246 260"/></g><path d="M300 82 L286 92 L284 110 L250 112 L246 128 L205 124 L186 140 L150 138 L116 160 L92 174 L66 173" fill="none" stroke="#1676ff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/><text x="188" y="48" fill="currentColor" opacity=".56" font-size="13">Jatiwarna</text><text x="205" y="90" fill="currentColor" opacity=".50" font-size="12">Pondok Gede</text><text x="60" y="130" fill="currentColor" opacity=".45" font-size="12">Lubang Buaya</text><text x="186" y="185" fill="currentColor" opacity=".44" font-size="12">Cipayung</text></svg>`}

function render(){
  $('#screen-home').innerHTML=home();
  $('#screen-maps').innerHTML=maps();
  $('#screen-fuel').innerHTML=fuel();
  $('#screen-money').innerHTML=money();
  $('#screen-assist').innerHTML=assist();
  $$('.screen').forEach(x=>x.classList.toggle('active',x.id===`screen-${active}`));
  $$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===active));
}
function home(){ const p=priority(), ph=healthOf(p), st=streak(), done=todayKm()>0 || state.kmLogs.some(x=>dateKey(x.ts)===todayKey());
return `<div class="glass hero-bike card">
  <div class="hero-top"><div class="hero-title"><span class="muted">Honda</span><h1>${esc(state.bike.name)}</h1><span class="pill">${esc(state.bike.plate)}</span></div><div class="bike-illus">${bikeSvg()}</div></div>
  <div class="ok-row"><span class="ok-dot">✓</span><div>Semua komponen<br/>dalam kondisi baik</div><div style="margin-left:auto" class="health-ring" style="--pct:${ph}%"><b>${ph.toFixed(0)}%</b></div></div>
  <div class="metric-grid"><div class="metric"><b>${fmtKm(state.bike.virtualKm)}</b><span>Virtual KM</span></div><div class="metric"><b>${fmtL(state.fuel.liters)}</b><span>Fuel</span></div><div class="metric"><b>${fmtKm(range())}</b><span>Range</span></div><div class="metric"><b>${ph.toFixed(0)}%</b><span>Health</span></div></div>
</div>
<div class="glass daily card"><div class="daily-head"><div><h2>Hari Ini</h2><p>Catat km perjalanan Anda</p><h2>${fmtKm(todayKm())}</h2><p>${done?'Sudah input hari ini.':'Belum input KM hari ini.'}</p></div><span class="pill red streak">🔥<br>${st} streak</span></div><div class="chips"><button class="chip" data-action="km-add" data-km="0">0 km</button><button class="chip" data-action="km-add" data-km="5">+5</button><button class="chip" data-action="km-add" data-km="10">+10</button><button class="chip" data-action="km-sheet">Custom</button><button class="chip primary" data-tabgo="maps">Maps</button></div>${week()}</div>
<div class="quick-grid"><button class="quick" data-action="km-sheet"><i>KM</i>KM</button><button class="quick" data-action="fuel-sheet"><i>⛽</i>Fuel</button><button class="quick" data-action="service-sheet"><i>🔧</i>Service</button><button class="quick" data-action="expense-sheet"><i>▣</i>Money</button></div>
<div class="section-head"><h2>Prioritas</h2><small>cukup 1 yang penting</small></div><button class="glass card service-line" data-action="service-detail" data-key="${p.key}"><div class="part-icon">${p.icon}</div><div><b>${p.name}</b><span>Sisa ${Math.max(0,Math.round(p.km-(state.bike.virtualKm-state.service[p.key].lastKm)))} km / ${Math.max(0,Math.ceil(p.days-(now()-state.service[p.key].lastTs)/86400000))} hari</span></div><div class="mini-ring">${ph.toFixed(0)}%</div></button>
<div class="glass card rusdi" style="margin-top:12px"><div class="avatar">👨‍🔧</div><div><b>Kang Rusdi <span class="pill blue">Asisten</span></b><p>Siap bantu scan motor, baca kode FI, dan panduan darurat.</p></div><button class="btn" data-tabgo="assist">Chat</button></div>`; }
function week(){ const d=new Date(); const days=[]; for(let i=6;i>=0;i--){const x=new Date(); x.setDate(d.getDate()-i); const k=dateKey(x); const done=state.kmLogs.some(l=>dateKey(l.ts)===k); days.push(`<div class="day-dot ${done?'done':''}"><b>${['M','S','S','R','K','J','S'][x.getDay()]}</b><small>${x.getDate()}</small></div>`)} return `<div class="week-strip">${days.join('')}</div>` }
function maps(){ const r=state.route; return `<div class="glass map-card"><div class="neo-map">${routeSvg()}<span class="pill blue map-chip">${fmtKm(r.km)} · road route</span><button class="btn map-reset" data-action="route-reset">Reset</button><div class="marker a">A</div><div class="marker b">B</div><div class="zoom"><button>+</button><button>−</button></div></div></div><div class="route-panel"><button class="route-point" data-action="route-sheet" data-field="start"><b>Start</b><small>${esc(r.start)}</small></button><button class="route-point" data-action="route-sheet" data-field="dest"><b>Tujuan</b><small>${esc(r.dest)}</small></button><button class="route-point" data-action="route-sheet" data-field="stop"><b>Stop</b><small>${esc(r.stop)}</small></button></div><div class="route-stats"><div class="statbox"><span>Titik</span><b>${r.points}</b></div><div class="statbox"><span>Jarak Jalan</span><b>${fmtKm(r.km)}</b></div><div class="statbox"><span>Est BBM</span><b>${fmtL(r.km/state.fuel.kmpl)}</b></div></div><div class="map-actions"><button class="btn primary" data-action="route-calc">Hitung Jalan</button><button class="btn" data-action="route-add-km">Tambah KM</button><button class="btn" data-action="route-save">Simpan</button></div><div class="glass card" style="margin-top:12px"><b>Rute terbaik dari Start ke Tujuan</b><p class="muted">${fmtKm(r.km)} · Est ${fmtL(r.km/state.fuel.kmpl)} BBM · ± ${fmtRp((r.km/state.fuel.kmpl)*10000)}</p></div>` }
function fuel(){ const pct=clamp(state.fuel.liters/state.fuel.tank*100,0,100); return `<div class="glass card"><div class="fuel-hero"><div><p>Sisa Bensin</p><h1>${fmtL(state.fuel.liters)}</h1><p><b>${fmtKm(range())}</b> range</p></div><div class="bike-illus">${bikeSvg()}</div></div><span class="pill">💧 ${state.fuel.kmpl.toFixed(1)} km/L</span><div class="fuel-bar"><div class="fuel-fill" style="--w:${pct}%"></div></div><div class="between"><span>E</span><span>${pct.toFixed(0)}% · ${pct<25?'Rendah':pct<65?'Sedang':'Aman'}</span><span>F</span></div></div><div class="money-actions"><button class="btn" data-action="fuel-quick" data-l="1">Pertalite 1L</button><button class="btn" data-action="fuel-quick" data-l="2">Pertalite 2L</button><button class="btn" data-action="fuel-sheet">Pertamax</button></div><div class="glass card chart-card"><div class="between"><b>Fuel Balance</b><span class="pill">7 Hari</span></div>${fuelChart()}</div><div class="section-head"><h2>History</h2><small>${state.fuel.logs.length}</small></div><div class="glass card">${state.fuel.logs.slice(-4).reverse().map(l=>`<div class="history-row"><div><b>${fmtL(l.liters)}</b><br><small>${new Date(l.ts).toLocaleDateString('id-ID')} · ${l.type}</small></div><div>${fmtRp(l.amount)}</div></div>`).join('')||'<p class="muted">Belum ada isi BBM.</p>'}</div>` }
function fuelChart(){ const data=state.fuel.balance.slice(-6); const max=Math.max(state.fuel.tank,4,...data.map(x=>x.l)); const pts=data.map((p,i)=>[28+(i*(290/(Math.max(1,data.length-1)))), 155 - (p.l/max*130)]); const path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' '); return `<svg class="chart-svg" viewBox="0 0 350 180"><g stroke="currentColor" opacity=".15"><path d="M28 25H330M28 68H330M28 112H330M28 155H330"/></g><text x="1" y="158" fill="currentColor" opacity=".65" font-size="11">0L</text><text x="1" y="30" fill="currentColor" opacity=".65" font-size="11">${max.toFixed(1)}L</text><path d="${path}" fill="none" stroke="#2d8cff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><g>${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#071525" stroke="#69b6ff" stroke-width="2"/><text x="${p[0]-12}" y="${p[1]-10}" fill="currentColor" font-size="11">${data[i].l.toFixed(1)}L</text>`).join('')}</g></svg>` }
function money(){ return `<div class="segment"><button class="seg ${moneyMode==='money'?'active':''}" data-money-mode="money">Money</button><button class="seg ${moneyMode==='collection'?'active':''}" data-money-mode="collection">Collection</button></div>${moneyMode==='money'?moneyMain():collection()}` }
function moneyMain(){ const spent=monthSpend(), pct=clamp(spent/state.money.budget*100,0,100); const cats=['Fuel','Service','Modif','Tools','Other']; return `<div class="glass card money-hero"><div class="between"><span>Budget Bulanan</span><span class="pill">Budget ${fmtRp(state.money.budget)}</span></div><h1>${fmtRp(spent)}</h1><p class="muted">Total terpakai bulan ini</p><div class="progress"><span style="--w:${pct}%"></span></div><div class="between"><b style="color:var(--green)">Sisa ${fmtRp(Math.max(0,state.money.budget-spent))}</b><b>${pct.toFixed(0)}%</b></div></div><div class="money-actions"><button class="btn" data-action="expense-sheet">Tambah Expense</button><button class="btn" data-action="saving-add">Celengan +10k</button><button class="btn" data-action="budget-add">+25k</button></div><div class="glass card"><div class="between"><b>Breakdown Pengeluaran</b><button class="btn" data-money-mode="collection">Collection</button></div>${cats.map((c,i)=>{const v=monthSpend(c), w=spent?v/spent*100:0, colors=['#248bff','#35df7c','#ad6bff','#ffb33e','#8694a7']; return `<div class="bar-row"><span>${c}</span><div class="bar-track"><div class="bar-fill" style="--c:${colors[i]};--w:${w}%"></div></div><span>${w.toFixed(0)}%</span><span>${fmtRp(v)}</span></div>`}).join('')}</div><div class="section-head"><h2>Transaksi</h2><small>${state.money.expenses.length}</small></div><div class="glass card">${state.money.expenses.slice(-5).reverse().map(e=>`<div class="txn"><div class="ico">${e.cat==='Fuel'?'⛽':e.cat==='Service'?'🔧':e.cat==='Modif'?'🧩':'▣'}</div><div><b>${esc(e.title)}</b><small>${esc(e.desc||e.cat)}</small></div><b>-${fmtRp(e.amount)}</b></div>`).join('')||'<p class="muted">Belum ada transaksi.</p>'}</div>` }
function collection(){ if(selectedCat) return collectionDetail(selectedCat); return `<div class="glass card"><h2>Collection</h2><p class="muted">Box-box part, link produk, konsep style, dan pengetahuan modif.</p><div class="cat-grid">${PARTS.map(p=>`<button class="cat-card" data-cat="${p.id}"><div class="pic">${p.icon}</div><div><b>${p.name}</b><br><span>${p.count}</span></div></button>`).join('')}</div><button class="btn block" style="margin-top:12px" data-action="product-sheet">+ Tambah Produk / Link</button></div><div class="section-head"><h2>Konsep / Style</h2><small>inspirasi</small></div><div class="style-row">${STYLES.map(s=>`<button class="style-card"><div class="style-thumb">${s.icon}</div><b>${s.name}</b><small>${s.count}</small></button>`).join('')}</div><div class="section-head"><h2>Pilihan Produk</h2><small>${state.products.length}</small></div><div class="product-grid">${state.products.slice(0,4).map(productCard).join('')}</div>` }
function collectionDetail(id){ const p=PARTS.find(x=>x.id===id); const items=state.products.filter(x=>x.cat.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]) || p.name.toLowerCase().includes(x.cat.toLowerCase()) || (id==='style'&&x.cat==='Style')); return `<button class="btn" data-action="cat-back">← Back</button><div class="section-head"><h2>${p.name}</h2><small>${items.length||'default'} item</small></div><div class="product-grid">${(items.length?items:state.products).map(productCard).join('')}</div><button class="btn primary block" style="margin-top:12px" data-action="product-sheet" data-catname="${p.name}">+ Tambah ${p.name}</button><div class="glass card" style="margin-top:12px"><b>Catatan ${p.name}</b><p class="muted">Simpan link produk, foto URL, harga, dan pengetahuan kecil biar gampang dibandingin sama Kang Rusdi.</p></div>` }
function productCard(p){ return `<div class="product"><div class="product-pic">${p.icon||'🧩'}</div><b>${esc(p.name)}</b><small class="muted">${esc(p.cat)}</small><div class="price">${fmtRp(p.price)}</div><button class="link-btn" data-open="${esc(p.link)}">Buka Link ↗</button></div>` }
function assist(){ const msgs=state.assist.messages.slice(-4).map(m=>`<div class="bubble ${m.role==='me'?'me':''}">${esc(m.text)}</div>`).join(''); return `<div class="glass card chat-card"><div class="between"><div class="row"><div class="avatar">👨‍🔧</div><div><b>Kang Rusdi</b><p class="muted">Asisten Anda</p></div></div><span class="pill green">● Online</span></div>${msgs}<div class="chat-input"><input id="assistInput" placeholder="Tulis pesan..."/><button class="btn primary" data-action="assist-send">Kirim</button></div></div><div class="section-head"><h2>Emergency & Guide</h2><small>darurat</small></div><div class="guide-grid">${Object.entries(GUIDES).map(([k,g])=>`<button class="guide" data-guide="${k}"><span class="gico">${g.icon}</span><b>${g.title}</b></button>`).join('')}</div><div class="section-head"><h2>Bantuan Cepat</h2></div><div class="help-chips chips"><button class="chip" data-guide="fi">Kode FI umum</button><button class="chip" data-guide="mogok">Motor mogok</button><button class="chip" data-guide="busi">Busi mati</button><button class="chip" data-guide="cvt">CVT getar</button></div>` }

function openSheet(html){ $('#sheetContent').innerHTML=html; $('#sheetWrap').classList.add('show'); $('#sheetWrap').setAttribute('aria-hidden','false'); }
function closeSheet(){ $('#sheetWrap').classList.remove('show'); $('#sheetWrap').setAttribute('aria-hidden','true'); }
function sheetKm(){ openSheet(`<h3>Catat KM Hari Ini</h3><div class="field"><label>KM perjalanan</label><input id="kmVal" type="number" step="0.1" placeholder="contoh 5"/></div><div class="field"><label>Catatan</label><input id="kmNote" placeholder="sekolah, bengkel, muter"/></div><button class="btn primary block" data-action="save-km-sheet">Simpan KM</button>`); }
function sheetFuel(){ openSheet(`<h3>Isi BBM</h3><div class="field"><label>Jenis</label><select id="fuelType"><option>Pertalite</option><option>Pertamax</option><option>Shell Super</option></select></div><div class="field"><label>Liter</label><input id="fuelLiter" type="number" step="0.01" placeholder="2"/></div><div class="field"><label>Harga total</label><input id="fuelAmount" type="number" placeholder="20000"/></div><button class="btn primary block" data-action="save-fuel-sheet">Simpan Fuel</button>`); }
function sheetExpense(){ openSheet(`<h3>Tambah Expense</h3><div class="field"><label>Nama</label><input id="exTitle" placeholder="Oli mesin / stop lamp"/></div><div class="field"><label>Kategori</label><select id="exCat"><option>Fuel</option><option>Service</option><option>Modif</option><option>Tools</option><option>Other</option></select></div><div class="field"><label>Nominal</label><input id="exAmount" type="number" placeholder="65000"/></div><div class="field"><label>Catatan</label><input id="exDesc" placeholder="toko / merek"/></div><button class="btn primary block" data-action="save-expense-sheet">Simpan Expense</button>`); }
function sheetProduct(defaultCat=''){ openSheet(`<h3>Tambah Collection</h3><div class="field"><label>Nama produk</label><input id="prName" placeholder="Stop lamp running / ECU Juken"/></div><div class="field"><label>Kategori</label><select id="prCat">${PARTS.map(p=>`<option ${defaultCat===p.name?'selected':''}>${p.name}</option>`).join('')}</select></div><div class="field"><label>Harga</label><input id="prPrice" type="number" placeholder="85000"/></div><div class="field"><label>Link produk</label><input id="prLink" placeholder="https://..."/></div><div class="field"><label>Catatan</label><textarea id="prNote" placeholder="cocok konsep apa, plus minus, dll"></textarea></div><button class="btn primary block" data-action="save-product-sheet">Simpan Collection</button>`); }
function sheetRoute(field){ const val=state.route[field] || ''; openSheet(`<h3>Edit ${field}</h3><div class="field"><label>${field}</label><input id="routeText" value="${esc(val)}"/></div><div class="field"><label>Jarak jalan (km)</label><input id="routeKm" type="number" step="0.1" value="${state.route.km}"/></div><button class="btn primary block" data-action="save-route-sheet" data-field="${field}">Simpan Rute</button>`); }
function sheetService(){ openSheet(`<h3>Reset Service</h3>${SERVICES.map(s=>`<button class="btn block" style="margin:6px 0" data-action="service-reset" data-key="${s.key}">${s.icon} ${s.name}</button>`).join('')}`); }
function sheetGuide(k){ const g=GUIDES[k]; openSheet(`<h3>${g.icon} ${g.title}</h3><ol class="note-list">${g.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><button class="btn primary block" data-action="close-sheet">Paham</button>`); }
function sheetSettings(){ openSheet(`<h3>Settings</h3><button class="btn block" data-action="theme-dark">Dark Mode</button><button class="btn block" style="margin-top:8px" data-action="theme-light">Light Mode</button><button class="btn block" style="margin-top:8px" data-action="export-json">Export JSON</button><div class="field"><label>Import JSON</label><textarea id="importText" placeholder="paste backup JSON"></textarea></div><button class="btn primary block" data-action="import-json">Import</button>`); }

function addKm(km,note='manual'){ km=num(km); state.kmLogs.push({ts:now(),km,note}); state.bike.virtualKm+=km; if(km>0){ const used=km/state.fuel.kmpl; state.fuel.liters=Math.max(0,state.fuel.liters-used); state.fuel.balance.push({ts:now(),l:state.fuel.liters}); } save(); render(); toast(`KM masuk ${fmtKm(km)}`); }
function addFuel(l,type='Pertalite',amount){ l=num(l); amount=num(amount, l*10000); state.fuel.liters=clamp(state.fuel.liters+l,0,state.fuel.tank); state.fuel.logs.push({ts:now(),type,liters:l,amount}); state.fuel.balance.push({ts:now(),l:state.fuel.liters}); state.money.expenses.push({ts:now(),cat:'Fuel',title:`${type} ${l}L`,desc:'auto fuel',amount}); save(); render(); toast(`Fuel masuk ${fmtL(l)}`); }
function localReply(text){ const t=text.toLowerCase(); if(t.includes('fi')||t.includes('kedip')) return 'FI code: kedipan panjang = 10, pendek = 1. Catat jumlahnya dulu, jangan langsung vonis sensor.'; if(t.includes('busi')||t.includes('starter')) return 'Cek aki dulu, cop busi, kondisi busi, lalu bensin. Kalau starter pagi berat bisa aki mulai lemah atau busi aus.'; if(t.includes('boros')||t.includes('fuel')||t.includes('bensin')) return `Sisa fuel ${fmtL(state.fuel.liters)}, estimasi range ${fmtKm(range())}. Kalau boros, cek ban, CVT, busi, dan gaya stop-go.`; return `Scan singkat: KM ${fmtKm(state.bike.virtualKm)}, fuel ${fmtL(state.fuel.liters)}, money bulan ini ${fmtRp(monthSpend())}. Ada gejala apa?`; }

function handleClick(e){ const b=e.target.closest('button,[data-tabgo],[data-open],[data-cat],[data-guide]'); if(!b) return; const a=b.dataset.action;
  if(b.dataset.tab){ active=b.dataset.tab; selectedCat=null; render(); return; }
  if(b.dataset.tabgo){ active=b.dataset.tabgo; render(); return; }
  if(b.dataset.open){ window.open(b.dataset.open,'_blank'); return; }
  if(b.dataset.cat){ selectedCat=b.dataset.cat; render(); return; }
  if(b.dataset.guide){ sheetGuide(b.dataset.guide); return; }
  if(b.dataset.moneyMode){ moneyMode=b.dataset.moneyMode; selectedCat=null; render(); return; }
  if(a==='close-sheet') closeSheet();
  if(a==='settings') sheetSettings();
  if(a==='km-sheet') sheetKm();
  if(a==='fuel-sheet') sheetFuel();
  if(a==='expense-sheet') sheetExpense();
  if(a==='product-sheet') sheetProduct(b.dataset.catname||'');
  if(a==='service-sheet') sheetService();
  if(a==='km-add') addKm(num(b.dataset.km));
  if(a==='fuel-quick') addFuel(num(b.dataset.l),'Pertalite',num(b.dataset.l)*10000);
  if(a==='save-km-sheet'){ addKm($('#kmVal').value,$('#kmNote').value); closeSheet(); }
  if(a==='save-fuel-sheet'){ addFuel($('#fuelLiter').value,$('#fuelType').value,$('#fuelAmount').value); closeSheet(); }
  if(a==='save-expense-sheet'){ state.money.expenses.push({ts:now(),cat:$('#exCat').value,title:$('#exTitle').value||$('#exCat').value,desc:$('#exDesc').value,amount:num($('#exAmount').value)}); save(); render(); closeSheet(); toast('Expense masuk'); }
  if(a==='save-product-sheet'){ state.products.unshift({cat:$('#prCat').value,name:$('#prName').value||'Produk baru',price:num($('#prPrice').value),link:$('#prLink').value||'#',note:$('#prNote').value,icon:PARTS.find(p=>p.name===$('#prCat').value)?.icon||'🧩'}); save(); render(); closeSheet(); toast('Collection masuk'); }
  if(a==='route-sheet') sheetRoute(b.dataset.field);
  if(a==='save-route-sheet'){ const f=b.dataset.field; state.route[f]=$('#routeText').value; state.route.km=num($('#routeKm').value,state.route.km); save(); render(); closeSheet(); }
  if(a==='route-calc'){ state.route.points=Math.max(4,Math.round(state.route.km*6)); save(); render(); toast('Rute dihitung'); }
  if(a==='route-add-km'){ addKm(state.route.km,'route'); active='home'; render(); }
  if(a==='route-save'){ toast('Rute disimpan'); }
  if(a==='route-reset'){ state.route={start:'Jl. Raya Jatiwaringin',dest:'Jl. Raya Hankam',stop:'Opsional',km:1.9,points:12}; save(); render(); }
  if(a==='saving-add'){ state.money.savings+=10000; save(); toast('Celengan +10k'); }
  if(a==='budget-add'){ state.money.budget+=25000; save(); render(); }
  if(a==='service-reset'){ state.service[b.dataset.key]={lastKm:state.bike.virtualKm,lastTs:now()}; save(); render(); closeSheet(); toast('Service direset'); }
  if(a==='assist-send'){ const inp=$('#assistInput'); const text=inp.value.trim(); if(!text)return; state.assist.messages.push({role:'me',text}); state.assist.messages.push({role:'bot',text:localReply(text)}); save(); render(); }
  if(a==='theme-dark'){ setTheme('dark'); closeSheet(); }
  if(a==='theme-light'){ setTheme('light'); closeSheet(); }
  if(a==='export-json'){ navigator.clipboard?.writeText(JSON.stringify(state)); toast('JSON dicopy'); }
  if(a==='import-json'){ try{ state=norm(JSON.parse($('#importText').value)); save(); render(); closeSheet(); toast('Import aman'); }catch{ toast('JSON error'); } }
  if(a==='cat-back'){ selectedCat=null; render(); }
}

document.addEventListener('click',handleClick);
$('#themeBtn').addEventListener('click',()=>setTheme(state.theme==='light'?'dark':'light'));
setTheme(state.theme||'dark');
render();
if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }
