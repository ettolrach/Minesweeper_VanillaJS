class Choice {
	constructor(id, width, height, selected = false) {
		this.ID = id;
		this.Width = width;
		this.Height = height;
		this.Selected = selected;
	}
}

let choices = []
choices.push(new Choice("beginner", 9, 9));
choices.push(new Choice("intermediate", 16, 16));
choices.push(new Choice("advanced", 22, 22));

let goButton = document.getElementById("go");
const container = document.getElementById("gameContainer");
// Change the selected status when the selection is clicked.
for (let i = 0; i < 3; i++) {
	document.getElementById(choices[i].ID).addEventListener("click", () => {
		// Loop through all elements again and change them to false except for the selected one.
		for (let j = 0; j < 3; j++) {
			if (j != i) {
				choices[j].Selected = false;
			}
			else {
				choices[i].Selected = true;
			}
		}
	});
}
// Start a game when the go button is clicked.
goButton.addEventListener("click", () => {
	for (let i = 0; i < 3; i++) {
		if (choices[i].Selected == false) continue;
		StartGame(choices[i].Width, choices[i].Height, container);
	}
	document.getElementById("selection").style.display = "none";
});
