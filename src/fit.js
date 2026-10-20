// Stretch the device until its prong tips sit just below the top edge of the
// screen. Perspective makes the right height depend on the phone's shape, so
// it's found by searching rather than set in CSS. The gap to keep comes from
// .stage's padding-top (theme value plus the notch's safe area).
export function fitProngsToTop(stage, device, prong, onFit) {
  function fit() {
    const target = parseFloat(getComputedStyle(stage).paddingTop)
    let low = innerHeight * 0.5
    let high = innerHeight * 3
    for (let i = 0; i < 16; i++) {
      const mid = (low + high) / 2
      device.style.height = `${mid}px`
      if (prong.getBoundingClientRect().top > target) low = mid // too short: tips still too low
      else high = mid
    }
    device.style.height = `${high}px`
    onFit()
  }
  fit()
  window.addEventListener('resize', fit)
}
