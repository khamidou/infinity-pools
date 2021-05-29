// Strongly inspired by https://github.com/AntonOsika/newsfeed-eradicator/blob/master/erad.js
var getFormattedDate = function() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

// In-page cache of the user's options
var config = {};

var refreshConfig = async function() {
  // Initialize the form with the user's option settings
  let p = new Promise(function(resolve, reject) {
    chrome.storage.sync.get('config', (options) => {
      resolve(options);
    });
  });

  let data = await p;

  let defaultConfig = {currentDay: getFormattedDate(), remainingMinutes: 30}
  if (data.config == {} || data.config == undefined) {
    Object.assign(config, data.config);
    return;
  }

  if (data.config.currentDay != defaultConfig.currentDay) {
    // if this is a new day, reset the config.
    Object.assign(config, defaultConfig);
    return;
  } else {
    Object.assign(config, data.config);
    return;
  }
}

var saveConfig = async function(config) {
  // Initialize the form with the user's option settings
  let p = new Promise(function(resolve, reject) {
    chrome.storage.sync.set({config}, () => {
      resolve();
    });
  });

  return p;
}

var previousState = 'active'
async function mainEventHandler() {
  console.log("mainEventHandler started");
  if (document.hidden) {
    previousState = 'hidden';
    setTimeout(mainEventHandler, 10 * 1000);
    return;
  }

  await refreshConfig();
  console.log(config.remainingMinutes);
  if (config.remainingMinutes <= 0) {
    // Avoid recursive frame insertion...
    var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
    if (!location.ancestorOrigins.contains(extensionOrigin)) {
      var iframe = document.createElement('iframe');
      // Must be declared at web_accessible_resources in manifest.json
      iframe.src = chrome.runtime.getURL('frame.html');
      window.location.href = iframe.src;
    }

    return;
  }

  if (previousState == 'active') {
    // if we were active, decrement counter.
    config.remainingMinutes -= 2;
    await saveConfig(config);
  }

  previousState = 'active';
  //setTimeout(mainEventHandler, 2 * 60 * 1000);
  setTimeout(mainEventHandler, 10000);
}

async function main() {
  await refreshConfig();
  document.addEventListener('visibilityChange', mainEventHandler, false);

  setTimeout(mainEventHandler, 100);
}

main();
