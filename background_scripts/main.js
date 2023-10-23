// variables

var last_tab_id;
var last_tab_obj;
var groups = {};

// important dependencies
//
//

function CreateGroup(name, color) {
  const id = MenuIdFromTitle(name);

  if (!Object.keys(groups).length) CreateMenuItem("", { type: "separator" });

  if (groups[id])
    return console.warn("Group: " + name + " already exists: abort");

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

menus.onClicked.addListener((info, tab) => {
  last_tab_id = tab.id;
  last_tab_obj = tab;

  if (add_to_group_id == info.menuItemId) StartGroupCreator();
  else {
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
  const { color, name } = JSON.parse(opts.newValue);
  const groupid = CreateGroup(name, color);
  CreateSyndicateForum(last_tab_obj, groupid);
  UpdateGroupForTab(last_tab_id, groupid);
});

tabs.onHighlighted.addListener(({ tabIds }) => {
  Object.keys(groups).forEach((groupid) => {
    if (!groups[groupid].syndicate_forum_tab) return;

    if (tabIds.length) tabIds = tabIds[0];
    if (groups[groupid].syndicate_forum_tab.id == tabIds) {
      if (groups[groupid].hidden) {
        browser.tabs.show(groups[groupid].tabs);
        groups[groupid].hidden = false;
      } else {
        browser.tabs.hide(groups[groupid].tabs);
        groups[groupid].hidden = true;
      }
    }
  });
});
