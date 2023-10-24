// Put all the javascript code here, that you want to execute after page load.

window.syg = {};

function CreateFaviconElement(href) {
  const icon = document.createElement("link");
  icon.setAttribute("rel", "shortcut icon");
  icon.setAttribute("href", href);
  icon.setAttribute("type", "image/x-icon");
  return icon;
}

browser.runtime.onMessage.addListener((MSG) => {
  const obj = JSON.parse(MSG);
  console.log("received: " + obj.type);

  if (obj.type == "update-group") {
    syg.oldIcon = document.head.querySelector('link[type="image/x-icon]');
    syg.oldIcon?.remove();
    syg.curIcon = CreateFaviconElement(obj.svg);
    document.head.append(syg.curIcon);
    console.log("success");
  } else if (obj.type == "restore-favicon") {
    syg.curIcon.remove();

    if (!syg.oldIcon) syg.oldIcon = CreateFaviconElement("favicon.ico");
    document.head.append(syg.oldIcon);
    syg.curIcon = syg.oldIcon;
    delete syg.oldIcon;
  } else {
    console.warn("nobody used: " + obj.type);
  }
});
