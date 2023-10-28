var groups = {};

const spin_forever = CreateMenuItem("Spin around forever");
const add_to_group_id = CreateMenuItem("Add to group");
const restore_favicon = CreateMenuItem("Restore favicon");

menus.onClicked.addListener(OnMenuItemClicked);
browser.tabs.onMoved.addListener(MoveTabsWithTheirForum);
browser.tabs.onMoved.addListener(onMoveUpdateSyndicateForumsIndex);
browser.tabs.onMoved.addListener(onMoveOutOfBoundsRemoveFromSyndicate);
browser.tabs.onMoved.addListener(onMoveInBoundsIncludeTabInSyndicate);
browser.tabs.onRemoved.addListener(onTabRemovedDeleteRecords);
browser.tabs.onHighlighted.addListener(onHighlightedSelectEntireSyndicate);

onWindowClosing(() => {
  // todo remove all stuff and save to storage order of tabs and their groups
});

OnSyndicateForumFocus((gid, tin, ptin) => {
  ToggleSyndicateHide(gid);
  UpdateIconForHideShowStatus(gid);
  HandleTakeFocusFromSyndicate(gid, tin, ptin);
});
