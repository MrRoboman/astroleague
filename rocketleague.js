document.addEventListener('DOMContentLoaded', function() {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 400;


  var Game = function() {
    this.p1 = new Ball(50, 50, 20, "#ff0000");
    this.update();
  };

  Game.prototype = {
    update: function() {
      this.p1.draw(ctx);
    }
  };

  new Game();
  // window.requestAnimationFrame(update.bind(this));
});
