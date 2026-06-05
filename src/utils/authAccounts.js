export const DEMO_ACCOUNTS = Object.freeze([
  {
    id: 'demo-student',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    password: 'password',
    role: 'student',
    goal: 'ក្លាយជាអ្នកអភិវឌ្ឍន៍ Frontend',
  },
  {
    id: 'demo-admin',
    name: 'Admin SmartLearn',
    email: 'admin@smartlearn.kh',
    password: 'admin123',
    role: 'admin',
    goal: 'គ្រប់គ្រងមាតិកា SmartLearn',
  },
])

export function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase()
}

export async function hashPassword(email, password) {
  const input = `${normalizeEmail(email)}:${String(password ?? '')}`
  const bytes = new TextEncoder().encode(input)
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes)

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function findDemoAccount(email) {
  const normalizedEmail = normalizeEmail(email)
  return DEMO_ACCOUNTS.find((account) => account.email === normalizedEmail) ?? null
}

export async function verifyAccount(email, password, registeredAccounts = []) {
  const normalizedEmail = normalizeEmail(email)
  const demoAccount = findDemoAccount(normalizedEmail)

  if (demoAccount) {
    return demoAccount.password === password ? demoAccount : null
  }

  const account = registeredAccounts.find((item) => normalizeEmail(item.email) === normalizedEmail)
  if (!account) return null

  const passwordHash = await hashPassword(normalizedEmail, password)
  return account.passwordHash === passwordHash ? { ...account, role: 'student' } : null
}

export function createAccountId(email) {
  const slug = normalizeEmail(email)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `user-${slug || 'learner'}-${Date.now()}`
}

export function toSessionUser(account, profile = {}) {
  return {
    id: account.id,
    name: profile.name || account.name,
    email: normalizeEmail(account.email),
    role: account.role === 'admin' ? 'admin' : 'student',
    goal: profile.goal || account.goal || '',
    avatarUrl: profile.avatarUrl || '',
    level: profile.level || 'Intermediate',
    bio: profile.bio || '',
  }
}
