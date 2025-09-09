import {
  appendChild,
  copyObject,
  createElement,
  INNER_HTML,
  P,
  setStyle,
  timeoutPromise,
} from './dom';
import { GameEventState, runEvent } from './eventRunner';
import {
  BLUEPRINT_NAMES,
  DICE_NAMES,
  GameEvent,
  GameEventChild,
  Labels,
  MONSTER_NAMES,
  ResourceType,
} from './eventTypes';
import {
  createBlackCatEvent,
  createContractReturnEvent,
} from './generatedEvents';
import {
  createMagicDice,
  createMagicDiceBlank,
  DiceWithFaces,
  GameState,
  gameStateGetResourceCount,
  gameStateModifyResource,
} from './state';
import { calendarAdvanceDayForward } from './ui/Calendar';
import { Dice, diceSetFace, diceSpin } from './ui/Dice';
import { eventModalAddChild, eventModalScrollToBottom } from './ui/EventModal';
import { setPrimaryResources } from './ui/PrimaryResources';
import { randInArray, randInRange } from './utils';

let EXPULSION_EVENT: GameEvent;

export const gameAdvanceDay = (state: GameState, msg?: string) => {
  eventModalAddChild(
    state.ui.eventModal,
    {
      id: '1',
      type: 'm',
      p: msg ?? 'You close up your shop for the day.',
    },
    {
      event: state.events[state.day],
      evalVars: {},
      currentChildId: '1',
    },
    state
  );

  const moonAnim = createElement(P, {
    class: 'moon-anim',
  });
  appendChild(state.ui.eventModal.content, moonAnim);
  for (let i = 0; i < 1; i++) {
    appendChild(state.ui.eventModal.content, createElement('br'));
  }
  const phases = [...'🌕🌕🌕🌕🌖🌗🌘🌑🌒🌓🌔🌕🌕🌕🌕'];
  for (let i = 0; i < phases.length; i++) {
    timeoutPromise(i * 100).then(() => {
      moonAnim[INNER_HTML] = phases[i];
      eventModalScrollToBottom(state.ui.eventModal);
    });
  }

  state.day++;

  timeoutPromise(phases.length * 100).then(() => {
    moonAnim.remove();
    const sep = createElement(P, {
      [INNER_HTML]: '---<br>Day ' + state.day,
    });
    appendChild(state.ui.eventModal.content, sep);
    eventModalScrollToBottom(state.ui.eventModal);
    if (!msg) {
      calendarAdvanceDayForward(state.ui.calendar);
    }

    console.log('ADVANCE DAY', state.day, state.events[state.day]);
    const favorAmt = gameStateGetResourceCount(state, ResourceType.FAV_CAT);
    if (favorAmt === 0) {
      runEvent(state, EXPULSION_EVENT);
    } else {
      runEvent(state, state.events[state.day]);
    }
  });
};

export const gameHarvest = (
  state: GameState,
  slots: {
    resourceType: ResourceType;
    diceResults: ResourceType[];
  }[],
  multiplier: number = 1
) => {
  console.log('HARVEST', state, slots, multiplier);
  const resourcesAdded: number[] = [];
  for (const slot of slots) {
    const numHarvestResults = slot.diceResults.filter(
      r => r === ResourceType.DICE_GRO
    ).length;
    resourcesAdded.push(numHarvestResults * multiplier);
    for (let i = 0; i < numHarvestResults * multiplier; i++) {
      state.res.push(slot.resourceType);
    }
  }
  setPrimaryResources(state.ui.res, state);

  return resourcesAdded;
};

export const gameGetDiceResult = (dice: DiceWithFaces) => {
  return randInArray(dice);
};

export const gameGetDiceResults = (diceList: DiceWithFaces[]) => {
  const results: ResourceType[] = [];
  for (const dice of diceList) {
    results.push(gameGetDiceResult(dice));
  }
  return results;
};

