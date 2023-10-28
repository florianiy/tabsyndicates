var last_tab_id;
var last_tab_obj;
var groups = {};

const add_to_group_id = CreateMenuItem("Add to group");
const restore_favicon = CreateMenuItem("Restore favicon");
menus.onClicked.addListener(OnMenuItemClicked);

localStorage.removeItem("last-closed");
window.addEventListener("storage", async (opts) => {
  if (opts.key == "last-closed") return;
  const { color, name } = JSON.parse(opts.newValue);
  console.log("%c" + name, "color:color");
  const groupid = CreateGroup(name, color);
  window.automation_group_id = groupid;
  console.log(automation_group_id);
  CreateSyndicateForum(last_tab_obj, groupid);
  UpdateGroupForTab(last_tab_id, groupid);
});

browser.tabs.onMoved.addListener(MoveTabsWithTheirForum);
browser.tabs.onMoved.addListener(onMoveUpdateSyndicateForumsIndex);
browser.tabs.onMoved.addListener(onMoveOutOfBoundsRemoveFromSyndicate);
browser.tabs.onMoved.addListener(onMoveInBoundsIncludeTabInSyndicate);
browser.tabs.onRemoved.addListener(onTabRemovedDeleteRecords);

var last_highlight = [];
var triggered_by_me = false;
browser.tabs.onHighlighted.addListener(({ tabIds, windowId }) => {
  if (triggered_by_me) return (triggered_by_me = !triggered_by_me);
  console.log("highglight");
  if (JSON.stringify(last_highlight) == JSON.stringify(tabIds)) {
    highlight_fuck = true;
    return console.log("just focus changed, not highilight");
  }
  last_highlight = tabIds;
  console.log("real highligjht");
  console.log(tabIds);

  if (tabIds.length != 2) {
    highlight_fuck = false;
    return console.log(tabIds.length + " tabs");
  }

  var arr = [];

  Object.keys(groups).forEach((gid) => {
    const sid = groups[gid].syndicate_forum_tab.id;
    if (!tabIds.includes(sid))
      return console.log(`forum {${sid}} is not hightlighed`);
    console.log("highlighted");

    const sindex = groups[gid].syndicate_forum_tab.index;
    for (let i = sindex + groups[gid].tabs.length; i > sindex; i--) {
      arr.push(i);
    }
    arr.push(sindex);
  });
  highlight_fuck = !!arr.length;
  triggered_by_me = !!arr.length;
  tabs.highlight({ tabs: arr }).catch(() => {
    console.log("highlight fuck");
  });
});
// seems that this is triggered when the extension loads
// onWindowClosing(() => {
//   console.warn("window is closing", groups);
//   Object.keys(groups).forEach((gid) => {
//     browser.tabs.remove(groups[gid].tabs);
//     browser.tabs.remove(groups[gid].syndicate_forum_tab.id);
//   });

// });

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

// the idea is that when you are in a tab from a syndicate you
// highlight all tabs in that syndicate even the forum
// why? cuz when you will move them they will move togheter
// there is a bug: the highlight dissapears quickly
// unstable: so i will comment it for now
//
// browser.tabs.onActivated.addListener(({ tabId }) => {
//   browser.tabs.get(tabId).then((tab) => {
//     console.log(tab);
//     Object.keys(groups).forEach((gid) => {
//       if (groups[gid].tabs.includes(tab.id)) {
//         console.log("founduoi");
//         browser.tabs.highlight({
//           tabs: [
//             // groups[gid].syndicate_forum_tab.index,
//             ...groups[gid].tabs.map(
//               (it, ind) => groups[gid].syndicate_forum_tab.index + ind + 1
//             ),
//           ],
//         });
//       }
//     });
//   });
// });
// browser.tabs.onRemoved.addListener(Update);

//
//
browser.runtime.onUpdateAvailable.addListener(() =>
  console.log("update available")
);

// OnSyndicateForumClose(ToggleSyndicateHide);
