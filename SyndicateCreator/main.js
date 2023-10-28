localStorage.setItem("killyourself", "false");

const color_picker = document.querySelector("#color-picker");
const color_string = document.querySelector("#color-string");
const name = document.querySelector("#name");

color_picker.oninput = () =>
  UpdateUnderline((color_string.value = color_picker.value));
color_string.oninput = () =>
  UpdateUnderline((color_picker.value = color_string.value));

color_string.value = "#" + Math.round(Math.random() * 16777216).toString(16);
color_picker.value = color_string.value;

const sy = document.createElement("style");
document.head.append(sy);
const UpdateUnderline = (color) =>
  (sy.textContent = `input[type="text"]{border-bottom-color: ${color};}`);
UpdateUnderline(color_picker.value);

window.onkeydown = (e) => {
  if (e.key == "Enter")
    port.postMessage({ name: name.value, color: color_string.value });
  if (e.key == "Escape") port.postMessage({ type: "CloseMePlease" });
};
window.onbeforeunload = (e) => {
  localStorage.setItem("killyourself", "true");
};
window.onstorage = (e) => {
  if (e.key == "killyourself" && e.newValue == "true") window.close();
};

let port = browser.runtime.connect({ name: "SyndicateCreatorPopup" });
port.onMessage.addListener((obj) => {});

// name.value = `bot<${crypto.randomUUID()}>`;
// name.onkeydown({ key: "Enter" });
name.focus();
