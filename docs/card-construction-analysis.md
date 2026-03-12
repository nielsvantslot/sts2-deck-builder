# Card Construction Analysis — untapped.gg

Analysis of how `https://sts2.untapped.gg/en/cards` constructs card visuals using multiple layered images and CSS filters.

## Layer Stack (DOM order, bottom to top)

Each card is a `<div>` container with a fixed **747:955 aspect ratio** (~3:4 portrait). All layers are absolutely positioned on top of each other.

```
┌──────────────────────────────────────┐
│ .container                           │
│   data-color="ironclad"              │
│   data-rarity="rare"                 │
│   data-type="power"                  │
│                                      │
│  1. .textureContainer                │  ← Clipped window for portrait art
│     └─ .texture (img)                │  ← Card portrait art (1000×760)
│                                      │
│  2. .frame (img)                     │  ← Card type frame (747×955)
│                                      │
│  3. .frameInner (img) [optional]     │  ← Same frame image, different filter
│                                      │
│  4. .border (img)                    │  ← Card type border (747×955)
│                                      │
│  5. .borderLabel (img)               │  ← Label plate image
│                                      │
│  6. .borderLabelText (svg)           │  ← Card type text ("Power", "Attack", etc.)
│                                      │
│  7. .banner (img)                    │  ← Banner overlay with card name area (747×955)
│                                      │
│  8. .name (svg)                      │  ← Card name text
│                                      │
│  9. Cost orb (img)                   │  ← Character-specific energy orb
│                                      │
│  10. .cost (svg)                     │  ← Energy cost number
│                                      │
│  11. .text (svg + foreignObject)     │  ← Card description text
│                                      │
│  12. .starCost (svg) [Regent only]   │  ← Star cost number
└──────────────────────────────────────┘
```

## Image Assets

### Card Portraits (unique per card)
```
Source: https://sts2json.untapped.gg/art/card_portraits/{character}/{card_slug}.png
Size: 1000×760 (landscape)
```

Characters with portraits found:
- `ironclad` (17 cards): e.g. `aggression`, `anger`, `armaments`
- `silent` (18 cards): e.g. `abrasive`, `accelerant`, `accuracy`
- `defect` (14 cards): e.g. `adaptive_strike`, `all_for_one`, `ball_lightning`
- `necrobinder` (10 cards): e.g. `afterlife`, `banshees_cry`, `blight_strike`
- `regent` (13 cards): e.g. `alignment`, `arsenal`, `astral_pulse`
- `colorless` (9 cards): e.g. `alchemize`, `anointed`, `automation`
- `curse` (2 cards): `ascenders_bane`, `bad_luck`
- `event` (4 cards): `apotheosis`, `apparition`, `brightest_flame`
- `status` (2 cards): `beckon`, `burn`
- `quest` (1 card): `byrdonis_egg`

Card slug format: **lowercase, underscores** (e.g. `bad_luck`, `ball_lightning`, `banshees_cry`)

### Shared Frame Assets (per card type)
```
frame_attack.b66466c9.png   (747×955)
frame_skill.9500a093.png    (747×955)
frame_power.f472f984.png    (747×955)
frame_quest.d2f67c23.png    (747×955)
frame_ancient.10131dbd.png  (747×955)
```

### Shared Border Assets (per card type)
```
border_attack.6c315808.png  (747×955)
border_skill.accf2065.png   (747×955)
border_power.aa48cd7f.png   (747×955)
```

### Other Shared Assets
```
banner.0ae964d8.png         (747×955) — Name banner overlay
banner_ancient.16af2f85.png (747×955) — Ancient card banner
border_label.24fb63d8.png   — Type label plate
```

### Cost Orb Assets (per character)
```
cost_ironclad.e1b7b350.png
cost_silent.58ac35d9.png
cost_defect.b6dc44ae.png
cost_necrobinder.e80ca891.png
cost_regent.4817715b.png
cost_colorless.6fdf6973.png
cost_star.2dab270f.png       — Regent star cost
```

