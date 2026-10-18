import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crackleVibration, createVibration } from './vibration.js'

test('the pattern alternates short buzzes (15–45ms) and short pauses (10–40ms), starting with a buzz', () => {
  for (const random of [() => 0, () => 0.9999, Math.random]) {
    const pattern = crackleVibration(2000, random)
    pattern.forEach((ms, i) => {
      const [min, max] = i % 2 === 0 ? [15, 45] : [10, 40]
      assert.ok(Number.isInteger(ms) && ms >= min && ms <= max, `step ${i} is ${ms}ms`)
    })
  }
})

test('the pattern lasts at least as long as asked for', () => {
  const total = crackleVibration(2000).reduce((sum, ms) => sum + ms, 0)
  assert.ok(total >= 2000 && total < 2100, `total ${total}ms`)
})

test('start buzzes in a crackle pattern and stop cancels the buzz', () => {
  const calls = []
  const vibration = createVibration({ vibrate: (pattern) => calls.push(pattern) })
  vibration.start()
  vibration.stop()
  assert.ok(Array.isArray(calls[0]) && calls[0].length > 1, 'start sends a pattern')
  assert.equal(calls[1], 0, 'stop sends 0')
})

test('does nothing on phones without vibration support (such as iPhones)', () => {
  const vibration = createVibration({})
  assert.doesNotThrow(() => {
    vibration.start()
    vibration.stop()
  })
})
