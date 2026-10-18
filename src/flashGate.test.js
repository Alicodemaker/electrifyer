import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createFlashGate } from './flashGate.js'

test('allows the first 3 flashes within a second', () => {
  const gate = createFlashGate({ reducedMotion: () => false })
  assert.deepEqual([gate.tryFlash(0), gate.tryFlash(200), gate.tryFlash(400)], [true, true, true])
})

test('refuses a 4th flash inside the same second', () => {
  const gate = createFlashGate({ reducedMotion: () => false })
  gate.tryFlash(0)
  gate.tryFlash(200)
  gate.tryFlash(400)
  assert.equal(gate.tryFlash(999), false)
})

test('allows flashing again once the oldest flash is more than a second old', () => {
  const gate = createFlashGate({ reducedMotion: () => false })
  gate.tryFlash(0)
  gate.tryFlash(200)
  gate.tryFlash(400)
  assert.equal(gate.tryFlash(1001), true)
  assert.equal(gate.tryFlash(1100), false) // 200, 400 and 1001 are all within the last second
})

test('never flashes when the user prefers reduced motion', () => {
  let reduced = true
  const gate = createFlashGate({ reducedMotion: () => reduced })
  assert.equal(gate.tryFlash(0), false)
  reduced = false // the setting can change while the app is open
  assert.equal(gate.tryFlash(5000), true)
})
