// The stun gun's sound, synthesised in the browser (ADR 0001).
// A pre-generated crackle loop (rapid spark pulses over a fizz) plays while
// firing, with a low electrical buzz under it. Big snaps are played on top.
// No audio files: every buffer is made from noise when the app starts.

const LOOP_SECONDS = 4
const SNAP_VARIANTS = 4
// How hard the sound drives the soft-clip and limiter: higher is louder, peaks stay capped.
const DRIVE = 1.35

export function createSound({ context } = {}) {
  let ctx = null
  let master, crackle, snaps
  let playing = null // the sources of the current firing

  function setup() {
    if (ctx) return
    // iOS: treat this as media playback, so the silent switch doesn't mute it (iOS 17+).
    if (navigator.audioSession) navigator.audioSession.type = 'playback'
    ctx = context || new AudioContext({ latencyHint: 'interactive' })

    master = ctx.createGain()
    master.gain.value = 0
    const lowCut = ctx.createBiquadFilter() // phone speakers can't do bass; keep the energy where they can
    lowCut.type = 'highpass'
    lowCut.frequency.value = 220
    const grit = ctx.createWaveShaper()
    grit.curve = softClipCurve(3)
    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -16
    limiter.ratio.value = 8
    limiter.attack.value = 0.001
    limiter.release.value = 0.08
    master.connect(lowCut).connect(grit).connect(limiter).connect(ctx.destination)

    crackle = crackleLoop(ctx)
    snaps = Array.from({ length: SNAP_VARIANTS }, () => snapBuffer(ctx))
  }

  // Before the first accepted gesture the browser refuses to resume; that's expected.
  function wake() {
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  }

  return {
    // Call from a gesture the browser accepts, so later presses can make sound.
    unlock() {
      setup()
      wake()
      // Older iOS only unlocks after something actually plays during a gesture.
      const silent = ctx.createBufferSource()
      silent.buffer = ctx.createBuffer(1, 1, ctx.sampleRate)
      silent.connect(ctx.destination)
      silent.start()
    },

    start() {
      setup()
      wake()
      const now = ctx.currentTime

      const loop = ctx.createBufferSource()
      loop.buffer = crackle
      loop.loop = true
      loop.playbackRate.value = 0.94 + Math.random() * 0.12 // no two firings sound the same
      loop.connect(master)
      loop.start(now, Math.random() * LOOP_SECONDS)

      const buzz = ctx.createOscillator()
      buzz.type = 'sawtooth'
      buzz.frequency.value = 96 + Math.random() * 12
      const buzzTone = ctx.createBiquadFilter()
      buzzTone.type = 'bandpass'
      buzzTone.frequency.value = 900
      buzzTone.Q.value = 0.8
      const buzzLevel = ctx.createGain()
      buzzLevel.gain.value = 0.12
      buzz.connect(buzzTone).connect(buzzLevel).connect(master)
      buzz.start(now)

      playing = [loop, buzz]
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(0, now)
      master.gain.linearRampToValueAtTime(DRIVE, now + 0.004)
    },

    // Instant stop. The 10ms fade only exists to avoid a click.
    stop() {
      if (!playing) return
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + 0.01)
      for (const source of playing) source.stop(now + 0.02)
      playing = null
    },

    snap(strength) {
      if (!playing) return
      const source = ctx.createBufferSource()
      source.buffer = snaps[Math.floor(Math.random() * snaps.length)]
      source.playbackRate.value = 0.85 + Math.random() * 0.3
      const level = ctx.createGain()
      level.gain.value = 0.8 * strength
      source.connect(level).connect(master)
      source.start()
    },
  }
}

// Rapid spark pulses (about 20 a second, never evenly spaced) over a fizz
// of tiny crackles. This is the sound's backbone.
function crackleLoop(ctx) {
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(1, LOOP_SECONDS * rate, rate)
  const out = buffer.getChannelData(0)

  // Fizz: quiet noise, plus a dense rain of tiny crackles.
  for (let i = 0; i < out.length; i++) out[i] = (Math.random() * 2 - 1) * 0.035
  for (let t = 0; t < LOOP_SECONDS; t += -Math.log(Math.random()) / 400) {
    addBurst(out, Math.floor(t * rate), rate, 0.04 + Math.random() * 0.2, 0.0003)
  }

  // Spark pulses: the "tat-tat-tat" of the discharge.
  for (let t = 0; t < LOOP_SECONDS - 0.05; t += (1 / 20) * (0.7 + Math.random() * 0.6)) {
    const at = Math.floor(t * rate)
    addBurst(out, at, rate, 0.45 + Math.random() * 0.45, 0.0015 + Math.random() * 0.0025)
    addRing(out, at, rate, 0.25, 1800 + Math.random() * 3000, 0.0015)
  }

  // Fade the seam so the loop point doesn't click.
  const seam = Math.floor(0.005 * rate)
  for (let i = 0; i < seam; i++) {
    out[i] *= i / seam
    out[out.length - 1 - i] *= i / seam
  }
  return buffer
}

// One big snap: a sharp crack with a short body behind it.
function snapBuffer(ctx) {
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(1, Math.floor(0.09 * rate), rate)
  const out = buffer.getChannelData(0)
  addBurst(out, 0, rate, 1, 0.006 + Math.random() * 0.004)
  addRing(out, 0, rate, 0.5, 2200 + Math.random() * 2000, 0.003)
  addRing(out, 0, rate, 0.6, 140 + Math.random() * 60, 0.018)
  for (let i = 0; i < 3; i++) {
    addBurst(out, Math.floor((0.008 + Math.random() * 0.04) * rate), rate, 0.3 + Math.random() * 0.4, 0.002)
  }
  return buffer
}

// Noise with an instant attack and an exponential decay.
function addBurst(out, at, rate, amp, decay) {
  const length = Math.min(out.length - at, Math.ceil(decay * 6 * rate))
  for (let i = 0; i < length; i++) {
    out[at + i] += (Math.random() * 2 - 1) * amp * Math.exp(-i / (decay * rate))
  }
}

// A decaying sine: gives a crack its "ping".
function addRing(out, at, rate, amp, freq, decay) {
  const length = Math.min(out.length - at, Math.ceil(decay * 6 * rate))
  const step = (2 * Math.PI * freq) / rate
  for (let i = 0; i < length; i++) {
    out[at + i] += Math.sin(i * step) * amp * Math.exp(-i / (decay * rate))
  }
}

function softClipCurve(drive) {
  const curve = new Float32Array(1024)
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1
    curve[i] = Math.tanh(drive * x) / Math.tanh(drive)
  }
  return curve
}
