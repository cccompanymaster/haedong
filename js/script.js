/* =========================================================
   해동엔지니어링 — Interactive scripts
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Mobile Nav Toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('navList');
  const nav = document.querySelector('.nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.style.boxShadow = y > 10 ? '0 4px 20px rgba(15,27,38,.08)' : 'none';
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Back to top ---------- */
  const btnTop = document.getElementById('backToTop');
  if (btnTop) {
    window.addEventListener('scroll', () => {
      btnTop.classList.toggle('is-visible', window.scrollY > 400);
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
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

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
    }, { threshold: 0.5 });
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
      const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

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
