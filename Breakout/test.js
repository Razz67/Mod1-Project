const canvas = document.getElementById('breakout');
const ctx = canvas.getContext('2d');
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler)

let game = {    
    requestId: null,
    timeoutId: null,
    leftKey: false,
    rightKey: false,
    on: false,
}

let paddle = {
    height: 50,
    width: 100,
    get y() { 
		return canvas.height - this.height; 
	}
}
let ball = {
    radius: 10
};
let block = {
    rows: 5,
    cols: 10,
    get width() { return canvas.width / this.cols; },
    height: 30
}
let images = {
    background: new Image(),
    ball: new Image(),
    paddle: new Image()
}
function onImageLoad(evt) {
    resetGame();
    createblocks();
    resetPaddle();
    paint();
    ctx.font = '50px ArcadeClassic';
    ctx.fillStyle = 'lime';
    ctx.fillText('PRESS START', canvas.width / 2 - 120, canvas.height / 2);
};
images.background.addEventListener('load', onImageLoad);
images.background.src = './images/background2.png';
images.ball.src = './images/ball.png';
images.paddle.src = './images/paddle.png';

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
    game.time = { start: performance.now(), elapsed: 0, refreshRate: 16  };
}


function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - paddle.height - 2 * ball.radius;
    ball.dx = game.speed * (Math.random() * 2 - 1);  // Random trajectory
    ball.dy = -game.speed; // Up
}

function resetPaddle() {
    paddle.x = (canvas.width - paddle.width) / 2;
    paddle.dx = game.speed + 7;
}

function createblocks() {
    blockItems = [];
    const topMargin = 30;
    const colors = ['red', 'orange', 'yellow', 'blue', 'green'];
	const blockImages = [images.block.src = './images/block.png', images.destroyed.src = './images/destroyed.png'];

    for(let row = 0; row < block.rows; row++) {
        for(let col = 0; col < block.cols; col++) {
            blockItems.push({
                x: col * block.width,
                y: row * block.height + topMargin,
                height: block.height,
                width: block.width,
                color: colors[row],
				image: blockImages[row],
                points: (5 - row) * 2,
                hitsLeft: row === 0 ? 2 : 1
            });
        }
    }
}

function animate(now = 0) { 
    game.time.elapsed = now - game.time.start;
    if (game.time.elapsed > game.time.refreshRate) {
        game.time.start = now;

        paint();
        update();
        detectCollision();
        detectBlockCollision();
    
        if (levelCompleted() || gameOver()) return;
    }    

    game.requestId = requestAnimationFrame(animate);
}

function paint() {
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.ball, ball.x, ball.y, 2 * ball.radius, 2 * ball.radius);
    ctx.drawImage(images.paddle, paddle.x, paddle.y, paddle.width, paddle.height);
    drawBlocks();
    drawScore();
    drawLives();
}

function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (game.rightKey) {
        paddle.x += paddle.dx;
        if (paddle.x + paddle.width > canvas.width){
            paddle.x = canvas.width - paddle.width;
        }
    }
    if (game.leftKey) {
        paddle.x -= paddle.dx;
        if (paddle.x < 0){
            paddle.x = 0;
        }
    }
}

function drawBlocks() {
    blockItems.forEach((block) => {
      if (block.hitsLeft) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
        ctx.strokeRect(block.x, block.y, block.width, block.height);
      }
    });
  }

function drawScore() {
    ctx.font = '24px ArcadeClassic';
    ctx. fillStyle = 'white';
    const { level, score } = game;
    ctx.fillText(`Level: ${level}`, 5, 23);
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, 23);
}

function drawLives() {
    if (game.lives > 2) { ctx.drawImage(images.paddle, canvas.width - 150, 9, 40, 13); }
    if (game.lives > 1) { ctx.drawImage(images.paddle, canvas.width - 100, 9, 40, 13); }
    if (game.lives > 0) { ctx.drawImage(images.paddle, canvas.width - 50, 9, 40, 13); }
}

