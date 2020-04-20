const PARAMS = Object.freeze({
  WIDTH: 950,
  HEIGHT: 600,
  OUTLINE_WIDTH: 3,
  LEAVES_PER_BRANCH: 20,
  TRUNK_WEIGHT: 1,
  BRANCH_WEIGHT: 1,
  ROOT_CAPACITY: 2,
});

const game = {
  textures: {},
  state: { // NB: whenever you change the state, update the UI, at least the toolbar
    resources: {
      carb: 150,
      stem: 300,
      water: 700,
    },
    tree: {
      leaves: 0,
      branches: 1,
      trunkSize: 1,
      rootSize: 1,
      hasFeeder: false,
      feederAge: undefined,
    },
    year: 7,
    month: 6,
    isOver: false,
  },
  currentScene: 'branches',
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
    patternContext.moveTo(0, i*5); // NB: size % step should be 0 for tileability
    patternContext.lineTo(i*25, 0);
    patternContext.stroke();
  }

  game.textures.leaf = context.createPattern(patternCanvas, 'repeat');
}

function renderUpgrades(scene) {
  const sceneUpgrades = game.upgrades[scene];
  $('#upgrade-modal .content .header').html(sceneUpgrades.description);
  sceneUpgrades.items.forEach(function(item, i) {
    const row = $('#upgrade-modal .content .row').eq(i);
    const icon = $('<img>').attr('src', 'assets/images/' + item.icon + '.png').css('width', '64px').css('height', '64px');
    row.find('.icon').empty().append(icon);
    row.find('.title').html(item.name);
    row.find('.description').html(item.description);
    let costsHTML = '';
    ['carb', 'stem', 'water'].forEach(function(resource, index) {
      costsHTML += '<span class="resource '+ resource +'">' + item.costs[index] + '</span> ';
    });
    row.find('.costs').html(costsHTML);
    row.toggleClass('bought', item.bought);
  });
}

function showError(message) {
  $('#error-modal').removeClass('hidden');
  $('#error-modal .message').html(message);
  $('#error-modal').on('click', function() {$('#error-modal').addClass('hidden');});
}

// Given an array of [carb, stem, water] costs, checks whether they can be paid from the current balance,
// and if not, displays an error message.
// -> (returns boolean canAfford)
function checkCost(cost) {
  if (cost[0] > game.state.resources.carb) {
    showError('Can not afford - not enough <span class="resource carb">carbohydrates</span> (needs ' + cost[0] + ')');
    return false;
  }
  if (cost[1] > game.state.resources.stem) {
    showError('Can not afford - not enough <span class="resource stem">meristematic cells</span> (needs ' + cost[1] + ')');
    return false;
  }
  if (cost[2] > game.state.resources.water) {
    showError('Can not afford - not enough <span class="resource water">water</span> (needs ' + cost[2] + ')');
    return false;
  }
  return true;
}

// use checkCost first, this is not python!
function payCost(cost) {
  game.state.resources.carb -= cost[0];
  game.state.resources.stem -= cost[1];
  game.state.resources.water -= cost[2];
  game.ui.updateToolbar();
}

// TODO: currently there's a slight issue in which we sell leaves in batches,
// so we are not guaranteed to fill the capacity perfectly. This is probably not a big deal though.
// -> (returns boolean canHold, same as checkCost)
function checkCapacity(objectName, attemptedAddCount) {
  const deciders = {
    leaves: function(attemptedAddCount) {
      const maxCapacity = game.state.tree.branches * PARAMS.LEAVES_PER_BRANCH;
      const proposedCount = (game.state.tree.leaves + attemptedAddCount);
      if (proposedCount > maxCapacity) {
        showError('Can not add leaves - branches are at full capacity.');
        return false;
      }
      return true;
    },
    branches: function(attemptedAddCount) {
      // NB: branch growth is always allowed, but the tree biomass might exceed the root capacity
      return true;
    }
  }
  return deciders[objectName](attemptedAddCount);
}

function renderButtons(scene) {
  $('#buttons-container').empty();
  if (scene === 'branches') {
    const addLeavesButton = $('<div>').addClass('button add-leaves').text('Grow new leaves');
    $('#buttons-container').append(addLeavesButton);
    const cost = [50, 100, 200];
    const leafBatchSize = 5; // TODO: move to params or make dynamic based on current count
    addLeavesButton.on('click', function() {
      if (!checkCost(cost)) {
        return;
      }
      if (!checkCapacity('leaves', leafBatchSize)) {
        return;
      }
      payCost(cost);
      game.state.tree.leaves += leafBatchSize;
      game.ui.updateToolbar();
      console.log('New leaf count:', game.state.tree.leaves);
    });
  } else if (scene === 'trunk') {
    const addBranchButton = $('<div>').addClass('button add-branches').text('Grow branches');
    $('#buttons-container').append(addBranchButton);
    const cost = [50, 100, 200];
    addBranchButton.on('click', function() {
      if (!checkCost(cost)) {
        return;
      }
      if (!checkCapacity('branches', 1)) {
        return;
      }
      payCost(cost);
      game.state.tree.branches++;
      game.ui.updateToolbar();
      console.log('New branch count:', game.state.tree.branches);
    });
  }
}

