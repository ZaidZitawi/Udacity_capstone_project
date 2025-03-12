//index.js
// This is the entry file for the client-side code.

import { handleSubmit } from './js/app.js';
import './styles/style.scss';

document.getElementById('travel-form').addEventListener('submit', handleSubmit);

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);

        // Listen for updates to the Service Worker
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New Service Worker is available.');
                alert('A new version is available. Reload the page to update.');
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}


// Clear the flag on page load to ensure the next update can work
window.addEventListener('load', () => {
  localStorage.removeItem('serviceWorkerUpdated');
});
