var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;

var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var emojiRowCount = 3;
var emojiColumnCount = 5;
var emojiWidth = 75;
var emojiHeight = 20;
var emojiPadding = 10;
var emojiTopOffset = 30;
var emojiLeftOffset = 125
var score = 0;
var lives = 3;
let level = 1;

class Emoji {
    constructor(x, y, status) {
        this.x = x;
        this.y = y;
        this.status = status;
    }

    explode() {
}
};

let emojis =  [];
emojis = new Emoji(50, 270, 1);
for (c = 0; c < emojiColumnCount; c++) {
	emojis[c] = [];
	for (r = 0; r < emojiRowCount; r++) {
		emojis[c][r] = {
			x: 0,
			y: 0,
			status: 1,
		};
	}
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
	if (e.keyCode === 39) {
		rightPressed = true;
	} else if (e.keyCode === 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode === 39) {
		rightPressed = false;
	} else if (e.keyCode === 37) {
		leftPressed = false;
	}
}

function drawBricks() {
	for (c = 0; c < emojiColumnCount; c++) {
		for (r = 0; r < emojiRowCount; r++) {
			if (emojis[c][r].status === 1) {
				var brickX = c * (emojiWidth + emojiPadding) + emojiLeftOffset;
				var brickY = r * (emojiHeight + emojiPadding) + emojiTopOffset;
				emojis[c][r].x = brickX;
				emojis[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, emojiWidth, emojiHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath(); // ball is drawn
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function collisionDetection() {
	for (c = 0; c < emojiColumnCount; c++) {
		for (r = 0; r < emojiRowCount; r++) {
			var b = emojis[c][r];
			if (b.status === 1) {
				if (
					x > b.x &&
					x < b.x + emojiWidth &&
					y > b.y &&
					y < b.y + emojiHeight
				) {
					dy = -dy;
					b.status = 0;
					score++;
					if (score === emojiRowCount * emojiColumnCount) {
						alert("YOU WIN!");
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "0095DD";
	ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "0095DD";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawLevels() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "0095DD";
    ctx.fillText("Level: " + level, canvas.width - 65, 40);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
    drawLevels();
	collisionDetection();

	if (y + dy < ballRadius) {
		//bouncing off top and bottom of canvas
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			lives--;
			if (!lives) {
				alert("GAME OVER");
				document.location.reload();
			} else {
				x = canvas.width / 2;
				y = canvas.height - 30;
				dx = 2;
				dy = -2;
				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}
	}
	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}

	x += dx;
	y += dy;
	requestAnimationFrame(draw);
}
document.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if (
		relativeX > 0 + paddleWidth / 2 &&
		relativeX < canvas.width - paddleWidth / 2
	) {
		paddleX = relativeX - paddleWidth / 2;
	}
}
draw();
