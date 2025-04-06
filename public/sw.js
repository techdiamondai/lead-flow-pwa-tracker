const CACHE_NAME = 'diamond-flow-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/assets/index.css'
];

self.addEventListener('install', (event) => {
  // Force activation by skipping the waiting phase
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Don't cache if it's not a success response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // If both cache and network fail, show a generic fallback
        return new Response('Network and cache both failed. Please try again later.');
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline support
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-leads') {
    event.waitUntil(syncLeads());
  }
});

async function syncLeads() {
  try {
    const offlineLeads = await getOfflineLeads();
    
    if (offlineLeads.length > 0) {
      // Process each offline lead and sync with the server
      for (const lead of offlineLeads) {
        await syncLead(lead);
      }
      await clearOfflineLeads();
    }
  } catch (error) {
    console.error('Error syncing leads:', error);
  }
}

async function getOfflineLeads() {
  const db = await openDB();
  return db.getAll('offlineLeads');
}

async function syncLead(lead) {
  // Implementation would depend on your API
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync lead');
    }
  } catch (error) {
    console.error('Error syncing lead:', error);
    throw error;
  }
}

async function clearOfflineLeads() {
  const db = await openDB();
  return db.clear('offlineLeads');
}

async function openDB() {
  // Simple IndexedDB wrapper
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DiamondFlow', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineLeads')) {
        db.createObjectStore('offlineLeads', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
