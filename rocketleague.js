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

    this.sprites = [
      new Ship(this, this.width * 0.20, this.height * 0.5, 0, 0),
      new Ship(this, this.width * 0.80, this.height * 0.5, Math.PI, 1)
    ];

    window.requestAnimationFrame(this.update.bind(this));
  };

  Game.prototype = {

    handleInput: function() {
      this.sprites.forEach(function(sprite) {
        sprite.normalize();
      });

      if(window.keys.LEFT) {
        this.sprites[1].rotateDir -= 1;
      }
      if(window.keys.RIGHT) {
        this.sprites[1].rotateDir += 1;
      }
      if(window.keys.UP) {
        this.sprites[1].accelerate();
      }
      if(window.keys.DOWN) {
        // this.sprites[1].deccelerate();
      }

      if(window.keys.A) {
        this.sprites[0].rotateDir -= 1;
      }
      if(window.keys.D) {
        this.sprites[0].rotateDir += 1;
      }
      if(window.keys.W) {
        this.sprites[0].accelerate();
      }
      if(window.keys.S) {
        // this.sprites[0].deccelerate();
      }
    },

    update: function() {

      //input
      this.handleInput();

      //logic
      this.sprites.forEach(function(sprite){
        sprite.logic();
      });

      //draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.sprites.forEach(function(sprite) {
        sprite.draw(ctx, shipSprite);
      });

      this.sprites[0].resolveCollision(this.sprites[1]);

      window.requestAnimationFrame(this.update.bind(this));
    }
  };

  new Game();
  // window.requestAnimationFrame(update.bind(this));
});
