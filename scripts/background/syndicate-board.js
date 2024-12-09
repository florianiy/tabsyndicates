const counter = JSON.parse(localStorage.getItem("deploy-counter")) || 0;
console.warn("Deploy counter: " + counter);
localStorage.setItem("deploy-counter", JSON.stringify(counter + 1));

const syndicate_decisions = {
  AUTOMATION: {
    ENABLE: true,
    TAB_CREATION_PER_LOAD: 10,
    MAX_TABS: 30,
    CREATE_SYNDICATE: true,
    FIRST_MEMBER_INDEX: 2,
    TABS_IN_FIRST_SYNDICATE: 7,
  },
};
