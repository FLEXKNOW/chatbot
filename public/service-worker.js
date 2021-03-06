/**
 * -----------------------------------------------
 *
 * BulldogsChat - an A.I. Chatbot for Fresno State
 * ==  A Smart Virtual Stduent Assistant ==
 * https://github.com/JANQLIANGTSAI/BulldogsChat.git
 *
 * -----------------------------------------------
 *
 * More Information:
 *   https://www.facebook.com/BulldogsChat/
 * App Frontend:
 *   - node.js (https://nodejs.org)
 *   - Progressive Web App (https://en.wikipedia.org/wiki/Progressive_web_app)
 * A.I.
 *   Google - DialogFlow aka. API.ai (https://dialogflow.com)
 *   work in progress:
 *     - RASA (https://rasa.ai/)
 *     - AWS Lex (https://aws.amazon.com/lex)
 * -----------------------------------------------
 *
 * This source code is licensed under the BSD-style license.
 * Copyright 2007- by Max Tsai (mt8168@gmail.com)
 *
 */
var cacheName = 'chatbot-albee';

var filesToCache = [
    './',
    './images/albee16.png',
    './images/albee32.png',
    './images/albee64.png',
    './images/albee128.png',
    './images/albee256.png'
  ];

// Install Service Worker
self.addEventListener('install', function(event) {

    console.log('Service Worker: Installing....');

    event.waitUntil(

        // Open the Cache
        caches.open(cacheName).then(function(cache) {
            console.log('Service Worker: Caching App Shell at the moment......');

            // Add Files to the Cache
            return cache.addAll(filesToCache);
        })
    );
});


// Fired when the Service Worker starts up
self.addEventListener('activate', function(event) {

    console.log('Service Worker: Activating....');

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(key) {
                if( key !== cacheName) {
                    console.log('Service Worker: Removing Old Cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function(event) {

    console.log('Service Worker: Fetch', event.request.url);

    console.log("Url", event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});


// triggered everytime, when a push notification is received.
self.addEventListener('push', function(event) {

  console.info('Event: Push');

  var title = 'New commit on Github Repo: RIL';

  var body = {
    'body': 'Click to see the latest commit',
    'tag': 'pwa',
    'icon': './images/albee64.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, body)
  );
});


self.addEventListener('notificationclick', function(event) {

  var url = './offlineTBD.html';

  event.notification.close(); //Close the notification

  // Open the app and navigate to latest.html after clicking the notification
  event.waitUntil(
    clients.openWindow(url)
  );

});
