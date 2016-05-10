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

  draw: function(ctx, img) {
    var x = 0, y = 0, w = 36, h = 36;
    if(this.player === 1) {
      x = 36;
    }

    ctx.drawImage(img, x, y, w, h, this.centerX(), this.centerY(), this.w, this.h);
  }
};
