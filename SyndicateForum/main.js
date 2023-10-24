const s = localStorage.getItem("last-closed");
const oo = JSON.parse(s);

var first_time = true;

if (oo) {
  console.log("used local host");
  JustNeedAnObj(oo, "from ls");
  localStorage.removeItem("last-closed");
}

browser.runtime.onMessage.addListener((msg) => {
  window.obj = JSON.parse(msg);
  if (!oo) JustNeedAnObj(obj, "from runtime");
});

function JustNeedAnObj(obj, msg) {
  console.log(msg);

  if (obj.type == "update-syndicate-forum") {
    const newTitle = document.head.querySelector("title");
    newTitle.textContent = obj.name;

    const newIcon = document.createElement("link");
    newIcon.setAttribute("rel", "shortcut icon");
    newIcon.setAttribute("href", obj.svg);
    newIcon.setAttribute("type", "image/x-icon");
    document.head.append(newIcon);

    const span = document.querySelector("#name");
    span.textContent = obj.name;
    span.style.color = obj.color;
  }
}

window.addEventListener("beforeunload", (e) => {
  localStorage.setItem("last-closed", JSON.stringify(obj));
});
