// Strongly inspired by https://github.com/AntonOsika/newsfeed-eradicator/blob/master/erad.js
var hideFacebookFeed = function() {
  var divs = document.getElementsByTagName("div");
  var item;

  for (var i = 0; i < divs.length; i++) {
    item = divs[i];
    if (item != null && item.id.match("topnews_main_stream") != null) {
      item.remove();
    }
  }
}


var hidePocketFeed = function() {
  var divs = document.getElementsByClassName("queue_togglesection_recommended");
  for (var i = 0; i < divs.length; i++) {
    var div = divs[i];

    if (div != null) {
      div.remove();
    }
  }
}


var hideFeeds = function() {
  var domain = document.domain;

  if (domain.match(/facebook\.com/)) {
    hideFacebookFeed();
  } else if (domain.match(/getpocket\.com/)) {
    hidePocketFeed();
  }

}


setTimeout(hideFeeds, 1000);
