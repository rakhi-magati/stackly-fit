const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
addEventListener('scroll', () => {
  document.body.classList.toggle('scrolled', scrollY > 40);
  $$('[data-par]').forEach(i => { i.style.transform = `translateY(${-Math.min(scrollY, 700) * .06}px)` })
}, { passive: true });
$('#burger')?.addEventListener('click', () => $('#nav').classList.toggle('open'));
// Browser-session UI for the static demo site.
const sessionKey = 'stacklyfit-session';
const getSession = () => { try { return JSON.parse(localStorage.getItem(sessionKey) || sessionStorage.getItem(sessionKey) || 'null') } catch { return null } };
const signedInUser = getSession();
if (signedInUser) {
  const accountLink = document.querySelector('.acts>a[href="login.html"]:not(.btn)');
  const logoutLink = document.querySelector('.acts .btn[href="login.html"]');
  if (accountLink) { accountLink.textContent = `Hi, ${signedInUser.firstName}`; accountLink.href = 'index.html' }
  if (logoutLink) {
    logoutLink.textContent = 'Log out';
    logoutLink.href = '#';
    logoutLink.addEventListener('click', event => { event.preventDefault(); localStorage.removeItem(sessionKey); sessionStorage.removeItem(sessionKey); location.href = 'index.html' });
  }
}
$$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 });
$$('.rv').forEach(el => io.observe(el));
// count-up
$$('[data-count]').forEach(el => {
  const t = +el.dataset.count; if (reduce) { el.textContent = t.toLocaleString(); return }
  setTimeout(() => { const s = performance.now(); (function f(n) { const p = Math.min((n - s) / 1800, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 4))).toLocaleString(); p < 1 && requestAnimationFrame(f) })(s) }, 2300)
});
// magnetic buttons + 3D tilt
if (!reduce && matchMedia('(hover:hover)').matches) {
  $$('.magnet').forEach(b => { b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)` }); b.addEventListener('mouseleave', () => b.style.transform = '') });
  $$('.coach').forEach(c => { c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)` }); c.addEventListener('mouseleave', () => c.style.transform = '') })
}
// pricing
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2600) };
$$('#bill button').forEach(b => b.addEventListener('click', () => {
  $$('#bill button').forEach(x => x.classList.toggle('on', x === b));
  $$('[data-m]').forEach(p => {
    const to = +p.dataset[b.dataset.k], from = +p.textContent.slice(1), s = performance.now();
    (function f(n) { const k = Math.min((n - s) / 500, 1); p.textContent = '$' + Math.round(from + (to - from) * k); k < 1 && requestAnimationFrame(f) })(s)
  })
}));
// reviews
const rev = $('#rev'); $('#next')?.addEventListener('click', () => rev.scrollBy({ left: 480, behavior: 'smooth' })); $('#prev')?.addEventListener('click', () => rev.scrollBy({ left: -480, behavior: 'smooth' }));
// program filters
$$('#filters button').forEach(b => b.addEventListener('click', () => {
  $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
  let i = 0; $$('.pc').forEach(c => {
    const show = b.dataset.f === 'all' || c.dataset.c === b.dataset.f; c.classList.toggle('hide', !show);
    c.classList.remove('pop-in'); if (show) { c.style.setProperty('--d', (i++ * .08) + 's'); void c.offsetWidth; c.classList.add('pop-in') }
  })
}));
// FAQ accordion
$$('.q button').forEach(b => b.addEventListener('click', () => {
  const q = b.parentElement, open = !q.classList.contains('open');
  $$('.q').forEach(x => { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', 'false') });
  if (open) { q.classList.add('open'); b.setAttribute('aria-expanded', 'true') }
}));
// scroll-triggered counters
const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; co.unobserve(e.target); const el = e.target, t = +el.dataset.scount, s = performance.now();
  (function f(n) { const p = Math.min((n - s) / 1600, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))); p < 1 && requestAnimationFrame(f) })(s)
}), { threshold: .6 });
$$('[data-scount]').forEach(el => co.observe(el));
// Real photos: fade in; if a photo fails, swap to a topic-matched real photo, never a placeholder drawing
const KW = t => /football|soccer/.test(t) ? 'soccer,football' : /basket/.test(t) ? 'basketball' : /tennis/.test(t) ? 'tennis' : /swim/.test(t) ? 'swimming' : /cycl|endur/.test(t) ? 'cycling' : /yoga|flex|mobil/.test(t) ? 'yoga' : /run|cardio|weight loss/.test(t) ? 'running' : /strength|muscle|hiit|power/.test(t) ? 'weightlifting,gym' : /coach|trainer|sarah|james|priya|david/.test(t) ? 'personal,trainer' : 'fitness,gym';
$$('img').forEach((img, i) => {
  if (img.closest('.curtain')) return; const t = ((img.alt || '') + ' ' + (img.parentElement?.textContent || '')).toLowerCase();
  img.style.opacity = 0; img.style.transition = 'opacity .8s'; let tried = 0;
  const show = () => img.style.opacity = 1;
  img.addEventListener('load', show);
  img.addEventListener('error', () => { if (tried++) return; img.src = `https://loremflickr.com/900/1100/${KW(t)}?lock=${i + 7}` });
  if (img.complete && img.naturalWidth) show()
});
