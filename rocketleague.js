// Astro League!

var spritesheet = new Image();
spritesheet.src = './gfx/spritesheet.png';

var GameState = {
  COUNTDOWN: 'COUNTDOWN',
  PLAY: 'PLAY',
  EXPLODE: 'EXPLODE'
};

document.addEventListener('DOMContentLoaded', function() {

  var scoreboard = [
    document.getElementById('score1'),
    document.getElementById('score0')
  ];
  var timer = document.getElementById('timer');

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 400;


  var Game = function() {
    this.width = canvas.width;
    this.height = canvas.height;

    this.state = GameState.COUNTDOWN;

    this.timeToNextRound = 2000;

    this.pos = {
      center: { x: this.width * 0.5, y: this.height * 0.5 },
      a1: {x: this.width * 0.2, y: this.height * 0.5},
      b1: {x: this.width * 0.8, y: this.height * 0.5},
    };

    this.ball = new Ball(this, this.width * 0.5, this.height * 0.5)
    this.goal1 = new Goal(this, this.width * 0.2, this.height * 0.5, "#6495ed", 0);
    this.goal2 = new Goal(this, this.width * 0.8, this.height * 0.5, "#eda864", 1);
    this.shipA = new Ship(this, this.width * 0.2, this.height * 0.5, 0, 0);
    this.shipB = new AiShip(this, this.width * 0.8, this.height * 0.5, Math.PI, 1);

    this.sprites = [
      this.goal1,
      this.goal2,
      this.shipA,
      this.shipB,
      this.ball
    ];

    this.resetGame();

    window.requestAnimationFrame(this.update.bind(this));
  };

  Game.prototype = {

    resetGame: function() {
      this.gameTimer = 60000;
      this.overtime = false;
      this.scores = [0,0];
      this.reset();
    },

    reset: function() {
      this.ball.reset(this.pos.center, 0);
      this.shipA.reset(this.pos.a1, 0 + .5);
      this.shipB.reset(this.pos.b1, Math.PI + .5);
      this.countdown();
    },

    countdown: function() {
      this.state = GameState.COUNTDOWN;
      this.countdownTimer = 3000;
      this.lastCountdownTime = Date.now();
    },

    play: function() {
      this.state = GameState.PLAY;
      this.lastTime = Date.now();
    },

    score: function(goalId) {
      if(this.state === GameState.PLAY){
        this.state = GameState.EXPLODE;
        this.ball.explode();
        scoreboard[goalId].innerHTML = ++this.scores[goalId];
        this.nextRoundTimer = Date.now();
      }
    },

    // updateScoreboard: function() {
    //   scoreboard[0].innerHTML = this.
    // },

    handleInput: function() {
      this.sprites.forEach(function(sprite) {
        sprite.normalize();
      });

      if(window.keys.LEFT) {
        this.shipA.rotateDir -= 1;
      }
      if(window.keys.RIGHT) {
        this.shipA.rotateDir += 1;
      }
      if(window.keys.UP) {
        this.shipA.accelerate();
      }
      if(window.keys.DOWN) {
        this.shipA.deccelerate();
      }
      // if(window.keys.LEFT) {
      //   this.shipB.rotateDir -= 1;
      // }
      // if(window.keys.RIGHT) {
      //   this.shipB.rotateDir += 1;
      // }
      // if(window.keys.UP) {
      //   this.shipB.accelerate();
      // }
      // if(window.keys.DOWN) {
      //   this.shipB.deccelerate();
      // }

      // if(window.keys.A) {
      //   if(!this.shipA.stunned())
      //   this.shipA.rotateDir -= 1;
      // }
      // if(window.keys.D) {
      //   if(!this.shipA.stunned())
      //   this.shipA.rotateDir += 1;
      // }
      // if(window.keys.W) {
      //   this.shipA.accelerate();
      // }
      // if(window.keys.S) {
      //   this.shipA.deccelerate();
      // }
    },

    getGameTime: function() {
      var seconds = Math.ceil(this.gameTimer / 1000);
      var minutes = Math.floor(seconds / 60);
      seconds %= 60;
      if(seconds < 10) seconds = "0" + seconds;
      return minutes + ":" + seconds;
    },

    handleTimer: function() {
      if(this.overtime) return;
      var elapsed = Date.now() - this.lastTime;
      this.lastTime = Date.now();
      this.gameTimer -= elapsed;
      timer.innerHTML = this.getGameTime();
      if(this.gameTimer < 0){
        this.state = GameState.GAMEOVER;
      }
    },

    drawCountdown: function() {
      var elapsed = Date.now() - this.lastCountdownTime;
      this.lastCountdownTime = Date.now();
      this.countdownTimer -= elapsed;
      var seconds = Math.ceil(this.countdownTimer / 1000);
      if(seconds > 0){
        ctx.fillStyle = 'white';
        ctx.font = "48px Orbitron, sans-serif";
        ctx.fillText(seconds.toString(), this.width/2 - 20, this.height/2 - 50);
        if(this.overtime){
          // ctx.fillText("OVERTIME", 264, 102);
          ctx.fillText("OVERTIME", 260, 100);
        }
      }
      else {
        this.play();
      }
    },

    update: function() {

      if(this.state === GameState.PLAY){

        //timer
        this.handleTimer();

        //input
        this.handleInput();

        //logic
        this.sprites.forEach(function(sprite){
          sprite.logic();
        });

        this.shipA.resolveCollision(this.shipB);

        this.ball.resolveCollision(this.shipA);
        this.ball.resolveCollision(this.shipB);
      }

      //draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.sprites.forEach(function(sprite) {
        sprite.draw(ctx, spritesheet);
      });


      if(this.state === GameState.EXPLODE){
        if(Date.now() - this.nextRoundTimer >= this.timeToNextRound){
          if(this.overtime){
            this.state = GameState.GAMEOVER;
          }
          else {
            this.reset();
          }
        }
      }

      if(this.state === GameState.COUNTDOWN){
        this.drawCountdown();
      }

      if(this.state === GameState.GAMEOVER) {
        if(this.scores[0] === this.scores[1]) {
          this.overtime = true;
          this.reset();
        }
        else {
          ctx.font = "48px Orbitron, sans-serif";
          var text;
          if(this.scores[0] < this.scores[1]) {
            text = "Blue Wins!";
            ctx.fillStyle = 'black';
            ctx.fillText(text, 269,102);
            ctx.fillStyle = "#6495ed";
            ctx.fillText(text, 267,100);
          }else {
            text = "Orange Wins!";
            ctx.fillStyle = 'black';
            ctx.fillText(text, 232,102);
            ctx.fillStyle = "#eda864";
            ctx.fillText(text, 230,100);
          }
        }
      }

      window.requestAnimationFrame(this.update.bind(this));
    }
  };

  new Game();
  // window.requestAnimationFrame(update.bind(this));
});
