const canvas = document.querySelector(".canvas");

let score = 0;

const scoreDisplay = document.querySelector('#score');

const canvasWidth = 540;
const canvasHeight = 480;
const emojiWidth = 50;
const emojiHeight = 50;

// paddle starting position
paddleWidth = 100;
paddleHeight = 40;
let paddleX = (canvasWidth - paddleWidth) / 2;
const paddleStart = [230, 5];
let currentPosition = paddleStart;


// Ball starting position
let ballSpeed;
let ballDiameter = 50;
const ballStart = [260, 40];
let ballCurrentPosition = ballStart;

let xD = -2;
let yD = 2;

// Create emoji class
class Emoji {
	constructor(xD, yD) {
		// determine emoji position based on x and y axis
		this.bottomLeft = [xD, yD]; // xD and yD are the x and y axis
		this.bottomRight = [xD + emojiWidth, yD];
		this.topLeft = [xD, yD + emojiHeight];
		this.topRight = [xD + emojiWidth, yD + emojiHeight];
	}
}

// Create an array of emojis
const emojis = [
	new Emoji(20, 400),
	new Emoji(20, 345),
	new Emoji(20, 290),
	new Emoji(75, 400),
	new Emoji(75, 345),
	new Emoji(75, 290),
	new Emoji(130, 400),
	new Emoji(130, 345),
	new Emoji(130, 290),
	new Emoji(185, 400),
	new Emoji(185, 345),
	new Emoji(185, 290),
	new Emoji(240, 400),
	new Emoji(240, 345),
	new Emoji(240, 290),
	new Emoji(295, 400),
	new Emoji(295, 345),
	new Emoji(295, 290),
	new Emoji(350, 400),
	new Emoji(350, 345),
	new Emoji(350, 290),
	new Emoji(405, 400),
	new Emoji(405, 345),
	new Emoji(405, 290),
	new Emoji(460, 400),
	new Emoji(460, 345),
	new Emoji(460, 290),
	// new Emoji(240, 220),
	// new Emoji(240, 170),
	// new Emoji(240, 120),
];

// create emojis
function drawEmojis() {
	for (let i = 0; i < emojis.length; i++) {
		//Create a div element for each cell in the grid
		const emoji = document.createElement("div");
		emoji.classList.add("emoji");
		emoji.style.left = emojis[i].bottomLeft[0] + "px";
		emoji.style.bottom = emojis[i].bottomLeft[1] + "px";
		canvas.appendChild(emoji);
	}
}

drawEmojis();

// Draw the ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + "px";
	ball.style.bottom = ballCurrentPosition[1] + "px";

}

// Create paddle
paddle = document.createElement("div");
paddle.classList.add("paddle");
paddle.style.left = currentPosition[0] + "px";
paddle.style.bottom = currentPosition[1] + "px";
canvas.appendChild(paddle);

// Move paddle
document.addEventListener("mousemove", onMouseMove);

function onMouseMove(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0  +  paddleWidth / 2 && relativeX < canvasWidth - paddleWidth / 2) {
       paddleX = relativeX - paddleWidth / 2;
    }
}



// Create ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
canvas.appendChild(ball);


// Move ball
function moveBall() {
    ballCurrentPosition[0] += xD;
    ballCurrentPosition[1] += yD;
    drawBall();
    checkCollisions();
}

ballSpeed = setInterval(moveBall, 1);

// Check for collisions
function checkCollisions() {
    // Wall Collisions
    if (ballCurrentPosition[0] >= (canvasWidth - ballDiameter) || 
    ballCurrentPosition[1] >= (canvasHeight - ballDiameter) ||
    ballCurrentPosition[0] <= 0) {
        changeDirection();
    }

    // Emoji Collisions
    for (let i = 0; i < emojis.length; i++) {
        




         // Game Over
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(ballSpeed);
        scoreDisplay.innerHTML = "Game Over";
        document.removeEventListener("mousemove", onMouseMove);
    }
}
           

// Change ball direction
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