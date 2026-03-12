import type { FeaturedDeck } from '../index'

export const thousandCuts: FeaturedDeck = {
  id: 'thousand-cuts',
  name: 'Death by a Thousand Cuts',
  character: 'Silent',
  characterId: 'silent',
  strategy:
    'Flood the board with 0-cost Shivs, then amplify them. Spend 1–2 energy on generators (Blade Dance: 3 Shivs, Cloak and Dagger: Block + Shiv), then play all Shivs for free. Accuracy stacks +4 damage per Shiv permanently — with two copies that\'s +8. Fan of Knives makes every Shiv hit ALL enemies. Blade of Ink before Shivs gives +2 Strength per Attack played, so 6 Shivs = +12 Strength on the last hits. Shivs Exhaust after use, so Knife Trap replays them all for a second burst. A focused deck draws generators and payoffs more often, but don\'t overspend on removals — prioritize picking up core Shiv cards first.',
  pickups: [
    // Core: The deck doesn't function without these
    { title: 'Accuracy', count: 2, priority: 'core' },
    { title: 'Blade Dance', count: 2, priority: 'core' },
    { title: 'Cloak and Dagger', count: 2, priority: 'core' },
    { title: 'Afterimage', count: 2, priority: 'core' },
    // High: Major power spikes, take whenever offered
    { title: 'Phantom Blades', count: 1, priority: 'high' },
    { title: 'Fan of Knives', count: 1, priority: 'high' },
    { title: 'Blade of Ink', count: 1, priority: 'high' },
    { title: 'Knife Trap', count: 1, priority: 'high' },
    { title: 'Finisher', count: 1, priority: 'high' },
    { title: 'Infinite Blades', count: 1, priority: 'high' },
    // Situational: Great support, but skip if deck is already tight
    { title: 'Burst', count: 1, priority: 'situational' },
    { title: 'Adrenaline', count: 1, priority: 'situational' },
    { title: 'Backflip', count: 1, priority: 'situational' },
  ],
  removals: [
    { title: 'Strike', reason: '1 energy for 6 damage is poor when Shivs deal 7+ for free. Remove 1–2 if you have spare gold.' },
    { title: 'Defend', reason: 'Lower priority — Cloak and Dagger replaces the Block role. Consider removing 1 if the opportunity arises.' },
  ],
  combos: [
    {
      name: 'Fan of Knives + Shiv Generators',
      description:
        'Fan of Knives (2 energy Power): Shivs now hit ALL enemies, and immediately adds 4 Shivs to your hand. Once active, every Blade Dance, Cloak and Dagger, and Infinite Blades Shiv becomes AoE. With Accuracy (+4 per Shiv), each Shiv deals 7 damage to ALL enemies.',
    },
    {
      name: 'Knife Trap + Exhausted Shivs',
      description:
        'Shivs Exhaust after being played. Knife Trap (2 energy) replays every Shiv sitting in your Exhaust Pile. After playing 6+ Shivs over a few turns, Knife Trap fires them all again — a massive burst that benefits from Accuracy and Strength. Timing it right can deal 50+ damage in one card.',
    },
    {
      name: 'Blade of Ink + Shiv Storm',
      description:
        'Blade of Ink (1 energy): gain +2 Strength per Attack played this turn. Play it first, then unleash Shivs. After 6 Shivs, you have +12 Strength — the last Shivs hit for 15+ each. Finisher at the end adds 6 damage per Attack already played = 36+ damage.',
    },
    {
      name: 'Accuracy + Phantom Blades',
      description:
        'Accuracy (+4 Shiv damage, permanent Power) and Phantom Blades (+9 to first Shiv each turn + all Shivs gain Retain). Combined: first Shiv = 3+4+9 = 16 damage. Remaining Shivs = 7 each. With Phantom Blades\' Retain, unplayed Shivs stay in hand for next turn.',
    },
    {
      name: 'Burst + Blade Dance',
      description:
        'Burst doubles the next Skill played. Blade Dance doubled: 6 Shivs instead of 3 for just 1 energy. That\'s 6 free Attacks feeding Blade of Ink (+12 Strength) and Finisher (36 damage). Burst + Cloak and Dagger gives 12 Block + 2 Shivs for defensive turns.',
    },
  ],
}
