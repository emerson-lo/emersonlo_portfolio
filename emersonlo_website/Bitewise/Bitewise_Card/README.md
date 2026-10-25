# Bitewise case-study card: iPhone mockup

This is a looping animation, about 11.3 seconds long, of the Bitewise app on an iPhone centred on `#F5F5F4`. The canvas is 1400×1000 (7:5).

## Flow (the Figma file has no prototype links, so this flow was designed for the video)
1. **Browse (0–3.4s):** scroll the Gluten Free recipes and tap the circle on Vodka Pasta. "Save all selected" goes from 3 to 4. Scroll back up and tap Margarita Pizza.
2. **Recipe (3.4–7.7s):** the recipe screen pushes in from the right. Tap the bookmark (it turns lime), scroll the ingredients, switch to the Instructions tab, scroll the steps, then tap back.
3. **Back (7.7–8.3s):** the home screen returns.
4. **Saved (8.3–11.3s):** tap the bookmark tab to open Favorite Recipes. Tap the ••• on Cheese Burger to open the Remove/Edit menu, dismiss it, then fade back to home for the loop.

## Files
- `Bitewise Mockup Video.dc.html`: entry point and scene list. It needs `support.js`, `animations-v3.jsx` and `bitewise-piece.jsx` beside it.
- `bitewise-piece.jsx`: the screens (`Home`, `Recipe`, `Favorites`) and the timing (`Piece`).
- `bw/`: food and product images exported from the Figma file and downscaled.

## Website card (what the home page uses)
The Bitewise card on `emersonlo_website/index.html` embeds `index.html` from this folder (`Bitewise/Bitewise_Card/index.html`, class `tile__mock`), the same way the Pikspot, JVMC and JASS cards embed their `_Card` folders. It renders only the 1400×1000 stage, scaled to fill the card (`.r-short`, 13:10, shared with JVMC and JASS), with no playback bar. It loops on its own while the card is on screen and stays still when reduced motion is on.

- `index.html`: the page the card embeds (loads Inter 100–700).
- `mockup.js`: the animation the page runs (compiled from `src/mockup.jsx`).
- `src/mockup.jsx`: editable source, built from `bitewise-piece.jsx` above. Edits here need recompiling into `mockup.js` before they show up.
- `vendor/`: React 18.3.1.
- `bw/`: the images, shared with the original handoff.

The original handoff files (`Bitewise Mockup Video.dc.html`, `bitewise-piece.jsx`, `animations-v3.jsx`, `support.js`) are kept for reference and aren't loaded by the website.

**Colors:** background `#191A1F`, deep `#01040F`, lime `#B8F385`, grey `#B3B3B3`.
**Font:** Inter 100–700.
