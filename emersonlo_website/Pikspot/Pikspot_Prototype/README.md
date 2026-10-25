# Pikspot final prototype (website build)

This is the working Pikspot prototype from `../Final Prototypes/`, rebuilt so the case study page (`preview/pikspot.html`) can embed it. All six screens are one React app; the exported `.html` files each bundled the same app with a different starting screen.

## Where it's used
- **Hero:** `index.html?screen=tour&frame=0` shows the screen alone inside the hand photo's phone. It runs the Home demo (tips, filter chips, a like and a save, a scroll), taps the map tab, runs the Map demo, then taps back to Home and loops.
- **06. Final Prototype:** `index.html?screen=<name>&autoplay=0` shows each phone still on its first frame. The callouts point at what that first frame shows. The page's **Play demo** button runs the screen's demo; tapping the phone lets the reader use it.

Screens: `onboarding`, `home`, `map`, `events`, `upload`, `profile`, and `tour`.

The page controls it with `postMessage({pk: 'play' | 'stop' | 'reset'})`, and the prototype replies with `{pk: 'state', playing, touched}`.

## Files
- `index.html`: the page the iframes load, including the Albert Sans font and the app's animations.
- `prototype.js`: the app, compiled from `src/pikspot-screens.jsx`. Edit the source and recompile; don't edit this file.
- `src/pikspot-screens.jsx`: the exported app with three changes:
  - photo paths point to the `.jpg` copies
  - a `nav` demo step for the tour
  - a phone shell the page can control
- `vendor/`: React 18.3.1.
- `fonts/`: Albert Sans (variable, 400 to 700).
- `assets/`: the photos and icons, compressed for the phone screen (4.8 MB in total, down from 17 MB).
- `pk/`: **stand-ins**. The export referenced a `pk/` folder (camera-roll and gallery photos, the profile photo, the achievement badges) that wasn't included:
  - each photo is a different photo already in the portfolio, saved under the expected name
  - the five badges (`ach1`–`ach5.svg`) are simple drawn icons

  To use the originals, drop them in with the same names (`r1`–`r8.jpg`, `g1`–`g6.jpg`, `a1.jpg`, `a2.jpg`, `arch.jpg`, `ach1`–`ach5.svg`).

The prototype needs a web server (GitHub Pages, or a local one). Opened straight from disk, the browser blocks the achievement badges.
