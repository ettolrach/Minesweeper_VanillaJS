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
	document.getElementById("subtitle").innerText = "You win!";
	document.getElementById("subtitle").style.color = "green";
	document.getElementById("retry").style.display = "block";
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
		document.getElementById("subtitle").innerText = "You lose!";
		document.getElementById("subtitle").style.color = "red";
		document.getElementById("retry").style.display = "block";
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

// A global variable is used here to keep track of whether the current move is the first one to have been made.
var firstMove = true;
