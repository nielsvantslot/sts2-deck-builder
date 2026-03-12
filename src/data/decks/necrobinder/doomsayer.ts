import type { FeaturedDeck } from '../index'

export const doomsayer: FeaturedDeck = {
  id: 'doomsayer',
  name: 'Doomsayer',
  character: 'Necrobinder',
  characterId: 'necrobinder',
  strategy:
    'Stack Doom relentlessly until enemies disintegrate. Countdown (1 energy Power) passively applies 6 Doom per turn. Scourge (1 energy, 13 Doom + draw 1) is efficient early pressure. Shroud (1 energy Power) converts every Doom application into 2 Block for survival. Once Doom is building, No Escape scales exponentially — applying 10 Doom plus 5 more per 10 already on the enemy (at 30 Doom it adds 25 more). Reaper Form (3 energy) makes all Attack damage also apply that much Doom, so every hit doubles as offense and Doom stacking. Time\'s Up deals damage equal to the enemy\'s Doom for a lethal execute. Stack to 60+ Doom, then finish with Time\'s Up.',
  pickups: [
    // Core: The Doom scaling loop and its payoff
    { title: 'Reaper Form', count: 1, priority: 'core' },
    { title: 'Countdown', count: 1, priority: 'core' },
    { title: 'No Escape', count: 1, priority: 'core' },
    { title: 'Scourge', count: 2, priority: 'core' },
    // High: Survival and Doom execution
    { title: 'Shroud', count: 1, priority: 'high' },
    { title: "Time's Up", count: 1, priority: 'high' },
    { title: 'Sleight of Flesh', count: 1, priority: 'high' },
    { title: 'Defy', count: 2, priority: 'high' },
    // Situational: Extra damage or utility
    { title: 'Negative Pulse', count: 1, priority: 'situational' },
    { title: "Death's Door", count: 1, priority: 'situational' },
    { title: 'Oblivion', count: 1, priority: 'situational' },
    { title: 'Putrefy', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: 'Once Reaper Form is active, Strikes are redundant. Remove 1 if you have spare gold.' },
  ],
  combos: [
    {
      name: 'No Escape Spiral',
      description:
        'No Escape (1 energy): apply 10 Doom + 5 more per 10 already on enemy. At 0 Doom: +10. At 10: +15. At 30: +25. At 50: +35. Exponential scaling that reaches lethal amounts within 2-3 plays.',
    },
    {
      name: 'Reaper Form + Attacks',
      description:
        'Reaper Form (3 energy): all Attack damage also applies that much Doom. A 10-damage Attack now also applies 10 Doom. Every hit doubles as damage + Doom, feeding No Escape\'s scaling. Even starter Strikes apply 6 Doom.',
    },
    {
      name: "Time's Up Execute",
      description:
        "Time's Up (2 energy, Exhaust): deal damage equal to the enemy's Doom. Stack 60 Doom with Countdown + No Escape + Scourge, then Time's Up hits for 60 direct damage. Save it for the killing blow.",
    },
    {
      name: 'Shroud + Doom = Block',
      description:
        'Shroud: gain 2 Block whenever you apply Doom. With Countdown (6 Doom/turn = 2 Block), Scourge (13 Doom = 2 Block), No Escape (25+ Doom = 2 Block), you passively gain 6-10+ Block per turn just from Doom application.',
    },
  ],
}
