export class FloatingMessage {
	constructor(value, x, y, targetX, targetY, duration, angleVelocity) {
		this.value = value;
		this.x = x;
		this.y = y;
		this.targetX = targetX;
		this.targetY = targetY;
		this.markedForDeletion = false;
		this.timer = 0;
		this.duration = duration;
		this.angle = 0;
		this.angleVelocity = angleVelocity;
	}
	update(deltaTime) {
		this.timer += deltaTime;
		this.angle += this.angleVelocity;
		this.x += (this.targetX - this.x) * 0.05 + Math.sin(this.angle) * 2;
		this.y += (this.targetY - this.y) * 0.05;

		if (this.timer > this.duration) this.markedForDeletion = true;
	}
	draw(context) {
		context.font = '25px Teko';
		context.fillStyle = 'black';
		context.fillText(this.value, this.x, this.y);
		context.fillStyle = 'deeppink';
		context.fillText(this.value, this.x + 1, this.y + 1);
	}
}
