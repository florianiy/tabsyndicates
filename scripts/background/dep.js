function CreateMenuItem(title, other = {}) {
  const id = MenuIdFromTitle(title);
  browser.menus.create({
    id,
    title,
    type: "normal",
    contexts: ["tab"],
    ...other,
  });
  return id;
}

function CreateTabs(
  num,
  url = "https://www.google.com/search?client=firefox-b-d&q=asdasdasdasd",
  cb = () => {}
) {
  for (let i = 0; i < num; i++) {
    browser.tabs
      .create({
        url,
      })
      .then(cb);
  }
}

function MenuIdFromTitle(name) {
  return name.replaceAll(" ", "_");
}

function CreateForumAndFirstMember(tab, cb = () => {}) {
  const popi = new Popup("/SyndicateCreator/index.html");
  popi.Open((port) => {
    port.onMessage.addListener((obj) => {
      console.warn("item clicked", obj);
      const { color, name } = obj;
      console.log("%c" + name, "color:color");
      const groupid = CreateGroup(name, color);
      CreateSyndicateForum(tab, groupid);
      UpdateGroupForTab(tab.id, groupid);
      cb(groupid);
      popi.Close();
      delete popi;
    });
  });
}

function OnMenuItemClicked(info, tab) {
  if (add_to_group_id == info.menuItemId) {
    CreateForumAndFirstMember(tab);
  } else if (spin_forever == info.menuItemId) {
    SpinAroundInfinetely(
      tab.id,
      "#" + Math.round(Math.random() * 16777216).toString(16)
    );
  } else if (re_favicon == info.menuItemId) {
    browser.tabs.sendMessage(tab.id, JSON.stringify({ type: "re-favicon" }));
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

function CreateSyndicateForum(tabobj, groupid) {
  const opts = { url: "/SyndicateForum/index.html", index: tabobj.index };
  console.log(tabobj);

  browser.tabs.create(opts).then((syntab) => {
    groups[groupid].syndicate_forum_tab = syntab;

    console.log(groups[groupid]);

    browser.tabs
      .executeScript(syntab.id, {
        file: "/SyndicateForum/main.js",
      })
      .then(() => {
        // why here, cuz in the scope before it does not work
        browser.tabs
          .highlight({ tabs: [tabobj.index + 1] })
          .catch(() =>
            console.log("highlight first member", [tabobj.index + 1])
          );
        const color = groups[groupid].color;
        const svg = IconFromSVGs(
          StackSvgsOnTopEachOther([
            SVGCircle(color, true),
            SVGForum(color),
            SVGCarrot(color),
          ])
        );
        const name = groups[groupid].name;
        const msgToTab = { type: "update-syndicate-forum", svg, name, color };
        browser.tabs.sendMessage(syntab.id, JSON.stringify(msgToTab));

        // SpinAroundInfinetely(groupid);
      });
  });
}

function CreateGroup(name, color) {
  const id = MenuIdFromTitle(name);
  if (!Object.keys(groups).length) CreateMenuItem("", { type: "separator" });

  if (groups[id]) return console.warn(`Group: ${name} already exists: abort`);

  groups[id] = { name, color, tabs: [] };
  const svg = IconFromSVGs(SVGCarrot(color));
  CreateMenuItem(name, { icons: { 16: svg, 32: svg } });

  return id;
}

function isTabSyndicate(tabid) {
  for (var gid in groups)
    if (groups[gid].syndicate_forum_tab.id == tabid) return true;
  return false;
}
function whatGidGroupAmIIn(tabid) {
  for (var gid in groups)
    if (groups[gid].syndicate_forum_tab.id == tabid) return gid;
  return false;
}

function forEachGroup(cb) {
  for (var gid in groups) cb(groups[gid], gid);
}

function DigestGroup(group) {
  return { syn: group.syndicate_forum_tab, tabs: group.tabs };
}

function isInbounds(index) {
  for (var gid in groups) {
    const { syn, tabs } = DigestGroup(groups[gid]);
    if (index >= syn.index && index <= syn.index + tabs.length) return true;
  }
  return false;
}

function getGidBounds(index) {
  for (var gid in groups) {
    const { syn, tabs } = DigestGroup(groups[gid]);
    if (index >= syn.index && index <= syn.index + tabs.length) return gid;
  }
  return undefined;
}

function isOutbounds(index) {
  for (var gid in groups) {
    const { syn, tabs } = DigestGroup(groups[gid]);
    if (syn.index + tabs.length < index || index <= syn.index) return true;
  }
  return false;
}

function getHisGidIfAny(tabid) {
  for (var gid in groups) {
    if (groups[gid].tabs.includes(tabid)) return gid;
  }
  return undefined;
}

function UpdateGroupForTab(tabid, groupid) {
  if (groups[groupid].tabs.includes(tabid))
    return console.warn(
      "Tab (id=" + tabid + ") already is in group (id=" + groupid + ")"
    );

  groups[groupid].tabs.push(tabid);

  const svg = SVGCarrotComfy(groups[groupid].color);
  const msgToTab = { type: "update-group", svg };
  browser.tabs.sendMessage(tabid, JSON.stringify(msgToTab));
}

function RemoveTabFromGroup(tabid, groupid) {
  groups[groupid].tabs = groups[groupid].tabs.filter((it) => it != tabid);
}

function ToggleSyndicateHide(groupid) {
  // when it hides the syndicate the next tab gets focused before animation finishes
  // and this causes that focused tab to move when the tabs reallly close ___pls_solve

  const group = groups[groupid];
  const { syn, tabs } = DigestGroup(group);
  var dt = (group?.show_hide_delay || 300) / (tabs.length - 1);
  var i = 0;

  if (group.hidden) {
    // when the tabs in this syndicate are last in the tab bar
    // (when you show a tab it does not scroll to it) so it appears
    // as it is never showing and always staying hidden
    // to prevent this i am gonna do a little higlight
    const lambda = () =>
      browser.tabs
        .show(tabs[i++])
        .catch(() => {
          console.log("cannot hide tab in toggle syndicate/group hide");
        })
        .then(() => {
          // just +i and not +i+1 cuz we do a i++ before
          browser.tabs.highlight({ tabs: [syn.index + i] }).then(() => {
            HandleTakeFocusFromSyndicate(groupid);
          });
        });

    const iid = setInterval(() => {
      if (i >= tabs.length) return clearInterval(iid);
      lambda();
    }, dt);
  } else {
    i = tabs.length - 1;
    const lambda = () =>
      browser.tabs.hide(tabs[i--]).catch(() => {
        console.log("cannot hide tab in toggle syndicate/group hide");
      });
    const iid = setInterval(() => {
      if (i < 0) return clearInterval(iid);
      lambda();
    }, dt);
  }

  group.hidden = !group.hidden;
}

// out of order
function OnSyndicateForumClose(cb) {
  browser.tabs.onRemoved.addListener((tabid, { isWindowClosing }) => {
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
  browser.tabs.onActivated.addListener(({ tabId, previousTabId }) => {
    Object.keys(groups).forEach((groupid) => {
      if (groups[groupid]?.syndicate_forum_tab?.id == tabId) {
        cb(groupid, tabId, previousTabId);
      }
    });
  });
}
var self_imposed_move_event = false;
function MoveTabsWithTheirForum(group, i, j) {
  self_imposed_move_event = true;

  const { syn, tabs } = DigestGroup(group);

  if (i < j) {
    tabs
      .move(tabs, { index: j + 1 })
      .then(() => (self_imposed_move_event = false));
  } else {
    var index = i;
    tabs.move(syn.id, { index }).then(() => {
      syn.index = index;

      index = j + tabs.length;
      tabs.move([syn.id, ...tabs], { index }).then(() => {
        syn.index = index;
        self_imposed_move_event = false;
      });
    });
  }
}

function onWindowClosing(cb) {
  browser.tabs.onRemoved.addListener((_, { isWindowClosing }) => {
    if (isWindowClosing) cb();
  });
}

function onTabRemovedDeleteRecords(tabid, { isWindowClosing }) {
  if (isWindowClosing) return;

  Object.keys(groups).forEach((gid) => {
    if (groups[gid].tabs.includes(tabid)) {
      RemoveTabFromGroup(tabid, gid);
    }
  });
}

var last_highlight = [];
var triggered_by_me = false;
function onHighlightedSelectEntireSyndicate({ tabIds, windowId }) {
  if (triggered_by_me) return (triggered_by_me = !triggered_by_me);
  // console.log("highglight");
  if (JSON.stringify(last_highlight) == JSON.stringify(tabIds)) {
    highlight_fuck = true;
    return console.log("just focus changed, not highilight");
  }
  last_highlight = tabIds;
  // console.log("real highligjht");
  // console.log(tabIds);

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
}

function HandleTakeFocusFromSyndicate(gid, tin, ptin) {
  // highlight next after the group
  const { syn, tabs } = DigestGroup(groups[gid]);

  const next = syn.index + tabs.length + 1,
    prev = syn.index - 1;

  browser.tabs.highlight({ tabs: [next] }).catch(() => {
    // if no tab after the syndicate is present
    // use chrome groups behaviour: highlight tab before syndicate forum
    browser.tabs
      .highlight({ tabs: [prev] })
      .catch(() => console.log("tab before syn is broken"));
  });
}

function UpdateIconForHideShowStatus(gid) {
  var svg = "";

  if (groups[gid].hidden)
    svg = IconFromSVGs(SVGRotateNoG(SVGCarrot(groups[gid].color), 180));
  else svg = IconFromSVGs(SVGRotateNoG(SVGCarrot(groups[gid].color), 270));

  browser.tabs.sendMessage(
    groups[gid].syndicate_forum_tab.id,
    JSON.stringify({
      type: "update-syndicate-forum-icon",
      svg,
    })
  );
}
