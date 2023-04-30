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
 * status: doing...., done so far... its working... moving to part 3
 *
 * PAM: PART 3 Make Player a Class,
 *  - each instance has a string color name (eg, “orange” or “#F08000”)
 *  - The Game should keep track of the current player object, not the current player number.
 *  - Update the code so that the player pieces are the right color for them, rather than being hardcoded in CSS as red or blue.
 *  - Add a small form to the HTML that lets you enter the colors for the players, so that when you start a new game, it uses these player colors.
 *  - Add a small form to the HTML that lets you enter the colors for the players, so that when you start a new game, it uses these player colors.

 */
// PAM3: TODO: Player class..
// status: doing....
class Player{
	constructor(x){
		this.color = x
	}
}
class Game {
	// PAM1: making constructor, renaming variables to include this
	constructor(x, y, p1, p2) {
		this.WIDTH = x;
		this.HEIGHT = y;
		// PAM3: saving possible players in an array
		this.players = [p1, p2];
		// PAM3: setting currplayer as the player at the start of players array
		this.currPlayer = this.players[0];
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
		//PAM1: making sure that the event listeners are added with the handle click function callback's 'this' value always being the game class instance
		top.addEventListener("click", this.handleClick.bind(this));
		// PAM: make the cells inside the top row
		for (let x = 0; x < this.WIDTH; x++) {
			const headCell = document.createElement("td");
			headCell.setAttribute("id", x);
			top.append(headCell);
		}
		// PAM1: finished top row is then placed into our html board, should be visible now
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
		piece.classList.add(`${this.currPlayer.color}`);
		piece.style.top = -50 * (y + 2);
		piece.style.backgroundColor = this.currPlayer.color;
		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}
	endGame(msg) {
		alert(msg);
	}
	checkForWin() {
		// console.log('TOP CheckForWin (CFW) with "this" as:', this); //PAM : Checking the value of this
		function _win(cells) {
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer
			// console.log('Nested _win function with "this" as:', this); //PAM1: Checking the value of this

			return cells.every(
				([y, x]) =>
					y >= 0 &&
					y < this.HEIGHT &&
					x >= 0 &&
					x < this.WIDTH &&
					this.board[y][x] === this.currPlayer.color
			);
		}

		for (let y = 0; y < this.HEIGHT; y++) {
			// console.log('For-loop in CFW with "this" as:', this); //PAM : Checking the value of this
			for (let x = 0; x < this.WIDTH; x++) {
				// console.log('Nested for-loop in CFW with "this" as:', this); //PAM1: Checking the value of this
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

				// PAM1: cosole flags
				// console.log('Currently trying to bind the game instance to then call _win');

				let _winHoriz = _win.call(this, horiz);
				let _winVert = _win.call(this, vert);
				let _winDR = _win.call(this, diagDR);
				let _winDL = _win.call(this, diagDL);

				//PAM: TESTING
				// console.log('_winHoriz = ', _winHoriz);
				// console.log('_winVert = ', _winVert);
				// console.log('_winDR = ', _winDR);
				// console.log('_winDL = ', _winDL);

				// find winner (only checking each win-possibility as needed)
				// PAM1: has been modified
				if (_winHoriz || _winVert || _winDR || _winDL) {
					return true;
				}
			}
		}
	}
	handleClick(evt) {
		// console.log("handle click even with this as:", this); // PAM1: checking the value of 'this' making sure its the game instance
		// get x from ID of clicked cell
		const x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer.color;
		this.placeInTable(y, x);

		// check for win
		if (this.checkForWin.call(this)) {
			return this.endGame(`Player ${this.currPlayer.color} won!`);
		}

		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) {
			// PAM3: forgot this, pun unintended
			return this.endGame("Tie!");
		}

		// switch players
		this.currPlayer =
			this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
	}
}
let isGameInstanceRunning = false;
let startButton = document.getElementById("start_Button");
let myGame;
let player1;
let player2;
startButton.addEventListener("click", start_restart_Game);
// console.log("Our Start Button:", startButton);

// PAM2: start/restart button functionality.....
function start_restart_Game() {
	if (isGameInstanceRunning == false) {
		isGameInstanceRunning = true;
		this.innerText = "Restart";
		//create the players, get their colors from the html form
		let p1ColorChoice = document.getElementById("player1ColorChoice").value;
		let p2ColorChoice = document.getElementById("player2ColorChoice").value;
		player1 = new Player(p1ColorChoice);
		player2 = new Player(p2ColorChoice);
		//PAM2: create the game and the boards
		myGame = new Game(6, 7, player1, player2); // assuming constructor takes height, width, and that players are already build
		myGame.makeBoard();
		myGame.makeHtmlBoard();

		// console.log("My Game Instance:", myGame);
		// console.log("My Game Intance's Board:", myGame.board);
	} else {
		//PAM2: reset the games board
		let htmlGameBoard = document.getElementById("board");
		htmlGameBoard.innerHTML = "";
		myGame = undefined;
		player1 = undefined;
		player2 = undefined;
		isGameInstanceRunning = false;
		this.innerText = "Start The Game";
	}
}

// PAM1: Everything bellow this was provided code:

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
