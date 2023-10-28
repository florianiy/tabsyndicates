browser.runtime.onMessage.addListener((msg) => {
  JustNeedAnObj(JSON.parse(msg), "from runtime");
});

function JustNeedAnObj(obj) {
  if (obj.type == "update-syndicate-forum") {
    const newTitle = document.head.querySelector("title");
    newTitle.textContent = obj.name;

    window.newIcon = document.createElement("link");
    newIcon.setAttribute("rel", "shortcut icon");
    newIcon.setAttribute("href", obj.svg);
    newIcon.setAttribute("type", "image/x-icon");
    document.head.append(newIcon);

    const span = document.querySelector("#name");
    span.textContent = obj.name;
    span.style.color = obj.color;
  }
  if ((obj.type = "update-syndicate-forum-icon")) {
    newIcon.setAttribute("href", obj.svg);
  }
}
