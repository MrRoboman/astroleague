function inherits(ChildClass, ParentClass) {
  function Surrogate(){}
  Surrogate.prototype = ParentClass.prototype;
  ChildClass.prototype = new Surrogate;
  ChildClass.prototype.constructor = ChildClass;
}


var SpaceObject = function(game, x, y, rotation, type) {};

SpaceObject.prototype = {

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

  reset: function(pos, rot) {
    this.setPos(pos);
    this.rotation = rot;
    this.accel.x = this.accel.y = 0;
    this.vel.x = this.vel.y = 0;
    this.state = State.ALIVE;
  },

  setPos: function(pos) {
    this.x = pos.x;
    this.y = pos.y;
  },

  boxCollision: function(other) {

    return !(this.right() < other.left() || this.left() > other.right() ||
             this.top() > other.bottom() || this.bottom() < this.top());
  },

  distanceTo: function(other){
    var x = this.x - other.x;
    var y = this.y - other.y;
    return Math.sqrt(x*x + y*y);
  },

  angleTo: function(other){
    return Math.atan2(other.y - this.y, other.x - this.x);
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
    this.accel.x = Math.cos(this.rotation + Math.PI) * this.maxAccel * 0.5;
    this.accel.y = Math.sin(this.rotation + Math.PI) * this.maxAccel * 0.5;
  },

  resolveCollision: function(other) {
    if(this.state !== State.ALIVE) return;
    var diffVect = {
      x: other.x - this.x,
      y: other.y - this.y
    };

    var diffMag = Math.sqrt(diffVect.y * diffVect.y + diffVect.x * diffVect.x);

    if(diffMag >= this.r + other.r) return false;

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

    vFinal[0].x = ((this.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) / (this.m + other.m);
    vFinal[0].y = vTemp[0].y;

    vFinal[1].x = ((other.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) / (this.m + other.m);
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

    //Move colliding objects out of each other, fixes bug where they stick
    if(this.distanceTo(other) < this.r + other.r){
      var angle = this.angleTo(other);
      other.x = this.x + Math.cos(angle) * (this.r + other.r + 2);
      other.y = this.y + Math.sin(angle) * (this.r + other.r + 2);
    }

    return true;
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
    if(this.type === 1) {
      x = this.w;
    }

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(img, x, y, w, h, -this.w/2, -this.h/2, this.w, this.h);
    ctx.rotate(-this.rotation);
    ctx.translate(-this.x, -this.y);
  }
};


var Ship = function(game, x, y, rotation, type) {
  this.game = game;

  this.state = State.ALIVE;
  this.type = type;
  this.ai = true;

  this.x = x;
  this.y = y;
  this.w = 36;
  this.h = 36;
  this.r = this.w / 2;
  this.m = 10; // asteroid is heavier

  this.rotation = rotation;
  this.rotateVel = 0.05;
  this.rotateDir = 0; //-1:left 0:none 1:right

  this.accel = {x:0, y:0};
  this.vel = {x:0, y:0};

  this.maxAccel = .4;
  this.maxVel = 4;

  this.bounceDampen = 0.5;
};

inherits(Ship, SpaceObject);


var State = {
  ALIVE: 'ALIVE',
  EXPLODE: 'EXPLODE',
  DEAD: 'DEAD'
};

var Ball = function(game, x, y) {
  this.game = game;

  this.state = State.ALIVE;

  this.x = x;
  this.y = y;
  this.w = 72;
  this.h = 72;
  this.r = this.w / 2;
  this.m = 10; // asteroid is heavier

  this.rotation = 0;
  this.rotateVel = 0.05;
  this.rotateDir = 0; //-1:left 0:none 1:right

  this.accel = {x:0, y:0};
  this.vel = {x:0, y:0};

  this.maxAccel = .4;
  this.maxVel = 4;

  this.bounceDampen = 0.5;

  this.explosionMS = 70;
  this.frameIdx = 0;
  this.frames = [];
  for(var Y = 0; Y < 72 * 2; Y += 72){
    for(var X = 72; X < 72 * 7; X += 72){
      this.frames.push({x:X, y:Y, w:72, h:72});
    }
  }
};

inherits(Ball, SpaceObject);

Ball.prototype.explode = function() {
  if(this.state === State.ALIVE){
    this.state = State.EXPLODE;
    this.vel.x = this.vel.y = 0;
    this.frameIdx = 0;
    this.explosionTimer = Date.now();
  }
},

Ball.prototype.draw = function(ctx, img) {
  var x = 0, y = 36, w = this.w, h = this.h;
  if(this.state === State.ALIVE){

  }
  else if(this.state === State.EXPLODE){
    x = this.frames[this.frameIdx].x;
    y = this.frames[this.frameIdx].y;
    if(Date.now() - this.explosionTimer >= this.explosionMS){
      this.explosionTimer = Date.now();
      this.frameIdx++;
      if(this.frameIdx === this.frames.length){
        this.state = State.DEAD;
      }
    }
  }


  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  if(this.state === State.ALIVE) ctx.drawImage(img, x, y, w, h, -this.w/2, -this.h/2, this.w, this.h);
  if(this.state === State.EXPLODE) ctx.drawImage(img, x, y, w, h, -this.w*1.5, -this.h*1.5, this.w*3, this.h*3);
  ctx.rotate(-this.rotation);
  ctx.translate(-this.x, -this.y);
};


var Goal = function(game, x, y, color, id) {
  this.id = id;
  this.game = game;
  this.x = x;
  this.y = y;
  this.r = 80;
  this.w = this.h = this.r*2;
  this.color = color;
  this.ball = this.game.ball;
  this.dashLength = 1;
};

inherits(Goal, SpaceObject);

Goal.prototype.normalize = function() {};

Goal.prototype.logic = function() {
  if(this.boxCollision(this.ball)) {
    if(this.distanceTo(this.ball) <= this.r - this.ball.r){
      this.game.score(this.id);
    }
  }
};

Goal.prototype.calcPointsCirc = function calcPointsCirc() {
  var n = this.r/this.dashLength,
      alpha = Math.PI * 2 / n,
      pointObj = {},
      points = [],
      i = -1;

  while( i < n ) {
      var theta = alpha * i,
          theta2 = alpha * (i+1);

      points.push({x : (Math.cos(theta) * this.r) + this.x,
                   y : (Math.sin(theta) * this.r) + this.y,
                   ex : (Math.cos(theta2) * this.r) + this.x,
                   ey : (Math.sin(theta2) * this.r) + this.y});
      i+=2;
  }
  return points;
};

Goal.prototype.draw = function(ctx) {
  var pointArray= this.calcPointsCirc();
  ctx.strokeStyle = this.color;
  ctx.beginPath();

  for(var p = 0; p < pointArray.length; p++){
      ctx.moveTo(pointArray[p].x, pointArray[p].y);
      ctx.lineTo(pointArray[p].ex, pointArray[p].ey);
      ctx.stroke();
  }
  // Render Collision Box
  // ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
  ctx.closePath();
};


//
// var AiShip = function(game, x, y, rotation, type, ai) {
//   this.game = game;
//
//   this.state = State.ALIVE;
//   this.type = type;
//
//   this.x = x;
//   this.y = y;
//   this.w = 36;
//   this.h = 36;
//   this.r = this.w / 2;
//   this.m = 10; // asteroid is heavier
//
//   this.rotation = rotation;
//   this.rotateVel = 0.05;
//   this.rotateDir = 0; //-1:left 0:none 1:right
//
//   this.accel = {x:0, y:0};
//   this.vel = {x:0, y:0};
//
//   this.maxAccel = .4;
//   this.maxVel = 4;
//
//   this.bounceDampen = 0.5;
// };
//
// inherits(AiShip, SpaceObject);

Ship.prototype.logic = function() {
  if(this.ai){
    var direction = Math.atan2(this.game.ball.y - this.y, this.game.ball.x - this.x);
    if(direction < this.rotation){
      this.rotateDir = -1;
    }else {
      this.rotateDir = 1;
    }

    this.accelerate();
  }


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
};
