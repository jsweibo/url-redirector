let beforeRequestEventListeners = [];

function getOptions() {
  return new Promise(function (resolve) {
    browser.storage.local
      .get('options')
      .then(function (res) {
        if (res.options) {
          resolve(JSON.parse(res.options));
        } else {
          resolve({});
        }
      })
      .catch(function (error) {
        console.log(error.message);
        resolve({});
      });
  });
}

function start() {
  getOptions().then(function (options) {
    if ('rule' in options && 'status' in options && options.status) {
      // get active rule
      const activeRule = options.rule.filter(function (item) {
        return item[item.length - 1] !== false;
      });

      beforeRequestEventListeners = activeRule.map(function (item) {
        return function (requestDetails) {
          return {
            redirectUrl: requestDetails.url.replace(item[1], item[2]),
          };
        };
      });

      beforeRequestEventListeners.map(function (item, index) {
        browser.webRequest.onBeforeRequest.addListener(
          item,
          { urls: [activeRule[index][0]] },
          ['blocking']
        );
      });
    }
  });
}

browser.storage.onChanged.addListener(function () {
  beforeRequestEventListeners.map(function (item) {
    browser.webRequest.onBeforeRequest.removeListener(item);
  });
  beforeRequestEventListeners = [];

  // restart
  start();
});

browser.browserAction.onClicked.addListener(function () {
  browser.runtime.openOptionsPage();
});

start();
