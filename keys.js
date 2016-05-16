window.keys = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  A: false,
  S: false,
  D: false,
  W: false,
  R: false
};

window.addEventListener('keydown', function(e) {
  console.log(e.keyCode);
  switch(e.keyCode) {
    case 37:
      window.keys.LEFT = true;
      break;
    case 38:
      window.keys.UP = true;
      break;
    case 39:
      window.keys.RIGHT = true;
      break;
    case 40:
      window.keys.DOWN = true;
      break;
    case 65:
      window.keys.A = true;
      break;
    case 87:
      window.keys.W = true;
      break;
    case 68:
      window.keys.D = true;
      break;
    case 83:
      window.keys.S = true;
      break;
    case 82:
      window.keys.R = true;
      break;
  }
});

window.addEventListener('keyup', function(e) {
  switch(e.keyCode) {
    case 37:
      window.keys.LEFT = false;
      break;
    case 38:
      window.keys.UP = false;
      break;
    case 39:
      window.keys.RIGHT = false;
      break;
    case 40:
      window.keys.DOWN = false;
      break;
    case 65:
      window.keys.A = false;
      break;
    case 87:
      window.keys.W = false;
      break;
    case 68:
      window.keys.D = false;
      break;
    case 83:
      window.keys.S = false;
      break;
    case 82:
      window.keys.R = false;
      break;
  }
});