### Character Icon Assets
```
ironclad.bf21ce55.png
silent.cb6f1b5a.png
defect.6362f8e8.png
necrobinder.1d75075c.png
regent.eba41a8b.png
colorless.afb44984.png
star.2359e4f9.png
```

## CSS Layout Rules

### Container
```css
.container {
  aspect-ratio: 747 / 955;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
  width: 100%;
  height: auto;
  color: var(--sts-card-fg);
  position: relative;
}
```

### Texture Container (portrait clip window)
```css
.textureContainer {
  border-radius: 9% / 5%;
  width: 78.5%;
  height: 88%;
  position: absolute;
  top: 6.5%;
  left: 10.5%;
  overflow: hidden;
}
```

### Texture (portrait image)
```css
.texture {
  pointer-events: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
/* Ancient variant */
[data-rarity=ancient] .texture {
  width: 102.5%;
  height: 100%;
  top: -1%;
  left: -2%;
}
```

### Frame/Border/Banner (overlay images)
```css
/* All use same base positioning: */
pointer-events: none;
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
```

### Cost Orb Position
```css
.cost {
  width: 10%;
  position: absolute;
  top: 5.5%;
  left: 9%;
}
```

### Card Name Position
```css
.name {
  width: 80%;
  position: absolute;
  top: 8.55%;
  left: 10%;
}
```

## CSS Filters — Character Colors

The **frame** images are shared across all characters. Character-specific coloring is achieved via CSS `filter` on `.frame` and `.frameInner`, driven by the `data-color` attribute.

### Frame Filters (by character)
| Character    | `.frame` filter                                        | `.frameInner` filter                               |
|-------------|-------------------------------------------------------|---------------------------------------------------|
| Ironclad    | `hue-rotate(15deg) grayscale(0.05) brightness(1.05)`  | *(none — no frameInner)*                          |
| Silent      | `hue-rotate(97deg) brightness(1.5) saturate(0.6)`     | `hue-rotate(97deg) brightness(1.3) saturate(0.7)` |
| Defect      | `hue-rotate(217deg) brightness(1.3) saturate(0.625)`  | `hue-rotate(217deg) brightness(1.05) saturate(0.8)`|
| Necrobinder | `hue-rotate(-23deg) brightness(1.3) saturate(0.55)`   | *(none found)*                                     |
| Regent      | `hue-rotate(45deg) brightness(1.55) saturate()`       | `hue-rotate(55deg) brightness(1.25) saturate(2.25)`|
| Colorless   | `grayscale() brightness(1.35)`                         | *(none)*                                           |
| Curse       | `hue-rotate(-60deg) grayscale(0.9) brightness(0.6)`   | *(none)*                                           |

### Cost Stroke Colors (by character)
| Character    | `--stroke-color` |
|-------------|-----------------|
| Ironclad    | `#7f2e20`       |
| Silent      | `#1b632e`       |
| Defect      | `#005c75`       |
| Necrobinder | `#823b57`       |
| Regent      | `#804109`       |
| Regent Star | `#0b5d70`       |
| Colorless   | `#5c543f`       |

## CSS Filters — Rarity Colors

The **border**, **borderLabel**, and **banner** images are shared. Rarity-specific coloring is via CSS `filter` on these elements, driven by `data-rarity`.

### Border/Banner Filters (by rarity)
| Rarity    | `.border` + `.borderLabel` filter                           | `.banner` filter                                    |
|-----------|-------------------------------------------------------------|-----------------------------------------------------|
| Common    | `hue-rotate(-145deg) grayscale(0.9) brightness(0.775)`     | same                                                |
| Basic     | same as common                                               | same                                                |
| Uncommon  | *(no filter — uses base teal color)*                        | *(no filter)*                                       |
| Rare      | `hue-rotate(-145deg) brightness(1.075) saturate(1.5)`      | `hue-rotate(-145deg) brightness(1.075) saturate(1.3)`|
| Event     | `hue-rotate(-78deg) brightness(0.9) saturate(0.9)`         | same                                                |
| Status    | `hue-rotate(-122deg) brightness(0.8) saturate(0.75)`       | same                                                |
| Quest     | `hue-rotate(-172deg) brightness(0.8) saturate(1.8)`        | same                                                |
| Curse     | `hue-rotate(84deg) brightness(0.8) saturate(1.8)`          | `hue-rotate(78deg) brightness(0.8) saturate(1.8)`  |
| Ancient   | `.borderLabel`: `grayscale() brightness(0.85)`              | uses `banner_ancient` image                         |

