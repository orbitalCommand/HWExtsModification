// ==UserScript==
// @name			HWHYukkonExt
// @name:en			HWHYukkonExt
// @name:ru			HWHYukkonExt
// @namespace		HWHYukkonExt
// @version			1.0.18
// @description		Extension for HeroWarsHelper script
// @description:en	Extension for HeroWarsHelper script
// @description:ru	Расширение для скрипта HeroWarsHelper
// @resource json         https://support.oneskyapp.com/hc/en-us/article_attachments/202761727
// @downloadURL https://github.com/yukkon/HWExts/raw/refs/heads/main/HWHYukkonExt.user.js
// @updateURL https://github.com/yukkon/HWExts/raw/refs/heads/main/HWHYukkonExt.user.js
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

  //fetch any file
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

  document.onreadystatechange = async () => {
    if (document.readyState == "complete") {
      console.info("load from main", document.readyState);
      loadModules();
      applyCSSRules();
      addCSSFile("https://yukkon.github.io/HWExts/tabber.css");
      addCSSFile("https://yukkon.github.io/HWExts/toast.css");
      document.body.addEventListener("click", (e) => {
        var r = e.target.closest(
          ".wds-tabber:not(.wds-tabber-react-common) .wds-tabs__tab"
        );
        r && (e.preventDefault(), d(r));
      });
      // переключение табов
      function d(e) {
        if (e.parentNode) {
          var r = Array.from(e.parentNode.children).indexOf(e),
            t = e.closest(".wds-tabber");
          t &&
            (t
              .querySelectorAll(":scope > .wds-tab__content")
              .forEach((e, t) => {
                e.classList.toggle("active", r === t);
              }),
            t
              .querySelectorAll(":scope > .wds-tabs__wrapper .wds-tabs__tab")
              .forEach((e, t) => {
                e.classList.toggle("active", r === t);
              }));
        }
      }
    }
  };

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
    const { createTab } = await import(
      "https://yukkon.github.io/HWExts/exports/createTab.js"
    );

    const { toast } = await import(
      "https://yukkon.github.io/HWExts/exports/toast.js"
    );

    window.modules = {
      getEvents,
      getTop,
      idb: { get, set, update, createStore },
      getSkins,
      getHeroes,
      createTab,
      toast,
    };
  }

  const response = {
    1: { fragmentScroll: { 215: 1 }, gold: 3011 },
    2: { consumable: { 10: 1 }, gold: 3011 },
    3: { fragmentScroll: { 215: 1 }, gold: 3011 },
    4: { fragmentGear: { 224: 1 }, gold: 3011 },
    5: { gold: 3011 },
    6: { gold: 3011 },
    7: { gold: 3011 },
    7: {
      fragmentGear: { 224: 1 },
      fragmentScroll: { 215: 1 },
      gold: 3011,
    },
    8: { fragmentScroll: { 215: 1, 244: 1 }, gold: 3011 },
    9: { gold: 3011 },
    raid: { consumable: { 9: 4, 10: 1, 12: 2, 92: 2 } },
  };
  // {"0":{"fragmentGear":{"224":1},"fragmentScroll": {"244": 1},"gold": 3011},"1": {"gold": 3011},"2": {"gold": 3011},"3": {"gold": 3011},"4": {"fragmentScroll": {"215": 1},"gold": 3011},"5": {"fragmentGear": {"224": 1},"gold": 3011},"6": {"fragmentScroll": {"244": 1},"gold": 3011,"consumable": {"10": 1}},"7": {"fragmentScroll": {"215": 1},"gold": 3011},"8": {"fragmentScroll": {"215": 1,"244": 1},"gold": 3011},"9": {"gold": 3011},"raid": {"consumable": {"9": 4,"10": 1,"12": 2,"92": 3}}}

  async function onClickNewButton() {
    const popupButtons = [
      {
        msg: "Падзеі",
        result: async () => {
          let arr = await window.modules.getEvents();

          let res = document.createElement("div");
          res.id = "__result";

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
        title: "Падзеі",
      },
      {
        msg: "Топ героеў",
        result: async () => {
          let arr = await window.modules.getTop();

          let res = document.createElement("div");
          res.id = "__result";

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
        title: "Топ героеў",
      },
      {
        msg: "Скіны",
        result: async () => {
          const skind = await window.modules.getSkins();
          console.log(skind);

          let res = document.createElement("div");
          res.id = "__result";

          // Создаем табы
          let tblr = document.createElement("div");
          tblr.className = "tabber wds-tabber";

          let tsw = document.createElement("div");
          tsw.className = "wds-tabs__wrapper";
          tblr.appendChild(tsw);

          let ts = document.createElement("ul");
          ts.className = "wds-tabs";
          tsw.appendChild(ts);

          const f = (coin, sks) => {
            const m = window.modules.createTab(
              coin == "undefined"
                ? "Фулл"
                : cheats.translate(`LIB_COIN_NAME_${coin}`)
            );

            let d = document.createElement("div");
            d.className = "table";

            sks
              .sort((a, b) => {
                if (a.cost?.coin && b.cost?.coin) {
                  return a.cost?.coin[coin] - b.cost?.coin[coin];
                } else {
                  return 0;
                }
              })
              .forEach((x) => {
                let r = document.createElement("div");
                r.className = "row";

                let c = document.createElement("div");
                c.className = "cell col-3";
                c.innerText = cheats.translate(`LIB_HERO_NAME_${x.id}`);
                r.appendChild(c);

                c = document.createElement("div");
                c.className = `cell col-5`;
                c.innerText = x.cost.coin ? x.cost.coin[coin] : "";
                r.appendChild(c);

                d.appendChild(r);
                m.tab_content.appendChild(d);
              });

            return m;
          };
          const skins = Object.groupBy(skind, (x) => {
            if (x.cost.coin) {
              return Object.keys(x.cost?.coin);
            }
          });

          Object.keys(skins).forEach((k) => {
            const m = f(k, skins[k]);
            ts.appendChild(m.tab);
            tblr.appendChild(m.tab_content);
          });
          res.appendChild(tblr);

          popup.confirm(res.outerHTML, [{ result: false, isClose: true }]);
        },
        title: "Скіны",
      },
      {
        msg: "тэст выбару",
        result: async () => {
          const arr = await window.modules.getHeroes();

          // endregion Выбар
          let answer = await ff(arr);

          // region Апрацойўка вынікаў выбару герояў
          if (answer) {
            let lo = hh(arr);

            AutoMissions.start(lo);
          }
        },
        title: "тест выбора героя",
      },
      {
        msg: "тест мерджа",
        result: async () => {
          const o = await AutoMissions.merge(Object.values(response));
          console.log("мердж", o);
        },
        title: "тест мерджа",
      },
      {
        msg: "intersect",
        result: async () => {
          const o = AutoMissions.merge(Object.values(response));
          b = AutoMissions.intersect(o, { fragmentScroll: { 215: 18 } });
          console.log("intersect", b);
        },
        title: "Атрыманыя рэсурсы якія супадаюць з патрбнымі",
      },
      {
        msg: "тест вычитания",
        result: async () => {
          const o = AutoMissions.merge(Object.values(response));
          b = AutoMissions.subtraction({ fragmentScroll: { 215: 18 } }, o);
          console.log("вычитание", b);
        },
        title: "Аднімаем з патрэбных рэсурсаў тыя, якія атрымалі у міссіі",
      },
      {
        msg: "тест тостаў",
        result: async () => {
          const rnd = () =>
            crypto
              .getRandomValues(new Uint8Array(10))
              .reduce((acc, val) => acc + val.toString(16));

          window.modules.toast.success(rnd());
        },
        title: "",
      },
    ];
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
    document.styleSheets[document.styleSheets.length - 1].insertRule(
      ".summary .PopUp_checkbox:checked ~.answers div.rank:first-child .PopUp_checkbox { checked: true; }",
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

      console.log("Неабходна здабыць", this.needed);
      if (Object.keys(this.needed).length > 0) {
        Object.entries(this.needed).forEach(([item, idvs]) => {
          Object.entries(idvs).forEach(([id, v]) => {
            console.log(
              ` - ${v.count} ${
                item.indexOf("fragmant") ? "фрагмент" : ""
              } ${cheats.translate(
                `LIB_${item.replace("fragment", "").toUpperCase()}_NAME_${id}`
              )}(${item}_${id}) `
            );
          });
        });

        return Object.keys(this.needed).length > 0;
      } else {
        console.log("Можна стварыць:");
        Object.entries(resources).forEach(([id, count]) => {
          const name = cheats.translate(`LIB_GEAR_NAME_${id}`);
          console.log(` - ${count} ${name}`);
        });
        return false;
      }
    },

    async run() {
      let stamina = this.userInfo.refillable.find((x) => x.id == 1).amount;
      const vipLevel = Math.max(
        ...lib.data.level.vip
          .filter((l) => l.vipPoints <= +this.userInfo.vipPoints)
          .map((l) => l.level)
      );
      const times = vipLevel >= 5 ? 10 : 1;

      // mission case
      let mission = this.selectMission();

      while (stamina >= times * mission.cost) {
        // region run mission
        let response = await this.runMission(mission);
        // endregion
        const res = Helper.merge(Object.values(response)); // працессаем вынікі міссіі
        //const res1 = this.intersect(res, this.needed); //пакахваем што атрымалі

        //this.result = this.intersect(this.result, res1); //захоўваем вынікі
        //this.needed = this.subtraction(this.needed, res); // захоўваем што засталося
        //калі у нідыд нешта есць шукаем наступную міссію

        stamina -= mission.cost * times;

        setProgress(
          `Атрымалі: ${o.count} / ${res.count} '${
            o.name
          }' <br> выкарыставана энки ${o.used} (${(o.used / o.count).toFixed(
            2
          )})`
        );
        mission = this.selectMission();
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
      console.log("Міссіі:", cc);

      return cc[0];
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
  };

  async function ff(arr) {
    const h = localStorage.getItem(`autofarm_heroes_${userId}`);
    const hhh = JSON.parse(h) || {};

    let res = document.createElement("div");
    res.id = "__result";

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

    // endregion Выбар
    return popup.confirm(res.outerHTML, [
      { result: false, isClose: true },
      { msg: "Ok", result: true, isInput: false },
    ]);
  }

  const Helper = {
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

  function hh(arr) {
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
    localStorage.setItem(`autofarm_heroes_${userId}`, JSON.stringify(heroes));
    // regiom неабходныя прадметы
    const lo = Object.keys(heroes).reduce((acc, id) => {
      let h_items = heroes[id].reduce((acc1, color) => {
        const c = arr.find((e) => e.id == id).colors.find((c) => c.id == color);
        c.slots.forEach((item) => {
          acc1[item] = 1 + ~~acc1[item];
        });

        return acc1;
      }, {});
      if (heroes[id].length == 0) {
        let hero = arr.find((e) => e.id == id);
        h_items = hero.colors.reduce((acc1, c) => {
          c.slots.forEach((item) => {
            acc1[item] = 1 + ~~acc1[item];
          });
          return acc1;
        }, {});
      }
      Object.entries(h_items).forEach(([k, v]) => {
        acc[k] = v + ~~acc[k];
      });

      return acc;
    }, {});
    console.log("Для выбраных рангаў патрэбны прадметы:");
    Object.entries(lo).forEach(([k, v]) => {
      console.log(` - ${cheats.translate(`LIB_GEAR_NAME_${k}`)}: ${v}`);
    });
    // endtrgion

    return lo;
  }

  function addCSSFile(url) {
    document.head.insertAdjacentHTML(
      "beforeend",
      `<link rel="stylesheet" href="${url}" type="text/css" />`
    );
  }

  /*
const answer = await popup.confirm('RUN_FUNCTION', [
        { msg: I18N('BTN_CANCEL'), result: false, isCancel: true },
        { msg: I18N('BTN_GO'), result: true },
      ], () => {});
      */
})();
