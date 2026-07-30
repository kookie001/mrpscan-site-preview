document.addEventListener('DOMContentLoaded', () => {
  // Navbar blur on scroll
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Scroll-reveal via IntersectionObserver
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));

  // Hero elements reveal immediately on load (above the fold)
  document.querySelectorAll('#heroSection .reveal').forEach((el) => {
    requestAnimationFrame(() => el.classList.add('in-view'));
  });

  // Count-up numbers in the stats strip
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const isDecimal = el.dataset.count.includes('.');
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => countIO.observe(el));

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Subtle cursor-reactive glow on hero phone
  const heroVisual = document.querySelector('.hero-visual');
  const phoneGlow = document.querySelector('.phone-glow');
  if (heroVisual && phoneGlow) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      phoneGlow.style.transform = `translate(${(x - rect.width / 2) * 0.15}px, ${(y - rect.height / 2) * 0.15}px)`;
    });
  }

  // Theme switcher
  const THEMES = {
    dark: { file: 'themes/dark.css', label: 'Midnight Gold', swatch: 'linear-gradient(135deg,#f3d99a,#a6763a)' },
    boutique: { file: 'themes/boutique.css', label: 'Boutique Ivory', swatch: 'linear-gradient(135deg,#d9ac78,#8a5f38)' },
    tech: { file: 'themes/tech.css', label: 'Tech Gradient', swatch: 'linear-gradient(135deg,#22d3ee,#8b5cf6)' },
    minimal: { file: 'themes/minimal.css', label: 'Minimal Editorial', swatch: 'linear-gradient(135deg,#111,#0e6b4f)' },
  };
  const themeSwitch = document.getElementById('themeSwitch');
  const themeSwitchBtn = document.getElementById('themeSwitchBtn');
  const themeSwitchMenu = document.getElementById('themeSwitchMenu');
  const themeStylesheet = document.getElementById('themeStylesheet');
  const themeSwatch = document.getElementById('themeSwatch');
  const themeSwitchLabel = document.getElementById('themeSwitchLabel');

  function applyTheme(key, { persist = true } = {}) {
    const theme = THEMES[key];
    if (!theme) return;
    themeStylesheet.setAttribute('href', theme.file);
    themeSwatch.style.background = theme.swatch;
    themeSwitchLabel.textContent = theme.label;
    document.documentElement.dataset.theme = key;
    if (persist) localStorage.setItem('pratham-theme', key);
  }

  if (themeSwitch && themeSwitchBtn && themeSwitchMenu) {
    const saved = localStorage.getItem('pratham-theme');
    if (saved && THEMES[saved]) applyTheme(saved, { persist: false });

    themeSwitchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeSwitch.classList.toggle('open');
      themeSwitchBtn.setAttribute('aria-expanded', themeSwitch.classList.contains('open'));
    });

    themeSwitchMenu.querySelectorAll('li').forEach((li) => {
      li.addEventListener('click', () => {
        applyTheme(li.dataset.theme);
        themeSwitch.classList.remove('open');
        themeSwitchBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!themeSwitch.contains(e.target)) {
        themeSwitch.classList.remove('open');
        themeSwitchBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        themeSwitch.classList.remove('open');
        themeSwitchBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
