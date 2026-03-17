import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'


export interface DeckCodeEntry {
  title: string
  count: number
}

export interface EncodedDeck {
  entries: DeckCodeEntry[];
  name?: string;
}

/**
 * Encode a deck into a compact URL-safe string.
 * New format: { entries: [[title, count], ...], name } → JSON → lz-string compressed.
 * Old format: [[title, count], ...] → JSON → lz-string compressed.
 */
export function encodeDeck(entries: DeckCodeEntry[], name?: string): string {
  if (entries.length === 0) return ''
  // Use new format if name is provided
  if (name && name.trim()) {
    const payload = {
      entries: entries.map(({ title, count }) => [title, count]),
      name: name.trim(),
    }
    return compressToEncodedURIComponent(JSON.stringify(payload))
  } else {
    // Old format for backwards compatibility
    const compact = entries.map(({ title, count }) => [title, count])
    return compressToEncodedURIComponent(JSON.stringify(compact))
  }
}

/**
 * Decode a deck string back into entries and name (if present).
 * Returns null if the string is invalid.
 * Backwards compatible with old format (array only).
 */
export function decodeDeck(code: string): { entries: DeckCodeEntry[], name?: string } | null {
  if (!code) return null
  try {
    const json = decompressFromEncodedURIComponent(code)
    if (!json) return null
    const parsed: unknown = JSON.parse(json)
    // New format: { entries: [...], name?: string }
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'entries' in parsed &&
      Array.isArray((parsed as any).entries)
    ) {
      const entriesArr = (parsed as any).entries
      const entries: DeckCodeEntry[] = []
      for (const item of entriesArr) {
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
      return { entries, name: typeof (parsed as any).name === 'string' ? (parsed as any).name : undefined }
    }
    // Old format: array only
    if (Array.isArray(parsed)) {
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
      return { entries }
    }
    return null
  } catch {
    return null
  }
}
