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


var Ship = function(game, x, y, rotation, player) {
  this.game = game;

  this.x = x;
  this.y = y;
  this.w = 36;
  this.h = 36;
  this.r = this.w / 2;

  this.rotation = rotation;
  this.rotateVel = 0.05;
  this.rotateDir = 0; //-1:left 0:none 1:right

  this.accel = {x:0, y:0};
  this.vel = {x:0, y:0};

  this.maxAccel = .4;
  this.maxVel = 4;

  this.bounceDampen = 0.5;

  this.player = player;
};

// inherits(Ship, Ball);

Ship.prototype = {

  left: function() {
    return this.x - this.w / 2;
  },

  top: function() {
    return this.y - this.h / 2;
  },

  right: function() {
    return this.x + this.w / 2;
  },

  bottom: function() {
    return this.y + this.h / 2;
  },

  getCurrentAngle: function() {
    return Math.atan2(this.vel.y, this.vel.x);
  },

  getMag: function() {
    return Math.sqrt(this.vel.y * this.vel.y + this.vel.x * this.vel.x);
  },

  capVelocity: function() {
    var vel = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    if(vel > this.maxVel){
      var angle = this.getCurrentAngle()
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

  //maybe make this slow the velocity to 0
  deccelerate: function() {
    this.accel.x = Math.cos(this.rotation + Math.PI) * this.maxAccel * 0.2;
    this.accel.y = Math.sin(this.rotation + Math.PI) * this.maxAccel * 0.2;
  },

  resolveCollision: function(other) {
    var diffVect = {
      x: other.x - this.x,
      y: other.y - this.y
    };

    var diffMag = Math.sqrt(diffVect.y * diffVect.y + diffVect.x * diffVect.x);

    if(diffMag >= this.r + other.r) return;

    var theta = Math.atan2(diffVect.y, diffVect.x);
    var sine = Math.sin(theta);
    var cosine = Math.cos(theta);

    var bTemp = [
      {x:0, y:0},
      {x:0, y:0}
    ];

    bTemp[1].x = cosine * diffVect.x + sine * diffVect.y;
    bTemp[1].y = cosine * diffVect.y - sine * diffVect.x;

    var vTemp = [
      {x:0, y:0},
      {x:0, y:0}
    ];

    vTemp[0].x = cosine * this.vel.x + sine * this.vel.y;
    vTemp[0].y = cosine * this.vel.y - sine * this.vel.x;
    vTemp[1].x = cosine * other.vel.x + sine * other.vel.y;
    vTemp[1].y = cosine * other.vel.y - sine * other.vel.x;

    var vFinal = [
      {x:0, y:0},
      {x:0, y:0}
    ];

    vFinal[0].x = ((this.getMag() - other.getMag()) * vTemp[0].x + 2 * other.getMag() * vTemp[1].x) / (this.getMag() + other.getMag());
    vFinal[0].y = vTemp[0].y;

    vFinal[1].x = ((other.getMag() - this.getMag()) * vTemp[1].x + 2 * this.getMag() * vTemp[0].x) / (this.getMag() + other.getMag());
    vFinal[1].y = vTemp[1].y;

    bTemp[0].x += vFinal[0].x;
    bTemp[1].x += vFinal[1].x;

    var bFinal = [
      {x:0, y:0},
      {x:0, y:0}
    ];

    bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
    bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
    bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
    bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

    other.x = this.x + bFinal[1].x;
    other.y = this.y + bFinal[1].y;

    this.x += bFinal[0].x;
    this.y += bFinal[0].y;

    this.vel.x = cosine * vFinal[0].x - sine * vFinal[0].y;
    this.vel.y = cosine * vFinal[0].y + sine * vFinal[0].x;
    other.vel.x = cosine * vFinal[1].x - sine * vFinal[1].y;
    other.vel.y = cosine * vFinal[1].y + sine * vFinal[1].x;
  },

  logic: function() {
    this.rotation += this.rotateVel * this.rotateDir;
    this.vel.x += this.accel.x;
    this.vel.y += this.accel.y;
    this.capVelocity();
    // if(this.vel > this.maxVel) this.vel = this.maxVel;
    this.x += this.vel.x;
    this.y += this.vel.y;

    if(this.left() < 0) {
      this.x = this.w / 2;
      this.vel.x = -this.vel.x * this.bounceDampen;
    }
    else if(this.right() > this.game.width){
      this.x = this.game.width - this.w / 2;
      this.vel.x = -this.vel.x * this.bounceDampen;
    }

    if(this.top() < 0) {
      this.y = this.h / 2;
      this.vel.y = -this.vel.y * this.bounceDampen;
    }
    else if(this.bottom() > this.game.height){
      this.y = this.game.height - this.h / 2;
      this.vel.y = -this.vel.y * this.bounceDampen;
    }
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
