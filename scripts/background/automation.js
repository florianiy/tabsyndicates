function AutomaticCreateSyndicateWithMembers(tabs) {
  if (!syndicate_decisions.AUTOMATION.CREATE_SYNDICATE) return;

  const nr_tabs = syndicate_decisions.AUTOMATION.TABS_IN_FIRST_SYNDICATE;

  if (tabs.length < nr_tabs + 3) {
    CreateTabs(
      nr_tabs + 3,
      "https://www.google.com/search?client=firefox-b-d&q=asdasdasdasd",
      minifunc
    );
  } else minifunc();

  function minifunc() {
    const start = syndicate_decisions.AUTOMATION.FIRST_MEMBER_INDEX;
    const max = syndicate_decisions.AUTOMATION.TABS_IN_FIRST_SYNDICATE;
    CreateForumAndFirstMember(tabs[start], (gid) => {
      for (let i = 1; i < max; i++) UpdateGroupForTab(tabs[start + i].id, gid);
    });
  }
}

function main_automate(tabs) {
  if (tabs.length < 30)
    CreateTabs(syndicate_decisions.AUTOMATION.TAB_CREATION_PER_LOAD || 0);
  AutomaticCreateSyndicateWithMembers(tabs);
}

if (syndicate_decisions.AUTOMATION.ENABLE)
  browser.tabs.query({}).then(main_automate);
