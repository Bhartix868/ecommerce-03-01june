// ============================================
//  PROSTAVIVE — Interactive Behavior
// ============================================

(function () {
  'use strict';

  // ---- 18+ Age Gate ----
  const ageGate = document.getElementById('ageGate');
  if (ageGate) {
    const verified = localStorage.getItem('viresmed_age_verified');
    if (!verified) {
      ageGate.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    }
    const yesBtn = document.getElementById('ageYes');
    const noBtn = document.getElementById('ageNo');
    if (yesBtn) yesBtn.addEventListener('click', () => {
      localStorage.setItem('viresmed_age_verified', 'true');
      ageGate.classList.remove('is-visible');
      document.body.style.overflow = '';
    });
    if (noBtn) noBtn.addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });
  }

  // ---- Cookie Consent ----
  const cookieBar = document.getElementById('cookieBar');
  if (cookieBar) {
    const consent = localStorage.getItem('viresmed_cookie_consent');
    if (!consent) {
      setTimeout(() => cookieBar.classList.add('is-visible'), 1200);
    }
    const accept = document.getElementById('cookieAccept');
    const decline = document.getElementById('cookieDecline');
    if (accept) accept.addEventListener('click', () => {
      localStorage.setItem('viresmed_cookie_consent', 'accepted');
      cookieBar.classList.remove('is-visible');
    });
    if (decline) decline.addEventListener('click', () => {
      localStorage.setItem('viresmed_cookie_consent', 'declined');
      cookieBar.classList.remove('is-visible');
    });
  }

  // ---- Scroll Reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href === '#CTA_LINK' || href === '#top') {
        if (href === '#top') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Single-Open FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  // ---- Testimonial 3D Carousel ----
  const carousel = document.querySelector('.reviews-carousel');
  if (carousel) {
    const reviews = Array.from(carousel.querySelectorAll('.review'));
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let current = 0;
    let autoplay;

    const setPositions = () => {
      reviews.forEach((r, i) => {
        let diff = i - current;
        // Wrap around for shortest distance
        if (diff > reviews.length / 2) diff -= reviews.length;
        if (diff < -reviews.length / 2) diff += reviews.length;
        if (Math.abs(diff) <= 2) {
          r.setAttribute('data-pos', String(diff));
        } else {
          r.setAttribute('data-pos', 'hidden');
        }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const go = (idx) => {
      current = (idx + reviews.length) % reviews.length;
      setPositions();
    };

    const startAuto = () => {
      stopAuto();
      autoplay = setInterval(() => go(current + 1), 5500);
    };
    const stopAuto = () => { if (autoplay) clearInterval(autoplay); };

    nextBtn.addEventListener('click', () => { go(current + 1); startAuto(); });
    prevBtn.addEventListener('click', () => { go(current - 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); startAuto(); }));

    // Click on side cards to make them center
    reviews.forEach((r, i) => {
      r.addEventListener('click', () => {
        if (i !== current) { go(i); startAuto(); }
      });
    });

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Touch swipe
    let startX = 0, startY = 0, swiping = false;
    carousel.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY; swiping = true;
      stopAuto();
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      if (!swiping) return;
      swiping = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) go(current + 1); else go(current - 1);
      }
      startAuto();
    });

    // Keyboard arrows
    document.addEventListener('keydown', (e) => {
      const rect = carousel.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowRight') { go(current + 1); startAuto(); }
      if (e.key === 'ArrowLeft') { go(current - 1); startAuto(); }
    });

    // Mark carousel cards as visible immediately (skip scroll-reveal)
    reviews.forEach(r => r.classList.add('is-visible'));

    setPositions();
    startAuto();
  }

  // ---- Nav shadow on scroll ----
  const nav = document.querySelector('.nav');
  if (nav) {
    let ticking = false;
    const update = () => {
      if (window.scrollY > 8) {
        nav.style.boxShadow = '0 1px 0 rgba(231, 226, 212, 0.8), 0 8px 24px rgba(10, 22, 40, 0.04)';
      } else {
        nav.style.boxShadow = 'none';
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }
})();
