import { defaultEventState } from './defaultEvent';
import { appendChild, BR, copyObject, getGameRoot, SPAN } from './dom';
import { ARG_DELIMITER, CONDITION_DELIMITER } from './eventParser';
import {
  ConditionFunc,
  GameEvent,
  GameEventChild,
  HERB_NAMES,
  HERB_TIER_1_NAMES,
  HERB_TIER_2_NAMES,
  Labels,
  POTION_NAMES,
  REAGENT_NAMES,
  REAGENT_TIER_1_NAMES,
  REAGENT_TIER_2_NAMES,
  RECIPES,
  recipeToStringArr,
  ResourceType,
  ResourceTypeFunc,
} from './eventTypes';
import { gameAdvanceDay, gameModifyResource } from './game';
import {
  gameCreateViewInventoryEvents,
  gameCreateBrewingEvents,
  gameCreateMerchantEvents,
  gameCreateAntiCursePotionEvent,
} from './generatedEvents';
import {
  GameState,
  gameStateGetResourceCount,
  gameStateHasResource,
  stringToResourceType,
} from './state';
import {
  createEventModal,
  eventModalAddChild,
  eventModalAddTitle,
} from './ui/EventModal';
import { setFavorMeterPct } from './ui/FavorMeter';
import { highlightText } from './ui/HoverDescription';
import { setPrimaryResources } from './ui/PrimaryResources';
import { COLOR_HIGHLIGHT_DARK_TEXT } from './ui/style';
import { randInArray, randInRange, splitDelimTrim } from './utils';

export interface GameEventState {
  event: GameEvent;
  evalVars: Record<string, string>;
  currentChildId: string;
}

export const runEvent = (state: GameState, event: GameEvent) => {
  const eventState = createEventState(event);
  evaluateVars(state, eventState, event);
  replaceVars(state, eventState, event);
  let modal = state.ui.eventModal;
  if (!modal) {
    modal = createEventModal(eventState);
    appendChild(getGameRoot(), modal.root);
  } else {
    eventModalAddTitle(modal, eventState);
  }
  state.ui.eventModal = modal;
  console.log('run event', event);
  gameEventRunChild(
    state,
    eventState,
    gameEventGetChild(eventState, eventState.currentChildId)
  );
};

export const gameEventRunChild = (
  state: GameState,
  eventState: GameEventState,
  child: GameEventChild
) => {
  const modal = state.ui.eventModal;
  if (!modal) {
    throw new Error('Cannot run child: No event modal found');
  }

  if (child.type === 'end') {
    if (child.id === 'nextDay') {
      gameAdvanceDay(state);
    } else if (child.id === 'eIntro') {
      state.day = 0;
      gameAdvanceDay(state, 'Tomorrow you start your first day as a witch.');
      return;
    } else {
      // run default event
      const newEventState = copyObject(defaultEventState);
      gameCreateMerchantEvents(state, newEventState);
      gameCreateBrewingEvents(state, newEventState);
      gameCreateViewInventoryEvents(state, newEventState);
      gameCreateAntiCursePotionEvent(state, newEventState);
      gameEventRunChild(state, newEventState, newEventState.event.children[0]);
      if (
        state.day % 7 === 4 ||
        state.day === 29 ||
        gameStateGetResourceCount(state, ResourceType.FAV_CAT) === 0
      ) {
        // appendChild(
        //   modal.content,
        //   createElement('p', {
        //     [INNER_HTML]: `<${SPAN} style="color: brown;">You feel that the Black Cat will visit you tomorrow.</${SPAN}>`,
        //   })
        // );
        const dayChild = newEventState.event.children.find(
          ch => ch.id === 'day'
        );
        if (dayChild) {
          let text = 'You feel that the Black Cat will visit you tomorrow.';
          if (state.day === 29) {
            text =
              'A sense of urgency fills you! The Black Cat will come to TEST you tomorrow!';
          }
          dayChild.p += `${BR}${BR}<${SPAN} style="color: brown;">${text}</${SPAN}>`;
        }
      }
    }
    return;
  }

  if (child.p) {
    child.p = gameEventReplaceEnumWithIcons(child.p, COLOR_HIGHLIGHT_DARK_TEXT);
  }

  if (child.choices) {
    for (const choice of child.choices) {
      choice.text = gameEventReplaceEnumWithIcons(
        choice.text,
        COLOR_HIGHLIGHT_DARK_TEXT
      );
      if (!choice.parsedCondition) {
        choice.parsedCondition = gameEventParseCondition(
          state,
          eventState,
          choice.conditionText
        );
      }
    }
  }

  if (child.rolls) {
    child.parsedRolls = [];
    for (const roll of child.rolls) {
      const [amt, resource] = parseAmountAndResource(roll);
      for (let i = 0; i < amt; i++) {
        child.parsedRolls.push(resource);
      }
    }
  }

  if (child.mod) {
    child.parsedMod = [];
    for (const modifyResource of child.mod) {
      // eslint-disable-next-line prefer-const
      let [amt, resource] = parseAmountAndResource(modifyResource);
      if (Math.abs(amt) === 99) {
        amt = Math.sign(amt) * gameStateGetResourceCount(state, resource);
      }
      child.parsedMod.push({
        amt,
        resource,
      });
      gameModifyResource(state, eventState, child, resource, amt);
    }
  }

  if (child.re) {
    console.log('re generating event state');
    // generate default event
    eventState = copyObject(defaultEventState);
    gameCreateMerchantEvents(state, eventState);
    gameCreateBrewingEvents(state, eventState);
    gameCreateViewInventoryEvents(state, eventState);
    gameCreateAntiCursePotionEvent(state, eventState);
  }

  eventModalAddChild(modal, child, eventState, state);
  setPrimaryResources(state.ui.res!, state);
  setFavorMeterPct(
    state.ui.favorMeter!,
    gameStateGetResourceCount(state, ResourceType.FAV_CAT)
  );
};

