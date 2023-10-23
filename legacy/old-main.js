var G$ = {
  // you will see "groups" called also "syndicates"
  groups: {},
};

var lastMenuItemId;

async function NewGroupMaybe({ menuItemName, menuItemId, tabs, color }, tabid) {
  if (!G$.groups.hasOwnProperty(name))
    G$.groups[menuItemName] = {
      tabs: [],
      menuname: menuItemName,
      color,
    };

  if (G$.groups[name].tabs.includes(tabid)) return;

  G$.groups[name].tabs.push(tabid);

  if (G$.groups[name].menuItemId) menus.remove(G$.groups[name].menuItemId);
  else
    G$.groups[name].menuItemId = MyCreateMenu(name, {
      icons: { 16: ColoredIcon(color) },
    }); // + " --- " + G$.groups[name].tabs.length);

  const msgToTab = { type: "update-group", svg: ColoredIcon(color) };
  console.log(msgToTab);
  browser.tabs.sendMessage(tabid, JSON.stringify(msgToTab));
}

window.addEventListener("storage", async (opts) => {
  NewGroupMaybe(JSON.parse(opts.newValue), lastMenuItemId);
});

async function main() {
  const addtogroup_id = await MyCreateMenu("Add to group");

  menus.onClicked.addListener(async (info, tab) => {
    lastMenuItemId = tab.id;
    if (info.menuItemId == addtogroup_id) {
      StartSyndicateGroupCreatorPopup();
    } else {
      console.log("clicked on group: " + info.menuItemId);
      Object.keys(G$.groups).forEach((group) => {
        if (group.menuItemId == info.menuItemId) {
          console.log("found the menu " + group.menuItemName);
          NewGroupMaybe(group, tab.id);
        }
      });
    }
  });
}

main();

async function StartSyndicateGroupCreatorPopup() {
  const res = await browser.windows.create({
    url: "/SyndicateCreator/index.html",
    type: "popup",
    height: 150,
    width: 250,
    allowScriptsToClose: true,
  });
}
