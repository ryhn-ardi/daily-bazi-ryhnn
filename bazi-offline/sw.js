const C='bazi-offline-v1';
const FILES=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.url.includes('fonts.googleapis.com')||e.request.url.includes('fonts.gstatic.com'))return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok&&e.request.method==='GET'){const copy=res.clone();caches.open(C).then(c=>c.put(e.request,copy))}return res}).catch(()=>caches.match('./index.html'))))});
