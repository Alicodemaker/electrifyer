import './theme.css'
import './base.css'
import './stungun.css'
import { holdToFire } from './trigger.js'

const device = document.querySelector('.stungun')
const trigger = device.querySelector('.trigger')

holdToFire(trigger, {
  onStart() {
    device.classList.add('is-firing')
  },
  onStop() {
    device.classList.remove('is-firing')
  },
  onGesture() {},
})
