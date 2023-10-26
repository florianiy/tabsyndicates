const counter = JSON.parse(localStorage.getItem("deploy-counter")) || 0;
console.warn("Deploy counter: " + counter);
localStorage.setItem("deploy-counter", JSON.stringify(counter + 1));

const syndicate_decisions = {};