export const gameEventGetChild = (
  eventState: GameEventState,
  childId: string
): GameEventChild => {
  if (childId === 'e') {
    return {
      id: 'e',
      type: 'end',
    };
  }

  const child = eventState.event.children.find(child => child.id === childId);
  if (!child) {
    throw new Error(
      `Cannot getChild: Child with id ${childId} not found in event ${eventState.event.title}`
    );
  }
  return child;
};

export const createEventState = (event: GameEvent): GameEventState => {
  return {
    event,
    currentChildId: event.children[0].id,
    evalVars: {},
  };
};

export const gameEventParseResourceFunc2 = (
  text: string,
  func: string,
  args: string[],
  state: GameState
): [number, ResourceType] => {
  // console.log('parse resource func', text, func, args);
  const _parseAmt = (amtText: string) => {
    if (amtText.includes('RAND')) {
      const spl = amtText.slice(4).split('_');
      const amtLower = parseInt(spl[0]);
      const amtUpper = parseInt(spl[1]);
      if (isNaN(amtLower) || isNaN(amtUpper)) {
        throw new Error(`Invalid RAND amount: ${amtText}`);
      }
      return randInRange(amtLower, amtUpper);
    }

    const amt = parseInt(amtText);
    if (isNaN(amt)) {
      throw new Error(`Invalid ARG amount: ${amtText}`);
    }
    return amt;
  };
  const _parseArgsForAmtFunc = (
    resList: ResourceType[]
  ): [number, ResourceType] => {
    let amt = _parseAmt(args[0]);
    const requireExist = args[1] === 'y';
    let resToReturn: ResourceType[] = [];
    while (resToReturn.length === 0 && amt > 0) {
      resToReturn = requireExist
        ? resList.filter(herb => gameStateHasResource(state, herb, amt))
        : resList;
      amt--;
    }
    if (resToReturn.length === 0) {
      const res = resList[0];
      console.log('No resources found for', func, args);
      if (requireExist && res !== ResourceType.GOLD) {
        const goldArray: ResourceType[] = [];
        for (let i = 0; i < resList.length; i++) {
          goldArray.push(ResourceType.GOLD);
        }
        return _parseArgsForAmtFunc(goldArray);
      }
      return [0, ResourceType.GOLD];
    }
    return [amt + 1, randInArray(resToReturn)];
  };

  const funcResults = {
    [ResourceTypeFunc.FUNC_H1]: () => {
      return _parseArgsForAmtFunc(HERB_TIER_1_NAMES);
    },
    [ResourceTypeFunc.FUNC_H2]: () => {
      return _parseArgsForAmtFunc(HERB_TIER_2_NAMES);
    },
    [ResourceTypeFunc.FUNC_H3]: () => {
      return _parseArgsForAmtFunc(HERB_TIER_2_NAMES);
    },
    [ResourceTypeFunc.FUNC_H_ANY]: () => {
      return _parseArgsForAmtFunc(HERB_NAMES);
    },
    [ResourceTypeFunc.FUNC_R1]: () => {
      return _parseArgsForAmtFunc(REAGENT_TIER_1_NAMES);
    },
    [ResourceTypeFunc.FUNC_R2]: () => {
      return _parseArgsForAmtFunc(REAGENT_TIER_2_NAMES);
    },
    [ResourceTypeFunc.FUNC_R_ANY]: () => {
      return _parseArgsForAmtFunc(REAGENT_NAMES);
    },
    [ResourceTypeFunc.FUNC_P1]: () => {
      return _parseArgsForAmtFunc(
        POTION_NAMES.filter(p => p !== ResourceType.POT_LIQ)
      );
    },
    [ResourceTypeFunc.FUNC_P_ANY]: () => {
      return _parseArgsForAmtFunc(POTION_NAMES);
    },
    [ResourceTypeFunc.FUNC_G]: () => {
      return _parseArgsForAmtFunc([ResourceType.GOLD]);
    },
    [ResourceTypeFunc.FUNC_FIRE]: () => {
      return _parseArgsForAmtFunc([ResourceType.DICE_FIR]);
    },
    [ResourceTypeFunc.FUNC_HEART]: () => {
      return _parseArgsForAmtFunc([ResourceType.DICE_HEA]);
    },
    [ResourceTypeFunc.FUNC_GROW]: () => {
      return _parseArgsForAmtFunc([ResourceType.DICE_GRO]);
    },
    [ResourceTypeFunc.FUNC_ING]: () => {
      if (args[0].includes('@')) {
        return [18, text];
      }
      const [, resource] = parseAmountAndResource(args.join(' '));
      const recipe: ResourceType[] = RECIPES[resource];
      const amounts = recipeToStringArr(recipe);
      return [18, amounts.join(ARG_DELIMITER)];
    },
  };

  const funcResult: () => [number, ResourceType] = funcResults[func];
  if (funcResult) {
    return funcResult();
  }

  throw new Error(
    `Unknown resource function: "${func}" after parsing "${text}"`
  );
};

