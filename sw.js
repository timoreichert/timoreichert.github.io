// Let's have it locally. Run "workbox copyLibraries dist"
importScripts('workbox-v3.1.0/workbox-sw.js')

// SETTINGS

// Verbose logging even for the production
workbox.setConfig({ debug: true })
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

// Modify SW update cycle
workbox.skipWaiting()
workbox.clientsClaim()

// PRECACHING

// We inject manifest here using "workbox-build" in workbox-build-inject.js
workbox.precaching.precacheAndRoute([
  {
    "url": "3rdpartylicenses.txt",
    "revision": "32113c007aeec14022e05a03c8e1411e"
  },
  {
    "url": "assets/about_me_1024.jpg",
    "revision": "fb4af678380c493a70490caa889794e2"
  },
  {
    "url": "assets/about_me_425.jpg",
    "revision": "632b8edf24381b39bc01d3f05f59ca54"
  },
  {
    "url": "assets/IMG_20180226_181831-EFFECTS.jpg",
    "revision": "a0131a2d5e4ad5b81798e2344183e271"
  },
  {
    "url": "favicon.ico",
    "revision": "b9aa7c338693424aae99599bec875b5f"
  },
  {
    "url": "fontawesome-webfont.674f50d287a8c48dc19b.eot",
    "revision": "674f50d287a8c48dc19ba404d20fe713"
  },
  {
    "url": "fontawesome-webfont.912ec66d7572ff821749.svg",
    "revision": "912ec66d7572ff821749319396470bde"
  },
  {
    "url": "fontawesome-webfont.af7ae505a9eed503f8b8.woff2",
    "revision": "af7ae505a9eed503f8b8e6982036873e"
  },
  {
    "url": "fontawesome-webfont.b06871f281fee6b241d6.ttf",
    "revision": "b06871f281fee6b241d60582ae9369b9"
  },
  {
    "url": "fontawesome-webfont.fee66e712a8a08eef580.woff",
    "revision": "fee66e712a8a08eef5805a46892932ad"
  },
  {
    "url": "index.html",
    "revision": "6956667d1358e2889a16964e908aaf6a"
  },
  {
    "url": "main.b3d0a90b076057cabbba.js",
    "revision": "dc7314d6dc5c097f653070d2dacc504a"
  },
  {
    "url": "polyfills.2d976f42c1abc2acac30.js",
    "revision": "f43a1ed87fa4a87ea5e4bfd0168426c7"
  },
  {
    "url": "runtime.5f9d33fb31487f0fdbf1.js",
    "revision": "f2c1a0d5e113c332e6bbe7887eb378b2"
  },
  {
    "url": "scripts.ac5951a745aaea6e4877.js",
    "revision": "ce6249f88e8f203ce8653ef732c1c8a8"
  },
  {
    "url": "styles.59cea40677fc41a74d86.css",
    "revision": "c271380305f8eb92fe6e80ebd16795d2"
  }
])

// RUNTIME CACHING

// Google fonts
workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'googleapis',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30
      })
    ]
  })
)

// Github api
workbox.routing.registerRoute(
  new RegExp('https://api.github.com/(.*)'),
  workbox.strategies.networkFirst({
    cacheName: 'githubapis',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30
      })
    ]
  })
)

/*
// API with network-first strategy
workbox.routing.registerRoute(
  /(http[s]?:\/\/)?([^\/\s]+\/)gists/,
  workbox.strategies.networkFirst()
)

// API with cache-first strategy
workbox.routing.registerRoute(
  /(http[s]?:\/\/)?([^\/\s]+\/)favorites/,
  workbox.strategies.cacheFirst()
)
*/
// PUSH NOTIFICATIONS

// Receive push and show a notification
self.addEventListener('push', function (event) {
  console.log('[Service Worker]: Received push event', event)

  var notificationData = {}
  console.log(event.data);
  if (isJson(event.data)) {
    notificationData = event.data.json().notification // "notification node is specific for @angular/service-worker
  } else {
    notificationData = {
      title: 'Something Has Happened',
      message: 'Something you might want to check out',
      icon: '/assets/images/logo.png'
    }
  }

  self.registration.showNotification(notificationData.title, notificationData)
})

// Custom notification actions
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker]: Received notificationclick event')

  event.notification.close()

  if (event.action == 'opentweet') {
    console.log('[Service Worker]: Performing action opentweet')

    event.waitUntil(
      clients.openWindow(event.notification.data).then(function (windowClient) {
        // do something with the windowClient.
      })
    )
  } else {
    console.log('[Service Worker]: Performing default click action')

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(

      clients.matchAll({
        includeUncontrolled: true,
        type: 'window'
      })
        .then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i]
            if (client.url == '/' && 'focus' in client)
              return client.focus()
          }
          if (clients.openWindow)
            return clients.openWindow('/')
        }))
  }
})

// BACKGROUND SYNC
/*
// Registering a route for retries
workbox.routing.registerRoute(
  /(http[s]?:\/\/)?([^\/\s]+\/)post-tweet/,
  workbox.strategies.networkOnly({
    plugins: [
      new workbox.backgroundSync.Plugin('tweetsQueue', {
        maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
      })
    ]
  }),
  'POST'
)
*/

// GOOGLE ANALYTICS
workbox.googleAnalytics.initialize({
  parameterOverrides: {
    dimension1: 'offline'
  }
})


function isJson(item) {
  item = typeof item !== "string"
      ? JSON.stringify(item)
      : item;

  try {
      item = JSON.parse(item);
  } catch (e) {
      return false;
  }

  if (typeof item === "object" && item !== null) {
      return true;
  }

  return false;
}