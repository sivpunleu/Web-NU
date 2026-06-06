import { reactive } from 'vue'
import {
  getActiveUserId,
  readScopedStorage,
  subscribeToUserStorage,
  writeScopedStorage,
} from '@/utils/userStorage'

const STORAGE_KEY = 'smartlearn_settings'

export const defaultSettings = Object.freeze({
  language: 'km',
  theme: 'system',
  emailNotifications: true,
  courseReminders: true,
  publicProfile: false,
})

function loadSettings() {
  return {
    ...defaultSettings,
    ...readScopedStorage(STORAGE_KEY, {}),
  }
}

const settings = reactive(loadSettings())
let storageOwner = getActiveUserId()
let mediaQuery = null

function resolveTheme(theme = settings.theme) {
  if (theme !== 'system') return theme
  return mediaQuery?.matches ? 'dark' : 'light'
}

function applyTheme() {
  if (typeof document === 'undefined') return

  const resolvedTheme = resolveTheme()
  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.dataset.themePreference = settings.theme
  document.documentElement.style.colorScheme = resolvedTheme
}

function handleSystemThemeChange() {
  if (settings.theme === 'system') applyTheme()
}

export function initializeSettings() {
  if (typeof window === 'undefined') return

  if (!mediaQuery) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener?.('change', handleSystemThemeChange)
  }

  applyTheme()
}

function saveSettings() {
  writeScopedStorage(STORAGE_KEY, settings)
  applyTheme()
}

function resetSettings() {
  Object.assign(settings, defaultSettings)
  saveSettings()
}

subscribeToUserStorage(() => {
  const nextOwner = getActiveUserId()
  if (nextOwner === storageOwner) return

  storageOwner = nextOwner
  Object.assign(settings, loadSettings())
  applyTheme()
})

export function useSettings() {
  initializeSettings()

  return {
    settings,
    saveSettings,
    resetSettings,
    applyTheme,
  }
}
