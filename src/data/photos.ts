/**
 * Curated Unsplash photography. Every id below was checked by eye —
 * the key describes what is actually in the frame.
 */
export const photos = {
  // Bowls & plates
  salmonPokeBowl: '1546069901-ba9599a7e63c',
  rainbowBuddhaBowl: '1512621776951-a57141f2eefd',
  eggKaleBowl: '1490645935967-10de6ba17061',
  salmonQuinoaPlate: '1547592180-85f173990554',
  searedSalmonFine: '1467003909585-2f8a72700288',
  salmonGreens: '1519708227418-c8fd9a32b7a2',
  grilledChicken: '1532550907401-a500c9a57435',
  sirloinSteak: '1529692236671-f1f6cf9683ba',
  slicedSteakPlate: '1504674900247-0877df9cc836',
  quinoaPilaf: '1512058564366-18510be2db19',
  thaiRedCurry: '1455619452474-d2be8b1e70cd',
  shrimpRamen: '1569718212165-3a8278d5f624',
  shrimpGumbo: '1559847844-5315695dadae',
  shrimpSpaghetti: '1563379926898-05f4575a45d8',
  penneArrabbiata: '1621996346565-e3dbc646d9a9',
  beefTagliatelle: '1551183053-bf91a1d81141',
  squashSoup: '1476718406336-bb5a9690ee2a',

  // Salads
  kaleChickpeaSalad: '1515543237350-b3eea1ec8082',
  pomegranateSalad: '1511690743698-d9d85f2fbf38',
  caesarSalad: '1550304943-4f24f54ddde9',
  chickenSalad: '1546793665-c74683f339c1',
  whiteBowlSalad: '1543339308-43e59d6b73a6',
  masonJarSalad: '1505576399279-565b52d4ac71',
  farfalleSalad: '1473093295043-cdd812d0e601',

  // Breakfast
  yogurtParfait: '1488477181946-6428a0291777',
  berryOatBowl: '1494597564530-871f2b93ac55',
  breakfastSpread: '1494390248081-4e521a5940db',
  frenchToast: '1484723091739-30a097e8f929',
  pancakes: '1567620905732-2d1ec7ab7445',
  eggToast: '1525351484163-7529414344d8',
  eggAvocadoPlate: '1482049016688-2d3e1b311543',

  // Produce
  vegetableMarket: '1498837167922-ddd27525d352',
  fruitPlatter: '1490474418585-ba9bad8fd0ea',
  fruitAssortment: '1610832958506-aa56368176cf',
  blueberries: '1502741338009-cac2772e18bc',
  avocado: '1523049673857-eb18f1d7b578',
  apple: '1568702846914-96b305d2aaeb',
  bananas: '1571771894821-ce9b6c11b08e',
  watermelon: '1587049352846-4a222e784d38',

  // Indulgent
  burger: '1571091718767-18b5b1457add',
  pizza: '1565299624946-b28f40a0ae38',
  clubSandwich: '1553909489-cd47e0907980',

  // People
  ava: '1544005313-94ddf0286df2',
  coachLeo: '1500648767791-00dcc994a43e',
  chefIris: '1438761681033-6461ffad8d80',
} as const

export type PhotoKey = keyof typeof photos

export function photoUrl(id: string, width = 800, height?: number) {
  const h = height ? `&h=${height}` : ''
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}${h}&q=72`
}
