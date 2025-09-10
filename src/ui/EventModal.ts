import {
  appendChild,
  createElement,
  domAddEventListener,
  DIV,
  INNER_HTML,
  BUTTON,
  P,
  EVENT_CLICK,
  SPAN,
  timeoutPromise,
  clearChildren,
  copyObject,
  setStyle,
  setAttribute,
  BR,
} from '../dom';
import {
  gameEventRunChild,
  GameEventState,
  gameEventGetChild,
  gameEventReplaceEnumWithIcons,
} from '../eventRunner';
import {
  GameEventChild,
  ICON_CAT,
  ICON_HEART_MAGIC,
  Labels,
  ResourceType,
} from '../eventTypes';
import { gameRollDiceUi } from '../game';
import {
  createPowerDice,
  DiceWithFaces,
  GameState,
  gameStateGetResourceCount,
  gameStateModifyResource,
} from '../state';
import { createDice, Dice } from './Dice';
import { createGarden } from './Garden';
import { highlightResource } from './HoverDescription';
import { CLASS_BTN_TEXT, COLOR_HIGHLIGHT_DARK_TEXT } from './style';

export interface EventModal {
  root: HTMLElement;
  // title: HTMLElement;
  content: HTMLElement;
  choices: HTMLElement;
  next: HTMLElement;
  // rolling dice
  diceButtons: HTMLElement[];
  diceElements: Dice[];
}

export const createEventModal = (
  gameEventState: GameEventState
): EventModal => {
  const root = createElement(DIV, {
    id: 'event-modal',
    class: 'modal',
  });

  const content = createElement(DIV, {
    class: 'event-content btext',
  });

  const choices = createElement(DIV, {
    class: 'event-next',
  });

  const next = createElement(DIV, {
    class: 'event-next',
  });

  const obj = {
    root,
    content,
    choices,
    next,
    diceButtons: [],
    diceElements: [],
  };

  eventModalAddTitle(obj, gameEventState);

  // appendChild(root, obj.title);
  appendChild(content, obj.choices);
  appendChild(content, obj.next);
  appendChild(root, obj.content);

  return obj;
};

export const eventModalAddTitle = (
  eventModal: EventModal,
  gameEventState: GameEventState
) => {
  const { content } = eventModal;
  let icon = gameEventState.event.icon;
  if (icon === '🐈‍⬛') {
    icon = ICON_CAT;
  }
  if (icon) {
    const titleIcon = createElement(DIV, {
      class: 'event-title-icon',
      [INNER_HTML]: icon,
    });
    appendChild(content, titleIcon);
  }
  if (gameEventState.event.title) {
    const titleText = createElement(P, {
      class: 'event-title-text',
      [INNER_HTML]: gameEventState.event.title,
    });
    appendChild(content, titleText);
  }
};

const eventModalAddMod = (
  content: HTMLElement,
  modifyResource: { amt: number; resource: ResourceType }
) => {
  const resourceText = gameEventReplaceEnumWithIcons(
    modifyResource.resource,
    COLOR_HIGHLIGHT_DARK_TEXT
  );
  const isPositive = modifyResource.amt > 0;
  const amt = isNaN(modifyResource.amt) ? 'all' : modifyResource.amt;
  const amtText = isPositive ? '+' + amt : amt;
  const p2 = eventModalCreateButtonChosenText(`${amtText} ${resourceText}`);
  appendChild(content, p2);
};

