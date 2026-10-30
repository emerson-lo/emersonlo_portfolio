/* Local previews (VS Code Live Server, or a file opened straight from disk).
   The site links to clean addresses like "about" and "pikspot"; GitHub Pages
   serves about.html for those, but a local server doesn't, so on this
   computer they're pointed back at the .html files. The live site is
   untouched. */
(function () {
  var h = location.hostname;
  var local = location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || /^192\.168\./.test(h);
  if (!local) return;
  var PAGES = /^(about|pikspot|hackdavis|jvmc)([?#].*)?$/;
  function fix(a) {
    var href = a.getAttribute('href');
    if (!href) return;
    var m = href.match(PAGES);
    if (m) a.setAttribute('href', m[1] + '.html' + (m[2] || ''));
    else if (/^\.\/([?#].*)?$/.test(href)) a.setAttribute('href', 'index.html' + href.slice(2));
  }
  function run() { document.querySelectorAll('a[href]').forEach(fix); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
