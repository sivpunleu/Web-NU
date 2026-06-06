import { SESSION_STORAGE_KEY, notifyUserStorageChanged } from './userStorage.js'

const BACKUP_VERSION = 1
const KEY_PREFIX = 'smartlearn_'
const EXCLUDED_KEYS = new Set([SESSION_STORAGE_KEY, 'smartlearn_user'])

function isAllowedKey(key) {
  return key.startsWith(KEY_PREFIX) && !EXCLUDED_KEYS.has(key)
}

export function createSmartLearnBackup() {
  const entries = {}

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key || !isAllowedKey(key)) continue
    entries[key] = window.localStorage.getItem(key)
  }

  return {
    app: 'SmartLearn',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    entries,
  }
}

export function downloadSmartLearnBackup() {
  const backup = createSmartLearnBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `smartlearn-backup-${date}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)

  return Object.keys(backup.entries).length
}

export function parseSmartLearnBackup(text) {
  const backup = JSON.parse(text)

  if (
    backup?.app !== 'SmartLearn' ||
    backup?.version !== BACKUP_VERSION ||
    !backup.entries ||
    typeof backup.entries !== 'object' ||
    Array.isArray(backup.entries)
  ) {
    throw new Error('Invalid SmartLearn backup')
  }

  const entries = Object.entries(backup.entries)
  if (!entries.length) throw new Error('Backup does not contain data')

  for (const [key, value] of entries) {
    if (!isAllowedKey(key) || typeof value !== 'string') {
      throw new Error('Backup contains unsupported data')
    }

    JSON.parse(value)
  }

  return backup
}

export function restoreSmartLearnBackup(backup) {
  for (const [key, value] of Object.entries(backup.entries)) {
    window.localStorage.setItem(key, value)
  }

  notifyUserStorageChanged()
  return Object.keys(backup.entries).length
}
