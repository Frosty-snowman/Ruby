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