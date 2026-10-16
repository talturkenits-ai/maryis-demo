/* חמין עד הבית – הסירים של מרי אס | סקיצת הדגמה
   תפריט, מחירים, ימים, ערים והגדרות נמצאים ב-shared.js ונערכים בדף הניהול (admin.html).
   כאן נשארו רק הגדרות האתר הציבורי. */

const CONFIG = {
  // לחיבור PayPal Sandbox אמיתי: להדביק כאן Client ID של אפליקציית Sandbox.
  // "test" הוא מפתח הדגמה כללי של PayPal.
  paypalClientId: 'test',
  currency: 'ILS',
  // קישורי הרשתות. פייסבוק ריק עד שיתקבל הקישור, והסמל שלו יוצג אוטומטית כשימולא.
  social: {
    instagram: 'https://www.instagram.com/mary.s1928/',
    facebook: 'https://www.facebook.com/marysm2020/?locale=he_IL',
    whatsapp: 'https://wa.me/972528280323?text=' + encodeURIComponent('אשמח לשמוע פרטים על השירות'),
  },
  // הלוגו והתמונה מוצגים בהפניה ישירה לאתר ישראל היום (לא הועתקו אלינו).
  // אם הקישור יישבר, יוצג שם העיתון בטקסט במקום הלוגו.
  press: {
    url: 'https://www.israelhayom.co.il/food/food-news/article/6978686',
    title: 'סוף שבוע חורפי בפתח: זה הזמן לחמין במשלוח',
    quote: 'האופציה החורפית והנהדרת של לקבל סיר…',
    logo: 'https://www.israelhayom.co.il/wp-content/uploads/2025/12/08/08/Desktop-logotype-grad.png',
    image: 'https://www.israelhayom.co.il/wp-content/uploads/2022/01/12/20201120_103507-1280x853.jpg',
  },
  reviews: [
    { name: 'Ma\'ayan Zigdon', text: 'אוכל מעולה לשבתות ולאירועים קטנים, חמין של השמחות, מפרום נדיר ושירות ונדיבות שכבר כמעט לא רואים היום. איזה מזל שגילינו את מארי׳ס! (הכל בזכות. הג׳חנון בכלל)' },
    { name: 'טל שורץ', text: 'וואי וואי איזה אוכל אליפות. אני טבעונית והחמין הטבעוני שלה הוא החמין הכי טעים שאי פעם אכלתי. הבן שלי רחוק מטבעוני, והוא ״עף״ על כל המנות שלה.' },
    { name: 'Ayala Ronen', text: 'הזמנתי חמין עם קישקע, הגיע ארוז בצורה הכי אסטתית עם אפשרות להכניס לתנור, היה ממש טעים, וגם השירות היה נעים וידידותי.' },
    { name: 'עידית הראל', text: 'איזה כיף לאכול את האוכל הטעים של מרי. תענוג! מבחר עצום, שירות מעולה, מחירים נוחים ומרי אדיבה ומקסימה. ממליצה בחום!' },
    { name: 'גאיה גרשברג', text: 'ההתרגשות בכל שישי כשמגיעה השקית עם המטעמים של קרין זו התרגשות ענקית!! אוכל טעים בריא מפוצץ אהבה. הילדים שלי למדו לאכול. תודה עלייך קרין!!' },
    { name: 'ערן', text: 'חיפשתי חמין לשבת. קפצה המודעה. שלחתי ווצאפ בשישי ערב. שבת בוקר כבר הייתה תשובה שיש. קפצתי לקחת. נתקלתי באשה מדהימה, חייכנית. וכמוה החמין. וגם הקישקע מעולה. אני שמכין בדרך כלל לט מגיע לטעם המדהים. ממש שווה.' },
    { name: 'lidor sweary', text: 'אוכל נהדר!! מביאה להורים שלי וגם לילדים ותמיד שואלים מאיפה ותמיד מתחסל. יש לא מעט מקומות להביא מהם אוכל ביתי, האוכל של קארין מנצח. מומלץ בחום!' },
    { name: 'שגית אריאל', text: 'וואו וואו וואו. טעים חמים ונעים. הרגשה של בית, של חורף…' },
    { name: 'Hedva Melamed fagadau', text: 'קרין היקרה!! תודה רבה על אוכל מזין וטעים שאת מכינה לנו לשבתות. הכל באהבה ובתשומת…' },
    { name: 'Asaf Daniel', text: 'חמין מעולה!! מומלץ מאוד, לקחנו סיר בשר גדול, מוגש נקי וטעים והסטטי - כיף…' },
  ],
  // תמונות מרחפות בראש הדף. לכל תמונה כותרת והסבר קצר שמוצגים בהגדלה.
  heroPhotos: [
    { src: 'images/cholent.webp', alt: 'חמין בתבנית אלומיניום עם בשר, ביצים חומות וקישקה', title: 'חמין עם קישקה', text: 'חמין ביתי עשיר עם בשר, ביצים חומות וקישקה. מגיע ארוז חם ומוכן להגשה.' },
    { src: 'images/beef.webp', alt: 'נתח בקר מבושל לאט בריבת בצל', title: 'בקר בבישול ארוך בריבת בצל', text: 'נתחי בקר שמתבשלים שעות ארוכות עד שהם רכים, עם ריבת בצל מתוקה ומקורמלת.' },
    { src: 'images/pastry.webp', alt: 'מאפה בצק עלים עם שומשום, טחינה וסחוג', title: 'מאפה בצק עלים פריך', text: 'בצק עלים זהוב ופריך עם שומשום, מוגש עם טחינה וסחוג.' },
  ],
  instagramPosts: [
    { url: 'https://www.instagram.com/reel/CmfNPuDI0yU/', label: 'סרטון מהמטבח' },
    { url: 'https://www.instagram.com/reel/Cb_B9K4F5ou/', label: 'סרטון מהמטבח' },
    { url: 'https://www.instagram.com/p/CXeRGPHIuA4/', label: 'מנה מהקדרה' },
  ],
};

