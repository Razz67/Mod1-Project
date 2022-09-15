
let ball;
let paddle;
let block;
let newBlock;
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


function preload() {
	game.load.image("background", "images/background2.png");
	game.load.image("paddle", "images/paddle.png");
	game.load.image("block", "images/block.png");
	game.load.image("destroyed", "images/destroyed.png");
	game.load.image("ball", "images/ball.png");
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
    ball = game.add.image(game.world.width*0.5, game.world.height-25, 'ball');
    ball.animations.add('spin', [0,1,0,2,0,1,0,2,0], 24);
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.velocity.set(150, -150);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballOffCanvas, this);

    paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
    paddle.anchor.set(0.5,1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

	block = game.add.group({
		key: "block",
		repeat: 15,

		setXY: { 
			x: 12, 
			width: 50, 
			height: 50, 
			y: 12 },
	});
	bounceY: 1;
	collideWorldBounds: true;


    initBlock();

    textStyle = { font: '18px Arial', fill: '#0095DD' };
    scoreTxt = game.add.text(5, 5, 'Points: 0', textStyle);
    livesTxt = game.add.text(game.world.width-5, 5, 'Lives: '+lives, textStyle);
    livesTxt.anchor.set(1,0);
    lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'Life lost, tap to continue', textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;
}

	function update() {
		game.physics.arcade.collide(ball, paddle, ballHitPaddle);
		game.physics.arcade.collide(ball, block, ballHitBlock);
		paddle.x = game.input.x || game.world.width * 0.5;
	};


	function initBlock() {
		blockInfo = {
			width: 50,
			height: 50,
			count: {
				row: 7,
				col: 3,
			},
			offset: {
				top: 50,
				left: 60,
			},
			padding: 10,
		};
		blocks = game.add.group();
		for (c = 0; c < blockInfo.count.col; c++) {
			for (r = 0; r < blockInfo.count.row; r++) {
				var blockX =
					r * (blockInfo.width + blockInfo.padding) + blockInfo.offset.left;
				var blockY =
					c * (blockInfo.height + blockInfo.padding) + blockInfo.offset.top;
				newBlock = game.add.sprite(blockX, blockY, "block");
				game.physics.enable(newBlock, Phaser.Physics.ARCADE);
				newBlock.body.immovable = true;
				newBlock.anchor.set(0.5);
				blocks.add(newBlock);
			}
		}
	}

	function ballHitBlock(block) {
		let killTween = game.add.tween(block.scale);
		killTween.to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None);
		killTween.onComplete.addOnce(function () {
			block.kill();
		}, this);

		killTween.start();
		score += 100;
		scoreTxt.setText("Points: " + score);
		if (score === blockInfo.count.row * blockInfo.count.col * 10) {
			alert("You won the game, congratulations!");
			location.reload();
		}
	}

	function ballOffCanvas() {
		lives--;
		if (lives) {
			livesTxt.setText("Lives: " + lives);
			lifeLostText.visible = true;
			ball.reset(game.world.width * 0.5, game.world.height - 25);
			paddle.reset(game.world.width * 0.5, game.world.height - 5);
			game.input.onDown.addOnce(function () {
				lifeLostText.visible = false;
				ball.body.velocity.set(150, -150);
			}, this);
		} else {
			alert("You lost, game over!");
			location.reload();
		}
	}
	function ballHitPaddle(ball, paddle) {
		ball.animations.play("spin");
	}