const CACHE = "codeforge-v2-7-2026-08-27";
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./native-bridge.js",
  "./config.js",
  "./manifest.json",
  "./icon.svg",
  "./exercises.json",
  "./exercises-addon-2.2.json",
  "./exercises-addon-2.3.json",
  "./exercises-addon-2.4.json",
  "./exercises-addon-2.5.json",
  "./exercises-addon-2.6.json",
  "./exercises-addon-2.7.json"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith("codeforge-") && key !== CACHE && !key.startsWith("codeforge-offline-"))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

async function readJson(requestUrl, fallbackPath) {
  try {
    const response = await fetch(requestUrl, { cache: "no-store" });
    if (response.ok) return await response.json();
  } catch (_) {}
  const cached = await caches.match(fallbackPath);
  return cached ? cached.json() : { exercises: [] };
}

async function mergedAddonResponse() {
  const root = new URL("./", self.location.href);
  const versions = ["2.2", "2.3", "2.4", "2.5", "2.6", "2.7"];
  const packs = await Promise.all(versions.map(v =>
    readJson(new URL(`exercises-addon-${v}.json`, root), `./exercises-addon-${v}.json`)
  ));
  const byId = new Map(packs.flatMap(pack => pack.exercises || []).map(item => [item.id, item]));
  return new Response(JSON.stringify({
    version: "2.7.0",
    updatedAt: "2026-08-27",
    exercises: [...byId.values()]
  }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith("/exercises-addon-2.2.json")) {
    event.respondWith(mergedAddonResponse());
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request, { cache: "no-store" })
        .then(response => {
          if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => cached || new Response("Contenuto non disponibile offline", { status: 503 }));
      return cached || network;
    })
  );
});
