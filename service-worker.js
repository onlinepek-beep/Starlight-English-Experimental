const CACHE_VERSION = 'starlight-v4';
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

async function putInRuntimeCache(request, response){
  if(!response || !response.ok) return;
  try{
    const cache = await caches.open(RUNTIME_CACHE);
    const cacheRequest = new Request(request.url, {method:'GET'});
    await cache.put(cacheRequest, response.clone());
  }catch(e){}
}

async function networkFirst(request, fallbackUrl = null){
  try{
    const response = await fetch(request, {cache:'no-store'});
    if(response && response.ok){
      await putInRuntimeCache(request, response);
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
    status:503,
    headers:{'Content-Type':'text/plain; charset=utf-8'}
  });
}

async function cacheFirst(request){
  const cached = await caches.match(request);
  if(cached) return cached;

  try{
    const response = await fetch(request);
    if(response && response.ok){
      await putInRuntimeCache(request, response);
    }
    return response;
  }catch(e){
    return new Response('Офлайн: ресурс недоступен.', {
      status:503,
      headers:{'Content-Type':'text/plain; charset=utf-8'}
    });
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if(request.method !== 'GET') return;

  const url = new URL(request.url);
  if(url.origin !== self.location.origin) return;

  // Страница приложения: при наличии сети получаем свежий HTML,
  // при отсутствии сети используем последнюю сохранённую версию.
  if(request.mode === 'navigate'){
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  // Словарь и manifest также обновляются из сети, когда она доступна.
  if(
    url.pathname.endsWith('/data/vocabulary.json') ||
    url.pathname.endsWith('/data/vocabulary-schema.json') ||
    url.pathname.endsWith('/manifest.json')
  ){
    event.respondWith(networkFirst(request));
    return;
  }

  // JS-файлы приложения должны получать свежую версию онлайн,
  // но оставаться доступными офлайн.
  if(
    url.pathname.endsWith('/js/alphabet.js') ||
    url.pathname.endsWith('/js/numbers.js')
  ){
    event.respondWith(networkFirst(request));
    return;
  }

  // Аудио: после первого успешного прослушивания остаётся в локальном кэше.
  if(url.pathname.includes('/audio/')){
    event.respondWith(cacheFirst(request));
    return;
  }

  // Остальные локальные ресурсы: быстрый cache-first.
  event.respondWith(cacheFirst(request));
});