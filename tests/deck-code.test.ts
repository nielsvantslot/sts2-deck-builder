import { describe, expect, it } from 'vitest'
import { encodeDeck, decodeDeck, type DeckCodeEntry } from '../src/lib/deck-code'

describe('deck-code', () => {
  const sampleDeck: DeckCodeEntry[] = [
    { title: 'Bash', count: 1 },
    { title: 'Strike', count: 5 },
    { title: 'Defend', count: 4 },
    { title: 'Pommel Strike', count: 2 },
  ]

  it('round-trips a deck through encode → decode (old format)', () => {
    const encoded = encodeDeck(sampleDeck)
    expect(encoded).toBeTruthy()
    const decoded = decodeDeck(encoded)
    expect(decoded).toEqual({ entries: sampleDeck })
  })

  it('round-trips a deck with name (new format)', () => {
    const encoded = encodeDeck(sampleDeck, 'My Custom Deck')
    expect(encoded).toBeTruthy()
    const decoded = decodeDeck(encoded)
    expect(decoded).toEqual({ entries: sampleDeck, name: 'My Custom Deck' })
  })

  it('produces a URL-safe string with no special characters', () => {
    const encoded = encodeDeck(sampleDeck, 'SafeName')
    // lz-string's compressToEncodedURIComponent only uses A-Z, a-z, 0-9, +, -, $, and space (no % needed)
    expect(encoded).toMatch(/^[\w+\-$. ]+$/)
    // Double-check: encodeURIComponent should not change it
    expect(encodeURIComponent(encoded)).toBe(encoded)
  })

  it('returns empty string for empty deck', () => {
    expect(encodeDeck([])).toBe('')
    expect(encodeDeck([], 'ShouldIgnore')).toBe('')
  })

  it('returns null for empty input', () => {
    expect(decodeDeck('')).toBeNull()
  })

  it('returns null for malformed input', () => {
    expect(decodeDeck('not-valid-data')).toBeNull()
  })

  it('returns null for valid lz-string that is not a deck', () => {
    // Encode something that is not a deck array
    const { compressToEncodedURIComponent } = require('lz-string')
    const bad = compressToEncodedURIComponent(JSON.stringify({ foo: 'bar' }))
    expect(decodeDeck(bad)).toBeNull()
  })

  it('returns null for entries with count < 1', () => {
    const { compressToEncodedURIComponent } = require('lz-string')
    const bad = compressToEncodedURIComponent(JSON.stringify([['Strike', 0]]))
    expect(decodeDeck(bad)).toBeNull()
  })

  it('handles large decks', () => {
    const big: DeckCodeEntry[] = Array.from({ length: 50 }, (_, i) => ({
      title: `Card ${i}`,
      count: (i % 3) + 1,
    }))
    const encoded = encodeDeck(big, 'Big Deck')
    // Even a 50-card deck should produce a reasonably short URL
    expect(encoded.length).toBeLessThan(500)
    expect(decodeDeck(encoded)).toEqual({ entries: big, name: 'Big Deck' })
  })
})
