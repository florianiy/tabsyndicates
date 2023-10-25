browser.tabs.query({}).then((tabs) => {
  last_tab_id = tabs[4].id;
  last_tab_obj = tabs[4];
  StartGroupCreator();
  setTimeout(() => {
    window.ttt = groups[automation_group_id].tabs;
    UpdateGroupForTab(tabs[5].id, automation_group_id);
    UpdateGroupForTab(tabs[6].id, automation_group_id);
  }, 4000);
});

CreateTabs(4);
