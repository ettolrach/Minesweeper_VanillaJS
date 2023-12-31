import { Space } from "./space.js";
import { Contents } from "./contents.js";
import { GameState } from "./gameState.js";
import { Flag } from "./flag.js";

// Use the Fisher-Yates shuffle algorithm, minorly modified from the implementation available at https://github.com/Daplie/knuth-shuffle . Licensed under the Apache License 2.0 available at http://www.apache.org/licenses/ .
function Shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

export class Grid {
	constructor(width, height) {
		this.Width = width;
		this.Height = height;
		this.FirstMove = true;
		this.State = GameState.InProgress;

		const container = document.getElementById("gameContainer");
		// If there are already spaces in the grid, get rid of them.
		container.textContent = "";

		this.Spaces = [];

		// Make the grid in CSS as wide and tall as the game grid should be.
		container.style.setProperty("--gridColumns", width);
		container.style.setProperty("--gridRows", height);

		// Add as many spaces as required.
		let minesNumber = 0;
		for (let i = 0; i < width * height; i++) {
			// Decide whether this space should be a mine or not.
			// Let the initial probability of the space being a mine be 1/6.
			// Then, unless there's too many mines, then make it a mine.
			// In other words, if 1/4 of the board is filled with mines, then don't add any more;
			// otherwise, make it an empty space.
			if(Math.floor(Math.random()*6) == 0 && minesNumber <= (width * height) / 4) {
				this.Spaces.push(new Space(false, Contents.Mine, `space${i}`));
				minesNumber++;
			}
			else {
				this.Spaces.push(new Space(false, Contents.Empty, `space${i}`));
			}

		}
		// Shuffle the array to make sure that the mines are spread evenly.
		this.Spaces = Shuffle(this.Spaces);
	}
	GetIndex(x, y) {
		return x + this.Width * y;
	}
	GetIndexFromArr(arr) {
		return arr[0] + this.Width * arr[1];
	}
	GetCoordinates(index) {
		return [index % this.Width, Math.floor(index / this.Width)];
	}
	InBoundsArr([a, b]) {
		return a >= 0 && b >= 0 && a < this.Width && b < this.Height;
	}
	NeighboursInBounds(index) {
		let [x, y] = this.GetCoordinates(index);
		let neighbours = [
			[x + 1, y],
			[x + 1, y + 1],
			[x, y + 1],
			[x - 1, y + 1],
			[x - 1, y],
			[x - 1, y - 1],
			[x, y - 1],
			[x + 1, y - 1],
		];
		return neighbours
			.filter(neighbour => this.InBoundsArr(neighbour))
			.map(arr => this.GetIndexFromArr(arr));
	}
	CountNeighbouringMines(index) {
		return this.NeighboursInBounds(index)
			.map(i => this.Spaces[i].Contents)
			.filter(content => content == Contents.Mine)
			.length;
	}
	FloodUncover(index) {
		if (this.Spaces[index].Revealed) {
			return;
		}
		switch (this.Spaces[index].Contents) {
			case Contents.Mine:
				this.State = GameState.Loss;
				break;
			case Contents.Num:
				this.Spaces[index].Reveal();
				break;
			case Contents.Empty:
				this.Spaces[index].Reveal();
				// Go clockwise around the current space revealing all adjacent ones.
				for (const neighbour of this.NeighboursInBounds(index)) {
					this.FloodUncover(neighbour);
				}
				break;
			default:
				console.error(`Switch not exhaustive! Tried to switch on: ${this.Spaces[index].Contents}`);
				break;
		}
	}
	AllUncovered() {
		return this.Spaces
			.every(space => space.Revealed)
	}
	CoveredSpaces() {
		return this.Spaces
			.filter(space => !space.Revealed)
	}
	ShowAll() {
		for (let i = 0; i < this.Spaces.length; i++) {
			this.Spaces[i].Reveal();
		}
	}
	Clicked(index) {
		if(this.FirstMove == true) {
			this.FirstMove = false;
			// Make sure that the first move is not a mine and has no mines around it.
			this.Spaces[index].ChangeContents(Contents.Empty);
			let neighbours = this.NeighboursInBounds(index);
			for (const i of this.NeighboursInBounds(index)) {
				this.Spaces[i].ChangeContents(Contents.Empty);
			}
			// Fill the board with numbers.
			for (let j = 0; j < this.Spaces.length; j++) {
				// If the current space is a mine, then there's no need to put on a number.
				if (this.Spaces[j].Contents == Contents.Mine) {
					continue;
				}
				let numberToDisplay = this.CountNeighbouringMines(j);
				if (numberToDisplay != 0) {
					this.Spaces[j].SetNumber(numberToDisplay);
				}
			}
		}

		// Start the recursive flood uncover.
		// This WILL turn the game state to loss if a mine was revealed.
		this.FloodUncover(index);
		// Check if the game is lost.
		if (this.State == GameState.Loss) {
			// TODO end the game with a loss.
			document.getElementById("subtitle").innerText = "You lose!";
			document.getElementById("subtitle").style.color = "red";
			document.getElementById("retry").style.display = "block";
			this.ShowAll();
		}
		// If only mines aren't revealed yet, then the game is won.
		else if (this.CoveredSpaces().every(space => space.Contents == Contents.Mine)) {
			this.State == GameState.Win;
			document.getElementById("subtitle").innerText = "You win!";
			document.getElementById("subtitle").style.color = "green";
			document.getElementById("retry").style.display = "block";
			this.ShowAll()
		}
	}
	PlaceFlag(index) {
		if (this.Spaces[index].Revealed) {
			return;
		}
		switch (this.Spaces[index].Flag) {
			case Flag.Nothing:
				document.getElementById(this.Spaces[index].ID).innerHTML = "<img src='media/flag.svg' style='width:65%;'>";
				this.Spaces[index].ChangeFlag(Flag.Flag);
				break;
			case Flag.Flag:
				document.getElementById(this.Spaces[index].ID).innerHTML = "<p style='color: lightblue; padding: 0; margin: 0;'>?</p>";
				this.Spaces[index].ChangeFlag(Flag.QuestionMark);
				break;
			case Flag.QuestionMark:
				document.getElementById(this.Spaces[index].ID).innerHTML = "";
				this.Spaces[index].ChangeFlag(Flag.Nothing);
				break;
			default:
				console.error(`Switch not exhaustive! Tried to switch on: ${this.Spaces[index].Flag}`);
				break;
		}
	}
}
