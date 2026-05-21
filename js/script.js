/* =========================================================
   해동엔지니어링 — Interactive scripts (Mobile optimized)
   ========================================================= */

(function () {
  'use strict';

  const body = document.body;
  const header = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('navList');
  const nav = document.querySelector('.nav');

  /* ---------- Mobile Nav (slide-in panel) ---------- */
  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', '메뉴 열기');
    body.classList.remove('no-scroll');
  }
  function openNav() {
    if (!nav) return;
    nav.classList.add('is-open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', '메뉴 닫기');
    body.classList.add('no-scroll');
  }

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.contains('is-open') ? closeNav() : openNav();
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
    });

    // Close on resize (orientation change to desktop)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && nav.classList.contains('is-open')) closeNav();
      }, 150);
    }, { passive: true });
  }

  /* ---------- Sticky header shadow ---------- */
  if (header) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.style.boxShadow = window.scrollY > 10
            ? '0 4px 20px rgba(15,27,38,.08)'
            : 'none';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Back to top ---------- */
  const btnTop = document.getElementById('backToTop');
  if (btnTop) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          btnTop.classList.toggle('is-visible', window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll(
    '.section__head, .card, .strength, .industry, .process li, .info-list li, .contact-list li, .about__card'
  );
  revealEls.forEach(el => el.classList.add('fade-up'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1500;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => counterIO.observe(c));
  }

  /* ---------- Smooth anchor offset for sticky header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      // close menu before scrolling on mobile
      if (nav && nav.classList.contains('is-open')) closeNav();
      requestAnimationFrame(() => {
        const headerH = header?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  });

  /* ---------- Phone number auto-format (light) ---------- */
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
      let v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
      if (v.length >= 11) v = v.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      else if (v.length >= 7) v = v.replace(/(\d{3})(\d{3,4})/, '$1-$2');
      else if (v.length >= 4) v = v.replace(/(\d{3})(\d+)/, '$1-$2');
      e.target.value = v;
    });
  });

  /* ---------- Set dynamic viewport height var for mobile ---------- */
  function setVH() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  setVH();
  window.addEventListener('resize', setVH, { passive: true });
  window.addEventListener('orientationchange', setVH);

})();

/* ---------- Quote Form Handler ---------- */
function handleQuoteSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());

  const subject = encodeURIComponent('[견적문의] ' + data.name + ' 님');
  const body = encodeURIComponent(
    '성함: ' + data.name + '\n' +
    '연락처: ' + data.phone + '\n' +
    '이메일: ' + (data.email || '-') + '\n\n' +
    '문의 내용:\n' + data.message
  );

  window.location.href = 'mailto:fgmenot@hanmail.net?subject=' + subject + '&body=' + body;

  setTimeout(() => {
    alert('견적 문의가 접수되었습니다.\n빠른 시일 내 연락드리겠습니다.\n\n📞 010-4558-3824');
    form.reset();
  }, 300);
}
