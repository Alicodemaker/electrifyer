// Decides whether the screen may flash right now.
const MAX_FLASHES = 3
const WINDOW_MS = 1000

export function createFlashGate({ reducedMotion }) {
  let recent = [] // times of allowed flashes in the last second

  return {
    tryFlash(now) {
      if (reducedMotion()) return false
      recent = recent.filter((t) => now - t < WINDOW_MS)
      if (recent.length >= MAX_FLASHES) return false
      recent.push(now)
      return true
    },
  }
}
