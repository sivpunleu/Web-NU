import { computed, ref } from 'vue'
import {
  getActiveUserId,
  getStoredSession,
  readScopedStorage,
  subscribeToUserStorage,
  writeScopedStorage,
} from '@/utils/userStorage'

const STORAGE_KEY = 'smartlearn_notifications'

function readStorage() {
  const migrateLegacy = getStoredSession()?.email === 'alex@example.com'
  return readScopedStorage(STORAGE_KEY, [], { migrateLegacy })
}

function writeStorage(value) {
  writeScopedStorage(STORAGE_KEY, value)
}

const notifications = ref(readStorage())
let storageOwner = getActiveUserId()

subscribeToUserStorage(() => {
  const nextOwner = getActiveUserId()
  if (nextOwner === storageOwner) return

  storageOwner = nextOwner
  notifications.value = readStorage()
})

function addNotification({ title, message, type = 'info', to = '/dashboard' }) {
  const notification = {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    title,
    message,
    type,
    to,
    read: false,
    createdAt: new Date().toISOString(),
  }

  notifications.value = [notification, ...notifications.value].slice(0, 30)
  writeStorage(notifications.value)
}

function markNotificationRead(id) {
  notifications.value = notifications.value.map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification,
  )
  writeStorage(notifications.value)
}

function markAllNotificationsRead() {
  notifications.value = notifications.value.map((notification) => ({ ...notification, read: true }))
  writeStorage(notifications.value)
}

function clearNotifications() {
  notifications.value = []
  writeStorage(notifications.value)
}

export function useNotifications() {
  const unreadCount = computed(() => notifications.value.filter((notification) => !notification.read).length)

  return {
    notifications,
    unreadCount,
    addNotification,
    clearNotifications,
    markAllNotificationsRead,
    markNotificationRead,
  }
}
