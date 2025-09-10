import { BR, SPAN } from './dom';

export interface GameEvent {
  title: string;
  icon: string;
  vars?: Record<string, { str: string; parsed: string | undefined }>;
  children: GameEventChild[];
}

export interface GameEventChild {
  id: string;
  type: 'ch' | 'roll' | 'end' | 'm' | 'garden' | 'd';
  p?: string;
  choices?: GameEventChoice[];
  rolls?: string[];
  parsedRolls?: ResourceType[];
  mod?: string[];
  parsedMod?: {
    amt: number;
    resource: ResourceType;
  }[];
  n?: string;
  pass?: string;
  fail?: string;
  re?: boolean; // should regenerate events
  flex?: boolean; // flex display children
  fastScroll?: boolean; // fast scroll to bottom
}

export interface GameEventChoice {
  text: string;
  parsedCondition?: () => boolean;
  conditionText?: string;
  n: string;
}

export enum ResourceType {
  GOLD = 'GOLD',
  HERB_SPA = 'HERB_SPARKLEWEED',
  HERB_BRA = 'HERB_BRAMBLEBERRY',
  HERB_SPE = 'HERB_SPECIALPETAL',
  REAG_SKY = 'REAG_SKY_DUST',
  REAG_SUN = 'REAG_SUN_POWDER',
  POT_COL = 'POT_COLD_CURE',
  POT_DRA = 'POT_DRAGON_SWEAT',
  POT_MIA = 'POT_MIASMA_OF_MIDNIGHT',
  POT_TIN = 'POT_TINCTURE_OF_TASTE',
  POT_EMP = 'POT_EMPATHY',
  POT_GRO = 'POT_GROWTH',
  POT_LIQ = 'POT_LIQUID_LUCK',
  POT_POW = 'POT_POWER_POTION',
  POT_ANT = 'POT_ANTI_CURSE',
  DICE_FIR = 'DICE_FIRE_MAGIC',
  DICE_HEA = 'DICE_HEART_MAGIC',
  DICE_GRO = 'DICE_GROW',
  DICE_CUR = 'DICE_CURSE',
  DICE_BLA = 'DICE_BLANK',
  DICE_ANY = 'ANY',
  DICE_NEW = 'DICE_NEW',
  BP_SPA = 'BLUEPRINT_SPARKLEWEED',
  BP_BRA = 'BLUEPRINT_BRAMBLEBERRY',
  BP_SPE = 'BLUEPRINT_SPECIALPETAL',
  C_VIL = 'CONTRACT_VILLAGER',
  FAV_CAT = 'FAVOR_CAT',
  EFF_COL = 'EFFECT_COLD',
  EFF_GRE = 'EFFECT_GREEN_THUMB',
  EFF_FFIR = 'EFFECT_FACE_ADD_FIRE',
  EFF_FHEA = 'EFFECT_FACE_ADD_HEART',
  EFF_FGRO = 'EFFECT_FACE_ADD_GROW',
  EFF_FCUR = 'EFFECT_FACE_ADD_CURSE',
  EFF_RMCUR = 'EFFECT_REMOVE_CURSE',
  EFF_REPLCUR = 'EFFECT_REPLACE_CURSE',
  EFF_REL = 'EFFECT_RELOAD',
}

export const DICE_NAMES = [
  ResourceType.DICE_FIR,
  ResourceType.DICE_HEA,
  ResourceType.DICE_GRO,
];

export const HERB_NAMES = [
  ResourceType.HERB_SPA,
  ResourceType.HERB_BRA,
  ResourceType.HERB_SPE,
];
export const HERB_TIER_1_NAMES = [ResourceType.HERB_SPA, ResourceType.HERB_BRA];
export const HERB_TIER_2_NAMES = [ResourceType.HERB_SPE];

export const REAGENT_NAMES = [ResourceType.REAG_SUN, ResourceType.REAG_SKY];
export const REAGENT_TIER_1_NAMES = [ResourceType.REAG_SUN];
export const REAGENT_TIER_2_NAMES = [ResourceType.REAG_SKY];

export const POTION_NAMES = [
  ResourceType.POT_GRO,
  ResourceType.POT_POW,
  ResourceType.POT_LIQ,
  ResourceType.POT_COL,
  ResourceType.POT_DRA,
  ResourceType.POT_MIA,
  ResourceType.POT_TIN,
  ResourceType.POT_ANT,
];

