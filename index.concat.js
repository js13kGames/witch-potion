let defaultEventState = {
    /*@preserve*/
    event: {
        /*@preserve*/
        icon: '',
        /*@preserve*/
        title: '',
        /*@preserve*/
        children: [
            {
                /*@preserve*/
                id: 'harvest',
                /*@preserve*/
                type: 'garden',
                /*@preserve*/
                p: 'You may now harvest your garden.',
            },
            {
                /*@preserve*/
                re: true,
                /*@preserve*/
                id: 'day',
                /*@preserve*/
                type: 'ch',
                /*@preserve*/
                p: 'You are at your shop. What would you like to do today?',
                /*@preserve*/
                choices: [
                    {
                        /*@preserve*/
                        text: 'Visit the reagent merchant.',
                        /*@preserve*/
                        n: 'merch',
                    },
                    {
                        /*@preserve*/
                        text: 'Mix potions.',
                        /*@preserve*/
                        n: 'pot',
                    },
                    {
                        /*@preserve*/
                        text: 'View inventory.',
                        /*@preserve*/
                        n: 'inv',
                    },
                    {
                        /*@preserve*/
                        text: 'End the day.',
                        /*@preserve*/
                        n: 'nextDay',
                    },
                ],
            },
            {
                /*@preserve*/
                id: 'nextDay',
                /*@preserve*/
                type: 'end',
            },
            // {
            //   /*@preserve*/
            //   id: 'merch',
            //   /*@preserve*/
            //   type: 'choice',
            //   /*@preserve*/
            //   p: '"Buying or selling?" the merchant asks.',
            //   /*@preserve*/
            //   choices: [
            //     {
            //       /*@preserve*/
            //       text: 'Buying.',
            //       /*@preserve*/
            //       n: 'merchBuying',
            //     },
            //     {
            //       /*@preserve*/
            //       text: 'Selling.',
            //       /*@preserve*/
            //       n: 'merchSelling',
            //     },
            //     {
            //       /*@preserve*/
            //       text: 'Go back.',
            //       /*@preserve*/
            //       n: 'day',
            //     },
            //   ],
            // },
        ],
    },
    /*@preserve*/
    evalVars: {},
    /*@preserve*/
    currentChildId: 'default',
};
let DIV = 'div';
let BUTTON = 'button';
let P = 'p';
let SPAN = 'span';
let BR = '<br>';
let TRANSITION = 'transition';
let TRANSFORM = 'transform';
let INNER_HTML = 'innerHTML';
let EVENT_CLICK = 'click';
let EVENT_MOUSE_OVER = 'mouseover';
let EVENT_DRAG_START = 'dragstart';
let EVENT_DRAG_END = 'dragend';
let EVENT_DRAG_OVER = 'dragover';
let EVENT_DRAG_LEAVE = 'dragleave';
let EVENT_DROP = 'drop';
let DRAGGABLE = 'draggable';
let getDocumentBody = () => {
    return document.body;
};
let getGameRoot = () => {
    return getElementById('game');
};
let setStyle = (element, styles) => {
    for (let k in styles) {
        element.style[k] = styles[k];
    }
};
let createElement = (tag, attributes = {}, children = []) => {
    let element = document.createElement(tag);
    for (let k in attributes) {
        if (k === INNER_HTML) {
            element.innerHTML = attributes[k];
        }
        else {
            element.setAttribute(k, attributes[k]);
        }
    }
    for (let child of children) {
        element.appendChild(child);
    }
    return element;
};
let appendChild = (parent, child) => {
    parent.appendChild(child);
};
let prependChild = (parent, child) => {
    parent.prepend(child);
};
let removeChild = (parent, child) => {
    parent.removeChild(child);
};
let clearChildren = (parent) => {
    parent[INNER_HTML] = '';
};
let getElementById = (id) => {
    return document.getElementById(id);
};
let getElementsByClassName = (className) => {
    return document.getElementsByClassName(className);
};
let domAddEventListener = (element, event, listener) => {
    element.addEventListener(event, listener);
};
let domRemoveEventListener = (element, event, listener) => {
    element.removeEventListener(event, listener);
};
let setAttribute = (element, attribute, value) => {
    element.setAttribute(attribute, value);
};
let removeAttribute = (element, attribute) => {
    element.removeAttribute(attribute);
};
let hasAttribute = (element, attribute) => {
    return element.hasAttribute(attribute);
};
let preventDefault = (event) => {
    event.preventDefault();
};
let nextTick = (callback) => {
    timeoutPromise(1).then(callback);
};
let timeoutPromise = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
function copyObject(obj) {
    return structuredClone(obj);
}
let ARG_DELIMITER = '|';
let CONDITION_DELIMITER = ',';
let startsWith = (line, prefix) => {
    return line.startsWith(prefix);
};
function parseMultipleEvents(eventsString) {
    let events = [];
    let lines = eventsString.trim().split('\n');
    let currentEventLines = [];
    let _parseEvent = (eventString) => {
        try {
            let event = parseEventString(eventString);
            events.push(event);
        }
        catch (error) {
            console.warn('Failed to parse last event:', error);
        }
    };
    for (let line of lines) {
        let trimmedLine = line.trim();
        if (startsWith(trimmedLine, '#') && currentEventLines.length > 0) {
            let currentEventString = currentEventLines.join('\n');
            _parseEvent(currentEventString);
            currentEventLines = [trimmedLine];
        }
        else {
            currentEventLines.push(trimmedLine);
        }
    }
    if (currentEventLines.length > 0) {
        let lastEventString = currentEventLines.join('\n');
        _parseEvent(lastEventString);
    }
    return events;
}
function parseEventString(eventString) {
    let context = {
        lines: splitDelimTrim(eventString.trim(), '\n').filter(line => line.length > 0),
        currentLine: 0
    };
    let headerLine = context.lines[context.currentLine];
    if (!startsWith(headerLine, '#')) {
        throw 1;
    }
    let headerMatch = headerLine.match(/^#(.+?),(.+)$/);
    if (!headerMatch) {
        throw 1;
    }
    let title = headerMatch[1].trim();
    let icon = headerMatch[2].trim();
    context.currentLine++;
    let children = [];
    let event = {
        title,
        icon,
        children,
        vars: {},
    };
    while (context.currentLine < context.lines.length) {
        let child = parseChild(context, event);
        if (child) {
            children.push(child);
        }
    }
    return event;
}
function parseChild(context, event) {
    if (context.currentLine >= context.lines.length) {
        return null;
    }
    let line = context.lines[context.currentLine];
    if (startsWith(line, '@')) {
        let varMatch = line.match(/^(@.+)=(.+)$/);
        if (!varMatch) {
            throw 1;
        }
        let varName = varMatch[1].trim();
        let varValue = varMatch[2].trim();
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
    let childMatch = line.match(/^>([\d\w]+|[a-z]),(\w+):?$/);
    if (!childMatch) {
        throw 1;
    }
    let id = childMatch[1];
    let type = childMatch[2];
    context.currentLine++;
    let child = { id, type };
    while (context.currentLine < context.lines.length) {
        let contentLine = context.lines[context.currentLine];
        if (startsWith(contentLine, '>')) {
            break;
        }
        if (startsWith(contentLine, '+p:')) {
            let text = contentLine.slice(3).trim();
            child.p = text;
        }
        else if (startsWith(contentLine, '+c:')) {
            if (child.type !== 'ch') {
                throw 1;
            }
            if (!child.choices) {
                child.choices = [];
            }
            let text = contentLine;
            let choice = parseChoice(text);
            child.choices.push(choice);
        }
        else if (startsWith(contentLine, '+d:')) {
            if (!child.rolls) {
                child.rolls = [];
            }
            let dice = parseDice(contentLine);
            child.rolls.push(...dice);
        }
        else if (startsWith(contentLine, '+pass:')) {
            let passNode = contentLine.slice(6).trim();
            child.pass = passNode;
        }
        else if (startsWith(contentLine, '+fail:')) {
            let failNode = contentLine.slice(6).trim();
            child.fail = failNode;
        }
        else if (startsWith(contentLine, '+add:') ||
            startsWith(contentLine, '+rem:')) {
            if (!child.mod) {
                child.mod = [];
            }
            let resources = parseResources(contentLine);
            child.mod.push(...resources);
        }
        else if (startsWith(contentLine, '+n:')) {
            if (child.type === 'ch') {
                console.error(child, contentLine);
                throw 1;
            }
            child.n = contentLine.slice(3).trim();
        }
        context.currentLine++;
    }
    return child;
}
function parseChoice(choiceLine) {
    let [n, text, conditionText] = splitDelimTrim(choiceLine.slice(3), ARG_DELIMITER);
    return {
        text,
        conditionText,
        n,
    };
}
function parseDice(diceLine) {
    let diceMatch = diceLine.match(/^\+d:(.+)$/);
    if (!diceMatch) {
        throw 1;
    }
    let dicePart = diceMatch[1].trim();
    let diceStrings = splitDelimTrim(dicePart, ARG_DELIMITER);
    let rolls = [];
    for (let diceString of diceStrings) {
        let diceMatch = diceString.match(/^(.*)$/);
        if (!diceMatch) {
            throw 1;
        }
        let resourceText = diceMatch[1];
        rolls.push(resourceText);
    }
    return rolls;
}
function parseResources(resourceLine) {
    let isAdd = startsWith(resourceLine, '+add:');
    let isRemove = startsWith(resourceLine, '+rem:');
    if (!isAdd && !isRemove) {
        throw 1;
    }
    let resourcePart = resourceLine.slice(isAdd ? 5 : 6).trim();
    let resourceStrings = splitDelimTrim(resourcePart, ARG_DELIMITER);
    let resources = [];
    for (let resourceString of resourceStrings) {
        let resourceMatch = resourceString.match(/^(.*)$/);
        // console.log('MATCH RESOURCE STRING', resourceString, resourceMatch);
        if (!resourceMatch) {
            throw 1;
        }
        let resourceText = resourceMatch[1];
        resources.push(isRemove ? '-' + resourceText : resourceText);
    }
    return resources;
}
// Helper function to parse an event string
function parseEvent(eventString) {
    return parseEventString(eventString);
}
// Helper function to parse multiple events from a string
function parseEvents(eventsString) {
    return parseMultipleEvents(eventsString);
}
let runEvent = (state, event) => {
    let eventState = createEventState(event);
    evaluateVars(state, eventState, event);
    replaceVars(state, eventState, event);
    let modal = state.ui.eventModal;
    if (!modal) {
        modal = createEventModal(eventState);
        appendChild(getGameRoot(), modal.root);
    }
    else {
        eventModalAddTitle(modal, eventState);
    }
    state.ui.eventModal = modal;
    console.log('run event', event);
    gameEventRunChild(state, eventState, gameEventGetChild(eventState, eventState.currentChildId));
};
let gameEventRunChild = (state, eventState, child) => {
    let modal = state.ui.eventModal;
    if (!modal) {
        throw 1;
    }
    if (child.type === 'end') {
        if (child.id === 'nextDay') {
            gameAdvanceDay(state);
        }
        else if (child.id === 'eIntro') {
            state.day = 0;
            gameAdvanceDay(state, 'Tomorrow you start your first day as a witch.');
            return;
        }
        else {
            // run default event
            let newEventState = copyObject(defaultEventState);
            gameCreateMerchantEvents(state, newEventState);
            gameCreateBrewingEvents(state, newEventState);
            gameCreateViewInventoryEvents(state, newEventState);
            gameCreateAntiCursePotionEvent(state, newEventState);
            if (state.day % 7 === 4) {
                appendChild(modal.content, createElement('p', {
                    [INNER_HTML]: `<${SPAN} style="color: brown;">You feel that the Black Cat will visit you tomorrow.</${SPAN}>`,
                }));
            }
            gameEventRunChild(state, newEventState, newEventState.event.children[0]);
        }
        return;
    }
    if (child.p) {
        child.p = gameEventReplaceEnumWithIcons(child.p, COLOR_HIGHLIGHT_DARK_TEXT);
    }
    if (child.choices) {
        for (let choice of child.choices) {
            choice.text = gameEventReplaceEnumWithIcons(choice.text, COLOR_HIGHLIGHT_DARK_TEXT);
            if (!choice.parsedCondition) {
                choice.parsedCondition = gameEventParseCondition(state, eventState, choice.conditionText);
            }
        }
    }
    if (child.rolls) {
        child.parsedRolls = [];
        for (let roll of child.rolls) {
            let [amt, resource] = parseAmountAndResource(roll);
            for (let i = 0; i < amt; i++) {
                child.parsedRolls.push(resource);
            }
        }
    }
    if (child.mod) {
        child.parsedMod = [];
        for (let modifyResource of child.mod) {
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
    }
    eventModalAddChild(modal, child, eventState, state);
    setPrimaryResources(state.ui.res, state);
    setFavorMeterPct(state.ui.favorMeter, gameStateGetResourceCount(state, ResourceType.FAV_CAT));
};
let gameEventGetChild = (eventState, childId) => {
    if (childId === 'e') {
        return {
            id: 'e',
            type: 'end',
        };
    }
    let child = eventState.event.children.find(child => child.id === childId);
    if (!child) {
        throw 1;
    }
    return child;
};
let createEventState = (event) => {
    return {
        event,
        currentChildId: event.children[0].id,
        evalVars: {},
    };
};
let gameEventParseResourceFunc2 = (text, func, args, state) => {
    // console.log('parse resource func', text, func, args);
    let _parseAmt = (amtText) => {
        if (amtText.includes('RAND')) {
            let spl = amtText.slice(4).split('_');
            let amtLower = parseInt(spl[0]);
            let amtUpper = parseInt(spl[1]);
            if (isNaN(amtLower) || isNaN(amtUpper)) {
                throw 1;
            }
            return randInRange(amtLower, amtUpper);
        }
        let amt = parseInt(amtText);
        if (isNaN(amt)) {
            throw 1;
        }
        return amt;
    };
    let _parseArgsForAmtFunc = (resList) => {
        let amt = _parseAmt(args[0]);
        let requireExist = args[1] === 'y';
        let resToReturn = [];
        while (resToReturn.length === 0 && amt > 0) {
            resToReturn = requireExist
                ? resList.filter(herb => gameStateHasResource(state, herb, amt))
                : resList;
            amt--;
        }
        if (resToReturn.length === 0) {
            console.log('No resources found for', func, args);
            // if (requireExist && ) {
            return [0, ResourceType.GOLD];
        }
        return [amt + 1, randInArray(resToReturn)];
    };
    let funcResults = {
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
            return _parseArgsForAmtFunc(POTION_NAMES.filter(p => p !== ResourceType.POT_LIQ));
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
            let [, resource] = parseAmountAndResource(args.join(' '));
            console.log('RES', args);
            let recipe = RECIPES[resource];
            let amounts = recipeToStringArr(recipe);
            return [18, amounts.join(ARG_DELIMITER)];
        },
    };
    let funcResult = funcResults[func];
    if (funcResult) {
        return funcResult();
    }
    throw 1;
};
let gameEventReplaceEnumWithIcons = (text, highlightColor) => {
    let result = text;
    // checking "has this function modified this text already?"
    if (text.includes('<span')) {
        return text;
    }
    // ResourceType -> enumName
    let obj = {};
    for (let [enumName, enumValue] of Object.entries(ResourceType)) {
        obj[enumValue] = enumName;
    }
    for (let [enumValue, enumName] of Object.entries(obj)) {
        let labelObj = Labels[enumValue];
        if (!labelObj) {
            throw 1;
        }
        let label = highlightText(labelObj.l, highlightColor);
        // if (DICE_NAMES.includes(enumValue as ResourceType)) {
        //   label = '';
        // }
        let replacement = `${label}${Labels[enumValue].icon}`;
        result = result.replaceAll(ResourceType[enumName], replacement);
    }
    text = text.replaceAll('Infinity', 'all');
    return result;
};
let gameEventParseCondition = (state, gameEventState, conditionString) => {
    if (!conditionString) {
        return () => true;
    }
    let arr = splitDelimTrim(conditionString, CONDITION_DELIMITER);
    let resFuncs = [];
    for (let i = 0; i < arr.length; i++) {
        let cond = arr[i];
        let _parseHasResource = (str) => {
            let arr = parseFunc(str, ConditionFunc.HAS_RES);
            if (!arr) {
                return;
            }
            let [amt, resource] = parseAmountAndResource(arr[1].join(' '));
            return () => {
                return gameStateHasResource(state, resource, amt);
            };
        };
        let _parseHasIngredients = (str) => {
            let arr = parseFunc(str, ConditionFunc.HAS_ING);
            if (!arr) {
                return;
            }
            let [, resource] = parseAmountAndResource(arr[1].join(' '));
            let recipe = RECIPES[resource];
            let amounts = recipeToStringArr(recipe);
            return () => {
                return amounts.every(a => {
                    let [_amt, resource] = parseAmountAndResource(a);
                    return gameStateHasResource(state, resource, _amt);
                });
            };
        };
        let hasResource = _parseHasResource(cond);
        if (hasResource) {
            resFuncs.push(hasResource);
        }
        let hasIngredients = _parseHasIngredients(cond);
        if (hasIngredients) {
            resFuncs.push(hasIngredients);
        }
    }
    if (resFuncs.length === 0) {
        throw 1;
    }
    return () => {
        return resFuncs.every(func => func());
    };
};
let replaceVarsInText = (text, evalVars) => {
    for (let [varName, varValue] of Object.entries(evalVars)) {
        text = text.replaceAll(varName, varValue);
    }
    return text;
};
let parseAmountAndResource = (text) => {
    let arr = text.split(' ');
    if (arr.length === 2) {
        let t = stringToResourceType(arr[1]);
        if (arr[0].includes('ALL')) {
            return [arr[0][0] === '-' ? -99 : 99, t];
        }
        return [parseInt(arr[0]), t];
    }
    return [1, ResourceType.GOLD];
};
let parseFunc = (text, expectedFunc) => {
    let match = text.match(new RegExp(`(${expectedFunc ?? '.*'})\\(([^)]*)\\)`));
    if (match) {
        let func = match[1];
        if (func[0] === '-') {
            func = func.slice(1);
        }
        let args = splitDelimTrim(match[2], ' ');
        return [func, args, match[0]];
    }
};
let evaluateVars = (state, eventState, event) => {
    for (let varName in event.vars) {
        let obj = event.vars[varName];
        if (obj.parsed) {
            continue;
        }
        let parsedFunc = parseFunc(obj.str);
        if (parsedFunc) {
            let existingParsed = eventState.evalVars[varName];
            if (existingParsed) {
                obj.parsed = existingParsed;
                continue;
            }
            let [func, args, fullMatch] = parsedFunc;
            let [amt, resourceName] = gameEventParseResourceFunc2(fullMatch, func, args, state);
            let str = amt + ' ' + resourceName;
            if (amt === 18) {
                str = resourceName;
            }
            obj.parsed = str;
            eventState.evalVars[varName] = str;
        }
        else {
            obj.parsed = obj.str;
            eventState.evalVars[varName] = obj.str;
        }
    }
};
let replaceVars = (state, eventState, event) => {
    for (let varName in event.vars) {
        let obj = event.vars[varName];
        if (obj.parsed.includes('@')) {
            obj.str = replaceVarsInText(obj.str, eventState.evalVars);
            delete eventState.evalVars[varName];
            delete obj.parsed;
        }
    }
    evaluateVars(state, eventState, event);
    for (let child of event.children) {
        if (child.p) {
            child.p = replaceVarsInText(child.p, eventState.evalVars);
        }
        if (child.choices) {
            for (let choice of child.choices) {
                choice.text = replaceVarsInText(choice.text, eventState.evalVars);
                if (choice.conditionText) {
                    choice.conditionText = replaceVarsInText(choice.conditionText, eventState.evalVars);
                }
            }
        }
        if (child.rolls) {
            for (let i = 0; i < child.rolls.length; i++) {
                let roll = child.rolls[i];
                child.rolls[i] = replaceVarsInText(roll, eventState.evalVars);
            }
        }
        if (child.mod) {
            let newMod = [];
            for (let i = 0; i < child.mod.length; i++) {
                let mod = child.mod[i];
                let result = replaceVarsInText(mod, eventState.evalVars);
                let arr = splitDelimTrim(result, ARG_DELIMITER);
                let isNegative = result[0] === '-';
                if (arr.length === 1) {
                    newMod.push(result);
                }
                else {
                    newMod.push(...arr.map((a, i) => (isNegative && i > 0 ? '-' + a : a)));
                }
            }
            child.mod = newMod;
        }
    }
};
var ResourceType;
(function (ResourceType) {
    ResourceType["GOLD"] = "GOLD";
    ResourceType["HERB_SPA"] = "HERB_SPARKLEWEED";
    ResourceType["HERB_BRA"] = "HERB_BRAMBLEBERRY";
    ResourceType["HERB_SPE"] = "HERB_SPECIALPETAL";
    ResourceType["REAG_SKY"] = "REAG_SKY_DUST";
    ResourceType["REAG_SUN"] = "REAG_SUN_POWDER";
    ResourceType["POT_COL"] = "POT_COLD_CURE";
    ResourceType["POT_DRA"] = "POT_DRAGON_SWEAT";
    ResourceType["POT_MIA"] = "POT_MIASMA_OF_MIDNIGHT";
    ResourceType["POT_TIN"] = "POT_TINCTURE_OF_TASTE";
    ResourceType["POT_EMP"] = "POT_EMPATHY";
    ResourceType["POT_GRO"] = "POT_GROWTH";
    ResourceType["POT_LIQ"] = "POT_LIQUID_LUCK";
    ResourceType["POT_POW"] = "POT_POWER_POTION";
    ResourceType["POT_ANT"] = "POT_ANTI_CURSE";
    ResourceType["DICE_FIR"] = "DICE_FIRE_MAGIC";
    ResourceType["DICE_HEA"] = "DICE_HEART_MAGIC";
    ResourceType["DICE_GRO"] = "DICE_GROW";
    ResourceType["DICE_CUR"] = "DICE_CURSE";
    ResourceType["DICE_BLA"] = "DICE_BLANK";
    ResourceType["DICE_ANY"] = "ANY";
    ResourceType["DICE_NEW"] = "DICE_NEW";
    ResourceType["BP_SPA"] = "BLUEPRINT_SPARKLEWEED";
    ResourceType["BP_BRA"] = "BLUEPRINT_BRAMBLEBERRY";
    ResourceType["BP_SPE"] = "BLUEPRINT_SPECIALPETAL";
    ResourceType["C_VIL"] = "CONTRACT_VILLAGER";
    ResourceType["FAV_CAT"] = "FAVOR_CAT";
    ResourceType["EFF_COL"] = "EFFECT_COLD";
    ResourceType["EFF_GRE"] = "EFFECT_GREEN_THUMB";
    ResourceType["EFF_FFIR"] = "EFFECT_FACE_ADD_FIRE";
    ResourceType["EFF_FHEA"] = "EFFECT_FACE_ADD_HEART";
    ResourceType["EFF_FGRO"] = "EFFECT_FACE_ADD_GROW";
    ResourceType["EFF_FCUR"] = "EFFECT_FACE_ADD_CURSE";
    ResourceType["EFF_RMCUR"] = "EFFECT_REMOVE_CURSE";
    ResourceType["EFF_REPLCUR"] = "EFFECT_REPLACE_CURSE";
})(ResourceType || (ResourceType = {}));
let DICE_NAMES = [
    ResourceType.DICE_FIR,
    ResourceType.DICE_HEA,
    ResourceType.DICE_GRO,
];
let HERB_NAMES = [
    ResourceType.HERB_SPA,
    ResourceType.HERB_BRA,
    ResourceType.HERB_SPE,
];
let HERB_TIER_1_NAMES = [ResourceType.HERB_SPA, ResourceType.HERB_BRA];
let HERB_TIER_2_NAMES = [ResourceType.HERB_SPE];
let REAGENT_NAMES = [ResourceType.REAG_SUN, ResourceType.REAG_SKY];
let REAGENT_TIER_1_NAMES = [ResourceType.REAG_SUN];
let REAGENT_TIER_2_NAMES = [ResourceType.REAG_SKY];
let POTION_NAMES = [
    ResourceType.POT_GRO,
    ResourceType.POT_POW,
    ResourceType.POT_LIQ,
    ResourceType.POT_COL,
    ResourceType.POT_DRA,
    ResourceType.POT_MIA,
    ResourceType.POT_TIN,
    ResourceType.POT_ANT,
];
let BLUEPRINT_NAMES = [
    ResourceType.BP_SPA,
    ResourceType.BP_BRA,
    ResourceType.BP_SPE,
];
let BUY_COSTS = {
    [ResourceType.REAG_SUN]: 2,
    [ResourceType.REAG_SKY]: 3,
};
let SELL_COSTS = {
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
let RECIPES = {
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
var ResourceTypeFunc;
(function (ResourceTypeFunc) {
    ResourceTypeFunc["FUNC_H1"] = "HERB1";
    ResourceTypeFunc["FUNC_H2"] = "HERB2";
    ResourceTypeFunc["FUNC_H3"] = "HERB3";
    ResourceTypeFunc["FUNC_H_ANY"] = "HERB";
    ResourceTypeFunc["FUNC_R1"] = "REAG1";
    ResourceTypeFunc["FUNC_R2"] = "REAG2";
    ResourceTypeFunc["FUNC_R_ANY"] = "REAG";
    ResourceTypeFunc["FUNC_P1"] = "POT1";
    ResourceTypeFunc["FUNC_P_ANY"] = "POT";
    ResourceTypeFunc["FUNC_G"] = "GOLD";
    ResourceTypeFunc["FUNC_FIRE"] = "FIRE";
    ResourceTypeFunc["FUNC_HEART"] = "HEART";
    ResourceTypeFunc["FUNC_GROW"] = "GROW";
    ResourceTypeFunc["FUNC_ING"] = "ING";
})(ResourceTypeFunc || (ResourceTypeFunc = {}));
var ConditionFunc;
(function (ConditionFunc) {
    ConditionFunc["HAS_RES"] = "HAS";
    ConditionFunc["HAS_ING"] = "HAS_I";
})(ConditionFunc || (ConditionFunc = {}));
function toGrayscale(icon) {
    return `<${SPAN} style="filter: grayscale(75%)">${icon}</${SPAN}>`;
}
function toHueRotate(icon, degrees) {
    return `<${SPAN} style="filter: hue-rotate(${degrees}deg)">${icon}</${SPAN}>`;
}
let ICON_GOLD = '💰';
let ICON_HERB = '🌿';
let ICON_REAGENT = '🧪';
let ICON_POTION = '🧴';
let ICON_FIRE_MAGIC = '🔥';
let ICON_HEART_MAGIC = '♥️';
let ICON_LUCK = '🍀';
let ICON_CAT = toGrayscale('🐈‍⬛');
let ICON_GROW = '🌱';
let ICON_CONTRACT = '📃';
let ICON_EXCLAMATION = '❗';
let ICON_KING = '👑';
let ICON_VILLAGER = '👨';
let ICON_DRAGON = '🐲';
let ICON_FELLA = '👾';
let ICON_FAIRY = '🧚🏿‍♀️';
let ICON_WITCH = '🧙🏿‍♀️';
let ICON_WEATHER = '🌤';
let ICON_DICE = '🎲';
let ICON_CURSE = '💀';
let ICON_BLANK = '✖️';
let ICON_COLD = '🤧';
let Labels = {
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
        dsc: 'More magic.',
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
        l: 'Cold',
        icon: ICON_COLD,
        dsc: 'You have a cold.',
    },
    [ResourceType.EFF_GRE]: {
        l: 'Green Thumbs',
        icon: ICON_GROW,
        dsc: 'Your thumbs are bright green.',
    },
    [ResourceType.EFF_FFIR]: {
        l: 'Fire Dice Face',
        icon: ICON_FIRE_MAGIC,
        dsc: `Gained a ${ICON_FIRE_MAGIC} face.`,
    },
    [ResourceType.EFF_FHEA]: {
        l: 'Heart Dice Face',
        icon: ICON_HEART_MAGIC,
        dsc: `Gained a ${ICON_HEART_MAGIC} face.`,
    },
    [ResourceType.EFF_FGRO]: {
        l: 'Grow Dice Face',
        icon: ICON_GROW,
        dsc: `Gained a ${ICON_GROW} face.`,
    },
    [ResourceType.EFF_FCUR]: {
        l: 'Curse Dice Face',
        icon: ICON_CURSE,
        dsc: `Gained a ${ICON_CURSE} face.`,
    },
    [ResourceType.EFF_RMCUR]: {
        l: 'Remove Curse',
        icon: ICON_CURSE,
        dsc: `Removed a curse.`,
    },
    [ResourceType.EFF_REPLCUR]: {
        l: 'Curse!',
        icon: ICON_CURSE,
        dsc: `A curse replaces a face.`,
    },
};
let recipeToStringArr = (recipe, includeLabels = false) => {
    let herbsAndReagents = [...HERB_NAMES, ...REAGENT_NAMES];
    let amounts = [];
    for (let potentialIngredient of herbsAndReagents) {
        let amt = recipe.filter(r => r === potentialIngredient).length;
        if (amt > 0) {
            if (includeLabels) {
                let labelObj = Labels[potentialIngredient];
                amounts.push(`${amt}${labelObj.l.slice(0, 3)}${labelObj.icon}`);
            }
            else {
                amounts.push(`${amt} ${potentialIngredient}`);
            }
        }
    }
    return amounts;
};
for (let key in Labels) {
    Labels[key].icon = `<${SPAN} class="icon">${Labels[key].icon}</${SPAN}>`;
}
for (let res of [...POTION_NAMES]) {
    let recipe = RECIPES[res];
    let recipeStr = recipeToStringArr(recipe, true);
    Labels[res].dsc += `${BR}<${SPAN} style="font-size: 14px">${recipeStr.join(',')}</${SPAN}>`;
}
let getResourceFromLabel = (label) => {
    let ind = label.lastIndexOf('>');
    if (ind > -1) {
        label = label.slice(ind + 1);
    }
    for (let key in Labels) {
        if (Labels[key].l.toLowerCase() === label.toLowerCase()) {
            return key;
        }
    }
};
let MONSTER_NAMES = [
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
let EXPULSION_EVENT;
let gameAdvanceDay = (state, msg) => {
    eventModalAddChild(state.ui.eventModal, {
        id: '1',
        type: 'm',
        p: msg ?? 'You close up your shop for the day.',
    }, {
        event: state.events[state.day],
        evalVars: {},
        currentChildId: '1',
    }, state);
    let moonAnim = createElement(P, {
        class: 'moon-anim',
    });
    appendChild(state.ui.eventModal.content, moonAnim);
    for (let i = 0; i < 1; i++) {
        appendChild(state.ui.eventModal.content, createElement('br'));
    }
    let phases = [...'🌕🌕🌕🌕🌖🌗🌘🌑🌒🌓🌔🌕🌕🌕🌕'];
    for (let i = 0; i < phases.length; i++) {
        timeoutPromise(i * 100).then(() => {
            moonAnim[INNER_HTML] = phases[i];
            eventModalScrollToBottom(state.ui.eventModal);
        });
    }
    state.day++;
    timeoutPromise(phases.length * 100).then(() => {
        moonAnim.remove();
        let sep = createElement(P, {
            [INNER_HTML]: '---<br>Day ' + state.day,
        });
        appendChild(state.ui.eventModal.content, sep);
        eventModalScrollToBottom(state.ui.eventModal);
        if (!msg) {
            calendarAdvanceDayForward(state.ui.calendar);
        }
        console.log('ADVANCE DAY', state.day, state.events[state.day]);
        let favorAmt = gameStateGetResourceCount(state, ResourceType.FAV_CAT);
        if (favorAmt === 0) {
            runEvent(state, EXPULSION_EVENT);
        }
        else {
            runEvent(state, state.events[state.day]);
        }
    });
};
let gameHarvest = (state, slots, multiplier = 1) => {
    console.log('HARVEST', state, slots, multiplier);
    let resourcesAdded = [];
    for (let slot of slots) {
        let numHarvestResults = slot.diceResults.filter(r => r === ResourceType.DICE_GRO).length;
        resourcesAdded.push(numHarvestResults * multiplier);
        for (let i = 0; i < numHarvestResults * multiplier; i++) {
            state.res.push(slot.resourceType);
        }
    }
    setPrimaryResources(state.ui.res, state);
    return resourcesAdded;
};
let gameGetDiceResult = (dice) => {
    return randInArray(dice);
};
let gameGetDiceResults = (diceList) => {
    let results = [];
    for (let dice of diceList) {
        results.push(gameGetDiceResult(dice));
    }
    return results;
};
let gameRollDiceUi = async (arr, reqs, luck = false) => {
    let results = [];
    let promises = [];
    let isCursed = false;
    let curseColor = 'orange';
    for (let d of arr) {
        let resultValue = luck ? reqs[0] : gameGetDiceResult(d.dice);
        promises.push(diceSpin(d.elem, resultValue, 600, 2).then(() => {
            let icon = Labels[resultValue].icon;
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
        }));
        await timeoutPromise(250);
        results.push(resultValue);
    }
    await Promise.all(promises);
    if (isCursed) {
        for (let d of arr) {
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
let gameSetupEvents = (state, events) => {
    let findEventByTitle = (title) => {
        return events.find(e => e.title === title);
    };
    let shuffleEvents = (events) => {
        return events.sort(() => Math.random() - 0.5);
    };
    let START_EVENT = findEventByTitle('The Game');
    let VILLAGER_CONTRACT_EVENT = findEventByTitle('Villager Contract');
    let BLACK_CAT_EVENT = findEventByTitle('The Black Cat');
    let DEMONIC_DEAL_EVENT = findEventByTitle('Demonic Deal');
    let ATTACK_EVENT = findEventByTitle('Attack!');
    let HERB_MERCHANT_EVENT = findEventByTitle('Herb Merchant');
    let FINAL_TEST_EVENT = findEventByTitle('The Final Test');
    let END_EVENT = findEventByTitle('True Witch');
    EXPULSION_EVENT = findEventByTitle('Expulsion');
    let templateEvents = [
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
    let eventsToShuffle = events.filter(e => !templateEvents.includes(e));
    let attackEvents = [];
    for (let i = 0; i < 7; i++) {
        let numFireToDefeat = i < 3 ? 1 : i < 6 ? 2 : 3;
        let monsterName = randInArray(MONSTER_NAMES);
        let attackEvent = copyObject(ATTACK_EVENT);
        for (let child of attackEvent.children) {
            child.p = child.p?.replace('monster', '<b>' + monsterName + '</b>');
        }
        attackEvent.vars['@A'] = {
            str: `FIRE(${numFireToDefeat})`,
            parsed: undefined,
        };
        eventsToShuffle.push(attackEvent);
        attackEvents.push(attackEvent);
    }
    for (let i = 0; i < 4; i++) {
        let herbMerchantEvent = copyObject(HERB_MERCHANT_EVENT);
        eventsToShuffle.push(herbMerchantEvent);
    }
    let diceFaceReplacements = [
        ResourceType.EFF_FFIR,
        ResourceType.EFF_FHEA,
        ResourceType.EFF_FGRO,
    ];
    let diceMagics = [
        ResourceType.DICE_FIR,
        ResourceType.DICE_HEA,
        ResourceType.DICE_GRO,
    ];
    for (let i = 0; i < 3; i++) {
        let demonicDealEvent = copyObject(DEMONIC_DEAL_EVENT);
        let effect = randInArray(diceFaceReplacements);
        let resourceForEffect = diceMagics[diceFaceReplacements.indexOf(effect)];
        demonicDealEvent.vars['@C'] = {
            str: '1 ' + effect,
            parsed: undefined,
        };
        demonicDealEvent.vars['@A1'] = {
            str: '1 ' + resourceForEffect,
            parsed: undefined,
        };
        eventsToShuffle.push(demonicDealEvent);
    }
    let orderedEvents = shuffleEvents(eventsToShuffle);
    let attackEventInd = 0;
    for (let i = 0; i < orderedEvents.length; i++) {
        if (orderedEvents[i].title === ATTACK_EVENT.title) {
            orderedEvents[i] = attackEvents[attackEventInd];
            attackEventInd++;
        }
    }
    for (let i = 0; i < 4; i++) {
        let contractEvent = copyObject(VILLAGER_CONTRACT_EVENT);
        orderedEvents.splice(i * 4 + randInRange(0, 6), 0, contractEvent);
    }
    for (let i = 0; i < 4; i++) {
        let blackCatEvent = createBlackCatEvent(BLACK_CAT_EVENT);
        orderedEvents.splice(i * 7 + 4, 0, blackCatEvent); // every Thursday
    }
    let startEventCopy = copyObject(START_EVENT);
    let continueChild = startEventCopy.children.slice(-2)[0];
    continueChild.mod = [
        '3 ' + ResourceType.GOLD,
        '1 ' + ResourceType.HERB_SPA,
        '1 ' + ResourceType.HERB_BRA,
        '1 ' + ResourceType.REAG_SKY,
        '1 ' + ResourceType.REAG_SUN,
        '1 ' + ResourceType.POT_LIQ,
    ];
    // let randomPotion = randInArray(POTION_NAMES);
    // continueChild.mod.push('1 ' + randomPotion);
    let finalEvents = [startEventCopy, ...orderedEvents].slice(0, 29);
    finalEvents.push(FINAL_TEST_EVENT, END_EVENT);
    console.log('SETUP EVENTS', startEventCopy, finalEvents);
    state.events = finalEvents;
};
let gameModifyResource = (state, gameEventState, child, resource, amt) => {
    let replaceDiceFace = (face1, face2) => {
        for (let dice of state.magicDice) {
            for (let i = 0; i < dice.length; i++) {
                if (dice[i] === face1) {
                    dice[i] = face2;
                    return true;
                }
            }
        }
        return false;
    };
    let replaceOrAddDiceFace = (face1, face2) => {
        if (replaceDiceFace(face1, face2)) {
            return;
        }
        if (face2 === ResourceType.DICE_CUR && face1 === ResourceType.DICE_BLA) {
            replaceDiceFace(face1, randInArray(DICE_NAMES));
        }
        else {
            let dice = createMagicDiceBlank();
            state.magicDice.push(dice);
            replaceDiceFace(face1, face2);
        }
    };
    console.log(' modifying', resource, amt);
    if (resource === ResourceType.C_VIL) {
        let contractReturnEvent = createContractReturnEvent(gameEventState.event);
        let eventInd = state.events.indexOf(gameEventState.event);
        state.events.splice(eventInd + 7, 0, contractReturnEvent.event);
    }
    else if (resource === ResourceType.DICE_NEW) {
        state.magicDice.push(createMagicDice());
    }
    else if (resource === ResourceType.EFF_RMCUR) {
        replaceOrAddDiceFace(ResourceType.DICE_CUR, ResourceType.DICE_BLA);
    }
    else if (resource === ResourceType.EFF_FFIR) {
        replaceOrAddDiceFace(ResourceType.DICE_BLA, ResourceType.DICE_FIR);
    }
    else if (resource === ResourceType.EFF_FHEA) {
        replaceOrAddDiceFace(ResourceType.DICE_BLA, ResourceType.DICE_HEA);
    }
    else if (resource === ResourceType.EFF_FGRO) {
        replaceOrAddDiceFace(ResourceType.DICE_BLA, ResourceType.DICE_GRO);
    }
    else if (resource === ResourceType.EFF_FCUR) {
        replaceOrAddDiceFace(ResourceType.DICE_BLA, ResourceType.DICE_CUR);
    }
    else if (resource === ResourceType.EFF_REPLCUR) {
        let diceTypes = [
            ResourceType.DICE_FIR,
            ResourceType.DICE_HEA,
            ResourceType.DICE_GRO,
        ];
        replaceOrAddDiceFace(randInArray(diceTypes), ResourceType.DICE_CUR);
    }
    else if (resource === ResourceType.EFF_COL) {
        // child.next = 'nextDay';
        timeoutPromise(1).then(() => {
            gameAdvanceDay(state, 'You take a day to rest and recover.');
        });
    }
    else {
        gameStateModifyResource(state, resource, amt);
        if (BLUEPRINT_NAMES.includes(resource)) {
            state.vars.avblBlueprints = state.vars.avblBlueprints.filter(blueprint => blueprint !== resource);
        }
    }
};
let gameCreateMerchantEvents = (state, eventState) => {
    let buyChoices = [];
    // let sellChoices: GameEventChoice[] = [];
    let buyCosts = { ...BUY_COSTS };
    // for (let res of state.vars.avblBlueprints) {
    //   buyCosts[res] = 10;
    // }
    // let sellCosts = {
    //   ...SELL_COSTS,
    // };
    for (let [res, cost] of Object.entries(buyCosts)) {
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
    for (let res of HERB_NAMES) {
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
    // for (let [res, cost] of Object.entries(sellCosts)) {
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
    eventState.event.children.push({
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
let gameCreateBrewingEvents = (state, eventState) => {
    let choices = [];
    let recipes = { ...RECIPES };
    for (let [res, recipe] of Object.entries(recipes)) {
        let amounts = recipeToStringArr(recipe);
        let numOwned = gameStateGetResourceCount(state, res);
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
let gameCreateViewInventoryEvents = (state, eventState) => {
    let resAndCounts = POTION_NAMES.map(res => ({
        res,
        count: gameStateGetResourceCount(state, res),
    }));
    eventState.event.children.push({
        /*@preserve*/
        id: 'inv',
        /*@preserve*/
        type: 'm',
        /*@preserve*/
        p: "Here's what you have:" +
            resAndCounts.map(r => ` ${BR}${r.res} (${r.count})`).join(''),
        /*@preserve*/
        n: 'day',
    });
};
let gameCreateAntiCursePotionEvent = (state, eventState) => {
    // if has a dice face with a curse on it
    if (state.magicDice.some(d => d.some(f => f === ResourceType.DICE_CUR))) {
        let dayEvent = eventState.event.children.find(ch => ch.id === 'day');
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
let createContractReturnEvent = (contractEvent) => {
    let potionName = contractEvent.vars['@A'].parsed;
    let eventState = createEventState({
        title: 'The villager returns',
        icon: '📜',
        children: [
            {
                id: '0',
                type: 'ch',
                p: 'The villager from last week returns to collect their promised potion:' +
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
let createBlackCatEvent = (originalBlackCatEvent) => {
    let event = copyObject(originalBlackCatEvent);
    let choiceChild = event.children.find(ch => ch.id === 'ch');
    let potentialRewards = [
        ResourceType.EFF_FFIR,
        ResourceType.EFF_FHEA,
        ResourceType.EFF_FGRO,
    ];
    let potentialChoices = [
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
    event.children.push({
        id: 'dice',
        type: 'm',
        p: "The Black Cat's eyes glow, and you feel a new power within you.",
        mod: [`1 ${randInArray(potentialRewards)}`],
        n: 'e',
    }, {
        id: 'bed',
        type: 'm',
        p: 'The cat blinks and you have a new seed bed.',
        mod: [`1 ${ResourceType.BP_SPE}`],
        n: 'e',
    });
    return event;
};
let eventString = `
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
    let gameState = createGameState();
    window.state = gameState;
    let calendar = createCalendar(30);
    appendChild(getGameRoot(), calendar.root);
    gameState.ui.calendar = calendar;
    let primaryResources = createPrimaryResources();
    gameState.ui.res = primaryResources;
    appendChild(getGameRoot(), primaryResources.root);
    setPrimaryResources(primaryResources, gameState);
    // let nextBar = createNextBar();
    // gameState.ui.nextBar = nextBar;
    // appendChild(getGameRoot(), nextBar.root);
    // nextBarSetButtonState(nextBar, gameState);
    // let garden = createGarden();
    // gameState.ui.garden = garden;
    // appendChild(getGameRoot(), garden.root);
    // setGardenSlots(garden, gameState);
    // setGardenSlots(garden, gameState);
    // updateBlueprintList(garden, gameState);
    let hoverDescription = createHoverDescription();
    appendChild(getGameRoot(), hoverDescription.root);
    hoverDescriptionDescribe(hoverDescription, ResourceType.DICE_FIR);
    gameState.ui.hoverDescription = hoverDescription;
    let bottomBar = createBottomBar();
    appendChild(getGameRoot(), bottomBar.root);
    gameState.ui.favorMeter = bottomBar.favorMeter;
    let eventsTxt = `#The Game,🐈‍⬛
>0,ch
  +p: "Hello, dear witch. I am your familiar, the Black Cat. It is from me that you get your magic. Ensure you keep me satisfied, lest you risk losing my favor."
  +c: 1|Continue.
  +c: 4|I already know what to do.
>1,d
  +p: "I have provided you with a magic dice. Hover over it to see its faces. There are three kinds of magic."\n\n- DICE_FIRE_MAGIC is for fending off your enemies.\n- DICE_HEART_MAGIC is for affecting people.\n- DICE_GROW is for growing your garden.
  +dice: 1 ANY
  +pass: 2
  +fail: 2
>2,m
  +p: "I am tasking you with running a potion shop: each day you will harvest magical herbs, mix potions, and deal with the many problems of the nearby villagers."\n\n- You get <b>Herbs</b> by growing them in your garden.\n- You get <b>Reagents</b> by buying them from a merchant.
  +n: 3
>3,m
  +p: "Run this shop for <b>1 month</b> and you will have convinced me that you are a competent witch. Then, and only then, I shall let you keep your magic."
  +n: 4
>4,m
  +p: "Here are some materials to get you started. Don't disappoint me."
  +n: eIntro
>eIntro,end

#The Wizard,🧙🏼‍♀️
@A=FIRE(1)
@A=1 EFFECT_FACE_ADD_FIRE
@B=ALL GOLD
@C=1 FAVOR_CAT
>0,ch
  +p: An old wizard enters your shop. He challenges you to a duel, promising a great reward.\n\nIf you win: the wizard can teach you a new spell, and you get @A.\nIf you lose, the wizard takes @B.\n\nYou can sense the Black Cat observing you.
  +c: 1|Accept! This guy's going down.\n@A
  +c: 2|Reject.
>2,m
  +p: The wizard leaves.
  +n: e
>1,d
  +p: The wizard readies a magic spell. You raise your hands...
  +dice: @A
  +pass: 3
  +fail: 4
>3,m
  +p: Your spells clash in magnificent glory, and when the smoke clears you stand triumphant! The defeated wizard teaches you a new spell.\n\nYou can feel that the Black Cat appreciates your victory.
  +add: @A|@C
  +n: e
>4,m
  +p: Damn. His spell was just too much for you to handle. The smug wizard pockets his earnings before leaving. You feel the Black Cat is displeased.
  +rem: @B|@C
  +n: e

#Gnome Thief,👨
@A=FIRE(2)
@B=HEART(1)
@C=HERB(RAND2_4 y)
@D=HERB(1 y)
@E=1 FAVOR_CAT
@L=The gnome slips away with your herbs.
@R1=GOLD(5)
@R2=GOLD(9)
>0,ch
  +p: You wake up this morning to find a small gnome stealing from your garden. With a fistful of herbs, he spots you and tries to run away as fast as his little feet can carry him.
  +c: 1|Use your magic to threaten the gnome, but you may damage the herbs...\n@A
  +c: 2|Entice the gnome to give back the herbs.\n@B
  +c: fail|Let him take @C, but at least there'll be no ruckus.
>1,d
  +p: You raise your hand and aim at the little fellow.
  +dice: @A
  +pass: 1pass
  +fail: fail2
>1pass,m
  +p: The gnome drops your herbs and runs off, but errant fire damages your garden.\n\nIn his haste, he dropped some gold on the ground.
  +rem: @D
  +add: @R1
  +n: e
>2,d
  +p: You call out to the gnome and attempt wrap your words with your magic.
  +dice: @B
  +pass: 2pass
  +fail: fail2
>2pass,m
  +p: The gnome timidly hands over the herbs and scampers off.\n\nYou notice some coins on the ground. He must have felt bad.
  +add: @R2
  +n: e
>fail,m
  +p: @L
  +rem: @C
  +n: e
>fail2,m
  +p: @L\n\nThe Black Cat is displeased with your failure.
  +rem: @C
  +rem: @E
  +n: e

#Unfortunate Evil,💀
@A=1 EFFECT_REPLACE_CURSE
>0,m
  +p: Abruptly, an undead creature steps into your shop, raises a bony finger at you, and zaps you with a dark lightning.\n\nThe pain of it causes you to pass out. When you awaken, the creature is gone, but you feel... off.\n\nSuch is the peril of being a witch.
  +add: @A
  +n: e

#Injured Dragon,🐲
@A=HEART(1)
@B1=1 POT_DRAGON_SWEAT
@B2=ING(1 POT_DRAGON_SWEAT)
@L1=The angry dragon breaths streams of fire, but the potion protects you as you heal him. The villager is grateful and rewards you for your effort. 
@L2=with that you can get close without issue.
@C=10 GOLD
@E=1 FAVOR_CAT
>S,m
  +p: A villager rushes into your shop. "My pet dragon!", he says, "He's injured. Can you help?"\n\nYou walk outside to see an irritated, tiny dragon with a gash across his body. Smoke streams from its nostrils, ready to burn anything that comes too close.
  +n: 0
>0,ch
  +p: You know you can do this if you can get close. You can sense the Black Cat observing you.
  +c: 1|Try to calm the dragon down. @A
  +c: 2a|You have @B1; @L2|HAS(@B1) 
  +c: 2b|You can mix\n@B1. @L2|HAS_I(@B1)
  +c: 3|Sorry, dragons are too dangerous.
>1,d
  +p: Carefully you step towards the dragon, readying your magic.
  +dice: @A
  +pass: 1pass
  +fail: 1fail
>1pass,m
  +p: Your soothing energy calms the dragon, and he lets you approach. You're able to bandage his wounds.\n\nYou feel like your magic is getting stronger.
  +add: @C
  +add: 1 EFFECT_FACE_ADD_HEART
  +n: e
>1fail,m
  +p: The angry dragon flails and breaths crazy amounts fire. You barely manage to escape unscathed!\n\nThe villager rushes him away, shouting about how much you upset his pet.\n\nAfter this debacle, you know the Black Cat is very displeased with you.
  +rem: 2 FAVOR_CAT
  +n: e
>2a,m
  +p: @L1
  +rem: @B1
  +add: @C|@E
  +n: e
>2b,m
  +p: @L1
  +rem: @B2
  +add: @C|@E
  +n: e
>3,m
  +p: "Some witch you are!"\n\nThe villager spits at you and leaves with his dragon.\n\nYou can sense the Black Cat's displeasure.
  +rem: @E
  +n: e

#You Have a Cold,🤧
@A=1 POT_COLD_CURE
@B=ING(1 POT_COLD_CURE)
@L=A lot better. You feel like you can harvest extra today!
>0,ch
  +p: You feel groggy and sick this morning, and it's a struggle to get out of bed.
  +c: 1|You're not feeling well, and simply cannot be a proper witch today.
  +c: 2|Drink @A.|HAS(@A)
  +c: 3|Mix @A and drink it.|HAS_I(@A)
>1,m
  +p: You should feel better soon, but not today.
  +add: 1 EFFECT_COLD
>2,m
  +p: You drink @A and feel better.\n\n...@L
  +rem: @A
  +add: 1 EFFECT_GREEN_THUMB
  +n: e
>3,m
  +p: You mix @A and drink it.\n\nYou feel better.\n\n...@L
  +rem: @B
  +add: 1 EFFECT_GREEN_THUMB
  +n: e

#Green Thumbs,🌱
>0,m
  +p: Today is a good day. You woke up with green thumbs!
  +add: 1 EFFECT_GREEN_THUMB
  +n: e

#Cursed Robbery!,🦹‍♂️
@A=ALL GOLD
@B=FIRE(2)
@C=HEART(2)
>0,ch
  +p: A costumed man dashes into your shop.\n\n"Give me all your money or I'll curse you!"
  +c: 1|Cower and give him @A.
  +c: 2|Stand your ground. @B
  +c: 3|Reason with him. @C
>1,m
  +p: You empty your coffers and give up @A.
  +rem: @A
  +n: e
>2,d
  +p: You raise your hands...
  +dice: @B
  +pass: 2pass
  +fail: 2fail
>2pass,m
  +p: Your spell terrifies the would-be robber, who scurries away, dropping some coins on the floor.
  +add: 3 GOLD
  +n: e
>2fail,m
  +p: He has a trick up his sleeve. He raises his hands and, after a flash, you fall to the ground, feeling ill!\n\n After a struggle, you are barely able to fend him off and he leaves.
  +add: 1 EFFECT_REPLACE_CURSE
  +n: e
>3,d
  +p: You raise your hands...
  +dice: @C
  +pass: 3pass
  +fail: 2fail
>3pass,m
  +p: You reason with the man, and he is impressed by your wisdom. He, miraculously, leaves you with a generous tip.
  +add: 10 GOLD
  +n: e

#Mason,🧱
@A=1 BLUEPRINT_SPARKLEWEED
@B=1 BLUEPRINT_BRAMBLEBERRY
@C=1 BLUEPRINT_SPECIALPETAL
@D=5 GOLD
@L1=Before the day is done you have a lovely new addition to your garden.
@L2=Build a bed for
>0,ch
  +p: A mason visits you. He offers to upgrade your garden for @D.
  +c: 1a|@L2\n@A.|HAS(@D)
  +c: 1b|@L2\n@B.|HAS(@D)
  +c: 1c|@L2\n@C.|HAS(@D)
  +c: 4|No thanks.
>1a,m
  +p: @L1
  +rem: @D
  +add: @A
  +n: e
>1b,m
  +p: @L1
  +rem: @D
  +add: @B
  +n: e
>1c,m
  +p: @L1
  +rem: @D
  +add: @C
  +n: e
>4,m
  +p: He leaves.
  +n: e

#Herb Merchant,🛒
  @A1=GOLD(RAND1_2)
  @A2=HERB1(RAND3_4)
  @B1=GOLD(RAND2_3)
  @B2=HERB2(RAND2_3)
  @L=You make the trade.
  >0,ch
.  +p: A traveling merchant visits. "Got a surplus of plants. I can give ya a good deal."
.  +c: 1|Trade @A1 for\n@A2.|HAS(@A1)
.  +c: 2|Trade @B1 for\n@B2.|HAS(@B1)
.  +c: e|Decline the offer
  >1,m
.  +p: @L
.  +rem: @A1
.  +add: @A2
.  +n: e
  >2,m
.  +p: @L
.  +rem: @B1
.  +add: @B2
.  +n: e

#Attack!,😈
@A=FIRE(1)
@B=HEART(2)
@C=1 FAVOR_CAT
@L=The grateful villagers scrounge together a nice reward for you.
>0,ch
  +p: A monster is attacking the village! As a witch, it is your duty to help.
  +c: 1|Fend off the monster with your magic.\n@A
  +c: 2|Maybe diplomacy will work this time.\n@B
>1,d
  +p: You prepare to launch a spell at the monster.
  +dice: @A
  +pass: 1pass
  +fail: 1fail
>1pass,m
  +p: With the villagers help, you manage to fend off the monster.\n\n@. 
  +add: 5 GOLD
  +n: e
>1fail,m
  +p: Your spell is not enough, and after a long battle, the monster is finally fended off by the villagers. Bedraggled and exhausted, you return to your shop.\n\nThe Black Cat is displeased with your performance.
  +rem: @C
  +n: e
>2,d
  +p: With eyes closed, you reach out to the monster's chaotic mind with your magic.
  +dice: @B
  +pass: 2pass
  +fail: 1fail
>2pass,m
  +p: Your spell sooths the monster just enough for you to get it to decide to leave peacefully.\n\n@L
  +add: @C
  +n: e

#Villager Contract,📜
@A=POT1(1)
@B=9 GOLD
@C=1 FAVOR_CAT
@D=ING(@A)
>0,ch
  +p: A villager comes to your shop and requisitions a potion:\n\n@A.
  +c: 1|Sell the potion for\n@B.|HAS(@A)
  +c: 2|You can mix it and sell it right now for\n@B.|HAS_I(@A)
  +c: 3|Say that you'll have the potion ready by next week.
>1,m
  +p: The villager buys the potion and leaves.
  +rem: @A
  +add: @B
  +n: e
>2,m
  +p: The villager buys the potion and leaves.
  +rem: @D
  +add: @B
  +n: e
>3,m
  +p: The villager leaves, promising to return next week.
  +n: e
  +add: 1 CONTRACT_VILLAGER

#Demonic Deal,👹
@A1=1
@A2=1 DICE_CURSE
@C=1
@D=1 EFFECT_FACE_ADD_CURSE
@L=The demon snaps its fingers, and you feel something fundamental change within you.
>0,ch
  +p: You notice a pair of eyes watching you from the shadows. When you turn to stare, a smiling demon reveals itself.\n\n"Would you like a deal, my dear?"
  +c: 1|Add @A1\nAND\nadd @A2.
  +c: 2|No thanks.
>1,m
  +p: @L
  +add: @C
  +add: @D
  +n: e
>2,m
  +p: It leaves.
  +n: e

#The Black Cat,🐈‍⬛
@A=GOLD(RAND2_4)
@B=1 FAVOR_CAT
@L1=The Black Cat's eyes glow
@L2=and new seed bed appears in your garden.
>0,ch
  +p: The Black Cat suddenly appears.\n\n"Tribute. @A. I demand it."
  +c: 1|Give the gold to the Black Cat.|HAS(@A)
  +c: fail|Say that you can't.
>1,m
  +p: With a mischievous grin, The Black Cat gathers the gold.\n\n"Much appreciated, now I shall grant you a boon."
  +rem: @A
  +n: ch
>ch,ch
  +p: "What would you like?"
>fail,m
  +p: "I see," The Black Cat says. "Do not disappoint me again. Despite this, I shall grant you a boon."
  +rem: @B
  +n: ch

#The Final Test,🐈‍⬛
@A=FIRE(3)
@B=HEART(3)
@C=GOLD(10)
@L1=You prepare to cast a spell to impress the Black Cat.
@L2=The Black Cat emits a soft purr of satisfaction. "Very good. When I return, surely you will be rewarded."
@L3=The fur stands on end as the Black Cat's eyes glow red. "This is not the work of a true witch."
>0,ch
  +p: The Black Cat suddenly appears.\n\n"I have a final test for you. Demonstrate your magic to me."
  +c: 1|Cast a threatening fire spell.\n@A
  +c: 2|Cast a soothing heart spell.\n@B
  +c: 3|Give the cat the money you've earned, surely @C is enough.|HAS(@C)
>1,d
  +p: @L1
  +dice: @A
  +pass: 1pass
  +fail: 1fail
>1pass,m
  +p: @L2
  +n: e
>1fail,m
  +p: @L3
  +rem: ALL FAVOR_CAT
  +n: e
>2,d
  +p: @L1
  +dice: @B
  +pass: 1pass
  +fail: 1fail
>3,m
  +p: "A bargain?. The cat makes a gagging sound that could almost have been a laugh. "Very well, I accept."
  +rem: @C
  +n: e

#Expulsion,🐈‍⬛
>0,ch
  +p: The Black Cat appears in front of you and stares you down with disappointed eyes.\n\n"I now see that you are not worthy of witchhood."\n\nA tugging, a pulling, a ripping sensation engulfs you, tearing out a piece of you, eviscerating your sense of self. You're left unconscious, on the ground with nothing.\n\nYou are no longer a witch.
  +c: 1|Try again.
  +c: 2|Quit.|HAS(999 GOLD)

#True Witch,🐈‍⬛
>0,ch
  +p: "That's enough," says the Black Cat. "I'm pleased with you. You may keep your magic."\n\nCongratulations! You've completed the game.\n\nWould you like to play again?
  +c: 1|Yes.
  +c: 2|No.|HAS(999 GOLD)`;;
    gameSetupEvents(gameState, parseEvents(eventsTxt.replaceAll('\\n', '<br>')));
    // let gameEvents2 = parseEvents(eventString);
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
    // let newEventState = copyObject(defaultEventState);
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
let createGameState = () => {
    let state = {
        events: [],
        day: 0,
        res: [],
        magicDice: [
            createMagicDice(),
        ],
        harvestRoll: [],
        ui: {},
        vars: {
            avblBlueprints: [ResourceType.BP_SPE],
        },
    };
    state.res.push(ResourceType.BP_SPA, ResourceType.BP_BRA
    // ResourceType.BP_SPE
    );
    return state;
};
let createMagicDice = () => {
    return [
        ResourceType.DICE_FIR,
        ResourceType.DICE_FIR,
        ResourceType.DICE_HEA,
        ResourceType.DICE_HEA,
        ResourceType.DICE_GRO,
        ResourceType.DICE_GRO,
    ];
};
let createMagicDiceBlank = () => {
    let d = [];
    for (let i = 0; i < 6; i++) {
        d.push(ResourceType.DICE_BLA);
    }
    return d;
};
let createMagicDiceGrow = () => {
    let d = [];
    for (let i = 0; i < 6; i++) {
        d.push(ResourceType.DICE_GRO);
    }
    return d;
};
let gameStateModifyResource = (state, resource, amt) => {
    let iterations = Math.abs(amt);
    for (let i = 0; i < iterations; i++) {
        if (amt > 0) {
            state.res.push(resource);
        }
        else {
            let index = state.res.indexOf(resource);
            if (index !== -1) {
                state.res.splice(index, 1);
            }
        }
    }
};
let gameStateGetResourceCount = (state, resource) => {
    return state.res.filter(r => r === resource).length;
};
let gameStateHasResource = (state, resource, amt) => {
    return gameStateGetResourceCount(state, resource) >= amt;
};
let gameStateGetGarden = (state) => {
    return state.res.filter(r => BLUEPRINT_NAMES.includes(r));
};
let stringToResourceType = (str) => {
    for (let resource of Object.values(ResourceType)) {
        if (str === resource) {
            return resource;
        }
    }
    throw 1;
};
let gameStateHasHarvestRoll = (state) => {
    return state.harvestRoll.length > 0;
};
let blueprintToHerb = (blueprint) => {
    switch (blueprint) {
        case ResourceType.BP_SPA:
            return ResourceType.HERB_SPA;
        case ResourceType.BP_BRA:
            return ResourceType.HERB_BRA;
        case ResourceType.BP_SPE:
            return ResourceType.HERB_SPE;
        default:
            throw 1;
    }
};
let getCurrentState = () => {
    return window.state;
};
let createBottomBar = () => {
    let root = createElement(DIV, {
        class: 'bottom-bar flxcr',
    });
    let favorMeter = createFavorMeter();
    appendChild(root, favorMeter.root);
    setFavorMeterPct(favorMeter, 5);
    return {
        root,
        favorMeter,
    };
};
let SQUARE_SIZE = 48;
let ACTIVE_DAY_CLASS = 'calendar-square-active';
let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let createCalendar = (days) => {
    let root = createElement(DIV, {});
    setStyle(root, {
        width: `${days * SQUARE_SIZE}px`,
    });
    let subRoot = createElement(DIV, {});
    setStyle(subRoot, {
        transition: 'transform 0.3s ease-in-out',
    });
    appendChild(root, subRoot);
    for (let i = 0; i < days; i++) {
        let square = createElement(DIV, {
            class: 'calendar-square',
            [INNER_HTML]: `${i + 1}. ${daysOfWeek[i % 7]}`,
        });
        appendChild(subRoot, square);
    }
    let calendar = {
        root,
        subRoot,
        day: 0,
    };
    return calendar;
};
let calendarSetDay = (calendar, day) => {
    calendar.day = day - 1;
    calendarAdvanceDayForward(calendar);
};
let calendarAdvanceDayForward = (calendar) => {
    calendar.day++;
    calendar.subRoot.style.transform = `translateX(-${calendar.day * SQUARE_SIZE}px)`;
    let activeChild = calendar.subRoot.children[calendar.day];
    if (activeChild) {
        activeChild.classList.add(ACTIVE_DAY_CLASS);
    }
    let prevChild = calendar.subRoot.children[calendar.day - 1];
    if (prevChild) {
        prevChild.classList.remove(ACTIVE_DAY_CLASS);
    }
};
let DICE_DEFAULT_FACE = `<${SPAN} class="icon">❓</${SPAN}>`;
let createDice = (state, magicDice, face = DICE_DEFAULT_FACE) => {
    let root = createElement(DIV, {
        class: 'dice',
    });
    let onHover = () => {
        hoverDescriptionDescribeShowDice(state.ui.hoverDescription, magicDice);
    };
    domAddEventListener(root, EVENT_CLICK, onHover);
    domAddEventListener(root, EVENT_MOUSE_OVER, onHover);
    let subRoot = createElement(DIV, {
        class: 'flxcr wh',
        [INNER_HTML]: face,
    });
    appendChild(root, subRoot);
    return {
        root,
        subRoot,
    };
};
let diceSetFace = (dice, face) => {
    dice.subRoot[INNER_HTML] = face;
};
let diceSpin = (dice, resultValue, ms, rotations) => {
    return new Promise(resolve => {
        setStyle(dice.root, {
            animation: `spin ${ms / rotations}ms linear ${rotations}`,
        });
        diceSetFace(dice, DICE_DEFAULT_FACE);
        setTimeout(() => {
            setStyle(dice.root, {
                animation: '',
            });
            diceSetFace(dice, resultValue);
            resolve();
        }, ms);
    });
};
let createEventModal = (gameEventState) => {
    let root = createElement(DIV, {
        id: 'event-modal',
        class: 'modal',
    });
    let content = createElement(DIV, {
        class: 'event-content btext',
    });
    let choices = createElement(DIV, {
        class: 'event-next',
    });
    let next = createElement(DIV, {
        class: 'event-next',
    });
    let obj = {
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
let eventModalAddTitle = (eventModal, gameEventState) => {
    let { content } = eventModal;
    let icon = gameEventState.event.icon;
    if (icon === '🐈‍⬛') {
        icon = ICON_CAT;
    }
    if (icon) {
        let titleIcon = createElement(DIV, {
            class: 'event-title-icon',
            [INNER_HTML]: icon,
        });
        appendChild(content, titleIcon);
    }
    if (gameEventState.event.title) {
        let titleText = createElement(P, {
            class: 'event-title-text',
            [INNER_HTML]: gameEventState.event.title,
        });
        appendChild(content, titleText);
    }
};
let eventModalAddMod = (content, modifyResource) => {
    let resourceText = gameEventReplaceEnumWithIcons(modifyResource.resource, COLOR_HIGHLIGHT_DARK_TEXT);
    let isPositive = modifyResource.amt > 0;
    let amt = isNaN(modifyResource.amt) ? 'all' : modifyResource.amt;
    let amtText = isPositive ? '+' + amt : amt;
    let p2 = eventModalCreateButtonChosenText(`${amtText} ${resourceText}`);
    appendChild(content, p2);
};
let eventModalAddChild = (eventModal, gameEventChild, gameEventState, state) => {
    let { content, choices, next } = eventModal;
    let { event } = gameEventState;
    clearChildren(next);
    next.remove();
    clearChildren(choices);
    choices.remove();
    let pText = createElement(P, {
        [INNER_HTML]: gameEventChild.p,
    });
    appendChild(content, pText);
    if (gameEventChild.type === 'garden') {
        let garden = createGarden(state, gameEventState);
        appendChild(content, garden.root);
    }
    if (gameEventChild.rolls) {
        let isAny = gameEventChild.parsedRolls[0] === ResourceType.DICE_ANY;
        // let isDouble = gameStateGetResourceCount(state, ResourceType.EFFECT_DOUBLE) > 0;
        let isDouble = false;
        let p2 = createElement(P, {
            [INNER_HTML]: isAny ? 'Try it out!' : 'To pass: ',
        });
        appendChild(content, p2);
        for (let parsedRoll of gameEventChild.parsedRolls) {
            let p3 = createElement(SPAN, {
                [INNER_HTML]: Labels[parsedRoll].icon,
            });
            appendChild(p2, p3);
        }
        eventModal.diceElements = [];
        let diceToRoll = copyObject(state.magicDice);
        for (let i = 0; i < state.magicDice.length; i++) {
            let dice = createDice(state, diceToRoll[i]);
            eventModal.diceElements.push(dice);
            appendChild(content, dice.root);
        }
        eventModalAddDiceButtons(eventModal, gameEventChild, gameEventState, state, {
            isAny,
            diceToRoll,
        });
        appendChild(content, next);
    }
    if (gameEventChild.parsedMod) {
        for (let modifyResource of gameEventChild.parsedMod) {
            eventModalAddMod(content, modifyResource);
        }
    }
    console.log('RENDER GAME CHILD', gameEventChild);
    if (gameEventChild.n) {
        let button = createElement(BUTTON, {
            class: CLASS_BTN_TEXT,
            [INNER_HTML]: gameEventChild.n === 'e' ? 'Done' : 'Next',
        });
        domAddEventListener(button, EVENT_CLICK, () => {
            let child = gameEventGetChild(gameEventState, gameEventChild.n);
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
        for (let choice of gameEventChild.choices) {
            let isDisabled = !choice?.parsedCondition();
            let args = {
                class: CLASS_BTN_TEXT,
                [INNER_HTML]: choice.text,
            };
            if (isDisabled) {
                args.disabled = 'disabled';
            }
            let button = createElement(BUTTON, args);
            if (gameEventChild.flex) {
                setAttribute(button, 'class', CLASS_BTN_TEXT + ' ' + 'event-choice-flex');
                setStyle(button, {
                    width: '49%',
                    textDecoration: 'none',
                });
            }
            domAddEventListener(button, EVENT_CLICK, () => {
                let p2 = eventModalCreateButtonChosenText(choice.text);
                appendChild(content, p2);
                let child = gameEventGetChild(gameEventState, choice.n);
                gameEventRunChild(state, gameEventState, child);
            });
            appendChild(choices, button);
        }
        appendChild(content, choices);
    }
    eventModalScrollToBottom(eventModal, !gameEventChild.fastScroll);
};
let eventModalScrollToBottom = (eventModal, smooth = true) => {
    eventModal.content.scrollTo({
        top: eventModal.content.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
    });
};
let eventModalHandleRollClick = async (eventModal, gameEventState, state, gameEventChild, args) => {
    let { content, diceButtons, diceElements } = eventModal;
    for (let i = 0; i < diceButtons.length; i++) {
        let button = diceButtons[i];
        // if (i === 0) {
        //   setStyle(button, {
        //     visibility: 'hidden',
        //   });
        // } else {
        //   button.remove();
        // }
        button.disabled = true;
    }
    let diceToRoll = args.diceToRoll.slice();
    let diceResults = await gameRollDiceUi(diceToRoll.map((d, i) => ({
        dice: d,
        elem: diceElements[i],
    })), gameEventChild.parsedRolls, args.useLuck);
    let didPass = true;
    for (let roll of gameEventChild.parsedRolls) {
        let ind = diceResults.indexOf(roll);
        if (ind === -1) {
            didPass = false;
            break;
        }
        diceResults.splice(ind, 1);
    }
    timeoutPromise(1000).then(() => {
        let p = createElement(P, {
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
            let button = diceButtons[i];
            // if (i === 0) {
            //   setStyle(button, {
            //     visibility: 'hidden',
            //   });
            // } else {
            //   button.remove();
            // }
            button.remove();
        }
        let child = gameEventGetChild(gameEventState, didPass ? gameEventChild.pass : gameEventChild.fail);
        gameEventRunChild(state, gameEventState, child);
    });
};
let eventModalAddDiceButtons = (eventModal, gameEventChild, gameEventState, state, args) => {
    let eventFuncArgs = {
        isAny: args.isAny,
        useLuck: false,
        useDouble: false,
        usePower: false,
        useEmpathy: false,
        diceToRoll: args.diceToRoll,
    };
    eventModal.diceButtons = [];
    let { next, content } = eventModal;
    let button = createElement(BUTTON, {
        class: CLASS_BTN_TEXT,
        [INNER_HTML]: 'Roll.',
    });
    domAddEventListener(button, EVENT_CLICK, () => {
        eventModalHandleRollClick(eventModal, gameEventState, state, gameEventChild, eventFuncArgs);
    });
    appendChild(next, button);
    eventModal.diceButtons.push(button);
    let luckPotionCount = gameStateGetResourceCount(state, ResourceType.POT_LIQ);
    let powerPotionCount = gameStateGetResourceCount(state, ResourceType.POT_POW);
    let empathyPotionCount = gameStateGetResourceCount(state, ResourceType.POT_EMP);
    if (!args.isAny) {
        if (luckPotionCount > 0) {
            let luckPotionLabel = Labels[ResourceType.POT_LIQ];
            let luckBtnText = `Use a ${luckPotionLabel.l}${luckPotionLabel.icon}<br>(all rolls meet reqs).`;
            let luckButton = createElement(BUTTON, {
                class: CLASS_BTN_TEXT,
                [INNER_HTML]: luckBtnText,
            });
            domAddEventListener(luckButton, EVENT_CLICK, () => {
                eventModalHandleRollClick(eventModal, gameEventState, state, gameEventChild, {
                    ...eventFuncArgs,
                    useLuck: true,
                });
            });
            appendChild(next, luckButton);
            eventModal.diceButtons.push(luckButton);
        }
        if (powerPotionCount > 0) {
            let powerBtnText = `Use a ${highlightResource(ResourceType.POT_POW, COLOR_HIGHLIGHT_DARK_TEXT)}<br>(1 additional dice).`;
            let powerButton = createElement(BUTTON, {
                class: CLASS_BTN_TEXT,
                [INNER_HTML]: powerBtnText,
            });
            domAddEventListener(powerButton, EVENT_CLICK, () => {
                powerButton.disabled = true;
                let d = createMagicDice();
                let dice = createDice(state, d, '✨');
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
            let growMagicDiceHl = highlightResource(ResourceType.DICE_GRO, COLOR_HIGHLIGHT_DARK_TEXT);
            let heartMagicDiceHl = highlightResource(ResourceType.DICE_HEA, COLOR_HIGHLIGHT_DARK_TEXT);
            let empathyBtnText = `Use a ${highlightResource(ResourceType.POT_EMP, COLOR_HIGHLIGHT_DARK_TEXT)}<br>(tmp convert ${growMagicDiceHl} to ${heartMagicDiceHl}).`;
            let empathyButton = createElement(BUTTON, {
                class: CLASS_BTN_TEXT,
                [INNER_HTML]: empathyBtnText,
            });
            domAddEventListener(empathyButton, EVENT_CLICK, () => {
                empathyButton.disabled = true;
                gameStateModifyResource(state, ResourceType.POT_EMP, -1);
                for (let i = 0; i < eventFuncArgs.diceToRoll.length; i++) {
                    let dice = eventFuncArgs.diceToRoll[i];
                    for (let j = 0; j < dice.length; j++) {
                        let face = dice[j];
                        if (face === ResourceType.DICE_GRO) {
                            dice[j] = ResourceType.DICE_HEA;
                        }
                    }
                }
                for (let i = 0; i < eventModal.diceElements.length; i++) {
                    let dice = eventModal.diceElements[i];
                    dice.subRoot[INNER_HTML] = ICON_HEART_MAGIC;
                }
                eventFuncArgs.useEmpathy = true;
            });
            appendChild(next, empathyButton);
            eventModal.diceButtons.push(empathyButton);
        }
    }
};
let eventModalCreateButtonChosenText = (text) => {
    let p = createElement(P, {
        [INNER_HTML]: text,
        class: 'event-chosen-text wtext',
    });
    return p;
};
let MAX_FAVOR = 7;
let createFavorMeter = () => {
    let root = createElement(DIV, {
        class: 'favor-meter',
    });
    let label = createElement(DIV, {
        [INNER_HTML]: "Black Cat's Favor",
    });
    appendChild(root, label);
    let subRoot = createElement(DIV, {
        class: 'favor-meter-sub',
    });
    setStyle(root, {
        width: `${MAX_FAVOR * 24}px`,
    });
    appendChild(root, subRoot);
    return { root, subRoot };
};
let setFavorMeterPct = (favorMeter, numCatsFavor) => {
    clearChildren(favorMeter.subRoot);
    for (let i = 0; i < Math.min(MAX_FAVOR, numCatsFavor); i++) {
        let cat = createElement(DIV, {
            [INNER_HTML]: ICON_CAT,
        });
        appendChild(favorMeter.subRoot, cat);
    }
};
let createGarden = (state, eventState) => {
    let blueprints = gameStateGetGarden(state);
    let root = createElement(DIV, {
        class: 'garden',
    });
    let slots = [];
    let harvestButtons = [];
    let hasGreenThumb = gameStateGetResourceCount(state, ResourceType.EFF_GRE) > 0;
    for (let blueprint of blueprints) {
        let gardenSlot = createElement(DIV, {
            class: 'garden-slot',
        });
        let labelObj = Labels[blueprint];
        let gardenLabel = createElement(DIV, {
            [INNER_HTML]: labelObj.l,
            class: 'garden-label',
        });
        let gardenDiceContainer = createElement(DIV, {
            class: 'garden-dice-container',
        });
        let gardenDiceList = createElement(DIV, {
            class: 'garden-dice-list',
        });
        let gardenDiceResult = createElement(DIV, {
            class: 'garden-dice-result flxcr',
        });
        appendChild(gardenSlot, gardenLabel);
        appendChild(gardenSlot, gardenDiceContainer);
        appendChild(gardenDiceContainer, gardenDiceList);
        appendChild(gardenDiceContainer, gardenDiceResult);
        appendChild(root, gardenSlot);
        let magicDice = [...state.magicDice];
        let diceElements = [];
        for (let i = 0; i < magicDice.length; i++) {
            let dice = createDice(state, magicDice[i]);
            diceElements.push(dice);
            appendChild(gardenDiceList, dice.root);
        }
        slots.push({
            magicDice,
            diceList: diceElements,
            type: blueprint,
            resultArea: gardenDiceResult,
            gardenDiceList,
        });
    }
    if (hasGreenThumb) {
        let greenThumbLabel = Labels[ResourceType.EFF_GRE];
        let greenThumbText = createElement(P, {
            class: CLASS_BTN_TEXT,
            [INNER_HTML]: `Your ${greenThumbLabel.l}${greenThumbLabel.icon} will let you harvest double.`,
        });
        appendChild(root, greenThumbText);
    }
    let handleHarvestClick = async () => {
        // setStyle(harvestButton, {
        //   visibility: 'hidden',
        //   padding: '0',
        //   margin: '-4px',
        // });
        for (let button of harvestButtons) {
            // button.remove();
            button.disabled = true;
        }
        gameStateModifyResource(state, ResourceType.EFF_GRE, -1);
        let promises = [];
        for (let slot of slots) {
            promises.push(gameRollDiceUi(slot.magicDice.map((d, i) => ({
                dice: d,
                elem: slot.diceList[i],
            })), [ResourceType.DICE_GRO]));
        }
        let diceRolls = await Promise.all(promises);
        let multiplier = hasGreenThumb ? 2 : 1;
        let harvestResults = gameHarvest(state, diceRolls.map((r, i) => ({
            resourceType: blueprintToHerb(slots[i].type),
            diceResults: r,
        })), multiplier);
        for (let i = 0; i < harvestResults.length; i++) {
            slots[i].resultArea[INNER_HTML] = '+' + String(harvestResults[i]);
        }
        await timeoutPromise(1000);
        for (let button of harvestButtons) {
            button.remove();
        }
        let harvestText = eventModalCreateButtonChosenText('Harvest');
        appendChild(root, harvestText);
        gameEventRunChild(state, eventState, eventState.event.children[1]);
    };
    let harvestButton = createElement(BUTTON, {
        class: CLASS_BTN_TEXT,
        [INNER_HTML]: 'Harvest',
    });
    domAddEventListener(harvestButton, EVENT_CLICK, handleHarvestClick);
    appendChild(root, harvestButton);
    harvestButtons.push(harvestButton);
    let hasGrowthPotion = gameStateGetResourceCount(state, ResourceType.POT_GRO) > 0;
    if (hasGrowthPotion) {
        let growMagicDiceHl = highlightResource(ResourceType.DICE_GRO, COLOR_HIGHLIGHT_DARK_TEXT);
        let potGrowthLabelText = `Use a ${highlightResource(ResourceType.POT_GRO, COLOR_HIGHLIGHT_DARK_TEXT)}<br>(adds 1 all ${growMagicDiceHl} dice).`;
        let potOfGrowthButton = createElement(BUTTON, {
            class: CLASS_BTN_TEXT,
            [INNER_HTML]: potGrowthLabelText,
        });
        domAddEventListener(potOfGrowthButton, EVENT_CLICK, () => {
            gameStateModifyResource(state, ResourceType.POT_GRO, -1);
            for (let slot of slots) {
                let growDice = createMagicDiceGrow();
                let diceElem = createDice(state, growDice, ICON_GROW);
                slot.diceList.push(diceElem);
                slot.magicDice.push(growDice);
                appendChild(slot.gardenDiceList, diceElem.root);
            }
            // potOfGrowthButton.remove();
            potOfGrowthButton.disabled = true;
            // let potGrowthLabelTextElem =
            //   eventModalCreateButtonChosenText(potGrowthLabelText);
            // prependChild(root, potGrowthLabelTextElem);
        });
        appendChild(root, potOfGrowthButton);
        harvestButtons.push(potOfGrowthButton);
    }
    return { root, slots, harvestButtons };
};
let highlightText = (text, color) => {
    let resource = getResourceFromLabel(text);
    let cbFuncName = `hl('${resource}', this)`;
    // console.log('Highlight', text, resource, cbFuncName);
    return `<${SPAN} class="highlight-text" style="color: ${color};" ontouchstart="${cbFuncName}" onclick="${cbFuncName}" onmouseover="${cbFuncName}" onmouseout="${cbFuncName}" >${text}</${SPAN}>`;
};
window.hl = (resource, elem) => {
    // console.log('HL TEXT', resource);
    let cl = 'highlight-text';
    let allElementsWithClass = getElementsByClassName(cl);
    for (let elem of allElementsWithClass) {
        setStyle(elem, { 'text-decoration': 'none' });
    }
    setStyle(elem, { 'text-decoration': 'underline' });
    let hoverDescription = getCurrentState().ui.hoverDescription;
    hoverDescriptionDescribe(hoverDescription, resource);
};
let highlightResource = (resource, color) => {
    let labelObj = Labels[resource];
    return highlightText(labelObj.l, color) + labelObj.icon;
};
let createHoverDescription = () => {
    let root = createElement(DIV, {
        class: 'hover-desc',
    });
    return { root };
};
let hoverDescriptionDescribe = (hoverDescription, resource) => {
    let labelObj = Labels[resource];
    clearChildren(hoverDescription.root);
    let label = createElement(SPAN, {
        class: 'hover-desc-label',
        [INNER_HTML]: labelObj.l + labelObj.icon + ': ',
    });
    appendChild(hoverDescription.root, label);
    let dsc = createElement(SPAN, {
        class: 'hover-desc-dsc',
        [INNER_HTML]: labelObj.dsc,
    });
    appendChild(hoverDescription.root, dsc);
};
let hoverDescriptionDescribeShowDice = (hoverDescription, magicDice) => {
    clearChildren(hoverDescription.root);
    let container = createElement(DIV, {
        class: 'flxcr',
    });
    setStyle(container, {
        height: '48px',
    });
    for (let face of magicDice) {
        let labelObj = Labels[face];
        let label = createElement(DIV, {
            class: 'dice flxcr',
            [INNER_HTML]: labelObj.icon,
        });
        setStyle(label, {
            display: 'inline-flex',
        });
        appendChild(container, label);
    }
    appendChild(hoverDescription.root, container);
};
let createNextBar = () => {
    let root = createElement(DIV, {
        class: 'next-bar flxcr',
    });
    return {
        root,
    };
};
let nextBarSetButtonState = (nextBar, state) => {
    nextBar.nextButton?.remove();
    if (gameStateHasHarvestRoll(state)) {
        let nextButton = createElement(BUTTON, {
            class: CLASS_BTN_TEXT + ' next-btn',
            [INNER_HTML]: 'Next Day',
        });
        nextBar.nextButton = nextButton;
        domAddEventListener(nextButton, EVENT_CLICK, () => {
            state.harvestRoll = [];
            state.day++;
            // setGardenSlots(state.ui.garden, state);
            setPrimaryResources(state.ui.res, state);
            nextTick(() => {
                nextBarSetButtonState(nextBar, state);
                runEvent(state, state.events[state.day]);
            });
        });
        appendChild(nextBar.root, nextButton);
    }
    else {
        let nextButton = createElement(BUTTON, {
            class: CLASS_BTN_TEXT + ' next-btn',
            [INNER_HTML]: 'Harvest',
        });
        nextBar.nextButton = nextButton;
        domAddEventListener(nextButton, EVENT_CLICK, () => {
            // gameHarvest(state);
        });
        appendChild(nextBar.root, nextButton);
    }
};
let createPrimaryResources = () => {
    let root = createElement(DIV, {
        id: 'primary-resources',
    });
    let herbRoot = createElement(DIV, {
        class: 'primary-resource-column',
    });
    appendChild(root, herbRoot);
    let otherRoot = createElement(DIV, {
        class: 'primary-resource-column',
    });
    appendChild(root, otherRoot);
    return {
        root,
        herbRoot,
        otherRoot,
    };
};
let setPrimaryResources = (primaryResources, state) => {
    clearChildren(primaryResources.herbRoot);
    clearChildren(primaryResources.otherRoot);
    for (let res of HERB_NAMES) {
        let labelObj = Labels[res];
        let herbRow = createElement(DIV, {
            class: 'flxcr primary-resource-row',
        }, [
            createElement(DIV, {
                [INNER_HTML]: highlightText(labelObj.icon + labelObj.l, '#1b631b') + ': ',
            }),
            createElement(DIV, {
                [INNER_HTML]: String(gameStateGetResourceCount(state, res)),
            }),
        ]);
        appendChild(primaryResources.herbRoot, herbRow);
    }
    let otherNames = [...REAGENT_NAMES, ResourceType.GOLD];
    for (let res of otherNames) {
        let labelObj = Labels[res];
        let otherRow = createElement(DIV, {
            class: 'flxcr primary-resource-row',
        }, [
            createElement(DIV, {
                [INNER_HTML]: highlightText(labelObj.icon + labelObj.l, '#009') + ': ',
            }),
            createElement(DIV, {
                [INNER_HTML]: String(gameStateGetResourceCount(state, res)),
            }),
        ]);
        appendChild(primaryResources.otherRoot, otherRow);
    }
};
let CLASS_BTN_TEXT = 'btn-text wtext';
let COLOR_HIGHLIGHT_DARK_TEXT = '#02a';
let COLOR_HIGHLIGHT_LIGHT_TEXT = '#adf';
let rand = () => {
    return Math.random();
};
let randInArray = (array) => {
    return array[Math.floor(rand() * array.length)];
};
let randInRange = (min, max) => {
    return Math.floor(rand() * (max - min + 1)) + min;
};
let splitDelimTrim = (text, delim) => {
    return text.split(delim).map(s => s.trim());
};
