import './theme.css'
import './base.css'
import './stungun.css'
import { holdToFire } from './trigger.js'
import { createArc } from './arc.js'
import { createSound } from './sound.js'
import { createFlashGate } from './flashGate.js'
import { nextSnap } from './snaps.js'
import { createVibration } from './vibration.js'

const device = document.querySelector('.stungun')
const trigger = device.querySelector('.trigger')
const arc = createArc(
  device.querySelector('.arc'),
  device.querySelector('.prong--left'),
  device.querySelector('.prong--right'),
  (intensity) => device.style.setProperty('--arc-intensity', intensity),
)
const sound = createSound()
const vibration = createVibration(navigator)

const flash = document.querySelector('.flash')
const flashDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--flash-duration'))
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const flashGate = createFlashGate({ reducedMotion: () => reducedMotion.matches })

// Big snaps land at random moments while firing, with one the instant it starts.
let snapTimer = 0
function snap(strength) {
  arc.snap(strength)
  sound.snap(strength)
  if (flashGate.tryFlash(performance.now())) {
    flash.animate([{ opacity: strength }, { opacity: 0 }], { duration: flashDuration, easing: 'ease-out' })
  }
  const next = nextSnap()
  snapTimer = setTimeout(() => snap(next.strength), next.delay)
}

holdToFire(trigger, {
  onStart() {
    device.classList.add('is-firing')
    arc.start()
    sound.start()
    vibration.start()
    snap(1)
  },
  onStop() {
    device.classList.remove('is-firing')
    clearTimeout(snapTimer)
    arc.stop()
    sound.stop()
    vibration.stop()
  },
  onGesture() {
    sound.unlock()
  },
})
