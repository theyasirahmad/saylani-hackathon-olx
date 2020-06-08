var staticAssets = [
    './',
    './style.css',
    './app.js',
    './src/images/olxlogo.png',
    './src/images/SkinnySeveralAsianlion.gif',
    './index.html',
    './addetail.html',
    './adlist.html',
    './adpost.html',
    './chat.html',
    './filedrag.js',
    './firebase-messaging-sw.js',
    './recentchat.html',
    './adlist.html?Property-For-Sale',
    './bootstrap.min.css',
    "./jquery-3.3.1.min.js",
    './fonts/glyphicons-halflings-regular.woff',
    './fonts/glyphicons-halflings-regular.woff2',
    './fonts/glyphicons-halflings-regular.ttf',
    './manifest.json',


];

self.addEventListener('install', async event => {
    // waitUntil() ensures that the Service Worker will not
    // install until the code inside has successfully occurred
    event.waitUntil(
        // Create cache with the name supplied above and
        // return a promise for it
        caches.open('olx-static').then(function (cache) {
            // Important to `return` the promise here to have `skipWaiting()`
            // fire after the cache has been updated.
            return cache.addAll(staticAssets);
        }).then(function () {
            // `skipWaiting()` forces the waiting ServiceWorker to become the
            // active ServiceWorker, triggering the `onactivate` event.
            // Together with `Clients.claim()` this allows a worker to take effect
            // immediately in the client(s).
            return self.skipWaiting();
        })
    );
    // const cache = await caches.open('olx-static2');
    // cache.addAll(staticAssets);
});


self.addEventListener('activate', event => {
    // `claim()` sets this worker as the active worker for all clients that
    // match the workers scope and triggers an `oncontrollerchange` event for
    // the clients.
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    const req = event.request;
    // console.log(req);
    const url = new URL(req.url);
    // console.log(url.origin, location.origin);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req));
        // console.log("Cache First");
    }
    else {
        event.respondWith(networkFirst(event));
        // console.log("Netword First");
    }
});


async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(event) {
    const req = event.request;

    const cache = await caches.open('olx-dynamic');
    try {
        const res = await fetch(req)
        cache.put(req , res.clone());
        return res;
    } catch (error) {
        return await cache.match(req);
    }
}

// function fetchFromNetworkAndCache(e) {
//     if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;

//     return fetch(e.request).then(res => {
//         // foreign requests may be res.type === 'opaque' and missing a url
//         if (!res.url) return res;
//     });
// }