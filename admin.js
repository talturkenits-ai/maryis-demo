/* דף ניהול – סקיצת הדגמה.
   הכניסה כאן היא להדגמה בלבד. באתר האמיתי האימות והנתונים יהיו בשרת. */

const DEMO_PASSWORD = '1234';
const SESSION_KEY = 'hamin_admin_ok';
const STATUS = { new: 'חדשה', preparing: 'בהכנה', ready: 'מוכנה', done: 'הושלמה', cancelled: 'בוטלה' };
const TABS = [
  ['orders', 'הזמנות'],
  ['menu', 'תפריט ומלאי'],
  ['days', 'ימים ושעות'],
  ['delivery', 'משלוח ואיסוף'],
  ['data', 'נתונים'],
];

let DB = loadDB();
let tab = 'orders';
let menuDay = DB.days[0].id;
let fDay = 'all';
let fStatus = 'all';

const sessionOk = () => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; } };
const setSession = v => { try { v ? sessionStorage.setItem(SESSION_KEY, '1') : sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ } };
const dayName = id => (DB.days.find(d => d.id === id) || {}).label || '';

let toastTimer;
function notify(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 1800);
}
function save() {
  saveDB(DB);
  notify('נשמר');
}

function sampleOrders() {
  const mk = (id, minsAgo, o) => ({
    id, createdAt: new Date(Date.now() - minsAgo * 60000).toISOString(), status: 'new', notes: '', apt: '', demo: true, ...o,
  });
  return [
    mk('MR-3021', 25, {
      dayId: 'thu', day: 'יום חמישי', fulfil: 'delivery', slot: '16:00–18:00', city: 'רמת גן', street: 'ז׳בוטינסקי 14', apt: 'קומה 2',
      customer: { name: 'דנה לוי', phone: '052-1112233' }, notes: 'בלי חריף בבקשה',
      items: [{ name: 'חמין קלאסי של מרי', qty: 2, price: 58 }, { name: 'ג׳חנון', qty: 1, price: 32 }, { name: 'חומוס ביתי', qty: 2, price: 29 }],
      subtotal: 206, fee: 35, total: 241, pay: 'card',
    }),
    mk('MR-3017', 140, {
      dayId: 'thu', day: 'יום חמישי', fulfil: 'pickup', slot: '14:00–16:00', status: 'preparing',
      customer: { name: 'יוסי כהן', phone: '054-5556677' },
      items: [{ name: 'חמין משפחתי', qty: 1, price: 160 }, { name: 'קוגל תפוחי אדמה', qty: 1, price: 38 }],
      subtotal: 198, fee: 0, total: 198, pay: 'cash',
    }),
    mk('MR-3009', 600, {
      dayId: 'fri', day: 'יום שישי', fulfil: 'pickup', slot: '11:00–13:00', status: 'done',
      customer: { name: 'מיכל אברהם', phone: '050-9988776' },
      items: [{ name: 'לאפה במילוי חמין', qty: 3, price: 42 }, { name: 'עוגת שוקולד ביתית', qty: 1, price: 45 }],
      subtotal: 171, fee: 0, total: 171, pay: 'card',
    }),
  ];
}

const waLink = phone => {
  const d = String(phone).replace(/\D/g, '');
  return 'https://wa.me/' + (d.startsWith('0') ? '972' + d.slice(1) : d);
};
const when = iso => new Date(iso).toLocaleString('he-IL', { weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });

/* ---------- Tabs ---------- */
function renderTabs() {
  const newCount = loadOrders().filter(o => o.status === 'new').length;
  $('#tabs').innerHTML = TABS.map(([id, label]) =>
    `<button type="button" role="tab" data-tab="${id}" aria-selected="${id === tab}">${label}${id === 'orders' && newCount ? `<span class="tab-badge">${newCount}</span>` : ''}</button>`).join('');
}

function render() {
  renderTabs();
  $('#panel').innerHTML = { orders: ordersView, menu: menuView, days: daysView, delivery: deliveryView, data: dataView }[tab]();
}

/* ---------- Orders ---------- */
const filteredOrders = () => loadOrders().filter(o => (fDay === 'all' || o.dayId === fDay) && (fStatus === 'all' || o.status === fStatus));

function prepData(list) {
  const byDay = {};
  list.filter(o => o.status !== 'cancelled' && o.status !== 'done').forEach(o => {
    const m = byDay[o.day] = byDay[o.day] || {};
    o.items.forEach(i => { m[i.name] = (m[i.name] || 0) + i.qty; });
  });
  return byDay;
}

