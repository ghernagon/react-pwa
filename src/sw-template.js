/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.loadModule('workbox-background-sync');

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST );

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies;
const { BackgroundSyncPlugin } = workbox.backgroundSync;

// registerRoute(
//   new RegExp('https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'),
//   new CacheFirst()
// );

// registerRoute(
//   new RegExp('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css'),
//   new CacheFirst()
// );

// V1 - Primera version de registrar route
// registerRoute(
//   new RegExp('http://localhost:4000/api/auth/renew'),
//   new NetworkFirst()
// );

// registerRoute(
//   new RegExp('http://localhost:4000/api/events'),
//   new NetworkFirst()
// );

// V2 - Version optimizada de registrar route
const cacheFirst = [
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css'
];

registerRoute(
  ({ request, url }) => {
    return cacheFirst.includes(url.href);
  },
  new CacheFirst()
);

const cacheNetworkFirst = [
  '/api/auth/renew',
  '/api/events'
];

registerRoute(
  ({ request, url }) => {
    return cacheNetworkFirst.includes(url.pathname);
  },
  new NetworkFirst()
);


// OFFLINE POST
const bgSyncPlugin = new BackgroundSyncPlugin('offline-post-queue', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

const bgSyncPluginUpdates = new BackgroundSyncPlugin('offline-updates-queue', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

const bgSyncPluginDelete = new BackgroundSyncPlugin('offline-delete-queue', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  new RegExp('http://localhost:4000/api/events'),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

registerRoute(
  new RegExp('http://localhost:4000/api/events/'),
  new NetworkOnly({
    plugins: [bgSyncPluginUpdates],
  }),
  'PUT'
);

registerRoute(
  new RegExp('http://localhost:4000/api/events/'),
  new NetworkOnly({
    plugins: [bgSyncPluginDelete],
  }),
  'DELETE'
);
