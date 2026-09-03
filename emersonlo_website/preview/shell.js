/* Subtle scroll behaviour shared by both variants.
   Everything runs off one rAF loop so scrolling stays cheap. */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var q = new URLSearchParams(location.search);

  /* capture mode: freeze everything in its finished state so the page can be
     photographed in one shot. ?only=work also drops the hero + fixed nav. */
  if (q.has('static') || q.has('only')) {
    var s = document.createElement('style');
    s.textContent = '*{transition:none!important;animation:none!important}' +
      '.reveal{opacity:1!important;transform:none!important}' +
      '.frame .tag{opacity:1!important;transform:scale(1) rotate(var(--rot,0deg))!important}';
    document.head.appendChild(s);
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    if (q.get('only') === 'foot') {
      var h = document.querySelector('.hero');
      var m = document.querySelector('.main');
      if (h) h.remove();
      if (m) m.remove();
      return;
    }
    if (q.get('only') === 'work') {
      var hero = document.querySelector('.hero');
      var nav = document.querySelector('.nav');
      var foot = document.querySelector('.foot');
      var dv = document.querySelector('.diver');
      if (hero) hero.remove();
      if (nav) nav.remove();
      if (dv) dv.remove();
      if (foot) foot.remove();
      var main = document.querySelector('.main');
      main.style.marginLeft = '0';
      main.style.marginTop = '0';   /* hero is gone, its 100vh offset would too */
    }
    return;
  }

  /* ---- reveal on enter ---- */
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var d = parseFloat(e.target.dataset.delay || 0);
        setTimeout(function () { e.target.classList.add('is-in'); }, d);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  if (reduce) return;

  /* ---- metal drift: pause the two blurred hero layers once they've
     scrolled off screen instead of compositing them forever ---- */
  (function () {
    var hero = document.querySelector('.hero');
    if (!hero || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        hero.classList.toggle('is-in-view', e.isIntersecting);
      });
    });
    io.observe(hero);
  })();

  /* ---- case study tiles: a light scroll parallax ----
     Each tile drifts a few px toward its resting position as it
     approaches the vertical centre of the viewport, and drifts back
     out the opposite way as it leaves. Reads (getBoundingClientRect)
     and writes (transform) are batched into separate passes so this
     never forces a layout during scroll. */
  (function () {
    var tiles = document.querySelectorAll('.tile__vis');
    if (!tiles.length) return;

    var MAX = 16;              /* px of drift at most, either direction */
    var raf = null;

    function apply() {
      raf = null;
      var vh = window.innerHeight;
      var offsets = [];        /* pass 1: read every rect first */
      tiles.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2;
        var t = (vh / 2 - center) / (vh / 2 + r.height / 2);
        offsets.push(Math.max(-1, Math.min(1, t)) * MAX);
      });
      tiles.forEach(function (el, i) {   /* pass 2: write every transform */
        el.style.transform = 'translate3d(0,' + offsets[i].toFixed(1) + 'px,0)';
      });
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(apply);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    apply();
  })();

})();
