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

function OnMenuItemClicked(info, tab) {
  last_tab_id = tab.id;
  last_tab_obj = tab;

  if (add_to_group_id == info.menuItemId) StartGroupCreator();
  else if (restore_favicon == info.menuItemId) {
    browser.tabs.sendMessage(
      tab.id,
      JSON.stringify({ type: "restore-favicon" })
    );
  } else {
    console.log("clicked on itemid: " + info.menuItemId);
    Object.keys(groups).forEach((groupid) => {
      if (groupid == info.menuItemId) {
        console.log("found item with id: " + groupid);
        RemoveTabFromGroup(last_tab_id, groupid);
        UpdateGroupForTab(last_tab_id, groupid);
      }
    });
  }
}

function SVGCircleFromColor(color) {
  return (
    "data:image/svg+xml;base64," +
    btoa(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle fill="${color}" cx="50" cy="50" r="50" />
  </svg>`)
  );
}

function CreateSyndicateForum(tabobj, groupid) {
  const url = "/SyndicateForum/index.html";

  tabs.create({ url, index: tabobj.index }).then((syntab) => {
    groups[groupid].syndicate_forum_tab = syntab;
    tabs.highlight({ tabs: [tabobj.index + 1] });
    browser.tabs
      .executeScript(syntab.id, {
        file: "/SyndicateForum/main.js",
      })
      .then(() => {
        const color = groups[groupid].color;
        const svg = SVGCircleFromColor(color);
        const name = groups[groupid].name;
        const msgToTab = { type: "update-syndicate-forum", svg, name, color };
        tabs.sendMessage(syntab.id, JSON.stringify(msgToTab));
      });
  });
}

function CreateGroup(name, color) {
  const id = MenuIdFromTitle(name);
  if (!Object.keys(groups).length) CreateMenuItem("", { type: "separator" });

  if (groups[id]) return console.warn(`Group: ${name} already exists: abort`);

  groups[id] = { name, color, tabs: [] };
  const svg = SVGCircleFromColor(color);
  CreateMenuItem(name, { icons: { 16: svg, 32: svg } });

  return id;
}

function UpdateGroupForTab(tabid, groupid) {
  if (groups[groupid].tabs.includes(tabid))
    return console.warn(
      "Tab (id=" + tabid + ") already is in group (id=" + groupid + ")"
    );

  groups[groupid].tabs.push(tabid);

  const svg = SVGCircleFromColor(groups[groupid].color);
  const msgToTab = { type: "update-group", svg };
  browser.tabs.sendMessage(tabid, JSON.stringify(msgToTab));
}

function RemoveTabFromGroup(tabid, groupid) {
  groups[groupid].tabs = groups[groupid].tabs.filter((it) => it != tabid);
}

function ToggleSyndicateHide(groupid, cb = () => {}) {
  tabs[groups[groupid].hidden ? "show" : "hide"](groups[groupid].tabs)
    .then(cb)
    .catch(() => {
      console.log("togle hide, invalid tab id");
    });
  groups[groupid].hidden = !groups[groupid].hidden;
}

// out of order
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

var fuck = false;
function MoveTabsWithTheirForum(tabid, { fromIndex, toIndex }) {
  if (fuck) return (fuck = !fuck);
  Object.keys(groups).forEach((groupid) => {
    if (!groups[groupid].syndicate_forum_tab) return;
    if (groups[groupid].syndicate_forum_tab.id != tabid) return;

    var newIndex;
    if (toIndex < fromIndex) newIndex = toIndex + 1;
    else {
      fuck = true;
      return tabs
        .move(groups[groupid].syndicate_forum_tab.id, {
          index: fromIndex,
        })
        .then(() => {
          fuck = true;

          tabs.move(
            [groups[groupid].syndicate_forum_tab.id, ...groups[groupid].tabs],
            {
              index: toIndex + groups[groupid].tabs.length,
            }
          );
        });

      // tabs.move(groups[groupid].tabs, { index: -1 });
      // newIndex = toIndex;
    }

    tabs.move(groups[groupid].tabs, { index: newIndex });
  });
}

function onMoveUpdateSyndicateForumsIndex(tabid, { fromIndex, toIndex }) {
  browser.tabs.query({}).then((tabs) => {
    tabs.map((tab) => {
      // update syndicate forum it it changed
      if (tab.id == tabid) {
        Object.keys(groups).forEach((groupid) => {
          if (groups[groupid].syndicate_forum_tab.id == tab.id) {
            console.log("foudya");
            groups[groupid].syndicate_forum_tab = tab;
            if (fromIndex < toIndex)
              groups[groupid].syndicate_forum_tab.index =
                toIndex - groups[groupid].tabs.length;
            // because of the moving right issue with the tabs - this should be fixed soon
            else groups[groupid].syndicate_forum_tab.index = toIndex;
          }
        });
      }
    });
  });
}

function onMoveOutOfBoundsRemoveFromSyndicate(tabid, opts) {
  const from = opts.fromIndex;
  const to = opts.toIndex;

  Object.keys(groups).forEach((gid) => {
    groups[gid].tabs.forEach((_tabid) => {
      if (_tabid == tabid) {
        console.error(groups[gid].syndicate_forum_tab.id);
        browser.tabs.get(groups[gid].syndicate_forum_tab.id).then((tab) => {
          groups[gid].syndicate_forum_tab = tab;

          const si = groups[gid].syndicate_forum_tab;

          if (si.index + groups[gid].tabs.length < to || to <= si.index) {
            console.warn("outofbounds");

            RemoveTabFromGroup(_tabid, gid);
            browser.tabs.sendMessage(
              _tabid,
              JSON.stringify({ type: "restore-favicon" })
            );
          }
        });
      }
    });
  });
}

function onMoveInBoundsIncludeTabInSyndicate(tabid, { toIndex }) {
  /// works perfectly
  Object.keys(groups).forEach((gid) => {
    const syindex = groups[gid].syndicate_forum_tab.index;
    const tabs = groups[gid].tabs;
    if (toIndex >= syindex && toIndex <= syindex + tabs.length) {
      UpdateGroupForTab(tabid, gid);
    }
  });
}
