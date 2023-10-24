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
    url: "/SyndicateCreator/index.html",
    type: "popup",
    height: 150,
    width: 250,
    allowScriptsToClose: true,
  });
}

function MenuIdFromTitle(name) {
  return name.replaceAll(" ", "_");
}

function SVGCircleFromColor(color) {
  return (
    "data:image/svg+xml;base64," +
    btoa(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle fill="${color}" cx="50" cy="50" r="50" />
  </svg>`)
  );
}
