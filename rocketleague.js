var spritesheet = new Image();
spritesheet.src = './gfx/spritesheet.png';

document.addEventListener('DOMContentLoaded', function() {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 400;


  var Game = function() {
    this.width = canvas.width;
    this.height = canvas.height;

    this.pos = {
      center: { x: this.width * 0.5, y: this.height * 0.5 },
      a1: {x: this.width * 0.2, y: this.height * 0.5},
      b1: {x: this.width * 0.8, y: this.height * 0.5},
    };

    this.ball = new Ball(this, this.width * 0.5, this.height * 0.5)
    this.goal1 = new Goal(this, this.width * 0.2, this.height * 0.5, "#6495ed", this.ball);
    this.goal2 = new Goal(this, this.width * 0.8, this.height * 0.5, "#eda864", this.ball);
    this.shipA = new Ship(this, this.width * 0.2, this.height * 0.5, 0, 0);
    this.shipB = new Ship(this, this.width * 0.8, this.height * 0.5, Math.PI, 1);

    this.sprites = [
      this.goal1,
      this.goal2,
      this.shipA,
      this.shipB,
      this.ball
    ];

    window.requestAnimationFrame(this.update.bind(this));
  };

  Game.prototype = {

    reset: function() {
      this.ball.reset(this.pos.center, 0);
      this.shipA.reset(this.pos.a1, 0);
      this.shipB.reset(this.pos.b1, Math.PI);
    },

    handleInput: function() {
      this.sprites.forEach(function(sprite) {
        sprite.normalize();
      });

      if(window.keys.LEFT) {
        this.shipB.rotateDir -= 1;
      }
      if(window.keys.RIGHT) {
        this.shipB.rotateDir += 1;
      }
      if(window.keys.UP) {
        this.shipB.accelerate();
      }
      if(window.keys.DOWN) {
        this.shipB.deccelerate();
      }

      if(window.keys.A) {
        this.shipA.rotateDir -= 1;
      }
      if(window.keys.D) {
        this.shipA.rotateDir += 1;
      }
      if(window.keys.W) {
        this.shipA.accelerate();
      }
      if(window.keys.S) {
        this.shipA.deccelerate();
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
        sprite.draw(ctx, spritesheet);
      });

      this.shipA.resolveCollision(this.shipB);
      this.ball.resolveCollision(this.shipA);
      this.ball.resolveCollision(this.shipB);

      window.requestAnimationFrame(this.update.bind(this));
    }
  };

  new Game();
  // window.requestAnimationFrame(update.bind(this));
});
