import { GameState, gameStateGetResourceCount } from './state';
import {
  GameEventChoice,
  ResourceType,
  BUY_COSTS,
  HERB_NAMES,
  POTION_NAMES,
  RECIPES,
  GameEvent,
  recipeToStringArr,
} from './eventTypes';
import { createEventState, GameEventState } from './eventRunner';
import { CONDITION_DELIMITER } from './eventParser';
import { BR, copyObject } from './dom';
import { randInArray } from './utils';

export const gameCreateMerchantEvents = (
  state: GameState,
  eventState: GameEventState
) => {
  const buyChoices: GameEventChoice[] = [];
  // const sellChoices: GameEventChoice[] = [];

  const buyCosts = { ...BUY_COSTS };

  // for (const res of state.vars.avblBlueprints) {
  //   buyCosts[res] = 10;
  // }

  // const sellCosts = {
  //   ...SELL_COSTS,
  // };

  for (const [res, cost] of Object.entries(buyCosts)) {
    buyChoices.push({
      text: `<b class="shop">Buy 1 ${res} (${cost} ${ResourceType.GOLD})</b>`,
      n: 'buy_' + res,
      conditionText: `HAS(${cost} ${ResourceType.GOLD})`,
    });
    eventState.event.children.push({
      id: 'buy_' + res,
      type: 'm',
      p: `You buy ${res} for ${cost} ${ResourceType.GOLD}.`,
      mod: [`-${cost} ${ResourceType.GOLD}`, `1 ${res}`],
      n: 'merch',
      fastScroll: true,
    });
  }

  for (const res of HERB_NAMES) {
    if (state.res.includes(res)) {
      buyChoices.push({
        text: `<b class="shop">Sell 1 ${res} (1 ${ResourceType.GOLD})</b>`,
        n: 'sell_' + res,
        // conditionText: `HAS(1 ${res})`,
      });
      eventState.event.children.push({
        id: 'sell_' + res,
        type: 'm',
        p: `You sell 1 ${res} for 1 ${ResourceType.GOLD}.`,
        mod: [`-1 ${res}`, `1 ${ResourceType.GOLD}`],
        n: 'merch',
        re: true,
        fastScroll: true,
      });
    }
  }

  buyChoices.push({
    text: 'Go back.',
    n: 'day',
  });

  // for (const [res, cost] of Object.entries(sellCosts)) {
  //   if (state.res.includes(res as ResourceType)) {
  //     sellChoices.push({
  //       text: `Sell 1 ${res} for ${cost} ${
  //         ResourceType.GOLD
  //       }<br> (you own ${gameStateGetResourceCount(
  //         state,
  //         res as ResourceType
  //       )})`,
  //       n: 'sell_' + res,
  //     });
  //     eventState.event.children.push({
  //       id: 'sell_' + res,
  //       type: 'modify',
  //       p: `You sell ${res} for ${cost} ${ResourceType.GOLD}.`,
  //       mod: [`-1 ${res}`, `${cost} ${ResourceType.GOLD}`],
  //       n: 'merchSelling',
  //       /*@preserve*/
  //       re: true,
  //     });
  //   }
  // }

  // sellChoices.push({
  //   text: 'Go back.',
  //   n: 'day',
  // });

  eventState.event.children.push(
    {
      /*@preserve*/
      id: 'merch',
      /*@preserve*/
      type: 'm',
      /*@preserve*/
      p: '"Whaddya want?"',
      /*@preserve*/
      choices: buyChoices,
      fastScroll: true,
    }
    // {
    //   /*@preserve*/
    //   id: 'merchSelling',
    //   /*@preserve*/
    //   type: 'choice',
    //   /*@preserve*/
    //   p: 'You rummage in your pack for wares to sell.',
    //   /*@preserve*/
    //   choices: sellChoices,
    // }
  );
};

