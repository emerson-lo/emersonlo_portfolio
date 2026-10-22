# HackDavis card: floating cow on a wave

Drop-in update for the HackDavis tile in `index.html`. The original art has been split into two layers. The wave is pinned so it runs off the card's left and bottom edges, and the cow bobs up and down on top of it.

## Files
- `wave.png` (1969×2651): the rainbow wave. The area behind the cow has been painted in.
- `cow.png` (454×438): the cow alone, on a transparent background.

Copy both into `images/hackdavis/` in the portfolio repo.

## 1. HTML: replace the HackDavis `.tile__vis` line (around line 1537)
```html
<div class="tile__vis r-xshort">
  <div class="tile__art tile__art--hd">
    <img class="hd__wave" src="images/hackdavis/wave.png" width="1969" height="2651" alt="">
    <img class="hd__cow" src="images/hackdavis/cow.png" width="454" height="438" alt="HackDavis cow mascot riding a colourful wave">
  </div>
</div>
```

## 2. CSS: replace the `.tile__art--cow` rule with
```css
/* wave runs off the card's left + bottom edges; cow bobs on top */
.tile__art--hd { width: 150%; left: -12%; top: -45%; aspect-ratio: 1969 / 2651; }
.hd__wave { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.hd__cow {
  position: absolute; left: 24.81%; top: 18.163%; width: 23.032%; height: auto; display: block;
  transform-origin: 50% 85%;
  animation: cow-bob 2.8s ease-in-out infinite;
  will-change: transform;
}
@keyframes cow-bob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-7%) rotate(-2.5deg); }
}
@media (prefers-reduced-motion: reduce) { .hd__cow { animation: none; } }
```

## Notes
- The cow's position values (left, top and width) line the cow up exactly with its original spot in the wave. Don't change them.
- To move or zoom the whole artwork, change only the `width`, `left` and `top` values on `.tile__art--hd`.
- The cow only moves upward from its resting spot. The patched area behind it is meant to stay hidden.
- Remove the old `images/cowfloat.svg` reference.
