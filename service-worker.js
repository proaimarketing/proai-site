self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("proai-cache").then((cache) => {
      return cache.addAll([
        "/index.html",
        "/dashboard.html",
        "/login.html",
        "/background.jpg",
        "/logo.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
