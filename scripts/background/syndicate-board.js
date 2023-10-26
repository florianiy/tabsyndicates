const counter = JSON.parse(localStorage.getItem("deploy-counter")) || 0;
console.warn("Deploy counter: " + counter);
localStorage.setItem("deploy-counter", JSON.stringify(counter + 1));

const syndicate_decisions = {
  AUTOMATION: {
    TAB_CREATION_PER_LOAD: 10,
    CREATE_SYNDICATE: true,
    AUTOMATIC_SYNDICATE_CREATOR: false,
    TABS_IN_FIRST_SYNDICATE: 5,
  },
};
