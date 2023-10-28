var groups = {};

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

OnSyndicateForumFocus((gid, tid, ptid) => {
  // if (!groups[gid].tabs.length)
  //   return console.warn("closed forum due to inactivity");
  //

  ToggleSyndicateHide(gid);
  // highlight next after the group
  const index =
    groups[gid].syndicate_forum_tab.index + groups[gid].tabs.length + 1;
  tabs
    .highlight({
      tabs: [index],
    })
    .catch(() => {
      // if no tab after the syndicate is present
      // use chrome groups behaviour: highlight tab before syndicate forum
      tabs.highlight({ tabs: [groups[gid].syndicate_forum_tab.index - 1] });
    });
});
