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


var hideAll = function(className) {
  var divs = document.getElementsByClassName(className);
  for (var i = 0; i < divs.length; i++) {
    var div = divs[i];

    if (div != null) {
      div.remove();
    }
  }
};

var hidePocketFeed = function() {
  hideAll("queue_togglesection_recommended");
  hideAll("queue_explore_option");
}


var hideTwitterFeed = function() {
  hideAll("stream-items");
  hideAll("home");
}


var hideRedditComments = function() {
  console.log("Hiding reddit comments");
  hideAll("commentarea");
}


var hideHNComments = function() {
  hideAll("comment");
}


var hideFeeds = function() {
  var domain = document.domain;

  if (domain.match(/facebook\.com/)) {
    hideFacebookFeed();
  } else if (domain.match(/getpocket\.com/)) {
    hidePocketFeed();
  } else if (domain.match(/twitter\.com/)) {
    hideTwitterFeed();
  } else if (domain.match(/reddit\.com/)) {
    hideRedditComments();
  } else if (domain.match(/news\.ycombinator\.com/)) {
    hideHNComments();
  }



}


setTimeout(hideFeeds, 100);
