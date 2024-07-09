import Player from './player.js';
import InputHandler from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js';
import { UserInterface } from './interface.js';

/** @type {HTMLCanvasElement} */
window.addEventListener('load', () => {
	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');
	canvas.width = 1000;
	canvas.height = 500;

	class Game {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.groundMargin = 80;
			this.speed = 0;
			this.maxSpeed = 4;
			this.player = new Player(this);
			this.input = new InputHandler(this);
			this.background = new Background(this);
			this.userinterface = new UserInterface(this);
			this.enemies = [];
			this.particles = [];
			this.collisions = [];
			this.floatingMessages = [];
			this.maxParticles = 200;
			this.enemyTimer = 0;
			this.enemyInterval = 1000;
			this.debug = false;
			this.score = 0;
			this.winningScore = 69;
			this.fontColor = 'black';
			this.fontColorAlt = 'deeppink';
			this.time = 0;
			this.maxTime = 60000;
			this.gameOver = false;
			this.lives = 3;
			this.player.currentState = this.player.states[0];
			this.player.currentState.enter();
		}
		update(deltaTime) {
			console.log(this.player.y);
			this.maxTime -= deltaTime;
			if (this.maxTime <= 0) {
				this.maxTime = 0;
				this.gameOver = true;
			}
			this.player.update(this.input.keys, deltaTime);
			this.background.update();

			//handle enemies
			if (this.enemyTimer > this.enemyInterval) {
				this.addEnemy();
				this.enemyTimer = 0;
			} else {
				this.enemyTimer += deltaTime;
			}
			this.enemies.forEach((enemy, index) => {
				enemy.update(deltaTime);
			});
			this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

			//handle particles
			this.particles.forEach((particle, index) => {
				particle.update();
			});
			if (this.particles.length > this.maxParticles) {
				this.particles = this.particles.slice(0, this.maxParticles);
			}
			this.particles = this.particles.filter(
				(particle) => !particle.markedForDeletion
			);

			//handle floating messages
			this.floatingMessages.forEach((message) => {
				message.update(deltaTime);
			});
			this.floatingMessages = this.floatingMessages.filter(
				(message) => !message.markedForDeletion
			);

			//handle collision sprites
			this.collisions.forEach((collision) => {
				collision.update(deltaTime);
			});
			this.collisions = this.collisions.filter(
				(collision) => !collision.markedForDeletion
			);
		}
		draw(context) {
			this.background.draw(context);
			this.player.draw(context);
			this.enemies.forEach((enemy) => {
				enemy.draw(context);
			});
			this.particles.forEach((particle) => {
				particle.draw(context);
			});
			this.floatingMessages.forEach((message) => {
				message.draw(context);
			});
			this.collisions.forEach((collision) => {
				collision.draw(context);
			});
			this.userinterface.draw(context);
		}
		addEnemy() {
			this.enemies.push(new FlyingEnemy(this));
			if (this.speed > 0 && Math.random() < 0.5) {
				this.enemies.push(new GroundEnemy(this));
			} else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));

			// console.log(this.enemies);
		}
	}
	const game = new Game(canvas.width, canvas.height);

	let lastTime = 0;
	const animate = (timestamp) => {
		const deltaTime = timestamp - lastTime;
		lastTime = timestamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.update(deltaTime);
		game.draw(ctx);

		if (!game.gameOver) requestAnimationFrame(animate);
		// console.log(deltaTime);
	};
	animate(0);
});