/* ---------- State ---------- */
let DB = loadDB();
const state = { day: DB.days[0].id, cart: {} };
const dayOf = id => DB.days.find(d => d.id === id) || DB.days[0];
const itemById = id => DB.items.find(i => i.id === id);
const dayOpen = () => dayOf(state.day).open !== false;

/* ---------- Menu ---------- */
function renderTabs() {
  $('#dayTabs').innerHTML = DB.days.map(d =>
    `<button type="button" role="tab" data-day="${d.id}" aria-selected="${d.id === state.day}">${esc(d.label)}</button>`).join('');
  $('#dayNote').textContent = dayOf(state.day).note;
  $('#closedBanner').hidden = dayOpen();
}

function itemControl(it) {
  if (it.out) return '<span class="badge">אזל</span>';
  if (!dayOpen()) return '<span class="badge">סגור להזמנה</span>';
  const q = state.cart[it.id] || 0;
  if (!q) return `<button type="button" class="add" data-act="inc" data-id="${it.id}">הוספה</button>`;
  return `<span class="stepper"><button type="button" data-act="inc" data-id="${it.id}" aria-label="הוספת יחידה">+</button><span>${q}</span><button type="button" data-act="dec" data-id="${it.id}" aria-label="הפחתת יחידה">−</button></span>`;
}

function renderMenu() {
  const cats = [];
  DB.items.filter(it => it.day === state.day).forEach(it => {
    let c = cats.find(x => x.name === it.cat);
    if (!c) cats.push(c = { name: it.cat, items: [] });
    c.items.push(it);
  });
  $('#menu').innerHTML = cats.map(c => `
    <section class="cat">
      <h3>${esc(c.name)}</h3>
      ${c.items.map(it => `
        <article class="item ${it.out || !dayOpen() ? 'is-out' : ''}">
          <div>
            <h4>${esc(it.name)}</h4>
            ${it.desc ? `<p>${esc(it.desc)}</p>` : ''}
          </div>
          <div class="item-side"><span class="price">${fmt(it.price)}</span>${itemControl(it)}</div>
        </article>`).join('')}
    </section>`).join('') || '<p class="empty">אין עדיין מנות ליום הזה.</p>';
}

