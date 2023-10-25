// variables
// te pup
var last_tab_id;
var last_tab_obj;
var groups = {};

// important dependencies
//
////

function CreateGroup(name, color) {
  const id = MenuIdFromTitle(name);
  if (!Object.keys(groups).length) CreateMenuItem("", { type: "separator" });

  if (groups[id]) return console.warn(`Group: ${name} already exists: abort`);

  groups[id] = { name, color, tabs: [] };
  const svg = SVGCircleFromColor(color);
  CreateMenuItem(name, { icons: { 16: svg, 32: svg } });

  return id;
}
function RemoveTabFromGroup(tabid, groupid) {
  groups[groupid].tabs = groups[groupid].tabs.filter((it) => it != tabid);
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

///
///
//// main
//
///
//

const add_to_group_id = CreateMenuItem("Add to group");
// for future
// browser.menus.onShown.addListener(async (info, tab) => {
//   browser.menus.update(menuId /*, …*/);
//   // Note: Not waiting for returned promise.
//   browser.menus.refresh();
// });

const restore_favicon = CreateMenuItem("Restore favicon");

menus.onClicked.addListener((info, tab) => {
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
});

localStorage.removeItem("last-closed");

window.addEventListener("storage", async (opts) => {
  if (opts.key == "last-closed") return;
  const { color, name } = JSON.parse(opts.newValue);
  console.log("%c" + name, "color:color");
  const groupid = CreateGroup(name, color);
  window.automation_group_id = groupid;
  CreateSyndicateForum(last_tab_obj, groupid);
  UpdateGroupForTab(last_tab_id, groupid);
});

var fuck = false;
tabs.onMoved.addListener((tabid, { fromIndex, toIndex }) => {
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
});

OnSyndicateForumFocus((gid, tid, ptid) => {
  ToggleSyndicateHide(gid, () => {
    tabs.highlight({
      tabs: [
        groups[gid].syndicate_forum_tab.index + groups[gid].tabs.length + 1,
      ],
    });
  });
});

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
// browser.tabs.onCreated.addListener(Update);
// browser.tabs.onActivated.addListener(Update);
// browser.tabs.onRemoved.addListener(Update);
browser.tabs.onMoved.addListener(onMoveUpdateSyndicateForumsIndex);
browser.tabs.onMoved.addListener(onMoveOutOfBoundsRemoveFromSyndicate);
function onMoveOutOfBoundsRemoveFromSyndicate(tabid, opts) {
  const from = opts.fromIndex;
  const to = opts.toIndex;

  Object.keys(groups).forEach((gid) => {
    groups[gid].tabs.forEach((_tabid) => {
      if (_tabid == tabid) {
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

//

browser.tabs.query({}).then((tabs) => {
  last_tab_id = tabs[4].id;

  last_tab_obj = tabs[4];
  StartGroupCreator();
  setTimeout(() => {
    window.ttt = groups[automation_group_id].tabs;
    UpdateGroupForTab(tabs[5].id, automation_group_id);
    UpdateGroupForTab(tabs[6].id, automation_group_id);
  }, 2000);
});

CreateTabs(4);
