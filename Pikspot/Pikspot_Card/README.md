# Handoff: Pikspot Mockup Video

## Overview
A looping (~10s) phone-mockup animation of the Pikspot app for case-study cards. A simulated finger moves through four parts of the app: Home feed → Post detail → Map → Community Events → back to Home (seamless loop). Canvas: 1600×1200, background `#C7E3F9`.

## About the Design Files
These files are **design references built in HTML/React**. They show the intended look and motion; they are not production code. Recreate them in the target environment your project uses. That could be a React/Remotion video, a Framer/Motion component, a Lottie, or a rendered MP4/WebM. If there's no existing environment, Remotion (React → MP4) is the closest fit, because `pikspot-piece.jsx` is already a pure function of time `T`.

To preview locally, serve the folder (for example `npx serve .`) and open `Pikspot Mockup Video.dc.html`. Opening it via `file://` won't work, because the scripts are fetched.

## Fidelity
**High-fidelity.** Colors, type, imagery and layout come from the Pikspot Figma file. Match them exactly.

## Files
- `Pikspot Mockup Video.dc.html`: entry point. Declares the scene list (`window.OM_SCENES`) and mounts `PikspotVideo`.
- `pikspot-piece.jsx`: **all screens + choreography**. This is the main file to study.
- `animations-v3.jsx`: timeline engine (`CompositionStage`, `useComposition`, `Easing`, scrubber/export).
- `support.js`: runtime for the `.dc.html` wrapper.
- `assets/`: photos, map and nav icons exported from Figma.

## Timeline
Scenes are authored in seconds and slowed by about 1.25× via `dur`/`nat`:

| Scene | Authored | Played | What happens |
|---|---|---|---|
| Feed | 0–2.2 | 2.75s | Feed flings up 560px (easeOutQuart, 0.35→1.45s); tap on the Golden Gate post at 1.75s |
| Detail | 2.2–4.4 | 2.75s | Detail slides in from the right (393px→0, easeInOutCubic, 0.45s) with home parallax −90px; heart tap at +0.75s (17→18, black fill, scale pulse 1→1.45→1); scroll 300px; tap "View in Map" |
| Map | 4.4–6.3 | 2.4s | Detail fades to map (0.4s), map zooms 1.12→1; 5 photo markers pop in (easeOutBack, 80ms stagger); tap marker → location sheet rises 300px |
| Events | 6.3–8.0 | 2.1s | Tap Events tab, crossfade; Friends chip active; scroll 280px; tap Home tab → fade back to Home at scroll 0 (loop seam) |

Touch indicator: 48px circle, `rgba(255,255,255,.55)` fill, 2px `rgba(53,57,53,.35)` border, shadow `0 4px 14px rgba(0,0,0,.25)`, scales to 0.82 while pressed, fades in/out over ~0.15s.

## Screens (393×852 points, phone scaled 1.2×)
Phone shell: 14px bezel `#111`, outer radius 66, screen radius 52, dynamic island 121×35. Shadow `0 40px 80px rgba(20,40,70,.28)`.

- **Home.** "Pikspot" logo (Albert Sans 700 32px, −0.05em). Tip of the Day card (353w, glow `0 0 10px #96CDFA`, title 600 20px `#35A3FC`). Weekly Challenge card (forest image `challenge.jpg`, 130h; title 600 20px; "View Event" pill `#96CDFA`, 12px). Divider. Chips: Near You / Friends / Explore, 108×35, radius 20, active `#C7E3F9`, shadow `0 0 8px rgba(0,0,0,.25)`. Posts: 472px image + 162px info panel (user 20px, place 12px, caption 16px, like/comment/bookmark row).
- **Post Detail.** Header (back, bookmark, more). 400px hero image. Avatar row with like counter. Title 700 24px. Caption. Posted/Taken dates. Map card 353×150 radius 10 with radius circle `rgba(102,184,251,.35)`. "View in Map" pill. Tag chips (0.5px border). Comments.
- **Map.** Full-bleed `map.png`. Search pill (`#F0F0F0`, radius 20). Zoom control. Photo markers: 56px, radius 10, 3px white border, pointer, white count badge. Location sheet: radius 16 top, "Golden Gate Bridge" 600 20px, 108×140 thumbnails.
- **Community Events.** Title 600 24px `#35A3FC`. Challenge card. Chips (Near You / Friends / Global). Event cards: 170px image, title 500 16px blue, Prompt/Location/Time Left 12px, View Event pill. A saved bookmark is filled black.
- **Nav bar** (82h, top 770). Icons: home, map, plus, calendar-with-star, profile. Gap 47, padding 25/30. Active tab opacity 1, inactive 0.42.

## Design Tokens
- Ink `#353935` · Background `#F8F8F8` · Blue `#35A3FC` · Pill `#96CDFA` · Chip active `#C7E3F9` · Grey `#8A8A8A` · Map radius `#66B8FB`
- Font: Albert Sans 400/500/600/700 (Google Fonts)
- Liked/saved state: filled `#353935`

## Assets
All from the Pikspot Figma file:
- `gg.jpg`, `ladies.jpg`: feed posts
- `challenge.jpg`: weekly challenge
- `map.png`: map
- `m1`–`m4.jpg`, `ev3.jpg`: markers and gallery
- `ev1.png`, `e_e.jpg`: event cards
- `avatar.png`
- `nav-*.svg`, `logo.svg`, `sliders.svg`: icons (the events icon is inline SVG in `NavBar`)

Some files in `assets/` are unused extras.

## Website card (what the home page uses)
The Pikspot card on `emersonlo_website/index.html` embeds `index.html` from this folder (`../Pikspot/Pikspot_Card/index.html`). It shows the phone only (no blue background) and loops on its own while the card is on screen.

- `index.html`: the page the card embeds.
- `mockup.js`: the animation the page runs (compiled from `src/mockup.jsx`).
- `src/mockup.jsx`: editable source, built from `pikspot-piece.jsx` above. Edits here need recompiling into `mockup.js` before they show up.
- `vendor/`: React 18.3.1.
- `card-assets/`: smaller copies of the images the animation uses (1.3 MB instead of 17 MB).

The original handoff files (`Pikspot Mockup Video.dc.html`, `pikspot-piece.jsx`, `animations-v3.jsx`, `support.js`, `assets/`) are kept for reference and aren't loaded by the website.
