("Add tab to new group");
("Add tab to group");
("Remove from group");
(() => {
  return;

  tabs.getZoom().then(console.log);
  tabs.create();
  tabs.discard();
  tabs.duplicate();
  tabs.get();
  tabs.hide();
  // set focus
  tabs.highlight();
  tabs.move();
  tabs.moveInSuccession();
  tabs.query();
  tabs.reload();
  tabs.remove();
  tabs.show();

  store.set({ ana: { mere: 4 } }).then(console.log);
  store.get(["ana"]).then(console.log);
})();