function checkDeath() {
  // if the biomass exceeds the root capacity, the tree topples over
  const branches = game.state.tree.branches;
  const wBranch = PARAMS.BRANCH_WEIGHT;
  const trunkSize = game.state.tree.trunkSize;
  const wTrunk = PARAMS.TRUNK_WEIGHT;
  const roots = game.state.tree.rootSize;
  if ((branches * wBranch + trunkSize * wTrunk) > roots * PARAMS.ROOT_CAPACITY) {
    game.state.isOver = true;
    console.log('DEAD');
    $('#game-over-modal .message').text(
      'The roots could not bear the weight of the trunk and the branches, ' +
      'and a gust of wind turned it out of the ground.'
    )
    $('#game-over-modal').removeClass('hidden');
    $('#game-over-modal .button').on('click', game.resetState);
    $('.wrapper .tabs').addClass('game-over');
    return;
  }
  console.log('ALIVE');
}

function advanceMonth() {
  game.state.month++;
  if (game.state.month === 12) {
    game.state.month = 0;
    game.state.year++;
  }

  checkDeath();

  game.ui.updateToolbar();
}

$(function(){
  const canvas = $('canvas.main');
  const ctx = canvas[0].getContext('2d');
  initTextures(ctx);
  game.ui.updateToolbar();

  $('#upgrade-modal .header').on('click', function() {
    $('#upgrade-modal').toggleClass('hidden');
  });

  $('#time-controls').on('click', function() {
    // We only display the help text before the first click
    $('#time-controls .message').remove();
    advanceMonth();
    game.drawScene();
  });

  const scenes = ['branches', 'trunk', 'roots'];

  let animationTimer = 0;
  setInterval(function() {animationTimer++;}, 16); // 60FPS, baby! // TODO: 4K support

  // TODO: if we had a nice setScene method, this duplication would not be necessary...
  renderUpgrades(game.currentScene);
  renderButtons(game.currentScene);

  $('.tab').on('click', function() {
    const clickedTab = $(this);
    game.currentScene = scenes[clickedTab.index()];
    // animations run in the first few seconds of scenes
    animationTimer = 0;
    renderUpgrades(game.currentScene);
    renderButtons(game.currentScene);
    game.drawScene();
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
    let points = game.utils.clone(leaf1.points)
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

  game.drawScene = function() {
    if (game.state.isOver) {
      // NB: this will not work on Safari desktop nor iOS, see
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter#Browser_compatibility
      //ctx.filter = 'grayscale(1)';
      game.currentScene = 'branches';
    } else {
      ctx.filter = 'none';
    }
    clear();
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
      drawLeaf(0, 0, 0, game.state.isOver || true);
      drawLeaf(110, 130, 0, game.state.isOver);
      drawLeaf(110, 130, 20, game.state.isOver || true);
      drawLeaf(110, 130, 30, game.state.isOver);
      drawLeaf(220, 305, 120, game.state.isOver || true);
      drawLeaf(580, 250, 140, game.state.isOver || true);
      drawLeaf(705, 165, 250, game.state.isOver);
      drawLeaf(705, 165, 200, game.state.isOver || true);
    }

    if (animationTimer < 400) {
      requestAnimationFrame(game.drawScene);
    }
  }

  function clear() {
    ctx.clearRect(0, 0, PARAMS.WIDTH, PARAMS.HEIGHT);
  }

  game.drawScene();

  // FIXME: hide behind debug flag (with the recursive requestAnimationFrame it's a mess.)
  // debug: if CTRL is pressed, we display the mouse coords, log on click
  canvas.on('mousemove', function(e) {
    if (e.ctrlKey) {
      const coords = game.utils.getCoords(canvas, e);
      game.drawScene();
      ctx.save();
      ctx.fillStyle = 'black';
      ctx.fillText('x: ' + coords.x + ' y: ' + coords.y, coords.x, coords.y);
      ctx.restore();
    }
  });
  canvas.on('mousedown', function(e) {
    if (e.ctrlKey) {
      const coords = game.utils.getCoords(canvas, e);
      console.log(JSON.stringify(coords) + ',');
    }
  });

});
