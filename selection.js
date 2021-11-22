class Choice {
	constructor(id, width, height, selected = false) {
		this.ID = id;
		this.Width = width;
		this.Height = height;
		this.Selected = selected;
	}
}

function Retry() {
	document.getElementById("retry").style.display = "none";
	document.getElementById("subtitle").innerText = "Implemented using VanillaJS";
	document.getElementById("subtitle").style.color = "white";
	document.getElementById("notice").style.display = "none";
	document.getElementById("selection").style.display = "block";
	container.style.display = "none";
	for (let i = 0; i < 3; i++) {
		choices[i].Selected = false;
		document.getElementById(choices[i].ID).classList.remove("activated");
	}
}

function InitialiseGame(func) {
	for (let i = 0; i < 3; i++) {
		if (choices[i].Selected == false) continue;
		func(choices[i].Width, choices[i].Height, container);
		finalChoice = i;
		return true;
	}
	return false;
}

let choices = []
let finalChoice = 0;
choices.push(new Choice("beginner", 9, 9));
choices.push(new Choice("intermediate", 16, 16));
choices.push(new Choice("advanced", 22, 22));

const goButton = document.getElementById("go");
const container = document.getElementById("gameContainer");
const retryButton = document.getElementById("retry");
// Change the selected status when the selection is clicked.
for (let i = 0; i < 3; i++) {
	document.getElementById(choices[i].ID).addEventListener("click", () => {
		// Loop through all elements again and change them to false except for the selected one.
		for (let j = 0; j < 3; j++) {
			if (j != i) {
				choices[j].Selected = false;
				// This is for CSS colouring.
				document.getElementById(choices[j].ID).classList.remove("activated");
			}
			else {
				choices[i].Selected = true;
				document.getElementById(choices[i].ID).classList.add("activated");
			}
		}
	});
}

// Start a game when the go button is clicked.
goButton.addEventListener("click", () => {
	started = InitialiseGame(StartGame);

	// If an option is not selected, then display the notice.
	if (!started) {
		document.getElementById("notice").style.display = "block";
	}
	else {
		document.getElementById("selection").style.display = "none";
		document.getElementById("notice").style.display = "none";
	}
});

retryButton.addEventListener("click", () => {
	InitialiseGame(Retry);
});
