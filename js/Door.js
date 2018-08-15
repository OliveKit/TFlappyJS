class Door {
	constructor(w, h) {
		this.x = w;
		this.w = w;
		this.h = h;
		this.hole = randIntRange(0.6 * h, 0.8 * h);
		this.y = randIntRange(0, h - this.hole);
		this.speed = 5;
		this.thickness = 10;
	}

	update(ctx){
		this.x = this.x - this.speed;

		this.draw(ctx);
	}

	draw (ctx){
  		ctx.beginPath();
	    ctx.fillStyle = "#f7f7f7";	
		ctx.rect(this.x, 0, this.thickness, this.y);
		ctx.rect(this.x, this.h, this.thickness, this.y + this.hole - this.h);
		ctx.fill();
		ctx.closePath();
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