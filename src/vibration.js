// A crackling buzz: short, uneven pulses, like the sparks.
export function crackleVibration(durationMs, random = Math.random) {
  const pattern = []
  let total = 0
  while (total < durationMs) {
    const ms = pattern.length % 2 === 0 ? 15 + Math.round(random() * 30) : 10 + Math.round(random() * 30)
    pattern.push(ms)
    total += ms
  }
  return pattern
}

// Long enough for any realistic hold; stop() cuts it off on release.
const PATTERN_MS = 10000

export function createVibration(nav) {
  const supported = typeof nav.vibrate === 'function'
  return {
    start() {
      if (supported) nav.vibrate(crackleVibration(PATTERN_MS))
    },
    stop() {
      if (supported) nav.vibrate(0)
    },
  }
}