async function copyPrep(btn) {
  const text = Object.entries(prepData(filteredOrders()))
    .map(([day, items]) => day + '\n' + Object.entries(items).sort((a, b) => b[1] - a[1]).map(([n, q]) => `${q} × ${n}`).join('\n'))
    .join('\n\n') || 'אין כרגע מנות להכנה';
  const old = btn.textContent;
  try { await navigator.clipboard.writeText(text); btn.textContent = 'הועתק'; }
  catch { btn.textContent = 'ההעתקה נחסמה בדפדפן'; }
  setTimeout(() => { btn.textContent = old; }, 1600);
}

function prepSummary(list) {
  const days = Object.entries(prepData(list));
  if (!days.length) return '<p class="muted">אין כרגע מנות להכנה.</p>';
  return days.map(([day, items]) => `
    <h4>${esc(day)}</h4>
    <table><tbody>${Object.entries(items).sort((a, b) => b[1] - a[1]).map(([n, q]) => `<tr><td>${esc(n)}</td><td>${q}</td></tr>`).join('')}</tbody></table>`).join('');
}

function orderCard(o) {
  const delivery = o.fulfil === 'delivery';
  const addr = delivery ? `${o.city}, ${o.street}${o.apt ? ' (' + o.apt + ')' : ''}` : '';
  return `
  <article class="order st-${o.status}">
    <div class="order-head">
      <h3>${esc(o.id)} <small>${esc(when(o.createdAt))}${o.demo ? ' · לדוגמה' : ''}</small></h3>
      <div>
        <span class="pill ${delivery ? 'deliv' : 'pick'}">${delivery ? 'משלוח' : 'איסוף'}</span>
        <span class="pill ${o.pay === 'card' ? 'card' : 'cash'}">${o.pay === 'card' ? 'שולם בכרטיס' : 'מזומן לגבייה'}</span>
      </div>
    </div>
    <div class="order-grid">
      <ul>${o.items.map(i => `<li>${i.qty} × ${esc(i.name)}</li>`).join('')}</ul>
      <div>
        <p class="meta"><b>${esc(o.day)}</b> · ${esc(o.slot)}</p>
        <p class="meta"><b>${esc(o.customer.name)}</b> · <a href="tel:${esc(o.customer.phone)}" dir="ltr">${esc(o.customer.phone)}</a></p>
        ${addr ? `<p class="meta">${esc(addr)}</p>` : ''}
        ${o.notes ? `<p class="meta">הערה: ${esc(o.notes)}</p>` : ''}
        <p class="meta"><b>סה״כ ${fmt(o.total)}</b>${o.fee ? ` (כולל משלוח ${fmt(o.fee)})` : ''}${o.pay === 'cash' ? ' · לגבות במסירה' : ''}</p>
      </div>
    </div>
    <div class="order-actions no-print">
      <label>סטטוס:
        <select data-status="${esc(o.id)}">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === o.status ? 'selected' : ''}>${v}</option>`).join('')}</select>
      </label>
      <a href="${waLink(o.customer.phone)}" target="_blank" rel="noopener">וואטסאפ ללקוח</a>
    </div>
  </article>`;
}

function ordersView() {
  const all = loadOrders();
  const list = all.filter(o => (fDay === 'all' || o.dayId === fDay) && (fStatus === 'all' || o.status === fStatus));
  const live = all.filter(o => o.status !== 'cancelled');
  const sum = live.reduce((s, o) => s + o.total, 0);
  return `
    <h2>הזמנות</h2>
    <p class="sub">הזמנות חדשות מהאתר מופיעות כאן מיד.</p>
    <div class="stats">
      <div class="stat ${all.some(o => o.status === 'new') ? 'hot' : ''}"><b>${all.filter(o => o.status === 'new').length}</b><span>חדשות</span></div>
      <div class="stat"><b>${live.length}</b><span>הזמנות פעילות</span></div>
      <div class="stat"><b>${live.filter(o => o.fulfil === 'pickup').length} / ${live.filter(o => o.fulfil === 'delivery').length}</b><span>איסוף / משלוח</span></div>
      <div class="stat"><b>${fmt(sum)}</b><span>סה״כ מכירות</span></div>
    </div>
    <div class="toolbar no-print">
      <label class="field"><span>יום</span><select data-filter="day"><option value="all">כל הימים</option>${DB.days.map(d => `<option value="${d.id}" ${fDay === d.id ? 'selected' : ''}>${esc(d.label)}</option>`).join('')}</select></label>
      <label class="field"><span>סטטוס</span><select data-filter="status"><option value="all">הכל</option>${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${fStatus === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <button type="button" class="btn ghost" data-act="copy-prep">העתקת סיכום להכנה</button>
    </div>
    <details class="card prep" open>
      <summary><h3 style="display:inline">סיכום להכנה</h3> <span class="muted">(הזמנות שעוד לא הושלמו)</span></summary>
      ${prepSummary(list)}
    </details>
    ${list.length ? list.map(orderCard).join('') : '<div class="empty-box card">אין הזמנות להצגה.</div>'}`;
}

/* ---------- Menu & stock ---------- */
function menuView() {
  const items = DB.items.filter(i => i.day === menuDay);
  const out = items.filter(i => i.out).length;
  const cats = [...new Set(items.map(i => i.cat))];
  return `
    <h2>תפריט ומלאי</h2>
    <p class="sub">המתג הירוק אומר שהמנה במלאי ופתוחה להזמנה. כיבוי שלו מסמן "אזל" באתר. כל שינוי נשמר מיד.</p>
    <div class="toolbar">
      <div class="seg" style="min-width:260px">${DB.days.map(d => `<label><input type="radio" name="menuDay" value="${d.id}" ${d.id === menuDay ? 'checked' : ''} data-menu-day><span>${esc(d.label)}</span></label>`).join('')}</div>
      <span class="muted">${items.length - out} במלאי · ${out} אזלו</span>
      <button type="button" class="btn ghost sm" data-act="all-in">החזרת הכל למלאי</button>
    </div>
    <div class="card">
      ${cats.map(c => `
        <h3 class="cat-title">${esc(c)}</h3>
        ${items.filter(i => i.cat === c).map(i => `
          <div class="a-row ${i.out ? 'is-out' : ''}">
            <label class="switch"><input type="checkbox" data-stock="${i.id}" ${i.out ? '' : 'checked'}><span class="sr">במלאי</span></label>
            <div class="a-fields">
              <input type="text" data-id="${i.id}" data-field="name" value="${esc(i.name)}" aria-label="שם המנה">
              <input type="text" data-id="${i.id}" data-field="desc" value="${esc(i.desc)}" placeholder="תיאור (לא חובה)" aria-label="תיאור">
            </div>
            <label class="a-price"><input type="number" min="0" step="1" data-id="${i.id}" data-field="price" value="${i.price}" aria-label="מחיר">₪</label>
            <button type="button" class="btn danger sm a-del" data-act="del-item" data-id="${i.id}">מחיקה</button>
          </div>`).join('')}`).join('') || '<p class="muted">אין עדיין מנות ליום הזה.</p>'}
    </div>
    <form class="card" id="addItem">
      <h3>הוספת מנה ל${esc(dayName(menuDay))}</h3>
      <div class="inline-form">
        <label class="field"><span>שם המנה</span><input type="text" name="name" required></label>
        <label class="field"><span>קטגוריה</span><input type="text" name="cat" list="cats" required><datalist id="cats">${cats.map(c => `<option value="${esc(c)}">`).join('')}</datalist></label>
        <label class="field"><span>מחיר ₪</span><input type="number" name="price" min="0" step="1" required></label>
        <label class="field"><span>תיאור</span><input type="text" name="desc"></label>
        <button type="submit" class="btn alt">הוספה</button>
      </div>
    </form>`;
}

/* ---------- Days & hours ---------- */
function daysView() {
  return `
    <h2>ימים ושעות</h2>
    <p class="sub">פתיחה וסגירה של הזמנות לכל יום, הודעה ללקוחות, וחלונות הזמן לאיסוף ולמשלוח.</p>
    ${DB.days.map(d => `
      <div class="card day-card" data-day-id="${d.id}">
        <div class="top">
          <h3>${esc(d.label)}</h3>
          <label class="switch"><input type="checkbox" data-day-open ${d.open !== false ? 'checked' : ''}><span class="open-state ${d.open !== false ? 'on' : 'off'}">${d.open !== false ? 'פתוח להזמנות' : 'סגור להזמנות'}</span></label>
        </div>
        <label class="field"><span>היום (הכותרת באתר מתעדכנת אוטומטית, והימים מסודרים לפי סדר השבוע)</span>
          <select data-day-field="weekday">${WEEKDAYS.map(([k, v]) => `<option value="${k}" ${k === d.weekday ? 'selected' : ''}>${v}</option>`).join('')}</select>
        </label>
        <label class="field"><span>הודעה ללקוחות (שעת סגירה, זמני משלוח...)</span><textarea data-day-field="note" rows="2">${esc(d.note)}</textarea></label>
        <label class="field"><span>חלונות זמן לאיסוף ולמשלוח (חלון בכל שורה)</span><textarea data-day-field="slots" rows="4">${esc((d.slots || []).join('\n'))}</textarea></label>
      </div>`).join('')}`;
}

/* ---------- Delivery & pickup ---------- */
function deliveryView() {
  const s = DB.settings;
  return `
    <h2>משלוח ואיסוף</h2>
    <p class="sub">כתובת האיסוף, דמי משלוח לפי עיר, והזמנה מינימלית.</p>
    <div class="card">
      <h3>איסוף עצמי</h3>
      <div class="setting-grid">
        <label class="field"><span>כתובת האיסוף</span><input type="text" data-setting="pickupAddress" value="${esc(s.pickupAddress)}"></label>
        <label class="field"><span>הערה לשעות האיסוף (לא חובה)</span><input type="text" data-setting="pickupHours" value="${esc(s.pickupHours)}"></label>
      </div>
    </div>
    <div class="card">
      <h3>תנאי משלוח</h3>
      <div class="setting-grid">
        <label class="field"><span>הזמנה מינימלית למשלוח (₪, 0 = ללא)</span><input type="number" min="0" step="10" data-setting="minDelivery" data-num value="${s.minDelivery}"></label>
        <label class="field"><span>משלוח חינם מעל סכום (₪, 0 = ללא)</span><input type="number" min="0" step="10" data-setting="freeDeliveryFrom" data-num value="${s.freeDeliveryFrom}"></label>
      </div>
    </div>
    <div class="card">
      <h3>דמי משלוח לפי עיר</h3>
      ${DB.cities.map((c, i) => `
        <div class="city-row">
          <input type="text" data-city="${i}" data-city-field="name" value="${esc(c.name)}" aria-label="שם העיר">
          <label class="fee"><input type="number" min="0" step="1" data-city="${i}" data-city-field="fee" value="${c.fee}" aria-label="דמי משלוח">₪</label>
          <button type="button" class="btn danger sm" data-act="del-city" data-i="${i}">מחיקה</button>
        </div>`).join('')}
      <form id="addCity" class="city-row" style="margin-top:14px">
        <input type="text" name="name" placeholder="עיר חדשה" required aria-label="עיר חדשה">
        <label class="fee"><input type="number" name="fee" min="0" step="1" placeholder="מחיר" required aria-label="דמי משלוח">₪</label>
        <button type="submit" class="btn alt sm">הוספה</button>
      </form>
    </div>`;
}

/* ---------- Data ---------- */
function dataView() {
  return `
    <h2>נתונים</h2>
    <p class="sub">כלים להדגמה.</p>
    <div class="card">
      <h3>הזמנות</h3>
      <p class="muted">ההזמנות נשמרות בדפדפן הזה בלבד. באתר האמיתי הן יישמרו בשרת ויגיעו אליה בוואטסאפ או במייל.</p>
      <div class="toolbar" style="margin:10px 0 0">
        <button type="button" class="btn alt" data-act="demo-orders">הוספת הזמנות לדוגמה</button>
        <button type="button" class="btn danger" data-act="clear-orders">מחיקת כל ההזמנות</button>
      </div>
    </div>
    <div class="card">
      <h3>איפוס</h3>
      <p class="muted">מחזיר את התפריט, הימים, הערים וההגדרות לנתוני הדמו המקוריים.</p>
      <div class="toolbar" style="margin:10px 0 0"><button type="button" class="btn danger" data-act="reset">איפוס נתוני הדמו</button></div>
    </div>`;
}

/* ---------- Events ---------- */
const panel = $('#panel');

$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('[data-tab]');
  if (b) { tab = b.dataset.tab; render(); }
});

panel.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.filter) { (t.dataset.filter === 'day' ? (fDay = t.value) : (fStatus = t.value)); return render(); }
  if (t.dataset.status) {
    saveOrders(loadOrders().map(o => (o.id === t.dataset.status ? { ...o, status: t.value } : o)));
    return render();
  }
  if ('menuDay' in t.dataset) { menuDay = t.value; return render(); }
  if (t.dataset.stock) {
    const it = DB.items.find(i => i.id === t.dataset.stock);
    if (it) { it.out = !t.checked; save(); render(); }
    return;
  }
  if (t.dataset.field) {
    const it = DB.items.find(i => i.id === t.dataset.id);
    if (!it) return;
    if (t.dataset.field === 'price') {
      const v = Number(t.value);
      if (!(v >= 0) || t.value === '') { t.value = it.price; return; }
      it.price = v;
    } else if (t.dataset.field === 'name') {
      if (!t.value.trim()) { t.value = it.name; return; }
      it.name = t.value.trim();
    } else it.desc = t.value.trim();
    return save();
  }
  const card = t.closest('[data-day-id]');
  if (card) {
    const d = DB.days.find(x => x.id === card.dataset.dayId);
    if ('dayOpen' in t.dataset) { d.open = t.checked; save(); return render(); }
    const f = t.dataset.dayField;
    if (f === 'weekday') {
      if (DB.days.some(x => x !== d && x.weekday === t.value)) { notify('היום הזה כבר מוגדר, בחרו יום אחר'); return render(); }
      const old = d.label;
      d.weekday = t.value;
      d.label = WEEKDAY_LABEL[t.value];
      if (old !== d.label) d.note = d.note.split(old).join(d.label); // שם היום בהודעה מתעדכן גם הוא
      sortDays(DB.days);
      save();
      return render();
    }
    if (f === 'slots') d.slots = t.value.split('\n').map(s => s.trim()).filter(Boolean);
    else if (f === 'note') d.note = t.value.trim();
    return save();
  }
  if (t.dataset.setting) {
    DB.settings[t.dataset.setting] = 'num' in t.dataset ? Math.max(0, Number(t.value) || 0) : t.value.trim();
    return save();
  }
  if (t.dataset.cityField) {
    const c = DB.cities[Number(t.dataset.city)];
    if (!c) return;
    if (t.dataset.cityField === 'fee') c.fee = Math.max(0, Number(t.value) || 0);
    else if (t.value.trim()) c.name = t.value.trim(); else t.value = c.name;
    save();
  }
});

panel.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'copy-prep') copyPrep(b);
  else if (act === 'all-in') { DB.items.filter(i => i.day === menuDay).forEach(i => { i.out = false; }); save(); render(); }
  else if (act === 'del-item') {
    const it = DB.items.find(i => i.id === b.dataset.id);
    if (it && await askConfirm(`למחוק את "${it.name}" מהתפריט?`, 'מחיקה')) { DB.items = DB.items.filter(i => i !== it); save(); render(); }
  } else if (act === 'del-city') {
    const c = DB.cities[Number(b.dataset.i)];
    if (c && await askConfirm(`להסיר את ${c.name} מרשימת המשלוחים?`, 'הסרה')) { DB.cities.splice(Number(b.dataset.i), 1); save(); render(); }
  } else if (act === 'demo-orders') { saveOrders([...sampleOrders().filter(s => !loadOrders().some(o => o.id === s.id)), ...loadOrders()]); render(); }
  else if (act === 'clear-orders') { if (await askConfirm('למחוק את כל ההזמנות?', 'מחיקה')) { saveOrders([]); render(); } }
  else if (act === 'reset') {
    if (await askConfirm('לאפס את כל נתוני הדמו (תפריט, ימים, ערים, הגדרות)?', 'איפוס')) {
      DB = structuredClone(DEFAULT_DB); menuDay = DB.days[0].id; save(); render();
    }
  }
});

panel.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  if (e.target.id === 'addItem') {
    DB.items.push({
      id: 'i' + Date.now().toString(36), day: menuDay,
      cat: String(f.get('cat')).trim(), name: String(f.get('name')).trim(),
      desc: String(f.get('desc')).trim(), price: Math.max(0, Number(f.get('price')) || 0),
    });
    save(); render();
  } else if (e.target.id === 'addCity') {
    DB.cities.push({ name: String(f.get('name')).trim(), fee: Math.max(0, Number(f.get('fee')) || 0) });
    save(); render();
  }
});

/* הזמנות חדשות מהאתר מופיעות מיד, גם אם דף הניהול כבר פתוח */
window.addEventListener('storage', e => {
  if (e.key === ORDERS_KEY && tab === 'orders') render();
  else if (e.key === ORDERS_KEY) renderTabs();
});

/* ---------- Login ---------- */
function start() {
  $('#login').hidden = true; $('#app').hidden = false;
  if (!ls.has(ORDERS_KEY)) saveOrders(sampleOrders());
  render();
}
$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  if ($('#pass').value === DEMO_PASSWORD) { setSession(true); start(); }
  else { $('#loginErr').hidden = false; $('#pass').select(); }
});
$('#logout').addEventListener('click', () => { setSession(false); location.reload(); });
if (sessionOk()) start();
