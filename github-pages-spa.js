// Single Page Apps for GitHub Pages
// https://github.com/rafgraph/spa-github-pages
// This script checks to see if a redirect is present in the query string,
// converts it back into the correct url and adds it to the
// browser's history using window.history.replaceState(...),
// which won't cause the browser to attempt to load the new url.
// When the single page app is loaded further down in this file,
// the correct url will be waiting in the browser's history for
// the single page app to route accordingly.
(function(l) {
  // Upstream (spa-github-pages) tests `l.search[1] === '/'`: the marker is the redirect
  // encoding 404.html produces, which ALWAYS begins the query string with a slash. A local
  // `indexOf('/') !== -1` matched any query containing a slash anywhere — so a directly
  // served route with e.g. ?next=/dashboard or a utm value holding a slash was treated as a
  // redirect and rewritten into a mangled URL.
  //
  // The pathname test is the second half of that shape: 404.html keeps zero path segments
  // (pathSegmentsToKeep = 0), so a bounce ALWAYS lands on exactly "/" and `slice(0, -1)` below
  // is only ever removing that one slash. A route served directly with a query that begins with
  // a slash (/faq?/foo — crafted, or a mangled tracking link) used to pass the marker test alone
  // and be rewritten to /fa/foo: the slice chopped the last character of a real pathname.
  if (l.search[1] === '/' && l.pathname === '/') {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location))
