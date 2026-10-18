# Plan: three looks with a switcher

## What we're doing

Replace the v1 look with the three looks from the prototype (branch `prototype/realistic-device`): **Surface** (the screen is the device's top), **In hand** (3D, light follows the phone's tilt) and **Front** (the business end, where the whole screen fires). A small switcher at the bottom picks between them. The app remembers the pick on this phone, and the switcher fades with the full-screen button.

## Steps

1. ✅ **Arc follows any layout.** Measure the prongs by layout position so the arc lines up in all three looks, including the 3D one. Add a way to re-measure when the look changes.
2. ✅ **The three looks, rebuilt on the theme.** Move the prototype's colours and sizes into `src/theme.css` and put each look in `src/looks.css`. Surface is the default. On big screens, every look stays phone-sized and centred. In Front, thin strips at the top and bottom don't fire, so a tap there brings the controls back.
3. ✅ **The switcher.** Three buttons at the bottom (Surface, In hand, Front), styled like the full-screen button. Switching is instant (no reload), and the pick is saved on this phone. Arrow keys switch on a laptop.
4. ✅ **Fade together.** In full screen, the switcher fades with the full-screen button, and a tap on the screen (not the trigger) brings both back.
5. ✅ **Docs.** Update the brief, `AGENTS.md` and the glossary: the look switcher is the second allowed control, and the only thing stored is the chosen look, on the device.
6. ✅ **Check.** Run the tests and build, then test in the browser at 390×844: each look fires with the arc aligned, the switcher works, the pick survives a reload, fading works and it runs offline. Then run `web-design-guidelines`.

## What we're NOT doing

- No v1 look (it stays on the prototype branch and in git history)
- No more looks or per-look settings
- No syncing the pick across devices, and no other saved data
- No automatic switch to Front when the phone is turned around

## How we'll know it works

1. Tap Surface, In hand and Front: the device changes instantly, and holding the trigger fires with the arc between the prongs in each.
2. Pick Front, reload: it opens on Front.
3. Go full screen: the switcher and the full-screen button fade away. Tap the screen and they come back.
