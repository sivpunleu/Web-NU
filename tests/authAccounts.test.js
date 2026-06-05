import test from 'node:test'
import assert from 'node:assert/strict'
import {
  hashPassword,
  toSessionUser,
  verifyAccount,
} from '../src/utils/authAccounts.js'

test('demo accounts require the exact password', async () => {
  const admin = await verifyAccount('admin@smartlearn.kh', 'admin123')
  const rejected = await verifyAccount('admin@smartlearn.kh', 'password')

  assert.equal(admin?.role, 'admin')
  assert.equal(rejected, null)
})

test('registered accounts are verified with their password hash', async () => {
  const email = 'student@example.com'
  const account = {
    id: 'user-student',
    name: 'Student',
    email,
    role: 'admin',
    passwordHash: await hashPassword(email, 'strong-password'),
  }

  const verified = await verifyAccount(email, 'strong-password', [account])
  assert.equal(verified?.id, account.id)
  assert.equal(verified?.role, 'student')
  assert.equal(await verifyAccount(email, 'wrong-password', [account]), null)
})

test('session users never expose credential fields', () => {
  const session = toSessionUser({
    id: 'user-one',
    name: 'Learner',
    email: 'learner@example.com',
    role: 'student',
    passwordHash: 'secret-hash',
  })

  assert.equal(session.id, 'user-one')
  assert.equal('passwordHash' in session, false)
})
