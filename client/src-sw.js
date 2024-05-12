// Importing modules from the Workbox library for various caching strategies, response handling, and routing.
const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// Automatically cache files included in the service worker's manifest.
// This is typically used for precaching assets that are part of the deployment.
precacheAndRoute(self.__WB_MANIFEST);

// Configuration of the CacheFirst strategy for handling page requests.
// This strategy will always try to serve the cached content first before fetching from the network.
const pageCache = new CacheFirst({
  cacheName: 'page-cache', // Defines a custom cache name for storing pages.
  plugins: [
    // Ensures that only requests resulting in certain HTTP statuses are cached.
    new CacheableResponsePlugin({
      statuses: [0, 200],  // 0 handles opaque responses, which are responses from cross-origin resources without CORS headers.
    }),
    // Automatically manages the cache entries to ensure that the cache doesn't grow indefinitely.
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // Specifies that each entry should be cached for 30 days.
    }),
  ],
});

// This function preloads specified URLs into the cache as soon as the service worker is installed.
// Useful for ensuring that key resources are cached ahead of time.
warmStrategyCache({
  urls: ['/index.html', '/'], // List of URLs to cache immediately.
  strategy: pageCache, // The caching strategy to use for preloading.
});

// Sets up a cache-first strategy for handling navigation requests.
// This is primarily for HTML pages where you might want to ensure fast loading by serving from cache.
registerRoute(
  // Defines a condition that must be met for the CacheFirst strategy to be applied.
  ({ request }) => request.mode === 'navigate',
  pageCache // Specifies the caching strategy to be used.
);

// Sets up caching for asset files like CSS, JS, and images using the CacheFirst strategy.
// This is to ensure that assets required for offline functionality are readily available.
registerRoute(
  // Defines a condition for caching based on the type of requests.
  ({request}) => request.destination === 'style' || request.destination === 'script' || request.destination === 'image',
  new CacheFirst({
    cacheName: 'asset-cache', // A separate cache for storing assets to segregate content and manage it appropriately.
    plugins: [
      // Plugin to ensure that only responses with certain HTTP statuses are cached.
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      // Plugin to limit the number of items in the cache and their maximum age, ensuring efficient cache management.
      new ExpirationPlugin({
        maxEntries: 60, // Limits the cache to 60 entries.
        maxAgeSeconds: 30 * 24 * 60 * 60, // Entries expire after 30 days.
      }),
    ],
  })
);
