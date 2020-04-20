game.ui = {
  updateToolbar: function() {
    $('.toolbar').empty();
    const resources = game.utils.clone(game.state.resources);
    let sHTML = ' -- ';
    ['carb', 'stem', 'water'].forEach(function(resName) {
      sHTML += '<span class="resource ' + resName + '">' + resources[resName] + '</span>';
    });

    // TODO: remove or hide behind debug flag, this will not be here, just drawn
    sHTML += ', leaves:' + game.state.tree.leaves;
    sHTML += ', branches:' + game.state.tree.branches;
    sHTML += ', trunk:' + game.state.tree.trunkSize;


    sHTML += ' | Year:' + game.state.year;
    sHTML += ', Month:' + (game.state.month+1);
    $('.toolbar').html(sHTML);
  }
};
