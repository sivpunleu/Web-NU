import { computed, ref } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import {
  createAccountId,
  DEMO_ACCOUNTS,
  findDemoAccount,
  hashPassword,
  normalizeEmail,
  toSessionUser,
  verifyAccount,
} from '@/utils/authAccounts'
import {
  notifyUserStorageChanged,
  SESSION_STORAGE_KEY,
} from '@/utils/userStorage'

const ACCOUNTS_STORAGE_KEY = 'smartlearn_accounts'

const defaultUser = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  role: 'student',
  goal: 'ក្លាយជាអ្នកអភិវឌ្ឍន៍ Frontend',
  avatarUrl: '',
}

function readAccounts() {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNTS_STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function writeAccounts(accounts) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts))
}

function readUser() {
  if (typeof window === 'undefined') return null

  try {
    const savedUser = JSON.parse(window.localStorage.getItem(SESSION_STORAGE_KEY))
    if (!savedUser?.id || !savedUser?.email) return null

    const demoAccount = DEMO_ACCOUNTS.find((item) => item.id === savedUser.id)
    const registeredAccount = readAccounts().find((item) => item.id === savedUser.id)
    const account = demoAccount ?? (registeredAccount ? { ...registeredAccount, role: 'student' } : null)

    if (!account || normalizeEmail(account.email) !== normalizeEmail(savedUser.email)) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }

    return toSessionUser(account, savedUser)
  } catch {
    return null
  }
}

function writeUser(user) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
  window.localStorage.removeItem('smartlearn_user')
  notifyUserStorageChanged()
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

const currentUser = ref(readUser())

export function useAuth() {
  const { addNotification } = useNotifications()

  const isAuthenticated = computed(() => Boolean(currentUser.value))
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  async function login({ email, password }) {
    const account = await verifyAccount(email, password, readAccounts())
    if (!account) {
      return {
        ok: false,
        message: 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។',
      }
    }

    currentUser.value = toSessionUser(account)
    writeUser(currentUser.value)
    addNotification({
      title: 'ចូលគណនីបានជោគជ័យ',
      message: 'អ្នកអាចបន្តការសិក្សាពី dashboard បានហើយ។',
      type: 'success',
      to: '/dashboard',
    })

    return { ok: true, user: currentUser.value }
  }

  async function register({ name, email, goal, password }) {
    const cleanEmail = normalizeEmail(email)
    const accounts = readAccounts()

    if (
      findDemoAccount(cleanEmail) ||
      accounts.some((account) => normalizeEmail(account.email) === cleanEmail)
    ) {
      return {
        ok: false,
        message: 'អ៊ីមែលនេះត្រូវបានប្រើរួចហើយ។',
      }
    }

    const account = {
      id: createAccountId(cleanEmail),
      name: cleanText(name) || defaultUser.name,
      email: cleanEmail,
      role: 'student',
      goal: cleanText(goal) || defaultUser.goal,
      passwordHash: await hashPassword(cleanEmail, password),
      createdAt: new Date().toISOString(),
    }

    writeAccounts([account, ...accounts])
    currentUser.value = toSessionUser(account)
    writeUser(currentUser.value)
    addNotification({
      title: 'បង្កើតគណនីបានជោគជ័យ',
      message: 'គណនី demo របស់អ្នកត្រូវបានរក្សាទុកក្នុង browser នេះ។',
      type: 'success',
      to: '/courses',
    })

    return { ok: true, user: currentUser.value }
  }

  function updateProfile(profile) {
    if (!currentUser.value) return

    currentUser.value = {
      ...currentUser.value,
      name: cleanText(profile.name) || currentUser.value.name,
      goal: cleanText(profile.goal) || currentUser.value.goal,
      avatarUrl: cleanText(profile.avatarUrl),
      level: cleanText(profile.level) || currentUser.value.level,
      bio: cleanText(profile.bio),
    }

    const accounts = readAccounts()
    const accountIndex = accounts.findIndex((account) => account.id === currentUser.value.id)
    if (accountIndex >= 0) {
      accounts[accountIndex] = {
        ...accounts[accountIndex],
        name: currentUser.value.name,
        goal: currentUser.value.goal,
      }
      writeAccounts(accounts)
    }

    writeUser(currentUser.value)
    addNotification({
      title: 'បានរក្សាទុក Profile',
      message: 'ព័ត៌មានសិស្សត្រូវបានកែប្រែរួចហើយ។',
      type: 'success',
      to: '/profile',
    })
  }

  function logout() {
    currentUser.value = null
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_STORAGE_KEY)
      notifyUserStorageChanged()
    }
  }

  return {
    currentUser,
    isAdmin,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
  }
}
