function AutomaticCreateSyndicateWithMembers(tabs) {
  if (!syndicate_decisions.AUTOMATION.CREATE_SYNDICATE) return;

  if (
    tabs.length <
    syndicate_decisions.AUTOMATION.TABS_IN_FIRST_SYNDICATE + 3
  ) {
    CreateTabs(
      syndicate_decisions.AUTOMATION.TABS_IN_FIRST_SYNDICATE + 3,
      "https://www.google.com/search?client=firefox-b-d&q=asdasdasdasd",
      minifunc
    );
  } else minifunc();

  function minifunc() {
    last_tab_id = tabs[0].id;
    last_tab_obj = tabs[0];

    StartGroupCreator();
    setTimeout(() => {
      window.ttt = groups[automation_group_id].tabs;

      for (
        let i = 1;
        i < syndicate_decisions.AUTOMATION.TABS_IN_FIRST_SYNDICATE;
        i++
      )
        UpdateGroupForTab(tabs[i].id, automation_group_id);
    }, 4000);
  }
}

browser.tabs.query({}).then(main_automate);
function main_automate(tabs) {
  if (tabs.length < 30)
    CreateTabs(syndicate_decisions.AUTOMATION.TAB_CREATION_PER_LOAD || 0);
  AutomaticCreateSyndicateWithMembers(tabs);
}
