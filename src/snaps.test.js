import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextSnap } from './snaps.js'

test('the soonest a snap can follow another is 150ms, at the lowest strength of 0.6', () => {
  assert.deepEqual(nextSnap(() => 0), { delay: 150, strength: 0.6 })
})

test('snaps never come more than 700ms apart and never exceed full strength', () => {
  const { delay, strength } = nextSnap(() => 0.9999)
  assert.ok(delay < 700, `delay ${delay}`)
  assert.ok(delay > 699, `delay ${delay}`)
  assert.ok(strength <= 1, `strength ${strength}`)
})
