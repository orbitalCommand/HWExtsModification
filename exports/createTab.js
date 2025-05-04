export function createTab(name) {
  let tab = document.createElement("li");
  tab.className = "wds-tabs__tab";

  let tab_button = document.createElement("div");
  tab_button.className = "wds-tabs__tab-label";
  tab_button.innerText = name;

  tab.appendChild(tab_button);

  let tab_content = document.createElement("div");
  tab_content.className = "wds-tab__content";

  return { tab, tab_content };
}
