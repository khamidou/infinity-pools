var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

function pickANumber(min, max) {
  return Math.random() * (max - min) + min;
}

function pickAnInt(min, max) {
  return Math.floor(pickANumber(min, max));
}

var colors = [['#ff7088', '#ff8599', '#ffadbb'],
              ['#6cdad7', '#7cdedb', '#a0e7e5'],
              ['#7cf3a0', '#8ff5ad', '#b4f8c9'],
              ['#f7ce8d', '#f8d6a0', '#fbe7c6'],
              ['#6b73db', '#7c82df', '#a0a5e8'],
];

class Balloon {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speed = pickANumber(0.4, 0.8);
    this.wind = pickANumber(0.4, 0.7);
    this.rotationSpeed = Math.floor(Math.random() * + 50);
    this.rotationSteps = 0;
    this.colorIndex = pickAnInt(0, colors.length);
  }
}

function drawCanvasBalloons() {
  // We have to do these intricate scaling hacks because the canvas API
  // doesn't know about hidpi displays:
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
  var canvas = document.getElementById("balloonsCanvas");
  canvas.style.width = windowWidth + "px";
  canvas.style.height = windowHeight + "px";

  var windowScale = window.devicePixelRatio;
  canvas.width = Math.floor(windowWidth * windowScale);
  canvas.height = Math.floor(windowHeight * windowScale);

  var ctx = canvas.getContext("2d");

  function drawBalloon(balloon, elapsed, scale) {
      // The balloon is 3 shapes together:
      // 1. an ellipse
      // 2. a circle for the lightning
      // 3. a triangle for the tie.
      var lightColor = colors[balloon.colorIndex][2];
      var mediumColor = colors[balloon.colorIndex][1];
      var darkColor = colors[balloon.colorIndex][0];

      var linearGradient = ctx.createLinearGradient(balloon.x - 50, balloon.y - 50,
                                                    balloon.x + 100, balloon.y + 50);

      linearGradient.addColorStop(0, lightColor);
      linearGradient.addColorStop(0.5, mediumColor);
      linearGradient.addColorStop(.9, darkColor);

      var gradient_x = balloon.x + 20;
      var gradient_y = balloon.y - 33;

      var radialGradient = ctx.createRadialGradient(gradient_x, gradient_y, 1,
                                                    gradient_x, gradient_y, 2);
      radialGradient.addColorStop(0, 'white');
      radialGradient.addColorStop(.9, lightColor);

      //ctx.translate(balloon.x, balloon.y);
      //res = Math.min(0.0003 * balloon.rotationSteps * (Math.PI / 180), Math.PI / 90)
      //ctx.rotate(res);
      //ctx.translate(-balloon.x, -balloon.y);

      // First, draw the tail of the balloon
      ctx.fillStyle = mediumColor;

      ctx.beginPath();
      ctx.moveTo(balloon.x, balloon.y + 53 * scale);
      ctx.lineTo(balloon.x - 11 * scale, balloon.y + (11 + 53) * scale);
      ctx.lineTo(balloon.x + 11 * scale, balloon.y + (11 + 53) * scale);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.ellipse(balloon.x, balloon.y, 50 * scale, 60 * scale, 0, 0, 2 * Math.PI);
      ctx.fillStyle = linearGradient;
      ctx.fill();
      ctx.closePath();
  }

  function animateBalloon(b, elapsed) {
    b.y -= b.speed;
    b.x += pickANumber(0, b.wind);

    if (b.y <= -200) {
      b.y = windowScale * windowHeight + pickANumber(10, 100) + 100;
      b.x = pickANumber(1, windowScale * windowWidth);
    }

    if (b.rotationSteps < 45 && pickANumber(1, 10) < 5) {
      b.rotationSteps += 1;
    }

    drawBalloon(b, elapsed, windowScale);
  }

  let balloons = [];
  for (let step = 0; step < 300; step++) {
    let b = new Balloon(pickANumber(1, windowScale * windowWidth),
                        windowScale * windowHeight + pickANumber(10, windowHeight));
    balloons.push(b);
  }

  let startTimestamp = null;

  function draw(timestamp) {
    if (startTimestamp === undefined) {
      startTimestamp = timestamp;
    }

    const elapsed = timestamp - startTimestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < balloons.length; i++) {
      animateBalloon(balloons[i], elapsed);
    }

    window.requestAnimationFrame(draw);
  }

  draw();
  window.requestAnimationFrame(draw);
}

$(document).ready(function() {
  drawCanvasBalloons();
})

