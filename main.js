const PARAMS = Object.freeze({
  WIDTH: 950,
  HEIGHT: 600,
  OUTLINE_WIDTH: 3,
});

const game = {
  textures: {}
};

const utils = {
  clone: function(a) {
    return JSON.parse(JSON.stringify(a));
  },
  getCoords: function(canvas, mouseEvent) {
    const rect = canvas[0].getBoundingClientRect();
    const x = mouseEvent.clientX - rect.left;
    const y = mouseEvent.clientY - rect.top;
    return {x: x, y: y};
  }
};

function initTextures(context) {
  const patternCanvas = document.createElement('canvas');
  const patternContext = patternCanvas.getContext('2d');

  // leaf
  patternCanvas.width = 50;
  patternCanvas.height = 50;
  patternContext.fillStyle = 'green';
  patternContext.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
  patternContext.strokeStyle = '#034411';
  for (let i = 0; i < 20; i++) {
    patternContext.beginPath();
    patternContext.moveTo(0, i*10); // NB: size % step should be 0 for tileability
    patternContext.lineTo(i*10, 0);
    patternContext.stroke();
  }

  game.textures.leaf = context.createPattern(patternCanvas, 'repeat');
}

$(function(){
  const canvas = $('canvas.main');
  const ctx = canvas[0].getContext('2d');
  initTextures(ctx);

  $('#upgrade-modal .header').on('click', function() {
    $('#upgrade-modal').toggleClass('hidden');
  })

  const scenes = ['branches', 'trunk', 'roots'];
  let currentScene = 'branches';

  let animationTimer = 0;
  setInterval(function() {animationTimer++;}, 16); // 60FPS baby!

  $('.tab').on('click', function() {
    const clickedTab = $(this);
    currentScene = scenes[clickedTab.index()];
    // animations run in the first few seconds of scenes
    animationTimer = 0;
    console.log('scene set to:', currentScene);
    drawScene();
    $('.tab').removeClass('selected')
    clickedTab.addClass('selected');
  })

  canvas.attr('width', PARAMS.WIDTH+'px');
  canvas.attr('height', PARAMS.HEIGHT+'px');

  ctx.fillStyle = '#041';
  ctx.font = '24px serif';

  const leaf1 = {
    name: 'leaf1',
    outlined: true,
    outlineColor: 'black',
    texture: 'leaf',
    points: [
      {x: 0,  y: 0},
      {x: 50,  y: 30},
      {x: 110,  y: 110, controlX: 85, controlY: 15},
      {x: 40,  y: 35, controlX: 30, controlY: 80},
    ]
  };

  function drawLeaf(x0, y0, rotationInDegrees, isFalling) {
    const rotation = rotationInDegrees * Math.PI / 180
    const rotationOffset = isFalling? -animationTimer/100 : 0;
    let points = utils.clone(leaf1.points)
    const yOffset = isFalling? animationTimer+animationTimer*animationTimer/300 : 0;
    const xOffset = isFalling? animationTimer*animationTimer/100 + Math.sin(animationTimer/10) : 0;
    ctx.save();
    ctx.translate(x0 + xOffset, y0 + yOffset);
    // NB: first move, then rotate, so that we rotate around the new origin
    ctx.rotate(rotation + rotationOffset);
    if (leaf1.texture) {
      ctx.fillStyle = game.textures[leaf1.texture];
    } else {
      ctx.fillStyle = leaf1.color || 'black';
    }
    ctx.strokeStyle = leaf1.outlineColor || 'black';
    ctx.lineWidth = PARAMS.OUTLINE_WIDTH;
    ctx.beginPath();
    let start = points.shift()
    ctx.moveTo(start.x, start.y);
    points.forEach(function(p) {
      if (p.controlX !== undefined) {
        ctx.quadraticCurveTo(p.controlX, p.controlY, p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawScene() {
    console.log('__draw, time', animationTimer);
    clear();
    for (const o of game.objects[currentScene]) {
      // NB: if this ever becomes a performance issue, just drop it and the .shift() below
      let points = utils.clone(o.points)
      ctx.save();
      if (o.texture) {
        ctx.fillStyle = game.textures[o.texture];
      } else {
        ctx.fillStyle = o.color || 'black';
      }
      ctx.beginPath();
      let start = points.shift()
      ctx.moveTo(start.x, start.y);
      points.forEach(function(point) {
        ctx.lineTo(point.x, point.y);
      });
      ctx.fill();

      if (o.outlined) {
        points = utils.clone(o.points)
        ctx.save();
        ctx.strokeStyle = o.outlineColor || 'black';
        ctx.lineWidth = PARAMS.OUTLINE_WIDTH;
        ctx.beginPath();
        start = points.shift()
        ctx.moveTo(start.x, start.y);
        points.forEach(function(point) {
          ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }

    if (currentScene == 'branches') {
      drawLeaf(0, 0, 0, true);
      drawLeaf(110, 130, 0);
      drawLeaf(110, 130, 20, true);
      drawLeaf(110, 130, 30);
      drawLeaf(220, 305, 120, true);
      drawLeaf(580, 250, 140, true);
      drawLeaf(705, 165, 250);
      drawLeaf(705, 165, 200, true);
    }

    if (animationTimer < 400) {
      requestAnimationFrame(drawScene);
    }
  }

  function clear() {
    ctx.clearRect(0, 0, PARAMS.WIDTH, PARAMS.HEIGHT);
  }

  drawScene();

  // debug: if CTRL is pressed, we display the mouse coords, log on click
  canvas.on('mousemove', function(e) {
    if (e.ctrlKey) {
      const coords = utils.getCoords(canvas, e);
      drawScene();
      ctx.save();
      ctx.fillStyle = 'black';
      ctx.fillText('x: ' + coords.x + ' y: ' + coords.y, coords.x, coords.y);
      ctx.restore();
    }
  });
  canvas.on('mousedown', function(e) {
    if (e.ctrlKey) {
      const coords = utils.getCoords(canvas, e);
      console.log(JSON.stringify(coords) + ',');
    }
  });

});
