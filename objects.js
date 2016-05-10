function inherits(ChildClass, ParentClass) {
  function Surrogate(){}
  Surrogate.prototype = ParentClass.prototype;
  ChildClass.prototype = new Surrogate;
  ChildClass.prototype.constructor = ChildClass;
}


var Ball = function(x, y, r, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;
};


Ball.prototype = {

  draw: function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();
  }
};


var Ship = function(x, y, player) {
  this.x = x;
  this.y = y;
  this.w = 36;
  this.h = 36;
  this.r = this.w / 2;

  this.rotation = 0;
  this.rotateVel = 0.05;
  this.rotateDir = 0; //-1:left 0:none 1:right

  this.accel = {x:0, y:0};
  this.vel = {x:0, y:0};

  this.maxAccel = .4;
  this.maxVel = 4;

  this.player = player;
};

// inherits(Ship, Ball);

Ship.prototype = {

  //not really center fix later
  centerX: function() {
    return this.x - this.w / 2;
  },

  centerY: function() {
    return this.y - this.h / 2;
  },

  capVelocity: function() {
    var vel = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    if(vel > this.maxVel){
      var angle = Math.atan2(this.vel.y, this.vel.x);
      this.vel.x = Math.cos(angle) * this.maxVel;
      this.vel.y = Math.sin(angle) * this.maxVel;
    }
  },

  normalize: function() {
    this.rotateDir = 0;
    this.accel.x = this.accel.y = 0;
  },

  accelerate: function() {
    this.accel.x = Math.cos(this.rotation) * this.maxAccel;
    this.accel.y = Math.sin(this.rotation) * this.maxAccel;
  },

  logic: function() {
    this.rotation += this.rotateVel * this.rotateDir;
    this.vel.x += this.accel.x;
    this.vel.y += this.accel.y;
    this.capVelocity();
    // if(this.vel > this.maxVel) this.vel = this.maxVel;
    this.x += this.vel.x;
    this.y += this.vel.y;
  },

  draw: function(ctx, img) {
    var x = 0, y = 0, w = this.w, h = this.h;
    if(this.player === 1) {
      x = this.w;
    }

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(img, x, y, w, h, -this.w/2, -this.h/2, this.w, this.h);
    ctx.rotate(-this.rotation);
    ctx.translate(-this.x, -this.y);
  }
};
