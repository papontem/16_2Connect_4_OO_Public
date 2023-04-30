// prettier-ignore
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
/**
 * PAM: PART 1 Taking all game functionality into a single game class
 * status: doing ...., done, game runs as first version with all functionality now contained with in a class, moving to part 2
 *
 * PAM: PART 2 Making of a "Start" button
 * 'it should only start the game when this is clicked, and you should be able to click this to restart a new game.'
 * status: doing....
 */
class Game {
	// PAM: making constructor, renaming variables to include this
	constructor(x, y) {
		this.WIDTH = x;
		this.HEIGHT = y;
		this.currPlayer = 1;
		this.board = [];
	}
	// PAM: creating the javascript board in memory
	makeBoard() {
		for (let y = 0; y < this.HEIGHT; y++) {
			this.board.push(Array.from({ length: this.WIDTH }));
		}
	}
	makeHtmlBoard() {
		const board = document.getElementById("board");

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement("tr");
		top.setAttribute("id", "column-top");
		//PAM: making sure that the event listeners are added with the handle click function callback's 'this' value always being the game class instance
		top.addEventListener("click", this.handleClick.bind(this));
		// PAM: make the cells inside the top row
		for (let x = 0; x < this.WIDTH; x++) {
			const headCell = document.createElement("td");
			headCell.setAttribute("id", x);
			top.append(headCell);
		}
		// PAM: finished top row is then placed into our html board, should be visible now
		board.append(top);

		// make main part of html* board

		for (let y = 0; y < this.HEIGHT; y++) {
			const row = document.createElement("tr");

			for (let x = 0; x < this.WIDTH; x++) {
				const cell = document.createElement("td");
				cell.setAttribute("id", `${y}-${x}`);
				row.append(cell);
			}

			board.append(row);
		}
	}
	findSpotForCol(x) {
		for (let y = this.HEIGHT - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}
	placeInTable(y, x) {
		const piece = document.createElement("div");
		piece.classList.add("piece");
		piece.classList.add(`p${this.currPlayer}`);
		piece.style.top = -50 * (y + 2);

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}
	endGame(msg) {
		alert(msg);
	}
	// PAM: TODO: properly binding the value of 'this' within function _win
	// PAM: DONE...
	checkForWin() {
		console.log('TOP CheckForWin (CFW) with "this" as:', this); //PAM : Checking the value of this
		function _win(cells) {
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer
			console.log('Nested _win function with "this" as:', this); //PAM : Checking the value of this
			
			return cells.every(
				([y, x]) =>
				y >= 0 &&
				y < this.HEIGHT &&
				x >= 0 &&
				x < this.WIDTH &&
				this.board[y][x] === this.currPlayer
			);
		}
			
		for (let y = 0; y < this.HEIGHT; y++) {
			console.log('For-loop in CFW with "this" as:', this); //PAM : Checking the value of this
			for (let x = 0; x < this.WIDTH; x++) {
				console.log('Nested for-loop in CFW with "this" as:', this); //PAM : Checking the value of this
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [
					[y, x],
					[y, x + 1],
					[y, x + 2],
					[y, x + 3],
				];
				const vert = [
					[y, x],
					[y + 1, x],
					[y + 2, x],
					[y + 3, x],
				];
				const diagDR = [
					[y, x],
						[y + 1, x + 1],
							[y + 2, x + 2],
								[y + 3, x + 3],
				];
				const diagDL = [
								[y, x],
							[y + 1, x - 1],
						[y + 2, x - 2],
					[y + 3, x - 3],
				];

				// PAM: cosole flags
				console.log('Currently trying to bind the game instance to then call _win');
				
				let _winHoriz = _win.call(this, horiz);
				let _winVert  = _win.call(this,  vert);
				let _winDR    = _win.call(this,diagDR);
				let _winDL    = _win.call(this,diagDL);
				
				//PAM: TESTING
				// console.log('_win.call(this, horiz) = ', _winHoriz);
				// console.log('_win.call(this,  vert) = ', _winVert);
				// console.log('_win.call(this,diagDR) = ', _winDR);
				// console.log('_win.call(this,diagDL) = ', _winDL);

				// find winner (only checking each win-possibility as needed)
				// PAM: has been modified
				if (_winHoriz || _winVert || _winDR || _winDL) {
					return true;
				}
			}
		}
	}
	handleClick(evt) {
		console.log("handle click even with this as:", this); // PAM: checking the value of 'this' making sure its the game instance
		// get x from ID of clicked cell
		const x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);

		// check for win
		// PAM: TODO: resolve TypeError: this.checkForWin() is undefined
		// PAM: done... was using bind instead of call, changed checkForWin() to checkForWin
		if (this.checkForWin.call(this)) {
			return this.endGame(`Player ${this.currPlayer} won!`);
		}

		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) {
			return endGame("Tie!");
		}

