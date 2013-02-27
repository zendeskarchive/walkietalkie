function DemoCanvas(selector) {
  var element = this.element = $(selector);
  this.element
    .attr('unselectable', 'on')
    .css('user-select', 'none')
    .on('selectstart', false);

  var context = this.element.get(0).getContext('2d');

  this.drawDot = function(coords) {
    context.fillStyle = "rgb(255,0,0)";
    context.fillRect(coords.x-1, coords.y-1, 3, 3);
  };

  this.clearCanvas = function() {
    context.clearRect(0, 0, element.get(0).width, element.get(0).height);
  };

  this.on = function(name, callback) {
    element.on(name, callback);
  }

};
