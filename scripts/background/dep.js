const ff = browser;
const tabs = ff.tabs;
const store = ff.storage.local;
const menus = ff.menus;

function CreateMenuItem(title, other = {}) {
  const id = MenuIdFromTitle(title);
  menus.create({
    id,
    title,
    type: "normal",
    contexts: ["tab"],
    ...other,
  });
  return id;
}

function StartGroupCreator() {
  browser.windows.create({
    url: "/SyndicateCreator/index.html",
    type: "popup",
    height: 150,
    width: 250,
    allowScriptsToClose: true,
  });
}

function CreateTabs(
  num,
  url = "https://www.google.com/search?client=firefox-b-d&q=asdasdasdasd"
) {
  for (let i = 0; i < num; i++) {
    browser.tabs.create({
      url,
    });
  }
}

function MenuIdFromTitle(name) {
  return name.replaceAll(" ", "_");
}

function SVGCircleFromColor(color) {
  return (
    "data:image/svg+xml;base64," +
    btoa(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle fill="${color}" cx="50" cy="50" r="50" />
  </svg>`)
  );
}

function ToggleSyndicateHide(groupid, cb = () => {}) {
  tabs[groups[groupid].hidden ? "show" : "hide"](groups[groupid].tabs).then(cb);
  groups[groupid].hidden = !groups[groupid].hidden;
}

function OnSyndicateForumClose(cb) {
  tabs.onRemoved.addListener((tabid, { isWindowClosing }) => {
    if (isWindowClosing) return;

    Object.keys(groups).forEach((groupid) => {
      if (groups[groupid].tabs.includes(tabid))
        RemoveTabFromGroup(tabid, groupid);

      if (groups[groupid]?.syndicate_forum_tab?.id == tabid) {
        console.log(groups[groupid].tabs);

        if (groups[groupid].tabs.length == 0) return;

        CreateSyndicateForum(
          { index: groups[groupid].syndicate_forum_tab.index },
          groupid
        );

        cb(groupid);
      }
    });
  });
}

function OnSyndicateForumFocus(cb) {
  tabs.onActivated.addListener(({ tabId, previousTabId }) => {
    Object.keys(groups).forEach((groupid) => {
      if (groups[groupid]?.syndicate_forum_tab?.id == tabId) {
        cb(groupid, tabId, previousTabId);
      }
    });
  });
}
