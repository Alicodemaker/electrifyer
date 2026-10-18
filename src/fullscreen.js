// The full-screen button. Once full screen it fades away, along with any other
// controls passed in; a tap on the screen (not the trigger) brings them back.
const FADE_AFTER_MS = 2500

export function setupFullscreen(button, otherControls = []) {
  if (!document.fullscreenEnabled) return // iPhone Safari can't go full screen
  button.hidden = false

  let fadeTimer = 0
  const isFull = () => Boolean(document.fullscreenElement)
  const controls = [button, ...otherControls]
  const fade = (faded) => controls.forEach((c) => c.classList.toggle('is-faded', faded))

  function show() {
    fade(false)
    clearTimeout(fadeTimer)
    if (isFull()) fadeTimer = setTimeout(() => fade(true), FADE_AFTER_MS)
  }

  button.addEventListener('click', () => {
    if (isFull()) document.exitFullscreen()
    else document.documentElement.requestFullscreen().catch(() => {})
  })

  document.addEventListener('fullscreenchange', () => {
    button.setAttribute('aria-label', isFull() ? 'Exit full screen' : 'Full screen')
    clearTimeout(fadeTimer)
    fade(isFull())
  })

  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.trigger')) show()
  })
  for (const control of controls) control.addEventListener('focusin', show)
}
