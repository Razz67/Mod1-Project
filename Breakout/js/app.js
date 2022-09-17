const canvas = document.querySelector(".canvas");
const emojiWidth = 50;
const emojiHeight = 50;

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
	new Emoji(20, 290),
	new Emoji(20, 240),
	new Emoji(20, 190),
	new Emoji(75, 290),
	new Emoji(75, 240),
	new Emoji(75, 190),
	new Emoji(130, 290),
	new Emoji(130, 240),
	new Emoji(130, 190),
	new Emoji(185, 290),
	new Emoji(185, 240),
	new Emoji(185, 190),
	new Emoji(240, 290),
	new Emoji(240, 240),
	new Emoji(240, 190),
	new Emoji(295, 290),
	new Emoji(295, 240),
	new Emoji(295, 190),
	new Emoji(350, 290),
	new Emoji(350, 240),
	new Emoji(350, 190),
	new Emoji(405, 290),
	new Emoji(405, 240),
	new Emoji(405, 190),
	new Emoji(460, 290),
	new Emoji(460, 240),
	new Emoji(460, 190),
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