export const gameRollDiceUi = async (
  arr: { dice: DiceWithFaces; elem: Dice }[],
  reqs: ResourceType[],
  luck: boolean = false
) => {
  const results: ResourceType[] = [];
  const promises: Promise<void>[] = [];
  let isCursed = false;
  const curseColor = 'orange';
  for (const d of arr) {
    const resultValue = luck ? reqs[0] : gameGetDiceResult(d.dice);

    promises.push(
      diceSpin(d.elem, resultValue, 600, 2).then(() => {
        const icon = Labels[resultValue].icon;
        diceSetFace(d.elem, icon);
        let borderColor = reqs.includes(resultValue) ? 'green' : 'red';
        let background = reqs.includes(resultValue) ? 'green' : 'unset';
        if (resultValue === ResourceType.DICE_CUR) {
          isCursed = true;
        }
        if (isCursed) {
          borderColor = curseColor;
          background = curseColor;
        }
        setStyle(d.elem.root, {
          borderColor: borderColor,
          background: background,
        });
      })
    );
    await timeoutPromise(250);

    results.push(resultValue);
  }
  await Promise.all(promises);
  if (isCursed) {
    for (const d of arr) {
      setStyle(d.elem.root, {
        borderColor: curseColor,
        background: curseColor,
      });
    }
    for (let i = 0; i < results.length; i++) {
      results[i] = ResourceType.DICE_CUR;
    }
  }
  return results;
};

export const gameSetupEvents = (state: GameState, events: GameEvent[]) => {
  const findEventByTitle = (title: string) => {
    return events.find(e => e.title === title);
  };
  const shuffleEvents = (events: GameEvent[]) => {
    return events.sort(() => Math.random() - 0.5);
  };
  const START_EVENT = findEventByTitle('The Game');
  const VILLAGER_CONTRACT_EVENT = findEventByTitle('Villager Contract');
  const BLACK_CAT_EVENT = findEventByTitle('The Black Cat');
  const DEMONIC_DEAL_EVENT = findEventByTitle('Demonic Deal');
  const ATTACK_EVENT = findEventByTitle('Attack!');
  const HERB_MERCHANT_EVENT = findEventByTitle('Herb Merchant');
  const FINAL_TEST_EVENT = findEventByTitle('The Final Test');
  const END_EVENT = findEventByTitle('True Witch');
  EXPULSION_EVENT = findEventByTitle('Expulsion');
  const templateEvents = [
    START_EVENT,
    VILLAGER_CONTRACT_EVENT,
    BLACK_CAT_EVENT,
    DEMONIC_DEAL_EVENT,
    ATTACK_EVENT,
    HERB_MERCHANT_EVENT,
    FINAL_TEST_EVENT,
    END_EVENT,
    EXPULSION_EVENT,
  ];

  const eventsToShuffle = events.filter(e => !templateEvents.includes(e));
  const attackEvents: GameEvent[] = [];

  for (let i = 0; i < 7; i++) {
    const numFireToDefeat = i < 3 ? 1 : i < 6 ? 2 : 3;
    const monsterName = randInArray(MONSTER_NAMES);
    const attackEvent = copyObject(ATTACK_EVENT);
    for (const child of attackEvent.children) {
      child.p = child.p?.replace('monster', '<b>' + monsterName + '</b>');
    }
    attackEvent!.vars['@A'] = {
      str: `FIRE(${numFireToDefeat})`,
      parsed: undefined,
    };
    eventsToShuffle.push(attackEvent);
    attackEvents.push(attackEvent);
  }

  for (let i = 0; i < 4; i++) {
    const herbMerchantEvent = copyObject(HERB_MERCHANT_EVENT);
    eventsToShuffle.push(herbMerchantEvent);
  }

  const diceFaceReplacements = [
    ResourceType.EFF_FFIR,
    ResourceType.EFF_FHEA,
    ResourceType.EFF_FGRO,
  ];
  const diceMagics = [
    ResourceType.DICE_FIR,
    ResourceType.DICE_HEA,
    ResourceType.DICE_GRO,
  ];
  for (let i = 0; i < 3; i++) {
    const demonicDealEvent = copyObject(DEMONIC_DEAL_EVENT);
    const effect = randInArray(diceFaceReplacements);
    const resourceForEffect = diceMagics[diceFaceReplacements.indexOf(effect)];
    demonicDealEvent!.vars['@C'] = {
      str: '1 ' + effect,
      parsed: undefined,
    };
    demonicDealEvent!.vars['@A1'] = {
      str: '1 ' + resourceForEffect,
      parsed: undefined,
    };
    eventsToShuffle.push(demonicDealEvent);
  }

  const orderedEvents = shuffleEvents(eventsToShuffle);

  let attackEventInd = 0;
  for (let i = 0; i < orderedEvents.length; i++) {
    if (orderedEvents[i].title === ATTACK_EVENT.title) {
      orderedEvents[i] = attackEvents[attackEventInd];
      attackEventInd++;
    }
  }

  for (let i = 0; i < 4; i++) {
    const contractEvent = copyObject(VILLAGER_CONTRACT_EVENT);
    orderedEvents.splice(i * 4 + randInRange(0, 6), 0, contractEvent);
  }
  for (let i = 0; i < 4; i++) {
    const blackCatEvent = createBlackCatEvent(BLACK_CAT_EVENT);
    orderedEvents.splice(i * 7 + 4, 0, blackCatEvent); // every Thursday
  }

  const startEventCopy = copyObject(START_EVENT);
  const continueChild = startEventCopy.children.slice(-2)[0];
  continueChild.mod = [
    '3 ' + ResourceType.GOLD,
    '1 ' + ResourceType.HERB_SPA,
    '1 ' + ResourceType.HERB_BRA,
    '1 ' + ResourceType.REAG_SKY,
    '1 ' + ResourceType.REAG_SUN,
    '1 ' + ResourceType.POT_LIQ,
  ];
  // const randomPotion = randInArray(POTION_NAMES);
  // continueChild.mod.push('1 ' + randomPotion);

  const finalEvents = [startEventCopy, ...orderedEvents].slice(0, 29);
  finalEvents.push(FINAL_TEST_EVENT, END_EVENT);
  console.log('SETUP EVENTS', startEventCopy, finalEvents);
  state.events = finalEvents;
};

