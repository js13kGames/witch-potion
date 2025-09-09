import { appendChild, getGameRoot } from './dom';
import { parseEvents } from './eventParser';
import { runEvent } from './eventRunner';
import { ResourceType } from './eventTypes';
import { gameSetupEvents } from './game';



import {
  createGameState,
} from './state';
import { createBottomBar } from './ui/BottomBar';
import { calendarSetDay, createCalendar } from './ui/Calendar';
import {
  createHoverDescription,
  hoverDescriptionDescribe,
} from './ui/HoverDescription';
import {
  createPrimaryResources,
  setPrimaryResources,
} from './ui/PrimaryResources';

const eventString = `
#You Have a Cold,🤧
@A=1 POT_COLD_CURE
@B=ING(1 POT_COLD_CURE)
@C=1 FAVOR_CAT
@D=HERB1(1)
>0,choice
  +p: You feel groggy and sick this morning, and it's a struggle to get out of bed.
  +c: 1|You're not feeling well, and simply cannot be a proper witch today.
  +c: 2|Drink @A.|HAS(@A)
  +c: 3|Mix @A and drink it.|HAS_I(@A)
>1,modify
  +p: You should feel better soon, but not today.
  +add:1 EFFECT_COLD
>2,modify
  +p: You drink @A and feel better.<br><br>...A lot better in fact!  You feel like you can harvest extra today!
  +rem: @A
  +rem: 1 HERB_BRAMBLEBERRY|1 HERB_SPARKLEWEED|1 HERB_SPECIALPETAL
  +add: EFFECT_GREEN_THUMB
  +add: @C|@D
  +n: e
>3,modify
  +p: You mix @A and drink it.<br><br>You feel better.<br><br>...A lot better in fact!  You feel like you can harvest extra today!
  +rem: @B
  +add: EFFECT_GREEN_THUMB
  +n: e
`;

addEventListener('load', async () => {
  const gameState = createGameState();
  (window as any).state = gameState;
  const calendar = createCalendar(30);
  appendChild(getGameRoot(), calendar.root);
  gameState.ui.calendar = calendar;

  const primaryResources = createPrimaryResources();
  gameState.ui.res = primaryResources;
  appendChild(getGameRoot(), primaryResources.root);
  setPrimaryResources(primaryResources, gameState);

  // const nextBar = createNextBar();
  // gameState.ui.nextBar = nextBar;
  // appendChild(getGameRoot(), nextBar.root);
  // nextBarSetButtonState(nextBar, gameState);

  // const garden = createGarden();
  // gameState.ui.garden = garden;
  // appendChild(getGameRoot(), garden.root);
  // setGardenSlots(garden, gameState);
  // setGardenSlots(garden, gameState);
  // updateBlueprintList(garden, gameState);

  const hoverDescription = createHoverDescription();
  appendChild(getGameRoot(), hoverDescription.root);
  hoverDescriptionDescribe(hoverDescription, ResourceType.DICE_FIR);
  gameState.ui.hoverDescription = hoverDescription;

  const bottomBar = createBottomBar();
  appendChild(getGameRoot(), bottomBar.root);
  gameState.ui.favorMeter = bottomBar.favorMeter;

  const eventsTxt = await fetch('/events.wpe').then(r => r.text());
  gameSetupEvents(gameState, parseEvents(eventsTxt.replaceAll('\\n', '<br>')));
  // const gameEvents2 = parseEvents(eventString);
  // console.log('parsed events',copyObject(gameEvents));
  console.log('game events', gameState.events);
  gameState.day = 0;
  calendarSetDay(gameState.ui.calendar, 0);

  // gameState.res.push(
  //   ResourceType.POT_GRO,
  //   ResourceType.POT_POW,
  //   ResourceType.POT_EMP
  // );
  for (let i = 0; i < 3; i++) {
    gameState.res.push(ResourceType.FAV_CAT);
    // gameState.res.push(ResourceType.POT_GRO);
    // gameState.res.push(ResourceType.GOLD);
    // gameState.res.push(ResourceType.REAG_SKY);
    // gameState.res.push(ResourceType.REAG_SUN);
    // gameState.res.push(ResourceType.HERB_SPE);
    // gameState.res.push(ResourceType.HERB_BRA);
    // gameState.res.push(ResourceType.HERB_SPA);
    // gameState.res.push(ResourceType.POT_DRA);
  }

  // gameState.magicDice.push(
  //   createMagicDiceWithDoubleFaceAndBlank(ResourceType.DICE_FIR)
  // );

  runEvent(gameState, gameState.events[0]);
  // runEvent(gameState, gameState.events.find(e => e.title.includes('You Have a Cold'))!);
  // runEvent(gameState, gameState.events.find(e => e.title.includes('Villager Contract'))!);

  // debug default event state
  // const newEventState = copyObject(defaultEventState);
  // gameCreateMerchantEvents(gameState, newEventState);
  // gameCreateBrewingEvents(gameState, newEventState);
  // gameCreateViewInventoryEvents(gameState, newEventState);
  // let modal = gameState.ui.eventModal;
  // if (!modal) {
  //   modal = createEventModal(newEventState);
  //   appendChild(getGameRoot(), modal.root);
  // }
  // gameState.ui.eventModal = modal;
  // console.log('run event', newEventState.event);
  // gameEventRunChild(gameState, newEventState, newEventState.event.children[1]);
});
