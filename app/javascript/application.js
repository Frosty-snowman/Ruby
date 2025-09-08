// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('SW registered', reg))
        .catch(err => console.error('SW failed', err));
    });
  }
let deferredInstallPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    document.getElementById('installBtn')?.classList.remove('hidden');
  });
  
  document.getElementById('installBtn')?.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log('Install prompt outcome:', outcome);
    deferredInstallPrompt = null; // cannot reuse after prompt shown
    document.getElementById('installBtn')?.classList.add('hidden');
  });


  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(12);
    // navigator.clearAppBadge(); // to clear
  }
  document.getElementById('revisitCookieConsent')?.addEventListener('click', () => {
    // Example: if you use your own modal
    window.dispatchEvent(new CustomEvent('open-cookie-modal'));
    // or if using a CMP SDK, call its “reopen”/“showConsentTool” method here.
  });



  document.getElementById('enableNotifications')?.addEventListener('click', async () => {
    if (!('Notification' in window)) return alert('Notifications not supported.');
    if (Notification.permission === 'granted') return alert('Already enabled!');
    if (Notification.permission === 'default') {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') new Notification('Thanks! Notifications enabled.');
      return;
    }
    // denied
    alert('Notifications are blocked. Please enable them in your browser site settings.');
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('SW controlling this page changed (updated).');
    });
  
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        newSW?.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            // new SW is waiting
            const btn = document.getElementById('refreshForUpdate');
            btn?.classList.remove('hidden');
          }
        });
      });
    });
  }
  
  document.getElementById('refreshForUpdate')?.addEventListener('click', async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    reg?.waiting?.postMessage({ type: 'SKIP_WAITING' });
  });
  