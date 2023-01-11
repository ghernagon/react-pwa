/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.loadModule('workbox-background-sync');

workbox.precaching.precacheAndRoute( [{"revision":"332ad475b9b576acbd7d76201fc9f7b3","url":"asset-manifest.json"},{"revision":"6e1267d9d946b0236cdf6ffd02890894","url":"favicon.ico"},{"revision":"e977e86cdb1624d213fdbbf76555c7aa","url":"index.html"},{"revision":"33dbdd0177549353eeeb785d02c294af","url":"logo192.png"},{"revision":"917515db74ea8d1aee6a246cfbcc0b45","url":"logo512.png"},{"revision":"d9d975cebe2ec20b6c652e1e4c12ccf0","url":"manifest.json"},{"revision":"fa1ded1ed7c11438a9b0385b1e112850","url":"robots.txt"},{"revision":"d630bc4afeb81983a8732437f0923bbc","url":"static/css/2.b78d1cb3.chunk.css"},{"revision":"bbc95a31aee05ce9e3b158a0678416b7","url":"static/css/main.96703769.chunk.css"},{"revision":"bc12d6da622aed991a1cbf626453fbf6","url":"static/js/2.af32ed39.chunk.js"},{"revision":"2783cb611cfe78d22f7194d9d4695716","url":"static/js/2.af32ed39.chunk.js.LICENSE.txt"},{"revision":"38fd6032615d6f5d0d0b5757e951ee15","url":"static/js/main.c1deb3bd.chunk.js"},{"revision":"3f2b05edffeb6b5cda9e5ad8a8f08976","url":"static/js/runtime-main.c2afc8cc.js"}] );

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
