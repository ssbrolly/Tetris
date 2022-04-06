const grid = document.querySelector('.grid');

for (let i = 0; i < 200; i++) {
	let html = `
    <div>${i}</div>    
    `;
	grid.insertAdjacentHTML('afterbegin', html);
}

let squares = [...document.querySelectorAll('.grid div')];
const scoreDisplay = document.querySelector('#score');
const startButton = document.querySelector('#start-button');
const width = 10;

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

draw();

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
		random = Math.trunc(Math.random() * theTetrominoes.length);
		current = theTetrominoes[random][currentRotation];
		currentPosition = 4;
		draw();
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

	if (currentRotation >= 3) {
		currentRotation = 0;
	} else {
		currentRotation += 1;
	}
	console.log(currentRotation);
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
