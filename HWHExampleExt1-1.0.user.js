// ==UserScript==
// @name			HWHExampleExt1
// @name:en			HWHExampleExt1
// @name:ru			HWHExampleExt1
// @namespace		HWHExampleExt1
// @version			1.0.1
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
*/
(function () {
  if (!this.HWHClasses) {
    console.log("%cObject for extension not found", "color: red");
    return;
  }

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

  function getEvents() {
    var d = new Date();
    d.setDate(d.getDate() - 3);
    return Object.values(lib.data.specialQuestEvent.type)
      .filter((x1) => !!x1.requirement.questEventDates)
      .filter((x2) => !!x2.requirement.questEventDates.startDate)
      .filter(
        (x3) => new Date(x3.requirement.questEventDates.endDate) > new Date()
      )
      .map((x4) => ({
        name: cheats.translate(x4.name_localeKey),
        startDate: x4.requirement.questEventDates.startDate,
        endDate: x4.requirement.questEventDates.endDate,
        steps: x4.questChains.map((x5) => {
          let arr = lib.data.specialQuestEvent.chain[x5].specialQuests.map(
            (x6) => lib.data.quest.special[x6]
          );
          let name = cheats.translate(
            `LIB_QUEST_TRANSLATE_${arr[0].translationMethod.toUpperCase()}`
          );
          if (name == "LIB_QUEST_TRANSLATE_POINTEVENTXPADD") {
            name = "Получи очков события";
          }
          if (arr.length > 0) {
            return {
              name,
              b: arr.map((x) => x.farmCondition),
            };
          }
          return {};
        }),
      }))
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }

  async function getTop() {
    let a = await Send({
      calls: [
        {
          name: "topGet",
          args: { type: "arena", extraId: 0 },
          ident: "group_1_body",
        },
      ],
    }).then((r) =>
      r.results[0].result.response.top.map((place) =>
        place.heroes.map((hero) => hero.id)
      )
    );
    let a2 = a
      .flat()
      .reduce((acc, val) => (acc[val] ? ++acc[val] : (acc[val] = 1), acc), {});

    //топ героев
    /*
    Object.entries(a2)
      .filter(([id, _]) => id < 100)
      .sort(([a_id, a_count], [b_id, b_count]) => b_count - a_count)
      .forEach(([id, count]) =>
        console.log(`${cheats.translate(`LIB_HERO_NAME_${id}`)} - ${count}`)
      );

    //топ петов
    Object.entries(a2)
      .filter(([id, _]) => id > 100 && id < 7000)
      .sort(([a_id, a_count], [b_id, b_count]) => b_count - a_count)
      .forEach(([id, count]) =>
        console.log(`${cheats.translate(`LIB_HERO_NAME_${id}`)} - ${count}`)
      );
    */
    return a2;
  }

  async function onClickNewButton() {
    const popupButtons = [
      {
        msg: "Ивенты",
        result: () => {
          let arr = getEvents();

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
              const s_args = xBb.stateFuncNew(y.b);
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
          let arr = await getTop();

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
        title: "Топ героев",
      },
      {
        msg: "импорт тест",
        result: async () => {
          const { get, set, update, createStore } = await import(
            "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm"
          );

          const getSkins = await import(
            "https://github.com/yukkon/HWExts/raw/refs/heads/main/exports/HeroSkins.js"
          );
          let l = 1;
        },
        title: "тест импорта скрипта",
      },
    ];
    popupButtons.push({ result: false, isClose: true });
    const answer = await popup.confirm("Выбери действие", popupButtons);
    if (typeof answer === "function") {
      answer();
    }
  }

  /*
const answer = await popup.confirm('RUN_FUNCTION', [
        { msg: I18N('BTN_CANCEL'), result: false, isCancel: true },
        { msg: I18N('BTN_GO'), result: true },
      ], () => {});
      */

  const xBb = {
    __class__: "game.data.storage.quest.QuestDescriptionTaskTranslation",
    TRANSLATE: function (a) {
      return cheats.translate(a);
    },
    stateFuncNew: function (a, b) {
      let f = [];
      const c = a[0].stateFunc?.name;
      if (!c) {
        return a.map((x) => x.amount);
      }
      switch (c) {
        case "heroColorById":
          f[0] = this.kVa(a[0].stateFunc.args.id);
          f[1] = a.map((x) => {
            const color = lib.data.enum.heroColor[x.stateFunc.args.color];
            const l = [...lib.data.enum.heroColor[13].ident.matchAll(/\+/g)]
              .length;
            return l == 0
              ? this.TRANSLATE(color.locale_key)
              : `this.TRANSLATE(color.locale_key) +${l}`;
          });
          break;
        case "heroAmountStarsById":
          f[0] = a.map((x) => x.amount);
          f[1] = this.kVa(a[0].stateFunc.args.heroId);
      }
      return f;
    },
    stateFunc: function (a, b) {
      let f = [];
      const c = a.stateFunc?.name;
      if (!c) {
        return a.amount;
      }
      switch (c) {
        case "adventureBossKill":
          f[0] = a.stateFunc.args.adventureId;
          f[1] = a.amount;
          break;
        case "artifactAmountStars":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.star;
          break;
        case "artifactUpgrade":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.level;
          break;
        case "artifactsLevelsByCertainHero":
          f[0] = a.stateFunc.args.unitId;
          f[1] = a.amount;
          break;
        case "artifactsLevelsByHero":
          f[0] = a.stateFunc.args.unitId;
          f[1] = a.amount;
          break;
        case "battleEndStatHeroRoleDamageDealt":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.unitPerkId;
          break;
        case "battleEndStatHeroRoleDamageDealtArena":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.unitPerkId;
          break;
        case "battleEndStatHeroRoleDamageReceived":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.unitPerkId;
          break;
        case "battleEndStatHeroRoleDamageReceivedArena":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.unitPerkId;
          break;
        case "battleEndStatTowerHeroUltUsed":
          f[0] = ~~a.stateFunc.args.unitId;
          f[1] = a.amount;
          break;
        case "battleMechanicWin":
          (f[0] = cheats.translate(
            `LIB_MECHANIC_${a.stateFunc.args.mechanic.toUpperCase()}`
          )),
            (f[1] = a.amount);
          break;
        case "battleMechanicWinArenaWithHealer":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.useUnitRole;
          break;
        case "battleMechanicWinFlawless":
          (f[0] = cheats.translate(
            `LIB_MECHANIC_${a.stateFunc.args.mechanic.toUpperCase()}`
          )),
            (f[1] = a.amount);
          break;
        case "battleMechanicWinHero":
          f[0] = a.stateFunc.args.killUnitId;
          f[1] = cheats.translate(
            `LIB_MECHANIC_${a.stateFunc.args.mechanic.toUpperCase()}`
          );
          f[2] = a.amount;
          break;
        case "battleMechanicWinHeroBossChapter5":
          f[0] = ~~a.stateFunc.args.killUnitId;
          f[1] = a.amount;
          break;
        case "battleMechanicWinPerk":
          (f[0] = cheats.translate(
            `"LIB_MECHANIC_${a.stateFunc.args.mechanic.toUpperCase()}`
          )),
            (f[1] = ~~a.stateFunc.args.killUnitRole),
            (f[2] = a.amount);
          break;
        case "battleMechanicWinPerkAdventuresRangedDps":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.killUnitRole;
          break;
        case "battleMechanicWinPerkArenaTank":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.killUnitRole;
          break;
        case "battleMechanicWinPerkTowerHealer":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.killUnitRole;
          break;
        case "battleMechanicWinPerkTowerMage":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.killUnitRole;
          break;
        case "battleMechanicWinPerkTowerTank":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.killUnitRole;
          break;
        case "battleMechanicWinWithHero":
          (f[0] = cheats.translate(
            `"LIB_MECHANIC_${a.stateFunc.args.mechanic.toUpperCase()}`
          )),
            (f[1] = a.stateFunc.args.useUnitId),
            (f[2] = a.amount);
          break;
        case "battleMechanicWinWithMeleeDpsInAdventures":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.useUnitRole;
          break;
        case "battleMechanicWinWithPerk":
          (f[0] = cheats.translate(
            `"LIB_MECHANIC_${a.stateFunc.args.mechanic.toUpperCase()}`
          )),
            (f[1] = ~~a.stateFunc.args.useUnitRole),
            (f[2] = a.amount);
          break;
        case "battleMechanicWinWithPerkMeleeDpsInArena":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.useUnitRole;
          break;
        case "battleMechanicWinWithPerkSupportInMissions":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.useUnitRole;
          break;
        case "battleMechanicWinWithPerkTankInTower":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.useUnitRole;
          break;
        case "bossKillByLevel":
          b = ~~a.stateFunc.args.id;
          b = C.Rg.tF(b);
          (f[0] = b.wa()), (f[1] = a.stateFunc.args.level);
          break;
        case "bossLevelAll":
          f[0] = a.stateFunc.args.level;
          break;
        case "clanDominationFarmTime":
          f[0] = a.amount;
          break;
        case "clanDominationWins":
          f[0] = a.amount;
          break;
        case "clanRaidBossHallOfFame":
          f[0] = a.stateFunc.args.id;
          break;
        case "clanRaidBossLevelDefeated":
          f[0] = a.stateFunc.args.id;
          f[1] = a.stateFunc.args.level;
          break;
        case "clanRaidBossLevelDefeatedAmount":
          f[0] = a.stateFunc.args.id;
          f[1] = a.stateFunc.args.level;
          f[2] = a.amount;
          break;
        case "clanRaidNodeLevelDefeated":
          e = a.stateFunc.args.raidId;
          b = a.stateFunc.args.level;
          f[0] =
            null != e
              ? a.stateFunc.args.nodeId
              : `raidNode:${a.stateFunc.args.nodeId}`;
          f[1] =
            null != e
              ? a.stateFunc.args.raidId
              : `raid:${a.stateFunc.args.raidId}`;
          f[2] = b;
          break;
        case "dungeonBattleWinTitan":
          f[0] = a.amount;
          f[1] = cheats.translate(
            `LIB_TITAN_ELEMENT_${a.stateFunc.args.useTitanByElement}`
          );
          break;
        case "fragmentHeroGetCampaign":
          f[0] = a.amount;
          f[1] = cheats.translate(`LIB_HERO_NAME_${a.stateFunc.args.unitId}`);
          break;
        case "freeStaminaHours":
          f[0] = a.stateFunc.args.startHour;
          f[1] = a.stateFunc.args.endHour;
          break;
        case "arenaPlace":
        case "eventRatingQuizPlace":
        case "eventRatingSendPlace":
        case "eventRatingTakePlace":
        case "grandArenaPlace":
          f[0] = a.stateFunc.args.place;
          break;
        case "heroAmountStarsById":
          f[0] = a.amount;
          f[1] = this.kVa(a.stateFunc.args.heroId);
          break;
        case "heroArtifactLevelBySlot":
          f[0] = a.amount;
          f[1] = this.kVa(a.stateFunc.args.heroId);
          // a.stateFunc.args.slot;
          break;
        case "heroAscensionRankAmount":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.rank | 0;
          break;
        case "heroAscensionRankById":
          f[0] = this.kVa(a.stateFunc.args.id);
          f[1] = a.stateFunc.args.rank | 0;
          break;
        case "heroByNameColor":
          f[0] = this.kVa(a.stateFunc.args.id);
          f[1] = a.stateFunc.args.color;
          break;
        case "heroEnchantRuneByType":
          f[0] = cheats.translate(
            `LIB_BATTLESTATDATA_${a.stateFunc.args.runeType}`
          );
          break;
        case "heroPerkGiftLevelUp":
          f[0] = ~~a.stateFunc.args.perk;
          break;
        case "heroPerkSkillLevelUp":
          f[0] = ~~a.stateFunc.args.perk;
          break;
        case "heroPerkSkinLevelUp":
          f[0] = ~~a.stateFunc.args.perk;
          break;
        case "heroQualityCount":
        case "petAmountColor":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.color;
          break;
        case "heroRunesSumLevel":
          f[0] = a.amount;
          f[1] = this.kVa(a.stateFunc.args.heroId);
          break;
        case "heroSkillSumLevel":
          f[0] = a.amount;
          f[1] = this.kVa(a.stateFunc.args.heroId);
          break;
        case "invasionBossLevel":
          f[0] = cheats.translate(
            `LIB_INVASION_NAME_${a.stateFunc.args.invasionId}`
          );
          f[1] = cheats.translate(
            `LIB_INVASION_BOSS_${a.stateFunc.args.bossId}`
          );
          f[2] = a.stateFunc.args.level;
          break;
        case "invasionQuestCount":
          f[0] = a.amount;
          f[1] = cheats.translate(
            `LIB_INVASION_NAME_${a.stateFunc.args.invasionId}`
          );
          break;
        case "missionCompleteEliteAny":
          f[0] = a.amount;
          break;
        case "missionCompleteExtendedChapter":
          f[0] = ~~a.stateFunc.args.chapter;
          f[1] = a.amount;
          break;
        case "missionCompleteExtendedStars":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.stars;
          break;
        case "missionCompleteName":
          f[0] = ~~a.stateFunc.args.id;
          break;
        case "missionCompleteNameCount":
          f[1] = ~~a.stateFunc.args.id;
          f[0] = a.amount;
          break;
        case "missionDefeatUnitByChapter":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.chapter;
          break;
        case "heroAmountStars":
        case "petAmountStars":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.star;
          break;
        case "heroByIdName":
        case "heroByNameOrange":
        case "heroByNamePurple":
        case "heroByNameRed":
        case "petByNameBlue":
        case "petByNamePurple":
        case "petByNameStars":
          f[0] = this.kVa(a.stateFunc.args.id);
          break;
        case "petColorById":
          f[0] = this.kVa(a.stateFunc.args.id);
          f[1] = a.stateFunc.args.color;
          break;
        case "questFarmBattlePass":
          f[0] = a.amount;
          f[1] = cheats.translate(
            `LIB_BATTLE_PASS_NAME_${a.stateFunc.args.id}`
          );
          break;
        case "raidVipTickets":
          f[0] = "n";
          break;
        case "resourceSpentTypeId":
          f[0] = a.stateFunc.args.id;
          f[1] = a.stateFunc.args.type;
          break;
        case "roleAscensionEvolveAmount":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.level;
          break;
        case "roleAscensionLevelById":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.id;
          break;
        case "runeLevelCount":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.level;
          break;
        case "skinsLevelsByCertainHero":
          f[0] = this.kVa(a.stateFunc.args.unitId);
          f[1] = a.amount;
          break;
        case "skinsLevelsByHero":
          f[0] = this.kVa(a.stateFunc.args.unitId);
          f[1] = a.amount;
          break;
        case "socialGifts":
          //"LIB_QUEST_TRANSLATE_SOCIALGIFTS2";
          break;
        case "specialQuestFarmByEventTypeId":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.specialQuestEventTypeId;
          break;
        case "starmoneySubscription":
          f[0] = "n";
          break;
        case "storyFragmentByBook":
          (f[0] = ~~a.stateFunc.args.id), (f[1] = "");
          break;
        case "titanArtifactAmountLevel":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.level;
          break;
        case "titanArtifactAmountStars":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.star;
          break;
        case "titanArtifactAmountStarsById":
          f[0] = a.stateFunc.args.id;
          f[1] = "";
          f[2] = a.amount;
          break;
        case "titanGiftLevelById":
          f[0] = a.amount;
          f[1] = this.kVa(a.stateFunc.args.heroId);
          break;
        case "titanGiftLevelCount":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.level;
          break;
        case "heroSkinAmountByLevel":
        case "titanSkinAmountByLevel":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.level;
          break;
        case "heroSkinLevelById":
        case "titanSkinLevelById":
          b = a.stateFunc.args.skinId;
          (f[0] = a.stateFunc.args.skinId), (f[2] = a.amount);
          break;
        case "titanStarsCount":
          f[0] = a.amount;
          f[1] = a.stateFunc.args.star;
          break;
        case "towerFloor":
          f[0] = a.stateFunc.args.floorNumber;
          break;
        case "unitLevelUpById":
          f[0] = a.amount;
          f[1] = this.kVa(~~a.stateFunc.args.unitId);
          break;
        case "worldCompleteName":
          f[0] = a.amount;
          f[1] = ~~a.stateFunc.args.id;
          break;
        default:
          f[0] = a.amount;
      }
      return f;
    },
    kVa: function (id) {
      return cheats.translate(`LIB_HERO_NAME_${id}`);
    },
  };
})();