export const gameModifyResource = (
  state: GameState,
  gameEventState: GameEventState,
  child: GameEventChild,
  resource: ResourceType,
  amt: number
) => {
  const replaceDiceFace = (face1: ResourceType, face2: ResourceType) => {
    for (const dice of state.magicDice) {
      for (let i = 0; i < dice.length; i++) {
        if (dice[i] === face1) {
          dice[i] = face2;
          return true;
        }
      }
    }
    return false;
  };

  const replaceOrAddDiceFace = (face1: ResourceType, face2: ResourceType) => {
    if (replaceDiceFace(face1, face2)) {
      return;
    }
    if (face2 === ResourceType.DICE_CUR && face1 === ResourceType.DICE_BLA) {
      replaceDiceFace(face1, randInArray(DICE_NAMES));
    } else {
      const dice = createMagicDiceBlank();
      state.magicDice.push(dice);
      replaceDiceFace(face1, face2);
    }
  };

  console.log(' modifying', resource, amt);
  if (resource === ResourceType.C_VIL) {
    const contractReturnEvent = createContractReturnEvent(gameEventState.event);
    const eventInd = state.events.indexOf(gameEventState.event);
    state.events.splice(eventInd + 7, 0, contractReturnEvent.event);
  } else if (resource === ResourceType.DICE_NEW) {
    state.magicDice.push(createMagicDice());
  } else if (resource === ResourceType.EFF_RMCUR) {
    replaceOrAddDiceFace(ResourceType.DICE_CUR, ResourceType.DICE_BLA);
  } else if (resource === ResourceType.EFF_FFIR) {
    replaceOrAddDiceFace(ResourceType.DICE_BLA, ResourceType.DICE_FIR);
  } else if (resource === ResourceType.EFF_FHEA) {
    replaceOrAddDiceFace(ResourceType.DICE_BLA, ResourceType.DICE_HEA);
  } else if (resource === ResourceType.EFF_FGRO) {
    replaceOrAddDiceFace(ResourceType.DICE_BLA, ResourceType.DICE_GRO);
  } else if (resource === ResourceType.EFF_FCUR) {
    replaceOrAddDiceFace(ResourceType.DICE_BLA, ResourceType.DICE_CUR);
  } else if (resource === ResourceType.EFF_REPLCUR) {
    const diceTypes = [
      ResourceType.DICE_FIR,
      ResourceType.DICE_HEA,
      ResourceType.DICE_GRO,
    ];
    replaceOrAddDiceFace(randInArray(diceTypes), ResourceType.DICE_CUR);
  } else if (resource === ResourceType.EFF_COL) {
    // child.next = 'nextDay';
    timeoutPromise(1).then(() => {
      gameAdvanceDay(state, 'You take a day to rest and recover.');
    });
  } else {
    gameStateModifyResource(state, resource, amt);
    if (BLUEPRINT_NAMES.includes(resource)) {
      state.vars.avblBlueprints = state.vars.avblBlueprints.filter(
        blueprint => blueprint !== resource
      );
    }
  }
};
