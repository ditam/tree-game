﻿const PARAMS = Object.freeze({
  WIDTH: 950,
  HEIGHT: 600,
  OUTLINE_WIDTH: 3,
  LEAVES_PER_BRANCH: 20,
  TRUNK_WEIGHT: 1,
  BRANCH_WEIGHT: 1,
  ROOT_CAPACITY: 2,
  DEBUG: true,
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
      leaves: 12,
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
  animationTimer: 0,
  scenes: ['branches', 'trunk', 'roots'],
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
    const cost = [50, 100, 350];
    const leafBatchSize = 5; // TODO: move to params or make dynamic based on current count
    addLeavesButton.on('click', function() {
      if (game.state.isOver) { return; }
      if (!checkCost(cost)) {
        return;
      }
      if (!checkCapacity('leaves', leafBatchSize)) {
        return;
      }
      payCost(cost);
      game.state.tree.leaves += leafBatchSize;
      game.drawScene();
      game.ui.updateToolbar();
    });
  } else if (scene === 'trunk') {
    const addBranchButton = $('<div>').addClass('button add-branches').text('Grow branches');
    $('#buttons-container').append(addBranchButton);
    const cost = [50, 100, 200];
    addBranchButton.on('click', function() {
      if (game.state.isOver) { return; }
      if (!checkCost(cost)) {
        return;
      }
      if (!checkCapacity('branches', 1)) {
        return;
      }
      payCost(cost);
      game.state.tree.branches++;
      game.ui.updateToolbar();
    });
  }
}

function consumeResources() {
  const leaves = game.state.tree.leaves;
  game.state.resources.carb += leaves;
  game.state.resources.water -= leaves;
}

function checkDeath() {
  function endGame(message) {
    game.state.isOver = true;
    $('#game-over-modal .message').text(message);
    $('#game-over-modal').removeClass('hidden');
    $('#game-over-modal .button').on('click', game.resetState);
    $('.wrapper .tabs').addClass('game-over');
  }
  // if the biomass exceeds the root capacity, the tree topples over
  const branches = game.state.tree.branches;
  const wBranch = PARAMS.BRANCH_WEIGHT;
  const trunkSize = game.state.tree.trunkSize;
  const wTrunk = PARAMS.TRUNK_WEIGHT;
  const roots = game.state.tree.rootSize;
  if ((branches * wBranch + trunkSize * wTrunk) > roots * PARAMS.ROOT_CAPACITY) {
    message = 'The roots could not bear the weight of the trunk and the branches, ' +
              'and a gust of wind turned it out of the ground.';
    endGame(message);
    return;
  }
  // if all the water has been spent, the tree dies from drying out
  if (game.state.resources.water < 0) {
    message = 'After using up all of its water reserves, it could not sustain its ' +
              ' most fundamental functions.';
    endGame(message);
    return;
  }
}

function advanceMonth() {
  game.state.month++;
  if (game.state.month === 12) {
    game.state.month = 0;
    game.state.year++;
  }

  game.animationTimer = 0;

  consumeResources();

  checkDeath();

  game.ui.updateToolbar();
}

game.setScene = function(scene) {
  game.currentScene = scene;
  // animations run in the first few seconds of scenes
  game.animationTimer = 0;
  renderUpgrades(game.currentScene);
  renderButtons(game.currentScene);
  game.drawScene();
  $('.wrapper .tab').removeClass('selected');
  const sceneIndex = game.scenes.indexOf(game.currentScene);
  $('.wrapper .tab').eq(sceneIndex).addClass('selected');
}

$(function(){
  const canvas = $('canvas.main');
  game.ctx = canvas[0].getContext('2d');
  const ctx = game.ctx;
  initTextures(ctx);
  game.ui.updateToolbar();

  $('#upgrade-modal .header').on('click', function() {
    if (game.state.isOver) { return; }
    $('#upgrade-modal').toggleClass('hidden');
  });

  $('#time-controls').on('click', function() {
    if (game.state.isOver) { return; }
    // We only display the help text before the first click
    $('#time-controls .message').remove();
    advanceMonth();
    game.drawScene();
  });

  $('.tab').on('click', function() {
    if (game.state.isOver) { return; }
    const clickedTab = $(this);
    game.setScene(game.scenes[clickedTab.index()]);
  })

  canvas.attr('width', PARAMS.WIDTH+'px');
  canvas.attr('height', PARAMS.HEIGHT+'px');

  ctx.font = '24px serif';

  game.setScene(game.currentScene);
  setInterval(function() {game.animationTimer++;}, 16); // 60FPS, baby! // TODO: 4K support
  // TODO: maybe we should use the timestamp passed to the requestAnimationFrame callback instead...

  game.drawScene();

  if (PARAMS.DEBUG) {
    // debug: if CTRL is pressed, we display the mouse coords, log on click
    // Note that with the recursive requestAnimationFrame, this results in a mess,
    // so you probably can't debug animation issues while using it.
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
  }

});
