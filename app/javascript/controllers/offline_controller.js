import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    this.update();
    this.boundUpdate = this.update.bind(this);
    window.addEventListener('online', this.boundUpdate);
    window.addEventListener('offline', this.boundUpdate);
  }
  disconnect() {
    window.removeEventListener('online', this.boundUpdate);
    window.removeEventListener('offline', this.boundUpdate);
  }
  update() {
    this.element.classList.toggle('hidden', navigator.onLine);
  }
}