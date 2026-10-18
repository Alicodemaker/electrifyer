# Electrifyer — brief

## What it is

A prank toy PWA that turns a phone into a convincing handheld stun gun. The whole screen is the device. Hold the trigger and an arc crackles between the prongs.

## Who it's for

Pranksters: people who hold their phone up to a friend, press the trigger and wait for the flinch.

## The problem

Today they use physical gag toys (buzzer handshakes, fake shock pens) or ad-filled "taser simulator" apps. Neither feels real. Electrifyer wins on realism and on opening instantly from a link: no install, no ads.

## Version 1 must

- Offer three looks, picked with a switcher at the bottom: **Surface** (the screen is the device's top, rubber to every edge, prongs running off the top of the phone), **In hand** (3D perspective with light that follows the phone's tilt) and **Front** (the business end, shown to the friend; the whole middle of the screen fires).
- Fill the screen with one realistic stun gun: matte black rubber body, chrome prongs at the top edge, grip ridges, "Electrifyer" brand mark. Portrait, viewed from above. Drawn in code, with no photos.
- Fire while the trigger is held and stop the instant it is released. The spacebar also fires on a laptop.
- While firing, show a jagged, flickering blue-white arc between the prongs and flash the screen on big snaps.
- While firing, play a sound synthesised live in the browser: crackle, hum and random snaps, never the same twice (ADR 0001). It also plays with the iPhone silent switch on, where iOS allows it.
- Vibrate while firing where the phone supports it (Android).
- On big screens, show the device at phone size, centred on a dark background.
- Work offline and be installable (PWA).

## Version 1 must NOT

Ads, accounts, scores or counters, a battery or charge game, other devices, a settings screen, a power slider, a safety switch, a camera flashlight, or any interface outside the device (the exceptions are a small full-screen button and the look switcher, which fade away once full screen).

## Look and feel

Realistic and tactile: matte black rubber, chrome, a dark backdrop and an electric blue-white arc. Nothing on screen breaks the illusion.

## Data

Only the chosen look, saved on the device (localStorage). No analytics, no network calls.

## Success

A friend flinches the first time.
