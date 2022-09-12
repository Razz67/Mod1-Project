let canvas = document.getElementById("player1Canvas");
let ctx = canvas.getContext("2d");

let player2Canvas = document.getElementById("player2Canvas");
let ctx2 = player2Canvas.getContext("2d");

let canvasWidth = canvas.width / 2;
let canvasHeight = canvas.height - 30;

let blocks = [];
for (col = 0; col < blockColumnCount; col++) {
	blocks[col] = [];
	for (row = 0; row < blockRowCount; row++) {
		blocks[col][row] = {};
	}
}