		// switch players
		this.currPlayer = this.currPlayer === 1 ? 2 : 1;
	}
	
}

let myGame = new Game(6, 7); // assuming constructor takes height, width
console.log(myGame);
console.log(myGame.makeBoard());
console.log(myGame.board);
console.log(myGame.makeHtmlBoard());

// const WIDTH = 7;
// const HEIGHT = 6;

// let currPlayer = 1; // active player: 1 or 2
// let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

// function makeBoard() {
// 	for (let y = 0; y < HEIGHT; y++) {
// 		board.push(Array.from({ length: WIDTH }));
// 	};
// };

/** makeHtmlBoard: make HTML table and row of column tops. */

// function makeHtmlBoard() {
// 	const board = document.getElementById("board");

// 	// make column tops (clickable area for adding a piece to that column)
// 	const top = document.createElement("tr");
// 	top.setAttribute("id", "column-top");
// 	top.addEventListener("click", handleClick);

// 	for (let x = 0; x < WIDTH; x++) {
// 		const headCell = document.createElement("td");
// 		headCell.setAttribute("id", x);
// 		top.append(headCell);
// 	}

// 	board.append(top);

// 	// make main part of board
// 	for (let y = 0; y < HEIGHT; y++) {
// 		const row = document.createElement("tr");

// 		for (let x = 0; x < WIDTH; x++) {
// 			const cell = document.createElement("td");
// 			cell.setAttribute("id", `${y}-${x}`);
// 			row.append(cell);
// 		}

// 		board.append(row);
// 	}
// }

/** findSpotForCol: given column x, return top empty y (null if filled) */

// function findSpotForCol(x) {
// 	for (let y = HEIGHT - 1; y >= 0; y--) {
// 		if (!board[y][x]) {
// 			return y;
// 		}
// 	}
// 	return null;
// }

/** placeInTable: update DOM to place piece into HTML table of board */

// function placeInTable(y, x) {
// 	const piece = document.createElement("div");
// 	piece.classList.add("piece");
// 	piece.classList.add(`p${currPlayer}`);
// 	piece.style.top = -50 * (y + 2);

// 	const spot = document.getElementById(`${y}-${x}`);
// 	spot.append(piece);
// }

/** endGame: announce game end */

// function endGame(msg) {
// 	alert(msg);
// }

/** handleClick: handle click of column top to play piece */

// function handleClick(evt) {
// 	// get x from ID of clicked cell
// 	const x = +evt.target.id;

// 	// get next spot in column (if none, ignore click)
// 	const y = findSpotForCol(x);
// 	if (y === null) {
// 		return;
// 	}

// 	// place piece in board and add to HTML table
// 	board[y][x] = currPlayer;
// 	placeInTable(y, x);

// 	// check for win
// 	if (checkForWin()) {
// 		return endGame(`Player ${currPlayer} won!`);
// 	}

// 	// check for tie
// 	if (board.every((row) => row.every((cell) => cell))) {
// 		return endGame("Tie!");
// 	}

// 	// switch players
// 	currPlayer = currPlayer === 1 ? 2 : 1;
// }

/** checkForWin: check board cell-by-cell for "does a win start here?" */

// function checkForWin() {
// 	function _win(cells) {
// 		// Check four cells to see if they're all color of current player
// 		//  - cells: list of four (y, x) cells
// 		//  - returns true if all are legal coordinates & all match currPlayer

// 		return cells.every(
// 			([y, x]) =>
// 				y >= 0 &&
// 				y < HEIGHT &&
// 				x >= 0 &&
// 				x < WIDTH &&
// 				board[y][x] === currPlayer
// 		);
// 	}

// 	for (let y = 0; y < HEIGHT; y++) {
// 		for (let x = 0; x < WIDTH; x++) {
// 			// get "check list" of 4 cells (starting here) for each of the different
// 			// ways to win
// 			const horiz = [
// 				[y, x],
// 				[y, x + 1],
// 				[y, x + 2],
// 				[y, x + 3],
// 			];
// 			const vert = [
// 				[y, x],
// 				[y + 1, x],
// 				[y + 2, x],
// 				[y + 3, x],
// 			];
// 			const diagDR = [
// 				[y, x],
// 				[y + 1, x + 1],
// 				[y + 2, x + 2],
// 				[y + 3, x + 3],
// 			];
// 			const diagDL = [
// 				[y, x],
// 				[y + 1, x - 1],
// 				[y + 2, x - 2],
// 				[y + 3, x - 3],
// 			];

// 			// find winner (only checking each win-possibility as needed)
// 			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
// 				return true;
// 			}
// 		}
// 	}
// }

// makeBoard();
// makeHtmlBoard();
