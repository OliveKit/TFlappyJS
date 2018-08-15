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
    this.brain = new Brain();
    this.score = 0;
    this.max_speed = 20;
  }

  pos(){
  	return [this.x, this.y];
  }

  draw(ctx) {
  	ctx.beginPath();
    if (this.alive){
    	ctx.fillStyle = this.color;
    } else {
    	ctx.fillStyle = '#ff0000';
    }
    ctx.globalAlpha = 0.5;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  applyGravity() {
  	this.speed = this.speed + 0.9 >= this.max_speed ? this.max_speed : this.speed + 0.9;
  }

  applyJump() {
  	this.speed = this.speed - 3 <= -this.max_speed ? -this.max_speed : this.speed - 3;
  }

  think(door_x, door_y, door_hole) {
    return Promise.resolve(this.brain.predict(
        [(this.speed + this.max_speed) / (2 * this.max_speed),
          this.y / h,
          door_x / w,
          door_y / h,
          door_hole / h]
      ));

  }

  update(ctx, jump) {
  	if (this.alive && jump > 0) {
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