export const gameEventReplaceEnumWithIcons = (
  text: string,
  highlightColor: string
): string => {
  let result = text;

  // checking "has this function modified this text already?"
  if (text.includes('<span')) {
    return text;
  }

  // ResourceType -> enumName
  const obj: Record<string, string> = {};
  for (const [enumName, enumValue] of Object.entries(ResourceType)) {
    obj[enumValue] = enumName;
  }

  for (const [enumValue, enumName] of Object.entries(obj)) {
    const labelObj = Labels[enumValue];
    if (!labelObj) {
      throw new Error(`Unknown enum value: ${enumValue}`);
    }
    const label = highlightText(labelObj.l, highlightColor);
    // if (DICE_NAMES.includes(enumValue as ResourceType)) {
    //   label = '';
    // }
    const replacement = `${label}${Labels[enumValue].icon}`;
    result = result.replaceAll(ResourceType[enumName], replacement);
  }

  text = text.replaceAll('Infinity', 'all');

  return result;
};

export const gameEventParseCondition = (
  state: GameState,
  gameEventState: GameEventState,
  conditionString: string | undefined
): (() => boolean) => {
  if (!conditionString) {
    return () => true;
  }
  const arr = splitDelimTrim(conditionString, CONDITION_DELIMITER);
  const resFuncs: (() => boolean)[] = [];
  for (let i = 0; i < arr.length; i++) {
    const cond = arr[i];
    const _parseHasResource = (str: string) => {
      const arr = parseFunc(str, ConditionFunc.HAS_RES);
      if (!arr) {
        return;
      }
      const [amt, resource] = parseAmountAndResource(arr[1].join(' '));
      return () => {
        return gameStateHasResource(state, resource, amt);
      };
    };

    const _parseHasIngredients = (str: string) => {
      const arr = parseFunc(str, ConditionFunc.HAS_ING);
      if (!arr) {
        return;
      }
      const [, resource] = parseAmountAndResource(arr[1].join(' '));
      const recipe: ResourceType[] = RECIPES[resource];
      const amounts = recipeToStringArr(recipe);
      return () => {
        return amounts.every(a => {
          const [_amt, resource] = parseAmountAndResource(a);
          return gameStateHasResource(state, resource, _amt);
        });
      };
    };

    const hasResource = _parseHasResource(cond);
    if (hasResource) {
      resFuncs.push(hasResource);
    }
    const hasIngredients = _parseHasIngredients(cond);
    if (hasIngredients) {
      resFuncs.push(hasIngredients);
    }
  }

  if (resFuncs.length === 0) {
    throw new Error(`Unknown condition format: ${conditionString}`);
  }
  return () => {
    return resFuncs.every(func => func());
  };
};

