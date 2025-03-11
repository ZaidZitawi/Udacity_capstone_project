import { handleSubmit } from './js/app.js';
import './styles/style.scss';

document.getElementById('travel-form').addEventListener('submit', handleSubmit);

  // Service Worker Rigistration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }