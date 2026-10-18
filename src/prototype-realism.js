// PROTOTYPE (branch prototype/realistic-device, never merged).
// Question: how do we make the screen read as the real device, not a phone
// showing a picture of one? Three variants, switched with ?variant=A|B|C.
import './prototype-realism.css'

const VARIANTS = [
  ['current', 'Current (v1)'],
  ['A', 'Full-bleed surface'],
  ['B', 'In hand, tilt to see light'],
  ['C', 'Business end, whole screen fires'],
]

const params = new URLSearchParams(location.search)
const index = Math.max(0, VARIANTS.findIndex(([key]) => key === (params.get('variant') ?? 'A')))
document.body.classList.add(`v-${VARIANTS[index][0]}`)

function go(step) {
  const [key] = VARIANTS[(index + step + VARIANTS.length) % VARIANTS.length]
  params.set('variant', key)
  location.search = params // reload so the arc re-measures the new layout
}

const bar = document.createElement('div')
bar.className = 'proto-bar'
bar.innerHTML = `<button type="button" aria-label="Previous variant">‹</button>
  <span>${VARIANTS[index][0]} · ${VARIANTS[index][1]}</span>
  <button type="button" aria-label="Next variant">›</button>`
const [prev, next] = bar.querySelectorAll('button')
prev.addEventListener('click', () => go(-1))
next.addEventListener('click', () => go(1))
document.body.append(bar)
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') go(-1)
  if (e.key === 'ArrowRight') go(1)
})

// Variant B: the reflection follows the phone's tilt (Android), or the mouse on a laptop.
const setTilt = (x, y) => {
  document.body.style.setProperty('--tilt-x', Math.max(-1, Math.min(1, x)).toFixed(3))
  document.body.style.setProperty('--tilt-y', Math.max(-1, Math.min(1, y)).toFixed(3))
}
window.addEventListener('deviceorientation', (e) => {
  if (e.gamma != null) setTilt(e.gamma / 35, (e.beta - 45) / 35)
})
window.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'mouse') setTilt((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1)
})
