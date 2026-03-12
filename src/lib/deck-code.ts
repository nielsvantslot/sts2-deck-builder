import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

export interface DeckCodeEntry {
  title: string
  count: number
}

/**
 * Encode a deck into a compact URL-safe string.
 * Format: array of [title, count] pairs → JSON → lz-string compressed.
 */
export function encodeDeck(entries: DeckCodeEntry[]): string {
  if (entries.length === 0) return ''
  const compact = entries.map(({ title, count }) => [title, count])
  return compressToEncodedURIComponent(JSON.stringify(compact))
}

/**
 * Decode a deck string back into entries.
 * Returns null if the string is invalid.
 */
export function decodeDeck(code: string): DeckCodeEntry[] | null {
  if (!code) return null
  try {
    const json = decompressFromEncodedURIComponent(code)
    if (!json) return null
    const parsed: unknown = JSON.parse(json)
    if (!Array.isArray(parsed)) return null
    const entries: DeckCodeEntry[] = []
    for (const item of parsed) {
      if (
        !Array.isArray(item) ||
        item.length !== 2 ||
        typeof item[0] !== 'string' ||
        typeof item[1] !== 'number' ||
        item[1] < 1
      ) {
        return null
      }
      entries.push({ title: item[0], count: item[1] })
    }
    return entries
  } catch {
    return null
  }
}
