(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- AOS: reveal on scroll ---------- */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: reduce
    });
    var reveal = [
      ['.head', 'fade-up'],
      ['.stat-row', 'fade-up'],
      ['.caps', 'fade-up'],
      ['.about .txt', 'fade-up'],
      ['.fcard', 'fade-up'],
      ['.skills > div', 'fade-up'],
      ['.card', 'fade-up'],
      ['.timeline li', 'fade-up'],
      ['.cert', 'fade-up'],
      ['.contact > div', 'fade-up'],
      ['.row', 'fade-up']
    ];
    reveal.forEach(function (r) {
      document.querySelectorAll(r[0]).forEach(function (el, i) {
        el.setAttribute('data-aos', r[1]);
        if (i > 0) el.setAttribute('data-aos-delay', String(Math.min(i * 70, 350)));
      });
    });
    AOS.refresh();
    setTimeout(function () { AOS.refresh(); }, 300);
    /* Pengaman: jika setelah 1.5 detik ada elemen yang belum tampil, paksa tampil */
    setTimeout(function () {
      document.querySelectorAll('[data-aos]').forEach(function (el) {
        if (parseFloat(getComputedStyle(el).opacity) < 1) {
          el.classList.add('aos-animate');
        }
      });
    }, 1500);
  } else {
    /* AOS tidak termuat: pastikan tidak ada elemen yang tertinggal tersembunyi */
    document.querySelectorAll('[data-aos]').forEach(function (el) {
      el.removeAttribute('data-aos');
    });
  }

  /* ---------- GSAP: hero + parallax ---------- */
  var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  var reduceAll = reduce || !fine; /* tanpa mouse (HP/tablet): jangan pakai gsap.from + AOS bersamaan */
  if (hasGsap && !reduceAll) {
    gsap.registerPlugin(ScrollTrigger);

    /* hero entrance */
    gsap.from('.hero-grid > div > *', {
      y: 28,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.15
    });
    gsap.from('.portrait', {
      scale: 0.94,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.35
    });

    /* split hero title */
    var title = document.getElementById('hero-title');
    if (title && !reduce) {
      var html = title.innerHTML;
      title.innerHTML = '';
      html.split(/(<[^>]+>)/).forEach(function (part) {
        if (!part.trim()) return;
        if (part.indexOf('<') === 0) {
          var span = document.createElement('span');
          span.style.display = 'inline-block';
          span.style.overflow = 'hidden';
          span.innerHTML = part;
          title.appendChild(span);
        } else {
          var span = document.createElement('span');
          span.style.display = 'inline-block';
          span.style.overflow = 'hidden';
          span.textContent = part;
          title.appendChild(span);
        }
      });
      gsap.from(title.querySelectorAll('span'), {
        yPercent: 110,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.3
      });
    }

    /* section parallax */
    document.querySelectorAll('section.block').forEach(function (sec) {
      var head = sec.querySelector('.head');
      if (!head) return;
      if (head.hasAttribute('data-aos')) return; /* biar tidak dianimasikan ganda */
      gsap.from(head, {
        scrollTrigger: { trigger: sec, start: 'top 82%', once: true },
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out'
      });
    });
  } else if (hasGsap) {
    /* Di HP/tablet: jangan ada animasi parallax; AOS saja yang bekerja */
  }

  /* ---------- Tilt on cards ---------- */
  if (fine && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.style.transition = 'transform 0.25s ease';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(700px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg) translateY(-2px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
})();

