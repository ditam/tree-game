const PARAMS = Object.freeze({
  WIDTH: 950,
  HEIGHT: 600,
  OUTLINE_WIDTH: 3,
  LEAVES_PER_BRANCH: 20,
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
    }
  },
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
    patternContext.moveTo(0, i*5); // NB: size % step should be 0 for tileability
    patternContext.lineTo(i*25, 0);
    patternContext.stroke();
  }

  game.textures.leaf = context.createPattern(patternCanvas, 'repeat');
}

function updateToolbar() {
  $('.toolbar').empty();
  const resources = utils.clone(game.state.resources);
  let sHTML = ' -- ';
  ['carb', 'stem', 'water'].forEach(function(resName) {
    sHTML += '<span class="resource ' + resName + '">' + resources[resName] + '</span>';
  });

  // TODO: remove or hide behind debug flag, this will not be here, just drawn
  sHTML += ', leaves:' + game.state.tree.leaves;
  sHTML += ', branches:' + game.state.tree.branches;

  sHTML += ' ... and other stuff will be here too, thank you.';
  $('.toolbar').html(sHTML);
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
  updateToolbar();
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
      updateToolbar();
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
      updateToolbar();
      console.log('New branch count:', game.state.tree.branches);
    });
  }
}

$(function(){
  const canvas = $('canvas.main');
  const ctx = canvas[0].getContext('2d');
  initTextures(ctx);
  updateToolbar();

  $('#upgrade-modal .header').on('click', function() {
    $('#upgrade-modal').toggleClass('hidden');
  })

  const scenes = ['branches', 'trunk', 'roots'];
  let currentScene = 'branches';

  let animationTimer = 0;
  setInterval(function() {animationTimer++;}, 16); // 60FPS, baby! // TODO: 4K support

  // TODO: if we had a nice setScene method, this duplication would not be necessary...
  renderUpgrades(currentScene);
  renderButtons(currentScene);

  $('.tab').on('click', function() {
    const clickedTab = $(this);
    currentScene = scenes[clickedTab.index()];
    // animations run in the first few seconds of scenes
    animationTimer = 0;
    renderUpgrades(currentScene);
    renderButtons(currentScene);
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

  // FIXME: hide behind debug flag (with the recursive requestAnimationFrame it's a mess.)
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
