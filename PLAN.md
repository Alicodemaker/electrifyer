# Plan: Electrifyer version 1

## What we're doing

Bring the existing stun gun screen to life. Holding the trigger (or the spacebar) fires a live, flickering arc between the prongs, with a crackling sound generated in the browser, vibration on Android and a screen flash on big snaps. Letting go stops everything instantly. It works offline and installs like an app. See `BRIEF.md` for the full scope.

## Steps

1. ✅ **Hold to fire.** Firing starts when the trigger is pressed (touch, mouse or a held spacebar) and stops on release. It also stops if the finger slides off the trigger, the tab is hidden or the window loses focus. This replaces the CSS-only preview with a `firing` state on the device, and the LED lights while firing.
2. **Animated arc.** Draw the arc on a canvas between the prong tips and generate a new jagged path with random side branches every frame, so it never repeats. The brightness flickers, and the violet light spills onto the faceplate while firing.
3. **Synthesised sound (ADR 0001).** Build the sound with Web Audio: filtered noise for the crackle, a buzzing hum, and random sharp snaps. Audio switches on with the first trigger press and stops the instant you let go. Tell Safari the sound is media playback so it plays with the iPhone silent switch on (iOS 17 and newer).
4. **Snaps drive the effects.** Each snap triggers an extra-bright arc frame and a screen flash. Flashes are capped at 3 per second for photosensitivity safety, and switched off when the phone's reduce-motion setting is on. That rule is built test-first with `tdd`, using Node's built-in test runner (no new dependency). Phones that support web vibration buzz in a crackling pattern while firing; on others, nothing happens.
5. **App icon.** Replace the starter icons (`icon.svg`, 192px, 512px and maskable) with a stun gun icon in the theme colours. Update the favicon to match.
6. **Offline and phone check.** Build the app and confirm the service worker caches everything, including the font. Reload with the network off, test at 390×844 with `webapp-testing`, then run `web-design-guidelines`.

## What we're NOT doing

- No ads, accounts, analytics or saved data
- No scores, counters or battery game
- No safety switch, power slider, settings or mute button: the phone's volume buttons are enough
- No other devices (fly swatter, bug zapper)
- No recorded audio files and no camera flashlight
- No landscape layout: it's a portrait app, and a phone on its side just scrolls
- No UI framework or new runtime dependencies

## How we'll know it works

1. On a phone, hold the trigger: the arc crackles and snaps, the sound plays and an Android phone buzzes. Let go and everything stops at once. On a laptop, holding the spacebar does the same.
2. Open the app once, switch on airplane mode and reload. It still loads and fires.
3. On an iPhone with the silent switch on, the zap is still audible. With reduce motion turned on, the arc still works, but the screen never flashes.
