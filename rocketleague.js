var shipSprite = new Image();
shipSprite.src = './gfx/ships.png';

document.addEventListener('DOMContentLoaded', function() {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 400;


  var Game = function() {
    this.width = canvas.width;
    this.height = canvas.height;

    this.p0 = new Ship(this, this.width * 0.20, this.height * 0.5, 0, 0);
    this.p1 = new Ship(this, this.width * 0.80, this.height * 0.5, Math.PI, 1);

    window.requestAnimationFrame(this.update.bind(this));
  };

  Game.prototype = {

    handleInput: function() {
      this.p0.normalize();
      this.p1.normalize();

      if(window.keys.LEFT) {
        this.p1.rotateDir -= 1;
      }
      if(window.keys.RIGHT) {
        this.p1.rotateDir += 1;
      }
      if(window.keys.UP) {
        this.p1.accelerate();
      }
      if(window.keys.DOWN) {
        // this.p1.deccelerate();
      }

      if(window.keys.A) {
        this.p0.rotateDir -= 1;
      }
      if(window.keys.D) {
        this.p0.rotateDir += 1;
      }
      if(window.keys.W) {
        this.p0.accelerate();
      }
      if(window.keys.S) {
        // this.p0.deccelerate();
      }
    },

    update: function() {

      //input
      this.handleInput();

      //logic
      this.p0.logic();
      this.p1.logic();

      //draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.p0.draw(ctx, shipSprite);
      this.p1.draw(ctx, shipSprite);
      window.requestAnimationFrame(this.update.bind(this));
    }
  };

  new Game();
  // window.requestAnimationFrame(update.bind(this));
});