export const eventModalAddChild = (
  eventModal: EventModal,
  gameEventChild: GameEventChild,
  gameEventState: GameEventState,
  state: GameState
) => {
  const { content, choices, next } = eventModal;
  const { event } = gameEventState;

  clearChildren(next);
  next.remove();
  clearChildren(choices);
  choices.remove();

  const pText = createElement(P, {
    [INNER_HTML]: gameEventChild.p,
  });
  appendChild(content, pText);

  if (gameEventChild.type === 'garden') {
    const garden = createGarden(state, gameEventState);
    appendChild(content, garden.root);
  }

  if (gameEventChild.rolls) {
    const isAny = gameEventChild.parsedRolls[0] === ResourceType.DICE_ANY;
    // const isDouble = gameStateGetResourceCount(state, ResourceType.EFFECT_DOUBLE) > 0;
    const isDouble = false;

    const p2 = createElement(P, {
      [INNER_HTML]: isAny ? 'Try it out!' : 'To pass: ',
    });
    appendChild(content, p2);
    for (const parsedRoll of gameEventChild.parsedRolls) {
      const p3 = createElement(SPAN, {
        [INNER_HTML]: Labels[parsedRoll].icon,
      });
      appendChild(p2, p3);
    }

    eventModal.diceElements = [];
    const diceToRoll = copyObject(state.magicDice);
    for (let i = 0; i < state.magicDice.length; i++) {
      const dice = createDice(state, diceToRoll[i]);
      eventModal.diceElements.push(dice);
      appendChild(content, dice.root);
    }

    eventModalAddDiceButtons(
      eventModal,
      gameEventChild,
      gameEventState,
      state,
      {
        isAny,
        diceToRoll,
      }
    );

    appendChild(content, next);
  }

  if (gameEventChild.parsedMod) {
    for (const modifyResource of gameEventChild.parsedMod) {
      eventModalAddMod(content, modifyResource);
    }
  }

  if (gameEventChild.n) {
    const button = createElement(BUTTON, {
      class: CLASS_BTN_TEXT,
      [INNER_HTML]: gameEventChild.n === 'e' ? 'Done' : 'Next',
    });
    domAddEventListener(button, EVENT_CLICK, () => {
      const child = gameEventGetChild(gameEventState, gameEventChild.n);
      gameEventRunChild(state, gameEventState, child);
    });
    appendChild(next, button);
    appendChild(content, next);
  }

  if (gameEventChild.choices) {
    if (gameEventChild.flex) {
      setStyle(choices, {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2px',
      });
    }

    for (const choice of gameEventChild.choices) {
      const isDisabled = !choice?.parsedCondition();
      const args: Record<string, string> = {
        class: CLASS_BTN_TEXT,
        [INNER_HTML]: choice.text,
      };
      if (isDisabled) {
        args.disabled = 'disabled';
      }
      const button = createElement(BUTTON, args);
      if (gameEventChild.flex) {
        setAttribute(
          button,
          'class',
          CLASS_BTN_TEXT + ' ' + 'event-choice-flex'
        );
        setStyle(button, {
          width: '49%',
          textDecoration: 'none',
        });
      }
      domAddEventListener(button, EVENT_CLICK, () => {
        const p2 = eventModalCreateButtonChosenText(choice.text);
        appendChild(content, p2);
        const child = gameEventGetChild(gameEventState, choice.n);
        gameEventRunChild(state, gameEventState, child);
      });
      appendChild(choices, button);
    }
    appendChild(content, choices);
  }

  eventModalScrollToBottom(eventModal, !gameEventChild.fastScroll);
};

