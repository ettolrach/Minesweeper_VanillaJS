import { Choice } from "./choice.js";
import { Grid } from "./grid.js";

function AddToGrid(grid) {
	for (let i = 0; i < grid.Spaces.length; i++) {

		// Create a new space.
		let currentSpaceHTML = document.createElement("div");
		// Make its inner text be nothing for now, this will be changed to either be blank, a number, a flag, a question mark, or a mine later on.
		currentSpaceHTML.innerText = "";
		currentSpaceHTML.id = grid.Spaces[i].ID;
		// Change the style to an unrevealed space. 
		currentSpaceHTML.style.backgroundColor = "#555";
		// Append this space to the container.
		container.appendChild(currentSpaceHTML).className = "spaces";
		
		currentSpaceHTML.addEventListener("click", () => grid.Clicked(i));
		currentSpaceHTML.addEventListener("contextmenu", e => {
			grid.PlaceFlag(i);
			e.preventDefault()
		});
		// Prevent the the context menu from appearing when the background of the grid is clicked.
		document.getElementById("gameContainer").addEventListener("contextmenu", e => {
			e.preventDefault()
		});
	}
}

let choices = []
choices.push(new Choice("beginner", 9, 9));
choices.push(new Choice("intermediate", 16, 16));
choices.push(new Choice("advanced", 22, 22));

const goButton = document.getElementById("go");
const container = document.getElementById("gameContainer");
const retryButton = document.getElementById("retry");
// Change the selected status when the selection is clicked.
for (let i = 0; i < choices.length; i++) {
	choices[i].Element.addEventListener("click", () => {
		// Loop through all elements again and change them to false except for the selected one.
		for (let j = 0; j < choices.length; j++) {
			if (j != i) {
				choices[j].Deselect();
			}
			else {
				choices[i].Select();
			}
		}
	});
}

// Start a game when the go button is clicked.
goButton.addEventListener("click", () => {
	let selectedChoice = choices.find(choice => choice.Selected);
	if (selectedChoice == undefined) {
		document.getElementById("notice").style.display = "block";
		return;
	}

	let grid = new Grid(selectedChoice.Width, selectedChoice.Height);
	AddToGrid(grid);
	document.getElementById("secretShowAll").addEventListener("click", () => {
		grid.ShowAll();
	});
	container.style.display = "grid";
	document.getElementById("selection").style.display = "none";
	document.getElementById("notice").style.display = "none";
});

retryButton.addEventListener("click", () => {
	document.getElementById("retry").style.display = "none";
	document.getElementById("subtitle").innerText = "Implemented using VanillaJS";
	document.getElementById("subtitle").style.color = "white";
	document.getElementById("notice").style.display = "none";
	document.getElementById("selection").style.display = "block";
	container.style.display = "none";
	container.innerHTML = "";
	for (const choice of choices) {
		choice.Deselect();
	}
});

