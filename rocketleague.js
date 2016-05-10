var shipSprite = new Image();
shipSprite.src = './gfx/ships.png';

document.addEventListener('DOMContentLoaded', function() {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 400;


  var Game = function() {
    this.p0 = new Ship(200, 200, 1);
    window.requestAnimationFrame(this.update.bind(this));
  };

  Game.prototype = {
    update: function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.p0.draw(ctx, shipSprite);
      window.requestAnimationFrame(this.update.bind(this));
    }
  };

  new Game();
  // window.requestAnimationFrame(update.bind(this));
});
