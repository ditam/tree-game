function drawLeaf(ctx, x0, y0, rotationInDegrees, isFalling) {
  const leaf = {
    name: 'leaf',
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

  const time = game.animationTimer;
  const rotation = rotationInDegrees * Math.PI / 180
  const rotationOffset = isFalling? -time/100 : 0;
  let points = game.utils.clone(leaf.points)
  const yOffset = isFalling? time+time*time/300 : 0;
  const xOffset = isFalling? time*time/100 + Math.sin(time/10) : 0;
  ctx.save();
  ctx.translate(x0 + xOffset, y0 + yOffset);
  // NB: first move, then rotate, so that we rotate around the new origin
  ctx.rotate(rotation + rotationOffset);

  ctx.fillStyle = game.textures[leaf.texture];
  ctx.strokeStyle = leaf.outlineColor || 'black';
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

game.drawScene = function() {

  const ctx = game.ctx;

  if (game.state.isOver) {
    // NB: this will not work on Safari desktop nor iOS, see
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter#Browser_compatibility
    ctx.filter = 'grayscale(1)';
    game.currentScene = 'branches';
  } else {
    ctx.filter = 'none';
  }

  ctx.clearRect(0, 0, PARAMS.WIDTH, PARAMS.HEIGHT);

  for (const o of game.objects[game.currentScene]) {
    // NB: if this ever becomes a performance issue, just drop it and the .shift() below
    let points = game.utils.clone(o.points)
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
      points = game.utils.clone(o.points)
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

  if (game.currentScene == 'branches') {
    drawLeaf(ctx, 0, 0, 0, game.state.isOver || true);
    drawLeaf(ctx, 110, 130, 0, game.state.isOver);
    drawLeaf(ctx, 110, 130, 20, game.state.isOver || true);
    drawLeaf(ctx, 110, 130, 30, game.state.isOver);
    drawLeaf(ctx, 220, 305, 120, game.state.isOver || true);
    drawLeaf(ctx, 580, 250, 140, game.state.isOver || true);
    drawLeaf(ctx, 705, 165, 250, game.state.isOver);
    drawLeaf(ctx, 705, 165, 200, game.state.isOver || true);
  }

  if (game.animationTimer < 400) {
    requestAnimationFrame(game.drawScene);
  }
};
