self.addEventListener('push', function (event) {
  let data = {}
  try {
    data = event.data.json()
  } catch (e) {
    data = { title: 'Уведомление', body: event.data.text() }
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Уведомление', {
      body: data.body,
      icon:
        data.icon ||
        'https://res.cloudinary.com/djsmqdror/image/upload/v1750155232/pvqgftwlzvt6p24auk7u.png',
      data: { url: data.url || '/' },
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
