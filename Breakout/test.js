let canvas = document.querySelector(".canvas");
let score = document.querySelector("#score");
let emojiWidth = 100;
let emojiHeight = 20;
let ballDiameter = 20;
let canvasWidth = 600;
let canvasHeight = 400;
let paddleWidth = 100;
let paddleHeight = 20;
let lives = 3;
let xD = canvas.width / 2;
let yD = canvasHeight - 20;

let paddleStart = [230, 10];
let currentPosition = paddleStart;

let ballStart = [270, 40];
let ballCurrentPosition = ballStart;

let timerId;
score = 0;

//my emoji
class Emoji {
	constructor(xD, yD) {
		this.bottomLeft = [xD, yD];
		this.bottomRight = [xD + emojiWidth, yD];
		this.topRight = [xD + emojiWidth, yD + emojiHeight];
		this.topLeft = [xD, yD + emojiHeight];
	}
}

//all emojis
const emojis = [
	new Emoji(50, 290),
	new Emoji(120, 290),
	new Emoji(190, 290),
	new Emoji(260, 290),
	new Emoji(330, 290),
	new Emoji(400, 290),
	new Emoji(470, 290),
	new Emoji(50, 230),
	new Emoji(120, 230),
	new Emoji(190, 230),
	new Emoji(260, 230),
	new Emoji(330, 230),
	new Emoji(400, 230),
	new Emoji(470, 230),
	new Emoji(50, 170),
	new Emoji(120, 170),
	new Emoji(190, 170),
	new Emoji(260, 170),
	new Emoji(330, 170),
	new Emoji(400, 170),
	new Emoji(470, 170),
];

document.addEventListener("keydown", keyDownHandler);

function keyDownHandler(evt) {
	if (evt.keyCode === 39) {
		rightPressed = true;
	} else if (evt.keyCode === 37) {
		leftPressed = true;
	}
}

document.addEventListener("keyup", keyUpHandler);

function keyUpHandler(evt) {
	if (evt.keyCode === 39) {
		rightPressed = false;
	} else if (evt.keyCode === 37) {
		leftPressed = false;
	}
}

//draw my emojis
function addEmojis() {
	for (let i = 0; i < emojis.length; i++) {
		const emoji = document.createElement("div");
		emoji.classList.add("emoji");
		emoji.style.left = emojis[i].bottomLeft[0] + "px";
		emoji.style.bottom = emojis[i].bottomLeft[1] + "px";
		canvas.appendChild(emoji);
		console.log(emojis[i].bottomLeft);
	}
}
addEmojis();

//add paddle
const paddle = document.createElement("div");
paddle.classList.add("paddle");
canvas.appendChild(paddle);
drawPaddle();

//add ball
const ball = document.createElement("div");
ball.classList.add("ball");
canvas.appendChild(ball);
drawBall();

//move paddle
function movePaddle(evt) {
	switch (evt.key) {
		case "ArrowLeft":
			if (currentPosition[0] > 0) {
				currentPosition[0] -= 10;
				console.log(currentPosition[0] > 0);
				drawPaddle();
			}
			break;
		case "ArrowRight":
			if (currentPosition[0] < canvasWidth - emojiWidth) {
				currentPosition[0] += 10;
				console.log(currentPosition[0]);
				drawPaddle();
			}
			break;
	}
}

document.addEventListener("mouseover", movePaddle);

//draw paddle
function drawPaddle() {
	paddle.style.left = currentPosition[0] + "px";
	paddle.style.bottom = currentPosition[1] + "px";
}

//draw Ball
function drawBall() {
	ball.style.left = ballCurrentPosition[0] + "px";
	ball.style.bottom = ballCurrentPosition[1] + "px";
}

//move ball
function moveBall() {
	ballCurrentPosition[0] += xD;
	ballCurrentPosition[1] += yD;
	drawBall();
	checkForCollisions();
}

timerId = setInterval(moveBall, 30);

//check for collisions
function checkForCollisions() {
	for (let i = 0; i < emojis.length; i++) {
		if (
			ballCurrentPosition[0] > emojis[i].bottomLeft[0] &&
			ballCurrentPosition[0] < emojis[i].bottomRight[0] &&
			ballCurrentPosition[1] + ballDiameter > emojis[i].bottomLeft[1] &&
			ballCurrentPosition[1] < emojis[i].topLeft[1]
		) {
			const allemojis = Array.from(document.querySelectorAll(".emoji"));
			allemojis[i].classList.remove("emoji");
			emojis.splice(i, 1);
			changeDirection();
			score++;
			score.innerHTML = score;
			if (emojis.length == 0) {
				score.innerHTML = "You Win!";
				clearInterval(timerId);
                document.location.reload();
				// document.removeEventListener("mouseover", movePaddle);
			}
		}
	}

	// check for wall hits
	if (
		ballCurrentPosition[0] >= canvasWidth - ballDiameter ||
		ballCurrentPosition[0] <= 0 ||
		ballCurrentPosition[1] >= canvasHeight - ballDiameter
	) {
		changeDirection();
	}

	//check for paddle collision
	if (
		ballCurrentPosition[0] > currentPosition[0] &&
		ballCurrentPosition[0] < currentPosition[0] + emojiWidth &&
		ballCurrentPosition[1] > currentPosition[1] &&
		ballCurrentPosition[1] < currentPosition[1] + emojiHeight
	) {
		changeDirection();
	}

	//game over
	if (ballCurrentPosition[1] <= 0) {
		clearInterval(timerId);
		score.innerHTML = "You lose!";
		document.removeEventListener("mouseover", movePaddle);
        replay();
	}
}

// Draw the score
    // score.style.color = "#0095DD";
    // scoreDispley.style.fontSize = "2rem";
    // score.style
    // score.innerHTML = "score" + score, 8, 20;




// replay game
const replay = () => {
    document.location.reload();
}

function changeDirection() {
	if (xD === 2 && yD === 2) {
		yD = -2;
		return;
	}
	if (xD === 2 && yD === -2) {
		xD = -2;
		return;
	}
	if (xD === -2 && yD === -2) {
		yD = 2;
		return;
	}
	if (xD === -2 && yD === 2) {
		xD = 2;
		return;
	}
}

document.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(evt) {
	let xD = evt.clientX - canvas.offsetLeft;
	if (
		xD > 0 + paddleWidth / 2 &&
		xD < canvas.width - paddleWidth / 2
	) {
		paddleX = xD - paddleWidth / 2;
	}
}

// // Display Lives
// function displayLives() {
//     livesDisplay.innerHTML = lives;
//     if (lives <= 0) {
//         livesDisplay.innerHTML = "Game Over";
//         clearInterval(timerId);
//         document.removeEventListener("mousemove", movePaddle);
//     }
// }
// // Restart Game
// function restartGame() {
//     score = 0;
//     score.innerHTML = score;
//     ballCurrentPosition = [50, 50];
//     currentPosition = [50, 10];
//     xD = 2;
//     yD = 2;
//     clearInterval(timerId);
//     timerId = setInterval(moveBall, 30);
//     document.addEventListener("mouseover", movePaddle);
//     addEmojis();
// }
