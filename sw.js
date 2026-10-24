const CACHE='finance-v3';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
const CDN=['https://cdn.tailwindcss.com/3.4.17','https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js','https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css','https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'];
const HOSTS=['cdn.tailwindcss.com','cdn.jsdelivr.net','cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all([...SHELL.map(u=>c.add(u).catch(()=>{})),...CDN.map(u=>c.add(new Request(u,{mode:'no-cors'})).catch(()=>{}))])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||!(u.origin===location.origin||HOSTS.includes(u.hostname)))return;
  if(r.mode==='navigate'||u.pathname.endsWith('index.html')){e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));return;}
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;}).catch(()=>hit||(r.mode==='navigate'?caches.match('./index.html'):undefined));
    return hit||net;
  }));
});
