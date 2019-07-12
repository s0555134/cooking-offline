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


const matchCb = ({url, event}) => {
    return (url.pathname === '/api/createrecipe');
};


const showNotification = () => {
    self.registration.showNotification('Post Sent', {
        body: 'You are back online and your post was successfully sent!',
        icon: "./images/src/assets/notification_icon.png",
        badge: "./images/src/assets/notification_icon.png"
    });
};

const bgSyncPlugin = new workbox.backgroundSync.Plugin('background-sync-queue', {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
    // callbacks: {
    //     queueDidReplay: showNotification
    // }
});

workbox.routing.registerRoute(
    matchCb,
    workbox.strategies.networkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

workbox.routing.registerRoute(
    new RegExp("api\/recipe\/-[^\s]+"),
    workbox.strategies.networkOnly({
        plugins: [bgSyncPlugin]
    }),
    'PUT'
);

self.addEventListener('notificationclick', event => {
    var notification = event.notification;
    var action = event.action;

    console.log(notification);

    if(action === "confirm") {
        console.log("Notification confirmed");
        notification.close()
    } else {
        console.log(action);
        let url = "http://localhost:5000";
        event.waitUntil(
            clients.matchAll()
                .then(function (clis) {
                    var client = clis.find(function (c) {
                        return c.visibilityState === "visible";
                    })
                    if (client !== undefined) {
                        client.navigate(url);
                        client.focus();
                    } else {
                        clients.openWindow(url)
                    }
                    notification.close();
                })
        );
    }
});

self.addEventListener('push', event => {
    console.log("[SW] push event");
    var data = { title: "Default New", content: "Default new Content"};

    if(event.data) {
        console.log("[SW] data: ", data);
        console.log("[SW] event: ", event);
        console.log("[SW] data.text: ", event.data.text());

        data = JSON.parse(event.data.text());
    }
    const options = {
        body: data.content,
        icon: "./images/src/assets/notification_icon.png",
        badge: "./images/src/assets/notification_icon.png",
        vibrate: [100, 50, 100],
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
