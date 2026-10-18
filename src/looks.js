// The three looks and the switcher that picks between them.
// The pick is the only thing the app stores, and only on this device.
const LOOKS = ['surface', 'in-hand', 'front']
const STORAGE_KEY = 'electrifyer-look'

export function setupLooks(switcher, onChange) {
  const buttons = [...switcher.querySelectorAll('[data-look]')]
  // The browser bar takes the look's backdrop colour: black for In hand.
  const themeColor = document.querySelector('meta[name="theme-color"]')
  const css = getComputedStyle(document.documentElement)
  const barColor = (look) => css.getPropertyValue(look === 'in-hand' ? '--color-void' : '--color-bg').trim()
  let current = load()

  function apply(look) {
    document.body.classList.remove(...LOOKS.map((l) => `look-${l}`))
    document.body.classList.add(`look-${look}`)
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.look === look))
    themeColor.content = barColor(look)
    current = look
    save(look)
    onChange()
  }

  for (const button of buttons) button.addEventListener('click', () => apply(button.dataset.look))
  window.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[e.key]
    if (step) apply(LOOKS[(LOOKS.indexOf(current) + step + LOOKS.length) % LOOKS.length])
  })

  // In hand: the sheen follows the phone's tilt (Android), or the mouse on a laptop.
  const tilt = (x, y) => {
    document.body.style.setProperty('--tilt-x', Math.max(-1, Math.min(1, x)).toFixed(3))
    document.body.style.setProperty('--tilt-y', Math.max(-1, Math.min(1, y)).toFixed(3))
  }
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma != null) tilt(e.gamma / 35, (e.beta - 45) / 35)
  })
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') tilt((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1)
  })

  apply(current)
}

// Storage can be missing or blocked (private mode); the app works without it.
function load() {
  try {
    const look = localStorage.getItem(STORAGE_KEY)
    return LOOKS.includes(look) ? look : LOOKS[0]
  } catch {
    return LOOKS[0]
  }
}

function save(look) {
  try {
    localStorage.setItem(STORAGE_KEY, look)
  } catch {}
}
