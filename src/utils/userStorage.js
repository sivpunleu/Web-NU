export const SESSION_STORAGE_KEY = 'smartlearn_session'
export const USER_STORAGE_EVENT = 'smartlearn:user-storage-changed'

function cloneFallback(value) {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value))
}

export function getStoredSession() {
  if (typeof window === 'undefined') return null

  try {
    return JSON.parse(window.localStorage.getItem(SESSION_STORAGE_KEY)) ?? null
  } catch {
    return null
  }
}

export function getActiveUserId() {
  return getStoredSession()?.id || 'guest'
}

export function scopedStorageKey(baseKey, userId = getActiveUserId()) {
  return `${baseKey}:${userId}`
}

export function readScopedStorage(baseKey, fallback, { migrateLegacy = false } = {}) {
  if (typeof window === 'undefined') return cloneFallback(fallback)

  try {
    const key = scopedStorageKey(baseKey)
    const storedValue = window.localStorage.getItem(key)
    if (storedValue !== null) return JSON.parse(storedValue)

    if (migrateLegacy) {
      const legacyValue = window.localStorage.getItem(baseKey)
      if (legacyValue !== null) {
        const parsedValue = JSON.parse(legacyValue)
        window.localStorage.setItem(key, JSON.stringify(parsedValue))
        return parsedValue
      }
    }
  } catch {
    return cloneFallback(fallback)
  }

  return cloneFallback(fallback)
}

export function writeScopedStorage(baseKey, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(scopedStorageKey(baseKey), JSON.stringify(value))
}

export function notifyUserStorageChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(USER_STORAGE_EVENT))
}

export function subscribeToUserStorage(callback) {
  if (typeof window === 'undefined') return () => {}

  window.addEventListener(USER_STORAGE_EVENT, callback)
  return () => window.removeEventListener(USER_STORAGE_EVENT, callback)
}