export const BLUEPRINT_NAMES = [
  ResourceType.BP_SPA,
  ResourceType.BP_BRA,
  ResourceType.BP_SPE,
];

export const BUY_COSTS = {
  [ResourceType.REAG_SUN]: 2,
  [ResourceType.REAG_SKY]: 3,
  [ResourceType.HERB_SPE]: 8,
};

export const SELL_COSTS = {
  // [ResourceType.REAG_SKY]: 1,
  // [ResourceType.REAG_SUN]: 1,
  // [ResourceType.HERB_SPA]: 1,
  // [ResourceType.HERB_BRA]: 2,
  // [ResourceType.HERB_SPE]: 2,
  // [ResourceType.POT_COL]: 2,
  // [ResourceType.POT_DRA]: 2,
  // [ResourceType.POT_MIA]: 5,
  // [ResourceType.POT_TIN]: 5,
  // [ResourceType.POT_LIQ]: 10,
  // [ResourceType.POT_POW]: 10,
  // [ResourceType.POT_GRO]: 10,
};

export const RECIPES = {
  [ResourceType.POT_GRO]: [ResourceType.REAG_SUN, ResourceType.REAG_SUN],
  [ResourceType.POT_EMP]: [ResourceType.HERB_SPA, ResourceType.REAG_SUN],
  [ResourceType.POT_POW]: [
    ResourceType.HERB_SPA,
    ResourceType.HERB_SPA,
    ResourceType.REAG_SUN,
  ],
  [ResourceType.POT_LIQ]: [
    ResourceType.HERB_BRA,
    ResourceType.HERB_SPA,
    ResourceType.REAG_SUN,
    ResourceType.REAG_SUN,
  ],
  [ResourceType.POT_COL]: [ResourceType.HERB_BRA, ResourceType.REAG_SKY],
  [ResourceType.POT_DRA]: [
    ResourceType.HERB_SPA,
    ResourceType.HERB_SPE,
    ResourceType.REAG_SKY,
  ],
  [ResourceType.POT_MIA]: [
    ResourceType.HERB_SPA,
    ResourceType.HERB_SPA,
    ResourceType.HERB_SPE,
    ResourceType.REAG_SKY,
  ],
  [ResourceType.POT_TIN]: [
    ResourceType.HERB_BRA,
    ResourceType.HERB_SPE,
    ResourceType.REAG_SKY,
  ],
  [ResourceType.POT_ANT]: [
    ResourceType.HERB_SPE,
    ResourceType.HERB_SPE,
    ResourceType.REAG_SUN,
    ResourceType.REAG_SKY,
  ],
};

export enum ResourceTypeFunc {
  FUNC_H1 = 'HERB1',
  FUNC_H2 = 'HERB2',
  FUNC_H3 = 'HERB3',
  FUNC_H_ANY = 'HERB',
  FUNC_R1 = 'REAG1',
  FUNC_R2 = 'REAG2',
  FUNC_R_ANY = 'REAG',
  FUNC_P1 = 'POT1',
  FUNC_P_ANY = 'POT',
  FUNC_G = 'GOLD',
  FUNC_FIRE = 'FIRE',
  FUNC_HEART = 'HEART',
  FUNC_GROW = 'GROW',
  FUNC_ING = 'ING',
}

export enum ConditionFunc {
  HAS_RES = 'HAS',
  HAS_ING = 'HAS_I',
}

export function toGrayscale(icon: string) {
  return `<${SPAN} style="filter: grayscale(75%)">${icon}</${SPAN}>`;
}

export function toHueRotate(icon: string, degrees: number) {
  return `<${SPAN} style="filter: hue-rotate(${degrees}deg)">${icon}</${SPAN}>`;
}

export function toIcon(icon: string) {
  return `<${SPAN} class="icon" style="background:#999">${icon}</${SPAN}>`;
}

export const ICON_GOLD = '💰';
export const ICON_HERB = '🌿';
export const ICON_REAGENT = '🧪';
export const ICON_POTION = '🧴';
export const ICON_FIRE_MAGIC = '🔥';
export const ICON_HEART_MAGIC = '♥️';
// export const ICON_LUCK = '🍀';
export const ICON_CAT = toGrayscale('🐈‍⬛');
export const ICON_GROW = '🌱';
export const ICON_CONTRACT = '📃';
export const ICON_EXCLAMATION = '❗';
// export const ICON_KING = '👑';
export const ICON_VILLAGER = '👨';
export const ICON_DRAGON = '🐲';
export const ICON_FELLA = '👾';
// export const ICON_FAIRY = '🧚🏿‍♀️';
export const ICON_WITCH = '🧙🏿‍♀️';
// export const ICON_WEATHER = '🌤';
export const ICON_DICE = '🎲';
export const ICON_CURSE = '💀';
export const ICON_BLANK = '✖️';
export const ICON_COLD = '🤧';

