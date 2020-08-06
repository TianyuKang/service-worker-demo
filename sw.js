self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open('v3').then(function(cache) {
      console.log('sw-install');
      return cache.addAll([
        '/sw-test/',
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/myLittleVader.jpg',
        '/sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    console.log('fetch')
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        console.log(response,1111)
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v3').then(function (cache) {
          cache.put(event.request, responseClone);
          // cache.put('test', responseClone);
          // console.log(event.request, responseClone)
        });
        return response;
      }).catch(function () {
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v3'];
  console.log('activate', event.request)
  event.waitUntil(
    caches.keys(event.request).then(function(keyList) {
      console.log(keyList);
      

      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
