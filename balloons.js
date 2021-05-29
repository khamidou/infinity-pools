var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

function pickANumber(max, min) {
  return Math.random() * (max - min + min) + min;
}

function changeColors(el) {
  el.removeClass();
  var random = Math.floor(pickANumber(5,1));
  el.addClass('bln-'+random+'-clone');
}

function resetBalloon(el) {
  changeColors(el);

  var scale = (pickANumber(0.9,0.5)).toFixed(1);
  el.css('transform', 'scale(' + scale + ')');

  var x = Math.floor(Math.random() * windowWidth);
  el.css('left', x);
  var y = Math.floor(Math.random() * 300 + windowHeight);
  el.css('top', y);
  releaseBalloon(el);
}

function releaseBalloon(el) {
  var maxbllnSpeed = Math.floor(Math.random() * 20000 + 3000);
  var wind = Math.floor(Math.random() * + 50);
  var rotate = Math.floor(Math.random() * 860) + 100;

  el.animate({top: '-150px', left: '+=' + wind + 0}, {
  step: function() {
    el.css({
    transform: 'rotate('+rotate+'deg)',
    transition: 'transform '+ maxbllnSpeed * .001  +'s linear'
    });
  },
  duration: maxbllnSpeed,
  easing: 'linear',
  complete: function() {
    resetBalloon(el);
  }
  });
}

function blowUpBalloons() {
  for (i = 0; i < 100; i++) {
  var el = $('.bln-1').clone();
  el[0].style.display = 'block';
  el.appendTo('.blns');

  resetBalloon(el);

  var position = el.position();

  if (position.top > windowHeight || position.left > windowWidth || position.left < -100) {
    resetBalloon(el);
  }
  }
}

$(document).ready(function() {
  blowUpBalloons();
})