const replaceVarsInText = (text: string, evalVars: Record<string, string>) => {
  for (const [varName, varValue] of Object.entries(evalVars)) {
    text = text.replaceAll(varName, varValue);
  }
  return text;
};

const parseAmountAndResource = (text: string): [number, ResourceType] => {
  const arr = text.split(' ');
  if (arr.length === 2) {
    const t = stringToResourceType(arr[1]);
    if (arr[0].includes('ALL')) {
      return [arr[0][0] === '-' ? -99 : 99, t];
    }
    return [parseInt(arr[0]), t];
  }
  return [1, ResourceType.GOLD];
};

const parseFunc = (
  text: string,
  expectedFunc?: string
): [string, string[], string] | undefined => {
  const match = text.match(
    new RegExp(`(${expectedFunc ?? '.*'})\\(([^)]*)\\)`)
  );
  if (match) {
    let func = match[1];
    if (func[0] === '-') {
      func = func.slice(1);
    }
    const args = splitDelimTrim(match[2], ' ');
    return [func, args, match[0]];
  }
};

const evaluateVars = (
  state: GameState,
  eventState: GameEventState,
  event: GameEvent
) => {
  for (const varName in event.vars) {
    const obj = event.vars[varName];
    if (obj.parsed) {
      continue;
    }
    const parsedFunc = parseFunc(obj.str);
    if (parsedFunc) {
      const existingParsed = eventState.evalVars[varName];
      if (existingParsed) {
        obj.parsed = existingParsed;
        continue;
      }
      const [func, args, fullMatch] = parsedFunc;
      const [amt, resourceName] = gameEventParseResourceFunc2(
        fullMatch,
        func,
        args,
        state
      );
      let str = amt + ' ' + resourceName;
      if (amt === 18) {
        str = resourceName;
      }
      obj.parsed = str;
      eventState.evalVars[varName] = str;
    } else {
      obj.parsed = obj.str;
      eventState.evalVars[varName] = obj.str;
    }
  }
};

const replaceVars = (
  state: GameState,
  eventState: GameEventState,
  event: GameEvent
) => {
  for (const varName in event.vars) {
    const obj = event.vars[varName];
    if (obj.parsed.includes('@')) {
      obj.str = replaceVarsInText(obj.str, eventState.evalVars);
      delete eventState.evalVars[varName];
      delete obj.parsed;
    }
  }
  evaluateVars(state, eventState, event);

  for (const child of event.children) {
    if (child.p) {
      child.p = replaceVarsInText(child.p, eventState.evalVars);
    }
    if (child.choices) {
      for (const choice of child.choices) {
        choice.text = replaceVarsInText(choice.text, eventState.evalVars);
        if (choice.conditionText) {
          choice.conditionText = replaceVarsInText(
            choice.conditionText,
            eventState.evalVars
          );
        }
      }
    }
    if (child.rolls) {
      for (let i = 0; i < child.rolls.length; i++) {
        const roll = child.rolls[i];
        child.rolls[i] = replaceVarsInText(roll, eventState.evalVars);
      }
    }
    if (child.mod) {
      const newMod: string[] = [];
      for (let i = 0; i < child.mod.length; i++) {
        const mod = child.mod[i];
        const result = replaceVarsInText(mod, eventState.evalVars);
        const arr = splitDelimTrim(result, ARG_DELIMITER);
        const isNegative = result[0] === '-';
        if (arr.length === 1) {
          newMod.push(result);
        } else {
          newMod.push(
            ...arr.map((a, i) => (isNegative && i > 0 ? '-' + a : a))
          );
        }
      }
      child.mod = newMod;
    }
  }
};