/* ---------- Cart ---------- */
const cartLines = () => Object.entries(state.cart)
  .map(([id, q]) => ({ it: itemById(id), q }))
  .filter(l => l.it && !l.it.out);
const subtotal = () => cartLines().reduce((s, l) => s + l.it.price * l.q, 0);
const cartQty = () => cartLines().reduce((s, l) => s + l.q, 0);
const method = name => $(`input[name="${name}"]:checked`).value;
const isDelivery = () => method('fulfil') === 'delivery';
const cityFee = () => (DB.cities.find(c => c.name === $('#city').value) || {}).fee;
const freeFrom = () => Number(DB.settings.freeDeliveryFrom) || 0;
const isFreeDelivery = () => freeFrom() > 0 && subtotal() >= freeFrom();
const deliveryFee = () => (isDelivery() && !isFreeDelivery() ? cityFee() || 0 : 0);
const total = () => subtotal() + deliveryFee();

function changeQty(id, delta) {
  const q = (state.cart[id] || 0) + delta;
  if (q <= 0) delete state.cart[id]; else state.cart[id] = q;
  refresh();
}

function pickupNote() {
  const s = DB.settings;
  return [s.pickupAddress, s.pickupHours].filter(Boolean).join(' · ');
}

function renderSlots() {
  const sel = $('#slot');
  const prev = sel.value;
  sel.innerHTML = '<option value="">בחירת שעה</option>' +
    (dayOf(state.day).slots || []).map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
  if ([...sel.options].some(o => o.value === prev)) sel.value = prev;
}

function renderCities() {
  const sel = $('#city');
  const prev = sel.value;
  sel.innerHTML = '<option value="">בחירת עיר</option>' +
    DB.cities.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
  if (DB.cities.some(c => c.name === prev)) sel.value = prev;
}

function renderCart() {
  const lines = cartLines();
  $('#cartCount').textContent = cartQty();
  $('#floatBar').hidden = !lines.length;
  $('#floatTotal').textContent = fmt(subtotal());
  $('#emptyMsg').hidden = !!lines.length;
  $('#orderForm').hidden = !lines.length;
  if (!lines.length) return;

  $('#orderDay').textContent = 'הזמנה ל' + dayOf(state.day).label;
  $('#lines').innerHTML = lines.map(({ it, q }) => `
    <li>
      <span class="nm">${esc(it.name)}</span>
      <span class="stepper"><button type="button" data-act="inc" data-id="${it.id}" aria-label="הוספת יחידה">+</button><span>${q}</span><button type="button" data-act="dec" data-id="${it.id}" aria-label="הפחתת יחידה">−</button></span>
      <span class="lp">${fmt(it.price * q)}</span>
    </li>`).join('');

  const delivery = isDelivery();
  $('#deliveryFields').hidden = !delivery;
  $('#slotLabel').textContent = delivery ? 'חלון זמן למשלוח' : 'שעת איסוף';
  const notes = [];
  if (delivery) {
    notes.push('דמי המשלוח נקבעים לפי העיר.');
    if (freeFrom() > 0) notes.push(`משלוח חינם בהזמנה מעל ${fmt(freeFrom())}.`);
    if (Number(DB.settings.minDelivery) > 0) notes.push(`הזמנה מינימלית למשלוח ${fmt(DB.settings.minDelivery)}.`);
  } else notes.push(pickupNote());
  $('#pickupHint').textContent = notes.join(' ');

  $('#tSub').textContent = fmt(subtotal());
  $('#tFee').textContent = !delivery ? 'ללא (איסוף עצמי)'
    : isFreeDelivery() ? 'חינם'
    : cityFee() === undefined ? 'יש לבחור עיר' : fmt(cityFee());
  $('#tTotal').textContent = fmt(total());

  const card = method('pay') === 'card';
  $('#paypalBox').hidden = !card;
  $('#submitBtn').hidden = card;
  $('#payHint').textContent = card ? 'התשלום מתבצע בכרטיס אשראי דרך PayPal (בדמו: Sandbox).' : 'התשלום במזומן בעת קבלת ההזמנה.';
  if (card) ensurePayPal();
}

