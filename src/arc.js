// The arc between the prongs, drawn fresh every frame so it never repeats.
// Colours come from theme.css; positions come from the prong elements.

const DEPTH = 6 // midpoint subdivisions: 2^6 = 64 segments per strand

export function createArc(canvas, leftProng, rightProng, onIntensity) {
  const ctx = canvas.getContext('2d')
  const css = getComputedStyle(document.documentElement)
  const color = (name) => css.getPropertyValue(name).trim()
  const core = color('--color-on-primary')
  const glow = color('--color-primary')
  const halo = color('--color-arc-halo')

  let dpr = 1
  let tips = null // where the arc can attach on each prong, in canvas pixels
  let frame = 0
  let boost = 0 // extra brightness from a snap, decays each frame

  function measure() {
    dpr = window.devicePixelRatio || 1
    const box = canvas.getBoundingClientRect()
    canvas.width = Math.round(box.width * dpr)
    canvas.height = Math.round(box.height * dpr)
    const tipOf = (prong, side) => {
      const r = prong.getBoundingClientRect()
      return {
        x: ((side === 'left' ? r.right : r.left) - box.left) * dpr,
        top: (r.top - box.top + r.width * 0.5) * dpr,
        span: r.height * 0.22 * dpr, // only the upper part of the prong
      }
    }
    tips = { left: tipOf(leftProng, 'left'), right: tipOf(rightProng, 'right') }
  }

  new ResizeObserver(measure).observe(canvas)

  // A jagged line from a to b by recursive midpoint displacement.
  function strand(a, b, roughness) {
    let points = [a, b]
    let spread = Math.hypot(b.x - a.x, b.y - a.y) * roughness
    for (let d = 0; d < DEPTH; d++) {
      const next = [points[0]]
      for (let i = 1; i < points.length; i++) {
        const p = points[i - 1]
        const q = points[i]
        next.push({ x: (p.x + q.x) / 2 + (Math.random() - 0.5) * spread * 0.4, y: (p.y + q.y) / 2 + (Math.random() - 0.5) * spread }, q)
      }
      points = next
      spread *= 0.6
    }
    return points
  }

  function stroke(points, width, style, alpha, blur) {
    ctx.globalAlpha = alpha
    ctx.lineWidth = width * dpr
    ctx.strokeStyle = style
    ctx.shadowColor = glow
    ctx.shadowBlur = blur * dpr
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
    ctx.stroke()
  }

  function bolt(points, scale, intensity) {
    stroke(points, 9 * scale, halo, 0.35 * intensity, 18)
    stroke(points, 3.5 * scale, glow, 0.8 * intensity, 8)
    stroke(points, 2 * scale, core, Math.min(1, intensity), 4)
  }

  function attach(tip) {
    return { x: tip.x, y: tip.top + Math.random() * tip.span }
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'lighter'
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    // Real arcs pulse: most frames are bright, a few nearly drop out.
    const flicker = Math.random() < 0.06 ? 0.15 : 0.65 + Math.random() * 0.35
    const intensity = flicker + boost
    const strands = 1 + Math.floor(Math.random() * 2) + (boost > 0.3 ? 2 : 0)

    for (let s = 0; s < strands; s++) {
      const main = s === 0
      const points = strand(attach(tips.left), attach(tips.right), main ? 0.22 : 0.32)
      bolt(points, main ? 1 + boost : 0.6, main ? intensity : intensity * 0.5)

      // Side branches that fork off and fizzle out.
      if (main && Math.random() < 0.7) {
        const from = points[8 + Math.floor(Math.random() * 48)]
        const len = (12 + Math.random() * 28) * dpr
        const angle = (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 1.6)
        const to = { x: from.x + Math.cos(angle) * len * 0.6, y: from.y + Math.sin(angle) * len }
        bolt(strand(from, to, 0.4).slice(0, 40), 0.45, intensity * 0.6)
      }
    }

    onIntensity(Math.min(1, intensity))
    boost *= 0.7
    frame = requestAnimationFrame(draw)
  }

  return {
    start() {
      if (!tips) measure()
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    },
    stop() {
      cancelAnimationFrame(frame)
      boost = 0
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      onIntensity(0)
    },
    // A big snap: brighter, thicker, more strands for a few frames.
    snap(strength) {
      boost = Math.max(boost, 0.9 * strength)
    },
  }
}
