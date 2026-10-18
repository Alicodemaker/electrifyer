import './theme.css'
import './base.css'
import './stungun.css'
import { holdToFire } from './trigger.js'
import { createArc } from './arc.js'
import { createSound } from './sound.js'

const device = document.querySelector('.stungun')
const trigger = device.querySelector('.trigger')
const arc = createArc(
  device.querySelector('.arc'),
  device.querySelector('.prong--left'),
  device.querySelector('.prong--right'),
  (intensity) => device.style.setProperty('--arc-intensity', intensity),
)
const sound = createSound()

// Big snaps land at random moments while firing, with one the instant it starts.
let snapTimer = 0
function snap(strength) {
  arc.snap(strength)
  sound.snap(strength)
  snapTimer = setTimeout(() => snap(0.6 + Math.random() * 0.4), 150 + Math.random() * 550)
}

holdToFire(trigger, {
  onStart() {
    device.classList.add('is-firing')
    arc.start()
    sound.start()
    snap(1)
  },
  onStop() {
    device.classList.remove('is-firing')
    clearTimeout(snapTimer)
    arc.stop()
    sound.stop()
  },
  onGesture() {
    sound.unlock()
  },
})
