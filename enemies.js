class Enemy {
	constructor() {
		this.frameX = 0;
		this.frameY = 0;
		this.fps = 15;
		this.frameInterval = 1000 / this.fps;
		this.frameTimer = 0;
		this.markedForDeletion = false;
	}
	update(deltaTime) {
		//movement
		this.x -= this.speedX + this.game.speed;
		this.y += this.speedY;
		if (this.frameTimer > this.frameInterval) {
			this.frameTimer = 0;
			if (this.frameX < this.maxFrame) this.frameX++;
			else this.frameX = 0;
		} else {
			this.frameTimer += deltaTime;
		}
		//remove when off-screen
		if (this.x + this.width < 0 || this.y < 0 - this.height)
			this.markedForDeletion = true;
	}
	draw(context) {
		context.drawImage(
			this.image,
			this.frameX * this.width,
			this.frameY * this.height,
			this.width,
			this.height,
			this.x,
			this.y,
			this.width,
			this.height
		);
		if (this.game.debug) {
			context.strokeRect(this.x, this.y, this.width, this.height);
		}
	}
}
//try putting this.game in parent class
export class FlyingEnemy extends Enemy {
	constructor(game) {
		super();
		this.game = game;
		this.image = document.getElementById('enemy_fly');
		this.width = 60;
		this.height = 44;
		this.x = this.game.width + Math.random() * this.game.width * 0.5;
		this.y = Math.random() * this.game.height * 0.5;
		this.speedX = Math.random() + 1;
		this.speedY = 0;
		this.maxFrame = 5;
		this.angle = 0;
		this.angleVelocity = Math.random() * 0.1 + 0.1;
	}
	update(deltaTime) {
		super.update(deltaTime);
		this.angle += this.angleVelocity;
		this.y += Math.sin(this.angle);
	}
}
export class GroundEnemy extends Enemy {
	constructor(game) {
		super();
		this.game = game;
		this.image = document.getElementById('enemy_plant');
		this.width = 60;
		this.height = 87;
		this.x = this.game.width;
		this.y = this.game.height - this.height - this.game.groundMargin;
		this.speedX = 0;
		this.speedY = 0;
		this.maxFrame = 1;
	}
}
export class ClimbingEnemy extends Enemy {
	constructor(game) {
		super();
		this.game = game;
		this.image = document.getElementById('enemy_spider_big');
		this.width = 120;
		this.height = 144;
		this.x = this.game.width;
		this.y = Math.random() * this.game.height * 0.5;
		this.speedX = 0;
		this.speedY = Math.random() > 0.5 ? 1 : -1;
		this.maxFrame = 5;
	}
	update(deltaTime) {
		super.update(deltaTime);
		if (this.y > this.game.height - this.height - this.game.groundMargin) {
			this.speedY *= -1;
		}
	}
	draw(context) {
		super.draw(context);
		context.beginPath();
		context.moveTo(this.x + this.width / 2, 0);
		context.lineTo(this.x + this.width / 2, this.y + 50);
		context.stroke();
	}
}
