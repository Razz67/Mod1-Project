const canvas = document.getElementById("breakout");
const ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

let game = {
	requestId: null,
	timeoutId: null,
	leftKey: false,
	rightKey: false,
	on: false,
};

let paddle = {
	height: 50,
	width: 100,
	get y() {
		return canvas.height - this.height;
	},
};
let ball = {
	radius: 10,
};
let block = {
	rows: 5,
	cols: 10,
	get width() {
		return canvas.width / this.cols;
	},
	height: 30,
};
let images = {
	background: new Image(),
	ball: new Image(),
	paddle: new Image(),
};
function onImageLoad(evt) {
	resetGame();
	createblocks();
	resetPaddle();
	paint();
	ctx.font = "50px ArcadeClassic";
	ctx.fillStyle = "lime";
	ctx.fillText("PRESS START", canvas.width / 2 - 120, canvas.height / 2);
}
images.background.addEventListener("load", onImageLoad);
images.background.src = "./images/background2.png";
images.ball.src = "./images/ball.png";
images.paddle.src = "./images/paddle.png";

let blockItems = [];

function play() {
	cancelAnimationFrame(game.requestId);
	clearTimeout(game.timeoutId);
	game.on = true;
	resetGame();
	resetBall();
	resetPaddle();
	createblocks();
	animate();
}

function resetGame() {
	game.speed = 7;
	game.score = 0;
	game.level = 1;
	game.lives = 3;
	game.time = { start: performance.now(), elapsed: 0, refreshRate: 16 };
}

function resetBall() {
	ball.x = canvas.width / 2;
	ball.y = canvas.height - paddle.height - 2 * ball.radius;
	ball.dx = game.speed * (Math.random() * 2 - 1); // Random trajectory
	ball.dy = -game.speed; // Up
}

function resetPaddle() {
	paddle.x = (canvas.width - paddle.width) / 2;
	paddle.dx = game.speed + 7;
}

function createblocks() {
	blockItems = [];
	const topMargin = 30;
	const colors = ["red", "orange", "yellow", "blue", "green"];
	const blockImages = [
		(images.block.src = "./images/block.png"),
		(images.destroyed.src = "./images/destroyed.png"),
	];

	for (let row = 0; row < block.rows; row++) {
		for (let col = 0; col < block.cols; col++) {
			blockItems.push({
				x: col * block.width,
				y: row * block.height + topMargin,
				height: block.height,
				width: block.width,
				color: colors[row],
				image: blockImages[row],
				points: (5 - row) * 2,
				hitsLeft: row === 0 ? 2 : 1,
			});
		}
	}
}
