// ==UserScript==
// @name         My Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-03-03
// @description  try to take over the world!
// @author       You
// @match        https://www.hero-wars.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hero-wars.com
// @grant        none
// @resource json         https://support.oneskyapp.com/hc/en-us/article_attachments/202761727
// @require      https://github.com/lindell/JsBarcode/releases/download/v3.11.6/JsBarcode.all.min.js
// @downloadURL https://github.com/yukkon/HWExts/raw/refs/heads/main/Userscript.user.js
// @updateURL https://github.com/yukkon/HWExts/raw/refs/heads/main/Userscript.user.js
// ==/UserScript==

(function () {
  //fetch("https://support.oneskyapp.com/hc/en-us/article_attachments/202761727").then(o => o.json()).then(t => console.info(t))

  if (!this.HWHClasses) {
    console.log("%cObject for extension not found", "color: red");
    return;
  }

  console.log("%cStart my Extension ", "color: red");

  const { addExtentionName } = HWHFuncs;
  addExtentionName(
    GM_info.script.name,
    GM_info.script.version,
    GM_info.script.author
  );

  const {
    getInput,
    setProgress,
    hideProgress,
    I18N,
    send,
    getTimer,
    countdownTimer,
    getUserInfo,
    getSaveVal,
    setSaveVal,
    popup,
    setIsCancalBattle,
    random,
    confShow,
  } = HWHFuncs;

  const { buttons } = HWHData;

  buttons["autokech"] = {
    name: "Автокач",
    title: "title для новой кропки",
    color: "green",
    onClick: () => {
      let h = localStorage.getItem(`autofarm_heroes_${userId}`);
      if (!!h) {
        let hhh = JSON.parse(h);
        hh(hhh);
      } else {
        hh();
      }
    },
  };

  async function name1(params) {
    userInfo = await Send({
      calls: [{ name: "userGetInfo", args: {}, ident: "body" }],
    }).then((r) => r.results[0].result.response);
    vipLevel = Math.max(
      ...lib.data.level.vip
        .filter((l) => l.vipPoints <= +userInfo.vipPoints)
        .map((l) => l.level)
    );

    if (vipLevel >= 1) {
      buttons["autokech"] = {
        name: "Автокач",
        title: "title для новой кропки",
        color: "green",
        onClick: () => {
          let h = localStorage.getItem(`autofarm_heroes_${userId}`);
          if (!!h) {
            setProgress("Герои заданы", true);
            let hhh = JSON.parse(h);
            console.log(hhh);
            hh(hhh);
          } else {
            name().then((h) => {
              console.log(h);
              setProgress(
                `Используем первого доступного героя: ${cheats.translate(
                  `LIB_HERO_NAME_${h[0].id}`
                )}`,
                true
              );
              hh([h[0].id]);
            });
          }
        },
      };
    }
  }

  // не оконченные герои
  async function hnc(params) {
    const Heroes = await Send({
      calls: [{ name: "heroGetAll", args: {}, ident: "body" }],
    }).then((r) => r.results[0].result.response);

    return Object.values(Heroes)
      .map((h) => {
        const slots = lib.data.hero[h.id].color[h.color].items.map(
          (val, ind) => h.slots[ind] ?? val
        );
        return {
          id: h.id,
          name: cheats.translate(`LIB_HERO_NAME_${h.id}`),
          color: h.color,
          slots: slots,
          power: h.power,
        };
      })
      .filter((h) => h.slots.reduce((a, s) => a + s, 0) > 0)
      .sort((a, b) => b.power - a.power);
  }

  // herors = {7:[16,17], 60:[], 53:[]} <id героя>: [цвет<, ...>]
  // heroes = [7, 60, 53]
  // heroes = undefined, качаем с максимальной силой
  // в последних 2 случаях ишет ресурсы до повышения
  async function hh(heroes) {
    let lo = [];
    let hs = await hnc();

    if (!heroes) {
      let her = hs[0];
      lo = her.slots
        .filter((i) => i > 0)
        .reduce((acc, i) => {
          acc[i] = 1 + ~~acc[i];
          return acc;
        }, {});
      setProgress(
        `Используем ${cheats.translate(`LIB_HERO_NAME_${her.id}`)}`,
        true
      );
    } else {
      if (Array.isArray(heroes)) {
        lo = heroes.reduce((acc, id) => {
          let her = hs.find((e) => e.id == id);
          her.slots.forEach((s) => (acc[s] = 1 + ~~acc[s]));
          return acc;
        }, {});
        let co = Object.keys(heroes)
          .map((id) => `\t${cheats.translate(`LIB_HERO_NAME_${id}`)}`)
          .join("<br />");
        setProgress(`Качаем:<br/>${co}`);
      } else {
        let co = Object.keys(heroes)
          .map(
            (id) =>
              `\t${cheats.translate(`LIB_HERO_NAME_${id}`)} - [${heroes[id]
                .map((c) => lib.data.enum.heroColor[c].ident)
                .join("|")}]`
          )
          .join("<br />");
        setProgress(`Качаем:<br/>${co}`);
        lo = Object.keys(heroes).reduce((acc, id) => {
          let h_items = heroes[id].reduce((acc1, color) => {
            let items = lib.data.hero[id].color[color].items;
            let her = hs.find((e) => e.id == id);
            if (her.color == color) {
              items = her.slots;
            }
            items.forEach((item) => {
              acc1[item] = 1 + ~~acc1[item];
            });

            return acc1;
          }, {});
          Object.entries(h_items).forEach(([k, v]) => {
            acc[k] = v + ~~acc[k];
          });

          return acc;
        }, {});
      }
    }

    let needs = Object.keys(lo).map(
      (k) => `${cheats.translate(`LIB_GEAR_NAME_${k}`)} - ${lo[k]}`
    );
    console.log("Нужно", needs);

    start(lo);
  }

  const AutoMissions = {
    inventory: undefined,
    missions: undefined,
    availableMissionsToRaid: undefined,
    userInfo: undefined,
    Reward2Mission: undefined,

    async start(resources = {}) {
      const f0 = (obj, count = 1) => {
        if (count == 0) {
          return undefined;
        }
        delete obj.gold;
        let res = undefined;
        for (let item of Object.keys(obj)) {
          //gear scroll
          if (res?.count > 0) break;
          for (let id of Object.keys(obj[item])) {
            // 102
            if (res?.count > 0) break;
            if (obj[item][id] * count != 0) {
              const countInv = this.inventory[item][id] ?? 0;
              if (obj[item][id] * count > countInv) {
                const rec = lib.data.inventoryItem[item][id].craftRecipe;
                if (rec) {
                  res = f0(rec, obj[item][id] * count - countInv);
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
                      key: [item],
                      value: id,
                      count: obj[item][id] * count - h,
                    };
                  }
                  if (res.count == 0) res = undefined;
                }
              }
            }
          }
        }
        return res;
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

      const res = f0({ gear: resources });

      console.log("требуемый ресурс", res); //  {"fragmentGear": "167", count: 32} => {key: "fragmentGear", value: "167", count: 32}
      if (res) {
        console.log(
          `Необходимо: ${res.count} ${
            res.key.indexOf("fragmant") ? "фрагмент" : ""
          } ${cheats.translate(
            `LIB_${res.key.replace("fragment", "").toUpperCase()}_NAME_${
              res.value
            }`
          )} `
        );
        const missions = searchMissions(res)
          .map((id) => lib.data.mission[id])
          .filter((m) => !m.isHeroic)
          .map((x) => ({ id: x.id, cost: x.normalMode.teamExp }));
        console.log("Возможные миссии", missions);
        const mission = missions.find(
          (x) => x.id == Math.max(...missions.map((y) => y.id))
        );
        localStorage.setItem("autofarm", JSON.stringify({ ...res, missions }));

        return { ...res, missions };
      } else {
        setProgress(`Все есть`);
        return undefined;
      }
    },
  };

  async function start(heroes) {
    let res = await AutoMissions.start(heroes);
    let stamina = AutoMissions.userInfo.refillable.find(
      (x) => x.id == 1
    ).amount;
    const vipLevel = Math.max(
      ...lib.data.level.vip
        .filter((l) => l.vipPoints <= +AutoMissions.userInfo.vipPoints)
        .map((l) => l.level)
    );
    const ress = [];

    while (res) {
      const mission = res.missions.find(
        (x) => x.id == Math.max(...res.missions.map((y) => y.id))
      );
      let times = 1;
      if (vipLevel >= 5) {
        times = 10;
      }
      let o = {
        name: res.key.indexOf("fragment")
          ? "фрагмент "
          : "" +
            cheats.translate(
              `LIB_${res.key.replace("fragment", "").toUpperCase()}_NAME_${
                res.value
              }`
            ),
        count: 0,
        used: 0,
      };

      while (stamina >= times * mission.cost && o.count < res.count) {
        let response = await Send({
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

        let c = Object.values(response).reduce((acc, reward) => {
          acc += Object.keys(reward).reduce((acc2, object) => {
            if (res.key == object) {
              let o = Object.keys(reward[object]).find((x) => x == res.value);
              if (o) {
                acc2 += reward[object][o];
              }
            }
            return acc2;
          }, 0);
          return acc;
        }, 0);

        o.count += c;
        stamina -= mission.cost * times;
        o.used += mission.cost * times;

        setProgress(
          `Получено: ${o.count} / ${res.count} ${
            o.name
          } <br> израсходовано энки ${o.used} (${(o.used / o.count).toFixed(
            2
          )})`
        );
      }
      ress.push(o);
      if (stamina < times * mission.cost) {
        setProgress(`Не хватает энки`);
        break;
      }
      res = await AutoMissions.start(heroes);
      stamina = AutoMissions.userInfo.refillable.find((x) => x.id == 1).amount;
    }
    let con = ress
      .map(
        (o) =>
          `${o.count} ${o.name} израсходовано энки ${o.used} (${(
            o.used / o.count
          ).toFixed(2)})`
      )
      .join("<br>");
    setProgress(`Получено:<br>${con}`);
  }
})();
