import test from 'node:test'
import assert from 'node:assert/strict'
import { parseSmartLearnBackup } from '../src/utils/dataBackup.js'

test('SmartLearn backup accepts supported local data', () => {
  const backup = parseSmartLearnBackup(
    JSON.stringify({
      app: 'SmartLearn',
      version: 1,
      entries: {
        'smartlearn_settings:user-one': JSON.stringify({ theme: 'dark' }),
        smartlearn_admin_courses: JSON.stringify([]),
      },
    }),
  )

  assert.equal(backup.entries['smartlearn_settings:user-one'], '{"theme":"dark"}')
})

test('SmartLearn backup rejects session and unrelated keys', () => {
  assert.throws(() =>
    parseSmartLearnBackup(
      JSON.stringify({
        app: 'SmartLearn',
        version: 1,
        entries: {
          smartlearn_session: JSON.stringify({ id: 'forged-session' }),
        },
      }),
    ),
  )

  assert.throws(() =>
    parseSmartLearnBackup(
      JSON.stringify({
        app: 'SmartLearn',
        version: 1,
        entries: {
          unrelated_key: JSON.stringify({ value: true }),
        },
      }),
    ),
  )
})
