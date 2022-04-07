const grid = document.querySelector('.grid');
const miniGrid = document.querySelector('.mini-grid');

const scoreDisplay = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

let timerId;
let score = 0;

for (let i = 0; i < 200; i++) {
	let html = `
    <div>${i}</div>    
    `;
	grid.insertAdjacentHTML('afterbegin', html);
}

for (let i = 0; i < 16; i++) {
	let html = `
        <div></div>
    `;

	miniGrid.insertAdjacentHTML('afterbegin', html);
}

// The Main Display
let squares = [...document.querySelectorAll('.grid div')];
const width = 10;
let nextRandom = 0;

// The Tetriminoes
const lTetromino = [
	[1, width + 1, width * 2 + 1, 2],
	[width, width + 1, width + 2, width * 2 + 2],
	[1, width + 1, width * 2 + 1, width * 2],
	[width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
	[0, width, width + 1, width * 2 + 1],
	[width + 1, width + 2, width * 2, width * 2 + 1],
	[0, width, width + 1, width * 2 + 1],
	[width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
	[1, width, width + 1, width + 2],
	[1, width + 1, width + 2, width * 2 + 1],
	[width, width + 1, width + 2, width * 2 + 1],
	[1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
	[0, 1, width, width + 1],
	[0, 1, width, width + 1],
	[0, 1, width, width + 1],
	[0, 1, width, width + 1],
];

const iTetromino = [
	[1, width + 1, width * 2 + 1, width * 3 + 1],
	[width, width + 1, width + 2, width + 3],
	[1, width + 1, width * 2 + 1, width * 3 + 1],
	[width, width + 1, width + 2, width + 3],
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let random = Math.trunc(Math.random() * theTetrominoes.length);

let currentPosition = 4;
let currentRotation = 0;

let current = theTetrominoes[random][currentRotation];

// Draw the first rotation in the first tetrimino
const draw = function () {
	current.forEach(index => {
		squares[currentPosition + index].classList.add('tetrimino');
	});
};

// draw();

// Undraw the tetrimino
const undraw = function () {
	current.forEach(index => {
		squares[currentPosition + index].classList.remove('tetrimino');
	});
};

// Move down function
const moveDown = function () {
	undraw();
	currentPosition += width;
	draw();
	freeze();
};

// Freeze function
const freeze = function () {
	if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
		current.forEach(index => squares[currentPosition + index].classList.add('taken'));
		random = nextRandom;
		nextRandom = Math.trunc(Math.random() * theTetrominoes.length);
		current = theTetrominoes[random][currentRotation];
		currentPosition = 4;
		draw();
		displayShape();
		addScore();
	}
};

// Make the Tetrino move down
// timerId = setInterval(moveDown, 500);

// Move left function
const moveLeft = function () {
	undraw();
	const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

	if (!isAtLeftEdge) currentPosition -= 1;

	if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition += 1;
	draw();
};

// Move Right function
const moveRight = function () {
	undraw();
	const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

	if (!isAtRightEdge) currentPosition += 1;

	if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition -= 1;

	draw();
};

// Rotate function
const rotate = function () {
	undraw();

	if (currentRotation === current.lenth) {
		currentRotation = 0;
	} else {
		currentRotation++;
	}

	current = theTetrominoes[random][currentRotation];
	draw();
};

// Control function
const control = function (e) {
	if (e.key === 'ArrowLeft') {
		moveLeft();
	} else if (e.key === 'ArrowRight') {
		moveRight();
	} else if (e.key === 'ArrowDown') {
		moveDown();
	} else if (e.key === 'ArrowUp') {
		rotate();
	}
};

// Keypress event
document.addEventListener('keydown', control);

// The mini Display

let displaySquares = [...document.querySelectorAll('.mini-grid div')];
const displayWidth = 4;
let displayIndex = 0;

const nextUpTertrominoes = [
	[1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
	[0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
	[1, displayWidth, displayWidth + 1, displayWidth + 2], // tetrimino
	[0, 1, displayWidth, displayWidth + 1], // oTetromino
	[1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
];

// display the shape in the mini display
const displayShape = function () {
	displaySquares.forEach(square => {
		square.classList.remove('tetrimino');
	});

	nextUpTertrominoes[nextRandom].forEach(index => {
		displaySquares[displayIndex + index].classList.add('tetrimino');
	});
};

// add functionality to the button
startButton.addEventListener('click', () => {
	if (timerId) {
		clearInterval(timerId);
		timerId = null;
	} else {
		draw();
		timerId = setInterval(moveDown, 1000);
		nextRandom = Math.trunc(Math.random() * theTetrominoes.length);
		displayShape();
	}
});

// add score
const addScore = function () {
	for (i = 0; i < 199; i += width) {
		const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

		if (row.every(index => squares[index].classList.contains('taken'))) {
			score += 10;
			scoreDisplay.innerHTML = score;
			row.forEach(index => {
				squares[index].classList.remove('taken');
			});

			const squaresRemoved = squares.splice(i, width);
		}
	}
};
