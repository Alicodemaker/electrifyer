# Plan: In hand as the only view

## What we're doing

Keep just the In hand look, drop the switcher, stretch the device so its prongs reach just below the top edge on any phone, and cut the screen flashes down to one faint flash per press.

## Steps

1. ✅ **One view.** Fold In hand into the base device styles (pitch-black backdrop, perspective, rubber texture, tilt sheen in `src/tilt.js`). Remove the Surface and Front looks, the switcher and the saved setting.
2. ✅ **Prongs to the top.** Anchor the device to the bottom of the screen. `src/fit.js` finds the height that puts the prong tips 1.75rem below the top edge (plus the notch area) on load and on resize.
3. ✅ **Minimal flashes.** Only the opening crack of each press flashes the screen, at a much fainter colour. The 3-per-second safety cap and reduced-motion rule stay.
4. ✅ **Docs and check.** Update the brief, `AGENTS.md` and the glossary. Test at several phone sizes, plus laptop and landscape.

## What we're NOT doing

- No way to bring the other looks back (they're in git history and on `prototype/realistic-device`)
- No landscape layout (the trigger is partly off screen there but still fires)

## How we'll know it works

1. On any phone, the prong tips sit just below the top edge and the trigger is in thumb reach.
2. Holding the trigger for several seconds flashes the screen once, faintly.