export const eventModalScrollToBottom = (eventModal: EventModal, smooth: boolean = true) => {
  eventModal.content.scrollTo({
    top: eventModal.content.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

const eventModalHandleRollClick = async (
  eventModal: EventModal,
  gameEventState: GameEventState,
  state: GameState,
  gameEventChild: GameEventChild,
  args: {
    diceToRoll: DiceWithFaces[];
    isAny: boolean;
    useLuck: boolean;
    useDouble: boolean;
    usePower: boolean;
    useEmpathy: boolean;
  }
) => {
  const { content, diceButtons, diceElements } = eventModal;
  for (let i = 0; i < diceButtons.length; i++) {
    const button = diceButtons[i];
    // if (i === 0) {
    //   setStyle(button, {
    //     visibility: 'hidden',
    //   });
    // } else {
    //   button.remove();
    // }
    (button as HTMLButtonElement).disabled = true;
  }

  const diceToRoll = args.diceToRoll.slice();

  const diceResults = await gameRollDiceUi(
    diceToRoll.map((d, i) => ({
      dice: d,
      elem: diceElements[i],
    })),
    gameEventChild.parsedRolls,
    args.useLuck
  );
  let didPass = true;
  for (const roll of gameEventChild.parsedRolls) {
    const ind = diceResults.indexOf(roll);
    if (ind === -1) {
      didPass = false;
      break;
    }
    diceResults.splice(ind, 1);
  }

  timeoutPromise(1000).then(() => {
    const p = createElement(P, {
      [INNER_HTML]: args.isAny ? '' : didPass ? 'Pass!' : 'Fail!',
    });
    appendChild(content, p);

    if (args.useLuck) {
      gameStateModifyResource(state, ResourceType.POT_LIQ, -1);
      eventModalAddMod(content, {
        amt: -1,
        resource: ResourceType.POT_LIQ,
      });
    }
    if (args.usePower) {
      eventModalAddMod(content, {
        amt: -1,
        resource: ResourceType.POT_POW,
      });
    }
    if (args.useEmpathy) {
      eventModalAddMod(content, {
        amt: -1,
        resource: ResourceType.POT_EMP,
      });
    }
    for (let i = 0; i < diceButtons.length; i++) {
      const button = diceButtons[i];
      // if (i === 0) {
      //   setStyle(button, {
      //     visibility: 'hidden',
      //   });
      // } else {
      //   button.remove();
      // }
      button.remove();
    }
    const child = gameEventGetChild(
      gameEventState,
      didPass ? gameEventChild.pass : gameEventChild.fail
    );
    gameEventRunChild(state, gameEventState, child);
  });
};

const eventModalAddDiceButtons = (
  eventModal: EventModal,
  gameEventChild: GameEventChild,
  gameEventState: GameEventState,
  state: GameState,
  args: {
    isAny: boolean;
    diceToRoll: DiceWithFaces[];
  }
) => {
  const eventFuncArgs = {
    isAny: args.isAny,
    useLuck: false,
    useDouble: false,
    usePower: false,
    useEmpathy: false,
    diceToRoll: args.diceToRoll,
  };
  eventModal.diceButtons = [];
  const { next, content } = eventModal;

  const button = createElement(BUTTON, {
    class: CLASS_BTN_TEXT,
    [INNER_HTML]: 'Roll.',
  });
  domAddEventListener(button, EVENT_CLICK, () => {
    eventModalHandleRollClick(
      eventModal,
      gameEventState,
      state,
      gameEventChild,
      eventFuncArgs
    );
  });
  appendChild(next, button);
  eventModal.diceButtons.push(button);

  const luckPotionCount = gameStateGetResourceCount(
    state,
    ResourceType.POT_LIQ
  );
  const powerPotionCount = gameStateGetResourceCount(
    state,
    ResourceType.POT_POW
  );
  const empathyPotionCount = gameStateGetResourceCount(
    state,
    ResourceType.POT_EMP
  );

  if (!args.isAny) {
    if (luckPotionCount > 0) {
      const luckPotionLabel = Labels[ResourceType.POT_LIQ];
      const luckBtnText = `Use a ${luckPotionLabel.l}${luckPotionLabel.icon}${BR}(all rolls meet reqs).`;
      const luckButton = createElement(BUTTON, {
        class: CLASS_BTN_TEXT,
        [INNER_HTML]: luckBtnText,
      });
      domAddEventListener(luckButton, EVENT_CLICK, () => {
        eventModalHandleRollClick(
          eventModal,
          gameEventState,
          state,
          gameEventChild,
          {
            ...eventFuncArgs,
            useLuck: true,
          }
        );
      });
      appendChild(next, luckButton);
      eventModal.diceButtons.push(luckButton);
    }
    if (powerPotionCount > 0) {
      const powerBtnText = `Use a ${highlightResource(
        ResourceType.POT_POW,
        COLOR_HIGHLIGHT_DARK_TEXT
      )}${BR}(1 additional dice).`;
      const powerButton = createElement(BUTTON, {
        class: CLASS_BTN_TEXT,
        [INNER_HTML]: powerBtnText,
      });

      domAddEventListener(powerButton, EVENT_CLICK, () => {
        (powerButton as HTMLButtonElement).disabled = true;
        const d = createPowerDice();
        const dice = createDice(state, d, '✨');
        eventModal.diceElements.push(dice);
        eventModal.content.insertBefore(dice.root, eventModal.next);
        eventFuncArgs.diceToRoll.push(d);
        gameStateModifyResource(state, ResourceType.POT_POW, -1);
        eventFuncArgs.usePower = true;
      });
      appendChild(next, powerButton);
      eventModal.diceButtons.push(powerButton);
    }
    if (empathyPotionCount > 0) {
      const growMagicDiceHl = highlightResource(
        ResourceType.DICE_GRO,
        COLOR_HIGHLIGHT_DARK_TEXT
      );
      const heartMagicDiceHl = highlightResource(
        ResourceType.DICE_HEA,
        COLOR_HIGHLIGHT_DARK_TEXT
      );
      const empathyBtnText = `Use a ${highlightResource(
        ResourceType.POT_EMP,
        COLOR_HIGHLIGHT_DARK_TEXT
      )}<br>(tmp convert ${growMagicDiceHl} to ${heartMagicDiceHl}).`;
      const empathyButton = createElement(BUTTON, {
        class: CLASS_BTN_TEXT,
        [INNER_HTML]: empathyBtnText,
      });
      domAddEventListener(empathyButton, EVENT_CLICK, () => {
        (empathyButton as HTMLButtonElement).disabled = true;
        gameStateModifyResource(state, ResourceType.POT_EMP, -1);
        for (let i = 0; i < eventFuncArgs.diceToRoll.length; i++) {
          const dice = eventFuncArgs.diceToRoll[i];
          for (let j = 0; j < dice.length; j++) {
            const face = dice[j];
            if (face === ResourceType.DICE_GRO) {
              dice[j] = ResourceType.DICE_HEA;
            }
          }
        }
        for (let i = 0; i < eventModal.diceElements.length; i++) {
          const dice = eventModal.diceElements[i];
          dice.subRoot[INNER_HTML] = ICON_HEART_MAGIC;
        }
        eventFuncArgs.useEmpathy = true;
      });
      appendChild(next, empathyButton);
      eventModal.diceButtons.push(empathyButton);
    }
  }
};

export const eventModalCreateButtonChosenText = (text: string) => {
  const p = createElement(P, {
    [INNER_HTML]: text,
    class: 'event-chosen-text wtext',
  });
  return p;
};
