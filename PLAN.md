# Plan: full-screen button

## What we're doing

Add a small button in the top-right corner that puts the page into full screen, so nothing but the stun gun shows. Once full screen, the button fades away. Tapping the screen (anywhere except the trigger) brings it back for a moment, and tapping it then leaves full screen.

## Steps

1. Add the button, top right, inside the safe area. It's 44px, quiet rubber-and-chrome styling from `src/theme.css`, with an expand icon that turns into a collapse icon in full screen.
2. Make the button enter and leave full screen. Fade it out on entering full screen. A tap on the screen (not the trigger) or keyboard focus brings it back, and it fades again after 2.5 seconds.
3. Hide the button where the browser can't go full screen (iPhone Safari).
4. Check it at 390×844: it doesn't cover the device or the prongs, firing still works, and the full-screen behaviour works.

## What we're NOT doing

- No full-screen workaround for iPhone (Add to Home Screen already gives the full-screen look)
- No other buttons or settings
- No remembering full screen between visits (browsers don't allow it without a tap anyway)

## How we'll know it works

1. Tap the button: the page goes full screen and the button fades away.
2. Tap the screen: the button reappears. Tap it again to leave full screen. Leave it alone and it fades again.
3. Holding the trigger in full screen still fires, and doesn't bring the button back.
