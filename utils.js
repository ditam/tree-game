game.utils = {
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
