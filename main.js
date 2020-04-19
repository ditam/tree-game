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
  $('.tab').on('click', function() {
    const clickedTab = $(this);
    currentScene = scenes[clickedTab.index()];
    console.log('scene set to:', currentScene);
    drawScene();
    $('.tab').removeClass('selected')
    clickedTab.addClass('selected');
  })

  canvas.attr('width', PARAMS.WIDTH+'px');
  canvas.attr('height', PARAMS.HEIGHT+'px');

  ctx.fillStyle = '#041';
  ctx.font = '24px serif';

  function drawScene() {
    clear();
    for (const o of game.objects[currentScene]) {
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
      ctx.restore();

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
