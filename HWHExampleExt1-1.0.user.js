// ==UserScript==
// @name			HWHExampleExt1
// @name:en			HWHExampleExt1
// @name:ru			HWHExampleExt1
// @namespace		HWHExampleExt1
// @version			1.0.3
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

          const arr = await modules.getHeroes();

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
            const taskList = [
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

            console.log(taskList);
            localStorage.setItem(
              `autofarm_heroes_${userId}`,
              JSON.stringify(taskList)
            );
          }
        },
        title: "тест выбора героя",
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
    modules = await loadModules();
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
  /*
const answer = await popup.confirm('RUN_FUNCTION', [
        { msg: I18N('BTN_CANCEL'), result: false, isCancel: true },
        { msg: I18N('BTN_GO'), result: true },
      ], () => {});
      */
})();
