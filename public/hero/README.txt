Hero floating cards — drop the 4 finished card images here:

  card-headphones.png   — top-left   (rotated -9°)
  card-drill.png        — top-right  (rotated +7°)
  card-thermos.png      — bottom-left (rotated -5°)
  card-serum.png        — bottom-right (rotated +8°)

Recommendations:
- Format: PNG with transparent background (so glow/shadow behind looks right)
- Width: ~600–800px (will be displayed at 300–340px, but retina needs 2×)
- Aspect ratio: each card defines its own; the <img> is rendered with
  width=100% and height=auto, so the image's natural aspect is preserved
- Cards must be FLAT (no rotation baked in) — rotation is applied by CSS

The cards are SOURCE-OF-TRUTH design assets. Code does not draw, decorate
or stylize them — only positions / rotates / floats / glows.
