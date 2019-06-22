self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener("message", (e)=>{
    if (e.data.action === 'skipWaiting') {
        self.skipWaiting()
    }
});


workbox.routing.registerRoute(
    /.*(?:googleapis)\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'googleapis',
    })
);

workbox.routing.registerRoute(
    /.*(?:gstatic)\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'gstatic',
    })
);

workbox.routing.registerRoute(
    /.*(?:firebasestorage\.googleapis)\.com.*$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'post-images'
    })
);

workbox.routing.registerRoute(
    'http://localhost:3000/api/recipes',
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'get-data-Server'
    })
);

workbox.routing.registerRoute(
    'http://localhost:3000/api/createrecipe',
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'recipes-post'
    })
);


workbox.routing.registerNavigationRoute('/index.html');


self.addEventListener('sync', event => {
    console.log('[SW] Background syncing', event);
    if (event.tag === 'sync-new-posts') {
        console.log('[SW] Syncing new Posts');
    }
});

const matchCb = ({url, event}) => {
    return (url.pathname === '/api/createrecipe');
};


const bgSyncPlugin = new workbox.backgroundSync.Plugin('createdRecipes-post-storage-offline', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
});

workbox.routing.registerRoute(
    matchCb,
    workbox.strategies.networkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