### Rarity Stroke Colors
| Rarity    | `--stroke-color` |
|-----------|-----------------|
| Common    | `#4f4547`       |
| Basic     | `#4f4547`       |
| Uncommon  | `#075d74`       |
| Rare      | `#6c4b04`       |
| Event     | `#1c6130`       |
| Status    | `#515131`       |
| Quest     | `#773f1a`       |
| Curse     | `#560b9f`       |
| Ancient   | `#4a4b3e`       |

## Text Rendering

All text is rendered via **SVG** elements with the **Kreon** font family.

### Card Name
```html
<svg class="name" viewBox="0 0 400 60">
  <text x="200" y="40" text-anchor="middle"
    fill="var(--sts-card-fg)"
    stroke="var(--stroke-color)" stroke-width="8"
    paint-order="stroke" stroke-linecap="round" stroke-linejoin="round"
    font-size="36" font-family="Kreon, sans-serif" font-weight="300"
    filter="drop-shadow(3px 3px 0 rgba(0, 0, 0, 0.25))">
    Card Name
  </text>
</svg>
```

### Cost Number
```html
<svg class="cost" viewBox="0 0 100 100">
  <text x="50" y="80" text-anchor="middle"
    fill="var(--sts-card-fg)"
    stroke="var(--stroke-color)" stroke-width="21"
    stroke-linecap="round" stroke-linejoin="round"
    paint-order="stroke"
    font-size="95" font-family="Kreon, sans-serif" font-weight="700"
    filter="drop-shadow(5px 5px 0 rgba(0, 0, 0, 0.25))">
    1
  </text>
</svg>
```

### Type Label
```html
<svg class="borderLabelText" viewBox="0 0 200 30">
  <text x="100" y="20" text-anchor="middle"
    fill="oklch(0 0 0 / 70%)"
    font-size="11" font-family="Kreon, sans-serif" font-weight="600">
    Power
  </text>
</svg>
```

### Card Description
```html
<svg class="text" viewBox="0 0 165 115">
  <foreignObject x="0" y="0" width="165" height="115">
    <div class="textContainer">
      <span>Card description with <span class="mechanic">keywords</span> highlighted</span>
    </div>
  </foreignObject>
</svg>
```

## Key Architectural Insights

1. **Shared frame/border/banner images** — Only 3 frame types (attack/skill/power) + quest + ancient variants. Character colors are achieved purely through CSS `filter` (hue-rotate, brightness, saturate, grayscale).

2. **Separation of concerns** — Character determines frame color, rarity determines border/banner color. These are independent axes.

3. **frameInner** — A duplicate of the frame image with a slightly different filter, used by Silent, Defect, and Regent to create a two-tone frame effect.

4. **All text is SVG** — Name, cost, type label, and description all use SVG `<text>` or `<foreignObject>`. This ensures pixel-perfect scaling and consistent rendering with Kreon font + stroke outlines.

5. **Portrait art is external** — Hosted at `sts2json.untapped.gg`, separate from the frame/border assets which are bundled in the Next.js build.

6. **Card slug mapping** — Card names are lowercased with spaces/special chars replaced by underscores: `Ball Lightning` → `ball_lightning`, `Banshee's Cry` → `banshees_cry`.

## Asset Source URLs

For downloading/proxying:
- **Portraits**: `https://sts2json.untapped.gg/art/card_portraits/{character}/{slug}.png`
- **Static assets**: `https://sts2.untapped.gg/_next/static/media/{filename}`
- **Optimized images**: `https://sts2.untapped.gg/_next/image?url={encoded_url}&w={width}&q=80`
