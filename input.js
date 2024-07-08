export default class InputHandler {
	constructor(game) {
		this.game = game;
		this.keys = [];
		window.addEventListener('keydown', (e) => {
			if (
				(e.key === 'ArrowDown' ||
					e.key === 'ArrowUp' ||
					e.key === 'ArrowLeft' ||
					e.key === 'ArrowRight' ||
					e.key === 'Control' ||
					e.key === ' ') &&
				this.keys.indexOf(e.key) === -1
			) {
				this.keys.push(e.key);
			}
			if (e.key === 'd') {
				this.game.debug = !this.game.debug;
				console.log(this.game.debug ? 'Debug Mode: ON' : 'Debug Mode: OFF');
			}
			// console.log(e.key, this.keys);
		});
		window.addEventListener('keyup', (e) => {
			if (
				e.key === 'ArrowDown' ||
				e.key === 'ArrowUp' ||
				e.key === 'ArrowLeft' ||
				e.key === 'ArrowRight' ||
				e.key === 'Control' ||
				e.key === ' '
			) {
				this.keys.splice(this.keys.indexOf(e.key), 1);
			}
			// console.log(this.keys);
		});
	}
}
