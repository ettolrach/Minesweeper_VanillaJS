class Space {
	constructor(revealed = false, contentsToGive = " ", id = "spaceXXX", flag = "") {
		this.Revealed = revealed;
		// The contents can either be " " or "M" which stand for an empty space and a mine respectively.
		this.Contents = contentsToGive;
		this.ID = id;
		this.Flag = flag;
	}

	Reveal() {
		this.Revealed = true;
		let spaceToChange = document.getElementById(this.ID);
		if(this.Contents == "M") {
			spaceToChange.innerHTML = "<img src='mine.svg' style='width:95%'>";
		}
		else {
			spaceToChange.innerText = this.Contents;
		}
		spaceToChange.style.backgroundColor = "#333";
		spaceToChange.classList.add("activated");
	}

	ChangeID(newId) {
		this.ID = newId;
	}

	ChangeContents(newContents) {
		this.Contents = newContents;
	}
	ChangeFlag(newFlag) {
		this.Flag = newFlag;
	}
}

function InitialiseGrid(columns, rows) {
	// If there are already spaces in the grid, get rid of them.
	container.textContent = "";

	// Make a list of Space objects that will be returned at the end.
	spacesToReturn = [];

	// Make the grid now as wide and tall as the game grid should be. This is done by changing the variables declared in the CSS.
	container.style.setProperty("--gridColumns", columns);
	container.style.setProperty("--gridRows", rows);

	// Add as many spaces as required.
	// Keep a running total of the number of mines.
	minesNumber = 0;
	// Make a 2D list, so this outer loop is for the rows.
	for (let currentRow = 0; currentRow < rows; currentRow++) {
		let rowToAppend = [];
		for (let currentColumn = 0; currentColumn < columns; currentColumn++) {
			// Decide whether this space should be a mine or not. Let the initial probability of the space being a mine be 1/4. Then, if there's not already too many mines, then make it a mine (in other words, if 1/3 of the board is filled with mines, then don't add any more). Otherwise, make it an empty space.
			if(Math.floor(Math.random()*4) == 0 && minesNumber <= columns*rows/3) {
				rowToAppend.push(new Space(false, "M"));
				minesNumber++;
			}
			else {
				rowToAppend.push(new Space(false, " "));
			}
		}
		
		spacesToReturn.push(rowToAppend);
	}

	// Shuffle the array to make sure that the mines are spread evenly.
	spacesToReturn = Shuffle(spacesToReturn);

	return spacesToReturn;
}

function IsMine(spaces, x, y, columns, rows) {
	if (x < 0 || y < 0) return;
	if (x >= columns || y >= rows) return;
	if (spaces[y][x].Contents == "M") {
		return true;
	}
	else {
		return false;
	}

}

function AddToGrid(spacesToAdd, columns, rows) {
	for (let currentRow = 0; currentRow < rows; currentRow++) {
		for (let currentColumn = 0; currentColumn < columns; currentColumn++) {
			// The ID that'll be applied to the HTML element.
			let newId = "space" + String(currentRow * columns + currentColumn);

			// Change the ID of the current space object to the correct new ID.
			// The reason why the ID is set now and not earlier is that the fields are shuffled, so the correct number for the ID is different from before the shuffle.
			spacesToAdd[currentRow][currentColumn].ChangeID(newId);

			// Create a new space.
			let currentSpaceHTML = document.createElement("div");
			// Make its inner text be nothing for now, this will be changed to either be blank, a number, a flag, a question mark, or a mine later on.
			currentSpaceHTML.innerText = ("");
			currentSpaceHTML.id = newId;
			// Change the style to an unrevealed space. 
			currentSpaceHTML.style.backgroundColor = "#555";

			// Actually append this created space onto the grid.
			container.appendChild(currentSpaceHTML).className = "spaces";
		
			// Add an event listener to trigger the appropriate function to reveal the space.
			currentSpaceHTML.addEventListener("click", () => {SpaceClick(spacesToAdd, currentColumn, currentRow, columns, rows)});
			// Also add one to prevent the user from right-clicking (instead a mine will be set).
			currentSpaceHTML.addEventListener("contextmenu", e => {PlaceFlag(spacesToAdd, currentColumn, currentRow, columns, rows); e.preventDefault()});
			// Prevent the the context menu from appearing when the background of the grid is clicked.
			document.getElementById("gameContainer").addEventListener("contextmenu", e => {e.preventDefault()});
		}
	}
}

function PlaceFlag(spaces, x, y, columns, rows) {
	if (spaces[y][x].Revealed == true) return;
	switch (spaces[y][x].Flag) {
		case "":
			document.getElementById(spaces[y][x].ID).innerHTML = "<img src='flag.svg' style='width:65%;'>";
			spaces[y][x].ChangeFlag("F");
			break;
		case "F":
			document.getElementById(spaces[y][x].ID).innerHTML = "<p style='color: lightblue; padding: 0; margin: 0;'>?</p>";
			spaces[y][x].ChangeFlag("?");
			break;
		case "?":
			document.getElementById(spaces[y][x].ID).innerHTML = "";
			spaces[y][x].ChangeFlag("");
			break;
		default:
			break;
	}
}

function ChangeValidContents(spaces, x, y, columns, rows, replaceWith) {
	if (x < 0 || y < 0) return;
	if (x >= columns || y >= rows) return;
	spaces[y][x].ChangeContents(replaceWith);
}

