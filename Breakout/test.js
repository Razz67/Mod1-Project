// 152

function brickHit(ball, brick) {
	brick.setTexture("destroyed");

	score += 5;
	scoreText.setText(`Score: ${score}`);

	this.tweens.add({
		targets: brick,
		scaleX: 0,
		scaleY: 0,
		ease: "Power1",
		duration: 500,
		delay: 250,
		angle: 180,
		onComplete: () => {
			brick.destroy();

			if (bricks.countActive() === 0) {
				ball.destroy();

				wonTheGameText.setVisible(true);
			}
		},
	});
}

function startGame() {
	startButton.destroy();
	ball.setVelocity(-300, -150);
	rotation = "left";

	this.input.on("pointermove", (pointer) => {
		paddle.x = Phaser.Math.Clamp(
			pointer.x,
			paddle.width / 2,
			this.game.config.width - paddle.width / 2
		);
	});
}
