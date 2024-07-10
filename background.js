class Layer {
	constructor(game, width, height, speedModifier, image) {
		this.game = game;
		this.width = width;
		this.height = height;
		this.speedModifier = speedModifier;
		this.image = image;
		this.x = 0;
		this.y = 0;
	}
	update() {
		if (this.x < -this.width) {
			this.x = 0;
		}
		this.x -= this.game.speed * this.speedModifier;
	}
	draw(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
		context.drawImage(
			this.image,
			this.x + this.width,
			this.y,
			this.width,
			this.height
		);
	}
}

export class Background {
	constructor(game) {
		this.game = game;
		this.width = 1667;
		this.height = 500;
		this.layer1Image = layer1;
		this.layer2Image = layer2;
		this.layer3Image = layer3;
		this.layer4Image = layer4;
		this.layer5Image = layer5;
		this.layer1 = new Layer(
			this.game,
			this.width,
			this.height,
			0,
			this.layer1Image
		);
		this.layer2 = new Layer(
			this.game,
			this.width,
			this.height,
			0.25,
			this.layer2Image
		);
		this.layer3 = new Layer(
			this.game,
			this.width,
			this.height,
			0.5,
			this.layer3Image
		);
		this.layer4 = new Layer(
			this.game,
			this.width,
			this.height,
			0.75,
			this.layer4Image
		);
		this.layer5 = new Layer(
			this.game,
			this.width,
			this.height,
			1,
			this.layer5Image
		);
		this.backgroundLayers = [
			this.layer1,
			this.layer2,
			this.layer3,
			this.layer4,
			this.layer5,
		];
	}
	update() {
		this.backgroundLayers.forEach((layer) => {
			layer.update();
		});
	}
	draw(context) {
		this.backgroundLayers.forEach((layer) => {
			layer.draw(context);
		});
	}
}

export class BackgroundText {
	constructor(game, value) {
		this.game = game;
		this.fontSize = 35;
		this.fontFamily = 'Teko';
		this.value = value;
		this.markedForDeletion = false;
		this.x = 0;
		this.minX = -this.game.width * 3;
	}
	draw(context) {
		//draw objective
		context.save();
		context.textAlign = 'left';
		context.font = `bold ${this.fontSize * 2}px ${this.fontFamily} `;
		context.fillStyle = this.game.fontColor;
		context.fillText(
			this.value,
			this.game.width + this.x,
			this.game.height * 0.5
		);
		context.fillStyle = this.game.fontColorAlt;
		context.fillText(
			this.value,
			this.game.width + 1 + this.x,
			this.game.height * 0.5 + 1
		);
		context.restore();
	}
	update() {
		this.x -= this.game.speed;
		this.x = Math.max(this.minX, Math.min(this.x, this.game.width));
		if (this.x <= this.minX) {
			this.markedForDeletion = true;
		}
	}
}