function SpaceClick(spaces, x, y, columns, rows) {
	if(firstMove == true) {
		ChangeValidContents(spaces, x, y, columns, rows, " ");
		ChangeValidContents(spaces, x, y-1, columns, rows, " ");
		ChangeValidContents(spaces, x+1, y-1, columns, rows, " ");
		ChangeValidContents(spaces, x+1, y, columns, rows, " ");
		ChangeValidContents(spaces, x+1, y+1, columns, rows, " ");
		ChangeValidContents(spaces, x, y+1, columns, rows, " ");
		ChangeValidContents(spaces, x-1, y+1, columns, rows, " ");
		ChangeValidContents(spaces, x-1, y, columns, rows, " ");
		ChangeValidContents(spaces, x-1, y-1, columns, rows, " ");
		firstMove = false;
		// Fill the board with numbers.
		for (let currentRow = 0; currentRow < rows; currentRow++) {
			for (let currentColumn = 0; currentColumn < columns; currentColumn++) {
				// If the current space is a mine, then there's no need to put on a number.
				if (spacesToReturn[currentRow][currentColumn].Contents == "M") continue;
				// Count the number of mines.
				let numberToDisplay = 0;
				numberToDisplay += Number(IsMine(spacesToReturn, currentColumn, currentRow-1, columns, rows)) || 0;
				numberToDisplay += Number(IsMine(spacesToReturn, currentColumn+1, currentRow-1, columns, rows)) || 0;
				numberToDisplay += Number(IsMine(spacesToReturn, currentColumn+1, currentRow, columns, rows)) || 0;
				numberToDisplay += Number(IsMine(spacesToReturn, currentColumn+1, currentRow+1, columns, rows)) || 0;
				numberToDisplay += Number(IsMine(spacesToReturn, currentColumn, currentRow+1, columns, rows)) || 0;
				numberToDisplay += Number(IsMine(spacesToReturn, currentColumn-1, currentRow+1, columns, rows)) || 0;
				numberToDisplay += Number(IsMine(spacesToReturn, currentColumn-1, currentRow, columns, rows)) || 0;
				numberToDisplay += Number(IsMine(spacesToReturn, currentColumn-1, currentRow-1, columns, rows)) || 0;
				// If there are no mines, then keep the space.
				if (numberToDisplay == 0) continue;
				// If there are mines, then write the number as a string to the space's label.
				else {
					spacesToReturn[currentRow][currentColumn].ChangeContents(String(numberToDisplay));
				}
			}
		}
	}
	
	// Start the recursive flood fill.
	FloodUncover(spaces, x, y, columns, rows);

	for (let currentRow = 0; currentRow < rows; currentRow++) {
		for (let currentColumn = 0; currentColumn < columns; currentColumn++) {
			// If the space hasn't been uncovered and isn't a mine (i.e. board incomplete), return.
			if (spaces[currentRow][currentColumn].Revealed == false && spaces[currentRow][currentColumn].Contents != "M") return;
			// If the space *has* been uncovered and it is a mine (i.e. player lost), return.
			if (spaces[currentRow][currentColumn].Revealed == true && spaces[currentRow][currentColumn].Contents == "M") return;
		}
	}
	document.getElementById("winText").style.display = "block";
	document.getElementById("winText").style.color = "green";
	ShowAll(spaces, columns, rows)
}

function FloodUncover(spaces, x, y, columns, rows) {
	// If it's out of bounds, then return.
	if (x > (rows-1) || y > (columns-1) || x < 0 || y < 0) return;
	// If this space has already been revealed, then there's no need to continue.
	if (spaces[y][x].Revealed == true) return;
	// If the space is a mine, game over.
	if (spaces[y][x].Contents == "M") {
		ShowAll(spaces, columns, rows);
		document.getElementById("loseText").style.display = "block";
		document.getElementById("loseText").style.color = "red";
		return;
	}
	// If this space is a number, then reveal but do not continue revealing.
	if (spaces[y][x].Contents != " ") {
		spaces[y][x].Reveal();
		return;
	}
	spaces[y][x].Reveal();
	// Go clockwise around the current space revealing all adjacent ones.
	FloodUncover(spaces, x, y-1, columns, rows);
	FloodUncover(spaces, x+1, y-1, columns, rows);
	FloodUncover(spaces, x+1, y, columns, rows);
	FloodUncover(spaces, x+1, y+1, columns, rows);
	FloodUncover(spaces, x, y+1, columns, rows);
	FloodUncover(spaces, x-1, y+1, columns, rows);
	FloodUncover(spaces, x-1, y, columns, rows);
	FloodUncover(spaces, x-1, y-1, columns, rows);
}

function ShowAll(spaces, columns, rows) {
	for (let currentRow = 0; currentRow < rows; currentRow++) {
		for (let currentColumn = 0; currentColumn < columns; currentColumn++) {
			spaces[currentRow][currentColumn].Reveal();
		}
	}
}

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

function StartGame(width, height, container) {
	container
	let spaces = InitialiseGrid(width, height);
	AddToGrid(spaces, width, height);
	let spacesRevealed = 0;
	let mines = 0;
	for (let currentRow = 0; currentRow < height; currentRow++) {
		for (let currentColumn = 0; currentColumn < width; currentColumn++) {
			if (spaces[currentRow][currentColumn].Contents == "M") {
				mines++;
			}
		}
	}
	document.getElementById("secretShowAll").addEventListener("click", () => { ShowAll(spaces, width, height); });
	container.style.display = "grid";
}

// A global variable is used here to keep track of whether the current move is the first one to have been made.
var firstMove = true;
