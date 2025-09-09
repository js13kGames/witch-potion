import {
  type GameEvent,
  type GameEventChild,
  type GameEventChoice,
} from './eventTypes';
import { splitDelimTrim } from './utils';

export const ARG_DELIMITER = '|';
export const CONDITION_DELIMITER = ',';

export const startsWith = (line: string, prefix: string) => {
  return line.startsWith(prefix);
};

// Context type to hold parsing state
type ParseContext = {
  lines: string[];
  currentLine: number;
};

function parseMultipleEvents(eventsString: string): GameEvent[] {
  const events: GameEvent[] = [];

  const lines = eventsString.trim().split('\n');
  let currentEventLines: string[] = [];

  const _parseEvent = (eventString: string) => {
    try {
      const event = parseEventString(eventString);
      events.push(event);
    } catch (error) {
      console.warn('Failed to parse last event:', error);
    }
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (startsWith(trimmedLine, '#') && currentEventLines.length > 0) {
      const currentEventString = currentEventLines.join('\n');
      _parseEvent(currentEventString);
      currentEventLines = [trimmedLine];
    } else {
      currentEventLines.push(trimmedLine);
    }
  }

  if (currentEventLines.length > 0) {
    const lastEventString = currentEventLines.join('\n');
    _parseEvent(lastEventString);
  }

  return events;
}

function parseEventString(eventString: string): GameEvent {
  const context: ParseContext = {
    lines: splitDelimTrim(eventString.trim(), '\n').filter(
      line => line.length > 0
    ),
    currentLine: 0
  };

  const headerLine = context.lines[context.currentLine];
  if (!startsWith(headerLine, '#')) {
    throw new Error('Event must start with # followed by title and icon');
  }

  const headerMatch = headerLine.match(/^#(.+?),(.+)$/);
  if (!headerMatch) {
    throw new Error('Invalid header format. Expected: #Title,icon_name');
  }

  const title = headerMatch[1].trim();
  const icon = headerMatch[2].trim();
  context.currentLine++;

  const children: GameEventChild[] = [];
  const event: GameEvent = {
    title,
    icon,
    children,
    vars: {},
  };
  while (context.currentLine < context.lines.length) {
    const child = parseChild(context, event);
    if (child) {
      children.push(child);
    }
  }

  return event;
}

function parseChild(context: ParseContext, event: GameEvent): GameEventChild | null {
  if (context.currentLine >= context.lines.length) {
    return null;
  }

  const line = context.lines[context.currentLine];

  if (startsWith(line, '@')) {
    const varMatch = line.match(/^(@.+)=(.+)$/);
    if (!varMatch) {
      throw new Error(`Invalid variable format: ${line}`);
    }
    const varName = varMatch[1].trim();
    const varValue = varMatch[2].trim();
    event.vars[varName] = {
      str: varValue,
      parsed: undefined,
    };
    context.currentLine++;
    return null;
  }

  if (!startsWith(line, '>')) {
    context.currentLine++;
    return null;
  }

  const childMatch = line.match(/^>([\d\w]+|[a-z]),(\w+):?$/);
  if (!childMatch) {
    throw new Error(
      `Invalid child format at line ${context.currentLine + 1}: ${line}`
    );
  }

  const id = childMatch[1];
  const type = childMatch[2] as 'ch' | 'roll' | 'end' | 'm' | 'd';
  context.currentLine++;

  const child: GameEventChild = { id, type };

  while (context.currentLine < context.lines.length) {
    const contentLine = context.lines[context.currentLine];

    if (startsWith(contentLine, '>')) {
      break;
    }

    if (startsWith(contentLine, '+p:')) {
      const text = contentLine.slice(3).trim();
      child.p = text;
    } else if (startsWith(contentLine, '+c:')) {
      if (child.type !== 'ch') {
        throw new Error(`Cannot add choice to non-choice child: ${child.id}`);
      }
      if (!child.choices) {
        child.choices = [];
      }
      const text = contentLine;
      const choice = parseChoice(text);
      child.choices.push(choice);
    } else if (startsWith(contentLine, '+d:')) {
      if (!child.rolls) {
        child.rolls = [];
      }
      const dice = parseDice(contentLine);
      child.rolls.push(...dice);
    } else if (startsWith(contentLine, '+pass:')) {
      const passNode = contentLine.slice(6).trim();
      child.pass = passNode;
    } else if (startsWith(contentLine, '+fail:')) {
      const failNode = contentLine.slice(6).trim();
      child.fail = failNode;
    } else if (
      startsWith(contentLine, '+add:') ||
      startsWith(contentLine, '+rem:')
    ) {
      if (!child.mod) {
        child.mod = [];
      }
      const resources = parseResources(contentLine);
      child.mod.push(...resources);
    } else if (startsWith(contentLine, '+n:')) {
      if (child.type === 'ch') {
        console.error(child, contentLine);
        throw new Error(`Cannot add next to choice child: ${child.id}`);
      }
      child.n = contentLine.slice(3).trim();
    }

    context.currentLine++;
  }

  return child;
}

function parseChoice(choiceLine: string): GameEventChoice {
  const [n, text, conditionText] = splitDelimTrim(
    choiceLine.slice(3),
    ARG_DELIMITER
  );

  return {
    text,
    conditionText,
    n,
  };
}

function parseDice(diceLine: string): string[] {
  const diceMatch = diceLine.match(/^\+d:(.+)$/);
  if (!diceMatch) {
    throw new Error(`Invalid dice format: ${diceLine}`);
  }

  const dicePart = diceMatch[1].trim();
  const diceStrings = splitDelimTrim(dicePart, ARG_DELIMITER);
  const rolls: string[] = [];

  for (const diceString of diceStrings) {
    const diceMatch = diceString.match(/^(.*)$/);
    if (!diceMatch) {
      throw new Error(`Invalid dice format string: ${diceString}`);
    }
    const resourceText = diceMatch[1];
    rolls.push(resourceText);
  }

  return rolls;
}

function parseResources(resourceLine: string): string[] {
  const isAdd = startsWith(resourceLine, '+add:');
  const isRemove = startsWith(resourceLine, '+rem:');

  if (!isAdd && !isRemove) {
    throw new Error(`Invalid resource line: ${resourceLine}`);
  }

  const resourcePart = resourceLine.slice(isAdd ? 5 : 6).trim();

  const resourceStrings = splitDelimTrim(resourcePart, ARG_DELIMITER);
  const resources: string[] = [];

  for (const resourceString of resourceStrings) {
    const resourceMatch = resourceString.match(/^(.*)$/);
    // console.log('MATCH RESOURCE STRING', resourceString, resourceMatch);
    if (!resourceMatch) {
      throw new Error(`Invalid resource format: ${resourceString}`);
    }

    const resourceText = resourceMatch[1];

    resources.push(isRemove ? '-' + resourceText : resourceText);
  }

  return resources;
}

// Helper function to parse an event string
export function parseEvent(eventString: string): GameEvent {
  return parseEventString(eventString);
}

// Helper function to parse multiple events from a string
export function parseEvents(eventsString: string): GameEvent[] {
  return parseMultipleEvents(eventsString);
}
