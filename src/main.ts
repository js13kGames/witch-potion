import { appendChild, getGameRoot } from './dom';
import { runEvent } from './eventRunner';
import { ResourceType } from './eventTypes';
import { gameSetupEvents } from './game';

import { createGameState } from './state';
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
import { parseEvents } from './eventParser';

addEventListener('load', async () => {
  const gameState = createGameState();
  (window as any).state = gameState;
  const calendar = createCalendar(31);
  appendChild(getGameRoot(), calendar.root);
  gameState.ui.calendar = calendar;

  const primaryResources = createPrimaryResources();
  gameState.ui.res = primaryResources;
  appendChild(getGameRoot(), primaryResources.root);
  setPrimaryResources(primaryResources, gameState);

  const hoverDescription = createHoverDescription();
  appendChild(getGameRoot(), hoverDescription.root);
  hoverDescriptionDescribe(hoverDescription, ResourceType.DICE_FIR);
  gameState.ui.hoverDescription = hoverDescription;

  const bottomBar = createBottomBar();
  appendChild(getGameRoot(), bottomBar.root);
  gameState.ui.favorMeter = bottomBar.favorMeter;

  const eventsTxt = await fetch('/events.wpe').then(r => r.text());
  gameSetupEvents(gameState, parseEvents(eventsTxt.replaceAll('\\n', '<br>')));
  // gameSetupEvents(gameState, events as any);
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
    // gameState.res.push(ResourceType.POT_ANT);
    // gameState.res.push(ResourceType.GOLD);
    // gameState.res.push(ResourceType.REAG_SKY);
    // gameState.res.push(ResourceType.REAG_SUN);
    // gameState.res.push(ResourceType.HERB_SPE);
    // gameState.res.push(ResourceType.HERB_BRA);
    // gameState.res.push(ResourceType.HERB_SPA);
    // gameState.res.push(ResourceType.POT_DRA);
  }
  // gameState.magicDice[0][0] = ResourceType.DICE_CUR;

  // gameState.magicDice.push(
  //   createMagicDiceWithDoubleFaceAndBlank(ResourceType.DICE_FIR)
  // );

  runEvent(gameState, gameState.events[0]);
  // runEvent(gameState, gameState.events.find(e => e.title.includes('You Have a Cold'))!);
  // runEvent(gameState, gameState.events.find(e => e.title.includes('Gnome'))!);

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