function refresh() { renderMenu(); renderCart(); }

/* ---------- Validation & order ---------- */
function validate() {
  const err = msg => { const e = $('#formError'); e.textContent = msg; e.hidden = !msg; return !msg; };
  if (!dayOpen()) return err('ההזמנות ליום הזה סגורות כרגע.');
  if (!cartLines().length) return err('העגלה ריקה.');
  if (!$('#custName').value.trim()) return err('נא למלא שם מלא.');
  if (!/^0\d{8,9}$/.test($('#custPhone').value.replace(/[\s-]/g, ''))) return err('נא למלא מספר טלפון תקין.');
  if (!$('#slot').value) return err(isDelivery() ? 'נא לבחור חלון זמן למשלוח.' : 'נא לבחור שעת איסוף.');
  if (isDelivery()) {
    if (cityFee() === undefined) return err('נא לבחור עיר למשלוח.');
    if (!$('#street').value.trim()) return err('נא למלא רחוב ומספר בית.');
    const min = Number(DB.settings.minDelivery) || 0;
    if (subtotal() < min) return err(`ההזמנה המינימלית למשלוח היא ${fmt(min)}.`);
  }
  return err('');
}

function buildOrder(payMethod, extra = {}) {
  const day = dayOf(state.day);
  return {
    id: 'MR-' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    dayId: day.id, day: day.label,
    items: cartLines().map(l => ({ name: l.it.name, qty: l.q, price: l.it.price })),
    fulfil: method('fulfil'),
    slot: $('#slot').value,
    city: isDelivery() ? $('#city').value : '',
    street: isDelivery() ? $('#street').value.trim() : '',
    apt: isDelivery() ? $('#apt').value.trim() : '',
    customer: { name: $('#custName').value.trim(), phone: $('#custPhone').value.trim() },
    notes: $('#notes').value.trim(),
    subtotal: subtotal(), fee: deliveryFee(), total: total(),
    pay: payMethod, status: 'new', ...extra,
  };
}

function finish(order) {
  saveOrders([order, ...loadOrders()]);
  $('#doneNum').textContent = order.id;
  $('#doneSummary').textContent =
    order.items.map(i => `${i.qty} × ${i.name}`).join('\n') +
    `\n\n${order.fulfil === 'delivery' ? 'משלוח ל' + order.city : 'איסוף עצמי'} · ${order.day} · ${order.slot}` +
    `\n${order.pay === 'card' ? 'שולם בכרטיס' : 'תשלום במזומן'}\nסה״כ ${fmt(order.total)}`;
  state.cart = {};
  closeCart();
  refresh();
  $('#doneModal').hidden = false;
}

