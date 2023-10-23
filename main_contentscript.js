// Put all the javascript code here, that you want to execute after page load.

browser.runtime.onMessage.addListener((MSG) => {
  const obj = JSON.parse(MSG);

  if (obj.type == "update-group") {
    document.head.querySelector('link[type="image/x-icon]')?.remove();
    const newIcon = document.createElement("link");
    newIcon.setAttribute("rel", "shortcut icon");
    newIcon.setAttribute("href", obj.svg);
    newIcon.setAttribute("type", "image/x-icon");
    document.head.append(newIcon);
  }
});
