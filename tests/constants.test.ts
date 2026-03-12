import { describe, it, expect } from 'vitest'
import { CHARACTERS, CHARACTER_MAP } from '@/lib/constants'

describe('constants', () => {
  it('has 5 characters', () => {
    expect(CHARACTERS).toHaveLength(5)
  })

  it('CHARACTER_MAP keys match character ids', () => {
    for (const char of CHARACTERS) {
      expect(CHARACTER_MAP[char.id]).toBe(char)
    }
  })
})
