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
function ReorderSyndicates() {
  // Object.keys(groups).map((groupid) => {});
}
function CreateSyndicateForum(tabobj, groupid) {
  const url = "/SyndicateForum/index.html";

  tabs.create({ url, index: tabobj.index }).then((syntab) => {
    groups[groupid].syndicate_forum_tab = syntab;

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
    ReorderSyndicates();
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
window.addEventListener("storage", async (opts) => {
  if (opts.key == "last-closed") return;
  const { color, name } = JSON.parse(opts.newValue);
  const groupid = CreateGroup(name, color);
  CreateSyndicateForum(last_tab_obj, groupid);
  UpdateGroupForTab(last_tab_id, groupid);
});

tabs.onMoved.addListener((tabid, { fromIndex, toIndex }) => {
  Object.keys(groups).forEach((groupid) => {
    if (!groups[groupid].syndicate_forum_tab) return;
    if (groups[groupid].syndicate_forum_tab.id != tabid) return;

    tabs.move(groups[groupid].tabs, {
      index: toIndex + (fromIndex - toIndex > 0 ? +1 : 0),
    });
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

function AreYouThere() {}

function onMoveUpdateSyndicateForumsIndex(tabid, { fromIndex, toIndex }) {
  // update quickly not asssync the forum if it was the case that it moved
  // const tab = browser.tabs.get(tabid);
  // Object.keys(groups).forEach((groupid) => {
  //   if (groups[groupid].syndicate_forum_tab.id == tabid) {
  //     console.log("foudya");
  //     groups[groupid].syndicate_forum_tab = tab;
  //     if (fromIndex < toIndex)
  //       groups[groupid].syndicate_forum_tab.index =
  //         toIndex - groups[groupid].tabs.length;
  //     // because of the moving right issue with the tabs - this should be fixed soon
  //     else groups[groupid].syndicate_forum_tab.index = toIndex;
  //   }
  // });

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

    // update all syndicates - no matter cuz they might have been pushed also
    // tabs.map((tab) => {
    //   Object.keys(groups).forEach((gid) => {
    //     if (tab == groups[gid].syndicate_forum_tab.id) {
    //       groups[gid].syndicate_forum_tab = tab;
    //     }
    //   });
    // });
  });
}
// browser.tabs.onCreated.addListener(Update);
// browser.tabs.onActivated.addListener(Update);
// browser.tabs.onRemoved.addListener(Update);
browser.tabs.onMoved.addListener(onMoveUpdateSyndicateForumsIndex);
// browser.tabs.onMoved.addListener(onMoveOutOfBoundsRemoveFromSyndicate);

function onMoveOutOfBoundsRemoveFromSyndicate(tabid, opts) {
  const from = opts.fromIndex;
  const to = opts.toIndex;

  Object.keys(groups).forEach((gid) => {
    groups[gid].tabs.forEach((_tabid) => {
      if (_tabid == tabid) {
        const si = groups[gid].syndicate_forum_tab;

        if (si.index + groups[gid].tabs.length < to || to <= si.index) {
          console.warn("outofbounds");

          RemoveTabFromGroup(_tabid, gid);
          browser.tabs.sendMessage(
            _tabid,
            JSON.stringify({ type: "restore-favicon" })
          );
        }
      }
    });
  });
}
