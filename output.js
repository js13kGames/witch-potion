document.write('<meta content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" name=viewport><title>Witch Potion</title><style>:root{font-size:16px}body{background-color:#000;color:#fff;font-family:Courier,monospace}p{margin:8px 0}button{display:block;font-size:inherit;border-radius:8px;user-select:none}button:disabled{background-color:#aaa;text-decoration:line-through}.wh{width:100%;height:100%}.btext{color:#000}.wtext{color:#fff}.flxcr{display:flex;justify-content:center;align-items:center}#game-container{display:flex;justify-content:center;align-items:center}#game{max-width:500px;background-color:#ddd;position:relative;overflow:hidden}#primary-resources{margin-top:2px;display:flex;justify-content:space-around}.icon{filter:grayscale(50%);background:#111;border-radius:99px;cursor:default;margin-left:2px;display:inline-block}.calendar-square{width:42px;height:42px;padding:2px;border:1px solid #000;display:inline-block;background:#ddd}.calendar-square-active{background-color:#fff;border-color:#09a}.modal{background:#aaa;width:100%;position:absolute;bottom:64px;height:calc(100% - 174px - 64px);padding:8px;box-sizing:border-box}.hover-desc{position:absolute;top:113px;background:#000;height:64px;width:calc(100% - 16px);padding:8px;color:#fff}.highlight-text{cursor:default}.event-content{padding:8px;background-color:#fff;max-height:calc(100% - 16px);overflow-y:auto}.event-title{display:flex;align-items:center;justify-content:center}.event-title-icon{font-size:32px;text-align:center;width:100%}.event-title-text{font-size:1.5rem;font-weight:700;text-align:center}.event-choice-flex{font-size:.75rem;text-align:left}.event-choice-text{background:#000;padding:2px;text-align:center}.event-chosen-text{background:#ccc;color:#222;padding:2px;text-align:center}.event-next{margin-bottom:8px}.btn-text{color:#000;background:#eee;width:100%;padding:8px;margin:4px 0;font-family:Courier,monospace}.btn-text:active{background-color:#aaa}.primary-resource-column{width:45%}.primary-resource-row{justify-content:space-between;width:100%;border-bottom:1px solid #aaa;box-sizing:border-box;font-size:.9rem}.garden{padding:0;margin-bottom:8px}.garden-slot{width:calc(100% - 16px);margin:8px;background:#fff}.garden-label{font-weight:700;font-style:italic}.garden-dice-container{display:flex}.garden-dice-list{display:flex;width:calc(100% - 64px)}.garden-dice-result{width:calc(64px);font-size:1.5rem;font-weight:700}.bottom-bar{position:absolute;bottom:0;width:100%;height:64px;background:#ddd}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.dice{display:inline-block;width:42px;height:42px;background:#fff;border:1px solid #000;border-radius:4px;padding:4px;margin:4px}.moon-anim{font-size:2rem;text-align:center}.favor-meter{border:1px solid #000;text-align:center}.favor-meter-sub{display:flex}.shop{font-size:.75rem}</style><div class=wh id=game-container><div class="wh btext" id=game></div></div>');var e,t,o,a,r,l;let s;function i(e){return structuredClone(e)}function n(e,t){return`<${u} style="filter: hue-rotate(${t}deg)">${e}</${u}>`}let c={event:{icon:"",title:"",children:[{id:"harvest",type:"garden",p:"You may now harvest your garden."},{re:!0,id:"day",type:"ch",p:"You are at your shop. What would you like to do today?",choices:[{text:"Visit the reagent merchant.",n:"merch"},{text:"Mix potions.",n:"pot"},{text:"View inventory.",n:"inv"},{text:"End the day.",n:"nextDay"}]},{id:"nextDay",type:"end"}]},evalVars:{},currentChildId:"default"},d="button",u="span",h="<br>",p="innerHTML",f="click",E=()=>R("game"),m=(e,t)=>{for(let o in t)e.style[o]=t[o]},_=(e,t={},o=[])=>{let a=document.createElement(e);for(let e in t)e===p?a.innerHTML=t[e]:a.setAttribute(e,t[e]);for(let e of o)a.appendChild(e);return a},A=(e,t)=>{e.appendChild(t)},y=e=>{e[p]=""},R=e=>document.getElementById(e),g=(e,t,o)=>{e.addEventListener(t,o)},C=(e,t,o)=>{e.setAttribute(t,o)},T=e=>new Promise(t=>setTimeout(t,e)),v=(e,t)=>e.startsWith(t),F=(e,t)=>{let o=O(t);S(e,o,t),H(e,o,t);let a=e.ui.eventModal;a?eS(a,o):(a=eG(o),A(E(),a.root)),e.ui.eventModal=a,console.log("run event",t),D(e,o,I(o,o.currentChildId))},D=(t,o,a)=>{let r=t.ui.eventModal;if(!r)throw 1;if("end"===a.type){if("nextDay"===a.id)es(t);else if("eIntro"===a.id)t.day=0,es(t,"Tomorrow you start your first day as a witch.");else{let e=i(c);ed(t,e),eu(t,e),eh(t,e),ep(t,e),t.day%7==4&&A(r.content,_("p",{[p]:`<${u} style="color: brown;">You feel that the Black Cat will visit you tomorrow.</${u}>`})),D(t,e,e.event.children[0])}return}if(a.p&&(a.p=P(a.p,eZ)),a.choices)for(let e of a.choices)e.text=P(e.text,eZ),e.parsedCondition||(e.parsedCondition=w(t,o,e.conditionText));if(a.rolls)for(let e of(a.parsedRolls=[],a.rolls)){let[t,o]=b(e);for(let e=0;e<t;e++)a.parsedRolls.push(o)}if(a.mod)for(let e of(a.parsedMod=[],a.mod)){let[r,l]=b(e);99===Math.abs(r)&&(r=Math.sign(r)*eg(t,l)),a.parsedMod.push({amt:r,resource:l}),ec(t,o,a,l,r)}a.re&&(console.log("re generating event state"),ed(t,o=i(c)),eu(t,o),eh(t,o)),eN(r,a,o,t),eX(t.ui.res,t),eM(t.ui.favorMeter,eg(t,e.FAV_CAT))},I=(e,t)=>{if("e"===t)return{id:"e",type:"end"};let o=e.event.children.find(e=>e.id===t);if(!o)throw 1;return o},O=e=>({event:e,currentChildId:e.children[0].id,evalVars:{}}),B=(o,a,r,l)=>{let s=t=>{let o=(e=>{if(e.includes("RAND")){let t=e.slice(4).split("_"),o=parseInt(t[0]),a=parseInt(t[1]);if(isNaN(o)||isNaN(a))throw 1;return e2(o,a)}let t=parseInt(e);if(isNaN(t))throw 1;return t})(r[0]),s="y"===r[1],i=[];for(;0===i.length&&o>0;)i=s?t.filter(e=>eC(l,e,o)):t,o--;return 0===i.length?(console.log("No resources found for",a,r),[0,e.GOLD]):[o+1,e0(i)]},i={[t.FUNC_H1]:()=>s(k),[t.FUNC_H2]:()=>s(Y),[t.FUNC_H3]:()=>s(Y),[t.FUNC_H_ANY]:()=>s(U),[t.FUNC_R1]:()=>s($),[t.FUNC_R2]:()=>s(M),[t.FUNC_R_ANY]:()=>s(x),[t.FUNC_P1]:()=>s(W.filter(t=>t!==e.POT_LIQ)),[t.FUNC_P_ANY]:()=>s(W),[t.FUNC_G]:()=>s([e.GOLD]),[t.FUNC_FIRE]:()=>s([e.DICE_FIR]),[t.FUNC_HEART]:()=>s([e.DICE_HEA]),[t.FUNC_GROW]:()=>s([e.DICE_GRO]),[t.FUNC_ING]:()=>{if(r[0].includes("@"))return[18,o];let[,e]=b(r.join(" "));return console.log("RES",r),[18,er(K[e]).join("|")]}}[a];if(i)return i();throw 1},P=(t,o)=>{let a=t;if(t.includes("<span"))return t;let r={};for(let[t,o]of Object.entries(e))r[o]=t;for(let[t,l]of Object.entries(r)){let r=ea[t];if(!r)throw 1;let s=eV(r.l,o),i=`${s}${ea[t].icon}`;a=a.replaceAll(e[l],i)}return t=t.replaceAll("Infinity","all"),a},w=(e,t,a)=>{if(!a)return()=>!0;let r=e3(a,","),l=[];for(let t=0;t<r.length;t++){let a=r[t],s=t=>{let a=G(t,o.HAS_ING);if(!a)return;let[,r]=b(a[1].join(" ")),l=er(K[r]);return()=>l.every(t=>{let[o,a]=b(t);return eC(e,a,o)})},i=(t=>{let a=G(t,o.HAS_RES);if(!a)return;let[r,l]=b(a[1].join(" "));return()=>eC(e,l,r)})(a);i&&l.push(i);let n=s(a);n&&l.push(n)}if(0===l.length)throw 1;return()=>l.every(e=>e())},L=(e,t)=>{for(let[o,a]of Object.entries(t))e=e.replaceAll(o,a);return e},b=t=>{let o=t.split(" ");if(2===o.length){let e=eT(o[1]);return o[0].includes("ALL")?["-"===o[0][0]?-99:99,e]:[parseInt(o[0]),e]}return[1,e.GOLD]},G=(e,t)=>{let o=e.match(RegExp(`(${t??".*"})\\(([^)]*)\\)`));if(o){let e=o[1];return"-"===e[0]&&(e=e.slice(1)),[e,e3(o[2]," "),o[0]]}},S=(e,t,o)=>{for(let a in o.vars){let r=o.vars[a];if(r.parsed)continue;let l=G(r.str);if(l){let o=t.evalVars[a];if(o){r.parsed=o;continue}let[s,i,n]=l,[c,d]=B(n,s,i,e),u=c+" "+d;18===c&&(u=d),r.parsed=u,t.evalVars[a]=u}else r.parsed=r.str,t.evalVars[a]=r.str}},H=(e,t,o)=>{for(let e in o.vars){let a=o.vars[e];a.parsed.includes("@")&&(a.str=L(a.str,t.evalVars),delete t.evalVars[e],delete a.parsed)}for(let a of(S(e,t,o),o.children)){if(a.p&&(a.p=L(a.p,t.evalVars)),a.choices)for(let e of a.choices)e.text=L(e.text,t.evalVars),e.conditionText&&(e.conditionText=L(e.conditionText,t.evalVars));if(a.rolls)for(let e=0;e<a.rolls.length;e++){let o=a.rolls[e];a.rolls[e]=L(o,t.evalVars)}if(a.mod){let e=[];for(let o=0;o<a.mod.length;o++){let r=L(a.mod[o],t.evalVars),l=e3(r,"|"),s="-"===r[0];1===l.length?e.push(r):e.push(...l.map((e,t)=>s&&t>0?"-"+e:e))}a.mod=e}}};(a=e||(e={})).GOLD="GOLD",a.HERB_SPA="HERB_SPARKLEWEED",a.HERB_BRA="HERB_BRAMBLEBERRY",a.HERB_SPE="HERB_SPECIALPETAL",a.REAG_SKY="REAG_SKY_DUST",a.REAG_SUN="REAG_SUN_POWDER",a.POT_COL="POT_COLD_CURE",a.POT_DRA="POT_DRAGON_SWEAT",a.POT_MIA="POT_MIASMA_OF_MIDNIGHT",a.POT_TIN="POT_TINCTURE_OF_TASTE",a.POT_EMP="POT_EMPATHY",a.POT_GRO="POT_GROWTH",a.POT_LIQ="POT_LIQUID_LUCK",a.POT_POW="POT_POWER_POTION",a.POT_ANT="POT_ANTI_CURSE",a.DICE_FIR="DICE_FIRE_MAGIC",a.DICE_HEA="DICE_HEART_MAGIC",a.DICE_GRO="DICE_GROW",a.DICE_CUR="DICE_CURSE",a.DICE_BLA="DICE_BLANK",a.DICE_ANY="ANY",a.DICE_NEW="DICE_NEW",a.BP_SPA="BLUEPRINT_SPARKLEWEED",a.BP_BRA="BLUEPRINT_BRAMBLEBERRY",a.BP_SPE="BLUEPRINT_SPECIALPETAL",a.C_VIL="CONTRACT_VILLAGER",a.FAV_CAT="FAVOR_CAT",a.EFF_COL="EFFECT_COLD",a.EFF_GRE="EFFECT_GREEN_THUMB",a.EFF_FFIR="EFFECT_FACE_ADD_FIRE",a.EFF_FHEA="EFFECT_FACE_ADD_HEART",a.EFF_FGRO="EFFECT_FACE_ADD_GROW",a.EFF_FCUR="EFFECT_FACE_ADD_CURSE",a.EFF_RMCUR="EFFECT_REMOVE_CURSE",a.EFF_REPLCUR="EFFECT_REPLACE_CURSE";let N=[e.DICE_FIR,e.DICE_HEA,e.DICE_GRO],U=[e.HERB_SPA,e.HERB_BRA,e.HERB_SPE],k=[e.HERB_SPA,e.HERB_BRA],Y=[e.HERB_SPE],x=[e.REAG_SUN,e.REAG_SKY],$=[e.REAG_SUN],M=[e.REAG_SKY],W=[e.POT_GRO,e.POT_POW,e.POT_LIQ,e.POT_COL,e.POT_DRA,e.POT_MIA,e.POT_TIN,e.POT_ANT],V=[e.BP_SPA,e.BP_BRA,e.BP_SPE],j={[e.REAG_SUN]:2,[e.REAG_SKY]:3},K={[e.POT_GRO]:[e.REAG_SUN,e.REAG_SUN],[e.POT_EMP]:[e.HERB_SPA,e.REAG_SUN],[e.POT_POW]:[e.HERB_SPA,e.HERB_SPA,e.REAG_SUN],[e.POT_LIQ]:[e.HERB_BRA,e.HERB_SPA,e.REAG_SUN,e.REAG_SUN],[e.POT_COL]:[e.HERB_BRA,e.REAG_SKY],[e.POT_DRA]:[e.HERB_SPA,e.HERB_SPE,e.REAG_SKY],[e.POT_MIA]:[e.HERB_SPA,e.HERB_SPA,e.HERB_SPE,e.REAG_SKY],[e.POT_TIN]:[e.HERB_BRA,e.HERB_SPE,e.REAG_SKY],[e.POT_ANT]:[e.HERB_SPE,e.HERB_SPE,e.REAG_SUN,e.REAG_SKY]};(r=t||(t={})).FUNC_H1="HERB1",r.FUNC_H2="HERB2",r.FUNC_H3="HERB3",r.FUNC_H_ANY="HERB",r.FUNC_R1="REAG1",r.FUNC_R2="REAG2",r.FUNC_R_ANY="REAG",r.FUNC_P1="POT1",r.FUNC_P_ANY="POT",r.FUNC_G="GOLD",r.FUNC_FIRE="FIRE",r.FUNC_HEART="HEART",r.FUNC_GROW="GROW",r.FUNC_ING="ING",(l=o||(o={})).HAS_RES="HAS",l.HAS_ING="HAS_I";let z="\uD83C\uDF3F",Q="\uD83E\uDDEA",q="\uD83E\uDDF4",X="\uD83D\uDD25",J="♥️",Z=`<${u} style="filter: grayscale(75%)">🐈‍⬛</${u}>`,ee="\uD83C\uDF31",et="\uD83C\uDFB2",eo="\uD83D\uDC80",ea={[e.DICE_FIR]:{l:"Fire Magic",icon:X,dsc:"Fends off your enemies."},[e.DICE_HEA]:{l:"Heart Magic",icon:J,dsc:"Guides situations and people."},[e.DICE_GRO]:{l:"Grow",icon:ee,dsc:"Grows your magical garden."},[e.DICE_ANY]:{l:"Any",icon:et,dsc:"Any magic dice."},[e.DICE_BLA]:{l:"Blank",icon:"✖️",dsc:"A blank dice face."},[e.DICE_CUR]:{l:"Curse",icon:eo,dsc:"Auto fails spells."},[e.GOLD]:{l:"Gold",icon:"\uD83D\uDCB0",dsc:"Merchants love it."},[e.HERB_SPA]:{l:"Sparkleweed",icon:z,dsc:"A glittery weed."},[e.HERB_BRA]:{l:"Bramberry",icon:n(z,90),dsc:"Magical berries."},[e.HERB_SPE]:{l:"Specialpetal",icon:n(z,248),dsc:"Rare flower for rare potions."},[e.REAG_SKY]:{l:"Sky Dust",icon:Q,dsc:"Common dust collected on magical clouds."},[e.REAG_SUN]:{l:"Sun Powder",icon:n(Q,180),dsc:"Rare ground-up sunbeams."},[e.POT_COL]:{l:"Cold Cure",icon:q,dsc:"Cures colds."},[e.POT_DRA]:{l:"Dragon Sweat",icon:q,dsc:"Antifire."},[e.POT_MIA]:{l:"Night Miasma ",icon:q,dsc:"Sleep potion."},[e.POT_TIN]:{l:"Taste Tinc",icon:q,dsc:"Yummy."},[e.POT_EMP]:{l:"Empathy Pot",icon:q,dsc:"More hearts."},[e.POT_LIQ]:{l:"Liquid Luck",icon:q,dsc:"Grants luck."},[e.POT_POW]:{l:"Power Potion",icon:q,dsc:"More magic."},[e.POT_GRO]:{l:"Growth Pot",icon:q,dsc:"Increases yields."},[e.POT_ANT]:{l:"NoCurse Pot",icon:q,dsc:"Removes curses."},[e.C_VIL]:{l:"Contract",icon:"\uD83D\uDCC3",dsc:"A simple request."},[e.FAV_CAT]:{l:"Cat's Favor",icon:Z,dsc:"Your standing with the Black Cat."},[e.BP_SPA]:{l:"Seed of Sparkleweed",icon:ee,dsc:"Additional Sparkleweed seed bed."},[e.BP_BRA]:{l:"Seed of Bramberry",icon:ee,dsc:"Additional Bramberry seed bed."},[e.BP_SPE]:{l:"Seed of Specialpetal",icon:ee,dsc:"Additional Specialpetal seed bed."},[e.DICE_NEW]:{l:"Magic Dice",icon:et,dsc:"A new magic dice."},[e.EFF_COL]:{l:"Cold",icon:"\uD83E\uDD27",dsc:"You have a cold."},[e.EFF_GRE]:{l:"Green Thumbs",icon:ee,dsc:"Your thumbs are bright green."},[e.EFF_FFIR]:{l:"Fire Dice Face",icon:X,dsc:`Gained a ${X} face.`},[e.EFF_FHEA]:{l:"Heart Dice Face",icon:J,dsc:`Gained a ${J} face.`},[e.EFF_FGRO]:{l:"Grow Dice Face",icon:ee,dsc:`Gained a ${ee} face.`},[e.EFF_FCUR]:{l:"Curse Dice Face",icon:eo,dsc:`Gained a ${eo} face.`},[e.EFF_RMCUR]:{l:"Remove Curse",icon:eo,dsc:"Removed a curse."},[e.EFF_REPLCUR]:{l:"Curse!",icon:eo,dsc:"A curse replaces a face."}},er=(e,t=!1)=>{let o=[];for(let a of[...U,...x]){let r=e.filter(e=>e===a).length;if(r>0)if(t){let e=ea[a];o.push(`${r}${e.l.slice(0,3)}${e.icon}`)}else o.push(`${r} ${a}`)}return o};for(let e in ea)ea[e].icon=`<${u} class="icon">${ea[e].icon}</${u}>`;for(let e of[...W]){let t=er(K[e],!0);ea[e].dsc+=`${h}<${u} style="font-size: 14px">${t.join(",")}</${u}>`}let el=["Giant Frog","Giant Spider","Medusa","Cyclops","Ogre","Troll","Phoenix","Hydra","Minotaur","Griffon","Golem","Wraith","Demon","Lich","Giant","Wyrm"],es=(t,o)=>{eN(t.ui.eventModal,{id:"1",type:"m",p:o??"You close up your shop for the day."},{event:t.events[t.day],evalVars:{},currentChildId:"1"},t);let a=_("p",{class:"moon-anim"});A(t.ui.eventModal.content,a);for(let e=0;e<1;e++)A(t.ui.eventModal.content,_("br"));let r=[..."\uD83C\uDF15\uD83C\uDF15\uD83C\uDF15\uD83C\uDF15\uD83C\uDF16\uD83C\uDF17\uD83C\uDF18\uD83C\uDF11\uD83C\uDF12\uD83C\uDF13\uD83C\uDF14\uD83C\uDF15\uD83C\uDF15\uD83C\uDF15\uD83C\uDF15"];for(let e=0;e<r.length;e++)T(100*e).then(()=>{a[p]=r[e],eU(t.ui.eventModal)});t.day++,T(100*r.length).then(()=>{a.remove();let r=_("p",{[p]:"---<br>Day "+t.day});A(t.ui.eventModal.content,r),eU(t.ui.eventModal),o||eB(t.ui.calendar),console.log("ADVANCE DAY",t.day,t.events[t.day]),0===eg(t,e.FAV_CAT)?F(t,s):F(t,t.events[t.day])})},ei=e=>e0(e),en=async(t,o,a=!1)=>{let r=[],l=[],s=!1,i="orange";for(let n of t){let t=a?o[0]:ei(n.dice);l.push(eb(n.elem,t,600,2).then(()=>{let a=ea[t].icon;eL(n.elem,a);let r=o.includes(t)?"green":"red",l=o.includes(t)?"green":"unset";t===e.DICE_CUR&&(s=!0),s&&(r=i,l=i),m(n.elem.root,{borderColor:r,background:l})})),await T(250),r.push(t)}if(await Promise.all(l),s){for(let e of t)m(e.elem.root,{borderColor:i,background:i});for(let t=0;t<r.length;t++)r[t]=e.DICE_CUR}return r},ec=(t,o,a,r,l)=>{let s=(e,o)=>{for(let a of t.magicDice)for(let t=0;t<a.length;t++)if(a[t]===e)return a[t]=o,!0;return!1},i=(o,a)=>{if(!s(o,a))if(a===e.DICE_CUR&&o===e.DICE_BLA)s(o,e0(N));else{let e=eA();t.magicDice.push(e),s(o,a)}};if(console.log(" modifying",r,l),r===e.C_VIL){let e=ef(o.event),a=t.events.indexOf(o.event);t.events.splice(a+7,0,e.event)}else r===e.DICE_NEW?t.magicDice.push(e_()):r===e.EFF_RMCUR?i(e.DICE_CUR,e.DICE_BLA):r===e.EFF_FFIR?i(e.DICE_BLA,e.DICE_FIR):r===e.EFF_FHEA?i(e.DICE_BLA,e.DICE_HEA):r===e.EFF_FGRO?i(e.DICE_BLA,e.DICE_GRO):r===e.EFF_FCUR?i(e.DICE_BLA,e.DICE_CUR):r===e.EFF_REPLCUR?i(e0([e.DICE_FIR,e.DICE_HEA,e.DICE_GRO]),e.DICE_CUR):r===e.EFF_COL?T(1).then(()=>{es(t,"You take a day to rest and recover.")}):(eR(t,r,l),V.includes(r)&&(t.vars.avblBlueprints=t.vars.avblBlueprints.filter(e=>e!==r)))},ed=(t,o)=>{let a=[];for(let[t,r]of Object.entries({...j}))a.push({text:`<b class="shop">Buy 1 ${t} (${r} ${e.GOLD})</b>`,n:"buy_"+t,conditionText:`HAS(${r} ${e.GOLD})`}),o.event.children.push({id:"buy_"+t,type:"m",p:`You buy ${t} for ${r} ${e.GOLD}.`,mod:[`-${r} ${e.GOLD}`,"1 "+t],n:"merch",fastScroll:!0});for(let r of U)t.res.includes(r)&&(a.push({text:`<b class="shop">Sell 1 ${r} (1 ${e.GOLD})</b>`,n:"sell_"+r}),o.event.children.push({id:"sell_"+r,type:"m",p:`You sell 1 ${r} for 1 ${e.GOLD}.`,mod:["-1 "+r,"1 "+e.GOLD],n:"merch",re:!0,fastScroll:!0}));a.push({text:"Go back.",n:"day"}),o.event.children.push({id:"merch",type:"m",p:'"Whaddya want?"',choices:a,fastScroll:!0})},eu=(e,t)=>{let o=[];for(let[a,r]of Object.entries({...K})){let l=er(r);eg(e,a),o.push({text:`${a}:${h}${l.join(h)}`,n:"b_"+a,conditionText:l.map(e=>`HAS(${e})`).join(",")}),t.event.children.push({id:"b_"+a,type:"m",p:`You make a ${a}.`,mod:[...l.map(e=>"-"+e),"1 "+a],n:"pot",re:!0,fastScroll:!0})}o.push({text:"Go back.",n:"day"}),t.event.children.push({id:"pot",type:"ch",p:"At the mixing table you can concoct magical potions.",flex:!0,choices:o,fastScroll:!0})},eh=(e,t)=>{let o=W.map(t=>({res:t,count:eg(e,t)}));t.event.children.push({id:"inv",type:"m",p:"Here's what you have:"+o.map(e=>` ${h}${e.res} (${e.count})`).join(""),n:"day"})},ep=(t,o)=>{t.magicDice.some(t=>t.some(t=>t===e.DICE_CUR))&&(o.event.children.find(e=>"day"===e.id).choices.push({text:"Use 1 POT_ANTI_CURSE to remove a curse.",n:"noc",conditionText:`HAS(1 ${e.POT_ANT})`}),o.event.children.push({id:"noc",type:"m",p:"Use 1 POT_ANTI_CURSE to remove a curse.",mod:["-1 "+e.POT_ANT,"1 "+e.EFF_RMCUR],n:"day",re:!0}))},ef=t=>{let o=t.vars["@A"].parsed;return O({title:"The villager returns",icon:"\uD83D\uDCDC",children:[{id:"0",type:"ch",p:"The villager from last week returns to collect their promised potion:"+h+o,choices:[{text:"Give them the potion.",n:"1",conditionText:`HAS(${o})`},{text:"Say you cannot help. The Black Cat will be most displeased.",n:"2"}]},{id:"1",type:"m",p:"You sell the potion to the villager.",mod:["-"+o,"7 GOLD"],n:"e"},{id:"2",type:"m",p:"The disappointed villager leaves.",mod:["-2 "+e.FAV_CAT],n:"e"}]})},eE=t=>{let o=i(t),a=o.children.find(e=>"ch"===e.id),r=[e.EFF_FFIR,e.EFF_FHEA,e.EFF_FGRO];return a.choices=[{text:"1 Random Dice Upgrade",n:"dice"}],o.children.push({id:"dice",type:"m",p:"The Black Cat's eyes glow, and you feel a new power within you.",mod:["1 "+e0(r)],n:"e"},{id:"bed",type:"m",p:"The cat blinks and you have a new seed bed.",mod:["1 "+e.BP_SPE],n:"e"}),o};addEventListener("load",async()=>{let t=em();window.state=t;let o=eI(30);A(E(),o.root),t.ui.calendar=o;let a=eq();t.ui.res=a,A(E(),a.root),eX(a,t);let r=eK();A(E(),r.root),ez(r,e.DICE_FIR),t.ui.hoverDescription=r;let l=ev();A(E(),l.root),t.ui.favorMeter=l.favorMeter,((t,o)=>{let a=e=>o.find(t=>t.title===e),r=a("The Game"),l=a("Villager Contract"),n=a("The Black Cat"),c=a("Demonic Deal"),d=a("Attack!"),u=a("Herb Merchant"),h=a("The Final Test"),p=a("True Witch"),f=[r,l,n,c,d,u,h,p,s=a("Expulsion")],E=o.filter(e=>!f.includes(e)),m=[];for(let e=0;e<7;e++){let t=e<3?1:e<6?2:3,o=e0(el),a=i(d);for(let e of a.children)e.p=e.p?.replace("monster","<b>"+o+"</b>");a.vars["@A"]={str:`FIRE(${t})`,parsed:void 0},E.push(a),m.push(a)}for(let e=0;e<4;e++){let e=i(u);E.push(e)}let _=[e.EFF_FFIR,e.EFF_FHEA,e.EFF_FGRO],A=[e.DICE_FIR,e.DICE_HEA,e.DICE_GRO];for(let e=0;e<3;e++){let e=i(c),t=e0(_),o=A[_.indexOf(t)];e.vars["@C"]={str:"1 "+t,parsed:void 0},e.vars["@A1"]={str:"1 "+o,parsed:void 0},E.push(e)}let y=E.sort(()=>Math.random()-.5),R=0;for(let e=0;e<y.length;e++)y[e].title===d.title&&(y[e]=m[R],R++);for(let e=0;e<4;e++){let t=i(l);y.splice(4*e+e2(0,6),0,t)}for(let e=0;e<4;e++){let t=eE(n);y.splice(7*e+4,0,t)}let g=i(r);g.children.slice(-2)[0].mod=["3 "+e.GOLD,"1 "+e.HERB_SPA,"1 "+e.HERB_BRA,"1 "+e.REAG_SKY,"1 "+e.REAG_SUN,"1 "+e.POT_LIQ];let C=[g,...y].slice(0,29);C.push(h,p),console.log("SETUP EVENTS",g,C),t.events=C})(t,function(e){let t=[],o=e.trim().split("\n"),a=[],r=e=>{try{let o=function(e){let t={lines:e3(e.trim(),"\n").filter(e=>e.length>0),currentLine:0},o=t.lines[t.currentLine];if(!v(o,"#"))throw 1;let a=o.match(/^#(.+?),(.+)$/);if(!a)throw 1;let r=a[1].trim(),l=a[2].trim();t.currentLine++;let s=[],i={title:r,icon:l,children:s,vars:{}};for(;t.currentLine<t.lines.length;){let e=function(e,t){if(e.currentLine>=e.lines.length)return null;let o=e.lines[e.currentLine];if(v(o,"@")){let a=o.match(/^(@.+)=(.+)$/);if(!a)throw 1;let r=a[1].trim(),l=a[2].trim();return t.vars[r]={str:l,parsed:void 0},e.currentLine++,null}if(!v(o,">"))return e.currentLine++,null;let a=o.match(/^>([\d\w]+|[a-z]),(\w+):?$/);if(!a)throw 1;let r=a[1],l=a[2];e.currentLine++;let s={id:r,type:l};for(;e.currentLine<e.lines.length;){let t=e.lines[e.currentLine];if(v(t,">"))break;if(v(t,"+p:"))s.p=t.slice(3).trim();else if(v(t,"+c:")){if("ch"!==s.type)throw 1;s.choices||(s.choices=[]);let e=function(e){let[t,o,a]=e3(e.slice(3),"|");return{text:o,conditionText:a,n:t}}(t);s.choices.push(e)}else if(v(t,"+d:")){s.rolls||(s.rolls=[]);let e=function(e){let t=e.match(/^\+d:(.+)$/);if(!t)throw 1;let o=e3(t[1].trim(),"|"),a=[];for(let e of o){let t=e.match(/^(.*)$/);if(!t)throw 1;let o=t[1];a.push(o)}return a}(t);s.rolls.push(...e)}else if(v(t,"+pass:"))s.pass=t.slice(6).trim();else if(v(t,"+fail:"))s.fail=t.slice(6).trim();else if(v(t,"+add:")||v(t,"+rem:")){s.mod||(s.mod=[]);let e=function(e){let t=v(e,"+add:"),o=v(e,"+rem:");if(!t&&!o)throw 1;let a=e3(e.slice(t?5:6).trim(),"|"),r=[];for(let e of a){let t=e.match(/^(.*)$/);if(!t)throw 1;let a=t[1];r.push(o?"-"+a:a)}return r}(t);s.mod.push(...e)}else if(v(t,"+n:")){if("ch"===s.type)throw console.error(s,t),1;s.n=t.slice(3).trim()}e.currentLine++}return s}(t,i);e&&s.push(e)}return i}(e);t.push(o)}catch(e){console.warn("Failed to parse last event:",e)}};for(let e of o){let t=e.trim();v(t,"#")&&a.length>0?(r(a.join("\n")),a=[t]):a.push(t)}return a.length>0&&r(a.join("\n")),t}(`#The Game,🐈‍⬛
>0,ch
  +p: "Hello, dear witch. I am your familiar, the Black Cat. It is from me that you get your magic. Ensure you keep me satisfied, lest you risk losing my favor."
  +c: 1|Continue.
  +c: 4|I already know what to do.
>1,d
  +p: "I have provided you with a magic dice. Hover over it to see its faces. There are three kinds of magic."

- DICE_FIRE_MAGIC is for fending off your enemies.
- DICE_HEART_MAGIC is for affecting people.
- DICE_GROW is for growing your garden.
  +dice: 1 ANY
  +pass: 2
  +fail: 2
>2,m
  +p: "I am tasking you with running a potion shop: each day you will harvest magical herbs, mix potions, and deal with the many problems of the nearby villagers."

- You get <b>Herbs</b> by growing them in your garden.
- You get <b>Reagents</b> by buying them from a merchant.
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
  +p: An old wizard enters your shop. He challenges you to a duel, promising a great reward.

If you win: the wizard can teach you a new spell, and you get @A.
If you lose, the wizard takes @B.

You can sense the Black Cat observing you.
  +c: 1|Accept! This guy's going down.
@A
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
  +p: Your spells clash in magnificent glory, and when the smoke clears you stand triumphant! The defeated wizard teaches you a new spell.

You can feel that the Black Cat appreciates your victory.
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
  +c: 1|Use your magic to threaten the gnome, but you may damage the herbs...
@A
  +c: 2|Entice the gnome to give back the herbs.
@B
  +c: fail|Let him take @C, but at least there'll be no ruckus.
>1,d
  +p: You raise your hand and aim at the little fellow.
  +dice: @A
  +pass: 1pass
  +fail: fail2
>1pass,m
  +p: The gnome drops your herbs and runs off, but errant fire damages your garden.

In his haste, he dropped some gold on the ground.
  +rem: @D
  +add: @R1
  +n: e
>2,d
  +p: You call out to the gnome and attempt wrap your words with your magic.
  +dice: @B
  +pass: 2pass
  +fail: fail2
>2pass,m
  +p: The gnome timidly hands over the herbs and scampers off.

You notice some coins on the ground. He must have felt bad.
  +add: @R2
  +n: e
>fail,m
  +p: @L
  +rem: @C
  +n: e
>fail2,m
  +p: @L

The Black Cat is displeased with your failure.
  +rem: @C
  +rem: @E
  +n: e

#Unfortunate Evil,💀
@A=1 EFFECT_REPLACE_CURSE
>0,m
  +p: Abruptly, an undead creature steps into your shop, raises a bony finger at you, and zaps you with a dark lightning.

The pain of it causes you to pass out. When you awaken, the creature is gone, but you feel... off.

Such is the peril of being a witch.
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
  +p: A villager rushes into your shop. "My pet dragon!", he says, "He's injured. Can you help?"

You walk outside to see an irritated, tiny dragon with a gash across his body. Smoke streams from its nostrils, ready to burn anything that comes too close.
  +n: 0
>0,ch
  +p: You know you can do this if you can get close. You can sense the Black Cat observing you.
  +c: 1|Try to calm the dragon down. @A
  +c: 2a|You have @B1; @L2|HAS(@B1) 
  +c: 2b|You can mix
@B1. @L2|HAS_I(@B1)
  +c: 3|Sorry, dragons are too dangerous.
>1,d
  +p: Carefully you step towards the dragon, readying your magic.
  +dice: @A
  +pass: 1pass
  +fail: 1fail
>1pass,m
  +p: Your soothing energy calms the dragon, and he lets you approach. You're able to bandage his wounds.

You feel like your magic is getting stronger.
  +add: @C
  +add: 1 EFFECT_FACE_ADD_HEART
  +n: e
>1fail,m
  +p: The angry dragon flails and breaths crazy amounts fire. You barely manage to escape unscathed!

The villager rushes him away, shouting about how much you upset his pet.

After this debacle, you know the Black Cat is very displeased with you.
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
  +p: "Some witch you are!"

The villager spits at you and leaves with his dragon.

You can sense the Black Cat's displeasure.
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
  +p: You drink @A and feel better.

...@L
  +rem: @A
  +add: 1 EFFECT_GREEN_THUMB
  +n: e
>3,m
  +p: You mix @A and drink it.

You feel better.

...@L
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
  +p: A costumed man dashes into your shop.

"Give me all your money or I'll curse you!"
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
  +p: He has a trick up his sleeve. He raises his hands and, after a flash, you fall to the ground, feeling ill!

 After a struggle, you are barely able to fend him off and he leaves.
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
  +c: 1a|@L2
@A.|HAS(@D)
  +c: 1b|@L2
@B.|HAS(@D)
  +c: 1c|@L2
@C.|HAS(@D)
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
.  +c: 1|Trade @A1 for
@A2.|HAS(@A1)
.  +c: 2|Trade @B1 for
@B2.|HAS(@B1)
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
  +c: 1|Fend off the monster with your magic.
@A
  +c: 2|Maybe diplomacy will work this time.
@B
>1,d
  +p: You prepare to launch a spell at the monster.
  +dice: @A
  +pass: 1pass
  +fail: 1fail
>1pass,m
  +p: With the villagers help, you manage to fend off the monster.

@. 
  +add: 5 GOLD
  +n: e
>1fail,m
  +p: Your spell is not enough, and after a long battle, the monster is finally fended off by the villagers. Bedraggled and exhausted, you return to your shop.

The Black Cat is displeased with your performance.
  +rem: @C
  +n: e
>2,d
  +p: With eyes closed, you reach out to the monster's chaotic mind with your magic.
  +dice: @B
  +pass: 2pass
  +fail: 1fail
>2pass,m
  +p: Your spell sooths the monster just enough for you to get it to decide to leave peacefully.

@L
  +add: @C
  +n: e

#Villager Contract,📜
@A=POT1(1)
@B=9 GOLD
@C=1 FAVOR_CAT
@D=ING(@A)
>0,ch
  +p: A villager comes to your shop and requisitions a potion:

@A.
  +c: 1|Sell the potion for
@B.|HAS(@A)
  +c: 2|You can mix it and sell it right now for
@B.|HAS_I(@A)
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
  +p: You notice a pair of eyes watching you from the shadows. When you turn to stare, a smiling demon reveals itself.

"Would you like a deal, my dear?"
  +c: 1|Add @A1
AND
add @A2.
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
  +p: The Black Cat suddenly appears.

"Tribute. @A. I demand it."
  +c: 1|Give the gold to the Black Cat.|HAS(@A)
  +c: fail|Say that you can't.
>1,m
  +p: With a mischievous grin, The Black Cat gathers the gold.

"Much appreciated, now I shall grant you a boon."
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
  +p: The Black Cat suddenly appears.

"I have a final test for you. Demonstrate your magic to me."
  +c: 1|Cast a threatening fire spell.
@A
  +c: 2|Cast a soothing heart spell.
@B
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
  +p: The Black Cat appears in front of you and stares you down with disappointed eyes.

"I now see that you are not worthy of witchhood."

A tugging, a pulling, a ripping sensation engulfs you, tearing out a piece of you, eviscerating your sense of self. You're left unconscious, on the ground with nothing.

You are no longer a witch.
  +c: 1|Try again.
  +c: 2|Quit.|HAS(999 GOLD)

#True Witch,🐈‍⬛
>0,ch
  +p: "That's enough," says the Black Cat. "I'm pleased with you. You may keep your magic."

Congratulations! You've completed the game.

Would you like to play again?
  +c: 1|Yes.
  +c: 2|No.|HAS(999 GOLD)`.replaceAll("\\n","<br>"))),console.log("game events",t.events),t.day=0,eO(t.ui.calendar,0);for(let o=0;o<3;o++)t.res.push(e.FAV_CAT);F(t,t.events[0])});let em=()=>{let t={events:[],day:0,res:[],magicDice:[e_()],harvestRoll:[],ui:{},vars:{avblBlueprints:[e.BP_SPE]}};return t.res.push(e.BP_SPA,e.BP_BRA),t},e_=()=>[e.DICE_FIR,e.DICE_FIR,e.DICE_HEA,e.DICE_HEA,e.DICE_GRO,e.DICE_GRO],eA=()=>{let t=[];for(let o=0;o<6;o++)t.push(e.DICE_BLA);return t},ey=()=>{let t=[];for(let o=0;o<6;o++)t.push(e.DICE_GRO);return t},eR=(e,t,o)=>{let a=Math.abs(o);for(let r=0;r<a;r++)if(o>0)e.res.push(t);else{let o=e.res.indexOf(t);-1!==o&&e.res.splice(o,1)}},eg=(e,t)=>e.res.filter(e=>e===t).length,eC=(e,t,o)=>eg(e,t)>=o,eT=t=>{for(let o of Object.values(e))if(t===o)return o;throw 1},ev=()=>{let e=_("div",{class:"bottom-bar flxcr"}),t=e$();return A(e,t.root),eM(t,5),{root:e,favorMeter:t}},eF="calendar-square-active",eD=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],eI=e=>{let t=_("div",{});m(t,{width:`${48*e}px`});let o=_("div",{});m(o,{transition:"transform 0.3s ease-in-out"}),A(t,o);for(let t=0;t<e;t++)A(o,_("div",{class:"calendar-square",[p]:`${t+1}. ${eD[t%7]}`}));return{root:t,subRoot:o,day:0}},eO=(e,t)=>{e.day=t-1,eB(e)},eB=e=>{e.day++,e.subRoot.style.transform=`translateX(-${48*e.day}px)`;let t=e.subRoot.children[e.day];t&&t.classList.add(eF);let o=e.subRoot.children[e.day-1];o&&o.classList.remove(eF)},eP=`<${u} class="icon">❓</${u}>`,ew=(e,t,o=eP)=>{let a=_("div",{class:"dice"}),r=()=>{eQ(e.ui.hoverDescription,t)};g(a,f,r),g(a,"mouseover",r);let l=_("div",{class:"flxcr wh",[p]:o});return A(a,l),{root:a,subRoot:l}},eL=(e,t)=>{e.subRoot[p]=t},eb=(e,t,o,a)=>new Promise(r=>{m(e.root,{animation:`spin ${o/a}ms linear ${a}`}),eL(e,eP),setTimeout(()=>{m(e.root,{animation:""}),eL(e,t),r()},o)}),eG=e=>{let t=_("div",{id:"event-modal",class:"modal"}),o=_("div",{class:"event-content btext"}),a={root:t,content:o,choices:_("div",{class:"event-next"}),next:_("div",{class:"event-next"}),diceButtons:[],diceElements:[]};return eS(a,e),A(o,a.choices),A(o,a.next),A(t,a.content),a},eS=(e,t)=>{let{content:o}=e,a=t.event.icon;"\uD83D\uDC08‍⬛"===a&&(a=Z),a&&A(o,_("div",{class:"event-title-icon",[p]:a})),t.event.title&&A(o,_("p",{class:"event-title-text",[p]:t.event.title}))},eH=(e,t)=>{let o=P(t.resource,eZ),a=t.amt>0,r=isNaN(t.amt)?"all":t.amt;A(e,ex(`${a?"+"+r:r} ${o}`))},eN=(t,o,a,r)=>{let{content:l,choices:s,next:n}=t,{event:c}=a;if(y(n),n.remove(),y(s),s.remove(),A(l,_("p",{[p]:o.p})),"garden"===o.type&&A(l,eW(r,a).root),o.rolls){let s=o.parsedRolls[0]===e.DICE_ANY,c=_("p",{[p]:s?"Try it out!":"To pass: "});for(let e of(A(l,c),o.parsedRolls))A(c,_(u,{[p]:ea[e].icon}));t.diceElements=[];let d=i(r.magicDice);for(let e=0;e<r.magicDice.length;e++){let o=ew(r,d[e]);t.diceElements.push(o),A(l,o.root)}eY(t,o,a,r,{isAny:s,diceToRoll:d}),A(l,n)}if(o.parsedMod)for(let e of o.parsedMod)eH(l,e);if(console.log("RENDER GAME CHILD",o),o.n){let e=_(d,{class:eJ,[p]:"e"===o.n?"Done":"Next"});g(e,f,()=>{let e=I(a,o.n);D(r,a,e)}),A(n,e),A(l,n)}if(o.choices){for(let e of(o.flex&&m(s,{display:"flex",flexWrap:"wrap",gap:"2px"}),o.choices)){let t=!e?.parsedCondition(),i={class:eJ,[p]:e.text};t&&(i.disabled="disabled");let n=_(d,i);o.flex&&(C(n,"class",eJ+" event-choice-flex"),m(n,{width:"49%",textDecoration:"none"})),g(n,f,()=>{A(l,ex(e.text));let t=I(a,e.n);D(r,a,t)}),A(s,n)}A(l,s)}eU(t,!o.fastScroll)},eU=(e,t=!0)=>{e.content.scrollTo({top:e.content.scrollHeight,behavior:t?"smooth":"auto"})},ek=async(t,o,a,r,l)=>{let{content:s,diceButtons:i,diceElements:n}=t;for(let e=0;e<i.length;e++)i[e].disabled=!0;let c=l.diceToRoll.slice(),d=await en(c.map((e,t)=>({dice:e,elem:n[t]})),r.parsedRolls,l.useLuck),u=!0;for(let e of r.parsedRolls){let t=d.indexOf(e);if(-1===t){u=!1;break}d.splice(t,1)}T(1e3).then(()=>{A(s,_("p",{[p]:l.isAny?"":u?"Pass!":"Fail!"})),l.useLuck&&(eR(a,e.POT_LIQ,-1),eH(s,{amt:-1,resource:e.POT_LIQ})),l.usePower&&eH(s,{amt:-1,resource:e.POT_POW}),l.useEmpathy&&eH(s,{amt:-1,resource:e.POT_EMP});for(let e=0;e<i.length;e++)i[e].remove();let t=I(o,u?r.pass:r.fail);D(a,o,t)})},eY=(t,o,a,r,l)=>{let s={isAny:l.isAny,useLuck:!1,useDouble:!1,usePower:!1,useEmpathy:!1,diceToRoll:l.diceToRoll};t.diceButtons=[];let{next:i,content:n}=t,c=_(d,{class:eJ,[p]:"Roll."});g(c,f,()=>{ek(t,a,r,o,s)}),A(i,c),t.diceButtons.push(c);let u=eg(r,e.POT_LIQ),h=eg(r,e.POT_POW),E=eg(r,e.POT_EMP);if(!l.isAny){if(u>0){let l=ea[e.POT_LIQ],n=_(d,{class:eJ,[p]:`Use a ${l.l}${l.icon}<br>(all rolls meet reqs).`});g(n,f,()=>{ek(t,a,r,o,{...s,useLuck:!0})}),A(i,n),t.diceButtons.push(n)}if(h>0){let o=_(d,{class:eJ,[p]:`Use a ${ej(e.POT_POW,eZ)}<br>(1 additional dice).`});g(o,f,()=>{o.disabled=!0;let a=e_(),l=ew(r,a,"✨");t.diceElements.push(l),t.content.insertBefore(l.root,t.next),s.diceToRoll.push(a),eR(r,e.POT_POW,-1),s.usePower=!0}),A(i,o),t.diceButtons.push(o)}if(E>0){let o=ej(e.DICE_GRO,eZ),a=ej(e.DICE_HEA,eZ),l=_(d,{class:eJ,[p]:`Use a ${ej(e.POT_EMP,eZ)}<br>(tmp convert ${o} to ${a}).`});g(l,f,()=>{l.disabled=!0,eR(r,e.POT_EMP,-1);for(let t=0;t<s.diceToRoll.length;t++){let o=s.diceToRoll[t];for(let t=0;t<o.length;t++)o[t]===e.DICE_GRO&&(o[t]=e.DICE_HEA)}for(let e=0;e<t.diceElements.length;e++)t.diceElements[e].subRoot[p]=J;s.useEmpathy=!0}),A(i,l),t.diceButtons.push(l)}}},ex=e=>_("p",{[p]:e,class:"event-chosen-text wtext"}),e$=()=>{let e=_("div",{class:"favor-meter"});A(e,_("div",{[p]:"Black Cat's Favor"}));let t=_("div",{class:"favor-meter-sub"});return m(e,{width:"168px"}),A(e,t),{root:e,subRoot:t}},eM=(e,t)=>{y(e.subRoot);for(let o=0;o<Math.min(7,t);o++){let t=_("div",{[p]:Z});A(e.subRoot,t)}},eW=(t,o)=>{let a=t.res.filter(e=>V.includes(e)),r=_("div",{class:"garden"}),l=[],s=[],i=eg(t,e.EFF_GRE)>0;for(let e of a){let o=_("div",{class:"garden-slot"}),a=_("div",{[p]:ea[e].l,class:"garden-label"}),s=_("div",{class:"garden-dice-container"}),i=_("div",{class:"garden-dice-list"}),n=_("div",{class:"garden-dice-result flxcr"});A(o,a),A(o,s),A(s,i),A(s,n),A(r,o);let c=[...t.magicDice],d=[];for(let e=0;e<c.length;e++){let o=ew(t,c[e]);d.push(o),A(i,o.root)}l.push({magicDice:c,diceList:d,type:e,resultArea:n,gardenDiceList:i})}if(i){let t=ea[e.EFF_GRE];A(r,_("p",{class:eJ,[p]:`Your ${t.l}${t.icon} will let you harvest double.`}))}let n=async()=>{for(let e of s)e.disabled=!0;eR(t,e.EFF_GRE,-1);let a=[];for(let t of l)a.push(en(t.magicDice.map((e,o)=>({dice:e,elem:t.diceList[o]})),[e.DICE_GRO]));let n=((t,o,a=1)=>{console.log("HARVEST",t,o,a);let r=[];for(let l of o){let o=l.diceResults.filter(t=>t===e.DICE_GRO).length;r.push(o*a);for(let e=0;e<o*a;e++)t.res.push(l.resourceType)}return eX(t.ui.res,t),r})(t,(await Promise.all(a)).map((t,o)=>({resourceType:(t=>{switch(t){case e.BP_SPA:return e.HERB_SPA;case e.BP_BRA:return e.HERB_BRA;case e.BP_SPE:return e.HERB_SPE;default:throw 1}})(l[o].type),diceResults:t})),i?2:1);for(let e=0;e<n.length;e++)l[e].resultArea[p]="+"+n[e];for(let e of(await T(1e3),s))e.remove();A(r,ex("Harvest")),D(t,o,o.event.children[1])},c=_(d,{class:eJ,[p]:"Harvest"});if(g(c,f,n),A(r,c),s.push(c),eg(t,e.POT_GRO)>0){let o=ej(e.DICE_GRO,eZ),a=_(d,{class:eJ,[p]:`Use a ${ej(e.POT_GRO,eZ)}<br>(adds 1 all ${o} dice).`});g(a,f,()=>{for(let o of(eR(t,e.POT_GRO,-1),l)){let e=ey(),a=ew(t,e,ee);o.diceList.push(a),o.magicDice.push(e),A(o.gardenDiceList,a.root)}a.disabled=!0}),A(r,a),s.push(a)}return{root:r,slots:l,harvestButtons:s}},eV=(e,t)=>{let o=(e=>{let t=e.lastIndexOf(">");for(let o in t>-1&&(e=e.slice(t+1)),ea)if(ea[o].l.toLowerCase()===e.toLowerCase())return o})(e),a=`hl('${o}', this)`;return`<${u} class="highlight-text" style="color: ${t};" ontouchstart="${a}" onclick="${a}" onmouseover="${a}" onmouseout="${a}" >${e}</${u}>`};window.hl=(e,t)=>{for(let e of document.getElementsByClassName("highlight-text"))m(e,{"text-decoration":"none"});m(t,{"text-decoration":"underline"}),ez(window.state.ui.hoverDescription,e)};let ej=(e,t)=>{let o=ea[e];return eV(o.l,t)+o.icon},eK=()=>({root:_("div",{class:"hover-desc"})}),ez=(e,t)=>{let o=ea[t];y(e.root);let a=_(u,{class:"hover-desc-label",[p]:o.l+o.icon+": "});A(e.root,a);let r=_(u,{class:"hover-desc-dsc",[p]:o.dsc});A(e.root,r)},eQ=(e,t)=>{y(e.root);let o=_("div",{class:"flxcr"});for(let e of(m(o,{height:"48px"}),t)){let t=_("div",{class:"dice flxcr",[p]:ea[e].icon});m(t,{display:"inline-flex"}),A(o,t)}A(e.root,o)},eq=()=>{let e=_("div",{id:"primary-resources"}),t=_("div",{class:"primary-resource-column"});A(e,t);let o=_("div",{class:"primary-resource-column"});return A(e,o),{root:e,herbRoot:t,otherRoot:o}},eX=(t,o)=>{for(let e of(y(t.herbRoot),y(t.otherRoot),U)){let a=ea[e],r=_("div",{class:"flxcr primary-resource-row"},[_("div",{[p]:eV(a.icon+a.l,"#1b631b")+": "}),_("div",{[p]:eg(o,e)+""})]);A(t.herbRoot,r)}for(let a of[...x,e.GOLD]){let e=ea[a],r=_("div",{class:"flxcr primary-resource-row"},[_("div",{[p]:eV(e.icon+e.l,"#009")+": "}),_("div",{[p]:eg(o,a)+""})]);A(t.otherRoot,r)}},eJ="btn-text wtext",eZ="#02a",e1=()=>Math.random(),e0=e=>e[Math.floor(e1()*e.length)],e2=(e,t)=>Math.floor(e1()*(t-e+1))+e,e3=(e,t)=>e.split(t).map(e=>e.trim());