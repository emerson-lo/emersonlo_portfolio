# JVMC case-study card: MacBook + iPhone mockup

This is a looping animation, about 9 seconds long, of the Joan Viteri Memorial Clinic site. A MacBook (desktop site) and an iPhone (mobile site) sit side by side on the card's grey (`#F5F5F4`). The canvas is 1400×1000 (7:5), the same ratio as the `.r-short` JVMC tile.

## What happens
1. **Intro (0–2.0s):** the hero haze drifts, then both sites scroll to the Unbiased Healthcare card.
2. **Story (2.0–4.4s):** the mission cards hold on screen, then both sites scroll to "Explore Our Clinics!".
3. **Clinics (4.4–7.3s):** a cursor clicks the desktop carousel's right arrow twice (Volunteer → Gender Health Clinic → JVMC Clinic). A finger swipes the mobile carousel twice.
4. **Return (7.3–9.1s):** both glide back to the top, so the loop is seamless.

The phone runs 0.3s behind the laptop so they don't move in lockstep. Easing is easeInOutQuart for scrolls and easeInOutCubic for carousel slides.

## Files
- `JVMC Mockup Video.dc.html`: entry point and scene list. It loads `animations-v3.jsx` and `jvmc-piece.jsx`, and needs `support.js` beside it.
- `jvmc-piece.jsx`: all markup and choreography. `DesktopPage` and `MobilePage` rebuild the Figma "Home - Emerson" and "Home Mobile - Emerson" frames. `Piece` holds the timing.
- `jv/`: images exported from the JVMC Figma file and downscaled (logo, teddy, clinic photos).

## Website card (what the home page uses)
The JVMC card on `emersonlo_website/index.html` embeds `index.html` from this folder (`../JVMC/JVMC_Card/index.html`, class `tile__mock`), the same way the Pikspot card embeds `Pikspot/Pikspot_Card`. It renders only the 1400×1000 stage, scaled to fill the card, with no playback bar. It loops on its own while the card is on screen and stays still when reduced motion is on.

- `index.html`: the page the card embeds.
- `mockup.js`: the animation the page runs (compiled from `src/mockup.jsx`).
- `src/mockup.jsx`: editable source, built from `jvmc-piece.jsx` above. Edits here need recompiling into `mockup.js` before they show up.
- `vendor/`: React 18.3.1.
- `jv/`: the images, shared with the original handoff.

The original handoff files (`JVMC Mockup Video.dc.html`, `jvmc-piece.jsx`, `animations-v3.jsx`, `support.js`) are kept for reference and aren't loaded by the website.

**Colors:** teal `#01887A`, mint `#ABDCCF`, deep green `#094935`, ink `#353935`, page `#F8F8F8`.
**Fonts:** Merriweather 700 (headings) and Inter 400/600/700 (body), from Google Fonts.
