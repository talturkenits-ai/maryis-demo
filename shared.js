/* נתונים וכלים משותפים לאתר ההזמנות ולדף הניהול (סקיצת הדגמה).
   בדמו הכל נשמר ב-localStorage של הדפדפן; באתר האמיתי זה יעבור למסד נתונים בשרת. */

const DB_KEY = 'hamin_store_v1';
const ORDERS_KEY = 'hamin_orders';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => '₪' + (Math.round(n * 100) / 100);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  has(k) { try { return localStorage.getItem(k) !== null; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

const DEFAULT_DB = {
  settings: {
    pickupAddress: 'כתובת האיסוף תימסר בעת אישור ההזמנה',
    pickupHours: '',
    freeDeliveryFrom: 400,
    minDelivery: 120,
  },
  cities: [
    { name: 'פתח תקווה', fee: 25 },
    { name: 'ראש העין', fee: 30 },
    { name: 'כפר סבא', fee: 30 },
    { name: 'הוד השרון', fee: 30 },
    { name: 'רמת גן', fee: 35 },
    { name: 'ראשון לציון', fee: 40 },
    { name: 'תל אביב', fee: 40 },
  ],
  days: [
    {
      id: 'fri', weekday: 'fri', label: 'יום שישי', open: true,
      note: 'הזמנות עד יום חמישי ב-12:00 · איסוף ומשלוח ביום שישי',
      slots: ['09:00–11:00', '11:00–13:00', '13:00–14:30'],
    },
    {
      id: 'sat', weekday: 'motzash', label: 'מוצאי שבת', open: true,
      note: 'הזמנות עד יום שישי ב-12:00 · איסוף ומשלוח במוצאי שבת, מרגע צאת השבת',
      slots: ['19:30–20:30', '20:30–21:30', '21:30–22:30'],
    },
  ],
  items: [
    { id: 'f1', day: 'fri', cat: 'החמין', name: 'חמין קלאסי של מרי', desc: 'בשר, תפוחי אדמה, שעועית, שעורה וביצה חומה. מנה אישית', price: 58 },
    { id: 'f2', day: 'fri', cat: 'החמין', name: 'חמין משפחתי', desc: 'קדרה גדולה ל-3 מנות, מוכנה להגשה', price: 160 },
    { id: 'f3', day: 'fri', cat: 'החמין', name: 'חמין צמחוני', desc: 'שעועית, חומוס, בטטה ושעורה בתיבול ביתי. מנה אישית', price: 48 },
    { id: 'f4', day: 'fri', cat: 'ראשונות', name: 'גפילטע פיש', desc: 'קציצות דג ביתיות עם גזר. 6 יחידות', price: 89 },
    { id: 'f5', day: 'fri', cat: 'ראשונות', name: 'מרק עוף ביתי', desc: 'מרק עוף עם ירקות. 3 ליטר', price: 48 },
    { id: 'f6', day: 'fri', cat: 'עיקריות', name: 'לשון בקר ברוטב', desc: 'לשון בקר מבושלת לאט ברוטב עשיר. 4 מנות', price: 155 },
    { id: 'f7', day: 'fri', cat: 'עיקריות', name: 'צלי בקר ברוטב יין אדום', desc: 'בשר רך ברוטב יין, לשבת. 4 מנות', price: 190, out: true },
    { id: 'f8', day: 'fri', cat: 'עיקריות', name: 'קציצות בקר ברוטב עגבניות', desc: 'קציצות ביתיות. 8 יחידות', price: 105 },
    { id: 'f9', day: 'fri', cat: 'תוספות', name: 'בטטה אפויה בתיבול חריף-מתוק', desc: '1 ליטר. ללא גלוטן, טבעוני', price: 65 },
    { id: 'f10', day: 'fri', cat: 'תוספות', name: 'אורז עם ירקות', desc: '1 ליטר. ללא גלוטן, טבעוני', price: 65 },
    { id: 'f11', day: 'fri', cat: 'תוספות', name: 'קוגל תפוחי אדמה', desc: 'קוגל פריך מבחוץ ורך מבפנים', price: 38 },
    { id: 'f12', day: 'fri', cat: 'תוספות', name: 'ג׳חנון', desc: 'עם ביצה קשה, סחוג ועגבנייה מגורדת', price: 32 },
    { id: 'f13', day: 'fri', cat: 'סלטים (250 גרם)', name: 'סלט חצילים בשום וכוסברה', desc: '', price: 29 },
    { id: 'f14', day: 'fri', cat: 'סלטים (250 גרם)', name: 'חומוס ביתי', desc: '', price: 29 },
    { id: 'f15', day: 'fri', cat: 'סלטים (250 גרם)', name: 'מטבוחה', desc: '', price: 29 },
    { id: 'f16', day: 'fri', cat: 'סלטים (250 גרם)', name: 'חזרת ביתית', desc: '', price: 29 },
    { id: 'f17', day: 'fri', cat: 'סלטים (250 גרם)', name: 'כרוב לבן', desc: '', price: 25 },
    { id: 's1', day: 'sat', cat: 'מנות חמות', name: 'חמין קלאסי של מרי', desc: 'חם מהקדרה, מנה אישית', price: 58 },
    { id: 's2', day: 'sat', cat: 'מנות חמות', name: 'לאפה במילוי חמין', desc: 'לאפה חמה עם חמין, ביצה חומה וסחוג', price: 42 },
    { id: 's3', day: 'sat', cat: 'מנות חמות', name: 'ג׳חנון', desc: 'עם ביצה קשה, סחוג ועגבנייה מגורדת', price: 32 },
    { id: 's4', day: 'sat', cat: 'מנות חמות', name: 'מרק עוף ביתי', desc: 'מנה אישית', price: 28 },
    { id: 's5', day: 'sat', cat: 'מנות חמות', name: 'קציצות בקר ברוטב עגבניות', desc: '4 יחידות', price: 58 },
    { id: 's6', day: 'sat', cat: 'סלטים (250 גרם)', name: 'סלט חצילים בשום וכוסברה', desc: '', price: 29 },
    { id: 's7', day: 'sat', cat: 'סלטים (250 גרם)', name: 'חומוס ביתי', desc: '', price: 29 },
    { id: 's8', day: 'sat', cat: 'סלטים (250 גרם)', name: 'מטבוחה', desc: '', price: 29 },
    { id: 's9', day: 'sat', cat: 'מתוקים', name: 'עוגת שוקולד ביתית', desc: 'עוגה שלמה', price: 45 },
    { id: 's10', day: 'sat', cat: 'מתוקים', name: 'עוגיות הבית', desc: 'מארז 250 גרם', price: 25, out: true },
  ],
};

/* ימי השבוע בסדר כרונולוגי. בעברית (RTL) היום הראשון ברשימה מוצג הכי ימינה. */
const WEEKDAYS = [
  ['sun', 'יום ראשון'], ['mon', 'יום שני'], ['tue', 'יום שלישי'], ['wed', 'יום רביעי'],
  ['thu', 'יום חמישי'], ['fri', 'יום שישי'], ['sat', 'יום שבת'], ['motzash', 'מוצאי שבת'],
];
const WEEKDAY_LABEL = Object.fromEntries(WEEKDAYS);
const weekdayIndex = d => WEEKDAYS.findIndex(w => w[0] === d.weekday);
const sortDays = days => days.sort((a, b) => weekdayIndex(a) - weekdayIndex(b));

function loadDB() {
  const saved = ls.get(DB_KEY, null);
  const db = saved && Array.isArray(saved.items) && Array.isArray(saved.days)
    ? { ...structuredClone(DEFAULT_DB), ...saved, settings: { ...DEFAULT_DB.settings, ...saved.settings } }
    : structuredClone(DEFAULT_DB);
  // נתונים שנשמרו לפני שנוסף יום שבוע: משלימים לפי השם שהיה להם
  db.days.forEach(d => {
    if (WEEKDAY_LABEL[d.weekday]) return;
    d.weekday = (WEEKDAYS.find(w => w[1] === d.label) || [d.id === 'sat' ? 'motzash' : 'fri'])[0];
  });
  sortDays(db.days);
  return db;
}
const saveDB = db => ls.set(DB_KEY, db);
// משלים שדות להזמנות שנשמרו בגרסאות קודמות של הסקיצה
const loadOrders = () => ls.get(ORDERS_KEY, []).map(o => ({
  slot: '', city: '', street: '', apt: '', notes: '', status: 'new', day: '', dayId: '', items: [],
  fulfil: 'pickup', pay: 'cash', fee: 0, total: 0, createdAt: new Date().toISOString(),
  ...o,
  customer: { name: 'לקוח (הזמנת בדיקה)', phone: '', ...o.customer },
}));
const saveOrders = list => ls.set(ORDERS_KEY, list);

/* חלון אישור בתוך הדף (החלון המובנה confirm() חסום בסביבת התצוגה בקישור) */
function askConfirm(message, okLabel = 'אישור') {
  return new Promise(resolve => {
    const box = document.createElement('div');
    box.className = 'confirm-scrim';
    box.innerHTML = '<div class="confirm-card" role="alertdialog" aria-modal="true"><p></p><div class="confirm-actions"><button type="button" class="c-no" data-v="0">ביטול</button><button type="button" class="c-yes" data-v="1"></button></div></div>';
    box.querySelector('p').textContent = message;
    const yes = box.querySelector('[data-v="1"]');
    yes.textContent = okLabel;
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } };
    const done = v => { box.remove(); document.removeEventListener('keydown', onKey, true); resolve(v); };
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-v]');
      if (b) done(b.dataset.v === '1'); else if (e.target === box) done(false);
    });
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(box);
    yes.focus();
  });
}
