import {
	Sitting,
	Running,
	Jumping,
	Falling,
	Rolling,
	Diving,
	Hit,
} from './playerStates.js';
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from './floatingMessages.js';

export default class Player {
	constructor(game) {
		this.game = game;
		this.image = player;
		this.width = 100;
		this.height = 91.3;
		this.x = this.width;
		this.y = this.game.height - this.height - this.game.groundMargin;
		this.minX = 0;
		this.minY = -this.height;
		this.maxX = this.game.width - this.width;
		this.maxY = this.game.height - this.height - this.game.groundMargin;
		this.frameX = 0;
		this.frameY = 0;
		this.speed = 0;
		this.maxSpeed = 5;
		this.vy = 0;
		this.weight = 1;
		this.energy = 10000;
		this.maxEnergy = 10000;
		this.overheated = false;
		this.recoveryTimer = 0;
		this.recoverInterval = 5000;
		this.maxFrame = 4;
		this.fps = 20;
		this.frameTimer = 0;
		this.frameInterval = 1000 / this.fps;
		this.states = [
			new Sitting(this.game),
			new Running(this.game),
			new Jumping(this.game),
			new Falling(this.game),
			new Rolling(this.game),
			new Diving(this.game),
			new Hit(this.game),
		];
		this.currentState = null;
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
			context.strokeRect(
				this.x + this.width * 0.3,
				this.y + this.height * 0.3,
				this.width * 0.5,
				this.height * 0.5
			);
		}
		//draw energy bar
		if (
			this.currentState === this.states[4] ||
			this.energy / this.maxEnergy < 0.99
		) {
			context.save();
			if (this.overheated) {
				context.fillStyle = 'grey';
			} else {
				context.fillStyle = 'black';
			}
			// context.fillStyle = 'black';
			context.fillRect(
				this.x + this.width * 0.1,
				this.y + this.height + 10,
				this.width * 0.8,
				10
			);
			context.restore();
			context.save();
			if (this.overheated) {
				context.fillStyle = 'firebrick';
			} else {
				context.fillStyle = 'dodgerblue';
			}

			context.fillRect(
				this.x + this.width * 0.1,
				this.y + this.height + 10,
				(this.energy / this.maxEnergy) * this.width * 0.8,
				10
			);
			context.restore();
			context.strokeRect(
				this.x + this.width * 0.1,
				this.y + this.height + 10,
				this.width * 0.8,
				10
			);
		}
		//draw overheat
		if (this.overheated) {
			context.save();
			context.fillStyle = `black`;
			context.fillText(`OVERHEAT!`, this.x + 10, this.y - 5);
			context.fillStyle = `red`;
			context.fillText(`OVERHEAT!`, this.x + 11, this.y - 6);
			context.restore();
		}
	}
	update(input, deltaTime) {
		this.checkOverheat();
		if (this.overheated) {
			this.recoveryTimer += deltaTime;
			if (this.recoveryTimer >= this.recoverInterval) {
				this.overheated = false;
				this.recoveryTimer = 0;
			}
		}

		this.checkCollision();
		//sprite animation
		if (this.frameTimer > this.frameInterval) {
			this.frameTimer = 0;
			if (this.frameX < this.maxFrame) this.frameX++;
			else this.frameX = 0;
		} else this.frameTimer += deltaTime;

		//to update state inputs
		this.currentState.handleInput(input);

		//horizontal movement
		this.x += this.speed;
		if (this.currentState !== this.states[6]) {
			if (input.includes('ArrowRight') && input.indexOf('ArrowDown') === -1) {
				this.speed = this.maxSpeed;
			} else if (
				input.includes('ArrowLeft') &&
				input.indexOf('ArrowDown') === -1
			) {
				this.speed = -this.maxSpeed;
			} else this.speed = 0;
		} else this.speed = 0;

		//horizontal boundaries
		this.x = Math.max(this.minX, Math.min(this.x, this.maxX));

		//vertical movement
		this.y += this.vy;

		//vertical boundaries
		this.y = Math.max(this.minY, Math.min(this.y, this.maxY));
		//to simulate gravity
		if (!this.onGround()) {
			this.vy += this.weight;
		} else this.vy = 0;

		//energy system
		if (this.currentState === this.states[4] && this.energy > 0) {
			this.energy -= deltaTime * 2;
		} else if (
			this.currentState !== this.states[4] &&
			this.energy < this.maxEnergy
		) {
			this.energy += deltaTime * 2;
		}
	}

	onGround() {
		return this.y >= this.game.height - this.height - this.game.groundMargin;
	}
	setState(state, speed) {
		this.currentState = this.states[state];
		this.game.speed = this.game.maxSpeed * speed;
		this.currentState.enter();
	}
	checkCollision() {
		//collision detected
		this.game.enemies.forEach((enemy) => {
			if (
				enemy.x < this.x + this.width * 0.8 &&
				enemy.x + enemy.width > this.x + this.width * 0.3 &&
				enemy.y < this.y + this.height * 0.8 &&
				enemy.y + enemy.height > this.y + this.height * 0.3
			) {
				enemy.markedForDeletion = true;
				this.game.collisions.push(
					new CollisionAnimation(
						this.game,
						enemy.x + enemy.width + 0.5,
						enemy.y + enemy.height * 0.5
					)
				);

				if (
					this.currentState === this.states[4] ||
					this.currentState === this.states[5]
				) {
					this.game.score++;
					if (this.energy < this.maxEnergy) {
						this.energy += 500;
						if (this.energy > this.maxEnergy) {
							this.energy = this.maxEnergy;
						}
					}
					this.game.floatingMessages.push(
						new FloatingMessage(`+1`, enemy.x, enemy.y, 110, 45, 1000, 0)
					);
				} else if (this.currentState !== this.states[6]) {
					this.setState(6, 0);
					this.game.lives--;
					if (this.game.lives > 0) {
						this.game.floatingMessages.push(
							new FloatingMessage(
								`💔`,
								this.x + this.width * 0.3,
								this.y + this.height * 0.5,
								this.x + this.width * 0.3,
								this.y,
								700,
								0.3
							)
						);
					}

					if (this.game.lives <= 0) {
						this.game.gameOver = true;
					}
				}
			}
		});
	}
	checkOverheat() {
		if (!this.overheated && this.energy <= 0) {
			this.overheated = true;
		}
	}
}
