// implement a better popup later

class Popup {
  constructor(url) {
    this.url = url;
  }
  Open(cb = () => {}) {
    var that = this;
    browser.windows
      .create({
        url: this.url,
        //[ this.url, this.url] hack,
        type: "popup",
        height: 150,
        width: 250,
        titlePreface: "New Group -",
        allowScriptsToClose: true,
      })
      .then((win) => {
        this.window = win;

        function asd(port) {
          if (port.name != "SyndicateCreatorPopup") return;
          port.onMessage.addListener((obj) => {
            console.log(obj);

            if (obj?.type == "CloseMePlease") {
              browser.runtime.onConnect.addListener(asd);
              that.Close();
            }
          });
          cb(port);
          browser.runtime.onConnect.removeListener(asd);
        }

        browser.runtime.onConnect.addListener(asd);
      });
  }
  Close() {
    browser.windows.remove(this.window.id);
  }
}
