document.addEventListener('DOMContentLoaded', function () {
  // Prevent selection, drag, and context menu
  document.addEventListener('selectstart', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  // Apply saved theme early
  try {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}

  // Fade-in on load
  document.body.classList.add('page-ready');
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('primary-nav');
  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var isOpen = list.classList.contains('open');
      list.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // Reveal elements on scroll (timeline, highlights, rankings)
  (function () {
    if (!('IntersectionObserver' in window)) return;

    var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal-on-scroll'));
    var rankingRows = Array.prototype.slice.call(document.querySelectorAll('.ranking-row'));

    if (!revealItems.length && !rankingRows.length) return;

    rankingRows.forEach(function (row, idx) {
      var delay = (idx % 10) * 0.06; // small stagger per row
      row.style.setProperty('--reveal-delay', delay + 's');
      if (revealItems.indexOf(row) === -1) {
        revealItems.push(row);
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    revealItems.forEach(function (item) { observer.observe(item); });
  })();

  // Fade-out transition on nav link click
  var navLinks = document.querySelectorAll('.nav-list a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return; // ignore anchors
      // If already on this page, let default happen
      var current = location.pathname.split('/').pop() || 'index.html';
      if (href === current) return;
      e.preventDefault();
      document.body.classList.add('is-exiting');
      setTimeout(function () { window.location.href = href; }, 120);
    });
  });

  // Theme toggle
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    function currentTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
    function setTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.setAttribute('aria-pressed', 'true');
        themeToggle.textContent = '☀️';
      } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.setAttribute('aria-pressed', 'false');
        themeToggle.textContent = '🌙';
      }
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }

  // Impact modal
  (function () {
    var cards = document.querySelectorAll('.impact-card');
    var modal = document.getElementById('impact-modal');
    if (!cards.length || !modal) return;

    var titleEl = document.getElementById('impact-modal-title');
    var bodyEl = document.getElementById('impact-modal-body');
    var lastTrigger = null;

    function openImpactModal(fromCard) {
      lastTrigger = fromCard || null;
      if (fromCard) {
        var heading = fromCard.querySelector('h3');
        if (heading && titleEl) titleEl.textContent = heading.textContent + ' Impact';
        if (bodyEl) {
          var content = fromCard.querySelector('.impact-modal-content');
          bodyEl.innerHTML = content ? content.innerHTML : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        }
      }
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      var focusable = modal.querySelector('.modal-close');
      var dialog = modal.querySelector('.modal-dialog');
      if (dialog) {
        if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
        if (dialog.focus) dialog.focus();
      } else if (focusable && focusable.focus) {
        focusable.focus();
      }
    }

    function closeImpactModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastTrigger) {
        if (lastTrigger.blur) lastTrigger.blur();
        lastTrigger = null;
      }
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () { openImpactModal(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openImpactModal(card); }
      });
      card.setAttribute('tabindex', card.getAttribute('tabindex') || '0');
      card.style.cursor = 'pointer';
    });

    modal.addEventListener('click', function (e) {
      var t = e.target;
      if (t && (t.getAttribute('data-close') === 'true')) { closeImpactModal(); }
    });

    document.addEventListener('keydown', function (e) {
      if (modal.classList.contains('open') && e.key === 'Escape') { closeImpactModal(); }
    });
  })();

    // Initialize toggle state
    setTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

    themeToggle.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }
});


