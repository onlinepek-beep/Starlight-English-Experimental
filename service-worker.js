const CACHE_VERSION = 'starlight-v2';
const APP_CACHE = CACHE_VERSION + '-app';
const RUNTIME_CACHE = CACHE_VERSION + '-runtime';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/favicon-32.png',
  './js/alphabet.js',
  './js/numbers.js',
  './data/vocabulary.json',
  './data/vocabulary-schema.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== APP_CACHE && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

async function networkFirst(request, fallbackUrl = null){
  try{
    const response = await fetch(request, { cache: 'no-store' });
    if(response && response.ok){
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
      return response;
    }
  }catch(e){}

  const cached = await caches.match(request);
  if(cached) return cached;

  if(fallbackUrl){
    const fallback = await caches.match(fallbackUrl);
    if(fallback) return fallback;
  }

  return new Response('Офлайн: файл ещё не был загружен.', {
    status: 503,
    headers: {'Content-Type':'text/plain; charset=utf-8'}
  });
}

async function cacheFirst(request){
  const cached = await caches.match(request);
  if(cached) return cached;

  try{
    const response = await fetch(request);
    if(response && response.ok){
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  }catch(e){
    return new Response('Офлайн: ресурс недоступен.', {
      status: 503,
      headers: {'Content-Type':'text/plain; charset=utf-8'}
    });
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if(request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Страница приложения: сначала сеть, при офлайне используем кэш.
  if(request.mode === 'navigate'){
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  if(!isSameOrigin){
    return;
  }

  // Словарь и manifest должны быстро получать свежую версию,
  // но сохраняться для офлайн-режима.
  if(
    url.pathname.endsWith('/data/vocabulary.json') ||
    url.pathname.endsWith('/data/vocabulary-schema.json') ||
    url.pathname.endsWith('/manifest.json')
  ){
    event.respondWith(networkFirst(request));
    return;
  }

  // Аудио: кэшируем только после первого успешного прослушивания.
  if(url.pathname.includes('/audio/')){
    event.respondWith(cacheFirst(request));
    return;
  }

  // Остаток приложения: кэш-first для быстрого запуска.
  event.respondWith(cacheFirst(request));
});