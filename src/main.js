import './theme.css'
import './base.css'
import './stungun.css'
import { holdToFire } from './trigger.js'
import { createArc } from './arc.js'

const device = document.querySelector('.stungun')
const trigger = device.querySelector('.trigger')
const arc = createArc(
  device.querySelector('.arc'),
  device.querySelector('.prong--left'),
  device.querySelector('.prong--right'),
  (intensity) => device.style.setProperty('--arc-intensity', intensity),
)

holdToFire(trigger, {
  onStart() {
    device.classList.add('is-firing')
    arc.start()
  },
  onStop() {
    device.classList.remove('is-firing')
    arc.stop()
  },
  onGesture() {},
})
