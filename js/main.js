class Ball {
  constructor(w, h) {
  	this.w = w;
  	this.h = h;
    this.y = h / 2;
    this.x = 0.1 * w;
    this.speed = 0;
    this.radius = 5;
    this.color = "#f7f7f7";
    this.alive = true;
  }

  pos(){
  	return [this.x, this.y];
  }

  draw(ctx) {
    if (this.alive){
    	ctx.fillStyle = this.color;
    } else {
    	ctx.fillStyle = '#ff0000';
    }
  	ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  applyGravity() {
  	this.speed += 0.9;
  }

  applyJump() {
  	if (this.alive){
  		this.speed -= 3;
  	}
  }

  update(jumping, ctx) {
  	if (jumping) {
  		this.applyJump();
  	}
  	this.applyGravity();
  	this.translate();
  	this.checkLimits();
  	this.draw(ctx);
  }

  translate() {
  	this.y = this.y + this.speed;
  }

  checkLimits() {
  	const top = this.y >= this.h, bot = this.y <= 0;
  	if (top) {
  		this.y = this.h;
  	} else if (bot) {
  		this.y = 0;
  	}
  	this.speed = top || bot ? 0 : this.speed;
  }
}

class Door {
	constructor(w, h) {
		this.x = w;
		this.w = w;
		this.h = h;
		this.hole = randIntRange(0.2 * h, 0.8 * h);
		this.y = randIntRange(0, h - this.hole);
		this.speed = 5;
		this.thickness = 10;
	}

	update(ctx){
		this.x = this.x - this.speed;

		this.draw(ctx);
	}

	draw (ctx){
	    // ctx.fillStyle = "#f7f7f7";	
		ctx.rect(this.x, 0, this.thickness, this.y);
		ctx.rect(this.x, this.h, this.thickness, this.y + this.hole - this.h);
		ctx.fill();
	}

	is_collided(pos){
		let x = pos[0], y = pos[1];
		if (x < this.x || x > this.x + this.thickness){
			return false;
		} else{
			return ( y < this.y || y > this.y + this.hole); 
		}
	}

	isOutside(){
		return this.x <= 0 - this.thickness;	
	}  
}

randIntRange = (l, u) => Math.floor(l + Math.random() * (u - l));

const w = 900, h = 600;
let jumping = false;

let canvas = document.getElementById("gameCanvas");
canvas.width = w;
canvas.height = h;
let ctx = canvas.getContext('2d');

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

let ball = new Ball(w, h);

let doors = [];
let frame_btw_doors = 30;
let frame_counter = 0;
let score = 0;


function step(timestamp) {

	frame_counter ++;
	if (frame_counter%frame_btw_doors === 0){
		doors.push(new Door(w, h));
	}

	ctx.clearRect(0,0,w,h);
	ball.update(jumping, ctx);

	for (let door of doors) {
		door.update(ctx);
		if (door.is_collided(ball.pos())) {
			score = 0;
			ball.alive = false;
		}
	}
	
	if (doors[0] && doors[0].isOutside()){
		doors.shift();
		score ++;
		console.log(score);
	}
	requestAnimationFrame(step);
}

requestAnimationFrame(step);

window.addEventListener("keydown", e => jumping = true);
window.addEventListener("keyup", e => jumping = false);