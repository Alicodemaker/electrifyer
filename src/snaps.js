// When the next big snap lands, and how hard.
export function nextSnap(random = Math.random) {
  return { delay: 150 + random() * 550, strength: 0.6 + random() * 0.4 }
}
