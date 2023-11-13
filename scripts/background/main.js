var groups = {};

const spin_forever = CreateMenuItem("Spin around forever");
const add_to_group_id = CreateMenuItem("Add to group");
const restore_favicon = CreateMenuItem("Restore favicon");

browser.menus.onClicked.addListener(OnMenuItemClicked);

browser.tabs.onMoved.addListener((tabid, { fromIndex, toIndex }) => {
  if (self_imposed_move_event) return;

  if (isTabSyndicate(tabid)) {
    console.log("Moved Syndicate");
    const group = groups[whatGidGroupAmIIn(tabid)];
    // it also updates the index on the forum syndicate
    MoveTabsWithTheirForum(group, fromIndex, toIndex);
  } else {
    if (isInbounds(toIndex)) {
      console.log("Moved Inbounds");
      UpdateGroupForTab(tabid, getGidBounds(toIndex));
    } else if (isOutbounds(toIndex)) {
      console.log("Moved Outbounds");
      const gid = getHisGidIfAny(tabid);
      if (gid) {
        RemoveTabFromGroup(tabid, gid);
        browser.tabs.sendMessage(tabid, `{ "type": "restore-favicon" }`);
      }
    }
  }
});

browser.tabs.onRemoved.addListener(onTabRemovedDeleteRecords);
// browser.tabs.onHighlighted.addListener(onHighlightedSelectEntireSyndicate);

onWindowClosing(() => {
  // todo remove all stuff and save to storage order of tabs and their groups
});

OnSyndicateForumFocus((gid, tin, ptin) => {
  ToggleSyndicateHide(gid);
  UpdateIconForHideShowStatus(gid);
  HandleTakeFocusFromSyndicate(gid, tin, ptin);
});
