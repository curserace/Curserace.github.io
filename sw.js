var CACHE = "curserace-v1";
var ASSETS = ["/", "/index.html", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  if (e.request.url.indexOf("supabase") >= 0 || e.request.url.indexOf("umami") >= 0) return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var clone = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
      return r;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});
