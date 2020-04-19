const PARAMS = Object.freeze({
  WIDTH: 950,
  HEIGHT: 600,
});

const game = {};

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

$(function(){
  const canvas = $('canvas');
  const ctx = canvas[0].getContext('2d');

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
      const points = utils.clone(o.points)
      ctx.save();
      ctx.fillStyle = o.color || 'black';
      ctx.beginPath();
      const start = points.shift()
      ctx.moveTo(start.x, start.y);
      points.forEach(function(point) {
        ctx.lineTo(point.x, point.y);
      });
      ctx.fill();
      ctx.restore();
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
