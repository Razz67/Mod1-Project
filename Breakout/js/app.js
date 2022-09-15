let ball;
let paddle;
let block;
let scoreTxt;
let livesTxt;
let startBtn;
let rotation;
let gameOvertxt;
let gameWonTxt;

let score = 0;
let lives = 3;

const textStyle = {
	font: "bold 18px Arial",
	fill: "#FFF",
};

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: "#222",
	physics: {
		default: "arcade",
		arcade: {
			debug: false, // set to true to show the debug lines
			checkCollision: {
				up: true,
				down: false,
				left: true,
				right: true,
			},
		},
	},
	scene: {
		preload,
		create,
		update,
	},
};

const game = new Phaser.Game(config);

function preload() {
	this.load.image("background", "images/background2.png");
	this.load.image("paddle", "images/paddle.png");
	this.load.image("block", "images/block.png");
	this.load.image("destroyed", "images/destroyed.png");
	this.load.image("ball", "images/ball.png");
}

function create() {
	this.add.image(50, 50, "background").setOrigin(0, 0);
	paddle = this.physics.add
		.image(this.cameras.main.centerX, this.game.config.height - 50, "paddle")
		.setImmovable();

	ball = this.physics.add
		.image(this.cameras.main.centerX, this.game.config.height - 100, "ball")
		.setCollideWorldBounds(true)
		.setBounce(1);


	// Add Emojies
	block = this.physics.add.staticGroup({
		key: "block",
		frameQuantity: 30, // determines the number of emojies added to the game
		gridAlign: {
			width: 10,
			cellWidth: 60,
			cellHeight: 60,
			x: this.cameras.main.centerX - 277.5, y: 100,
		},
	});

	scoreTxt = this.add.text(20, 20, "Score: 0", textStyle);
	livesTxt = this.add
		.text(this.game.config.width - 20, 20, "Lives: " + lives, textStyle)
		.setOrigin(1, 0);

	gameOvertxt = this.add
		.text(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			"Game over!",
			textStyle,
		)
		.setOrigin(0.5)
		.setPadding(10)
		.setStyle({ backgroundColor: "#111", fill: "#e74c3c" })
		.setVisible(false);

	gameWonTxt = this.add.text(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			"You won the game!",
			textStyle
		)
		.setOrigin(0.5)
		.setPadding(10)
		.setStyle({ backgroundColor: "#111", fill: "#27ae60" })
		.setVisible(false);

	startBtn = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Start game", textStyle)
		.setOrigin(0.5)
		.setPadding(10)
		.setStyle({ backgroundColor: "#111" })
		.setInteractive({ useHandCursor: true })
		.on("pointerdown", () => startGame.call(this))
		.on("pointerover", () => startBtn.setStyle({ fill: "#f39c12" }))
		.on("pointerout", () => startBtn.setStyle({ fill: "#FFF" }));

	
	this.physics.add.collider(ball, block, blockHit, null, this);
	this.physics.add.collider(ball, paddle, paddleHit, null, this);
}

function update() {
	if (rotation) {
		ball.rotation =	rotation === "left" ? ball.rotation - 0.05 : ball.rotation + 0.05;
	}

	if (ball.y > paddle.y) {
		lives--;

		if (lives > 0) {
			livesTxt.setText(`Lives: ${lives}`);

			ball.setPosition(this.cameras.main.centerX, this.game.config.height - 100)
				.setVelocity(300, -150);
		} else {
			ball.destroy();

			gameOvertxt.setVisible(true);
		}
	}
}

function paddleHit(ball, paddle) {
	var diff = 0;

	if (ball.x < paddle.x) {
		diff = paddle.x - ball.x;
		ball.setVelocityX(-20 * diff);
		rotation = "left";
	} else if (ball.x > paddle.x) {
		diff = ball.x - paddle.x;
		ball.setVelocityX(20 * diff);
		rotation = "right";
	} else {
		ball.setVelocityX(2 + Math.random() * 10); // sets a random velocity of the ball afgter it hits the paddle
	}
}

function blockHit(ball, block) {
	block.setTexture("destroyed");  // changes the texture of the block to destroyed.png
	score += 5;
	scoreTxt.setText(`Score: ${score}`);

	this.tweens.add({  // handles the animation of the block when hit
		targets: block,
		scaleX: 0,
		scaleY: 0,
		ease: "Power1",
		duration: 500,
		delay: 250,
		angle: 180,
		onComplete: () => {
			block.destroy();

			if (block.count === 0) {
				ball.destroy();
				gameWonTxt.setVisible(true);
				
			}
		},
	});
}

function startGame() {
	startBtn.destroy();
	ball.setVelocity(-300, -150);
	rotation = "right";

	this.input.on("pointermove", (pointer) => {
		paddle.x = Phaser.Math.Clamp(
			pointer.x,
			paddle.width / 2,
			this.game.config.width - paddle.width / 2
		);
	});
}


const restart = () => {
	playAgainBtn = this.add
					.text(
						this.cameras.main.centerX,
						this.cameras.main.centerY,
						"Replay",
						textStyle
					)
					.setOrigin(-6, 0.5)
					.setPadding(10)
					.setStyle({ backgroundColor: "#111" })
					.setInteractive({ useHandCursor: true })
					.on("pointerdown", () => startGame.call(this))
					.on("pointerover", () => playAgainBtn.setStyle({ fill: "#f39c12" }))
					.on("pointerout", () => playAgainBtn.setStyle({ fill: "#FFF" }));