export const gameCreateBrewingEvents = (
  state: GameState,
  eventState: GameEventState
) => {
  const choices: GameEventChoice[] = [];

  const recipes = { ...RECIPES };
  for (const [res, recipe] of Object.entries(recipes)) {
    const amounts = recipeToStringArr(recipe);
    const numOwned = gameStateGetResourceCount(state, res as ResourceType);
    choices.push({
      text: `${res}:${BR}${amounts.join(BR)}`,
      n: 'b_' + res,
      conditionText: amounts.map(a => `HAS(${a})`).join(CONDITION_DELIMITER),
    });
    eventState.event.children.push({
      id: 'b_' + res,
      type: 'm',
      p: `You make a ${res}.`,
      mod: [...amounts.map(a => `-${a}`), `1 ${res}`],
      n: 'pot',
      /*@preserve*/
      re: true,
      fastScroll: true,
    });
  }

  choices.push({
    /*@preserve*/
    text: 'Go back.',
    /*@preserve*/
    n: 'day',
  });

  eventState.event.children.push({
    /*@preserve*/
    id: 'pot',
    /*@preserve*/
    type: 'ch',
    /*@preserve*/
    p: 'At the mixing table you can concoct magical potions.',
    /*@preserve*/
    flex: true,
    /*@preserve*/
    choices,
    fastScroll: true,
  });
};

export const gameCreateViewInventoryEvents = (
  state: GameState,
  eventState: GameEventState
) => {
  const resAndCounts = POTION_NAMES.map(res => ({
    res,
    count: gameStateGetResourceCount(state, res),
  }));

  eventState.event.children.push({
    /*@preserve*/
    id: 'inv',
    /*@preserve*/
    type: 'm',
    /*@preserve*/
    p:
      "Here's what you have:" +
      resAndCounts.map(r => ` ${BR}${r.res} (${r.count})`).join(''),
    /*@preserve*/
    n: 'day',
  });
};

export const gameCreateAntiCursePotionEvent = (
  state: GameState,
  eventState: GameEventState
) => {
  // if has a dice face with a curse on it
  if (state.magicDice.some(d => d.some(f => f === ResourceType.DICE_CUR))) {
    const dayEvent = eventState.event.children.find(ch => ch.id === 'day');
    dayEvent.choices.push({
      text: 'Use 1 POT_ANTI_CURSE to remove a curse.',
      n: 'noc',
      conditionText: `HAS(1 ${ResourceType.POT_ANT})`,
    });
    eventState.event.children.push({
      id: 'noc',
      type: 'm',
      p: 'Use 1 POT_ANTI_CURSE to remove a curse.',
      mod: [
        `-1 ${ResourceType.POT_ANT}`,
        `1 ${ResourceType.EFF_RMCUR}`,
      ],
      n: 'day',
      re: true,
    });
  }
};

export const createContractReturnEvent = (contractEvent: GameEvent) => {
  const potionName = contractEvent.vars['@A'].parsed as string;
  const eventState = createEventState({
    title: 'The villager returns',
    icon: '📜',
    children: [
      {
        id: '0',
        type: 'ch',
        p:
          'The villager from last week returns to collect their promised potion:' +
          BR +
          potionName,
        choices: [
          {
            text: 'Give them the potion.',
            n: '1',
            conditionText: `HAS(${potionName})`,
          },
          {
            text: 'Say you cannot help. The Black Cat will be most displeased.',
            n: '2',
          },
        ],
      },
      {
        id: '1',
        type: 'm',
        p: 'You sell the potion to the villager.',
        mod: [`-${potionName}`, '7 GOLD'],
        n: 'e',
      },
      {
        id: '2',
        type: 'm',
        p: 'The disappointed villager leaves.',
        mod: [`-2 ${ResourceType.FAV_CAT}`],
        n: 'e',
      },
    ],
  });
  return eventState;
};

export const createBlackCatEvent = (originalBlackCatEvent: GameEvent) => {
  const event = copyObject(originalBlackCatEvent);
  const choiceChild = event.children.find(ch => ch.id === 'ch');

  const potentialRewards = [
    ResourceType.EFF_FFIR,
    ResourceType.EFF_FHEA,
    ResourceType.EFF_FGRO,
  ];

  const potentialChoices = [
    {
      text: '1 Random Dice Upgrade',
      n: 'dice',
    },
    // {
    //   text: '1 BLUEPRINT_SPECIALPETAL',
    //   n: 'bed',
    // },
  ];
  choiceChild.choices = potentialChoices;

  event.children.push(
    {
      id: 'dice',
      type: 'm',
      p: "The Black Cat's eyes glow, and you feel a new power within you.",
      mod: [`1 ${randInArray(potentialRewards)}`],
      n: 'e',
    },
    {
      id: 'bed',
      type: 'm',
      p: 'The cat blinks and you have a new seed bed.',
      mod: [`1 ${ResourceType.BP_SPE}`],
      n: 'e',
    }
  );

  return event;
};
