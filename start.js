// Strongly inspired by https://github.com/AntonOsika/newsfeed-eradicator/blob/master/erad.js
var hideAll = function(className) {
  var divs = document.getElementsByClassName(className);
  for (var i = 0; i < divs.length; i++) {
    var div = divs[i];

    if (div != null) {
      div.remove();
    }
  }
};

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

  let defaultConfig = {currentDay: getFormattedDate(), remainingMinutes: 15}
  if (data.config == {} || data.config == undefined) {
    Object.assign(config, data.config);
    return;
  }

  if (data.config.currentDay != defaultConfig.currentDay) {
    // if this is a new day, reset the config.
    Object.assign(config, defaultConfig);
    return;
  else {
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
var createInfoDiv = function() {
  elapsed_time_div = document.createElement('div');
  elapsed_time_div.id = 'infinitypools_id';
  elapsed_time_div.innerHTML = "" + config.remainingMinutes;
  elapsed_time_div.style.position = 'fixed';
  elapsed_time_div.style.bottom = '70px';
  elapsed_time_div.style.left = '120px';
  elapsed_time_div.style.color = 'darkblue';
  elapsed_time_div.style.fontFamily = 'Helvetica Neue';
  elapsed_time_div.style.fontSize = '30px';

  document.body.appendChild(elapsed_time_div)
}

var hideTwitterFeed = async function() {
  await refreshConfig();

}

function hideFeeds() {
  var domain = document.domain;

  if (domain.match(/twitter\.com/)) {
    hideTwitterFeed();
  }
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
    alert("you're at time!");
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