export interface LabelObj {
  l: string;
  icon: string;
  dsc: string;
}

export const Labels: Record<string, LabelObj> = {
  [ResourceType.DICE_FIR]: {
    l: 'Fire Magic',
    icon: ICON_FIRE_MAGIC,
    dsc: 'Fends off your enemies.',
  },
  [ResourceType.DICE_HEA]: {
    l: 'Heart Magic',
    icon: ICON_HEART_MAGIC,
    dsc: 'Guides situations and people.',
  },
  [ResourceType.DICE_GRO]: {
    l: 'Grow',
    icon: ICON_GROW,
    dsc: 'Grows your magical garden.',
  },
  [ResourceType.DICE_ANY]: {
    l: 'Any',
    icon: ICON_DICE,
    dsc: 'Any magic dice.',
  },
  [ResourceType.DICE_BLA]: {
    l: 'Blank',
    icon: ICON_BLANK,
    dsc: 'A blank dice face.',
  },
  [ResourceType.DICE_CUR]: {
    l: 'Curse',
    icon: ICON_CURSE,
    dsc: 'Auto fails spells.',
  },
  [ResourceType.GOLD]: {
    l: 'Gold',
    icon: ICON_GOLD,
    dsc: 'Merchants love it.',
  },
  [ResourceType.HERB_SPA]: {
    l: 'Sparkleweed',
    icon: ICON_HERB,
    dsc: 'A glittery weed.',
  },
  [ResourceType.HERB_BRA]: {
    l: 'Bramberry',
    icon: toHueRotate(ICON_HERB, 90),
    dsc: 'Magical berries.',
  },
  [ResourceType.HERB_SPE]: {
    l: 'Specialpetal',
    icon: toHueRotate(ICON_HERB, 248),
    dsc: 'Rare flower for rare potions.',
  },
  [ResourceType.REAG_SKY]: {
    l: 'Sky Dust',
    icon: ICON_REAGENT,
    dsc: 'Common dust collected on magical clouds.',
  },
  [ResourceType.REAG_SUN]: {
    l: 'Sun Powder',
    icon: toHueRotate(ICON_REAGENT, 180),
    dsc: 'Rare ground-up sunbeams.',
  },
  [ResourceType.POT_COL]: {
    l: 'Cold Cure',
    icon: ICON_POTION,
    dsc: 'Cures colds.',
  },
  [ResourceType.POT_DRA]: {
    l: 'Dragon Sweat',
    icon: ICON_POTION,
    dsc: 'Antifire.',
  },
  [ResourceType.POT_MIA]: {
    l: 'Night Miasma ',
    icon: ICON_POTION,
    dsc: 'Sleep potion.',
  },
  [ResourceType.POT_TIN]: {
    l: 'Taste Tinc',
    icon: ICON_POTION,
    dsc: 'Yummy.',
  },
  [ResourceType.POT_EMP]: {
    l: 'Empathy Pot',
    icon: ICON_POTION,
    dsc: 'More hearts.',
  },
  [ResourceType.POT_LIQ]: {
    l: 'Liquid Luck',
    icon: ICON_POTION,
    dsc: 'Grants luck.',
  },
  [ResourceType.POT_POW]: {
    l: 'Power Potion',
    icon: ICON_POTION,
    dsc: `Temp ${ICON_FIRE_MAGIC}/${ICON_HEART_MAGIC} dice.`,
  },
  // [ResourceType.POT_REDO]: {
  //   l: 'Retry Serum',
  //   icon: ICON_POTION,
  //   dsc: 'Failed dice roll again.',
  // },
  [ResourceType.POT_GRO]: {
    l: 'Growth Pot',
    icon: ICON_POTION,
    dsc: 'Increases yields.',
  },
  [ResourceType.POT_ANT]: {
    l: 'NoCurse Pot',
    icon: ICON_POTION,
    dsc: 'Removes curses.',
  },
  [ResourceType.C_VIL]: {
    l: 'Contract',
    icon: ICON_CONTRACT,
    dsc: 'A simple request.',
  },
  [ResourceType.FAV_CAT]: {
    l: "Cat's Favor",
    icon: ICON_CAT,
    dsc: 'Your standing with the Black Cat.',
  },
  [ResourceType.BP_SPA]: {
    l: 'Seed of Sparkleweed',
    icon: ICON_GROW,
    dsc: 'Additional Sparkleweed seed bed.',
  },
  [ResourceType.BP_BRA]: {
    l: 'Seed of Bramberry',
    icon: ICON_GROW,
    dsc: 'Additional Bramberry seed bed.',
  },
  [ResourceType.BP_SPE]: {
    l: 'Seed of Specialpetal',
    icon: ICON_GROW,
    dsc: 'Additional Specialpetal seed bed.',
  },
  [ResourceType.DICE_NEW]: {
    l: 'Magic Dice',
    icon: ICON_DICE,
    dsc: 'A new magic dice.',
  },
  [ResourceType.EFF_COL]: {
    l: 'Skip Day',
    icon: ICON_COLD,
    dsc: 'The day is skipped.',
  },
  [ResourceType.EFF_GRE]: {
    l: 'Green Thumbs',
    icon: ICON_GROW,
    dsc: 'Your thumbs are bright green.',
  },
  [ResourceType.EFF_FFIR]: {
    l: 'Fire Dice Face',
    icon: ICON_FIRE_MAGIC,
    dsc: `A dice face increases your power.`,
  },
  [ResourceType.EFF_FHEA]: {
    l: 'Heart Dice Face',
    icon: ICON_HEART_MAGIC,
    dsc: `A dice face increases your power.`,
  },
  [ResourceType.EFF_FGRO]: {
    l: 'Grow Dice Face',
    icon: ICON_GROW,
    dsc: `A dice face increases your power.`,
  },
  [ResourceType.EFF_FCUR]: {
    l: 'Curse Dice Face',
    icon: ICON_CURSE,
    dsc: `Cursed power inhibits your magic.`,
  },
  [ResourceType.EFF_RMCUR]: {
    l: 'Removed Curse',
    icon: ICON_CURSE,
    dsc: `Dispelled a curse.`,
  },
  [ResourceType.EFF_REPLCUR]: {
    l: 'Curse!',
    icon: ICON_CURSE,
    dsc: `A curse replaces a face.`,
  },
  [ResourceType.EFF_REL]: {
    l: '',
    icon: ICON_DICE,
    dsc: ``,
  },
};