/* ---------- PayPal (Sandbox) ---------- */
let ppPromise = null;
let ppRendered = false;
function loadPayPal() {
  if (ppPromise) return ppPromise;
  ppPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(CONFIG.paypalClientId)}&currency=${CONFIG.currency}&locale=he_IL&components=buttons`;
    s.onload = () => resolve(window.paypal);
    s.onerror = () => { ppPromise = null; reject(new Error('paypal-load')); };
    document.head.appendChild(s);
  });
  return ppPromise;
}

function ensurePayPal() {
  if (ppRendered) return;
  ppRendered = true;
  const showErr = msg => { const e = $('#paypalError'); e.textContent = msg; e.hidden = !msg; };
  loadPayPal().then(paypal => paypal.Buttons({
    style: { layout: 'vertical', shape: 'pill', color: 'gold', label: 'pay' },
    onClick: (d, actions) => (validate() ? actions.resolve() : actions.reject()),
    createOrder: (d, actions) => actions.order.create({
      purchase_units: [{
        description: 'הזמנה – חמין עד הבית',
        amount: { currency_code: CONFIG.currency, value: total().toFixed(2) },
      }],
    }),
    onApprove: (d, actions) => actions.order.capture().then(details => {
      showErr('');
      finish(buildOrder('card', { paypalId: details.id }));
    }),
    onError: () => showErr('התשלום לא הושלם. אפשר לנסות שוב או לבחור תשלום במזומן.'),
  }).render('#paypal-container')).catch(renderSimulatedPay);
}

// כשאי אפשר לטעון את PayPal (למשל בתצוגה בקישור, שחוסמת סקריפטים חיצוניים) מוצג תשלום מדומה
function renderSimulatedPay() {
  $('#paypal-container').innerHTML =
    '<button type="button" class="primary sim-pay" id="simPay">תשלום בכרטיס אשראי (הדגמה)</button>' +
    '<p class="hint">בתצוגה הזו התשלום מדומה ולא מתבצע חיוב. בגרסה המלאה הכפתור מתחבר ל-PayPal Sandbox, ובהמשך לגמא פיננסים.</p>';
  $('#simPay').addEventListener('click', () => { if (validate()) finish(buildOrder('card', { simulated: true })); });
}

/* ---------- Drawer ---------- */
const drawer = $('#drawer');
function openCart() {
  drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); $('#scrim').hidden = false;
  document.body.style.overflow = 'hidden'; drawer.focus();
}
function closeCart() {
  drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); $('#scrim').hidden = true;
  document.body.style.overflow = '';
}

/* ---------- Instagram embeds (נטענים רק כשמגיעים לאזור) ---------- */
function initInstagram() {
  $('#instaGrid').innerHTML = CONFIG.instagramPosts.map(p =>
    `<blockquote class="instagram-media" data-instgrm-permalink="${p.url}" data-instgrm-version="14"><a class="insta-card" href="${p.url}" target="_blank" rel="noopener"><img src="logo.jpg" alt="" width="56" height="56"><strong>${p.label}</strong><span>לצפייה באינסטגרם</span></a></blockquote>`).join('');
  const load = () => {
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(s);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '400px' });
    io.observe($('#insta'));
  } else load();
}

/* ---------- Reviews, press, socials ---------- */
const ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.4 1.5-1.4h1.6V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H8v3h2.5V21h3z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"/><path d="M9 8.5c0 3.3 3.2 6.5 6.5 6.5l1-1.6-2-1-.9.8c-.9-.3-2-1.4-2.3-2.3l.8-.9-1-2L9 8.5z" fill="currentColor" stroke="none"/></svg>',
};
const SOCIAL_LABELS = { instagram: 'אינסטגרם', facebook: 'פייסבוק', whatsapp: 'וואטסאפ' };

const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1z"/></svg>';
const stars = n => `<span class="stars" role="img" aria-label="${n} כוכבים מתוך 5">${STAR.repeat(n)}</span>`;
const initial = name => esc([...name.trim()][0] || '').toUpperCase();

function initExtras() {
  $('#reviewStars').innerHTML = stars(5);
  $('#reviewTrack').innerHTML = CONFIG.reviews.map(r => `
    <figure class="review">
      ${stars(5)}
      <blockquote>${esc(r.text)}</blockquote>
      <figcaption><span class="avatar" aria-hidden="true">${initial(r.name)}</span><span>${esc(r.name)}</span></figcaption>
    </figure>`).join('');

  const p = CONFIG.press;
  $('#pressLink').href = p.url;
  $('#pressTitle').textContent = p.title;
  $('#pressQuote').textContent = p.quote;
  const logo = $('#pressLogo'), img = $('#pressImg');
  logo.addEventListener('error', () => { logo.replaceWith(Object.assign(document.createElement('strong'), { className: 'press-logo-text', textContent: 'ישראל היום' })); });
  img.addEventListener('error', () => { $('#pressLink').classList.add('no-image'); });
  logo.src = p.logo;
  img.src = p.image;
  $('#socials').innerHTML = Object.entries(CONFIG.social).filter(([, url]) => url).map(([k, url]) =>
    `<a href="${url}" target="_blank" rel="noopener" aria-label="${SOCIAL_LABELS[k]}" title="${SOCIAL_LABELS[k]}">${ICONS[k]}</a>`).join('');
}

/* ---------- תמונות מרחפות + הגדלה ---------- */
const ZOOM_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5"/></svg>';
let lbIndex = 0;
let lbOpener = null;

function initHeroPhotos() {
  $('#heroPhotos').innerHTML = CONFIG.heroPhotos.map((p, i) => `
    <button type="button" class="float-photo fp${i + 1}" data-photo="${i}" aria-label="הגדלת התמונה: ${esc(p.title)}">
      <img src="${p.src}" alt="${esc(p.alt)}" width="400" height="500" ${i ? 'loading="lazy"' : ''}>
      <span class="zoom-chip">${ZOOM_ICON}</span>
    </button>`).join('');
}

function showPhoto(i) {
  const n = CONFIG.heroPhotos.length;
  lbIndex = (i + n) % n;
  const p = CONFIG.heroPhotos[lbIndex];
  $('#lbImg').src = p.src; $('#lbImg').alt = p.alt;
  $('#lbTitle').textContent = p.title;
  $('#lbText').textContent = p.text;
}
function openLightbox(i, opener) {
  lbOpener = opener || null;
  showPhoto(i);
  $('#lightbox').hidden = false;
  document.body.style.overflow = 'hidden';
  $('#lbClose').focus();
}
function closeLightbox() {
  $('#lightbox').hidden = true;
  document.body.style.overflow = '';
  if (lbOpener) lbOpener.focus();
}

$('#heroPhotos').addEventListener('click', e => {
  const b = e.target.closest('[data-photo]');
  if (b) openLightbox(Number(b.dataset.photo), b);
});
$('#lbClose').addEventListener('click', closeLightbox);
$('#lbNext').addEventListener('click', () => showPhoto(lbIndex + 1));
$('#lbPrev').addEventListener('click', () => showPhoto(lbIndex - 1));
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox' || e.target.classList.contains('lb-inner')) closeLightbox(); });

/* ---------- סנכרון עם דף הניהול (אותו דפדפן) ---------- */
function syncFromAdmin() {
  DB = loadDB();
  if (!DB.days.some(d => d.id === state.day)) state.day = DB.days[0].id;
  Object.keys(state.cart).forEach(id => { const it = itemById(id); if (!it || it.out) delete state.cart[id]; });
  renderTabs(); renderCities(); renderSlots(); refresh();
}
window.addEventListener('storage', e => { if (e.key === DB_KEY) syncFromAdmin(); });

/* ---------- Events ---------- */
$('#dayTabs').addEventListener('click', async e => {
  const b = e.target.closest('[data-day]');
  if (!b || b.dataset.day === state.day) return;
  if (cartQty() && !(await askConfirm('מעבר ליום אחר ינקה את העגלה. להמשיך?', 'המשך'))) return;
  state.cart = {}; state.day = b.dataset.day;
  renderTabs(); renderSlots(); refresh();
});

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (b) changeQty(b.dataset.id, b.dataset.act === 'inc' ? 1 : -1);
});

$('#orderForm').addEventListener('change', renderCart);
$('#orderForm').addEventListener('submit', e => {
  e.preventDefault();
  if (validate()) finish(buildOrder('cash'));
});

['#openCart', '#floatOpen'].forEach(s => $(s).addEventListener('click', openCart));
$('#closeCart').addEventListener('click', closeCart);
$('#scrim').addEventListener('click', closeCart);
$('#doneClose').addEventListener('click', () => { $('#doneModal').hidden = true; });
document.addEventListener('keydown', e => {
  if (!$('#lightbox').hidden) {
    // בעברית (RTL) החץ הימני מקדם אחורה והשמאלי קדימה, כמו בספר
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showPhoto(lbIndex + 1);
    else if (e.key === 'ArrowRight') showPhoto(lbIndex - 1);
    return;
  }
  if (e.key !== 'Escape') return;
  if (!$('#doneModal').hidden) $('#doneModal').hidden = true; else closeCart();
});

/* ---------- Init ---------- */
renderTabs();
renderCities();
renderSlots();
refresh();
initHeroPhotos();
initExtras();
initInstagram();
