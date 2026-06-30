/* ============================================================
   Interactions
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scroll progress + nav ---- */
  var progress = document.querySelector('.progress');
  var nav = document.querySelector('.nav');
  function onScroll() {
    var st = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('scrolled', st > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- reveal on scroll ---- */
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.05
  });

  document.querySelectorAll('.reveal, .line-mask').forEach(function(el) {
    if (reduce) {
      el.classList.add('in');
    } else {
      revealObserver.observe(el);
    }
  });

  /* ---- animated counters ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = (el.getAttribute('data-dec') === '1') ? 1 : 0;
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = dec ? val.toFixed(1) : Math.round(val).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = dec ? target.toFixed(1) : target.toLocaleString();
    }
    requestAnimationFrame(step);
  }
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        if (reduce) {
          var t = parseFloat(e.target.getAttribute('data-count'));
          e.target.textContent = (e.target.getAttribute('data-dec') === '1') ? t.toFixed(1) : t.toLocaleString();
        } else { animateCount(e.target); }
        countIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { countIO.observe(el); });

  /* magnetic buttons — disabled */

  /* ---- hero parallax (portrait + float cards) ---- */
  var heroWrap = document.querySelector('.hero-portrait-wrap');
  var floats = document.querySelectorAll('.float-card');
  if (heroWrap && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          floats.forEach(function (f, i) {
            var spd = (i + 1) * 0.04;
            f.style.transform = 'translateY(' + (y * spd) + 'px)';
          });
          heroWrap.style.transform = 'translateY(' + (y * 0.06) + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---- timeline rail fill ---- */
  var tl = document.querySelector('.timeline');
  var rail = document.querySelector('.tl-rail');
  if (tl && rail) {
    var items = tl.querySelectorAll('.tl-item');
    var itemIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.35 });
    items.forEach(function (it) { itemIO.observe(it); });
    function fillRail() {
      var r = tl.getBoundingClientRect();
      var vh = window.innerHeight;
      var prog = (vh * 0.55 - r.top) / r.height;
      prog = Math.max(0, Math.min(1, prog));
      rail.style.setProperty('--fill', (prog * 100) + '%');
    }
    window.addEventListener('scroll', fillRail, { passive: true });
    fillRail();
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---- success stories drag-scroll ---- */
  var scroller = document.querySelector('.stories-scroll');
  if (scroller) {
    var down = false, startX, startScroll, moved = false;
    scroller.addEventListener('mousedown', function (e) {
      down = true; moved = false; scroller.classList.add('drag');
      startX = e.pageX; startScroll = scroller.scrollLeft;
    });
    window.addEventListener('mouseup', function () { down = false; scroller.classList.remove('drag'); });
    scroller.addEventListener('mousemove', function (e) {
      if (!down) return;
      e.preventDefault();
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      scroller.scrollLeft = startScroll - dx;
    });
    scroller.querySelectorAll('a').forEach(function (l) {
      l.addEventListener('click', function (e) { if (moved) e.preventDefault(); });
    });
  }

  /* ---- overlay menu ---- */
  var burger = document.getElementById('burger');
  var navx   = document.getElementById('navx');
  if (burger && navx) {
    function setMenu(open) {
      navx.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      navx.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    burger.addEventListener('click', function () {
      setMenu(!navx.classList.contains('open'));
    });
    var navxClose = document.getElementById('navxClose');
    if (navxClose) navxClose.addEventListener('click', function () { setMenu(false); });
    /* close on any link click, with smooth transit coordination */
    navx.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            setMenu(false);
            setTimeout(function() {
              target.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
        } else {
          setMenu(false);
        }
      });
    });
    /* close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navx.classList.contains('open')) setMenu(false);
    });
  }

  /* ---- journey deck: subtle scale-down on buried cards ---- */
  var jkCards = Array.prototype.slice.call(document.querySelectorAll('.jk-card'));
  if (jkCards.length && !reduce) {
    var jkTick = false;
    function jkUpdate() {
      var vh = window.innerHeight;
      jkCards.forEach(function (card, i) {
        var rect = card.getBoundingClientRect();
        var depth = 0;
        for (var j = i + 1; j < jkCards.length; j++) {
          var nr = jkCards[j].getBoundingClientRect();
          var prog = (vh - nr.top) / vh;
          depth += Math.max(0, Math.min(1, prog));
        }
        depth = Math.min(depth, 4);
        var scale = 1 - depth * 0.018;
        var bright = 1 - depth * 0.08;
        card.style.transform = 'scale(' + scale + ')';
        card.style.filter = 'brightness(' + bright + ')';
      });
    }
    window.addEventListener('scroll', function () {
      if (jkTick) return;
      jkTick = true;
      requestAnimationFrame(function () { jkUpdate(); jkTick = false; });
    }, { passive: true });
    jkUpdate();
  }

  /* ---- year ---- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();