export const recipeToStringArr = (
  recipe: ResourceType[],
  includeLabels: boolean = false
) => {
  const herbsAndReagents = [...HERB_NAMES, ...REAGENT_NAMES];
  const amounts: string[] = [];
  for (const potentialIngredient of herbsAndReagents) {
    const amt = recipe.filter(r => r === potentialIngredient).length;
    if (amt > 0) {
      if (includeLabels) {
        const labelObj = Labels[potentialIngredient];
        amounts.push(`${amt}${labelObj.l.slice(0, 3)}${labelObj.icon}`);
      } else {
        amounts.push(`${amt} ${potentialIngredient}`);
      }
    }
  }
  return amounts;
};

for (const key in Labels) {
  Labels[key].icon = `<${SPAN} class="icon">${Labels[key].icon}</${SPAN}>`;
}

for (const res of [...POTION_NAMES]) {
  const recipe = RECIPES[res];
  const recipeStr = recipeToStringArr(recipe, true);
  Labels[res].dsc += `${BR}<${SPAN} style="font-size: 14px">${recipeStr.join(
    ','
  )}</${SPAN}>`;
}

export const getResourceFromLabel = (label: string) => {
  const ind = label.lastIndexOf('>');
  if (ind > -1) {
    label = label.slice(ind + 1);
  }
  for (const key in Labels) {
    if (Labels[key].l.toLowerCase() === label.toLowerCase()) {
      return key as ResourceType;
    }
  }
};

export const MONSTER_NAMES = [
  'Giant Frog',
  'Giant Spider',
  'Medusa',
  'Cyclops',
  'Ogre',
  'Troll',
  'Phoenix',
  'Hydra',
  'Minotaur',
  'Griffon',
  'Golem',
  'Wraith',
  'Demon',
  // 'Dragon',
  'Lich',
  'Giant',
  'Wyrm',
];
