/* ═══════════════════════════════════════════════════
   SETUA — script.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── Nav scroll shadow ── */
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile hamburger ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  // Animate the three bars
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close mobile menu when a link inside it is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

/* ── Smooth active-link highlighting ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

/* ── Waitlist form ── */
const form    = document.getElementById('waitlistForm');
const success = document.getElementById('waitlistSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl  = form.querySelector('#wl-name');
    const emailEl = form.querySelector('#wl-email');
    const roleEl  = form.querySelector('#wl-role');
    let valid = true;

    [nameEl, emailEl, roleEl].forEach(el => el.classList.remove('error'));

    if (!nameEl.value.trim()) {
      nameEl.classList.add('error');
      valid = false;
    }
    if (!emailEl.value.trim() || !isValidEmail(emailEl.value)) {
      emailEl.classList.add('error');
      valid = false;
    }
    if (!roleEl.value) {
      roleEl.classList.add('error');
      valid = false;
    }

    if (!valid) {
      // Focus first error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate submission (replace with real API call)
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.hidden = true;
      success.hidden = false;
      success.focus();
    }, 900);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Scroll-reveal on features, how-it-works, stats ── */
const revealEls = document.querySelectorAll(
  '.feature-card, .how__step, .providers__stat, .ba-col, .float-card, .audience-card'
);

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transition =
          `opacity 0.45s ease ${i * 40}ms, transform 0.45s ease ${i * 40}ms`;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    // Don't interfere with float-card CSS animations in hero
    if (!el.classList.contains('float-card')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
    }
    revealObserver.observe(el);
  });
}

/* ── Reduce motion: disable all animations ── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealEls.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.transition = 'none';
  });
}