// cand apesi click dreapta pe forumul de sindicat
// sa apara itemuri in meniu speciale
// cum e pe chrome: delete, edit, blabla

// edit syndicate (color and name)
// when create/edit syndicate make title of forum get updated real time and color
// when dragging tab immediately after or between its tabs of a forum make the
// // tab join that syndicate [but only when syndicate is not hidden]

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