function detectCollision() {
    const hitTop = () => ball.y < 0;
    const hitLeftWall = () => ball.x < 0;
    const hitRightWall = () => ball.x + ball.radius * 2 > canvas.width;
    const hitPaddle = () => 
        ball.y + 2 * ball.radius > canvas.height - paddle.height &&
        ball.y + ball.radius < canvas.height && 
        ball.x + ball.radius > paddle.x &&
        ball.x + ball.radius < paddle.x + paddle.width;

    if (hitLeftWall()) {
        ball.dx = -ball.dx;
        ball.x = 0;
    }        
    if (hitRightWall()) {
        ball.dx = -ball.dx;
        ball.x = canvas.width - 2 * ball.radius;
    }
    if (hitTop()) {
        ball.dy = -ball.dy;
        ball.y = 0;
    }
    if (hitPaddle()) {
        ball.dy = -ball.dy;
        ball.y = canvas.height - paddle.height - 2 * ball.radius;
        game.sfx && sounds.paddle.play();
        // TODO change this logic to angles with sin/cos
        // Change x depending on where on the paddle the ball bounces.
        // Bouncing ball more on one side draws ball a little to that side.
        const drawingConst = 5
        const paddleMiddle = 2;
        const algo = (((ball.x - paddle.x) / paddle.width) * drawingConst);
        ball.dx = ball.dx + algo - paddleMiddle;
    }
}

function detectBlockCollision() {
    let changeDirection = false;
    const insideBlock = (block) => 
        ball.x + 2 * ball.radius > block.x &&
        ball.x < block.x + block.width && 
        ball.y + 2 * ball.radius > block.y && 
        ball.y < block.y + block.height;
  
    blockItems.forEach((block) => {
        if (block.hitsLeft && insideBlock(block)) {
            sounds.block.currentTime = 0;
            game.sfx && sounds.block.play();
            block.hitsLeft--;
            if (block.hitsLeft === 1) {
                block.color = 'darkgray';
            }
            game.score += block.points;
    
            if (!changeDirection) {
                changeDirection = true;
                detectCollisionDirection(block);
            }
        }
    });
}

function detectCollisionDirection(block) {
    const hitFromLeft = () => ball.x + 2 * ball.radius - ball.dx <= block.x;
    const hitFromRight = () => ball.x - ball.dx >= block.x + block.width;

    if (hitFromLeft() || hitFromRight()) {
      ball.dx = -ball.dx;
    } else { // Hit from above or below
      ball.dy = -ball.dy;
    }
}

function keyDownHandler(evt) {
    if (!game.on && evt.key === ' ') {
        play();
    }
    if (game.on && (evt.key === 'm' || evt.key === 'M')) {
        game.music = !game.music;
        game.music ? sounds.music.play() : sounds.music.pause();
    }
    if (game.on && (evt.key === 's' || evt.key === 'S')) {
        game.sfx = !game.sfx;
    }
    if (evt.key === 'ArrowUp') {
        volumeUp();
    }
    if (evt.key === 'ArrowDown') {
        volumeDown();
    }
    if (evt.key === 'ArrowRight') {
        game.rightKey = true;
    } else if (evt.key === 'ArrowLeft') {
        game.leftKey = true;
    }
}

function keyUpHandler(evt) {
    if (evt.key === 'ArrowRight') {
        game.rightKey = false;
    } else if (evt.key === 'ArrowLeft') {
        game.leftKey = false;
    }
}

function mouseMoveHandler(evt) {
    const mouseX = evt.clientX - canvas.offsetLeft;    
    const isInsideCourt = () => mouseX > 0 && mouseX < canvas.width;

    if(isInsideCourt()) {
        paddle.x = mouseX - paddle.width / 2;
    }
}

function levelCompleted() {
    const levelComplete = blockItems.every((b) => b.hitsLeft === 0);

    if (levelComplete) {
        initNextLevel();
        resetBall();
        resetPaddle();
        createblocks();
        game.timeoutId = setTimeout(() => {
            animate();
            sounds.music.play();
        }, 3000);

        return true;
    }
    return false;
}

function initNextLevel() {
    game.level++;
    game.speed++;
    sounds.music.pause();
    game.sfx && sounds.levelCompleted.play();
    ctx.font = '50px ArcadeClassic';
    ctx.fillStyle = 'yellow';
    ctx.fillText(`LEVEL ${game.level}!`, canvas.width / 2 - 80, canvas.height / 2);
}

function gameOver() {
    const isBallLost = () => ball.y - ball.radius > canvas.height;

    if (isBallLost()) {
        game.lives -= 1;
        game.sfx && sounds.ballLost.play();
        if (game.lives === 0) {
            gameOver();
            return true;
        }
        resetBall();
        resetPaddle();
    }
    return false;
}

function gameOver() {
    game.on = false;
    sounds.music.pause();
    sounds.currentTime = 0;
    game.sfx && sounds.gameOver.play();
    ctx.font = '50px ArcadeClassic';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);
}




