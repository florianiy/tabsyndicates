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

OnSyndicateForumFocus((gid, tid, ptid) => {
  // if (!groups[gid].tabs.length)
  //   return console.warn("closed forum due to inactivity");
  //

  ToggleSyndicateHide(gid, () => {
    // highlight next after the group
    console.log("asd");
    const index =
      groups[gid].syndicate_forum_tab.index + groups[gid].tabs.length + 1;
    console.warn(gid + " focus this" + index);
    tabs.highlight({
      tabs: [index],
    });
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
