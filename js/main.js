(function () {
  'use strict';
  var doc = document.documentElement;
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Bahasa ID / EN ---------- */
  var nodes = $$('[data-en]');
  nodes.forEach(function (el) { el.setAttribute('data-id', el.innerHTML); });
  var labelNodes = $$('[data-en-label]');
  labelNodes.forEach(function (el) { el.setAttribute('data-id-label', el.getAttribute('aria-label') || ''); });

  var meta = {
    id: {
      title: 'Andini Papa Sulima · Portofolio Mahasiswa Informatika',
      desc: 'Portofolio Andini Papa Sulima, mahasiswa Informatika UPN “Veteran” Yogyakarta. Proyek aplikasi web, desktop Java, Python, dan data.'
    },
    en: {
      title: 'Andini Papa Sulima · Informatics Student Portfolio',
      desc: 'Portfolio of Andini Papa Sulima, an Informatics student at UPN “Veteran” Yogyakarta. Web apps, Java desktop apps, Python, and data projects.'
    }
  };
  var descTag = document.querySelector('meta[name="description"]');
  var btnId = document.getElementById('btn-id');
  var btnEn = document.getElementById('btn-en');
  var copyLabels = { id: ['Salin', 'Tersalin', 'Gagal, salin manual'], en: ['Copy', 'Copied', 'Failed, copy manually'] };
  var lang = 'id';

  function applyLang(next) {
    lang = next;
    nodes.forEach(function (el) {
      el.innerHTML = el.getAttribute(next === 'en' ? 'data-en' : 'data-id');
    });
    labelNodes.forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute(next === 'en' ? 'data-en-label' : 'data-id-label'));
    });
    doc.lang = next;
    document.title = meta[next].title;
    if (descTag) descTag.setAttribute('content', meta[next].desc);
    btnId.setAttribute('aria-pressed', String(next === 'id'));
    btnEn.setAttribute('aria-pressed', String(next === 'en'));
    try { localStorage.setItem('portfolio-lang', next); } catch (e) {}
  }
  btnId.addEventListener('click', function () { applyLang('id'); });
  btnEn.addEventListener('click', function () { applyLang('en'); });
  try { if (localStorage.getItem('portfolio-lang') === 'en') applyLang('en'); } catch (e) {}

  /* ---------- Menu mobile ---------- */
  var nav = document.querySelector('.nav');
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('menu');
  var mq = window.matchMedia('(max-width: 759.98px)');

  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuBtn.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (menuBtn.getAttribute('aria-expanded') === 'true' && !nav.contains(e.target)) setMenu(false);
  });
  var onMq = function () { if (!mq.matches) setMenu(false); };
  if (mq.addEventListener) mq.addEventListener('change', onMq); else mq.addListener(onMq);

  /* ---------- Header aktif saat scroll ---------- */
  var ticking = false;
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 8);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Salin kontak ---------- */
  $$('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      function show(i) {
        btn.textContent = copyLabels[lang][i];
        clearTimeout(btn._t);
        btn._t = setTimeout(function () { btn.textContent = copyLabels[lang][0]; }, 1800);
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        show(ok ? 1 : 2);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(function () { show(1); }, fallback);
      } else { fallback(); }
    });
  });

  /* ---------- Scroll-spy dan count-up ---------- */
  var spyLinks = $$('#menu a');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('section.block').forEach(function (s) { spy.observe(s); });

    if (!reduce) {
      var counted = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          counted.unobserve(en.target);
          var el = en.target;
          var end = parseFloat(el.getAttribute('data-count'));
          var dec = parseInt(el.getAttribute('data-dec'), 10) || 0;
          var start = null;
          function step(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / 1200, 1);
            el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = end.toFixed(dec);
          }
          el.textContent = (0).toFixed(dec);
          requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });
      $$('.num').forEach(function (n) { counted.observe(n); });
    }
  }

  /* ---------- Tahun footer ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- Tombol CV: tampil hanya jika file PDF tersedia ---------- */
  var cvLinks = $$('[data-cv]');
  if (cvLinks.length && window.fetch && location.protocol !== 'file:') {
    fetch(cvLinks[0].getAttribute('href'), { method: 'HEAD' }).then(function (res) {
      if (res.ok) cvLinks.forEach(function (a) { a.hidden = false; });
    }).catch(function () {});
  }
})();

