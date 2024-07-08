export class UserInterface {
	constructor(game) {
		this.game = game;
		this.fontSize = 35;
		this.fontFamily = 'Teko';
		this.livesImage = lives;
	}
	draw(context) {
		context.save();
		//draw score
		context.font = ` ${this.fontSize}px ${this.fontFamily} `;
		context.textAlign = 'left';
		context.fillStyle = this.game.fontColor;
		context.fillText(`SCORE: ${this.game.score}`, 20, 50);
		context.fillStyle = this.game.fontColorAlt;
		context.fillText(`SCORE: ${this.game.score}`, 21, 51);
		//draw timer
		context.fillStyle = this.game.fontColor;
		context.font = ` ${this.fontSize * 0.9}px ${this.fontFamily} `;
		context.fillText(`TIME: ${(this.game.maxTime * 0.001).toFixed(1)}`, 20, 85);
		context.fillStyle = this.game.fontColorAlt;
		context.fillText(`TIME: ${(this.game.maxTime * 0.001).toFixed(1)}`, 21, 86);

		//draw lives counter
		context.save();
		context.font = ` ${this.fontSize * 0.5}px ${this.fontFamily} `;
		context.fillStyle = 'red';
		for (let i = 0; i < this.game.lives; i++) {
			context.fillText(`❤️`, 20 + i * 21, 120);
		}
		context.restore();

		//draw game over message
		if (this.game.gameOver) {
			context.textAlign = 'center';

			if (this.game.score >= this.game.winningScore) {
				context.font = `bold ${this.fontSize * 2}px ${this.fontFamily} `;
				context.fillStyle = this.game.fontColor;
				context.fillText(
					`Hell Yeah!`,
					this.game.width * 0.5,
					this.game.height * 0.5
				);
				context.fillStyle = this.game.fontColorAlt;
				context.fillText(
					`Hell Yeah!`,
					this.game.width * 0.5 + 1,
					this.game.height * 0.5 + 1
				);

				context.fillStyle = this.game.fontColor;
				context.font = `italic ${this.fontSize * 0.8}px ${this.fontFamily} `;
				context.fillText(
					`The streets are safe...for now.`,
					this.game.width * 0.5,
					this.game.height * 0.5 + 40
				);

				context.fillStyle = this.game.fontColorAlt;
				context.fillText(
					`The streets are safe...for now.`,
					this.game.width * 0.5 + 1,
					this.game.height * 0.5 + 41
				);
			} else {
				context.font = `bold ${this.fontSize * 2}px ${this.fontFamily} `;
				context.fillStyle = this.game.fontColor;
				context.fillText(
					`Game Over`,
					this.game.width * 0.5,
					this.game.height * 0.5
				);
				context.fillStyle = this.game.fontColorAlt;
				context.fillText(
					`Game Over`,
					this.game.width * 0.5 + 1,
					this.game.height * 0.5 + 1
				);

				context.fillStyle = this.game.fontColor;
				context.font = `italic ${this.fontSize * 0.8}px ${this.fontFamily} `;
				context.fillText(
					`Better luck next time...`,
					this.game.width * 0.5,
					this.game.height * 0.5 + 40
				);

				context.fillStyle = this.game.fontColorAlt;
				context.fillText(
					`Better luck next time...`,
					this.game.width * 0.5 + 1,
					this.game.height * 0.5 + 41
				);
			}
		}
		context.restore();
	}
}
