import './theme.css'
import './base.css'
import './stungun.css'
import { holdToFire } from './trigger.js'
import { createArc } from './arc.js'
import { createSound } from './sound.js'
import { createFlashGate } from './flashGate.js'
import { nextSnap } from './snaps.js'
import { createVibration } from './vibration.js'
import { setupFullscreen } from './fullscreen.js'
import { followTilt } from './tilt.js'

const device = document.querySelector('.stungun')
const trigger = device.querySelector('.trigger')
const arc = createArc(
  device.querySelector('.arc'),
  device.querySelector('.prong--left'),
  device.querySelector('.prong--right'),
  (intensity) => device.style.setProperty('--arc-intensity', intensity),
)
followTilt()
setupFullscreen(document.querySelector('.fullscreen'))

const sound = createSound()
const vibration = createVibration(navigator)

const flash = document.querySelector('.flash')
const flashDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--flash-duration'))
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const flashGate = createFlashGate({ reducedMotion: () => reducedMotion.matches })

// Big snaps land at random moments while firing, with one the instant it starts.
// Flashes stay sparing: the opening crack and the hardest snaps light the screen, faintly.
const FLASH_FROM_STRENGTH = 0.9
let snapTimer = 0
function snap(strength, opening = false) {
  arc.snap(strength)
  sound.snap(strength)
  if ((opening || strength >= FLASH_FROM_STRENGTH) && flashGate.tryFlash(performance.now())) {
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
    snap(1, true)
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
