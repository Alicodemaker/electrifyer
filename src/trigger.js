// Hold to fire: firing lasts exactly as long as the trigger (or spacebar) is held.
// Anything that could leave it stuck on (finger sliding off, tab hidden,
// window losing focus) stops it.
export function holdToFire(trigger, { onStart, onStop, onGesture }) {
  const held = new Set() // 'pointer' and/or 'key'

  function press(source) {
    const wasFiring = held.size > 0
    held.add(source)
    if (!wasFiring) onStart()
  }

  function release(source) {
    if (!held.delete(source)) return
    if (held.size === 0) onStop()
  }

  function releaseAll() {
    if (held.size === 0) return
    held.clear()
    onStop()
  }

  trigger.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    press('pointer')
  })
  // Touch screens tie the finger to the trigger until it lifts, so
  // pointerleave never fires for a finger sliding off. Check where it is instead.
  trigger.addEventListener('pointermove', (e) => {
    const r = trigger.getBoundingClientRect()
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) release('pointer')
  })
  for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
    trigger.addEventListener(type, () => release('pointer'))
  }
  // A long press must not open the context menu or start a drag.
  trigger.addEventListener('contextmenu', (e) => e.preventDefault())

  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Space') return
    e.preventDefault()
    if (!e.repeat) press('key')
  })
  window.addEventListener('keyup', (e) => {
    if (e.code !== 'Space') return
    e.preventDefault()
    release('key')
  })

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) releaseAll()
  })
  window.addEventListener('blur', releaseAll)

  // Browsers only allow sound and vibration after a "real" gesture, and on
  // touch screens pressing down doesn't count, only lifting the finger does.
  // So report every gesture that does count, to unlock them as early as possible.
  for (const type of ['pointerup', 'touchend', 'click', 'keydown']) {
    window.addEventListener(type, onGesture, { capture: true })
  }
}
