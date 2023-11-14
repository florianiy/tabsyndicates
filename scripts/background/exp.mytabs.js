var realtime_tabs = [];
// puts special properties on tabs by id
var onid = {};
const eventArray = [
  "onCreated",
  "onAttached",
  "onMoved",
  "onActivated",
  "onHighlighted",
  "onReplaced",
  "onRemoved",
  "onDetached",
];
eventArray.forEach((e) => {
  browser.tabs[e].addListener((any1, any2, any3) => {
    if (e == "onRemoved") {
      const tabid = any1;
      delete onid[tabid];
    }
    browser.tabs.query({}).then((tabs) => {
      lambda(tabs, e);
      window.dispatchEvent(new CustomEvent("tabs:" + e));
    });
  });
  window.addEventListener("tabs:" + e, () => console.warn(realtime_tabs));
});

// now just try to attach to the realtime_tabs properties per tab and functions
// and do not overwrite the realtime_tabs array but update it to keep in the
// arrays objects the functions and properties that i custom added
// now to separate hidden from unhiden just do
// realtime_tabs.filter (it=>!it.hidden)

browser.tabs.query({}).then((tabs) => {
  lambda(tabs, undefined);
});

var lambda = (tabs, e) => {
  realtime_tabs = [...tabs].map((tab) => {
    tab.assign = (obj) => {
      Object.assign((onid[tab.id] = {}), obj);
      // save here to storage
    };
    tab.getall = () => onid[tab.id];
    tab.hide = (cb) => browser.tabs.hide(tab.id).then(cb);
    tab.show = (cb) => browser.tabs.show(tab.id).then(cb);
    return tab;
  });
};
