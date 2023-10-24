const color_picker = document.querySelector("#color-picker");
const color_string = document.querySelector("#color-string");
const name = document.querySelector("#name");

color_picker.oninput = () =>
  UpdateUnderline((color_string.value = color_picker.value));
color_string.oninput = () =>
  UpdateUnderline((color_picker.value = color_string.value));

color_string.value = "#" + Math.round(Math.random() * 16777216).toString(16);
color_picker.value = color_string.value;

name.onkeydown = (e) => {
  if (e.key == "Enter") {
    localStorage.setItem(
      "SyndicateCreator",
      JSON.stringify({ name: name.value, color: color_string.value })
    );
    window.close();
  }
};

const sy = document.createElement("style");
document.head.append(sy);
const UpdateUnderline = (color) =>
  (sy.textContent = `input[type="text"]{border-bottom-color: ${color};}`);

UpdateUnderline(color_picker.value);

name.focus();

name.value = `bot<${crypto.randomUUID()}>`;
name.onkeydown({ key: "Enter" });
