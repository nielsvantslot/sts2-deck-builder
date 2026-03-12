<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '@/lib/types'

const props = defineProps<{
  card: Card
}>()

const characterSlug = computed(() => props.card.character.toLowerCase())

const SHARED_CARD_NAMES = new Set(['defend', 'strike'])

const cardSlug = computed(() => {
  const base = props.card.title
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
  return SHARED_CARD_NAMES.has(base) ? `${base}_${characterSlug.value}` : base
})

const portraitUrl = computed(
  () =>
    `https://sts2json.untapped.gg/art/card_portraits/${characterSlug.value}/${cardSlug.value}.png`,
)

const typeSlug = computed(() => props.card.type.toLowerCase() as 'attack' | 'skill' | 'power')

const raritySlug = computed(() => {
  const r = props.card.rarity.toLowerCase()
  return r === 'starter' ? 'common' : r
})
</script>

<template>
  <div
    class="card-image"
    :data-color="characterSlug"
    :data-rarity="raritySlug"
    :data-type="typeSlug"
  >
    <div class="texture-container">
      <img
        :src="portraitUrl"
        :alt="card.title"
        class="texture"
        loading="lazy"
        @error="($event.target as HTMLImageElement).classList.add('texture-error')"
      />
    </div>

    <img
      :src="`/images/cards/frame_${typeSlug}.png`"
      alt=""
      class="frame"
    />

    <img
      :src="`/images/cards/border_${typeSlug}.png`"
      alt=""
      class="border-img"
    />

    <img
      src="/images/cards/border_label.png"
      alt=""
      class="border-label"
    />

    <svg class="border-label-text" viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg">
      <text
        x="100"
        y="20"
        text-anchor="middle"
        fill="oklch(0 0 0 / 70%)"
        font-size="11"
        font-family="Kreon, sans-serif"
        font-weight="600"
      >
        {{ card.type }}
      </text>
    </svg>

    <img
      src="/images/cards/banner.png"
      alt=""
      class="banner"
    />

    <svg class="card-name" viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" style="letter-spacing: 1.5px">
      <text
        x="200"
        y="40"
        text-anchor="middle"
        fill="var(--sts-card-fg)"
        stroke="var(--stroke-color)"
        stroke-width="8"
        paint-order="stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
        font-size="36"
        font-family="Kreon, sans-serif"
        font-weight="300"
        filter="drop-shadow(3px 3px 0 rgba(0, 0, 0, 0.25))"
      >
        {{ card.title }}
      </text>
    </svg>

    <img
      :src="`/images/cards/cost_${characterSlug === 'colorless' ? 'colorless' : characterSlug}.png`"
      alt=""
      class="cost-orb"
    />

    <svg class="cost-text" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50"
        y="80"
        text-anchor="middle"
        fill="var(--sts-card-fg)"
        stroke="var(--stroke-color)"
        stroke-width="21"
        stroke-linecap="round"
        stroke-linejoin="round"
        paint-order="stroke"
        font-size="95"
        font-family="Kreon, sans-serif"
        font-weight="700"
        filter="drop-shadow(5px 5px 0 rgba(0, 0, 0, 0.25))"
      >
        {{ card.energyCost }}
      </text>
    </svg>

    <svg class="card-text" viewBox="0 0 165 115" xmlns="http://www.w3.org/2000/svg">
      <foreignObject x="0" y="0" width="165" height="115">
        <div class="text-container" xmlns="http://www.w3.org/1999/xhtml">
          <span>{{ card.description }}</span>
        </div>
      </foreignObject>
    </svg>
  </div>
</template>

<style scoped>
.card-image {
  --sts-card-fg: #f0e6d2;
  --stroke-color: #4f4547;
  aspect-ratio: 747 / 955;
  width: 100%;
  height: auto;
  position: relative;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
}

/* Texture container — clipped window for portrait art */
.texture-container {
  border-radius: 9% / 5%;
  width: 78.5%;
  height: 58%;
  position: absolute;
  top: 6.5%;
  left: 10.5%;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1520 0%, #252030 50%, #1a1520 100%);
}

.texture {
  width: 100%;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.texture.texture-error {
  display: none;
}

/* Overlay layers — all absolutely positioned, full size */
.frame,
.border-img,
.border-label,
.banner,
.cost-orb {
  pointer-events: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* SVG text layers */
.card-name {
  width: 80%;
  position: absolute;
  top: 8.55%;
  left: 10%;
}

.cost-text {
  width: 10%;
  position: absolute;
  top: 5.5%;
  left: 9%;
}

.border-label-text {
  width: 80%;
  position: absolute;
  top: 48.75%;
  left: 10%;
  letter-spacing: -0.25px;
}

/* Card description text — positioned on the card */
.card-text {
  text-align: center;
  width: 64%;
  position: absolute;
  top: 72%;
  left: 49.5%;
  translate: -50% -50%;
}

.text-container {
  font-family: Kreon, sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 13px;
  color: var(--sts-card-fg);
  text-shadow: 1px 1px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* =============================================
   Character-based frame filters (data-color)
   ============================================= */

[data-color="ironclad"] .frame {
  filter: hue-rotate(15deg) grayscale(0.05) brightness(1.05);
}

[data-color="silent"] .frame {
  filter: hue-rotate(97deg) brightness(1.5) saturate(0.6);
}

[data-color="defect"] .frame {
  filter: hue-rotate(217deg) brightness(1.3) saturate(0.625);
}

[data-color="necrobinder"] .frame {
  filter: hue-rotate(-23deg) brightness(1.3) saturate(0.55);
}

[data-color="regent"] .frame {
  filter: hue-rotate(45deg) brightness(1.55) saturate(1);
}

[data-color="colorless"] .frame {
  filter: grayscale(1) brightness(1.35);
}

/* =============================================
   Character stroke colors
   ============================================= */

[data-color="ironclad"] { --stroke-color: #7f2e20; }
[data-color="silent"] { --stroke-color: #1b632e; }
[data-color="defect"] { --stroke-color: #005c75; }
[data-color="necrobinder"] { --stroke-color: #823b57; }
[data-color="regent"] { --stroke-color: #804109; }
[data-color="colorless"] { --stroke-color: #5c543f; }

/* =============================================
   Rarity-based border/banner filters (data-rarity)
   ============================================= */

[data-rarity="common"] .border-img,
[data-rarity="common"] .border-label,
[data-rarity="common"] .banner {
  filter: hue-rotate(-145deg) grayscale(0.9) brightness(0.775);
}

[data-rarity="common"] { --stroke-color: #4f4547; }

/* Uncommon — base teal color, no filter needed */
[data-rarity="uncommon"] { --stroke-color: #075d74; }

[data-rarity="rare"] .border-img,
[data-rarity="rare"] .border-label {
  filter: hue-rotate(-145deg) brightness(1.075) saturate(1.5);
}

[data-rarity="rare"] .banner {
  filter: hue-rotate(-145deg) brightness(1.075) saturate(1.3);
}

[data-rarity="rare"] { --stroke-color: #6c4b04; }
</style>
