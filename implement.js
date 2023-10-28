`


deci forumul este de toggle by default
dar daca apesi o tasta gen ctrl da switch la 
alta functie si i se schimba si faviconul
gen daca apesi ctrl sa poata apoi sa traga taburi


cand muti syndicatul ascunde celelate syndicate si pastreazaa doar forumurile

fa-i aia cu highlight la toate taburile din grup cand muti syndicate forumul
fa-i savev across load/reload browser
fa-i sa mute in nou window tot grupul
repara bugurile cu nu poate sa dea focus ca e prea in dreapta
ca boti asocia forum ca membru in alt tab etc

``
incearca sa dai hide la toate taburile
sa le aranjezi cand ele sunt cu hide
si sa le dai show after le-ai mutat
` // // tab join that syndicate [but only when syndicate is not hidden] // when dragging tab immediately after or between its tabs of a forum make the // when create/edit syndicate make title of forum get updated real time and color // edit syndicate (color and name) // cum e pe chrome: delete, edit, blabla // sa apara itemuri in meniu speciale // cand apesi click dreapta pe forumul de sindicat
`
listen for tab close to potentially remove it from any group

// seems that i already kinda made that
make id for tabs persistent across browser reload
@update delete syndicate on last member tab closed? 

`;

// meniu sa apara doar la taburi unde am voie
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/contains
// @belowcode https://discourse.mozilla.org/t/detect-whether-extension-has-host-permission-for-active-tab/120501/2
async function hasHostPermissionForActiveTab() {
  const [activeTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  try {
    return activeTab.url
      ? await browser.permissions.contains({
          origins: [activeTab.url],
        })
      : false;
  } catch {
    // catch error that occurs for special urls like about:
    return false;
  }
}

`
in loc de cerculet svg
ia faviconul deja existent pe site-ul ala
si baga-l in canvas si fai border cu culoarea
syndicatului in jur
gen doar imbrac-o in culoare ca border
ca si cum ai face : border: 1px solid mov;
`;

// for future
// browser.menus.onShown.addListener(async (info, tab) => {
//   browser.menus.update(menuId /*, …*/);
//   // Note: Not waiting for returned promise.
//   browser.menus.refresh();
// });
