// ==UserScript==
// @name			HWHExampleExt1
// @name:en			HWHExampleExt1
// @name:ru			HWHExampleExt1
// @namespace		HWHExampleExt1
// @version			1.0.18
// @description		Extension for HeroWarsHelper script
// @description:en	Extension for HeroWarsHelper script
// @description:ru	Расширение для скрипта HeroWarsHelper
// @resource json         https://support.oneskyapp.com/hc/en-us/article_attachments/202761727
// @downloadURL https://github.com/yukkon/HWExts/raw/refs/heads/main/HWHExampleExt1-1.0.user.js
// @updateURL https://github.com/yukkon/HWExts/raw/refs/heads/main/HWHExampleExt1-1.0.user.js
// @icon			https://zingery.ru/scripts/VaultBoyIco16.ico
// @icon64			https://zingery.ru/scripts/VaultBoyIco64.png
// @match			https://www.hero-wars.com/*
// @match			https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at			document-start
// ==/UserScript==

/*
.PopUp_checkboxes {
  display: flex;
  flex-direction: column;
  margin: 15px 15px -5px 15px;
  align-items: flex-start;
}

.PopUp_text {
  font-size: 22px;
  font-family: sans-serif;
  font-weight: 600;
  font-stretch: condensed;
  letter-spacing: 1px;
  text-align: center;
}
  .PopUp_text.PopUp_msgText detail div {
    padding-left: 20px;
  }
  .PopUp_text.PopUp_msgText detail div:last-child {
    border: 1px
  }
  //fetch("https://support.oneskyapp.com/hc/en-us/article_attachments/202761727").then(o => o.json()).then(t => console.info(t))

function outputsize(entries) {
  entries.forEach((e) => {
    const pos = e.target.getBoundingClientRect();

    console.log(pos);
  });
}
outputsize();

new ResizeObserver(outputsize).observe(div)

k["game.view.gui.components.inventory.ClipInventoryItemImage"] = Pe;
game.view.gui.components.HeroPortraitWithTweenableShade"
game.view.gui.components.ObjectSubscriptionWrapEntry"
game.mechanics.hero.view.HeroPreviewWithBackground
game.data.storage.DataStorage
*/
(function () {
  if (!this.HWHClasses) {
    console.log("%cObject for extension not found", "color: red");
    return;
  }
  let modules;

  console.log(
    "%cStart Extension " +
      GM_info.script.name +
      ", v" +
      GM_info.script.version +
      " by " +
      GM_info.script.author,
    "color: red"
  );
  const { addExtentionName } = HWHFuncs;
  addExtentionName(
    GM_info.script.name,
    GM_info.script.version,
    GM_info.script.author
  );

  const { buttons } = HWHData;

  buttons["ExampleButton"] = {
    name: "Новая кнопка",
    title: "title для новой кропки",
    color: "green",
    onClick: onClickNewButton,
  };

  const { popup, confShow, setProgress } = HWHFuncs;

  async function loadModules() {
    const { getEvents } = await import(
      "https://cdn.jsdelivr.net/gh/yukkon/HWExts/exports/GetEvents.js"
    );
    const { getTop } = await import(
      "https://cdn.jsdelivr.net/gh/yukkon/HWExts/exports/GetTop.js"
    );
    const { get, set, update, createStore } = await import(
      "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm"
    );
    const { getSkins } = await import(
      "https://cdn.jsdelivr.net/gh/yukkon/HWExts/exports/HeroSkins.js"
    );
    const { getHeroes } = await import(
      "https://cdn.jsdelivr.net/gh/yukkon/HWExts/exports/GetHeroes.js"
    );
    return {
      getEvents,
      getTop,
      idb: { get, set, update, createStore },
      getSkins,
      getHeroes,
    };
  }

  async function onClickNewButton() {
    const popupButtons = [
      {
        msg: "Ивенты",
        result: async () => {
          const { getEvents } = await import(
            "https://cdn.jsdelivr.net/gh/yukkon/HWExts/exports/GetEvents.js"
          );
          let arr = await getEvents();

          let res = document.createElement("div");
          res.id = "__result";

          applyCSSRules();

          arr.forEach((x) => {
            let ev = document.createElement("details");
            res.append(ev);

            let n = document.createElement("summary");
            n.textContent = `${x.name} (${x.startDate} - ${x.endDate})`;
            ev.append(n);

            let s = document.createElement("p");
            ev.append(s);

            x.steps.forEach((y) => {
              let nn = document.createElement("div");
              let name = (y.name || "")
                .replaceAll(/ "?%param\d%"?/g, "")
                .replaceAll(/\$m\((.*?)\|(.*?)\|(.*?)\)/g, "$1");
              nn.textContent = `${name}: ${y.b.map((q) => q.amount)}`;
              //const s_args = xBb.stateFuncNew(y.b);
              s.append(nn);
            });
          });
          popup.confirm(res.outerHTML, [{ result: false, isClose: true }]);
        },
        title: "Ивенты",
      },
      {
        msg: "Топ героев",
        result: async () => {
          const { getTop } = await import(
            "https://cdn.jsdelivr.net/gh/yukkon/HWExts/exports/GetTop.js"
          );
          let arr = await getTop();

          let res = document.createElement("div");
          res.id = "__result";
          applyCSSRules();

          Object.entries(arr)
            .filter(([id, _]) => id < 100)
            .sort(([a_id, a_count], [b_id, b_count]) => b_count - a_count)
            .forEach(([id, count]) => {
              let r = document.createElement("div");
              r.className = "row";
              r.textContent = `${cheats.translate(
                `LIB_HERO_NAME_${id}`
              )} - ${count}`;

              res.appendChild(r);
            });

          popup.confirm(res.outerHTML, [{ result: false, isClose: true }]);
        },
        title: "Топ героев",
      },
      {
        msg: "тест кача",
        result: async () => {
          const h = localStorage.getItem(`autofarm_heroes_${userId}`);
          const hhh = JSON.parse(h) || {};

          const { getHeroes } = await import(
            "https://cdn.jsdelivr.net/gh/yukkon/HWExts/exports/GetHeroes.js"
          );

          const arr = await getHeroes();

          let res = document.createElement("div");
          res.id = "__result";

          applyCSSRules();

          arr.slice(0, 10).forEach((h) => {
            let detail = document.createElement("div");
            detail.className = "detail";
            res.appendChild(detail);

            let summary = document.createElement("div");
            summary.className = "PopUp_ContCheckbox summary";
            detail.appendChild(summary);

            let input = document.createElement("input");
            input.type = "checkbox";
            input.className = "PopUp_checkbox";
            input.value = h.id;
            input.id = `hero_${h.id}`;
            if (hhh.hasOwnProperty(h.id)) {
              input.setAttribute("checked", true);
            }
            summary.appendChild(input);

            let label = document.createElement("label");
            label.textContent = h.name;
            label.htmlFor = `hero_${h.id}`;
            summary.appendChild(label);

            let answers = document.createElement("div");
            answers.className = "answers";
            summary.appendChild(answers);

            h.colors.forEach((c) => {
              let summary = document.createElement("div");
              summary.className = "PopUp_ContCheckbox rank";

              let input2 = document.createElement("input");
              input2.type = "checkbox";
              input2.className = "PopUp_checkbox";
              input2.value = `${h.id}|${c.id}`;
              input2.id = `hero_${h.id}_${c.id}`;
              if (hhh[h.id]?.includes(c.id)) {
                input2.setAttribute("checked", true);
              }
              summary.appendChild(input2);

              let label = document.createElement("label");
              label.textContent = c.name;
              label.htmlFor = `hero_${h.id}_${c.id}`;
              summary.appendChild(label);

              answers.appendChild(summary);
            });
          });

          let answer = await popup.confirm(res.outerHTML, [
            { result: false, isClose: true },
            { msg: "Ok", result: true, isInput: false },
          ]);

          if (answer) {
            const heroes = [
              ...popup.msgText.querySelectorAll(
                "#__result div.detail input.PopUp_checkbox:checked"
              ),
            ].reduce((acc, checkBox) => {
              let [hero, color] = checkBox.value.split("|");
              if (!acc[hero] && !color) {
                acc[hero] = [];
              }
              if (acc[hero] && color) {
                acc[hero].push(Number(color));
              }
              return acc;
            }, {});

            console.log("Выбраны", heroes);
            localStorage.setItem(
              `autofarm_heroes_${userId}`,
              JSON.stringify(heroes)
            );
            const lo = Object.keys(heroes).reduce((acc, id) => {
              let h_items = heroes[id].reduce((acc1, color) => {
                const c = arr
                  .find((e) => e.id == id)
                  .colors.find((c) => c.id == color);
                c.slots.forEach((item) => {
                  acc1[item] = 1 + ~~acc1[item];
                });

                return acc1;
              }, {});
              Object.entries(h_items).forEach(([k, v]) => {
                acc[k] = v + ~~acc[k];
              });

              return acc;
            }, {});
            console.log("Патрэбны прадметы", lo);
            let res = await AutoMissions.start(lo);
            console.log(res);
          }
        },
        title: "тест выбора героя",
      },
      {
        msg: "тест ресурсов",
        result: async () => {
          const am = await import(
            "https://cdn.jsdelivr.net/gh/yukkon/HWExts/exports/HeroSkins.js"
          ).then((m) => m.default);

          // ключ от всех дверей 212
          // вороненые латы 183
          // "LIB_GEAR_NAME_132": "Шар Прорицателя",
          // "LIB_GEAR_NAME_137": "Шар Всевидящего",
          let res = await AutoMissions.start({ 132: 1, 137: 1 });
          console.log(res);
        },
        title: "тест ресурсов",
      },
      {
        msg: "тест реварда",
        result: async () => {
          let response = {
            0: { fragmentScroll: { 215: 1 }, gold: 3011 },
            1: { consumable: { 10: 1 }, gold: 3011 },
            2: { fragmentScroll: { 215: 1 }, gold: 3011 },
            3: { fragmentGear: { 224: 1 }, gold: 3011 },
            4: { gold: 3011 },
            5: { gold: 3011 },
            6: { gold: 3011 },
            7: {
              fragmentGear: { 224: 1 },
              fragmentScroll: { 215: 1 },
              gold: 3011,
            },
            8: { fragmentScroll: { 215: 1, 244: 1 }, gold: 3011 },
            9: { gold: 3011 },
            raid: { consumable: { 9: 4, 10: 1, 12: 2, 92: 2 } },
          };
          AutoMissions.needed = { fragmentScroll: { 215: 18 } };
          // {"0":{"fragmentGear":{"224":1},"fragmentScroll": {"244": 1},"gold": 3011},"1": {"gold": 3011},"2": {"gold": 3011},"3": {"gold": 3011},"4": {"fragmentScroll": {"215": 1},"gold": 3011},"5": {"fragmentGear": {"224": 1},"gold": 3011},"6": {"fragmentScroll": {"244": 1},"gold": 3011,"consumable": {"10": 1}},"7": {"fragmentScroll": {"215": 1},"gold": 3011},"8": {"fragmentScroll": {"215": 1,"244": 1},"gold": 3011},"9": {"gold": 3011},"raid": {"consumable": {"9": 4,"10": 1,"12": 2,"92": 3}}}
          await AutoMissions.processReward(response);
        },
        title: "тест ресурсов",
      },
      {
        msg: "тест мерджа",
        result: async () => {
          let response = [
            { fragmentScroll: { 215: 1 }, gold: 3011 },
            { consumable: { 10: 1 }, gold: 3011 },
            { fragmentScroll: { 215: 1 }, gold: 3011 },
            { fragmentGear: { 224: 1 }, gold: 3011 },
            { gold: 3011 },
            { gold: 3011 },
            { gold: 3011 },
            {
              fragmentGear: { 224: 1 },
              fragmentScroll: { 215: 1 },
              gold: 3011,
            },
            { fragmentScroll: { 215: 1, 244: 1 }, gold: 3011 },
            { gold: 3011 },
            { consumable: { 9: 4, 10: 1, 12: 2, 92: 2 } },
          ];
          // {"0":{"fragmentGear":{"224":1},"fragmentScroll": {"244": 1},"gold": 3011},"1": {"gold": 3011},"2": {"gold": 3011},"3": {"gold": 3011},"4": {"fragmentScroll": {"215": 1},"gold": 3011},"5": {"fragmentGear": {"224": 1},"gold": 3011},"6": {"fragmentScroll": {"244": 1},"gold": 3011,"consumable": {"10": 1}},"7": {"fragmentScroll": {"215": 1},"gold": 3011},"8": {"fragmentScroll": {"215": 1,"244": 1},"gold": 3011},"9": {"gold": 3011},"raid": {"consumable": {"9": 4,"10": 1,"12": 2,"92": 3}}}
          const o = await AutoMissions.merge(response);
          console.log("мердж", o);
        },
        title: "тест ресурсов",
      },
      {
        msg: "тест пересечения",
        result: async () => {
          let response = [
            { fragmentScroll: { 215: 1 }, gold: 3011 },
            { consumable: { 10: 1 }, gold: 3011 },
            { fragmentScroll: { 215: 1 }, gold: 3011 },
            { fragmentGear: { 224: 1 }, gold: 3011 },
            { gold: 3011 },
            { gold: 3011 },
            { gold: 3011 },
            {
              fragmentGear: { 224: 1 },
              fragmentScroll: { 215: 1 },
              gold: 3011,
            },
            { fragmentScroll: { 215: 1, 244: 1 }, gold: 3011 },
            { gold: 3011 },
            { consumable: { 9: 4, 10: 1, 12: 2, 92: 2 } },
          ];

          // {"0":{"fragmentGear":{"224":1},"fragmentScroll": {"244": 1},"gold": 3011},"1": {"gold": 3011},"2": {"gold": 3011},"3": {"gold": 3011},"4": {"fragmentScroll": {"215": 1},"gold": 3011},"5": {"fragmentGear": {"224": 1},"gold": 3011},"6": {"fragmentScroll": {"244": 1},"gold": 3011,"consumable": {"10": 1}},"7": {"fragmentScroll": {"215": 1},"gold": 3011},"8": {"fragmentScroll": {"215": 1,"244": 1},"gold": 3011},"9": {"gold": 3011},"raid": {"consumable": {"9": 4,"10": 1,"12": 2,"92": 3}}}
          const o = AutoMissions.merge(response);
          b = AutoMissions.intersect(o, { fragmentScroll: { 215: 18 } });
          console.log("пересечение", b);
        },
        title: "тест ресурсов",
      },
      {
        msg: "тест вычитания",
        result: async () => {
          let response = [
            { fragmentScroll: { 215: 1 }, gold: 3011 },
            { consumable: { 10: 1 }, gold: 3011 },
            { fragmentScroll: { 215: 1 }, gold: 3011 },
            { fragmentGear: { 224: 1 }, gold: 3011 },
            { gold: 3011 },
            { gold: 3011 },
            { gold: 3011 },
            {
              fragmentGear: { 224: 1 },
              fragmentScroll: { 215: 1 },
              gold: 3011,
            },
            { fragmentScroll: { 215: 1, 244: 1 }, gold: 3011 },
            { gold: 3011 },
            { consumable: { 9: 4, 10: 1, 12: 2, 92: 2 } },
          ];

          // {"0":{"fragmentGear":{"224":1},"fragmentScroll": {"244": 1},"gold": 3011},"1": {"gold": 3011},"2": {"gold": 3011},"3": {"gold": 3011},"4": {"fragmentScroll": {"215": 1},"gold": 3011},"5": {"fragmentGear": {"224": 1},"gold": 3011},"6": {"fragmentScroll": {"244": 1},"gold": 3011,"consumable": {"10": 1}},"7": {"fragmentScroll": {"215": 1},"gold": 3011},"8": {"fragmentScroll": {"215": 1,"244": 1},"gold": 3011},"9": {"gold": 3011},"raid": {"consumable": {"9": 4,"10": 1,"12": 2,"92": 3}}}
          const o = AutoMissions.merge(response);
          b = AutoMissions.subtraction({ fragmentScroll: { 215: 18 } }, o);
          console.log("вычитание", b);
        },
        title: "тест ресурсов",
      },
      {
        msg: "импорт тест",
        result: async () => {
          /* Work with indexedDB with idb-keyval module
          import { set, createStore } from "idb-keyval";

          const customStore = createStore(
            "custom-db-name",
            "custom-store-name"
          );

          set("hello", "world", customStore);
          */
          const { get, set, update, createStore } = await import(
            "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm"
          );
          debugger;
          const { getSkins } = await import(
            "https://cdn.jsdelivr.net/gh/yukkon/HWExts/exports/HeroSkins.js"
          );

          const skins = await getSkins();
          let l = 1;
        },
        title: "тест импорта скрипта",
      },
    ];
    //modules = await loadModules();
    popupButtons.push({ result: false, isClose: true });
    const answer = await popup.confirm("Выбери действие", popupButtons);
    if (typeof answer === "function") {
      answer();
    }
  }

  function applyCSSRules() {
    document.styleSheets[document.styleSheets.length - 1].insertRule(
      "#__result { text-align: initial; font-size: 16px; }",
      document.styleSheets[document.styleSheets.length - 1].cssRules.length
    );

    document.styleSheets[document.styleSheets.length - 1].insertRule(
      "details > p, details > div { padding-left: 2em; }",
      document.styleSheets[document.styleSheets.length - 1].cssRules.length
    );

    document.styleSheets[document.styleSheets.length - 1].insertRule(
      ".answers { padding-left: 2em; }",
      document.styleSheets[document.styleSheets.length - 1].cssRules.length
    );

    document.styleSheets[document.styleSheets.length - 1].insertRule(
      "input[type='checkbox'] ~ div.answers {display: none; }",
      document.styleSheets[document.styleSheets.length - 1].cssRules.length
    );

    document.styleSheets[document.styleSheets.length - 1].insertRule(
      "input[type='checkbox']:checked ~ div.answers { display: block; }",
      document.styleSheets[document.styleSheets.length - 1].cssRules.length
    );
  }

  const AutoMissions = {
    inventory: undefined,
    missions: undefined,
    availableMissionsToRaid: undefined,
    userInfo: undefined,
    Reward2Mission: undefined,
    needed: {},

    //
    async start(resources = {}) {
      this.needed = {};
      const f0 = (obj, count = 1) => {
        if (count == 0) {
          return undefined;
        }
        delete obj.gold;
        let res = undefined;
        for (let item of Object.keys(obj)) {
          //gear scroll
          for (let id of Object.keys(obj[item])) {
            // 102
            if (obj[item][id] * count != 0) {
              const countInv = this.inventory[item][id] ?? 0;
              if (obj[item][id] * count > countInv) {
                const rec = lib.data.inventoryItem[item][id].craftRecipe;
                if (rec) {
                  f0(rec, obj[item][id] * count - countInv);
                } else {
                  const capitalized =
                    item.charAt(0).toUpperCase() + item.slice(1);
                  let h = this.inventory[`fragment${capitalized}`][id] || 0;
                  if (lib.data.inventoryItem[item][id]?.fragmentMergeCost) {
                    res = {
                      key: `fragment${capitalized}`,
                      value: id,
                      count:
                        obj[item][id] *
                          count *
                          lib.data.inventoryItem[item][id]?.fragmentMergeCost
                            ?.fragmentCount -
                        h,
                    };
                  } else {
                    res = {
                      key: item,
                      value: id,
                      count: obj[item][id] * count - h,
                    };
                  }

                  if (res?.count > 0) {
                    this.needed[res.key] = this.needed[res.key] || {};

                    const missions = searchMissions(res)
                      .map((id) => lib.data.mission[id])
                      .filter((m) => !m.isHeroic)
                      .map((x) => ({
                        id: x.id,
                        cost: x.normalMode.teamExp,
                      }));
                    this.needed[res.key][res.value] = {
                      count: res.count,
                      missions,
                    };
                  } else {
                    this.inventory[res.key][res.value] -= res.count;
                  }
                }
              } else {
                this.inventory[item][id] -= obj[item][id] * count;
              }
            }
          }
        }
      };

      const searchMissions = (item) => {
        let out = [];
        if (item && this.Reward2Mission[item.key]) {
          out = this.Reward2Mission[item.key][item.value] ?? [];
        }
        return out;
      };

      let resp = await Send({
        calls: [
          { name: "inventoryGet", args: {}, ident: "group_0_body" },
          { name: "userGetInfo", args: {}, ident: "group_1_body" },
          { name: "missionGetAll", args: {}, ident: "group_2_body" },
        ],
      });
      this.inventory = resp.results[0].result.response;
      this.userInfo = resp.results[1].result.response;
      this.missions = resp.results[2].result.response;

      this.availableMissionsToRaid = Object.values(this.missions)
        .filter((mission) => mission.stars === 3)
        .map((mission) => mission.id);
      this.Reward2Mission = Object.values(lib.data.mission).reduce(
        (acc, mission) => {
          if (!this.availableMissionsToRaid.includes(mission.id)) {
            return acc;
          }

          const enemies = mission.normalMode.waves
            .map((wave) => wave.enemies)
            .flat();
          const drop = enemies
            .filter((enemy) => !!enemy.drop?.length)
            .map((enemy) => enemy.drop)
            .flat();
          const reward = drop.filter((d) => d.chance > 0).map((d) => d.reward);

          reward.forEach((r) => {
            Object.keys(r).forEach((inventoryKey) => {
              if (!acc[inventoryKey]) {
                acc[inventoryKey] = {};
                Object.keys(r[inventoryKey]).forEach((inventoryItem) => {
                  acc[inventoryKey][inventoryItem] = [mission.id];
                });
              } else {
                Object.keys(r[inventoryKey]).forEach((inventoryItem) => {
                  if (!acc[inventoryKey][inventoryItem]) {
                    acc[inventoryKey][inventoryItem] = [mission.id];
                  } else {
                    acc[inventoryKey][inventoryItem].push(mission.id);
                  }
                });
              }
            });
          });

          return acc;
        },
        {}
      );

      f0({ gear: resources });

      console.log(this.needed);
      if (Object.keys(this.needed).length > 0) {
        Object.entries(this.needed).forEach(([item, idvs]) => {
          Object.entries(idvs).forEach(([id, v]) => {
            console.log(
              `Патрэбна: ${v.count} ${
                item.indexOf("fragmant") ? "фрагмент" : ""
              } ${cheats.translate(
                `LIB_${item.replace("fragment", "").toUpperCase()}_NAME_${id}`
              )}(${item}_${id}) `
            );
          });
        });
        const mission = this.selectMission();
        console.log(mission);

        //const response = await this.runMission(mission);
        this.processReward({});
        // endregion
      } else {
        Object.entries(resources).forEach((id, count) => {
          const name = cheats.translate(`LIB_GEAR_NAME_${id}`);
          console.log(`Можна стварыць: ${count} ${name}`);
        });
      }
      return this.needed;
    },

    async run() {
      let stamina = AutoMissions.userInfo.refillable.find(
        (x) => x.id == 1
      ).amount;
      const vipLevel = Math.max(
        ...lib.data.level.vip
          .filter((l) => l.vipPoints <= +AutoMissions.userInfo.vipPoints)
          .map((l) => l.level)
      );
      const reward = {};
      const times = vipLevel >= 5 ? 10 : 1;

      // mission case

      while (stamina >= times * mission.cost && o.count < res.count) {
        // region run mission
        let response = await this.runMission(mission);
        // endregion
        // region rewards
        this.processReward(response);
        // endregion

        o.count += c;
        stamina -= mission.cost * times;
        o.used += mission.cost * times;

        setProgress(
          `Атрымалі: ${o.count} / ${res.count} '${
            o.name
          }' <br> выкарыставана энки ${o.used} (${(o.used / o.count).toFixed(
            2
          )})`
        );
      }
    },
    selectMission() {
      //all necessary missions
      let ms = Object.entries(this.needed).flatMap(([item, idvs]) =>
        Object.entries(idvs).flatMap(([id, v]) => v.missions)
      );

      let count = ms.reduce((acc, curr) => {
        acc[curr.id] = { ...curr, count: (acc[curr.id]?.count || 0) + 1 };
        return acc;
      }, {});

      const cc = Object.values(count).sort((a, b) => b.count - a.count);
      console.log(cc);

      return cc[0];
    },
    processReward(response) {
      // region rewards
      const o = Object.values(response).reduce((acc2, object) => {
        Object.keys(object).forEach((key) => {
          if (this.needed[key]) {
            Object.entries(object[key]).forEach(([id, count]) => {
              if (this.needed[key][id]) {
                acc2[key] = acc2[key] || {};
                acc2[key][id] = acc2[key][id] || 0;
                acc2[key][id] += count;

                if (this.needed[key][id]) {
                  this.needed[key][id].count -= count;
                }
              }
            });
          }
        });
        return acc2;
      }, {});
      console.log(this.caller, o);
      // endregion
    },
    runMission(mission) {
      return Send({
        calls: [
          {
            name: "missionRaid",
            args: { id: mission.id, times },
            ident: "body",
          },
        ],
      }).then((x) => {
        if (x.error) {
          console.error(x.error);
          return {};
        }
        return x.results[0].result.response;
      });
    },
    merge(response) {
      return response.reduce((acc2, object) => {
        Object.keys(object).forEach((key) => {
          Object.entries(object[key]).forEach(([id, count]) => {
            acc2[key] = acc2[key] || {};
            acc2[key][id] = acc2[key][id] || 0;
            acc2[key][id] += count;
          });
        });
        return acc2;
      }, {});
    },
    //возвращает элеиенты 1 объекта которые есть во втором
    intersect(source, destination) {
      return Object.keys(source).reduce((acc, key) => {
        if (destination[key]) {
          acc[key] = {};
          Object.keys(source[key]).forEach((id) => {
            if (destination[key][id]) {
              acc[key][id] = source[key][id];
            }
          });
        }
        return acc;
      }, {});
    },
    subtraction(source, destination) {
      return Object.keys(source).reduce((acc, key) => {
        if (destination[key]) {
          acc[key] = {};
          Object.keys(source[key]).forEach((id) => {
            if (destination[key][id]) {
              acc[key][id] = source[key][id] - destination[key][id];
            }
          });
        }
        return acc;
      }, {});
    },
  };

  /*
const answer = await popup.confirm('RUN_FUNCTION', [
        { msg: I18N('BTN_CANCEL'), result: false, isCancel: true },
        { msg: I18N('BTN_GO'), result: true },
      ], () => {});
      */
})();
