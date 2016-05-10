window.keys = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  A: false,
  S: false,
  D: false,
  W: false
};

window.addEventListener('keydown', function(e) {
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
  }
});
