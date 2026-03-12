export interface StartingRelic {
  name: string
  description: string
}

export interface Character {
  id: string
  name: string
  color: string
  hp: number
  description: string
  relic: StartingRelic
  imageHeight: string
  imagePosition: string
}

export const CHARACTERS: Character[] = [
  {
    id: 'ironclad',
    name: 'Ironclad',
    color: 'var(--color-ironclad)',
    hp: 80,
    description: 'The last soldier of the Ironclads. Crushes foes with sword and flame against his will.',
    relic: { name: 'Burning Blood', description: 'At the end of combat, heal 6 HP.' },
    imageHeight: '90%',
    imagePosition: '60% -70px',
  },
  {
    id: 'silent',
    name: 'Silent',
    color: 'var(--color-silent)',
    hp: 70,
    description: 'A huntress from outside the Spire. Ready to stab and poison anything in her way.',
    relic: { name: 'Ring of the Snake', description: 'At the start of each combat, draw 2 additional cards.' },
    imageHeight: '100%',
    imagePosition: '60% 0',
  },
  {
    id: 'regent',
    name: 'Regent',
    color: 'var(--color-regent)',
    hp: 75,
    description: 'Heir to the Throne of Stars. Wields cosmic powers but his minions do the work.',
    relic: { name: 'Divine Right', description: 'At the start of combat, gain 3 Radiance.' },
    imageHeight: '125%',
    imagePosition: '50% -180px',
  },
  {
    id: 'necrobinder',
    name: 'Necrobinder',
    color: 'var(--color-necrobinder)',
    hp: 66,
    description: 'A Spireborn lich who seeks revenge. Calls upon her trusty left hand, Osty, in combat.',
    relic: { name: 'Bound Phylactery', description: 'At the start of your turn, Summon 1.' },
    imageHeight: '125%',
    imagePosition: '70% -180px',
  },
  {
    id: 'defect',
    name: 'Defect',
    color: 'var(--color-defect)',
    hp: 75,
    description: 'An automaton eternally modifying itself to survive. Deploys Orb technology when it must fight.',
    relic: { name: 'Cracked Core', description: 'At the start of each combat, Channel 1 Lightning.' },
    imageHeight: '125%',
    imagePosition: '65% -180px',
  },
]

export const CHARACTER_MAP = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c]),
)
