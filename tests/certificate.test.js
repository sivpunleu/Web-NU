import test from 'node:test'
import assert from 'node:assert/strict'
import { buildCertificateId } from '../src/utils/certificate.js'

test('certificate ids are stable for the same attempt', () => {
  const input = {
    userId: 'user-one',
    courseId: 'vue-foundation',
    submittedAt: '2026-06-05T10:30:00.000Z',
  }

  assert.equal(buildCertificateId(input), buildCertificateId(input))
})

test('certificate ids differ between users and attempts', () => {
  const base = {
    courseId: 'vue-foundation',
    submittedAt: '2026-06-05T10:30:00.000Z',
  }

  assert.notEqual(
    buildCertificateId({ ...base, userId: 'user-one' }),
    buildCertificateId({ ...base, userId: 'user-two' }),
  )
  assert.notEqual(
    buildCertificateId({ ...base, userId: 'user-one' }),
    buildCertificateId({ ...base, userId: 'user-one', submittedAt: '2026-06-06T10:30:00.000Z' }),
  )
})
