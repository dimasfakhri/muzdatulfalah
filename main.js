/* ============================================================
   MUZDATUL FALAH - Main JavaScript
   ============================================================ */

(function() {
  'use strict';

  /* ---- PAGE ROUTER ---- */
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-page]');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  /* ===== 2. DEFINE FUNCTIONS ===== */
  function closeMobileNav() {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileNav) mobileNav.classList.remove('open');
  }

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Update active nav link
    navLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.page === pageId);
    });
    // Close mobile nav
    closeMobileNav();
    // Update hash
    history.pushState(null, '', '#' + pageId);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showPage(this.dataset.page);
    });
  });

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  // Handle hash on load
  const hash = window.location.hash.replace('#', '');
  showPage(hash || 'home');

  /* ---- HAMBURGER / MOBILE NAV ---- */

  function closeMobileNav() {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileNav) mobileNav.classList.remove('open');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  // Mobile accordion sub-menus
  document.querySelectorAll('.mobile-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const sub = toggle.nextElementSibling;
      if (sub && sub.classList.contains('mobile-sub')) {
        sub.classList.toggle('open');
        const arrow = toggle.querySelector('.m-arrow');
        if (arrow) arrow.textContent = sub.classList.contains('open') ? '▲' : '▼';
      }
    });
  });

  /* ---- MODAL ---- */
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closeModal(this.id);
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    }
  });

  /* ---- TABS ---- */
  document.querySelectorAll('.tab-list').forEach(tabList => {
    tabList.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const group = this.dataset.group;
        const target = this.dataset.tab;
        document.querySelectorAll(`.tab-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`.tab-content[data-group="${group}"]`).forEach(c => c.style.display = 'none');
        this.classList.add('active');
        const el = document.querySelector(`.tab-content[data-tab="${target}"][data-group="${group}"]`);
        if (el) el.style.display = 'block';
      });
    });
  });

  /* ---- PMB FORM ---- */
  const pmbForm = document.getElementById('pmb-form');
  if (pmbForm) {
  pmbForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = {
      nama: document.getElementById('pmb-nama').value,
      tanggal_lahir: document.getElementById('pmb-ttl').value,
      program: document.getElementById('pmb-program').value,
      orangtua: document.getElementById('pmb-orangtua').value,
      kontak: document.getElementById('pmb-kontak').value,
      email: document.getElementById('pmb-email').value,
      alamat: document.getElementById('pmb-alamat').value,
      catatan: document.getElementById('pmb-catatan').value
    };

    try {
      const res = await fetch('http://localhost:3000/api/pmb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      const alertBox = document.getElementById('pmb-alert');
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = `✅ ${result.message || 'Data berhasil dikirim'}!`;
        alertBox.scrollIntoView({ behavior: 'smooth' });
        pmbForm.reset();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
  }

  /* ---- CONTACT FORM ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('kontak-nama').value;
      const alert = document.getElementById('kontak-alert');
      if (alert) {
        alert.style.display = 'block';
        alert.innerHTML = `✅ Pesan dari <strong>${name}</strong> berhasil terkirim! Kami akan merespons dalam 1x24 jam.`;
        contactForm.reset();
      }
    });
  }

  /* ---- TICKER DUPLICATION ---- */
  const ticker = document.querySelector('.ticker-track');
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML;
  }

  /* ---- SCROLL REVEAL ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  function setupReveal() {
    document.querySelectorAll('.card, .news-card-featured, .testi-card, .step-card, .artikel-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }
  setTimeout(setupReveal, 100);

  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = Math.floor(current).toLocaleString('id-ID') + (el.dataset.suffix || '');
    }, 16);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* ---- ARTIKEL FILTER ---- */
  window.filterArtikel = function(cat) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.filter-btn[data-cat="' + cat + '"]').forEach(b => b.classList.add('active'));
    document.querySelectorAll('.artikel-card').forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  /* ---- GALLERY LIGHTBOX ---- */
  window.openGallery = function(emoji, caption) {
    const modal = document.getElementById('gallery-modal');
    const content = document.getElementById('gallery-content');
    if (modal && content) {
      content.innerHTML = `<div style="font-size:6rem;text-align:center;padding:40px;">${emoji}</div>
        <p style="text-align:center;font-weight:700;color:var(--primary-dark);font-size:1.1rem;">${caption}</p>`;
      modal.classList.add('open');
    }
  };

})();
