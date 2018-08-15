const w = 900, h = 600;
let jumping = false;

let canvas = document.getElementById("gameCanvas");
canvas.width = w;
canvas.height = h;
let ctx = canvas.getContext('2d');

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// let ball = new Ball(w, h);
let balls = [];
for (let i = 0 ; i < 100 ; i++) {
  balls[i] = new Ball(w, h);
}

let doors = [];
let frame_btw_doors = 30;
let frame_counter = 0;

function step(timestamp) {

  if (frame_counter%frame_btw_doors === 0){
    doors.push(new Door(w, h));
  }
	frame_counter ++;

	ctx.clearRect(0,0,w,h);

	for (let door of doors) {
		door.update(ctx);
	
	}


  const next_door = find_closest_door(balls[0].x, doors);

  const alives = balls.filter(b => b.alive);
  tf.tidy(() => {
  Promise.all(
      alives.map(ball => ball.think(next_door.x, next_door.y, next_door.hole))
    )
    .then(values => {
      values.forEach((val, i) => {
        alives[i].update(ctx, val[0])
        if (next_door.is_collided(alives[i].pos())) {
          alives[i].alive = false;
        }

      })
    	if (doors[0] && doors[0].isOutside()){
    		doors.shift();
        alives.forEach(b => b.score++);
    	}
      console.log(tf.memory().numTensors);

	    requestAnimationFrame(step);
    });
  });


  // for (let ball of balls) {
  //   // ball.update(ctx, next_door.x, next_door.y, next_door.hole);
  // }
  
}

function find_closest_door(x, doors) {
  return doors.find(d => d.x + d.thickness > x);
}

requestAnimationFrame(step);

window.addEventListener("keydown", e => jumping = true);
window.addEventListener("keyup", e => jumping = false);