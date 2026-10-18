// Decides whether the screen may flash right now.
const MAX_FLASHES = 3
const WINDOW_MS = 1000

export function createFlashGate({ reducedMotion }) {
  const recent = [] // times of allowed flashes, oldest first

  return {
    tryFlash(now) {
      if (reducedMotion()) return false
      if (recent.filter((t) => now - t < WINDOW_MS).length >= MAX_FLASHES) return false
      recent.push(now)
      return true
    },
  }
}
