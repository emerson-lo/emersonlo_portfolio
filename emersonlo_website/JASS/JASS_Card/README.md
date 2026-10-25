# JASS case-study card: MacBook + iPhone mockup

This is a looping animation, about 9.2 seconds long, of the JASS @ UC Davis site. The MacBook (desktop site) is on the left and the iPhone (mobile site) is on the right, on the card's grey (`#F5F5F4`). The canvas is 1400×1000 (7:5).

## What happens
1. **Intro (0–2.0s):** the hero holds, then both sites scroll to "Who We Are".
2. **About (2.0–4.4s):** the phone swipes the Who We Are carousel to the Japanese slide. Both sites then scroll to "Join us for our...".
3. **Events (4.4–7.4s):** the cursor hovers each event card (the card lifts and its photo zooms), then clicks RSVP on Big/Little. The phone swipes through the three event cards.
4. **Return (7.4–9.2s):** both glide back to the top, so the loop is seamless.

## Files
- `JASS Mockup Video.dc.html`: entry point and scene list. It needs `support.js`, `animations-v3.jsx` and `jass-piece.jsx` beside it.
- `jass-piece.jsx`: all markup and choreography. `DesktopPage` and `MobilePage` rebuild the Figma Homepage and Home frames. `Piece` holds the timing.
- `jass/`: images exported from the Figma file and downscaled.

## Website card (what the home page uses)
The JASS card on `emersonlo_website/index.html` embeds `index.html` from this folder (`JASS/JASS_Card/index.html`, class `tile__mock`), the same way the Pikspot and JVMC cards embed their `_Card` folders. It renders only the 1400×1000 stage, scaled to fill the card (`.r-short`, 13:10, shared with JVMC), with no playback bar. It loops on its own while the card is on screen and stays still when reduced motion is on.

- `index.html`: the page the card embeds.
- `mockup.js`: the animation the page runs (compiled from `src/mockup.jsx`).
- `src/mockup.jsx`: editable source, built from `jass-piece.jsx` above. Edits here need recompiling into `mockup.js` before they show up.
- `vendor/`: React 18.3.1.
- `jass/`: the images, shared with the original handoff.

The original handoff files (`JASS Mockup Video.dc.html`, `jass-piece.jsx`, `animations-v3.jsx`, `support.js`) are kept for reference and aren't loaded by the website.

**Colors:** navy `#2C3868`, pink `#F47F8F`, yellow `#FFD420`, ink `#404447`, page `#F8F8F9`.
**Font:** Gaegu 400/700 (Google Fonts). The RSVP button uses Helvetica Neue Bold.
