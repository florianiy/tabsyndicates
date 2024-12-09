// Put all the javascript code here, that you want to execute after page load.

window.syg = {};

function CurentFaviconToBase64(cb) {
  const icon_url =
    document.head.querySelector('link[type="image/x-icon]')?.href ||
    "https://www.google.com/favicon.ico";
  fetch(icon_url)
    .then((r) => r.blob())
    .then((blob) => {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        var base64data = reader.result;
        base64data = base64data.replace("data:image/x-icon;base64,", "");
        cb(base64data);
      };
    });
}
function SvgInBottomOfImage(svg_text, base64img) {
  return (
    `data:image/svg+xml;base64,` +
    btoa(`<?xml version="1.0" encoding="UTF-8"?>
<svg
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 64 64"
  xml:space="preserve"
>
  <image
    width="100%"
    height="100%"
    xlink:href="data:image/png;base64,${base64img}"
  />
  <g>${svg_text}  </g>
  </svg>
  
  `)
  );
}

function CreateFaviconElement(href) {
  const icon = document.createElement("link");
  icon.setAttribute("rel", "shortcut icon");
  icon.setAttribute("href", href);
  icon.setAttribute("type", "image/svg+xml");
  return icon;
}

browser.runtime.onMessage.addListener((MSG) => {
  const obj = JSON.parse(MSG);
  console.log("received: " + obj.type);

  if (obj.type == "update-group") {
    syg.oldIcon = document.head.querySelector('link[type="image/x-icon]');
    syg.oldIcon?.remove();
    CurentFaviconToBase64((b64) => {
      syg.curIcon = CreateFaviconElement(SvgInBottomOfImage(obj.svg, b64));
      console.log(syg.curIcon.href);
      document.head.append(syg.curIcon);
    });
    console.log("success");
  } else if (obj.type == "update-syndicate-forum-icon") {
    document.head.append(CreateFaviconElement(obj.svg));
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
