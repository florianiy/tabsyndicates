browser.runtime.onMessage.addListener((msg) => {
  const obj = JSON.parse(msg);
  if (obj.type == "update-syndicate-forum") {
    const newIcon = document.createElement("link");
    newIcon.setAttribute("rel", "shortcut icon");
    newIcon.setAttribute("href", obj.svg);
    newIcon.setAttribute("type", "image/x-icon");
    document.head.append(newIcon);

    const newTitle = document.head.querySelector("title");
    newTitle.textContent = obj.name;

    const span = document.querySelector("#name");
    span.textContent = obj.name;
    span.style.color = obj.color;
  }
});
