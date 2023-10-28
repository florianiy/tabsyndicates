const ff = browser;
const tabs = ff.tabs;
const store = ff.storage.local;
const menus = ff.menus;

function CreateMenuItem(title, other = {}) {
  const id = MenuIdFromTitle(title);
  menus.create({
    id,
    title,
    type: "normal",
    contexts: ["tab"],
    ...other,
  });
  return id;
}

function StartGroupCreator() {
  browser.windows.create({
    // url: "/SyndicateCreator/index.html",
    url: [
      "/SyndicateCreator/index.html",
      // "/SyndicateCreator/index.html",
      // "/SyndicateCreator/index.html",
      // "/SyndicateCreator/index.html",
    ],
    type: "popup",
    height: 150,
    width: 250,
    titlePreface: "New Group -",
    allowScriptsToClose: true,
  });
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

function OnMenuItemClicked(info, tab) {
  if (add_to_group_id == info.menuItemId) {
    const popi = new Popup("/SyndicateCreator/index.html");
    popi.Open((port) => {
      port.onMessage.addListener((obj) => {
        console.warn("item clicked", obj);
        const { color, name } = obj;
        console.log("%c" + name, "color:color");
        const groupid = CreateGroup(name, color);
        CreateSyndicateForum(tab, groupid);
        UpdateGroupForTab(tab.id, groupid);
        popi.Close();
        delete popi;
      });
    });
  } else if (restore_favicon == info.menuItemId) {
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
}

function SVGCircle(color) {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle fill="${color}" cx="50" cy="50" r="50" />
  </svg>`;
}

function SVGForum(color) {
  return `
<svg height="100%" width="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
<g id="SVGRepo_iconCarrier">
  <path fill-rule="evenodd" clip-rule="evenodd"
    d="M20 32C28.8366 32 36 26.6274 36 20C36 13.3726 28.8366 8 20 8C11.1634 8 4 13.3726 4 20C4 22.6842 5.17509 25.1626 7.16049 27.1616C6.35561 29.4537 5.31284 31.1723 4.6499 32.1319C4.4071 32.4834 4.65714 32.9802 5.08289 32.9453C6.78453 32.8058 10.1224 32.3105 12.3741 30.5519C14.6411 31.4754 17.2389 32 20 32Z"
    fill="${color}" style="filter: hue-rotate(180deg);"></path>
  <path fill-rule="evenodd" clip-rule="evenodd"
    d="M22.7843 33.8337C31.4033 32.7928 38 26.9957 38 20.0002C38 19.4632 37.9611 18.9333 37.8855 18.4121C41.5534 20.1003 44 23.136 44 26.6002C44 28.7476 43.0599 30.7303 41.4716 32.3295C42.068 34.0278 42.8276 35.3325 43.3579 36.1259C43.5953 36.481 43.3423 36.9779 42.917 36.9372C41.5041 36.8021 39.0109 36.3773 37.3007 35.0418C35.4872 35.7806 33.4089 36.2002 31.2 36.2002C27.9781 36.2002 25.0343 35.3074 22.7843 33.8337Z"
    fill="${color}" style="filter: hue-rotate(180deg);"></path>
</g>
</svg>
`;
}
function SVGCarrot(color) {
  return `
    
  <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
  <svg height="100%" width="100%" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512" xml:space="preserve">
    <path style="fill:#A9CF54;" d="M293.094,113.549c-14.973,19.853-22.019,42.469-22.019,42.469L256,154.551l-15.075,1.468
      c0,0-7.046-22.617-22.019-42.47s-63.739-42.151-42.841-71.053c20.898-28.912,55.38,6.614,55.38,6.614
      C230.055,9.404,256,7.837,256,7.837s25.945,1.567,24.555,41.273c0,0,34.482-35.527,55.38-6.614
      C356.832,71.398,308.067,93.696,293.094,113.549z"/>
    <path style="fill:#92B83D;" d="M252.875,154.854l-11.954,1.16c0,0-7.043-22.612-22.016-42.465
      c-14.409-19.101-60.092-40.458-44.92-67.793c14.702,6.844,30.229,15.538,40.563,25.297
      C233.169,88.649,252.875,111.445,252.875,154.854z"/>
    <path style="fill:${color};" d="M325.799,224.037c0,3.584-0.272,7.22-0.846,10.888l-37.784,242.552
      c-1.536,9.812-7.481,17.983-15.642,22.591c-4.232,2.414-9.059,3.856-14.179,4.065c-0.449,0.021-0.899,0.031-1.348,0.031
      c-15.548,0-28.766-11.327-31.169-26.687l-37.784-242.552c-3.323-21.358,3.354-41.671,16.3-56.539
      c0.146-0.178,0.303-0.355,0.46-0.533c12.695-14.305,31.232-23.458,52.193-23.458C295.121,154.394,325.799,186.274,325.799,224.037z"
      />
    <path style="fill:${color};" d="M257.348,504.132c-0.449,0.021-0.899,0.031-1.348,0.031c-15.548,0-28.766-11.327-31.169-26.687
      l-37.784-242.552c-3.323-21.358,3.354-41.671,16.3-56.539c-0.428,6.081-0.178,12.33,0.805,18.651l45.014,288.914
      C250.242,492.847,253.147,499.064,257.348,504.132z"/>
    <path d="M306.943,89.674c-3.321,2.775-3.764,7.718-0.987,11.038c2.775,3.322,7.718,3.763,11.038,0.988
      c9.286-7.759,19.811-16.555,26.07-26.482c10.087-15.999,5.145-29.123-0.778-37.314c-6.352-8.789-14.775-13.801-24.355-14.495
      c-11.482-0.833-22.48,4.507-30.512,9.935c-5.442-31.375-30.653-33.312-30.946-33.33c-0.314-0.02-0.631-0.02-0.945,0
      c-0.293,0.018-25.504,1.955-30.946,33.331c-8.033-5.428-19.046-10.767-30.512-9.935c-9.581,0.694-18.003,5.706-24.356,14.494
      c-5.945,8.224-10.892,21.398-0.684,37.463c6.269,9.867,16.421,18.349,26.236,26.552c7.027,5.87,13.662,11.416,17.383,16.348
      c8.842,11.723,14.81,24.63,18.008,32.549c-12.894,4.451-24.532,12.265-33.619,22.877c-14.766,17.246-21.231,40.004-17.736,62.437
      l18.113,116.26c0.013,0.104,0.032,0.209,0.049,0.315l11.619,74.579c0.011,0.08,0.023,0.161,0.038,0.241l7.97,51.16
      C220.099,497.989,236.462,512,256,512s35.9-14.011,38.907-33.314l8.156-52.353c0.018-0.094,0.03-0.188,0.044-0.282l11.534-74.029
      c0.014-0.074,0.023-0.147,0.034-0.222l3.946-25.324c0.667-4.277-2.26-8.284-6.537-8.95c-4.275-0.672-8.284,2.261-8.948,6.537
      l-2.493,16.002c-12.002-3.711-24.825-5.695-38.253-5.892c-0.04,0-0.078-0.001-0.117-0.001c-4.275,0-7.771,3.434-7.834,7.722
      c-0.064,4.328,3.393,7.888,7.721,7.951c12.758,0.187,24.845,2.185,36.04,5.91l-9.279,59.555c-4.426-0.921-8.94-1.651-13.52-2.128
      c-4.312-0.452-8.159,2.677-8.608,6.982c-0.449,4.305,2.678,8.159,6.982,8.607c4.325,0.451,8.577,1.151,12.731,2.045l-7.082,45.46
      c-1.814,11.617-11.663,20.052-23.423,20.052s-21.611-8.434-23.421-20.055l-6.888-44.211c7.825-1.767,15.64-2.965,23.314-3.557
      c4.315-0.332,7.544-4.101,7.211-8.417c-0.331-4.314-4.094-7.547-8.416-7.211c-8.09,0.624-16.308,1.853-24.528,3.66l-9.294-59.654
      c6.125-1.838,12.382-3.345,18.673-4.491c4.257-0.775,7.08-4.856,6.305-9.115c-0.776-4.259-4.858-7.082-9.116-6.305
      c-6.154,1.121-12.276,2.564-18.296,4.296l-10.011-64.257c8.734-3.411,27.421-9.679,49.744-11.058
      c4.32-0.268,7.605-3.985,7.337-8.306c-0.266-4.32-3.975-7.608-8.305-7.338c-22.066,1.365-40.615,6.95-51.246,10.858l-4.277-27.449
      c-2.789-17.903,2.371-36.066,14.155-49.829c8.772-10.244,20.518-17.229,33.42-20.135l13.637-1.327l13.63,1.326
      c12.906,2.906,24.654,9.892,33.427,20.137c11.784,13.763,16.944,31.926,14.155,49.829l-4.171,26.771
      c-5.922-2.56-12.08-4.668-18.41-6.286c-4.19-1.073-8.463,1.457-9.534,5.651c-1.073,4.193,1.458,8.462,5.65,9.535
      c6.872,1.758,13.502,4.175,19.788,7.187l-2.143,13.755c-0.667,4.277,2.26,8.284,6.537,8.95c4.265,0.665,8.283-2.26,8.949-6.537
      l8.82-56.612c3.496-22.434-2.97-45.192-17.736-62.437c-9.087-10.612-20.726-18.427-33.621-22.878
      c2.634-6.526,7.148-16.436,13.597-26.269c2.373-3.618,1.365-8.477-2.255-10.851c-3.617-2.373-8.476-1.365-10.851,2.255
      c-7.961,12.138-13.188,24.151-15.931,31.263c-0.605-0.077-1.208-0.165-1.816-0.228c1.409-23.306,9.379-43.433,23.791-59.893
      c12.002-13.706,24.244-19.671,24.42-19.756c3.901-1.848,5.574-6.507,3.736-10.416c-1.842-3.917-6.513-5.599-10.426-3.758
      c-0.6,0.282-14.854,7.091-28.996,23.009c-4.202,4.729-8.661,10.602-12.776,17.672V44.931c0-4.328-3.508-7.837-7.837-7.837
      c-4.329,0-7.837,3.509-7.837,7.837V93.85c-4.115-7.073-8.577-12.947-12.778-17.678c-14.142-15.918-28.396-22.727-28.996-23.009
      c-3.914-1.84-8.584-0.16-10.426,3.758c-1.842,3.917-0.159,8.585,3.758,10.426c0.464,0.218,44.609,21.661,48.199,79.638
      c-0.61,0.064-1.215,0.15-1.822,0.229c-3.28-8.511-10.113-24.034-20.936-38.383c-4.804-6.37-12.111-12.475-19.847-18.939
      c-23.672-19.781-32.087-30.099-22.9-42.804c3.647-5.045,7.819-7.676,12.757-8.042c11.851-0.876,26.144,10.915,30.648,15.523
      c2.257,2.326,5.714,3.022,8.695,1.751s4.873-4.245,4.761-7.484C238.282,20.432,252.487,16.313,256,15.731
      c3.512,0.582,17.717,4.701,16.724,33.105c-0.113,3.234,1.777,6.2,4.752,7.473c2.977,1.272,6.43,0.583,8.694-1.731
      c4.513-4.618,18.804-16.41,30.657-15.533c4.938,0.367,9.11,2.997,12.758,8.043C338.712,59.712,329.976,70.428,306.943,89.674z"/>
    </svg>
`;
}
function IconFromSVGs(list) {
  return (
    "data:image/svg+xml;base64," +
    btoa(`<?xml version="1.0" encoding="iso-8859-1"?>
    <svg xmlns="http://www.w3.org/2000/svg">
      ${list.join("\n")}
    </svg>`)
  );
}
function CreateSyndicateForum(tabobj, groupid) {
  const opts = { url: "/SyndicateForum/index.html", index: tabobj.index };
  console.log(tabobj);

  tabs.create(opts).then((syntab) => {
    groups[groupid].syndicate_forum_tab = syntab;

    console.log(groups[groupid]);

    browser.tabs
      .executeScript(syntab.id, {
        file: "/SyndicateForum/main.js",
      })
      .then(() => {
        // why here, cuz in the scope before it does not work
        tabs
          .highlight({ tabs: [tabobj.index + 1] })
          .catch(() =>
            console.log("highlight first member", [tabobj.index + 1])
          );
        const color = groups[groupid].color;
        const svg = IconFromSVGs([SVGForum(color), SVGCarrot(color)]);
        const name = groups[groupid].name;
        const msgToTab = { type: "update-syndicate-forum", svg, name, color };
        tabs.sendMessage(syntab.id, JSON.stringify(msgToTab));
      });
  });
}

function CreateGroup(name, color) {
  const id = MenuIdFromTitle(name);
  if (!Object.keys(groups).length) CreateMenuItem("", { type: "separator" });

  if (groups[id]) return console.warn(`Group: ${name} already exists: abort`);

  groups[id] = { name, color, tabs: [] };
  const svg = IconFromSVGs([SVGCarrot(color)]);
  CreateMenuItem(name, { icons: { 16: svg, 32: svg } });

  return id;
}

function UpdateGroupForTab(tabid, groupid) {
  if (groups[groupid].tabs.includes(tabid))
    return console.warn(
      "Tab (id=" + tabid + ") already is in group (id=" + groupid + ")"
    );

  groups[groupid].tabs.push(tabid);

  const svg = IconFromSVGs([SVGCarrot(groups[groupid].color)]);
  const msgToTab = { type: "update-group", svg };
  browser.tabs.sendMessage(tabid, JSON.stringify(msgToTab));
}

function RemoveTabFromGroup(tabid, groupid) {
  groups[groupid].tabs = groups[groupid].tabs.filter((it) => it != tabid);
}

function ToggleSyndicateHide(groupid) {
  const _tabs = groups[groupid].tabs;
  var i = 0;

  var time = groups[groupid]?.show_hide_delay || 300;

  if (groups[groupid].hidden) {
    tabs.show(_tabs[i++]).catch(() => {
      console.log("togle hide, invalid tab id");
    });
    const iid = setInterval(() => {
      if (i >= _tabs.length) return clearInterval(iid);
      tabs.show(_tabs[i++]).catch(() => {
        console.log("togle hide, invalid tab id");
      });
    }, time / (_tabs.length - 1));
  } else {
    i = _tabs.length - 1;
    tabs.hide(_tabs[i--]).catch(() => {
      console.log("togle hide, invalid tab id");
    });
    const iid = setInterval(() => {
      if (i < 0) return clearInterval(iid);
      tabs.hide(_tabs[i--]).catch(() => {
        console.log("togle hide, invalid tab id");
      });
    }, time / (_tabs.length - 1));
  }

  groups[groupid].hidden = !groups[groupid].hidden;
}

// out of order
function OnSyndicateForumClose(cb) {
  tabs.onRemoved.addListener((tabid, { isWindowClosing }) => {
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
  tabs.onActivated.addListener(({ tabId, previousTabId }) => {
    Object.keys(groups).forEach((groupid) => {
      if (groups[groupid]?.syndicate_forum_tab?.id == tabId) {
        cb(groupid, tabId, previousTabId);
      }
    });
  });
}

var fuck = false;
var highlight_fuck = false;
function MoveTabsWithTheirForum(tabid, { fromIndex, toIndex }) {
  console.log("moved");
  if (fuck) return (fuck = !fuck);
  console.log("fuck" + fuck);
  if (highlight_fuck) return;
  console.log("highlight_fuck" + highlight_fuck);

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

          tabs
            .move(
              [groups[groupid].syndicate_forum_tab.id, ...groups[groupid].tabs],
              {
                index: toIndex + groups[groupid].tabs.length,
              }
            )
            .then(() => (fuck = true));
        });

      // tabs.move(groups[groupid].tabs, { index: -1 });
      // newIndex = toIndex;
    }

    tabs.move(groups[groupid].tabs, { index: newIndex });
  });
}

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

function onMoveInBoundsIncludeTabInSyndicate(tabid, { toIndex }) {
  /// works perfectly
  Object.keys(groups).forEach((gid) => {
    const syindex = groups[gid].syndicate_forum_tab.index;
    const tabs = groups[gid].tabs;
    if (toIndex >= syindex && toIndex <= syindex + tabs.length) {
      UpdateGroupForTab(tabid, gid);
    }
  });
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
}
