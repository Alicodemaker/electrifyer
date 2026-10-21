// The sheen on the rubber follows the phone's tilt (Android), or the mouse on a laptop.
export function followTilt() {
  const set = (x, y) => {
    document.body.style.setProperty('--tilt-x', Math.max(-1, Math.min(1, x)).toFixed(3))
    document.body.style.setProperty('--tilt-y', Math.max(-1, Math.min(1, y)).toFixed(3))
  }
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma != null) set(e.gamma / 35, (e.beta - 45) / 35)
  })
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1)
  })
}
