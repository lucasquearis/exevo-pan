self.addEventListener('push', (e) => {
  const { title, body, url } = e.data.json()
  self.registration.showNotification(title, {
    body,
    icon: 'https://www.exevopan.com/notification-icon.png',
    data: { url },
  })
})

self.addEventListener('notificationclick', (event) => {
  const { url } = event.notification.data

  if (url) clients.openWindow(url)
})