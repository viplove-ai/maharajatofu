/**
 * The sixteen recipes, one object each. These are the SEO engine — a page per
 * URL, statically generated — and they answer the objection that kills every
 * tofu sale: "main ise banaungi kaise?"
 *
 * Prose lives here rather than in MDX because each recipe is short and strongly
 * structured; a CMS would be more machinery than sixteen records deserve.
 */
export type Lane = 'quick' | 'family'

export interface Recipe {
  slug: string
  title: string
  lane: Lane
  /** Shown as the card badge, e.g. "2 min" or "No cook". */
  time: string
  minutes: number
  sku: 'masala-tofu' | 'classic-tofu'
  /** One line that has to make someone want to cook it. */
  hook: string
  serves: number
  tofuGrams: number
  ingredients: string[]
  steps: string[]
  note?: string
}

export const RECIPES: readonly Recipe[] = [
  // ---------------------------------------------------------------- quick lane
  {
    slug: 'protein-maggi',
    title: 'Protein Maggi',
    lane: 'quick',
    time: '2 min',
    minutes: 2,
    sku: 'masala-tofu',
    hook: 'Same Maggi you already make. Ten grams more protein, ninety seconds more work.',
    serves: 1,
    tofuGrams: 100,
    ingredients: ['1 packet Maggi', '100 g Masala Tofu, cubed', '1 cup water', 'Optional: a handful of frozen peas'],
    steps: [
      'Boil the water and add the noodles and tastemaker as usual.',
      'At the two-minute mark, drop in the tofu cubes.',
      'Stir once, cook ninety seconds more, and take it off the heat while there is still a little water left.',
    ],
    note: 'The tofu is already cooked and already seasoned, so it only needs warming through. Longer and it starts to fall apart.',
  },
  {
    slug: 'tofu-bhurji',
    title: 'Tofu Bhurji',
    lane: 'quick',
    time: '5 min',
    minutes: 5,
    sku: 'classic-tofu',
    hook: 'Tastes like anda bhurji and paneer bhurji had a baby. The recipe that converts people.',
    serves: 2,
    tofuGrams: 200,
    ingredients: ['200 g Classic Firm Tofu', '1 onion, chopped fine', '1 tomato, chopped', '1 green chilli', '1/2 tsp haldi', '1/2 tsp garam masala', '1 tbsp oil', 'Salt, coriander'],
    steps: [
      'Crumble the tofu with your hands. Do not use a mixer — you want uneven pieces.',
      'Hot oil, onion and chilli, two minutes until the edges colour.',
      'Tomato, haldi and salt. Cook until the tomato breaks down.',
      'Fold in the crumbled tofu, garam masala, and cook two minutes.',
      'Coriander off the heat.',
    ],
    note: 'A pinch of kala namak makes it taste startlingly like egg.',
  },
  {
    slug: 'chatpata-tofu-chaat',
    title: 'Chatpata Tofu Chaat',
    lane: 'quick',
    time: 'No cook',
    minutes: 3,
    sku: 'masala-tofu',
    hook: 'No stove, no pan, no skill. Eaten straight from the box at a desk.',
    serves: 1,
    tofuGrams: 100,
    ingredients: ['100 g Masala Tofu, cubed', '1/2 onion, chopped', 'Chaat masala', 'Lemon', 'Sev', 'Coriander'],
    steps: ['Tip the tofu into a bowl.', 'Onion, a good pinch of chaat masala, a squeeze of lemon.', 'Toss, top with sev and coriander, eat immediately.'],
  },
  {
    slug: 'peanut-chilli-tofu',
    title: 'Peanut Chilli Tofu',
    lane: 'quick',
    time: 'No cook',
    minutes: 3,
    sku: 'masala-tofu',
    hook: 'Five ingredients, no heat, and it looks like something you ordered.',
    serves: 1,
    tofuGrams: 100,
    ingredients: ['100 g Masala Tofu, cubed', '1 tbsp peanut butter', '1 tsp soy sauce', 'Chilli flakes', 'Lemon', '1 tbsp warm water'],
    steps: ['Whisk the peanut butter, soy sauce, chilli flakes and lemon with the warm water until it pours.', 'Pour over the tofu. Do not stir it to death.'],
  },
  {
    slug: 'leftover-roti-roll',
    title: 'Leftover Roti Roll',
    lane: 'quick',
    time: '3 min',
    minutes: 3,
    sku: 'masala-tofu',
    hook: 'Yesterday’s roti, today’s breakfast. Solved.',
    serves: 1,
    tofuGrams: 100,
    ingredients: ['1 leftover roti', '100 g Masala Tofu', '1 tbsp curd or mayo', 'Sliced onion', 'Green chutney'],
    steps: ['Twenty seconds a side on a hot tawa to soften the roti.', 'Spread the curd or mayo, lay the tofu down the middle, add onion and chutney.', 'Roll tight, wrap the bottom in foil.'],
  },
  {
    slug: 'schezwan-chilli-tofu',
    title: 'Schezwan Chilli Tofu',
    lane: 'quick',
    time: '4 min',
    minutes: 4,
    sku: 'masala-tofu',
    hook: 'Restaurant chilli paneer without the restaurant, or the effort.',
    serves: 2,
    tofuGrams: 200,
    ingredients: ['200 g Masala Tofu, cubed', '1 capsicum, cubed', '2 spring onions', '2 tbsp readymade schezwan sauce', '1 tbsp oil'],
    steps: ['Very hot pan, oil, capsicum for one minute — it should stay crunchy.', 'Tofu and schezwan sauce, toss for two minutes.', 'Spring onion greens off the heat.'],
  },
  {
    slug: 'tofu-sandwich-spread',
    title: 'Tofu Sandwich Spread',
    lane: 'quick',
    time: '2 min',
    minutes: 2,
    sku: 'classic-tofu',
    hook: 'One pack makes five sandwiches and keeps three days.',
    serves: 5,
    tofuGrams: 200,
    ingredients: ['200 g Classic Firm Tofu', '2 tbsp mayo', '1 tsp mustard', 'Black pepper', 'Coriander', 'Salt'],
    steps: ['Mash the tofu with a fork until it looks like egg salad.', 'Fold everything else through.', 'Keeps three days covered in the fridge.'],
  },
  {
    slug: 'air-fryer-tikka-bites',
    title: 'Air-Fryer Tikka Bites',
    lane: 'quick',
    time: '12 min',
    minutes: 12,
    sku: 'masala-tofu',
    hook: 'One pack on Sunday is a week of snacks.',
    serves: 3,
    tofuGrams: 200,
    ingredients: ['200 g Masala Tofu, cubed', '1 tsp oil'],
    steps: ['Toss the cubes in the oil.', '180 °C for twelve minutes, shaking the basket once at the halfway mark.', 'Cool completely before it goes into a box, or it will steam and go soft.'],
  },

  // --------------------------------------------------------------- family lane
  {
    slug: 'tofu-butter-masala',
    title: 'Tofu Butter Masala',
    lane: 'family',
    time: '30 min',
    minutes: 30,
    sku: 'classic-tofu',
    hook: 'The makhani gravy carries everything. This is the dish that converts a paneer household.',
    serves: 4,
    tofuGrams: 250,
    ingredients: ['250 g Classic Firm Tofu, cubed', '4 tomatoes', '12 cashews', '1 onion', '1 tbsp ginger-garlic paste', '2 tbsp butter', '1 tsp kasuri methi', '1 tsp red chilli powder', '1/2 tsp garam masala', '2 tbsp cream', 'Salt, sugar'],
    steps: [
      'Marinate the tofu fifteen minutes in a spoon of curd, chilli powder and salt.',
      'Sear the cubes in a little butter until the edges catch. Set aside.',
      'Simmer tomatoes, onion, cashews and ginger-garlic with a cup of water for fifteen minutes, then blend smooth and strain.',
      'Butter, chilli powder, the gravy, salt and a pinch of sugar. Simmer ten minutes.',
      'Cream, crushed kasuri methi, garam masala — then fold the tofu in and give it three minutes, no more.',
    ],
    note: 'Add the tofu at the end. Boiling it in the gravy for fifteen minutes is what makes people think they do not like tofu.',
  },
  {
    slug: 'palak-tofu',
    title: 'Palak Tofu',
    lane: 'family',
    time: '25 min',
    minutes: 25,
    sku: 'classic-tofu',
    hook: 'Honestly better than palak paneer — it holds its shape and does not go rubbery on reheating.',
    serves: 4,
    tofuGrams: 250,
    ingredients: ['250 g Classic Firm Tofu, cubed', '500 g palak', '1 onion', '2 green chillies', '1 tbsp ginger-garlic paste', '1 tsp jeera', '1/2 tsp garam masala', '2 tbsp oil or ghee', 'Salt'],
    steps: [
      'Blanch the palak two minutes, then straight into cold water so it stays green. Blend coarse.',
      'Jeera in hot oil, then onion until golden, then ginger-garlic and chilli.',
      'Add the palak purée and salt. Simmer eight minutes.',
      'Blanch the tofu cubes two minutes in hot salted water, drain, and fold in.',
      'Garam masala, three minutes, done.',
    ],
    note: 'The salted-water blanch is the trick that gives tofu a soft, paneer-like bite.',
  },
  {
    slug: 'matar-tofu',
    title: 'Matar Tofu',
    lane: 'family',
    time: '25 min',
    minutes: 25,
    sku: 'classic-tofu',
    hook: 'The weeknight workhorse. Nobody at the table asks questions.',
    serves: 4,
    tofuGrams: 250,
    ingredients: ['250 g Classic Firm Tofu, cubed', '1 cup green peas', '2 onions', '3 tomatoes', '1 tbsp ginger-garlic paste', '1 tsp jeera', '1/2 tsp haldi', '1 tsp dhania powder', '1/2 tsp garam masala', '2 tbsp oil', 'Salt'],
    steps: ['Jeera, onion until brown, ginger-garlic.', 'Tomato purée, haldi, dhania and salt. Cook until the oil separates.', 'Peas and a cup of water, simmer eight minutes.', 'Tofu and garam masala, three minutes, coriander.'],
  },
  {
    slug: 'kadai-tofu',
    title: 'Kadai Tofu',
    lane: 'family',
    time: '25 min',
    minutes: 25,
    sku: 'classic-tofu',
    hook: 'Big peppers, coarse masala, and a chunky texture that suits pressed tofu perfectly.',
    serves: 4,
    tofuGrams: 250,
    ingredients: ['250 g Classic Firm Tofu, cubed thick', '1 capsicum', '1 onion, in petals', '3 tomatoes', '2 tsp coarsely crushed dhania seeds', '3 dried red chillies', '1 tbsp ginger juliennes', '2 tbsp oil', 'Salt'],
    steps: ['Dry-roast the dhania seeds and chillies, then crush coarse. This is the kadai masala.', 'Sear onion petals and capsicum on high heat, keeping them crunchy. Set aside.', 'Tomatoes and half the masala, cook down eight minutes.', 'Return the vegetables, add tofu, the rest of the masala and the ginger. Three minutes.'],
  },
  {
    slug: 'tofu-tikka',
    title: 'Tofu Tikka',
    lane: 'family',
    time: '40 min',
    minutes: 40,
    sku: 'classic-tofu',
    hook: 'Photographs better than paneer tikka, and holds a skewer without splitting.',
    serves: 4,
    tofuGrams: 250,
    ingredients: ['250 g Classic Firm Tofu, in large cubes', '4 tbsp thick curd', '2 tbsp besan', '1 tsp ajwain', '1 tsp red chilli powder', '1/2 tsp haldi', '1 tsp chaat masala', '1 tbsp mustard oil', 'Capsicum and onion in squares', 'Salt'],
    steps: [
      'Press the tofu twenty minutes under something heavy, then cube it.',
      'Dry-roast the besan a minute so it stops tasting raw. Mix with curd, spices and mustard oil.',
      'Coat the tofu and vegetables. Marinate thirty minutes, longer if you have it.',
      'Skewer and cook — 200 °C oven for eighteen minutes, or a hot tawa turning every two.',
      'Chaat masala and lemon while still hot.',
    ],
  },
  {
    slug: 'tofu-bhurji-pav',
    title: 'Tofu Bhurji Pav',
    lane: 'family',
    time: '20 min',
    minutes: 20,
    sku: 'classic-tofu',
    hook: 'The five-minute bhurji, scaled up for a table, with buttered pav.',
    serves: 4,
    tofuGrams: 400,
    ingredients: ['400 g Classic Firm Tofu', '2 onions', '2 tomatoes', '1 capsicum', '1 tbsp pav bhaji masala', '1/2 tsp haldi', '3 tbsp butter', '8 pav', 'Salt, coriander, lemon'],
    steps: ['Butter, onion, capsicum, then tomato and the masalas. Cook until soft.', 'Crumble the tofu in and cook five minutes on medium.', 'Split and toast the pav in butter.', 'Coriander, lemon, raw onion on the side.'],
  },
  {
    slug: 'tofu-paratha',
    title: 'Tofu Paratha',
    lane: 'family',
    time: '30 min',
    minutes: 30,
    sku: 'classic-tofu',
    hook: 'Goes into a school tiffin without anyone noticing the swap.',
    serves: 4,
    tofuGrams: 200,
    ingredients: ['200 g Classic Firm Tofu, crumbled and squeezed dry', '1 onion, very fine', '1 green chilli', '1/2 tsp ajwain', '1/2 tsp red chilli powder', 'Atta dough', 'Ghee', 'Salt'],
    steps: ['Squeeze every drop of water out of the crumbled tofu — wet filling tears the paratha.', 'Mix with onion, chilli and spices.', 'Stuff, roll gently, and cook on a medium tawa with ghee until both sides are spotted.'],
  },
  {
    slug: 'shahi-tofu-korma',
    title: 'Shahi Tofu Korma',
    lane: 'family',
    time: '35 min',
    minutes: 35,
    sku: 'classic-tofu',
    hook: 'Cashew-onion gravy for a festival meal. Proof that this is not only diet food.',
    serves: 4,
    tofuGrams: 250,
    ingredients: ['250 g Classic Firm Tofu, cubed', '2 onions, boiled', '15 cashews', '1 tbsp melon seeds', '1/2 cup curd, whisked', '1 tsp ginger-garlic paste', '4 green cardamom', '1 bay leaf', '1/2 tsp white pepper', '2 tbsp ghee', 'Salt, kewra'],
    steps: [
      'Blend the boiled onion, cashews and melon seeds to a smooth white paste.',
      'Ghee, whole spices, then ginger-garlic. Do not let anything brown — this gravy stays pale.',
      'Add the paste and cook eight minutes on low, stirring.',
      'Take the pan off the heat before folding in the curd, or it will split. Back on low, add salt and white pepper.',
      'Tofu, four minutes, a drop of kewra at the end.',
    ],
  },
] as const

export function recipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug)
}

export function recipesByLane(lane: Lane): Recipe[] {
  return RECIPES.filter((r) => r.lane === lane)
}

/** Linked from every recipe page: tofu fails in Indian kitchens for texture
 *  reasons, not taste reasons, and owning this page is how we become the
 *  authority in our pin codes. */
export const MAHARAJA_METHOD = [
  { title: 'Press it twenty minutes', body: 'Under a heavy patila. Firm tofu comes packed in water; pressed tofu has bite.' },
  { title: 'Blanch two minutes in hot salted water', body: 'Before it goes into a gravy. This is the single trick that gives it a soft, paneer-like mouthfeel.' },
  { title: 'Freeze overnight, then thaw', body: 'For a chewier, spongier bite that drinks up gravy. Sounds odd. Works brilliantly.' },
  { title: 'Marinate fifteen minutes, minimum', body: 'Dahi, besan, ajwain, chilli, haldi. Tofu is porous — it takes flavour faster and deeper than paneer does.' },
  { title: 'Add it in the last three minutes', body: 'Never boil tofu in a gravy for fifteen minutes. It does not need the time, and it will crumble.' },
] as const
