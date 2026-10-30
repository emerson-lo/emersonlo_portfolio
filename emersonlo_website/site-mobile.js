/* Phones: the nav's toggle opens and closes a full-screen menu (see
   site-mobile.css). It runs before the page's own toggle script, and on
   phones stops that one from running, since the rail slide it drives
   doesn't exist here. Wider screens are left alone. */
(function () {
  var phone = window.matchMedia('(max-width: 640px)');
  var nav = document.querySelector('.nav');
  var btn = nav && nav.querySelector('.nav__toggle');
  if (!btn) return;
  var root = document.documentElement;

  function set(open) {
    nav.classList.toggle('nav--sheet', open);
    root.classList.toggle('has-sheet', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) nav.scrollTop = 0;
  }
  function sync() {
    if (phone.matches) set(false);
    else { nav.classList.remove('nav--sheet'); root.classList.remove('has-sheet'); }
  }

  /* capture on the document fires before the button's own listeners */
  document.addEventListener('click', function (e) {
    if (!phone.matches) return;
    if (e.target.closest('.nav__toggle') === btn) {
      e.stopPropagation();
      e.preventDefault();
      set(!nav.classList.contains('nav--sheet'));
      return;
    }
    /* any link in the menu closes it: same-page anchors would otherwise
       scroll the page hidden behind the sheet */
    if (nav.classList.contains('nav--sheet') && e.target.closest('.nav a')) set(false);
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav--sheet')) { set(false); btn.focus(); }
  });

  /* coming back to a page from the back/forward cache: start closed */
  window.addEventListener('pageshow', sync);
  if (phone.addEventListener) phone.addEventListener('change', sync);
  else if (phone.addListener) phone.addListener(sync);
  sync();
})();
