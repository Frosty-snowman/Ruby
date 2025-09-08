import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="consent"
export default class extends Controller {
  static targets = ["cookieButton", "notificationButton"]

  revisitCookie() {
    window.dispatchEvent(new CustomEvent("open-cookie-modal"))
  }

  async enableNotifications() {
    if (!("Notification" in window)) return alert("ไม่รองรับ Notification")
    if (Notification.permission === "granted") return alert("เปิดใช้งานแล้ว")
    if (Notification.permission === "default") {
      const perm = await Notification.requestPermission()
      if (perm === "granted") new Notification("เปิดแจ้งเตือนแล้ว!")
      return
    }
    alert("Notifications ถูกบล็อค ต้องไปเปิดเองใน browser settings")
  }
}
