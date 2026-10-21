# Plan: In hand as the only view

## What we're doing

Keep just the In hand look, drop the switcher, give the device real proportions, and keep the screen flashes faint and sparing.

## Steps

1. ✅ **One view.** Fold In hand into the base device styles (pitch-black backdrop, perspective, rubber texture, tilt sheen in `src/tilt.js`). Remove the Surface and Front looks, the switcher and the saved setting.
2. ✅ **Real proportions.** Anchor the device to the bottom of the screen and make it 2.4 times as long as it is wide, like a real stun gun. (Stretching it until the prongs touched the top made it look far too long.) On short screens it shrinks a little so the prongs stay on screen.
3. ✅ **Sparing flashes.** Only the opening crack and the hardest snaps flash the screen, faintly. The 3-per-second safety cap and reduced-motion rule stay.
4. ✅ **Docs and check.** Update the brief, `AGENTS.md` and the glossary. Test at several phone sizes, plus laptop and landscape.

## What we're NOT doing

- No way to bring the other looks back (they're in git history and on `prototype/realistic-device`)
- No landscape layout (the trigger is partly off screen there but still fires)

## How we'll know it works

1. On any phone the device looks like a real stun gun, with the prongs on screen and the trigger in thumb reach.
2. Holding the trigger flashes the screen faintly, about once every second or two.
