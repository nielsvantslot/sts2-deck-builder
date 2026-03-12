import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { z } from 'zod'

const SOURCES = {
  cards: 'https://raw.githubusercontent.com/cjodo/sts2/main/cards.json',
  relics: 'https://raw.githubusercontent.com/cjodo/sts2/main/relics.json',
  potions: 'https://raw.githubusercontent.com/cjodo/sts2/main/potions.json',
}

const RawCardSchema = z.object({
  URL: z.string().optional().default(''),
  Title: z.string(),
  Description: z.string(),
  Character: z.string(),
  Type: z.string(),
  EnergyCost: z.string(),
  Rarity: z.string(),
  Img: z.string().optional().default(''),
})

const RawRelicSchema = z.object({
  Name: z.string(),
  Description: z.string(),
  Rarity: z.string(),
  Character: z.string().optional().default(''),
  Img: z.string().optional().default(''),
})

const RawPotionSchema = z.object({
  Name: z.string(),
  Description: z.string(),
  Character: z.string().optional().default(''),
  Rarity: z.string(),
  Img: z.string().optional().default(''),
})

function normalizeRarity(rarity: string): string {
  if (!rarity || rarity.trim() === '') return 'Starter'
  return rarity
}

function normalizeCard(raw: z.infer<typeof RawCardSchema>) {
  return {
    title: raw.Title.trim(),
    description: raw.Description.trim(),
    character: raw.Character.trim(),
    type: raw.Type.trim(),
    energyCost: raw.EnergyCost.trim(),
    rarity: normalizeRarity(raw.Rarity),
  }
}

function normalizeRelic(raw: z.infer<typeof RawRelicSchema>) {
  return {
    name: raw.Name.trim(),
    description: raw.Description.trim(),
    rarity: raw.Rarity.trim(),
    character: raw.Character?.trim() || undefined,
  }
}

function normalizePotion(raw: z.infer<typeof RawPotionSchema>) {
  return {
    name: raw.Name.trim(),
    description: raw.Description.trim(),
    character: raw.Character?.trim() || undefined,
    rarity: raw.Rarity.trim(),
  }
}

async function fetchJson(url: string): Promise<unknown> {
  console.log(`Fetching ${url}...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.json()
}

async function main() {
  const outDir = resolve(import.meta.dirname, '..', 'src', 'data')
  mkdirSync(outDir, { recursive: true })

  // Fetch all data
  const [rawCards, rawRelics, rawPotions] = await Promise.all([
    fetchJson(SOURCES.cards),
    fetchJson(SOURCES.relics),
    fetchJson(SOURCES.potions),
  ])

  // Validate & normalize cards
  const cards = z.array(RawCardSchema).parse(rawCards).map(normalizeCard)
  console.log(`✓ ${cards.length} cards validated`)

  // Validate & normalize relics
  const relics = z.array(RawRelicSchema).parse(rawRelics).map(normalizeRelic)
  console.log(`✓ ${relics.length} relics validated`)

  // Validate & normalize potions
  const potions = z.array(RawPotionSchema).parse(rawPotions).map(normalizePotion)
  console.log(`✓ ${potions.length} potions validated`)

  // Write output files
  writeFileSync(resolve(outDir, 'cards.json'), JSON.stringify(cards, null, 2))
  writeFileSync(resolve(outDir, 'relics.json'), JSON.stringify(relics, null, 2))
  writeFileSync(resolve(outDir, 'potions.json'), JSON.stringify(potions, null, 2))

  // Write metadata
  const meta = {
    lastFetched: new Date().toISOString(),
    sourceUrl: 'https://github.com/cjodo/sts2',
    cardCount: cards.length,
    relicCount: relics.length,
    potionCount: potions.length,
  }
  writeFileSync(resolve(outDir, 'meta.json'), JSON.stringify(meta, null, 2))

  console.log(`\nData written to src/data/`)
  console.log(`  Cards:   ${cards.length}`)
  console.log(`  Relics:  ${relics.length}`)
  console.log(`  Potions: ${potions.length}`)
}

main().catch((err) => {
  console.error('Failed to fetch data:', err)
  process.exit(1)
})
